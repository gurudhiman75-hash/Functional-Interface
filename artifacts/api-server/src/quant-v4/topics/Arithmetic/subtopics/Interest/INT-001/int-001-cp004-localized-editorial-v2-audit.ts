import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import { generateIntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  INT_CP004_LOCALIZED_LOCALES,
  cp004FrequencyIntervalText,
  cp004PeriodsText,
} from "./cp004-localization-language-pack";
import { localizeCp004Explanation } from "./cp004-localized-explanations";
import { localizeCp004Options } from "./cp004-localized-options";
import { renderCp004EditorialStemV2 } from "./cp004-localized-editorial-v2";

function fail(message: string): never {
  throw new Error(message);
}

const BANNED_LANGUAGE = /(?:नाममात्र|ਨਾਮਮਾਤਰ|चक्रवृद्धि की आवृत्ति|ਚੱਕਰਵੱਧੀ ਦੀ ਆਵ੍ਰਿਤੀ|अवधि-संख्या|ਅਵਧੀ-ਗਿਣਤੀ|प्रति-अवधि|ਹਰ-ਅਵਧੀ|निवेश खाते का उपलब्ध विवरण|ਨਿਵੇਸ਼ ਖਾਤੇ ਦਾ ਉਪਲਬਧ ਵੇਰਵਾ|ब्याज योजना और अवधि का क्रम|ਵਿਆਜ ਯੋਜਨਾ ਅਤੇ ਮਿਆਦ ਦਾ ਕ੍ਰਮ)/u;
const BAD_HINDI_ORDINAL = /\b\d+(?:वीं|वाँ|वें)\s+(?:माह|महीना|वर्ष|अर्धवर्ष|तिमाही)/u;
const BAD_PUNJABI_ORDINAL = /\b\d+ਵੀਂ\s+(?:ਮਹੀਨਾ|ਸਾਲ|ਛਿਮਾਹੀ|ਤਿਮਾਹੀ)/u;
const ROUNDING_CHAIN = /(?:के बाद राशि|ਤੋਂ ਬਾਅਦ ਰਕਮ)\s*=\s*₹[\d,.]+\s*×/u;

let questionCases = 0;
let stemChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let bannedLanguageChecks = 0;
let grammarChecks = 0;
let explicitPeriodChecks = 0;
let inverseDerivationChecks = 0;
let optionTestingChecks = 0;
let conciseSolutionChecks = 0;
let roundingSafetyChecks = 0;
let representationChecks = 0;
const qlCounts: Record<string, number> = {};
const maximumStepsByQl: Record<string, number> = {};

for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  for (const qlId of INT_CP004_QL_IDS) {
    for (let index = 0; index < 100; index += 1) {
      const seed = `int-cp004-editorial-v2:${qlId}:${index}`;
      const source = generateIntCp004EnglishFrozenQuestion(qlId, seed);
      const stem = renderCp004EditorialStemV2(source, locale);
      const options = localizeCp004Options(source, locale);
      const explanation = localizeCp004Explanation(source, locale);
      const learnerText = [
        stem,
        ...options.flatMap((option) => [option.text, option.feedback]),
        explanation.whatAsked,
        ...explanation.steps,
        explanation.finalAnswer,
        explanation.commonMistake,
      ].join("\n");

      questionCases += 1;
      qlCounts[`${locale}/${qlId}`] = (qlCounts[`${locale}/${qlId}`] ?? 0) + 1;

      stemChecks += 1;
      if (!stem.trim()) fail(`${qlId}/${seed}/${locale}: stem is empty.`);
      representationChecks += 1;
      const structured = source.representation !== "STANDARD_PROSE";
      if (structured !== /\|\s*---/u.test(stem)) {
        fail(`${qlId}/${seed}/${locale}: representation structure changed.`);
      }

      optionChecks += options.length;
      if (options.length !== 4) fail(`${qlId}/${seed}/${locale}: expected four options.`);
      if (options.findIndex((option) => option.isCorrect) !== source.correctIndex) {
        fail(`${qlId}/${seed}/${locale}: correct option moved.`);
      }

      explanationChecks += 1;
      if (explanation.steps.length < 2) fail(`${qlId}/${seed}/${locale}: explanation is too short.`);
      maximumStepsByQl[`${locale}/${qlId}`] = Math.max(
        maximumStepsByQl[`${locale}/${qlId}`] ?? 0,
        explanation.steps.length,
      );

      conciseSolutionChecks += 1;
      if (explanation.steps.length > 6) {
        fail(`${qlId}/${seed}/${locale}: explanation has ${explanation.steps.length} steps; formula-first limit is 6.`);
      }

      bannedLanguageChecks += 1;
      if (BANNED_LANGUAGE.test(learnerText)) {
        fail(`${qlId}/${seed}/${locale}: banned translated or over-technical wording remains.`);
      }

      grammarChecks += 2;
      if (BAD_HINDI_ORDINAL.test(learnerText) || BAD_PUNJABI_ORDINAL.test(learnerText)) {
        fail(`${qlId}/${seed}/${locale}: mechanical numeric ordinal remains.`);
      }
      if (locale === "pa-IN" && /\b(?:1 ਪੂਰੇ ਸਾਲ|\d+ ਮਹੀਨਾ\b|\d+ ਤਿਮਾਹੀ\b|\d+ ਛਿਮਾਹੀ\b)/u.test(learnerText)) {
        fail(`${qlId}/${seed}/${locale}: Punjabi singular/plural agreement is incorrect.`);
      }

      roundingSafetyChecks += 1;
      if (ROUNDING_CHAIN.test(learnerText)) {
        fail(`${qlId}/${seed}/${locale}: rounded intermediate balance is reused in a visible multiplication.`);
      }

      if (qlId === "INT-QL-073" || qlId === "INT-QL-074") {
        explicitPeriodChecks += 3;
        const state = source.mathematicalState;
        const expectedInterval = cp004FrequencyIntervalText(locale, state.frequency);
        if (!stem.includes(expectedInterval)) {
          fail(`${qlId}/${seed}/${locale}: direct rate does not name its exact period unit.`);
        }
        if (!stem.includes(percentText(state.periodicRatePercent))) {
          fail(`${qlId}/${seed}/${locale}: direct period rate is missing.`);
        }
        if (!stem.includes(cp004PeriodsText(locale, state.periods, state.frequency))) {
          fail(`${qlId}/${seed}/${locale}: direct period count is missing.`);
        }
      }

      if (qlId === "INT-QL-069" || qlId === "INT-QL-070" || qlId === "INT-QL-081") {
        inverseDerivationChecks += 1;
        const preAnswerSteps = explanation.steps.slice(0, -1).join("\n");
        if (preAnswerSteps.includes(moneyText(source.mathematicalState.principal))) {
          fail(`${qlId}/${seed}/${locale}: unknown principal appears before the deriving step.`);
        }
      }

      if (qlId === "INT-QL-071" || qlId === "INT-QL-077" || qlId === "INT-QL-082") {
        optionTestingChecks += 1;
        const combinedSteps = explanation.steps.join("\n");
        const marker = locale === "hi-IN" ? "विकल्प" : "ਚੋਣ";
        if (!combinedSteps.includes(marker)) {
          fail(`${qlId}/${seed}/${locale}: answer rate is substituted without an explicit option check.`);
        }
      }
    }
  }
}

if (questionCases !== 3800) fail(`Expected 3,800 editorial cases, received ${questionCases}.`);
for (const [key, count] of Object.entries(qlCounts)) {
  if (count !== 100) fail(`${key}: expected 100 cases, received ${count}.`);
}
if (explicitPeriodChecks !== 1200) fail(`Expected 1,200 direct-period checks, received ${explicitPeriodChecks}.`);
if (inverseDerivationChecks !== 600) fail(`Expected 600 inverse-principal checks, received ${inverseDerivationChecks}.`);
if (optionTestingChecks !== 600) fail(`Expected 600 option-testing checks, received ${optionTestingChecks}.`);

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-localized-editorial-v2");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "CP004_LOCALIZED_EDITORIAL_V2_READY",
  qlRange: "INT-QL-067..INT-QL-085",
  qlCount: INT_CP004_QL_IDS.length,
  locales: INT_CP004_LOCALIZED_LOCALES,
  questionCases,
  stemChecks,
  optionChecks,
  explanationChecks,
  bannedLanguageChecks,
  grammarChecks,
  explicitPeriodChecks,
  inverseDerivationChecks,
  optionTestingChecks,
  conciseSolutionChecks,
  roundingSafetyChecks,
  representationChecks,
  maximumStepsByQl,
  rejectedTerms: [
    "नाममात्र",
    "ਨਾਮਮਾਤਰ",
    "mechanical numeric ordinals",
    "vague per-period wording",
    "translated template leads",
    "circular inverse derivations",
    "hidden option substitution",
    "rounded balance chains",
  ],
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
  join(outputDirectory, "int-cp004-localized-editorial-v2-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_LOCALIZED_EDITORIAL_V2");
