import {
  INT_CP006_QL_IDS,
  type IntCp006QlId,
} from "./cp006-si-ci-relations-runtime-v4-final";
import { generateIntCp006EnglishFrozenQuestion } from "./cp006-si-ci-relations-v1-frozen";
import { generateIntCp006LocalizedV7FrozenQuestion } from "./cp006-si-ci-relations-localized-v7-frozen";
import {
  createInterestFrozenQuestionStudioAdapter,
  type InterestQuestionStudioRequest,
} from "./interest-question-studio-frozen-adapter-v1";
import { retrofitInterestFrozenSourceExplanation } from "./interest-direct-calculation-explanation-policy-v1";

export const INT_CP006_QUESTION_STUDIO_INTEGRATION_VERSION = "INT-CP-006-QS-v1" as const;
export const INT_CP006_QUESTION_STUDIO_PACKAGE_ID = "INT-001" as const;
export const INT_CP006_QUESTION_STUDIO_CP_ID = "INT-CP-006" as const;
export const INT_CP006_QUESTION_STUDIO_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
export type IntCp006QuestionStudioLanguage = (typeof INT_CP006_QUESTION_STUDIO_LANGUAGES)[number];
export type IntCp006QuestionStudioRequest = InterestQuestionStudioRequest;

const adapter = createInterestFrozenQuestionStudioAdapter({
  integrationVersion: INT_CP006_QUESTION_STUDIO_INTEGRATION_VERSION,
  cpId: INT_CP006_QUESTION_STUDIO_CP_ID,
  cpNumber: "006",
  name: "INT-001 Interest — SI/CI Relations",
  qlIds: INT_CP006_QL_IDS,
  languages: INT_CP006_QUESTION_STUDIO_LANGUAGES,
  generateSource: (qlId, seed, language) => retrofitInterestFrozenSourceExplanation(
    language === "en"
      ? generateIntCp006EnglishFrozenQuestion(qlId as IntCp006QlId, seed)
      : generateIntCp006LocalizedV7FrozenQuestion(
          qlId as IntCp006QlId,
          seed,
          language === "hi" ? "hi-IN" : "pa-IN",
        ),
    qlId,
    language,
  ),
});

export function listIntCp006QuestionStudioPackages() {
  return adapter.listPackages();
}

export async function generateIntCp006QuestionStudioBatch(request: IntCp006QuestionStudioRequest = {}) {
  return adapter.generateBatch(request);
}
