import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import auth from "./routes/authentification.routes.js";
import user from "./routes/user.routes.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json())

app.use("/auth", auth);
app.use("/api", user);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.DB_NAME,
        });
        console.log("MongoDB connected");

        app.listen(process.env.PORT, () => {
            console.log(`Server running at http://localhost:${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

startServer().catch(console.error);
