import { isGenerationReadySource } from './source-library';

export type SourceCoverageDepth = 'quick_revision' | 'standard' | 'comprehensive';
export type SourceCoverageStatus = 'ready' | 'usable_with_warnings' | 'needs_sources';

export type SourceCoverageSource = {
  id: string;
  sourceType: string;
  sourceUri: string;
  publisher: string | null;
  rightsBasis: string;
  retentionMode: string;
  extractionStatus: string;
  retainedCharCount: number;
  inclusionState: string;
  referenceEvidenceCount?: number;
};

export type SourceCoverageFinding = {
  code: string;
  severity: 'blocker' | 'warning' | 'info';
  message: string;
};

const depthTargets: Record<SourceCoverageDepth, { included: number; evidenceReady: number }> = {
  quick_revision: { included: 1, evidenceReady: 1 },
  standard: { included: 2, evidenceReady: 2 },
  comprehensive: { included: 3, evidenceReady: 3 },
};

function publisherIdentity(source: SourceCoverageSource): string | null {
  const publisher = source.publisher?.trim().toLowerCase();
  if (publisher) return publisher;
  try {
    const host = new URL(source.sourceUri).hostname.trim().toLowerCase();
    return host || null;
  } catch {
    return null;
  }
}

function retainedEvidenceReady(source: SourceCoverageSource): boolean {
  return isGenerationReadySource({
    retentionMode: source.retentionMode,
    extractionStatus: source.extractionStatus,
    retainedCharCount: source.retainedCharCount,
  });
}

function reviewedReferenceEvidenceReady(source: SourceCoverageSource): boolean {
  return Number(source.referenceEvidenceCount ?? 0) > 0;
}

export function normalizeSourceCoverageDepth(value: unknown): SourceCoverageDepth {
  return value === 'quick_revision' || value === 'comprehensive' ? value : 'standard';
}

export function assessSourceCoverage(depth: SourceCoverageDepth, sources: SourceCoverageSource[]) {
  const target = depthTargets[depth];
  const included = sources.filter((source) => source.inclusionState === 'included');
  const generationReady = included.filter(retainedEvidenceReady);
  const referenceEvidenceReady = included.filter(reviewedReferenceEvidenceReady);
  const evidenceReady = included.filter((source) => retainedEvidenceReady(source) || reviewedReferenceEvidenceReady(source));
  const referenceOnly = included.filter((source) => source.rightsBasis === 'reference_only');
  const referenceOnlyWithoutEvidence = referenceOnly.filter((source) => !reviewedReferenceEvidenceReady(source));
  const failedExtraction = included.filter((source) => source.extractionStatus === 'failed');
  const publisherKeys = new Set(included.map(publisherIdentity).filter((value): value is string => Boolean(value)));
  const sourceTypes = new Set(included.map((source) => source.sourceType).filter(Boolean));

  const findings: SourceCoverageFinding[] = [];
  if (included.length < target.included) {
    findings.push({
      code: 'INSUFFICIENT_INCLUDED_SOURCES',
      severity: 'blocker',
      message: `${depth === 'quick_revision' ? 'Quick revision' : depth === 'comprehensive' ? 'Comprehensive' : 'Standard'} notes should include at least ${target.included} governed source${target.included === 1 ? '' : 's'}.`,
    });
  }
  if (evidenceReady.length < target.evidenceReady) {
    findings.push({
      code: 'INSUFFICIENT_EVIDENCE_READY_SOURCES',
      severity: 'blocker',
      message: `Add ${Math.max(0, target.evidenceReady - evidenceReady.length)} more source${target.evidenceReady - evidenceReady.length === 1 ? '' : 's'} with either authorized retained evidence text or reviewed reference evidence.`,
    });
  }
  if (included.length >= 2 && publisherKeys.size < 2) {
    findings.push({
      code: 'SOURCE_MONOCULTURE',
      severity: 'warning',
      message: 'The source pack depends on one identifiable publisher/domain. Add an independent source when possible.',
    });
  }
  if (depth !== 'quick_revision' && included.length >= 2 && sourceTypes.size < 2) {
    findings.push({
      code: 'SINGLE_SOURCE_TYPE',
      severity: 'warning',
      message: 'All included sources use the same source type. A second source type can improve cross-checking when appropriate.',
    });
  }
  if (referenceEvidenceReady.length > 0) {
    findings.push({
      code: 'REFERENCE_EVIDENCE_PRESENT',
      severity: 'info',
      message: `${referenceEvidenceReady.length} included source${referenceEvidenceReady.length === 1 ? ' has' : 's have'} reviewed editor reference evidence without retaining publisher wording.`,
    });
  }
  if (referenceOnlyWithoutEvidence.length > 0) {
    findings.push({
      code: 'REFERENCE_ONLY_WITHOUT_EVIDENCE',
      severity: 'info',
      message: `${referenceOnlyWithoutEvidence.length} included reference-only source${referenceOnlyWithoutEvidence.length === 1 ? ' still needs' : 's still need'} reviewed reference evidence before counting toward evidence sufficiency.`,
    });
  }
  if (failedExtraction.length > 0) {
    findings.push({
      code: 'EXTRACTION_FAILURES_PRESENT',
      severity: 'warning',
      message: `${failedExtraction.length} included source${failedExtraction.length === 1 ? ' has' : 's have'} an extraction failure that should be resolved or excluded.`,
    });
  }

  const blockers = findings.filter((finding) => finding.severity === 'blocker');
  const warnings = findings.filter((finding) => finding.severity === 'warning');
  const status: SourceCoverageStatus = blockers.length > 0
    ? 'needs_sources'
    : warnings.length > 0
      ? 'usable_with_warnings'
      : 'ready';

  const recommendedNeeds = new Set<string>();
  if (included.length < target.included) recommendedNeeds.add('more_governed_sources');
  if (evidenceReady.length < target.evidenceReady) recommendedNeeds.add('evidence_ready_source');
  if (referenceOnlyWithoutEvidence.length > 0) recommendedNeeds.add('review_reference_only_source');
  if (included.length >= 2 && publisherKeys.size < 2) recommendedNeeds.add('independent_publisher_or_domain');
  if (depth !== 'quick_revision' && included.length >= 2 && sourceTypes.size < 2) recommendedNeeds.add('alternate_source_type_if_appropriate');
  if (failedExtraction.length > 0) recommendedNeeds.add('extraction_recovery_or_replacement');

  return {
    status,
    depth,
    targets: {
      included: target.included,
      evidenceReady: target.evidenceReady,
      // Backward-compatible alias for older admin clients. New UI should use evidenceReady.
      generationReady: target.evidenceReady,
    },
    counts: {
      totalAttached: sources.length,
      included: included.length,
      evidenceReady: evidenceReady.length,
      generationReady: generationReady.length,
      referenceEvidenceReady: referenceEvidenceReady.length,
      referenceOnly: referenceOnly.length,
      referenceOnlyWithoutEvidence: referenceOnlyWithoutEvidence.length,
      failedExtraction: failedExtraction.length,
      independentPublishersOrDomains: publisherKeys.size,
      sourceTypes: sourceTypes.size,
    },
    findings,
    recommendedNeeds: [...recommendedNeeds],
    evidenceExtractionHardBlocked: false,
    automaticSourceDiscovery: false,
    automaticSourceAttachment: false,
  };
}