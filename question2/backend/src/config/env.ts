import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  BASE_URL: "http://20.244.56.144/evaluation-service",
};