import assert from "node:assert/strict";
import { test } from "node:test";

import { generateDirControlledNovelGraphRelativePathCandidateV1 } from "../topics/Direction-Sense/DIR-001/dir-001-controlled-novelty-discovery-v1";

test("DIR-001 controlled novelty composes graph placement with a relative path under exact geometry", () => {
  const fingerprints = new Set<string>();
  const answerDirections = new Set<string>();
  const answerDistances = new Set<number>();

  for (let seed = 1; seed <= 48; seed += 1) {
    const candidate = generateDirControlledNovelGraphRelativePathCandidateV1(seed);

    assert.equal(candidate.provenance, "CONTROLLED_NOVEL");
    assert.deepEqual(candidate.parentQlIds, ["DIR-QL-004", "DIR-QL-041"]);
    assert.equal(candidate.solverAgreement, true);
    assert.equal(candidate.permanentQlAllocated, false);
    assert.equal(candidate.questionStudioNoveltyMixActivated, false);
    assert.equal(candidate.humanReviewRequired, true);
    assert.equal(candidate.falsePyqAttribution, false);
    assert.equal(candidate.options.length, 4);
    assert.equal(new Set(candidate.options).size, 4);
    assert.ok(candidate.correctIndex >= 0 && candidate.correctIndex < 4);
    assert.ok(candidate.noveltyAxes.includes("MULTI_STAGE_COMPOSITION"));
    assert.ok(candidate.noveltyAxes.includes("VALID_CROSS_FAMILY_COMPOSITION"));
    assert.ok(candidate.noveltyAxes.includes("REPRESENTATION_LOGIC"));
    assert.doesNotMatch(
      candidate.stem,
      /\b(?:PYQ|previous year|asked in|SSC 20\d\d|IBPS 20\d\d|prototype|authority|fingerprint|controlled novel)\b/iu,
    );

    const state = candidate.structuredState;
    assert.ok(Number.isInteger(state.answerDistance));
    assert.ok(state.answerDistance > 0);
    assert.match(candidate.answer, /metres?/iu);

    fingerprints.add(candidate.semanticFingerprint);
    answerDirections.add(state.answerDirection);
    answerDistances.add(state.answerDistance);
  }

  assert.ok(
    fingerprints.size >= 40,
    "DIR controlled-novel discovery should produce broad semantic-state diversity across 48 seeds.",
  );
  assert.ok(
    answerDirections.size >= 4,
    "DIR controlled-novel discovery should rotate through several answer directions.",
  );
  assert.ok(
    answerDistances.size >= 8,
    "DIR controlled-novel discovery should exercise several exact-distance states.",
  );
});
