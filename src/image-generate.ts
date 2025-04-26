import OpenAI from "openai";
import { config } from 'dotenv';
import { writeFile, writeFileSync } from "fs";
config({
  path: '.env'
});

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});
async function generateImage(prompt: string) {
    try {
        const response = await openai.images.generate({
            prompt: prompt,
            model: "dall-e-2",
            n: 1,
            size: "256x256",
        });
        console.log("Image generation response:", response);
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
}

async function generateImageB64(prompt: string) {
    try {
        const response = await openai.images.generate({
            prompt: prompt,
            model: "dall-e-2",
            n: 1,
            size: "256x256",
            response_format: "b64_json",
        });
        if(!response.data || response.data.length === 0) {
            throw new Error("No image data returned");
        }
        const rawImage = response.data[0].b64_json;
        if(rawImage) {
            writeFileSync("image.png", Buffer.from(rawImage, "base64"))
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
}
//generateImage("A futuristic city skyline at sunset, with flying cars and neon lights.")
generateImageB64("A futuristic city skyline at sunset, with flying cars and neon lights.")