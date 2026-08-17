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
import {
  applySapAuthoredPresentationV2,
} from "./authored-presentation-v2";
import {
  applySapAuthoredStemV4,
} from "./authored-stem-v4";
import {
  applySapAuthoredPresentationV3,
} from "./authored-presentation-v3";
import type { SapTranslationLanguage } from "./types";

export { translateSapLearnerText, polishSapLocalizedTextV2 };

export function localizeSapQuestionPackage(base: any, language: SapTranslationLanguage) {
  const generic = applySapLocalizationPolishV5(
    localizeSapQuestionPackageV1(base, language),
    language,
  );
  const authoredV1 = applySapAuthoredPresentationV1(base, generic, language);
  const authoredV2 = applySapAuthoredPresentationV2(base, authoredV1, language);
  const authoredStemV4 = applySapAuthoredStemV4(base, authoredV2, language);
  return applySapAuthoredPresentationV3(base, authoredStemV4, language);
}
