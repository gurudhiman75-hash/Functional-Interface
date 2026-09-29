import assert from "node:assert/strict";
import { test } from "node:test";
import { generateClockQuestion } from "./runtime/generator";
import {
  CLK_001_AUTHORING_TASKS_BY_QL_V1,
} from "./authoring-variants-v1";
import { CLK_001_PERMANENT_CONTRACTS } from "./permanent-contracts";
import { generateClk001QuestionStudioBatch } from "./question-studio-integration";

const VISUAL_AUTHORING_TASKS = new Set([
  "READ_TIME_FROM_DIAGRAM",
  "SELECT_DIAGRAM_FOR_TIME",
  "READ_ANGLE_TYPE_FROM_DIAGRAM",
  "IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM",
]);

const BLOCKED_LOCALIZATION_RESIDUE = /\b(?:rate|strike|strikes|gap|gaps|duration|durations|timeline|anchor|actual|displayed|clock|answer|minutes?|hours?|seconds?)\b/i;

function publicDifficultyFromScore(score: number): "Easy" | "Medium" | "Hard" {
  return score <= 2 ? "Easy" : score <= 4 ? "Medium" : "Hard";
}

test("Question Studio exposes generated item-level difficulty, not QL baseline", async () => {
  for (const contract of CLK_001_PERMANENT_CONTRACTS) {
    const pool = CLK_001_AUTHORING_TASKS_BY_QL_V1[contract.qlId];
    const count = Math.max(4, pool.length * 2);
    const result = await generateClk001QuestionStudioBatch({
      packageId: "CLK-001",
      canonicalProblemId: contract.qlId,
      language: "en",
      count,
      seed: "clk-wave6-item-difficulty-" + contract.qlId,
    });
    for (const question of result.questions) {
      const trace = question.traceability as any;
      const expected = publicDifficultyFromScore(Number(trace.difficultyItemScore));
      assert.equal(question.difficulty, expected);
      assert.equal(question.difficultyLabel, expected);
      assert.equal(trace.difficultyAuthority, "ITEM_LEVEL_V1");
      assert.ok(Array.isArray(trace.difficultyFactors));
    }
  }
});

test("Easy Medium Hard filters return only actual item-level matches", async () => {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const result = await generateClk001QuestionStudioBatch({
      packageId: "CLK-001",
      language: "en",
      difficulty,
      count: 12,
      seed: "clk-wave6-filter-" + difficulty,
    });
    assert.equal(result.questions.length, 12);
    assert.equal(result.questions.every((question) => question.difficulty === difficulty), true);
  }
});

test("all effective authoring tasks have exam-safe distractors and visual-task-only media", () => {
  for (const contract of CLK_001_PERMANENT_CONTRACTS) {
    for (const taskId of CLK_001_AUTHORING_TASKS_BY_QL_V1[contract.qlId]) {
      for (let seed = 0; seed < 8; seed += 1) {
        const question = generateClockQuestion({
          taskId,
          seed: "clk-wave6-quality-" + taskId + "-" + seed,
          locale: "en-IN",
          correctOptionIndex: (seed % 4) as 0 | 1 | 2 | 3,
        });

        assert.equal(question.options.length, 4);
        assert.equal(new Set(question.options.map((option) => option.display)).size, 4);
        assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
        assert.equal(question.options[question.correctOptionIndex]!.semanticKey, question.answer.semanticKey);

        const wrong = question.options.filter((option) => !option.isCorrect);
        assert.equal(wrong.length, 3);
        assert.equal(wrong.every((option) => option.reasonCode.length > 0), true);
        assert.equal(wrong.every((option) => option.reason.trim().length > 8), true);
        const genericFallbacks = wrong.filter((option) =>
          option.reasonCode.includes("FALLBACK") ||
          option.semanticKey.includes("FALLBACK")
        );
        assert.ok(genericFallbacks.length <= 1, taskId + " used " + genericFallbacks.length + " generic fallback distractors");

        if (question.media) {
          assert.ok(VISUAL_AUTHORING_TASKS.has(taskId), taskId + " leaked question media outside visual literacy");
        }
      }
    }
  }
});

test("Hindi and Punjabi learner surfaces contain no English clock-jargon residue", async () => {
  for (const contract of CLK_001_PERMANENT_CONTRACTS) {
    const pool = CLK_001_AUTHORING_TASKS_BY_QL_V1[contract.qlId];
    const count = pool.length * 2;
    for (const language of ["hi", "pa"] as const) {
      const result = await generateClk001QuestionStudioBatch({
        packageId: "CLK-001",
        canonicalProblemId: contract.qlId,
        language,
        count,
        seed: "clk-wave6-localization-" + contract.qlId,
      });

      for (const question of result.questions) {
        const text = String(question.stem) + "\n" + String(question.explanation);
        assert.equal(
          BLOCKED_LOCALIZATION_RESIDUE.test(text),
          false,
          contract.qlId + "/" + String((question.traceability as any).authoringTaskId) + "/" + language + " contains English residue: " + text,
        );
        if (language === "hi") assert.match(String(question.stem), /[ऀ-ॿ]/u);
        if (language === "pa") assert.match(String(question.stem), /[਀-੿]/u);
      }
    }
  }
});
