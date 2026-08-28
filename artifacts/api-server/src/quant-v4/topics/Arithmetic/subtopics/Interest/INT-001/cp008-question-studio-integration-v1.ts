import {
  INT_CP008_QL_IDS,
  type IntCp008QlId,
} from "./cp008-instalment-runtime-v1-final";
import { generateIntCp008EnglishFrozenQuestion } from "./cp008-instalment-english-v6-frozen";
import { generateIntCp008LocalizedFrozenQuestion } from "./cp008-instalment-localized-v6-frozen";
import {
  createInterestFrozenQuestionStudioAdapter,
  type InterestQuestionStudioRequest,
} from "./interest-question-studio-frozen-adapter-v1";

export const INT_CP008_QUESTION_STUDIO_INTEGRATION_VERSION = "INT-CP-008-QS-v1" as const;
export const INT_CP008_QUESTION_STUDIO_PACKAGE_ID = "INT-001" as const;
export const INT_CP008_QUESTION_STUDIO_CP_ID = "INT-CP-008" as const;
export const INT_CP008_QUESTION_STUDIO_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
export type IntCp008QuestionStudioLanguage = (typeof INT_CP008_QUESTION_STUDIO_LANGUAGES)[number];
export type IntCp008QuestionStudioRequest = InterestQuestionStudioRequest;

const adapter = createInterestFrozenQuestionStudioAdapter({
  integrationVersion: INT_CP008_QUESTION_STUDIO_INTEGRATION_VERSION,
  cpId: INT_CP008_QUESTION_STUDIO_CP_ID,
  cpNumber: "008",
  name: "INT-001 Interest — Instalments and Recurring Cash Flows",
  qlIds: INT_CP008_QL_IDS,
  languages: INT_CP008_QUESTION_STUDIO_LANGUAGES,
  generateSource: (qlId, seed, language) => language === "en"
    ? generateIntCp008EnglishFrozenQuestion(qlId as IntCp008QlId, seed)
    : generateIntCp008LocalizedFrozenQuestion(
        qlId as IntCp008QlId,
        seed,
        language === "hi" ? "hi-IN" : "pa-IN",
      ),
});

export function listIntCp008QuestionStudioPackages() {
  return adapter.listPackages();
}

export async function generateIntCp008QuestionStudioBatch(request: IntCp008QuestionStudioRequest = {}) {
  return adapter.generateBatch(request);
}
