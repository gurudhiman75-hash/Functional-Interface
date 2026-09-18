import assert from "node:assert/strict";

import {
  generateQuestion as generateQuantQuestion,
} from "../question-studio-review-engine";

const SECTIONS = 20;
const GEOMETRY_SLOTS_PER_SECTION = 5;
const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI";

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function extractBatchQuestions(batch: any): any[] {
  if (Array.isArray(batch?.questions)) return batch.questions;
  if (Array.isArray(batch?.questionPackages)) return batch.questionPackages;
  return [];
}

function questionText(question: any): string {
  return String(question?.text ?? question?.stem ?? question?.question ?? "").trim();
}

function normalizeStemSignature(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/₹|\brs\.?\b|\binr\b/giu, "<money>")
    .replace(/-?\d+(?:\.\d+)?/gu, "<n>")
    .replace(/\b[a-e]\b/giu, "<option>")
    .replace(/[^a-z<>%+*/=\-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function countBy<T>(items: readonly T[], key: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const value = key(item) || "UNKNOWN";
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)));
}

function duplicateSummary(signatures: readonly string[]) {
  const values = signatures.filter(Boolean);
  const counts = countBy(values, (value) => value);
  const duplicateItems = Object.values(counts).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return {
    records: values.length,
    uniqueSignatures: Object.keys(counts).length,
    duplicateItems,
    duplicateRate: values.length ? duplicateItems / values.length : 0,
  };
}

function metadata(question: any) {
  const candidates = [
    question,
    question?.metadata,
    question?.debugMetadata,
    question?.traceability,
    question?.realism,
    question?.proceduralLogic,
    question?.logic,
  ].filter((value) => value && typeof value === "object");

  const first = (...keys: string[]) => {
    for (const source of candidates) {
      for (const key of keys) {
        const value = source?.[key];
        if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
      }
    }
    return "UNKNOWN";
  };

  return {
    canonicalProblemId: first("canonicalProblemId", "cpId"),
    patternId: first("patternId", "questionLanguageId", "qlId"),
    solveMode: first("solveMode", "taskKind", "questionType"),
    stemVariantId: first("stemVariantId"),
    objectVariantId: first("objectVariantId"),
  };
}

type MenRecord = Readonly<{
  sectionIndex: number;
  geometrySlotIndex: number;
  seed: string;
  canonicalProblemId: string;
  patternId: string;
  solveMode: string;
  stemVariantId: string;
  objectVariantId: string;
  literalStem: string;
  normalizedStem: string;
}>;

const records: MenRecord[] = [];
for (let sectionIndex = 1; sectionIndex <= SECTIONS; sectionIndex += 1) {
  const sectionSeed = `${SEED_PREFIX}:shadow:${sectionIndex}`;
  for (let geometrySlotIndex = 0; geometrySlotIndex < GEOMETRY_SLOTS_PER_SECTION; geometrySlotIndex += 1) {
    const seed = `${sectionSeed}:GEOMETRY_MENSURATION:${geometrySlotIndex}`;
    // The shadow pool is sorted [GEO-001, MEN-002]. Both are healthy in the
    // current proof, so an odd start hash selects MEN-002 for this slot.
    if (hash(seed) % 2 !== 1) continue;

    const batch = await generateQuantQuestion({
      packageId: "MEN-002" as any,
      language: "en",
      examProfile: "SSC_CGL_TIER_I",
      seed,
      count: 1,
    } as any);
    const question = extractBatchQuestions(batch)[0];
    assert.ok(question, `MEN-002 returned no question for ${seed}.`);
    const info = metadata(question);
    const literalStem = questionText(question);
    records.push({
      sectionIndex,
      geometrySlotIndex,
      seed,
      ...info,
      literalStem,
      normalizedStem: normalizeStemSignature(literalStem),
    });
  }
}

assert.equal(records.length, 50, "The current 20-section shadow sample is expected to select MEN-002 in 50/100 Geometry/Mensuration slots.");
assert.ok(records.every((record) => record.literalStem.length > 0), "Every MEN-002 sample must expose a learner-facing stem.");

const literalDuplication = duplicateSummary(records.map((record) => record.literalStem.toLowerCase().replace(/\s+/g, " ").trim()));
const normalizedDuplication = duplicateSummary(records.map((record) => record.normalizedStem));
const cpDistribution = countBy(records, (record) => record.canonicalProblemId);
const patternDistribution = countBy(records, (record) => record.patternId);
const solveModeDistribution = countBy(records, (record) => record.solveMode);
const stemVariantDistribution = countBy(records, (record) => record.stemVariantId);
const objectVariantDistribution = countBy(records, (record) => record.objectVariantId);

const normalizedByCp = Object.fromEntries(
  Object.keys(cpDistribution).map((cpId) => {
    const subset = records.filter((record) => record.canonicalProblemId === cpId);
    return [cpId, duplicateSummary(subset.map((record) => record.normalizedStem))];
  }),
);
const normalizedByPattern = Object.fromEntries(
  Object.keys(patternDistribution).map((patternId) => {
    const subset = records.filter((record) => record.patternId === patternId);
    return [patternId, duplicateSummary(subset.map((record) => record.normalizedStem))];
  }),
);

const TARGETED_REPEAT_PATTERNS = [
  "MEN-002-QL-022",
  "MEN-002-QL-026",
  "MEN-002-QL-033",
  "MEN-002-QL-044",
  "MEN-002-QL-054",
] as const;

const targetedPatternVariety = Object.fromEntries(
  TARGETED_REPEAT_PATTERNS.map((patternId) => {
    const subset = records.filter((record) => record.patternId === patternId);
    return [patternId, {
      records: subset.length,
      duplication: duplicateSummary(subset.map((record) => record.normalizedStem)),
      stemVariants: countBy(subset, (record) => record.stemVariantId),
      seeds: subset.map((record) => record.seed),
    }] as const;
  }),
);

for (const patternId of TARGETED_REPEAT_PATTERNS) {
  const summary = targetedPatternVariety[patternId];
  assert.ok(
    summary.records > 1,
    `${patternId}: targeted MEN-002 repetition proof requires more than one observed shadow record.`,
  );
  assert.equal(
    summary.duplication.duplicateItems,
    0,
    `${patternId}: targeted presentation remediation must remove normalized stem duplicates.`,
  );
}

const repeatedNormalizedFamilies = Object.entries(countBy(records, (record) => record.normalizedStem))
  .filter(([, count]) => count > 1)
  .map(([signature, count]) => ({
    count,
    signature,
    cpIds: [...new Set(records.filter((record) => record.normalizedStem === signature).map((record) => record.canonicalProblemId))].sort(),
    patternIds: [...new Set(records.filter((record) => record.normalizedStem === signature).map((record) => record.patternId))].sort(),
    solveModes: [...new Set(records.filter((record) => record.normalizedStem === signature).map((record) => record.solveMode))].sort(),
  }))
  .sort((left, right) => right.count - left.count || left.signature.localeCompare(right.signature));

assert.equal(normalizedDuplication.records, 50);
assert.ok(Object.keys(cpDistribution).length > 1, "MEN-002 package-level generation must not collapse the full package to MEN-CP-009.");
assert.ok((cpDistribution["MEN-CP-009"] ?? 0) < records.length, "MEN-CP-009 may contribute to MEN-002 but must not monopolize every package-level slot.");

console.log("QUANT_V4_CGL_TIER1_SHADOW_MEN002_LOCALIZATION_P3", JSON.stringify({
  records: records.length,
  literalDuplication,
  normalizedDuplication,
  cpDistribution,
  patternDistribution,
  solveModeDistribution,
  stemVariantDistribution,
  objectVariantDistribution,
  normalizedByCp,
  normalizedByPattern,
  targetedPatternVariety,
  repeatedNormalizedFamilies,
  productionPromotionAuthorized: false,
  runtimeBlueprintMutationAuthorized: false,
}));
console.log("PASS_QUANT_V4_CGL_TIER1_SHADOW_MEN002_LOCALIZATION_P3");
