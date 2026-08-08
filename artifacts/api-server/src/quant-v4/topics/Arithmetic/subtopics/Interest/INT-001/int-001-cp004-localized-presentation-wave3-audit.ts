import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  brokenAmountForState,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import { generateIntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  INT_CP004_LOCALIZED_LOCALES,
  assertCp004LocalizedText,
  cp004FrequencyLabel,
  cp004MonthsText,
  cp004YearsText,
} from "./cp004-localization-language-pack";
import {
  INT_CP004_PRESENTATION_WAVE3_QL_IDS,
  renderCp004LocalizedPresentationWave3,
} from "./cp004-localized-presentation-wave3";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

function fail(message: string): never {
  throw new Error(message);
}

function completeYearsText(locale: IntCp004LocalizedLocale, years: number): string {
  return cp004YearsText(locale, years);
}

function requiredFacts(
  source: ReturnType<typeof generateIntCp004EnglishFrozenQuestion>,
  locale: IntCp004LocalizedLocale,
): readonly string[] {
  const state = source.mathematicalState;
  const amount = brokenAmountForState(state);
  switch (source.qlId) {
    case "INT-QL-079":
    case "INT-QL-080":
      return [
        moneyText(state.principal),
        percentText(state.nominalAnnualRatePercent),
        completeYearsText(locale, state.fullYears),
        cp004MonthsText(locale, state.tailMonths),
      ];
    case "INT-QL-081":
      return [
        moneyText(amount),
        percentText(state.nominalAnnualRatePercent),
        completeYearsText(locale, state.fullYears),
        cp004MonthsText(locale, state.tailMonths),
      ];
    case "INT-QL-082":
      return [
        moneyText(state.principal),
        moneyText(amount),
        completeYearsText(locale, state.fullYears),
        cp004MonthsText(locale, state.tailMonths),
      ];
    case "INT-QL-083":
      return [
        moneyText(state.principal),
        moneyText(amount),
        percentText(state.nominalAnnualRatePercent),
        cp004MonthsText(locale, state.tailMonths),
      ];
    case "INT-QL-084":
    case "INT-QL-085":
      return [
        moneyText(state.principal),
        percentText(state.nominalAnnualRatePercent),
        cp004YearsText(locale, state.firstYears),
        cp004FrequencyLabel(locale, state.firstFrequency),
        cp004YearsText(locale, state.secondYears),
        cp004FrequencyLabel(locale, state.secondFrequency),
      ];
    default:
      throw new Error(`${source.qlId}: unsupported Wave 3 fact audit.`);
  }
}

let cases = 0;
let deterministicChecks = 0;
let scriptChecks = 0;
let factChecks = 0;
let answerLeakChecks = 0;
let representationChecks = 0;
let englishFallbackChecks = 0;
const representationByLocale: Record<string, Set<string>> = {};
const qlCounts: Record<string, number> = {};

for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  representationByLocale[locale] = new Set<string>();
  for (const qlId of INT_CP004_PRESENTATION_WAVE3_QL_IDS) {
    for (let index = 0; index < 100; index += 1) {
      const seed = `int-cp004-localized-presentation-wave3:${qlId}:${index}`;
      const source = generateIntCp004EnglishFrozenQuestion(qlId, seed);
      const stem = renderCp004LocalizedPresentationWave3(source, locale);
      const replay = renderCp004LocalizedPresentationWave3(source, locale);
      cases += 1;
      qlCounts[`${locale}/${qlId}`] = (qlCounts[`${locale}/${qlId}`] ?? 0) + 1;

      deterministicChecks += 1;
      if (stem !== replay) fail(`${qlId}/${seed}/${locale}: localized presentation is not deterministic.`);

      scriptChecks += 1;
      assertCp004LocalizedText(locale, stem, `${qlId}/${seed}/${locale}/stem`);

      factChecks += 1;
      for (const fact of requiredFacts(source, locale)) {
        if (!stem.includes(fact)) fail(`${qlId}/${seed}/${locale}: required fact '${fact}' is missing.`);
      }

      answerLeakChecks += 1;
      if (stem.includes(source.correctAnswer)) {
        fail(`${qlId}/${seed}/${locale}: correct answer leaked into localized stem.`);
      }
      if (qlId === "INT-QL-082" && stem.includes(percentText(source.mathematicalState.nominalAnnualRatePercent))) {
        fail(`${qlId}/${seed}/${locale}: annual-rate answer leaked into inverse stem.`);
      }
      if (qlId === "INT-QL-083" && stem.includes(completeYearsText(locale, source.mathematicalState.fullYears))) {
        fail(`${qlId}/${seed}/${locale}: complete-year answer leaked into inverse stem.`);
      }

      representationChecks += 1;
      const structured = source.representation !== "STANDARD_PROSE";
      if (structured !== /\|\s*---/u.test(stem)) {
        fail(`${qlId}/${seed}/${locale}: representation structure does not match frozen ownership.`);
      }
      representationByLocale[locale]!.add(source.representation);

      englishFallbackChecks += 1;
      if (/\b(?:find|amount|principal|rate|duration|interest|compounded|annually|quarterly|monthly|half-yearly|simple|complete years|extra months|interval)\b/iu.test(stem)) {
        fail(`${qlId}/${seed}/${locale}: English learner-facing fallback reached localized stem.`);
      }
    }
  }
}

if (cases !== 1400) fail(`Expected 1,400 bilingual Wave 3 cases, received ${cases}.`);
for (const [key, count] of Object.entries(qlCounts)) {
  if (count !== 100) fail(`${key}: expected 100 cases, received ${count}.`);
}
for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  if (representationByLocale[locale]!.size !== 4) {
    fail(`${locale}: representation coverage is ${representationByLocale[locale]!.size}/4.`);
  }
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-localized-presentation-wave3");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "CP004_LOCALIZED_PRESENTATION_WAVE3_READY",
  qlRange: "INT-QL-079..INT-QL-085",
  qlCount: INT_CP004_PRESENTATION_WAVE3_QL_IDS.length,
  locales: INT_CP004_LOCALIZED_LOCALES,
  cases,
  deterministicChecks,
  scriptChecks,
  factChecks,
  answerLeakChecks,
  representationChecks,
  englishFallbackChecks,
  representationCoverage: Object.fromEntries(
    INT_CP004_LOCALIZED_LOCALES.map((locale) => [locale, representationByLocale[locale]!.size]),
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
};
writeFileSync(
  join(outputDirectory, "int-cp004-localized-presentation-wave3-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_LOCALIZED_PRESENTATION_WAVE3");
