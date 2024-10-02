// src/components/FormSpark.ts
import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

const FORMSPARK_URL = import.meta.env.VITE_APP_FORM_SPARK; // Formspark 폼 ID로 대체
console.log("🚀 ~ FORMSPARK_URL:", FORMSPARK_URL);

/**
 * Formspark에 데이터를 전송하는 함수
 * @param {string} email - 이메일 주소
 * @param {string} source - 소스 정보
 */
export const submitToFormspark = async (
  email: string,
  source: string,
): Promise<void> => {
  try {
    await axios.post(FORMSPARK_URL, {
      email: email,
      source: source,
    });
    console.log("Form submitted successfully!");
  } catch (error) {
    console.error("Error submitting form", error);
  }
};
