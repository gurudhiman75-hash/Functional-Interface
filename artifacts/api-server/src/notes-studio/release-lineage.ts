import { approvedContentHash, localizationContentHash, type NotesLocalizationLanguage } from './approval-versioning';

export type LearnerResourceSnapshot = {
  title: string;
  summary: string;
  bodyMarkdown: string;
};

export function sourceResourceMatchesFrozenVersion(args: {
  frozenContentHash: string;
  resource: LearnerResourceSnapshot;
}): boolean {
  return approvedContentHash(args.resource) === args.frozenContentHash;
}

export function localizedResourceMatchesFrozenVersion(args: {
  approvedVersionId: string;
  sourceContentHash: string;
  frozenContentHash: string;
  languageCode: NotesLocalizationLanguage;
  resource: LearnerResourceSnapshot;
}): boolean {
  const currentHash = localizationContentHash({
    approvedVersionId: args.approvedVersionId,
    sourceContentHash: args.sourceContentHash,
    languageCode: args.languageCode,
    title: args.resource.title,
    summary: args.resource.summary,
    bodyMarkdown: args.resource.bodyMarkdown,
  });
  return currentHash === args.frozenContentHash;
}

export function successorJobTitle(baseTitle: string, revisionNumber: number): string {
  const normalizedBase = baseTitle.trim() || 'Notes Studio note';
  return `${normalizedBase} — revision ${revisionNumber}`.slice(0, 240);
}
