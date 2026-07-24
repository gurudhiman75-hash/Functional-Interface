import { strict as assert } from "node:assert";
import {
  getMen001QuestionEntries,
  getMen001QuestionLanguageIds,
  validateMen001Libraries,
} from "./library";
import { generateMen001Parameters } from "./parameter-generator";
import { runMen001Pipeline } from "./pipeline";
import { getMen001SolveModeIds, type Men001SolveMode } from "./solve-mode-registry";
import { solveMen001 } from "./solver";

const libraryValidation = validateMen001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

const entries = getMen001QuestionEntries();
const qlIds = getMen001QuestionLanguageIds();
assert.ok(entries.length > 0, "MEN-001 must expose at least one active QL.");
assert.deepEqual([...new Set(qlIds)], qlIds, "MEN-001 QL IDs must be unique.");
assert.deepEqual(
  [...new Set(entries.map((entry) => entry.solveMode))].sort(),
  getMen001SolveModeIds().sort(),
  "Every registered solve mode must be represented by at least one active QL and vice versa.",
);

function optionCarriesUnit(option: string, unit: string) {
  if (unit === "₹") return option.startsWith("₹");
  if (unit === "cm²") return option.includes("cm²") || option.includes("\\text{cm}^{2}");
  if (unit === "m²") return option.includes("m²") || option.includes("\\text{m}^{2}");
  return option.endsWith(` ${unit}`);
}

function qlForMode(solveMode: Men001SolveMode) {
  const entry = entries.find((candidate) => candidate.solveMode === solveMode);
  if (!entry) throw new Error(`No active QL covers ${solveMode}.`);
  return entry.qlId;
}

function fixedSolver(
  solveMode: Men001SolveMode,
  values: ReturnType<typeof generateMen001Parameters>["values"],
) {
  const qlId = qlForMode(solveMode);
  const generated = generateMen001Parameters("MEN-CP-001", {
    language: "en",
    questionLanguageId: qlId,
    seed: `fixed:${solveMode}`,
  });
  return solveMen001({ ...generated, values, renderVariables: values as Record<string, number> });
}

assert.equal(fixedSolver("findTriangleAreaBaseHeight", { base: 12, height: 9 }).answer, "54 m²");
assert.equal(fixedSolver("findMissingHeightFromAreaAndBase", { area: 60, base: 15 }).answer, "8 m");
assert.equal(fixedSolver("findMissingBaseFromAreaAndHeight", { area: 60, height: 8 }).answer, "15 m");
assert.equal(fixedSolver("findTriangleAreaHeron", { sideA: 13, sideB: 14, sideC: 15 }).answer, "84 m²");
assert.equal(fixedSolver("findRightTriangleAreaFromLegs", { legA: 9, legB: 12 }).answer, "54 m²");

const equilateral = fixedSolver("findEquilateralTriangleArea", { side: 12 });
assert.equal(equilateral.exactAnswer.kind, "SURD");
assert.equal(equilateral.answer, "$$36\\sqrt{3}\\,\\text{cm}^{2}$$");

assert.equal(fixedSolver("findEquilateralPerimeterFromArea", { areaCoefficient: 36 }).answer, "36 m");
assert.equal(fixedSolver("findEquilateralSideFromPerimeter", { perimeter: 36 }).answer, "12 cm");
assert.equal(fixedSolver("findIsoscelesTriangleArea", { equalSide: 13, base: 10 }).answer, "60 m²");
assert.equal(fixedSolver("findIsoscelesHeight", { equalSide: 13, base: 10 }).answer, "12 m");
assert.equal(fixedSolver("findTriangleAreaFromSideRatioAndPerimeter", { ratioA: 3, ratioB: 4, ratioC: 5, perimeter: 24 }).answer, "24 m²");
assert.equal(fixedSolver("findLargestTriangleSideFromRatioAndPerimeter", { ratioA: 3, ratioB: 4, ratioC: 5, perimeter: 24 }).answer, "10 m");
assert.equal(fixedSolver("findSmallestTriangleSideFromRatioAndPerimeter", { ratioA: 3, ratioB: 4, ratioC: 5, perimeter: 24 }).answer, "6 cm");
assert.equal(fixedSolver("findTriangularPlotCost", { base: 12, height: 9, ratePerSquareMetre: 20 }).answer, "₹1080");

const seenQlIds = new Set<string>();
const seenSolveModes = new Set<string>();
const seenUnits = new Set<string>();
const samplesPerQl = 20;
for (const qlId of qlIds) {
  for (let index = 0; index < samplesPerQl; index += 1) {
    const seed = `men-001-runtime-proof:${qlId}:${index}`;
    const first = runMen001Pipeline("MEN-CP-001", { language: "en", questionLanguageId: qlId, seed });
    const second = runMen001Pipeline("MEN-CP-001", { language: "en", questionLanguageId: qlId, seed });

    assert.equal(
      first.validation.valid,
      true,
      first.validation.checks.filter((item) => !item.passed).map((item) => `${item.name}: ${item.message}`).join("; "),
    );
    assert.equal(first.stem, second.stem);
    assert.equal(first.answer, second.answer);
    assert.deepEqual(first.options, second.options);
    assert.equal(first.correctIndex, second.correctIndex);
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
    for (const option of first.options) {
      assert.equal(optionCarriesUnit(option, first.solver.unit), true, `${qlId} option has an incompatible unit: ${option}`);
    }
    assert.equal(first.traceability.optionSource, "DECLARED_MISCONCEPTION_STRATEGIES");
    assert.equal(first.traceability.diagramRequirement, "NONE");
    assert.equal((first.traceability.distractorStrategyIds as string[]).length, 3);
    assert.equal((first.traceability.generatedDistractors as string[]).length, 3);

    if (
      first.solveMode === "findTriangleAreaHeron" ||
      first.solveMode === "findTriangleAreaFromSideRatioAndPerimeter"
    ) {
      assert.ok(first.explanation.lines.some((line) => line.includes("Heron's formula")));
      assert.ok(first.explanation.lines.some((line) => line.includes("Substitution gives A = √[")));
      assert.ok(first.explanation.lines.some((line) => line.includes(`√${first.solver.workingValues.radicand}`)));
    }

    seenQlIds.add(first.questionLanguageId);
    seenSolveModes.add(first.solveMode);
    seenUnits.add(first.solver.unit);
  }
}

assert.deepEqual([...seenQlIds].sort(), qlIds.sort());
assert.deepEqual([...seenSolveModes].sort(), getMen001SolveModeIds().sort());
for (const unit of ["cm", "m", "cm²", "m²", "₹"]) {
  assert.equal(seenUnits.has(unit), true, `${unit} not covered`);
}
assert.throws(
  () => runMen001Pipeline("MEN-CP-001", { language: "hi", seed: "unsupported-language" }),
  /supports English only/,
);

console.log(
  `MEN-001 CP-001 runtime-proof test passed for ${qlIds.length * samplesPerQl} generated questions across ${qlIds.length} data-driven QLs and ${getMen001SolveModeIds().length} registered solve modes.`,
);
