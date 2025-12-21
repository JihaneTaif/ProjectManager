import apiClient from "./apiClient";

export const login = (credentials) => apiClient.post("/auth/login", credentials);
