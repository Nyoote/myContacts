import express from "express";
import User from "../models/userSchema.js";

const app = express();

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "Error, cannot find users" });
    }
})

export default app;