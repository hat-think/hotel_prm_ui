import { getFromStorage } from "../../utilities/utils.js";
import { ApiCaller } from "./../../utilities/network";

const API_BASE_URL = "https://log.tokame.network/api"; // Replace with your actual API URL


export const bulkAddRoomsAPI = async (data) => {
  const token = await getFromStorage("token");

  try {
     const response = await ApiCaller.post(`${API_BASE_URL}/addrooms`, data, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
    const res = response.data;
    if (res.status === 1) {
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

export const gethotelrooms = async () => {
  const token =await getFromStorage("token");

  try {
    const response = await ApiCaller.get(`${API_BASE_URL}/gethotel-rooms`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Fetching dashboard data failed");
  }
};

export const getactivevisitor = async (page = 1, limit = 20) => {
  const token = await getFromStorage("token");

  try {
    const response = await ApiCaller.get(
      `${API_BASE_URL}/getactive-visitor?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Fetching active visitors failed");
  }
};

export const checkoutvisitor = async (data) => {
  const token = await getFromStorage("token");

  try {
     const response = await ApiCaller.post(`${API_BASE_URL}/checkout-visitor`, data, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

      return response.data;
   
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};

export const getavailablehotelrooms = async () => {
  const token =await getFromStorage("token");

  try {
    const response = await ApiCaller.get(`${API_BASE_URL}/get-available-hotel-rooms`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Fetching dashboard data failed");
  }
};

export const allocateroom = async (data) => {
  const token = await getFromStorage("token");

  try {
     const response = await ApiCaller.post(`${API_BASE_URL}/allocate-room`, data, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

      return response.data;
   
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};