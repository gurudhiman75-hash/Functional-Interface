import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityReviewQuestionV4 } from "./banking-possibility-review-question-v4";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 24 }, (_, index) => index);
const outDir = resolve(process.cwd(), "dist/reasoning-v1/syl-001-bank-possibility-review-v4");
const englishDir = resolve(outDir, "english-diagrams");
const core009Dir = resolve(outDir, "core-009");
mkdirSync(outDir, { recursive: true });
mkdirSync(englishDir, { recursive: true });
mkdirSync(core009Dir, { recursive: true });

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

const records = seeds.flatMap((seed) => locales.map((locale) =>
  generateBankingPossibilityReviewQuestionV4(seed, locale)));

const geometrySources: Record<string, number> = {};
const scenarioCounts: Record<string, number> = {};
const statusCounts: Record<string, number> = {};
const languageCounts: Record<string, number> = {};
for (const question of records) {
  increment(geometrySources, question.diagram.geometrySource);
  increment(scenarioCounts, question.scenarioId);
  increment(statusCounts, question.semanticAnswer);
  increment(languageCounts, question.locale);
  if (question.locale === "en-IN") {
    writeFileSync(
      resolve(englishDir, `seed-${String(question.seed).padStart(2, "0")}-${question.scenarioId}.svg`),
      question.diagram.svg,
      "utf8",
    );
  }
  if (question.scenarioId === "SYL-SC-CORE-009") {
    writeFileSync(resolve(core009Dir, `${question.locale}.svg`), question.diagram.svg, "utf8");
  }
}

const summary = {
  status: "PROTOTYPE_HUMAN_REVIEW_REQUIRED",
  authority: "SYL_001_BANKING_POSSIBILITY_SHELL_V1",
  schemaVersion: "banking-possibility-review-v4-complete-combined-diagrams",
  logicalQuestions: seeds.length,
  records: records.length,
  languages: languageCounts,
  diagramSlots: records.length,
  enabledDiagrams: records.filter((entry) => entry.diagram.enabled).length,
  omittedDiagrams: records.filter((entry) => !entry.diagram.enabled).length,
  geometrySources,
  scenarios: scenarioCounts,
  semanticStatuses: statusCounts,
  core009Records: records.filter((entry) => entry.scenarioId === "SYL-SC-CORE-009").length,
  humanEditorialStatus: "PENDING",
  humanLocalizationStatus: "PENDING",
  humanExamAuthenticityStatus: "PENDING",
  humanDiagramStatus: "PENDING",
  supplementalGeometryProductApproval: "PENDING",
  fourTermGeometryProductApproval: "PENDING",
  activationPermitted: false,
};

function card(question: ReturnType<typeof generateBankingPossibilityReviewQuestionV4>): string {
  const correct = question.options[question.correctIndex]?.text ?? question.semanticAnswer;
  return `<article class="card" id="seed-${question.seed}-${question.locale}">
    <header><strong>Seed ${question.seed} · ${esc(question.locale)}</strong><span>${esc(question.scenarioId)} · ${esc(question.diagram.geometrySource)}</span></header>
    <div class="grid">
      <section><h3>Statements</h3><ol>${question.statements.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ol>
      <h3>Conclusions</h3><ol class="roman">${question.conclusions.map((entry) => `<li><b>${esc(entry.mode)}</b> — ${esc(entry.text)}</li>`).join("")}</ol>
      <h3>Options</h3><ol type="A">${question.options.map((entry) => `<li class="${entry.isCorrect ? "correct" : ""}">${esc(entry.text)}</li>`).join("")}</ol>
      <p><b>Correct answer:</b> ${esc(correct)}</p>
      <h3>Explanation</h3>${question.explanation.map((entry) => `<p>${esc(entry)}</p>`).join("")}</section>
      <section class="diagram"><h3>One combined diagram</h3>${question.diagram.svg}<p class="caption">${esc(question.diagram.caption)}</p></section>
    </div>
  </article>`;
}

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SYL-001 Banking Possibility V4 Complete Diagram Review</title>
<style>
body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:20px}main{max-width:1200px;margin:auto}.note,.card{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:16px;margin:0 0 18px}.note{border-left:5px solid #d97706}.card header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid #e2e8f0;padding-bottom:10px}.grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(300px,.9fr);gap:20px}.diagram{align-self:start}.diagram svg{display:block;max-width:100%;height:auto;margin:auto;background:#fff;border-radius:10px}.correct{font-weight:700}.caption{font-size:.92rem;color:#475569}.roman{list-style-type:upper-roman}h1{margin-top:0}h3{margin-bottom:6px}ol{margin-top:6px}@media(max-width:760px){body{padding:10px}.grid{grid-template-columns:1fr}.card{padding:12px}}
</style></head><body><main>
<h1>SYL-001 Banking Possibility — V4 Complete Combined-Diagram Review</h1>
<div class="note"><b>Human review required.</b> V4 preserves the V3 diagrams and adds one narrowly scoped four-term diagram for CORE-009. No diagram in the new supplemental/four-term families is product-approved by CI alone. Registration and delivery remain disabled.</div>
${records.map(card).join("\n")}
</main></body></html>`;

const markdown = [
  "# SYL-001 Banking Possibility — V4 Complete Combined-Diagram Review",
  "",
  "> Human review required. V4 closes the CORE-009 four-term omission without changing registration or delivery locks.",
  "",
  ...records.flatMap((question) => [
    `## Seed ${question.seed} — ${question.locale} — ${question.scenarioId}`,
    "",
    `Geometry: **${question.diagram.geometrySource}**`,
    "",
    "### Statements",
    ...question.statements.map((entry, index) => `${index + 1}. ${entry}`),
    "",
    "### Conclusions",
    ...question.conclusions.map((entry, index) => `${index === 0 ? "I" : "II"}. [${entry.mode}] ${entry.text}`),
    "",
    `**Correct answer:** ${question.options[question.correctIndex]?.text ?? question.semanticAnswer}`,
    "",
    "### Explanation",
    ...question.explanation.map((entry) => `- ${entry}`),
    "",
  ]),
].join("\n");

writeFileSync(resolve(outDir, "SYL-001-BANKING-POSSIBILITY-REVIEW-V4.html"), html, "utf8");
writeFileSync(resolve(outDir, "SYL-001-BANKING-POSSIBILITY-REVIEW-V4.md"), markdown, "utf8");
writeFileSync(resolve(outDir, "syl-001-bank-possibility-summary-v4.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
writeFileSync(resolve(outDir, "syl-001-bank-possibility-records-v4.jsonl"), `${records.map((entry) => JSON.stringify(entry)).join("\n")}\n`, "utf8");

console.log(JSON.stringify({ ...summary, outputDir: outDir }, null, 2));
