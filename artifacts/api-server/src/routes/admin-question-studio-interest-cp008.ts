import {
  INT_CP008_QUESTION_STUDIO_CP_ID,
  INT_CP008_QUESTION_STUDIO_INTEGRATION_VERSION,
  INT_CP008_QUESTION_STUDIO_LANGUAGES,
  INT_CP008_QUESTION_STUDIO_PACKAGE_ID,
  generateIntCp008QuestionStudioBatch,
  listIntCp008QuestionStudioPackages,
} from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp008-question-studio-integration-v1";
import { INT_CP008_QL_IDS } from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp008-instalment-runtime-v1-final";
import { createInterestFrozenQuestionStudioRouter } from "./admin-question-studio-interest-frozen-review-factory";

export default createInterestFrozenQuestionStudioRouter({
  pathSegment: "cp008",
  runCodePrefix: "INT08",
  model: "quant-v4-int-cp008-frozen-multilingual",
  cpId: INT_CP008_QUESTION_STUDIO_CP_ID,
  packageId: INT_CP008_QUESTION_STUDIO_PACKAGE_ID,
  integrationVersion: INT_CP008_QUESTION_STUDIO_INTEGRATION_VERSION,
  languages: INT_CP008_QUESTION_STUDIO_LANGUAGES,
  qlIds: INT_CP008_QL_IDS,
  listPackages: listIntCp008QuestionStudioPackages,
  generateBatch: generateIntCp008QuestionStudioBatch,
});
