import {
  describeAIProviderError,
  extractWithAI,
  getAIProvider,
  isAIProviderConfigured,
  resolveAIProvider,
  type AIProviderName,
} from '../lib/ai-providers';

export class NotesStudioSharedAIConfigurationError extends Error {}
export class NotesStudioSharedAIRequestError extends Error {
  constructor(message: string, readonly provider: AIProviderName) {
    super(message);
  }
}

export type NotesStudioStructuredAIResult = {
  provider: AIProviderName;
  model: string;
  responseId: string | null;
  json: unknown;
  usage: Record<string, unknown>;
  warnings: string[];
};

export function resolveNotesStudioAIProvider(): AIProviderName {
  const explicit = String(process.env.NOTES_STUDIO_AI_PROVIDER ?? '').trim().toLowerCase();
  if (explicit === 'openai' || explicit === 'gemini' || explicit === 'claude') return explicit;
  return resolveAIProvider();
}

export function resolveNotesStudioModel(
  provider: AIProviderName,
  envKeys: string[],
): string {
  for (const key of envKeys) {
    const configured = String(process.env[key] ?? '').trim();
    if (configured) return configured;
  }
  return getAIProvider(provider).defaultModel;
}

export function notesStudioAIConfigured(provider = resolveNotesStudioAIProvider()): boolean {
  return isAIProviderConfigured(provider);
}

export async function runNotesStudioStructuredAI(args: {
  instruction: string;
  schema: unknown;
  schemaName: string;
  modelEnvKeys: string[];
  system?: string;
  timeoutMs?: number;
  maxRetries?: number;
}): Promise<NotesStudioStructuredAIResult> {
  const provider = resolveNotesStudioAIProvider();
  if (!isAIProviderConfigured(provider)) {
    throw new NotesStudioSharedAIConfigurationError(
      `No configured AI provider is available for Notes Studio (resolved provider: ${provider}).`,
    );
  }
  const model = resolveNotesStudioModel(provider, args.modelEnvKeys);

  try {
    const response = await extractWithAI({
      provider,
      model,
      prompt: {
        system: args.system ?? 'Follow the governed Notes Studio instruction exactly. Return only the requested structured result.',
        user: args.instruction,
      },
      temperature: 0,
      responseSchema: args.schema,
      responseSchemaName: args.schemaName,
      timeoutMs: args.timeoutMs ?? 60_000,
      maxRetries: args.maxRetries ?? 2,
    });
    if (response.json === null) {
      throw new Error(`${provider} returned no valid structured JSON.`);
    }
    const raw = response.raw && typeof response.raw === 'object'
      ? response.raw as Record<string, unknown>
      : null;
    return {
      provider: response.provider,
      model: response.model,
      responseId: raw && typeof raw.id === 'string' ? raw.id : null,
      json: response.json,
      usage: { ...response.usage },
      warnings: response.warnings,
    };
  } catch (error) {
    if (error instanceof NotesStudioSharedAIConfigurationError) throw error;
    if (error instanceof NotesStudioSharedAIRequestError) throw error;
    throw new NotesStudioSharedAIRequestError(describeAIProviderError(provider, error), provider);
  }
}
