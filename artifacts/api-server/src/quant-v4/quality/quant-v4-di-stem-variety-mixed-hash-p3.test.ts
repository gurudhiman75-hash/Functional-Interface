import assert from "node:assert/strict";

import { generateDi001TableSet } from "../topics/DataInterpretation/DI-001";
import { generateDi002AdvancedTableSet } from "../topics/DataInterpretation/DI-002";
import { generateDi003GroupedBarSet } from "../topics/DataInterpretation/DI-003";
import { generateDi004LineSet } from "../topics/DataInterpretation/DI-004";
import { generateDi005PieSet } from "../topics/DataInterpretation/DI-005";

const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI";
const SECTIONS = 20;
const EXPECTED_QUESTIONS_PER_SET = 5;
const MIN_VARIANTS_PER_TASK = 4;
const MAX_SINGLE_VARIANT_SHARE = 0.40;

const DI_GENERATORS = [
  ["DI-001", generateDi001TableSet],
  ["DI-002", generateDi002AdvancedTableSet],
  ["DI-003", generateDi003GroupedBarSet],
  ["DI-004", generateDi004LineSet],
  ["DI-005", generateDi005PieSet],
] as const;

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

type RecordShape = Readonly<{
  packageId: string;
  taskKind: string;
  questionId: string;
  signature: string;
}>;

const records: RecordShape[] = [];

for (let sectionIndex = 1; sectionIndex <= SECTIONS; sectionIndex += 1) {
  const setSeed =
    `${SEED_PREFIX}:shadow:${sectionIndex}:DATA_INTERPRETATION:set:0`;

  for (const [packageId, generate] of DI_GENERATORS) {
    const set = generate({
      seed: setSeed,
      examProfile: "SSC_CGL_TIER_I",
    } as any) as any;
    const questions = Array.isArray(set?.questions) ? set.questions : [];

    assert.equal(
      questions.length,
      EXPECTED_QUESTIONS_PER_SET,
      `${packageId}: expected ${EXPECTED_QUESTIONS_PER_SET} linked questions per set.`,
    );

    for (const question of questions) {
      const questionId = String(question?.questionId ?? "");
      const taskKind = String(
        question?.taskKind ?? question?.kind ?? question?.questionType ?? "UNKNOWN",
      );
      const stem = String(
        question?.text ?? question?.stem ?? question?.question ?? "",
      ).trim();

      assert.ok(questionId, `${packageId}: generated DI question lost questionId.`);
      assert.ok(stem, `${packageId}/${taskKind}: generated DI question lost stem.`);

      records.push({
        packageId,
        taskKind,
        questionId,
        signature: normalizeStemSignature(stem),
      });
    }
  }
}

assert.equal(
  records.length,
  SECTIONS * DI_GENERATORS.length * EXPECTED_QUESTIONS_PER_SET,
);

const familyKeys = [...new Set(
  records.map((record) => `${record.packageId}:${record.taskKind}`),
)].sort();

const summaries = familyKeys.map((familyKey) => {
  const family = records.filter(
    (record) => `${record.packageId}:${record.taskKind}` === familyKey,
  );
  const signatureCounts: Record<string, number> = {};
  for (const record of family) {
    signatureCounts[record.signature] = (signatureCounts[record.signature] ?? 0) + 1;
  }

  const uniqueQuestionIds = new Set(family.map((record) => record.questionId)).size;
  const uniqueSignatures = Object.keys(signatureCounts).length;
  const maxShare = Math.max(...Object.values(signatureCounts)) / family.length;

  assert.equal(
    uniqueQuestionIds,
    SECTIONS,
    `${familyKey}: structured seeds must produce ${SECTIONS} distinct question IDs.`,
  );
  assert.ok(
    uniqueSignatures >= MIN_VARIANTS_PER_TASK,
    `${familyKey}: generated output exposes only ${uniqueSignatures} normalized stem variants.`,
  );
  assert.ok(
    maxShare <= MAX_SINGLE_VARIANT_SHARE,
    `${familyKey}: one normalized stem variant receives ${maxShare} of generated instances.`,
  );

  return {
    familyKey,
    records: family.length,
    uniqueQuestionIds,
    uniqueSignatures,
    maxShare,
  };
});

console.log(
  "QUANT_V4_DI_STEM_VARIETY_MIXED_HASH_P3",
  JSON.stringify({
    sections: SECTIONS,
    packages: DI_GENERATORS.map(([packageId]) => packageId),
    records: records.length,
    summaries,
  }),
);
console.log("PASS_QUANT_V4_DI_STEM_VARIETY_MIXED_HASH_P3");
