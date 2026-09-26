import assert from "node:assert/strict";
import { test } from "node:test";

import { generateReasoningNoveltyReviewBatchV1 } from "../shared/reasoning-novelty-review-runtime-v1";

test("shared novelty review runtime samples every discovery provider without activating production mixing", async () => {
  const requests = [
    { providerId: "RNK-001-CROSS-FAMILY-CASELET", language: "en" as const },
    { providerId: "CLK-001-FAULTY-TIME-ANGLE", language: "en" as const },
    { providerId: "CAE-001-EDGE-FAMILIES", language: "pa" as const },
    { providerId: "DIR-001-GRAPH-RELATIVE-PATH", language: "en" as const },
    { providerId: "BLR-001-CODED-FILTERED-COUNT", language: "en" as const },
    { providerId: "CAL-001-IMPLICIT-RANGE-FREQUENCY", language: "en" as const },
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
    assert.equal(result.provider.status, "DISCOVERY_REVIEW_ONLY");
    assert.equal(result.candidates.length, 2);

    for (const candidate of result.candidates) {
      assert.equal(candidate.provenance, "CONTROLLED_NOVEL");
      assert.equal(candidate.humanReviewRequired, true);
      assert.equal(candidate.reviewOnly, true);
      assert.equal(candidate.questionStudioNoveltyMixActivated, false);
      assert.equal(candidate.noveltyReviewProviderId, request.providerId);
    }
  }
});

test("approved runtime providers are not routed through discovery review sampler", async () => {
  await assert.rejects(
    () => generateReasoningNoveltyReviewBatchV1({
      providerId: "PFC-001-CONTROLLED-NOVEL",
      count: 1,
      seed: 1,
    }),
    /already an approved runtime/u,
  );
});

test("review sampler rejects unsupported language rather than silently translating", async () => {
  await assert.rejects(
    () => generateReasoningNoveltyReviewBatchV1({
      providerId: "DIR-001-GRAPH-RELATIVE-PATH",
      language: "hi",
      count: 1,
      seed: 1,
    }),
    /does not yet support novelty review language/u,
  );
});
