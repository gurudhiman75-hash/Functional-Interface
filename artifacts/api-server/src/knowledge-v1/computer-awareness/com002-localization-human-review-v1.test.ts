import assert from "node:assert/strict";

import { localizeCom002QuestionEditorialV1 } from "./com002-localization-editorial-v1";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const languages = ["hi", "pa"] as const;

let sampleNumber = 0;
for (const qlId of qlIds) {
  const seed = `localization-human-review-v1:${qlId}`;
  for (const language of languages) {
    const question = localizeCom002QuestionEditorialV1({ qlId, seed, language });
    sampleNumber += 1;
    assert.equal(question.options.length, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.equal(question.lifecycleV1.localizationReviewOnly, true);
    assert.equal(question.lifecycleV1.localizationFrozen, false);
    console.log(`\n[COM002-LOCALIZATION-HUMAN-REVIEW ${String(sampleNumber).padStart(2, "0")}/26]`);
    console.log(JSON.stringify({
      language: question.language,
      qlId: question.qlId,
      surfaceMode: question.surfaceMode,
      seed,
      stem: question.stem,
      options: question.options,
      correctIndex: question.correctIndex,
      canonicalAnswer: question.canonicalAnswer,
      explanation: question.explanation,
      sourceFactIds: question.sourceFactIds,
      solverAuthority: question.solverAuthority,
    }));
  }
}

assert.equal(sampleNumber, 26);
console.log(`[com002-localization-human-review-v1] PASS questions=${sampleNumber}`);
