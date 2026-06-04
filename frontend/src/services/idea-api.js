import { apiClient } from "./api-client";

export const fetchIdeas = () => apiClient.get("/ideas");

export const createIdea = (payload) => apiClient.post("/ideas", payload);

export const updateIdea = (id, payload) => apiClient.put(`/ideas/${id}`, payload);
