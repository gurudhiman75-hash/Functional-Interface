import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const proof = fs.readFileSync(
  fileURLToPath(new URL("../../../scripts/e2e/tests/student-runner-zoom-contrast.spec.ts", import.meta.url)),
  "utf8",
);

assert.match(proof, /page\.setViewportSize\(\{ width: 390, height: 844 \}\)/, "runner/result certification must retain a narrow 390px reflow viewport");
assert.match(proof, /page\.setViewportSize\(\{ width: 780, height: 900 \}\)/, "200% certification must retain a 780px layout viewport for an effective 390px visual width");
assert.match(proof, /Emulation\.setPageScaleFactor[\s\S]*?pageScaleFactor: 2/, "runner/result certification must exercise 200% Chromium page scale");
assert.match(proof, /visualViewport\?\.scale[\s\S]*?toBeGreaterThanOrEqual\(1\.9\)/, "200% certification must verify the browser actually applied page scale");
assert.match(proof, /visualViewport\?\.width[\s\S]*?toBeLessThanOrEqual\(400\)/, "200% certification must verify an effective phone-class visual viewport");
assert.match(proof, /scrollWidth - window\.innerWidth[\s\S]*?toBeLessThanOrEqual\(1\)/, "runner/result certification must reject horizontal overflow");
assert.match(proof, /contrastRatio[\s\S]*?toBeGreaterThanOrEqual\(4\.5\)/, "runner/result certification must retain an AA 4.5:1 contrast gate");
assert.match(proof, /Start Test[\s\S]*?Question No 1/, "runner certification must enter the real active exam surface");
assert.match(proof, /Pause & Exit[\s\S]*?\^Next[\s\S]*?\^Submit/, "390px runner reflow certification must keep critical mobile navigation visible");
assert.match(proof, /₹720[\s\S]*?Save & Next/, "200% runner certification must cover answer and primary advance controls");
assert.match(proof, /Pause & Exit\?/, "runner certification must cover the pause overlay at 200% scale");
assert.match(proof, /\/result\?attemptId=\$\{ATTEMPT_ID\}/, "result certification must use a canonical attempt id rather than local result fallback");
assert.match(proof, /Solution review[\s\S]*?All \(2\)[\s\S]*?Retake test/, "result certification must cover canonical result review, filters, and retake action");
assert.match(proof, /canvas\.getContext\("2d"/, "contrast proof must use the browser CSS color parser for modern color syntax");

console.log("Runner/result zoom and contrast audit passed (14 assertions).");
