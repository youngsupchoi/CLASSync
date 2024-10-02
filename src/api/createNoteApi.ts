//src/api/createNoteApi.ts

import axios from "axios";

export const createUserNote = async (data: {
  user_id: number;
  url: string;
}) => {
  try {
    const response = await axios.post(`technote/create/link`, data);
    return response.data;
  } catch (error) {
    console.error("API 요청 에러:", error);
    throw error;
  }
};
