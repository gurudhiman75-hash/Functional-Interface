import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  auditSpatialClassificationNuisanceFeatures,
  buildSpatialClassificationEditorialReviewExport,
  buildSpatialClassificationEditorialReviewHtml,
  findSpatialClassificationSeparatingProperties,
  generateFigureClassificationProofQuestion,
  renderSpatialSceneToSvg,
  spatialClassificationPropertySatisfied,
  spatialClassificationPropertyVector,
  validateSpatialClassificationSceneAgainstState,
  validateSpatialScene,
  type SpatialAnalogyFigureState,
  type SpatialClassificationProofQuestion,
} from "../foundation/spatial";
import {
  buildSpatialFcl001ProofCorpus,
} from "../proofs/spa-fnd-001-fcl-001-corpus";

function assertLifecycleLocked(question: SpatialClassificationProofQuestion): void {
  assert.equal(question.lifecycle.permanentQlId, null);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}

function assertSanitisedSvg(svg: string): void {
  assert.match(svg, /^<svg /);
  assert.doesNotMatch(svg, /<script|foreignObject|javascript:/i);
}

function assertQuestion(question: SpatialClassificationProofQuestion): void {
  assert.equal(question.familyCode, "SPA-001");
  assert.equal(question.chapterCode, "FCL-001");
  assert.equal(question.instructionKey, "FCL_SELECT_ODD_FIGURE");
  assert.equal(question.options.length, 4);
  assert(question.correctOptionIndex >= 0 && question.correctOptionIndex < 4);
  assert.deepEqual(
    question.solverEvidence.separatingPropertyIds,
    [question.propertyId],
  );
  assert.equal(question.solverEvidence.ambiguityCheck, "PASS");
  assert.equal(question.solverEvidence.approvedPropertyAuthorityCheck, "PASS");
  assert.equal(question.solverEvidence.nuisanceFeatureAuditCheck, "PASS");
  assert.equal(question.solverEvidence.sceneIntegrityCheck, "PASS");
  assert.equal(
    question.reviewMetadata.uniqueWithinApprovedPropertyAuthorityCheck,
    "PASS",
  );
  assert.equal(question.reviewMetadata.nuisanceFeatureAuditCheck, "PASS");
  assert.equal(question.reviewMetadata.auditedNuisanceFeatureCount, 31);
  assert.equal(question.reviewMetadata.optionUniquenessCheck, "PASS");
  assert.equal(question.reviewMetadata.sceneIntegrityCheck, "PASS");
  assert.equal(question.reviewMetadata.localeMode, "LANGUAGE_NEUTRAL");
  assert.equal(question.explanationSteps.length, 4);
  assert(question.learnerExplanation.observation.length > 20);
  assert(question.learnerExplanation.rule.length > 20);
  assert.match(question.learnerExplanation.application, /A: .*B: .*C: .*D:/);
  assert(question.learnerExplanation.check.length > 20);
  assertLifecycleLocked(question);

  const states = question.options.map((option) => option.state);
  const propertyVector = spatialClassificationPropertyVector(
    states,
    question.propertyId,
  );
  assert.deepEqual(propertyVector, question.solverEvidence.propertyVector);
  assert.equal(propertyVector.filter(Boolean).length, 3);
  assert.equal(propertyVector[question.correctOptionIndex], false);
  assert.deepEqual(
    findSpatialClassificationSeparatingProperties(states),
    [question.propertyId],
  );
  const nuisanceAudit = auditSpatialClassificationNuisanceFeatures(
    states,
    question.propertyId,
  );
  assert.equal(nuisanceAudit.ok, true, nuisanceAudit.ambiguousFeatureIds.join(", "));
  assert.deepEqual(nuisanceAudit.ambiguousFeatureIds, []);
  assert.deepEqual(
    nuisanceAudit.distributions,
    question.reviewMetadata.nuisanceFeatureDistributions,
  );

  assert.equal(
    new Set(question.options.map((option) => option.stateFingerprint)).size,
    4,
  );
  assert.equal(
    new Set(question.options.map((option) => option.sceneFingerprint)).size,
    4,
  );
  assert.equal(
    question.options.filter((option) => option.label === "ODD_FIGURE").length,
    1,
  );

  question.options.forEach((option, optionIndex) => {
    assert.equal(
      option.satisfiesProperty,
      optionIndex !== question.correctOptionIndex,
    );
    const validation = validateSpatialScene(option.scene);
    assert.equal(validation.ok, true, JSON.stringify(validation.errors));
    const integrity = validateSpatialClassificationSceneAgainstState(
      option.scene,
      option.state,
    );
    assert.equal(integrity.ok, true, JSON.stringify(integrity.errors));
    assertSanitisedSvg(renderSpatialSceneToSvg(option.scene));
  });
}

function figure(
  outerShape: SpatialAnalogyFigureState["outerShape"],
  innerShape: SpatialAnalogyFigureState["innerShape"],
  markerPosition: SpatialAnalogyFigureState["markerPosition"],
  direction: SpatialAnalogyFigureState["direction"],
  shadedInner = false,
  segmentCount: SpatialAnalogyFigureState["segmentCount"] = 2,
  segmentAnchor: SpatialAnalogyFigureState["segmentAnchor"] = "BOTTOM",
): SpatialAnalogyFigureState {
  return {
    outerShape,
    innerShape,
    outerRotationQuarter: 0,
    innerRotationQuarter: 0,
    markerPosition,
    direction,
    shadedInner,
    segmentCount,
    segmentAnchor,
  };
}

const firstCorpus = buildSpatialFcl001ProofCorpus();
const secondCorpus = buildSpatialFcl001ProofCorpus();

assert.deepEqual(firstCorpus, secondCorpus);
assert.equal(firstCorpus.length, 8);
firstCorpus.forEach(assertQuestion);

assert.deepEqual(
  firstCorpus.map((question) => question.propertyId),
  [
    "OUTER_INNER_DIFFERENT",
    "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE",
    "MARKER_ON_ARROW_SIDE",
    "ORIENTATIONS_MATCH",
    "SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE",
    "MARKER_OPPOSITE_SEGMENT_ANCHOR",
    "INNER_HAS_ONE_MORE_SIDE_THAN_OUTER",
    "ARROW_POINTS_TO_SEGMENT_ANCHOR",
  ],
);

const answerSequence = firstCorpus.map(
  (question) => question.correctOptionIndex,
);
assert.deepEqual(answerSequence, [0, 1, 2, 3, 0, 1, 2, 3]);
assert.deepEqual(
  answerSequence.reduce(
    (counts, position) => {
      counts[position] += 1;
      return counts;
    },
    [0, 0, 0, 0],
  ),
  [2, 2, 2, 2],
);

const arrowTop = figure(
  "TRIANGLE",
  "SQUARE",
  "TOP_LEFT",
  "UP",
  false,
  2,
  "TOP",
);
const arrowBottom = figure(
  "TRIANGLE",
  "SQUARE",
  "BOTTOM_RIGHT",
  "DOWN",
  false,
  2,
  "BOTTOM",
);
assert.equal(
  spatialClassificationPropertySatisfied(
    arrowTop,
    "ARROW_POINTS_TO_SEGMENT_ANCHOR",
  ),
  true,
);
assert.equal(
  spatialClassificationPropertySatisfied(
    arrowBottom,
    "ARROW_POINTS_TO_SEGMENT_ANCHOR",
  ),
  true,
);

const nuisanceStates = [
  figure("PENTAGON", "PENTAGON", "BOTTOM_RIGHT", "DOWN", false, 2, "RIGHT"),
  figure("TRIANGLE", "PENTAGON", "BOTTOM_RIGHT", "UP", true, 1, "TOP"),
  figure("TRIANGLE", "CIRCLE", "BOTTOM_RIGHT", "LEFT", false, 1, "BOTTOM"),
  figure("PENTAGON", "CIRCLE", "TOP_LEFT", "UP", true, 2, "RIGHT"),
] as const;
const nuisanceAudit = auditSpatialClassificationNuisanceFeatures(
  nuisanceStates,
  "OUTER_INNER_DIFFERENT",
);
assert.equal(nuisanceAudit.ok, false);
assert(nuisanceAudit.ambiguousFeatureIds.includes("MARKER_POSITION"));
assert.throws(
  () =>
    generateFigureClassificationProofQuestion({
      seed: "FCL-NEGATIVE-NUISANCE-AMBIGUITY",
      prototypeId: "FCL-PROT-NEGATIVE-NUISANCE",
      propertyId: "OUTER_INNER_DIFFERENT",
      expectedOddIndex: 0,
      states: nuisanceStates,
    }),
  /Nuisance feature ambiguity/,
);

const review = buildSpatialClassificationEditorialReviewExport(firstCorpus);
assert.equal(review.schemaVersion, "1.1");
assert.equal(review.chapterCode, "FCL-001");
assert.equal(review.questionCount, 8);
assert.equal(review.rows.length, 8);
assert(
  review.rows.every(
    (row) =>
      row.optionSvgs.length === 4 &&
      row.optionSvgs.every((svg) => svg.startsWith("<svg ")),
  ),
);

const html = buildSpatialClassificationEditorialReviewHtml(review);
assert.match(html, /^<!doctype html>/);
assert.match(html, /FCL-001 Figure Classification Ambiguity-Remediation Review/);
assert.match(
  html,
  /Select the figure that is different from the other three/,
);
assert.match(html, /Nuisance audit:<\/strong> PASS \(31 features\)/);
assert.doesNotMatch(html, /<script|javascript:/i);

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fcl-001-editorial-review.json",
  `${JSON.stringify(review, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fcl-001-editorial-review.html",
  html,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SPA_FND_001_FCL_001_AMBIGUITY_REMEDIATION",
      corpus: {
        total: firstCorpus.length,
        answerSequence: answerSequence.map((position) =>
          String.fromCharCode(65 + position),
        ),
        properties: firstCorpus.map((question) => question.propertyId),
      },
      checks: {
        deterministicRegeneration: true,
        uniqueWithinApprovedPropertyAuthority: true,
        nuisanceFeatureAudit: true,
        nuisanceAmbiguityRejection: true,
        directionAnchorMapping: true,
        semanticOptionUniqueness: true,
        renderedOptionUniqueness: true,
        sceneStateIntegrity: true,
        balancedAnswerSequence: true,
        optionByOptionExplanation: true,
        responsiveEditorialReview: true,
        lifecycleIsolation: true,
      },
    },
    null,
    2,
  ),
);
