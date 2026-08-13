import fs from "node:fs/promises";
import path from "node:path";
import { buildIneCp007ReviewPack, renderIneCp007ReviewMarkdown } from "./review-pack";

export async function exportIneCp007ReviewPack(outputDirectory: string) {
  const rows = buildIneCp007ReviewPack();
  await fs.mkdir(outputDirectory, { recursive: true });
  const jsonPath = path.join(outputDirectory, "ine-cp007-english-review.json");
  const markdownPath = path.join(outputDirectory, "ine-cp007-english-review.md");
  await Promise.all([
    fs.writeFile(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8"),
    fs.writeFile(markdownPath, renderIneCp007ReviewMarkdown(rows), "utf8"),
  ]);
  return { jsonPath, markdownPath, rowCount: rows.length };
}
