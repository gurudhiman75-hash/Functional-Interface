import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../generation-engine";

const packages = listQuantV4Packages();
const pnlPackages = packages.filter((pkg) => pkg.packageId === "PNL-001");
assert.equal(pnlPackages.length, 1, "Question Studio must expose one PNL-001 package.");

const pnl = pnlPackages[0]!;
assert.equal(pnl.enabled, true);
assert.equal(pnl.topic, "Arithmetic");
assert.equal(pnl.subtopic, "Profit & Loss");
assert.deepEqual(pnl.supportedLanguages, ["en"]);
assert.deepEqual(
  pnl.canonicalProblems.map((cp) => cp.id),
  [
    "PNL-CP-001",
    "PNL-CP-002",
    "PNL-CP-003",
    "PNL-CP-004",
    "PNL-CP-005",
    "PNL-CP-006",
  ],
);
assert.equal((pnl as any).runtimeMode, "CANONICAL_REVIEW");
assert.equal((pnl as any).questionBankStatus, "NOT_STORED");
assert.equal((pnl as any).testEligibility, "INELIGIBLE");
assert.equal((pnl as any).publiclyPublishable, false);

const rawPnlCheckpoints = packages.filter(
  (pkg) =>
    /^CP-\d{3}$/.test(pkg.packageId) &&
    /profit\s*(?:&|and)?\s*loss|profitandloss/i.test(pkg.subtopic),
);
assert.equal(
  rawPnlCheckpoints.length,
  0,
  "Nested PNL checkpoint folders must not appear as separate Question Studio packages.",
);

const batch = await generateQuestion({
  packageId: "PNL-001",
  language: "en",
  count: 12,
  seed: "pnl-question-studio-smoke",
});
assert.equal(batch.questionPackages.length, 12);
assert.equal(batch.questions.length, 12);
assert.equal(batch.generationContext.runtimeMode, "CANONICAL_REVIEW");
assert.equal(
  new Set(
    batch.questionPackages.map((questionPackage: any) =>
      questionPackage.canonicalProblemId,
    ),
  ).size,
  6,
  "A mixed PNL batch should rotate through all six checkpoint groups.",
);

for (const questionPackage of batch.questionPackages as any[]) {
  assert.equal(questionPackage.archetypeId, "PNL-001");
  assert.equal(questionPackage.language, "en");
  assert.equal(questionPackage.validation.valid, true);
  assert.equal(questionPackage.options.length, 4);
  assert.equal(new Set(questionPackage.options).size, 4);
  assert.equal(
    questionPackage.options[questionPackage.correctIndex],
    questionPackage.answer,
  );
  assert.equal(questionPackage.traceability.generationMode, "CANONICAL_REVIEW");
  assert.equal(questionPackage.traceability.questionBankStatus, "NOT_STORED");
  assert.equal(questionPackage.traceability.testEligibility, "INELIGIBLE");
  assert.equal(questionPackage.traceability.publiclyPublishable, false);
}

const ql092 = await generateQuestion({
  packageId: "PNL-001",
  canonicalProblemId: "PNL-CP-003",
  questionLanguageId: "PNL-QL-092",
  seed: "pnl-ql-092-integration",
});
assert.equal(ql092.questionPackages.length, 1);
assert.match(
  ql092.questionPackages[0]!.stem,
  /10%\s+profit/i,
  "QL-092 must state the target overall profit in the student stem.",
);

const ql183 = await generateQuestion({
  packageId: "PNL-001",
  canonicalProblemId: "PNL-CP-006",
  questionLanguageId: "PNL-QL-183",
  seed: "pnl-ql-183-integration",
});
const ql183Stem = ql183.questionPackages[0]!.stem;
assert.match(ql183Stem, /Product A/i);
assert.match(ql183Stem, /Product B/i);
assert.match(ql183Stem, /₹100/);
assert.match(ql183Stem, /₹60/);
assert.match(ql183Stem, /₹200/);
assert.match(ql183Stem, /₹120/);

const subtopicRequest = await generateQuestion({
  topic: "Arithmetic",
  subtopic: "Profit & Loss",
  canonicalProblemId: "PNL-CP-001",
  difficulty: "Easy",
  language: "en",
  seed: "pnl-subtopic-resolution",
});
assert.equal(subtopicRequest.questionPackages[0]!.archetypeId, "PNL-001");
assert.equal(subtopicRequest.questionPackages[0]!.difficultyBand, "Easy");

await assert.rejects(
  () =>
    generateQuestion({
      packageId: "PNL-001",
      language: "hi",
      seed: "pnl-language-safety",
    }),
  /does not support language 'hi'/,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      packageId: "PNL-001",
      packageCount: pnlPackages.length,
      canonicalProblemCount: pnl.canonicalProblems.length,
      batchSize: batch.questionPackages.length,
      runtimeMode: "CANONICAL_REVIEW",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
    null,
    2,
  ),
);
