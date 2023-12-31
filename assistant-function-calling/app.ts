import util from 'util';
const inspect = (obj: any) => util.inspect(obj, { depth: null });

import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

// const OpenAI = require('openai');
import { OpenAI } from 'openai';

// Create a OpenAI connection
const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
    apiKey: secretKey,
});

import { readline, askRLineQuestion } from './askRLineQuestion';

// initial reference for implementation (in Python)
// https://github.com/openai/openai-cookbook/blob/main/examples/Assistants_API_overview_python.ipynb

import { displayQuiz, quizJson } from './displayQuiz';

let isQuizAnswered = false;

async function main() {
    try {
        const assistant = await openai.beta.assistants.create({
            name: "Math Tutor with functions and retrieval",
            instructions:
                "You are a personal math tutor. Answer questions briefly, in a sentence or less.",
            tools: [
                //{ type: "code_interpreter" },
                //{ type: "retrieval" },
                {
                    type: "function",
                    function: quizJson,
                },
            ],
            model: "gpt-4-1106-preview", // model: "gpt-3.5-turbo-1106",
        });
        console.error(`assistant: ${inspect(assistant)}`)

        // Log the first greeting
        console.log(
            "\nHello there, I'm a Math assistant. We'll start with a small quiz.\n",
        );

        // Create a thread
        const thread = await openai.beta.threads.create();
        console.error(`thread: ${inspect(thread)}`)

        // Use keepAsking as state for keep asking questions
        let keepAsking = true;

        while (keepAsking) {
            const userQuestion = isQuizAnswered
                ? await askRLineQuestion("You next question to the model: \n")
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
                thread.id, run.id,
            );
            console.error(`actualRun: ${inspect(actualRun)}`)

            // Polling mechanism to see if actualRun is completed
            // This should be made more robust.
            while (
                actualRun.status === "queued" ||
                actualRun.status === "in_progress" ||
                actualRun.status === "requires_action"
            ) {
                console.error(`Run status: ${actualRun.status}`)
                // requires_action means that the assistant is waiting for the functions to be added
                if (actualRun.status === "requires_action") {
                    // extra single tool call
                    const toolCall =
                        actualRun.required_action?.submit_tool_outputs?.tool_calls[0];

                    const name = toolCall?.function.name;
                    console.error(`Tool function name asked: ${name}`);

                    const args = JSON.parse(toolCall?.function?.arguments || "{}");
                    const questions = args.questions;

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
                await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
                actualRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            }

            // Get the last assistant message from the messages array
            const messages = await openai.beta.threads.messages.list(thread.id);
            console.error(`messages: ${inspect(messages)}`)

            // Find the last message for the current run
            const lastMessageForRun = messages.data
                .filter(
                    (message) =>
                        message.run_id === run.id && message.role === "assistant",
                )
                .pop();

            // If an assistant message is found, console.log() it
            if (lastMessageForRun) {
                // aparently this is not correctly typed
                // content returns an of objects do contain a text object
                const messageValue = lastMessageForRun.content[0] as {
                    text: { value: string };
                };

                console.log(`${messageValue?.text?.value} \n`);
            }

            // Then ask if the user wants to ask another question and update keepAsking state
            const continueAsking = await askRLineQuestion(
                "Do you want to keep having a conversation? (yes/no) ",
            );

            keepAsking = continueAsking.toLowerCase() === "yes";

        }
        console.log("Alrighty then, I hope you learned something!\n");

        // close the readline
        readline.close();
        
        // Delete the assistant and thread
        openai.beta.threads.del(thread.id);
        openai.beta.assistants.del(assistant.id);
    } catch (error) {
        console.error(error);
    }
}

// Call the main function
main();
