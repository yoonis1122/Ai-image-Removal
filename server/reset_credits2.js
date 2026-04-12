import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from './models/userModel.js';

dotenv.config();

async function resetCredits() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/bg-remaval`);
        console.log("Connected to MongoDB -> bg-remaval");
        
        // Let's just directly award them 1000 credits without wiping their DB !
        const result = await userModel.updateMany({}, { creditBalance: 1000 });
        console.log(`Successfully added 1000 credits to ${result.modifiedCount} users!`);
        
    } catch (e) {
        console.log("Error:", e);
    } finally {
        mongoose.disconnect();
    }
}

resetCredits();
