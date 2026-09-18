import assert from "node:assert/strict";

import {
  generateQuantV4AdvancedMathSectionQuestion,
} from "./quant-v4-real-exam-advanced-math-adapters-p2";

const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI";
const EXPECTED_SHADOW_TRG001_RECORDS = 46;
const MIN_UNIQUE_QL_RATE = 0.75;
const MAX_SELECTIONS_PER_QL = 3;

function countBy(items: readonly string[]) {
  const counts: Record<string, number> = {};
  for (const item of items) counts[item] = (counts[item] ?? 0) + 1;
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)),
  );
}

const qlIds: string[] = [];

for (let sectionIndex = 1; sectionIndex <= 20; sectionIndex += 1) {
  for (let slotIndex = 0; slotIndex < 3; slotIndex += 1) {
    const seed = `${SEED_PREFIX}:shadow:${sectionIndex}:TRIGONOMETRY:${slotIndex}`;
    const result = await generateQuantV4AdvancedMathSectionQuestion({
      examId: "SSC_CGL_TIER_I",
      slotKind: "TRIGONOMETRY",
      seed,
    });
    if (result.packageId !== "TRG-001") continue;

    const question = result.question as any;
    const qlId = String(
      question?.questionLanguageId ??
        question?.generationMetadata?.qlId ??
        question?.proceduralLogic?.qlId ??
        "",
    );
    assert.ok(qlId, "TRG-001 shadow selection must retain QL lineage.");
    assert.equal(question.testEligible, true, "TRG-001 internal test eligibility must remain intact.");
    assert.equal(question.publiclyPublishable, false, "TRG-001 public-release lock must remain intact.");
    qlIds.push(qlId);
  }
}

const distribution = countBy(qlIds);
const uniqueQlCount = Object.keys(distribution).length;
const uniqueQlRate = qlIds.length ? uniqueQlCount / qlIds.length : 0;
const maxSelectionsForOneQl = Math.max(...Object.values(distribution));

assert.equal(
  qlIds.length,
  EXPECTED_SHADOW_TRG001_RECORDS,
  "The provisional SSC CGL Tier-I trigonometry package selector changed unexpectedly.",
);
assert.ok(
  uniqueQlRate >= MIN_UNIQUE_QL_RATE,
  `TRG-001 single-question QL reuse is too concentrated (${uniqueQlRate}).`,
);
assert.ok(
  maxSelectionsForOneQl <= MAX_SELECTIONS_PER_QL,
  `TRG-001 selected one frozen QL ${maxSelectionsForOneQl} times in the 20-section shadow.`,
);

console.log(
  "QUANT_V4_TRG001_SINGLE_QUESTION_QL_DISTRIBUTION_P3",
  JSON.stringify({
    records: qlIds.length,
    uniqueQlCount,
    uniqueQlRate,
    maxSelectionsForOneQl,
    distribution,
  }),
);
console.log("PASS_QUANT_V4_TRG001_SINGLE_QUESTION_QL_DISTRIBUTION_P3");
