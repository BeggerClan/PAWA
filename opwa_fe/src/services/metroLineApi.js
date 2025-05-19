import axios from "axios";
import { API_BASE_URL } from "../config";

export const getAllMetroLines = () =>
  axios.get(`${API_BASE_URL}/api/metro-lines/get-all-metro-lines`);

export const getMetroLineById = (id) =>
  axios.get(`${API_BASE_URL}/api/metro-lines/${id}`);

export const createMetroLine = (data) =>
  axios.post(`${API_BASE_URL}/api/metro-lines/create`, data);

export const updateMetroLine = (id, data) =>
  axios.put(`${API_BASE_URL}/api/metro-lines/${id}`, data);

export const deleteMetroLine = (id) =>
  axios.delete(`${API_BASE_URL}/api/metro-lines/${id}`);

export const getStationsForLine = (lineId) =>
  axios.get(`${API_BASE_URL}/api/metro-lines/${lineId}/stations`);