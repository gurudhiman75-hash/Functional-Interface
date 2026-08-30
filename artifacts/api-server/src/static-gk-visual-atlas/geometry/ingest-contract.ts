import { createHash } from "node:crypto";
import type { IndiaAdminFeatureCollection } from "./geojson";
import { assertAreaGeometryIsValid } from "./geojson";

export const SOI_ADMIN_PRODUCT_CODE = "OVSF/1M/7" as const;
export const SOI_ADMIN_GEOMETRY_ID = "geo.india.admin-boundaries.v1" as const;

export interface StaticGkGeometryIngestReceipt {
  geometryId: typeof SOI_ADMIN_GEOMETRY_ID;
  sourcePublisher: "Survey of India";
  sourceProductCode: typeof SOI_ADMIN_PRODUCT_CODE;
  sourcePortalUrl: string;
  acquiredAt: string;
  sourceArchiveFilename: string;
  sourceArchiveSha256: string;
  canonicalGeoJsonSha256: string;
  canonicalCrs: "EPSG:4326";
  featureCount: number;
  stateCount: number;
  conversionTool: string;
  conversionCommandOrNotes: string;
  reviewer: string;
}

export interface StaticGkAdminIngestBundle {
  receipt: StaticGkGeometryIngestReceipt;
  geometry: IndiaAdminFeatureCollection;
}

export const REQUIRED_TROPIC_STATES = [
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh",
  "Chhattisgarh",
  "Jharkhand",
  "West Bengal",
  "Tripura",
  "Mizoram",
] as const;

export function sha256Utf8(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function createCanonicalGeometryDigest(geometry: IndiaAdminFeatureCollection): string {
  return sha256Utf8(JSON.stringify(geometry));
}

export function validateAdminIngestBundle(bundle: StaticGkAdminIngestBundle): void {
  const { receipt, geometry } = bundle;
  if (receipt.geometryId !== SOI_ADMIN_GEOMETRY_ID) throw new Error("Unexpected geometry id");
  if (receipt.sourcePublisher !== "Survey of India") throw new Error("Production India boundary source must be Survey of India");
  if (receipt.sourceProductCode !== SOI_ADMIN_PRODUCT_CODE) {
    throw new Error(`Expected Survey of India product ${SOI_ADMIN_PRODUCT_CODE}`);
  }
  if (receipt.canonicalCrs !== "EPSG:4326") throw new Error("Canonical geometry must use EPSG:4326");
  if (!/^[a-f0-9]{64}$/i.test(receipt.sourceArchiveSha256)) {
    throw new Error("Missing/invalid source archive SHA-256");
  }
  if (!/^[a-f0-9]{64}$/i.test(receipt.canonicalGeoJsonSha256)) {
    throw new Error("Missing/invalid canonical GeoJSON SHA-256");
  }
  if (geometry.type !== "FeatureCollection" || geometry.features.length === 0) {
    throw new Error("Canonical admin geometry is empty");
  }
  if (receipt.featureCount !== geometry.features.length) {
    throw new Error("Receipt feature count does not match canonical geometry");
  }

  const states = new Set<string>();
  geometry.features.forEach((feature, index) => {
    assertAreaGeometryIsValid(feature.geometry, `admin feature ${index}`);
    if (!feature.properties.stateName?.trim()) throw new Error(`admin feature ${index}: missing normalized stateName`);
    if (!feature.properties.stateCode?.trim()) throw new Error(`admin feature ${index}: missing normalized stateCode`);
    states.add(feature.properties.stateName.trim());
  });

  if (receipt.stateCount !== states.size) throw new Error("Receipt state count does not match canonical geometry");
  for (const stateName of REQUIRED_TROPIC_STATES) {
    if (!states.has(stateName)) throw new Error(`Canonical geometry is missing required state: ${stateName}`);
  }

  const computedDigest = createCanonicalGeometryDigest(geometry);
  if (computedDigest.toLowerCase() !== receipt.canonicalGeoJsonSha256.toLowerCase()) {
    throw new Error("Canonical GeoJSON SHA-256 does not match supplied geometry");
  }
}
