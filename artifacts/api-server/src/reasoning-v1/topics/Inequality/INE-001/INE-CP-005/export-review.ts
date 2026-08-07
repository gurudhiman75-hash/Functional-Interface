import fs from "node:fs/promises";
import path from "node:path";
import {
  buildIneCp005ReviewPack,
  renderIneCp005ReviewMarkdown,
} from "./review-pack";

export async function exportIneCp005ReviewPack(
  outputDirectory: string,
  seedsPerAuthority = 12,
): Promise<{ jsonPath: string; markdownPath: string; rowCount: number }> {
  const rows = buildIneCp005ReviewPack(seedsPerAuthority);
  await fs.mkdir(outputDirectory, { recursive: true });
  const jsonPath = path.join(outputDirectory, "ine-cp005-english-review.json");
  const markdownPath = path.join(
    outputDirectory,
    "ine-cp005-english-review.md",
  );
  await Promise.all([
    fs.writeFile(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8"),
    fs.writeFile(markdownPath, renderIneCp005ReviewMarkdown(rows), "utf8"),
  ]);
  return { jsonPath, markdownPath, rowCount: rows.length };
}
