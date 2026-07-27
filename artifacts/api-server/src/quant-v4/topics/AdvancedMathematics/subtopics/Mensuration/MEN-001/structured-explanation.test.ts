import { strict as assert } from "node:assert";
import { getMen001QuestionEntries } from "./library";
import { runMen001Pipeline } from "./pipeline";
import { getMen001SolveModeIds } from "./solve-mode-registry.all";
import {
  getMen001StructuredFormulaLines,
  getMen001StructuredFormulaModeIds,
} from "./structured-formula-plans";
import {
  isMen001LatexEquation,
  toMen001LatexEquation,
} from "./structured-math-latex";
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

assert.equal(
  toMen001LatexEquation("Aremaining = LB − (Lw₁ + Bw₂ − w₁w₂)"),
  "A_{\\text{remaining}} = L B - (L w_{1} + B w_{2} - w_{1}w_{2})",
  "Adjacent single-letter products must remain mathematical variables.",
);
assert.equal(
  toMen001LatexEquation("P₂ = kP₁"),
  "P_{2} = k P_{1}",
  "Scale-factor products must remain mathematical variables.",
);
assert.equal(
  toMen001LatexEquation("increase % = [(1 + p/100)² − 1] × 100"),
  "\\text{increase} \\% = [(1 + p/100)^{2} - 1] \\times 100",
  "Percentage-change variables must not be converted into prose.",
);
assert.equal(
  toMen001LatexEquation("n = 2640 ÷ 220 = 12"),
  "n = 2640 \\div 220 = 12",
  "Count variables must remain mathematical variables.",
);
assert.ok(
  toMen001LatexEquation("lving the resulting quadratic gives w = 4").startsWith("\\text{Solving}"),
  "The legacy prefix-removal artefact must be repaired for display.",
);

const forbiddenNotation = /\\text\{(?:LB|Lw|Bw|kP|p|n|lving)\}/;

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
      getMen001StructuredFormulaLines(question.solveMode).map(toMen001LatexEquation),
      `${entry.qlId} must render the authored formula plan as MathJax-ready LaTeX for ${question.solveMode}.`,
    );

    for (const section of question.explanation.sections) {
      assert.ok(
        section.equations.every(isMen001LatexEquation),
        `${entry.qlId} contains a non-LaTeX ${section.kind} equation.`,
      );
      assert.ok(
        section.equations.every((equation) => !forbiddenNotation.test(equation)),
        `${entry.qlId} converts a mathematical variable or truncated narrative into prose notation.`,
      );
    }

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
    assert.deepEqual(
      finalAnswer?.equations,
      [toMen001LatexEquation(question.answer)],
      `${entry.qlId} must render the canonical final answer as LaTeX.`,
    );
  }
}

console.log(
  `MEN-001 structured explanation audit passed for ${getMen001QuestionEntries().length} QLs, ${getMen001SolveModeIds().length} solve modes and three deterministic states each with MathJax-ready equations and preserved mathematical variables.`,
);
