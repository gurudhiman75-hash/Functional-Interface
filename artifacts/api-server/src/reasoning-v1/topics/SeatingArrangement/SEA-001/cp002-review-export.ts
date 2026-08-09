import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateMixedFacingCaselet, SEA_CP002_BLUEPRINTS } from "./cp002/generator.ts";
import type { MixedFacingCaseletRecord } from "./cp002/types.ts";

const outputDirectory = process.env.SEA_CP002_REVIEW_OUTPUT_DIR ?? "./dist/sea-cp002-review";
const caselets: MixedFacingCaseletRecord[] = [];
for (const blueprint of SEA_CP002_BLUEPRINTS) {
  for (let index = 0; index < 12; index += 1) {
    caselets.push(generateMixedFacingCaselet(`SEA-CP002-REVIEW-${blueprint}-${String(index).padStart(2, "0")}`, blueprint));
  }
}

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function escapeHtml(value: unknown): string {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const rows = [["caseletId", "blueprint", "seed", "setup", "clues", "diagram", "questions", "answers"]];
for (const caselet of caselets) {
  rows.push([
    caselet.caseletId,
    caselet.blueprintAuthorityId,
    caselet.seed,
    caselet.setupText,
    caselet.clueTexts.join("\n"),
    caselet.diagramText,
    caselet.children.map((child) => child.text).join("\n"),
    caselet.children.map((child) => child.answer).join(" | "),
  ]);
}
const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

const cards = caselets.map((caselet, caseletIndex) => `
<article class="caselet">
  <h2>${caseletIndex + 1}. ${escapeHtml(caselet.blueprintAuthorityId)} · ${escapeHtml(caselet.caseletId)}</h2>
  <p><strong>Directions:</strong> ${escapeHtml(caselet.setupText)}</p>
  <ol>${caselet.clueTexts.map((clue) => `<li>${escapeHtml(clue)}</li>`).join("")}</ol>
  <div class="diagram">${escapeHtml(caselet.diagramText)}</div>
  ${caselet.children.map((child) => `
    <section class="question">
      <h3>Q${child.questionOrder}. ${escapeHtml(child.text)}</h3>
      <ol type="A">${child.options.map((option) => `<li class="${option.isCorrect ? "correct" : ""}">${escapeHtml(option.display)}</li>`).join("")}</ol>
      <details><summary>Answer and explanation</summary><p><strong>Answer:</strong> ${escapeHtml(child.answer)}</p><p>${escapeHtml(child.explanation)}</p></details>
    </section>`).join("")}
  <details><summary>Shared solution</summary><pre>${escapeHtml(caselet.sharedExplanation)}</pre></details>
  <label>Review: <select><option>UNREVIEWED</option><option>APPROVED</option><option>NEEDS_FIX</option><option>REJECT</option></select></label>
  <textarea rows="3" placeholder="Reviewer notes"></textarea>
</article>`).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><title>SEA-CP-002 English Review</title><style>
body{font-family:Arial,sans-serif;max-width:1000px;margin:20px auto;padding:0 16px;line-height:1.5}.caselet{border:1px solid #ccc;border-radius:12px;padding:18px;margin:20px 0}.diagram{font-family:monospace;background:#f5f5f5;padding:12px;overflow:auto}.question{border-top:1px solid #ddd;margin-top:14px}.correct{font-weight:700}textarea{display:block;width:100%;margin-top:8px}pre{white-space:pre-wrap}</style></head><body><h1>SEA-CP-002 Mixed-Facing English Review — 48 Caselets</h1>${cards}</body></html>`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(join(outputDirectory, "sea-cp002-review.json"), `${JSON.stringify(caselets, null, 2)}\n`);
await writeFile(join(outputDirectory, "sea-cp002-review.csv"), `${csv}\n`);
await writeFile(join(outputDirectory, "sea-cp002-review.html"), html);
console.log("PASS_SEA_CP002_REVIEW_EXPORT");
console.log(`caselets ${caselets.length}`);
console.log(`child questions ${caselets.reduce((sum, caselet) => sum + caselet.children.length, 0)}`);
console.log(`output ${outputDirectory}`);
