import assert from "node:assert/strict";
import test from "node:test";

import {
  buildFfmpegSilentMasterArgs,
  createVerticalVideoRenderPlan,
  frameFileName,
  frameTimeMs,
  sceneDurationMs,
} from "../renderers/vertical-video";
import type { StaticGkSceneCue, StaticGkSceneViewport } from "../scenes/types";

const viewport: StaticGkSceneViewport = {
  aspectRatio: "9:16",
  width: 1080,
  height: 1920,
  safeArea: { top: 170, right: 80, bottom: 230, left: 80 },
  projection: "geoMercator",
};

const cues: StaticGkSceneCue[] = [
  { id: "hook", startMs: 0, endMs: 3_000, layer: "base-map", action: "show", factIds: ["F1"] },
  { id: "quiz", startMs: 31_000, endMs: 35_000, layer: "quiz", action: "quiz", factIds: ["F2"] },
];

test("vertical render plan produces a canonical 35-second 30fps master", () => {
  const plan = createVerticalVideoRenderPlan(viewport, cues);
  assert.equal(sceneDurationMs(cues), 35_000);
  assert.equal(plan.durationMs, 35_000);
  assert.equal(plan.frameCount, 1_050);
  assert.equal(plan.fps, 30);
  assert.equal(frameTimeMs(plan, 0), 0);
  assert.equal(frameTimeMs(plan, plan.frameCount - 1), 34_966);
  assert.equal(frameFileName(plan.frameCount - 1), "frame-001049.svg");
});

test("vertical render plan rejects invalid FPS and malformed cue timing", () => {
  assert.throws(() => createVerticalVideoRenderPlan(viewport, cues, 0), /FPS/);
  assert.throws(
    () => sceneDurationMs([{ ...cues[0], id: "broken", startMs: 4_000, endMs: 4_000 }]),
    /Invalid scene cue timing/,
  );
});

test("ffmpeg arguments preserve 9:16 H.264 delivery settings and exact frame count", () => {
  const plan = createVerticalVideoRenderPlan(viewport, cues, 25);
  const args = buildFfmpegSilentMasterArgs(plan, "/tmp/frames/frame-%06d.svg", "/tmp/master.mp4");
  assert.ok(args.includes("25"));
  assert.ok(args.includes(String(plan.frameCount)));
  assert.ok(args.includes("libx264"));
  assert.ok(args.includes("yuv420p"));
  assert.equal(args.at(-1), "/tmp/master.mp4");
});
