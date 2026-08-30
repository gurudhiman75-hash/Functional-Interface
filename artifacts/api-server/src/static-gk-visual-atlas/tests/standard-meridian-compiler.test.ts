import assert from "node:assert/strict";
import test from "node:test";
import type { IndiaAdminFeatureCollection } from "../geometry/geojson";
import type { StaticGkAdminIngestBundle } from "../geometry/ingest-contract";
import { createCanonicalGeometryDigest, REQUIRED_TROPIC_STATES } from "../geometry/ingest-contract";
import { compileStandardMeridianScene } from "../scenes/compile-standard-meridian";

function rectangle(minLon: number, maxLon: number, minLat: number, maxLat: number) {
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
  const tropicFeatures = REQUIRED_TROPIC_STATES.map((stateName, index) => ({
    type: "Feature" as const,
    properties: { stateName, stateCode: `T${index + 1}` },
    geometry: rectangle(68 + index * 3, 70 + index * 3, 20, 27),
  }));
  const geometry: IndiaAdminFeatureCollection = {
    type: "FeatureCollection",
    features: [
      ...tropicFeatures,
      {
        type: "Feature",
        properties: { stateName: "Uttar Pradesh", stateCode: "UP" },
        geometry: rectangle(80, 84, 24, 28),
      },
    ],
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
      sourceArchiveSha256: "c".repeat(64),
      canonicalGeoJsonSha256: createCanonicalGeometryDigest(geometry),
      canonicalCrs: "EPSG:4326",
      featureCount: geometry.features.length,
      stateCount: geometry.features.length,
      conversionTool: "test-fixture",
      conversionCommandOrNotes: "Synthetic fixture only.",
      reviewer: "automated-test",
    },
  };
}

test("standard meridian remains geometry-pending without official geometry", () => {
  assert.equal(compileStandardMeridianScene().status, "geometry-pending");
});

test("standard meridian requires independent Mirzapur point verification", () => {
  const scene = compileStandardMeridianScene(makeFixture());
  assert.equal(scene.status, "point-verification-pending");
  assert.ok(scene.meridian.indiaSegments.length > 0);
  assert.ok(scene.meridian.upSegments.length > 0);
});

test("standard meridian becomes render-ready with a plausible point inside UP", () => {
  const scene = compileStandardMeridianScene(makeFixture(), {
    latitude: 25.2,
    longitude: 82.57,
    source: "government-fixture",
  });
  assert.equal(scene.status, "render-ready");
  assert.equal(scene.meridian.longitude, 82.5);
  assert.equal(scene.quiz.correctOptionIndex, 1);
});

test("standard meridian rejects a canonical geometry checksum mismatch", () => {
  const bundle = makeFixture();
  bundle.receipt.canonicalGeoJsonSha256 = "d".repeat(64);
  assert.throws(() => compileStandardMeridianScene(bundle), /SHA-256 does not match supplied geometry/);
});

test("standard meridian rejects a Mirzapur point outside UP", () => {
  assert.throws(
    () =>
      compileStandardMeridianScene(makeFixture(), {
        latitude: 30,
        longitude: 82.57,
        source: "government-fixture",
      }),
    /does not lie inside canonical Uttar Pradesh/,
  );
});
