import assert from "node:assert/strict";
import {
  generateIop001StandardQuestionStudioBatch,
  IOP_001_QUESTION_STUDIO_PACKAGE,
} from "./question-studio-standard-integration.ts";

for (const qlId of IOP_001_QUESTION_STUDIO_PACKAGE.qlIds) {
  for (const sourceMode of IOP_001_QUESTION_STUDIO_PACKAGE.sourceModes.filter((mode) => mode.qlId === qlId)) {
    const byLanguage = new Map<string, ReturnType<typeof generateIop001StandardQuestionStudioBatch>>();

    for (const language of ["en", "hi", "pa"] as const) {
      const result = generateIop001StandardQuestionStudioBatch({
        packageId: "IOP-001",
        qlId,
        sourceModeId: sourceMode.id,
        language,
        seed: "IOP-QS-PARITY-" + sourceMode.id,
        count: 4,
      });
      byLanguage.set(language, result);
      assert.equal(result.questions.length, 4);
    }

    const en = byLanguage.get("en")!;
    const hi = byLanguage.get("hi")!;
    const pa = byLanguage.get("pa")!;

    for (let i = 0; i < 4; i += 1) {
      const enQ = en.questions[i]!;
      const hiQ = hi.questions[i]!;
      const paQ = pa.questions[i]!;

      assert.equal(enQ.qlId, hiQ.qlId);
      assert.equal(enQ.qlId, paQ.qlId);
      assert.equal(enQ.sourceModeId, hiQ.sourceModeId);
      assert.equal(enQ.sourceModeId, paQ.sourceModeId);
      assert.equal(enQ.solveMode, hiQ.solveMode);
      assert.equal(enQ.solveMode, paQ.solveMode);
      assert.equal(enQ.correctIndex, hiQ.correctIndex);
      assert.equal(enQ.correctIndex, paQ.correctIndex);
      assert.equal(enQ.canonicalItemId, hiQ.canonicalItemId);
      assert.equal(enQ.canonicalItemId, paQ.canonicalItemId);
      assert.equal(enQ.seed, hiQ.seed);
      assert.equal(enQ.seed, paQ.seed);
      assert.deepEqual(enQ.machineTrace, hiQ.machineTrace);
      assert.deepEqual(enQ.machineTrace, paQ.machineTrace);
      assert.deepEqual(enQ.sourceEvidenceIds, hiQ.sourceEvidenceIds);
      assert.deepEqual(enQ.sourceEvidenceIds, paQ.sourceEvidenceIds);
      assert.equal(enQ.difficulty, hiQ.difficulty);
      assert.equal(enQ.difficulty, paQ.difficulty);
      assert.equal((enQ.options as string[]).length, 4);
      assert.equal((hiQ.options as string[]).length, 4);
      assert.equal((paQ.options as string[]).length, 4);
      assert.equal(enQ.validation.exactlyOneCorrectOption, true);
      assert.equal(hiQ.validation.exactlyOneCorrectOption, true);
      assert.equal(paQ.validation.exactlyOneCorrectOption, true);
    }
  }
}

console.log("PASS_IOP_001_QUESTION_STUDIO_LANGUAGE_PARITY");
console.log("QLs 8");
console.log("source modes 19");
console.log("languages en,hi,pa");
console.log("semantic machine state language-neutral true");
