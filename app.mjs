import * as dotenv from "dotenv"
import OpenAI from "openai"

dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

openai.beta.assistants.create({
    name: "Economics Tutor",
    instructions: "You are a personal economics tutor.",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4-1106-preview"
})