import axios from "axios";

const getAuthToken = () => localStorage.getItem("accessToken");

export default (url = import.meta.env.VITE_API_URL) => {
    const api = axios.create({
        baseURL: url,
        withCredentials: true,
    });

    api.interceptors.request.use(config => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => Promise.reject(error));

    return api;
};
