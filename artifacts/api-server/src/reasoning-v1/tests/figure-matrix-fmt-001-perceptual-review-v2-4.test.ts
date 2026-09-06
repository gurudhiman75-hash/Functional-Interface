import assert from "node:assert/strict";
import { generateFigureMatrixReviewQuestionV2_4 } from "../foundation/spatial/figure-matrix-review-runtime-v2-4";

const languages = ["en", "hi", "pa"] as const;
const orientationSeeds = Array.from({ length: 24 }, (_, index) => `fmt-SPA-QL-058-${3 + index * 4}`);

function symmetryPeriod(glyph: string): number {
  if (glyph === "ARROW") return 360;
  if (glyph === "TRIANGLE") return 120;
  if (glyph === "SQUARE" || glyph === "DIAMOND") return 90;
  if (glyph === "CIRCLE") return 1;
  return 360;
}

function normalizedRotation(glyph: string, rotation: number): number {
  const period = symmetryPeriod(glyph);
  return ((rotation % period) + period) % period;
}

// This is the exact defect V2.4 is designed to prevent: an equilateral triangle
// rotated through the intended 0°/120°/240° cycle has only one visible state.
assert.equal(new Set([0, 120, 240].map((rotation) => normalizedRotation("TRIANGLE", rotation))).size, 1);
// An arrow is asymmetric under those turns, so all three intended cycle states remain visible.
assert.equal(new Set([0, 120, 240].map((rotation) => normalizedRotation("ARROW", rotation))).size, 3);

let checked = 0;
for (const seed of orientationSeeds) {
  const english = generateFigureMatrixReviewQuestionV2_4({ qlId: "SPA-QL-058", seed, language: "en" });
  const replay = generateFigureMatrixReviewQuestionV2_4({ qlId: "SPA-QL-058", seed, language: "en" });
  assert.deepEqual(replay, english, `${seed} must remain deterministic after symmetry remediation`);
  assert.equal(english.version, "SPA-FMT-001-REVIEW-QUESTION-V2.4");
  assert.equal(english.solveFacts.sourceVariant, "ORIENTATION_CYCLE");
  assert.equal(english.solveFacts.orientationVisualMotif, "ASYMMETRIC_ARROW");
  assert.equal(english.validation.rotationalSymmetryNormalizedBeforeOptionUniqueness, true);
  assert.equal(english.validation.orientationCycleUsesAsymmetricDirectionalGlyph, true);
  assert.equal(english.validation.perceptualOptionEquivalenceRejected, true);
  assert.equal(english.solveFacts.perceptualOrientationKeys.length, 4);
  assert.equal(new Set(english.solveFacts.perceptualOrientationKeys).size, 4, `${seed} must expose four perceptually distinct orientation options`);
  assert.equal(new Set(english.optionSvgs).size, 4);
  assert.ok(english.matrixSvg.includes('<polyline points="4,-6 11,0 4,6"'), `${seed} matrix must use arrow geometry`);
  assert.ok(english.solutionSvg.includes('<polyline points="4,-6 11,0 4,6"'), `${seed} solution must use arrow geometry`);
  assert.equal(english.matrixSvg.includes('<polygon points="0,-10 9,8 -9,8"'), false, `${seed} must not retain the rotationally symmetric triangle motif`);
  assert.equal(english.solutionSvg.includes('<polygon points="0,-10 9,8 -9,8"'), false, `${seed} solution must not retain the rotationally symmetric triangle motif`);
  assert.ok(english.optionSvgs.every((svg) => svg.includes('<polyline points="4,-6 11,0 4,6"')), `${seed} every orientation option must render an arrow`);
  assert.ok(english.solveFacts.semanticOptionKeys.every((key) => JSON.parse(key).glyph === "ARROW"), `${seed} semantic option authority must match the arrow rendering`);
  assert.equal(JSON.parse(english.solveFacts.semanticAnswerKey).glyph, "ARROW");
  assert.equal(english.lifecycle.reviewOnly, true);
  assert.equal(english.lifecycle.questionStudioDiscoverable, false);
  assert.equal(english.lifecycle.mockTestEligible, false);
  assert.equal(english.lifecycle.publicReleaseAuthorized, false);
  assert.equal(english.lifecycle.studentDeliveryAuthorized, false);

  for (const language of languages) {
    const localized = generateFigureMatrixReviewQuestionV2_4({ qlId: "SPA-QL-058", seed, language });
    assert.equal(localized.geometryFingerprint, english.geometryFingerprint, `${seed}/${language} geometry must remain language-neutral`);
    assert.equal(localized.correctIndex, english.correctIndex, `${seed}/${language} answer index must preserve parity`);
    assert.equal(localized.solveFacts.semanticAnswerKey, english.solveFacts.semanticAnswerKey);
    assert.deepEqual(localized.solveFacts.semanticOptionKeys, english.solveFacts.semanticOptionKeys);
    assert.deepEqual(localized.solveFacts.perceptualOrientationKeys, english.solveFacts.perceptualOrientationKeys);
  }
  checked += 1;
}

console.log(JSON.stringify({
  authority: "SPA-FMT-001-REVIEW-V2.4-PERCEPTUAL-GUARD",
  checkedOrientationSeeds: checked,
  languages,
  oldTriangleCyclePerceptualStates: 1,
  remediatedArrowCyclePerceptualStates: 3,
  optionPerceptualUniqueness: true,
  semanticRenderingParity: true,
  releaseGatesRemainClosed: true,
}, null, 2));
