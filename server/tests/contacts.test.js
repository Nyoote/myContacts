import request from "supertest";
import app from "../app.js";
import { registerAndLogin } from "./testUtils.js";
import {describe, expect, test} from "@jest/globals";

describe("Contacts (protégé par requireAuth)", () => {
    test("GET /api/getContacts sans token → 401", async () => {
        const res = await request(app).get("/api/getContacts").expect(401);
        expect(res.body.message).toMatch(/Unauthorized/i);
    });

    test("CRUD complet avec token", async () => {
        const token = await registerAndLogin();
        const auth = (req) => req.set("Authorization", `Bearer ${token}`);

        // 1) liste vide
        const list0 = await auth(request(app).get("/api/getContacts")).expect(200);
        expect(Array.isArray(list0.body)).toBe(true);
        expect(list0.body).toHaveLength(0);

        // 2) création
        await auth(request(app).post("/api/addContact"))
            .send({ firstName: "Alice", lastName: "Martin", phone: "0612345678" })
            .expect(201);

        // 3) list = 1
        const list1 = await auth(request(app).get("/api/getContacts")).expect(200);
        expect(list1.body).toHaveLength(1);
        const [contact] = list1.body;
        expect(contact.firstName).toBe("Alice");

        // 4) doublon téléphone (même user) → 409
        const dup = await auth(request(app).post("/api/addContact"))
            .send({ firstName: "Alicia", lastName: "Dup", phone: "0612345678" })
            .expect(409);
        expect(dup.body).toMatchObject({ field: "phone" });

        // 5) update (changer phone)
        const id = contact._id;
        await auth(request(app).patch(`/api/updateContact/${id}`))
            .send({ phone: "0711111111" })
            .expect(200);

        // 6) create un autre contact puis tenter update vers phone déjà pris → 409
        await auth(request(app).post("/api/addContact"))
            .send({ firstName: "Bob", lastName: "Durand", phone: "0622222222" })
            .expect(201);

        await auth(request(app).patch(`/api/updateContact/${id}`))
            .send({ phone: "0622222222" })
            .expect(409);

        // 7) delete OK
        await auth(request(app).delete(`/api/deleteContact/${id}`)).expect(200);

        // 8) delete inexistant → 404
        await auth(request(app).delete(`/api/deleteContact/${id}`)).expect(404);
    });
});
