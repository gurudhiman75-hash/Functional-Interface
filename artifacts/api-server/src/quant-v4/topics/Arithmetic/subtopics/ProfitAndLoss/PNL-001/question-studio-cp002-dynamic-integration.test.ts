import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../generation-engine";

const pnl = listQuantV4Packages().find((pkg) => pkg.packageId === "PNL-001");
assert.ok(pnl, "PNL-001 must remain visible as one Question Studio package.");
assert.deepEqual((pnl as any).dynamicCandidateCpIds, [
  "PNL-CP-001",
  "PNL-CP-002",
]);

const mixed = await generateQuestion({
  packageId: "PNL-001",
  runtimeMode: "DYNAMIC_CANDIDATE",
  language: "en",
  count: 20,
  seed: "pnl-cp001-cp002-dynamic-mixed-routing",
});
assert.equal(mixed.questionPackages.length, 20);
assert.equal(mixed.questions.length, 20);
assert.equal(mixed.generationContext.runtimeMode, "DYNAMIC_CANDIDATE");
assert.equal(
  mixed.generationContext.reviewStatus,
  "UNREVIEWED_DYNAMIC_CANDIDATE",
);
assert.equal(mixed.generationContext.questionBankStatus, "NOT_STORED");
assert.equal(mixed.generationContext.testEligibility, "INELIGIBLE");
assert.equal(mixed.generationContext.publiclyPublishable, false);
assert.deepEqual(
  [
    ...new Set(
      mixed.questionPackages.map((pkg: any) => pkg.canonicalProblemId),
    ),
  ].sort(),
  ["PNL-CP-001", "PNL-CP-002"],
  "Mixed dynamic batches must rotate across both proven CP runtimes.",
);

for (const pkg of mixed.questionPackages as any[]) {
  assert.ok(
    pkg.canonicalProblemId === "PNL-CP-001" ||
      pkg.canonicalProblemId === "PNL-CP-002",
  );
  assert.equal(pkg.archetypeId, "PNL-001");
  assert.equal(pkg.language, "en");
  assert.equal(pkg.validation.valid, true);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options).size, 4);
  assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
  assert.equal(pkg.traceability.generationMode, "DYNAMIC_CANDIDATE");
  assert.equal(pkg.traceability.reviewStatus, "UNREVIEWED_DYNAMIC_CANDIDATE");
  assert.equal(pkg.traceability.questionBankStatus, "NOT_STORED");
  assert.equal(pkg.traceability.testEligibility, "INELIGIBLE");
  assert.equal(pkg.traceability.publiclyPublishable, false);
}

for (const question of mixed.questions as any[]) {
  assert.equal(question.runtimeMode, "DYNAMIC_CANDIDATE");
  assert.equal(question.reviewStatus, "UNREVIEWED_DYNAMIC_CANDIDATE");
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.metadata.runtimeMode, "DYNAMIC_CANDIDATE");
  assert.equal(question.metadata.reviewStatus, "UNREVIEWED_DYNAMIC_CANDIDATE");
  assert.equal(question.metadata.questionBankStatus, "NOT_STORED");
  assert.equal(question.metadata.testEligibility, "INELIGIBLE");
  assert.equal(question.metadata.publiclyPublishable, false);
}

const cp002First = await generateQuestion({
  packageId: "PNL-001",
  runtimeMode: "DYNAMIC_CANDIDATE",
  canonicalProblemId: "PNL-CP-002",
  questionLanguageId: "PNL-QL-037",
  language: "en",
  seed: "pnl-cp002-question-studio-determinism",
});
const cp002Second = await generateQuestion({
  packageId: "PNL-001",
  runtimeMode: "DYNAMIC_CANDIDATE",
  canonicalProblemId: "PNL-CP-002",
  questionLanguageId: "PNL-QL-037",
  language: "en",
  seed: "pnl-cp002-question-studio-determinism",
});
assert.equal(cp002First.questionPackages.length, 1);
assert.equal(
  cp002First.questionPackages[0]!.canonicalProblemId,
  "PNL-CP-002",
);
assert.equal(cp002First.questionPackages[0]!.questionLanguageId, "PNL-QL-037");
assert.equal(
  cp002First.questionPackages[0]!.stem,
  cp002Second.questionPackages[0]!.stem,
);
assert.equal(
  cp002First.questionPackages[0]!.answer,
  cp002Second.questionPackages[0]!.answer,
);
assert.deepEqual(
  cp002First.questionPackages[0]!.options,
  cp002Second.questionPackages[0]!.options,
);

const cp001 = await generateQuestion({
  packageId: "PNL-001",
  runtimeMode: "DYNAMIC_CANDIDATE",
  canonicalProblemId: "PNL-CP-001",
  questionLanguageId: "PNL-QL-001",
  language: "en",
  seed: "pnl-cp001-regression-after-cp002-routing",
});
assert.equal(cp001.questionPackages[0]!.canonicalProblemId, "PNL-CP-001");
assert.equal(cp001.questionPackages[0]!.questionLanguageId, "PNL-QL-001");
assert.equal(cp001.questionPackages[0]!.validation.valid, true);

await assert.rejects(
  () =>
    generateQuestion({
      packageId: "PNL-001",
      runtimeMode: "DYNAMIC_CANDIDATE",
      canonicalProblemId: "PNL-CP-003",
      seed: "pnl-unproved-dynamic-cp-safety",
    }),
  /Unknown canonical problem 'PNL-CP-003'/,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      packageId: "PNL-001",
      dynamicCandidateCpIds: ["PNL-CP-001", "PNL-CP-002"],
      mixedBatchSize: mixed.questionPackages.length,
      cp002DeterministicQl: "PNL-QL-037",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
    null,
    2,
  ),
);
