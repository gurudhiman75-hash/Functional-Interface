import assert from "node:assert/strict";

import { generateQuestion } from "../question-studio-review-engine";

const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI";
const SECTIONS = 20;
const ARITHMETIC_SLOTS = 11;
const EXPECTED_SAMPLES = SECTIONS * ARITHMETIC_SLOTS;
const EXPECTED_CP_COUNT = 10;
const MIN_UNIQUE_QLS = 100;
const MAX_QL_REUSE_COUNT = 5;

const selections: Array<{ cpId: string; qlId: string }> = [];

for (let sectionIndex = 1; sectionIndex <= SECTIONS; sectionIndex += 1) {
  for (let slotIndex = 0; slotIndex < ARITHMETIC_SLOTS; slotIndex += 1) {
    const seed =
      `${SEED_PREFIX}:shadow:${sectionIndex}:ARITHMETIC_CORE:${slotIndex}`;
    const batch = await generateQuestion({
      packageId: "PCT-002" as any,
      language: "en",
      seed,
      count: 1,
    } as any);
    const question = (batch as any)?.questions?.[0];
    const cpId = String(
      question?.canonicalProblemId ??
        question?.metadata?.canonicalProblemId ??
        question?.debugMetadata?.canonicalProblemId ??
        "",
    );
    const qlId = String(
      question?.questionLanguageId ??
        question?.metadata?.questionLanguageId ??
        question?.debugMetadata?.questionLanguageId ??
        "",
    );
    assert.ok(cpId, "PCT-002 structured single-question request lost CP lineage.");
    assert.ok(qlId, "PCT-002 structured single-question request lost QL lineage.");
    assert.equal(question?.options?.length, 4, "PCT-002 must preserve four-option output.");
    selections.push({ cpId, qlId });
  }
}

assert.equal(selections.length, EXPECTED_SAMPLES);

const countBy = (values: readonly string[]) => {
  const counts: Record<string, number> = {};
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)),
  );
};

const cpDistribution = countBy(selections.map((entry) => entry.cpId));
const qlDistribution = countBy(selections.map((entry) => entry.qlId));
const uniqueQls = Object.keys(qlDistribution).length;
const maxQlReuse = Math.max(...Object.values(qlDistribution));

assert.equal(
  Object.keys(cpDistribution).length,
  EXPECTED_CP_COUNT,
  "PCT-002 structured single-question seeds must exercise all 10 CPs.",
);
assert.ok(
  uniqueQls >= MIN_UNIQUE_QLS,
  `PCT-002 structured single-question seeds exercise only ${uniqueQls}/150 QLs.`,
);
assert.ok(
  maxQlReuse <= MAX_QL_REUSE_COUNT,
  `PCT-002 structured single-question selection reuses one QL ${maxQlReuse} times across ${EXPECTED_SAMPLES} samples.`,
);

const repeatSeed = `${SEED_PREFIX}:shadow:7:ARITHMETIC_CORE:4`;
const first = await generateQuestion({
  packageId: "PCT-002" as any,
  language: "en",
  seed: repeatSeed,
  count: 1,
} as any);
const second = await generateQuestion({
  packageId: "PCT-002" as any,
  language: "en",
  seed: repeatSeed,
  count: 1,
} as any);

assert.equal(
  (first as any)?.questions?.[0]?.questionLanguageId,
  (second as any)?.questions?.[0]?.questionLanguageId,
  "PCT-002 fixed seed must keep QL selection deterministic.",
);
assert.equal(
  (first as any)?.questions?.[0]?.canonicalProblemId,
  (second as any)?.questions?.[0]?.canonicalProblemId,
  "PCT-002 fixed seed must keep CP selection deterministic.",
);

console.log(
  "QUANT_V4_PCT002_SINGLE_QUESTION_QL_DISTRIBUTION_P3",
  JSON.stringify({
    samples: selections.length,
    uniqueCps: Object.keys(cpDistribution).length,
    uniqueQls,
    maxQlReuse,
    maxQlShare: maxQlReuse / selections.length,
    cpDistribution,
  }),
);
console.log("PASS_QUANT_V4_PCT002_SINGLE_QUESTION_QL_DISTRIBUTION_P3");
