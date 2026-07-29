import {
  generateQuestion as generateQuestionStudioQuestion,
  listQuantV4Packages,
} from "../../../../../question-studio-generation-engine";
import {
  MAL_CP001_PERMANENT_ALLOCATION,
  MAL_CP001_PERMANENT_QL_IDS,
} from "./foundation/cp001-permanent-allocation";
import { runMalCp001PermanentPipeline } from "./foundation/cp001-permanent-runtime";
import {
  MAL_CP001_ENGLISH_RELEASE,
  MAL_CP001_ENGLISH_REVIEW_APPROVAL,
  runMalCp001EnglishReleasePipeline,
} from "./foundation/cp001-release";
import { buildMalCp001ReleaseReviewModel } from "./foundation/cp001-release-review-model";
import { runMal001QuestionStudioPipeline } from "./question-studio-adapter";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

let releasedQuestionCount = 0;
let deterministicRegenerationCount = 0;
let solverPreservationCount = 0;
let activeQuestionCount = 0;
let releaseValidationCheckCount = 0;
let explanationLineCount = 0;
const releasedQlIds = new Set<string>();
const releasedStemSet = new Set<string>();

assert(MAL_CP001_ENGLISH_RELEASE.releaseId === "MAL-CP001-EN-v1", "Unexpected release ID.");
assert(MAL_CP001_ENGLISH_RELEASE.qlCount === 11, "Release must contain 11 permanent QLs.");
assert(MAL_CP001_ENGLISH_RELEASE.reviewQuestionCount === 44, "Release review count must be 44.");
assert(MAL_CP001_ENGLISH_REVIEW_APPROVAL.status === "APPROVED_FOR_ENGLISH_RELEASE", "English review approval is missing.");

for (const qlId of MAL_CP001_PERMANENT_QL_IDS) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `english-release-${qlId}-${index}`;
    const permanent = runMalCp001PermanentPipeline({
      questionLanguageId: qlId,
      seed,
      language: "en",
    });
    const released = runMalCp001EnglishReleasePipeline({
      questionLanguageId: qlId,
      seed,
      language: "en",
    });
    const regenerated = runMalCp001EnglishReleasePipeline({
      questionLanguageId: qlId,
      seed,
      language: "en",
    });

    releasedQuestionCount += 1;
    releasedQlIds.add(released.questionLanguageId);
    releasedStemSet.add(released.stem);

    assert(stable(released) === stable(regenerated), `${qlId}/${seed}: released generation is not deterministic.`);
    deterministicRegenerationCount += 1;

    assert(stable(released.solution) === stable(permanent.solution), `${qlId}/${seed}: release changed the exact solution.`);
    assert(stable(released.options) === stable(permanent.options), `${qlId}/${seed}: release changed learner options.`);
    assert(released.correctIndex === permanent.correctIndex, `${qlId}/${seed}: release changed the correct option index.`);
    assert(released.mathematicalFingerprint === permanent.mathematicalFingerprint, `${qlId}/${seed}: release changed the mathematical fingerprint.`);
    assert(stable(released.reasoningGraph) === stable(permanent.reasoningGraph), `${qlId}/${seed}: release changed the reasoning graph.`);
    solverPreservationCount += 1;

    assert(permanent.active === false, `${qlId}/${seed}: implementation-proof authority must remain inactive.`);
    assert(permanent.publiclyPublishable === false, `${qlId}/${seed}: implementation-proof authority became publishable.`);
    assert(released.active === true, `${qlId}/${seed}: released question is not active.`);
    assert(released.publiclyPublishable === true, `${qlId}/${seed}: released question is not publishable.`);
    assert(released.questionStudioDiscoverable === true, `${qlId}/${seed}: released question is hidden from Question Studio.`);
    assert(released.questionBankWritable === true, `${qlId}/${seed}: released question is not Question Bank writable.`);
    assert(released.testEligible === true, `${qlId}/${seed}: released question is not test eligible.`);
    assert(released.maturity === "FROZEN", `${qlId}/${seed}: released maturity is not FROZEN.`);
    assert(released.releaseStatus === "APPROVED", `${qlId}/${seed}: release status is not approved.`);
    activeQuestionCount += 1;

    assert(released.answer === released.options[released.correctIndex], `${qlId}/${seed}: answer does not match the correct option.`);
    assert(released.validation.ok && released.validation.valid, `${qlId}/${seed}: release validation failed.`);
    assert(released.validation.errors.length === 0, `${qlId}/${seed}: release contains validation errors.`);
    assert(released.validation.checks.every((check) => check.passed), `${qlId}/${seed}: a release validation check failed.`);
    releaseValidationCheckCount += released.validation.checks.length;

    assert(released.explanation.layoutId === "MAL-CP001-EN-SIMPLE-TEACHER-V1", `${qlId}/${seed}: wrong explanation authority.`);
    assert(released.explanation.lines.length >= 13, `${qlId}/${seed}: Question Studio explanation lines are incomplete.`);
    assert(released.explanation.lines.includes("📌 Core Concept & Formula"), `${qlId}/${seed}: core-concept section is missing.`);
    assert(released.explanation.lines.includes("📝 Step-by-Step Solution"), `${qlId}/${seed}: step section is missing.`);
    assert(released.explanation.lines.includes("⚡ 10-Second Exam Shortcut"), `${qlId}/${seed}: shortcut section is missing.`);
    assert(released.explanation.lines.includes("⚠️ Common Trap & Mistake Warning"), `${qlId}/${seed}: trap section is missing.`);
    explanationLineCount += released.explanation.lines.length;

    assert(released.traceability.releaseId === MAL_CP001_ENGLISH_RELEASE.releaseId, `${qlId}/${seed}: traceability release ID mismatch.`);
    assert(released.traceability.reviewStatus === "APPROVED_EDITORIAL_ENGLISH", `${qlId}/${seed}: traceability review status mismatch.`);
    assert(released.parameters.questionBankStatus === "WRITABLE", `${qlId}/${seed}: parameter Question Bank status mismatch.`);
    assert(released.parameters.testEligibility === "ELIGIBLE", `${qlId}/${seed}: parameter test status mismatch.`);
  }
}

assert(releasedQlIds.size === 11, `Released QL coverage is ${releasedQlIds.size}, expected 11.`);
assert(releasedQuestionCount === 1100, `Released question count is ${releasedQuestionCount}, expected 1100.`);
assert(activeQuestionCount === releasedQuestionCount, "Not every released question is active.");

const review = buildMalCp001ReleaseReviewModel();
assert(review.status === "MAL_CP001_ENGLISH_RELEASE_REVIEW_APPROVED", "Release review model is not approved.");
assert(review.reviewQuestionCount === 44, `Release review contains ${review.reviewQuestionCount} rows, expected 44.`);
assert(review.groups.length === 11, `Release review contains ${review.groups.length} QL groups, expected 11.`);
assert(review.groups.every((group) => group.reviewStatus === "APPROVED_FOR_ENGLISH_RELEASE"), "A release review group is not approved.");
assert(review.groups.flatMap((group) => group.questions).every((row) => row.reviewStatus === "APPROVED_FOR_ENGLISH_RELEASE"), "A release review row is not approved.");
const reviewStemCount = new Set(
  review.groups.flatMap((group) => group.questions.map((row) => row.question.stem)),
).size;
assert(reviewStemCount === 44, `Approved release review has ${reviewStemCount} distinct stems, expected 44.`);

for (const allocation of MAL_CP001_PERMANENT_ALLOCATION) {
  const adapterQuestion = runMal001QuestionStudioPipeline("MAL-CP-001", {
    difficulty: allocation.difficulty,
    language: "en",
    questionLanguageId: allocation.qlId,
    seed: `adapter-${allocation.qlId}`,
  });
  assert(adapterQuestion.questionLanguageId === allocation.qlId, `${allocation.qlId}: adapter selected another QL.`);
  assert(adapterQuestion.difficultyBand === allocation.difficulty, `${allocation.qlId}: adapter difficulty mismatch.`);
  assert(adapterQuestion.publiclyPublishable, `${allocation.qlId}: adapter did not use the released pipeline.`);
}

const packages = listQuantV4Packages();
const packageCard = packages.find((item: any) => item.packageId === "MAL-001") as any;
assert(packageCard, "MAL-001 is missing from Question Studio package discovery.");
assert(packageCard.enabled === true, "MAL-001 package is not enabled.");
assert(packageCard.cpIds?.includes("MAL-CP-001"), "MAL-CP-001 is missing from the package card.");
assert(packageCard.supportedLanguages?.length === 1 && packageCard.supportedLanguages[0] === "en", "MAL-001 package language exposure is not English-only.");
assert(packageCard.questionBankStatus === "WRITABLE", "MAL-001 package is not Question Bank writable.");
assert(packageCard.testEligibility === "ELIGIBLE", "MAL-001 package is not test eligible.");
assert(packageCard.publiclyPublishable === true, "MAL-001 package is not publishable.");

let questionStudioPreviewCount = 0;
for (const allocation of MAL_CP001_PERMANENT_ALLOCATION) {
  const result: any = await generateQuestionStudioQuestion({
    packageId: "MAL-001",
    canonicalProblemId: "MAL-CP-001",
    questionLanguageId: allocation.qlId,
    difficulty: allocation.difficulty,
    language: "en",
    count: 2,
    seed: `question-studio-${allocation.qlId}`,
  });
  assert(result.questionPackages.length === 2, `${allocation.qlId}: Question Studio package batch count mismatch.`);
  assert(result.questions.length === 2, `${allocation.qlId}: Question Studio preview batch count mismatch.`);
  assert(result.generationContext.runtimeMode === "RELEASED", `${allocation.qlId}: release runtime mode is missing from generation context.`);
  assert(result.generationContext.questionBankStatus === "WRITABLE", `${allocation.qlId}: Question Bank status is missing from generation context.`);
  for (const preview of result.questions) {
    assert(preview.packageId === "MAL-001", `${allocation.qlId}: preview package ID mismatch.`);
    assert(preview.canonicalProblemId === "MAL-CP-001", `${allocation.qlId}: preview CP mismatch.`);
    assert(preview.questionLanguageId === allocation.qlId, `${allocation.qlId}: preview QL mismatch.`);
    assert(preview.publiclyPublishable === true, `${allocation.qlId}: preview is not publishable.`);
    assert(preview.questionBankStatus === "WRITABLE", `${allocation.qlId}: preview is not Question Bank writable.`);
    assert(preview.testEligibility === "ELIGIBLE", `${allocation.qlId}: preview is not test eligible.`);
    assert(typeof preview.explanation === "string" && preview.explanation.includes("Core Concept & Formula"), `${allocation.qlId}: preview explanation is incomplete.`);
    assert(preview.options.length === 4, `${allocation.qlId}: preview does not have four options.`);
    questionStudioPreviewCount += 1;
  }
}

let unsupportedLanguageRejected = false;
try {
  await generateQuestionStudioQuestion({
    packageId: "MAL-001",
    language: "hi",
    count: 1,
    seed: "unsupported-language",
  });
} catch {
  unsupportedLanguageRejected = true;
}
assert(unsupportedLanguageRejected, "Question Studio did not reject unsupported Hindi generation.");

let unknownCpRejected = false;
try {
  await generateQuestionStudioQuestion({
    packageId: "MAL-001",
    canonicalProblemId: "MAL-CP-999",
    language: "en",
    count: 1,
    seed: "unknown-cp",
  });
} catch {
  unknownCpRejected = true;
}
assert(unknownCpRejected, "Question Studio did not reject an unknown MAL canonical problem.");

let unknownQlRejected = false;
try {
  await generateQuestionStudioQuestion({
    packageId: "MAL-001",
    canonicalProblemId: "MAL-CP-001",
    questionLanguageId: "MAL-QL-999",
    language: "en",
    count: 1,
    seed: "unknown-ql",
  });
} catch {
  unknownQlRejected = true;
}
assert(unknownQlRejected, "Question Studio did not reject an unknown MAL QL.");

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP001_ENGLISH_RELEASE_AND_QUESTION_STUDIO",
      releaseId: MAL_CP001_ENGLISH_RELEASE.releaseId,
      releasedQlCount: releasedQlIds.size,
      releasedQuestionCount,
      deterministicRegenerationCount,
      solverPreservationCount,
      activeQuestionCount,
      distinctReleasedStemCount: releasedStemSet.size,
      releaseValidationCheckCount,
      explanationLineCount,
      approvedReviewQuestionCount: review.reviewQuestionCount,
      approvedReviewDistinctStemCount: reviewStemCount,
      questionStudioPackageDiscovered: true,
      questionStudioPreviewCount,
      unsupportedLanguageRejected,
      unknownCpRejected,
      unknownQlRejected,
      publiclyPublishable: true,
      questionStudioDiscoverable: true,
      questionBankWritable: true,
      testEligible: true,
      excludedLanguages: MAL_CP001_ENGLISH_RELEASE.excludedLanguages,
    },
    null,
    2,
  ),
);
