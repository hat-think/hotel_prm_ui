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
