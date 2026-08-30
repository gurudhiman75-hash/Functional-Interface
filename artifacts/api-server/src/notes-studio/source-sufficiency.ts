export type NoteSourceDepth = 'quick_revision' | 'standard' | 'comprehensive';

export type SourceSufficiencyInput = {
  id: string;
  sourceType: string;
  sourceUri: string;
  title: string;
  publisher: string;
  contentHash: string;
  rightsBasis: string;
  retentionMode: string;
  extractionStatus: string;
  retainedCharCount: number;
  capturedAt?: string | null;
};

export type SourceSufficiencyIssue = {
  code: string;
  severity: 'blocking' | 'warning';
  message: string;
};

export type SourceSufficiencyResult = {
  depth: NoteSourceDepth;
  status: 'insufficient' | 'review' | 'sufficient';
  policy: {
    minUniqueGenerationReadySources: number;
    minSourceIdentities: number;
  };
  summary: {
    includedSourceCount: number;
    uniqueContentCount: number;
    uniqueGenerationReadyCount: number;
    sourceIdentityCount: number;
    referenceOnlyCount: number;
    extractionFailureCount: number;
    missingPublisherCount: number;
    officialOrInstitutionalCount: number;
  };
  issues: SourceSufficiencyIssue[];
  recommendedActions: Array<{ code: string; message: string }>;
};

const DEPTH_POLICY: Record<NoteSourceDepth, { minUniqueGenerationReadySources: number; minSourceIdentities: number }> = {
  quick_revision: { minUniqueGenerationReadySources: 1, minSourceIdentities: 1 },
  standard: { minUniqueGenerationReadySources: 2, minSourceIdentities: 2 },
  comprehensive: { minUniqueGenerationReadySources: 3, minSourceIdentities: 2 },
};

export function normalizeSourceDepth(value: unknown): NoteSourceDepth {
  const depth = String(value ?? '').trim().toLowerCase();
  if (depth === 'quick_revision' || depth === 'comprehensive') return depth;
  return 'standard';
}

export function sourceIdentity(source: Pick<SourceSufficiencyInput, 'publisher' | 'sourceUri'>): string {
  const publisher = source.publisher.trim().toLowerCase().replace(/\s+/g, ' ');
  if (publisher) return `publisher:${publisher}`;
  try {
    const host = new URL(source.sourceUri).hostname.toLowerCase().replace(/^www\./, '');
    if (host) return `host:${host}`;
  } catch {
    // Uploaded files without publisher metadata intentionally collapse into one unknown identity.
  }
  return 'unknown';
}

export function isGenerationReadyForSufficiency(source: Pick<SourceSufficiencyInput, 'retentionMode' | 'extractionStatus' | 'retainedCharCount'>): boolean {
  return source.retentionMode === 'extracted_text'
    && source.extractionStatus === 'processed'
    && source.retainedCharCount >= 100;
}

export function isOfficialOrInstitutionalSource(source: Pick<SourceSufficiencyInput, 'publisher' | 'sourceUri'>): boolean {
  const publisher = source.publisher.trim().toLowerCase();
  const institutionalPublisher = /(government|govt\.?|ministry|department|commission|board|university|institute|ncert|rbi|reserve bank|sebi|isro|pib)/i.test(publisher);
  if (institutionalPublisher) return true;
  try {
    const host = new URL(source.sourceUri).hostname.toLowerCase().replace(/^www\./, '');
    return host.endsWith('.gov.in')
      || host.endsWith('.nic.in')
      || host === 'rbi.org.in'
      || host.endsWith('.rbi.org.in')
      || host === 'sebi.gov.in'
      || host.endsWith('.sebi.gov.in')
      || host === 'isro.gov.in'
      || host.endsWith('.isro.gov.in')
      || host === 'pib.gov.in'
      || host.endsWith('.pib.gov.in');
  } catch {
    return false;
  }
}

export function evaluateSourceSufficiency(depthValue: unknown, sources: SourceSufficiencyInput[]): SourceSufficiencyResult {
  const depth = normalizeSourceDepth(depthValue);
  const policy = DEPTH_POLICY[depth];
  const uniqueByHash = new Map<string, SourceSufficiencyInput>();
  for (const source of sources) {
    const hash = source.contentHash.trim().toLowerCase();
    if (!uniqueByHash.has(hash)) uniqueByHash.set(hash, source);
  }
  const uniqueSources = [...uniqueByHash.values()];
  const generationReady = uniqueSources.filter(isGenerationReadyForSufficiency);
  const identities = new Set(generationReady.map(sourceIdentity));
  const referenceOnlyCount = sources.filter((source) => source.retentionMode === 'metadata_only' || source.rightsBasis === 'reference_only').length;
  const extractionFailureCount = sources.filter((source) => source.extractionStatus === 'failed').length;
  const missingPublisherCount = sources.filter((source) => !source.publisher.trim()).length;
  const officialOrInstitutionalCount = uniqueSources.filter(isOfficialOrInstitutionalSource).length;

  const issues: SourceSufficiencyIssue[] = [];
  const recommendedActions: Array<{ code: string; message: string }> = [];

  if (sources.length === 0) {
    issues.push({ code: 'NO_INCLUDED_SOURCES', severity: 'blocking', message: 'The source pack has no included sources.' });
    recommendedActions.push({ code: 'ADD_SOURCE', message: 'Attach or reuse at least one governed source.' });
  }

  if (generationReady.length < policy.minUniqueGenerationReadySources) {
    const missing = policy.minUniqueGenerationReadySources - generationReady.length;
    issues.push({
      code: 'NOT_ENOUGH_GENERATION_READY_SOURCES',
      severity: 'blocking',
      message: `${depth.replaceAll('_', ' ')} notes require ${policy.minUniqueGenerationReadySources} unique generation-ready source(s); ${generationReady.length} currently qualify.`,
    });
    recommendedActions.push({
      code: 'ADD_GENERATION_READY_SOURCE',
      message: `Add ${missing} more unique source${missing === 1 ? '' : 's'} whose rights policy permits retained extracted text.`,
    });
  }

  if (generationReady.length > 0 && identities.size < policy.minSourceIdentities) {
    issues.push({
      code: 'INSUFFICIENT_SOURCE_DIVERSITY',
      severity: 'blocking',
      message: `${depth.replaceAll('_', ' ')} notes require generation-ready evidence from at least ${policy.minSourceIdentities} independent publisher/host identities; ${identities.size} currently qualify.`,
    });
    recommendedActions.push({
      code: 'ADD_INDEPENDENT_SOURCE',
      message: 'Add a generation-ready source from a different publisher or host instead of another copy from the same source identity.',
    });
  }

  if (uniqueSources.length < sources.length) {
    issues.push({
      code: 'DUPLICATE_CONTENT_HASHES',
      severity: 'warning',
      message: `${sources.length - uniqueSources.length} included source link(s) duplicate content already present in the pack and do not increase evidence breadth.`,
    });
    recommendedActions.push({ code: 'REMOVE_DUPLICATE_CONTENT', message: 'Exclude duplicate-content sources unless they are needed for provenance comparison.' });
  }

  if (extractionFailureCount > 0) {
    issues.push({ code: 'EXTRACTION_FAILURES', severity: 'warning', message: `${extractionFailureCount} included source(s) have failed extraction.` });
    recommendedActions.push({ code: 'REVIEW_EXTRACTION_FAILURES', message: 'Retry, replace, or exclude failed-extraction sources before relying on the pack.' });
  }

  if (sources.length > 1 && referenceOnlyCount > Math.floor(sources.length / 2)) {
    issues.push({
      code: 'PROVENANCE_ONLY_CONCENTRATION',
      severity: 'warning',
      message: 'More than half of the included sources are provenance-only and cannot supply generation evidence.',
    });
    recommendedActions.push({ code: 'BALANCE_RETENTION', message: 'Add rights-cleared generation-ready sources so provenance-only references do not dominate the pack.' });
  }

  if (missingPublisherCount > 0) {
    issues.push({ code: 'MISSING_PUBLISHER_METADATA', severity: 'warning', message: `${missingPublisherCount} included source(s) do not identify a publisher.` });
    recommendedActions.push({ code: 'ADD_PUBLISHER_METADATA', message: 'Prefer sources with explicit publisher identity so source diversity can be reviewed accurately.' });
  }

  if (depth === 'comprehensive' && officialOrInstitutionalCount === 0) {
    issues.push({
      code: 'NO_OFFICIAL_OR_INSTITUTIONAL_REFERENCE',
      severity: 'warning',
      message: 'No official or institutional reference is present. Add one when the topic has an authoritative primary source.',
    });
    recommendedActions.push({ code: 'CONSIDER_PRIMARY_REFERENCE', message: 'Where applicable, add an official, government, university, regulator, or established institutional reference.' });
  }

  const blocking = issues.some((issue) => issue.severity === 'blocking');
  return {
    depth,
    status: blocking ? 'insufficient' : issues.length > 0 ? 'review' : 'sufficient',
    policy,
    summary: {
      includedSourceCount: sources.length,
      uniqueContentCount: uniqueSources.length,
      uniqueGenerationReadyCount: generationReady.length,
      sourceIdentityCount: identities.size,
      referenceOnlyCount,
      extractionFailureCount,
      missingPublisherCount,
      officialOrInstitutionalCount,
    },
    issues,
    recommendedActions,
  };
}
