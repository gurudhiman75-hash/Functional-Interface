import OpenAI from 'openai';

import {
  buildQualityGroundingInstruction,
  qualityGroundingJsonSchema,
  validateQualityGroundingResult,
  type QualityGroundingInput,
  type QualityGroundingResult,
} from './quality-grounding';

export type QualityGroundingProviderResult = {
  provider: 'openai';
  model: string;
  responseId: string | null;
  result: QualityGroundingResult;
  usage: Record<string, unknown>;
};

export class NotesStudioQualityModelConfigurationError extends Error {}

function configuredModel(): string {
  const model = String(process.env.NOTES_STUDIO_QA_MODEL ?? process.env.NOTES_STUDIO_MODEL ?? '').trim();
  if (!model) throw new NotesStudioQualityModelConfigurationError('NOTES_STUDIO_QA_MODEL or NOTES_STUDIO_MODEL is not configured.');
  return model;
}

function configuredApiKey(): string {
  const apiKey = String(process.env.NOTES_STUDIO_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? '').trim();
  if (!apiKey) throw new NotesStudioQualityModelConfigurationError('Notes Studio model API key is not configured.');
  return apiKey;
}

export async function verifyNotesSectionGrounding(input: QualityGroundingInput): Promise<QualityGroundingProviderResult> {
  const model = configuredModel();
  const client = new OpenAI({ apiKey: configuredApiKey() });
  const response = await client.responses.create({
    model,
    input: buildQualityGroundingInstruction(input),
    text: {
      format: {
        type: 'json_schema',
        name: 'examtree_note_quality_grounding',
        strict: true,
        schema: qualityGroundingJsonSchema,
      },
    },
  });
  const outputText = response.output_text?.trim();
  if (!outputText) throw new Error('Notes Studio grounding verifier returned no output.');
  let parsed: unknown;
  try {
    parsed = JSON.parse(outputText);
  } catch {
    throw new Error('Notes Studio grounding verifier returned invalid structured JSON.');
  }
  const allowedClaimIds = new Set(input.claims.map((claim) => claim.id));
  const result = validateQualityGroundingResult(parsed, allowedClaimIds);
  const raw = response as unknown as Record<string, unknown>;
  return {
    provider: 'openai',
    model,
    responseId: typeof raw.id === 'string' ? raw.id : null,
    result,
    usage: raw.usage && typeof raw.usage === 'object' ? raw.usage as Record<string, unknown> : {},
  };
}
