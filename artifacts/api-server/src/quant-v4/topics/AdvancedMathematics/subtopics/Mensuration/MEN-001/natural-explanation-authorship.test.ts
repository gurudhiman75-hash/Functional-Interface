import { strict as assert } from "node:assert";
import {
  getMen001QuestionEntries,
  getMen001QuestionLanguageIds,
} from "./library";
import {
  getAllMen001NaturalExplanationProfileIds,
} from "./natural-explanation-authorship.all";
import {
  getMen001Cp006FormulaLine,
  getMen001Cp006FormulaLineIds,
} from "./natural-explanation-formula.cp006";
import { runMen001Pipeline } from "./pipeline";
import { assertMen001StructuredExplanation } from "./structured-explanation-display-assertion";
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
const lineCountDistribution = new Map<number, number>();
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
    assert.ok(
      question.explanation.lines.length >= 3 &&
        question.explanation.lines.length <= 9,
      `${entry.qlId} should use only as many compatibility lines as its reasoning needs.`,
    );
    assert.equal(
      question.explanation.lines.some((line) => roboticOpening.test(line)),
      false,
      `${entry.qlId} still contains a robotic explanation label or conclusion.`,
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
    const finalSection = question.explanation.sections.at(-1);
    assert.equal(finalSection?.kind, "FINAL_ANSWER");
    assert.equal(finalSection?.equations.length, 1);

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

    if (entry.cpId === "MEN-CP-006") {
      assert.equal(
        question.explanation.lines[1],
        getMen001Cp006FormulaLine(entry.qlId),
        `${entry.qlId} must show its governing formula immediately after the contextual opening.`,
      );
      assert.ok(
        question.explanation.lines[1]!.includes("="),
        `${entry.qlId} formula line must contain an explicit mathematical relation.`,
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
      const lineCount = question.explanation.lines.length;
      lineCountDistribution.set(
        lineCount,
        (lineCountDistribution.get(lineCount) ?? 0) + 1,
      );
      stepCountDistribution.set(
        structuredSteps.length,
        (stepCountDistribution.get(structuredSteps.length) ?? 0) + 1,
      );
    }
  }
}

assert.equal(signatureOwner.size, qlIds.length);
assert.ok(
  lineCountDistribution.size >= 3,
  "The chapter should not force every compatibility explanation into the same line structure.",
);
assert.ok(
  stepCountDistribution.size >= 2,
  "The structured explanations should use a need-based number of steps.",
);
console.log(
  `MEN-001 natural explanation authorship passed for ${qlIds.length} QLs with ${signatureOwner.size} unique normalized prose signatures across three states each.`,
);
console.log(
  `Compatibility line-count distribution: ${JSON.stringify(Object.fromEntries([...lineCountDistribution].sort(([a], [b]) => a - b)))}`,
);
console.log(
  `Structured step-count distribution: ${JSON.stringify(Object.fromEntries([...stepCountDistribution].sort(([a], [b]) => a - b)))}`,
);
