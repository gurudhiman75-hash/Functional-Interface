import assert from "node:assert/strict";
import { COD_CP001_QUESTION_LOGICS } from "../COD-CP-001/question-language.en";
import { generateCodCp001Question } from "../COD-CP-001/generator";
import { COD_CP002_QUESTION_LOGICS } from "../COD-CP-002/question-language.en";
import { generateCodCp002Question } from "../COD-CP-002/generator";
import { COD_CP003_QUESTION_LOGICS } from "../COD-CP-003/question-language.en";
import { generateCodCp003Question } from "../COD-CP-003/generator";
import { COD_CP004_QUESTION_LOGICS } from "../COD-CP-004/question-language.en";
import { generateCodCp004Question } from "../COD-CP-004/generator";

interface CheckpointAdapter {
  checkpointId: string;
  qlIds: readonly string[];
  generate: (qlId: string, seed: number) => any;
}

const checkpoints: readonly CheckpointAdapter[] = [
  { checkpointId: "COD-CP-001", qlIds: COD_CP001_QUESTION_LOGICS.map((entry) => entry.qlId), generate: generateCodCp001Question },
  { checkpointId: "COD-CP-002", qlIds: COD_CP002_QUESTION_LOGICS.map((entry) => entry.qlId), generate: generateCodCp002Question },
  { checkpointId: "COD-CP-003", qlIds: COD_CP003_QUESTION_LOGICS.map((entry) => entry.qlId), generate: generateCodCp003Question },
  { checkpointId: "COD-CP-004", qlIds: COD_CP004_QUESTION_LOGICS.map((entry) => entry.qlId), generate: generateCodCp004Question },
];

const bannedStemLanguage = [
  /\bbranch(?:es)?\b/i,
  /\bstructured (?:shift|movement|transformation)\b/i,
  /\bposition-dependent\b/i,
  /\bclass-dependent\b/i,
  /\buniform alphabet transformation\b/i,
  /\brecover the substitution\b/i,
  /\bhidden position\b/i,
];

const difficultiesByQl = new Map<string, Set<string>>();
let generated = 0;
let recoveryQuestions = 0;
let trapSpecificQuestions = 0;

for (const checkpoint of checkpoints) {
  for (const qlId of checkpoint.qlIds) {
    for (let seed = 1; seed <= 20; seed += 1) {
      const question = checkpoint.generate(qlId, seed);
      generated += 1;
      const difficulties = difficultiesByQl.get(qlId) ?? new Set<string>();
      difficulties.add(question.difficulty);
      difficultiesByQl.set(qlId, difficulties);

      assert.ok(question.stem.length >= 35 && question.stem.length <= 520, `${qlId}/${seed} has an unsuitable stem length`);
      for (const banned of bannedStemLanguage) {
        assert.equal(banned.test(question.stem), false, `${qlId}/${seed} exposes internal authoring language: ${question.stem}`);
      }
      assert.equal(question.stem.includes("{{"), false);
      assert.equal(question.stem.includes("undefined"), false);

      const explanationText = [
        question.explanation.ruleStatement,
        ...question.explanation.sourceDemonstration,
        ...question.explanation.targetApplication,
        question.explanation.conclusion,
        question.explanation.closestTrapRejection ?? "",
      ].join(" ");
      const explanationWords = explanationText.trim().split(/\s+/).filter(Boolean).length;
      assert.ok(explanationWords <= 145, `${qlId}/${seed} explanation is too long (${explanationWords} words)`);
      assert.ok(question.explanation.sourceDemonstration.length >= 1 && question.explanation.sourceDemonstration.length <= 2);
      if (checkpoint.checkpointId === "COD-CP-004") assert.equal(question.explanation.sourceDemonstration.length, 1);

      const trap = question.explanation.closestTrapRejection;
      assert.ok(trap, `${qlId}/${seed} must reject one displayed misconception`);
      const displayedWrongValues = question.options.filter((option: any) => !option.isCorrect).map((option: any) => option.value);
      assert.equal(displayedWrongValues.some((value: string) => trap.includes(value)), true, `${qlId}/${seed} trap feedback must refer to an actual option`);
      assert.equal(trap.includes("Using forward ranks in place of reverse ranks"), false);
      assert.equal(trap.includes("using opposite letters would contradict"), false);
      trapSpecificQuestions += 1;

      if (["RECOVER_MISSING_VALUE", "RECOVER_MISSING_LETTER"].includes(question.structuredPrompt.taskKind)) {
        const displayed = question.structuredPrompt.displayedTargetCode;
        assert.equal(typeof displayed, "string", `${qlId}/${seed} must expose a masked target code`);
        assert.equal((displayed.match(/\?/g) ?? []).length, 1, `${qlId}/${seed} must show exactly one blank`);
        assert.equal(question.stem.includes(displayed), true, `${qlId}/${seed} stem must display the masked code`);
        if (checkpoint.checkpointId === "COD-CP-002" && question.structuredPrompt.outputShape === "SEQUENCE") {
          assert.equal(displayed.split("-").length, question.structuredPrompt.targetWord.length);
          assert.equal(displayed.split("-")[question.structuredPrompt.missingIndex], "?");
        }
        if (["COD-CP-003", "COD-CP-004"].includes(checkpoint.checkpointId)) {
          assert.equal([...displayed].length, question.structuredPrompt.targetWord.length);
          assert.equal([...displayed][question.structuredPrompt.missingIndex], "?");
        }
        recoveryQuestions += 1;
      }
    }
  }
}

for (const [qlId, difficulties] of difficultiesByQl) {
  assert.equal(difficulties.size, 1, `${qlId} changes difficulty across seeds: ${[...difficulties].join(", ")}`);
}

assert.equal(difficultiesByQl.size, 112);
assert.equal(generated, 2240);
assert.equal(recoveryQuestions, 240);
assert.equal(trapSpecificQuestions, generated);

console.log(JSON.stringify({
  checkpoints: checkpoints.map((checkpoint) => checkpoint.checkpointId),
  qls: difficultiesByQl.size,
  generated,
  recoveryQuestions,
  trapSpecificQuestions,
  stableDifficultyQls: [...difficultiesByQl.values()].filter((values) => values.size === 1).length,
}, null, 2));
