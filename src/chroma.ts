import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import OpenAI from "openai";
import { config } from 'dotenv';
config({
    path: '.env',
});
const client  = new ChromaClient({
    path: "http://localhost:8000",
});

const embeddingFunction = new OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPEN_AI_KEY,
    openai_model: "text-embedding-3-small",
})

async function main() {
    try {
        await client.createCollection({
            name: "data_test2",
        });
        console.log("Collection created successfully.");
    } catch (error) {
        console.error("Error creating collection:", error);
    }
}

async function addData() { 
    // const collection  = await client.getCollection({
    //     name: 'data_test',
    // })
    // const result = await collection.add({
    //     ids: ['id1'],
    //     documents: ['This is a test document'],// string whose embedding we are storing
    //     embeddings: [[0.1, 0.2, 0.3]], //embedding is required if you are not using the embedding function while getting the collection
    // })
    const collection  = await client.getCollection({
        name: 'data_test2',
        embeddingFunction
    })
    const result = await collection.add({
        ids: ['id1'],
        documents: ['This is a test document'],// string whose embedding we are storing
    })
}
const studentInfo = `Alexandra Thompson, a 19-year-old computer science sophomore with a 3.7 GPA,
is a member of the programming and chess clubs who enjoys pizza, swimming, and hiking
in her free time in hopes of working at a tech company after graduating from the University of Washington.`;

const clubInfo = `The university chess club provides an outlet for students to come together and enjoy playing
the classic strategy game of chess. Members of all skill levels are welcome, from beginners learning
the rules to experienced tournament players. The club typically meets a few times per week to play casual games,
participate in tournaments, analyze famous chess matches, and improve members' skills.`;

const universityInfo = `The University of Washington, founded in 1861 in Seattle, is a public research university
with over 45,000 students across three campuses in Seattle, Tacoma, and Bothell.
As the flagship institution of the six public universities in Washington state,
UW encompasses over 500 buildings and 20 million square feet of space,
including one of the largest library systems in the world.`;

async function askQuestion() {
    const question = "What Alexandra Thompson likes to do in her free time?";
    // try {
    //     await client.createCollection({
    //         name: "data_test5",
    //     });
    //     console.log("Collection created successfully.");
    // } catch (error) {
    //     console.error("Error creating collection:", error);
    // }
    const collection  = await client.getCollection({
        name: 'data_test5',
        embeddingFunction
    });
    await collection.add({
        ids: ['id2','id3','id4'],
        documents: [studentInfo,clubInfo,universityInfo],// string whose embedding we are storing
    })
    const result = await collection.query({
        queryTexts: question, // embedding of the question
        nResults: 1,
    });
    const relevantInfo = result.documents[0][0];
    console.log("Relevant information:", relevantInfo);
    if(relevantInfo) { 
        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_KEY,
        });
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "assistant", content: `Based on the following information, Information: ${relevantInfo}`},
                { role: "user", content: `Answer the following question: ${question}` }
            ],
        });
        console.log("ChatGPT response:", response.choices[0].message.content);
    }
}
// main()
// addData()
askQuestion()