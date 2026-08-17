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
  return applySapAuthoredPresentationV3(base, ql062FinalV10, language);
}
