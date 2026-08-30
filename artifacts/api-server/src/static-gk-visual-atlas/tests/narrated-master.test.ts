import assert from "node:assert/strict";
import test from "node:test";

import { buildFfmpegNarratedMasterArgs } from "../renderers/narrated-master";

test("narrated master offsets clips, normalizes voice and copies deterministic video", () => {
  const args = buildFfmpegNarratedMasterArgs(
    { durationMs: 35_000 },
    "/tmp/silent.mp4",
    [
      { startMs: 0, audioPath: "/tmp/n1.wav" },
      { startMs: 10_000, audioPath: "/tmp/n2.wav" },
      { startMs: 23_000, audioPath: "/tmp/n3.wav" },
    ],
    "/tmp/final.mp4",
  );
  const filter = args[args.indexOf("-filter_complex") + 1];
  assert.match(filter, /adelay=delays=0:all=1/);
  assert.match(filter, /adelay=delays=10000:all=1/);
  assert.match(filter, /amix=inputs=3/);
  assert.match(filter, /loudnorm=I=-16:LRA=11:TP=-1\.5/);
  assert.match(filter, /atrim=duration=35\.000/);
  assert.ok(args.includes("copy"));
  assert.ok(args.includes("aac"));
  assert.equal(args.at(-1), "/tmp/final.mp4");
});

test("narrated master rejects invalid audio timeline offsets", () => {
  assert.throws(
    () => buildFfmpegNarratedMasterArgs(
      { durationMs: 35_000 },
      "/tmp/silent.mp4",
      [{ startMs: 35_000, audioPath: "/tmp/n1.wav" }],
      "/tmp/final.mp4",
    ),
    /invalid timeline offset/,
  );
});
