import assert from "node:assert/strict";
import test from "node:test";
import type { IndiaAdminFeatureCollection } from "../geometry/geojson";
import type { StaticGkAdminIngestBundle } from "../geometry/ingest-contract";
import {
  createCanonicalGeometryDigest,
  REQUIRED_TROPIC_STATES,
} from "../geometry/ingest-contract";
import { renderTropicCancerSvgFrame } from "../renderers/svg-map";
import { compileTropicCancerScene } from "../scenes/compile-tropic-cancer";

const STATE_CODES = ["GJ", "RJ", "MP", "CG", "JH", "WB", "TR", "MZ"] as const;

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
      properties: { stateName, stateCode: STATE_CODES[index] },
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
      acquiredAt: "2026-08-30",
      sourceArchiveFilename: "synthetic-test-fixture.zip",
      sourceArchiveSha256: "a".repeat(64),
      canonicalGeoJsonSha256: createCanonicalGeometryDigest(geometry),
      canonicalCrs: "EPSG:4326",
      featureCount: geometry.features.length,
      stateCount: geometry.features.length,
      conversionTool: "test-fixture",
      conversionCommandOrNotes: "Synthetic rectangles used only for renderer unit tests.",
      reviewer: "automated-test",
    },
  };
}

test("renderer refuses a geometry-pending scene", () => {
  const bundle = makeFixture();
  assert.throws(
    () => renderTropicCancerSvgFrame(compileTropicCancerScene(), bundle.geometry, 10_500),
    /not render-ready/,
  );
});

test("renderer produces a 9:16 SVG with the active state and deterministic latitude route", () => {
  const bundle = makeFixture();
  const scene = compileTropicCancerScene(bundle);
  const svg = renderTropicCancerSvgFrame(scene, bundle.geometry, 10_500);

  assert.match(svg, /<svg/);
  assert.match(svg, /width="1080" height="1920"/);
  assert.match(svg, /Gujarat/);
  assert.match(svg, /1\. Gujarat/);
  assert.match(svg, /#DCE7FF/);
  assert.match(svg, /Tropic of Cancer/);
  assert.match(svg, /#B42318/);
  assert.match(svg, /Survey of India geometry/);
});

test("renderer switches to the quiz card during the manifest quiz shot", () => {
  const bundle = makeFixture();
  const scene = compileTropicCancerScene(bundle);
  const svg = renderTropicCancerSvgFrame(scene, bundle.geometry, 32_000);

  assert.match(svg, /How many Indian states does the Tropic of Cancer pass through\?/);
  assert.match(svg, /C\. 8/);
});
