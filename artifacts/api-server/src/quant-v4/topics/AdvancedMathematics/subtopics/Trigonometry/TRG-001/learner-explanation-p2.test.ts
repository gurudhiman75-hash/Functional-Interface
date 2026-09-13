import assert from "node:assert/strict";

import {
  TRG_001_LEARNER_EXPLANATION_P2,
  formatTrg001LearnerExplanation,
} from "./learner-explanation-p2";

const source = {
  explanation: {
    keyRule: "Use sin²θ+cos²θ=1.",
    steps: [
      { title: "Step 1", body: "Substitute the given relation." },
      { title: "Answer", body: "The expression simplifies to 1." },
    ],
    shortcut: "Spot the identity immediately.",
    traps: ["Do not square the wrong term.", "Do not change the sign."],
  },
};

for (const language of ["en", "hi", "pa"] as const) {
  const rendered = formatTrg001LearnerExplanation(source, language);
  assert.match(rendered, /sin²θ\+cos²θ=1/u);
  assert.match(rendered, /Substitute the given relation/u);
  assert.match(rendered, /The expression simplifies to 1/u);
  assert.ok(!rendered.includes("Spot the identity immediately."));
  assert.ok(!rendered.includes("Do not square the wrong term."));
  assert.ok(!rendered.includes("Do not change the sign."));
}

assert.equal(TRG_001_LEARNER_EXPLANATION_P2.shortcutRenderedByDefault, false);
assert.equal(TRG_001_LEARNER_EXPLANATION_P2.trapsRenderedByDefault, false);
assert.deepEqual(TRG_001_LEARNER_EXPLANATION_P2.renderedFields, ["keyRule", "steps"]);
assert.deepEqual(TRG_001_LEARNER_EXPLANATION_P2.retainedStructuredQaFields, ["shortcut", "traps"]);

console.log(JSON.stringify({
  status: "PASS_TRG_001_LEARNER_EXPLANATION_P2",
  languages: ["en", "hi", "pa"],
  renderedFields: TRG_001_LEARNER_EXPLANATION_P2.renderedFields,
  shortcutRenderedByDefault: false,
  trapsRenderedByDefault: false,
}));
