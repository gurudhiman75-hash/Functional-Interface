import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  completeAmountForState,
  sub,
  type Cp004Frequency,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import { generateIntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  INT_CP004_LOCALIZED_LOCALES,
  assertCp004LocalizedText,
  cp004MonthsText,
  cp004YearsText,
} from "./cp004-localization-language-pack";
import {
  INT_CP004_PRESENTATION_WAVE1_QL_IDS,
  renderCp004LocalizedPresentationWave1,
} from "./cp004-localized-presentation-wave1";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

function fail(message: string): never {
  throw new Error(message);
}

function localizedDurationText(
  locale: IntCp004LocalizedLocale,
  periods: number,
  frequency: Cp004Frequency,
): string {
  const months = periods * (12 / frequency);
  return months % 12 === 0
    ? cp004YearsText(locale, months / 12)
    : cp004MonthsText(locale, months);
}

function assertRequiredFacts(
  locale: IntCp004LocalizedLocale,
  qlId: typeof INT_CP004_PRESENTATION_WAVE1_QL_IDS[number],
  stem: string,
  source: ReturnType<typeof generateIntCp004EnglishFrozenQuestion>,
): void {
  const state = source.mathematicalState;
  const amount = completeAmountForState(state);
  const compoundInterest = sub(amount, state.principal);
  const required: string[] = [];

  if (qlId !== "INT-QL-071") required.push(percentText(state.nominalAnnualRatePercent));
  if (qlId !== "INT-QL-069" && qlId !== "INT-QL-070") required.push(moneyText(state.principal));
  if (qlId === "INT-QL-069" || qlId === "INT-QL-071" || qlId === "INT-QL-072") required.push(moneyText(amount));
  if (qlId === "INT-QL-070") required.push(moneyText(compoundInterest));
  if (qlId !== "INT-QL-072") required.push(localizedDurationText(locale, state.periods, state.frequency));

  for (const fact of required) {
    if (!stem.includes(fact)) fail(`${qlId}/${source.seed}/${locale}: required fact '${fact}' is missing.`);
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
  for (const qlId of INT_CP004_PRESENTATION_WAVE1_QL_IDS) {
    for (let index = 0; index < 100; index += 1) {
      const seed = `int-cp004-localized-presentation-wave1:${qlId}:${index}`;
      const source = generateIntCp004EnglishFrozenQuestion(qlId, seed);
      const stem = renderCp004LocalizedPresentationWave1(source, locale);
      const replay = renderCp004LocalizedPresentationWave1(source, locale);
      cases += 1;
      qlCounts[`${locale}/${qlId}`] = (qlCounts[`${locale}/${qlId}`] ?? 0) + 1;

      deterministicChecks += 1;
      if (stem !== replay) fail(`${qlId}/${seed}/${locale}: localized presentation is not deterministic.`);

      scriptChecks += 1;
      assertCp004LocalizedText(locale, stem, `${qlId}/${seed}/${locale}/stem`);

      factChecks += 1;
      assertRequiredFacts(locale, qlId, stem, source);

      answerLeakChecks += 1;
      if (qlId === "INT-QL-072") {
        const hiddenDuration = localizedDurationText(locale, source.mathematicalState.periods, source.mathematicalState.frequency);
        if (stem.includes(hiddenDuration)) fail(`${qlId}/${seed}/${locale}: duration answer leaked into stem.`);
      } else if (stem.includes(source.correctAnswer)) {
        fail(`${qlId}/${seed}/${locale}: correct answer leaked into stem.`);
      }

      representationChecks += 1;
      const structured = source.representation !== "STANDARD_PROSE";
      if (structured !== /\|\s*---/u.test(stem)) {
        fail(`${qlId}/${seed}/${locale}: representation structure does not match frozen ownership.`);
      }
      representationByLocale[locale]!.add(source.representation);

      englishFallbackChecks += 1;
      if (/\b(?:find|amount|principal|rate|duration|interest|compounded|annually|quarterly|monthly|half-yearly)\b/iu.test(stem)) {
        fail(`${qlId}/${seed}/${locale}: English learner-facing fallback reached localized stem.`);
      }
    }
  }
}

if (cases !== 1200) fail(`Expected 1,200 bilingual Wave 1 cases, received ${cases}.`);
for (const [key, count] of Object.entries(qlCounts)) {
  if (count !== 100) fail(`${key}: expected 100 cases, received ${count}.`);
}
for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  if (representationByLocale[locale]!.size !== 4) {
    fail(`${locale}: representation coverage is ${representationByLocale[locale]!.size}/4.`);
  }
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-localized-presentation-wave1");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "CP004_LOCALIZED_PRESENTATION_WAVE1_READY",
  qlRange: "INT-QL-067..INT-QL-072",
  qlCount: INT_CP004_PRESENTATION_WAVE1_QL_IDS.length,
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
  join(outputDirectory, "int-cp004-localized-presentation-wave1-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_LOCALIZED_PRESENTATION_WAVE1");
