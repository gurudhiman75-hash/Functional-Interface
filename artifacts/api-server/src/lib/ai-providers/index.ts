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

const PROVIDER_FAILOVER_ORDER: AIProviderName[] = [
  "openai",
  "gemini",
  "claude",
];

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

function providerErrorText(error: unknown) {
  const err = error as {
    status?: number;
    code?: string;
    message?: string;
    cause?: { message?: string; code?: string };
  };
  return [
    err.status,
    err.code,
    err.message,
    err.cause?.code,
    err.cause?.message,
  ]
    .filter((value) => value !== undefined && value !== null)
    .join(" ");
}

function isProviderQuotaFailure(error: unknown) {
  const err = error as { status?: number };
  if (err.status === 429) return true;
  return /no credits|insufficient[_ -]?quota|quota exceeded|billing|rate limit/i.test(
    providerErrorText(error),
  );
}

function isNotesStudioV2Request(request: AIProviderRequest) {
  return String(request.responseSchemaName ?? "").startsWith(
    "notes_studio_v2_",
  );
}

async function extractWithProvider(
  provider: AIProviderName,
  request: AIProviderRequest,
  useRequestedModel: boolean,
) {
  const adapter = PROVIDERS[provider];
  return adapter.extract({
    model: useRequestedModel
      ? request.model
      : undefined,
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

export async function extractWithAI(
  request: AIProviderRequest,
): Promise<AIProviderResponse> {
  const primaryProvider = resolveAIProvider(
    request.provider,
  );

  try {
    return await extractWithProvider(
      primaryProvider,
      request,
      true,
    );
  } catch (primaryError) {
    const allowAutomaticFailover =
      !request.provider &&
      isNotesStudioV2Request(request) &&
      isProviderQuotaFailure(primaryError);

    if (!allowAutomaticFailover) {
      throw primaryError;
    }

    const configuredAlternates =
      PROVIDER_FAILOVER_ORDER.filter(
        (provider) =>
          provider !== primaryProvider &&
          PROVIDERS[provider].isConfigured(),
      );

    if (configuredAlternates.length === 0) {
      console.error(
        `[notes-studio-v2] ${primaryProvider} quota exhausted and no alternate AI provider is configured.`,
      );
      throw primaryError;
    }

    let lastError: unknown = primaryError;
    for (const provider of configuredAlternates) {
      try {
        const response = await extractWithProvider(
          provider,
          request,
          false,
        );
        console.warn(
          `[notes-studio-v2] ${primaryProvider} quota exhausted; extraction failed over to ${provider}.`,
        );
        return {
          ...response,
          warnings: [
            ...response.warnings,
            `Primary provider ${primaryProvider} was unavailable because of quota/billing limits; used ${provider}.`,
          ],
        };
      } catch (fallbackError) {
        lastError = fallbackError;
        console.error(
          `[notes-studio-v2] fallback provider ${provider} failed after ${primaryProvider} quota exhaustion.`,
          fallbackError,
        );
      }
    }

    throw lastError;
  }
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
