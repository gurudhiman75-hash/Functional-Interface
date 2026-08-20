import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const proof = fs.readFileSync(
  fileURLToPath(new URL("../../../scripts/e2e/tests/student-runner-zoom-contrast.spec.ts", import.meta.url)),
  "utf8",
);
const resultSource = fs.readFileSync(
  fileURLToPath(new URL("../src/pages/canonical-result.tsx", import.meta.url)),
  "utf8",
);

assert.match(proof, /page\.setViewportSize\(\{ width: 390, height: 844 \}\)/, "runner/result certification must retain a narrow 390px reflow viewport");
assert.match(proof, /Emulation\.setPageScaleFactor[\s\S]*?pageScaleFactor: 2/, "runner/result certification must exercise 200% Chromium page scale");
assert.match(proof, /visualViewport\?\.scale[\s\S]*?toBeGreaterThanOrEqual\(1\.9\)/, "200% certification must verify the browser actually applied page scale");
assert.match(proof, /scrollWidth - window\.innerWidth[\s\S]*?toBeLessThanOrEqual\(1\)/, "runner/result reflow certification must reject horizontal overflow");
assert.match(proof, /contrastRatio[\s\S]*?toBeGreaterThanOrEqual\(4\.5\)/, "runner/result zoom certification must retain an AA 4.5:1 contrast gate");
assert.match(proof, /Start Test[\s\S]*?Question No 1/, "runner certification must enter the real active exam surface");
assert.match(proof, /runner reflow-safe at a 390px viewport[\s\S]*?Pause & Exit[\s\S]*?\^Next[\s\S]*?\^Submit/, "390px runner reflow proof must keep critical mobile navigation visible");
assert.match(proof, /critical runner text and actions AA-readable at 200% scale[\s\S]*?₹720[\s\S]*?Save & Next/, "fresh-context 200% runner proof must cover answer and primary advance controls");
assert.match(proof, /Pause & Exit\?/, "runner reflow certification must cover the pause overlay");
assert.match(proof, /\/result\?attemptId=\$\{ATTEMPT_ID\}/, "result certification must use a canonical attempt id rather than local result fallback");
assert.match(proof, /canonical result reflow-safe at a 390px viewport[\s\S]*?Back to My Activity[\s\S]*?Solution review[\s\S]*?Retake test/, "390px result proof must cover navigation, review, and retake surfaces");
assert.match(proof, /canonical result AA-readable at 200% scale[\s\S]*?Back to My Activity[\s\S]*?All \(2\)[\s\S]*?Retake test/, "fresh-context 200% result proof must cover critical saved-result controls");
assert.match(proof, /canvas\.getContext\("2d"/, "contrast proof must use the browser CSS color parser for modern color syntax");
assert.match(resultSource, /Back to My Activity[\s\S]*?text-foreground\/90|text-foreground\/90[\s\S]*?Back to My Activity/, "canonical result back navigation must use foreground-class contrast rather than muted text");

console.log("Runner/result zoom and contrast audit passed (14 assertions).");
