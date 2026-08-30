import assert from "node:assert/strict";
import test from "node:test";

import {
  assertStaticGkRenderJobId,
  isActiveStaticGkRenderStatus,
  normalizeStaticGkRenderableVisualId,
  staticGkRenderArtifactFileName,
} from "../render-job-contract";

test("render job contract accepts only the two compiled pilot visuals", () => {
  assert.equal(normalizeStaticGkRenderableVisualId("tropic"), "SGK-VIS-IND-GEO-001");
  assert.equal(normalizeStaticGkRenderableVisualId("standard-meridian"), "SGK-VIS-IND-GEO-002");
  assert.throws(() => normalizeStaticGkRenderableVisualId("SGK-VIS-IND-GEO-003"), /Unsupported Static GK render visual/);
});

test("render job active states exclude human review and terminal states", () => {
  assert.equal(isActiveStaticGkRenderStatus("queued"), true);
  assert.equal(isActiveStaticGkRenderStatus("automated-qa"), true);
  assert.equal(isActiveStaticGkRenderStatus("review-ready"), false);
  assert.equal(isActiveStaticGkRenderStatus("approved"), false);
  assert.equal(isActiveStaticGkRenderStatus("failed"), false);
});

test("render job ids must be v4 UUIDs", () => {
  assert.equal(
    assertStaticGkRenderJobId("123e4567-e89b-42d3-a456-426614174000"),
    "123e4567-e89b-42d3-a456-426614174000",
  );
  assert.throws(() => assertStaticGkRenderJobId("../escape"), /Invalid Static GK render job id/);
});

test("artifact names are fixed by visual and artifact key", () => {
  assert.equal(
    staticGkRenderArtifactFileName("SGK-VIS-IND-GEO-001", "video"),
    "SGK-VIS-IND-GEO-001.narrated-master.mp4",
  );
  assert.equal(
    staticGkRenderArtifactFileName("SGK-VIS-IND-GEO-002", "approval-receipt"),
    "SGK-VIS-IND-GEO-002.approval-receipt.json",
  );
});
