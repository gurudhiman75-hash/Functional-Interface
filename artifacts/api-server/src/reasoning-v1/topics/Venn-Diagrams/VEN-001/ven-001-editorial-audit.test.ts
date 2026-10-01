import assert from "node:assert/strict";
import { generateVen001NumericalBatch, NUMERICAL_CP_IDS } from "./ven-001-numerical.ts";

const bannedOpeners = [
  /^A survey\b/i,
  /^In a survey\b/i,
  /^Survey results\b/i,
  /^Survey recorded\b/i,
  /^Of the \d+ people surveyed\b/i,
  /^Among the \d+ respondents\b/i,
  /^एक सर्वेक्षण में/u,
  /^सर्वेक्षण के अनुसार/u,
  /^सर्वेक्षण में यह दर्ज हुआ कि/u,
  /^सर्वेक्षण में शामिल \d+ लोगों में से/u,
  /^\d+ लोगों के सर्वेक्षण में/u,
  /^ਸਰਵੇਖਣ ਵਿੱਚ ਸ਼ਾਮਲ \d+ ਲੋਕਾਂ ਵਿੱਚੋਂ/u,
  /^\d+ ਲੋਕਾਂ ਦੇ ਸਰਵੇਖਣ ਤੋਂ/u,
  /^ਇੱਕ ਸਰਵੇਖਣ ਵਿੱਚ/u,
  /^ਸਰਵੇਖਣ ਅਨੁਸਾਰ/u,
];

const ordinalGroupReferences = [
  /\bfirst group\b/i,
  /\bsecond group\b/i,
  /\bthird group\b/i,
  /पहले समूह/u,
  /दूसरे समूह/u,
  /तीसरे समूह/u,
  /ਪਹਿਲੇ ਸਮੂਹ/u,
  /ਦੂਜੇ ਸਮੂਹ/u,
  /ਤੀਜੇ ਸਮੂਹ/u,
];

let checked = 0;
for (const language of ["en", "hi", "pa"] as const) {
  for (const cp of NUMERICAL_CP_IDS) {
    for (let seedIndex = 0; seedIndex < 12; seedIndex += 1) {
      const result = generateVen001NumericalBatch({
        patternId: cp,
        language,
        seed: `ven-editorial:${language}:${cp}:${seedIndex}`,
        count: 8,
      });
      for (const question of result.questions) {
        const stem = String(question.stem).trim();
        assert.ok(stem.length > 20, `${cp}/${language}: unexpectedly short stem`);
        for (const pattern of bannedOpeners) {
          assert.equal(pattern.test(stem), false, `${cp}/${language}: generic survey opener leaked: ${stem}`);
        }
        for (const pattern of ordinalGroupReferences) {
          assert.equal(pattern.test(stem), false, `${cp}/${language}: ordinal group reference leaked: ${stem}`);
        }
        checked += 1;
      }
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_VEN_001_NUMERICAL_EDITORIAL_AUDIT_V1",
  checkedQuestions: checked,
  languages: 3,
  checkpoints: NUMERICAL_CP_IDS.length,
  genericSurveyOpeners: 0,
  ordinalGroupReferences: 0,
}, null, 2));
