import axios from "axios";
import { API_BASE_URL } from "../config";

// Helper to get token
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // or your token storage key
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllMetroLines = () =>
  axios.get(`${API_BASE_URL}/api/metro-lines/get-all-metro-lines`, {
    headers: getAuthHeader(),
  });

export const getMetroLineById = (id) =>
  axios.get(`${API_BASE_URL}/api/metro-lines/${id}`, {
    headers: getAuthHeader(),
  });

export const createMetroLine = (data) =>
  axios.post(`${API_BASE_URL}/api/metro-lines/create`, data, {
    headers: getAuthHeader(),
  });

export const updateMetroLine = (id, data) =>
  axios.put(`${API_BASE_URL}/api/metro-lines/${id}`, data, {
    headers: getAuthHeader(),
  });

export const deleteMetroLine = (id) =>
  axios.delete(`${API_BASE_URL}/api/metro-lines/${id}`, {
    headers: getAuthHeader(),
  });

export const getStationsForLine = (lineId) =>
  axios.get(`${API_BASE_URL}/api/metro-lines/${lineId}/stations`, {
    headers: getAuthHeader(),
  });

// Add a station to a metro line
export const addStationToLine = (lineId, station) =>
  axios.post(`${API_BASE_URL}/api/metro-lines/${lineId}/stations/add`, station, {
    headers: getAuthHeader(),
  });

// Update a station in a metro line
export const updateStationInLine = (lineId, stationId, station) =>
  axios.put(`${API_BASE_URL}/api/metro-lines/${lineId}/stations/update/${stationId}`, station, {
    headers: getAuthHeader(),
  });

// Delete a station from a metro line
export const deleteStationFromLine = (lineId, stationId) =>
  axios.delete(`${API_BASE_URL}/api/metro-lines/${lineId}/stations/delete/${stationId}`, {
    headers: getAuthHeader(),
  });