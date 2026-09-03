import {
  NotesStudioSharedAIConfigurationError,
  runNotesStudioStructuredAI,
} from './shared-ai-provider';
import {
  buildCoverageBatchReviewInstruction,
  coverageBatchReviewJsonSchema,
  validateCoverageBatchReviewOutput,
  type CoverageBatchReviewInput,
  type CoverageBatchReviewOutput,
} from './coverage-batch-review';

export type CoverageBatchReviewProviderResult = {
  provider: 'openai' | 'gemini' | 'claude';
  model: string;
  responseId: string | null;
  output: CoverageBatchReviewOutput;
  usage: Record<string, unknown>;
};

export class CoverageBatchReviewModelConfigurationError extends Error {}

export async function generateCoverageBatchReview(input: CoverageBatchReviewInput): Promise<CoverageBatchReviewProviderResult> {
  try {
    const response = await runNotesStudioStructuredAI({
      instruction: buildCoverageBatchReviewInstruction(input),
      schema: coverageBatchReviewJsonSchema,
      schemaName: 'examtree_note_coverage_batch_review',
      modelEnvKeys: ['NOTES_STUDIO_COVERAGE_MODEL', 'NOTES_STUDIO_MODEL'],
    });
    const output = validateCoverageBatchReviewOutput(
      response.json,
      new Set(input.claims.map((claim) => claim.id)),
      input.coverageItems.map((item) => item.id),
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
      throw new CoverageBatchReviewModelConfigurationError(error.message);
    }
    throw error;
  }
}
