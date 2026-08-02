import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../generation-engine";

const LANGUAGES = ["en", "hi", "pa"] as const;
const CP_IDS = [
  "PNL-CP-001",
  "PNL-CP-002",
  "PNL-CP-003",
  "PNL-CP-004",
  "PNL-CP-005",
  "PNL-CP-006",
] as const;

const packages = listQuantV4Packages();
const pnlPackages = packages.filter((pkg) => pkg.packageId === "PNL-001");
assert.equal(
  pnlPackages.length,
  1,
  "Question Studio must expose exactly one PNL-001 package.",
);

const pnl = pnlPackages[0]!;
assert.equal(pnl.enabled, true);
assert.equal(pnl.topic, "Arithmetic");
assert.equal(pnl.subtopic, "Profit & Loss");
assert.deepEqual(pnl.supportedLanguages, [...LANGUAGES]);
assert.deepEqual(
  pnl.canonicalProblems.map((cp) => cp.id),
  [...CP_IDS],
);
assert.equal((pnl as any).runtimeMode, "CANONICAL_REVIEW");
assert.deepEqual((pnl as any).supportedRuntimeModes, [
  "CANONICAL_REVIEW",
  "DYNAMIC_CANDIDATE",
]);
assert.deepEqual((pnl as any).dynamicCandidateCpIds, [...CP_IDS]);
assert.equal((pnl as any).questionBankStatus, "WRITABLE");
assert.equal((pnl as any).testEligibility, "ELIGIBLE");
assert.equal((pnl as any).publiclyPublishable, true);
assert.deepEqual((pnl as any).runtimePolicies, {
  CANONICAL_REVIEW: {
    reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: true,
  },
  DYNAMIC_CANDIDATE: {
    reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
});

const rawPnlCheckpoints = packages.filter(
  (pkg) =>
    /^CP-\d{3}$/.test(pkg.packageId) &&
    /profit\s*(?:&|and)?\s*loss|profitandloss/i.test(pkg.subtopic),
);
assert.equal(rawPnlCheckpoints.length, 0);

const canonicalBatchSizes: Record<string, number> = {};
const dynamicBatchSizes: Record<string, number> = {};

for (const language of LANGUAGES) {
  const canonical = await generateQuestion({
    packageId: "PNL-001",
    runtimeMode: "CANONICAL_REVIEW",
    language,
    count: 12,
    seed: `pnl-question-studio-canonical:${language}`,
  });
  canonicalBatchSizes[language] = canonical.questionPackages.length;
  assert.equal(canonical.questionPackages.length, 12);
  assert.equal(canonical.questions.length, 12);
  assert.equal(canonical.generationContext.runtimeMode, "CANONICAL_REVIEW");
  assert.equal(
    canonical.generationContext.reviewStatus,
    "APPROVED_EDITORIAL_CANONICAL",
  );
  assert.equal(canonical.generationContext.questionBankStatus, "WRITABLE");
  assert.equal(canonical.generationContext.testEligibility, "ELIGIBLE");
  assert.equal(canonical.generationContext.publiclyPublishable, true);
  assert.deepEqual(
    [
      ...new Set(
        canonical.questionPackages.map((pkg: any) => pkg.canonicalProblemId),
      ),
    ].sort(),
    [...CP_IDS],
  );
  for (const pkg of canonical.questionPackages as any[]) {
    assert.equal(pkg.language, language);
    assert.equal(pkg.validation.valid, true);
    assert.equal(pkg.options.length, 4);
    assert.equal(new Set(pkg.options).size, 4);
    assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
    assert.equal(pkg.traceability.generationMode, "CANONICAL_REVIEW");
    assert.equal(pkg.traceability.questionBankStatus, "WRITABLE");
    assert.equal(pkg.traceability.testEligibility, "ELIGIBLE");
    assert.equal(pkg.traceability.publiclyPublishable, true);
    if (language !== "en") {
      const script =
        language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
      assert.ok(script.test(pkg.stem));
      assert.ok(script.test(pkg.explanation.lines.join("\n")));
    }
  }

  const dynamic = await generateQuestion({
    packageId: "PNL-001",
    runtimeMode: "DYNAMIC_CANDIDATE",
    language,
    count: 12,
    seed: `pnl-question-studio-dynamic:${language}`,
  });
  dynamicBatchSizes[language] = dynamic.questionPackages.length;
  assert.equal(dynamic.questionPackages.length, 12);
  assert.equal(dynamic.questions.length, 12);
  assert.equal(dynamic.generationContext.runtimeMode, "DYNAMIC_CANDIDATE");
  assert.equal(
    dynamic.generationContext.reviewStatus,
    "UNREVIEWED_DYNAMIC_CANDIDATE",
  );
  assert.equal(dynamic.generationContext.questionBankStatus, "NOT_STORED");
  assert.equal(dynamic.generationContext.testEligibility, "INELIGIBLE");
  assert.equal(dynamic.generationContext.publiclyPublishable, false);
  assert.deepEqual(
    [
      ...new Set(
        dynamic.questionPackages.map((pkg: any) => pkg.canonicalProblemId),
      ),
    ].sort(),
    [...CP_IDS],
  );
  for (const pkg of dynamic.questionPackages as any[]) {
    assert.equal(pkg.validation.valid, true);
    assert.equal(pkg.options.length, 4);
    assert.equal(new Set(pkg.options).size, 4);
    assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
    assert.equal(pkg.traceability.generationMode, "DYNAMIC_CANDIDATE");
    assert.equal(pkg.traceability.reviewStatus, "UNREVIEWED_DYNAMIC_CANDIDATE");
    assert.equal(pkg.traceability.questionBankStatus, "NOT_STORED");
    assert.equal(pkg.traceability.testEligibility, "INELIGIBLE");
    assert.equal(pkg.traceability.publiclyPublishable, false);
    if (language !== "en") {
      assert.equal(pkg.language, language);
      const script =
        language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
      assert.ok(script.test(pkg.stem));
      assert.ok(script.test(pkg.explanation.lines.join("\n")));
    }
  }
  for (const question of dynamic.questions as any[]) {
    assert.equal(question.runtimeMode, "DYNAMIC_CANDIDATE");
    assert.equal(question.reviewStatus, "UNREVIEWED_DYNAMIC_CANDIDATE");
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.equal(question.publiclyPublishable, false);
  }
}

for (const language of LANGUAGES) {
  const input = {
    packageId: "PNL-001" as const,
    runtimeMode: "DYNAMIC_CANDIDATE" as const,
    canonicalProblemId: "PNL-CP-006",
    questionLanguageId: "PNL-QL-186",
    language,
    seed: `pnl-question-studio-deterministic:${language}`,
  };
  const first = await generateQuestion(input);
  const second = await generateQuestion(input);
  assert.deepEqual(first.questionPackages[0], second.questionPackages[0]);
}

await assert.rejects(
  () =>
    generateQuestion({
      packageId: "PNL-001",
      runtimeMode: "UNSAFE_DYNAMIC" as never,
      seed: "pnl-runtime-mode-safety",
    }),
  /Unsupported PNL-001 runtime mode/,
);

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";
const {
  assertGeneratedQuestionBankEligible,
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} = await import("../../../../../../lib/admin-question-conversion");

for (const language of LANGUAGES) {
  const released = await generateQuestion({
    packageId: "PNL-001",
    runtimeMode: "CANONICAL_REVIEW",
    language,
    canonicalProblemId: "PNL-CP-001",
    questionLanguageId: "PNL-QL-001",
    seed: `pnl-question-bank-release:${language}`,
  });
  const releasedPreview = released.questions[0]!;
  assert.equal(getGeneratedQuestionBankEligibilityIssue(releasedPreview), null);
  assert.doesNotThrow(() =>
    assertGeneratedQuestionBankEligible(releasedPreview),
  );
  const normalizedReleased = normalizeGeneratedQuestionPayload(
    releasedPreview,
    {
      itemId: "00000000-0000-0000-0000-000000000001",
      generationRunCode: `GEN-PNL-RELEASE-${language.toUpperCase()}`,
    },
  );
  assert.equal(normalizedReleased.options.length, 4);
  assert.equal(
    normalizedReleased.options[normalizedReleased.correctIndex],
    releasedPreview.options[releasedPreview.correctIndex],
  );
}

const blocked = await generateQuestion({
  packageId: "PNL-001",
  runtimeMode: "DYNAMIC_CANDIDATE",
  language: "pa",
  canonicalProblemId: "PNL-CP-006",
  questionLanguageId: "PNL-QL-186",
  seed: "pnl-question-bank-block",
});
const preview = blocked.questions[0]!;
assert.equal(
  getGeneratedQuestionBankEligibilityIssue(preview),
  "questionBankStatus is NOT_STORED",
);
assert.throws(
  () => assertGeneratedQuestionBankEligible(preview),
  /cannot be converted to Question Bank: questionBankStatus is NOT_STORED/,
);
const tamperedDynamicPreview = {
  ...preview,
  questionBankStatus: "WRITABLE",
  testEligibility: "ELIGIBLE",
  publiclyPublishable: true,
};
assert.equal(
  getGeneratedQuestionBankEligibilityIssue(tamperedDynamicPreview),
  "runtimeMode DYNAMIC_CANDIDATE is review-only",
);
assert.throws(
  () => assertGeneratedQuestionBankEligible(tamperedDynamicPreview),
  /runtimeMode DYNAMIC_CANDIDATE is review-only/,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      packageId: "PNL-001",
      supportedLanguages: [...LANGUAGES],
      canonicalProblemIds: [...CP_IDS],
      canonicalBatchSizes,
      dynamicBatchSizes,
      dynamicCandidateLanguages: [...LANGUAGES],
      dynamicCandidateCpIds: [...CP_IDS],
      defaultRuntimeMode: "CANONICAL_REVIEW",
      optInRuntimeMode: "DYNAMIC_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
    null,
    2,
  ),
);
