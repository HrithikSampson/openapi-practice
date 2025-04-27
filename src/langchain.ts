
import { ChatOpenAI } from "@langchain/openai";
import { config } from 'dotenv';
config({
    path: '.env',
})
const model = new ChatOpenAI({
    openAIApiKey: process.env.OPEN_AI_KEY,
    temperature: 0.9,
    modelName: "gpt-3.5-turbo",
    maxTokens: 1000,
    verbose: false,
});


async function run() {
    const response = await model.invoke("Give me 4 good books")
    console.log(response.content);
}

async function runBatch() {
    const response = await model.batch([
        "Give me 4 good books",
        "Hello, how are you?",
    ]);
    console.log(response.map((r) => r.content));
}

async function runStream() {
    const response = await model.stream("Give me 4 good books");
    for await (const chunk of response) {
        console.log(chunk.content);
    }
}
runStream();
// runBatch();
// run();
/* [Hugging Face, OpenAI]
        ^                                                        _____>{AWS,Google,Wikipedia}
        |                                                        |
        |____________Models__________>[Langchain]________________| 
                                      /         \
                                     /           \
                                    /             \
                                   /               \
                              Vector DB        File Data Sources
                                 /                   \
                                /                     \
                               /                       \
                              /                         \
                        {Chroma, Pinecone, Redis}        {PDF, CSV, Text}
*/




/* [Langchain]
                    
                              0
                            / | \
                           /  |  \
                          /   |   \
                         /    |    \
                        /     |     \
                       /      V      \
        Decision Making     LLM      Decision Making
                     /        |          \
                    /         |           \
                   /          |            \
                  /           |             \
            Web(Google,      / \             \
            wiki,           /   \             \
            sport site))   /     \             \
            \             /       \             \
             \           /         \      Private Resource
              \         /           \        /
               \       /             \      /
                \     /               \    /
                 \   /                 \  /
                  \ /                   \/
                  Unstructured         Unstructured
                  answer                answer
*/

