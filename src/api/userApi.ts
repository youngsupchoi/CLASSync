import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const createUser = async (user: any) => {
  try {
    const response = await axios.post(`user/create`, { user });
    return response.data;
  } catch (error) {
    console.error("API 요청 에러:", error);
    throw error;
  }
};
