import assert from "node:assert/strict";
import { test } from "node:test";

import { buildReasoningNoveltyReviewPackV1 } from "../shared/reasoning-novelty-review-pack-v1";

test("controlled novelty review pack renders all discovery providers as review-only markdown", async () => {
  const markdown = await buildReasoningNoveltyReviewPackV1({
    samplesPerProvider: 2,
    seed: 9000,
  });

  assert.match(markdown, /^# Reasoning V1 — Controlled Novelty Human Review Pack/mu);
  for (const chapterId of ["RNK-001", "CLK-001", "CAE-001", "DIR-001", "BLR-001"]) {
    assert.match(markdown, new RegExp("## " + chapterId + "\\b", "u"));
  }
  assert.match(markdown, /Production novelty mixing: \*\*disabled\*\*/u);
  assert.match(markdown, /\*\*Human review:\*\* ☐ Approve  ☐ Reject  ☐ Revise/u);
  assert.equal((markdown.match(/^### Sample /gmu) ?? []).length, 10);
  assert.equal((markdown.match(/^\*\*Human review:\*\*/gmu) ?? []).length, 10);
  assert.doesNotMatch(markdown, /automatic student publication/iu);
});
