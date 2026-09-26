import assert from "node:assert/strict";
import { test } from "node:test";

import { generateCalControlledNovelImplicitRangeFrequencyCandidateV1 } from "../topics/Calendar/CAL-001/cal-001-controlled-novelty-discovery-v1";

test("CAL-001 controlled novelty derives an implicit end date before counting a named weekday", () => {
  const fingerprints = new Set<string>();
  const spansAcrossMonth = new Set<boolean>();
  const answers = new Set<string>();

  for (let seed = 1; seed <= 72; seed += 1) {
    const candidate = generateCalControlledNovelImplicitRangeFrequencyCandidateV1(seed);

    assert.equal(candidate.provenance, "CONTROLLED_NOVEL");
    assert.deepEqual(candidate.parentQlIds, ["CAL-QL-005", "CAL-QL-035"]);
    assert.equal(candidate.solverAgreement, true);
    assert.equal(candidate.permanentQlAllocated, false);
    assert.equal(candidate.nextAvailableQl, "CAL-QL-037");
    assert.equal(candidate.questionStudioNoveltyMixActivated, false);
    assert.equal(candidate.humanReviewRequired, true);
    assert.equal(candidate.falsePyqAttribution, false);
    assert.equal(candidate.options.length, 4);
    assert.equal(new Set(candidate.options).size, 4);
    assert.ok(candidate.correctIndex >= 0 && candidate.correctIndex < 4);
    assert.equal(Number(candidate.answer), candidate.structuredState.count);
    assert.ok(candidate.structuredState.durationDays >= 16);
    assert.ok(candidate.structuredState.durationDays <= 45);
    assert.ok(candidate.noveltyAxes.includes("MULTI_STAGE_COMPOSITION"));
    assert.ok(candidate.noveltyAxes.includes("INFORMATION_DISTRIBUTION"));
    assert.ok(candidate.noveltyAxes.includes("VALID_CROSS_FAMILY_COMPOSITION"));

    assert.doesNotMatch(
      candidate.stem,
      /\b(?:PYQ|previous year|asked in|SSC 20\d\d|IBPS 20\d\d|prototype|authority|fingerprint|controlled novel)\b/iu,
    );

    const { startDate, endDate } = candidate.structuredState;
    spansAcrossMonth.add(
      startDate.year !== endDate.year || startDate.month !== endDate.month,
    );
    answers.add(candidate.answer);
    fingerprints.add(candidate.semanticFingerprint);
  }

  assert.ok(
    fingerprints.size >= 68,
    "Calendar controlled-novel discovery should vary the semantic calendar state broadly.",
  );
  assert.ok(
    spansAcrossMonth.has(true),
    "Calendar novelty samples should include month/year-boundary cases.",
  );
  assert.ok(
    answers.size >= 3,
    "Calendar novelty samples should produce several weekday-count answers.",
  );
});
