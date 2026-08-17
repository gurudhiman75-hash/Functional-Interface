import {
  localizeSapQuestionPackage as localizeSapQuestionPackageV1,
  translateSapLearnerText,
} from "./runtime-v1";
import {
  applySapLocalizationPolishV2,
  polishSapLocalizedTextV2,
} from "./polish-v2";
import type { SapTranslationLanguage } from "./types";

export { translateSapLearnerText, polishSapLocalizedTextV2 };

export function localizeSapQuestionPackage(base: any, language: SapTranslationLanguage) {
  return applySapLocalizationPolishV2(
    localizeSapQuestionPackageV1(base, language),
    language,
  );
}
