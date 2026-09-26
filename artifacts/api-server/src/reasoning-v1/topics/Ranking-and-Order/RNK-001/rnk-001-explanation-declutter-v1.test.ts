import assert from "node:assert/strict";

import { buildRnk001QuestionStudioPayload } from "./question-studio-payload";
import { previewRnk001QuestionStudioReview } from "./question-studio-review";
import { declutterRnkExplanation } from "./rnk-001-explanation-declutter-v1";

const english = declutterRnkExplanation({
  qlId: "RNK-QL-001",
  locale: "en-IN",
  answer: "23",
  explanation: {
    keyRule: "Opposite-end rank = total - given rank + 1.",
    stepByStepSolution: [
      "Given facts: total = 33, front rank = 11.",
      "Now apply the relevant rule: 33 - 11 + 1 = 23.",
      "Therefore the required answer is 23.",
    ],
    examSpeedShortcut: "Quick method: directly calculate 33 - 11 + 1 = 23.",
    optionAnalysis: [
      "Option 1 (22) is wrong because 33 - 11 + 1 = 23.",
      "Option 4 (23) is correct because 33 - 11 + 1 = 23.",
    ],
    conclusion: "Therefore the correct answer is 23.",
  },
});
assert.equal(
  english,
  "Opposite-end rank = total - given rank + 1.\ntotal = 33, front rank = 11.\n33 - 11 + 1 = 23.",
);

const hindi = declutterRnkExplanation({
  qlId: "RNK-QL-001",
  locale: "hi-IN",
  answer: "23",
  explanation: {
    keyRule: "विपरीत छोर से स्थान = कुल संख्या − दिए गए छोर का स्थान + 1।",
    stepByStepSolution: [
      "दिए गए तथ्य: कुल = 33, आगे से स्थान = 11।",
      "अब संबंधित नियम लगाएँ: 33 - 11 + 1 = 23।",
      "इसलिए आवश्यक उत्तर 23 है।",
    ],
    examSpeedShortcut: "तेज़ तरीका: सीधे 33 - 11 + 1 = 23 करें।",
    optionAnalysis: ["विकल्प 1 (22): सही नहीं; नियम से उत्तर 23 है।"],
    conclusion: "अतः सही उत्तर 23 है।",
  },
});
assert.equal(
  hindi,
  "विपरीत छोर से स्थान = कुल संख्या − दिए गए छोर का स्थान + 1।\nकुल = 33, आगे से स्थान = 11।\n33 - 11 + 1 = 23।",
);

const punjabi = declutterRnkExplanation({
  qlId: "RNK-QL-001",
  locale: "pa-IN",
  answer: "23",
  explanation: {
    keyRule: "ਉਲਟ ਸਿਰੇ ਤੋਂ ਸਥਾਨ = ਕੁੱਲ ਗਿਣਤੀ − ਦਿੱਤੇ ਸਿਰੇ ਤੋਂ ਸਥਾਨ + 1।",
    stepByStepSolution: [
      "ਦਿੱਤੇ ਤੱਥ: ਕੁੱਲ = 33, ਅੱਗੋਂ ਸਥਾਨ = 11।",
      "ਹੁਣ ਸੰਬੰਧਿਤ ਨਿਯਮ ਲਗਾਓ: 33 - 11 + 1 = 23।",
      "ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉੱਤਰ 23 ਹੈ।",
    ],
    examSpeedShortcut: "ਤੇਜ਼ ਤਰੀਕਾ: ਸਿੱਧਾ 33 - 11 + 1 = 23 ਕਰੋ।",
    optionAnalysis: ["ਵਿਕਲਪ 1 (22): ਸਹੀ ਨਹੀਂ; ਨਿਯਮ ਤੋਂ ਉੱਤਰ 23 ਹੈ।"],
    conclusion: "ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ 23 ਹੈ।",
  },
});
assert.equal(
  punjabi,
  "ਉਲਟ ਸਿਰੇ ਤੋਂ ਸਥਾਨ = ਕੁੱਲ ਗਿਣਤੀ − ਦਿੱਤੇ ਸਿਰੇ ਤੋਂ ਸਥਾਨ + 1।\nਕੁੱਲ = 33, ਅੱਗੋਂ ਸਥਾਨ = 11।\n33 - 11 + 1 = 23।",
);

const advanced = declutterRnkExplanation({
  qlId: "RNK-QL-037",
  locale: "en-IN",
  answer: "Fourth",
  explanation: {
    keyRule: "A best possible rank needs both a bound and a witness.",
    stepByStepSolution: [
      "At least three people must remain above Simran, so a rank better than fourth is impossible.",
      "Jaspreet > Harleen > Aman > Simran > Ishan > Ananya is a valid witness with Simran fourth.",
    ],
    optionAnalysis: ["Fourth is correct."],
    conclusion: "Therefore the answer is Fourth.",
  },
});
assert.match(advanced, /three people must remain above/u);
assert.match(advanced, /valid witness/u);
assert.doesNotMatch(advanced, /Fourth is correct/u);

const chapter = previewRnk001QuestionStudioReview({ count: 42, seed: "declutter-v1-coverage" });
assert.equal(chapter.questions.length, 42);
assert.equal(new Set(chapter.questions.map((question) => question.qlId)).size, 42);

for (const question of chapter.questions) {
  const payload = buildRnk001QuestionStudioPayload(question);
  assert.ok(payload.explanation.trim().length > 0, `${question.qlId}: empty explanation`);
  assert.equal(payload.generationContext.explanationPresentation, "DECLUTTERED_V1");

  const qlNumber = Number(question.qlId.slice(-3));
  const sourceExplanation = (question.source as Record<string, any>).explanation;
  if (qlNumber <= 35 && sourceExplanation && typeof sourceExplanation === "object") {
    const record = sourceExplanation as Record<string, any>;
    if (typeof record.examSpeedShortcut === "string" && record.examSpeedShortcut.trim()) {
      assert.ok(!payload.explanation.includes(record.examSpeedShortcut.trim()), `${question.qlId}: shortcut leaked`);
    }
    if (typeof record.conclusion === "string" && record.conclusion.trim()) {
      assert.ok(!payload.explanation.includes(record.conclusion.trim()), `${question.qlId}: conclusion leaked`);
    }
    if (Array.isArray(record.optionAnalysis)) {
      for (const line of record.optionAnalysis) {
        if (typeof line === "string" && line.trim()) {
          assert.ok(!payload.explanation.includes(line.trim()), `${question.qlId}: option-analysis clutter leaked`);
        }
      }
    }
  }
}

console.log(JSON.stringify({
  status: "PASS",
  version: "RNK_001_EXPLANATION_DECLUTTER_V1",
  languagesProved: ["en-IN", "hi-IN", "pa-IN"],
  chapterQlCoverage: 42,
  simpleQlDeclutterRange: "RNK-QL-001..035",
  advancedProofRangePreserved: "RNK-QL-036..042",
}, null, 2));
