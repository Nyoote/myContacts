import dotenv from "dotenv";
dotenv.config();

process.env.JWT_SECRET_KEY ||= "test-secret-key";
process.env.FRONT_URL ||= "http://localhost:5173";
process.env.PORT ||= "4000";