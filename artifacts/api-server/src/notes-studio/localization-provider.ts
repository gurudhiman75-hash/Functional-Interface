import OpenAI from 'openai';

import type { NotesLocalizationLanguage } from './approval-versioning';

export type NotesLocalizationProviderInput = {
  languageCode: NotesLocalizationLanguage;
  sourceTitle: string;
  sourceSummary: string;
  sourceBodyMarkdown: string;
};

export type NotesLocalizationProviderResult = {
  provider: 'openai';
  model: string;
  responseId: string | null;
  usage: Record<string, unknown>;
  localizedTitle: string;
  localizedSummary: string;
  localizedBodyMarkdown: string;
};

export class NotesStudioLocalizationModelConfigurationError extends Error {}

function configuredModel(): string {
  const model = String(process.env.NOTES_STUDIO_LOCALIZATION_MODEL ?? '').trim();
  if (!model) throw new NotesStudioLocalizationModelConfigurationError('NOTES_STUDIO_LOCALIZATION_MODEL is not configured.');
  return model;
}

function configuredApiKey(): string {
  const apiKey = String(process.env.NOTES_STUDIO_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? '').trim();
  if (!apiKey) throw new NotesStudioLocalizationModelConfigurationError('Notes Studio model API key is not configured.');
  return apiKey;
}

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
  const model = configuredModel();
  const client = new OpenAI({ apiKey: configuredApiKey() });
  const response = await client.responses.create({
    model,
    input: instruction(input),
    text: {
      format: {
        type: 'json_schema',
        name: 'examtree_note_localization',
        strict: true,
        schema: outputSchema,
      },
    },
  });
  const outputText = response.output_text?.trim();
  if (!outputText) throw new Error('Notes Studio localization model returned no output.');
  let parsed: unknown;
  try {
    parsed = JSON.parse(outputText);
  } catch {
    throw new Error('Notes Studio localization model returned invalid structured JSON.');
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Notes Studio localization model returned an invalid result object.');
  }
  const row = parsed as Record<string, unknown>;
  const localizedTitle = typeof row.title === 'string' ? row.title.trim() : '';
  const localizedSummary = typeof row.summary === 'string' ? row.summary.trim() : '';
  const localizedBodyMarkdown = typeof row.bodyMarkdown === 'string' ? row.bodyMarkdown.trim() : '';
  if (!localizedTitle || !localizedSummary || !localizedBodyMarkdown) {
    throw new Error('Notes Studio localization model returned incomplete localized content.');
  }
  const raw = response as unknown as Record<string, unknown>;
  return {
    provider: 'openai',
    model,
    responseId: typeof raw.id === 'string' ? raw.id : null,
    usage: raw.usage && typeof raw.usage === 'object' ? raw.usage as Record<string, unknown> : {},
    localizedTitle,
    localizedSummary,
    localizedBodyMarkdown,
  };
}
