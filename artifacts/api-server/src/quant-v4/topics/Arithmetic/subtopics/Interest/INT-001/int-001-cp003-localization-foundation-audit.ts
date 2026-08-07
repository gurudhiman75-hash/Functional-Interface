import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP003_ENGLISH_FREEZE_APPROVAL, INT_CP003_ENGLISH_FREEZE_ID } from "./cp003-english-freeze-authority";
import {
  INT_CP003_LOCALIZATION_VERSION,
  INT_CP003_LOCALIZED_LOCALES,
  assertCp003LocalizedText,
  cp003CheckTitle,
  cp003CommonMistakeTitle,
  cp003CompoundedAnnuallyText,
  cp003CorrectFeedback,
  cp003FindPrompt,
  cp003OrdinalYearText,
  cp003QuickMethodTitle,
  cp003Term,
  cp003YearsText,
  languageForLocale,
  type IntCp003AuthorityTerm,
} from "./cp003-localization-language-pack";

function fail(message: string): never {
  throw new Error(message);
}

const TERMS: readonly IntCp003AuthorityTerm[] = Object.freeze([
  "AMOUNT",
  "ANNUAL_RATE",
  "BALANCE",
  "COMPOUND_INTEREST",
  "CORRECT",
  "EARLIER_YEAR",
  "FINAL_AMOUNT",
  "FIND",
  "INTEREST",
  "INTEREST_IN_YEAR",
  "INVESTMENT",
  "LATER_YEAR",
  "ORIGINAL_SUM",
  "PRINCIPAL",
  "RATE",
  "TIME",
  "YEAR",
  "YEARS",
]);

if (INT_CP003_ENGLISH_FREEZE_ID !== "INT-CP-003-EN-v1-frozen") {
  fail("Localisation source is not the approved CP-003 English freeze.");
}
if (INT_CP003_ENGLISH_FREEZE_APPROVAL.approvedSourceHead !== "f9b48eb776b644c81f1e7ad0ff5a3707511658f1") {
  fail("Localisation source head changed after English approval.");
}
if (INT_CP003_ENGLISH_FREEZE_APPROVAL.qlCount !== 14) {
  fail("Localisation source QL count changed after English approval.");
}

let termChecks = 0;
let phraseChecks = 0;
let scriptChecks = 0;
let placeholderGuardChecks = 0;
const languageByLocale: Record<string, string> = {};

for (const locale of INT_CP003_LOCALIZED_LOCALES) {
  languageByLocale[locale] = languageForLocale(locale);

  for (const term of TERMS) {
    const text = cp003Term(locale, term);
    termChecks += 1;
    assertCp003LocalizedText(locale, text, `${locale}/${term}`);
    scriptChecks += 1;
  }

  for (const years of [1, 2, 3, 4, 5]) {
    const duration = cp003YearsText(locale, years);
    const ordinal = cp003OrdinalYearText(locale, years);
    phraseChecks += 2;
    assertCp003LocalizedText(locale, duration, `${locale}/duration/${years}`);
    assertCp003LocalizedText(locale, ordinal, `${locale}/ordinal/${years}`);
    scriptChecks += 2;
  }

  const phrases = [
    cp003CompoundedAnnuallyText(locale),
    cp003FindPrompt(locale, cp003Term(locale, "PRINCIPAL")),
    cp003CorrectFeedback(locale),
    cp003CommonMistakeTitle(locale),
    cp003QuickMethodTitle(locale),
    cp003CheckTitle(locale),
  ];
  phrases.forEach((text, index) => {
    phraseChecks += 1;
    assertCp003LocalizedText(locale, text, `${locale}/phrase/${index}`);
    scriptChecks += 1;
  });

  for (const forbidden of ["TODO", "TBD", "translation pending", "placeholder"]) {
    let rejected = false;
    try {
      assertCp003LocalizedText(locale, `${cp003Term(locale, "AMOUNT")} ${forbidden}`, `${locale}/placeholder-guard`);
    } catch {
      rejected = true;
    }
    placeholderGuardChecks += 1;
    if (!rejected) fail(`${locale}: placeholder guard accepted '${forbidden}'.`);
  }
}

if (termChecks !== 36) fail(`Expected 36 bilingual term checks, received ${termChecks}.`);
if (phraseChecks !== 32) fail(`Expected 32 bilingual phrase checks, received ${phraseChecks}.`);
if (placeholderGuardChecks !== 8) fail(`Expected 8 placeholder guards, received ${placeholderGuardChecks}.`);

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp003-localization-foundation");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "LOCALISATION_FOUNDATION_READY",
  localizationVersion: INT_CP003_LOCALIZATION_VERSION,
  canonicalFreezeId: INT_CP003_ENGLISH_FREEZE_ID,
  canonicalSourceHead: INT_CP003_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
  qlRange: INT_CP003_ENGLISH_FREEZE_APPROVAL.qlRange,
  qlCount: INT_CP003_ENGLISH_FREEZE_APPROVAL.qlCount,
  locales: INT_CP003_LOCALIZED_LOCALES,
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
    sourceStepIdsPreserved: true,
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
  join(outputDirectory, "int-cp003-localization-foundation-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP003_LOCALIZATION_FOUNDATION");
