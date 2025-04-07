import { saveToStorage, getFromStorage } from "../../utilities/utils.js";
import { ApiCaller } from "./../../utilities/network";

const API_BASE_URL = "https://log.tokame.network/api"; // Replace with your actual API URL

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

export const getdashboard = async () => {
<<<<<<< HEAD
  const token =await getFromStorage("token");

=======
>>>>>>> 26eef176ef4dbb2a2ebdf3113a509e454e5fe1be
  try {
    const response = await ApiCaller.get(`${API_BASE_URL}/getdashboard-data`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Fetching dashboard data failed"
    );
  }
};

export const gethotelrooms = async () => {
<<<<<<< HEAD
  const token =await getFromStorage("token");

=======
>>>>>>> 26eef176ef4dbb2a2ebdf3113a509e454e5fe1be
  try {
    const response = await ApiCaller.get(`${API_BASE_URL}/gethotel-rooms`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Fetching dashboard data failed"
    );
  }
};
<<<<<<< HEAD

export const getProfile = async () => {
  const token =await getFromStorage("token");

  try {
    const response = await ApiCaller.get(`${API_BASE_URL}/getProfile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Fetching dashboard data failed");
  }
};

export const sendemailotp = async () => {
  const token =await getFromStorage("token");

  try {
    const response = await ApiCaller.get(`${API_BASE_URL}/sendemail-otp`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Fetching dashboard data failed");
  }
};

export const changepassword = async (userData) => {
  const token =await getFromStorage("token");
  try {
    const response = await ApiCaller.post(
      `${API_BASE_URL}/changepassword`,
      userData,{
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};


=======
>>>>>>> 26eef176ef4dbb2a2ebdf3113a509e454e5fe1be
