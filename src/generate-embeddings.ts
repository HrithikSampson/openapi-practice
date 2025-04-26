import OpenAI from "openai";
import { config } from 'dotenv';
import { readFileSync, writeFileSync } from "fs";

config({
    path: '.env',
});

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

export async function generateEmbeddings(text: string | string[]) {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });
        console.log("Embeddings response:", response.data[0].embedding);
        return response.data;
    } catch (error) {
        console.error("Error generating embeddings:", error);
        throw error;
    }
}

function loadData<T>(filePath: string): Promise<T[]> {
    const data = readFileSync(filePath);
    const jsonData = JSON.parse(data.toString());
    return jsonData;
}

function saveData<T>(filePath: string, data: T[]): void {
    const jsonData = JSON.stringify(data, null, 2);
    writeFileSync(filePath, jsonData);
    console.log(`Data saved to ${filePath}`);
}
interface EmbeddingResponse {
    data: string;
    embedding: number[];
}
export async function main() : Promise<EmbeddingResponse[]> {
    const data = await loadData<string>("input/input-data.json");
    console.log("Loaded data:", data);
    const embeddings = await generateEmbeddings(data);
    const outputData = data.map((item: string, index: number) => ({
        data: item,
        embedding: embeddings[index].embedding,
    }));
    saveData("data_with_embeddings.json", outputData);
    return outputData;
}
main();