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

export const geminiProvider: AIProviderAdapter = {
  name: "gemini",
  defaultModel:
    process.env[
      "GEMINI_KNOWLEDGE_EXTRACTION_MODEL"
    ] ?? "gemini-3.7-flash",
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
    const model =
      request.model ?? this.defaultModel;
    const endpoint = `${
      process.env["GEMINI_BASE_URL"] ??
      "https://generativelanguage.googleapis.com/v1beta"
    }/models/${encodeURIComponent(model)}:generateContent`;

    const controller =
      new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      request.timeoutMs ?? 60_000,
    );

    const generationConfig: Record<string, unknown> = {};
    if (!isGemini3Model(model)) {
      generationConfig.temperature =
        request.temperature ?? 0;
    }
    if (request.responseSchema) {
      generationConfig.responseMimeType =
        "application/json";
      generationConfig.responseSchema =
        request.responseSchema;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key":
            getGeminiApiKey() ?? "",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: [
                    request.prompt.system,
                    request.prompt.user,
                    request.input ?? "",
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
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Gemini request failed with status ${response.status}: ${await response.text()}`,
        );
      }

      const raw = await response.json();
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
        model,
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
        warnings: [],
      };
    } finally {
      clearTimeout(timeout);
    }
  },
};

export const geminiEmptyUsage = emptyUsage;
