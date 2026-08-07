import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateIntCp003EnglishFrozenQuestion } from "./cp003-english-frozen-runtime";
import { moneyMath, rateMath, resolve } from "./cp003-exam-support";
import {
  INT_CP003_LOCALIZED_LOCALES,
  assertCp003LocalizedText,
  cp003YearsText,
} from "./cp003-localization-language-pack";
import {
  INT_CP003_PRESENTATION_WAVE1_QL_IDS,
  renderCp003LocalizedPresentationWave1,
} from "./cp003-localized-presentation-wave1";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function fail(message: string): never {
  throw new Error(message);
}

function requireVisible(markdown: string, expected: string, prefix: string, label: string): void {
  if (!markdown.includes(expected)) fail(`${prefix}: localized presentation omits ${label}.`);
}

function assertGivenParity(
  qlId: typeof INT_CP003_PRESENTATION_WAVE1_QL_IDS[number],
  markdown: string,
  locale: typeof INT_CP003_LOCALIZED_LOCALES[number],
  state: ReturnType<typeof resolve>,
  prefix: string,
): void {
  const years = cp003YearsText(locale, state.years);
  switch (qlId) {
    case "INT-QL-053":
    case "INT-QL-054":
      requireVisible(markdown, moneyMath(state.principal), prefix, "principal");
      requireVisible(markdown, rateMath(state.ratePercent), prefix, "annual rate");
      requireVisible(markdown, years, prefix, "duration");
      break;
    case "INT-QL-055":
      requireVisible(markdown, moneyMath(state.amount), prefix, "final amount");
      requireVisible(markdown, rateMath(state.ratePercent), prefix, "annual rate");
      requireVisible(markdown, years, prefix, "duration");
      break;
    case "INT-QL-056":
      requireVisible(markdown, moneyMath(state.compoundInterest), prefix, "compound interest");
      requireVisible(markdown, rateMath(state.ratePercent), prefix, "annual rate");
      requireVisible(markdown, years, prefix, "duration");
      break;
    case "INT-QL-057":
      requireVisible(markdown, moneyMath(state.principal), prefix, "original sum");
      requireVisible(markdown, moneyMath(state.amount), prefix, "final amount");
      requireVisible(markdown, years, prefix, "duration");
      break;
    case "INT-QL-058":
      requireVisible(markdown, moneyMath(state.principal), prefix, "original sum");
      requireVisible(markdown, moneyMath(state.amount), prefix, "final amount");
      requireVisible(markdown, rateMath(state.ratePercent), prefix, "annual rate");
      break;
  }
}

const FORBIDDEN_ENGLISH = /\b(?:Find|Principal|Amount|Rate|Time|Year|Years|Compound|Interest|Account|Balance|Original|Final)\b/u;
const FORBIDDEN_METHOD_HINTS = /(?:गुणक|अनुपात का उपयोग|पीछे की ओर|ਵਾਧਾ ਗੁਣਕ|ਅਨੁਪਾਤ ਵਰਤ|ਪਿੱਛੇ ਵੱਲ)/u;

let questions = 0;
let deterministicChecks = 0;
let representationChecks = 0;
let stemFamilyChecks = 0;
let givenParityChecks = 0;
let scriptChecks = 0;
let noEnglishScaffoldingChecks = 0;
let noMethodHintChecks = 0;
let structuredShapeChecks = 0;
const questionsByLocale: Record<string, number> = {};
const questionsByQl: Record<string, number> = {};
const representationCounts: Record<string, number> = {};

for (const locale of INT_CP003_LOCALIZED_LOCALES) {
  questionsByLocale[locale] = 0;
  for (const qlId of INT_CP003_PRESENTATION_WAVE1_QL_IDS) {
    for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
      const seed = `int-cp003-localized-presentation-wave1:${qlId}:${seedIndex}`;
      const source = generateIntCp003EnglishFrozenQuestion(qlId, seed);
      const localized = renderCp003LocalizedPresentationWave1(source, locale);
      const replay = renderCp003LocalizedPresentationWave1(source, locale);
      const prefix = `${locale}/${qlId}/${seed}`;
      const resolved = resolve(source.mathematicalState);
      questions += 1;
      questionsByLocale[locale] += 1;
      questionsByQl[qlId] = (questionsByQl[qlId] ?? 0) + 1;
      representationCounts[localized.representation] = (representationCounts[localized.representation] ?? 0) + 1;

      deterministicChecks += 1;
      if (stable(localized) !== stable(replay)) fail(`${prefix}: localized presentation is not deterministic.`);

      representationChecks += 1;
      if (localized.representation !== source.presentation.representation) {
        fail(`${prefix}: representation ownership changed.`);
      }

      stemFamilyChecks += 1;
      if (localized.stemFamilyId !== source.presentation.stemFamilyId) {
        fail(`${prefix}: stem-family ownership changed.`);
      }

      assertGivenParity(qlId, localized.markdown, locale, resolved, prefix);
      givenParityChecks += 1;

      assertCp003LocalizedText(locale, localized.markdown, `${prefix}/markdown`);
      scriptChecks += 1;

      noEnglishScaffoldingChecks += 1;
      if (FORBIDDEN_ENGLISH.test(localized.markdown)) {
        fail(`${prefix}: English learner-facing scaffolding reached localized presentation.`);
      }

      noMethodHintChecks += 1;
      if (FORBIDDEN_METHOD_HINTS.test(localized.markdown)) {
        fail(`${prefix}: localized presentation reveals a solving method.`);
      }

      if (localized.representation === "STANDARD_PROSE") {
        if (localized.table || localized.leadText) fail(`${prefix}: prose presentation contains a structured table.`);
      } else {
        structuredShapeChecks += 1;
        if (!localized.table || localized.table.headers.length !== 4 || localized.table.rows.length !== 1) {
          fail(`${prefix}: structured presentation shape changed.`);
        }
        if (!localized.markdown.includes("?")) fail(`${prefix}: structured presentation omits the unknown entry.`);
      }
    }
  }
}

if (questions !== 1200) fail(`Expected 1,200 localized presentations, received ${questions}.`);
if (Object.keys(representationCounts).length !== 6) {
  fail(`Wave 1 representation coverage changed: ${Object.keys(representationCounts).length}/6.`);
}
for (const locale of INT_CP003_LOCALIZED_LOCALES) {
  if (questionsByLocale[locale] !== 600) fail(`${locale}: expected 600 presentations.`);
}
for (const qlId of INT_CP003_PRESENTATION_WAVE1_QL_IDS) {
  if (questionsByQl[qlId] !== 200) fail(`${qlId}: expected 200 bilingual presentations.`);
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp003-localized-presentation-wave1");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "PRESENTATION_WAVE1_READY",
  qlRange: "INT-QL-053..INT-QL-058",
  qlCount: INT_CP003_PRESENTATION_WAVE1_QL_IDS.length,
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
  scriptChecks,
  noEnglishScaffoldingChecks,
  noMethodHintChecks,
  structuredShapeChecks,
  parity: {
    mathematicalGivensPreserved: true,
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
  join(outputDirectory, "int-cp003-localized-presentation-wave1-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP003_LOCALIZED_PRESENTATION_WAVE1");
