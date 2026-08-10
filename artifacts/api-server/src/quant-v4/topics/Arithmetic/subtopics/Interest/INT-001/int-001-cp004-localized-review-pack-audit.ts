import { readFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import {
  INT_CP004_LOCALIZED_LOCALES,
  assertCp004LocalizedText,
} from "./cp004-localization-language-pack";
import {
  INT_CP004_LOCALIZED_REVIEW_PACK_VERSION,
  buildIntCp004LocalizedReviewPack,
  renderIntCp004LocalizedReviewMarkdown,
  serializeIntCp004LocalizedReviewPack,
  sha256Text,
} from "./cp004-localized-review-pack";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

function fail(message: string): never {
  throw new Error(message);
}

const OUTPUT_DIRECTORY = join(process.cwd(), "dist", "quant-v4", "int-cp004-localized-review-pack");
const FILES: Readonly<Record<IntCp004LocalizedLocale, Readonly<{ markdown: string; data: string }>>> = Object.freeze({
  "hi-IN": Object.freeze({
    markdown: "INT-CP-004-Hindi-Questions-and-Explanations-Review.md",
    data: "INT-CP-004-Hindi-Review-Data.json",
  }),
  "pa-IN": Object.freeze({
    markdown: "INT-CP-004-Punjabi-Questions-and-Explanations-Review.md",
    data: "INT-CP-004-Punjabi-Review-Data.json",
  }),
});

const EXPECTED_REPRESENTATIONS = Object.freeze([
  "TERMS_TABLE", "STANDARD_PROSE", "BALANCE_RECORD", "SCHEME_COMPARISON",
] as const);

const summaryText = readFileSync(join(OUTPUT_DIRECTORY, "int-cp004-localized-review-pack-summary.json"), "utf8");
const exportedSummary = JSON.parse(summaryText) as Record<string, any>;
if (exportedSummary.status !== "CP004_LOCALIZED_REVIEW_PACKS_EXPORTED") fail("Review-pack exporter summary has an unexpected status.");
if (exportedSummary.reviewPackVersion !== INT_CP004_LOCALIZED_REVIEW_PACK_VERSION) fail("Review-pack exporter summary has an unexpected version.");
if (exportedSummary.totalReviewQuestions !== 152) fail("Review-pack exporter summary does not contain 152 total questions.");

let questionChecks = 0;
let optionChecks = 0;
let suppressedOptionFeedbackChecks = 0;
let explanationChecks = 0;
let readableDecimalChecks = 0;
let markdownClutterChecks = 0;
let scriptChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
let hashChecks = 0;
let representationChecks = 0;
let stemFamilyChecks = 0;
let answerPositionChecks = 0;
let sharedSeedChecks = 0;
let punjabiTerminologyChecks = 0;
const seedsByLocale: Record<string, readonly string[]> = {};
const hashesByLocale: Record<string, Readonly<{ markdown: string; data: string }>> = {};
let punjabiMishritStemCount = 0;

for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  const files = FILES[locale];
  const exportedMarkdown = readFileSync(join(OUTPUT_DIRECTORY, files.markdown), "utf8");
  const exportedData = readFileSync(join(OUTPUT_DIRECTORY, files.data), "utf8");
  const pack = buildIntCp004LocalizedReviewPack(locale);
  const expectedMarkdown = renderIntCp004LocalizedReviewMarkdown(pack);
  const expectedData = serializeIntCp004LocalizedReviewPack(pack);

  deterministicChecks += 2;
  if (exportedMarkdown !== expectedMarkdown) fail(`${locale}: exported Markdown is not deterministic.`);
  if (exportedData !== expectedData) fail(`${locale}: exported review data is not deterministic.`);

  hashChecks += 2;
  const markdownHash = sha256Text(exportedMarkdown);
  const dataHash = sha256Text(exportedData);
  const localeSummary = exportedSummary.localeSummaries?.[locale];
  if (localeSummary?.markdownSha256 !== markdownHash) fail(`${locale}: Markdown SHA-256 mismatch.`);
  if (localeSummary?.dataSha256 !== dataHash) fail(`${locale}: data SHA-256 mismatch.`);
  hashesByLocale[locale] = Object.freeze({ markdown: markdownHash, data: dataHash });

  markdownClutterChecks += 3;
  if (exportedMarkdown.includes("विकल्प प्रतिक्रिया") || exportedMarkdown.includes("ਵਿਕਲਪ ਪ੍ਰਤੀਕਿਰਿਆ")) {
    fail(`${locale}: option feedback label remains in learner review Markdown.`);
  }
  if (exportedMarkdown.includes("Misconception ID")) {
    fail(`${locale}: misconception IDs remain in learner review Markdown.`);
  }
  if (/\d+\.\d{3,}/u.test(exportedMarkdown)) {
    fail(`${locale}: ugly decimal with more than two places remains in learner review Markdown.`);
  }

  if (pack.status !== "LOCALIZED_HUMAN_REVIEW_REQUIRED" || pack.questionCount !== 76 || pack.qlCount !== 19 || pack.questionsPerQl !== 4 || pack.questions.length !== 76) {
    fail(`${locale}: review-pack cardinality or status is incorrect.`);
  }

  const seeds = new Set<string>();
  const answerPositions = [0, 0, 0, 0];
  const qlCounts: Record<string, number> = {};
  const representationsByQl: Record<string, Set<string>> = {};
  const familiesByQl: Record<string, Set<string>> = {};

  for (const question of pack.questions) {
    questionChecks += 1;
    seeds.add(question.seed);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    (representationsByQl[question.qlId] ??= new Set<string>()).add(question.representation);
    (familiesByQl[question.qlId] ??= new Set<string>()).add(question.stemFamilyId);

    answerPositionChecks += 1;
    if (question.correctIndex < 0 || question.correctIndex > 3) fail(`${locale}/${question.qlId}/${question.seed}: invalid correct index.`);
    answerPositions[question.correctIndex] = (answerPositions[question.correctIndex] ?? 0) + 1;
    if (question.correctAnswer !== question.options[question.correctIndex]?.text) fail(`${locale}/${question.qlId}/${question.seed}: correct answer ownership changed.`);

    if (question.options.length !== 4) fail(`${locale}/${question.qlId}/${question.seed}: expected four options.`);
    for (const option of question.options) {
      optionChecks += 1;
      suppressedOptionFeedbackChecks += 1;
      if (option.feedback !== "") fail(`${locale}/${question.qlId}/${question.seed}/${option.label}: learner option feedback was not suppressed.`);
      if (!option.text.trim() || !option.misconceptionId.trim()) fail(`${locale}/${question.qlId}/${question.seed}/${option.label}: internal option record is incomplete.`);
    }

    assertCp004LocalizedText(locale, question.stem, `${locale}/${question.qlId}/${question.seed}/stem`);
    assertCp004LocalizedText(locale, question.explanation.whatAsked, `${locale}/${question.qlId}/${question.seed}/what-asked`);
    assertCp004LocalizedText(locale, question.explanation.finalAnswer, `${locale}/${question.qlId}/${question.seed}/final-answer`);
    assertCp004LocalizedText(locale, question.explanation.commonMistake, `${locale}/${question.qlId}/${question.seed}/common-mistake`);
    scriptChecks += 4;

    if (question.explanation.steps.length < 2 || question.explanation.steps.length > 4) {
      fail(`${locale}/${question.qlId}/${question.seed}: explanation must use 2-4 steps.`);
    }
    const explanationText = [
      question.explanation.whatAsked,
      ...question.explanation.steps,
      question.explanation.finalAnswer,
      question.explanation.commonMistake,
    ].join("\n");
    readableDecimalChecks += 1;
    if (/\d+\.\d{3,}/u.test(explanationText)) {
      fail(`${locale}/${question.qlId}/${question.seed}: ugly decimal remains in explanation.`);
    }
    for (const [stepIndex, step] of question.explanation.steps.entries()) {
      explanationChecks += 1;
      assertCp004LocalizedText(locale, step, `${locale}/${question.qlId}/${question.seed}/step-${stepIndex + 1}`);
      scriptChecks += 1;
    }

    if (locale === "hi-IN" && !question.explanation.whatAsked.startsWith("हमें ")) {
      fail(`${locale}/${question.qlId}/${question.seed}: Hindi task opening regressed.`);
    }
    if (locale === "pa-IN") {
      if (!question.explanation.whatAsked.startsWith("ਆਓ ")) fail(`${locale}/${question.qlId}/${question.seed}: Punjabi task opening regressed.`);
      if (explanationText.includes("ਸਾਨੂੰ") || explanationText.includes("ਚੱਕਰਵੱਧੀ")) fail(`${locale}/${question.qlId}/${question.seed}: rejected Punjabi wording remains.`);
      if (question.stem.includes("ਮਿਸ਼ਰਤ ਵਿਆਜ")) punjabiMishritStemCount += 1;
      punjabiTerminologyChecks += 1;
    }

    lifecycleChecks += 7;
    if (question.lifecycle.enabled || question.lifecycle.stagingStatus !== "NOT_STAGED" || question.lifecycle.registrationStatus !== "NOT_REGISTERED" || question.lifecycle.questionStudioDiscoverable || question.lifecycle.questionBankStatus !== "NOT_STORED" || question.lifecycle.testEligibility !== "INELIGIBLE" || question.lifecycle.publiclyPublishable) {
      fail(`${locale}/${question.qlId}/${question.seed}: lifecycle boundary changed.`);
    }
  }

  if (seeds.size !== 76) fail(`${locale}: expected 76 unique review seeds, received ${seeds.size}.`);
  seedsByLocale[locale] = Object.freeze([...seeds]);
  if (answerPositions.some((count) => count !== 19)) fail(`${locale}: answer positions are not balanced 19/19/19/19.`);

  for (const qlId of INT_CP004_QL_IDS) {
    if (qlCounts[qlId] !== 4) fail(`${locale}/${qlId}: expected four review questions.`);
    const representations = representationsByQl[qlId];
    representationChecks += 4;
    if (representations?.size !== 4 || EXPECTED_REPRESENTATIONS.some((representation) => !representations.has(representation))) {
      fail(`${locale}/${qlId}: internal representation coverage is incomplete.`);
    }
    const families = familiesByQl[qlId];
    stemFamilyChecks += 4;
    for (let frame = 1; frame <= 4; frame += 1) {
      if (!families?.has(`${qlId}-FRAME-${frame}`)) fail(`${locale}/${qlId}: stem family FRAME-${frame} is missing.`);
    }
  }
}

if (punjabiMishritStemCount === 0) fail("Punjabi review pack never uses ਮਿਸ਼ਰਤ ਵਿਆਜ.");
const hindiSeeds = seedsByLocale["hi-IN"] ?? [];
const punjabiSeeds = seedsByLocale["pa-IN"] ?? [];
if (hindiSeeds.length !== punjabiSeeds.length) fail("Hindi and Punjabi review packs have different sizes.");
for (let index = 0; index < hindiSeeds.length; index += 1) {
  sharedSeedChecks += 1;
  if (hindiSeeds[index] !== punjabiSeeds[index]) fail(`Hindi and Punjabi canonical seeds diverge at review question ${index + 1}.`);
}

const summary = {
  status: "CP004_LOCALIZED_CLEAN_REVIEW_PACKS_VALIDATED",
  reviewPackVersion: INT_CP004_LOCALIZED_REVIEW_PACK_VERSION,
  qlRange: "INT-QL-067..INT-QL-085",
  qlCount: 19,
  locales: INT_CP004_LOCALIZED_LOCALES,
  questionCountPerLocale: 76,
  totalReviewQuestions: 152,
  questionsPerQl: 4,
  questionChecks,
  optionChecks,
  suppressedOptionFeedbackChecks,
  explanationChecks,
  readableDecimalChecks,
  markdownClutterChecks,
  scriptChecks,
  lifecycleChecks,
  deterministicChecks,
  hashChecks,
  representationChecks,
  stemFamilyChecks,
  answerPositionChecks,
  sharedSeedChecks,
  punjabiTerminologyChecks,
  punjabiMishritStemCount,
  hashesByLocale,
  lifecycle: {
    maturity: "MULTILINGUAL_LOCALISATION_REVIEW",
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_LOCALIZED_REVIEW_PACK_AUDIT");
