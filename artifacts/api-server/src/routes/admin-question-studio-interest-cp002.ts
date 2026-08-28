import {
  INT_CP002_QUESTION_STUDIO_CP_ID,
  INT_CP002_QUESTION_STUDIO_INTEGRATION_VERSION,
  INT_CP002_QUESTION_STUDIO_LANGUAGES,
  INT_CP002_QUESTION_STUDIO_PACKAGE_ID,
  generateIntCp002QuestionStudioBatch,
  listIntCp002QuestionStudioPackages,
} from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp002-question-studio-integration-v1";
import { INT_CP002_FINAL_QL_IDS } from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp002-final-registry";
import { createInterestFrozenQuestionStudioRouter } from "./admin-question-studio-interest-frozen-review-factory";

export default createInterestFrozenQuestionStudioRouter({
  pathSegment: "cp002",
  runCodePrefix: "INT02",
  model: "quant-v4-int-cp002-frozen-english",
  cpId: INT_CP002_QUESTION_STUDIO_CP_ID,
  packageId: INT_CP002_QUESTION_STUDIO_PACKAGE_ID,
  integrationVersion: INT_CP002_QUESTION_STUDIO_INTEGRATION_VERSION,
  languages: INT_CP002_QUESTION_STUDIO_LANGUAGES,
  qlIds: INT_CP002_FINAL_QL_IDS,
  listPackages: listIntCp002QuestionStudioPackages,
  generateBatch: generateIntCp002QuestionStudioBatch,
});
