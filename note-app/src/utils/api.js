import axios from "axios";
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI

const api = axios.create({
    baseURL: BACKEND_URI,
    withCredentials: true,
});

export default api;