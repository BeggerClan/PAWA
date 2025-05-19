import axios from "axios";

const API_BASE = "/api"; // Change if your backend prefix is different

export const getAllStations = () =>
  axios.get(`${API_BASE}/getAllStations`);

export const getStation = (stationId) =>
  axios.get(`${API_BASE}/getStation/${stationId}`);

export const addStation = (station) =>
  axios.post(`${API_BASE}/addStation`, station);

export const updateStation = (station) =>
  axios.put(`${API_BASE}/updateStation`, station);

export const deleteStation = (stationId) =>
  axios.delete(`${API_BASE}/deleteStation/${stationId}`);

export const addStationList = (stations) =>
  axios.post(`${API_BASE}/addStationList`, stations);