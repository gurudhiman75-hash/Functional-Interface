import assert from "node:assert/strict";
import test from "node:test";
import { gzipSync } from "node:zlib";
import type { IndiaAdminFeatureCollection } from "../geometry/geojson";
import {
  createCanonicalGeometryDigest,
  type StaticGkGeometryIngestReceipt,
} from "../geometry/ingest-contract";
import { decodeAndValidateAdminGeometry } from "../geometry/runtime-admin-loader";

const requiredStates = [
  ["Gujarat", "GJ"],
  ["Rajasthan", "RJ"],
  ["Madhya Pradesh", "MP"],
  ["Chhattisgarh", "CG"],
  ["Jharkhand", "JH"],
  ["West Bengal", "WB"],
  ["Tripura", "TR"],
  ["Mizoram", "MZ"],
] as const;

function rectangle(index: number) {
  const x = 68 + index * 3;
  return {
    type: "Polygon" as const,
    coordinates: [[
      [x, 20] as [number, number],
      [x + 2, 20] as [number, number],
      [x + 2, 27] as [number, number],
      [x, 27] as [number, number],
      [x, 20] as [number, number],
    ]],
  };
}

function fixture() {
  const geometry: IndiaAdminFeatureCollection = {
    type: "FeatureCollection",
    features: requiredStates.map(([stateName, stateCode], index) => ({
      type: "Feature",
      properties: { stateName, stateCode },
      geometry: rectangle(index),
    })),
  };
  const receipt: StaticGkGeometryIngestReceipt = {
    geometryId: "geo.india.admin-boundaries.v1",
    sourcePublisher: "Survey of India",
    sourceProductCode: "OVSF/1M/7",
    sourcePortalUrl: "https://example.invalid",
    acquiredAt: "2026-08-30",
    sourceArchiveFilename: "fixture.zip",
    sourceArchiveSha256: "a".repeat(64),
    canonicalGeoJsonSha256: createCanonicalGeometryDigest(geometry),
    canonicalCrs: "EPSG:4326",
    featureCount: geometry.features.length,
    stateCount: geometry.features.length,
    conversionTool: "test",
    conversionCommandOrNotes: "test fixture",
    reviewer: "test",
  };
  return { geometry, receipt };
}

test("runtime loader validates canonical JSON bytes", () => {
  const { geometry, receipt } = fixture();
  const bytes = Buffer.from(JSON.stringify(geometry), "utf8");
  const bundle = decodeAndValidateAdminGeometry(bytes, receipt);
  assert.equal(bundle.geometry.features.length, 8);
});

test("runtime loader accepts gzip while validating the decompressed canonical object", () => {
  const { geometry, receipt } = fixture();
  const bytes = gzipSync(Buffer.from(JSON.stringify(geometry), "utf8"));
  const bundle = decodeAndValidateAdminGeometry(bytes, receipt);
  assert.equal(bundle.receipt.canonicalGeoJsonSha256, receipt.canonicalGeoJsonSha256);
});

test("runtime loader rejects geometry whose object digest differs from the receipt", () => {
  const { geometry, receipt } = fixture();
  geometry.features[0].properties.stateCode = "BAD";
  assert.throws(
    () => decodeAndValidateAdminGeometry(Buffer.from(JSON.stringify(geometry), "utf8"), receipt),
    /SHA-256 does not match supplied geometry/,
  );
});
