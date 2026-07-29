import { localizeAlpDisplayValue } from "./localized-values";
import { ALP_001_QLS } from "./ql-registry";
import { generateAlp001Question } from "./runtime";
import type { AlpLocale } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function equal<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) throw new Error(`${message}: expected ${String(expected)}, received ${String(actual)}`);
}

const locales: readonly AlpLocale[] = ["hi-IN", "pa-IN"];
const scriptPattern: Record<AlpLocale, RegExp> = {
  "en-IN": /[A-Za-z]/,
  "hi-IN": /[\u0900-\u097F]/,
  "pa-IN": /[\u0A00-\u0A7F]/,
};
const bannedPunjabi = /ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ|ਸਦ੍ਰਿਸ਼ਤਾ/;
let generatedCount = 0;
let localizedValueChecks = 0;

for (const ql of ALP_001_QLS) {
  for (let seed = 0; seed < 30; seed += 1) {
    const english = generateAlp001Question(ql.qlId, seed, "en-IN");
    for (const locale of locales) {
      const localized = generateAlp001Question(ql.qlId, seed, locale);
      generatedCount += 1;
      const expectedAnswer = localizeAlpDisplayValue(ql.answerType, english.answer, locale);
      const expectedOptions = english.options.map((option) => ({
        ...option,
        value: localizeAlpDisplayValue(ql.answerType, option.value, locale),
      }));
      localizedValueChecks += expectedOptions.length + 1;
      equal(localized.answer, expectedAnswer, `${ql.qlId} seed ${seed} ${locale} localized answer parity`);
      equal(localized.correctIndex, english.correctIndex, `${ql.qlId} seed ${seed} ${locale} option-index parity`);
      equal(localized.difficulty, english.difficulty, `${ql.qlId} seed ${seed} ${locale} difficulty parity`);
      equal(localized.renderer, english.renderer, `${ql.qlId} seed ${seed} ${locale} renderer parity`);
      equal(JSON.stringify(localized.options), JSON.stringify(expectedOptions), `${ql.qlId} seed ${seed} ${locale} localized option parity`);
      assert(localized.options[localized.correctIndex]?.value === localized.answer, `${ql.qlId} seed ${seed} ${locale} localized correct option mismatch`);
      assert(scriptPattern[locale].test(localized.stem), `${ql.qlId} seed ${seed} ${locale} missing expected script`);
      assert(scriptPattern[locale].test(localized.explanation.ruleStatement), `${ql.qlId} seed ${seed} ${locale} explanation missing expected script`);
      assert(!/undefined|null|\{\{|\}\}|ALP_|WORD_TRANSFORM_|ALPHA_TRANSFORM_/.test(`${localized.stem} ${JSON.stringify(localized.explanation)}`), `${ql.qlId} seed ${seed} ${locale} unresolved/internal text`);
      assert(localized.explanation.conclusion.includes(localized.answer), `${ql.qlId} seed ${seed} ${locale} conclusion omits answer`);
      if (locale === "pa-IN") assert(!bannedPunjabi.test(`${localized.stem} ${JSON.stringify(localized.explanation)}`), `${ql.qlId} seed ${seed} uses rejected Punjabi terminology`);
    }
  }
}

console.log("ALP-001 CP-001 through CP-005 localized parity audit passed.", {
  qlCount: ALP_001_QLS.length,
  generatedCount,
  localizedValueChecks,
  locales,
});
