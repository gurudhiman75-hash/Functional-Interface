import assert from "node:assert/strict";
import test from "node:test";

import {
  buildFfmpegLoudnessAnalysisArgs,
  evaluateStaticGkLoudness,
  parseFfmpegLoudnormAnalysis,
} from "../audio/loudness-qa";

test("loudness QA parses FFmpeg loudnorm JSON and accepts delivery-safe voice audio", () => {
  const output = `noise before\n{
    "input_i" : "-16.3",
    "input_tp" : "-1.4",
    "input_lra" : "2.1",
    "input_thresh" : "-26.4",
    "output_i" : "-16.0",
    "target_offset" : "0.0"
  }\nnoise after`;
  const measurement = parseFfmpegLoudnormAnalysis(output);
  assert.equal(measurement.integratedLufs, -16.3);
  assert.equal(measurement.truePeakDb, -1.4);
  assert.equal(measurement.loudnessRange, 2.1);
  assert.equal(evaluateStaticGkLoudness(measurement).passed, true);
});

test("loudness QA fails unsafe true peak or large integrated-loudness drift", () => {
  assert.equal(evaluateStaticGkLoudness({
    integratedLufs: -19,
    truePeakDb: -0.4,
    loudnessRange: 3,
    thresholdLufs: null,
    targetOffset: null,
  }).passed, false);
});

test("FFmpeg loudness analysis targets the same CP005 delivery policy", () => {
  const args = buildFfmpegLoudnessAnalysisArgs("/tmp/master.mp4");
  const filter = args[args.indexOf("-af") + 1];
  assert.match(filter, /I=-16/);
  assert.match(filter, /LRA=11/);
  assert.match(filter, /TP=-1\.5/);
  assert.match(filter, /print_format=json/);
});
