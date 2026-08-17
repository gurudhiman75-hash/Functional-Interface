import {
  localizeSapQuestionPackage as localizeSapQuestionPackageV1,
  translateSapLearnerText,
} from "./runtime-v1";
import {
  polishSapLocalizedTextV2,
} from "./polish-v2";
import {
  applySapLocalizationPolishV3,
} from "./polish-v3";
import type { SapTranslationLanguage } from "./types";

export { translateSapLearnerText, polishSapLocalizedTextV2 };

export function localizeSapQuestionPackage(base: any, language: SapTranslationLanguage) {
  return applySapLocalizationPolishV3(
    localizeSapQuestionPackageV1(base, language),
    language,
  );
}
