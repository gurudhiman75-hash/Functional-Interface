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

const OUTPUT_DIRECTORY = join(
  process.cwd(),
  "dist",
  "quant-v4",
  "int-cp004-localized-review-pack",
);

const FILES: Readonly<Record<IntCp004LocalizedLocale, Readonly<{
  markdown: string;
  data: string;
}>>> = Object.freeze({
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
  "TERMS_TABLE",
  "STANDARD_PROSE",
  "BALANCE_RECORD",
  "SCHEME_COMPARISON",
] as const);

const machinePhrases: Readonly<Record<IntCp004LocalizedLocale, readonly string[]>> = Object.freeze({
  "hi-IN": Object.freeze([
    "निवेश की शर्तें नीचे दी गई हैं",
    "खाते में दर्ज",
    "खाता विवरण",
    "योजना का सार",
    "योजना/चरण का विवरण",
    "दर्ज जानकारी के आधार पर",
    "प्रश्न हल कीजिए",
  ]),
  "pa-IN": Object.freeze([
    "ਨਿਵੇਸ਼ ਦੀਆਂ ਸ਼ਰਤਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਹਨ",
    "ਖਾਤੇ ਵਿੱਚ ਦਰਜ",
    "ਖਾਤਾ ਵੇਰਵਾ",
    "ਯੋਜਨਾ ਦਾ ਸਾਰ",
    "ਯੋਜਨਾ/ਪੜਾਅ ਦਾ ਵੇਰਵਾ",
    "ਦਰਜ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਉੱਤੇ",
    "ਪ੍ਰਸ਼ਨ ਹੱਲ ਕਰੋ",
  ]),
});

const punjabiMishritRequired = new Set([
  "INT-QL-068", "INT-QL-070", "INT-QL-074", "INT-QL-079", "INT-QL-080",
  "INT-QL-081", "INT-QL-082", "INT-QL-083", "INT-QL-085",
]);

function normalizeStem(stem: string): string {
  return stem
    .replace(/₹[\d,.]+/gu, "₹N")
    .replace(/\d+(?:\.\d+)?%/gu, "R%")
    .replace(/\d+/gu, "N")
    .replace(/\s+/gu, " ")
    .trim();
}

const summaryText = readFileSync(
  join(OUTPUT_DIRECTORY, "int-cp004-localized-review-pack-summary.json"),
  "utf8",
);
const exportedSummary = JSON.parse(summaryText) as Record<string, any>;

if (exportedSummary.status !== "CP004_LOCALIZED_REVIEW_PACKS_EXPORTED") {
  fail("Review-pack exporter summary has an unexpected status.");
}
if (exportedSummary.reviewPackVersion !== INT_CP004_LOCALIZED_REVIEW_PACK_VERSION) {
  fail("Review-pack exporter summary has an unexpected version.");
}
if (exportedSummary.totalReviewQuestions !== 152) {
  fail("Review-pack exporter summary does not contain 152 total questions.");
}

let questionChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let scriptChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
let hashChecks = 0;
let representationChecks = 0;
let nativeStemChecks = 0;
let stemFamilyChecks = 0;
let answerPositionChecks = 0;
let sharedSeedChecks = 0;
let englishFallbackChecks = 0;
let punjabiTerminologyChecks = 0;
const seedsByLocale: Record<string, readonly string[]> = {};
const answerPositionsByLocale: Record<string, readonly number[]> = {};
const hashesByLocale: Record<string, Readonly<{ markdown: string; data: string }>> = {};
const normalizedStemPatternsByLocaleQl: Record<string, number> = {};

for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  const files = FILES[locale];
  const markdownPath = join(OUTPUT_DIRECTORY, files.markdown);
  const dataPath = join(OUTPUT_DIRECTORY, files.data);
  const exportedMarkdown = readFileSync(markdownPath, "utf8");
  const exportedData = readFileSync(dataPath, "utf8");
  const pack = buildIntCp004LocalizedReviewPack(locale);
  const expectedMarkdown = renderIntCp004LocalizedReviewMarkdown(pack);
  const expectedData = serializeIntCp004LocalizedReviewPack(pack);

  deterministicChecks += 2;
  if (exportedMarkdown !== expectedMarkdown) fail(`${locale}: exported Markdown is not deterministic.`);
  if (exportedData !== expectedData) fail(`${locale}: exported review data is not deterministic.`);

  hashChecks += 4;
  const markdownHash = sha256Text(exportedMarkdown);
  const dataHash = sha256Text(exportedData);
  const localeSummary = exportedSummary.localeSummaries?.[locale];
  if (localeSummary?.markdownSha256 !== markdownHash) fail(`${locale}: Markdown SHA-256 mismatch.`);
  if (localeSummary?.dataSha256 !== dataHash) fail(`${locale}: data SHA-256 mismatch.`);
  if (localeSummary?.questionCount !== 76) fail(`${locale}: exporter summary question count mismatch.`);
  if (localeSummary?.uniqueSeedCount !== 76) fail(`${locale}: exporter summary seed count mismatch.`);
  hashesByLocale[locale] = Object.freeze({ markdown: markdownHash, data: dataHash });

  if (
    pack.status !== "LOCALIZED_HUMAN_REVIEW_REQUIRED"
    || pack.questionCount !== 76
    || pack.qlCount !== 19
    || pack.questionsPerQl !== 4
    || pack.questions.length !== 76
  ) {
    fail(`${locale}: review-pack cardinality or status is incorrect.`);
  }

  const seeds = new Set<string>();
  const answerPositions = [0, 0, 0, 0];
  const qlCounts: Record<string, number> = {};
  const representationsByQl: Record<string, Set<string>> = {};
  const familiesByQl: Record<string, Set<string>> = {};
  const normalizedStemsByQl: Record<string, Set<string>> = {};

  for (const question of pack.questions) {
    questionChecks += 1;
    seeds.add(question.seed);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    (representationsByQl[question.qlId] ??= new Set<string>()).add(question.representation);
    (familiesByQl[question.qlId] ??= new Set<string>()).add(question.stemFamilyId);
    (normalizedStemsByQl[question.qlId] ??= new Set<string>()).add(normalizeStem(question.stem));

    answerPositionChecks += 1;
    if (question.correctIndex < 0 || question.correctIndex > 3) {
      fail(`${locale}/${question.qlId}/${question.seed}: invalid correct index.`);
    }
    answerPositions[question.correctIndex] = (answerPositions[question.correctIndex] ?? 0) + 1;
    if (question.correctAnswer !== question.options[question.correctIndex]?.text) {
      fail(`${locale}/${question.qlId}/${question.seed}: correct answer ownership changed.`);
    }

    if (question.options.length !== 4) {
      fail(`${locale}/${question.qlId}/${question.seed}: expected four options.`);
    }
    for (const option of question.options) {
      optionChecks += 1;
      assertCp004LocalizedText(
        locale,
        option.feedback,
        `${locale}/${question.qlId}/${question.seed}/${option.label}/feedback`,
      );
      scriptChecks += 1;
      if (!option.text.trim() || !option.misconceptionId.trim()) {
        fail(`${locale}/${question.qlId}/${question.seed}/${option.label}: incomplete option record.`);
      }
    }

    assertCp004LocalizedText(locale, question.stem, `${locale}/${question.qlId}/${question.seed}/stem`);
    assertCp004LocalizedText(locale, question.explanation.whatAsked, `${locale}/${question.qlId}/${question.seed}/what-asked`);
    assertCp004LocalizedText(locale, question.explanation.finalAnswer, `${locale}/${question.qlId}/${question.seed}/final-answer`);
    assertCp004LocalizedText(locale, question.explanation.commonMistake, `${locale}/${question.qlId}/${question.seed}/common-mistake`);
    scriptChecks += 4;

    if (question.stem.includes("|---|")) fail(`${locale}/${question.qlId}/${question.seed}: native stem contains a table.`);
    if (question.stem.includes("**")) fail(`${locale}/${question.qlId}/${question.seed}: native stem contains a generated heading.`);
    if (question.stem.includes("\n- ")) fail(`${locale}/${question.qlId}/${question.seed}: native stem contains a generated fact list.`);
    for (const phrase of machinePhrases[locale]) {
      if (question.stem.includes(phrase)) fail(`${locale}/${question.qlId}/${question.seed}: machine-style phrase remains: ${phrase}`);
      nativeStemChecks += 1;
    }
    nativeStemChecks += 3;

    if (question.explanation.steps.length < 2) {
      fail(`${locale}/${question.qlId}/${question.seed}: insufficient worked steps.`);
    }
    for (const [stepIndex, step] of question.explanation.steps.entries()) {
      explanationChecks += 1;
      assertCp004LocalizedText(locale, step, `${locale}/${question.qlId}/${question.seed}/step-${stepIndex + 1}`);
      scriptChecks += 1;
    }

    const learnerText = [
      question.stem,
      ...question.options.map((option) => option.feedback),
      question.explanation.whatAsked,
      ...question.explanation.steps,
      question.explanation.finalAnswer,
      question.explanation.commonMistake,
    ].join("\n");
    englishFallbackChecks += 1;
    if (/\b(?:find|we need|therefore|the answer|common mistake|final amount|principal|annual rate|compound interest|simple interest|compounded|after|before|question asks)\b/iu.test(learnerText)) {
      fail(`${locale}/${question.qlId}/${question.seed}: English learner prose reached review pack.`);
    }
    if (/\b(?:TODO|TBD|placeholder|translate|translation pending)\b/iu.test(learnerText)) {
      fail(`${locale}/${question.qlId}/${question.seed}: placeholder reached review pack.`);
    }
    if (locale === "pa-IN") {
      if (learnerText.includes("ਚੱਕਰਵੱਧੀ")) fail(`${locale}/${question.qlId}/${question.seed}: rejected Punjabi interest term remains.`);
      if (punjabiMishritRequired.has(question.qlId) && !question.stem.includes("ਮਿਸ਼ਰਤ ਵਿਆਜ")) {
        fail(`${locale}/${question.qlId}/${question.seed}: required ਮਿਸ਼ਰਤ ਵਿਆਜ wording is missing.`);
      }
      punjabiTerminologyChecks += 1;
    }

    lifecycleChecks += 7;
    if (
      question.lifecycle.enabled
      || question.lifecycle.stagingStatus !== "NOT_STAGED"
      || question.lifecycle.registrationStatus !== "NOT_REGISTERED"
      || question.lifecycle.questionStudioDiscoverable
      || question.lifecycle.questionBankStatus !== "NOT_STORED"
      || question.lifecycle.testEligibility !== "INELIGIBLE"
      || question.lifecycle.publiclyPublishable
    ) {
      fail(`${locale}/${question.qlId}/${question.seed}: lifecycle boundary changed.`);
    }
  }

  if (seeds.size !== 76) fail(`${locale}: expected 76 unique review seeds, received ${seeds.size}.`);
  seedsByLocale[locale] = Object.freeze([...seeds]);
  answerPositionsByLocale[locale] = Object.freeze([...answerPositions]);

  if (answerPositions.some((count) => count !== 19)) {
    fail(`${locale}: answer positions are not balanced 19/19/19/19.`);
  }

  for (const qlId of INT_CP004_QL_IDS) {
    if (qlCounts[qlId] !== 4) fail(`${locale}/${qlId}: expected four review questions.`);
    const representations = representationsByQl[qlId];
    representationChecks += 4;
    if (
      representations?.size !== 4
      || EXPECTED_REPRESENTATIONS.some((representation) => !representations.has(representation))
    ) {
      fail(`${locale}/${qlId}: internal representation coverage is incomplete.`);
    }

    const families = familiesByQl[qlId];
    stemFamilyChecks += 4;
    for (let frame = 1; frame <= 4; frame += 1) {
      if (!families?.has(`${qlId}-FRAME-${frame}`)) {
        fail(`${locale}/${qlId}: stem family FRAME-${frame} is missing.`);
      }
    }

    const nativePatterns = normalizedStemsByQl[qlId]?.size ?? 0;
    if (nativePatterns !== 4) {
      fail(`${locale}/${qlId}: expected four materially distinct native stems, received ${nativePatterns}.`);
    }
    normalizedStemPatternsByLocaleQl[`${locale}/${qlId}`] = nativePatterns;
  }
}

const hindiSeeds = seedsByLocale["hi-IN"] ?? [];
const punjabiSeeds = seedsByLocale["pa-IN"] ?? [];
if (hindiSeeds.length !== punjabiSeeds.length) fail("Hindi and Punjabi review packs have different sizes.");
for (let index = 0; index < hindiSeeds.length; index += 1) {
  sharedSeedChecks += 1;
  if (hindiSeeds[index] !== punjabiSeeds[index]) {
    fail(`Hindi and Punjabi canonical seeds diverge at review question ${index + 1}.`);
  }
}

const summary = {
  status: "CP004_LOCALIZED_NATIVE_REVIEW_PACKS_VALIDATED",
  reviewPackVersion: INT_CP004_LOCALIZED_REVIEW_PACK_VERSION,
  nativeStemVersion: "INT-CP-004-HI-PA-NATIVE-STEMS-v6",
  qlRange: "INT-QL-067..INT-QL-085",
  qlCount: 19,
  locales: INT_CP004_LOCALIZED_LOCALES,
  questionCountPerLocale: 76,
  totalReviewQuestions: 152,
  questionsPerQl: 4,
  questionChecks,
  optionChecks,
  explanationChecks,
  scriptChecks,
  lifecycleChecks,
  deterministicChecks,
  hashChecks,
  representationChecks,
  nativeStemChecks,
  stemFamilyChecks,
  answerPositionChecks,
  sharedSeedChecks,
  englishFallbackChecks,
  punjabiTerminologyChecks,
  answerPositionsByLocale,
  normalizedStemPatternsByLocaleQl,
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
