import mongoose from 'mongoose';
import 'dotenv/config';

async function checkUser() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne({});
    console.log("Sample user:", user);
    process.exit(0);
}

checkUser();
