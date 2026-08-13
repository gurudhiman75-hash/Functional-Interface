import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP001_PERMANENT_ALLOCATION, NUM_CP001_PERMANENT_QL_IDS } from "./permanent/allocation";
import {
  NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE,
  runNumCp001QuestionStudioReview,
} from "./question-studio-review-release";
import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../../question-studio-review-engine";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const languages = ["en", "hi", "pa"] as const;
const internalPattern = /NUM-(?:CP|QL)|PROT-|solveModeId|proposalId|questionLanguageId/iu;
const answerPositions = new Map<string, Set<number>>(languages.map((language) => [language, new Set()]));
const reviewSamples: any[] = [];
const questionIds = new Set<string>();
let directQuestions = 0;
let optionViolations = 0;
let answerViolations = 0;
let sourceLifecycleViolations = 0;
let reviewLifecycleViolations = 0;
let learnerIdentityLeaks = 0;
let scriptViolations = 0;

assert(NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.qlCount === 21, "release QL count");
assert(NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.maturity === "MULTILINGUAL_IMPLEMENTATION_FROZEN", "release maturity");
assert(NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.questionStudioDiscoverable === true, "review discoverability closed");
assert(NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.questionBankWritable === false, "Question Bank gate opened");
assert(NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.testEligible === false, "test gate opened");
assert(NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.publiclyPublishable === false, "public gate opened");
assert(NUM_CP001_PERMANENT_QL_IDS.length === 21, "permanent QL count");

for (const allocation of NUM_CP001_PERMANENT_ALLOCATION) {
  assert(allocation.maturity === "MULTILINGUAL_IMPLEMENTATION_FROZEN", `${allocation.qlId}: source maturity`);
  assert(allocation.active === false, `${allocation.qlId}: source active leak`);
  assert(allocation.questionStudioDiscoverable === false, `${allocation.qlId}: source Question Studio flag mutated`);
  assert(allocation.questionBankWritable === false, `${allocation.qlId}: source Question Bank flag mutated`);
  assert(allocation.testEligible === false, `${allocation.qlId}: source test flag mutated`);
  assert(allocation.publiclyPublishable === false, `${allocation.qlId}: source public flag mutated`);
}

for (const language of languages) {
  for (const qlId of NUM_CP001_PERMANENT_QL_IDS) {
    for (let variant = 1; variant <= 4; variant += 1) {
      const question = runNumCp001QuestionStudioReview({
        questionLanguageId: qlId,
        language,
        seed: `cp001-qs-review-audit:${language}:${qlId}:${variant}`,
      });
      directQuestions += 1;
      answerPositions.get(language)!.add(question.correctIndex);
      questionIds.add(question.questionId);

      if (question.options.length !== 4 || new Set(question.options).size !== 4) optionViolations += 1;
      if (
        question.options[question.correctIndex] !== question.answer
        || question.canonicalAnswer !== question.answer
        || question.verifierAnswer !== question.answer
      ) answerViolations += 1;
      if (
        question.sourceLifecycle.active
        || question.sourceLifecycle.questionStudioDiscoverable
        || question.sourceLifecycle.questionBankWritable
        || question.sourceLifecycle.testEligible
        || question.sourceLifecycle.publiclyPublishable
      ) sourceLifecycleViolations += 1;
      if (
        question.active !== true
        || question.questionStudioDiscoverable !== true
        || question.questionBankWritable !== false
        || question.testEligible !== false
        || question.publiclyPublishable !== false
        || question.questionBankStatus !== "NOT_STORED"
        || question.testEligibility !== "INELIGIBLE"
      ) reviewLifecycleViolations += 1;

      const learnerText = [question.stem, ...question.options, ...(question.explanation.lines ?? [])].join("\n");
      if (internalPattern.test(learnerText)) learnerIdentityLeaks += 1;
      if (language === "hi" && !/[\u0900-\u097F]/u.test(learnerText)) scriptViolations += 1;
      if (language === "pa" && !/[\u0A00-\u0A7F]/u.test(learnerText)) scriptViolations += 1;
      if (variant === 1) reviewSamples.push(question);
    }
  }
}

assert(directQuestions === 252, `direct review questions: ${directQuestions}`);
assert(questionIds.size === 252, `question ID uniqueness: ${questionIds.size}/252`);
assert(optionViolations === 0, `option violations: ${optionViolations}`);
assert(answerViolations === 0, `answer violations: ${answerViolations}`);
assert(sourceLifecycleViolations === 0, `source lifecycle violations: ${sourceLifecycleViolations}`);
assert(reviewLifecycleViolations === 0, `review lifecycle violations: ${reviewLifecycleViolations}`);
assert(learnerIdentityLeaks === 0, `learner identity leaks: ${learnerIdentityLeaks}`);
assert(scriptViolations === 0, `script violations: ${scriptViolations}`);
for (const language of languages) {
  assert(JSON.stringify([...answerPositions.get(language)!].sort()) === JSON.stringify([0, 1, 2, 3]), `${language}: answer-position reachability`);
}

const packages = listQuantV4Packages();
const numberSystem = packages.find((pkg: any) => pkg.packageId === "NUM-001") as any;
assert(Boolean(numberSystem), "NUM-001 package card missing");
assert(numberSystem.cpIds.includes("NUM-CP-001"), "CP001 missing from package capabilities");
assert(numberSystem.cpIds.includes("NUM-CP-003") && numberSystem.cpIds.includes("NUM-CP-004"), "legacy Number System CPs missing");
assert(JSON.stringify([...numberSystem.supportedLanguages].sort()) === JSON.stringify(["en", "hi", "pa"]), "NUM-001 language capabilities");
assert(numberSystem.questionBankStatus === "NOT_STORED", "capability Question Bank gate opened");
assert(numberSystem.testEligibility === "INELIGIBLE", "capability test gate opened");
assert(numberSystem.publiclyPublishable === false, "capability public gate opened");

for (const testCase of [
  { language: "en" as const, qlId: "NUM-QL-124" },
  { language: "hi" as const, qlId: "NUM-QL-130" },
  { language: "pa" as const, qlId: "NUM-QL-143" },
]) {
  const result = await generateQuestion({
    packageId: "NUM-001",
    canonicalProblemId: "NUM-CP-001",
    questionLanguageId: testCase.qlId,
    language: testCase.language,
    difficulty: "Medium",
    count: 3,
    seed: `cp001-wrapper-integration:${testCase.language}:${testCase.qlId}`,
  });
  assert(result.questions.length === 3, `${testCase.language}: wrapper batch count`);
  assert(result.generationContext.canonicalProblemId === "NUM-CP-001", `${testCase.language}: generation CP`);
  assert(result.generationContext.language === testCase.language, `${testCase.language}: generation language`);
  assert(result.generationContext.questionBankStatus === "NOT_STORED", `${testCase.language}: generation Question Bank gate`);
  assert(result.generationContext.testEligibility === "INELIGIBLE", `${testCase.language}: generation test gate`);
  assert(result.generationContext.publiclyPublishable === false, `${testCase.language}: generation public gate`);
  for (const question of result.questions as any[]) {
    assert(question.canonicalProblemId === "NUM-CP-001", `${testCase.language}: preview CP`);
    assert(question.questionLanguageId === testCase.qlId, `${testCase.language}: preview QL`);
    assert(question.language === testCase.language, `${testCase.language}: preview language`);
    assert(question.options[question.correctIndex] === question.answer, `${testCase.language}: preview answer`);
    assert(String(question.explanation).length > 20, `${testCase.language}: preview explanation`);
  }
}

const legacyCp003 = await generateQuestion({ packageId: "NUM-001", canonicalProblemId: "NUM-CP-003", questionLanguageId: "NUM-QL-001", language: "en", count: 1, seed: "cp001-review-legacy-cp003" });
assert((legacyCp003.questions[0] as any)?.canonicalProblemId === "NUM-CP-003", "legacy CP003 delegation changed");
const legacyCp004 = await generateQuestion({ packageId: "NUM-001", canonicalProblemId: "NUM-CP-004", questionLanguageId: "NUM-QL-018", language: "en", count: 1, seed: "cp001-review-legacy-cp004" });
assert((legacyCp004.questions[0] as any)?.canonicalProblemId === "NUM-CP-004", "legacy CP004 delegation changed");

let translatedLegacyRejected = 0;
for (const request of [
  { canonicalProblemId: "NUM-CP-003", questionLanguageId: "NUM-QL-001", language: "hi" },
  { canonicalProblemId: "NUM-CP-004", questionLanguageId: "NUM-QL-018", language: "pa" },
]) {
  try { await generateQuestion({ packageId: "NUM-001", ...request, count: 1 } as any); } catch { translatedLegacyRejected += 1; }
}
assert(translatedLegacyRejected === 2, "translated legacy CP request was accepted");

let conflictingOwnershipRejected = false;
try {
  await generateQuestion({
    packageId: "NUM-001",
    canonicalProblemId: "NUM-CP-003",
    questionLanguageId: "NUM-QL-124",
    language: "en",
    count: 1,
  } as any);
} catch {
  conflictingOwnershipRejected = true;
}
assert(conflictingOwnershipRejected, "conflicting CP/QL ownership was accepted by wrapper");

const routePath = resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-average.ts");
const routeSource = readFileSync(routePath, "utf8");
for (const marker of [
  "question-studio-review-engine",
  "NUM-CP-001",
  "Hindi/Punjabi controlled review is available for NUM-CP-001",
  "'review'::generation_run_status",
  "'unreviewed'::generation_item_status",
]) assert(routeSource.includes(marker), `admin route missing guarded-review marker: ${marker}`);

const outDir = resolve(process.cwd(), "artifacts/api-server/dist/quant-v4/num-cp001-question-studio-review");
mkdirSync(outDir, { recursive: true });
const jsonPath = resolve(outDir, "num-cp001-question-studio-review.json");
const mdPath = resolve(outDir, "num-cp001-question-studio-review.md");
const csvPath = resolve(outDir, "num-cp001-question-studio-review.csv");
writeFileSync(jsonPath, JSON.stringify({ release: NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE, directQuestions, reviewSamples }, null, 2));
writeFileSync(mdPath, [
  "# NUM-CP-001 Guarded Question Studio Review", "",
  `Release: \`${NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.releaseId}\``, "",
  "Lifecycle: Question Studio review enabled; Question Bank writes, tests and public publication remain disabled.", "",
  `Review samples: ${reviewSamples.length}`, "",
  ...reviewSamples.flatMap((question) => [
    `## ${question.language} · ${question.questionLanguageId} · ${question.difficulty}`, "", question.stem, "",
    ...question.options.map((option: string, index: number) => `${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? " ✓" : ""}`),
    "", ...question.explanation.lines, "",
  ]),
].join("\n"));
const csvCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
writeFileSync(csvPath, [
  ["language", "qlId", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctIndex", "answer"].map(csvCell).join(","),
  ...reviewSamples.map((question) => [question.language, question.questionLanguageId, question.difficulty, question.stem, ...question.options, question.correctIndex, question.answer].map(csvCell).join(",")),
].join("\n"));

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_GUARDED_QUESTION_STUDIO_REVIEW",
  releaseId: NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.releaseId,
  permanentQlCount: NUM_CP001_PERMANENT_QL_IDS.length,
  languages,
  directQuestions,
  reviewSampleCount: reviewSamples.length,
  answerPositions: Object.fromEntries([...answerPositions.entries()].map(([language, values]) => [language, [...values].sort()])),
  optionViolations,
  answerViolations,
  sourceLifecycleViolations,
  reviewLifecycleViolations,
  learnerIdentityLeaks,
  scriptViolations,
  translatedLegacyRejected,
  conflictingOwnershipRejected,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  jsonPath,
  mdPath,
  csvPath,
}, null, 2));
