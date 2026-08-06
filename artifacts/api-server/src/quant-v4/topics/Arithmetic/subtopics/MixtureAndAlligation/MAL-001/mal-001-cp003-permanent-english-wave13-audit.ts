import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP003_COMPLETION_LEDGER,
  MAL_CP003_FREEZE_READINESS,
} from "./foundation/cp003-completion-ledger";
import {
  generateMalCp003PermanentQuestion,
  MAL_CP003_ENGLISH_RELEASE,
  MAL_CP003_PERMANENT_ALLOCATION,
  MAL_CP003_PERMANENT_QL_IDS,
  MAL_CP003_PERMANENT_RUNTIME_ID,
  runMalCp003EnglishReleasePipeline,
  type MalCp003PermanentQlId,
  type MalCp003ReleasedQuestion,
} from "./foundation/cp003-permanent-runtime";
import {
  MAL_CP003_WAVE12_CONTRACT_IDS,
  MAL_CP003_WAVE12_READINESS,
} from "./foundation/cp003-unified-runtime-wave12-editorial";
import { MAL_CP003_WAVE11_READINESS } from "./foundation/cp003-source-policy-closure-wave11";
import { runMal001QuestionStudioPipeline } from "./question-studio-adapter";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? `${item}n` : item,
  );
}

function expectThrows(action: () => unknown, message: string): void {
  let threw = false;
  try {
    action();
  } catch {
    threw = true;
  }
  assert(threw, message);
}

function qlNumber(qlId: MalCp003PermanentQlId): number {
  return Number(qlId.slice("MAL-QL-".length));
}

function verifyReleasedQuestion(
  question: MalCp003ReleasedQuestion,
  expectedQlId: MalCp003PermanentQlId,
): void {
  assert(question.packageId === "MAL-001", "Wrong package identity.");
  assert(question.archetypeId === "MAL-001", "Wrong archetype identity.");
  assert(question.canonicalProblemId === "MAL-CP-003", "Wrong CP identity.");
  assert(question.runtimeId === MAL_CP003_PERMANENT_RUNTIME_ID, "Wrong permanent runtime.");
  assert(question.permanentQlId === expectedQlId, "Permanent QL mismatch.");
  assert(question.questionLanguageId === expectedQlId, "Question-language ID mismatch.");
  assert(question.questionId.includes(expectedQlId), "Question ID omits permanent QL.");
  assert(question.language === "en" && question.locale === "en-IN", "Wrong language release.");
  assert(question.maturity === "FROZEN", "Question is not frozen.");
  assert(question.allocationStatus === "RELEASED_ENGLISH_V1", "Wrong allocation status.");
  assert(question.releaseStatus === "APPROVED", "Release status is not approved.");
  assert(question.runtimeMode === "RELEASED", "Runtime mode is not released.");
  assert(question.reviewStatus === "APPROVED_EDITORIAL_ENGLISH", "Editorial review status is wrong.");
  assert(question.questionBankStatus === "WRITABLE", "Question Bank status is not writable.");
  assert(question.testEligibility === "ELIGIBLE", "Test eligibility string is wrong.");
  assert(question.permanentIdentityFrozen, "Permanent identity is not frozen.");
  assert(
    question.active &&
      question.publiclyPublishable &&
      question.questionStudioDiscoverable &&
      question.questionBankWritable &&
      question.testEligible,
    "An approved English delivery surface is disabled.",
  );
  assert(question.validation.ok && question.validation.valid, "Release validation failed.");
  assert(question.validation.errors.length === 0, "Release contains validation errors.");
  assert(question.validation.checks.length >= 4, "Release validation proof is incomplete.");
  assert(question.validation.checks.every((check) => check.passed), "A release check failed.");
  assert(question.stem.endsWith("?"), "Stem is not interrogative.");
  assert(!/[{}]/u.test(question.stem), "Stem contains an unresolved placeholder.");
  const learnerVisible = JSON.stringify({
    stem: question.stem,
    answer: question.answer,
    options: question.options,
    explanation: question.explanation,
    diagram: question.diagram,
  });
  assert(!/\b(?:undefined|NaN)\b/u.test(learnerVisible), "Invalid learner-visible token escaped.");
  assert(question.options.length === 4, "Question does not have four options.");
  assert(new Set(question.options).size === 4, "Question options are not unique.");
  assert(question.options[question.correctIndex] === question.answer, "Correct option is wrong.");
  assert(question.optionAudit.filter((option) => option.isCorrect).length === 1, "Option audit correct count is wrong.");
  assert(question.sourceEvidenceIds.length > 0, "Source evidence is absent.");
  assert(question.explanation.steps.length >= 4, "Explanation has too few worked steps.");
  assert(question.explanation.lines.length >= 12, "Rendered explanation lines are incomplete.");
  assert(question.explanation.conclusion.includes(question.answer), "Conclusion omits the answer.");
  assert(question.diagram !== null && question.diagram !== undefined, "Diagram or stage ledger is absent.");
  assert(!/\balligation\b/iu.test(JSON.stringify(question.explanation)), "Alligation leaked into replacement reasoning.");
  assert(question.reasoningGraph.nodes[0]?.kind === "GIVEN", "Reasoning graph lacks a given node.");
  assert(question.reasoningGraph.nodes.at(-1)?.kind === "CONCLUSION", "Reasoning graph lacks a conclusion.");
  assert(question.traceability.questionLanguageId === expectedQlId, "Traceability QL mismatch.");
  assert(question.traceability.releaseId === MAL_CP003_ENGLISH_RELEASE.releaseId, "Traceability release mismatch.");
  assert(question.traceability.sourceEvidenceIds.length > 0, "Traceability evidence is absent.");
  assert(question.traceability.publiclyPublishable, "Traceability publication flag is false.");
}

assert(MAL_CP003_WAVE11_READINESS.sourcePolicyReadiness, "Wave 11 readiness regressed.");
assert(MAL_CP003_WAVE11_READINESS.remainingSourcePolicyBlockerCount === 0, "Source-policy blockers returned.");
assert(MAL_CP003_WAVE12_READINESS.runtimeEditorialReadiness, "Wave 12 editorial readiness regressed.");
assert(MAL_CP003_WAVE12_CONTRACT_IDS.length === 9, "Wave 12 contract count changed.");
assert(MAL_CP003_PERMANENT_QL_IDS.length === 9, "Wave 13 must allocate nine QLs.");
assert(MAL_CP003_PERMANENT_ALLOCATION.length === 9, "Allocation row count mismatch.");
assert(new Set(MAL_CP003_PERMANENT_QL_IDS).size === 9, "Permanent QL IDs are not unique.");
assert(new Set(MAL_CP003_PERMANENT_ALLOCATION.map((row) => row.contractId)).size === 9, "Allocation contract IDs are not unique.");
assert(
  MAL_CP003_PERMANENT_ALLOCATION.every((row) =>
    MAL_CP003_WAVE12_CONTRACT_IDS.includes(row.contractId),
  ),
  "A permanent allocation points outside the Wave 12 contract set.",
);
for (let index = 0; index < MAL_CP003_PERMANENT_QL_IDS.length; index += 1) {
  assert(
    qlNumber(MAL_CP003_PERMANENT_QL_IDS[index]!) === 29 + index,
    "Permanent QL range is not continuous from MAL-QL-029.",
  );
}
assert(MAL_CP003_ENGLISH_RELEASE.status === "FROZEN", "English release is not frozen.");
assert(MAL_CP003_ENGLISH_RELEASE.qlCount === 9, "Release QL count mismatch.");
assert(MAL_CP003_ENGLISH_RELEASE.qlRange === "MAL-QL-029..MAL-QL-037", "Release range mismatch.");
assert(MAL_CP003_ENGLISH_RELEASE.reviewQuestionCount === 36, "Review count mismatch.");
assert(MAL_CP003_ENGLISH_RELEASE.excludedLanguages.join(",") === "hi,pa", "Language exclusions changed.");
assert(MAL_CP003_FREEZE_READINESS.status === "FROZEN_ENGLISH", "Freeze ledger is not frozen.");
assert(MAL_CP003_FREEZE_READINESS.meaningfulOwnedUncoveredContractCount === 0, "Owned contracts remain uncovered.");
assert(MAL_CP003_FREEZE_READINESS.permanentQlCount === 9, "Freeze QL count mismatch.");
assert(MAL_CP003_FREEZE_READINESS.mergedRepresentationCount === 2, "Representation merge count mismatch.");
assert(MAL_CP003_FREEZE_READINESS.ownershipBoundaryCount === 2, "Ownership boundary count mismatch.");
assert(MAL_CP003_FREEZE_READINESS.englishFrozen, "English is not frozen.");
assert(!MAL_CP003_FREEZE_READINESS.hindiFrozen && !MAL_CP003_FREEZE_READINESS.punjabiFrozen, "Unreviewed languages were frozen.");

const coveredQlIds = new Set(
  MAL_CP003_COMPLETION_LEDGER.flatMap((row) => row.qlIds),
);
for (const qlId of MAL_CP003_PERMANENT_QL_IDS) {
  assert(coveredQlIds.has(qlId), `${qlId} is absent from the completion ledger.`);
}
assert(
  MAL_CP003_COMPLETION_LEDGER.some((row) => row.disposition === "EXCLUDED_TO_CP004"),
  "CP-004 boundary is absent.",
);
assert(
  MAL_CP003_COMPLETION_LEDGER.some((row) => row.disposition === "EXCLUDED_TO_CP006"),
  "CP-006 boundary is absent.",
);

const seedsPerQl = 200;
let generatedCount = 0;
let deterministicCount = 0;
let questionStudioExplicitCount = 0;
let questionStudioSelectionCount = 0;
const stems = new Set<string>();
const fingerprints = new Set<string>();
const explanations = new Set<string>();
const answerPositionCounts = [0, 0, 0, 0];
const stemsByQl = new Map<MalCp003PermanentQlId, Set<string>>();
const fingerprintsByQl = new Map<MalCp003PermanentQlId, Set<string>>();
const answersByQl = new Map<MalCp003PermanentQlId, Set<string>>();
const reviewRows: Array<{
  reviewKey: string;
  qlId: MalCp003PermanentQlId;
  familyId: string;
  reviewStatus: "APPROVED_UNDER_COMPLETION_DIRECTIVE";
  question: MalCp003ReleasedQuestion;
}> = [];
let ql029OriginalQuantityCount = 0;
let ql029OriginalFractionCount = 0;
let ql029RefillQuantityCount = 0;

for (const allocation of MAL_CP003_PERMANENT_ALLOCATION) {
  const qlStems = new Set<string>();
  const qlFingerprints = new Set<string>();
  const qlAnswers = new Set<string>();
  stemsByQl.set(allocation.qlId, qlStems);
  fingerprintsByQl.set(allocation.qlId, qlFingerprints);
  answersByQl.set(allocation.qlId, qlAnswers);

  for (let index = 0; index < seedsPerQl; index += 1) {
    const seed = `mal-cp003-wave13:${allocation.qlId}:${index}`;
    const first = generateMalCp003PermanentQuestion(allocation.qlId, seed);
    const second = runMalCp003EnglishReleasePipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    assert(stable(first) === stable(second), `${allocation.qlId}/${seed}: release replay is not deterministic.`);
    deterministicCount += 1;
    verifyReleasedQuestion(first, allocation.qlId);
    assert(first.contractId === allocation.contractId, "Allocation contract mismatch.");
    assert(first.difficulty === allocation.difficulty, "Allocation difficulty mismatch.");
    assert(first.taskDirection === allocation.taskDirection, "Task direction mismatch.");
    assert(first.answerSemantic === allocation.answerSemantic, "Answer semantic mismatch.");

    if (allocation.qlId === "MAL-QL-029") {
      if (first.representationVariant === "FINAL_ORIGINAL_QUANTITY") ql029OriginalQuantityCount += 1;
      else if (first.representationVariant === "FINAL_ORIGINAL_FRACTION") ql029OriginalFractionCount += 1;
      else if (first.representationVariant === "FINAL_REFILL_QUANTITY") ql029RefillQuantityCount += 1;
      else fail("MAL-QL-029 emitted an invalid representation.");
    }

    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    explanations.add(stable(first.explanation));
    qlStems.add(first.stem);
    qlFingerprints.add(first.mathematicalFingerprint);
    qlAnswers.add(first.answer);
    answerPositionCounts[first.correctIndex] += 1;
    generatedCount += 1;
    if (index < 4) {
      reviewRows.push({
        reviewKey: `${allocation.qlId}:review-${index + 1}`,
        qlId: allocation.qlId,
        familyId: allocation.familyId,
        reviewStatus: "APPROVED_UNDER_COMPLETION_DIRECTIVE",
        question: first,
      });
    }
  }

  const studioQuestion = runMal001QuestionStudioPipeline("MAL-CP-003", {
    questionLanguageId: allocation.qlId,
    seed: `mal-cp003-wave13:studio:${allocation.qlId}`,
    language: "en",
  });
  assert(studioQuestion.permanentQlId === allocation.qlId, "Question Studio explicit QL routing failed.");
  assert(studioQuestion.questionStudioDiscoverable, "Question Studio returned a hidden question.");
  questionStudioExplicitCount += 1;
}

for (let index = 0; index < 90; index += 1) {
  const question = runMal001QuestionStudioPipeline("MAL-CP-003", {
    seed: `mal-cp003-wave13:studio-selection:${index}`,
    language: "en",
  });
  assert(MAL_CP003_PERMANENT_QL_IDS.includes(question.permanentQlId as MalCp003PermanentQlId), "Question Studio selected a non-CP003 QL.");
  assert(question.canonicalProblemId === "MAL-CP-003", "Question Studio selected the wrong CP.");
  questionStudioSelectionCount += 1;
}

expectThrows(
  () =>
    runMalCp003EnglishReleasePipeline({
      questionLanguageId: "MAL-QL-029",
      language: "hi" as any,
    }),
  "Hindi unexpectedly entered the English release.",
);
expectThrows(
  () =>
    runMal001QuestionStudioPipeline("MAL-CP-003", {
      questionLanguageId: "MAL-QL-028",
      language: "en",
    }),
  "Question Studio accepted a CP-002 QL for CP-003.",
);

const stemsByQlSummary = Object.fromEntries(
  [...stemsByQl].map(([qlId, values]) => [qlId, values.size]),
);
const fingerprintsByQlSummary = Object.fromEntries(
  [...fingerprintsByQl].map(([qlId, values]) => [qlId, values.size]),
);
const answersByQlSummary = Object.fromEntries(
  [...answersByQl].map(([qlId, values]) => [qlId, values.size]),
);

assert(generatedCount === 1800, `Expected 1,800 released questions, received ${generatedCount}.`);
assert(deterministicCount === 1800, "Deterministic replay count mismatch.");
assert(reviewRows.length === 36, "Expected 36 permanent review rows.");
assert(questionStudioExplicitCount === 9, "Question Studio explicit routing count mismatch.");
assert(questionStudioSelectionCount === 90, "Question Studio selection count mismatch.");
assert(answerPositionCounts.every((count) => count >= 300), `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`);
assert(stems.size >= 300, `Released stem diversity is too low: ${stems.size}.`);
assert(fingerprints.size >= 150, `Released mathematical diversity is too low: ${fingerprints.size}.`);
assert(explanations.size >= 300, `Released explanation diversity is too low: ${explanations.size}.`);
assert(
  [...stemsByQl.values()].every((values) => values.size >= 18),
  `Per-QL stem diversity is too low: ${JSON.stringify(stemsByQlSummary)}.`,
);
assert(
  [...fingerprintsByQl.values()].every((values) => values.size >= 12),
  `Per-QL fingerprint diversity is too low: ${JSON.stringify(fingerprintsByQlSummary)}.`,
);
assert(
  [...answersByQl.values()].every((values) => values.size >= 4),
  `Per-QL answer diversity is too low: ${JSON.stringify(answersByQlSummary)}.`,
);
assert(ql029OriginalQuantityCount >= 45, "MAL-QL-029 original-quantity representation is under-sampled.");
assert(ql029OriginalFractionCount >= 45, "MAL-QL-029 fraction representation is under-sampled.");
assert(ql029RefillQuantityCount >= 45, "MAL-QL-029 refill representation is under-sampled.");
assert(
  ql029OriginalQuantityCount + ql029OriginalFractionCount + ql029RefillQuantityCount === 200,
  "MAL-QL-029 representation count mismatch.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp003-permanent-english-wave13-review.json");
const markdownPath = resolve(outputDirectory, "mal-cp003-permanent-english-wave13-review.md");
const summary = {
  status: "PASS_MAL_CP003_PERMANENT_ENGLISH_WAVE13",
  canonicalProblemId: "MAL-CP-003",
  releaseId: MAL_CP003_ENGLISH_RELEASE.releaseId,
  runtimeId: MAL_CP003_PERMANENT_RUNTIME_ID,
  qlCount: MAL_CP003_PERMANENT_QL_IDS.length,
  qlRange: MAL_CP003_ENGLISH_RELEASE.qlRange,
  seedsPerQl,
  generatedCount,
  deterministicCount,
  distinctStemCount: stems.size,
  distinctFingerprintCount: fingerprints.size,
  distinctExplanationCount: explanations.size,
  answerPositionCounts,
  stemsByQl: stemsByQlSummary,
  fingerprintsByQl: fingerprintsByQlSummary,
  answersByQl: answersByQlSummary,
  ql029RepresentationCounts: {
    finalOriginalQuantity: ql029OriginalQuantityCount,
    finalOriginalFraction: ql029OriginalFractionCount,
    finalRefillQuantity: ql029RefillQuantityCount,
  },
  reviewQuestionCount: reviewRows.length,
  completionLedgerRowCount: MAL_CP003_COMPLETION_LEDGER.length,
  questionStudioExplicitCount,
  questionStudioSelectionCount,
  meaningfulOwnedUncoveredContractCount: 0,
  remainingSourcePolicyBlockerCount: 0,
  englishFrozen: true,
  hindiFrozen: false,
  punjabiFrozen: false,
  active: true,
  publiclyPublishable: true,
  questionStudioDiscoverable: true,
  questionBankWritable: true,
  testEligible: true,
};
writeFileSync(
  jsonPath,
  `${JSON.stringify({ ...summary, allocation: MAL_CP003_PERMANENT_ALLOCATION, completionLedger: MAL_CP003_COMPLETION_LEDGER, reviewRows }, (_key, value) => (typeof value === "bigint" ? value.toString() : value), 2)}\n`,
  "utf8",
);
const markdown: string[] = [
  "# MAL-CP-003 Wave 13 — Permanent English Release Review",
  "",
  `Status: **${summary.status}**`,
  `Permanent range: **${summary.qlRange}**`,
  `Released corpus: **${generatedCount}**`,
  `Review rows: **${reviewRows.length}**`,
  `Question Studio explicit routes: **${questionStudioExplicitCount}**`,
  "",
];
for (const row of reviewRows) {
  const question = row.question;
  markdown.push(
    `## ${row.qlId} — ${row.familyId} — ${row.reviewKey}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, index) => `${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? " **✓**" : ""}`,
    ),
    "",
    `**Answer:** ${question.answer}`,
    "",
    ...question.explanation.lines,
    "",
    "---",
    "",
  );
}
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ ...summary, jsonPath, markdownPath }, null, 2));
