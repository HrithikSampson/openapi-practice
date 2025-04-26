import { createReadStream } from "fs";
import OpenAI from "openai";
import { config } from 'dotenv';
config({
    path: '.env',
});

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

async function speech(filename: string) {
    try {
        const response = await openai.audio.transcriptions.create({
            file: createReadStream(filename),
            model: "whisper-1",
            response_format: "text",
            language: "en",
        });
        console.log("Text to speech response:", response);
    } catch (error) {
        console.error("Error converting text to speech:", error);
        throw error;
    }
}

speech("AudioSample.m4a");