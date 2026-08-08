import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  buildSpatialClassificationEditorialReviewExport,
  buildSpatialClassificationEditorialReviewHtml,
  findSpatialClassificationSeparatingProperties,
  generateFigureClassificationProofQuestion,
  renderSpatialSceneToSvg,
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
  assert.equal(question.solverEvidence.sceneIntegrityCheck, "PASS");
  assert.equal(
    question.reviewMetadata.uniqueSeparatingPropertyCheck,
    "PASS",
  );
  assert.equal(question.reviewMetadata.optionUniquenessCheck, "PASS");
  assert.equal(question.reviewMetadata.sceneIntegrityCheck, "PASS");
  assert.equal(question.reviewMetadata.localeMode, "LANGUAGE_NEUTRAL");
  assert.equal(question.explanationSteps.length, 4);
  assert(question.learnerExplanation.observation.length > 20);
  assert(question.learnerExplanation.rule.length > 20);
  assert(question.learnerExplanation.application.length > 20);
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
): SpatialAnalogyFigureState {
  return {
    outerShape,
    innerShape,
    outerRotationQuarter: 0,
    innerRotationQuarter: 0,
    markerPosition,
    direction,
    shadedInner: false,
    segmentCount: 2,
    segmentAnchor: "BOTTOM",
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
    "SHADING_MATCHES_ODD_SEGMENTS",
    "MARKER_OPPOSITE_SEGMENT_ANCHOR",
    "INNER_NEXT_AFTER_OUTER",
    "ARROW_POINTS_TO_SEGMENT_ANCHOR",
  ],
);

const answerSequence = firstCorpus.map(
  (question) => question.correctOptionIndex,
);
assert.deepEqual(answerSequence, [0, 1, 2, 3, 0, 1, 2, 3]);
for (let index = 1; index < answerSequence.length; index += 1) {
  assert.notEqual(answerSequence[index], answerSequence[index - 1]);
}
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

assert.throws(
  () =>
    generateFigureClassificationProofQuestion({
      seed: "FCL-NEGATIVE-AMBIGUOUS",
      prototypeId: "FCL-PROT-NEGATIVE-AMBIGUOUS",
      propertyId: "OUTER_INNER_DIFFERENT",
      expectedOddIndex: 3,
      states: [
        figure("TRIANGLE", "SQUARE", "TOP_LEFT", "UP"),
        figure("PENTAGON", "CIRCLE", "TOP_RIGHT", "RIGHT"),
        figure("SQUARE", "TRIANGLE", "BOTTOM_RIGHT", "DOWN"),
        figure("TRIANGLE", "TRIANGLE", "BOTTOM_LEFT", "UP"),
      ],
    }),
  /Ambiguous FCL classification/,
);

const review = buildSpatialClassificationEditorialReviewExport(firstCorpus);
assert.equal(review.schemaVersion, "1.0");
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
assert.match(html, /FCL-001 Figure Classification Proof Review/);
assert.match(
  html,
  /Select the figure that is different from the other three/,
);
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
      status: "PASS_SPA_FND_001_FCL_001_PROOF",
      corpus: {
        total: firstCorpus.length,
        answerSequence: answerSequence.map((position) =>
          String.fromCharCode(65 + position),
        ),
        properties: firstCorpus.map((question) => question.propertyId),
      },
      checks: {
        deterministicRegeneration: true,
        uniqueThreeToOneProperty: true,
        ambiguityRejection: true,
        semanticOptionUniqueness: true,
        renderedOptionUniqueness: true,
        sceneStateIntegrity: true,
        balancedNonRepeatingAnswerSequence: true,
        learnerExplanation: true,
        responsiveEditorialReview: true,
        lifecycleIsolation: true,
      },
    },
    null,
    2,
  ),
);
