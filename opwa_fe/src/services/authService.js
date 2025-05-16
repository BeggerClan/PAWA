import axios from "axios";
import { API_BASE_URL } from "../config";

// Login API
export const login = (email, password) =>
  axios.post(`${API_BASE_URL}/api/v1/auth/authenticate`, { email, password });

// Sign Up API (open registration)
export const signUp = (userData) =>
  axios.post(`${API_BASE_URL}/api/v1/auth/register`, userData);