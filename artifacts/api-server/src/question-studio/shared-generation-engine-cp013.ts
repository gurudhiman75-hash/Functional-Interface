import {
  generateQuestion as generatePreviousQuestion,
  isWor001QuestionStudioRequest,
  listQuestionStudioPackages as listPreviousPackages,
  type SharedQuestionStudioGenerationRequest,
} from "./shared-generation-engine.ts";
import {
  generateNumCp013QuestionStudioBatch,
  isNumCp013QuestionStudioRequest,
  listNumCp013QuestionStudioPackages,
} from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-013/question-studio-integration.ts";

export { isNumCp013QuestionStudioRequest, isWor001QuestionStudioRequest };
export type { SharedQuestionStudioGenerationRequest };

const AGGREGATE_RELEASE_ID = "NUM-002-QS-CP008-CP013-MULTILINGUAL-FROZEN-V1" as const;

export function listQuestionStudioPackages() {
  const packages = [...listPreviousPackages()] as any[];
  const cp013 = listNumCp013QuestionStudioPackages()[0]!;
  const index = packages.findIndex((entry) => String(entry.packageId) === "NUM-002");
  if (index < 0) throw new Error("NUM-002 shared Question Studio capability is missing before CP013 extension.");

  const existing = packages[index]!;
  const existingQlIds = Array.isArray(existing.permanentQlIds) ? existing.permanentQlIds.map(String) : [];
  const cp013QlIds = cp013.permanentQlIds.map(String);
  const mergedQlIds = Object.freeze([...existingQlIds, ...cp013QlIds]);
  if (new Set(mergedQlIds).size !== 82) {
    throw new Error(`NUM-002 CP013 aggregate expected 82 unique permanent QLs, received ${new Set(mergedQlIds).size}.`);
  }

  const existingReleaseIds = Array.isArray(existing.checkpointReleaseIds)
    ? existing.checkpointReleaseIds
    : [existing.releaseId].filter(Boolean);

  packages[index] = Object.freeze({
    ...existing,
    name: "NUM-002 Number System — Remainders, Cyclicity, Digit Structure, Factorial Valuations, Perfect Powers & Positional Bases",
    label: "Number System — Remainders, Cyclicity, Digit Structure, Factorial Valuations, Perfect Powers & Positional Bases",
    cpIds: Object.freeze([...(existing.cpIds ?? []), ...cp013.cpIds]),
    canonicalProblems: Object.freeze([...(existing.canonicalProblems ?? []), ...cp013.canonicalProblems]),
    permanentQlCount: 82,
    permanentQlIds: mergedQlIds,
    supportedDifficulties: Object.freeze(["Easy", "Medium", "Hard"]),
    supportedLanguages: Object.freeze(["en", "hi", "pa"]),
    releaseId: AGGREGATE_RELEASE_ID,
    checkpointReleaseIds: Object.freeze([...existingReleaseIds, cp013.releaseId]),
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  });

  return packages;
}

export async function generateQuestion(request: SharedQuestionStudioGenerationRequest = {}) {
  if (isNumCp013QuestionStudioRequest(request)) {
    return generateNumCp013QuestionStudioBatch(request);
  }
  return generatePreviousQuestion(request);
}
