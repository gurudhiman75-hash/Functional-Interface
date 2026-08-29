import OpenAI from 'openai';

import {
  buildSectionSynthesisInstruction,
  sectionSynthesisJsonSchema,
  validateGeneratedSection,
  type GeneratedSection,
  type SectionSynthesisInput,
} from './section-synthesis';

export type SectionSynthesisProviderResult = {
  provider: 'openai';
  model: string;
  responseId: string | null;
  section: GeneratedSection;
  usage: Record<string, unknown>;
};

export class NotesStudioModelConfigurationError extends Error {}

function configuredModel(): string {
  const model = String(process.env.NOTES_STUDIO_MODEL ?? '').trim();
  if (!model) throw new NotesStudioModelConfigurationError('NOTES_STUDIO_MODEL is not configured.');
  return model;
}

function configuredApiKey(): string {
  const apiKey = String(process.env.NOTES_STUDIO_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? '').trim();
  if (!apiKey) throw new NotesStudioModelConfigurationError('Notes Studio model API key is not configured.');
  return apiKey;
}

export async function generateNotesSection(
  input: SectionSynthesisInput,
): Promise<SectionSynthesisProviderResult> {
  const model = configuredModel();
  const client = new OpenAI({ apiKey: configuredApiKey() });
  const instruction = buildSectionSynthesisInstruction(input);
  const response = await client.responses.create({
    model,
    input: instruction,
    text: {
      format: {
        type: 'json_schema',
        name: 'examtree_note_section',
        strict: true,
        schema: sectionSynthesisJsonSchema,
      },
    },
  });
  const outputText = response.output_text?.trim();
  if (!outputText) throw new Error('Notes Studio model returned no section output.');
  let parsed: unknown;
  try {
    parsed = JSON.parse(outputText);
  } catch {
    throw new Error('Notes Studio model returned invalid structured JSON.');
  }
  const allowedClaimIds = new Set(input.claims.map((claim) => claim.id));
  const section = validateGeneratedSection(parsed, allowedClaimIds);
  const raw = response as unknown as Record<string, unknown>;
  return {
    provider: 'openai',
    model,
    responseId: typeof raw.id === 'string' ? raw.id : null,
    section,
    usage: raw.usage && typeof raw.usage === 'object' ? raw.usage as Record<string, unknown> : {},
  };
}
