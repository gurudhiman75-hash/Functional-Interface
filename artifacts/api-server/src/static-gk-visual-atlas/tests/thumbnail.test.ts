import assert from "node:assert/strict";
import test from "node:test";

import { TROPIC_OF_CANCER_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-001.manifest";
import { STANDARD_MERIDIAN_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-002.manifest";
import { buildFfmpegThumbnailArgs, selectStaticGkThumbnailTimeMs } from "../renderers/thumbnail";

test("thumbnail selection uses the midpoint of the first concept shot", () => {
  assert.equal(selectStaticGkThumbnailTimeMs(TROPIC_OF_CANCER_LESSON_MANIFEST), 8_000);
  assert.equal(selectStaticGkThumbnailTimeMs(STANDARD_MERIDIAN_LESSON_MANIFEST), 8_000);
});

test("thumbnail command extracts one canonical 1080x1920 frame", () => {
  const args = buildFfmpegThumbnailArgs("/tmp/master.mp4", 8_000, "/tmp/thumb.png");
  assert.ok(args.includes("8.000"));
  assert.ok(args.includes("1"));
  assert.ok(args.includes("scale=1080:1920:flags=lanczos"));
  assert.equal(args.at(-1), "/tmp/thumb.png");
});
