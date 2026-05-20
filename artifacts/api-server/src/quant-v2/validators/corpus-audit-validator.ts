import type { CorpusAuditExportItem, CorpusAuditSummary } from "../corpus-audit/corpus-audit-types";

export interface CorpusAuditValidationResult {
  valid: boolean;
  issues: string[];
  warnings: string[];
  metrics: {
    repeatedStructureCount: number;
    topologyDominancePercent: number;
    genericObjectCount: number;
    numericScaleAnomalyCount: number;
    hindiCoveragePercent: number;
    punjabiCoveragePercent: number;
  };
}

const GENERIC_OBJECT_RE = /\b(an item|a product|a thing)\b/i;
const LARGE_NUMBER_RE = /\b\d{7,}\b/;

function maxDistributionShare(distribution: Record<string, number>, total: number) {
  if (total <= 0) return 0;
  return Math.max(0, ...Object.values(distribution)) / total;
}

export function validateCorpusAuditBatch(input: {
  samples: CorpusAuditExportItem[];
  summary: CorpusAuditSummary;
}): CorpusAuditValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  const openings = new Map<string, number>();
  let genericObjectCount = 0;
  let numericScaleAnomalyCount = 0;

  for (const sample of input.samples) {
    const opening = sample.question.split(/\s+/).slice(0, 6).join(" ").toLowerCase();
    openings.set(opening, (openings.get(opening) ?? 0) + 1);

    if (GENERIC_OBJECT_RE.test(sample.question)) {
      genericObjectCount += 1;
    }

    if (LARGE_NUMBER_RE.test(sample.question)) {
      numericScaleAnomalyCount += 1;
    }

    if (!sample.multilingual.hi?.question) {
      warnings.push(`sample ${sample.index} is missing Hindi realization`);
    }

    if (!sample.multilingual.pa?.question) {
      warnings.push(`sample ${sample.index} is missing Punjabi realization`);
    }
  }

  const repeatedStructureCount = [...openings.values()].filter((count) => count > 5).length;
  const topologyDominancePercent = Math.round(
    maxDistributionShare(
      input.summary.topologyDistribution,
      Math.max(input.summary.generatedCount, 1),
    ) * 100,
  );

  if (topologyDominancePercent > 65 && input.summary.generatedCount >= 100) {
    issues.push(`topology distribution is dominated by one topology (${topologyDominancePercent}%)`);
  }

  if (genericObjectCount > Math.max(3, input.summary.generatedCount * 0.02)) {
    issues.push("generic commercial/object wording appears too often");
  }

  if (numericScaleAnomalyCount > Math.max(2, input.summary.generatedCount * 0.03)) {
    warnings.push("large numeric scales appear often enough to review");
  }

  if (input.summary.multilingualConsistency.hindiCoverage < 0.98) {
    issues.push("Hindi coverage is below audit threshold");
  }

  if (input.summary.multilingualConsistency.punjabiCoverage < 0.98) {
    issues.push("Punjabi coverage is below audit threshold");
  }

  for (const warning of input.summary.repeatedStructureWarnings) {
    warnings.push(warning);
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
    metrics: {
      repeatedStructureCount,
      topologyDominancePercent,
      genericObjectCount,
      numericScaleAnomalyCount,
      hindiCoveragePercent: Math.round(input.summary.multilingualConsistency.hindiCoverage * 100),
      punjabiCoveragePercent: Math.round(input.summary.multilingualConsistency.punjabiCoverage * 100),
    },
  };
}
