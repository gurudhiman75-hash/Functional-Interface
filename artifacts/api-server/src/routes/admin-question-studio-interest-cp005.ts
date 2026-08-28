import {
  INT_CP005_QUESTION_STUDIO_CP_ID,
  INT_CP005_QUESTION_STUDIO_INTEGRATION_VERSION,
  INT_CP005_QUESTION_STUDIO_LANGUAGES,
  INT_CP005_QUESTION_STUDIO_PACKAGE_ID,
  generateIntCp005QuestionStudioBatch,
  listIntCp005QuestionStudioPackages,
} from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp005-question-studio-integration-v1";
import { INT_CP005_V16_1_QL_IDS } from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp005-variable-growth-decay-v16-1-frozen";
import { createInterestFrozenQuestionStudioRouter } from "./admin-question-studio-interest-frozen-review-factory";

export default createInterestFrozenQuestionStudioRouter({
  pathSegment: "cp005",
  runCodePrefix: "INT05",
  model: "quant-v4-int-cp005-frozen-multilingual",
  cpId: INT_CP005_QUESTION_STUDIO_CP_ID,
  packageId: INT_CP005_QUESTION_STUDIO_PACKAGE_ID,
  integrationVersion: INT_CP005_QUESTION_STUDIO_INTEGRATION_VERSION,
  languages: INT_CP005_QUESTION_STUDIO_LANGUAGES,
  qlIds: INT_CP005_V16_1_QL_IDS,
  listPackages: listIntCp005QuestionStudioPackages,
  generateBatch: generateIntCp005QuestionStudioBatch,
});
