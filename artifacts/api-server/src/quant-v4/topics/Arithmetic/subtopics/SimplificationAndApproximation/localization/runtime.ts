import {
  localizeSapQuestionPackage as localizeSapQuestionPackageV1,
  translateSapLearnerText,
} from "./runtime-v1";
import {
  polishSapLocalizedTextV2,
} from "./polish-v2";
import {
  applySapLocalizationPolishV6,
} from "./polish-v6";
import {
  applySapAuthoredPresentationV1,
} from "./authored-presentation-v1";
import {
  applySapAuthoredPresentationV2,
} from "./authored-presentation-v2";
import {
  applySapAuthoredStemV4,
} from "./authored-stem-v4";
import {
  applySapAuthoredFinalFixesV5,
} from "./authored-final-fixes-v5";
import {
  applySapAuthoredSeedVariantV6,
} from "./authored-seed-variant-v6";
import {
  applySapAuthoredLastVariantsV7,
} from "./authored-last-variants-v7";
import {
  applySapHumanReviewPolishV8,
} from "./human-review-polish-v8";
import {
  applySapHumanReviewFinalV9,
} from "./human-review-final-v9";
import {
  applySapQl062FinalV10,
} from "./ql062-final-v10";
import {
  applySapAuthoredPresentationV3,
} from "./authored-presentation-v3";
import type { SapTranslationLanguage } from "./types";

export { translateSapLearnerText, polishSapLocalizedTextV2 };


function localizeMissingDecimalExplanation(base: any, language: SapTranslationLanguage): string[] | undefined {
  if (base.questionLanguageId !== "SAP-QL-096") return;
  const lines = base.explanation?.lines;
  if (!Array.isArray(lines)) return;
  const source = lines.join("\n");
  const subtraction = /^Subtract (\S+) and (\S+) from (\S+)\.$/m.exec(source);
  const remainder = /^The remaining exact value is (\S+), which as a decimal is (\S+)\.$/m.exec(source);
  const conversion = /^Check: Convert (\S+) to (\S+)\.$/m.exec(source);
  const check = /^Check: (.+) exactly\.$/m.exec(source);
  if (!subtraction || !remainder || !conversion || !check) return;
  const [, fraction, percent, total] = subtraction;
  const [, exact, decimal] = remainder;
  const [, checkedDecimal, hundredths] = conversion;
  const equation = check[1];

  return language === "hi" ? [
    "ज्ञात पदों को सटीक रूप में लिखें, अज्ञात मान निकालें और उसे दशमलव में व्यक्त करें।",
    `${total} में से ${fraction} और ${percent} घटाएँ।`,
    `शेष का सटीक मान ${exact} है, जो दशमलव में ${decimal} है।`,
    `इसलिए उत्तर ${decimal} है।`,
    `जाँच: ${checkedDecimal} को ${hundredths} के रूप में लिखें।`,
    `जाँच: ${equation} ठीक बराबर है।`,
  ] : [
    "ਪਤਾ ਹੋਏ ਪਦਾਂ ਨੂੰ ਸਟੀਕ ਰੂਪ ਵਿੱਚ ਲਿਖੋ, ਅਣਜਾਣ ਮੁੱਲ ਕੱਢੋ ਅਤੇ ਉਸ ਨੂੰ ਦਸ਼ਮਲਵ ਵਿੱਚ ਲਿਖੋ।",
    `${total} ਵਿੱਚੋਂ ${fraction} ਅਤੇ ${percent} ਘਟਾਓ।`,
    `ਬਾਕੀ ਦਾ ਸਟੀਕ ਮੁੱਲ ${exact} ਹੈ, ਜੋ ਦਸ਼ਮਲਵ ਵਿੱਚ ${decimal} ਹੈ।`,
    `ਇਸ ਲਈ ਉੱਤਰ ${decimal} ਹੈ।`,
    `ਜਾਂਚ: ${checkedDecimal} ਨੂੰ ${hundredths} ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`,
    `ਜਾਂਚ: ${equation} ਬਿਲਕੁਲ ਸਹੀ ਹੈ।`,
  ];
}

export function localizeSapQuestionPackage(base: any, language: SapTranslationLanguage) {
  const genericIntermediate = applySapLocalizationPolishV6(
    localizeSapQuestionPackageV1(base, language),
    language,
  );
  const authoredV1 = applySapAuthoredPresentationV1(base, genericIntermediate, language);
  const authoredV2 = applySapAuthoredPresentationV2(base, authoredV1, language);
  const authoredStemV4 = applySapAuthoredStemV4(base, authoredV2, language);
  const authoredFinalV5 = applySapAuthoredFinalFixesV5(base, authoredStemV4, language);
  const authoredSeedV6 = applySapAuthoredSeedVariantV6(base, authoredFinalV5, language);
  const authoredLastV7 = applySapAuthoredLastVariantsV7(base, authoredSeedV6, language);
  const humanReviewedV8 = applySapHumanReviewPolishV8(base, authoredLastV7, language);
  const humanReviewedV9 = applySapHumanReviewFinalV9(base, humanReviewedV8, language);
  const ql062FinalV10 = applySapQl062FinalV10(base, humanReviewedV9, language);
  const authoredFinal = applySapAuthoredPresentationV3(base, ql062FinalV10, language);

  const explanation = localizeMissingDecimalExplanation(base, language);
  return Object.freeze({
    ...authoredFinal,
    ...(explanation ? { explanation: Object.freeze({ ...authoredFinal.explanation, lines: Object.freeze(explanation) }) } : {}),
    questionBankStatus: "WRITABLE" as const,
    questionBankWritable: true as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    publiclyPublishable: true as const,
    traceability: Object.freeze({
      ...(authoredFinal.traceability ?? {}),
      questionBankWritable: true,
      testEligible: true,
      publiclyPublishable: true,
    }),
  });
}
