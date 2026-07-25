import { strict as assert } from "node:assert";
import { getMen001QuestionEntries } from "./library";
import { runMen001Pipeline } from "./pipeline";
import { getMen001SolveModeIds } from "./solve-mode-registry.all";
import {
  getMen001StructuredFormulaLines,
  getMen001StructuredFormulaModeIds,
} from "./structured-formula-plans";
import type { Men001ActiveCanonicalProblemId } from "./types";

assert.deepEqual(
  getMen001StructuredFormulaModeIds().sort(),
  getMen001SolveModeIds().sort(),
  "Every active MEN-001 solve mode must have exactly one structured formula plan.",
);

for (const mode of getMen001SolveModeIds()) {
  const formulas = getMen001StructuredFormulaLines(mode);
  assert.ok(formulas.length > 0, `${mode} must declare at least one formula.`);
  assert.ok(
    formulas.every((formula) => formula.includes("=")),
    `${mode} contains a formula without an explicit mathematical relation.`,
  );
}

for (const entry of getMen001QuestionEntries()) {
  for (let sample = 0; sample < 3; sample += 1) {
    const question = runMen001Pipeline(
      entry.cpId as Men001ActiveCanonicalProblemId,
      {
        language: "en",
        questionLanguageId: entry.qlId,
        seed: `men-001-structured-audit:${entry.qlId}:${sample}`,
      },
    );
    const keyRule = question.explanation.sections[0];
    assert.equal(keyRule?.kind, "KEY_RULE");
    assert.deepEqual(
      keyRule?.equations,
      getMen001StructuredFormulaLines(question.solveMode),
      `${entry.qlId} must render the authored formula plan for ${question.solveMode}.`,
    );

    const steps = question.explanation.sections.filter(
      (section) => section.kind === "STEP",
    );
    assert.ok(steps.length > 0, `${entry.qlId} must contain worked steps.`);
    steps.forEach((step, index) => {
      assert.equal(step.stepNumber, index + 1);
      assert.ok(step.title.trim().length > 0);
      assert.ok(step.paragraphs.length > 0 || step.equations.length > 0);
      if (index > 0) {
        assert.notEqual(
          step.title,
          steps[index - 1]!.title,
          `${entry.qlId} repeats an adjacent step title.`,
        );
      }
    });

    const finalAnswer = question.explanation.sections.at(-1);
    assert.equal(finalAnswer?.kind, "FINAL_ANSWER");
    assert.ok(finalAnswer?.equations.length === 1);
  }
}

console.log(
  `MEN-001 structured explanation audit passed for ${getMen001QuestionEntries().length} QLs, ${getMen001SolveModeIds().length} solve modes and three deterministic states each.`,
);
