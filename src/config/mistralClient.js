import axios from "axios";
import { config } from "./env.js";

const mistral = axios.create({
  baseURL: "https://api.mistral.ai/v1",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.mistralApiKey}`
  }
});

export async function createChatCompletion({ messages, model = config.mistralModel }) {
  const response = await mistral.post("/chat/completions", {
    model,
    messages
  });
  return response.data;
}
