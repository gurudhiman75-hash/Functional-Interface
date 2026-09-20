import { strict as assert } from "node:assert";

import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
  resolveQuestionStudioEngine,
} from "../engine-registry";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import {
  ENV_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  ENV_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  ENV_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isEnv001QuestionStudioRequestV1,
  knowledgeV1Env001QuestionStudioAdapterV1,
} from "./knowledge-v1-env001-adapter-v1";

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const pkg = ENV_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;

assert.equal(pkg.engineId, "knowledge-v1");
assert.equal(pkg.packageId, "ENV-001");
assert.equal(pkg.enabled, true);
assert.equal(pkg.subject, "Static GK");
assert.equal(pkg.topic, "Environment & Ecology");
assert.equal(pkg.cpIds.length, 20);
assert.deepEqual(pkg.cpIds, Array.from({ length: 20 }, (_, i) => `ENV-CP-${String(i + 1).padStart(3, "0")}`));
assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(pkg.runtimeMode, "review-only");
assert.equal(pkg.lifecycleId, lifecycle.lifecycleId);
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.questionBankStatus, "NOT_STORED");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.equal(pkg.metadata?.registrationAuthorityId, ENV_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1);
assert.equal(pkg.metadata?.qlCount, 255);
assert.equal(pkg.metadata?.questionsPerLanguage, 1020);
assert.equal(pkg.metadata?.multilingualSurfaceCount, 3060);
assert.equal(pkg.metadata?.multilingualReviewApproved, true);

const registryMatches = listQuestionStudioPackages().filter((entry) => entry.packageId === ENV_001_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.equal(registryMatches.length, 1, "ENV-001 must be registered exactly once");
assert.equal(resolveQuestionStudioEngine({ packageId: "ENV-001" }).engineId, "knowledge-v1");

assert.equal(isEnv001QuestionStudioRequestV1({ packageId: "ENV-001" }), true);
assert.equal(isEnv001QuestionStudioRequestV1({ canonicalProblemId: "ENV-CP-014" }), true);
assert.equal(isEnv001QuestionStudioRequestV1({ questionLanguageId: "ENV-014-QL-013" }), true);
assert.equal(isEnv001QuestionStudioRequestV1({ subject: "Static GK", topic: "Environment & Ecology", subtopic: "Complete Chapter" }), true);
assert.equal(isEnv001QuestionStudioRequestV1({ packageId: "POL-001" }), false);

const base = {
  engineId: "knowledge-v1" as const,
  packageId: "ENV-001",
  runtimeMode: "review-only",
  difficulty: "Mixed",
  count: 12,
  seed: "env001-question-studio-integration-v1",
};

const byLanguage = new Map<string, Awaited<ReturnType<typeof knowledgeV1Env001QuestionStudioAdapterV1.generate>>>();
for (const language of ["en", "hi", "pa"] as const) {
  const result = await knowledgeV1Env001QuestionStudioAdapterV1.generate({ ...base, language });
  byLanguage.set(language, result);
  assert.equal(result.questions.length, 12);
  assert.equal(result.generationContext?.engineId, "knowledge-v1");
  assert.equal(result.generationContext?.packageId, "ENV-001");
  assert.equal(result.generationContext?.lifecycleStage, "REVIEW_ONLY");
  assert.equal(result.generationContext?.questionBankWritable, false);
  assert.equal(result.generationContext?.testEligible, false);
  assert.equal(result.generationContext?.multilingualReviewApproved, true);
  assert.equal(result.questions.every((q) => q.packageId === "ENV-001"), true);
  assert.equal(result.questions.every((q) => q.language === language), true);
  assert.equal(result.questions.every((q) => q.reviewOnly === true), true);
  assert.equal(result.questions.every((q) => q.runtimeRegistered === true), true);
  assert.equal(result.questions.every((q) => q.questionStudioDiscoverable === true), true);
  assert.equal(result.questions.every((q) => q.questionStudioGenerationEnabled === true), true);
  assert.equal(result.questions.every((q) => q.questionBankWritable === false), true);
  assert.equal(result.questions.every((q) => q.testEligible === false), true);
  assert.equal(result.questions.every((q) => Array.isArray(q.options) && q.options.length === 4), true);
}

const identity = (question: Record<string, unknown>) =>
  `${String(question.sourceQuestionId)}|${String(question.cpId)}|${String(question.qlId)}|${String(question.correctIndex)}`;
const englishIds = byLanguage.get("en")!.questions.map(identity);
assert.deepEqual(byLanguage.get("hi")!.questions.map(identity), englishIds);
assert.deepEqual(byLanguage.get("pa")!.questions.map(identity), englishIds);

const repeat = await knowledgeV1Env001QuestionStudioAdapterV1.generate({ ...base, language: "en" });
assert.deepEqual(repeat.questions.map(identity), englishIds, "ENV-001 deterministic replay drifted");

const cpResult = await generateQuestionStudioQuestions({
  engineId: "knowledge-v1",
  packageId: "ENV-001",
  canonicalProblemId: "ENV-CP-015",
  language: "pa",
  difficulty: "Hard",
  runtimeMode: "review-only",
  count: 4,
  seed: "env001-cp015-hard-pa",
});
assert.equal(cpResult.questions.length, 4);
assert.equal(cpResult.questions.every((q) => q.cpId === "ENV-CP-015"), true);
assert.equal(cpResult.questions.every((q) => q.difficulty === "Hard"), true);
assert.equal(cpResult.questions.every((q) => q.locale === "pa-IN"), true);

const qlResult = await generateQuestionStudioQuestions({
  packageId: "ENV-001",
  questionLanguageId: "ENV-014-QL-013",
  language: "hi",
  runtimeMode: "review-only",
  difficulty: "Mixed",
  count: 4,
  seed: "env001-ql013-hi",
});
assert.equal(qlResult.engineId, "knowledge-v1");
assert.equal(qlResult.questions.length, 4);
assert.equal(qlResult.questions.every((q) => q.cpId === "ENV-CP-014"), true);
assert.equal(qlResult.questions.every((q) => q.qlId === "ENV-014-QL-013"), true);
assert.equal(qlResult.questions.every((q) => q.locale === "hi-IN"), true);

await assert.rejects(
  () => knowledgeV1Env001QuestionStudioAdapterV1.generate({ packageId: "ENV-001", runtimeMode: "BANK_ONLY" }),
  /only supports review-only runtime/,
);
await assert.rejects(
  () => knowledgeV1Env001QuestionStudioAdapterV1.generate({ packageId: "ENV-001", canonicalProblemId: "ENV-CP-999" }),
  /Unknown ENV-001 selector/,
);
await assert.rejects(
  () => knowledgeV1Env001QuestionStudioAdapterV1.generate({
    packageId: "ENV-001",
    questionLanguageId: "ENV-014-QL-013",
    count: 5,
  }),
  /cannot fill 5 questions from a 4-question frozen pool without repeats/,
);

console.log("[ENV-001-QUESTION-STUDIO-INTEGRATION-V1] PASS cp=20 ql=255 questionsPerLanguage=1020 surfaces=3060 languages=en,hi,pa lifecycle=REVIEW_ONLY");
