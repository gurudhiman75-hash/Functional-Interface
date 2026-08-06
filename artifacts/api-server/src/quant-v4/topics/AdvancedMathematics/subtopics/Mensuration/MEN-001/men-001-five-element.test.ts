import assert from "node:assert/strict";
import { getMen001PublicTrapCode } from "./five-element-editorial";
import { getMen001QuestionEntries } from "./library";
import { runMen001Pipeline } from "./pipeline";
import type { Men001ActiveCanonicalProblemId } from "./types";

const entries = getMen001QuestionEntries();
const requiredChecks = [
  "mensuration-visual-anchor",
  "mensuration-variable-meanings",
  "mensuration-unit-preserving-steps",
  "mensuration-exam-speed",
  "mensuration-ring-identity",
  "mensuration-circle-benchmark",
  "mensuration-coded-option-traps",
  "mensuration-five-element-blueprint",
] as const;

let generated = 0;
let ringPackages = 0;
let benchmarkPackages = 0;
const seenCpIds = new Set<string>();
const seenTaskKinds = new Set<string>();
const seenAnswerDimensions = new Set<string>();

for (const entry of entries) {
  for (let index = 0; index < 5; index += 1) {
    const seed = `men-001-five-element:${entry.qlId}:${index}`;
    const question = runMen001Pipeline(
      entry.cpId as Men001ActiveCanonicalProblemId,
      {
        language: "en",
        questionLanguageId: entry.qlId,
        seed,
      },
    );
    const repeat = runMen001Pipeline(
      entry.cpId as Men001ActiveCanonicalProblemId,
      {
        language: "en",
        questionLanguageId: entry.qlId,
        seed,
      },
    );

    const failures = question.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    assert.equal(question.validation.valid, true, `${entry.qlId} ${seed}: ${failures}`);
    assert.deepEqual(question, repeat, `${entry.qlId} must remain deterministic for ${seed}.`);
    assert.equal(question.explanation.displayFormat, "FOUR_TIER_COMPETITIVE_EXPLANATION");
    assert.equal(question.explanation.lines.length, 4);

    const keyRule = question.explanation.sections.find((section) => section.kind === "KEY_RULE");
    const steps = question.explanation.sections.filter((section) => section.kind === "STEP");
    const shortcut = question.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT");
    const traps = question.explanation.sections.find((section) => section.kind === "COMMON_TRAPS");

    assert.ok(keyRule);
    assert.equal(keyRule.paragraphs.length, 1);
    assert.match(keyRule.paragraphs[0]!, /^(Think|Picture)\b/);
    assert.ok(keyRule.paragraphs[0]!.includes("Here,"));
    assert.ok(steps.length > 0);
    assert.ok(steps.every((step) => step.paragraphs.some((paragraph) => paragraph.includes("Unit check:"))));
    assert.ok(shortcut);
    assert.equal(shortcut.paragraphs.length, 1);
    assert.ok(shortcut.paragraphs[0]!.startsWith("⚡ Exam speed:"));
    assert.ok(traps);
    assert.equal(traps.paragraphs.length, 3);

    const expectedCodes = entry.distractorStrategyIds.map(getMen001PublicTrapCode);
    const actualCodes = traps.paragraphs.map((paragraph) => {
      const match = paragraph.match(/\[([A-Z0-9_]+)\]\s*$/);
      assert.ok(match, `${entry.qlId} has an uncoded trap: ${paragraph}`);
      return match[1]!;
    });
    assert.deepEqual(actualCodes, expectedCodes);
    assert.equal(/FALLBACK_|UNCLASSIFIED|GENERAL_CALCULATION_ERROR/.test(traps.paragraphs.join("\n")), false);

    const validationNames = new Set(question.validation.checks.map((check) => check.name));
    for (const name of requiredChecks) {
      assert.ok(validationNames.has(name), `${entry.qlId} is missing validation check ${name}.`);
    }

    const isRing = /CircularPath|Annulus|OuterCircular|InnerCircular/.test(question.solveMode);
    if (isRing) {
      ringPackages += 1;
      assert.ok(shortcut.paragraphs[0]!.includes("R² − r² = (R − r)(R + r)"));
      assert.match(keyRule.paragraphs[0]!, /flat donut|larger boundary region minus the smaller inner region/);
    }

    const radii = [
      question.parameters.values.radius,
      question.parameters.values.outerRadius,
      question.parameters.values.innerRadius,
    ].filter((value): value is number => typeof value === "number");
    if (
      /Circle|Circular|Arc|Sector|Semicircle|Quadrant|Annulus|Wheel/.test(question.solveMode) &&
      radii.some((radius) => [7, 14, 21].includes(radius))
    ) {
      benchmarkPackages += 1;
      assert.ok(shortcut.paragraphs[0]!.includes("Standard circle benchmark:"));
    }

    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.maturity, "RUNTIME_PROOF");
    seenCpIds.add(question.canonicalProblemId);
    seenTaskKinds.add(question.taskKind);
    seenAnswerDimensions.add(question.parameters.answerDimension);
    generated += 1;
  }
}

assert.ok(ringPackages > 0);
assert.ok(benchmarkPackages > 0);
assert.deepEqual([...seenCpIds].sort(), [
  "MEN-CP-001",
  "MEN-CP-002",
  "MEN-CP-003",
  "MEN-CP-004",
  "MEN-CP-005",
  "MEN-CP-006",
]);
assert.ok(seenTaskKinds.size >= 6);
for (const dimension of ["LENGTH", "AREA", "COST", "RATE", "ANGLE", "COUNT", "PERCENT", "SCALAR"]) {
  assert.ok(seenAnswerDimensions.has(dimension), `Missing answer dimension ${dimension}.`);
}

console.log(
  `MEN-001 five-element explanation proof passed for ${generated} deterministic questions across ${entries.length} active QLs; ${ringPackages} ring/path packages and ${benchmarkPackages} standard-circle benchmark packages were exercised.`,
);
