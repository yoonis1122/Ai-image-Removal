import fs from 'fs';
import path from 'path';
import { removeBackground } from "@imgly/background-removal-node";

async function runTest() {
    try {
        console.log("Starting script...");
        const imagePath = path.resolve('../client/src/assets/image_w_bg.png');
        const imageBuffer = fs.readFileSync(imagePath);
        const inputBlob = new Blob([imageBuffer], { type: 'image/png' });
        console.log("Calling removeBackground with SMALL");
        
        const startTime = Date.now();
        const blob = await removeBackground(inputBlob, { debug: true, model: 'small' });
        const endTime = Date.now();
        console.log(`Success in ${(endTime - startTime)/1000}s! Blob size:`, blob.size);
    } catch (err) {
        console.error("Caught error:", err);
    }
}

runTest();
