import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NUM_CP005_PERMANENT_ALLOCATION } from "./allocation";
import { runNumCp005PermanentPipeline } from "./runtime";

const advancedReviewQls = new Set([
  "NUM-QL-052",
  "NUM-QL-056",
  "NUM-QL-057",
  "NUM-QL-058",
  "NUM-QL-059",
  "NUM-QL-064",
  "NUM-QL-065",
  "NUM-QL-066",
  "NUM-QL-067",
  "NUM-QL-069",
]);

function reviewSeedCount(qlId) {
  return advancedReviewQls.has(qlId) ? 15 : 10;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function reviewFingerprint(question) {
  return JSON.stringify({
    stem: question.stem,
    options: question.options.map((option) => option.value),
    answer: question.canonicalAnswer,
  });
}

function duplicateGroups(questions, fingerprint) {
  const groups = new Map();
  for (const question of questions) {
    const key = fingerprint(question);
    const entries = groups.get(key) ?? [];
    entries.push(`${question.questionLanguageId}/${question.seed}`);
    groups.set(key, entries);
  }
  return [...groups.values()].filter((entries) => entries.length > 1);
}

const questions = NUM_CP005_PERMANENT_ALLOCATION.flatMap((allocation) =>
  Array.from({ length: reviewSeedCount(allocation.qlId) }, (_unused, index) => index + 1)
    .map((seed) => runNumCp005PermanentPipeline({
      questionLanguageId: allocation.qlId,
      seed,
    })),
);

const expectedReviewCount = NUM_CP005_PERMANENT_ALLOCATION.reduce(
  (count, allocation) => count + reviewSeedCount(allocation.qlId),
  0,
);
const distinctStems = new Set(questions.map((question) => question.stem));
const distinctFingerprints = new Set(questions.map(reviewFingerprint));
const distinctExplanations = new Set(
  questions.map((question) => JSON.stringify(question.explanation)),
);
const repeatedStemGroups = duplicateGroups(questions, (question) => question.stem);
const repeatedQuestionGroups = duplicateGroups(questions, reviewFingerprint);
const repeatedExplanationGroups = duplicateGroups(
  questions,
  (question) => JSON.stringify(question.explanation),
);
const tierCounts = questions.reduce((counts, question) => ({
  ...counts,
  [question.examUseTier]: (counts[question.examUseTier] ?? 0) + 1,
}), {});

assert(questions.length === expectedReviewCount, "expanded review count mismatch");
assert(distinctStems.size === questions.length,
  `expanded review contains repeated stems: ${JSON.stringify(repeatedStemGroups)}`);
assert(distinctFingerprints.size === questions.length,
  `expanded review contains duplicate question records: ${JSON.stringify(repeatedQuestionGroups)}`);
assert(distinctExplanations.size === questions.length,
  `expanded review contains repeated explanations: ${JSON.stringify(repeatedExplanationGroups)}`);

const outputDirectory = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = join(outputDirectory, "num-001-cp005-permanent-english-review.json");
const markdownPath = join(outputDirectory, "num-001-cp005-permanent-english-review.md");
const csvPath = join(outputDirectory, "num-001-cp005-permanent-english-review.csv");

writeFileSync(jsonPath, JSON.stringify(questions, null, 2));

const markdownHeader = [
  "# NUM-CP-005 — Publication-Ready English Review Pack",
  "",
  `- Permanent QLs: ${NUM_CP005_PERMANENT_ALLOCATION.length}`,
  `- Direct QLs: 10 questions each`,
  `- Inverse, optimisation and data-sufficiency QLs: 15 questions each`,
  `- Total review questions: ${questions.length}`,
  `- Distinct stems: ${distinctStems.size}`,
  `- Distinct question records: ${distinctFingerprints.size}`,
  `- Distinct explanations: ${distinctExplanations.size}`,
  `- Standard mock questions: ${tierCounts.STANDARD_MOCK ?? 0}`,
  `- Advanced practice questions: ${tierCounts.ADVANCED_PRACTICE ?? 0}`,
  `- Guided learning questions: ${tierCounts.GUIDED_LEARNING ?? 0}`,
  "- Status: manual product-owner review required; all delivery gates remain closed",
  "",
  "---",
  "",
].join("\n");

const markdownBody = questions.map((question) => [
  `## ${question.questionLanguageId} — seed ${question.seed}`,
  "",
  `- Authority: ${question.authorityId}`,
  `- Solve mode: ${question.solveModeId}`,
  `- Runtime prototype: ${question.temporaryPrototypeId}`,
  `- Review sampling tier: ${advancedReviewQls.has(question.questionLanguageId) ? "ADVANCED_OR_INVERSE" : "DIRECT"}`,
  `- Exam use tier: ${question.examUseTier}`,
  `- Difficulty: ${question.difficulty}`,
  `- Semantic: ${question.answerSemantic}`,
  `- Representation: ${question.representation}`,
  "",
  question.stem,
  "",
  ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " ✓" : ""}`),
  "",
  `**Answer:** ${question.canonicalAnswer}`,
  "",
  `**Core concept:** ${question.explanation.coreConcept}`,
  "",
  `**Strategy:** ${question.explanation.givenDataAndStrategy}`,
  "",
  ...question.explanation.stepByStep.map((step, index) => `${index + 1}. ${step}`),
  "",
  `**Fast method:** ${question.explanation.examSpeedMethod}`,
  "",
  ...question.explanation.commonTraps.map((trap) => `- ${trap}`),
  "",
  `**Final answer:** ${question.explanation.finalAnswer}`,
].join("\n")).join("\n\n---\n\n");
writeFileSync(markdownPath, `${markdownHeader}${markdownBody}`);

function csvCell(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}
const csvRows = [
  ["qlId", "seed", "reviewTier", "examUseTier", "authorityId", "solveModeId", "prototypeId", "difficulty", "semantic", "representation", "stem", "answer"],
  ...questions.map((question) => [
    question.questionLanguageId,
    question.seed,
    advancedReviewQls.has(question.questionLanguageId) ? "ADVANCED_OR_INVERSE" : "DIRECT",
    question.examUseTier,
    question.authorityId,
    question.solveModeId,
    question.temporaryPrototypeId,
    question.difficulty,
    question.answerSemantic,
    question.representation,
    question.stem,
    question.canonicalAnswer,
  ]),
].map((row) => row.map(csvCell).join(",")).join("\n");
writeFileSync(csvPath, csvRows);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_PUBLICATION_READY_ENGLISH_REVIEW_EXPORT",
  permanentQlCount: NUM_CP005_PERMANENT_ALLOCATION.length,
  directQuestionsPerQl: 10,
  advancedQuestionsPerQl: 15,
  advancedQlCount: advancedReviewQls.size,
  reviewQuestionCount: questions.length,
  distinctStemCount: distinctStems.size,
  distinctQuestionRecordCount: distinctFingerprints.size,
  distinctExplanationCount: distinctExplanations.size,
  examUseTierCounts: tierCounts,
  jsonPath,
  markdownPath,
  csvPath,
}, null, 2));
