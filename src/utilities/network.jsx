import axios from "axios";
import { getFromStorage } from "./utils.js";
const API_BASE_URL = "http://142.93.220.8:5000/api"; // Replace with your actual API URL

export const ApiCaller = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    language: "en",
  },
  timeout: 10000,
});

ApiCaller.interceptors.request.use(
  async (config) => {
    const access_token = getFromStorage("token");
    if (access_token) {
      config.headers["Authorization"] = "Bearer " + access_token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

ApiCaller.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return new Promise((resolve, reject) => {
      const originalRequest = error?.config;
      if (error?.response?.status === 401 && !originalRequest?._retry) {
        if (error?.response?.status === 401) {
          //   notifyError(error?.response?.data?.message);
          // setTimeout(() => {
          //   localStorage.clear();
          //   window.location.href = "/";
          // }, 2000);
        }
      } else {
        reject(error?.response);
      }
    });
  }
);
