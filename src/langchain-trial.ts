import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { config } from 'dotenv';
config({
    path: '.env',
});
const model = new ChatOpenAI({
    openAIApiKey: process.env.OPEN_AI_KEY!,
    temperature: 0.9,
    modelName: "gpt-3.5-turbo"
});
const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings({
    openAIApiKey: process.env.OPEN_AI_KEY!,
}));
const elements = [
    "I am Hrithik",
    "I studied in IIIT",
    "I am a Software engineer?",
    "I can't get many jobs now"
];

async function vectorStoreExample() {
    const docs = elements.map(elem=>new Document({pageContent: elem}));
    //add documents to vector store
    await vectorStore.addDocuments(docs);
    const result = await vectorStore.similaritySearch("who am I", 2);
    const prompt = ChatPromptTemplate.fromMessages(
        ['system',`Use this Context: {context}`,
        "user",`Answer the question: {question}`]
    );
    const chain = prompt.pipe(model);
    const response = await chain.invoke({
        context: result.map(doc=>doc.pageContent),
        question: "who am I?",
    });
    console.log(response.content);
}

vectorStoreExample();