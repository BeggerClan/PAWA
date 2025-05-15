import axios from "axios";
import { API_BASE_URL } from "../config";

// Login API
export const login = (email, password) =>
  axios.post(`${API_BASE_URL}/api/v1/auth/authenticate`, { email, password });

// Sign Up API (requires admin token)
export const signUp = (userData, token) =>
  axios.post(
    `${API_BASE_URL}/api/v1/user/add`,
    userData,
    { headers: { Authorization: `Bearer ${token}` } }
  );