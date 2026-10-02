import assert from "node:assert/strict";
import { test } from "node:test";

import { generateReasoningNoveltyReviewBatchV1 } from "../shared/reasoning-novelty-review-runtime-v1";
import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "../shared/reasoning-novelty-provider-registry-v1";

test("no controlled-novel provider remains in the awaiting-route diagnostic state", () => {
  assert.deepEqual(
    REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
      (provider) => provider.status === "CONTENT_REVIEW_APPROVED_AWAITING_ROUTE",
    ),
    [],
  );
});

test("all approved runtime providers are excluded from the diagnostic review sampler", async () => {
  for (const providerId of [
    "PFC-001-CONTROLLED-NOVEL",
    "RNK-001-CROSS-FAMILY-CASELET",
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
