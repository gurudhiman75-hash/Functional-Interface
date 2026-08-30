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
};

export type SourceCoverageFinding = {
  code: string;
  severity: 'blocker' | 'warning' | 'info';
  message: string;
};

const depthTargets: Record<SourceCoverageDepth, { included: number; generationReady: number }> = {
  quick_revision: { included: 1, generationReady: 1 },
  standard: { included: 2, generationReady: 2 },
  comprehensive: { included: 3, generationReady: 3 },
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

export function normalizeSourceCoverageDepth(value: unknown): SourceCoverageDepth {
  return value === 'quick_revision' || value === 'comprehensive' ? value : 'standard';
}

export function assessSourceCoverage(depth: SourceCoverageDepth, sources: SourceCoverageSource[]) {
  const target = depthTargets[depth];
  const included = sources.filter((source) => source.inclusionState === 'included');
  const generationReady = included.filter((source) => isGenerationReadySource({
    retentionMode: source.retentionMode,
    extractionStatus: source.extractionStatus,
    retainedCharCount: source.retainedCharCount,
  }));
  const referenceOnly = included.filter((source) => source.rightsBasis === 'reference_only');
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
  if (generationReady.length < target.generationReady) {
    findings.push({
      code: 'INSUFFICIENT_GENERATION_READY_SOURCES',
      severity: 'blocker',
      message: `Add ${Math.max(0, target.generationReady - generationReady.length)} more source${target.generationReady - generationReady.length === 1 ? '' : 's'} whose rights and extraction state permit evidence generation.`,
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
  if (referenceOnly.length > 0) {
    findings.push({
      code: 'REFERENCE_ONLY_PRESENT',
      severity: 'info',
      message: `${referenceOnly.length} included source${referenceOnly.length === 1 ? ' is' : 's are'} provenance-only and cannot supply retained evidence text.`,
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
  if (generationReady.length < target.generationReady) recommendedNeeds.add('generation_ready_source');
  if (included.length >= 2 && publisherKeys.size < 2) recommendedNeeds.add('independent_publisher_or_domain');
  if (depth !== 'quick_revision' && included.length >= 2 && sourceTypes.size < 2) recommendedNeeds.add('alternate_source_type_if_appropriate');
  if (referenceOnly.length > 0 && generationReady.length < target.generationReady) recommendedNeeds.add('rights_permitting_extraction');
  if (failedExtraction.length > 0) recommendedNeeds.add('extraction_recovery_or_replacement');

  return {
    status,
    depth,
    targets: target,
    counts: {
      totalAttached: sources.length,
      included: included.length,
      generationReady: generationReady.length,
      referenceOnly: referenceOnly.length,
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
