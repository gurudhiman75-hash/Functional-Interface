export type AIProviderName =
  | "openai"
  | "gemini"
  | "claude";

export type AIProviderPrompt = {
  system: string;
  user: string;
};

export type AIProviderUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type AIProviderRequest = {
  provider?: AIProviderName;
  model?: string;
  prompt: AIProviderPrompt;
  input?: string;
  temperature?: number;
  responseSchema?: unknown;
  responseSchemaName?: string;
  timeoutMs?: number;
  maxRetries?: number;
};

export type AIProviderResponse = {
  provider: AIProviderName;
  model: string;
  text: string;
  json: unknown | null;
  usage: AIProviderUsage;
  raw?: unknown;
  warnings: string[];
};

export interface AIProviderAdapter {
  name: AIProviderName;
  defaultModel: string;
  isConfigured(): boolean;
  assertConfigured(): void;
  extract(
    request: Omit<
      AIProviderRequest,
      "provider"
    >,
  ): Promise<AIProviderResponse>;
}

export function emptyUsage(): AIProviderUsage {
  return {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  };
}

export function parseJsonFromText(
  text: string,
): unknown | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(
      /```(?:json)?\s*([\s\S]*?)```/i,
    );
    if (match?.[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch {
        return null;
      }
    }
    return null;
  }
}

