import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { amount, sub } from "./cp003-exam-model";
import { generateIntCp003EnglishFrozenQuestion } from "./cp003-english-frozen-runtime";
import { moneyMath, rateMath, resolve } from "./cp003-exam-support";
import {
  INT_CP003_LOCALIZED_LOCALES,
  assertCp003LocalizedText,
  cp003OrdinalYearText,
  cp003YearsText,
} from "./cp003-localization-language-pack";
import {
  INT_CP003_PRESENTATION_WAVE2_QL_IDS,
  renderCp003LocalizedPresentationWave2,
} from "./cp003-localized-presentation-wave2";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function fail(message: string): never {
  throw new Error(message);
}

function requireVisible(markdown: string, expected: string, prefix: string, label: string): void {
  if (!markdown.includes(expected)) fail(`${prefix}: localized presentation omits ${label}.`);
}

function requireHidden(markdown: string, forbidden: string, prefix: string, label: string): void {
  if (markdown.includes(forbidden)) fail(`${prefix}: localized presentation reveals ${label}.`);
}

function assertGivenAndUnknownParity(
  qlId: typeof INT_CP003_PRESENTATION_WAVE2_QL_IDS[number],
  markdown: string,
  locale: typeof INT_CP003_LOCALIZED_LOCALES[number],
  state: ReturnType<typeof resolve>,
  prefix: string,
): void {
  const targetYear = cp003OrdinalYearText(locale, state.targetYear);
  const earlierOrdinal = cp003OrdinalYearText(locale, state.earlierYear);
  const laterOrdinal = cp003OrdinalYearText(locale, state.laterYear);
  const previousBalance = amount(state.principal, state.ratePercent, state.currentYear - 1);

  switch (qlId) {
    case "INT-QL-059":
      requireVisible(markdown, moneyMath(state.principal), prefix, "principal");
      requireVisible(markdown, rateMath(state.ratePercent), prefix, "annual rate");
      requireVisible(markdown, targetYear, prefix, "required year");
      requireHidden(markdown, moneyMath(state.nthYearInterest), prefix, "required-year interest");
      break;
    case "INT-QL-060":
      requireVisible(markdown, moneyMath(state.nthYearInterest), prefix, "given year interest");
      requireVisible(markdown, rateMath(state.ratePercent), prefix, "annual rate");
      requireVisible(markdown, targetYear, prefix, "observed year");
      requireHidden(markdown, moneyMath(state.principal), prefix, "principal");
      break;
    case "INT-QL-061":
      requireVisible(markdown, moneyMath(state.principal), prefix, "principal");
      requireVisible(markdown, moneyMath(state.nthYearInterest), prefix, "given year interest");
      requireVisible(markdown, targetYear, prefix, "observed year");
      requireHidden(markdown, rateMath(state.ratePercent), prefix, "annual rate");
      break;
    case "INT-QL-062":
      requireVisible(markdown, moneyMath(state.currentAmount), prefix, "current year-end balance");
      requireVisible(markdown, rateMath(state.ratePercent), prefix, "annual rate");
      requireVisible(markdown, String(state.currentYear), prefix, "current year");
      requireHidden(markdown, moneyMath(previousBalance), prefix, "previous year-end balance");
      break;
    case "INT-QL-063":
      requireVisible(markdown, moneyMath(previousBalance), prefix, "opening balance");
      requireVisible(markdown, moneyMath(state.currentAmount), prefix, "closing balance");
      requireHidden(markdown, rateMath(state.ratePercent), prefix, "annual rate");
      break;
    case "INT-QL-064":
      requireVisible(markdown, moneyMath(state.currentAmount), prefix, "earlier observed amount");
      requireVisible(markdown, moneyMath(state.nextAmount), prefix, "later observed amount");
      requireVisible(markdown, String(state.currentYear), prefix, "earlier observation year");
      requireVisible(markdown, String(state.currentYear + 1), prefix, "later observation year");
      requireHidden(markdown, moneyMath(state.principal), prefix, "original sum");
      break;
    case "INT-QL-065": {
      const difference = sub(state.laterAmount, state.earlierAmount);
      requireVisible(markdown, moneyMath(state.principal), prefix, "principal");
      requireVisible(markdown, rateMath(state.ratePercent), prefix, "annual rate");
      requireVisible(markdown, cp003YearsText(locale, state.earlierYear), prefix, "earlier duration");
      requireVisible(markdown, cp003YearsText(locale, state.laterYear), prefix, "later duration");
      requireHidden(markdown, moneyMath(difference), prefix, "difference between amounts");
      break;
    }
    case "INT-QL-066":
      requireVisible(markdown, moneyMath(state.earlierInterest), prefix, "earlier-year interest");
      requireVisible(markdown, rateMath(state.ratePercent), prefix, "annual rate");
      requireVisible(markdown, earlierOrdinal, prefix, "earlier year");
      requireVisible(markdown, laterOrdinal, prefix, "later year");
      requireHidden(markdown, moneyMath(state.laterInterest), prefix, "later-year interest");
      break;
  }
}

const FORBIDDEN_ENGLISH = /\b(?:Find|Principal|Amount|Rate|Time|Year|Years|Compound|Interest|Account|Balance|Original|Final|Opening|Closing)\b/u;
const FORBIDDEN_METHOD_HINTS = /(?:गुणक|अनुपात का उपयोग|पीछे की ओर|पहले दर निकाल|ਵਾਧਾ ਗੁਣਕ|ਅਨੁਪਾਤ ਵਰਤ|ਪਿੱਛੇ ਵੱਲ|ਪਹਿਲਾਂ ਦਰ ਕੱਢ)/u;

let questions = 0;
let deterministicChecks = 0;
let representationChecks = 0;
let stemFamilyChecks = 0;
let givenParityChecks = 0;
let unknownLeakageChecks = 0;
let scriptChecks = 0;
let noEnglishScaffoldingChecks = 0;
let noMethodHintChecks = 0;
let structuredShapeChecks = 0;
const questionsByLocale: Record<string, number> = {};
const questionsByQl: Record<string, number> = {};
const representationCounts: Record<string, number> = {};

for (const locale of INT_CP003_LOCALIZED_LOCALES) {
  questionsByLocale[locale] = 0;
  for (const qlId of INT_CP003_PRESENTATION_WAVE2_QL_IDS) {
    for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
      const seed = `int-cp003-localized-presentation-wave2:${qlId}:${seedIndex}`;
      const source = generateIntCp003EnglishFrozenQuestion(qlId, seed);
      const localized = renderCp003LocalizedPresentationWave2(source, locale);
      const replay = renderCp003LocalizedPresentationWave2(source, locale);
      const prefix = `${locale}/${qlId}/${seed}`;
      const state = resolve(source.mathematicalState);
      questions += 1;
      questionsByLocale[locale] += 1;
      questionsByQl[qlId] = (questionsByQl[qlId] ?? 0) + 1;
      representationCounts[localized.representation] = (representationCounts[localized.representation] ?? 0) + 1;

      deterministicChecks += 1;
      if (stable(localized) !== stable(replay)) fail(`${prefix}: localized presentation is not deterministic.`);

      representationChecks += 1;
      if (localized.representation !== source.presentation.representation) fail(`${prefix}: representation ownership changed.`);

      stemFamilyChecks += 1;
      if (localized.stemFamilyId !== source.presentation.stemFamilyId) fail(`${prefix}: stem-family ownership changed.`);

      assertGivenAndUnknownParity(qlId, localized.markdown, locale, state, prefix);
      givenParityChecks += 1;
      unknownLeakageChecks += 1;

      assertCp003LocalizedText(locale, localized.markdown, `${prefix}/markdown`);
      scriptChecks += 1;

      noEnglishScaffoldingChecks += 1;
      if (FORBIDDEN_ENGLISH.test(localized.markdown)) fail(`${prefix}: English learner-facing scaffolding reached localized presentation.`);

      noMethodHintChecks += 1;
      if (FORBIDDEN_METHOD_HINTS.test(localized.markdown)) fail(`${prefix}: localized presentation reveals a solving method.`);

      if (localized.representation === "STANDARD_PROSE") {
        if (localized.table || localized.leadText) fail(`${prefix}: prose presentation contains a structured table.`);
      } else {
        structuredShapeChecks += 1;
        if (!localized.table || localized.table.rows.length !== 1) fail(`${prefix}: structured presentation shape changed.`);
        if (localized.table.headers.length < 3 || localized.table.headers.length > 5) {
          fail(`${prefix}: structured presentation has an unsupported column count.`);
        }
        if (localized.table.rows[0]?.length !== localized.table.headers.length) {
          fail(`${prefix}: structured presentation row/header width differs.`);
        }
        if (!localized.markdown.includes("?")) fail(`${prefix}: structured presentation omits the unknown entry.`);
      }
    }
  }
}

if (questions !== 1600) fail(`Expected 1,600 localized presentations, received ${questions}.`);
if (Object.keys(representationCounts).length !== 6) fail(`Wave 2 representation coverage changed: ${Object.keys(representationCounts).length}/6.`);
for (const locale of INT_CP003_LOCALIZED_LOCALES) {
  if (questionsByLocale[locale] !== 800) fail(`${locale}: expected 800 presentations.`);
}
for (const qlId of INT_CP003_PRESENTATION_WAVE2_QL_IDS) {
  if (questionsByQl[qlId] !== 200) fail(`${qlId}: expected 200 bilingual presentations.`);
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp003-localized-presentation-wave2");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "PRESENTATION_WAVE2_READY",
  qlRange: "INT-QL-059..INT-QL-066",
  qlCount: INT_CP003_PRESENTATION_WAVE2_QL_IDS.length,
  locales: INT_CP003_LOCALIZED_LOCALES,
  questions,
  questionsByLocale,
  questionsByQl,
  representationCounts,
  representationCoverage: Object.keys(representationCounts).length,
  deterministicChecks,
  representationChecks,
  stemFamilyChecks,
  givenParityChecks,
  unknownLeakageChecks,
  scriptChecks,
  noEnglishScaffoldingChecks,
  noMethodHintChecks,
  structuredShapeChecks,
  parity: {
    mathematicalGivensPreserved: true,
    unknownValuesHidden: true,
    representationPreserved: true,
    stemFamilyPreserved: true,
    unknownOwnershipPreserved: true,
  },
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
  join(outputDirectory, "int-cp003-localized-presentation-wave2-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP003_LOCALIZED_PRESENTATION_WAVE2");
