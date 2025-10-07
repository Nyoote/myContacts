import { api } from "./client";

export async function fetchContacts() {
    const { data } = await api.get("/api/getContacts");
    return data;
}
export async function createContact(payload) {
    const {data} = await api.post("/api/addContact", payload);
    return data;
}
