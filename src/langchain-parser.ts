import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { config } from 'dotenv';
import { StringOutputParser, CommaSeparatedListOutputParser } from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

config({
    path: '.env',
});

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPEN_AI_KEY,
    temperature: 0.9,
    modelName: "gpt-3.5-turbo"
});

async function stringParser() {
    const prompt = ChatPromptTemplate.fromTemplate("Write a short description of the following product: {product}?");
    const parser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(parser);
    const response = await chain.invoke({
        product: "A new iPhone",
    });
    console.log(response);// no content needed

}
async function commaParser() {
    const prompt = ChatPromptTemplate.fromTemplate("Write indegrients for {food}?");
    const parser = new CommaSeparatedListOutputParser();
    const chain = prompt.pipe(model).pipe(parser);
    const response = await chain.invoke({
        food: "ice cream",
    });
    console.log(response);// no content needed

}

async function structuredParser() {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Format Instruction: {format}
        Write indegrients for {food}?`
    );
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        food: "food name",
        indegrients: "list of indegrients",
    });
    const chain = prompt.pipe(model).pipe(parser);
    const response = await chain.invoke({
        format: parser.getFormatInstructions(),
        food: "ice cream",
    });
    console.log(response);// no content needed
}
// stringParser();
// commaParser();
structuredParser();