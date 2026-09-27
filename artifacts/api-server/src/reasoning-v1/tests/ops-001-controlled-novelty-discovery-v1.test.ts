import assert from "node:assert/strict";
import { test } from "node:test";

import { generateOpsControlledNovelInferThenFillCandidateV1 } from "../topics/Mathematical-Operations/OPS-001/ops-001-controlled-novelty-discovery-v1";

test("OPS-001 controlled novelty infers a hidden mapping before recovering a missing coded symbol", () => {
  const fingerprints = new Set<string>();
  const answers = new Set<string>();
  const omitted = new Set<string>();

  for (let seed = 1; seed <= 96; seed += 1) {
    const candidate = generateOpsControlledNovelInferThenFillCandidateV1(seed);

    assert.equal(candidate.provenance, "CONTROLLED_NOVEL");
    assert.deepEqual(candidate.parentQlIds, ["OPS-QL-008", "OPS-QL-028"]);
    assert.equal(candidate.solverAgreement, true);
    assert.equal(candidate.permanentQlAllocated, false);
    assert.equal(candidate.questionStudioNoveltyMixActivated, false);
    assert.equal(candidate.humanReviewRequired, true);
    assert.equal(candidate.falsePyqAttribution, false);

    assert.equal(candidate.evidence.length, 3);
    assert.equal(candidate.options.length, 4);
    assert.equal(new Set(candidate.options).size, 4);
    assert.ok(candidate.correctIndex >= 0 && candidate.correctIndex < 4);
    assert.equal(candidate.answer, candidate.structuredState.targetCorrectToken);
    assert.equal(candidate.structuredState.survivingTargetTokens.length, 1);
    assert.equal(
      candidate.structuredState.survivingTargetTokens[0],
      candidate.structuredState.targetCorrectToken,
    );
    assert.equal(
      candidate.structuredState.hiddenMappingFingerprint,
      candidate.structuredState.inferredMappingFingerprint,
    );

    assert.ok(candidate.noveltyAxes.includes("MULTI_STAGE_COMPOSITION"));
    assert.ok(candidate.noveltyAxes.includes("INFORMATION_DISTRIBUTION"));
    assert.ok(candidate.noveltyAxes.includes("QUERY_DIRECTION"));
    assert.ok(candidate.noveltyAxes.includes("VALID_CROSS_FAMILY_COMPOSITION"));

    assert.doesNotMatch(
      candidate.stem,
      /\b(?:PYQ|previous year|asked in|SSC 20\d\d|IBPS 20\d\d|prototype|authority|fingerprint|controlled novel)\b/iu,
    );

    fingerprints.add(candidate.semanticFingerprint);
    answers.add(candidate.answer);
    omitted.add(candidate.structuredState.omittedEvidenceToken);
  }

  assert.ok(
    fingerprints.size >= 90,
    "OPS controlled-novel discovery should vary mapping/evidence/query state broadly.",
  );
  assert.deepEqual([...answers].sort(), ["M", "N", "P", "Q"]);
  assert.deepEqual([...omitted].sort(), ["M", "N", "P", "Q"]);
});
