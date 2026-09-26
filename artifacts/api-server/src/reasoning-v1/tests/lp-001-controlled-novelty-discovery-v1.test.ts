import assert from "node:assert/strict";
import { test } from "node:test";

import { generateLpControlledNovelPostSolutionSwapCandidateV1 } from "../topics/Logic-Puzzles/LP-001/lp-001-controlled-novelty-discovery-v1";

test("LP-001 controlled novelty solves the base stack before an answer-changing post-solution swap", () => {
  const fingerprints = new Set<string>();
  const swapPairs = new Set<string>();
  const attributes = new Set<string>();
  const answers = new Set<string>();

  for (let seed = 1; seed <= 18; seed += 1) {
    const candidate = generateLpControlledNovelPostSolutionSwapCandidateV1(seed);

    assert.equal(candidate.provenance, "CONTROLLED_NOVEL");
    assert.deepEqual(candidate.parentQlIds, ["LP-QL-042", "LP-QL-043"]);
    assert.equal(candidate.solverAgreement, true);
    assert.equal(candidate.structuredState.uniqueBaseSolutionCount, 1);
    assert.equal(candidate.permanentQlAllocated, false);
    assert.equal(candidate.nextAvailableQl, "LP-QL-048");
    assert.equal(candidate.questionStudioNoveltyMixActivated, false);
    assert.equal(candidate.humanReviewRequired, true);
    assert.equal(candidate.falsePyqAttribution, false);

    assert.equal(candidate.options.length, 4);
    assert.equal(new Set(candidate.options).size, 4);
    assert.ok(candidate.correctIndex >= 0 && candidate.correctIndex < 4);
    assert.equal(candidate.options[candidate.correctIndex], candidate.answer);
    assert.equal(candidate.answer, `Box ${candidate.structuredState.modifiedAnswer}`);
    assert.notEqual(
      candidate.structuredState.baseAnswer,
      candidate.structuredState.modifiedAnswer,
      "the explicit post-solution interchange must materially change the queried adjacency",
    );

    assert.ok(candidate.noveltyAxes.includes("MULTI_STAGE_COMPOSITION"));
    assert.ok(candidate.noveltyAxes.includes("CONSTRAINT_INTERACTION"));
    assert.ok(candidate.noveltyAxes.includes("REPRESENTATION_LOGIC"));

    assert.match(candidate.stem, /interchange their positions/iu);
    assert.match(candidate.stem, /immediately above/iu);
    assert.doesNotMatch(
      candidate.stem,
      /\b(?:PYQ|previous year|asked in|SSC 20\d\d|IBPS 20\d\d|prototype|authority|fingerprint|controlled novel)\b/iu,
    );

    fingerprints.add(candidate.semanticFingerprint);
    swapPairs.add([...candidate.structuredState.swap].sort().join("<->"));
    attributes.add(candidate.structuredState.targetAttribute);
    answers.add(candidate.answer);
  }

  assert.ok(
    fingerprints.size >= 15,
    "LP controlled-novel discovery should vary solved state, swap and query materially.",
  );
  assert.ok(
    swapPairs.size >= 4,
    "LP controlled-novel discovery should exercise several post-solution swap pairs.",
  );
  assert.ok(
    attributes.size >= 3,
    "LP controlled-novel discovery should query several attributes.",
  );
  assert.ok(
    answers.size >= 4,
    "LP controlled-novel discovery should produce several box answers.",
  );
});
