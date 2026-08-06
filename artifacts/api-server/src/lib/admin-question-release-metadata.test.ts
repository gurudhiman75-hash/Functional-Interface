import assert from "node:assert/strict";
import { normalizeGeneratedQuestionPayload } from "./admin-question-conversion";

const normalized = normalizeGeneratedQuestionPayload(
  {
    stem: "Find the next group.\nABcD, BcDA, ?",
    explanation: "The lowercase marker moves one position.",
    difficulty: "Medium",
    options: ["cDAB", "CdAB", "CDaB", "CDAb"],
    correctIndex: 2,
    releasePoolId: "UNIFORM_FRAME_CASE_MARKER_ROTATION:1",
    releaseStatus: "PRIMARY",
    authorityId: "POSITION_PERMUTATION_CLUSTER",
    taskKind: "NEXT_TERM",
    explanationMode: "CONCISE_ONLY",
    examSuitability: ["SSC_CGL", "BANK_PRELIMS"],
    renderingContract: {
      kind: "CASE_MARKER",
      preserveCase: true,
      monospace: true,
      emphasizeLowercase: "BOX_AND_UNDERLINE",
    },
  },
  {
    itemId: "00000000-0000-0000-0000-000000000001",
    generationRunCode: "GEN-TEST",
  },
);

const answerModel = normalized.answerModel as {
  generation?: Record<string, unknown>;
};
const generation = answerModel.generation ?? {};
assert.equal(generation.releasePoolId, "UNIFORM_FRAME_CASE_MARKER_ROTATION:1");
assert.equal(generation.releaseStatus, "PRIMARY");
assert.equal(generation.authorityId, "POSITION_PERMUTATION_CLUSTER");
assert.equal(generation.taskKind, "NEXT_TERM");
assert.equal(generation.explanationMode, "CONCISE_ONLY");
assert.deepEqual(generation.examSuitability, ["SSC_CGL", "BANK_PRELIMS"]);
assert.deepEqual(generation.renderingContract, {
  kind: "CASE_MARKER",
  preserveCase: true,
  monospace: true,
  emphasizeLowercase: "BOX_AND_UNDERLINE",
});

console.log(
  JSON.stringify(
    {
      status: "PASS_QUESTION_BANK_RELEASE_METADATA_PRESERVATION",
      releasePoolId: generation.releasePoolId,
      releaseStatus: generation.releaseStatus,
      renderingContract: generation.renderingContract,
    },
    null,
    2,
  ),
);
