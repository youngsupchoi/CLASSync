//src/api/noteApi.ts

import axios from "axios";

export const createSummary = async (recordingId: number) => {
  try {
    const userId = localStorage.getItem("CLASSync_uid");
    if (!userId) {
      throw new Error("사용자 ID를 찾을 수 없습니다.");
    }

    const response = await axios.post(
      `https://monthly-madge-choco-planner-59fb550a.koyeb.app/api/summary/${userId}/${recordingId}`,
    );
    console.log("🚀 ~ createSummary ~ response:", response);
    return response.data;
  } catch (error) {
    console.error("API 요청 에러:", error);
    throw error;
  }
};
