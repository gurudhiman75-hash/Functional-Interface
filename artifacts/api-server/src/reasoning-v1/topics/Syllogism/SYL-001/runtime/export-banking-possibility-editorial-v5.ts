import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityEditorialQuestionV5 } from "./banking-possibility-editorial-v5";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 24 }, (_, index) => index);
const outDir = resolve(process.cwd(), "dist/reasoning-v1/syl-001-bank-possibility-editorial-v5");
mkdirSync(outDir, { recursive: true });

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
  generateBankingPossibilityEditorialQuestionV5(seed, locale)));
const geometrySources: Record<string, number> = {};
const statuses: Record<string, number> = {};
for (const record of records) {
  increment(geometrySources, record.diagram.geometrySource);
  increment(statuses, record.semanticAnswer);
}

const summary = {
  status: "PROTOTYPE_HUMAN_EDITORIAL_REVIEW_REQUIRED",
  schemaVersion: "banking-possibility-editorial-review-v5",
  logicalQuestions: seeds.length,
  records: records.length,
  explanationLines: records.length * 2,
  diagramSlots: records.length,
  enabledDiagrams: records.filter((entry) => entry.diagram.enabled).length,
  geometrySources,
  semanticStatuses: statuses,
  answerSemanticsChangedFromV4: false,
  diagramsChangedFromV4: false,
  humanEditorialStatus: "PENDING",
  humanLocalizationStatus: "PENDING",
  humanExamAuthenticityStatus: "PENDING",
  humanDiagramStatus: "PENDING",
  activationPermitted: false,
};

function card(question: ReturnType<typeof generateBankingPossibilityEditorialQuestionV5>): string {
  const correct = question.options[question.correctIndex]?.text ?? question.semanticAnswer;
  return `<article class="card">
  <header><b>Seed ${question.seed} · ${esc(question.locale)}</b><span>${esc(question.scenarioId)} · ${esc(question.diagram.geometrySource)}</span></header>
  <div class="grid">
    <section>
      <h3>Statements</h3><ol>${question.statements.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ol>
      <h3>Conclusions</h3><ol class="roman">${question.conclusions.map((entry) => `<li><b>${esc(entry.mode)}</b> — ${esc(entry.text)}</li>`).join("")}</ol>
      <h3>Options</h3><ol type="A">${question.options.map((entry) => `<li class="${entry.isCorrect ? "correct" : ""}">${esc(entry.text)}</li>`).join("")}</ol>
      <p><b>Correct answer:</b> ${esc(correct)}</p>
      <h3>Student explanation</h3>${question.explanation.map((entry) => `<p class="explanation">${esc(entry)}</p>`).join("")}
    </section>
    <section class="diagram"><h3>Combined diagram</h3>${question.diagram.svg}<p>${esc(question.diagram.caption)}</p></section>
  </div>
</article>`;
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 Banking Possibility Editorial V5</title><style>
body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:18px}main{max-width:1220px;margin:auto}.note,.card{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:16px;margin-bottom:18px}.note{border-left:5px solid #d97706}.card header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid #e2e8f0;padding-bottom:9px}.grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr);gap:20px}.diagram svg{display:block;max-width:100%;height:auto;margin:auto}.roman{list-style-type:upper-roman}.correct{font-weight:800}.explanation{background:#f8fafc;border-left:3px solid #64748b;padding:9px 11px;border-radius:6px;line-height:1.5}@media(max-width:760px){body{padding:9px}.grid{grid-template-columns:1fr}}
</style></head><body><main><h1>SYL-001 Banking Possibility — Editorial V5 Review</h1><div class="note"><b>Human review required.</b> V5 changes only explanation wording. Question semantics, answers, options and V4 diagrams remain unchanged.</div>${records.map(card).join("\n")}</main></body></html>`;

const markdown = [
  "# SYL-001 Banking Possibility — Editorial V5 Review",
  "",
  "> V5 changes explanations only. Answers and diagrams are inherited unchanged from V4.",
  "",
  ...records.flatMap((question) => [
    `## Seed ${question.seed} — ${question.locale} — ${question.scenarioId}`,
    "",
    "### Statements",
    ...question.statements.map((entry, index) => `${index + 1}. ${entry}`),
    "",
    "### Conclusions",
    ...question.conclusions.map((entry, index) => `${index === 0 ? "I" : "II"}. [${entry.mode}] ${entry.text}`),
    "",
    `**Correct answer:** ${question.options[question.correctIndex]?.text ?? question.semanticAnswer}`,
    "",
    "### Student explanation",
    ...question.explanation.map((entry) => `- ${entry}`),
    "",
  ]),
].join("\n");

writeFileSync(resolve(outDir, "SYL-001-BANKING-POSSIBILITY-EDITORIAL-V5.html"), html, "utf8");
writeFileSync(resolve(outDir, "SYL-001-BANKING-POSSIBILITY-EDITORIAL-V5.md"), markdown, "utf8");
writeFileSync(resolve(outDir, "syl-001-bank-possibility-editorial-summary-v5.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
writeFileSync(resolve(outDir, "syl-001-bank-possibility-editorial-records-v5.jsonl"), `${records.map((entry) => JSON.stringify(entry)).join("\n")}\n`, "utf8");
console.log(JSON.stringify({ ...summary, outputDir: outDir }, null, 2));
