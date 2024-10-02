//src/api/noteApi.ts

import axios from "axios";

export const getAllNotes = async (userId: string) => {
  try {
    const response = await axios.get(`/technote/all/${userId}`);
    return response.data;
  } catch (error) {
    console.error("API 요청 에러:", error);
    throw error;
  }
};
