import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from './models/userModel.js';

dotenv.config();

async function resetCredits() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");
        
        // Reset all zero credit balances to 50
        const result = await userModel.updateMany({}, { creditBalance: 50 });
        console.log(`Updated ${result.modifiedCount} users to 50 credits!`);
        
    } catch (e) {
        console.log("Error:", e);
    } finally {
        mongoose.disconnect();
    }
}

resetCredits();
