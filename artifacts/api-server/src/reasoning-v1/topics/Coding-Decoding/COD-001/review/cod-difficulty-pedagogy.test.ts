import assert from "node:assert/strict";
import { assessCodDifficulty } from "../foundation/difficulty";
import { COD_CP001_QUESTION_LOGICS } from "../COD-CP-001/question-language.en";
import { generateCodCp001Question } from "../COD-CP-001/generator";
import { COD_CP002_QUESTION_LOGICS } from "../COD-CP-002/question-language.en";
import { generateCodCp002Question } from "../COD-CP-002/generator";
import { COD_CP003_QUESTION_LOGICS } from "../COD-CP-003/question-language.en";
import { generateCodCp003Question } from "../COD-CP-003/generator";
import { COD_CP004_QUESTION_LOGICS } from "../COD-CP-004/question-language.en";
import { generateCodCp004Question } from "../COD-CP-004/generator";
import { COD_CP005_QUESTION_LOGICS } from "../COD-CP-005/question-language.en";
import { generateCodCp005Question } from "../COD-CP-005/generator";
import { COD_CP006_QUESTION_LOGICS } from "../COD-CP-006/question-language.en";
import { generateCodCp006Question } from "../COD-CP-006/generator";

interface LogicLike {
  qlId: string;
  allowedDifficulties: readonly ("EASY" | "MEDIUM" | "HARD")[];
}

interface CheckpointAdapter {
  checkpointId: string;
  logics: readonly LogicLike[];
  generate: (qlId: string, seed: number) => any;
}

const checkpoints: readonly CheckpointAdapter[] = [
  { checkpointId: "COD-CP-001", logics: COD_CP001_QUESTION_LOGICS, generate: generateCodCp001Question },
  { checkpointId: "COD-CP-002", logics: COD_CP002_QUESTION_LOGICS, generate: generateCodCp002Question },
  { checkpointId: "COD-CP-003", logics: COD_CP003_QUESTION_LOGICS, generate: generateCodCp003Question },
  { checkpointId: "COD-CP-004", logics: COD_CP004_QUESTION_LOGICS, generate: generateCodCp004Question },
  { checkpointId: "COD-CP-005", logics: COD_CP005_QUESTION_LOGICS, generate: generateCodCp005Question },
  { checkpointId: "COD-CP-006", logics: COD_CP006_QUESTION_LOGICS, generate: generateCodCp006Question },
];

const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
const perQlDifficulties = new Map<string, Set<string>>();
let generated = 0;

for (const checkpoint of checkpoints) {
  for (const logic of checkpoint.logics) {
    const observed = new Set<string>();
    for (let seed = 1; seed <= 20; seed += 1) {
      const question = checkpoint.generate(logic.qlId, seed);
      const prompt = question.structuredPrompt as { target?: string; targetWord?: string; evidence: readonly unknown[]; taskKind: string };
      const target = prompt.targetWord ?? prompt.target;
      assert.ok(target, `${logic.qlId}/${seed} has no target word`);

      const assessment = assessCodDifficulty({
        checkpointId: checkpoint.checkpointId,
        ruleId: question.ruleId,
        taskKind: prompt.taskKind,
        targetLength: target.length,
        evidenceCount: prompt.evidence.length,
        options: question.options,
        allowedDifficulties: logic.allowedDifficulties,
      });
      assert.equal(question.difficulty, assessment.difficulty, `${logic.qlId}/${seed} does not use the instance scorer`);

      assert.ok(question.explanation.referenceAid?.length, `${logic.qlId}/${seed} lacks a reference aid`);
      assert.ok(question.explanation.quickMethod?.trim(), `${logic.qlId}/${seed} lacks a quick method`);
      assert.ok(question.explanation.commonTrapAlert?.trim(), `${logic.qlId}/${seed} lacks a Common Trap Alert`);
      assert.equal(question.explanation.commonTrapAlert, question.explanation.closestTrapRejection);
      assert.equal(
        question.options.filter((option: any) => !option.isCorrect).some((option: any) => question.explanation.commonTrapAlert.includes(option.value)),
        true,
        `${logic.qlId}/${seed} trap alert does not name an actual displayed distractor`,
      );

      if (checkpoint.checkpointId === "COD-CP-001") {
        assert.notEqual(question.difficulty, "HARD", `${logic.qlId}/${seed} direct substitution must not be Hard`);
      }
      if (["COD-QL-006", "COD-QL-012", "COD-QL-018"].includes(logic.qlId)) {
        assert.notEqual(question.difficulty, "HARD", `${logic.qlId}/${seed} overlapping direct mapping is at most Medium`);
      }

      observed.add(question.difficulty);
      difficultyCounts[question.difficulty as keyof typeof difficultyCounts] += 1;
      generated += 1;
    }
    perQlDifficulties.set(logic.qlId, observed);
  }
}

assert.equal(generated, 168 * 20);
assert.equal(checkpoints[1]!.generate("COD-QL-049", 1).difficulty, "HARD", "Position-weighted sum benchmark should be Hard");
assert.equal(checkpoints[5]!.generate("COD-QL-143", 1).difficulty, "MEDIUM", "Short direct pair-swap pipeline benchmark should be Medium");
assert.ok(difficultyCounts.EASY / generated >= 0.15, `Easy share is too low: ${JSON.stringify(difficultyCounts)}`);
assert.ok(difficultyCounts.MEDIUM / generated >= 0.30, `Medium share is too low: ${JSON.stringify(difficultyCounts)}`);
assert.ok(difficultyCounts.HARD / generated <= 0.35, `Hard share is inflated: ${JSON.stringify(difficultyCounts)}`);

const variableQls = [...perQlDifficulties].filter(([, values]) => values.size > 1).map(([qlId]) => qlId);
assert.ok(variableQls.length > 0, "No QL changes difficulty across generated instances");

console.log(JSON.stringify({
  generated,
  difficultyCounts,
  variableQlCount: variableQls.length,
  variableQls,
  benchmarks: {
    "COD-QL-006": checkpoints[0]!.generate("COD-QL-006", 1).difficulty,
    "COD-QL-012": checkpoints[0]!.generate("COD-QL-012", 1).difficulty,
    "COD-QL-018": checkpoints[0]!.generate("COD-QL-018", 1).difficulty,
    "COD-QL-049": checkpoints[1]!.generate("COD-QL-049", 1).difficulty,
    "COD-QL-143": checkpoints[5]!.generate("COD-QL-143", 1).difficulty,
  },
  verdict: "PASS — INSTANCE DIFFICULTY AND TEACHING EXPLANATIONS",
}, null, 2));
