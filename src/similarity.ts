import { generateEmbeddings, main } from "./generate-embeddings.js";

function dotProduct(a: number[], b: number[]): number {
    return a.map((val, i) => val * b[i]).reduce((acc, val) => acc + val, 0);
}
function cosineSimilarity(a: number[], b: number[]): number {
    /* for almost similar the cosine simlarity is very near to one can be litlle more than one */
    const dot = dotProduct(a, b);
    const normA = Math.sqrt(a.map((val) => val * val).reduce((acc, val) => acc + val, 0));
    const normB = Math.sqrt(a.map((val) => val * val).reduce((acc, val) => acc + val, 0));
    return dot / (normA * normB);
}
async function findSimilar(input: string): Promise<{ data: string; similarity: number }[]> {
    const inputEmbedding = await generateEmbeddings(input);
    const otherEmbedding = await main();
    const similarities = otherEmbedding.map((item) => ({
        data: item.data,
        similarity: cosineSimilarity(inputEmbedding[0].embedding, item.embedding),
    }));
    return similarities.sort((a, b) => b.similarity - a.similarity);;
}

findSimilar("animal").then((similarities) => {
    console.log("Similarities:", similarities);
})