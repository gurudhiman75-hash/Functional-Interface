import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";
import {
  generateIntCp004V6LocalizedQuestion,
  INT_CP004_V6_LOCALIZED_LOCALES,
} from "./cp004-localization-v6-runtime";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function fail(message: string): never {
  throw new Error(message);
}

function hasTable(text: string): boolean {
  return /^\|.+\|$/mu.test(text) && /^\|\s*[-:]+/mu.test(text);
}

const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const ENGLISH_LEARNER_WORDS = /\b(?:find|amount|principal|interest|rate|year|years|month|months|formula|compounding|quarterly|monthly|annually|half-yearly|complete|extra|illustrative|growth plan)\b/iu;
const BAD_HINDI = /(?:अतिरिक्त महीने|पूरे वर्ष और|पूर्ण अवधि|इलस्ट्रेटिव|ग्रोथ प्लान)/u;
const BAD_PUNJABI = /(?:ਵਾਧੂ ਮਹੀਨੇ|ਚੱਕਰਵੱਧੀ|ਇਲਸਟ੍ਰੇਟਿਵ|ਗ੍ਰੋਥ ਪਲਾਨ)/u;

let bilingualQuestions = 0;
let parityChecks = 0;
let optionParityChecks = 0;
let formulaChecks = 0;
let calculationChecks = 0;
let scriptChecks = 0;
let lifecycleChecks = 0;
let sourceTables = 0;
let localizedTables = 0;
let brokenNaturalDurationChecks = 0;
const answerPositions = [0, 0, 0, 0];
const localeCounts: Record<string, number> = { "hi-IN": 0, "pa-IN": 0 };

for (const qlId of INT_CP004_QL_IDS) {
  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const seed = `int-cp004-v6-localization:${qlId}:${seedIndex}`;
    const source = generateIntCp004EnglishFrozenV2Question(qlId, seed);
    if (hasTable(source.stem)) sourceTables += 1;

    for (const locale of INT_CP004_V6_LOCALIZED_LOCALES) {
      const localized = generateIntCp004V6LocalizedQuestion(qlId, seed, locale);
      bilingualQuestions += 1;
      localeCounts[locale] += 1;

      parityChecks += 8;
      if (stable(localized.mathematicalState) !== stable(source.mathematicalState)) fail(`${qlId}/${seed}/${locale}: mathematical state changed.`);
      if (stable(localized.solution) !== stable(source.solution)) fail(`${qlId}/${seed}/${locale}: solution changed.`);
      if (localized.correctIndex !== source.correctIndex) fail(`${qlId}/${seed}/${locale}: correct index changed.`);
      if (localized.representation !== source.representation) fail(`${qlId}/${seed}/${locale}: representation identity changed.`);
      if (localized.stemFamilyId !== source.stemFamilyId) fail(`${qlId}/${seed}/${locale}: stem-family identity changed.`);
      if (localized.freezeId !== "INT-CP-004-EN-v2-frozen") fail(`${qlId}/${seed}/${locale}: canonical freeze changed.`);
      if (localized.localization.canonicalSeed !== seed || localized.localization.canonicalQlId !== qlId) fail(`${qlId}/${seed}/${locale}: canonical localization identity changed.`);
      if (localized.correctAnswer !== localized.options[localized.correctIndex]?.text) fail(`${qlId}/${seed}/${locale}: localized correct answer is not keyed to the correct option.`);

      if (localized.options.length !== source.options.length) fail(`${qlId}/${seed}/${locale}: option count changed.`);
      for (let optionIndex = 0; optionIndex < source.options.length; optionIndex += 1) {
        optionParityChecks += 4;
        const english = source.options[optionIndex]!;
        const native = localized.options[optionIndex]!;
        if (stable(native.value) !== stable(english.value)) fail(`${qlId}/${seed}/${locale}/option-${optionIndex}: value changed.`);
        if (native.id !== english.id) fail(`${qlId}/${seed}/${locale}/option-${optionIndex}: option id changed.`);
        if (native.isCorrect !== english.isCorrect) fail(`${qlId}/${seed}/${locale}/option-${optionIndex}: correctness changed.`);
        if (native.misconceptionId !== english.misconceptionId) fail(`${qlId}/${seed}/${locale}/option-${optionIndex}: misconception ownership changed.`);
        if (native.feedback !== "") fail(`${qlId}/${seed}/${locale}/option-${optionIndex}: learner option feedback should remain suppressed.`);
      }

      formulaChecks += 1;
      const expectedFormulaPrefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
      if (!localized.explanation.steps[0]?.startsWith(expectedFormulaPrefix)) fail(`${qlId}/${seed}/${locale}: explanation does not begin with the formula.`);
      if (localized.explanation.steps.length < 3) fail(`${qlId}/${seed}/${locale}: explanation is too short.`);

      calculationChecks += 1;
      if (!localized.explanation.steps.slice(1).some((step) => step.includes("="))) fail(`${qlId}/${seed}/${locale}: explanation has no worked substitution/calculation after the formula.`);

      scriptChecks += 4;
      const expectedScript = locale === "hi-IN" ? DEVANAGARI : GURMUKHI;
      for (const [label, text] of [["stem", localized.stem], ["whatAsked", localized.explanation.whatAsked], ["finalAnswer", localized.explanation.finalAnswer], ["commonMistake", localized.explanation.commonMistake]] as const) {
        if (!expectedScript.test(text)) fail(`${qlId}/${seed}/${locale}/${label}: expected native script missing.`);
        if (ENGLISH_LEARNER_WORDS.test(text)) fail(`${qlId}/${seed}/${locale}/${label}: English learner wording leaked into native content.`);
      }
      const nativeText = [localized.stem, localized.explanation.whatAsked, ...localized.explanation.steps, localized.explanation.finalAnswer, localized.explanation.commonMistake].join("\n");
      if (locale === "hi-IN" && BAD_HINDI.test(nativeText)) fail(`${qlId}/${seed}/${locale}: mechanical Hindi wording reached learner content.`);
      if (locale === "pa-IN" && BAD_PUNJABI.test(nativeText)) fail(`${qlId}/${seed}/${locale}: mechanical/rejected Punjabi wording reached learner content.`);

      const sourceHasTable = hasTable(source.stem);
      const nativeHasTable = hasTable(localized.stem);
      if (sourceHasTable !== nativeHasTable) fail(`${qlId}/${seed}/${locale}: visual prose/table surface changed.`);
      if (nativeHasTable) localizedTables += 1;

      if (["INT-QL-079", "INT-QL-080", "INT-QL-081", "INT-QL-082"].includes(qlId)) {
        brokenNaturalDurationChecks += 1;
        const s = localized.mathematicalState;
        const expected = locale === "hi-IN"
          ? `${s.fullYears} वर्ष और ${s.tailMonths} महीने`
          : `${s.fullYears} ਸਾਲ ਅਤੇ ${s.tailMonths} ਮਹੀਨੇ`;
        if (!localized.stem.includes(expected)) fail(`${qlId}/${seed}/${locale}: broken-period duration is not written naturally as years and months.`);
      }

      lifecycleChecks += 8;
      if (
        localized.editorialStatus !== "MULTILINGUAL_LOCALISATION_REVIEW"
        || localized.approvalStatus !== "LOCALIZED_REVIEW_REQUIRED"
        || localized.enabled
        || localized.stagingStatus !== "NOT_STAGED"
        || localized.registrationStatus !== "NOT_REGISTERED"
        || localized.questionStudioDiscoverable
        || localized.questionBankStatus !== "NOT_STORED"
        || localized.publiclyPublishable
      ) fail(`${qlId}/${seed}/${locale}: localization lifecycle opened.`);

      answerPositions[localized.correctIndex] += 1;
    }
  }
}

if (bilingualQuestions !== 3800) fail(`Expected 3,800 bilingual questions, received ${bilingualQuestions}.`);
if (localeCounts["hi-IN"] !== 1900 || localeCounts["pa-IN"] !== 1900) fail(`Locale counts changed: ${JSON.stringify(localeCounts)}.`);
if (localizedTables !== sourceTables * 2) fail(`Localized table parity changed: source=${sourceTables}, localized=${localizedTables}.`);

const summary = {
  version: "INT-CP-004-HI-PA-V6-MIGRATION-v1",
  canonicalFreezeId: "INT-CP-004-EN-v2-frozen",
  qlCount: INT_CP004_QL_IDS.length,
  bilingualQuestions,
  localeCounts,
  parityChecks,
  optionParityChecks,
  formulaChecks,
  calculationChecks,
  scriptChecks,
  lifecycleChecks,
  brokenNaturalDurationChecks,
  sourceTables,
  localizedTables,
  answerPositions,
  lifecycle: {
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    enabled: false,
    registrationStatus: "NOT_REGISTERED",
    questionBankStatus: "NOT_STORED",
    publiclyPublishable: false,
  },
};

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-hi-pa-v6-localization");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(join(outputDirectory, "int-cp004-hi-pa-v6-localization-audit.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_HI_PA_V6_LOCALIZATION");
