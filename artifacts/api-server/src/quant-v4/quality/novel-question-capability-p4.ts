export const QUANT_V4_NOVEL_QUESTION_CAPABILITY_AUTHORITY =
  "QUANT-V4-NOVEL-QUESTION-CAPABILITY-P4" as const;

export type NoveltyEvidenceTier =
  | "MATHEMATICAL_FINGERPRINT"
  | "PARAMETER_STATE"
  | "STRUCTURAL_ONLY";

export interface NovelQuestionObservation {
  readonly id: string;
  readonly packageId: string;
  readonly canonicalProblemId?: string | null;
  readonly patternId?: string | null;
  readonly exactStem: string;
  readonly structuralSignature: string;
  readonly mathematicalStateSignature?: string | null;
  readonly parameterStateSignature?: string | null;
  readonly seedGroup?: string | null;
}

export interface NovelQuestionCapabilityThresholds {
  readonly maxExactDuplicateRate: number;
  readonly maxStructuralDuplicateRate: number;
  readonly minHeldOutStructuralNoveltyRate: number;
  readonly minPatternBreadth: number;
  readonly minCanonicalProblemBreadth: number;
  readonly minStateNoveltyRate: number;
  readonly minSeedSensitivityRate: number;
  readonly maxCosmeticReskinRate: number;
}

export const DEFAULT_NOVEL_QUESTION_CAPABILITY_THRESHOLDS: NovelQuestionCapabilityThresholds =
  Object.freeze({
    maxExactDuplicateRate: 0.05,
    maxStructuralDuplicateRate: 0.10,
    minHeldOutStructuralNoveltyRate: 0.15,
    minPatternBreadth: 8,
    minCanonicalProblemBreadth: 3,
    minStateNoveltyRate: 0.70,
    minSeedSensitivityRate: 0.60,
    maxCosmeticReskinRate: 0.15,
  });

function normalized(value: unknown): string {
  return String(value ?? "").normalize("NFKC").replace(/\s+/gu, " ").trim();
}

function duplicateSummary(values: readonly string[]) {
  const filtered = values.map(normalized).filter(Boolean);
  const counts = new Map<string, number>();
  for (const value of filtered) counts.set(value, (counts.get(value) ?? 0) + 1);
  const duplicateItems = [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return Object.freeze({
    records: filtered.length,
    unique: counts.size,
    duplicateItems,
    duplicateRate: filtered.length ? duplicateItems / filtered.length : 0,
  });
}

function cosmeticReskinSummary(observations: readonly NovelQuestionObservation[]) {
  const groups = new Map<string, NovelQuestionObservation[]>();
  for (const row of observations) {
    const key = normalized(row.structuralSignature);
    if (!key) continue;
    const bucket = groups.get(key) ?? [];
    bucket.push(row);
    groups.set(key, bucket);
  }

  let cosmeticReskinItems = 0;
  for (const rows of groups.values()) {
    if (rows.length < 2) continue;
    const uniqueExact = new Set(rows.map((row) => normalized(row.exactStem)).filter(Boolean)).size;
    cosmeticReskinItems += Math.max(0, uniqueExact - 1);
  }

  return Object.freeze({
    records: observations.length,
    cosmeticReskinItems,
    rate: observations.length ? cosmeticReskinItems / observations.length : 0,
  });
}

function stateEvidence(observations: readonly NovelQuestionObservation[]) {
  const mathematical = observations
    .map((row) => normalized(row.mathematicalStateSignature))
    .filter(Boolean);
  if (mathematical.length === observations.length && observations.length > 0) {
    return {
      tier: "MATHEMATICAL_FINGERPRINT" as const,
      ...duplicateSummary(mathematical),
    };
  }

  const parameter = observations
    .map((row) => normalized(row.parameterStateSignature))
    .filter(Boolean);
  if (parameter.length === observations.length && observations.length > 0) {
    return {
      tier: "PARAMETER_STATE" as const,
      ...duplicateSummary(parameter),
    };
  }

  return {
    tier: "STRUCTURAL_ONLY" as const,
    ...duplicateSummary(observations.map((row) => row.structuralSignature)),
  };
}

function heldOutStructuralNovelty(observations: readonly NovelQuestionObservation[]) {
  if (observations.length < 2) {
    return Object.freeze({ trainingRecords: observations.length, heldOutRecords: 0, unseenHeldOutStructures: 0, rate: 0 });
  }
  const split = Math.max(1, Math.floor(observations.length / 2));
  const training = observations.slice(0, split);
  const heldOut = observations.slice(split);
  const seen = new Set(training.map((row) => normalized(row.structuralSignature)).filter(Boolean));
  const heldOutStructures = heldOut.map((row) => normalized(row.structuralSignature)).filter(Boolean);
  const unseen = heldOutStructures.filter((signature) => !seen.has(signature)).length;
  return Object.freeze({
    trainingRecords: training.length,
    heldOutRecords: heldOutStructures.length,
    unseenHeldOutStructures: unseen,
    rate: heldOutStructures.length ? unseen / heldOutStructures.length : 0,
  });
}

function seedSensitivity(observations: readonly NovelQuestionObservation[]) {
  const groups = new Map<string, NovelQuestionObservation[]>();
  for (const row of observations) {
    const key = [
      normalized(row.packageId),
      normalized(row.canonicalProblemId),
      normalized(row.patternId),
    ].join("|");
    const bucket = groups.get(key) ?? [];
    bucket.push(row);
    groups.set(key, bucket);
  }

  const eligible = [...groups.entries()].filter(([, rows]) => rows.length >= 2);
  let sensitiveGroups = 0;
  const insensitiveGroups: string[] = [];

  for (const [key, rows] of eligible) {
    const stateSignatures = rows
      .map((row) => normalized(row.mathematicalStateSignature) || normalized(row.parameterStateSignature))
      .filter(Boolean);
    const exactStems = new Set(rows.map((row) => normalized(row.exactStem)).filter(Boolean));
    const stateSensitive = stateSignatures.length >= 2 && new Set(stateSignatures).size >= 2;
    const surfaceSensitive = exactStems.size >= 2;
    if (stateSensitive || (!stateSignatures.length && surfaceSensitive)) sensitiveGroups += 1;
    else insensitiveGroups.push(key);
  }

  return Object.freeze({
    comparableGroups: eligible.length,
    sensitiveGroups,
    insensitiveGroups: Object.freeze(insensitiveGroups),
    rate: eligible.length ? sensitiveGroups / eligible.length : 0,
  });
}

export function auditNovelQuestionCapability(
  observations: readonly NovelQuestionObservation[],
  thresholds: NovelQuestionCapabilityThresholds = DEFAULT_NOVEL_QUESTION_CAPABILITY_THRESHOLDS,
) {
  const usable = observations.filter((row) => normalized(row.exactStem) && normalized(row.structuralSignature));
  const exact = duplicateSummary(usable.map((row) => row.exactStem));
  const structural = duplicateSummary(usable.map((row) => row.structuralSignature));
  const cosmeticReskins = cosmeticReskinSummary(usable);
  const state = stateEvidence(usable);
  const heldOut = heldOutStructuralNovelty(usable);
  const seedSensitivityResult = seedSensitivity(usable);
  const patternBreadth = new Set(usable.map((row) => normalized(row.patternId)).filter(Boolean)).size;
  const canonicalProblemBreadth = new Set(usable.map((row) => normalized(row.canonicalProblemId)).filter(Boolean)).size;
  const packageBreadth = new Set(usable.map((row) => normalized(row.packageId)).filter(Boolean)).size;
  const stateNoveltyRate = state.records ? state.unique / state.records : 0;

  const blockers: string[] = [];
  if (exact.duplicateRate > thresholds.maxExactDuplicateRate) blockers.push("EXACT_STEM_DUPLICATION_HIGH");
  if (structural.duplicateRate > thresholds.maxStructuralDuplicateRate) blockers.push("STRUCTURAL_REUSE_HIGH");
  if (cosmeticReskins.rate > thresholds.maxCosmeticReskinRate) blockers.push("COSMETIC_RESKIN_RATE_HIGH");
  if (heldOut.rate < thresholds.minHeldOutStructuralNoveltyRate) blockers.push("HELD_OUT_STRUCTURAL_NOVELTY_LOW");
  if (patternBreadth < thresholds.minPatternBreadth) blockers.push("PATTERN_BREADTH_LOW");
  if (canonicalProblemBreadth < thresholds.minCanonicalProblemBreadth) blockers.push("CANONICAL_PROBLEM_BREADTH_LOW");
  if (state.tier !== "STRUCTURAL_ONLY" && stateNoveltyRate < thresholds.minStateNoveltyRate) {
    blockers.push("MATHEMATICAL_STATE_NOVELTY_LOW");
  }
  if (seedSensitivityResult.comparableGroups > 0 && seedSensitivityResult.rate < thresholds.minSeedSensitivityRate) {
    blockers.push("SEED_SENSITIVITY_LOW");
  }
  if (state.tier === "STRUCTURAL_ONLY") blockers.push("MATHEMATICAL_STATE_FINGERPRINT_MISSING");

  return Object.freeze({
    authority: QUANT_V4_NOVEL_QUESTION_CAPABILITY_AUTHORITY,
    records: usable.length,
    packageBreadth,
    patternBreadth,
    canonicalProblemBreadth,
    exact,
    structural,
    cosmeticReskins,
    state,
    stateNoveltyRate,
    heldOutStructuralNovelty: heldOut,
    seedSensitivity: seedSensitivityResult,
    thresholds,
    blockers: Object.freeze(blockers),
    auditComplete: blockers.length === 0,
  });
}
