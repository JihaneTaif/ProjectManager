import apiClient from "./apiClient";

export const getTasksByProject = (projectId, filters = {}) => {
  const params = new URLSearchParams({ projectId: projectId.toString() });
  // Only add status if it's not empty
  if (filters.status && filters.status.trim() !== "") {
    params.append("status", filters.status);
  }
  // Only add title if it's not empty
  if (filters.title && filters.title.trim() !== "") {
    params.append("title", filters.title);
  }
  // Add pagination params
  if (filters.page !== undefined && filters.page !== null) {
    params.append("page", filters.page.toString());
  }
  if (filters.size !== undefined && filters.size !== null) {
    params.append("size", filters.size.toString());
  }
  return apiClient.get(`/tasks?${params.toString()}`);
};

export const createTask = (projectId, data) =>
  apiClient.post(`/tasks?projectId=${projectId}`, data);

export const completeTask = (taskId) =>
  apiClient.patch(`/tasks/${taskId}/complete`);

export const updateTask = (taskId, data) =>
  apiClient.put(`/tasks/${taskId}`, data);

export const deleteTask = (taskId) =>
  apiClient.delete(`/tasks/${taskId}`);
