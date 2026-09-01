import {
  NotesStudioSharedAIConfigurationError,
  runNotesStudioStructuredAI,
} from './shared-ai-provider';
import {
  buildCoverageGapResearchInstruction,
  coverageGapResearchJsonSchema,
  validateCoverageGapResearchOutput,
  type CoverageGapResearchInput,
  type CoverageGapResearchOutput,
} from './coverage-gap-research';

export type CoverageGapResearchProviderResult = {
  provider: 'openai' | 'gemini' | 'claude';
  model: string;
  responseId: string | null;
  output: CoverageGapResearchOutput;
  usage: Record<string, unknown>;
};

export class CoverageGapResearchModelConfigurationError extends Error {}

export async function generateCoverageGapResearchBriefs(
  input: CoverageGapResearchInput,
): Promise<CoverageGapResearchProviderResult> {
  try {
    const response = await runNotesStudioStructuredAI({
      instruction: buildCoverageGapResearchInstruction(input),
      schema: coverageGapResearchJsonSchema,
      schemaName: 'examtree_note_coverage_gap_research',
      modelEnvKeys: ['NOTES_STUDIO_RESEARCH_MODEL', 'NOTES_STUDIO_COVERAGE_MODEL', 'NOTES_STUDIO_MODEL'],
    });
    const output = validateCoverageGapResearchOutput(
      response.json,
      new Set(input.gaps.map((gap) => gap.id)),
    );
    return {
      provider: response.provider,
      model: response.model,
      responseId: response.responseId,
      output,
      usage: response.usage,
    };
  } catch (error) {
    if (error instanceof NotesStudioSharedAIConfigurationError) {
      throw new CoverageGapResearchModelConfigurationError(error.message);
    }
    throw error;
  }
}
