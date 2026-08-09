import { mkdirSync, writeFileSync } from "node:fs";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
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
] as const;

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

let questionCases = 0;
let optionChecks = 0;
let explanationChecks = 0;
let learnerIdLeakChecks = 0;
let nativeStemChecks = 0;
let grammarChecks = 0;
let feedbackSpecificityChecks = 0;
let effectiveRateEquationChecks = 0;
let punjabiTerminologyChecks = 0;
const correctFeedbackByLocale = new Map<IntCp004LocalizedLocale, Set<string>>();
const normalizedStemsByQl = new Map<string, Set<string>>();
const framesByQl = new Map<string, Set<string>>();

for (const locale of locales) {
  correctFeedbackByLocale.set(locale, new Set());

  for (const qlId of INT_CP004_QL_IDS) {
    for (let index = 0; index < seedsPerQl; index += 1) {
      const seed = `int-cp004-native-v6-audit:${qlId}:${index}`;
      const question = generateIntCp004LocalizedQuestion({ qlId, seed, locale });
      const learnerText = [
        question.stem,
        ...question.options.flatMap((option) => [option.text, option.feedback]),
        question.explanation.whatAsked,
        ...question.explanation.steps,
        question.explanation.finalAnswer,
        question.explanation.commonMistake,
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

      const grammarPatterns = locale === "hi-IN" ? bannedHindiGrammar : bannedPunjabiGrammar;
      for (const pattern of grammarPatterns) {
        pattern.lastIndex = 0;
        assert(!pattern.test(learnerText), `${qlId}/${seed}/${locale}: banned grammar pattern ${pattern} found.`);
        grammarChecks += 1;
      }

      if (locale === "pa-IN") {
        assert(!learnerText.includes("ਚੱਕਰਵੱਧੀ"), `${qlId}/${seed}/${locale}: rejected Punjabi compound-interest term remains.`);
        if (punjabiMishritRequired.has(qlId)) {
          assert(question.stem.includes("ਮਿਸ਼ਰਤ ਵਿਆਜ"), `${qlId}/${seed}/${locale}: stem must use ਮਿਸ਼ਰਤ ਵਿਆਜ.`);
        }
        punjabiTerminologyChecks += 1;
      }

      const qlKey = `${locale}/${qlId}`;
      (normalizedStemsByQl.get(qlKey) ?? normalizedStemsByQl.set(qlKey, new Set()).get(qlKey)!).add(normalizeStem(question.stem));
      (framesByQl.get(qlKey) ?? framesByQl.set(qlKey, new Set()).get(qlKey)!).add(question.stemFamilyId);

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

      assert(!question.explanation.finalAnswer.startsWith("अतः सही उत्तर"), `${qlId}/${seed}/${locale}: mechanical Hindi final-answer wrapper remains.`);
      assert(!question.explanation.finalAnswer.startsWith("ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ"), `${qlId}/${seed}/${locale}: mechanical Punjabi final-answer wrapper remains.`);
      assert(question.explanation.commonMistake.length >= 45, `${qlId}/${seed}/${locale}: common-mistake note is not specific enough.`);
      explanationChecks += 1;

      if (qlId === "INT-QL-076") {
        const explanationText = question.explanation.steps.join("\n");
        assert(!/₹100[^\n]*=[^\n]*%/u.test(explanationText), `${qlId}/${seed}/${locale}: money and percentage are equated in one malformed expression.`);
        assert(locale === "hi-IN" ? explanationText.includes("प्रभावी वार्षिक दर") : explanationText.includes("ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ"), `${qlId}/${seed}/${locale}: effective-rate conclusion is missing.`);
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

mkdirSync(outputDirectory, { recursive: true });
const summary = Object.freeze({
  status: "CP004_LOCALIZED_NATIVE_STEMS_V6_VALIDATED",
  editorialVersion: "INT-CP-004-HI-PA-NATIVE-STEMS-v6",
  questionCases,
  optionChecks,
  explanationChecks,
  learnerIdLeakChecks,
  nativeStemChecks,
  grammarChecks,
  feedbackSpecificityChecks,
  effectiveRateEquationChecks,
  punjabiTerminologyChecks,
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
console.log("PASS_INT_CP004_LOCALIZED_NATIVE_STEMS_V6");
console.log("PASS_INT_CP004_LOCALIZED_EDITORIAL_V2");
