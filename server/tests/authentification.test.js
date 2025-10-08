import request from "supertest";
import app from "../app.js";
import User from "../models/user.model.js";
import {describe, test} from "@jest/globals";

describe("Authentication", () => {
    test("register → 201 et l'utilisateur est créé (mdp hashé)", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ username: "john", email: "john@test.com", password: "Strong#123" })
            .expect(201);

        expect(res.body).toHaveProperty("message", "User created successfully");
        const user = await User.findOne({ email: "john@test.com" });
        expect(user).not.toBeNull();
        expect(user.username).toBe("john");
        expect(user.password).not.toBe("Strong#123"); // hashé
    });

    test("register avec email en double → 409 (field=email)", async () => {
        await request(app).post("/auth/register")
            .send({ username: "j1", email: "dup@test.com", password: "Strong#123" })
            .expect(201);

        const res = await request(app).post("/auth/register")
            .send({ username: "j2", email: "dup@test.com", password: "Strong#123" })
            .expect(409);

        expect(res.body).toMatchObject({ field: "email", error: expect.any(String) });
    });

    test("register avec username en double → 409 (field=username)", async () => {
        await request(app).post("/auth/register")
            .send({ username: "same", email: "u1@test.com", password: "Strong#123" })
            .expect(201);

        const res = await request(app).post("/auth/register")
            .send({ username: "same", email: "u2@test.com", password: "Strong#123" })
            .expect(409);

        expect(res.body).toMatchObject({ field: "username", error: expect.any(String) });
    });

    test("login OK → 200 + token", async () => {
        await request(app).post("/auth/register")
            .send({ username: "mary", email: "mary@test.com", password: "Strong#123" })
            .expect(201);

        const res = await request(app).post("/auth/login")
            .send({ email: "mary@test.com", password: "Strong#123" })
            .expect(200);

        expect(res.body).toHaveProperty("message", "Login successful");
        expect(typeof res.body.token).toBe("string");
    });

    test("login mauvais mdp → 401", async () => {
        await request(app).post("/auth/register")
            .send({ username: "kate", email: "kate@test.com", password: "Strong#123" })
            .expect(201);

        await request(app).post("/auth/login")
            .send({ email: "kate@test.com", password: "BadPass" })
            .expect(401);
    });
});
