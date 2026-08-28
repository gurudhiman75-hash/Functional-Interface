import {
  INT_CP006_QUESTION_STUDIO_CP_ID,
  INT_CP006_QUESTION_STUDIO_INTEGRATION_VERSION,
  INT_CP006_QUESTION_STUDIO_LANGUAGES,
  INT_CP006_QUESTION_STUDIO_PACKAGE_ID,
  generateIntCp006QuestionStudioBatch,
  listIntCp006QuestionStudioPackages,
} from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp006-question-studio-integration-v1";
import { INT_CP006_QL_IDS } from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp006-si-ci-relations-runtime-v4-final";
import { createInterestFrozenQuestionStudioRouter } from "./admin-question-studio-interest-frozen-review-factory";

export default createInterestFrozenQuestionStudioRouter({
  pathSegment: "cp006",
  runCodePrefix: "INT06",
  model: "quant-v4-int-cp006-frozen-multilingual",
  cpId: INT_CP006_QUESTION_STUDIO_CP_ID,
  packageId: INT_CP006_QUESTION_STUDIO_PACKAGE_ID,
  integrationVersion: INT_CP006_QUESTION_STUDIO_INTEGRATION_VERSION,
  languages: INT_CP006_QUESTION_STUDIO_LANGUAGES,
  qlIds: INT_CP006_QL_IDS,
  listPackages: listIntCp006QuestionStudioPackages,
  generateBatch: generateIntCp006QuestionStudioBatch,
});
