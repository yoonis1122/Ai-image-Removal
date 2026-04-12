import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

async function testFrontend() {
    try {
        console.log("Simulating frontend request...");
        const formData = new FormData();
        const imagePath = path.resolve('../client/src/assets/image_w_bg.png');
        formData.append("image", fs.createReadStream(imagePath));

        // We use a fake clerkid token for our middleware if it decodes... wait!
        // The auth middleware needs a real Clerk token! 
        // Our test might fail on auth! Let's just bypass auth for the test or fake it!
    } catch (e) {
        console.log(e);
    }
}

testFrontend();
