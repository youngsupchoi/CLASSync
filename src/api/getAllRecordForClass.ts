//src/api/noteApi.ts

import axios from "axios";

export const getAllRecordForClass = async (classId: number) => {
  try {
    const response = await axios.get(
      `https://monthly-madge-choco-planner-59fb550a.koyeb.app/api/recording/${classId}`,
    );
    console.log("🚀 ~ getAllRecordForClass ~ response:", response);
    return response.data;
  } catch (error) {
    console.error("API 요청 에러:", error);
    throw error;
  }
};
