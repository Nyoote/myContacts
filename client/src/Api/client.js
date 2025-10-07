import axios from "axios";


console.log(import.meta.env.VITE_API_PORT)
export const api = axios.create({
    baseURL: `http://localhost:${import.meta.env.VITE_API_PORT}`,
    withCredentials: false,
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);