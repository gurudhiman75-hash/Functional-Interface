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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function nonEmptyStringField(record: Record<string, unknown>, key: string) {
  return typeof record[key] === "string" && String(record[key]).trim().length > 0;
}

function looksLikeNotesStudioV2Fact(value: unknown) {
  if (!isRecord(value)) return false;
  return nonEmptyStringField(value, "subCategory")
    && nonEmptyStringField(value, "claim")
    && Array.isArray(value.entities)
    && nonEmptyStringField(value, "locator")
    && nonEmptyStringField(value, "extractedText");
}

type FactArrayMatch = {
  path: string;
  facts: unknown[];
};

function collectNotesStudioV2FactArrays(
  value: unknown,
  matches: FactArrayMatch[],
  path = "$",
  depth = 0,
) {
  if (depth > 8 || matches.length >= 64 || value === null || value === undefined) return;

  if (Array.isArray(value)) {
    if (value.length > 0 && value.every(looksLikeNotesStudioV2Fact)) {
      matches.push({ path, facts: value });
      return;
    }
    for (let index = 0; index < value.length; index += 1) {
      const nested = value[index];
      if (nested && typeof nested === "object") {
        collectNotesStudioV2FactArrays(nested, matches, `${path}[${index}]`, depth + 1);
      }
    }
    return;
  }

  if (!isRecord(value)) return;
  for (const [key, nested] of Object.entries(value)) {
    if (nested && typeof nested === "object") {
      collectNotesStudioV2FactArrays(nested, matches, `${path}.${key}`, depth + 1);
    }
  }
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

  const matches: FactArrayMatch[] = [];
  collectNotesStudioV2FactArrays(value, matches);
  if (matches.length === 0) {
    return { json: value, warnings: [] };
  }

  const facts = matches.flatMap((match) => match.facts);
  const paths = matches.slice(0, 6).map((match) => match.path).join(", ");
  return {
    json: { facts },
    warnings: [
      matches.length === 1
        ? `DeepSeek nested the Notes v2 facts array at ${paths}; normalized it to the required facts wrapper.`
        : `DeepSeek grouped Notes v2 facts across ${matches.length} nested arrays (${paths}${matches.length > 6 ? ", …" : ""}); merged them into the required facts wrapper.`,
    ],
  };
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
      ? "For Notes Studio v2, the top-level JSON value MUST be an object with a property named facts whose value is one flat array. Do not group facts by chapter, sub-category, section, data, result, items, output, or any other wrapper."
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
