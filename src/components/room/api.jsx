import { saveToStorage, getFromStorage } from "../../utilities/utils.js";
import { ApiCaller } from "./../../utilities/network";

const API_BASE_URL = "http://142.93.220.8:5000/api"; // Replace with your actual API URL

const token = await getFromStorage("token");

export const bulkAddRoomsAPI = async (data) => {
  try {
    const response = await ApiCaller.post(`${API_BASE_URL}/addrooms`, data);
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
