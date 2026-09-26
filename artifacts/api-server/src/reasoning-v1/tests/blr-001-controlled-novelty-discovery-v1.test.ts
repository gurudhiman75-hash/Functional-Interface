import assert from "node:assert/strict";
import { test } from "node:test";

import { generateBlrControlledNovelCodedCountCandidateV1 } from "../topics/Blood-Relations/BLR-001/blr-001-controlled-novelty-discovery-v1";

test("BLR-001 controlled novelty decodes a family graph before a filtered grandchild count", () => {
  const fingerprints = new Set<string>();
  const answers = new Set<string>();
  const prompts = new Set<string>();

  for (let seed = 1; seed <= 48; seed += 1) {
    const candidate = generateBlrControlledNovelCodedCountCandidateV1(seed);

    assert.equal(candidate.provenance, "CONTROLLED_NOVEL");
    assert.deepEqual(candidate.parentQlIds, ["BLR-QL-013", "BLR-QL-026"]);
    assert.equal(candidate.solverAgreement, true);
    assert.equal(candidate.permanentQlAllocated, false);
    assert.equal(candidate.nextAvailableQl, "BLR-QL-036");
    assert.equal(candidate.questionStudioNoveltyMixActivated, false);
    assert.equal(candidate.humanReviewRequired, true);
    assert.equal(candidate.falsePyqAttribution, false);
    assert.equal(candidate.options.length, 4);
    assert.equal(new Set(candidate.options).size, 4);
    assert.ok(candidate.correctIndex >= 0 && candidate.correctIndex < 4);
    assert.equal(Number(candidate.answer), candidate.femaleGrandchildIds.length);
    assert.equal(candidate.decodedStatements.length, 5);
    assert.ok(candidate.noveltyAxes.includes("MULTI_STAGE_COMPOSITION"));
    assert.ok(candidate.noveltyAxes.includes("VALID_CROSS_FAMILY_COMPOSITION"));
    assert.ok(candidate.noveltyAxes.includes("QUERY_DIRECTION"));

    assert.doesNotMatch(
      candidate.sharedPrompt + " " + candidate.stem,
      /\b(?:PYQ|previous year|asked in|SSC 20\d\d|IBPS 20\d\d|prototype|authority|fingerprint|controlled novel)\b/iu,
    );

    fingerprints.add(candidate.semanticFingerprint);
    answers.add(candidate.answer);
    prompts.add(candidate.sharedPrompt);
  }

  assert.ok(
    fingerprints.size >= 36,
    "BLR controlled-novel discovery should vary family state/code state materially across 48 seeds.",
  );
  assert.ok(answers.has("1") && answers.has("2"));
  assert.ok(
    prompts.size >= 24,
    "BLR coded-count prompts should not collapse to a small cosmetic symbol set.",
  );
});
