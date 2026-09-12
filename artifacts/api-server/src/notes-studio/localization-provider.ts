import type { NotesLocalizationLanguage } from './approval-versioning';
import {
  NotesStudioSharedAIConfigurationError,
  runNotesStudioStructuredAI,
} from './shared-ai-provider';

export type NotesLocalizationProviderInput = {
  languageCode: NotesLocalizationLanguage;
  sourceTitle: string;
  sourceSummary: string;
  sourceBodyMarkdown: string;
};

export type NotesLocalizationProviderResult = {
  provider: 'openai' | 'gemini' | 'claude';
  model: string;
  responseId: string | null;
  usage: Record<string, unknown>;
  localizedTitle: string;
  localizedSummary: string;
  localizedBodyMarkdown: string;
};

export class NotesStudioLocalizationModelConfigurationError extends Error {}

const outputSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'summary', 'bodyMarkdown'],
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    bodyMarkdown: { type: 'string' },
  },
} as const;

function instruction(input: NotesLocalizationProviderInput): string {
  const target = input.languageCode === 'hi' ? 'Hindi (Devanagari)' : 'Punjabi (Gurmukhi)';
  return [
    'You are localizing an already approved Examtree learner note.',
    `Translate the title, summary and Markdown body into ${target}.`,
    'The approved source text below is the only authority. Do not add facts, examples, dates, numbers, claims, caveats or explanations.',
    'Preserve every numeric value, percentage, unit, date, proper noun where translation would change identity, URL, Markdown link target, table structure and heading count.',
    'Keep the same information density and exam-oriented meaning. Do not shorten away facts.',
    'Use natural target-language educational prose; avoid copying whole English sentences when a normal translation exists.',
    'Return only the requested structured object.',
    '',
    `SOURCE TITLE:\n${input.sourceTitle}`,
    '',
    `SOURCE SUMMARY:\n${input.sourceSummary}`,
    '',
    `SOURCE MARKDOWN:\n${input.sourceBodyMarkdown}`,
  ].join('\n');
}

export async function generateNotesLocalization(input: NotesLocalizationProviderInput): Promise<NotesLocalizationProviderResult> {
  try {
    const response = await runNotesStudioStructuredAI({
      instruction: instruction(input),
      schema: outputSchema,
      schemaName: 'examtree_note_localization',
      modelEnvKeys: ['NOTES_STUDIO_LOCALIZATION_MODEL', 'NOTES_STUDIO_MODEL'],
      timeoutMs: 90_000,
    });
    if (!response.json || typeof response.json !== 'object' || Array.isArray(response.json)) {
      throw new Error('Notes Studio localization model returned an invalid result object.');
    }
    const row = response.json as Record<string, unknown>;
    const localizedTitle = typeof row.title === 'string' ? row.title.trim() : '';
    const localizedSummary = typeof row.summary === 'string' ? row.summary.trim() : '';
    const localizedBodyMarkdown = typeof row.bodyMarkdown === 'string' ? row.bodyMarkdown.trim() : '';
    if (!localizedTitle || !localizedSummary || !localizedBodyMarkdown) {
      throw new Error('Notes Studio localization model returned incomplete localized content.');
    }
    return {
      provider: response.provider,
      model: response.model,
      responseId: response.responseId,
      usage: response.usage,
      localizedTitle,
      localizedSummary,
      localizedBodyMarkdown,
    };
  } catch (error) {
    if (error instanceof NotesStudioSharedAIConfigurationError) {
      throw new NotesStudioLocalizationModelConfigurationError(error.message);
    }
    throw error;
  }
}
