import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  buildIneCp003ReviewPack,
  renderIneCp003ReviewMarkdown,
} from "./review-pack";

export async function exportIneCp003ReviewPack(
  outputDirectory: string,
  seedsPerAuthority = 12,
): Promise<{ jsonPath: string; markdownPath: string; rowCount: number }> {
  const rows = buildIneCp003ReviewPack(seedsPerAuthority);
  await mkdir(outputDirectory, { recursive: true });
  const jsonPath = path.join(outputDirectory, "ine-cp003-english-review.json");
  const markdownPath = path.join(
    outputDirectory,
    "ine-cp003-english-review.md",
  );
  await Promise.all([
    writeFile(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8"),
    writeFile(markdownPath, renderIneCp003ReviewMarkdown(rows), "utf8"),
  ]);
  return { jsonPath, markdownPath, rowCount: rows.length };
}
