import axios from "axios";
import { API_BASE_URL } from "../../config";

const API_BASE = `${API_BASE_URL}/api`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // or your token storage key
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllStations = () =>
  axios.get(`${API_BASE}/stations/get-all-stations`, {
    headers: getAuthHeader(),
  });

export const getStation = (stationId) =>
  axios.get(`${API_BASE}/stations/${stationId}`, {
    headers: getAuthHeader(),
  });

export const addStation = (station) =>
  axios.post(`${API_BASE}/stations/create`, station, {
    headers: getAuthHeader(),
  });

export const updateStation = (stationId, station) =>
  axios.put(`${API_BASE}/stations/${stationId}`, station, {
    headers: getAuthHeader(),
  });

export const deleteStation = (stationId) =>
  axios.delete(`${API_BASE}/stations/${stationId}`, {
    headers: getAuthHeader(),
  });

export const addStationList = (stations) =>
  axios.post(`${API_BASE}/addStationList`, stations, {
    headers: getAuthHeader(),
  });