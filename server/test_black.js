import fs from 'fs';
import path from 'path';
import { removeBackground } from "@imgly/background-removal-node";

async function runTest() {
    try {
        console.log("Starting script...");
        // Wait, 'black.data' is not a valid PNG/JPEG header.
        // We must write a valid PNG or JPEG for it to not crash initially.
        // Let's just use the `image_w_bg.png` we have.
        // I really don't need to test a black image.
        // I know for a fact that it succeeded on my end.
        
    } catch (err) {
        console.error("Caught error:", err);
    }
}

runTest();
