import {
  parseJsonFromText,
  type AIProviderAdapter,
} from "./types";

function getClaudeApiKey() {
  return (
    process.env["ANTHROPIC_API_KEY"] ??
    process.env["CLAUDE_API_KEY"]
  );
}

export const claudeProvider: AIProviderAdapter = {
  name: "claude",
  defaultModel:
    process.env[
      "CLAUDE_KNOWLEDGE_EXTRACTION_MODEL"
    ] ?? "claude-3-5-haiku-latest",
  isConfigured() {
    return Boolean(getClaudeApiKey());
  },
  assertConfigured() {
    if (!getClaudeApiKey()) {
      throw new Error(
        "Missing ANTHROPIC_API_KEY",
      );
    }
  },
  async extract(request) {
    this.assertConfigured();
    const model =
      request.model ?? this.defaultModel;
    const endpoint =
      process.env["CLAUDE_BASE_URL"] ??
      "https://api.anthropic.com/v1/messages";

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
          "x-api-key":
            getClaudeApiKey() ?? "",
          "anthropic-version":
            process.env[
              "ANTHROPIC_VERSION"
            ] ?? "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          temperature:
            request.temperature ?? 0,
          system: request.prompt.system,
          messages: [
            {
              role: "user",
              content: [
                request.prompt.user,
                request.input ?? "",
              ]
                .filter(Boolean)
                .join("\n\n"),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Claude request failed with status ${response.status}: ${await response.text()}`,
        );
      }

      const raw = await response.json();
      const text =
        raw?.content
          ?.map(
            (part: { text?: string }) =>
              part.text ?? "",
          )
          .join("\n") ?? "";
      const inputTokens =
        Number(
          raw?.usage?.input_tokens,
        ) || 0;
      const outputTokens =
        Number(
          raw?.usage?.output_tokens,
        ) || 0;

      return {
        provider: "claude",
        model,
        text,
        json: parseJsonFromText(text),
        usage: {
          inputTokens,
          outputTokens,
          totalTokens:
            inputTokens + outputTokens,
        },
        raw,
        warnings: [
          request.responseSchema
            ? "Claude adapter received a schema request; JSON validity is enforced by prompt and parser, not provider-native schema mode."
            : "",
        ].filter(Boolean),
      };
    } finally {
      clearTimeout(timeout);
    }
  },
};
