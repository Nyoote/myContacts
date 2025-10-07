import { api } from "./client";

export async function fetchContacts() {
    const { data } = await api.get("/api/getContacts");
    return data;
}
