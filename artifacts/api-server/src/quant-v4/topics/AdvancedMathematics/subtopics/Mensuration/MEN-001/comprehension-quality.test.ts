import assert from "node:assert/strict";
import { getMen001QuestionEntries } from "./library";
import { runMen001Pipeline } from "./pipeline";
import type { Men001ActiveCanonicalProblemId, Men001QuestionPackage } from "./types";

const ROBOTIC_LANGUAGE = /\b(?:governing relation|required stage|rearrange the relevant|rearrange the governing|isolate the|fixes the|supplies the complete boundary|requested result|geometric quantity|evaluate the displayed|this normally overstates|this normally understates|applies the mistaken operation|misconception strategy)\b/i;
const CROSS_FAMILY_BOILERPLATE = /(?:Substitute the supplied values into the formula|Use the perpendicular measurements found above in the correct area formula|Put the known values into the formula, then solve to find the required .* first, then substitute the measurements once)/i;
const SIDE_VALUE_KEY = /^(?:side|sideA|sideB|sideC|legA|legB|height|halfBase|base|equalSide|hypotenuse|diagonal|diagonalA|diagonalB|halfDiagonalA|halfDiagonalB|length|breadth|ratioA|ratioB|ratioC)$/i;
const PYTHAGOREAN_MODE = /RightTriangle|Isosceles|Pythag|Diagonal|Rhombus|TriangleAreaFromSideRatio/i;

function generate(cpId: Men001ActiveCanonicalProblemId, qlId: string, seed: string) {
  return runMen001Pipeline(cpId, {
    language: "en",
    questionLanguageId: qlId,
    seed,
  });
}

function hasTriplet(question: Men001QuestionPackage) {
  if (!PYTHAGOREAN_MODE.test(question.solveMode)) return false;
  const values = Object.entries({
    ...question.parameters.values,
    ...question.solver.workingValues,
  })
    .filter(([key, value]) => SIDE_VALUE_KEY.test(key) && typeof value === "number" && Number.isInteger(value) && value > 0)
    .map(([, value]) => value as number);
  const unique = [...new Set(values)];
  for (let i = 0; i < unique.length; i += 1) {
    for (let j = i + 1; j < unique.length; j += 1) {
      for (let k = j + 1; k < unique.length; k += 1) {
        const [a, b, c] = [unique[i]!, unique[j]!, unique[k]!].sort((left, right) => left - right);
        if (a ** 2 + b ** 2 === c ** 2) return true;
      }
    }
  }
  return false;
}

let audited = 0;
let tripletStates = 0;
for (const entry of getMen001QuestionEntries()) {
  for (let sample = 0; sample < 3; sample += 1) {
    const question = generate(
      entry.cpId as Men001ActiveCanonicalProblemId,
      entry.qlId,
      `men-001-comprehension:${entry.qlId}:${sample}`,
    );
    assert.equal(
      question.validation.valid,
      true,
      question.validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join("; "),
    );

    const keyRule = question.explanation.sections.find((section) => section.kind === "KEY_RULE");
    const steps = question.explanation.sections.filter((section) => section.kind === "STEP");
    const shortcut = question.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT");
    const traps = question.explanation.sections.find((section) => section.kind === "COMMON_TRAPS");

    assert.equal(keyRule?.paragraphs.length, 1, `${entry.qlId} must have one focused Core Concept paragraph.`);
    assert.ok((keyRule?.paragraphs[0]?.length ?? 0) >= 35, `${entry.qlId} Core Concept is too thin.`);
    assert.ok(steps.length > 0, `${entry.qlId} must contain worked steps.`);
    assert.ok(shortcut, `${entry.qlId} must contain an exam shortcut.`);
    assert.equal(traps?.paragraphs.length, 3, `${entry.qlId} must explain all three wrong options.`);

    for (const section of question.explanation.sections) {
      for (const paragraph of section.paragraphs) {
        assert.ok(!ROBOTIC_LANGUAGE.test(paragraph), `${entry.qlId} contains robotic prose: ${paragraph}`);
        assert.ok(
          !CROSS_FAMILY_BOILERPLATE.test(paragraph),
          `${entry.qlId} contains cross-family boilerplate instead of solve-specific guidance: ${paragraph}`,
        );
      }
    }

    for (const step of steps) {
      assert.ok(step.paragraphs.length > 0, `${entry.qlId} step '${step.title}' needs a direct teacher explanation.`);
      assert.ok(
        step.paragraphs[0]!.length >= 25,
        `${entry.qlId} step '${step.title}' does not explain what to do and why.`,
      );
    }

    for (const paragraph of traps?.paragraphs ?? []) {
      assert.match(paragraph, /^Option [A-D] \(.+\): Common mistake:/, `${entry.qlId} trap must name the real option and explain the mistake plainly.`);
      assert.ok(
        /(?:Remember|Use|Do not|Don't|Check|Continue|Divide|Multiply|Subtract|Add|Put|Keep|Take|Find|First|Area conversion)/i.test(paragraph),
        `${entry.qlId} trap must tell the learner how to correct the mistake: ${paragraph}`,
      );
    }

    if (hasTriplet(question)) {
      tripletStates += 1;
      assert.ok(
        shortcut?.paragraphs.some((paragraph) => /Pythagorean Triplet/i.test(paragraph)),
        `${entry.qlId} contains a Pythagorean triplet but does not name it.`,
      );
    }

    audited += 1;
  }
}

const inverseTriangle = generate("MEN-CP-001", "MEN-001-QL-004", "men-001-structured-review:MEN-001-QL-004");
const inverseHeightStep = inverseTriangle.explanation.sections.find(
  (section) => section.kind === "STEP" && section.title === "Find the Height",
);
assert.ok(inverseHeightStep, "QL-004 must contain a Find the Height step.");
assert.ok(
  inverseHeightStep.paragraphs.some((paragraph) => /multiply the area by 2|double the area/i.test(paragraph)) &&
    inverseHeightStep.paragraphs.some((paragraph) => /divide by the base/i.test(paragraph)),
  "QL-004 must explain why h = 2A/b, not merely display the rearranged equation.",
);

const isosceles = generate("MEN-CP-001", "MEN-001-QL-017", "men-001-structured-review:MEN-001-QL-017");
assert.match(isosceles.explanation.sections[0]!.paragraphs[0]!, /cuts? the base into two equal halves|two equal halves/i);
assert.match(isosceles.explanation.sections[0]!.paragraphs[0]!, /right-angled triangles/i);
assert.ok(isosceles.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT")?.paragraphs.some((paragraph) => /Pythagorean Triplet/i.test(paragraph)));
assert.ok(isosceles.explanation.sections.find((section) => section.kind === "COMMON_TRAPS")?.paragraphs.some((paragraph) => /height must meet the base at 90°/i.test(paragraph)));

const ratio = generate("MEN-CP-001", "MEN-001-QL-020", "men-001-structured-review:MEN-001-QL-020");
assert.match(ratio.explanation.sections[0]!.paragraphs[0]!, /5\s*:\s*12\s*:\s*13/);
assert.match(ratio.explanation.sections[0]!.paragraphs[0]!, /right-angled/i);
assert.ok(ratio.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT")?.paragraphs.some((paragraph) => /Pythagorean Triplet/i.test(paragraph)));

const conversion = generate("MEN-CP-006", "MEN-001-QL-403", "men-001-structured-review:MEN-001-QL-403");
assert.match(conversion.explanation.sections[0]!.paragraphs[0]!, /100 cm × 100 cm = 10,000 cm²/);
const conversionSteps = conversion.explanation.sections
  .filter((section) => section.kind === "STEP")
  .flatMap((section) => section.paragraphs)
  .join(" ");
assert.match(conversionSteps, /divide(?: the cm² value)? by 10,000/i);
assert.ok(!/perpendicular measurements/i.test(conversionSteps));
assert.ok(conversion.explanation.sections.find((section) => section.kind === "COMMON_TRAPS")?.paragraphs.some((paragraph) => /100² = 10,000/i.test(paragraph)));

const percentage = generate("MEN-CP-006", "MEN-001-QL-414", "men-001-structured-review:MEN-001-QL-414");
assert.match(percentage.explanation.sections[0]!.paragraphs[0]!, /length × breadth/i);
assert.match(percentage.explanation.sections[0]!.paragraphs[0]!, /multiply|compounding/i);
assert.ok(percentage.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT")?.paragraphs.some((paragraph) => /p²\/100|compounding/i.test(paragraph)));

const wire = generate("MEN-CP-006", "MEN-001-QL-436", "men-001-structured-review:MEN-001-QL-436");
assert.match(wire.explanation.sections[0]!.paragraphs[0]!, /no wire is added or removed/i);
assert.match(wire.explanation.sections[0]!.paragraphs[0]!, /circumference.*perimeter/i);
assert.deepEqual(
  wire.explanation.sections.filter((section) => section.kind === "STEP").map((step) => step.title),
  ["Find the Wire Length", "Find the Side of the Square", "Calculate the Enclosed Area"],
);
assert.ok(wire.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT")?.paragraphs.some((paragraph) => /s = πr\/2/.test(paragraph)));
assert.ok(wire.explanation.sections.find((section) => section.kind === "COMMON_TRAPS")?.paragraphs.some((paragraph) => /original circle/i.test(paragraph) && /Do not stop/i.test(paragraph)));

console.log(`MEN-001 comprehension audit passed for ${audited} generated explanations, including ${tripletStates} states with explicitly named Pythagorean Triplets and no cross-family boilerplate.`);
