import axios from "axios";
import logger from "../config/logger.js";

const httpClient = axios.create({
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${process.env.SERVICE_KEY}`,
  },
});

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;
    logger.error(`HTTP request failed: ${message}`);
    return Promise.reject(new Error(message));
  }
);

export default httpClient;
