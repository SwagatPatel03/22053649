import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Your backend URL

export const fetchTopUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
};

export const fetchTrendingPosts = async () => {
  const response = await axios.get(`${API_BASE_URL}/posts?type=popular`);
  return response.data;
};

export const fetchLatestPosts = async () => {
  const response = await axios.get(`${API_BASE_URL}/posts?type=latest`);
  return response.data;
};