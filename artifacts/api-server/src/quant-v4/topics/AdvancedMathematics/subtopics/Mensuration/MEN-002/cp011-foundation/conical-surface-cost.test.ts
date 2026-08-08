import assert from "node:assert/strict";
import {
  exactEquals,
  exactKey,
  pi,
  rational,
} from "../foundation/exact";
import type { ExactValue } from "../foundation/types";
import {
  MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY,
  auditMenCp011ConicalSurfaceCostBatch,
  generateMenCp011ConicalSurfaceCostQuestion,
  generateMenCp011ConicalSurfaceCostReviewBatch,
  getMenCp011ConicalSurfaceCostPrototypeIds,
  type MenCp011ConicalSurfaceCostState,
} from "./conical-surface-cost";

function expectedAnswer(state: MenCp011ConicalSurfaceCostState): ExactValue {
  const coefficient = state.answerCoefficientBeforePi;
  switch (state.piPolicy) {
    case "EXACT_PI":
      return pi(coefficient, 1n);
    case "PI_22_OVER_7":
      return rational(22n * coefficient, 7n);
    case "PI_3_14":
      return rational(157n * coefficient, 50n);
  }
}

function learnerText(question: ReturnType<typeof generateMenCp011ConicalSurfaceCostQuestion>) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
    question.answer,
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
    question.explanation.keyRule,
    ...question.explanation.steps.flatMap((step) => [
      step.title,
      step.body,
      step.equation ?? "",
    ]),
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join("\n");
}

const seedsPerPrototype = 128;
let runtimePackageCount = 0;
const targets = new Set<string>();
const seenPiPolicies = new Set<string>();
const seenUnits = new Set<string>();

for (const prototypeId of getMenCp011ConicalSurfaceCostPrototypeIds()) {
  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const question = generateMenCp011ConicalSurfaceCostQuestion(
      prototypeId,
      `conical-surface-cost-runtime-proof:${prototypeId}:${index}`,
    );
    const state = question.state;
    const text = learnerText(question);

    assert.equal(
      question.conicalSurfaceCostAuthority,
      MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY,
    );
    assert.equal(
      question.validation.valid,
      true,
      question.validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join(" | "),
    );
    assert.equal(question.verification.valid, true);
    assert.ok(exactEquals(question.exactAnswer, expectedAnswer(state)));
    assert.equal(question.options.length, 4);
    assert.equal(
      new Set(question.options.map((option) => exactKey(option.value))).size,
      4,
    );
    assert.equal(
      question.options.filter((option) => option.isCorrect).length,
      1,
    );
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(question.learnerSolution.wrongOptionAnalysis.length, 3);

    assert.equal(
      state.outerSlantHeight * state.outerSlantHeight,
      state.outerRadius * state.outerRadius +
        state.outerHeight * state.outerHeight,
    );
    assert.equal(
      state.innerSlantHeight * state.innerSlantHeight,
      state.innerRadius * state.innerRadius +
        state.innerHeight * state.innerHeight,
    );
    assert.ok(state.innerRadius < state.outerRadius);
    assert.ok(state.innerHeight <= state.outerHeight);
    assert.ok(state.innerSlantHeight < state.outerSlantHeight);

    if (state.target === "AREA") {
      assert.equal(state.relation, "EXPLICIT_SHARED_BASE_INNER_CONE");
      assert.equal(state.ratePerSquareMetre, null);
      assert.equal(state.scaleNumerator, null);
      assert.equal(state.scaleDenominator, null);
      assert.equal(
        state.answerCoefficientBeforePi,
        state.outerCurvedCoefficient + state.innerCurvedCoefficient,
      );
      assert.match(question.stem, /both|combined|two|outer and inner/i);
      assert.match(question.verification.method, /surface ledger/i);
    } else {
      assert.equal(state.relation, "DECLARED_SIMILAR_SHARED_BASE_WALL");
      assert.equal(state.unit, "m");
      assert.notEqual(state.ratePerSquareMetre, null);
      assert.ok(state.ratePerSquareMetre! > 0n);
      assert.notEqual(state.scaleNumerator, null);
      assert.notEqual(state.scaleDenominator, null);
      assert.notEqual(state.piPolicy, "EXACT_PI");
      assert.equal(
        state.innerRadius * state.scaleDenominator!,
        state.outerRadius * state.scaleNumerator!,
      );
      assert.equal(
        state.innerHeight * state.scaleDenominator!,
        state.outerHeight * state.scaleNumerator!,
      );
      assert.equal(
        state.innerSlantHeight * state.scaleDenominator!,
        state.outerSlantHeight * state.scaleNumerator!,
      );
      assert.equal(
        state.answerCoefficientBeforePi,
        state.innerCurvedCoefficient * state.ratePerSquareMetre!,
      );
      assert.match(question.stem, /similar|scale|linear ratio|parallel/i);
      assert.match(question.stem, /₹\d+/);
      assert.match(question.verification.method, /similar-area/i);
      assert.match(question.answer, /^₹/);
      assert.doesNotMatch(question.answer, /\//);
    }

    for (const diagram of [question.diagram, question.solutionDiagram]) {
      assert.match(
        diagram.svg,
        /data-diagram-version="CONICAL_SURFACE_COST_EXAMTREE_V1"/,
      );
      assert.match(diagram.svg, /data-shape="CONE"/);
      assert.match(diagram.svg, /data-region="outer-curved-wall"/);
      assert.match(diagram.svg, /data-region="inner-curved-wall"/);
      assert.match(diagram.svg, /data-boundary="dashed"/);
      assert.match(diagram.svg, /not to scale/);
      assert.doesNotMatch(diagram.svg, /<svg[^>]+\bwidth="\d+/);
    }
    assert.match(question.diagram.svg, /data-diagram-role="PROMPT"/);
    assert.match(question.solutionDiagram.svg, /data-diagram-role="SOLUTION"/);
    assert.equal(question.renderSurfaces.attempt.diagram, null);
    assert.equal(question.renderSurfaces.responsiveDiagramPolicy.minWidthPx, 0);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioDiscoverable, false);
    assert.doesNotMatch(
      text,
      /\[(?:USED_|CHARGED_|OMITTED_|SUBTRACTED_|MEN-CP011-PROT-)/,
    );
    assert.equal((text.match(/\$/g) ?? []).length % 2, 0);
    assert.doesNotMatch(text, /\$\$/);
    assert.doesNotMatch(question.stem, /uniform wall thickness/i);
    assert.doesNotMatch(question.stem, /\b[RHLI]\s*[-−]\s*t\b/);

    targets.add(state.target);
    seenPiPolicies.add(state.piPolicy);
    seenUnits.add(state.unit);
    runtimePackageCount += 1;
  }
}

assert.equal(runtimePackageCount, 256);
assert.deepEqual([...targets].sort(), ["AREA", "COST"]);
assert.deepEqual([...seenPiPolicies].sort(), [
  "EXACT_PI",
  "PI_22_OVER_7",
  "PI_3_14",
]);
assert.deepEqual([...seenUnits].sort(), ["cm", "m"]);

const review = generateMenCp011ConicalSurfaceCostReviewBatch();
const audit = auditMenCp011ConicalSurfaceCostBatch(review.records);
assert.equal(review.authority, MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY);
assert.equal(audit.authority, MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY);
assert.equal(audit.prototypeCount, 2);
assert.equal(audit.recordCount, 40);
assert.equal(audit.exactStemCount, 40);
assert.equal(audit.exactQuestionOptionCount, 40);
assert.equal(audit.uniquePhysicalStateCount, 40);
assert.deepEqual(audit.targetCounts, { AREA: 24, COST: 16 });
assert.deepEqual(audit.answerPositionCounts, { A: 10, B: 10, C: 10, D: 10 });
assert.deepEqual(audit.unitCounts, { cm: 12, m: 28 });
assert.deepEqual(audit.piPolicyCounts, {
  EXACT_PI: 8,
  PI_22_OVER_7: 16,
  PI_3_14: 16,
});
assert.equal(audit.publicationEligible, false);

console.log(
  `MEN-CP-011 conical surface/cost Wave 01 passed for ${runtimePackageCount} deterministic runtime packages and a ${audit.recordCount}-record balanced review matrix. Permanent QLs remain 0 and all delivery surfaces remain disabled.`,
);
