import {
  parseJsonFromText,
  type AIProviderAdapter,
  type AIProviderResponse,
} from "./types";

function getDeepSeekApiKey() {
  return process.env["DEEPSEEK_API_KEY"];
}

function deepSeekBaseUrl() {
  return String(
    process.env["DEEPSEEK_BASE_URL"] ?? "https://api.deepseek.com",
  ).replace(/\/+$/, "");
}

export function buildDeepSeekJsonInstruction(
  responseSchema?: Record<string, unknown>,
): string | null {
  if (!responseSchema) return null;
  return [
    "Return ONLY one valid JSON value. Do not use Markdown fences or explanatory text.",
    "The server will strictly validate the JSON after generation. Match this JSON Schema exactly:",
    JSON.stringify(responseSchema),
  ].join("\n");
}

export function isTransientDeepSeekStatus(status: number) {
  return status === 408
    || status === 409
    || status === 429
    || status === 500
    || status === 502
    || status === 503
    || status === 504;
}

export function deepSeekRetryDelayMs(retryIndex: number) {
  const bounded = Math.max(0, Math.min(Math.trunc(retryIndex), 4));
  return Math.min(1_000 * (2 ** bounded), 8_000);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

class DeepSeekRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

function usageFromResponse(raw: any) {
  const inputTokens = Number(raw?.usage?.prompt_tokens) || 0;
  const outputTokens = Number(raw?.usage?.completion_tokens) || 0;
  return {
    inputTokens,
    outputTokens,
    totalTokens:
      Number(raw?.usage?.total_tokens) || inputTokens + outputTokens,
  };
}

function isNotesStudioV2FactExtraction(responseSchemaName?: string) {
  return responseSchemaName === "notes_studio_v2_extracted_facts";
}

function hasFactsArray(value: unknown): value is { facts: unknown[] } {
  return Boolean(
    value
    && typeof value === "object"
    && Array.isArray((value as { facts?: unknown }).facts),
  );
}

export function normalizeDeepSeekStructuredJson(
  value: unknown,
  responseSchemaName?: string,
): { json: unknown; warnings: string[] } {
  if (!isNotesStudioV2FactExtraction(responseSchemaName) || hasFactsArray(value)) {
    return { json: value, warnings: [] };
  }

  if (Array.isArray(value)) {
    return {
      json: { facts: value },
      warnings: ["DeepSeek returned the Notes v2 facts array at the JSON root; normalized it to the required facts wrapper."],
    };
  }

  if (!value || typeof value !== "object") {
    return { json: value, warnings: [] };
  }

  const record = value as Record<string, unknown>;
  const wrapperKeys = [
    "data",
    "result",
    "results",
    "response",
    "output",
    "items",
    "payload",
  ];

  for (const key of wrapperKeys) {
    const nested = record[key];
    if (hasFactsArray(nested)) {
      return {
        json: nested,
        warnings: [`DeepSeek wrapped the Notes v2 facts object in \"${key}\"; normalized it to the required facts wrapper.`],
      };
    }
    if (Array.isArray(nested)) {
      return {
        json: { facts: nested },
        warnings: [`DeepSeek returned the Notes v2 facts array under \"${key}\"; normalized it to the required facts wrapper.`],
      };
    }
  }

  const candidateArrays: unknown[][] = [];
  for (const nested of Object.values(record)) {
    if (Array.isArray(nested)) candidateArrays.push(nested);
  }
  if (candidateArrays.length === 1) {
    return {
      json: { facts: candidateArrays[0] },
      warnings: ["DeepSeek renamed the single Notes v2 facts array; normalized it to the required facts wrapper."],
    };
  }

  const nestedCandidateArrays: unknown[][] = [];
  for (const nested of Object.values(record)) {
    if (!nested || typeof nested !== "object" || Array.isArray(nested)) continue;
    for (const nestedValue of Object.values(nested as Record<string, unknown>)) {
      if (Array.isArray(nestedValue)) nestedCandidateArrays.push(nestedValue);
    }
  }
  if (nestedCandidateArrays.length === 1) {
    return {
      json: { facts: nestedCandidateArrays[0] },
      warnings: ["DeepSeek nested the single Notes v2 facts array one wrapper deeper; normalized it to the required facts wrapper."],
    };
  }

  return { json: value, warnings: [] };
}

export const deepSeekProvider: AIProviderAdapter = {
  name: "deepseek",
  defaultModel:
    process.env["DEEPSEEK_MODEL"] ??
    process.env["DEEPSEEK_KNOWLEDGE_EXTRACTION_MODEL"] ??
    "deepseek-v4-flash",
  isConfigured() {
    return Boolean(getDeepSeekApiKey());
  },
  assertConfigured() {
    if (!getDeepSeekApiKey()) {
      throw new Error("Missing DEEPSEEK_API_KEY");
    }
  },
  async extract(request) {
    this.assertConfigured();

    const model = request.model ?? this.defaultModel;
    const notesStudioV2FactExtraction = isNotesStudioV2FactExtraction(
      request.responseSchemaName,
    );
    const maxRetries = Math.max(
      0,
      Math.min(
        Math.trunc(request.maxRetries ?? (notesStudioV2FactExtraction ? 1 : 0)),
        4,
      ),
    );
    const timeoutMs = notesStudioV2FactExtraction
      ? Math.max(request.timeoutMs ?? 60_000, 180_000)
      : request.timeoutMs ?? 60_000;
    const maxTokens = Math.max(
      1_024,
      Math.min(
        Number(process.env["DEEPSEEK_MAX_OUTPUT_TOKENS"]) || 16_384,
        65_536,
      ),
    );
    const jsonInstruction = buildDeepSeekJsonInstruction(
      request.responseSchema as Record<string, unknown> | undefined,
    );
    const notesStudioV2ShapeInstruction = notesStudioV2FactExtraction
      ? "For Notes Studio v2, the top-level JSON value MUST be an object with a property named facts whose value is an array. Never rename facts to items, results, data, output, or another key."
      : "";

    const body = {
      model,
      messages: [
        {
          role: "system",
          content: [request.prompt.system, jsonInstruction ?? "", notesStudioV2ShapeInstruction]
            .filter(Boolean)
            .join("\n\n"),
        },
        {
          role: "user",
          content: [request.prompt.user, request.input ?? ""]
            .filter(Boolean)
            .join("\n\n"),
        },
      ],
      thinking: { type: "disabled" },
      temperature: request.temperature ?? 0,
      max_tokens: maxTokens,
      ...(request.responseSchema
        ? { response_format: { type: "json_object" } }
        : {}),
    };

    let lastError: unknown = null;
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(`${deepSeekBaseUrl()}/chat/completions`, {
          method: "POST",
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${getDeepSeekApiKey() ?? ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          const error = new DeepSeekRequestError(
            `DeepSeek request failed with status ${response.status} on ${model}: ${errorText}`,
            response.status,
          );
          lastError = error;
          if (!isTransientDeepSeekStatus(response.status) || attempt >= maxRetries) {
            throw error;
          }
          await wait(deepSeekRetryDelayMs(attempt));
          continue;
        }

        const raw = await response.json();
        const text = String(raw?.choices?.[0]?.message?.content ?? "");
        const parsed = parseJsonFromText(text);
        const normalized = normalizeDeepSeekStructuredJson(
          parsed,
          request.responseSchemaName,
        );
        return {
          provider: "deepseek",
          model,
          text,
          json: normalized.json,
          usage: usageFromResponse(raw),
          raw,
          warnings: normalized.warnings,
        } satisfies AIProviderResponse;
      } catch (error) {
        lastError = error;
        if (controller.signal.aborted) {
          throw new DeepSeekRequestError(
            `DeepSeek request timed out after ${Math.round(timeoutMs / 1000)} seconds on ${model}.`,
            504,
          );
        }
        if (error instanceof DeepSeekRequestError) throw error;
        if (attempt >= maxRetries) throw error;
        await wait(deepSeekRetryDelayMs(attempt));
      } finally {
        clearTimeout(timeout);
      }
    }

    throw lastError ?? new Error(`DeepSeek request failed on ${model}.`);
  },
};
