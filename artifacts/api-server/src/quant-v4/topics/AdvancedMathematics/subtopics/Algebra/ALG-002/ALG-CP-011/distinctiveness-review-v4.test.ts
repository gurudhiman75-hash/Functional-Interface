import assert from "node:assert/strict";

import { ALG_CP011_DISCOVERY_CANDIDATES } from "./registry";
import {
  ALG_CP011_DISTINCTIVENESS_REVIEW_V4_POLICY,
  generateAlgCp011DistinctivenessReviewV4,
} from "./distinctiveness-review-v4";

const SAMPLES = 16;

function hashText(text: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d) >>> 0;
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x846ca68b) >>> 0;
  hash ^= hash >>> 16;
  return hash >>> 0;
}

function sourceStateSeed(candidateId: string, variantIndex: number, requestSeed: string): number {
  return hashText(`${requestSeed}|ALG-QL-032|${candidateId}|v${variantIndex}|source-state-v4`);
}

const expectedRelation = new Map(
  ALG_CP011_DISCOVERY_CANDIDATES.map((candidate) => [
    candidate.candidateId,
    candidate.solveMode === "compareAlwaysGreaterRootSets" || candidate.solveMode === "compareIrrationalConjugateRootSets"
      ? "X_GREATER_THAN_Y"
      : candidate.solveMode === "compareAlwaysLessRootSets"
        ? "X_LESS_THAN_Y"
        : candidate.solveMode === "compareGreaterOrEqualRootSets"
          ? "X_GREATER_THAN_OR_EQUAL_TO_Y"
          : candidate.solveMode === "compareLessOrEqualRootSets"
            ? "X_LESS_THAN_OR_EQUAL_TO_Y"
            : candidate.solveMode === "compareEqualRepeatedRoots"
              ? "X_EQUAL_TO_Y"
              : "RELATION_CANNOT_BE_ESTABLISHED",
  ]),
);

const metrics = [];

for (let variantIndex = 0; variantIndex < ALG_CP011_DISCOVERY_CANDIDATES.length; variantIndex += 1) {
  const candidate = ALG_CP011_DISCOVERY_CANDIDATES[variantIndex]!;
  const items = Array.from({ length: SAMPLES }, (_unused, index) => {
    const requestSeed = `algebra-distinctive-v2:${candidate.candidateId}:${index}`;
    const numericSeed = sourceStateSeed(candidate.candidateId, variantIndex, requestSeed);
    return generateAlgCp011DistinctivenessReviewV4(candidate.candidateId, numericSeed);
  });

  const stateCount = new Set(items.map((item) => `${item.stem}\n${item.answer}`)).size;
  const stemCount = new Set(items.map((item) => item.stem)).size;
  const frameCount = new Set(items.map((item) => item.frameId)).size;
  const explanationCount = new Set(items.map((item) => item.explanation)).size;

  assert.ok(stateCount >= 12, `${candidate.candidateId}: expected >=12/16 distinct states, got ${stateCount}`);
  assert.ok(stemCount >= 10, `${candidate.candidateId}: expected >=10/16 visible stems, got ${stemCount}`);
  assert.ok(frameCount >= 3, `${candidate.candidateId}: expected >=3 natural exam frames, got ${frameCount}`);
  assert.ok(explanationCount >= 12, `${candidate.candidateId}: expected >=12/16 explanation states, got ${explanationCount}`);
  assert.ok(items.every((item) => item.answer === expectedRelation.get(candidate.candidateId)), `${candidate.candidateId}: relation contract drifted`);
  assert.ok(items.every((item) => item.explanation.split("\n").length === 4), `${candidate.candidateId}: expected four simple explanation steps`);
  assert.ok(items.every((item) => item.questionBankWritable === false && item.testEligible === false && item.publiclyPublishable === false), `${candidate.candidateId}: downstream lifecycle opened`);

  metrics.push({
    candidateId: candidate.candidateId,
    solveMode: candidate.solveMode,
    stateCount,
    stemCount,
    frameCount,
    explanationCount,
  });
}

assert.equal(ALG_CP011_DISTINCTIVENESS_REVIEW_V4_POLICY.semanticContractReopened, false);
assert.equal(ALG_CP011_DISTINCTIVENESS_REVIEW_V4_POLICY.solverAuthorityReopened, false);
assert.equal(ALG_CP011_DISTINCTIVENESS_REVIEW_V4_POLICY.learnerEnglishFreezeReopened, true);
assert.equal(ALG_CP011_DISTINCTIVENESS_REVIEW_V4_POLICY.downstreamLocked, true);

console.log("ALG_CP011_DISTINCTIVENESS_REVIEW_V4", JSON.stringify({
  status: "PASS_REVIEW_ONLY",
  samplesPerPattern: SAMPLES,
  metrics,
  lifecycle: ALG_CP011_DISTINCTIVENESS_REVIEW_V4_POLICY,
}));
