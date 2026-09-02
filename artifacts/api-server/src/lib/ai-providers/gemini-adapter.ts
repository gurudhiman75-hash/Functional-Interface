import {
  emptyUsage,
  parseJsonFromText,
  type AIProviderAdapter,
} from "./types";

function getGeminiApiKey() {
  return (
    process.env["GEMINI_API_KEY"] ??
    process.env["GOOGLE_AI_API_KEY"]
  );
}

function isGemini3Model(model: string) {
  return /^gemini-3(?:\.|-|$)/i.test(model);
}

/**
 * Keep Gemini's HTTP transport intentionally minimal. Notes Studio already
 * performs strict deterministic validation after generation, so sending JSON
 * Schema through Gemini's version-sensitive structured-output fields adds
 * failure modes without adding a trust boundary. The expected JSON shape is
 * instead embedded in the prompt and validated server-side before persistence.
 */
export function buildGeminiGenerationConfig(input: {
  model: string;
  temperature?: number;
  responseSchema?: Record<string, unknown>;
}) {
  const generationConfig: Record<string, unknown> = {};
  if (!isGemini3Model(input.model)) {
    generationConfig.temperature = input.temperature ?? 0;
  }
  return generationConfig;
}

export function buildGeminiJsonInstruction(
  responseSchema?: Record<string, unknown>,
): string | null {
  if (!responseSchema) return null;
  return [
    "Return ONLY one valid JSON value. Do not use Markdown fences or explanatory text.",
    "The server will strictly validate the JSON after generation. Match this JSON Schema exactly:",
    JSON.stringify(responseSchema),
  ].join("\n");
}

export function isTransientGeminiStatus(status: number) {
  return status === 408
    || status === 429
    || status === 500
    || status === 502
    || status === 503
    || status === 504;
}

export function geminiRetryDelayMs(retryIndex: number) {
  const bounded = Math.max(0, Math.min(Math.trunc(retryIndex), 4));
  return Math.min(500 * (2 ** bounded), 4_000);
}

export function geminiFallbackModel(primaryModel: string) {
  const configured = String(process.env["GEMINI_FALLBACK_MODEL"] ?? "").trim();
  if (configured && configured !== primaryModel) return configured;
  if (/^gemini-3\.7-flash(?:$|-)/i.test(primaryModel)) return "gemini-3.6-flash";
  if (/^gemini-3\.6-flash(?:$|-)/i.test(primaryModel)) return "gemini-2.5-flash";
  return null;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type GeminiCallSuccess = {
  ok: true;
  model: string;
  raw: any;
};

type GeminiCallFailure = {
  ok: false;
  model: string;
  status: number | null;
  errorText: string;
  transient: boolean;
};

export const geminiProvider: AIProviderAdapter = {
  name: "gemini",
  defaultModel:
    process.env[
      "GEMINI_KNOWLEDGE_EXTRACTION_MODEL"
    ] ?? "gemini-3.6-flash",
  isConfigured() {
    return Boolean(getGeminiApiKey());
  },
  assertConfigured() {
    if (!getGeminiApiKey()) {
      throw new Error(
        "Missing GEMINI_API_KEY",
      );
    }
  },
  async extract(request) {
    this.assertConfigured();
    const primaryModel =
      request.model ?? this.defaultModel;
    const maxRetries = Math.max(
      0,
      Math.min(Math.trunc(request.maxRetries ?? 0), 4),
    );
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      request.timeoutMs ?? 60_000,
    );
    const warnings: string[] = [];
    const jsonInstruction = buildGeminiJsonInstruction(
      request.responseSchema as Record<string, unknown> | undefined,
    );

    const callModel = async (
      model: string,
      attempts: number,
    ): Promise<GeminiCallSuccess | GeminiCallFailure> => {
      const endpoint = `${
        process.env["GEMINI_BASE_URL"] ??
        "https://generativelanguage.googleapis.com/v1beta"
      }/models/${encodeURIComponent(model)}:generateContent`;
      const generationConfig = buildGeminiGenerationConfig({
        model,
        temperature: request.temperature,
        responseSchema: request.responseSchema as Record<string, unknown> | undefined,
      });
      const body = JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: [
                  request.prompt.system,
                  request.prompt.user,
                  request.input ?? "",
                  jsonInstruction ?? "",
                ]
                  .filter(Boolean)
                  .join("\n\n"),
              },
            ],
          },
        ],
        ...(Object.keys(generationConfig).length > 0
          ? { generationConfig }
          : {}),
      });

      let lastFailure: GeminiCallFailure = {
        ok: false,
        model,
        status: null,
        errorText: "Gemini request failed before receiving a response.",
        transient: true,
      };

      for (let attempt = 0; attempt < attempts; attempt += 1) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": getGeminiApiKey() ?? "",
            },
            body,
          });

          if (response.ok) {
            return {
              ok: true,
              model,
              raw: await response.json(),
            };
          }

          const errorText = await response.text();
          lastFailure = {
            ok: false,
            model,
            status: response.status,
            errorText,
            transient: isTransientGeminiStatus(response.status),
          };
          if (!lastFailure.transient || attempt >= attempts - 1) break;
        } catch (error) {
          if (controller.signal.aborted) throw error;
          lastFailure = {
            ok: false,
            model,
            status: null,
            errorText: error instanceof Error ? error.message : String(error),
            transient: true,
          };
          if (attempt >= attempts - 1) break;
        }

        await wait(geminiRetryDelayMs(attempt));
      }

      return lastFailure;
    };

    try {
      let result = await callModel(primaryModel, maxRetries + 1);
      if (!result.ok && result.transient) {
        const fallbackModel = geminiFallbackModel(primaryModel);
        if (fallbackModel) {
          warnings.push(
            `Gemini ${primaryModel} was temporarily unavailable after ${maxRetries + 1} attempt(s); used fallback ${fallbackModel}.`,
          );
          result = await callModel(fallbackModel, 1);
        }
      }

      if (!result.ok) {
        const status = result.status === null ? "network error" : `status ${result.status}`;
        throw new Error(
          `Gemini request failed with ${status} on ${result.model}: ${result.errorText}`,
        );
      }

      const raw = result.raw;
      const text =
        raw?.candidates?.[0]?.content
          ?.parts?.map(
            (part: { text?: string }) =>
              part.text ?? "",
          )
          .join("\n") ?? "";
      const usage = raw?.usageMetadata;
      const inputTokens =
        Number(
          usage?.promptTokenCount,
        ) || 0;
      const outputTokens =
        Number(
          usage?.candidatesTokenCount,
        ) || 0;

      return {
        provider: "gemini",
        model: result.model,
        text,
        json: parseJsonFromText(text),
        usage: {
          inputTokens,
          outputTokens,
          totalTokens:
            Number(
              usage?.totalTokenCount,
            ) ||
            inputTokens +
              outputTokens,
        },
        raw,
        warnings,
      };
    } finally {
      clearTimeout(timeout);
    }
  },
};

export const geminiEmptyUsage = emptyUsage;
