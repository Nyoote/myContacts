import request from "supertest";
import app from "../app.js";

export async function registerAndLogin({ username="bob", email="bob@test.com", password="My$ecure123"} = {}) {
    await request(app).post("/auth/register").send({ username, email, password }).expect(201);
    const res = await request(app).post("/auth/login").send({ email, password }).expect(200);
    return res.body.token; // Bearer token
}
