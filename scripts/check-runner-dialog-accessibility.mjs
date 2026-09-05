import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const layer = fs.readFileSync(
  fileURLToPath(new URL("../src/components/RunnerDialogAccessibility.tsx", import.meta.url)),
  "utf8",
);
const main = fs.readFileSync(
  fileURLToPath(new URL("../src/main.tsx", import.meta.url)),
  "utf8",
);
const proof = fs.readFileSync(
  fileURLToPath(new URL("../../../scripts/e2e/tests/student-runner-dialog-accessibility.spec.ts", import.meta.url)),
  "utf8",
);

assert.match(layer, /Pause & Exit\?[\s\S]*?Continue Test/, "pause dialog must have a safe cancel action");
assert.match(layer, /Move to Next Section\?[\s\S]*?Stay Here/, "section-switch dialog must have a safe cancel action");
assert.match(layer, /Submit this attempt\?[\s\S]*?Continue test/, "submit dialog must have a safe cancel action");
assert.match(layer, /role", "dialog"/, "runner panels must receive dialog semantics");
assert.match(layer, /aria-modal", "true"/, "runner panels must be exposed as modal");
assert.match(layer, /aria-labelledby/, "runner dialogs must be named by their visible headings");
assert.match(layer, /aria-describedby/, "runner dialogs must expose their warning/help copy");
assert.match(layer, /setAttribute\("inert"/, "runner dialogs must inert background controls");
assert.match(layer, /cancelButton\.focus/, "runner dialogs must initially focus the safe action");
assert.match(layer, /event\.key === "Escape"[\s\S]*?cancelButton\.click/, "Escape must invoke the safe cancel action");
assert.match(layer, /event\.key !== "Tab"[\s\S]*?first[\s\S]*?last/, "runner dialogs must trap Tab within modal actions");
assert.match(layer, /previous\.trigger\?\.focus/, "closing a runner dialog must return focus to its trigger");
assert.match(main, /<RunnerDialogAccessibility \/>/, "student root must mount the runner dialog accessibility layer");

assert.match(proof, /getByRole\("dialog", \{ name \}/, "browser proof must locate dialogs through accessible role and name");
assert.match(proof, /toHaveAttribute\("aria-modal", "true"\)/, "browser proof must verify modal semantics");
assert.match(proof, /toBeFocused\(\)/, "browser proof must verify focus movement");
assert.match(proof, /Shift\+Tab[\s\S]*?Tab/, "browser proof must exercise focus wrapping");
assert.match(proof, /keyboard\.press\("Escape"\)/, "browser proof must exercise Escape cancellation");
assert.match(proof, /hasAttribute\("inert"\)|closest\("\[inert\]"\)/, "browser proof must verify background inertness");
assert.match(proof, /Pause & Exit\?[\s\S]*?Move to Next Section\?[\s\S]*?Submit this attempt\?/, "browser proof must cover all three critical runner dialogs");

console.log("Runner dialog accessibility audit passed (20 assertions).");
