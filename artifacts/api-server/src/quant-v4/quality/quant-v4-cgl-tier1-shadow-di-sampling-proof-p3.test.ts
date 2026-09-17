import assert from "node:assert/strict";

import { generateDi001TableSet } from "../topics/DataInterpretation/DI-001";
import { generateDi002AdvancedTableSet } from "../topics/DataInterpretation/DI-002";
import { generateDi003GroupedBarSet } from "../topics/DataInterpretation/DI-003";
import { generateDi004LineSet } from "../topics/DataInterpretation/DI-004";
import { generateDi005PieSet } from "../topics/DataInterpretation/DI-005";
import { generateDi006CaseletSet } from "../topics/DataInterpretation/DI-006";

const SECTIONS = 20;
const REQUESTED_PER_SECTION = 3;
const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI";

const DI_GENERATORS = [
  ["DI-001", generateDi001TableSet],
  ["DI-002", generateDi002AdvancedTableSet],
  ["DI-003", generateDi003GroupedBarSet],
  ["DI-004", generateDi004LineSet],
  ["DI-005", generateDi005PieSet],
  ["DI-006", generateDi006CaseletSet],
] as const;

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
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
    const value = key(item);
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)));
}

function duplicateSummary(records: readonly Readonly<{ signature: string }>[]) {
  const counts = countBy(records.filter((record) => record.signature), (record) => record.signature);
  const duplicateItems = Object.values(counts).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return {
    records: records.length,
    uniqueSignatures: Object.keys(counts).length,
    duplicateItems,
    duplicateRate: records.length ? duplicateItems / records.length : 0,
  };
}

function rotatedSelection<T>(questions: readonly T[], requested: number, seed: string): T[] {
  if (!questions.length) return [];
  const count = Math.min(requested, questions.length);
  const offset = hash(`${seed}:question-offset`) % questions.length;
  const selected: T[] = [];
  for (let index = 0; index < count; index += 1) {
    selected.push(questions[(offset + index) % questions.length]!);
  }
  return selected;
}

type RecordShape = Readonly<{
  sectionIndex: number;
  packageId: string;
  taskKind: string;
  signature: string;
}>;

const legacyRecords: RecordShape[] = [];
const rotatedRecords: RecordShape[] = [];
const setSizes: Record<string, number[]> = {};

for (let sectionIndex = 1; sectionIndex <= SECTIONS; sectionIndex += 1) {
  const shadowSeed = `${SEED_PREFIX}:shadow:${sectionIndex}`;
  const diSeed = `${shadowSeed}:DATA_INTERPRETATION`;
  const setSeed = `${diSeed}:set:0`;
  const [packageId, generate] = DI_GENERATORS[hash(setSeed) % DI_GENERATORS.length]!;
  const set = generate({ seed: setSeed, examProfile: "SSC_CGL_TIER_I" } as any) as any;
  const questions = Array.isArray(set?.questions) ? set.questions : [];
  assert.ok(questions.length >= REQUESTED_PER_SECTION, `${packageId} must expose at least ${REQUESTED_PER_SECTION} linked questions.`);
  (setSizes[packageId] ??= []).push(questions.length);

  const legacy = questions.slice(0, REQUESTED_PER_SECTION);
  const rotated = rotatedSelection(questions, REQUESTED_PER_SECTION, setSeed);

  legacy.forEach((question: any) => legacyRecords.push({
    sectionIndex,
    packageId,
    taskKind: String(question?.taskKind ?? question?.kind ?? question?.questionType ?? "UNKNOWN"),
    signature: normalizeStemSignature(questionText(question)),
  }));
  rotated.forEach((question: any) => rotatedRecords.push({
    sectionIndex,
    packageId,
    taskKind: String(question?.taskKind ?? question?.kind ?? question?.questionType ?? "UNKNOWN"),
    signature: normalizeStemSignature(questionText(question)),
  }));
}

assert.equal(legacyRecords.length, SECTIONS * REQUESTED_PER_SECTION);
assert.equal(rotatedRecords.length, SECTIONS * REQUESTED_PER_SECTION);

const legacyDuplicate = duplicateSummary(legacyRecords);
const rotatedDuplicate = duplicateSummary(rotatedRecords);
const legacyTaskDistribution = countBy(legacyRecords, (record) => `${record.packageId}:${record.taskKind}`);
const rotatedTaskDistribution = countBy(rotatedRecords, (record) => `${record.packageId}:${record.taskKind}`);
const legacyTaskFamilies = Object.keys(legacyTaskDistribution).length;
const rotatedTaskFamilies = Object.keys(rotatedTaskDistribution).length;
const di002RotatedRecords = rotatedRecords.filter((record) => record.packageId === "DI-002");
const di002RotatedDuplicate = duplicateSummary(di002RotatedRecords);
const di002TaskDistribution = countBy(di002RotatedRecords, (record) => record.taskKind);

assert.ok(
  rotatedTaskFamilies >= legacyTaskFamilies,
  `Rotated DI sampling must not reduce task-family coverage (${rotatedTaskFamilies} < ${legacyTaskFamilies}).`,
);
assert.ok(
  rotatedDuplicate.duplicateRate <= legacyDuplicate.duplicateRate,
  `Rotated DI sampling must not worsen normalized-stem repetition (${rotatedDuplicate.duplicateRate} > ${legacyDuplicate.duplicateRate}).`,
);
assert.ok(
  di002RotatedDuplicate.duplicateRate < 0.5,
  `DI-002 public runtime must expose real stem variety after sampler bias is removed (${di002RotatedDuplicate.duplicateRate} >= 0.5).`,
);

console.log("QUANT_V4_CGL_TIER1_SHADOW_DI_SAMPLING_PROOF_P3", JSON.stringify({
  sections: SECTIONS,
  requestedPerSection: REQUESTED_PER_SECTION,
  setSizes,
  legacy: {
    duplication: legacyDuplicate,
    taskFamilies: legacyTaskFamilies,
    taskDistribution: legacyTaskDistribution,
  },
  rotated: {
    duplication: rotatedDuplicate,
    taskFamilies: rotatedTaskFamilies,
    taskDistribution: rotatedTaskDistribution,
  },
  di002Variety: {
    duplication: di002RotatedDuplicate,
    taskDistribution: di002TaskDistribution,
  },
  productionPromotionAuthorized: false,
  runtimeBlueprintMutationAuthorized: false,
}));

console.log("PASS_QUANT_V4_CGL_TIER1_SHADOW_DI_SAMPLING_PROOF_P3");
