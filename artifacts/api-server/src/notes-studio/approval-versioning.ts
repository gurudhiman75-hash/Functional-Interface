import { createHash } from 'node:crypto';

import { evaluateTranslationQuality } from '../lib/admin-translation-operations';

export type ApprovedSectionInput = {
  id: string;
  title: string;
  sortOrder: number;
  markdown: string;
  outputFingerprint: string;
  qualityRunId: string;
  evidenceFingerprint: string;
};

export type ApprovalVersionInput = {
  jobId: string;
  sourceLanguage: string;
  learnerTitle: string;
  learnerSummary: string;
  examIds: string[];
  brief: Record<string, unknown>;
  sections: ApprovedSectionInput[];
};

export type NotesLocalizationLanguage = 'hi' | 'pa';

export type NotesLocalizationQuality = {
  shared: ReturnType<typeof evaluateTranslationQuality>;
  expectedScriptPresent: boolean;
  headingCountMatches: boolean;
  missingUrls: string[];
  ready: boolean;
};

function normalized(value: string): string {
  return value.normalize('NFKC').replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trim();
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function buildApprovedBody(sections: ApprovedSectionInput[]): string {
  return [...sections]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
    .map((section) => `## ${normalized(section.title)}\n\n${normalized(section.markdown)}`)
    .join('\n\n')
    .trim();
}

export function approvalVersionFingerprint(input: ApprovalVersionInput): string {
  const bodyMarkdown = buildApprovedBody(input.sections);
  const stable = JSON.stringify({
    jobId: input.jobId,
    sourceLanguage: normalized(input.sourceLanguage).toLowerCase(),
    learnerTitle: normalized(input.learnerTitle),
    learnerSummary: normalized(input.learnerSummary),
    bodyMarkdown,
    examIds: [...new Set(input.examIds)].sort(),
    brief: input.brief,
    sections: [...input.sections]
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
      .map((section) => ({
        id: section.id,
        outputFingerprint: section.outputFingerprint,
        qualityRunId: section.qualityRunId,
        evidenceFingerprint: section.evidenceFingerprint,
      })),
  });
  return sha256(stable);
}

export function approvedContentHash(args: { title: string; summary: string; bodyMarkdown: string }): string {
  return sha256(JSON.stringify({
    title: normalized(args.title),
    summary: normalized(args.summary),
    bodyMarkdown: normalized(args.bodyMarkdown),
  }));
}

export function canonicalNotePublicCode(versionId: string, languageCode?: string): string {
  const core = versionId.replace(/[^a-f0-9]/gi, '').slice(0, 16).toUpperCase();
  const suffix = languageCode ? `_${languageCode.toUpperCase()}` : '';
  return `NOTE_${core}${suffix}`;
}

function expectedScriptPresent(value: string, languageCode: NotesLocalizationLanguage): boolean {
  const pattern = languageCode === 'hi' ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
  return pattern.test(value);
}

function headingCount(value: string): number {
  return value.split('\n').filter((line) => /^#{1,6}\s+\S/.test(line.trim())).length;
}

function urls(value: string): string[] {
  const matches = value.match(/https:\/\/[^\s)\]>]+/g) ?? [];
  return [...new Set(matches.map((url) => url.replace(/[.,;:!?]+$/g, '')).filter(Boolean))].sort();
}

export function evaluateNotesLocalization(args: {
  sourceTitle: string;
  sourceSummary: string;
  sourceBodyMarkdown: string;
  localizedTitle: string;
  localizedSummary: string;
  localizedBodyMarkdown: string;
  languageCode: NotesLocalizationLanguage;
}): NotesLocalizationQuality {
  const sourceExplanation = `${normalized(args.sourceSummary)}\n\n${normalized(args.sourceBodyMarkdown)}`;
  const targetExplanation = `${normalized(args.localizedSummary)}\n\n${normalized(args.localizedBodyMarkdown)}`;
  const shared = evaluateTranslationQuality({
    source: { stem: normalized(args.sourceTitle), explanation: sourceExplanation, options: [] },
    target: { stem: normalized(args.localizedTitle), explanation: targetExplanation, options: [] },
    languageCode: args.languageCode,
    terms: [],
  });
  const composite = `${args.localizedTitle}\n${args.localizedSummary}\n${args.localizedBodyMarkdown}`;
  const expectedScript = expectedScriptPresent(composite, args.languageCode);
  const sourceUrls = urls(`${args.sourceTitle}\n${args.sourceSummary}\n${args.sourceBodyMarkdown}`);
  const targetUrls = new Set(urls(composite));
  const missingUrls = sourceUrls.filter((url) => !targetUrls.has(url));
  const headingsMatch = headingCount(args.sourceBodyMarkdown) === headingCount(args.localizedBodyMarkdown);
  return {
    shared,
    expectedScriptPresent: expectedScript,
    headingCountMatches: headingsMatch,
    missingUrls,
    ready: shared.approvable && expectedScript && headingsMatch && missingUrls.length === 0,
  };
}

export function localizationContentHash(args: {
  approvedVersionId: string;
  sourceContentHash: string;
  languageCode: NotesLocalizationLanguage;
  title: string;
  summary: string;
  bodyMarkdown: string;
}): string {
  return sha256(JSON.stringify({
    approvedVersionId: args.approvedVersionId,
    sourceContentHash: args.sourceContentHash,
    languageCode: args.languageCode,
    title: normalized(args.title),
    summary: normalized(args.summary),
    bodyMarkdown: normalized(args.bodyMarkdown),
  }));
}
