import assert from "node:assert/strict";

import { generateQuestion } from "../question-studio-review-engine";

const PACKAGES = ["PCT-001", "RAP-001"] as const;
const EXPECTED_CP_COUNT = 6;
const SAMPLES_PER_PACKAGE = 60;
const MAX_SINGLE_CP_SHARE = 0.30;
const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI";

function countBy(items: readonly string[]) {
  const counts: Record<string, number> = {};
  for (const item of items) counts[item] = (counts[item] ?? 0) + 1;
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)),
  );
}

for (const packageId of PACKAGES) {
  const selectedCanonicalProblems: string[] = [];

  for (let sectionIndex = 1; sectionIndex <= 20; sectionIndex += 1) {
    for (let slotIndex = 0; slotIndex < 3; slotIndex += 1) {
      const seed = `${SEED_PREFIX}:shadow:${sectionIndex}:ARITHMETIC_CORE:${slotIndex}`;
      const batch = await generateQuestion({
        packageId,
        language: "en",
        seed,
        count: 1,
      } as any);
      const question = (batch as any)?.questions?.[0];
      const canonicalProblemId = String(
        question?.canonicalProblemId ??
          question?.metadata?.canonicalProblemId ??
          question?.debugMetadata?.canonicalProblemId ??
          "",
      );
      assert.ok(canonicalProblemId, `${packageId}: missing canonical problem lineage.`);
      selectedCanonicalProblems.push(canonicalProblemId);
    }
  }

  assert.equal(
    selectedCanonicalProblems.length,
    SAMPLES_PER_PACKAGE,
    `${packageId}: unexpected sample count.`,
  );

  const distribution = countBy(selectedCanonicalProblems);
  const counts = Object.values(distribution);
  const maxCount = Math.max(...counts);
  const maxShare = maxCount / selectedCanonicalProblems.length;

  assert.equal(
    Object.keys(distribution).length,
    EXPECTED_CP_COUNT,
    `${packageId}: repeated single-question requests must exercise all active CPs.`,
  );
  assert.ok(
    maxShare <= MAX_SINGLE_CP_SHARE,
    `${packageId}: single-question CP selection is too concentrated (${maxShare}).`,
  );

  const repeatSeed = `${SEED_PREFIX}:shadow:7:ARITHMETIC_CORE:1`;
  const first = await generateQuestion({ packageId, language: "en", seed: repeatSeed, count: 1 } as any);
  const second = await generateQuestion({ packageId, language: "en", seed: repeatSeed, count: 1 } as any);
  const firstCp = String(
    (first as any)?.questions?.[0]?.canonicalProblemId ??
      (first as any)?.questions?.[0]?.metadata?.canonicalProblemId ??
      "",
  );
  const secondCp = String(
    (second as any)?.questions?.[0]?.canonicalProblemId ??
      (second as any)?.questions?.[0]?.metadata?.canonicalProblemId ??
      "",
  );
  assert.equal(firstCp, secondCp, `${packageId}: fixed seed must keep CP selection deterministic.`);

  console.log(
    "QUANT_V4_SINGLE_QUESTION_CP_DISTRIBUTION_P3",
    JSON.stringify({ packageId, samples: selectedCanonicalProblems.length, distribution, maxShare }),
  );
}

console.log("PASS_QUANT_V4_SINGLE_QUESTION_CP_DISTRIBUTION_P3");
