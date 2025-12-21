import apiClient from "./apiClient";

export const getProjects = () => apiClient.get("/projects");

export const createProject = (data) => apiClient.post("/projects", data);

export const updateProject = (projectId, data) => apiClient.put(`/projects/${projectId}`, data);

export const deleteProject = (projectId) => apiClient.delete(`/projects/${projectId}`);
