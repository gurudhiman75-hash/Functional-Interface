import {
  claudeProvider,
} from "./claude-adapter";
import {
  geminiProvider,
} from "./gemini-adapter";
import {
  normalizeProviderError,
  openAIProvider,
} from "./openai-adapter";
import type {
  AIProviderAdapter,
  AIProviderName,
  AIProviderRequest,
  AIProviderResponse,
} from "./types";

export type {
  AIProviderAdapter,
  AIProviderName,
  AIProviderPrompt,
  AIProviderRequest,
  AIProviderResponse,
  AIProviderUsage,
} from "./types";

const PROVIDERS: Record<
  AIProviderName,
  AIProviderAdapter
> = {
  openai: openAIProvider,
  gemini: geminiProvider,
  claude: claudeProvider,
};

export function resolveAIProvider(
  provider?: AIProviderName,
) {
  const configured =
    provider ??
    (process.env[
      "AI_EXTRACTION_PROVIDER"
    ] as AIProviderName | undefined);

  if (configured) {
    return configured;
  }

  if (openAIProvider.isConfigured()) {
    return "openai";
  }
  if (geminiProvider.isConfigured()) {
    return "gemini";
  }
  if (claudeProvider.isConfigured()) {
    return "claude";
  }

  return "openai";
}

export function getAIProvider(
  provider?: AIProviderName,
) {
  const resolved =
    resolveAIProvider(provider);
  const adapter = PROVIDERS[resolved];
  if (!adapter) {
    throw new Error(
      `Unsupported AI provider: ${resolved}`,
    );
  }
  return adapter;
}

export async function extractWithAI(
  request: AIProviderRequest,
): Promise<AIProviderResponse> {
  const adapter = getAIProvider(
    request.provider,
  );
  return adapter.extract({
    model: request.model,
    prompt: request.prompt,
    input: request.input,
    temperature: request.temperature,
    responseSchema:
      request.responseSchema,
    responseSchemaName:
      request.responseSchemaName,
    timeoutMs: request.timeoutMs,
    maxRetries: request.maxRetries,
  });
}

export function describeAIProviderError(
  provider: AIProviderName | string,
  error: unknown,
) {
  return normalizeProviderError(
    provider,
    error,
  );
}

export function isAIProviderConfigured(
  provider?: AIProviderName,
) {
  return getAIProvider(
    provider,
  ).isConfigured();
}

export function validateAIProviderStartup() {
  const required =
    process.env["AI_EXTRACTION_REQUIRED"] ===
      "true" ||
    process.env["OPENAI_EXTRACTION_REQUIRED"] ===
      "true" ||
    process.env["NODE_ENV"] ===
      "production";
  const provider = resolveAIProvider();
  const adapter = getAIProvider(provider);

  if (!adapter.isConfigured() && required) {
    throw new Error(
      `Missing API key for AI extraction provider: ${provider}`,
    );
  }

  if (!adapter.isConfigured()) {
    console.warn(
      `No AI extraction provider is configured. Set AI_EXTRACTION_PROVIDER with the matching provider API key, or extraction will use offline heuristics.`,
    );
    return;
  }

  console.info(
    `AI extraction provider configured: ${provider}`,
  );
}
