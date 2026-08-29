import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { IndiaAdminFeatureCollection } from "../geometry/geojson";
import type { StaticGkGeometryIngestReceipt } from "../geometry/ingest-contract";
import { compileTropicCancerScene } from "../scenes/compile-tropic-cancer";

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(resolve(path), "utf8")) as T;
}

async function main(): Promise<void> {
  const [, , geometryPath, receiptPath, outputPath] = process.argv;
  if (!geometryPath || !receiptPath || !outputPath) {
    throw new Error("Usage: export-tropic-scene <canonical-admin.geojson> <ingest-receipt.json> <output.scene.json>");
  }

  const geometry = await readJson<IndiaAdminFeatureCollection>(geometryPath);
  const receipt = await readJson<StaticGkGeometryIngestReceipt>(receiptPath);
  const scene = compileTropicCancerScene({ geometry, receipt });
  if (scene.status !== "render-ready") throw new Error("Scene failed to reach render-ready state");

  await writeFile(resolve(outputPath), JSON.stringify(scene, null, 2) + "\n", "utf8");
  process.stdout.write(
    `[static-gk-visual-atlas] exported ${scene.visualId} with ${scene.route.resolvedSegments.length} state segments to ${outputPath}\n`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[static-gk-visual-atlas] scene export failed: ${message}\n`);
  process.exitCode = 1;
});
