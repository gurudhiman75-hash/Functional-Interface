import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityEditorialCandidate } from "./banking-possibility-editorial-candidate";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);
const outDir = resolve(process.cwd(), "dist/reasoning-v1/syl-001-bank-possibility-editorial-candidate");
mkdirSync(outDir, { recursive: true });
const records = seeds.flatMap((seed) => locales.map((locale) => generateBankingPossibilityEditorialCandidate(seed, locale)));

function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function card(q: ReturnType<typeof generateBankingPossibilityEditorialCandidate>): string {
  return `<article id="seed-${q.seed}-${q.locale}"><header><b>Seed ${q.seed} · ${esc(q.locale)}</b><span>${esc(q.scenarioId)} · ${esc(q.diagram.geometrySource)}</span></header><div class="grid"><section><h3>Statements</h3><ol>${q.statements.map((s)=>`<li>${esc(s)}</li>`).join("")}</ol><h3>Conclusions</h3><ol class="roman">${q.conclusions.map((c)=>`<li><b>${esc(c.mode)}</b> — ${esc(c.text)}</li>`).join("")}</ol><h3>Options</h3><ol type="A">${q.options.map((o)=>`<li class="${o.isCorrect?"correct":""}">${esc(o.text)}</li>`).join("")}</ol><p><b>Correct:</b> ${esc(q.options[q.correctIndex]?.text ?? q.semanticAnswer)}</p><h3>Student explanation</h3>${q.explanation.map((e)=>`<p class="ex">${esc(e)}</p>`).join("")}</section><section class="diagram"><h3>One combined diagram</h3>${q.diagram.svg}<p>${esc(q.diagram.caption)}</p></section></div></article>`;
}

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 Banking Editorial Candidate</title><style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f1f5f9;color:#0f172a;padding:16px;margin:0}main{max-width:1240px;margin:auto}.note,article{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:15px;margin-bottom:18px}.note{border-left:5px solid #d97706}header{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;border-bottom:1px solid #e2e8f0;padding-bottom:8px}.grid{display:grid;grid-template-columns:1.18fr .82fr;gap:20px}.roman{list-style-type:upper-roman}.correct{font-weight:800}.ex{background:#f8fafc;border-left:3px solid #475569;padding:10px;line-height:1.55}.diagram svg{max-width:100%;height:auto;display:block;margin:auto}@media(max-width:760px){body{padding:8px}.grid{grid-template-columns:1fr}}</style></head><body><main><h1>SYL-001 Banking Possibility — Consolidated Editorial Candidate</h1><div class="note"><b>Human review required.</b> 80 logical seeds × 3 locales. This candidate changes explanation wording only; V4 question semantics, answers and diagrams remain unchanged.</div>${records.map(card).join("\n")}</main></body></html>`;

const summary = {
  status: "PROTOTYPE_HUMAN_EDITORIAL_REVIEW_REQUIRED",
  schemaVersion: "banking-possibility-editorial-candidate-v1",
  logicalQuestions: 80,
  records: records.length,
  explanationLines: records.length * 2,
  locales: Object.fromEntries(locales.map((locale) => [locale, records.filter((r) => r.locale === locale).length])),
  enabledDiagrams: records.filter((r) => r.diagram.enabled).length,
  semanticsChangedFromV4: false,
  diagramsChangedFromV4: false,
  humanEditorialStatus: "PENDING",
  humanLocalizationStatus: "PENDING",
  humanExamAuthenticityStatus: "PENDING",
  activationPermitted: false,
};

writeFileSync(resolve(outDir, "SYL-001-BANKING-POSSIBILITY-EDITORIAL-CANDIDATE.html"), html, "utf8");
writeFileSync(resolve(outDir, "syl-001-bank-possibility-editorial-candidate.jsonl"), `${records.map((r)=>JSON.stringify(r)).join("\n")}\n`, "utf8");
writeFileSync(resolve(outDir, "syl-001-bank-possibility-editorial-candidate-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...summary, outputDir: outDir }, null, 2));
