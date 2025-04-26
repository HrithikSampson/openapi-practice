import OpenAI, { toFile } from "openai";
import { config } from 'dotenv';
import { createReadStream, write, writeFileSync } from "fs";
import { create } from "domain";
config({
  path: '.env'
});

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});
async function createVariationImage(image: string) {
    try {
        const response = await openai.images.createVariation({
            image: createReadStream(image),
            model: "dall-e-2",
            n: 1,
            size: "256x256",
            response_format: "b64_json",
        });

        console.log("Image edit response:", response);
        if(!response.data) {
            throw new Error("No image data returned");
        }
        const rawImage = response.data[0].b64_json;
        if(!rawImage) {
            throw new Error("No image data returned");
        }
        writeFileSync("edited_image.png", Buffer.from(rawImage, "base64"));
    } catch (error) {
        console.error("Error editing image:", error);
        throw error;
    }
}

async function editImage(image: string, maskImage?: string) {
    try {
        
        const response = await openai.images.edit({
            image: createReadStream(image),
            mask: maskImage ? createReadStream(maskImage) : undefined,
            prompt: "Have a nuclear powered 6.5 generation fighter jet",
            model: "dall-e-2",
            size: "256x256",
            n: 1,
            response_format: "b64_json",
        });

        console.log("Image edit response:", response);
        if(!response.data) {
            throw new Error("No image data returned");
        }
        const rawImage = response.data[0].b64_json;
        if(!rawImage) {
            throw new Error("No image data returned");
        }
        writeFileSync("edited_image_with_mask.png", Buffer.from(rawImage, "base64"));
    } catch (error) {
        console.error("Error editing image:", error);
        throw error;
    }
}

//createVariationImage("image.png")
editImage("image.png", "mask.png")