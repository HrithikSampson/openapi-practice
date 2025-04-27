import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { config } from 'dotenv';
import { deepStrictEqual } from "assert";
config({
    path: '.env',
})
const model = new ChatOpenAI({
    openAIApiKey: process.env.OPEN_AI_KEY,
    temperature: 0.9,
    modelName: "gpt-3.5-turbo"
});
async function fromTemplate() {
    const chatPrompt = ChatPromptTemplate.fromTemplate(
        "Write a short description of the following product: {product}?"
    );
    const wholePrompt = await chatPrompt.format({
        product: "A new iPhone"
    });
    const chain = chatPrompt.pipe(model)
    const response = await chain.invoke({
        product: "A new iPhone",
    })
    console.log(response.content);
}

// fromTemplate();
async function fromMessage() {
    const prompt = await ChatPromptTemplate.fromMessages([
        ['system', 'Write a short description for the product provided by the user'],
        ['human', '{product}'],
    ]);
    const chain = prompt.pipe(model)
    const response = await chain.invoke({
        product: "A new iPhone",
    })
    console.log(response.content);
}
fromMessage();