import express from "express";
import bcrypt from "bcrypt";
import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";

const app = express();

app.post('/register', async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User ({username, email, password: hashedPassword})
        await newUser.save();


        res.status(201).json({message: "User created successfully"})
    }catch (error) {
        res.status(400).json({message: error.message})
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default app;


