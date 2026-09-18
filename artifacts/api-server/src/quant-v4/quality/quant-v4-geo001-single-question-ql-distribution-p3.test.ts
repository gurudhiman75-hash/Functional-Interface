import assert from "node:assert/strict";

import { generateQuestion } from "../question-studio-review-engine";

const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI";
const EXPECTED_QL_COUNT = 75;
const SECTIONS = 20;
const SLOTS_PER_SECTION = 5;
const EXPECTED_SAMPLES = SECTIONS * SLOTS_PER_SECTION;

const selectedQls: string[] = [];

for (let sectionIndex = 1; sectionIndex <= SECTIONS; sectionIndex += 1) {
  for (let slotIndex = 0; slotIndex < SLOTS_PER_SECTION; slotIndex += 1) {
    const seed =
      `${SEED_PREFIX}:shadow:${sectionIndex}:GEOMETRY_MENSURATION:${slotIndex}`;
    const batch = await generateQuestion({
      packageId: "GEO-001" as any,
      language: "en",
      seed,
      count: 1,
    } as any);
    const question = (batch as any)?.questions?.[0];
    const qlId = String(
      question?.questionLanguageId ??
        question?.qlId ??
        question?.metadata?.questionLanguageId ??
        "",
    );
    assert.ok(qlId, "GEO-001 structured single-question request lost QL lineage.");
    assert.equal(question?.questionBankWritable, false);
    assert.equal(question?.testEligible, false);
    assert.equal(question?.publiclyPublishable, false);
    selectedQls.push(qlId);
  }
}

assert.equal(selectedQls.length, EXPECTED_SAMPLES);

const counts = Object.fromEntries(
  [...new Set(selectedQls)]
    .sort()
    .map((qlId) => [qlId, selectedQls.filter((value) => value === qlId).length]),
);
const uniqueQls = Object.keys(counts).length;
const maxCount = Math.max(...Object.values(counts));

assert.equal(
  uniqueQls,
  EXPECTED_QL_COUNT,
  "GEO-001 structured single-question seeds must exercise all 75 frozen QLs.",
);
assert.ok(
  maxCount <= 2,
  `GEO-001 structured single-question selection repeats one QL ${maxCount} times across ${EXPECTED_SAMPLES} samples.`,
);

const repeatSeed = `${SEED_PREFIX}:shadow:7:GEOMETRY_MENSURATION:3`;
const first = await generateQuestion({
  packageId: "GEO-001" as any,
  language: "en",
  seed: repeatSeed,
  count: 1,
} as any);
const second = await generateQuestion({
  packageId: "GEO-001" as any,
  language: "en",
  seed: repeatSeed,
  count: 1,
} as any);

assert.equal(
  (first as any)?.questions?.[0]?.questionLanguageId,
  (second as any)?.questions?.[0]?.questionLanguageId,
  "GEO-001 fixed seed must keep QL selection deterministic.",
);

console.log(
  "QUANT_V4_GEO001_SINGLE_QUESTION_QL_DISTRIBUTION_P3",
  JSON.stringify({
    samples: selectedQls.length,
    uniqueQls,
    maxCount,
    lifecycle: {
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  }),
);
console.log("PASS_QUANT_V4_GEO001_SINGLE_QUESTION_QL_DISTRIBUTION_P3");
