import axios from "axios";
import { config } from "../config/env";

export const apiClient = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});