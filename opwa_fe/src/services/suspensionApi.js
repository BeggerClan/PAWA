import axios from "axios";
import { API_BASE_URL } from "../config";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const API_BASE = `${API_BASE_URL}/api`;

// Create a new suspension
export const createSuspension = (suspension) =>
  axios.post(`${API_BASE}/suspensions`, suspension, {
    headers: getAuthHeader(),
  });

// Get all active suspensions
export const getActiveSuspensions = () =>
  axios.get(`${API_BASE}/suspensions/active`, {
    headers: getAuthHeader(),
  });

// Get all suspensions for a metro line
export const getSuspensionsForLine = (lineId) =>
  axios.get(`${API_BASE}/suspensions/line/${lineId}`, {
    headers: getAuthHeader(),
  });

// Get all suspensions for a station
export const getSuspensionsForStation = (stationId) =>
  axios.get(`${API_BASE}/suspensions/station/${stationId}`, {
    headers: getAuthHeader(),
  });

// Resolve (end) a suspension
export const resolveSuspension = (suspensionId) =>
  axios.put(`${API_BASE}/suspensions/resolve/${suspensionId}`, {}, {
    headers: getAuthHeader(),
  });

// Delete a suspension
export const deleteSuspension = (suspensionId) =>
  axios.delete(`${API_BASE}/suspensions/${suspensionId}`, {
    headers: getAuthHeader(),
  });