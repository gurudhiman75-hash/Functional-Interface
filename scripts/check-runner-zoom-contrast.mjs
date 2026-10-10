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
const fullscreenExitSource = fs.readFileSync(
  fileURLToPath(new URL("../src/components/ExamFullscreenExit.tsx", import.meta.url)),
  "utf8",
);
const mainSource = fs.readFileSync(
  fileURLToPath(new URL("../src/main.tsx", import.meta.url)),
  "utf8",
);
const runnerCss = fs.readFileSync(
  fileURLToPath(new URL("../src/test-runner-mobile.css", import.meta.url)),
  "utf8",
);

assert.match(proof, /page\.setViewportSize\(\{ width: 390, height: 844 \}\)/, "runner/result certification must retain a narrow 390px reflow viewport");
assert.match(proof, /Emulation\.setPageScaleFactor[\s\S]*?pageScaleFactor: 2/, "runner/result certification must exercise 200% Chromium page scale");
assert.match(proof, /visualViewport\?\.scale[\s\S]*?toBeGreaterThanOrEqual\(1\.9\)/, "200% certification must verify the browser actually applied page scale");
assert.match(proof, /scrollWidth - window\.innerWidth[\s\S]*?toBeLessThanOrEqual\(1\)/, "runner/result reflow certification must reject horizontal overflow");
assert.match(proof, /contrastRatio[\s\S]*?toBeGreaterThanOrEqual\(4\.5\)/, "runner/result zoom certification must retain an AA 4.5:1 contrast gate");
assert.match(proof, /Start Test[\s\S]*?Question No 1/, "runner certification must enter the real active exam surface");
assert.match(proof, /runner reflow-safe at a 390px viewport[\s\S]*?Pause & Exit[\s\S]*?\^Next[\s\S]*?\^Submit/, "390px runner reflow proof must keep critical mobile navigation visible");
assert.match(proof, /document\.fullscreenElement[\s\S]*?toBe\(true\)/, "runner zoom proof must verify REAL exam immersive mode is actually active");
assert.match(proof, /getByRole\("button", \{ name: "Exit fullscreen", exact: true \}\)/, "runner zoom proof must exercise the visible fullscreen exit control");
assert.match(proof, /exitBox[\s\S]*?toBeGreaterThanOrEqual\(44\)[\s\S]*?toBeGreaterThanOrEqual\(44\)/, "fullscreen exit control must retain a 44px-class measured touch target");
assert.match(proof, /exitFullscreen\.focus\(\)[\s\S]*?toBeFocused\(\)[\s\S]*?keyboard\.press\("Enter"\)/, "fullscreen exit must be operable through keyboard focus and Enter");
assert.match(proof, /document\.fullscreenElement[\s\S]*?toBe\(false\)/, "runner zoom proof must verify immersive mode exits before browser zoom");
assert.match(proof, /toBe\(false\)[\s\S]*?Question No 1[\s\S]*?applyTwoXScale/, "exiting fullscreen must preserve the active attempt before 200% zoom is applied");
assert.match(proof, /AA-readable at 200% scale after explicitly exiting immersive mode[\s\S]*?₹720[\s\S]*?Save & Next/, "200% runner proof must cover answer and primary advance controls after immersive-mode exit");
assert.match(proof, /Pause & Exit\?/, "runner reflow certification must cover the pause overlay");
assert.match(proof, /\/result\?attemptId=\$\{ATTEMPT_ID\}/, "result certification must use a canonical attempt id rather than local result fallback");
assert.match(proof, /canonical result reflow-safe at a 390px viewport[\s\S]*?Back to My Activity[\s\S]*?Solution review[\s\S]*?Retake test/, "390px result proof must cover navigation, review, and retake surfaces");
assert.match(proof, /canonical result AA-readable at 200% scale[\s\S]*?Back to My Activity[\s\S]*?All \(2\)[\s\S]*?Retake test/, "200% result proof must cover critical saved-result controls");
assert.match(proof, /canvas\.getContext\("2d"/, "contrast proof must use the browser CSS color parser for modern color syntax");
assert.match(resultSource, /Back to My Activity[\s\S]*?text-foreground\/90|text-foreground\/90[\s\S]*?Back to My Activity/, "canonical result back navigation must use foreground-class contrast rather than muted text");

assert.match(fullscreenExitSource, /fullscreenchange/, "fullscreen exit control must track browser fullscreen state");
assert.match(fullscreenExitSource, /document\.exitFullscreen/, "fullscreen exit control must leave immersive mode without navigating away");
assert.match(fullscreenExitSource, /min-h-11/, "fullscreen exit control must retain a 44px-class minimum height");
assert.match(fullscreenExitSource, /aria-label="Exit fullscreen"/, "fullscreen exit control must expose an explicit accessible name");
assert.match(mainSource, /<ExamFullscreenExit \/>/, "the global student root must mount the exam fullscreen exit control");
assert.match(
  runnerCss,
  /header\.sticky\.top-0\.bg-blue-600 > div:first-child button \{[\s\S]*?background-color: #1d4ed8;[\s\S]*?color: #fff;/,
  "runner Pause & Exit must keep an opaque high-contrast foreground/background pair",
);

console.log("Runner/result zoom and contrast audit passed (26 assertions).");
