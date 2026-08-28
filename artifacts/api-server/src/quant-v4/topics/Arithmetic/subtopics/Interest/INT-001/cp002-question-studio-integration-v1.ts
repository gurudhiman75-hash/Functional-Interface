import {
  INT_CP002_FINAL_QL_IDS,
  type IntCp002FinalQlId,
} from "./cp002-final-registry";
import { generateIntCp002EnglishFrozenQuestion } from "./cp002-english-frozen-runtime";
import {
  createInterestFrozenQuestionStudioAdapter,
  type InterestQuestionStudioRequest,
} from "./interest-question-studio-frozen-adapter-v1";

export const INT_CP002_QUESTION_STUDIO_INTEGRATION_VERSION = "INT-CP-002-QS-v1" as const;
export const INT_CP002_QUESTION_STUDIO_PACKAGE_ID = "INT-001" as const;
export const INT_CP002_QUESTION_STUDIO_CP_ID = "INT-CP-002" as const;
export const INT_CP002_QUESTION_STUDIO_LANGUAGES = Object.freeze(["en"] as const);
export type IntCp002QuestionStudioLanguage = (typeof INT_CP002_QUESTION_STUDIO_LANGUAGES)[number];
export type IntCp002QuestionStudioRequest = InterestQuestionStudioRequest;

const adapter = createInterestFrozenQuestionStudioAdapter({
  integrationVersion: INT_CP002_QUESTION_STUDIO_INTEGRATION_VERSION,
  cpId: INT_CP002_QUESTION_STUDIO_CP_ID,
  cpNumber: "002",
  name: "INT-001 Interest — Simple-Interest Ledgers and Multi-Stage Applications",
  qlIds: INT_CP002_FINAL_QL_IDS,
  languages: INT_CP002_QUESTION_STUDIO_LANGUAGES,
  generateSource: (qlId, seed, language) => {
    if (language !== "en") throw new Error(`INT-CP-002 does not support language '${language}'.`);
    return generateIntCp002EnglishFrozenQuestion(qlId as IntCp002FinalQlId, seed);
  },
});

export function listIntCp002QuestionStudioPackages() {
  return adapter.listPackages();
}

export async function generateIntCp002QuestionStudioBatch(request: IntCp002QuestionStudioRequest = {}) {
  return adapter.generateBatch(request);
}
