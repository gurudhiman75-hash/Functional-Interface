import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import type { IndiaAdminFeatureCollection } from "../geometry/geojson";
import type { StaticGkGeometryIngestReceipt } from "../geometry/ingest-contract";
import { renderStandardMeridianSvgFrame } from "../renderers/svg-map";
import { compileStandardMeridianScene } from "../scenes/compile-standard-meridian";

const FRAME_TIMES = [1_000, 4_000, 8_000, 12_000, 18_000, 25_000] as const;

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(resolve(path), "utf8")) as T;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function main(): Promise<void> {
  const [, , geometryPath, receiptPath, outputDirectory] = process.argv;
  if (!geometryPath || !receiptPath || !outputDirectory) {
    throw new Error(
      "Usage: export-standard-meridian-contact-sheet <canonical-admin.geojson> <ingest-receipt.json> <output-directory>",
    );
  }

  const geometry = await readJson<IndiaAdminFeatureCollection>(geometryPath);
  const receipt = await readJson<StaticGkGeometryIngestReceipt>(receiptPath);
  const scene = compileStandardMeridianScene({ geometry, receipt });
  if (scene.status !== "render-ready") {
    throw new Error(`Scene failed to reach render-ready state: ${scene.status}`);
  }

  const outputDir = resolve(outputDirectory);
  await mkdir(outputDir, { recursive: true });
  const cards: string[] = [];

  for (const timeMs of FRAME_TIMES) {
    const fileName = `frame-${String(timeMs).padStart(5, "0")}.svg`;
    const svg = renderStandardMeridianSvgFrame(scene, geometry, timeMs);
    await writeFile(join(outputDir, fileName), `${svg}\n`, "utf8");
    cards.push(
      `<figure><img src="${escapeHtml(fileName)}" alt="${escapeHtml(scene.title)} at ${(timeMs / 1000).toFixed(1)} seconds"><figcaption>${(timeMs / 1000).toFixed(1)}s</figcaption></figure>`,
    );
  }

  await writeFile(join(outputDir, `${scene.visualId}.scene.json`), `${JSON.stringify(scene, null, 2)}\n`, "utf8");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(scene.title)} · contact sheet</title><style>body{font-family:system-ui,sans-serif;margin:0;padding:24px;background:#f1f5f9;color:#0f172a}header{max-width:1100px;margin:0 auto 24px}h1{margin:0 0 8px;font-size:28px}p{margin:0;color:#475569}.grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px}figure{margin:0;background:white;border:1px solid #cbd5e1;border-radius:16px;padding:12px}img{display:block;width:100%;height:auto;border-radius:10px;background:white}figcaption{text-align:center;padding-top:10px;font-weight:700}</style></head><body><header><h1>${escapeHtml(scene.title)}</h1><p>Visual QA contact sheet · ${escapeHtml(receipt.sourceProductCode)} · ${escapeHtml(basename(geometryPath))} · Mirzapur district verified</p></header><main class="grid">${cards.join("")}</main></body></html>`;
  await writeFile(join(outputDir, "index.html"), `${html}\n`, "utf8");

  process.stdout.write(
    `[static-gk-visual-atlas] exported ${FRAME_TIMES.length} QA frames for ${scene.visualId} to ${outputDir}\n`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[static-gk-visual-atlas] Standard Meridian contact-sheet export failed: ${message}\n`);
  process.exitCode = 1;
});
