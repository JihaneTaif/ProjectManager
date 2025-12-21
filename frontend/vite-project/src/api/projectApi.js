import apiClient from "./apiClient";

export const getProjects = () => apiClient.get("/projects");

export const createProject = (data) => apiClient.post("/projects", data);

export const deleteProject = (projectId) => apiClient.delete(`/projects/${projectId}`);
