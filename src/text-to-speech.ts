import { createReadStream, writeFileSync } from "fs";
import OpenAI from "openai";
import { config } from 'dotenv';
config({
    path: '.env',
});

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

async function text_to_speech() {
    try {
        const response = await openai.audio.speech.create({
            input: "How to create a text to speech model",
            model: "tts-1",
            response_format: "mp3",
            voice: "alloy",
        });
        const arrayBuffer = await response.arrayBuffer()
        writeFileSync("output.mp3",Buffer.from(arrayBuffer))
    } catch (error) {
        console.error("Error converting text to speech:", error);
        throw error;
    }
}
text_to_speech();
