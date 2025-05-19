import axios from "axios";
import { API_BASE_URL } from "../../config";

// Helper to get token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
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

// Add a station to a metro line (by stationId only)
export const addStationToLine = (lineId, stationId) =>
  axios.post(`${API_BASE_URL}/api/metro-lines/${lineId}/stations/${stationId}`, null, {
    headers: getAuthHeader(),
  });

// Remove a station from a metro line
export const deleteStationFromLine = (lineId, stationId) =>
  axios.delete(`${API_BASE_URL}/api/metro-lines/${lineId}/stations/${stationId}`, {
    headers: getAuthHeader(),
  });

// Get a specific station from a line
export const getStationFromLine = (lineId, stationId) =>
  axios.get(`${API_BASE_URL}/api/metro-lines/${lineId}/stations/${stationId}`, {
    headers: getAuthHeader(),
  });

// Get active/inactive lines
export const getActiveMetroLines = () =>
  axios.get(`${API_BASE_URL}/api/metro-lines/active`, {
    headers: getAuthHeader(),
  });

export const getInactiveMetroLines = () =>
  axios.get(`${API_BASE_URL}/api/metro-lines/inactive`, {
    headers: getAuthHeader(),
  });

// Update line status (PATCH)
export const updateMetroLineStatus = (id, isActive) =>
  axios.patch(`${API_BASE_URL}/api/metro-lines/${id}/status?isActive=${isActive}`, null, {
    headers: getAuthHeader(),
  });

// Generate trips for a line (optionally with lastDeparture)
export const generateTripsForLine = (id, lastDeparture) =>
  axios.post(`${API_BASE_URL}/api/metro-lines/${id}/generate-trips${lastDeparture ? `?lastDeparture=${lastDeparture}` : ''}`, null, {
    headers: getAuthHeader(),
  });

// Generate trips for all lines
export const generateTripsForAllLines = () =>
  axios.post(`${API_BASE_URL}/api/metro-lines/generate-trips`, null, {
    headers: getAuthHeader(),
  });

// Get trips for a line
export const getTripsForLine = (id) =>
  axios.get(`${API_BASE_URL}/api/metro-lines/${id}/trips`, {
    headers: getAuthHeader(),
  });

// Get trips for a station in a line
export const getTripsForStationInLine = (lineId, stationId) =>
  axios.get(`${API_BASE_URL}/api/metro-lines/${lineId}/stations/${stationId}/trips`, {
    headers: getAuthHeader(),
  });

// Delete all trips
export const deleteAllTrips = () =>
  axios.delete(`${API_BASE_URL}/api/metro-lines/trips`, {
    headers: getAuthHeader(),
  });

// Get all trips for all lines
export const getAllTrips = () =>
  axios.get(`${API_BASE_URL}/api/metro-lines/trips`, {
    headers: getAuthHeader(),
  });

// Get all stations
export const getAllStations = () =>
  axios.get(`${API_BASE_URL}/api/stations/get-all-stations`, {
    headers: getAuthHeader(),
  });