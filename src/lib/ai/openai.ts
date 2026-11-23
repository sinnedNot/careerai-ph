
import { createOpenAI } from "@ai-sdk/openai";

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing.");
}

if (!baseURL) {
  throw new Error("OPENAI_BASE_URL is missing.");
}

export const openai = createOpenAI({
  apiKey,
  baseURL,
});
