import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
    const state = localStorage.getItem('redux-app-state');
    if (state) {
        try {
            const parsed = JSON.parse(state);
            const token = parsed?.auth?.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch {
            // ignore parse errors
        }
    }
    return config;
});

export default api;
