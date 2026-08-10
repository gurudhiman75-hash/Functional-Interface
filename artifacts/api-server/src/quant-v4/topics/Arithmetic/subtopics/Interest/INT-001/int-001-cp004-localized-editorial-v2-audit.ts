import { mkdirSync, writeFileSync } from "node:fs";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import { INT_CP004_LOCALIZED_HUMAN_EDITORIAL_V7_VERSION } from "./cp004-localized-human-editorial-v7";
import { INT_CP004_LOCALIZED_SIMPLE_EXPLANATION_V8_VERSION } from "./cp004-localized-simple-explanations-v8";
import { generateIntCp004LocalizedQuestion } from "./cp004-localized-runtime";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

const locales: readonly IntCp004LocalizedLocale[] = Object.freeze(["hi-IN", "pa-IN"]);
const seedsPerQl = 100;
const outputDirectory = "dist/quant-v4/int-cp004-localized-editorial-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const bannedShared = [
  "INT-QL-",
  "नाममात्र",
  "ਨਾਮਮਾਤਰ",
  "दिए गए विवरण के आधार पर उत्तर दीजिए",
  "ਦਿੱਤੇ ਵੇਰਵੇ ਦੇ ਆਧਾਰ ਉੱਤੇ ਉੱਤਰ ਦਿਓ",
  "सही। यह विकल्प प्रश्न की सभी ब्याज-शर्तों को पूरा करता है।",
  "ਸਹੀ। ਇਹ ਚੋਣ ਪ੍ਰਸ਼ਨ ਦੀਆਂ ਸਾਰੀਆਂ ਵਿਆਜ-ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ।",
] as const;

const bannedMachineHindi = [
  "निवेश की शर्तें नीचे दी गई हैं",
  "खाते में दर्ज",
  "खाता विवरण",
  "योजना का सार",
  "योजना/चरण का विवरण",
  "दर्ज जानकारी के आधार पर",
  "प्रश्न हल कीजिए",
  "आवश्यक विवरण नीचे दिया गया है",
] as const;

const bannedMachinePunjabi = [
  "ਨਿਵੇਸ਼ ਦੀਆਂ ਸ਼ਰਤਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਹਨ",
  "ਖਾਤੇ ਵਿੱਚ ਦਰਜ",
  "ਖਾਤਾ ਵੇਰਵਾ",
  "ਯੋਜਨਾ ਦਾ ਸਾਰ",
  "ਯੋਜਨਾ/ਪੜਾਅ ਦਾ ਵੇਰਵਾ",
  "ਦਰਜ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਉੱਤੇ",
  "ਪ੍ਰਸ਼ਨ ਹੱਲ ਕਰੋ",
  "ਲੋੜੀਂਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਹੈ",
] as const;

const bannedHindiGrammar = [
  /\d+वीं माह/gu,
  /\d+वीं वर्ष/gu,
  /\d+वीं अर्धवर्ष/gu,
  /कुल \d+ तिमाहियाँ बाद/gu,
  /अवधियाँ =/gu,
  /वृद्धि-गुणक/gu,
  /ब्याज-क्रम/gu,
  /ब्याज-नियम/gu,
  /अवधि का गुणक लागू या उलटें/gu,
  /(?:तिमाहियाँ|छमाहियाँ|महीने) लिए गए हैं/gu,
  /कुल \d+ (?:तिमाहियाँ|छमाहियाँ|महीने|वर्ष) लेने पर/gu,
  /\d+(?:\.\d+)?% ÷ 1(?![\d.])/gu,
  /\d+(?:\.\d+)?%\d+\s*=/gu,
  /वार्षिक दर को सीधे हर बार पर न लगाएँ; हर वर्ष की दर/gu,
  /एक राशि ₹[\d,.]+ है/gu,
  /एक निवेश ₹[\d,.]+ है/gu,
  /प्रत्येक ब्याज-अंतराल/gu,
  /ब्याज जोड़ने का नियम हर/gu,
  /1 वर्ष पूरे वर्षों/gu,
  /अधिक राशि कितनी अधिक होगी/gu,
  /दिए ब्याज जोड़ने का नियम से/gu,
  /प्रत्येक संभावित ब्याज जोड़ने का क्रम से/gu,
  /ब्याज-आवृत्ति/gu,
  /दर पहले से =/gu,
  /पहले से हर बार की दर/gu,
] as const;

const bannedPunjabiGrammar = [
  /\d+ਵੀਂ ਮਹੀਨਾ/gu,
  /\d+ਵੀਂ ਸਾਲ/gu,
  /ਹਰ ਮਹੀਨਾ ਦੀ/gu,
  /\d+ ਮਹੀਨਾ ਬਾਅਦ/gu,
  /ਕੁੱਲ \d+ ਤਿਮਾਹੀਆਂ ਬਾਅਦ/gu,
  /ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ/gu,
  /ਮਿਆਦਾਂ =/gu,
  /ਵਾਧਾ-ਗੁਣਕ/gu,
  /ਵਿਆਜ-ਕ੍ਰਮ/gu,
  /ਵਿਆਜ-ਨਿਯਮ/gu,
  /ਅਵਧੀ/gu,
  /ਆਵ੍ਰਿਤੀ/gu,
  /(?:ਤਿਮਾਹੀਆਂ|ਛਿਮਾਹੀਆਂ|ਮਹੀਨੇ) ਲਏ ਗਏ ਹਨ/gu,
  /ਕੁੱਲ \d+ (?:ਤਿਮਾਹੀਆਂ|ਛਿਮਾਹੀਆਂ|ਮਹੀਨੇ|ਸਾਲ) ਲੈਣ ਉੱਤੇ/gu,
  /\d+(?:\.\d+)?% ÷ 1(?![\d.])/gu,
  /\d+(?:\.\d+)?%\d+\s*=/gu,
  /ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਸਿੱਧਾ ਹਰ ਵਾਰ ਉੱਤੇ ਨਾ ਲਗਾਓ; ਹਰ ਸਾਲ ਦੀ ਦਰ/gu,
  /ਇੱਕ ਰਕਮ ₹[\d,.]+ ਹੈ/gu,
  /ਇੱਕ ਨਿਵੇਸ਼ ₹[\d,.]+ ਹੈ/gu,
  /ਹਰ ਵਿਆਜ ਅੰਤਰਾਲ/gu,
  /ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ/gu,
  /ਲਿਖੀ ਹੋਈ ਸਾਲਾਨਾ ਦਰ/gu,
  /ਵੱਧ ਰਕਮ ਕਿੰਨੀ ਵੱਧ ਹੋਵੇਗੀ/gu,
  /ਸਾਰੀਆਂ ਮਿਸ਼ਰਤ ਵਿਆਜਆਂ/gu,
  /ਵਿਆਜ ਜੋੜਨ ਦਾ ਗੁਣਕ ਨਾਲ/gu,
  /ਦੇ ਸਧਾਰਣ ਵਿਆਜ ਬਾਅਦ/gu,
  /ਦਰ ਪਹਿਲਾਂ ਹੀ =/gu,
  /ਵਾਧਾ ਦਰ ਕਿੰਨਾ/gu,
  /ਵਾਧਾ ਦਰ ਕਿੰਨੀ ਹੋਵੇਗਾ/gu,
  /ਪਹਿਲਾਂ ਹੀ ਹਰ ਵਾਰ ਦੀ ਦਰ/gu,
  /ਹਰ ਸੰਭਵ ਕ੍ਰਮ/gu,
] as const;

const bannedHindiExplanation = [
  /\bA\s*=/u,
  /\bCI\s*=/u,
  /\bP\s*=/u,
  /चक्रवृद्धि गुणक/u,
  /संयुक्त गुणक/u,
  /ब्याज गुणक/u,
  /विकल्प\s+[ABCD]/u,
  /अतः/u,
] as const;

const bannedPunjabiExplanation = [
  /\bA\s*=/u,
  /\bCI\s*=/u,
  /\bP\s*=/u,
  /ਗੁਣਕ/u,
  /ਚੋਣ\s+[ABCD]/u,
  /ਚੱਕਰਵੱਧੀ/u,
] as const;

function normalizeStem(stem: string): string {
  return stem
    .replace(/₹[\d,.]+/gu, "₹N")
    .replace(/\d+(?:\.\d+)?%/gu, "R%")
    .replace(/\d+/gu, "N")
    .replace(/\s+/gu, " ")
    .trim();
}

function expectedCreditInterval(locale: IntCp004LocalizedLocale, frequency: number): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "हर वर्ष";
      case 2: return "हर छमाही";
      case 4: return "हर तिमाही";
      case 12: return "हर महीने";
      default: return "";
    }
  }
  switch (frequency) {
    case 1: return "ਹਰ ਸਾਲ";
    case 2: return "ਹਰ ਛਿਮਾਹੀ";
    case 4: return "ਹਰ ਤਿਮਾਹੀ";
    case 12: return "ਹਰ ਮਹੀਨੇ";
    default: return "";
  }
}

let questionCases = 0;
let optionChecks = 0;
let explanationChecks = 0;
let simpleExplanationChecks = 0;
let conciseStepChecks = 0;
let plainLanguageChecks = 0;
let learnerIdLeakChecks = 0;
let nativeStemChecks = 0;
let directPeriodStemChecks = 0;
let grammarChecks = 0;
let feedbackSpecificityChecks = 0;
let effectiveRateEquationChecks = 0;
let punjabiTerminologyChecks = 0;
let annualWordingChecks = 0;
const correctFeedbackByLocale = new Map<IntCp004LocalizedLocale, Set<string>>();
const normalizedStemsByQl = new Map<string, Set<string>>();
const framesByQl = new Map<string, Set<string>>();
const mishritUsageByQl = new Map<string, number>();

for (const locale of locales) {
  correctFeedbackByLocale.set(locale, new Set());

  for (const qlId of INT_CP004_QL_IDS) {
    for (let index = 0; index < seedsPerQl; index += 1) {
      const seed = `int-cp004-human-v8-audit:${qlId}:${index}`;
      const question = generateIntCp004LocalizedQuestion({ qlId, seed, locale });
      const explanationText = [
        question.explanation.whatAsked,
        ...question.explanation.steps,
        question.explanation.finalAnswer,
        question.explanation.commonMistake,
      ].join("\n");
      const learnerText = [
        question.stem,
        ...question.options.flatMap((option) => [option.text, option.feedback]),
        explanationText,
      ].join("\n");
      questionCases += 1;

      for (const banned of bannedShared) {
        assert(!question.stem.includes(banned), `${qlId}/${seed}/${locale}: learner-facing stem contains banned text: ${banned}`);
        learnerIdLeakChecks += 1;
      }

      const machinePhrases = locale === "hi-IN" ? bannedMachineHindi : bannedMachinePunjabi;
      for (const phrase of machinePhrases) {
        assert(!question.stem.includes(phrase), `${qlId}/${seed}/${locale}: machine-style stem phrase remains: ${phrase}`);
        nativeStemChecks += 1;
      }
      assert(!question.stem.includes("|---|"), `${qlId}/${seed}/${locale}: native stem still contains a Markdown table.`);
      assert(!question.stem.includes("**"), `${qlId}/${seed}/${locale}: native stem still exposes a generated heading.`);
      assert(!question.stem.includes("\n- "), `${qlId}/${seed}/${locale}: native stem still exposes a generated fact list.`);
      assert(question.stem.trim().endsWith("?") || question.stem.trim().endsWith("।"), `${qlId}/${seed}/${locale}: stem has no natural terminal punctuation.`);
      nativeStemChecks += 4;

      if (qlId === "INT-QL-073" || qlId === "INT-QL-074") {
        const expectedInterval = expectedCreditInterval(locale, question.mathematicalState.frequency);
        assert(expectedInterval.length > 0 && question.stem.includes(expectedInterval), `${qlId}/${seed}/${locale}: direct-period-rate stem omits the actual crediting interval.`);
        assert(locale === "hi-IN" ? !question.stem.includes("हर बार ब्याज") : !question.stem.includes("ਹਰ ਵਾਰ ਵਿਆਜ"), `${qlId}/${seed}/${locale}: ambiguous every-time wording remains in a direct-period-rate stem.`);
        directPeriodStemChecks += 2;
      }

      const grammarPatterns = locale === "hi-IN" ? bannedHindiGrammar : bannedPunjabiGrammar;
      for (const pattern of grammarPatterns) {
        pattern.lastIndex = 0;
        assert(!pattern.test(learnerText), `${qlId}/${seed}/${locale}: banned grammar pattern ${pattern} found.`);
        grammarChecks += 1;
      }

      if (question.mathematicalState.frequency === 1) {
        assert(!/÷\s*1(?![\d.])/u.test(learnerText), `${qlId}/${seed}/${locale}: redundant annual-rate division remains.`);
        annualWordingChecks += 1;
      }

      if (locale === "pa-IN") {
        assert(!learnerText.includes("ਚੱਕਰਵੱਧੀ"), `${qlId}/${seed}/${locale}: rejected Punjabi compound-interest term remains.`);
        if (question.stem.includes("ਮਿਸ਼ਰਤ ਵਿਆਜ")) {
          mishritUsageByQl.set(qlId, (mishritUsageByQl.get(qlId) ?? 0) + 1);
        }
        punjabiTerminologyChecks += 1;
      }

      const qlKey = `${locale}/${qlId}`;
      const normalizedSet = normalizedStemsByQl.get(qlKey) ?? new Set<string>();
      normalizedSet.add(normalizeStem(question.stem));
      normalizedStemsByQl.set(qlKey, normalizedSet);
      const frameSet = framesByQl.get(qlKey) ?? new Set<string>();
      frameSet.add(question.stemFamilyId);
      framesByQl.set(qlKey, frameSet);

      const correctOption = question.options[question.correctIndex];
      assert(correctOption?.isCorrect, `${qlId}/${seed}/${locale}: correct option is missing.`);
      for (const option of question.options) {
        assert(option.feedback.trim().length >= 35, `${qlId}/${seed}/${locale}/${option.id}: feedback is too generic.`);
        assert(!option.feedback.includes("सभी ब्याज-शर्तों") && !option.feedback.includes("ਸਾਰੀਆਂ ਵਿਆਜ-ਸ਼ਰਤਾਂ"), `${qlId}/${seed}/${locale}/${option.id}: legacy generic feedback remains.`);
        optionChecks += 1;
      }
      assert(correctOption.feedback.includes(correctOption.text), `${qlId}/${seed}/${locale}: correct feedback does not state the verified answer.`);
      correctFeedbackByLocale.get(locale)?.add(correctOption.feedback);
      feedbackSpecificityChecks += 1;

      assert(question.explanation.steps.length >= 2 && question.explanation.steps.length <= 4, `${qlId}/${seed}/${locale}: simple explanation must use 2-4 steps.`);
      assert(question.explanation.whatAsked.length <= 60, `${qlId}/${seed}/${locale}: task line is too long.`);
      assert(
        locale === "hi-IN"
          ? question.explanation.whatAsked.startsWith("हमें ")
          : question.explanation.whatAsked.startsWith("ਸਾਨੂੰ "),
        `${qlId}/${seed}/${locale}: task line does not use the natural learner-facing opening.`,
      );
      assert(question.explanation.finalAnswer.length <= 90, `${qlId}/${seed}/${locale}: final answer is too long.`);
      assert(question.explanation.commonMistake.length >= 35 && question.explanation.commonMistake.length <= 170, `${qlId}/${seed}/${locale}: mistake note is not concise.`);
      assert(question.explanation.finalAnswer.includes(question.correctAnswer), `${qlId}/${seed}/${locale}: final answer does not state the verified answer.`);
      simpleExplanationChecks += 6;

      for (const [stepIndex, step] of question.explanation.steps.entries()) {
        assert(step.length <= 180, `${qlId}/${seed}/${locale}/step-${stepIndex + 1}: explanation step is too long (${step.length}).`);
        assert(/[₹%0-9×÷=+−^-]/u.test(step), `${qlId}/${seed}/${locale}/step-${stepIndex + 1}: explanation step lacks concrete calculation evidence.`);
        conciseStepChecks += 2;
      }

      const bannedExplanation = locale === "hi-IN" ? bannedHindiExplanation : bannedPunjabiExplanation;
      for (const pattern of bannedExplanation) {
        pattern.lastIndex = 0;
        assert(!pattern.test(explanationText), `${qlId}/${seed}/${locale}: solver-style explanation pattern ${pattern} remains.`);
        plainLanguageChecks += 1;
      }

      assert(!question.explanation.finalAnswer.startsWith("अतः सही उत्तर"), `${qlId}/${seed}/${locale}: mechanical Hindi final-answer wrapper remains.`);
      assert(!question.explanation.finalAnswer.startsWith("ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ"), `${qlId}/${seed}/${locale}: mechanical Punjabi final-answer wrapper remains.`);
      explanationChecks += 1;

      if (qlId === "INT-QL-076") {
        const stepsText = question.explanation.steps.join("\n");
        assert(!/₹100[^\n]*=[^\n]*%/u.test(stepsText), `${qlId}/${seed}/${locale}: money and percentage are equated in one malformed expression.`);
        assert(locale === "hi-IN" ? stepsText.includes("प्रभावी वार्षिक दर") : stepsText.includes("ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ"), `${qlId}/${seed}/${locale}: effective-rate conclusion is missing.`);
        effectiveRateEquationChecks += 1;
      }
    }
  }
}

for (const locale of locales) {
  const correctFeedbacks = correctFeedbackByLocale.get(locale)?.size ?? 0;
  assert(correctFeedbacks >= 80, `${locale}: correct feedback diversity is too low (${correctFeedbacks}).`);
  for (const qlId of INT_CP004_QL_IDS) {
    const key = `${locale}/${qlId}`;
    const normalizedStems = normalizedStemsByQl.get(key)?.size ?? 0;
    const frames = framesByQl.get(key)?.size ?? 0;
    assert(normalizedStems >= 4, `${key}: fewer than four materially distinct native stem patterns (${normalizedStems}).`);
    assert(frames === 4, `${key}: all four frozen stem families were not exercised (${frames}).`);
  }
}
assert([...mishritUsageByQl.values()].reduce((sum, count) => sum + count, 0) > 0, "Punjabi stems never use ਮਿਸ਼ਰਤ ਵਿਆਜ.");

mkdirSync(outputDirectory, { recursive: true });
const summary = Object.freeze({
  status: "CP004_LOCALIZED_SIMPLE_EXPLANATIONS_V8_VALIDATED",
  editorialVersion: "INT-CP-004-HI-PA-NATIVE-STEMS-v6",
  humanEditorialVersion: INT_CP004_LOCALIZED_HUMAN_EDITORIAL_V7_VERSION,
  simpleExplanationVersion: INT_CP004_LOCALIZED_SIMPLE_EXPLANATION_V8_VERSION,
  questionCases,
  optionChecks,
  explanationChecks,
  simpleExplanationChecks,
  conciseStepChecks,
  plainLanguageChecks,
  learnerIdLeakChecks,
  nativeStemChecks,
  directPeriodStemChecks,
  grammarChecks,
  feedbackSpecificityChecks,
  effectiveRateEquationChecks,
  punjabiTerminologyChecks,
  annualWordingChecks,
  mishritUsageByQl: Object.fromEntries(mishritUsageByQl),
  seedsPerQl,
  locales,
  normalizedStemPatternsByQl: Object.fromEntries(
    [...normalizedStemsByQl.entries()].map(([key, values]) => [key, values.size]),
  ),
  correctFeedbackDiversity: Object.fromEntries(
    locales.map((locale) => [locale, correctFeedbackByLocale.get(locale)?.size ?? 0]),
  ),
  lifecycle: {
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
});
writeFileSync(`${outputDirectory}/int-cp004-localized-editorial-v2-summary.json`, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_LOCALIZED_SIMPLE_EXPLANATIONS_V8");
console.log("PASS_INT_CP004_LOCALIZED_HUMAN_EDITORIAL_V7");
console.log("PASS_INT_CP004_LOCALIZED_NATIVE_STEMS_V6");
console.log("PASS_INT_CP004_LOCALIZED_EDITORIAL_V2");
