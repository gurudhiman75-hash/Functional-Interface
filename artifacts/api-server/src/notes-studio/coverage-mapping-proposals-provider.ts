import {
  NotesStudioSharedAIConfigurationError,
  runNotesStudioStructuredAI,
} from './shared-ai-provider';
import {
  buildCoverageProposalInstruction,
  coverageProposalJsonSchema,
  validateCoverageProposalOutput,
  type CoverageProposalInput,
  type CoverageProposalOutput,
} from './coverage-mapping-proposals';

export type CoverageProposalProviderResult = {
  provider: 'openai' | 'gemini' | 'claude';
  model: string;
  responseId: string | null;
  output: CoverageProposalOutput;
  usage: Record<string, unknown>;
};

export class CoverageProposalModelConfigurationError extends Error {}

export async function generateCoverageMappingProposals(input: CoverageProposalInput): Promise<CoverageProposalProviderResult> {
  try {
    const response = await runNotesStudioStructuredAI({
      instruction: buildCoverageProposalInstruction(input),
      schema: coverageProposalJsonSchema,
      schemaName: 'examtree_note_coverage_proposals',
      modelEnvKeys: ['NOTES_STUDIO_COVERAGE_MODEL', 'NOTES_STUDIO_MODEL'],
    });
    const output = validateCoverageProposalOutput(
      response.json,
      new Set(input.claims.map((claim) => claim.id)),
      new Set(input.coverageItems.map((item) => item.id)),
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
      throw new CoverageProposalModelConfigurationError(error.message);
    }
    throw error;
  }
}
