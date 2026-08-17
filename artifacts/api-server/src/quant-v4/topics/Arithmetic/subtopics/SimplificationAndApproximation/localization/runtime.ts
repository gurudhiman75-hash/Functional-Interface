import {
  localizeSapQuestionPackage as localizeSapQuestionPackageV1,
  translateSapLearnerText,
} from "./runtime-v1";
import {
  polishSapLocalizedTextV2,
} from "./polish-v2";
import {
  applySapLocalizationPolishV5,
} from "./polish-v5";
import {
  applySapAuthoredPresentationV1,
} from "./authored-presentation-v1";
import type { SapTranslationLanguage } from "./types";

export { translateSapLearnerText, polishSapLocalizedTextV2 };

export function localizeSapQuestionPackage(base: any, language: SapTranslationLanguage) {
  const generic = applySapLocalizationPolishV5(
    localizeSapQuestionPackageV1(base, language),
    language,
  );
  return applySapAuthoredPresentationV1(base, generic, language);
}
