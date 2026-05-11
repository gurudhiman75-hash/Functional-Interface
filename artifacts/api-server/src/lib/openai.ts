import OpenAI from "openai";

import { logger } from "./logger";

const OPENAI_API_KEY =
  process.env["OPENAI_API_KEY"];

export const openai = new OpenAI({
  apiKey:
    OPENAI_API_KEY ??
    "missing-openai-api-key",
  baseURL:
    process.env["OPENAI_BASE_URL"] ||
    undefined,
});

export function requireOpenAIApiKey() {
  if (!OPENAI_API_KEY) {
    throw new Error(
      "Missing OPENAI_API_KEY",
    );
  }

  return OPENAI_API_KEY;
}

export function validateOpenAIStartup() {
  const required =
    process.env["OPENAI_EXTRACTION_REQUIRED"] ===
      "true" ||
    process.env["NODE_ENV"] === "production";

  if (!OPENAI_API_KEY && required) {
    throw new Error(
      "Missing OPENAI_API_KEY",
    );
  }

  if (!OPENAI_API_KEY) {
    logger.warn(
      "OPENAI_API_KEY is not configured. AI extraction will be unavailable until the backend environment variable is set.",
    );
  }
}
