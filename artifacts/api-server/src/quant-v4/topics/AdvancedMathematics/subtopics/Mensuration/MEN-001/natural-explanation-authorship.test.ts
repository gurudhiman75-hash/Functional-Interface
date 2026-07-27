import { strict as assert } from "node:assert";
import {
  getMen001QuestionEntries,
  getMen001QuestionLanguageIds,
} from "./library";
import {
  getAllMen001NaturalExplanationProfileIds,
} from "./natural-explanation-authorship.all";
import {
  getMen001Cp006FormulaLineIds,
} from "./natural-explanation-formula.cp006";
import { runMen001Pipeline } from "./pipeline";
import { assertMen001StructuredExplanation } from "./structured-explanation-display-assertion";
import { toMen001LatexEquation } from "./structured-math-latex";
import type { Men001ActiveCanonicalProblemId } from "./types";

function proseSignature(lines: readonly string[]) {
  return lines
    .join(" ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/₹\/m²|₹\/m|cm²|m²|cm|revolutions|tiles|degrees?/gi, " ")
    .replace(/[0-9π√²°₹×÷=+−\-/:()[\]{}.,;!?]/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const qlIds = getMen001QuestionLanguageIds().sort();
const profileIds = getAllMen001NaturalExplanationProfileIds().sort();
assert.deepEqual(
  profileIds,
  qlIds,
  "Every active QL must have exactly one natural explanation profile.",
);

const cp006QlIds = getMen001QuestionEntries()
  .filter((entry) => entry.cpId === "MEN-CP-006")
  .map((entry) => entry.qlId)
  .sort();
assert.deepEqual(
  getMen001Cp006FormulaLineIds().sort(),
  cp006QlIds,
  "Every active CP-006 QL must have exactly one explicit formula line.",
);

const signatureOwner = new Map<string, string>();
const stepCountDistribution = new Map<number, number>();
const roboticOpening = /^(Check:|Substitution:|Calculation:|Therefore,|Hence,|Thus,|So,|The required quantity is|This value measures|The result is)/i;

for (const entry of getMen001QuestionEntries()) {
  for (let sample = 0; sample < 3; sample += 1) {
    const question = runMen001Pipeline(
      entry.cpId as Men001ActiveCanonicalProblemId,
      {
        language: "en",
        questionLanguageId: entry.qlId,
        seed: `men-001-authorship:${entry.qlId}:${sample}`,
      },
    );
    assert.equal(
      question.validation.valid,
      true,
      question.validation.checks
        .filter((item) => !item.passed)
        .map((item) => `${item.name}: ${item.message}`)
        .join("; "),
    );
    assert.equal(
      question.explanation.lines.length,
      4,
      `${entry.qlId} must expose exactly four canonical learner-facing blocks.`,
    );
    assert.equal(
      question.explanation.lines.some((line) => roboticOpening.test(line.replace(/^### [^\n]+\n+/, ""))),
      false,
      `${entry.qlId} still contains a robotic explanation opening.`,
    );
    assert.ok(
      question.explanation.lines.some(
        (line) => /\d/.test(line) && /[=×÷+−\-√²π]/.test(line),
      ),
      `${entry.qlId} lost its worked arithmetic.`,
    );

    assertMen001StructuredExplanation(question.explanation, question.answer);
    const keyRule = question.explanation.sections[0];
    assert.equal(keyRule?.kind, "KEY_RULE");
    assert.ok(
      keyRule?.equations.some((equation) => equation.includes("=")),
      `${entry.qlId} Key Rule must show an explicit governing formula.`,
    );
    assert.equal(
      question.explanation.sections.some((section) => section.kind === "FINAL_ANSWER"),
      false,
      `${entry.qlId} must not expose a separate Final Answer section.`,
    );

    const structuredSteps = question.explanation.sections.filter(
      (section) => section.kind === "STEP",
    );
    assert.ok(
      structuredSteps.every(
        (step) => step.paragraphs.length > 0 || step.equations.length > 0,
      ),
      `${entry.qlId} contains an empty structured step.`,
    );
    assert.ok(
      structuredSteps.every(
        (step, index) => index === 0 || step.title !== structuredSteps[index - 1]!.title,
      ),
      `${entry.qlId} repeats an adjacent structured step title.`,
    );
    const canonicalAnswer = toMen001LatexEquation(question.answer);
    assert.ok(
      structuredSteps.at(-1)?.equations.some((equation) => equation.includes(canonicalAnswer)),
      `${entry.qlId} must place its final result inside the last worked step.`,
    );

    if (entry.solveMode === "findRectangleSemicircleCompositeArea") {
      assert.deepEqual(
        structuredSteps.map((step) => step.title),
        [
          "Area of the Rectangle",
          "Find the Semicircle's Radius",
          "Area of the Semicircle",
          "Add the Two Areas",
        ],
        `${entry.qlId} must retain the full composite-area reasoning sequence.`,
      );
    }

    if (sample === 0) {
      const signature = proseSignature(question.explanation.lines);
      assert.ok(signature.length >= 35, `${entry.qlId} has too little natural prose.`);
      const previousSignature = signatureOwner.get(signature);
      assert.equal(
        previousSignature,
        undefined,
        `${entry.qlId} duplicates the normalized prose signature of ${previousSignature}.`,
      );
      signatureOwner.set(signature, entry.qlId);
      stepCountDistribution.set(
        structuredSteps.length,
        (stepCountDistribution.get(structuredSteps.length) ?? 0) + 1,
      );
    }
  }
}

assert.equal(signatureOwner.size, qlIds.length);
assert.ok(
  stepCountDistribution.size >= 2,
  "The worked-solution tier should retain a need-based number of steps.",
);
console.log(
  `MEN-001 natural explanation authorship passed for ${qlIds.length} QLs with ${signatureOwner.size} unique normalized prose signatures and exactly four canonical learner-facing blocks across three states each.`,
);
console.log(
  `Structured step-count distribution: ${JSON.stringify(Object.fromEntries([...stepCountDistribution].sort(([a], [b]) => a - b)))}`,
);
