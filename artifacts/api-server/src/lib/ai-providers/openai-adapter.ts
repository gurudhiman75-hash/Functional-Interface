import {
  openai,
  requireOpenAIApiKey,
} from "../openai";
import {
  emptyUsage,
  parseJsonFromText,
  type AIProviderAdapter,
  type AIProviderResponse,
} from "./types";

function responseText(response: any) {
  if (
    typeof response?.output_text ===
    "string"
  ) {
    return response.output_text;
  }

  const fragments: string[] = [];
  for (const item of response?.output ?? []) {
    for (const content of item.content ?? []) {
      if (
        typeof content.text === "string"
      ) {
        fragments.push(content.text);
      }
    }
  }
  return fragments.join("\n");
}

function usageFromResponse(response: any) {
  return {
    inputTokens:
      Number(
        response?.usage?.input_tokens,
      ) || 0,
    outputTokens:
      Number(
        response?.usage?.output_tokens,
      ) || 0,
    totalTokens:
      Number(
        response?.usage?.total_tokens,
      ) || 0,
  };
}

export const openAIProvider: AIProviderAdapter = {
  name: "openai",
  defaultModel:
    process.env[
      "OPENAI_KNOWLEDGE_EXTRACTION_MODEL"
    ] ?? "gpt-4.1-mini",
  isConfigured() {
    return Boolean(
      process.env["OPENAI_API_KEY"],
    );
  },
  assertConfigured() {
    requireOpenAIApiKey();
  },
  async extract(request) {
    this.assertConfigured();

    const model =
      request.model ?? this.defaultModel;
    const payload: Record<string, unknown> = {
      model,
      input: [
        {
          role: "system",
          content: request.prompt.system,
        },
        {
          role: "user",
          content: request.input
            ? `${request.prompt.user}\n\n${request.input}`
            : request.prompt.user,
        },
      ],
      temperature:
        request.temperature ?? 0,
    };

    if (request.responseSchema) {
      payload.text = {
        format: {
          type: "json_schema",
          name:
            request.responseSchemaName ??
            "examtree_ai_output",
          strict: true,
          schema: request.responseSchema,
        },
      };
    }

    const response =
      await openai.responses.create(
        payload as any,
        {
          timeout: request.timeoutMs,
          maxRetries:
            request.maxRetries ?? 0,
        } as any,
      );
    const text = responseText(response);
    return {
      provider: "openai",
      model,
      text,
      json: parseJsonFromText(text),
      usage:
        usageFromResponse(response),
      raw: response,
      warnings: [],
    } satisfies AIProviderResponse;
  },
};

export function normalizeProviderError(
  provider: string,
  error: unknown,
) {
  const err = error as {
    message?: string;
    code?: string;
    status?: number;
    cause?: {
      message?: string;
      code?: string;
    };
  };
  const parts = [
    err.status
      ? `status ${err.status}`
      : "",
    err.code ? `code ${err.code}` : "",
    err.message ?? String(error),
    err.cause?.code
      ? `cause ${err.cause.code}`
      : "",
    err.cause?.message,
  ].filter(Boolean);
  const raw = parts.join(" - ");

  if (/connection error/i.test(raw)) {
    return [
      `${provider} connection failed.`,
      "Check backend internet access, proxy/firewall rules, API key, and provider base URL if you use a gateway.",
    ].join(" ");
  }

  return raw;
}

export const noUsage = emptyUsage;

