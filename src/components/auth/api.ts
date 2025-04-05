import axios from "axios";
import * as Yup from "yup";

const API_BASE_URL = "https://your-api.com"; // Replace with your actual API URL

export const loginUser = async (email: string, password: string) => {
  try {
    const response: any = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        message: response.data.message || "Login failed",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};

export const sendOtp = async (email: string) => {
  return axios.post("/api/send-otp", { email });
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
      email,
      otp,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  mobile: string;
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
