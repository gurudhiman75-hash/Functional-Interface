import assert from "node:assert/strict";
import { test } from "node:test";

import { generateReasoningNoveltyReviewBatchV1 } from "../shared/reasoning-novelty-review-runtime-v1";

test("diagnostic sampler remains available for content-approved providers awaiting a live route", async () => {
  const requests = [
    { providerId: "RNK-001-CROSS-FAMILY-CASELET", language: "en" as const },
  ];

  for (let index = 0; index < requests.length; index += 1) {
    const request = requests[index]!;
    const result = await generateReasoningNoveltyReviewBatchV1({
      ...request,
      count: 2,
      seed: 100 + index * 10,
    });

    assert.equal(result.reviewOnly, true);
    assert.equal(result.questionStudioNoveltyMixActivated, false);
    assert.equal(result.provider.status, "CONTENT_REVIEW_APPROVED_AWAITING_ROUTE");
    assert.equal(result.candidates.length, 2);

    for (const candidate of result.candidates) {
      assert.equal(candidate.provenance, "CONTROLLED_NOVEL");
      assert.equal(candidate.reviewOnly, true);
      assert.equal(candidate.questionStudioNoveltyMixActivated, false);
      assert.equal(candidate.noveltyReviewProviderId, request.providerId);
    }
  }
});

test("approved runtime providers are not routed through the diagnostic review sampler", async () => {
  for (const providerId of [
    "PFC-001-CONTROLLED-NOVEL",
    "ALP-001-TRANSFORMED-GAP",
    "CAL-001-IMPLICIT-RANGE-FREQUENCY",
    "CAE-001-EDGE-FAMILIES",
    "BLR-001-CODED-FILTERED-COUNT",
    "OPS-001-INFER-THEN-FILL",
    "CLK-001-FAULTY-TIME-ANGLE",
    "DIR-001-GRAPH-RELATIVE-PATH",
  ]) {
    await assert.rejects(
      () => generateReasoningNoveltyReviewBatchV1({
        providerId,
        count: 1,
        seed: 1,
      }),
      /already an approved runtime/u,
    );
  }
});

test("diagnostic sampler rejects unsupported language rather than silently translating", async () => {
  await assert.rejects(
    () => generateReasoningNoveltyReviewBatchV1({
      providerId: "RNK-001-CROSS-FAMILY-CASELET",
      language: "hi",
      count: 1,
      seed: 1,
    }),
    /does not yet support novelty review language/u,
  );
});
