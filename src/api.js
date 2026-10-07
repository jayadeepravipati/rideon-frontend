import axios from "axios";

const API_BASE_URL = "https://rideon-backend-2.onrender.com/api";

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const	adminLogin = async (adminData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, adminData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Save token
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addBike = async (bikeData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/bikes`, bikeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
