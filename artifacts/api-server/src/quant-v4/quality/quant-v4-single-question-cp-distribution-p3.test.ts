import assert from "node:assert/strict";

import { generateQuestion } from "../question-studio-review-engine";

const EXPECTED_CP_COUNT = 6;
const MAX_SINGLE_CP_SHARE = 0.30;
const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI";

const SCENARIOS = [
  { packageId: "PCT-001", language: "en", sections: 20 },
  { packageId: "RAP-001", language: "en", sections: 20 },
  { packageId: "RAP-001", language: "hi", sections: 10 },
  { packageId: "RAP-001", language: "pa", sections: 10 },
] as const;

function countBy(items: readonly string[]) {
  const counts: Record<string, number> = {};
  for (const item of items) counts[item] = (counts[item] ?? 0) + 1;
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)),
  );
}

function canonicalProblemIdFrom(batch: any) {
  const question = batch?.questions?.[0];
  return String(
    question?.canonicalProblemId ??
      question?.metadata?.canonicalProblemId ??
      question?.debugMetadata?.canonicalProblemId ??
      "",
  );
}

for (const scenario of SCENARIOS) {
  const selectedCanonicalProblems: string[] = [];

  for (let sectionIndex = 1; sectionIndex <= scenario.sections; sectionIndex += 1) {
    for (let slotIndex = 0; slotIndex < 3; slotIndex += 1) {
      const seed = `${SEED_PREFIX}:shadow:${sectionIndex}:ARITHMETIC_CORE:${slotIndex}`;
      const batch = await generateQuestion({
        packageId: scenario.packageId,
        language: scenario.language,
        seed,
        count: 1,
      } as any);
      const canonicalProblemId = canonicalProblemIdFrom(batch);
      assert.ok(
        canonicalProblemId,
        `${scenario.packageId}:${scenario.language}: missing canonical problem lineage.`,
      );
      selectedCanonicalProblems.push(canonicalProblemId);
    }
  }

  const expectedSamples = scenario.sections * 3;
  assert.equal(
    selectedCanonicalProblems.length,
    expectedSamples,
    `${scenario.packageId}:${scenario.language}: unexpected sample count.`,
  );

  const distribution = countBy(selectedCanonicalProblems);
  const counts = Object.values(distribution);
  const maxCount = Math.max(...counts);
  const maxShare = maxCount / selectedCanonicalProblems.length;

  assert.equal(
    Object.keys(distribution).length,
    EXPECTED_CP_COUNT,
    `${scenario.packageId}:${scenario.language}: repeated single-question requests must exercise all active CPs.`,
  );
  assert.ok(
    maxShare <= MAX_SINGLE_CP_SHARE,
    `${scenario.packageId}:${scenario.language}: single-question CP selection is too concentrated (${maxShare}).`,
  );

  const repeatSeed = `${SEED_PREFIX}:shadow:7:ARITHMETIC_CORE:1`;
  const first = await generateQuestion({
    packageId: scenario.packageId,
    language: scenario.language,
    seed: repeatSeed,
    count: 1,
  } as any);
  const second = await generateQuestion({
    packageId: scenario.packageId,
    language: scenario.language,
    seed: repeatSeed,
    count: 1,
  } as any);
  assert.equal(
    canonicalProblemIdFrom(first),
    canonicalProblemIdFrom(second),
    `${scenario.packageId}:${scenario.language}: fixed seed must keep CP selection deterministic.`,
  );

  console.log(
    "QUANT_V4_SINGLE_QUESTION_CP_DISTRIBUTION_P3",
    JSON.stringify({
      packageId: scenario.packageId,
      language: scenario.language,
      samples: selectedCanonicalProblems.length,
      distribution,
      maxShare,
    }),
  );
}

console.log("PASS_QUANT_V4_SINGLE_QUESTION_CP_DISTRIBUTION_P3");
