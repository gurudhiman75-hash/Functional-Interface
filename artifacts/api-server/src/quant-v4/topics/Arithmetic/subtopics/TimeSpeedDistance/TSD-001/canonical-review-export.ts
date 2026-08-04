import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateCanonicalReviewRecords, stableCanonicalJson } from "./canonical-review-schema";

const rows = generateCanonicalReviewRecords();
const outputDir = resolve(process.cwd(), "dist/quant-v4/tsd-001/canonical-review");
mkdirSync(outputDir, { recursive: true });

const jsonText = `${JSON.stringify(rows, null, 2)}\n`;
const jsonlText = `${rows.map((row) => stableCanonicalJson(row)).join("\n")}\n`;
writeFileSync(resolve(outputDir, "tsd-canonical-review.json"), jsonText, "utf8");
writeFileSync(resolve(outputDir, "tsd-canonical-review.jsonl"), jsonlText, "utf8");

const parsedJson = JSON.parse(jsonText) as unknown[];
const parsedJsonl = jsonlText.trim().split("\n").map((line) => JSON.parse(line));
if (JSON.stringify(parsedJson) !== JSON.stringify(parsedJsonl)) {
  throw new Error("Canonical JSON and JSONL content diverge");
}

const escapeHtml = (value: string): string => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const cards = rows.map((row, index) => {
  const optionItems = row.options.map((option, optionIndex) =>
    `<li class="${optionIndex === row.correctIndex ? "correct" : ""}">${escapeHtml(option)}</li>`,
  ).join("");
  const steps = row.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const optionAnalysis = row.explanation.optionAnalysis.map((entry) =>
    `<li class="${entry.isCorrect ? "correct-analysis" : "wrong-analysis"}"><b>${entry.option}. ${escapeHtml(entry.text)}</b> — ${escapeHtml(entry.reason)}</li>`,
  ).join("");
  const shortcut = row.explanation.shortcut
    ? `<section class="shortcut"><h3>⚡ Exam shortcut</h3><p>${escapeHtml(row.explanation.shortcut)}</p></section>`
    : "";
  return `<article>
    <header>
      <strong>${escapeHtml(row.solveMode)}</strong>
      <span>${escapeHtml(row.checkpointId)}</span>
      <span>${escapeHtml(row.representation)}</span>
      <span>${escapeHtml(row.difficulty.label)}</span>
    </header>
    <p class="status">${escapeHtml(row.lifecycle.reviewStatus)} · ${escapeHtml(row.lifecycle.englishDecision)} · ${escapeHtml(row.lifecycle.englishFreezeStatus)}</p>
    <h2>${index + 1}. ${escapeHtml(row.stem)}</h2>
    <ol type="A" class="options">${optionItems}</ol>
    <p class="answer"><b>Correct answer:</b> ${escapeHtml(row.answerText)}</p>
    <section class="concept"><h3>📌 Concept</h3><p>${escapeHtml(row.explanation.concept)}</p></section>
    <section class="steps"><h3>📝 Working</h3><ol>${steps}</ol><p><b>${escapeHtml(row.explanation.conclusion)}</b></p></section>
    ${shortcut}
    <section class="analysis"><h3>Option analysis</h3><ul>${optionAnalysis}</ul></section>
    <details>
      <summary>Review metadata</summary>
      <dl>
        <dt>Question language ID</dt><dd>${escapeHtml(row.questionLanguageId)}</dd>
        <dt>Provisional authority</dt><dd>${escapeHtml(row.provisionalAuthorityId)}</dd>
        <dt>Legacy review QL</dt><dd>${escapeHtml(row.sourceTrace.legacyReviewQlId)}</dd>
        <dt>Runtime solve mode</dt><dd>${escapeHtml(row.sourceTrace.runtimeSolveMode)}</dd>
        <dt>Final solve mode</dt><dd>${escapeHtml(row.solveMode)}</dd>
        <dt>Difficulty</dt><dd>${escapeHtml(row.difficulty.label)} · score ${row.difficulty.featureScore} · ${escapeHtml(row.difficulty.status)}</dd>
        <dt>Lifecycle</dt><dd>Question Bank ${escapeHtml(row.lifecycle.questionBankStatus)} · Tests ${escapeHtml(row.lifecycle.testEligibility)} · Public false</dd>
        <dt>Fingerprint</dt><dd>${escapeHtml(row.sourceTrace.mathematicalFingerprint)}</dd>
      </dl>
    </details>
  </article>`;
}).join("\n");

writeFileSync(resolve(outputDir, "tsd-canonical-review.html"), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TSD Canonical Editorial Review</title><style>
:root{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033;background:#f4f6f8}body{max-width:1080px;margin:24px auto;padding:0 14px}article{background:#fff;border:1px solid #d9dee6;border-radius:12px;padding:20px;margin:18px 0;box-shadow:0 2px 8px rgba(15,23,42,.04)}header{display:flex;flex-wrap:wrap;gap:8px;align-items:center}header span,header strong{border:1px solid #cbd3df;border-radius:999px;padding:3px 9px;font-size:.78rem}h1{line-height:1.2}h2{font-size:1.08rem;line-height:1.45}.status{font-size:.8rem;color:#9a3412}.options li{padding:3px 0}.correct{font-weight:700}.correct::after{content:" ✓"}.answer{border-top:1px solid #e5e9ef;padding-top:10px}section{border-radius:8px;padding:11px 14px;margin-top:10px}section h3{font-size:.95rem;margin:0 0 6px}.concept{background:#edf6ff}.steps{background:#f7f8fa}.shortcut{background:#fff8df}.analysis{background:#fff1f1}.analysis ul{list-style:none;padding:0}.analysis li{padding:5px 0}.correct-analysis{color:#166534}.wrong-analysis{color:#7f1d1d}details{margin-top:12px;color:#536071;font-size:.8rem}dl{display:grid;grid-template-columns:minmax(130px,auto) 1fr;gap:5px 12px}dt{font-weight:700}dd{margin:0;overflow-wrap:anywhere}@media(max-width:640px){body{margin:8px auto}article{padding:13px}h2{font-size:1rem}dl{grid-template-columns:1fr}dt{margin-top:5px}}
</style></head><body>
<h1>Time, Speed and Distance — Canonical Editorial Review</h1>
<p>${rows.length} records · ${new Set(rows.map((row) => row.solveMode)).size} final learner authorities · schema ${escapeHtml(rows[0]?.schemaVersion ?? "")}. Permanent QL IDs remain unassigned. English remains unfreezed.</p>
${cards}
</body></html>`, "utf8");

console.log(JSON.stringify({
  status: "PASS",
  phase: "CANONICAL_REVIEW_EXPORT",
  outputDir,
  records: rows.length,
  finalLearnerSolveModes: new Set(rows.map((row) => row.solveMode)).size,
  jsonJsonlParity: true,
  externalMathRendererRequired: false,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
