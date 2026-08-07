import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  buildIneCp004ReviewPack,
  renderIneCp004ReviewMarkdown,
} from "./review-pack";

export async function exportIneCp004ReviewPack(
  outputDirectory: string,
  seedsPerAuthority = 12,
): Promise<{ jsonPath: string; markdownPath: string; rowCount: number }> {
  const rows = buildIneCp004ReviewPack(seedsPerAuthority);
  await mkdir(outputDirectory, { recursive: true });
  const jsonPath = path.join(outputDirectory, "ine-cp004-english-review.json");
  const markdownPath = path.join(
    outputDirectory,
    "ine-cp004-english-review.md",
  );
  await Promise.all([
    writeFile(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8"),
    writeFile(markdownPath, renderIneCp004ReviewMarkdown(rows), "utf8"),
  ]);
  return { jsonPath, markdownPath, rowCount: rows.length };
}
