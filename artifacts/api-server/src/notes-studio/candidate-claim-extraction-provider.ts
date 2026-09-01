import {
  describeAIProviderError,
  extractWithAI,
  getAIProvider,
  isAIProviderConfigured,
  resolveAIProvider,
  type AIProviderName,
} from '../lib/ai-providers';
import {
  buildCandidateClaimInstruction,
  candidateClaimJsonSchema,
  validateCandidateClaimExtraction,
  type CandidateClaimExtraction,
  type ClaimExtractionInput,
} from './candidate-claim-extraction';

export type CandidateClaimProviderResult = {
  provider: AIProviderName;
  model: string;
  responseId: string | null;
  extraction: CandidateClaimExtraction;
  usage: Record<string, unknown>;
  warnings: string[];
};

export class CandidateClaimModelConfigurationError extends Error {}
export class CandidateClaimProviderRequestError extends Error {
  constructor(message: string, readonly provider: AIProviderName) {
    super(message);
  }
}

function configuredProvider(): AIProviderName {
  const explicit = String(process.env.NOTES_STUDIO_AI_PROVIDER ?? '').trim().toLowerCase();
  if (explicit === 'openai' || explicit === 'gemini' || explicit === 'claude') return explicit;
  return resolveAIProvider();
}

function configuredModel(provider: AIProviderName): string {
  return String(process.env.NOTES_STUDIO_EVIDENCE_MODEL ?? process.env.NOTES_STUDIO_MODEL ?? '').trim()
    || getAIProvider(provider).defaultModel;
}

export async function generateCandidateClaims(input: ClaimExtractionInput): Promise<CandidateClaimProviderResult> {
  const provider = configuredProvider();
  if (!isAIProviderConfigured(provider)) {
    throw new CandidateClaimModelConfigurationError(
      `No configured AI provider is available for Notes Studio candidate extraction (resolved provider: ${provider}).`,
    );
  }
  const model = configuredModel(provider);

  try {
    const response = await extractWithAI({
      provider,
      model,
      prompt: {
        system: 'Extract only atomic factual claims from the governed evidence supplied by the Notes Studio editor.',
        user: buildCandidateClaimInstruction(input),
      },
      temperature: 0,
      responseSchema: candidateClaimJsonSchema,
      responseSchemaName: 'examtree_note_candidate_claims',
      timeoutMs: 60_000,
      maxRetries: 2,
    });
    if (!response.json) {
      throw new Error(`${provider} returned no valid structured candidate-claim JSON.`);
    }
    const extraction = validateCandidateClaimExtraction(
      response.json,
      new Set(input.blocks.map((block) => block.id)),
    );
    const raw = response.raw && typeof response.raw === 'object'
      ? response.raw as Record<string, unknown>
      : null;
    return {
      provider: response.provider,
      model: response.model,
      responseId: raw && typeof raw.id === 'string' ? raw.id : null,
      extraction,
      usage: { ...response.usage },
      warnings: response.warnings,
    };
  } catch (error) {
    if (error instanceof CandidateClaimProviderRequestError) throw error;
    throw new CandidateClaimProviderRequestError(describeAIProviderError(provider, error), provider);
  }
}
