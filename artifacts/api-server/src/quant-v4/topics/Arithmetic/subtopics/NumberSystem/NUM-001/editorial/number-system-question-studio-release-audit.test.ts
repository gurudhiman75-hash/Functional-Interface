// @ts-nocheck
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../../question-studio-generation-engine";
import { NUMBER_SYSTEM_GENERATOR_V3_CARDS } from "./number-system-generator-v3-review";
import {
  NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE,
  runNum001EnglishQuestionStudioRelease,
} from "./number-system-question-studio-release";
import {
  fixStemGrammar,
  formatStudentValue,
  normaliseTeacherExplanation,
} from "./number-system-v3-presentation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function wholeProseSentenceInMath(value: unknown): boolean {
  const text = String(value ?? "").trim();
  if (!/^\$[^$]+\$$/u.test(text)) return false;
  const body = text.slice(1, -1).replace(/\\[A-Za-z]+/gu, "");
  return /[A-Za-z]{2,}/u.test(body) && /\s/u.test(body);
}

function releaseCard(card: any) {
  const options = card.options.map(formatStudentValue);
  const explanation = normaliseTeacherExplanation(card.explanation);
  return Object.freeze({
    ...card,
    stem: fixStemGrammar(card.stem),
    options: Object.freeze(options),
    correctAnswer: Object.freeze({
      ...card.correctAnswer,
      value: options[card.correctAnswer.label.charCodeAt(0) - 65],
    }),
    explanation,
    lifecycle: Object.freeze({
      environment: "QUESTION_STUDIO",
      status: "ACTIVE_QUESTION_STUDIO",
      questionStudioDiscoverable: true,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    }),
  });
}

const releasedEditorialCards = Object.freeze(
  NUMBER_SYSTEM_GENERATOR_V3_CARDS.map(releaseCard),
);

assert(releasedEditorialCards.length === 153,
  `Expected 153 editorial release cards, received ${releasedEditorialCards.length}`);
assert(releasedEditorialCards.filter((card) => card.checkpoint === "NUM-CP-003").length === 69,
  "CP-003 release-card count mismatch");
assert(releasedEditorialCards.filter((card) => card.checkpoint === "NUM-CP-004").length === 84,
  "CP-004 release-card count mismatch");

for (const card of releasedEditorialCards) {
  const text = [
    card.stem,
    ...card.options,
    ...card.explanation.mainRule,
    ...card.explanation.stepByStepSolution,
    ...card.explanation.examSpeedTrick,
    ...card.explanation.commonTraps.flatMap((trap) => [trap.optionValue, trap.message]),
  ].join("\n");
  assert(card.lifecycle.questionStudioDiscoverable === true,
    `${card.qlId}: Question Studio release flag is false`);
  assert(card.lifecycle.questionBankWritable === false,
    `${card.qlId}: Question Bank write flag opened`);
  assert(card.lifecycle.testEligible === false,
    `${card.qlId}: test eligibility opened`);
  assert(card.lifecycle.publiclyPublishable === false,
    `${card.qlId}: publication opened`);
  assert(!/\$\$/u.test(text), `${card.qlId}: display delimiters remain inline`);
  assert(!/\$\d[\d,]*\$\s*[×÷]\s*\$\d[\d,]*\$/u.test(text),
    `${card.qlId}: split multiplication or division remains`);
  assert(card.options.every((option) => !wholeProseSentenceInMath(option)),
    `${card.qlId}: prose option remains entirely inside MathJax`);
}

const permanentQlSamples = [];
for (let number = 1; number <= 45; number += 1) {
  const qlId = `NUM-QL-${String(number).padStart(3, "0")}`;
  const cpId = number <= 17 ? "NUM-CP-003" : "NUM-CP-004";
  const question = runNum001EnglishQuestionStudioRelease(cpId, {
    questionLanguageId: qlId,
    seed: `num-001-english-release-proof:${qlId}`,
    language: "en",
  });

  assert(question.questionLanguageId === qlId,
    `${qlId}: release runtime returned a different QL`);
  assert(question.canonicalProblemId === cpId,
    `${qlId}: release runtime returned a different CP`);
  assert(question.runtimeMode === "QUESTION_STUDIO_ACTIVE",
    `${qlId}: runtime mode is not Question Studio active`);
  assert(question.active === true && question.questionStudioDiscoverable === true,
    `${qlId}: Question Studio release is inactive`);
  assert(question.questionBankWritable === false,
    `${qlId}: Question Bank write gate opened`);
  assert(question.testEligible === false,
    `${qlId}: test gate opened`);
  assert(question.publiclyPublishable === false,
    `${qlId}: publication gate opened`);
  assert(question.validation.ok === true && question.validation.errors.length === 0,
    `${qlId}: release validation failed`);
  assert(question.options.length >= 4 && new Set(question.options).size === question.options.length,
    `${qlId}: invalid learner options`);
  assert(question.options[question.correctIndex] === question.answer,
    `${qlId}: answer does not match the option array`);

  const learnerText = [
    question.stem,
    ...question.options,
    ...question.explanation.lines,
  ].join("\n");
  assert(!/\$\$/u.test(learnerText), `${qlId}: runtime output contains inline display delimiters`);
  assert(question.options.every((option) => !wholeProseSentenceInMath(option)),
    `${qlId}: runtime prose option is wrapped wholly in MathJax`);

  permanentQlSamples.push({
    qlId,
    cpId,
    questionId: question.questionId,
    difficulty: question.difficulty,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanation: question.explanation,
    runtimeMode: question.runtimeMode,
    reviewStatus: question.reviewStatus,
    questionBankStatus: question.questionBankStatus,
    testEligibility: question.testEligibility,
    publiclyPublishable: question.publiclyPublishable,
  });
}

const packages = listQuantV4Packages();
const capability = packages.find((entry: any) => entry.packageId === "NUM-001");
assert(capability, "NUM-001 is missing from Question Studio capabilities");
assert(capability.enabled === true, "NUM-001 capability is disabled");
assert(capability.runtimeMode === "QUESTION_STUDIO_ACTIVE",
  "NUM-001 capability runtime mode is incorrect");
assert(JSON.stringify(capability.cpIds) === JSON.stringify(["NUM-CP-003", "NUM-CP-004"]),
  "NUM-001 capability CP list is incorrect");
assert(JSON.stringify(capability.supportedLanguages) === JSON.stringify(["en"]),
  "NUM-001 capability language list is incorrect");
assert(capability.questionBankStatus === "NOT_STORED",
  "NUM-001 capability opened Question Bank writes");
assert(capability.testEligibility === "INELIGIBLE",
  "NUM-001 capability opened test eligibility");
assert(capability.publiclyPublishable === false,
  "NUM-001 capability opened public publication");

const cp003Batch = await generateQuestion({
  packageId: "NUM-001",
  canonicalProblemId: "NUM-CP-003",
  questionLanguageId: "NUM-QL-001",
  language: "en",
  seed: "num-001-release-central-cp003",
  count: 2,
});
const cp004Batch = await generateQuestion({
  packageId: "NUM-001",
  canonicalProblemId: "NUM-CP-004",
  questionLanguageId: "NUM-QL-045",
  language: "en",
  seed: "num-001-release-central-cp004",
  count: 2,
});

for (const [label, batch] of [["CP-003", cp003Batch], ["CP-004", cp004Batch]]) {
  assert(batch.questions.length === 2, `${label}: central batch count mismatch`);
  assert(batch.generationContext.runtimeMode === "QUESTION_STUDIO_ACTIVE",
    `${label}: central generation runtime is not active`);
  assert(batch.generationContext.questionBankStatus === "NOT_STORED",
    `${label}: central generation opened Question Bank writes`);
  assert(batch.generationContext.testEligibility === "INELIGIBLE",
    `${label}: central generation opened tests`);
  assert(batch.generationContext.publiclyPublishable === false,
    `${label}: central generation opened publication`);
  for (const question of batch.questions) {
    assert(question.packageId === "NUM-001", `${label}: preview package ID mismatch`);
    assert(question.runtimeMode === "QUESTION_STUDIO_ACTIVE",
      `${label}: preview runtime is not active`);
    assert(question.questionBankStatus === "NOT_STORED",
      `${label}: preview Question Bank gate opened`);
    assert(question.testEligibility === "INELIGIBLE",
      `${label}: preview test gate opened`);
    assert(question.publiclyPublishable === false,
      `${label}: preview publication gate opened`);
  }
}

let unsupportedLanguageRejected = false;
try {
  await generateQuestion({
    packageId: "NUM-001",
    language: "hi",
    count: 1,
  });
} catch {
  unsupportedLanguageRejected = true;
}
assert(unsupportedLanguageRejected, "NUM-001 accepted an unapproved language");

const outputDirectory = resolve(
  process.cwd(),
  "dist/quant-v4/number-system-question-studio-release",
);
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "num-001-question-studio-release-review.json");
const markdownPath = resolve(outputDirectory, "num-001-question-studio-release-review.md");
const csvPath = resolve(outputDirectory, "num-001-question-studio-release-review.csv");

writeFileSync(jsonPath, `${JSON.stringify({
  status: "ACTIVE_QUESTION_STUDIO_NUM_001_ENGLISH_V1",
  release: NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE,
  editorialCardCount: releasedEditorialCards.length,
  permanentQlSampleCount: permanentQlSamples.length,
  checkpointCounts: {
    "NUM-CP-003": 69,
    "NUM-CP-004": 84,
  },
  editorialCards: releasedEditorialCards,
  permanentQlSamples,
}, null, 2)}\n`, "utf8");

const markdown = [
  "# ExamTree NUM-001 — English Question Studio Release Review",
  "",
  `**Release:** \`${NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.releaseId}\``,
  "",
  "**Lifecycle:** Active in Question Studio. Question Bank writes, test eligibility and public publication remain disabled.",
  "",
  `**Editorial cards:** ${releasedEditorialCards.length}`,
  "",
  `**Permanent QL runtime samples:** ${permanentQlSamples.length}`,
  "",
  "---",
  "",
  ...permanentQlSamples.flatMap((sample) => [
    `## ${sample.qlId} — ${sample.cpId}`,
    "",
    `**Difficulty:** ${sample.difficulty}`,
    "",
    "### Question",
    "",
    sample.stem,
    "",
    ...sample.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
    "",
    `**Correct Answer:** ${String.fromCharCode(65 + sample.correctIndex)}. ${sample.answer}`,
    "",
    ...sample.explanation.lines,
    "",
    "---",
    "",
  ]),
].join("\n");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");

const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = [
  [
    "qlId",
    "cpId",
    "difficulty",
    "stem",
    "options",
    "correctAnswer",
    "explanation",
    "runtimeMode",
    "questionBankStatus",
    "testEligibility",
    "publiclyPublishable",
  ].join(","),
  ...permanentQlSamples.map((sample) => [
    sample.qlId,
    sample.cpId,
    sample.difficulty,
    sample.stem,
    sample.options.map((option, index) =>
      `${String.fromCharCode(65 + index)}. ${option}`).join(" | "),
    `${String.fromCharCode(65 + sample.correctIndex)}. ${sample.answer}`,
    sample.explanation.lines.join("\n"),
    sample.runtimeMode,
    sample.questionBankStatus,
    sample.testEligibility,
    sample.publiclyPublishable,
  ].map(csvEscape).join(",")),
].join("\n");
writeFileSync(csvPath, `${csv}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE",
  releaseId: NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.releaseId,
  editorialCardCount: releasedEditorialCards.length,
  permanentQlCount: permanentQlSamples.length,
  cp003EditorialCards: 69,
  cp004EditorialCards: 84,
  centralCp003BatchCount: cp003Batch.questions.length,
  centralCp004BatchCount: cp004Batch.questions.length,
  questionStudioActive: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  unsupportedLanguageRejected,
  jsonPath,
  markdownPath,
  csvPath,
}, null, 2));
