import assert from "node:assert/strict";

import { ALP_001_QLS } from "./ql-registry";
import { ALP_001_QUESTION_STUDIO_REGISTRY } from "./question-studio-registry";
import { generateAlp001Question } from "./runtime";
import { toAlpLearnerExplanation } from "./learner-explanation";
import type { AlpLocale } from "./types";

const locales: readonly AlpLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const allowedKeys = ["schemaVersion", "coreConcept", "steps", "visualWorking", "conclusion"].sort();
let checked = 0;

for (const ql of ALP_001_QLS) {
  for (const locale of locales) {
    for (const seed of [0, 7, 19]) {
      const raw = generateAlp001Question(ql.qlId, seed, locale);
      const learner = toAlpLearnerExplanation(raw.explanation);
      const studio = ALP_001_QUESTION_STUDIO_REGISTRY.generate(ql.qlId, seed, locale);

      assert.deepEqual(Object.keys(learner).sort(), allowedKeys, `${ql.qlId}:${seed}:${locale} learner explanation surface drifted.`);
      assert.deepEqual(Object.keys(studio.explanation).sort(), allowedKeys, `${ql.qlId}:${seed}:${locale} Studio explanation surface drifted.`);
      assert.equal(learner.schemaVersion, "ALP-001-LEARNER-EXPLANATION-V1");
      assert.equal(studio.explanation.schemaVersion, "ALP-001-LEARNER-EXPLANATION-V1");
      assert.equal(learner.coreConcept, raw.explanation.coreConcept);
      assert.deepEqual(learner.steps, raw.explanation.steps);
      assert.deepEqual(learner.visualWorking, raw.explanation.visualWorking);
      assert.equal(learner.conclusion, raw.explanation.conclusion);
      assert.ok(learner.steps.length >= 2, `${ql.qlId}:${seed}:${locale} learner explanation has too few worked steps.`);
      assert.ok(learner.conclusion.includes(raw.answer), `${ql.qlId}:${seed}:${locale} learner conclusion omits the answer.`);

      const rendered = [learner.coreConcept, ...learner.steps, ...learner.visualWorking, learner.conclusion].join("\n");
      assert.doesNotMatch(rendered, /Exam-Speed Shortcut|परीक्षा शॉर्टकट|ਪ੍ਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ|Common Trap Analysis|सामान्य गलती विश्लेषण|ਆਮ ਗਲਤੀ ਵਿਸ਼ਲੇਸ਼ਣ/i);
      assert.equal("examShortcut" in studio.explanation, false);
      assert.equal("distractorAnalyses" in studio.explanation, false);
      assert.equal("closestTrapRejection" in studio.explanation, false);
      assert.equal("ruleStatement" in studio.explanation, false);
      checked += 1;
    }
  }
}

const controlled = ALP_001_QUESTION_STUDIO_REGISTRY.generateControlled({
  seed: 23,
  locale: "en-IN",
  examProfile: "SSC_CGL_TIER_I",
});
assert.deepEqual(Object.keys(controlled.explanation).sort(), allowedKeys);
assert.equal("examShortcut" in controlled.explanation, false);
assert.equal("distractorAnalyses" in controlled.explanation, false);
assert.equal(controlled.deliveryProfile.examProfile, "SSC_CGL_TIER_I");

console.log("ALP-001 concise learner/reviewer explanation gate passed.", {
  checked,
  qlCount: ALP_001_QLS.length,
  locales,
  schema: "ALP-001-LEARNER-EXPLANATION-V1",
});
