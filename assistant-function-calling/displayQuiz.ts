import { askRLineQuestion } from './askRLineQuestion';

async function displayQuiz(title: string, questions: Record<string, string>[]) {
    console.log("Quiz :\n", title);
    const responses: string[] = [];

    for (const question of questions) {
        let response = "";

        // if multiple choice, print options
        if (question["question_type"] === "MULTIPLE_CHOICE") {
            const rLineQn = `Question: ${question["question_text"]}\n
      Options: ${question["choices"]}\n
      `;

            response = await askRLineQuestion(rLineQn);

        } else if (question["question_type"] === "FREE_RESPONSE") {
            const rLineQn = `Question: ${question["question_text"]}\n
      `;

            response = await askRLineQuestion(rLineQn);
        }

        responses.push(response);
    }
    console.log("Your responses from the quiz :\n", responses);
    return responses;
}

const quizJson = {
    name: "displayQuiz",
    description:
        "Displays a quiz to the student, and returns the student's response. A single quiz can have multiple questions.",
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

export { displayQuiz, quizJson }