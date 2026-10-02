import assert from "node:assert/strict";
import { test } from "node:test";

import { buildReasoningNoveltyReviewPackV1 } from "../shared/reasoning-novelty-review-pack-v1";

test("controlled novelty diagnostic pack renders the five content-approved providers awaiting live routes", async () => {
  const markdown = await buildReasoningNoveltyReviewPackV1({
    samplesPerProvider: 2,
    seed: 9000,
  });

  assert.match(markdown, /^# Reasoning V1 — Controlled Novelty Human Review Pack/mu);
  for (const chapterId of ["ALP-001", "RNK-001", "CAE-001", "BLR-001", "CAL-001"]) {
    assert.match(markdown, new RegExp("## " + chapterId + "\\b", "u"));
  }
  for (const liveChapterId of ["OPS-001", "DIR-001", "CLK-001"]) {
    assert.doesNotMatch(markdown, new RegExp("## " + liveChapterId + "\\b", "u"));
  }
  assert.match(markdown, /Production novelty mixing: \*\*disabled\*\*/u);
  assert.match(markdown, /\*\*Human review:\*\* ☐ Approve  ☐ Reject  ☐ Revise/u);
  assert.equal((markdown.match(/^### Sample /gmu) ?? []).length, 10);
  assert.equal((markdown.match(/^\*\*Human review:\*\*/gmu) ?? []).length, 10);
  assert.doesNotMatch(markdown, /automatic student publication/iu);
});
