import axios from "axios";
import { API_BASE_URL } from "../config";

// Get all suspensions
export const getAllSuspensions = () =>
  axios.get(`${API_BASE_URL}/api/suspensions`);

// Get suspensions by active status
export const getSuspensionsByActive = (active) =>
  axios.get(`${API_BASE_URL}/api/suspensions`, { params: { active } });

// Get a suspension by ID
export const getSuspensionById = (id) =>
  axios.get(`${API_BASE_URL}/api/suspensions/${id}`);

// Get suspensions for a metro line
export const getSuspensionsByLine = (lineId, active) =>
  axios.get(`${API_BASE_URL}/api/suspensions/line/${lineId}${active !== undefined ? `?active=${active}` : ""}`);

// Get suspensions affecting a station
export const getSuspensionsByStation = (stationId) =>
  axios.get(`${API_BASE_URL}/api/suspensions/station/${stationId}`);

// Create a new suspension
export const createSuspension = (data) =>
  axios.post(`${API_BASE_URL}/api/suspensions`, data);

// Resolve a suspension
export const resolveSuspension = (id) =>
  axios.patch(`${API_BASE_URL}/api/suspensions/${id}/resolve`);

// Extend a suspension
export const extendSuspension = (id, additionalHours) =>
  axios.patch(`${API_BASE_URL}/api/suspensions/${id}/extend`, null, { params: { additionalHours } });

// Delete a suspension
export const deleteSuspension = (id) =>
  axios.delete(`${API_BASE_URL}/api/suspensions/${id}`);

// Add stations to a suspension
export const addStationsToSuspension = (suspensionId, stationIds) =>
  axios.patch(`${API_BASE_URL}/api/suspensions/${suspensionId}/add-stations`, stationIds);

// Update suspension details
export const updateSuspensionDetails = (suspensionId, data) =>
  axios.patch(`${API_BASE_URL}/api/suspensions/${suspensionId}/details`, data);