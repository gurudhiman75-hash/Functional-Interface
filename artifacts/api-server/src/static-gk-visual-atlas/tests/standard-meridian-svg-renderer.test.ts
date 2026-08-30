import assert from "node:assert/strict";
import test from "node:test";
import type { IndiaAdminFeatureCollection } from "../geometry/geojson";
import type { StaticGkAdminIngestBundle } from "../geometry/ingest-contract";
import { createCanonicalGeometryDigest, REQUIRED_TROPIC_STATES } from "../geometry/ingest-contract";
import { renderStandardMeridianSvgFrame } from "../renderers/svg-map";
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
  const geometry: IndiaAdminFeatureCollection = {
    type: "FeatureCollection",
    features: [
      ...REQUIRED_TROPIC_STATES.map((stateName, index) => ({
        type: "Feature" as const,
        properties: { stateName, stateCode: `T${index + 1}` },
        geometry: rectangle(68 + index * 3, 70 + index * 3, 20, 27),
      })),
      {
        type: "Feature",
        properties: { stateName: "Uttar Pradesh", stateCode: "UP", districtName: "Mirzapur", districtCode: "MZP" },
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
      acquiredAt: "2026-08-30",
      sourceArchiveFilename: "synthetic-test-fixture.zip",
      sourceArchiveSha256: "e".repeat(64),
      canonicalGeoJsonSha256: createCanonicalGeometryDigest(geometry),
      canonicalCrs: "EPSG:4326",
      featureCount: geometry.features.length,
      stateCount: geometry.features.length,
      conversionTool: "test-fixture",
      conversionCommandOrNotes: "Synthetic renderer fixture only.",
      reviewer: "automated-test",
    },
  };
}

test("Standard Meridian renderer refuses a pending scene", () => {
  const bundle = makeFixture();
  assert.throws(
    () => renderStandardMeridianSvgFrame(compileStandardMeridianScene(), bundle.geometry, 15_000),
    /not render-ready/,
  );
});

test("Standard Meridian renderer highlights verified Mirzapur district during the manifest district shot", () => {
  const bundle = makeFixture();
  const scene = compileStandardMeridianScene(bundle);
  const svg = renderStandardMeridianSvgFrame(scene, bundle.geometry, 15_000);
  assert.match(svg, /width="1080" height="1920"/);
  assert.match(svg, /82°30′E/);
  assert.match(svg, /Mirzapur district/);
  assert.match(svg, /#FDE68A/);
  assert.match(svg, /#7C2D12/);
});

test("Standard Meridian renderer displays quiz during the manifest quiz shot", () => {
  const bundle = makeFixture();
  const scene = compileStandardMeridianScene(bundle);
  const svg = renderStandardMeridianSvgFrame(scene, bundle.geometry, 30_000);
  assert.match(svg, /Which longitude is India&apos;s Standard Meridian\?/);
  assert.match(svg, /B\. 82°30′E/);
});
