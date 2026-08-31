import OpenAI from 'openai';

import {
  buildCoverageProposalInstruction,
  coverageProposalJsonSchema,
  validateCoverageProposalOutput,
  type CoverageProposalInput,
  type CoverageProposalOutput,
} from './coverage-mapping-proposals';

export type CoverageProposalProviderResult = {
  provider: 'openai';
  model: string;
  responseId: string | null;
  output: CoverageProposalOutput;
  usage: Record<string, unknown>;
};

export class CoverageProposalModelConfigurationError extends Error {}

function configuredModel(): string {
  const model = String(process.env.NOTES_STUDIO_COVERAGE_MODEL ?? process.env.NOTES_STUDIO_MODEL ?? '').trim();
  if (!model) throw new CoverageProposalModelConfigurationError('NOTES_STUDIO_COVERAGE_MODEL or NOTES_STUDIO_MODEL is not configured.');
  return model;
}

function configuredApiKey(): string {
  const apiKey = String(process.env.NOTES_STUDIO_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? '').trim();
  if (!apiKey) throw new CoverageProposalModelConfigurationError('Notes Studio model API key is not configured.');
  return apiKey;
}

export async function generateCoverageMappingProposals(input: CoverageProposalInput): Promise<CoverageProposalProviderResult> {
  const model = configuredModel();
  const client = new OpenAI({ apiKey: configuredApiKey() });
  const response = await client.responses.create({
    model,
    input: buildCoverageProposalInstruction(input),
    text: {
      format: {
        type: 'json_schema',
        name: 'examtree_note_coverage_proposals',
        strict: true,
        schema: coverageProposalJsonSchema,
      },
    },
  });
  const outputText = response.output_text?.trim();
  if (!outputText) throw new Error('Notes Studio model returned no coverage-proposal output.');
  let parsed: unknown;
  try {
    parsed = JSON.parse(outputText);
  } catch {
    throw new Error('Notes Studio model returned invalid structured coverage-proposal JSON.');
  }
  const output = validateCoverageProposalOutput(
    parsed,
    new Set(input.claims.map((claim) => claim.id)),
    new Set(input.coverageItems.map((item) => item.id)),
  );
  const raw = response as unknown as Record<string, unknown>;
  return {
    provider: 'openai',
    model,
    responseId: typeof raw.id === 'string' ? raw.id : null,
    output,
    usage: raw.usage && typeof raw.usage === 'object' ? raw.usage as Record<string, unknown> : {},
  };
}
