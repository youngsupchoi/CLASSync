//src/api/noteApi.ts

import axios from "axios";

export const getRecordSummary = async (recordingId: number) => {
  try {
    const userId = localStorage.getItem("CLASSync_uid");
    if (!userId) {
      throw new Error("사용자 ID를 찾을 수 없습니다.");
    }
    const response = await axios.get(
      `https://monthly-madge-choco-planner-59fb550a.koyeb.app/api/summary/${userId}/${recordingId}`,
    );
    console.log("🚀 ~ getRecordSummary ~ recordingId:", recordingId);
    console.log("🚀 ~ getRecordSummary ~ userId:", userId);
    // console.log("🚀 ~ 222getRecordSummary ~ response:", response.data);
    return response.data.response;
  } catch (error) {
    console.error("API 요청 에러:", error);
    throw error;
  }
};
