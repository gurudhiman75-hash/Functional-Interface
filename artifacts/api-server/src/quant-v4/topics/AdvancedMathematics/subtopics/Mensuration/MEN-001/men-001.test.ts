import { strict as assert } from "node:assert";
import { hasMen001ExplanationIllustration } from "./explanation-illustration";
import {
  getMen001QuestionLanguageIds,
  validateMen001Libraries,
} from "./library";
import { generateMen001Parameters } from "./parameter-generator";
import { runMen001Pipeline } from "./pipeline";
import { solveMen001 } from "./solver";

const libraryValidation = validateMen001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));
assert.equal(getMen001QuestionLanguageIds().length, 24);

const GENERIC_FALLBACK_OPTIONS = new Set([
  "Cannot be determined",
  "Both are equal",
  "None of these",
  "Insufficient information",
]);

function optionCarriesUnit(option: string, unit: string) {
  if (unit === "₹") return option.startsWith("₹");
  if (unit === "cm²") return option.includes("cm²") || option.includes("\\text{cm}^{2}");
  if (unit === "m²") return option.includes("m²") || option.includes("\\text{m}^{2}");
  return option.endsWith(` ${unit}`);
}

function fixedSolver(
  qlId: string,
  values: ReturnType<typeof generateMen001Parameters>["values"],
) {
  const generated = generateMen001Parameters("MEN-CP-001", {
    language: "en",
    questionLanguageId: qlId,
    seed: `fixed:${qlId}`,
  });
  return solveMen001({ ...generated, values, renderVariables: values as Record<string, number> });
}

assert.equal(fixedSolver("MEN-001-QL-001", { base: 12, height: 9 }).answer, "54 m²");
assert.equal(fixedSolver("MEN-001-QL-004", { area: 60, base: 15 }).answer, "8 m");
assert.equal(fixedSolver("MEN-001-QL-006", { area: 60, height: 8 }).answer, "15 m");
assert.equal(fixedSolver("MEN-001-QL-008", { sideA: 13, sideB: 14, sideC: 15 }).answer, "84 m²");
assert.equal(fixedSolver("MEN-001-QL-011", { legA: 9, legB: 12 }).answer, "54 m²");

const equilateral = fixedSolver("MEN-001-QL-013", { side: 12 });
assert.equal(equilateral.exactAnswer.kind, "SURD");
assert.equal(equilateral.answer, "$$36\\sqrt{3}\\,\\text{cm}^{2}$$");

assert.equal(fixedSolver("MEN-001-QL-015", { areaCoefficient: 36 }).answer, "36 m");
assert.equal(fixedSolver("MEN-001-QL-016", { perimeter: 36 }).answer, "12 cm");
assert.equal(fixedSolver("MEN-001-QL-017", { equalSide: 13, base: 10 }).answer, "60 m²");
assert.equal(fixedSolver("MEN-001-QL-019", { equalSide: 13, base: 10 }).answer, "12 m");
assert.equal(fixedSolver("MEN-001-QL-020", { ratioA: 3, ratioB: 4, ratioC: 5, perimeter: 24 }).answer, "24 m²");
assert.equal(fixedSolver("MEN-001-QL-022", { ratioA: 3, ratioB: 4, ratioC: 5, perimeter: 24 }).answer, "10 m");
assert.equal(fixedSolver("MEN-001-QL-023", { ratioA: 3, ratioB: 4, ratioC: 5, perimeter: 24 }).answer, "6 cm");
assert.equal(fixedSolver("MEN-001-QL-024", { base: 12, height: 9, ratePerSquareMetre: 20 }).answer, "₹1080");

const seenQlIds = new Set<string>();
const seenSolveModes = new Set<string>();
const seenUnits = new Set<string>();
const seenIllustrationKinds = new Set<string>();
for (const qlId of getMen001QuestionLanguageIds()) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `men-001-runtime-proof:${qlId}:${index}`;
    const first = runMen001Pipeline("MEN-CP-001", {
      language: "en",
      questionLanguageId: qlId,
      seed,
    });
    const second = runMen001Pipeline("MEN-CP-001", {
      language: "en",
      questionLanguageId: qlId,
      seed,
    });
    assert.equal(
      first.validation.valid,
      true,
      first.validation.checks
        .filter((item) => !item.passed)
        .map((item) => `${item.name}: ${item.message}`)
        .join("; "),
    );
    assert.equal(first.stem, second.stem);
    assert.equal(first.answer, second.answer);
    assert.deepEqual(first.options, second.options);
    assert.equal(first.correctIndex, second.correctIndex);
    assert.deepEqual(first.explanation, second.explanation);
    assert.equal(first.reasoningGraph.nodes.length, 3);
    assert.ok(first.explanation.lines.length >= 5);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.maturity, "RUNTIME_PROOF");
    assert.equal(
      first.options[first.correctIndex],
      first.solver.canonicalAnswer.kind === "symbolic"
        ? first.solver.canonicalAnswer.rendered
        : first.solver.canonicalAnswer.display,
    );
    assert.equal(
      first.options.some((option) => GENERIC_FALLBACK_OPTIONS.has(option)),
      false,
      `${qlId} used a generic option fallback.`,
    );
    for (const option of first.options) {
      assert.equal(
        optionCarriesUnit(option, first.solver.unit),
        true,
        `${qlId} option has an incompatible unit: ${option}`,
      );
    }
    assert.ok(
      Array.isArray(first.traceability.distractorStrategyIds) &&
        first.traceability.distractorStrategyIds.length === 3,
      `${qlId} must expose exactly three misconception strategies.`,
    );

    const shouldIllustrateExplanation = hasMen001ExplanationIllustration(first.solveMode);
    assert.equal(
      Boolean(first.explanation.illustration),
      shouldIllustrateExplanation,
      `${qlId} explanation illustration policy mismatch.`,
    );
    assert.equal(
      first.traceability.diagramRequirement,
      "NONE",
      `${qlId} must not attach an ornamental diagram to the question stem.`,
    );
    if (first.explanation.illustration) {
      const payload = JSON.stringify(first.explanation.illustration);
      assert.equal(/font[-_ ]?(family|size|weight)|typeface/i.test(payload), false);
      assert.equal(first.explanation.illustration.notToScale, true);
      assert.ok(first.explanation.illustration.accessibleText.length >= 30);
      assert.ok(Object.values(first.explanation.illustration.labels).every((label) => label.length > 0));
      seenIllustrationKinds.add(first.explanation.illustration.kind);
    }

    if (first.solveMode === "findTriangleAreaHeron") {
      assert.equal(
        first.options.includes(`${first.solver.workingValues.radicand} ${first.solver.unit}`),
        false,
        `${qlId} must not expose the unsquared Heron radicand as an option.`,
      );
      assert.equal(first.explanation.illustration?.kind, "TRIANGLE_SIDE_LABELS");
    }
    if (first.solveMode === "findTriangleAreaFromSideRatioAndPerimeter") {
      assert.equal(first.explanation.illustration?.kind, "TRIANGLE_SIDE_LABELS");
      assert.ok(first.explanation.lines.some((line) => line.includes("Heron's formula")));
      assert.ok(first.explanation.lines.some((line) => line.includes("Substitution gives")));
    }
    if (["findIsoscelesTriangleArea", "findIsoscelesHeight"].includes(first.solveMode)) {
      assert.equal(first.explanation.illustration?.kind, "ISOSCELES_ALTITUDE_SPLIT");
    }
    if (first.solveMode === "findTriangularPlotCost") {
      const weakFallback = Number(first.solver.workingValues.cost) + Number(first.solver.workingValues.ratePerSquareMetre);
      assert.equal(
        first.options.includes(`₹${weakFallback}`),
        false,
        `${qlId} must not use cost-plus-rate as a distractor.`,
      );
    }
    seenQlIds.add(first.questionLanguageId);
    seenSolveModes.add(first.solveMode);
    seenUnits.add(first.solver.unit);
  }
}

assert.deepEqual([...seenQlIds].sort(), getMen001QuestionLanguageIds().sort());
assert.equal(seenSolveModes.size, 14);
assert.deepEqual([...seenIllustrationKinds].sort(), [
  "ISOSCELES_ALTITUDE_SPLIT",
  "TRIANGLE_SIDE_LABELS",
]);
for (const unit of ["cm", "m", "cm²", "m²", "₹"]) {
  assert.equal(seenUnits.has(unit), true, `${unit} not covered`);
}
assert.throws(
  () => runMen001Pipeline("MEN-CP-001", { language: "hi", seed: "unsupported-language" }),
  /supports English only/,
);

console.log("MEN-001 CP-001 runtime-proof test passed for 480 generated questions with explanation-only illustrations where needed.");
