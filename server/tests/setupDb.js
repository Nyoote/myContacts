import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import {afterAll, afterEach, beforeAll} from "@jest/globals";

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri(), { dbName: "mycontacts_test" });
});

afterEach(async () => {
    const { collections } = mongoose.connection;
    for (const name of Object.keys(collections)) {
        await collections[name].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
});
