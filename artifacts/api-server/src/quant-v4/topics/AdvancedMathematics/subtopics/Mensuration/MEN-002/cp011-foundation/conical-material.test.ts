import assert from "node:assert/strict";
import {
  exactEquals,
  exactKey,
  pi,
  rational,
} from "../foundation/exact";
import type { ExactValue } from "../foundation/types";
import {
  MEN_CP011_CONICAL_MATERIAL_AUTHORITY,
  auditMenCp011ConicalMaterialBatch,
  generateMenCp011ConicalMaterialQuestion,
  generateMenCp011ConicalMaterialReviewBatch,
  getMenCp011ConicalMaterialPrototypeIds,
  type MenCp011ConicalMaterialPiPolicy,
  type MenCp011ConicalMaterialState,
} from "./conical-material";

function expectedAnswer(state: MenCp011ConicalMaterialState): ExactValue {
  switch (state.piPolicy) {
    case "EXACT_PI":
      return pi(state.materialVolumeCoefficient, 3n);
    case "PI_22_OVER_7":
      return rational(22n * state.materialVolumeCoefficient, 21n);
    case "PI_3_14":
      return rational(157n * state.materialVolumeCoefficient, 150n);
  }
}

function learnerText(question: ReturnType<typeof generateMenCp011ConicalMaterialQuestion>) {
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

const seedsPerPrototype = 192;
let runtimePackageCount = 0;
const seenUnits = new Set<string>();
const seenPiPolicies = new Set<MenCp011ConicalMaterialPiPolicy>();
const seenRelations = new Set<string>();

for (const prototypeId of getMenCp011ConicalMaterialPrototypeIds()) {
  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const question = generateMenCp011ConicalMaterialQuestion(
      prototypeId,
      `conical-material-runtime-proof:${prototypeId}:${index}`,
    );
    const state = question.state;
    const text = learnerText(question);

    assert.equal(question.conicalMaterialAuthority, MEN_CP011_CONICAL_MATERIAL_AUTHORITY);
    assert.equal(question.validation.valid, true, question.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join(" | "));
    assert.equal(question.verification.valid, true);
    assert.ok(exactEquals(question.exactAnswer, expectedAnswer(state)));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => exactKey(option.value))).size, 4);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(question.learnerSolution.wrongOptionAnalysis.length, 3);

    assert.ok(state.outerRadius > state.innerRadius);
    assert.ok(state.outerHeight >= state.innerHeight);
    assert.equal(
      state.materialVolumeCoefficient,
      state.outerVolumeCoefficient - state.innerVolumeCoefficient,
    );
    assert.ok(state.materialVolumeCoefficient > 0n);

    if (state.relation === "DECLARED_SIMILAR_SHARED_BASE_WALL") {
      assert.notEqual(state.scaleNumerator, null);
      assert.notEqual(state.scaleDenominator, null);
      assert.equal(
        state.innerRadius * state.scaleDenominator!,
        state.outerRadius * state.scaleNumerator!,
      );
      assert.equal(
        state.innerHeight * state.scaleDenominator!,
        state.outerHeight * state.scaleNumerator!,
      );
      assert.match(question.stem, /similar|scale|linear ratio|parallel/i);
      assert.match(question.verification.method, /similar-solids/i);
    } else {
      assert.equal(state.scaleNumerator, null);
      assert.equal(state.scaleDenominator, null);
      assert.match(question.stem, /inner|cavity|void|hollow/i);
      assert.match(question.verification.method, /coefficient verifier/i);
    }

    for (const diagram of [question.diagram, question.solutionDiagram]) {
      assert.match(diagram.svg, /data-diagram-version="CONICAL_SHELL_EXAMTREE_V1"/);
      assert.match(diagram.svg, /data-shape="CONE"/);
      assert.match(diagram.svg, /data-topology="HOLLOW_SHARED_BASE_CAVITY"/);
      assert.match(diagram.svg, /data-region="outer-cone"/);
      assert.match(diagram.svg, /data-region="inner-void"/);
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
    assert.doesNotMatch(text, /\[(?:USED_|CALCULATED_|MEN-CP011-PROT-)/);
    assert.equal((text.match(/\$/g) ?? []).length % 2, 0);
    assert.doesNotMatch(text, /\$\$/);
    assert.doesNotMatch(question.stem, /uniform wall thickness/i);
    assert.doesNotMatch(question.stem, /\b[RH]\s*[-−]\s*t\b/);

    seenUnits.add(state.unit);
    seenPiPolicies.add(state.piPolicy);
    seenRelations.add(state.relation);
    runtimePackageCount += 1;
  }
}

assert.equal(runtimePackageCount, 384);
assert.deepEqual([...seenUnits].sort(), ["cm", "m"]);
assert.deepEqual([...seenPiPolicies].sort(), ["EXACT_PI", "PI_22_OVER_7", "PI_3_14"]);
assert.deepEqual([...seenRelations].sort(), [
  "DECLARED_SIMILAR_SHARED_BASE_WALL",
  "EXPLICIT_SHARED_BASE_INNER_CONE",
]);

const review = generateMenCp011ConicalMaterialReviewBatch();
const audit = auditMenCp011ConicalMaterialBatch(review.records);
assert.equal(review.authority, MEN_CP011_CONICAL_MATERIAL_AUTHORITY);
assert.equal(audit.authority, MEN_CP011_CONICAL_MATERIAL_AUTHORITY);
assert.equal(audit.prototypeCount, 2);
assert.equal(audit.recordCount, 48);
assert.equal(audit.exactStemCount, 48);
assert.equal(audit.exactQuestionOptionCount, 48);
assert.equal(audit.uniquePhysicalStateCount, 48);
assert.deepEqual(audit.unitCounts, { cm: 24, m: 24 });
assert.deepEqual(audit.piPolicyCounts, {
  EXACT_PI: 16,
  PI_22_OVER_7: 16,
  PI_3_14: 16,
});
assert.deepEqual(audit.answerPositionCounts, { A: 12, B: 12, C: 12, D: 12 });
assert.equal(Object.keys(audit.prototypeUnitPiCounts).length, 12);
assert.ok(Object.values(audit.prototypeUnitPiCounts).every((count) => count === 4));
assert.equal(audit.publicationEligible, false);
assert.deepEqual(
  [...audit.resolvedDiscoveryCandidates].sort(),
  [...getMenCp011ConicalMaterialPrototypeIds()].sort(),
);

console.log(
  `MEN-CP-011 conical material Wave 01 passed for ${runtimePackageCount} deterministic runtime packages and a ${audit.recordCount}-record balanced review matrix. Permanent QLs remain 0 and all delivery surfaces remain disabled.`,
);
