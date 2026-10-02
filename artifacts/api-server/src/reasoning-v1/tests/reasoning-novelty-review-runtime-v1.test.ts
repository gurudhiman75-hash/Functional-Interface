import assert from "node:assert/strict";
import { test } from "node:test";

import { generateReasoningNoveltyReviewBatchV1 } from "../shared/reasoning-novelty-review-runtime-v1";

test("no content-approved providers remain in the awaiting-route diagnostic lane", async () => {
  await assert.rejects(
    () => generateReasoningNoveltyReviewBatchV1({
      providerId: "RNK-001-CROSS-FAMILY-CASELET",
      count: 1,
      seed: 100,
    }),
    /already an approved runtime/u,
  );
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
    "RNK-001-CROSS-FAMILY-CASELET",
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

