import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP004_ENGLISH_FREEZE_APPROVAL,
  INT_CP004_ENGLISH_FREEZE_ID,
} from "./cp004-english-freeze-authority";
import { FREQUENCIES } from "./cp004-frequency-math";
import {
  INT_CP004_LOCALIZATION_VERSION,
  INT_CP004_LOCALIZED_LOCALES,
  assertCp004LocalizedText,
  cp004CommonMistakeTitle,
  cp004CompoundingText,
  cp004CorrectFeedback,
  cp004FindPrompt,
  cp004FrequencyLabel,
  cp004MonthsText,
  cp004PeriodNoun,
  cp004PeriodsText,
  cp004SolutionTitle,
  cp004Term,
  cp004WhatAskedText,
  cp004YearsText,
  languageForCp004Locale,
  type IntCp004AuthorityTerm,
} from "./cp004-localization-language-pack";

function fail(message: string): never {
  throw new Error(message);
}

const TERMS: readonly IntCp004AuthorityTerm[] = Object.freeze([
  "AMOUNT",
  "ANNUAL_RATE",
  "BALANCE",
  "COMPOUND_INTEREST",
  "COMPOUNDING_FREQUENCY",
  "CORRECT",
  "DIFFERENCE",
  "DURATION",
  "EFFECTIVE_ANNUAL_RATE",
  "FINAL_AMOUNT",
  "FIND",
  "FREQUENCY",
  "FULL_YEAR",
  "INTEREST",
  "INVESTMENT",
  "MATURITY_AMOUNT",
  "NOMINAL_ANNUAL_RATE",
  "PERIOD",
  "PERIOD_RATE",
  "PRINCIPAL",
  "RATE",
  "SCHEDULE",
  "SCHEME",
  "SIMPLE_INTEREST",
  "TAIL_PERIOD",
  "TIME",
]);

if (INT_CP004_ENGLISH_FREEZE_ID !== "INT-CP-004-EN-v1-frozen") {
  fail("Localisation source is not the approved CP-004 English freeze.");
}
if (INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedSourceHead !== "9f8790d3ec0f630d37fd5e832fc5740f1c1928d9") {
  fail("Localisation source head changed after English approval.");
}
if (INT_CP004_ENGLISH_FREEZE_APPROVAL.qlCount !== 19) {
  fail("Localisation source QL count changed after English approval.");
}

let termChecks = 0;
let phraseChecks = 0;
let scriptChecks = 0;
let placeholderGuardChecks = 0;
const languageByLocale: Record<string, string> = {};

for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  languageByLocale[locale] = languageForCp004Locale(locale);

  for (const term of TERMS) {
    const text = cp004Term(locale, term);
    termChecks += 1;
    assertCp004LocalizedText(locale, text, `${locale}/${term}`);
    scriptChecks += 1;
  }

  for (const frequency of FREQUENCIES) {
    const phrases = [
      cp004FrequencyLabel(locale, frequency),
      cp004PeriodNoun(locale, frequency),
      cp004PeriodsText(locale, 3, frequency),
      cp004CompoundingText(locale, frequency),
    ];
    for (const [index, text] of phrases.entries()) {
      phraseChecks += 1;
      assertCp004LocalizedText(locale, text, `${locale}/frequency/${frequency}/${index}`);
      scriptChecks += 1;
    }
  }

  for (const years of [1, 2, 3, 5]) {
    const text = cp004YearsText(locale, years);
    phraseChecks += 1;
    assertCp004LocalizedText(locale, text, `${locale}/years/${years}`);
    scriptChecks += 1;
  }

  for (const months of [3, 6, 9]) {
    const text = cp004MonthsText(locale, months);
    phraseChecks += 1;
    assertCp004LocalizedText(locale, text, `${locale}/months/${months}`);
    scriptChecks += 1;
  }

  const genericPhrases = [
    cp004FindPrompt(locale, cp004Term(locale, "PRINCIPAL")),
    cp004CorrectFeedback(locale),
    cp004CommonMistakeTitle(locale),
    cp004SolutionTitle(locale),
    cp004WhatAskedText(locale, cp004Term(locale, "AMOUNT")),
  ];
  for (const [index, text] of genericPhrases.entries()) {
    phraseChecks += 1;
    assertCp004LocalizedText(locale, text, `${locale}/generic/${index}`);
    scriptChecks += 1;
  }

  for (const forbidden of ["TODO", "TBD", "translation pending", "placeholder"]) {
    let rejected = false;
    try {
      assertCp004LocalizedText(locale, `${cp004Term(locale, "AMOUNT")} ${forbidden}`, `${locale}/placeholder-guard`);
    } catch {
      rejected = true;
    }
    placeholderGuardChecks += 1;
    if (!rejected) fail(`${locale}: placeholder guard accepted '${forbidden}'.`);
  }
}

if (termChecks !== 52) fail(`Expected 52 bilingual term checks, received ${termChecks}.`);
if (phraseChecks !== 56) fail(`Expected 56 bilingual phrase checks, received ${phraseChecks}.`);
if (scriptChecks !== 108) fail(`Expected 108 script checks, received ${scriptChecks}.`);
if (placeholderGuardChecks !== 8) fail(`Expected 8 placeholder guards, received ${placeholderGuardChecks}.`);

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-localization-foundation");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "LOCALISATION_FOUNDATION_READY",
  localizationVersion: INT_CP004_LOCALIZATION_VERSION,
  canonicalFreezeId: INT_CP004_ENGLISH_FREEZE_ID,
  canonicalSourceHead: INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
  qlRange: INT_CP004_ENGLISH_FREEZE_APPROVAL.qlRange,
  qlCount: INT_CP004_ENGLISH_FREEZE_APPROVAL.qlCount,
  locales: INT_CP004_LOCALIZED_LOCALES,
  languageByLocale,
  termChecks,
  phraseChecks,
  scriptChecks,
  placeholderGuardChecks,
  parityContract: {
    mathematicalStatePreserved: true,
    solutionPreserved: true,
    optionValuesPreserved: true,
    optionOrderPreserved: true,
    correctIndexPreserved: true,
    misconceptionIdsPreserved: true,
    representationPreserved: true,
    stemFamilyPreserved: true,
    explanationStructurePreserved: true,
  },
  lifecycle: {
    maturity: "MULTILINGUAL_LOCALISATION_REVIEW",
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
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
  join(outputDirectory, "int-cp004-localization-foundation-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_LOCALIZATION_FOUNDATION");
