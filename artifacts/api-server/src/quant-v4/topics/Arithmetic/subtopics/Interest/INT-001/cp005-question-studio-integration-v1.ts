import type { IntCp005QlId } from "./cp005-variable-growth-decay-runtime";
import { INT_CP005_V16_1_QL_IDS } from "./cp005-variable-growth-decay-runtime-v16-1-final-v2";
import { generateIntCp005V16_1FrozenQuestion } from "./cp005-variable-growth-decay-v16-1-frozen";
import {
  createInterestFrozenQuestionStudioAdapter,
  type InterestQuestionStudioRequest,
} from "./interest-question-studio-frozen-adapter-v1";
import { retrofitInterestFrozenSourceExplanation } from "./interest-direct-calculation-explanation-policy-v1";

export const INT_CP005_QUESTION_STUDIO_INTEGRATION_VERSION = "INT-CP-005-QS-v1" as const;
export const INT_CP005_QUESTION_STUDIO_PACKAGE_ID = "INT-001" as const;
export const INT_CP005_QUESTION_STUDIO_CP_ID = "INT-CP-005" as const;
export const INT_CP005_QUESTION_STUDIO_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
export type IntCp005QuestionStudioLanguage = (typeof INT_CP005_QUESTION_STUDIO_LANGUAGES)[number];
export type IntCp005QuestionStudioRequest = InterestQuestionStudioRequest;

const adapter = createInterestFrozenQuestionStudioAdapter({
  integrationVersion: INT_CP005_QUESTION_STUDIO_INTEGRATION_VERSION,
  cpId: INT_CP005_QUESTION_STUDIO_CP_ID,
  cpNumber: "005",
  name: "INT-001 Interest — Variable Growth and Decay",
  qlIds: INT_CP005_V16_1_QL_IDS,
  languages: INT_CP005_QUESTION_STUDIO_LANGUAGES,
  generateSource: (qlId, seed, language) => retrofitInterestFrozenSourceExplanation(
    generateIntCp005V16_1FrozenQuestion(
      qlId as IntCp005QlId,
      seed,
      language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN",
    ),
    qlId,
    language,
  ),
});

export function listIntCp005QuestionStudioPackages() {
  return adapter.listPackages();
}

export async function generateIntCp005QuestionStudioBatch(request: IntCp005QuestionStudioRequest = {}) {
  return adapter.generateBatch(request);
}
