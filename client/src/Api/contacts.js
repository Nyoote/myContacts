import { api } from "./client";

export async function fetchContacts() {
    const { data } = await api.get("/api/getContacts");
    return data;
}
export async function createContact(payload) {
    const {data} = await api.post("/api/addContact", payload);
    return data;
}
export async function updateContact(id, payload) {
    const { data } = await api.patch(`/api/updateContact/${id}`, payload);
    return data;
}
export async function deleteContact(id) {
    const { data } = await api.delete(`/api/deleteContact/${id}`);
    return data;
}
