import { ALP_001_QLS } from "./ql-registry";
import { generateAlp001Question } from "./runtime";
import type { AlpAnswerType, AlpLocale } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function learnerText(question: ReturnType<typeof generateAlp001Question>): string {
  return [
    question.explanation.coreConcept,
    ...question.explanation.steps,
    ...question.explanation.visualWorking,
    question.explanation.examShortcut,
    question.explanation.conclusion,
    ...question.explanation.distractorAnalyses.map((analysis) => analysis.explanation),
  ].join("\n");
}

function instructionalText(question: ReturnType<typeof generateAlp001Question>): string {
  const protectedTokens = [
    question.answer,
    question.structuredPrompt.word ?? "",
    question.structuredPrompt.transformedWord ?? "",
    ...question.options.map((option) => option.value),
  ]
    .filter((token) => token.length > 1)
    .sort((a, b) => b.length - a.length);
  const withoutProtectedData = protectedTokens.reduce((current, token) => current.split(token).join(""), learnerText(question));
  return withoutProtectedData.replace(/\b[A-Z]{2,}\b/g, "");
}

function optionMatchesAnswerType(answerType: AlpAnswerType, value: string): boolean {
  switch (answerType) {
    case "LETTER": return /^[A-Z]$/.test(value);
    case "NUMBER": return /^\d+$/.test(value);
    case "NUMBER_PAIR": return /^\d+\s*,\s*\d+$/.test(value);
    case "LETTER_PAIR": return /^[A-Z]\s*(?:,|:)\s*[A-Z]$/.test(value);
    case "PAIR_SELECTION": return /^[A-Z]\s*:\s*[A-Z]$/.test(value);
    case "DIRECTION_OFFSET": return /^\d+ to the (?:left|right)$/.test(value);
    case "LETTER_SET":
      return value === "None"
        || /^(?:(?:first|second|third|\d+th) [A-Z])(?:; (?:first|second|third|\d+th) [A-Z])*$/.test(value);
  }
}

const locales: readonly AlpLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const rejectedBoilerplate = [
  "Use the stated alphabet or word-position operation exactly",
  "Do not reverse the reference end, include an excluded endpoint, or stop before completing the rearrangement",
  "दिए गए वर्णमाला या शब्द-स्थान नियम को ठीक उसी क्रम में लागू करें",
  "दिशा न बदलें, बाहर रखे गए सिरे को न गिनें",
  "ਦਿੱਤੇ ਵਰਣਮਾਲਾ ਜਾਂ ਸ਼ਬਦ-ਥਾਂ ਵਾਲੇ ਨਿਯਮ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਲਾਗੂ ਕਰੋ",
  "ਦਿਸ਼ਾ ਨਾ ਬਦਲੋ, ਬਾਹਰ ਰੱਖੇ ਸਿਰੇ ਨੂੰ ਨਾ ਗਿਣੋ",
];
const rejectedGenericTraps = [
  "is obtained by using the opposite reference end or movement direction",
  "reflects the original alphabet or a partially completed transformation rather than the final transformed order",
  "does not satisfy the complete position calculation shown above",
  "comes from reading the wrong position or checking the original word instead of the fully rearranged word",
  "mixes up positional distance, exclusive gap and inclusive span",
  "विपरीत सिरे या विपरीत चाल-दिशा का प्रयोग करने से मिलता है",
  "अंतिम बदले क्रम के बजाय मूल वर्णमाला या अधूरी पुनर्व्यवस्था को दर्शाता है",
  "ऊपर दिखाई गई पूरी स्थान-गणना को संतुष्ट नहीं करता",
  "गलत स्थान पढ़ने या पूरी पुनर्व्यवस्था के बजाय मूल शब्द देखने से मिलता है",
  "स्थान-अंतर, केवल बीच के अक्षर और दोनों सिरों सहित गिनती को आपस में मिला देता है",
  "ਉਲਟ ਸਿਰਾ ਜਾਂ ਉਲਟੀ ਚਾਲ-ਦਿਸ਼ਾ ਵਰਤਣ ਨਾਲ ਮਿਲਦਾ ਹੈ",
  "ਅੰਤਿਮ ਬਦਲੇ ਕ੍ਰਮ ਦੀ ਬਜਾਏ ਮੂਲ ਵਰਣਮਾਲਾ ਜਾਂ ਅਧੂਰੀ ਮੁੜ-ਵਿਵਸਥਾ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ",
  "ਉੱਪਰ ਦਿਖਾਈ ਪੂਰੀ ਥਾਂ-ਗਿਣਤੀ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ",
  "ਗਲਤ ਥਾਂ ਪੜ੍ਹਨ ਜਾਂ ਪੂਰੀ ਮੁੜ-ਵਿਵਸਥਾ ਦੀ ਬਜਾਏ ਮੂਲ ਸ਼ਬਦ ਵੇਖਣ ਨਾਲ ਮਿਲਦਾ ਹੈ",
  "ਥਾਂ-ਫਰਕ, ਕੇਵਲ ਵਿਚਕਾਰਲੇ ਅੱਖਰ ਅਤੇ ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ ਗਿਣਤੀ ਨੂੰ ਆਪਸ ਵਿੱਚ ਮਿਲਾ ਦਿੰਦਾ ਹੈ",
];
const rejectedGenericPedagogy = [
  "Use the relevant ranks and endpoint convention.",
  "The required result is",
  "संबंधित स्थान और सिरा-गणना नियम का प्रयोग करें।",
  "आवश्यक परिणाम",
  "ਸੰਬੰਧਿਤ ਥਾਵਾਂ ਅਤੇ ਸਿਰਾ-ਗਿਣਤੀ ਨਿਯਮ ਵਰਤੋ।",
  "ਲੋੜੀਂਦਾ ਨਤੀਜਾ",
];
const explicitlyRepairedModes = new Set([
  "IDENTIFY_PAIR_WITH_GAP",
  "IDENTIFY_PAIR_WITH_DISTANCE",
  "COMPARE_TWO_GAPS",
  "COUNT_LETTERS_OUTSIDE_INTERVAL",
  "COUNT_LETTERS_BEFORE_AND_AFTER",
]);
const englishInstructionLeak = /\b(?:left|right|rank|position|answer|original|changed|distance|move|apply|starting|required|result|letter|word|count|step|therefore)\b/i;
const rejectedHindiOrdinals = /\d+वें अक्षर|\d+वीं उपस्थिति|1वीं|2वीं|3वीं/;
const rejectedPunjabiOrdinals = /\d+ਵੀਂ ਅੱਖਰ|1ਵੀਂ ਵਾਰ ਆਉਣ ਵਾਲੇ ਅੱਖਰ|2ਵੀਂ ਵਾਰ ਆਉਣ ਵਾਲੇ ਅੱਖਰ/;

let generated = 0;
let localized = 0;
let transformationGrids = 0;
let trapAnalyses = 0;
let wordOptionChecks = 0;
let answerTypeChecks = 0;
let repairedPedagogyChecks = 0;
const coreConceptsByMode = new Map<string, Set<string>>();

for (const ql of ALP_001_QLS) {
  for (let seed = 0; seed < 12; seed += 1) {
    for (const locale of locales) {
      const question = generateAlp001Question(ql.qlId, seed, locale);
      generated += 1;
      if (locale !== "en-IN") localized += 1;

      assert(question.metadata.runtimeVersion === "ALP-001-RUNTIME-V2", `${ql.qlId} ${seed} ${locale} runtime version`);
      assert(question.explanation.schemaVersion === "ALP-001-PEDAGOGY-V2", `${ql.qlId} ${seed} ${locale} pedagogy schema`);
      assert(question.explanation.coreConcept.length >= 45, `${ql.qlId} ${seed} ${locale} weak core concept`);
      assert(question.explanation.steps.length >= 2, `${ql.qlId} ${seed} ${locale} insufficient worked steps`);
      assert(question.explanation.visualWorking.length >= 1, `${ql.qlId} ${seed} ${locale} missing visual working`);
      assert(question.explanation.examShortcut.length >= 25, `${ql.qlId} ${seed} ${locale} weak shortcut`);
      assert(question.explanation.conclusion.includes(question.answer), `${ql.qlId} ${seed} ${locale} conclusion omits answer`);
      assert(question.explanation.distractorAnalyses.length === 3, `${ql.qlId} ${seed} ${locale} distractor analysis count`);
      assert(new Set(question.explanation.distractorAnalyses.map((analysis) => analysis.explanation)).size === 3, `${ql.qlId} ${seed} ${locale} duplicate trap explanations`);

      for (const option of question.options) {
        answerTypeChecks += 1;
        assert(optionMatchesAnswerType(ql.answerType, option.value), `${ql.qlId} ${seed} ${locale} ${ql.answerType} option-shape mismatch: ${option.value}`);
      }

      const wrongOptionIndices = question.options
        .map((_, index) => index)
        .filter((index) => index !== question.correctIndex)
        .sort((a, b) => a - b);
      const analysedIndices = question.explanation.distractorAnalyses.map((analysis) => analysis.optionIndex).sort((a, b) => a - b);
      assert(JSON.stringify(wrongOptionIndices) === JSON.stringify(analysedIndices), `${ql.qlId} ${seed} ${locale} trap-to-option index mismatch`);
      for (const analysis of question.explanation.distractorAnalyses) {
        trapAnalyses += 1;
        assert(question.options[analysis.optionIndex]?.value === analysis.optionValue, `${ql.qlId} ${seed} ${locale} trap value mismatch`);
        assert(analysis.optionIndex !== question.correctIndex, `${ql.qlId} ${seed} ${locale} trap points to correct option`);
        assert(analysis.explanation.includes(analysis.optionValue), `${ql.qlId} ${seed} ${locale} trap omits actual option value`);
        for (const genericTrap of rejectedGenericTraps) {
          assert(!analysis.explanation.includes(genericTrap), `${ql.qlId} ${seed} ${locale} generic trap explanation retained`);
        }
      }

      const fullText = `${question.stem}\n${learnerText(question)}`;
      for (const boilerplate of rejectedBoilerplate) {
        assert(!fullText.includes(boilerplate), `${ql.qlId} ${seed} ${locale} rejected boilerplate`);
      }
      assert(!/Step 1:|Step 2:|The rearranged word is|Left rank \d+ corresponds/.test(fullText), `${ql.qlId} ${seed} ${locale} raw solver trace leak`);
      assert(!/undefined|null|\{\{|\}\}|ALP_|WORD_TRANSFORM_|ALPHA_TRANSFORM_/.test(fullText), `${ql.qlId} ${seed} ${locale} unresolved/internal text`);

      if (explicitlyRepairedModes.has(ql.solveMode)) {
        repairedPedagogyChecks += 1;
        for (const generic of rejectedGenericPedagogy) {
          assert(!fullText.includes(generic), `${ql.qlId} ${seed} ${locale} generic CP-003 pedagogy retained`);
        }
        assert(/[=−+|]/.test(question.explanation.steps.join(" ")), `${ql.qlId} ${seed} ${locale} repaired pedagogy lacks worked arithmetic`);
      }

      if (locale === "hi-IN") {
        assert(/[\u0900-\u097F]/.test(question.explanation.coreConcept), `${ql.qlId} ${seed} Hindi core concept missing script`);
        assert(!rejectedHindiOrdinals.test(question.stem), `${ql.qlId} ${seed} rejected Hindi ordinal agreement`);
        assert(!englishInstructionLeak.test(instructionalText(question)), `${ql.qlId} ${seed} English instructional leak in Hindi explanation`);
      }
      if (locale === "pa-IN") {
        assert(/[\u0A00-\u0A7F]/.test(question.explanation.coreConcept), `${ql.qlId} ${seed} Punjabi core concept missing script`);
        assert(!rejectedPunjabiOrdinals.test(question.stem), `${ql.qlId} ${seed} rejected Punjabi ordinal agreement`);
        assert(!englishInstructionLeak.test(instructionalText(question)), `${ql.qlId} ${seed} English instructional leak in Punjabi explanation`);
        assert(!/ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ|ਸਦ੍ਰਿਸ਼ਤਾ/.test(fullText), `${ql.qlId} ${seed} rejected Punjabi terminology`);
      }

      if (ql.checkpointId === "ALP-CP-004" || (ql.checkpointId === "ALP-CP-005" && question.metadata.wordTransformId)) {
        transformationGrids += 1;
        assert(question.explanation.visualWorking.length >= 3, `${ql.qlId} ${seed} ${locale} transformation lacks alignment grid`);
      }

      if (ql.checkpointId === "ALP-CP-005" && /^\d+$/.test(question.answer)) {
        const wordLength = question.structuredPrompt.word?.length;
        assert(wordLength !== undefined, `${ql.qlId} ${seed} ${locale} missing word length`);
        for (const option of question.options) {
          if (!/^\d+$/.test(option.value)) continue;
          wordOptionChecks += 1;
          const value = Number(option.value);
          assert(value >= 0 && value <= wordLength, `${ql.qlId} ${seed} ${locale} impossible word option ${value} for length ${wordLength}`);
          if (!ql.solveMode.includes("COUNT_UNCHANGED")) assert(value >= 1, `${ql.qlId} ${seed} ${locale} zero position option`);
        }
      }

      coreConceptsByMode.set(ql.solveMode, coreConceptsByMode.get(ql.solveMode) ?? new Set());
      coreConceptsByMode.get(ql.solveMode)!.add(question.explanation.coreConcept);
    }
  }
}

const marketRange = generateAlp001Question("ALP-QL-103", 0, "en-IN");
assert(marketRange.stem.includes("reverse only") || marketRange.stem.includes("reverse"), "ALP-QL-103 stem does not state the restricted reversal fluently");
assert(marketRange.explanation.visualWorking.length >= 3, "ALP-QL-103 lacks original/changed grid");
assert(marketRange.options.every((option) => !/^\d+$/.test(option.value) || Number(option.value) <= (marketRange.structuredPrompt.word?.length ?? 0)), "ALP-QL-103 has impossible position option");

const unchanged = generateAlp001Question("ALP-QL-104", 0, "en-IN");
assert(unchanged.explanation.visualWorking.length >= 3, "ALP-QL-104 lacks comparison grid");
assert(unchanged.explanation.steps.some((step) => /compare|position/i.test(step)), "ALP-QL-104 does not teach position comparison");

console.log("ALP-001 editorial-v2 adversarial audit passed.", {
  qlCount: ALP_001_QLS.length,
  generated,
  localized,
  transformationGrids,
  trapAnalyses,
  wordOptionChecks,
  answerTypeChecks,
  repairedPedagogyChecks,
  solveModes: coreConceptsByMode.size,
});
