import axios from "axios";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("boastlib_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("boastlib_token");
      localStorage.removeItem("boastlib_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
