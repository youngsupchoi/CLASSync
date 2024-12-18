//src/api/noteApi.ts

import axios from "axios";

export const createClass = async (title: string) => {
  try {
    const userId = localStorage.getItem("CLASSync_uid");
    if (!userId) {
      throw new Error("사용자 ID를 찾을 수 없습니다.");
    }

    const response = await axios.post(
      `https://monthly-madge-choco-planner-59fb550a.koyeb.app/api/class/${userId}`,
      {
        title: title,
        description: "멋진 수업.",
      },
    );
    return response.data;
  } catch (error) {
    console.error("API 요청 에러:", error);
    throw error;
  }
};
