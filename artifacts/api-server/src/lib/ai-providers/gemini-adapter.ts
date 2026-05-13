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

export const geminiProvider: AIProviderAdapter = {
  name: "gemini",
  defaultModel:
    process.env[
      "GEMINI_KNOWLEDGE_EXTRACTION_MODEL"
    ] ?? "gemini-1.5-flash",
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
    }/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(getGeminiApiKey() ?? "")}`;

    const controller =
      new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      request.timeoutMs ?? 60_000,
    );

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
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
          generationConfig: {
            temperature:
              request.temperature ?? 0,
            responseMimeType:
              "application/json",
          },
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

