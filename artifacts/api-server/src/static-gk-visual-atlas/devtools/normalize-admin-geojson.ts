import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { GeoJsonAreaGeometry, GeoJsonFeatureCollection } from "../geometry/geojson";
import { normalizeIndiaAdminGeoJson } from "../geometry/normalize-admin-geojson";

async function main(): Promise<void> {
  const [, , inputPath, stateNameField, outputPath, districtNameField, districtCodeField] = process.argv;
  if (!inputPath || !stateNameField || !outputPath) {
    throw new Error(
      "Usage: normalize-admin-geojson <raw-admin.geojson> <state-name-field> <output.geojson> [district-name-field] [district-code-field]",
    );
  }

  const raw = JSON.parse(await readFile(resolve(inputPath), "utf8")) as GeoJsonFeatureCollection<GeoJsonAreaGeometry>;
  const normalized = normalizeIndiaAdminGeoJson(raw, {
    stateNameField,
    ...(districtNameField ? { districtNameField } : {}),
    ...(districtCodeField ? { districtCodeField } : {}),
  });

  await writeFile(resolve(outputPath), `${JSON.stringify(normalized)}\n`, "utf8");
  const states = new Set(normalized.features.map((feature) => feature.properties.stateName));
  const districts = normalized.features.filter((feature) => feature.properties.districtName).length;
  process.stdout.write(
    `[static-gk-visual-atlas] normalized ${normalized.features.length} features across ${states.size} states/UTs; ${districts} features carry district names\n`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[static-gk-visual-atlas] admin geometry normalization failed: ${message}\n`);
  process.exitCode = 1;
});
