import OpenAI from 'openai';

import {
  buildCandidateClaimInstruction,
  candidateClaimJsonSchema,
  validateCandidateClaimExtraction,
  type CandidateClaimExtraction,
  type ClaimExtractionInput,
} from './candidate-claim-extraction';

export type CandidateClaimProviderResult = {
  provider: 'openai';
  model: string;
  responseId: string | null;
  extraction: CandidateClaimExtraction;
  usage: Record<string, unknown>;
};

export class CandidateClaimModelConfigurationError extends Error {}

function configuredModel(): string {
  const model = String(process.env.NOTES_STUDIO_EVIDENCE_MODEL ?? process.env.NOTES_STUDIO_MODEL ?? '').trim();
  if (!model) throw new CandidateClaimModelConfigurationError('NOTES_STUDIO_EVIDENCE_MODEL or NOTES_STUDIO_MODEL is not configured.');
  return model;
}

function configuredApiKey(): string {
  const apiKey = String(process.env.NOTES_STUDIO_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? '').trim();
  if (!apiKey) throw new CandidateClaimModelConfigurationError('Notes Studio model API key is not configured.');
  return apiKey;
}

export async function generateCandidateClaims(input: ClaimExtractionInput): Promise<CandidateClaimProviderResult> {
  const model = configuredModel();
  const client = new OpenAI({ apiKey: configuredApiKey() });
  const response = await client.responses.create({
    model,
    input: buildCandidateClaimInstruction(input),
    text: {
      format: {
        type: 'json_schema',
        name: 'examtree_note_candidate_claims',
        strict: true,
        schema: candidateClaimJsonSchema,
      },
    },
  });
  const outputText = response.output_text?.trim();
  if (!outputText) throw new Error('Notes Studio model returned no candidate-claim output.');
  let parsed: unknown;
  try {
    parsed = JSON.parse(outputText);
  } catch {
    throw new Error('Notes Studio model returned invalid structured candidate-claim JSON.');
  }
  const extraction = validateCandidateClaimExtraction(parsed, new Set(input.blocks.map((block) => block.id)));
  const raw = response as unknown as Record<string, unknown>;
  return {
    provider: 'openai',
    model,
    responseId: typeof raw.id === 'string' ? raw.id : null,
    extraction,
    usage: raw.usage && typeof raw.usage === 'object' ? raw.usage as Record<string, unknown> : {},
  };
}
