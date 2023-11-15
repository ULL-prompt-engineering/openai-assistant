// https://dev.to/esponges/build-the-new-openai-assistant-with-function-calling-52f5 by Fernando González Tostado
require('dotenv').config("../.env");
const OpenAI = require('openai');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Create a OpenAI connection
const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
    apiKey: secretKey,
});

async function askRLineQuestion(question: string): Promise<string> {
    return new Promise<string>((resolve, _reject) => {
        readline.question(question, (answer: string) => {
            resolve(`${answer}\n`);
        });
    });
}

async function displayQuiz(name: string, questions: any[]) {
    // This function will take the name of the quiz and the questions and it will display them to the user. 
    // It will then wait for the user to answer the questions 
    // and then it will return the responses.
    console.log(`\n${name}\n`);

    const responses: any = {};

    for (const question of questions) {
        const questionText = question.question_text;
        const questionType = question.question_type;
        const choices = question.choices;

        console.log(`\n${questionText}\n`);

        if (questionType === "MULTIPLE_CHOICE") {
            console.log(`\n${choices.join("\n")}\n`);
        }

        const response = await askRLineQuestion("Your response: \n");

        responses[questionText] = response;
    }
}

const quizJson = {
    name: "display_quiz",
    description:
        "Displays a quiz to the student, and returns the student's response. " +
        "A single quiz can have multiple questions.",
    parameters: {
        type: "object",
        properties: {
            title: { type: "string" },
            questions: {
                type: "array",
                description:
                    "An array of questions, each with a title and potentially options (if multiple choice).",
                items: {
                    type: "object",
                    properties: {
                        question_text: { type: "string" },
                        question_type: {
                            type: "string",
                            enum: ["MULTIPLE_CHOICE", "FREE_RESPONSE"],
                        },
                        choices: { type: "array", items: { type: "string" } },
                    },
                    required: ["question_text"],
                },
            },
        },
        required: ["title", "questions"],
    },
};


async function main() {
    try {
        const assistant = await openai.beta.assistants.create({
            name: "Math Tutor",
            instructions:
                "You are a personal math tutor. Answer questions briefly, in a sentence or less.",
            tools: [
                { type: "code_interpreter" },
                {
                    type: "function",
                    function: quizJson, // The JSON object describing the function API
                },
            ],
            // will work much better with the new model
            model: "gpt-4-1106-preview",
            // model: "gpt-3.5-turbo-1106",
        });

        // Log a first greeting
        console.log(
            "\nHello there, I'm Casiano's personal Math assistant. We'll start with a small quiz.\n",
        );

        // Create a thread
        const thread = await openai.beta.threads.create();

        // Use continueConversation as state for keep asking questions
        let continueConversation = true;
        let isQuizAnswered = false;

        while (continueConversation) {
            const userQuestion = isQuizAnswered ?
                await askRLineQuestion("You next question to the model: \n")
                // this will make the model  build a quiz using our provided function
                : "Make a quiz with 2 questions: One open ended, one multiple choice" +
                "Then, give me feedback for the responses.";

            // Pass in the user question into the existing thread
            await openai.beta.threads.messages.create(thread.id, {
                role: "user",
                content: userQuestion,
            });

            // Use runs to wait for the assistant response and then retrieve it
            const run = await openai.beta.threads.runs.create(thread.id, {
                assistant_id: assistant.id,
            });

            let actualRun = await openai.beta.threads.runs.retrieve(
                thread.id,
                run.id,
            );

            // Polling mechanism to see if actualRun is completed
            while (
                actualRun.status === "queued" ||
                actualRun.status === "in_progress" ||
                actualRun.status === "requires_action"
            ) {
                // requires_action means that the assistant is waiting for the functions to be added

                if (actualRun.status === "requires_action") {
                    // extra single tool call
                    const toolCall =
                        actualRun.required_action?.submit_tool_outputs?.tool_calls[0];

                    const name = toolCall?.function.name;

                    const args = JSON.parse(toolCall?.function?.arguments || "{}");
                    const questions = args.questions;

                    console.log(`\n${name}\n`);
                    console.log(`\n${JSON.stringify(questions, null, 2)}\n`);


                    const responses = await displayQuiz(name || "cool quiz", questions);

                    // toggle flag that sets initial quiz
                    isQuizAnswered = true;

                    // we must submit the tool outputs to the run to continue
                    await openai.beta.threads.runs.submitToolOutputs(
                        thread.id,
                        run.id,
                        {
                            tool_outputs: [
                                {
                                    tool_call_id: toolCall?.id,
                                    output: JSON.stringify(responses),
                                },
                            ],
                        },
                    );
                }
                // keep polling until the run is completed
                await new Promise((resolve) => setTimeout(resolve, 2000));
                actualRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            }

            // Get the last assistant message from the messages array
            const messages = await openai.beta.threads.messages.list(thread.id);

            // Find the last message for the current run
            const lastMessageForRun = messages.data
                .filter(
                    (message) =>
                        message.run_id === run.id && message.role === "assistant",
                )
                .pop();

            // If an assistant message is found, console.log() it
            if (lastMessageForRun) {
                // aparently the `content` array is not correctly typed
                // content returns an of objects do contain a text object
                const messageValue = lastMessageForRun.content[0] as {
                    text: { value: string };
                };

                console.log(`${messageValue?.text?.value} \n`);
            }

            // Then ask if the user wants to ask another question and update continueConversation state
            const continueAsking = await askRLineQuestion(
                "Do you want to keep having a conversation? (yes/no) ",
            );

            continueConversation = continueAsking.toLowerCase().includes("yes");
        }
        
        console.log("Alrighty then, I hope you learned something!\n");
        // close the readline
        readline.close();
    } catch (error) {
        console.error(error);
    }
}