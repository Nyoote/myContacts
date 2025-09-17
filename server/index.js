import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL, { dbName: "myContacts" });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Error :", error.message);
        process.exit(1);
    }
}

connectDB().catch(console.error);
