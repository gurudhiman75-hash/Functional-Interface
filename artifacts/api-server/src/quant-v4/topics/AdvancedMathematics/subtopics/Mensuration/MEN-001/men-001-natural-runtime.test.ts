import { strict as assert } from "node:assert";
import { hasMen001ExplanationIllustration } from "./explanation-illustration.all";
import {
  getMen001ActiveCanonicalProblemIds,
  getMen001QuestionEntries,
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

const GENERIC_FALLBACK_OPTIONS = new Set([
  "Cannot be determined",
  "Both are equal",
  "None of these",
  "Insufficient information",
]);

function optionCarriesUnit(option: string, unit: string) {
  if (unit === "₹") return option.startsWith("₹");
  if (unit === "₹/m²") return option.startsWith("₹") && option.endsWith("/m²");
  if (unit === "₹/m") return option.startsWith("₹") && option.endsWith("/m");
  if (unit === "°") return option.endsWith("°");
  if (unit === "cm²") return option.includes("cm²") || option.includes("\\text{cm}^{2}");
  if (unit === "m²") return option.includes("m²") || option.includes("\\text{m}^{2}");
  if (unit === "cm") return option.endsWith(" cm") || option.includes("\\text{cm}");
  if (unit === "m") return option.endsWith(" m") || option.includes("\\text{m}");
  if (unit === "tiles") return option.endsWith(" tiles");
  if (unit === "revolutions") return option.endsWith(" revolutions");
  return false;
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
  return solveMen001({
    ...generated,
    values,
    renderVariables: values as Record<string, number>,
  });
}

assert.equal(fixedSolver("MEN-CP-001", "MEN-001-QL-001", { base: 12, height: 9 }).answer, "54 m²");
assert.equal(fixedSolver("MEN-CP-001", "MEN-001-QL-008", { sideA: 13, sideB: 14, sideC: 15 }).answer, "84 m²");
assert.equal(fixedSolver("MEN-CP-002", "MEN-001-QL-107", { diagonal: 15, length: 12 }).answer, "9 cm");
assert.equal(fixedSolver("MEN-CP-003", "MEN-001-QL-218", { arcLength: 22, radius: 14 }).answer, "90°");
assert.equal(fixedSolver("MEN-CP-004", "MEN-001-QL-330", { length: 60, breadth: 40, pathWidth: 4, gateWidth: 3 }).answer, "2052 m²");
assert.equal(fixedSolver("MEN-CP-004", "MEN-001-QL-333", { length: 30, breadth: 20, cost: 5000 }).answer, "₹50/m");

const seenQlIds = new Set<string>();
const seenSolveModes = new Set<string>();
const seenUnits = new Set<string>();
const seenCpIds = new Set<string>();
const seenIllustrationKinds = new Set<string>();

for (const entry of getMen001QuestionEntries()) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `men-001-runtime-proof:${entry.qlId}:${index}`;
    const first = runMen001Pipeline(
      entry.cpId as Men001ActiveCanonicalProblemId,
      { language: "en", questionLanguageId: entry.qlId, seed },
    );
    const second = runMen001Pipeline(
      entry.cpId as Men001ActiveCanonicalProblemId,
      { language: "en", questionLanguageId: entry.qlId, seed },
    );

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
    assert.ok(first.explanation.lines.length >= 3 && first.explanation.lines.length <= 9);
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
      `${entry.qlId} used a generic option fallback.`,
    );
    for (const option of first.options) {
      assert.equal(
        optionCarriesUnit(option, first.solver.unit),
        true,
        `${entry.qlId} option has an incompatible unit: ${option}`,
      );
    }

    const shouldIllustrate = hasMen001ExplanationIllustration(first.solveMode);
    assert.equal(Boolean(first.explanation.illustration), shouldIllustrate);
    assert.equal(first.traceability.diagramRequirement, "NONE");
    if (first.explanation.illustration) {
      const payload = JSON.stringify(first.explanation.illustration);
      assert.equal(/font[-_ ]?(family|size|weight)|typeface/i.test(payload), false);
      assert.equal(first.explanation.illustration.notToScale, true);
      assert.ok(first.explanation.illustration.accessibleText.length >= 30);
      assert.ok(Object.values(first.explanation.illustration.labels).every((label) => label.length > 0));
      seenIllustrationKinds.add(first.explanation.illustration.kind);
    }

    if (first.canonicalProblemId === "MEN-CP-003") {
      assert.ok(first.stem.includes("π = 22/7"));
      assert.equal(first.solver.workingValues.piPolicy, "22/7");
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
for (const unit of ["cm", "m", "cm²", "m²", "₹", "₹/m²", "₹/m", "°", "tiles", "revolutions"]) {
  assert.equal(seenUnits.has(unit), true, `${unit} not covered`);
}
for (const kind of [
  "TRIANGLE_SIDE_LABELS",
  "ISOSCELES_ALTITUDE_SPLIT",
  "RECTANGLE_DIAGONAL_SPLIT",
  "RHOMBUS_HALF_DIAGONALS",
  "QUADRILATERAL_DIAGONAL_PERPENDICULARS",
  "CIRCLE_CENTRAL_ANGLE",
  "ANNULUS_RADII",
  "CIRCLE_PART_BOUNDARY",
  "RECTANGULAR_BORDER_BAND",
  "CIRCULAR_BORDER_BAND",
]) {
  assert.equal(seenIllustrationKinds.has(kind), true, `${kind} not covered`);
}
assert.throws(
  () => runMen001Pipeline("MEN-CP-001", { language: "hi", seed: "unsupported-language" }),
  /supports English only/,
);

const generatedCount = getMen001QuestionLanguageIds().length * 20;
console.log(
  `MEN-001 natural runtime proof passed for ${generatedCount} generated questions across ${getMen001ActiveCanonicalProblemIds().length} active CPs and ${getMen001SolveModeIds().length} solve modes.`,
);
