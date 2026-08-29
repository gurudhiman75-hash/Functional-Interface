import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { IndiaAdminFeatureCollection } from "../geometry/geojson";
import {
  createCanonicalGeometryDigest,
  type StaticGkAdminIngestBundle,
  type StaticGkGeometryIngestReceipt,
  validateAdminIngestBundle,
} from "../geometry/ingest-contract";

function usage(): never {
  throw new Error(
    "Usage: validate-admin-ingest <canonical-admin.geojson> <ingest-receipt.json>\n" +
      "The canonical file must already be normalized to EPSG:4326 with stateName/stateCode properties.",
  );
}

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(resolve(path), "utf8")) as T;
}

async function main(): Promise<void> {
  const [, , geometryPath, receiptPath] = process.argv;
  if (!geometryPath || !receiptPath) usage();

  const geometry = await readJson<IndiaAdminFeatureCollection>(geometryPath);
  const receipt = await readJson<StaticGkGeometryIngestReceipt>(receiptPath);
  const bundle: StaticGkAdminIngestBundle = { geometry, receipt };
  validateAdminIngestBundle(bundle);

  const actualDigest = createCanonicalGeometryDigest(geometry);
  if (actualDigest !== receipt.canonicalGeoJsonSha256.toLowerCase()) {
    throw new Error(
      `Canonical GeoJSON digest mismatch: receipt=${receipt.canonicalGeoJsonSha256} actual=${actualDigest}`,
    );
  }

  process.stdout.write(
    JSON.stringify(
      {
        ok: true,
        geometryId: receipt.geometryId,
        sourceProductCode: receipt.sourceProductCode,
        featureCount: receipt.featureCount,
        stateCount: receipt.stateCount,
        canonicalGeoJsonSha256: actualDigest,
      },
      null,
      2,
    ) + "\n",
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[static-gk-visual-atlas] geometry ingest validation failed: ${message}\n`);
  process.exitCode = 1;
});
