// src/api/createNotionPageApi.ts

import axios from "axios";

export const createNotionPage = async (conversationId: string) => {
  try {
    const response = await axios.post(
      `/technote/create/notionpage/${conversationId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error creating notion page:", error);
    throw new Error("Failed to create notion page");
  }
};
