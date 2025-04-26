import { createReadStream } from "fs";
import OpenAI from "openai";
import { config } from 'dotenv';
config({
    path: '.env',
});

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

async function speechTranslate(filename: string) {
    try {
        const response = await openai.audio.translations.create({
            file: createReadStream(filename),
            model: "whisper-1",
            response_format: "text",
        });
        console.log("Speech Translate response:", response);
    } catch (error) {
        console.error("Error converting text to speech:", error);
        throw error;
    }
}

speechTranslate("FrenchSample.mp3");

