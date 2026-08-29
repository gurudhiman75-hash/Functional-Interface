import assert from "node:assert/strict";
import test from "node:test";
import { compileTropicCancerScene } from "../scenes/compile-tropic-cancer";
import type { IndiaAdminFeatureCollection } from "../geometry/geojson";
import type { StaticGkAdminIngestBundle } from "../geometry/ingest-contract";
import { REQUIRED_TROPIC_STATES } from "../geometry/ingest-contract";

function rectangle(minLon: number, maxLon: number, minLat = 20, maxLat = 27) {
  return {
    type: "Polygon" as const,
    coordinates: [[
      [minLon, minLat] as [number, number],
      [maxLon, minLat] as [number, number],
      [maxLon, maxLat] as [number, number],
      [minLon, maxLat] as [number, number],
      [minLon, minLat] as [number, number],
    ]],
  };
}

function makeFixture(): StaticGkAdminIngestBundle {
  const geometry: IndiaAdminFeatureCollection = {
    type: "FeatureCollection",
    features: REQUIRED_TROPIC_STATES.map((stateName, index) => ({
      type: "Feature",
      properties: { stateName, stateCode: `S${index + 1}` },
      geometry: rectangle(68 + index * 3, 70 + index * 3),
    })),
  };

  return {
    geometry,
    receipt: {
      geometryId: "geo.india.admin-boundaries.v1",
      sourcePublisher: "Survey of India",
      sourceProductCode: "OVSF/1M/7",
      sourcePortalUrl: "https://onlinemaps.surveyofindia.gov.in/Digital_Products.aspx",
      acquiredAt: "2026-08-29",
      sourceArchiveFilename: "fixture.zip",
      sourceArchiveSha256: "a".repeat(64),
      canonicalGeoJsonSha256: "b".repeat(64),
      canonicalCrs: "EPSG:4326",
      featureCount: geometry.features.length,
      stateCount: geometry.features.length,
      conversionTool: "test-fixture",
      conversionCommandOrNotes: "Synthetic rectangles used only for unit testing; never production geometry.",
      reviewer: "automated-test",
    },
  };
}

test("tropic scene fails closed when official geometry is absent", () => {
  const scene = compileTropicCancerScene();
  assert.equal(scene.status, "geometry-pending");
  assert.equal(scene.route.resolvedSegments.length, 0);
  assert.equal(scene.geometrySource.sourceProductCode, "OVSF/1M/7");
});

test("tropic scene resolves all eight states in locked west-to-east order", () => {
  const scene = compileTropicCancerScene(makeFixture());
  assert.equal(scene.status, "render-ready");
  assert.deepEqual(scene.route.resolvedSegments.map((segment) => segment.stateName), [...REQUIRED_TROPIC_STATES]);
  assert.equal(scene.route.latitude, 23.5);
  assert.equal(scene.quiz.correctOptionIndex, 2);
});

test("tropic scene rejects geometry that does not intersect a locked state", () => {
  const bundle = makeFixture();
  bundle.geometry.features[3].geometry = rectangle(77, 79, 30, 31);
  assert.throws(() => compileTropicCancerScene(bundle), /does not intersect Chhattisgarh/);
});
