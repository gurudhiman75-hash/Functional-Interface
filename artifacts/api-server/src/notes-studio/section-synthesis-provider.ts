import {
  NotesStudioSharedAIConfigurationError,
  runNotesStudioStructuredAI,
} from './shared-ai-provider';
import {
  buildSectionSynthesisInstruction,
  sectionSynthesisJsonSchema,
  validateGeneratedSection,
  type GeneratedSection,
  type SectionSynthesisInput,
} from './section-synthesis';

export type SectionSynthesisProviderResult = {
  provider: 'openai' | 'gemini' | 'claude';
  model: string;
  responseId: string | null;
  section: GeneratedSection;
  usage: Record<string, unknown>;
};

export class NotesStudioModelConfigurationError extends Error {}

export async function generateNotesSection(
  input: SectionSynthesisInput,
): Promise<SectionSynthesisProviderResult> {
  try {
    const response = await runNotesStudioStructuredAI({
      instruction: buildSectionSynthesisInstruction(input),
      schema: sectionSynthesisJsonSchema,
      schemaName: 'examtree_note_section',
      modelEnvKeys: ['NOTES_STUDIO_SECTION_MODEL', 'NOTES_STUDIO_MODEL'],
    });
    const allowedClaimIds = new Set(input.claims.map((claim) => claim.id));
    const section = validateGeneratedSection(response.json, allowedClaimIds);
    return {
      provider: response.provider,
      model: response.model,
      responseId: response.responseId,
      section,
      usage: response.usage,
    };
  } catch (error) {
    if (error instanceof NotesStudioSharedAIConfigurationError) {
      throw new NotesStudioModelConfigurationError(error.message);
    }
    throw error;
  }
}
