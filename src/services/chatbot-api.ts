import { fetchApi } from "./base-api";
import type { ChatRequest, ChatBotResponse } from "../types";

export const chatbotApi = {
  query: (data: ChatRequest): Promise<ChatBotResponse> =>
    fetchApi("/v1/chatbot/query", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};