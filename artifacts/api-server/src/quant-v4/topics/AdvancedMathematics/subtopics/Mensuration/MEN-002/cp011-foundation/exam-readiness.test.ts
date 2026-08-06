import assert from "node:assert/strict";
import { generateMenCp011ReviewBatch } from "./exam-readiness-batch";
import {
  getMenCp011MeasurementProfiles,
  MEN_CP011_MEASUREMENT_AUTHORITY,
} from "./measurement-profiles";
import {
  getMenCp011PhysicalStateCatalog,
  getMenCp011ScaleProfiles,
  isMenCp011CatalogState,
  menCp011PhysicalStateKey,
  MEN_CP011_STATE_POOL_AUTHORITY,
} from "./state-pool";

const catalog = getMenCp011PhysicalStateCatalog();
assert.equal(catalog.length, 72);
assert.equal(new Set(catalog.map((state) => [
  state.outerRadius,
  state.innerRadius,
  state.height,
  state.thickness,
].join("|"))).size, 72);
assert.equal(getMenCp011ScaleProfiles().length, 9);
assert.equal(new Set(catalog.map((state) => `${state.outerRadius}|${state.innerRadius}`)).size, 23);
assert.equal(new Set(catalog.map((state) => state.height.toString())).size, 8);
assert.ok(catalog.every((state) =>
  state.outerRadius > state.innerRadius &&
  state.innerRadius > 0n &&
  state.thickness === state.outerRadius - state.innerRadius &&
  state.ringCoefficient === state.outerRadius ** 2n - state.innerRadius ** 2n
));

const profiles = getMenCp011MeasurementProfiles();
assert.equal(profiles.length, 4);
assert.equal(new Set(profiles.map((profile) => profile.id)).size, 4);
assert.deepEqual(
  profiles.map((profile) => profile.volumeScaleFromNominalState),
  [1n, 1n, 100n, 10_000n],
);

const { records, audit } = generateMenCp011ReviewBatch(
  "men-cp011-phase2b-unit-representation-proof-v1",
  12,
);

assert.equal(records.length, 48);
assert.equal(audit.statePoolAuthority, MEN_CP011_STATE_POOL_AUTHORITY);
assert.equal(audit.measurementAuthority, MEN_CP011_MEASUREMENT_AUTHORITY);
assert.equal(audit.physicalStatePoolSize, 72);
assert.equal(audit.uniquePhysicalStateCount, 48);
assert.ok(audit.uniqueRadialPairCount >= 16);
assert.ok(audit.uniqueHeightCount >= 6);
assert.equal(audit.exactStemCount, 48);
assert.equal(audit.exactQuestionOptionCount, 48);
assert.ok(audit.normalizedStemGroupCount >= 20);
assert.ok(audit.maximumNormalizedStemRepetition <= 3);
assert.deepEqual(audit.answerPositionCounts, {
  A: 12,
  B: 12,
  C: 12,
  D: 12,
});
assert.equal(new Set(Object.values(audit.answerPositionSequences)).size, 4);
assert.ok(Object.values(audit.measurementProfileCounts).every((count) => count === 12));
assert.ok(Object.values(audit.representationUnitMatrix).every((row) =>
  Object.values(row).every((count) => count === 3)
));
assert.equal(audit.mixedUnitRecordCount, 24);
assert.equal(audit.publicationEligible, false);
assert.ok(!audit.blockers.includes("INSUFFICIENT_PHYSICAL_STATE_DIVERSITY"));
assert.ok(!audit.blockers.includes("UNIT_REPRESENTATION_COVERAGE_INCOMPLETE"));
assert.ok(audit.blockers.includes("CHAPTER_COVERAGE_INCOMPLETE"));
assert.ok(audit.blockers.includes("PERMANENT_QLS_UNALLOCATED"));
assert.ok(audit.blockers.includes("MANUAL_ENGLISH_REVIEW_PENDING"));

const reviewStateKeys = new Set<string>();
for (const question of records) {
  const profile = question.measurementProfile;
  assert.equal(question.statePoolAuthority, MEN_CP011_STATE_POOL_AUTHORITY);
  assert.equal(question.measurementAuthority, MEN_CP011_MEASUREMENT_AUTHORITY);
  assert.equal(question.state.measurementProfileId, profile.id);
  assert.equal(question.state.radialUnit, profile.radialUnit);
  assert.equal(question.state.heightUnit, profile.heightUnit);
  assert.equal(question.state.calculationUnit, profile.calculationUnit);
  assert.ok(isMenCp011CatalogState(question.state));
  reviewStateKeys.add(menCp011PhysicalStateKey(question.state));
  assert.equal(
    question.validation.valid,
    true,
    `${question.prototypeId} failed Phase 2B validation for ${question.seed}: ${question.validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join(" | ")}`,
  );
  assert.match(question.optionPermutationSeed, /^MEN-CP011-OPTION-PERMUTATION-V2\|/);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.display)).size, 4);
  assert.equal(question.options[question.correctIndex]?.isCorrect, true);
  assert.equal(question.answer, question.options[question.correctIndex]?.display);

  assert.match(question.diagram.svg, /data-diagram-version="TUBE_EXAMTREE_EXAM_READY_V2"/);
  assert.match(question.diagram.svg, /data-diagram-role="PROMPT"/);
  assert.match(question.solutionDiagram.svg, /data-diagram-role="SOLUTION"/);
  assert.match(question.diagram.svg, /data-responsive="true"/);
  assert.match(question.solutionDiagram.svg, /data-responsive="true"/);
  assert.match(question.diagram.svg, /data-label-placement="detached"/);
  assert.match(question.solutionDiagram.svg, /data-label-placement="detached"/);
  assert.match(question.diagram.svg, /data-region="top-outer-ellipse"/);
  assert.match(question.diagram.svg, /data-region="top-inner-ellipse"/);
  assert.match(question.diagram.svg, /data-region="bottom-outer-ellipse"/);
  assert.match(question.diagram.svg, /data-region="bottom-inner-hidden-ellipse"/);
  assert.doesNotMatch(question.diagram.svg, /<svg[^>]+\bwidth="\d+/);
  assert.equal(question.renderSurfaces.responsiveDiagramPolicy.minWidthPx, 0);

  if (question.state.representation !== "DIAMETERS") {
    assert.match(question.diagram.svg, /data-scope="centre-connected"/);
    assert.match(question.diagram.svg, /data-role="top-centre"/);
  }

  if (
    question.state.representation === "OUTER_RADIUS_AND_THICKNESS" ||
    question.state.representation === "INVERSE_INNER_RADIUS"
  ) {
    assert.match(question.diagram.svg, />r = \?</);
    assert.doesNotMatch(
      question.diagram.svg,
      new RegExp(`r = ${question.state.innerRadius} ${profile.radialUnit}`),
    );
    assert.match(
      question.solutionDiagram.svg,
      new RegExp(`r = ${question.state.innerRadius} ${profile.radialUnit}`),
    );
  }

  if (profile.mixedUnits) {
    const workedText = [
      ...question.explanation.steps.map((step) => `${step.title} ${step.body} ${step.equation ?? ""}`),
      ...question.learnerSolution.steps,
    ].join("\n");
    assert.match(workedText, /Convert/);
    assert.match(workedText, /100/);
  }

  if (question.target === "VOLUME" && profile.id === "RADIAL_CM_LENGTH_M_TO_CM3") {
    assert.ok(question.options.some(
      (option) => option.misconceptionId === "OMITTED_MIXED_LENGTH_CONVERSION",
    ));
  }
  if (question.target === "VOLUME" && profile.id === "RADIAL_M_LENGTH_CM_TO_CM3") {
    assert.ok(question.options.some(
      (option) => option.misconceptionId === "USED_LINEAR_UNIT_CONVERSION_FOR_AREA",
    ));
  }

  assert.equal(question.renderSurfaces.attempt.diagram, null);
  assert.equal(question.renderSurfaces.practice.diagram, question.diagram);
  assert.equal(question.renderSurfaces.solution.diagram, question.solutionDiagram);
  assert.equal(question.renderSurfaces.solution.exposesInternalCodes, false);
  assert.equal(question.renderSurfaces.admin.exposesInternalCodes, true);
  assert.equal(question.renderSurfaces.admin.trapCodes.length, 3);

  const learnerText = [
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
  ].join("\n");
  assert.doesNotMatch(learnerText, /\[[A-Z0-9_]+\]/);
  assert.doesNotMatch(learnerText, /\b[PR]:-?\d/);
  assert.doesNotMatch(learnerText, /\\pih/);
  assert.doesNotMatch(learnerText, /=\$[^$]+\$\$$/);

  assert.equal(question.permanentQlId, null);
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioDiscoverable, false);
}
assert.equal(reviewStateKeys.size, 48);

console.log(
  "MEN-CP-011 Phase 2B passed for four balanced unit profiles across all four existing representations, including 24 mixed-unit records, exact conversion traps and lifecycle locks.",
);
