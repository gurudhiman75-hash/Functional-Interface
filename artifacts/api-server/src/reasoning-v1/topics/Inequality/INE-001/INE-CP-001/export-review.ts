import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  buildIneCp001ReviewPack,
  renderIneCp001ReviewMarkdown,
} from "./review-pack";

export async function exportIneCp001ReviewPack(
  outputDirectory: string,
  seedsPerPrototype = 5,
): Promise<{ jsonPath: string; markdownPath: string; rowCount: number }> {
  const rows = buildIneCp001ReviewPack(seedsPerPrototype);
  await mkdir(outputDirectory, { recursive: true });
  const jsonPath = path.join(outputDirectory, "ine-cp001-english-review.json");
  const markdownPath = path.join(
    outputDirectory,
    "ine-cp001-english-review.md",
  );
  await Promise.all([
    writeFile(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8"),
    writeFile(markdownPath, renderIneCp001ReviewMarkdown(rows), "utf8"),
  ]);
  return { jsonPath, markdownPath, rowCount: rows.length };
}
