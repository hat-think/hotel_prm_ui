import { getFromStorage } from "../../utilities/utils.js";
import { ApiCaller } from "./../../utilities/network";

const API_BASE_URL = "https://log.tokame.network/api"; // Replace with your actual API URL




export const getEmployeeList = async () => {
  const token =await getFromStorage("token");

  try {
    const response = await ApiCaller.get(`${API_BASE_URL}/employee-list`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Fetching dashboard data failed");
  }
};


export const addEmployee = async (data) => {
  const token = await getFromStorage("token");

  try {
     const response = await ApiCaller.post(`${API_BASE_URL}/add-employee`, data, {
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

export const updateEmployee = async (data) => {
  const token = await getFromStorage("token");
  try {
     const response = await ApiCaller.post(`${API_BASE_URL}/update-employee`, data, {
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