import { ECO_CP001_REVIEW_V2 } from "../basic-economic-concepts/eco-cp001-review-generator-v2";
import { ECO_CP002_REVIEW_V2 } from "../economic-systems-sectors/eco-cp002-review-generator-v2";
import { ECO_CP003_REVIEW_V2 } from "../national-income-aggregates/eco-cp003-review-generator-v2";
import { ECO_CP004_REVIEW_V2 } from "../national-income-measurement-india/eco-cp004-review-generator-v2";
import { ECO_CP005_REVIEW_V1 } from "../inflation-price-concepts/eco-cp005-review-generator-v1";
import { ECO_CP006_REVIEW_V1 } from "../employment-unemployment-poverty/eco-cp006-review-generator-v1";
import { generateEcoCp007ReviewBatchV1 } from "../money-monetary-system/eco-cp007-review-generator-v1";
import { generateEcoCp008ReviewBatchV1 } from "../reserve-bank-of-india/eco-cp008-review-generator-v1";
import { generateEcoCp009ReviewBatchV2 } from "../monetary-policy/eco-cp009-review-generator-v2";
import { ECO_CP010_REVIEW_V2 } from "../banking-system/eco-cp010-review-generator-v2";
import { ECO_CP011_REVIEW_V2 } from "../financial-institutions/eco-cp011-review-generator-v2";
import { ECO_CP012_REVIEW_V3 } from "../public-finance-fiscal-policy/eco-cp012-review-generator-v3";
import { ECO_CP013_REVIEW_V2 } from "../government-budget/eco-cp013-review-generator-v2";
import { ECO_CP014_REVIEW_V2 } from "../taxation/eco-cp014-review-generator-v2";
import { ECO_CP015_REVIEW_V3 } from "../economic-planning/eco-cp015-review-generator-v3";
import { ECO_CP016_REVIEW_V2 } from "../economic-reforms-1991/eco-cp016-review-generator-v2";
import { ECO_CP017_REVIEW_V2 } from "../agriculture-indian-economy/eco-cp017-review-generator-v2";
import { ECO_CP018_REVIEW_V2 } from "../industrial-development/eco-cp018-review-generator-v2";
import { ECO_CP019_REVIEW_V2 } from "../financial-markets/eco-cp019-review-generator-v2";
import { ECO_CP020_REVIEW_V2 } from "../external-sector-bop/eco-cp020-review-generator-v2";
import { ECO_CP021_REVIEW_V3 } from "../international-economic-institutions/eco-cp021-review-generator-v3";
import { ECO_CP022_REVIEW_V2 } from "../human-development-development-economics/eco-cp022-review-generator-v2";
import { ECO_CP023_REVIEW_V2 } from "../important-economic-events-milestones/eco-cp023-review-generator-v2";
import {
  generateEcoCp001LocalizedReviewV1,
  generateEcoCp002LocalizedReviewV1,
  generateEcoCp003LocalizedReviewV1,
  generateEcoCp004LocalizedReviewV1,
  generateEcoCp005LocalizedReviewV1,
  generateEcoCp006LocalizedReviewV1,
  generateEcoCp007LocalizedReviewV1,
  generateEcoCp008LocalizedReviewV1,
  generateEcoCp009LocalizedReviewV1,
  generateEcoCp010LocalizedReviewV1,
  generateEcoCp011LocalizedReviewV1,
  generateEcoCp012LocalizedReviewV1,
  generateEcoCp013LocalizedReviewV1,
  generateEcoCp014LocalizedReviewV1,
  generateEcoCp015LocalizedReviewV1,
  generateEcoCp016LocalizedReviewV1,
  generateEcoCp017LocalizedReviewV1,
  generateEcoCp018LocalizedReviewV1,
  generateEcoCp019LocalizedReviewV1,
  generateEcoCp020LocalizedReviewV1,
  generateEcoCp021LocalizedReviewV1,
  generateEcoCp022LocalizedReviewV1,
  generateEcoCp023LocalizedReviewV1,
  generateEcoCp001Cp023LocalizedReviewV1,
} from "./eco-localization-generator-v1";
import type { EcoLocaleV1, EcoLocalizedQuestionV1 } from "./eco-localization-types-v1";
import {
  findEcoNativeTermsStillInEnglishV1,
  isEcoProtectedExamTermV1,
  stripEcoAllowedRomanV1,
} from "./eco-localization-term-policy-v1";

const locales: EcoLocaleV1[] = ["en", "hi", "pa"];
const ECO_CP007_REVIEW_V1 = generateEcoCp007ReviewBatchV1();
const ECO_CP008_REVIEW_V1 = generateEcoCp008ReviewBatchV1();
const ECO_CP009_REVIEW_V2 = generateEcoCp009ReviewBatchV2();
const fail = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

function learnerText(question: { stem: string; options: readonly string[]; explanation: string }): string {
  return [question.stem, ...question.options, question.explanation].join("\n");
}

const MECHANICAL_STEM_PATTERNS = [
  /other things equal/iu,
  /\bmainly\b/iu,
  /\bgenerally\b/iu,
  /best fits/iu,
  /most directly/iu,
  /best described/iu,
  /best describes/iu,
  /most appropriate/iu,
  /usually associated/iu,
  /main purpose/iu,
  /best separates/iu,
  /most accurate/iu,
  /most likely/iu,
  /most contractionary/iu,
  /most consistent/iu,
  /best distinguishes/iu,
  /\bprimarily\b/iu,
  /\bnormally\b/iu,
  /\btypically\b/iu,
  /main role/iu,
  /best represents/iu,
  /best reflects/iu,
  /best summarises/iu,
  /all else equal/iu,
  /अन्य बातें समान/u,
  /मुख्यतः/u,
  /सामान्यतः/u,
  /सबसे उपयुक्त/u,
  /सबसे सही वर्णन/u,
  /सबसे सीधे/u,
  /मुख्य भूमिका/u,
  /ਹੋਰ ਗੱਲਾਂ ਇੱਕੋ/u,
  /ਮੁੱਖ ਤੌਰ/u,
  /ਆਮ ਤੌਰ/u,
  /ਸਭ ਤੋਂ ਉਚਿਤ/u,
  /ਸਭ ਤੋਂ ਸਹੀ ਵਰਣਨ/u,
  /ਮੁੱਖ ਭੂਮਿਕਾ/u,
] as const;

function assertExamStandardStem(question: EcoLocalizedQuestionV1) {
  for (const pattern of MECHANICAL_STEM_PATTERNS) {
    fail(!pattern.test(question.stem), `${question.questionId}: mechanical stem wording: ${pattern}`);
  }
}

const CP011_CP012_BAD_LEXICAL_PATTERNS = {
  hi: [/सावधान ऋण/u],
  pa: [
    /ਲੋਕ ਵਿੱਤ/u,
    /ਮਾਲੀ (?:ਘਾਟਾ|ਖਰਚ|ਪ੍ਰਾਪਤ)/u,
    /ਆਟੋਮੈਟਿਕ ਸਥਿਰ/u,
    /ਵਿਵੇਕਧੀਨ/u,
    /ਮੁੜ-ਵਿੱਤ/u,
    /ਮੁੜਵਿੱਤ/u,
    /ਰਿਟੇਲ /u,
    /ਸਾਵਧਾਨ ਕਰਜ਼/u,
  ],
} as const;

function assertCp011Cp012LexicalQuality(question: EcoLocalizedQuestionV1, locale: "hi" | "pa") {
  const text = learnerText(question);
  for (const pattern of CP011_CP012_BAD_LEXICAL_PATTERNS[locale]) {
    fail(!pattern.test(text), `${question.questionId}: rejected multilingual wording: ${pattern}`);
  }
}

const CP015_CP016_BAD_LEXICAL_PATTERNS = {
  hi: [] as readonly RegExp[],
  pa: [
    /ਸਮਾਯੋਜਨ/u,
    /ਸਾਵਧਾਨ ਨਿਯਮਨ/u,
  ],
} as const;

function assertCp015Cp016LexicalQuality(question: EcoLocalizedQuestionV1, locale: "hi" | "pa") {
  const text = learnerText(question);
  for (const pattern of CP015_CP016_BAD_LEXICAL_PATTERNS[locale]) {
    fail(!pattern.test(text), `${question.questionId}: rejected multilingual wording: ${pattern}`);
  }
}

function assertNative(question: EcoLocalizedQuestionV1, english: any, locale: "hi" | "pa") {
  const text = learnerText(question);
  const stripped = stripEcoAllowedRomanV1(text);
  fail(
    !/[A-Za-z]{2,}/u.test(stripped),
    `${question.questionId}: unauthorized Latin-script leakage: ${stripped.match(/[A-Za-z]{2,}/u)?.[0] ?? "unknown"}`,
  );

  const nativeTermsLeft = findEcoNativeTermsStillInEnglishV1(learnerText(english), text);
  fail(
    nativeTermsLeft.length === 0,
    `${question.questionId}: NATIVE term remained in English: ${nativeTermsLeft.join(", ")}`,
  );

  english.options.forEach((option: string, optionIndex: number) => {
    if (isEcoProtectedExamTermV1(option)) {
      fail(
        question.options[optionIndex] === option,
        `${question.questionId}: protected exam term drift at option ${optionIndex + 1}: ${option}`,
      );
    }
  });

  if (["ECO-CP-011", "ECO-CP-012"].includes(english.cpId)) assertCp011Cp012LexicalQuality(question, locale);
  if (["ECO-CP-015", "ECO-CP-016"].includes(english.cpId)) assertCp015Cp016LexicalQuality(question, locale);

  if (locale === "hi") fail(/[\u0900-\u097F]/u.test(text), `${question.questionId}: missing Devanagari`);
  if (locale === "pa") fail(/[\u0A00-\u0A7F]/u.test(text), `${question.questionId}: missing Gurmukhi`);
}

function assertParity(source: readonly any[], localized: readonly EcoLocalizedQuestionV1[], locale: EcoLocaleV1) {
  fail(localized.length === source.length, `${locale}: length mismatch`);
  localized.forEach((question, index) => {
    const english = source[index];
    fail(question.localizationV1.englishQuestionId === english.questionId, `${question.questionId}: English id mismatch`);
    fail(question.cpId === english.cpId, `${question.questionId}: CP mismatch`);
    fail(question.qlId === english.qlId, `${question.questionId}: QL mismatch`);
    fail(question.difficulty === english.difficulty, `${question.questionId}: difficulty mismatch`);
    fail(question.correctIndex === english.correctIndex, `${question.questionId}: correct-index mismatch`);
    fail(JSON.stringify(question.sourceIds) === JSON.stringify(english.sourceIds), `${question.questionId}: sourceIds mismatch`);
    fail(JSON.stringify(question.sourceFactIds) === JSON.stringify(english.sourceFactIds), `${question.questionId}: sourceFactIds mismatch`);
    fail(question.options.length === 4, `${question.questionId}: expected four options`);
    fail(new Set(question.options).size === 4, `${question.questionId}: duplicate localized options`);
    fail(question.canonicalAnswer === question.options[question.correctIndex], `${question.questionId}: canonical answer mismatch`);
    fail(question.reviewOnly === true && question.runtimeRegistered === false, `${question.questionId}: lifecycle boundary changed`);

    if (["ECO-CP-009", "ECO-CP-010", "ECO-CP-011", "ECO-CP-012", "ECO-CP-013", "ECO-CP-014", "ECO-CP-015", "ECO-CP-016", "ECO-CP-017", "ECO-CP-018", "ECO-CP-019", "ECO-CP-020", "ECO-CP-021", "ECO-CP-022", "ECO-CP-023"].includes(english.cpId)) assertExamStandardStem(question);
    if (["ECO-CP-021", "ECO-CP-022", "ECO-CP-023"].includes(english.cpId)) fail(!/associated with/iu.test(question.stem), `${question.questionId}: mechanical stem wording: /associated with/iu`);

    if (locale === "en") {
      fail(question.questionId === english.questionId, `${question.questionId}: English id drift`);
      fail(question.stem === english.stem, `${question.questionId}: English stem drift`);
      fail(JSON.stringify(question.options) === JSON.stringify(english.options), `${question.questionId}: English options drift`);
      fail(question.explanation === english.explanation, `${question.questionId}: English explanation drift`);
      fail(question.canonicalAnswer === english.canonicalAnswer, `${question.questionId}: English answer drift`);
    } else {
      fail(question.questionId === `${english.questionId}-${locale.toUpperCase()}`, `${question.questionId}: localized id mismatch`);
      assertNative(question, english, locale);
    }
  });
}

const batches = [
  ["CP001", ECO_CP001_REVIEW_V2, generateEcoCp001LocalizedReviewV1, 42],
  ["CP002", ECO_CP002_REVIEW_V2, generateEcoCp002LocalizedReviewV1, 42],
  ["CP003", ECO_CP003_REVIEW_V2, generateEcoCp003LocalizedReviewV1, 44],
  ["CP004", ECO_CP004_REVIEW_V2, generateEcoCp004LocalizedReviewV1, 44],
  ["CP005", ECO_CP005_REVIEW_V1, generateEcoCp005LocalizedReviewV1, 44],
  ["CP006", ECO_CP006_REVIEW_V1, generateEcoCp006LocalizedReviewV1, 44],
  ["CP007", ECO_CP007_REVIEW_V1, generateEcoCp007LocalizedReviewV1, 44],
  ["CP008", ECO_CP008_REVIEW_V1, generateEcoCp008LocalizedReviewV1, 44],
  ["CP009", ECO_CP009_REVIEW_V2, generateEcoCp009LocalizedReviewV1, 44],
  ["CP010", ECO_CP010_REVIEW_V2, generateEcoCp010LocalizedReviewV1, 44],
  ["CP011", ECO_CP011_REVIEW_V2, generateEcoCp011LocalizedReviewV1, 44],
  ["CP012", ECO_CP012_REVIEW_V3, generateEcoCp012LocalizedReviewV1, 44],
  ["CP013", ECO_CP013_REVIEW_V2, generateEcoCp013LocalizedReviewV1, 44],
  ["CP014", ECO_CP014_REVIEW_V2, generateEcoCp014LocalizedReviewV1, 44],
  ["CP015", ECO_CP015_REVIEW_V3, generateEcoCp015LocalizedReviewV1, 44],
  ["CP016", ECO_CP016_REVIEW_V2, generateEcoCp016LocalizedReviewV1, 44],
  ["CP017", ECO_CP017_REVIEW_V2, generateEcoCp017LocalizedReviewV1, 44],
  ["CP018", ECO_CP018_REVIEW_V2, generateEcoCp018LocalizedReviewV1, 44],
  ["CP019", ECO_CP019_REVIEW_V2, generateEcoCp019LocalizedReviewV1, 44],
  ["CP020", ECO_CP020_REVIEW_V2, generateEcoCp020LocalizedReviewV1, 44],
  ["CP021", ECO_CP021_REVIEW_V3, generateEcoCp021LocalizedReviewV1, 44],
  ["CP022", ECO_CP022_REVIEW_V2, generateEcoCp022LocalizedReviewV1, 44],
  ["CP023", ECO_CP023_REVIEW_V2, generateEcoCp023LocalizedReviewV1, 44],
] as const;

for (const [label, source, generate, expected] of batches) {
  fail(source.length === expected, `${label}: expected ${expected}, found ${source.length}`);
  for (const locale of locales) assertParity(source, generate(locale), locale);
}

for (const locale of locales) {
  fail(generateEcoCp001Cp023LocalizedReviewV1(locale).length === 1008, `${locale}: CP001-CP023 expected 1008`);
}

fail(
  locales.flatMap((locale) => generateEcoCp001Cp023LocalizedReviewV1(locale)).length === 3024,
  "CP001-CP023 expected 3024 EN-HI-PA surfaces",
);

console.log("Economy CP001-CP023 multilingual audit passed: 1008 questions per locale / 3024 surfaces.");
