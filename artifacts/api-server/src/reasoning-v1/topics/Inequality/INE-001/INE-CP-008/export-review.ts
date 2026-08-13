import fs from "node:fs/promises";
import path from "node:path";
import {
  buildIneCp008ReviewPack,
  renderIneCp008ReviewMarkdown,
} from "./review-pack";

export async function exportIneCp008ReviewPack(outputDirectory: string) {
  const rows = buildIneCp008ReviewPack();
  await fs.mkdir(outputDirectory, { recursive: true });
  const jsonPath = path.join(outputDirectory, "ine-cp008-english-review.json");
  const markdownPath = path.join(outputDirectory, "ine-cp008-english-review.md");
  await Promise.all([
    fs.writeFile(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8"),
    fs.writeFile(
      markdownPath,
      renderIneCp008ReviewMarkdown(rows),
      "utf8",
    ),
  ]);
  return { jsonPath, markdownPath, rowCount: rows.length };
}
