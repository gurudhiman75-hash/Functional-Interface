export type QuantV4MaturityStage =
  | "EXPERIMENTAL"
  | "FOUNDATION_READY"
  | "CONTENT_READY"
  | "PRODUCTION_READY";

export interface QuantV4MaturitySignals {
  solverPasses?: boolean;
  validatorPasses?: boolean;
  rendererPasses?: boolean;
  canonicalProblemCoverageComplete?: boolean;
  effectiveFamilyCount?: number;
  minimumEffectiveFamilyCount?: number;
  duplicateRate?: number;
  maximumDuplicateRate?: number;
  contextDiversityCount?: number;
  minimumContextDiversityCount?: number;
  structureDiversityCount?: number;
  minimumStructureDiversityCount?: number;
  humanReviewComplete?: boolean;
  languageCompleteness?: boolean;
  educationalQualityVerified?: boolean;
  performanceValidated?: boolean;
}

export interface QuantV4MaturityEvaluation {
  stage: QuantV4MaturityStage;
  passed: Record<QuantV4MaturityStage, boolean>;
  blockers: Record<QuantV4MaturityStage, string[]>;
}

function pass(value: unknown) {
  return value === true;
}

function minimum(actual = 0, required = 0) {
  return actual >= required;
}

function maximum(actual = 1, allowed = 1) {
  return actual <= allowed;
}

function foundationBlockers(signals: QuantV4MaturitySignals) {
  const blockers: string[] = [];
  if (!pass(signals.solverPasses)) blockers.push("solver must pass");
  if (!pass(signals.validatorPasses)) blockers.push("validator must pass");
  if (!pass(signals.rendererPasses)) blockers.push("renderer must pass");
  if (!pass(signals.canonicalProblemCoverageComplete)) blockers.push("canonical-problem coverage must be complete");
  return blockers;
}

function contentBlockers(signals: QuantV4MaturitySignals) {
  const blockers = foundationBlockers(signals);
  if (!minimum(signals.effectiveFamilyCount, signals.minimumEffectiveFamilyCount)) blockers.push("effective family threshold must pass");
  if (!maximum(signals.duplicateRate, signals.maximumDuplicateRate)) blockers.push("duplicate-rate threshold must pass");
  if (!minimum(signals.contextDiversityCount, signals.minimumContextDiversityCount)) blockers.push("context diversity threshold must pass");
  if (!minimum(signals.structureDiversityCount, signals.minimumStructureDiversityCount)) blockers.push("structure diversity threshold must pass");
  return blockers;
}

function productionBlockers(signals: QuantV4MaturitySignals) {
  const blockers = contentBlockers(signals);
  if (!pass(signals.humanReviewComplete)) blockers.push("human review must be complete");
  if (!pass(signals.languageCompleteness)) blockers.push("language completeness must be verified");
  if (!pass(signals.educationalQualityVerified)) blockers.push("educational quality must be verified");
  if (!pass(signals.performanceValidated)) blockers.push("performance must be validated");
  return blockers;
}

export function evaluateQuantV4Maturity(signals: QuantV4MaturitySignals): QuantV4MaturityEvaluation {
  const blockers = {
    EXPERIMENTAL: [],
    FOUNDATION_READY: foundationBlockers(signals),
    CONTENT_READY: contentBlockers(signals),
    PRODUCTION_READY: productionBlockers(signals),
  } satisfies Record<QuantV4MaturityStage, string[]>;

  const passed = {
    EXPERIMENTAL: true,
    FOUNDATION_READY: blockers.FOUNDATION_READY.length === 0,
    CONTENT_READY: blockers.CONTENT_READY.length === 0,
    PRODUCTION_READY: blockers.PRODUCTION_READY.length === 0,
  } satisfies Record<QuantV4MaturityStage, boolean>;

  const stage: QuantV4MaturityStage = passed.PRODUCTION_READY
    ? "PRODUCTION_READY"
    : passed.CONTENT_READY
      ? "CONTENT_READY"
      : passed.FOUNDATION_READY
        ? "FOUNDATION_READY"
        : "EXPERIMENTAL";

  return { stage, passed, blockers };
}

export const QUANT_V4_MATURITY_POLICY = {
  stages: ["EXPERIMENTAL", "FOUNDATION_READY", "CONTENT_READY", "PRODUCTION_READY"] as const,
  duplicateRateBlocksFrom: "CONTENT_READY" as const,
  note: "Duplicate rate is intentionally non-blocking for FOUNDATION_READY so mathematical runtime work can freeze before content richness work is complete.",
};
