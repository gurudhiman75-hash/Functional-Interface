import {
  NotesStudioSharedAIConfigurationError,
  runNotesStudioStructuredAI,
} from './shared-ai-provider';
import {
  buildQualityGroundingInstruction,
  qualityGroundingJsonSchema,
  validateQualityGroundingResult,
  type QualityGroundingInput,
  type QualityGroundingResult,
} from './quality-grounding';

export type QualityGroundingProviderResult = {
  provider: 'openai' | 'gemini' | 'claude';
  model: string;
  responseId: string | null;
  result: QualityGroundingResult;
  usage: Record<string, unknown>;
};

export class NotesStudioQualityModelConfigurationError extends Error {}

export async function verifyNotesSectionGrounding(input: QualityGroundingInput): Promise<QualityGroundingProviderResult> {
  try {
    const response = await runNotesStudioStructuredAI({
      instruction: buildQualityGroundingInstruction(input),
      schema: qualityGroundingJsonSchema,
      schemaName: 'examtree_note_quality_grounding',
      modelEnvKeys: ['NOTES_STUDIO_QA_MODEL', 'NOTES_STUDIO_MODEL'],
    });
    const allowedClaimIds = new Set(input.claims.map((claim) => claim.id));
    const result = validateQualityGroundingResult(response.json, allowedClaimIds);
    return {
      provider: response.provider,
      model: response.model,
      responseId: response.responseId,
      result,
      usage: response.usage,
    };
  } catch (error) {
    if (error instanceof NotesStudioSharedAIConfigurationError) {
      throw new NotesStudioQualityModelConfigurationError(error.message);
    }
    throw error;
  }
}
