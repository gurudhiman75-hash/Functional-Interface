import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  completeAmountForState,
  effectiveAnnualRate,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import { generateIntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  INT_CP004_LOCALIZED_LOCALES,
  assertCp004LocalizedText,
  cp004FrequencyLabel,
  cp004PeriodsText,
  cp004YearsText,
} from "./cp004-localization-language-pack";
import {
  INT_CP004_PRESENTATION_WAVE2_QL_IDS,
  renderCp004LocalizedPresentationWave2,
} from "./cp004-localized-presentation-wave2";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

function fail(message: string): never {
  throw new Error(message);
}

function creditedTimesText(locale: IntCp004LocalizedLocale, frequency: 1 | 2 | 4 | 12): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "वर्ष में एक बार";
      case 2: return "वर्ष में दो बार";
      case 4: return "वर्ष में चार बार";
      case 12: return "हर माह";
    }
  }
  switch (frequency) {
    case 1: return "ਸਾਲ ਵਿੱਚ ਇੱਕ ਵਾਰ";
    case 2: return "ਸਾਲ ਵਿੱਚ ਦੋ ਵਾਰ";
    case 4: return "ਸਾਲ ਵਿੱਚ ਚਾਰ ਵਾਰ";
    case 12: return "ਹਰ ਮਹੀਨੇ";
  }
}

function requiredFacts(
  source: ReturnType<typeof generateIntCp004EnglishFrozenQuestion>,
  locale: IntCp004LocalizedLocale,
): readonly string[] {
  const state = source.mathematicalState;
  switch (source.qlId) {
    case "INT-QL-073":
    case "INT-QL-074":
      return [
        moneyText(state.principal),
        percentText(state.periodicRatePercent),
        cp004PeriodsText(locale, state.periods, state.frequency),
      ];
    case "INT-QL-075":
      return [
        moneyText(state.principal),
        percentText(state.nominalAnnualRatePercent),
        cp004YearsText(locale, state.years),
        cp004FrequencyLabel(locale, state.frequency),
        cp004FrequencyLabel(locale, state.comparisonFrequency),
      ];
    case "INT-QL-076":
      return [
        percentText(state.nominalAnnualRatePercent),
        creditedTimesText(locale, state.frequency),
      ];
    case "INT-QL-077":
      return [
        percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency)),
        creditedTimesText(locale, state.frequency),
      ];
    case "INT-QL-078":
      return [
        moneyText(state.principal),
        moneyText(completeAmountForState(state)),
        percentText(state.nominalAnnualRatePercent),
        cp004YearsText(locale, state.years),
        ...([1, 2, 4, 12] as const).map((frequency) => cp004FrequencyLabel(locale, frequency)),
      ];
    default:
      throw new Error(`${source.qlId}: unsupported Wave 2 fact audit.`);
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
  for (const qlId of INT_CP004_PRESENTATION_WAVE2_QL_IDS) {
    for (let index = 0; index < 100; index += 1) {
      const seed = `int-cp004-localized-presentation-wave2:${qlId}:${index}`;
      const source = generateIntCp004EnglishFrozenQuestion(qlId, seed);
      const stem = renderCp004LocalizedPresentationWave2(source, locale);
      const replay = renderCp004LocalizedPresentationWave2(source, locale);
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
      if (qlId !== "INT-QL-078" && stem.includes(source.correctAnswer)) {
        fail(`${qlId}/${seed}/${locale}: correct answer leaked into stem.`);
      }
      if (qlId === "INT-QL-077" && stem.includes(percentText(source.mathematicalState.nominalAnnualRatePercent))) {
        fail(`${qlId}/${seed}/${locale}: nominal-rate answer leaked into inverse stem.`);
      }
      if (qlId === "INT-QL-078" && !stem.includes("?")) {
        fail(`${qlId}/${seed}/${locale}: frequency-identification stem has no unknown prompt.`);
      }

      representationChecks += 1;
      const structured = source.representation !== "STANDARD_PROSE";
      if (structured !== /\|\s*---/u.test(stem)) {
        fail(`${qlId}/${seed}/${locale}: representation structure does not match frozen ownership.`);
      }
      representationByLocale[locale]!.add(source.representation);

      englishFallbackChecks += 1;
      if (/\b(?:find|amount|principal|rate|duration|interest|compounded|annually|quarterly|monthly|half-yearly|effective|schedule)\b/iu.test(stem)) {
        fail(`${qlId}/${seed}/${locale}: English learner-facing fallback reached localized stem.`);
      }
    }
  }
}

if (cases !== 1200) fail(`Expected 1,200 bilingual Wave 2 cases, received ${cases}.`);
for (const [key, count] of Object.entries(qlCounts)) {
  if (count !== 100) fail(`${key}: expected 100 cases, received ${count}.`);
}
for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  if (representationByLocale[locale]!.size !== 4) {
    fail(`${locale}: representation coverage is ${representationByLocale[locale]!.size}/4.`);
  }
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-localized-presentation-wave2");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "CP004_LOCALIZED_PRESENTATION_WAVE2_READY",
  qlRange: "INT-QL-073..INT-QL-078",
  qlCount: INT_CP004_PRESENTATION_WAVE2_QL_IDS.length,
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
  join(outputDirectory, "int-cp004-localized-presentation-wave2-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_LOCALIZED_PRESENTATION_WAVE2");
