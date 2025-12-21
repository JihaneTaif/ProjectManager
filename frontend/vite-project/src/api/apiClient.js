import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  // ❌ REMOVE THIS
  // withCredentials: true,
});

// Attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const isAuthRequest = config.url.includes("/auth/");

  console.log(`[Axios Request] ${config.method.toUpperCase()} ${config.url}`);

  if (token && token !== "undefined" && token !== "null") {
    console.log(`[Axios Request] Token found in localStorage (starts with ${token.substring(0, 10)}...)`);
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    if (!isAuthRequest) {
      console.warn(`[Axios Request] No valid token found for non-auth request to ${config.url}`);
    }
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Received 401 Unauthorized - Logging out user.", error.response.data);
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
