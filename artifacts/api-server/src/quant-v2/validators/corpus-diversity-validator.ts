import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import type { EditorialRealization } from "../editorial/editorial-types";
import {
  createCorpusRealismGovernorReport,
  type CompactnessBand,
} from "../realism/corpus-realism-governor";

export type CorpusDiversitySample = {
  problem: CanonicalPercentageProblem;
  editorial: EditorialRealization;
};

export type CorpusDiversityMetrics = {
  sampleCount: number;
  subtypeCount: number;
  difficultyCoverage: Record<string, number>;
  compactnessBands: Record<CompactnessBand, number>;
  maxAbsoluteValue: number;
  overScaleCount: number;
  genericCommercialCount: number;
  topSubtypeShare: number;
};

export type CorpusDiversityValidationResult = {
  valid: boolean;
  issues: string[];
  metrics: CorpusDiversityMetrics;
};

const GENERIC_COMMERCIAL_RE =
  /\b(?:an item|a product|the product|the item|household appliance)\b/iu;

function increment(map: Record<string, number>, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

export function validateCorpusDiversity(
  samples: readonly CorpusDiversitySample[],
): CorpusDiversityValidationResult {
  const issues: string[] = [];
  const subtypeCounts: Record<string, number> = {};
  const difficultyCoverage: Record<string, number> = {};
  const compactnessBands: Record<CompactnessBand, number> = {
    ultra_compact: 0,
    compact: 0,
    balanced: 0,
  };
  let maxAbsoluteValue = 0;
  let overScaleCount = 0;
  let genericCommercialCount = 0;

  for (const sample of samples) {
    increment(subtypeCounts, sample.problem.subtype);
    increment(difficultyCoverage, sample.problem.difficulty);

    const report = createCorpusRealismGovernorReport(sample);
    compactnessBands[report.metrics.compactnessBand] += 1;
    maxAbsoluteValue = Math.max(
      maxAbsoluteValue,
      report.metrics.maxAbsoluteValue,
    );
    if (report.metrics.maxAbsoluteValue > 1_000_000) {
      overScaleCount += 1;
    }
    if (
      ["profit_loss", "increase_then_decrease", "restore_original"].includes(
        sample.problem.subtype,
      ) &&
      GENERIC_COMMERCIAL_RE.test(sample.editorial.stem)
    ) {
      genericCommercialCount += 1;
    }
  }

  const sampleCount = samples.length;
  const topSubtypeShare =
    sampleCount === 0
      ? 0
      : Math.max(0, ...Object.values(subtypeCounts)) / sampleCount;

  if (sampleCount === 0) {
    issues.push("Corpus audit has no samples.");
  }
  if (overScaleCount > 0) {
    issues.push(`${overScaleCount} samples exceed the preferred 10 lakh scale.`);
  }
  if (genericCommercialCount > Math.max(1, sampleCount * 0.02)) {
    issues.push("Generic commercial object wording is overused.");
  }
  if ((compactnessBands.ultra_compact / Math.max(1, sampleCount)) > 0.35) {
    issues.push("Ultra-compact stems are overrepresented.");
  }
  if (topSubtypeShare > 0.35) {
    issues.push("One subtype dominates the corpus distribution.");
  }
  for (const difficulty of ["easy", "medium", "hard"]) {
    if (!difficultyCoverage[difficulty]) {
      issues.push(`Missing ${difficulty} difficulty layer.`);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    metrics: {
      sampleCount,
      subtypeCount: Object.keys(subtypeCounts).length,
      difficultyCoverage,
      compactnessBands,
      maxAbsoluteValue,
      overScaleCount,
      genericCommercialCount,
      topSubtypeShare,
    },
  };
}

