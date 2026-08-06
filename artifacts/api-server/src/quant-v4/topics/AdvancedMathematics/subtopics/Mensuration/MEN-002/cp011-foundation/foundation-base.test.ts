import assert from "node:assert/strict";
import { exactKey } from "../foundation/exact";
import {
  getMenCp011FoundationPrototypeIds,
  MEN_CP_011_FOUNDATION_PROTOTYPES,
} from "./registry";
import {
  classifyMenCp011Difficulty,
  generateMenCp011FoundationPrototype,
} from "./runtime";
import { MEN_CP011_MEASUREMENT_AUTHORITY } from "./measurement-profiles";

const prototypeIds = getMenCp011FoundationPrototypeIds();
assert.equal(MEN_CP_011_FOUNDATION_PROTOTYPES.length, 4);
assert.equal(prototypeIds.length, 4);
assert.equal(new Set(prototypeIds).size, 4);

let generated = 0;
const policies = new Set<string>();
const difficulties = new Set<string>();
const targets = new Set<string>();
const representations = new Set<string>();
const measurementProfiles = new Set<string>();

for (const definition of MEN_CP_011_FOUNDATION_PROTOTYPES) {
  const answerPositions = new Set<number>();
  const stems = new Set<string>();
  const exactAnswers = new Set<string>();

  for (let index = 0; index < 80; index += 1) {
    const seed = `men-002-cp011-foundation:${definition.prototypeId}:${index}`;
    const first = generateMenCp011FoundationPrototype(definition.prototypeId, seed);
    const second = generateMenCp011FoundationPrototype(definition.prototypeId, seed);
    assert.deepEqual(first, second, `${definition.prototypeId} must regenerate deterministically for ${seed}.`);

    const failures = first.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    assert.equal(first.validation.valid, true, `${definition.prototypeId} ${seed}: ${failures}`);
    assert.equal(first.verification.valid, true);
    assert.equal(first.packageId, "MEN-002");
    assert.equal(first.canonicalProblemId, "MEN-CP-011");
    assert.equal(first.permanentQlId, null);
    assert.equal(first.waveId, "MEN-CP-011-FOUNDATION-WAVE-01");
    assert.equal(first.prototypeId, definition.prototypeId);
    assert.equal(first.solveMode, definition.solveMode);
    assert.equal(first.target, definition.target);
    assert.equal(first.state.representation, definition.representation);
    assert.equal(first.difficulty, classifyMenCp011Difficulty(definition.prototypeId));
    assert.equal(first.measurementAuthority, MEN_CP011_MEASUREMENT_AUTHORITY);

    assert.ok(first.state.innerRadius > 0n);
    assert.ok(first.state.outerRadius > first.state.innerRadius);
    assert.equal(first.state.thickness, first.state.outerRadius - first.state.innerRadius);
    assert.equal(first.state.outerDiameter, 2n * first.state.outerRadius);
    assert.equal(first.state.innerDiameter, 2n * first.state.innerRadius);
    assert.equal(
      first.state.ringCoefficient,
      first.state.outerRadius ** 2n - first.state.innerRadius ** 2n,
    );

    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => exactKey(option.value))).size, 4);
    assert.equal(new Set(first.options.map((option) => option.display)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.equal(first.answer, first.options[first.correctIndex]?.display);
    assert.equal(exactKey(first.exactAnswer), exactKey(first.options[first.correctIndex]!.value));

    assert.match(first.explanation.keyRule, /^(Think|Picture)\b/);
    assert.match(first.explanation.keyRule, /Here, \$R\$/);
    assert.match(first.explanation.keyRule, /outer cylinder/);
    assert.match(first.explanation.keyRule, /smaller coaxial cylinder removed|inner empty-cylinder volume/);
    assert.ok(first.explanation.steps.length >= 2);
    assert.ok(first.explanation.steps.every((step) => step.body.includes("Unit check:")));
    assert.match(first.explanation.shortcut, /^⚡ Exam speed:/);
    assert.equal(first.explanation.traps.length, 3);
    assert.ok(first.explanation.traps.every((trap) => /^Option [A-D] \(\$/.test(trap)));
    assert.ok(first.explanation.traps.every((trap) => /\[[A-Z0-9_]+\]$/.test(trap)));
    assert.ok(first.explanation.traps.every((trap) => !/FALLBACK_|UNCLASSIFIED|GENERAL_CALCULATION_ERROR/.test(trap)));

    if (first.target === "VOLUME") {
      assert.ok(
        first.explanation.shortcut.includes("R^2-r^2") ||
        first.explanation.shortcut.includes("100^2") ||
        first.explanation.shortcut.includes("convert only $h$"),
      );
      const worked = first.explanation.steps
        .map((step) => `${step.body}${step.equation ?? ""}`)
        .join("\n");
      assert.match(worked, new RegExp(`${first.state.calculationUnit}[^\\n]*2|${first.state.calculationUnit}\\}\\^2`));
      assert.match(worked, new RegExp(`${first.state.calculationUnit}[^\\n]*3|${first.state.calculationUnit}\\}\\^3`));
    }

    assert.equal(first.diagram.kind, "HOLLOW_CYLINDER");
    assert.equal(first.diagram.notToScale, true);
    assert.match(first.diagram.svg, /empty void/);
    assert.match(first.diagram.svg, /not to scale/);
    assert.ok(first.diagram.visibleLabels.every((label) =>
      !/\d/.test(label) ||
      label.includes(first.state.radialUnit) ||
      label.includes(first.state.heightUnit)
    ));
    if (first.state.representation === "INVERSE_INNER_RADIUS") {
      assert.ok(first.diagram.visibleLabels.includes("r = ?"));
      assert.equal(
        first.diagram.visibleLabels.includes(
          `r = ${first.state.innerRadius} ${first.state.radialUnit}`,
        ),
        false,
      );
    }

    if (first.measurementProfile.mixedUnits) {
      const conversionText = first.explanation.steps
        .map((step) => `${step.title} ${step.body} ${step.equation ?? ""}`)
        .join("\n");
      assert.match(conversionText, /Convert/);
      assert.match(conversionText, /100/);
    }

    assert.equal(first.reviewStatus, "UNREVIEWED");
    assert.equal(first.questionBankStatus, "NOT_STORED");
    assert.equal(first.testEligibility, "INELIGIBLE");
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.questionStudioDiscoverable, false);

    const learnerText = [
      first.stem,
      ...first.options.map((option) => option.display),
      first.answer,
      first.explanation.keyRule,
      ...first.explanation.steps.flatMap((step) => [step.title, step.body, step.equation ?? ""]),
      first.explanation.shortcut,
      ...first.explanation.traps,
      first.diagram.accessibleText,
      ...first.diagram.visibleLabels,
    ].join("\n");
    assert.equal(/misconceptionId|MEN-CP011-PROT|FALLBACK_/.test(learnerText), false);
    assert.equal(/[£€¥]/.test(learnerText), false);
    assert.equal(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(learnerText), false);

    answerPositions.add(first.correctIndex);
    stems.add(first.stem);
    exactAnswers.add(exactKey(first.exactAnswer));
    policies.add(first.piPolicy);
    difficulties.add(first.difficulty);
    targets.add(first.target);
    representations.add(first.state.representation);
    measurementProfiles.add(first.measurementProfile.id);
    generated += 1;
  }

  assert.deepEqual(
    [...answerPositions].sort(),
    [0, 1, 2, 3],
    `${definition.prototypeId} must reach every answer position.`,
  );
  assert.ok(stems.size >= 4, `${definition.prototypeId} must expose at least four natural stem forms.`);
  assert.ok(exactAnswers.size >= 6, `${definition.prototypeId} needs meaningful numerical state variation.`);
}

assert.deepEqual([...policies].sort(), ["EXACT_PI", "PI_22_OVER_7"]);
assert.deepEqual([...difficulties].sort(), ["Easy", "Hard", "Medium"]);
assert.deepEqual([...targets].sort(), ["LENGTH", "VOLUME"]);
assert.deepEqual(
  [...representations].sort(),
  ["DIAMETERS", "INVERSE_INNER_RADIUS", "OUTER_RADIUS_AND_THICKNESS", "RADII"],
);
assert.equal(measurementProfiles.size, 4);
assert.equal(generated, 4 * 80);

console.log(
  `MEN-CP-011 foundation proof passed for ${generated} deterministic temporary packages across four measurement profiles and ${prototypeIds.length} representation families. Permanent QLs remain 0 and all product surfaces remain disabled.`,
);
