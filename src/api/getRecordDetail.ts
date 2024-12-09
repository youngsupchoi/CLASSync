//src/api/noteApi.ts

import axios from "axios";

export const getRecordDetail = async (recordingId: number) => {
  try {
    const response = await axios.get(
      `https://monthly-madge-choco-planner-59fb550a.koyeb.app/api/recording/detail/${recordingId}`,
    );
    console.log("🚀 ~ getRecordDetail ~ response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API 요청 에러:", error);
    throw error;
  }
};
