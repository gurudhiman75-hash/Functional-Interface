import {
  generateQuestion as generatePreviousQuestion,
  isNumCp013QuestionStudioRequest,
  listQuestionStudioPackages as listPreviousPackages,
  type SharedQuestionStudioGenerationRequest,
} from "./shared-generation-engine-cp013.ts";
import {
  generateNumCp014QuestionStudioBatch,
  isNumCp014QuestionStudioRequest,
  listNumCp014QuestionStudioPackages,
} from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-014/question-studio-integration.ts";

export { isNumCp013QuestionStudioRequest, isNumCp014QuestionStudioRequest };
export type { SharedQuestionStudioGenerationRequest };

const AGGREGATE_RELEASE_ID = "NUM-002-QS-CP008-CP014-MULTILINGUAL-FROZEN-V1" as const;

export function listQuestionStudioPackages() {
  const packages = [...listPreviousPackages()] as any[];
  const cp014 = listNumCp014QuestionStudioPackages()[0]!;
  const index = packages.findIndex((entry) => String(entry.packageId) === "NUM-002");
  if (index < 0) throw new Error("NUM-002 shared Question Studio capability is missing before CP014 extension.");

  const existing = packages[index]!;
  const existingQlIds = Array.isArray(existing.permanentQlIds) ? existing.permanentQlIds.map(String) : [];
  const cp014QlIds = cp014.permanentQlIds.map(String);
  const mergedQlIds = Object.freeze([...existingQlIds, ...cp014QlIds]);
  if (new Set(mergedQlIds).size !== 88) {
    throw new Error(`NUM-002 CP014 aggregate expected 88 unique permanent QLs, received ${new Set(mergedQlIds).size}.`);
  }
  const existingReleaseIds = Array.isArray(existing.checkpointReleaseIds)
    ? existing.checkpointReleaseIds
    : [existing.releaseId].filter(Boolean);

  packages[index] = Object.freeze({
    ...existing,
    name: "NUM-002 Number System — Complete frozen Question Studio through Mixed Synthesis",
    label: "Number System — Complete frozen Question Studio through Mixed Synthesis",
    cpIds: Object.freeze([...(existing.cpIds ?? []), ...cp014.cpIds]),
    canonicalProblems: Object.freeze([...(existing.canonicalProblems ?? []), ...cp014.canonicalProblems]),
    permanentQlCount: 88,
    permanentQlIds: mergedQlIds,
    supportedDifficulties: Object.freeze(["Easy", "Medium", "Hard"]),
    supportedLanguages: Object.freeze(["en", "hi", "pa"]),
    releaseId: AGGREGATE_RELEASE_ID,
    checkpointReleaseIds: Object.freeze([...existingReleaseIds, cp014.releaseId]),
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  });
  return packages;
}

export async function generateQuestion(request: SharedQuestionStudioGenerationRequest = {}) {
  if (isNumCp014QuestionStudioRequest(request)) return generateNumCp014QuestionStudioBatch(request);
  return generatePreviousQuestion(request);
}
