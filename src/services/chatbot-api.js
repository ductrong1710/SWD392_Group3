import { fetchApi } from "./base-api";
export const chatbotApi = {
    query: (data) => fetchApi("/v1/chatbot/query", {
        method: "POST",
        body: JSON.stringify(data),
    }),
};
