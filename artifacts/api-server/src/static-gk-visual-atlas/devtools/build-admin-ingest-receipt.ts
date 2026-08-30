import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import type { IndiaAdminFeatureCollection } from "../geometry/geojson";
import {
  createCanonicalGeometryDigest,
  SOI_ADMIN_GEOMETRY_ID,
  SOI_ADMIN_PRODUCT_CODE,
  type StaticGkGeometryIngestReceipt,
  validateAdminIngestBundle,
} from "../geometry/ingest-contract";

function sha256Bytes(value: Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

async function main(): Promise<void> {
  const [
    ,
    ,
    sourceArchivePath,
    canonicalGeometryPath,
    acquiredAt,
    reviewer,
    conversionTool,
    conversionNotes,
    outputReceiptPath,
  ] = process.argv;

  if (
    !sourceArchivePath ||
    !canonicalGeometryPath ||
    !acquiredAt ||
    !reviewer ||
    !conversionTool ||
    !conversionNotes ||
    !outputReceiptPath
  ) {
    throw new Error(
      "Usage: build-admin-ingest-receipt <official-archive> <canonical-admin.geojson> <YYYY-MM-DD> <reviewer> <conversion-tool/version> <conversion-notes> <output-receipt.json>",
    );
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(acquiredAt)) throw new Error("acquiredAt must use YYYY-MM-DD");

  const archiveBytes = await readFile(resolve(sourceArchivePath));
  const geometry = JSON.parse(await readFile(resolve(canonicalGeometryPath), "utf8")) as IndiaAdminFeatureCollection;
  const states = new Set(geometry.features.map((feature) => feature.properties.stateName?.trim()).filter(Boolean));

  const receipt: StaticGkGeometryIngestReceipt = {
    geometryId: SOI_ADMIN_GEOMETRY_ID,
    sourcePublisher: "Survey of India",
    sourceProductCode: SOI_ADMIN_PRODUCT_CODE,
    sourcePortalUrl: "https://onlinemaps.surveyofindia.gov.in/Digital_Products.aspx",
    acquiredAt,
    sourceArchiveFilename: basename(sourceArchivePath),
    sourceArchiveSha256: sha256Bytes(archiveBytes),
    canonicalGeoJsonSha256: createCanonicalGeometryDigest(geometry),
    canonicalCrs: "EPSG:4326",
    featureCount: geometry.features.length,
    stateCount: states.size,
    conversionTool,
    conversionCommandOrNotes: conversionNotes,
    reviewer,
  };

  validateAdminIngestBundle({ geometry, receipt });
  await writeFile(resolve(outputReceiptPath), `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  process.stdout.write(
    `[static-gk-visual-atlas] wrote verified ${SOI_ADMIN_PRODUCT_CODE} ingest receipt to ${outputReceiptPath}\n`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[static-gk-visual-atlas] receipt build failed: ${message}\n`);
  process.exitCode = 1;
});
