import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateCp002ReviewRows } from "./runtime";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

const rows = generateCp002ReviewRows();
for (const row of rows) {
  if (!row.validation.valid) throw new Error(`${row.permanentQlId}: ${row.validation.errors.join("; ")}`);
  if (row.lifecycle.reviewStatus !== "EDITORIAL_REVIEW_REQUIRED") throw new Error(`${row.permanentQlId}: editorial review was not reopened`);
  if (row.lifecycle.englishDecision !== "NEEDS_REVISION" || row.lifecycle.englishFreezeStatus !== "UNFROZEN") {
    throw new Error(`${row.permanentQlId}: stale English freeze status remains`);
  }
}

const outputDir = join(process.cwd(), "dist/quant-v4/tsd-001/cp002-review");
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "tsd-cp002-review.json"), JSON.stringify(rows, null, 2));
writeFileSync(join(outputDir, "tsd-cp002-review.jsonl"), `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`);

const cards = rows.map((row) => `
<article class="question">
  <header><strong>${escapeHtml(row.permanentQlId)}</strong> · ${escapeHtml(row.solveMode)} · ${escapeHtml(row.authoritySubmode)} · ${escapeHtml(row.representation)}</header>
  <p class="status">Editorial status: NEEDS_REVISION / UNFROZEN · Difficulty: ${escapeHtml(row.difficulty.label)} (${escapeHtml(row.difficulty.status)})</p>
  <h2>${escapeHtml(row.stem)}</h2>
  <ol type="A">${row.options.map((option, index) => `<li class="${index === row.correctIndex ? "correct" : ""}">${escapeHtml(option)}</li>`).join("")}</ol>
  <section><h3>${escapeHtml(row.explanation.keyRule)}</h3><ol>${row.explanation.stepByStepSolution.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol></section>
  <section><h3>${escapeHtml(row.explanation.examSpeedShortcut)}</h3></section>
  <section><h3>⚠️ Common Traps &amp; Option Analysis</h3>${row.explanation.optionAnalysis.map((entry) => `<p><strong>${entry.option}. ${escapeHtml(entry.text)}</strong><br>${escapeHtml(entry.reason.replace(/^[✅⚠️]\uFE0F?\s*/, ""))}</p>`).join("")}</section>
  <details><summary>Developer details</summary><p>${escapeHtml(row.questionLanguageId)} · ${escapeHtml(row.provisionalAuthorityId)} · ${escapeHtml(row.seed)}</p><p>${escapeHtml(row.mathematicalFingerprint)}</p></details>
  <footer>${escapeHtml(row.explanation.conclusion)} · Question Bank: NOT_STORED · Tests: INELIGIBLE · Public: false</footer>
</article>`).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TSD-CP-002 P0 Editorial Remodel</title><style>
body{font-family:system-ui,sans-serif;max-width:1100px;margin:2rem auto;padding:0 1rem;background:#f6f7f9;color:#18202a}.question{background:white;border:1px solid #d9dee5;border-radius:12px;padding:1.25rem;margin:1rem 0}.question header,.question footer{color:#5a6573;font-size:.9rem}.status{color:#8a3d14;font-size:.85rem}.question h2{font-size:1.1rem}.correct{font-weight:700}.correct::after{content:" ✓"}section{border-top:1px solid #edf0f3;margin-top:1rem;padding-top:.75rem}h3{font-size:1rem;margin:.25rem 0}.question p{line-height:1.45}details{margin-top:1rem;color:#666;font-size:.8rem}@media(max-width:600px){body{margin:.5rem auto}.question{padding:.9rem}}
</style></head><body><h1>TSD-CP-002 — P0 Editorial Remodel</h1><p>${rows.length} unfreezed records · ${new Set(rows.map((row) => row.permanentQlId)).size} current QL mappings · TSD-QL-024 through TSD-QL-037 · this artifact is not a refreeze approval.</p>${cards}</body></html>`;
writeFileSync(join(outputDir, "tsd-cp002-review.html"), html);

console.log(JSON.stringify({
  status: "PASS",
  phase: "P0_EDITORIAL_REMODEL",
  outputDir,
  rows: rows.length,
  currentReviewQlCount: new Set(rows.map((row) => row.permanentQlId)).size,
  englishFreezeStatus: "UNFROZEN",
  questionBankStored: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));
