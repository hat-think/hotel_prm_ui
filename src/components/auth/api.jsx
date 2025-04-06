import axios from "axios";
import * as Yup from "yup";
import { saveToStorage } from "../../utilities/utils";
import { ApiCaller } from "./../../utilities/network";

const API_BASE_URL = "http://142.93.220.8:5000/api"; // Replace with your actual API URL

export const loginUser = async (email, password) => {
  try {
    const response = await ApiCaller.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    const res = response.data;
    if (res.status === 1) {
      saveToStorage("token", response.data.token);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};

export const sendOtp = async (email) => {
  return ApiCaller.post("/api/send-otp", { email });
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await ApiCaller.post(`${API_BASE_URL}/auth/verify-otp`, {
      email,
      otp,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await ApiCaller.post(
      `${API_BASE_URL}/hotelregistration`,
      userData
    );
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
