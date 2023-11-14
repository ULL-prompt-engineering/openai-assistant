import { log } from "console"
import * as dotenv from "dotenv"
import OpenAI from "openai"

dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// const assistant = await openai.beta.assistants.create({
//     name: "Economics Tutor",
//     instructions: "You are a personal economics tutor.",
//     tools: [{ type: "code_interpreter" }],
//     model: "gpt-4-1106-preview"
// })


// retrieve existing assistant
const EconomicsTutor = "asst_Hr09oy4vf8pUU1DxCmXzPZmh"
const MathTutor = "asst_0Ybu2XcsPgOxHuuOJGs4D750"
const assistant = await openai.beta.assistants.retrieve(MathTutor)

console.log(assistant)


//Threads 
// const thread = await openai.beta.threads.create();
// console.log(thread)

// // Messages
// const message = await openai.beta.threads.messages.create(
//     thread.id,
//     {
//         role: "user",
//         content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
//     }
// );

// Runs
// const run = await openai.beta.threads.runs.create(
//     thread.id,
//     {
//         assistant_id: assistant.id,
//         instructions: "Please address the user as Jane Doe. The user has a premium account."
//     }
// );

const ThreadRun = "thread_lB3zhYO8KWbWz3SWvTo3PYYg"
const RunId = "run_u1lyZAFpTbWtEetWUQexIGDT"
// const run = await openai.beta.threads.runs.retrieve(ThreadRun, RunId)
// console.log(run)

// const messages = await openai.beta.threads.messages.list(ThreadRun)
// messages.data.forEach(message => {
//     console.log(message.content)
// })
// console.log(messages)

const logs = await openai.beta.threads.runs.list(ThreadRun, RunId)

logs.body.data.forEach(log => {
  console.log(log.step_details)
})