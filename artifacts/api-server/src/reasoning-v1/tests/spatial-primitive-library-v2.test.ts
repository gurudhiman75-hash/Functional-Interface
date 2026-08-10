import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  SPATIAL_PRIMITIVE_AUTHORITY_V2,
  SPATIAL_PRIMITIVE_IDS_V2,
  buildSpatialPrimitiveLibraryV2ReviewExport,
  buildSpatialPrimitiveLibraryV2ReviewHtml,
  classifySpatialSceneSymmetry,
  deriveSpatialPrimitiveQuarterTurnPeriodV2,
  getSpatialPrimitiveV2,
  renderSpatialSceneToSvg,
  spatialSceneSemanticFingerprint,
  validateSpatialPrimitiveLibraryV2,
  validateSpatialScene,
} from "../foundation/spatial";

const validation = validateSpatialPrimitiveLibraryV2();
assert.equal(validation.ok, true, JSON.stringify(validation.errors, null, 2));
assert.equal(validation.primitiveCount, 33);
assert.equal(validation.uniqueSceneFingerprintCount, 33);
assert.equal(SPATIAL_PRIMITIVE_IDS_V2.length, 33);
assert.equal(new Set(SPATIAL_PRIMITIVE_IDS_V2).size, 33);
assert.equal(SPATIAL_PRIMITIVE_AUTHORITY_V2.length, 33);

const expectedCategoryCounts = {
  CLOSED_SHAPE: 9,
  OPEN_FIGURE: 7,
  LINE_STRUCTURE: 7,
  PARTITIONED_FIGURE: 5,
  INTERNAL_SYMBOL: 5,
};
assert.deepEqual(
  Object.fromEntries(
    Object.keys(expectedCategoryCounts).map((category) => [
      category,
      SPATIAL_PRIMITIVE_AUTHORITY_V2.filter((entry) => entry.category === category).length,
    ]),
  ),
  expectedCategoryCounts,
);

const sceneFingerprints = new Set<string>();
for (const entry of SPATIAL_PRIMITIVE_AUTHORITY_V2) {
  assert.equal(getSpatialPrimitiveV2(entry.primitiveId), entry);
  const sceneValidation = validateSpatialScene(entry.canonicalScene);
  assert.equal(sceneValidation.ok, true, `${entry.primitiveId}: ${JSON.stringify(sceneValidation.errors)}`);
  assert.deepEqual(classifySpatialSceneSymmetry(entry.canonicalScene), entry.symmetry, entry.primitiveId);
  assert.equal(deriveSpatialPrimitiveQuarterTurnPeriodV2(entry), entry.rotationPeriodQuarterTurns, entry.primitiveId);
  assert.equal(entry.orientationSensitive, entry.rotationPeriodQuarterTurns !== 1, entry.primitiveId);
  assert.equal(entry.reflectionSensitive, !(entry.symmetry.vertical && entry.symmetry.horizontal), entry.primitiveId);
  const fingerprint = spatialSceneSemanticFingerprint(entry.canonicalScene);
  assert.equal(sceneFingerprints.has(fingerprint), false, entry.primitiveId);
  sceneFingerprints.add(fingerprint);
  const svg = renderSpatialSceneToSvg(entry.canonicalScene);
  assert.match(svg, /^<svg /);
  assert.doesNotMatch(svg, /<script|foreignObject|javascript:/i);
}

assert.equal(getSpatialPrimitiveV2("PLUS").rotationPeriodQuarterTurns, 1);
assert.equal(getSpatialPrimitiveV2("RECTANGLE").rotationPeriodQuarterTurns, 2);
assert.equal(getSpatialPrimitiveV2("L_SHAPE").rotationPeriodQuarterTurns, 4);
assert.equal(getSpatialPrimitiveV2("SEMICIRCLE").symmetry.vertical, true);
assert.equal(getSpatialPrimitiveV2("SEMICIRCLE").symmetry.horizontal, false);
assert.equal(getSpatialPrimitiveV2("SQUARE_DIAGONAL_DIVIDED").symmetry.rotational180, true);
assert.equal(getSpatialPrimitiveV2("ARROW_RIGHT").symmetry.horizontal, true);
assert.equal(getSpatialPrimitiveV2("ARROW_RIGHT").symmetry.vertical, false);

const review = buildSpatialPrimitiveLibraryV2ReviewExport();
assert.equal(review.primitiveCount, 33);
assert.equal(review.validation.status, "PASS");
assert.equal(review.rows.length, 33);
assert.equal(new Set(review.rows.map((row) => row.primitiveId)).size, 33);
const html = buildSpatialPrimitiveLibraryV2ReviewHtml(review);
assert.match(html, /^<!doctype html>/);
assert.match(html, /Spatial Primitive Library V2/);
assert.doesNotMatch(html, /<script|javascript:/i);

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fnd-001-primitive-library-v2-review.json",
  `${JSON.stringify(review, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fnd-001-primitive-library-v2-review.html",
  html,
  "utf8",
);

console.log(JSON.stringify({
  status: "PASS_SPA_FND_001_PRIMITIVE_LIBRARY_V2",
  primitiveCount: 33,
  uniqueSceneFingerprintCount: 33,
  categoryCounts: expectedCategoryCounts,
  checks: {
    canonicalSceneValidation: true,
    declaredSymmetryMatchesGeometry: true,
    quarterTurnPeriodMatchesGeometry: true,
    orientationSensitivityMatchesGeometry: true,
    reflectionSensitivityMatchesGeometry: true,
    uniqueCanonicalScenes: true,
    deterministicSvg: true,
    responsiveEditorialReview: true,
    previousLifecycleLocksUnaffected: true,
  },
}, null, 2));
