import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateBankingCanNeverEditorialV5 } from "./banking-can-never-be-editorial-v5";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);
const outDir = resolve(process.cwd(), "dist/reasoning-v1/syl-001-bank-can-never-be-editorial-v5");
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
  generateBankingCanNeverEditorialV5(seed, locale)));

const languages: Record<string, number> = {};
const semanticStatuses: Record<string, number> = {};
const geometrySources: Record<string, number> = {};
const diagramSchemas: Record<string, number> = {};
let diagrams = 0;
let explanationChars = 0;

for (const question of records) {
  if (!question.diagram.enabled || !question.diagram.svg || question.diagram.diagramCount !== 1) {
    throw new Error(`${question.seed}/${question.locale}: V5 review pack requires one enabled diagram.`);
  }
  increment(languages, question.locale);
  increment(semanticStatuses, question.semanticAnswer);
  increment(geometrySources, question.diagram.geometrySource);
  increment(diagramSchemas, question.diagram.schemaVersion);
  diagrams += 1;
  explanationChars += question.explanation.reduce((total, line) => total + line.length, 0);
}

const summary = {
  status: "HUMAN_REVIEW_REQUIRED_EDITORIAL_V5",
  authority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5",
  semanticAuthority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
  logicalQuestions: 80,
  records: records.length,
  languages,
  semanticStatuses,
  diagrams,
  geometrySources,
  diagramSchemas,
  explanationChars,
  diagramPolicy: "ONE_COMBINED_PREMISE_DIAGRAM_AFTER_ATTEMPT_V4_UNCHANGED",
  humanEditorialStatus: "PENDING",
  humanLocalizationStatus: "PENDING",
  humanExamAuthenticityStatus: "PENDING",
  humanDiagramStatus: "PENDING",
  activationPermitted: false,
};

function card(question: (typeof records)[number]): string {
  const answer = question.options[question.correctIndex]?.text ?? question.semanticAnswer;
  return `<article class="card" lang="${esc(question.locale)}">
<header><strong>Seed ${question.seed} · ${esc(question.locale)}</strong><span>${esc(question.scenarioId)} · ${esc(question.semanticAnswer)}</span></header>
<section><h3>Statements</h3><ol>${question.statements.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ol></section>
<section><h3>Conclusions</h3><ol class="roman">${question.conclusions.map((entry) => `<li>${esc(entry.text)}</li>`).join("")}</ol></section>
<section><h3>Options</h3><ol type="A">${question.options.map((entry) => `<li class="${entry.isCorrect ? "correct" : ""}">${esc(entry.text)}</li>`).join("")}</ol><p><b>Correct answer:</b> ${esc(answer)}</p></section>
<section class="diagram"><h3>Combined premise diagram — shown after attempt</h3><div class="svg-wrap">${question.diagram.svg}</div><p class="caption">${esc(question.diagram.caption ?? "")}</p><p class="meta">${esc(question.diagram.geometrySource)} · ${esc(question.diagram.schemaVersion)}</p></section>
<section><h3>Polished learner explanation</h3>${question.explanation.map((entry) => `<p>${esc(entry)}</p>`).join("")}</section>
</article>`;
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 Banking Can-Never-Be Editorial V5</title><style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:18px}main{max-width:980px;margin:auto}.notice,.card{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:16px;margin:0 0 18px}.notice{border-left:5px solid #d97706}.card header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid #e2e8f0;padding-bottom:10px}.roman{list-style-type:upper-roman}.correct{font-weight:800}.svg-wrap{max-width:560px;margin:10px auto}.svg-wrap svg{width:100%;height:auto;display:block}.caption,.meta{font-size:.9rem;color:#475569}.meta{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}p,li{line-height:1.5}h1{margin-top:0}@media(max-width:700px){body{padding:8px}.card{padding:12px}}</style></head><body><main><h1>SYL-001 Banking Can-Never-Be — Editorial V5</h1><div class="notice"><b>Human review required.</b> V5 changes learner-facing explanation phrasing only. V4 semantics, statements, conclusions, options, answers, diagram SVGs and delivery locks remain unchanged.</div>${records.map(card).join("\n")}</main></body></html>`;

const markdown = [
  "# SYL-001 Banking Can-Never-Be — Editorial V5",
  "",
  "> Human review required. Editorial polish only; V4 semantics, questions, answers and diagrams remain unchanged.",
  "",
  ...records.flatMap((question) => [
    `## Seed ${question.seed} — ${question.locale} — ${question.scenarioId}`,
    "",
    "### Statements",
    ...question.statements.map((entry, index) => `${index + 1}. ${entry}`),
    "",
    "### Conclusions",
    ...question.conclusions.map((entry, index) => `${index === 0 ? "I" : "II"}. ${entry.text}`),
    "",
    "### Options",
    ...question.options.map((entry, index) => `${String.fromCharCode(65 + index)}. ${entry.text}${entry.isCorrect ? " **✓**" : ""}`),
    "",
    `**Correct answer:** ${question.options[question.correctIndex]?.text ?? question.semanticAnswer}`,
    "",
    `**Diagram:** ${question.diagram.geometrySource} · ${question.diagram.schemaVersion}`,
    "",
    "### Polished learner explanation",
    ...question.explanation.map((entry) => `- ${entry}`),
    "",
  ]),
].join("\n");

writeFileSync(resolve(outDir, "SYL-001-BANKING-CAN-NEVER-BE-EDITORIAL-V5.html"), html, "utf8");
writeFileSync(resolve(outDir, "SYL-001-BANKING-CAN-NEVER-BE-EDITORIAL-V5.md"), markdown, "utf8");
writeFileSync(resolve(outDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...summary, outputDir: outDir }, null, 2));
