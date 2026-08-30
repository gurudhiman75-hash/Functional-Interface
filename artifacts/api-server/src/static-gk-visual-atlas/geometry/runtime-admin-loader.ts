import { gunzipSync } from "node:zlib";
import { readFile } from "node:fs/promises";
import type { IndiaAdminFeatureCollection } from "./geojson";
import type { StaticGkAdminIngestBundle, StaticGkGeometryIngestReceipt } from "./ingest-contract";
import { validateAdminIngestBundle } from "./ingest-contract";
import { VALIDATED_SOI_ADMIN_RECEIPT } from "./validated-admin-receipt";

const MAX_SOURCE_BYTES = 128 * 1024 * 1024;
const MAX_JSON_BYTES = 128 * 1024 * 1024;

export interface RuntimeAdminGeometryConfig {
  path?: string;
  url?: string;
}

function isGzip(bytes: Uint8Array): boolean {
  return bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
}

export function decodeAndValidateAdminGeometry(
  sourceBytes: Uint8Array,
  receipt: StaticGkGeometryIngestReceipt,
): StaticGkAdminIngestBundle {
  if (sourceBytes.byteLength === 0) throw new Error("Runtime admin geometry asset is empty");
  if (sourceBytes.byteLength > MAX_SOURCE_BYTES) throw new Error("Runtime admin geometry asset exceeds size limit");

  const jsonBytes = isGzip(sourceBytes) ? gunzipSync(sourceBytes) : sourceBytes;
  if (jsonBytes.byteLength > MAX_JSON_BYTES) throw new Error("Runtime admin geometry JSON exceeds size limit");

  const geometry = JSON.parse(Buffer.from(jsonBytes).toString("utf8")) as IndiaAdminFeatureCollection;
  const bundle = { geometry, receipt };
  validateAdminIngestBundle(bundle);
  return bundle;
}

async function readHttps(url: string): Promise<Uint8Array> {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") throw new Error("Runtime admin geometry URL must use HTTPS");
  const response = await fetch(parsed, { redirect: "follow" });
  if (!response.ok) throw new Error(`Runtime admin geometry fetch failed with HTTP ${response.status}`);
  const declaredLength = Number(response.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_SOURCE_BYTES) throw new Error("Runtime admin geometry asset exceeds size limit");
  return new Uint8Array(await response.arrayBuffer());
}

export function runtimeAdminGeometryConfigFromEnv(): RuntimeAdminGeometryConfig {
  const path = process.env.STATIC_GK_ATLAS_ADMIN_GEOMETRY_PATH?.trim();
  const url = process.env.STATIC_GK_ATLAS_ADMIN_GEOMETRY_URL?.trim();
  return { ...(path ? { path } : {}), ...(url ? { url } : {}) };
}

let cachedBundle: Promise<StaticGkAdminIngestBundle> | undefined;

export function loadValidatedRuntimeAdminGeometry(
  config: RuntimeAdminGeometryConfig = runtimeAdminGeometryConfigFromEnv(),
): Promise<StaticGkAdminIngestBundle> {
  const configuredSources = Number(Boolean(config.path)) + Number(Boolean(config.url));
  if (configuredSources !== 1) {
    return Promise.reject(
      new Error(
        "Configure exactly one of STATIC_GK_ATLAS_ADMIN_GEOMETRY_PATH or STATIC_GK_ATLAS_ADMIN_GEOMETRY_URL",
      ),
    );
  }

  if (!cachedBundle) {
    cachedBundle = (async () => {
      const bytes = config.path ? new Uint8Array(await readFile(config.path)) : await readHttps(config.url!);
      return decodeAndValidateAdminGeometry(bytes, VALIDATED_SOI_ADMIN_RECEIPT);
    })().catch((error) => {
      cachedBundle = undefined;
      throw error;
    });
  }
  return cachedBundle;
}

export function resetRuntimeAdminGeometryCacheForTests(): void {
  cachedBundle = undefined;
}
