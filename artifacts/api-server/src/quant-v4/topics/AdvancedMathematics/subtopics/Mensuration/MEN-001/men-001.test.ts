import { strict as assert } from "node:assert";
import { hasMen001ExplanationIllustration } from "./explanation-illustration";
import {
  getMen001ActiveCanonicalProblemIds,
  getMen001QuestionEntries,
  getMen001QuestionEntry,
  getMen001QuestionLanguageIds,
  validateMen001Libraries,
} from "./library";
import { generateMen001Parameters } from "./parameter-generator";
import { runMen001Pipeline } from "./pipeline";
import { getMen001SolveModeIds } from "./solve-mode-registry.all";
import { solveMen001 } from "./solver";
import type { Men001ActiveCanonicalProblemId } from "./types";

const libraryValidation = validateMen001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));
assert.ok(getMen001QuestionLanguageIds().length > 0);

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
  cpId: Men001ActiveCanonicalProblemId,
  qlId: string,
  values: ReturnType<typeof generateMen001Parameters>["values"],
) {
  const generated = generateMen001Parameters(cpId, {
    language: "en",
    questionLanguageId: qlId,
    seed: `fixed:${qlId}`,
  });
  return solveMen001({ ...generated, values, renderVariables: values as Record<string, number> });
}

assert.equal(fixedSolver("MEN-CP-001", "MEN-001-QL-001", { base: 12, height: 9 }).answer, "54 m²");
assert.equal(fixedSolver("MEN-CP-001", "MEN-001-QL-008", { sideA: 13, sideB: 14, sideC: 15 }).answer, "84 m²");
const equilateral = fixedSolver("MEN-CP-001", "MEN-001-QL-013", { side: 12 });
assert.equal(equilateral.exactAnswer.kind, "SURD");
assert.equal(equilateral.answer, "$$36\\sqrt{3}\\,\\text{cm}^{2}$$");
assert.equal(fixedSolver("MEN-CP-001", "MEN-001-QL-024", { base: 12, height: 9, ratePerSquareMetre: 20 }).answer, "₹1080");

assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-101", { length: 12, breadth: 8 }).answer, "96 m²");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-103", { length: 12, breadth: 8 }).answer, "40 m");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-104", { area: 96, breadth: 8 }).answer, "12 m");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-105", { perimeter: 40, length: 12 }).answer, "8 cm");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-106", { perimeter: 40, length: 12 }).answer, "96 m²");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-107", { diagonal: 15, length: 12 }).answer, "9 cm");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-108", { side: 8 }).answer, "64 cm²");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-110", { area: 144 }).answer, "12 cm");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-111", { diagonalCoefficient: 10 }).answer, "100 cm²");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-112", { diagonalCoefficient: 10 }).answer, "40 m");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-113", { base: 12, height: 8 }).answer, "96 m²");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-115", { area: 96, base: 12 }).answer, "8 m");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-116", { area: 96, height: 8 }).answer, "12 cm");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-117", { base: 12, adjacentSide: 10 }).answer, "44 cm");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-118", { diagonalA: 10, diagonalB: 24 }).answer, "120 cm²");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-119", { area: 120, diagonalA: 10 }).answer, "24 m");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-120", { diagonalA: 10, diagonalB: 24 }).answer, "13 cm");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-121", { diagonalA: 10, diagonalB: 24 }).answer, "52 m");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-122", { parallelSideA: 12, parallelSideB: 20, height: 8 }).answer, "128 m²");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-124", { area: 128, parallelSideA: 12, parallelSideB: 20 }).answer, "8 m");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-125", { area: 128, height: 8, parallelSideA: 12 }).answer, "20 cm");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-126", { diagonalA: 12, diagonalB: 18 }).answer, "108 cm²");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-127", { area: 108, diagonalA: 12 }).answer, "18 m");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-128", { diagonal: 16, perpendicularA: 7, perpendicularB: 9 }).answer, "128 m²");

const seenQlIds = new Set<string>();
const seenSolveModes = new Set<string>();
const seenUnits = new Set<string>();
const seenCpIds = new Set<string>();
const seenIllustrationKinds = new Set<string>();

for (const entry of getMen001QuestionEntries()) {
  const qlId = entry.qlId;
  for (let index = 0; index < 20; index += 1) {
    const seed = `men-001-runtime-proof:${qlId}:${index}`;
    const first = runMen001Pipeline(entry.cpId as Men001ActiveCanonicalProblemId, {
      language: "en",
      questionLanguageId: qlId,
      seed,
    });
    const second = runMen001Pipeline(entry.cpId as Men001ActiveCanonicalProblemId, {
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
      assert.equal(optionCarriesUnit(option, first.solver.unit), true, `${qlId} option has an incompatible unit: ${option}`);
    }
    assert.ok(
      Array.isArray(first.traceability.distractorStrategyIds) &&
        first.traceability.distractorStrategyIds.length === 3,
      `${qlId} must expose exactly three misconception strategies.`,
    );

    const shouldIllustrateExplanation = hasMen001ExplanationIllustration(first.solveMode);
    assert.equal(Boolean(first.explanation.illustration), shouldIllustrateExplanation, `${qlId} explanation illustration policy mismatch.`);
    assert.equal(first.traceability.diagramRequirement, "NONE", `${qlId} must not attach an ornamental diagram to the question stem.`);
    if (first.explanation.illustration) {
      const payload = JSON.stringify(first.explanation.illustration);
      assert.equal(/font[-_ ]?(family|size|weight)|typeface/i.test(payload), false);
      assert.equal(first.explanation.illustration.notToScale, true);
      assert.ok(first.explanation.illustration.accessibleText.length >= 30);
      assert.ok(Object.values(first.explanation.illustration.labels).every((label) => label.length > 0));
      seenIllustrationKinds.add(first.explanation.illustration.kind);
    }

    if (first.solveMode === "findTriangleAreaHeron") {
      assert.equal(first.options.includes(`${first.solver.workingValues.radicand} ${first.solver.unit}`), false);
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
    if (first.solveMode === "findRectangleOtherSideFromDiagonal") {
      assert.equal(first.explanation.illustration?.kind, "RECTANGLE_DIAGONAL_SPLIT");
    }
    if (["findRhombusSideFromDiagonals", "findRhombusPerimeterFromDiagonals"].includes(first.solveMode)) {
      assert.equal(first.explanation.illustration?.kind, "RHOMBUS_HALF_DIAGONALS");
    }
    if (first.solveMode === "findQuadrilateralAreaFromDiagonalPerpendiculars") {
      assert.equal(first.explanation.illustration?.kind, "QUADRILATERAL_DIAGONAL_PERPENDICULARS");
    }

    seenQlIds.add(first.questionLanguageId);
    seenSolveModes.add(first.solveMode);
    seenUnits.add(first.solver.unit);
    seenCpIds.add(first.canonicalProblemId);
  }
}

assert.deepEqual([...seenQlIds].sort(), getMen001QuestionLanguageIds().sort());
assert.deepEqual([...seenSolveModes].sort(), getMen001SolveModeIds().sort());
assert.deepEqual([...seenCpIds].sort(), getMen001ActiveCanonicalProblemIds().sort());
for (const kind of [
  "TRIANGLE_SIDE_LABELS",
  "ISOSCELES_ALTITUDE_SPLIT",
  "RECTANGLE_DIAGONAL_SPLIT",
  "RHOMBUS_HALF_DIAGONALS",
  "QUADRILATERAL_DIAGONAL_PERPENDICULARS",
]) {
  assert.equal(seenIllustrationKinds.has(kind), true, `${kind} explanation illustration not covered.`);
}
for (const unit of ["cm", "m", "cm²", "m²", "₹"]) {
  assert.equal(seenUnits.has(unit), true, `${unit} not covered`);
}
assert.throws(
  () => runMen001Pipeline("MEN-CP-001", { language: "hi", seed: "unsupported-language" }),
  /supports English only/,
);

const generatedCount = getMen001QuestionLanguageIds().length * 20;
console.log(`MEN-001 runtime-proof test passed for ${generatedCount} generated questions across ${getMen001ActiveCanonicalProblemIds().length} active CPs.`);
