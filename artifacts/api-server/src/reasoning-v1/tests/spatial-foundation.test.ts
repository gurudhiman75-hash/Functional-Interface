import assert from "node:assert/strict";
import {
  SPATIAL_SCENE_VERSION,
  WATER_CLOCK_PRESENTATION_POLICY,
  areSpatialScenesEquivalent,
  buildStandardTransformCandidates,
  classifySpatialSceneSymmetry,
  clockTimeToHandAngles,
  findClockTimeMatchingHandAngles,
  reflectClockHandsHorizontally,
  reflectSceneHorizontally,
  reflectSceneVertically,
  renderSpatialSceneToSvg,
  rotateScene,
  spatialSceneSemanticFingerprint,
  translateScene,
  validateMirrorClockCrossCheck,
  validateSpatialGlyphAuthorityEntry,
  validateSpatialOptionUniqueness,
  validateSpatialScene,
  validateSpatialTransformCandidateUniqueness,
  validateSpatialTransformQuestion,
  type SpatialArcNode,
  type SpatialGlyphAuthorityEntry,
  type SpatialScene,
} from "../foundation/spatial";

const baseScene: SpatialScene = {
  version: SPATIAL_SCENE_VERSION,
  id: "SPA-FND-TEST-BASE",
  viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
  nodes: [
    {
      kind: "polygon",
      id: "triangle",
      role: "primary-shape",
      layer: 1,
      points: [
        { x: 20, y: 20 },
        { x: 40, y: 25 },
        { x: 25, y: 50 },
      ],
      style: { stroke: "#111", strokeWidth: 2, fill: "none" },
    },
    {
      kind: "circle",
      id: "marker",
      role: "marker",
      layer: 2,
      center: { x: 30, y: 30 },
      radius: 3,
      style: { stroke: "#111", strokeWidth: 1.5, fill: "#111" },
    },
    {
      kind: "line",
      id: "tick",
      role: "orientation-marker",
      layer: 3,
      start: { x: 22, y: 18 },
      end: { x: 28, y: 13 },
    },
  ],
};

const baseValidation = validateSpatialScene(baseScene);
assert.equal(baseValidation.ok, true, JSON.stringify(baseValidation.errors));

const mirrored = reflectSceneVertically(baseScene, 50, "SPA-FND-TEST-MIRROR");
const mirroredTriangle = mirrored.nodes.find((node) => node.id === "triangle");
assert(mirroredTriangle && mirroredTriangle.kind === "polygon");
assert.deepEqual(mirroredTriangle.points[0], { x: 80, y: 20 });
assert.deepEqual(mirroredTriangle.points[1], { x: 60, y: 25 });

const restoredFromMirror = reflectSceneVertically(
  mirrored,
  50,
  "SPA-FND-TEST-RESTORED",
);
assert.equal(areSpatialScenesEquivalent(baseScene, restoredFromMirror), true);

let rotated = baseScene;
for (let count = 0; count < 4; count += 1) {
  rotated = rotateScene(rotated, 90, { x: 50, y: 50 });
}
assert.equal(areSpatialScenesEquivalent(baseScene, rotated), true);

const translated = translateScene(baseScene, 5, -5);
const translatedMarker = translated.nodes.find((node) => node.id === "marker");
assert(translatedMarker && translatedMarker.kind === "circle");
assert.deepEqual(translatedMarker.center, { x: 35, y: 25 });

const horizontallyReflected = reflectSceneHorizontally(baseScene, 50);
const reflectedTick = horizontallyReflected.nodes.find(
  (node) => node.id === "tick",
);
assert(reflectedTick && reflectedTick.kind === "line");
assert.deepEqual(reflectedTick.start, { x: 22, y: 82 });
assert.deepEqual(reflectedTick.end, { x: 28, y: 87 });

const arcScene: SpatialScene = {
  version: SPATIAL_SCENE_VERSION,
  id: "SPA-FND-TEST-ARC",
  viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
  nodes: [
    {
      kind: "arc",
      id: "arc",
      center: { x: 50, y: 50 },
      radius: 20,
      startAngleDeg: 0,
      endAngleDeg: 90,
      sweep: "clockwise",
    },
  ],
};
const reflectedArcScene = reflectSceneVertically(arcScene, 50);
const reflectedArc = reflectedArcScene.nodes[0] as SpatialArcNode;
assert.equal(reflectedArc.sweep, "counterclockwise");

const reorderedAndRenamed: SpatialScene = {
  ...baseScene,
  id: "DIFFERENT-SCENE-ID",
  nodes: [...baseScene.nodes]
    .reverse()
    .map((node, index) => ({ ...node, id: `renamed-${index}` })),
};
assert.equal(
  spatialSceneSemanticFingerprint(baseScene),
  spatialSceneSemanticFingerprint(reorderedAndRenamed),
);

const duplicateOptions = validateSpatialOptionUniqueness([
  baseScene,
  reorderedAndRenamed,
]);
assert.equal(duplicateOptions.ok, false);
assert(
  duplicateOptions.errors.some((entry) => entry.code === "EQUIVALENT_OPTIONS"),
);

const unsafeScene: SpatialScene = {
  ...baseScene,
  id: "SPA-FND-TEST-UNSAFE",
  nodes: [
    {
      ...baseScene.nodes[0],
      style: { fill: "url(javascript:alert(1))" },
    },
  ],
};
const unsafeValidation = validateSpatialScene(unsafeScene);
assert.equal(unsafeValidation.ok, false);
assert(
  unsafeValidation.errors.some((entry) => entry.code === "UNSAFE_STYLE_VALUE"),
);

const firstSvg = renderSpatialSceneToSvg(baseScene, {
  ariaLabel: "Asymmetric spatial proof figure",
  includeNodeIds: true,
});
const secondSvg = renderSpatialSceneToSvg(baseScene, {
  ariaLabel: "Asymmetric spatial proof figure",
  includeNodeIds: true,
});
assert.equal(firstSvg, secondSvg);
assert.match(firstSvg, /^<svg /);
assert.match(firstSvg, /data-spatial-version="1.0"/);
assert.match(firstSvg, /data-node-id="triangle"/);
assert.doesNotMatch(firstSvg, /<script|foreignObject|javascript:/i);

const baseSymmetry = classifySpatialSceneSymmetry(baseScene);
assert.deepEqual(baseSymmetry, {
  vertical: false,
  horizontal: false,
  rotational180: false,
});

const standardCandidates = buildStandardTransformCandidates(baseScene);
const standardCandidateValidation =
  validateSpatialTransformCandidateUniqueness(standardCandidates);
assert.equal(
  standardCandidateValidation.ok,
  true,
  JSON.stringify(standardCandidateValidation.errors),
);
const transformQuestionValidation = validateSpatialTransformQuestion({
  sourceScene: baseScene,
  requestedTransform: "REFLECT_VERTICAL",
  candidates: standardCandidates,
});
assert.equal(
  transformQuestionValidation.ok,
  true,
  JSON.stringify(transformQuestionValidation.errors),
);

const symmetricScene: SpatialScene = {
  version: SPATIAL_SCENE_VERSION,
  id: "SPA-FND-TEST-SYMMETRIC",
  viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
  nodes: [
    {
      kind: "circle",
      id: "central-circle",
      center: { x: 50, y: 50 },
      radius: 15,
      style: { stroke: "#111", strokeWidth: 2, fill: "none" },
    },
  ],
};
assert.deepEqual(classifySpatialSceneSymmetry(symmetricScene), {
  vertical: true,
  horizontal: true,
  rotational180: true,
});
const degenerateQuestion = validateSpatialTransformQuestion({
  sourceScene: symmetricScene,
  requestedTransform: "REFLECT_VERTICAL",
});
assert.equal(degenerateQuestion.ok, false);
assert(
  degenerateQuestion.errors.some(
    (entry) => entry.code === "SPA_ACCIDENTAL_SELF_SYMMETRY",
  ),
);
const collidingCandidates = validateSpatialTransformCandidateUniqueness(
  buildStandardTransformCandidates(symmetricScene),
);
assert.equal(collidingCandidates.ok, false);
assert(
  collidingCandidates.errors.some(
    (entry) => entry.code === "SPA_EQUIVALENT_TRANSFORM_CANDIDATES",
  ),
);

const mirrorClockProof = validateMirrorClockCrossCheck({ hour: 4, minute: 20 });
assert.equal(mirrorClockProof.ok, true);
assert.deepEqual(mirrorClockProof.shortcutTime, { hour: 7, minute: 40 });
assert.equal(clockTimeToHandAngles({ hour: 4, minute: 20 }).hourAngleDeg, 130);

const waterReflectedTwoOClock = reflectClockHandsHorizontally(
  clockTimeToHandAngles({ hour: 2, minute: 0 }),
);
assert.deepEqual(waterReflectedTwoOClock, {
  hourAngleDeg: 120,
  minuteAngleDeg: 180,
});
assert.equal(findClockTimeMatchingHandAngles(waterReflectedTwoOClock), null);
assert.equal(WATER_CLOCK_PRESENTATION_POLICY, "DIAGRAM_ONLY");

const glyphEntry: SpatialGlyphAuthorityEntry = {
  glyphId: "LATIN-PROOF-ASYMMETRIC",
  script: "LATIN",
  localeMode: "SCRIPT_SPECIFIC",
  canonicalScene: baseScene,
  symmetry: baseSymmetry,
  authorityVersion: "SPA-GLYPH-PROOF-v1",
};
const glyphValidation = validateSpatialGlyphAuthorityEntry(glyphEntry);
assert.equal(glyphValidation.ok, true, JSON.stringify(glyphValidation.errors));
const invalidGlyphValidation = validateSpatialGlyphAuthorityEntry({
  ...glyphEntry,
  localeMode: "INSTRUCTION_LOCALISED",
});
assert.equal(invalidGlyphValidation.ok, false);
assert(
  invalidGlyphValidation.errors.some(
    (entry) => entry.code === "SPA_GLYPH_SCRIPT_LOCALE_MODE_MISMATCH",
  ),
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SPA_FND_001_FOUNDATION_RUNTIME",
      checks: {
        sceneValidation: true,
        verticalReflection: true,
        horizontalReflection: true,
        fourQuarterTurnsRestoreScene: true,
        translation: true,
        arcOrientationFlip: true,
        canonicalFingerprint: true,
        equivalentOptionRejection: true,
        unsafeStyleRejection: true,
        deterministicSvg: true,
        symmetryClassification: true,
        accidentalSymmetryRejection: true,
        transformCandidateCollisionRejection: true,
        continuousClockHourHand: true,
        mirrorClockDualProof: true,
        waterClockDiagramOnlyPolicy: true,
        scriptSpecificGlyphAuthority: true,
      },
    },
    null,
    2,
  ),
);
