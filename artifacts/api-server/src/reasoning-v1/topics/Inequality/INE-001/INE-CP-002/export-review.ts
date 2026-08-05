import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  buildIneCp002ReviewPack,
  renderIneCp002ReviewMarkdown,
} from "./review-pack";

export async function exportIneCp002ReviewPack(
  outputDirectory: string,
  seedsPerPrototype = 5,
): Promise<{ jsonPath: string; markdownPath: string; rowCount: number }> {
  const rows = buildIneCp002ReviewPack(seedsPerPrototype);
  await mkdir(outputDirectory, { recursive: true });
  const jsonPath = path.join(outputDirectory, "ine-cp002-english-review.json");
  const markdownPath = path.join(
    outputDirectory,
    "ine-cp002-english-review.md",
  );
  await Promise.all([
    writeFile(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8"),
    writeFile(markdownPath, renderIneCp002ReviewMarkdown(rows), "utf8"),
  ]);
  return { jsonPath, markdownPath, rowCount: rows.length };
}
