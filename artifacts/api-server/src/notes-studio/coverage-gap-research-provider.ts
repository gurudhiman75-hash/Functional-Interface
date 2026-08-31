import OpenAI from 'openai';

import {
  buildCoverageGapResearchInstruction,
  coverageGapResearchJsonSchema,
  validateCoverageGapResearchOutput,
  type CoverageGapResearchInput,
  type CoverageGapResearchOutput,
} from './coverage-gap-research';

export type CoverageGapResearchProviderResult = {
  provider: 'openai';
  model: string;
  responseId: string | null;
  output: CoverageGapResearchOutput;
  usage: Record<string, unknown>;
};

export class CoverageGapResearchModelConfigurationError extends Error {}

function configuredModel(): string {
  const model = String(
    process.env.NOTES_STUDIO_RESEARCH_MODEL
    ?? process.env.NOTES_STUDIO_COVERAGE_MODEL
    ?? process.env.NOTES_STUDIO_MODEL
    ?? '',
  ).trim();
  if (!model) throw new CoverageGapResearchModelConfigurationError('NOTES_STUDIO_RESEARCH_MODEL, NOTES_STUDIO_COVERAGE_MODEL or NOTES_STUDIO_MODEL is not configured.');
  return model;
}

function configuredApiKey(): string {
  const apiKey = String(process.env.NOTES_STUDIO_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? '').trim();
  if (!apiKey) throw new CoverageGapResearchModelConfigurationError('Notes Studio model API key is not configured.');
  return apiKey;
}

export async function generateCoverageGapResearchBriefs(
  input: CoverageGapResearchInput,
): Promise<CoverageGapResearchProviderResult> {
  const model = configuredModel();
  const client = new OpenAI({ apiKey: configuredApiKey() });
  const response = await client.responses.create({
    model,
    input: buildCoverageGapResearchInstruction(input),
    text: {
      format: {
        type: 'json_schema',
        name: 'examtree_note_coverage_gap_research',
        strict: true,
        schema: coverageGapResearchJsonSchema,
      },
    },
  });
  const outputText = response.output_text?.trim();
  if (!outputText) throw new Error('Notes Studio model returned no coverage-gap research output.');
  let parsed: unknown;
  try {
    parsed = JSON.parse(outputText);
  } catch {
    throw new Error('Notes Studio model returned invalid structured coverage-gap research JSON.');
  }
  const output = validateCoverageGapResearchOutput(parsed, new Set(input.gaps.map((gap) => gap.id)));
  const raw = response as unknown as Record<string, unknown>;
  return {
    provider: 'openai',
    model,
    responseId: typeof raw.id === 'string' ? raw.id : null,
    output,
    usage: raw.usage && typeof raw.usage === 'object' ? raw.usage as Record<string, unknown> : {},
  };
}
