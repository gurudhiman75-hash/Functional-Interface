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

let questionCases = 0;
let optionChecks = 0;
let explanationChecks = 0;
let learnerIdLeakChecks = 0;
let representationChecks = 0;
let grammarChecks = 0;
let feedbackSpecificityChecks = 0;
let effectiveRateEquationChecks = 0;
const correctFeedbackByLocale = new Map<IntCp004LocalizedLocale, Set<string>>();
const firstLinesByLocale = new Map<IntCp004LocalizedLocale, Set<string>>();
const representationCounts = new Map<string, number>();

for (const locale of locales) {
  correctFeedbackByLocale.set(locale, new Set());
  firstLinesByLocale.set(locale, new Set());

  for (const qlId of INT_CP004_QL_IDS) {
    for (let index = 0; index < seedsPerQl; index += 1) {
      const seed = `int-cp004-editorial-v4-audit:${qlId}:${index}`;
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
      for (const pattern of locale === "hi-IN" ? bannedHindiGrammar : bannedPunjabiGrammar) {
        pattern.lastIndex = 0;
        assert(!pattern.test(learnerText), `${qlId}/${seed}/${locale}: banned grammar pattern ${pattern} found.`);
        grammarChecks += 1;
      }

      const firstLine = question.stem.split("\n")[0]?.trim() ?? "";
      firstLinesByLocale.get(locale)?.add(firstLine);
      const representationKey = `${locale}:${question.representation}`;
      representationCounts.set(representationKey, (representationCounts.get(representationKey) ?? 0) + 1);

      if (question.representation !== "STANDARD_PROSE") {
        assert(question.stem.includes("|---|---|"), `${qlId}/${seed}/${locale}: structured representation has no meaningful table.`);
        assert(question.stem.split("\n").filter((line) => line.startsWith("|")).length >= 4, `${qlId}/${seed}/${locale}: structured table is too shallow.`);
      }
      if (question.representation === "TERMS_TABLE") {
        const heading = locale === "hi-IN" ? "**प्रश्न:**" : "**ਪ੍ਰਸ਼ਨ:**";
        assert(question.stem.includes(heading), `${qlId}/${seed}/${locale}: terms table has no direct localized question heading.`);
      }
      if (question.representation === "BALANCE_RECORD") {
        const accountWord = locale === "hi-IN" ? "खाते" : "ਖਾਤੇ";
        const genericRow = locale === "hi-IN" ? "आरंभिक प्रविष्टि" : "ਸ਼ੁਰੂਆਤੀ ਦਰਜ";
        assert(question.stem.includes(accountWord), `${qlId}/${seed}/${locale}: balance record lacks an account context.`);
        assert(!question.stem.includes(genericRow), `${qlId}/${seed}/${locale}: balance record still hides the first fact behind a generic label.`);
      }
      if (question.representation === "SCHEME_COMPARISON") {
        assert(locale === "hi-IN" ? question.stem.includes("योजना") : question.stem.includes("ਯੋਜਨਾ"), `${qlId}/${seed}/${locale}: scheme representation lacks a learner-facing scheme frame.`);
      }
      representationChecks += 1;

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
  const firstLines = firstLinesByLocale.get(locale)?.size ?? 0;
  assert(correctFeedbacks >= 80, `${locale}: correct feedback diversity is too low (${correctFeedbacks}).`);
  assert(firstLines >= 8, `${locale}: stem framing remains too repetitive (${firstLines} first lines).`);
  for (const representation of ["STANDARD_PROSE", "TERMS_TABLE", "BALANCE_RECORD", "SCHEME_COMPARISON"] as const) {
    assert((representationCounts.get(`${locale}:${representation}`) ?? 0) > 0, `${locale}: ${representation} was not exercised.`);
  }
}

mkdirSync(outputDirectory, { recursive: true });
const summary = Object.freeze({
  status: "CP004_LOCALIZED_EDITORIAL_V4_VALIDATED",
  editorialVersion: "INT-CP-004-HI-PA-EDITORIAL-v4",
  questionCases,
  optionChecks,
  explanationChecks,
  learnerIdLeakChecks,
  representationChecks,
  grammarChecks,
  feedbackSpecificityChecks,
  effectiveRateEquationChecks,
  seedsPerQl,
  locales,
  correctFeedbackDiversity: Object.fromEntries(locales.map((locale) => [locale, correctFeedbackByLocale.get(locale)?.size ?? 0])),
  firstLineDiversity: Object.fromEntries(locales.map((locale) => [locale, firstLinesByLocale.get(locale)?.size ?? 0])),
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
console.log("PASS_INT_CP004_LOCALIZED_EDITORIAL_V4");
console.log("PASS_INT_CP004_LOCALIZED_EDITORIAL_V2");
