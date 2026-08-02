import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../generation-engine";

const packages = listQuantV4Packages();
const pnlPackages = packages.filter((pkg) => pkg.packageId === "PNL-001");
assert.equal(
  pnlPackages.length,
  1,
  "Question Studio must expose one PNL-001 package.",
);

const pnl = pnlPackages[0]!;
assert.equal(pnl.enabled, true);
assert.equal(pnl.topic, "Arithmetic");
assert.equal(pnl.subtopic, "Profit & Loss");
assert.deepEqual(pnl.supportedLanguages, ["en", "hi", "pa"]);
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
assert.deepEqual((pnl as any).supportedRuntimeModes, [
  "CANONICAL_REVIEW",
  "DYNAMIC_CANDIDATE",
]);
assert.deepEqual((pnl as any).dynamicCandidateCpIds, [
  "PNL-CP-001",
  "PNL-CP-002",
]);
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

const canonicalBatches: Record<string, Awaited<ReturnType<typeof generateQuestion>>> = {};
for (const language of ["en", "hi", "pa"] as const) {
  const batch = await generateQuestion({
    packageId: "PNL-001",
    language,
    count: 12,
    seed: `pnl-question-studio-smoke:${language}`,
  });
  canonicalBatches[language] = batch;
  assert.equal(batch.questionPackages.length, 12);
  assert.equal(batch.questions.length, 12);
  assert.equal(batch.generationContext.runtimeMode, "CANONICAL_REVIEW");
  assert.equal(
    batch.generationContext.reviewStatus,
    "APPROVED_EDITORIAL_CANONICAL",
  );
  assert.equal(batch.generationContext.questionBankStatus, "NOT_STORED");
  assert.equal(batch.generationContext.testEligibility, "INELIGIBLE");
  assert.equal(batch.generationContext.publiclyPublishable, false);
  assert.equal(
    new Set(
      batch.questionPackages.map(
        (questionPackage: any) => questionPackage.canonicalProblemId,
      ),
    ).size,
    6,
    `${language}: mixed canonical PNL batch should rotate through all six checkpoint groups.`,
  );

  for (const questionPackage of batch.questionPackages as any[]) {
    assert.equal(questionPackage.archetypeId, "PNL-001");
    assert.equal(questionPackage.language, language);
    assert.equal(questionPackage.parameters.language, language);
    assert.equal(questionPackage.traceability.language, language);
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
    if (language !== "en") {
      const script =
        language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
      assert.ok(script.test(questionPackage.stem));
      assert.ok(script.test(questionPackage.explanation.lines.join("\n")));
    }
  }

  for (const question of batch.questions as any[]) {
    assert.equal(question.runtimeMode, "CANONICAL_REVIEW");
    assert.equal(question.reviewStatus, "APPROVED_EDITORIAL_CANONICAL");
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.metadata.runtimeMode, "CANONICAL_REVIEW");
    assert.equal(question.metadata.questionBankStatus, "NOT_STORED");
  }
}

const dynamicBatch = await generateQuestion({
  packageId: "PNL-001",
  runtimeMode: "DYNAMIC_CANDIDATE",
  language: "en",
  count: 12,
  seed: "pnl-cp001-dynamic-question-studio-smoke",
});
assert.equal(dynamicBatch.questionPackages.length, 12);
assert.equal(dynamicBatch.questions.length, 12);
assert.equal(dynamicBatch.generationContext.runtimeMode, "DYNAMIC_CANDIDATE");
assert.equal(
  dynamicBatch.generationContext.reviewStatus,
  "UNREVIEWED_DYNAMIC_CANDIDATE",
);
assert.equal(dynamicBatch.generationContext.questionBankStatus, "NOT_STORED");
assert.equal(dynamicBatch.generationContext.testEligibility, "INELIGIBLE");
assert.equal(dynamicBatch.generationContext.publiclyPublishable, false);
assert.deepEqual(
  [
    ...new Set(
      dynamicBatch.questionPackages.map((pkg: any) => pkg.canonicalProblemId),
    ),
  ].sort(),
  ["PNL-CP-001", "PNL-CP-002"],
  "Dynamic candidate mode must be restricted to the two proven CP runtimes.",
);

for (const questionPackage of dynamicBatch.questionPackages as any[]) {
  assert.equal(questionPackage.archetypeId, "PNL-001");
  assert.ok(
    questionPackage.canonicalProblemId === "PNL-CP-001" ||
      questionPackage.canonicalProblemId === "PNL-CP-002",
  );
  assert.equal(questionPackage.language, "en");
  assert.equal(questionPackage.validation.valid, true);
  assert.equal(questionPackage.options.length, 4);
  assert.equal(new Set(questionPackage.options).size, 4);
  assert.equal(
    questionPackage.options[questionPackage.correctIndex],
    questionPackage.answer,
  );
  assert.equal(
    questionPackage.traceability.generationMode,
    "DYNAMIC_CANDIDATE",
  );
  assert.equal(
    questionPackage.traceability.reviewStatus,
    "UNREVIEWED_DYNAMIC_CANDIDATE",
  );
  assert.equal(questionPackage.traceability.questionBankStatus, "NOT_STORED");
  assert.equal(questionPackage.traceability.testEligibility, "INELIGIBLE");
  assert.equal(questionPackage.traceability.publiclyPublishable, false);
}

for (const question of dynamicBatch.questions as any[]) {
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

const deterministicDynamicFirst = await generateQuestion({
  packageId: "PNL-001",
  runtimeMode: "DYNAMIC_CANDIDATE",
  canonicalProblemId: "PNL-CP-001",
  questionLanguageId: "PNL-QL-001",
  seed: "pnl-cp001-dynamic-determinism",
});
const deterministicDynamicSecond = await generateQuestion({
  packageId: "PNL-001",
  runtimeMode: "DYNAMIC_CANDIDATE",
  canonicalProblemId: "PNL-CP-001",
  questionLanguageId: "PNL-QL-001",
  seed: "pnl-cp001-dynamic-determinism",
});
assert.equal(
  deterministicDynamicFirst.questionPackages[0]!.stem,
  deterministicDynamicSecond.questionPackages[0]!.stem,
);
assert.deepEqual(
  deterministicDynamicFirst.questionPackages[0]!.options,
  deterministicDynamicSecond.questionPackages[0]!.options,
);
assert.equal(
  deterministicDynamicFirst.questionPackages[0]!.answer,
  deterministicDynamicSecond.questionPackages[0]!.answer,
);

for (const language of ["hi", "pa"] as const) {
  await assert.rejects(
    () =>
      generateQuestion({
        packageId: "PNL-001",
        runtimeMode: "DYNAMIC_CANDIDATE",
        language,
        seed: `pnl-native-dynamic-safety:${language}`,
      }),
    /dynamic candidate runtime currently supports English only/,
  );
}
await assert.rejects(
  () =>
    generateQuestion({
      packageId: "PNL-001",
      runtimeMode: "DYNAMIC_CANDIDATE",
      canonicalProblemId: "PNL-CP-003",
      seed: "pnl-dynamic-cp-safety",
    }),
  /Unknown canonical problem 'PNL-CP-003'/,
);
await assert.rejects(
  () =>
    generateQuestion({
      packageId: "PNL-001",
      runtimeMode: "UNSAFE_DYNAMIC" as never,
      seed: "pnl-runtime-mode-safety",
    }),
  /Unsupported PNL-001 runtime mode/,
);

const ql070Canonical = await generateQuestion({
  packageId: "PNL-001",
  canonicalProblemId: "PNL-CP-002",
  questionLanguageId: "PNL-QL-070",
  seed: "pnl-ql070-canonical-regression",
});
const ql070CanonicalPackage = ql070Canonical.questionPackages[0]!;
const ql070CanonicalMarker = ql070CanonicalPackage.stem.match(
  /Statement\s+(?:I|1)\b/i,
);
assert.ok(
  ql070CanonicalMarker?.index,
  "Canonical QL-070 must separate Statement I from the lead.",
);
assert.doesNotMatch(
  ql070CanonicalPackage.stem.slice(0, ql070CanonicalMarker.index),
  /₹\s*[\d,]+|\b\d+(?:\.\d+)?%/,
  "Canonical QL-070 lead must be insufficient by itself.",
);
assert.equal(
  ql070CanonicalPackage.answer,
  "Both statements together are required",
);
assert.equal(
  ql070CanonicalPackage.options[ql070CanonicalPackage.correctIndex],
  ql070CanonicalPackage.answer,
);

for (const language of ["hi", "pa"] as const) {
  const ql145 = await generateQuestion({
    packageId: "PNL-001",
    language,
    canonicalProblemId: "PNL-CP-005",
    questionLanguageId: "PNL-QL-145",
    seed: `pnl-ql145-native:${language}`,
  });
  const pkg = ql145.questionPackages[0]!;
  const script =
    language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
  assert.ok(script.test(pkg.stem));
  assert.ok(script.test(pkg.explanation.lines.join("\n")));
  assert.doesNotMatch(
    `${pkg.stem}\n${pkg.explanation.lines.join("\n")}`,
    /\{(?:firstScheme|secondScheme)\}/,
  );
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
  language: "pa",
  seed: "pnl-subtopic-resolution",
});
assert.equal(subtopicRequest.questionPackages[0]!.archetypeId, "PNL-001");
assert.equal(subtopicRequest.questionPackages[0]!.difficultyBand, "Easy");
assert.equal(subtopicRequest.questionPackages[0]!.language, "pa");

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";
const {
  assertGeneratedQuestionBankEligible,
  getGeneratedQuestionBankEligibilityIssue,
} = await import("../../../../../../lib/admin-question-conversion");
const dynamicPreview = dynamicBatch.questions[0]!;
assert.equal(
  getGeneratedQuestionBankEligibilityIssue(dynamicPreview),
  "questionBankStatus is NOT_STORED",
);
assert.throws(
  () => assertGeneratedQuestionBankEligible(dynamicPreview),
  /cannot be converted to Question Bank: questionBankStatus is NOT_STORED/,
);
assert.doesNotThrow(() =>
  assertGeneratedQuestionBankEligible({
    text: "Ordinary approved generated question",
    options: ["A", "B", "C", "D"],
    correctIndex: 0,
  }),
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      packageId: "PNL-001",
      packageCount: pnlPackages.length,
      supportedLanguages: pnl.supportedLanguages,
      canonicalProblemCount: pnl.canonicalProblems.length,
      canonicalBatchSizes: Object.fromEntries(
        Object.entries(canonicalBatches).map(([language, batch]) => [
          language,
          batch.questionPackages.length,
        ]),
      ),
      dynamicBatchSize: dynamicBatch.questionPackages.length,
      defaultRuntimeMode: "CANONICAL_REVIEW",
      optInRuntimeMode: "DYNAMIC_CANDIDATE",
      dynamicCandidateLanguages: ["en"],
      dynamicCandidateCpIds: ["PNL-CP-001", "PNL-CP-002"],
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
    null,
    2,
  ),
);
