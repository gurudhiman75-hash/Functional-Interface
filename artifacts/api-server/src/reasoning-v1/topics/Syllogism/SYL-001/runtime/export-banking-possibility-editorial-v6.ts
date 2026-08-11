import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityEditorialQuestionV6 } from "./banking-possibility-editorial-v6";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 24 }, (_, index) => index);
const outDir = resolve(process.cwd(), "dist/reasoning-v1/syl-001-bank-possibility-editorial-v6");
mkdirSync(outDir, { recursive: true });
const records = seeds.flatMap((seed) => locales.map((locale) => generateBankingPossibilityEditorialQuestionV6(seed, locale)));

function esc(value: string): string { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
function card(q: ReturnType<typeof generateBankingPossibilityEditorialQuestionV6>): string {
  return `<article><header><b>Seed ${q.seed} · ${esc(q.locale)}</b><span>${esc(q.scenarioId)} · ${esc(q.diagram.geometrySource)}</span></header><div class="grid"><section><h3>Statements</h3><ol>${q.statements.map((s) => `<li>${esc(s)}</li>`).join("")}</ol><h3>Conclusions</h3><ol class="roman">${q.conclusions.map((c) => `<li><b>${esc(c.mode)}</b> — ${esc(c.text)}</li>`).join("")}</ol><p><b>Correct:</b> ${esc(q.options[q.correctIndex]?.text ?? q.semanticAnswer)}</p><h3>Explanation</h3>${q.explanation.map((e) => `<p class="ex">${esc(e)}</p>`).join("")}</section><section>${q.diagram.svg}</section></div></article>`;
}
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL Banking Editorial V6</title><style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f1f5f9;color:#0f172a;padding:16px;margin:0}main{max-width:1200px;margin:auto}article,.note{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:15px;margin-bottom:18px}header{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;border-bottom:1px solid #e2e8f0;padding-bottom:8px}.grid{display:grid;grid-template-columns:1.15fr .85fr;gap:20px}.roman{list-style-type:upper-roman}.ex{background:#f8fafc;border-left:3px solid #475569;padding:10px;line-height:1.55}svg{max-width:100%;height:auto}@media(max-width:760px){.grid{grid-template-columns:1fr}}</style></head><body><main><h1>SYL-001 Banking Possibility — Editorial V6</h1><div class="note">Human editorial review required. V6 changes explanation wording only; V4 answers and diagrams are unchanged.</div>${records.map(card).join("\n")}</main></body></html>`;
const md = ["# SYL-001 Banking Possibility — Editorial V6", "", "> Explanations only; V4 semantics and diagrams unchanged.", "", ...records.flatMap((q) => [`## Seed ${q.seed} — ${q.locale} — ${q.scenarioId}`, "", "Statements:", ...q.statements.map((s,i)=>`${i+1}. ${s}`), "", "Conclusions:", ...q.conclusions.map((c,i)=>`${i===0?"I":"II"}. [${c.mode}] ${c.text}`), "", `Correct: **${q.options[q.correctIndex]?.text ?? q.semanticAnswer}**`, "", "Explanation:", ...q.explanation.map((e)=>`- ${e}`), ""] )].join("\n");
const summary = { status:"PROTOTYPE_HUMAN_EDITORIAL_REVIEW_REQUIRED", schemaVersion:"banking-possibility-editorial-v6", logicalQuestions:24, records:72, explanationLines:144, enabledDiagrams:records.filter((r)=>r.diagram.enabled).length, semanticsChangedFromV4:false, diagramsChangedFromV4:false, humanEditorialStatus:"PENDING", humanLocalizationStatus:"PENDING", humanExamAuthenticityStatus:"PENDING", activationPermitted:false };
writeFileSync(resolve(outDir,"SYL-001-BANKING-POSSIBILITY-EDITORIAL-V6.html"),html,"utf8");
writeFileSync(resolve(outDir,"SYL-001-BANKING-POSSIBILITY-EDITORIAL-V6.md"),md,"utf8");
writeFileSync(resolve(outDir,"syl-001-bank-possibility-editorial-v6.jsonl"),`${records.map((r)=>JSON.stringify(r)).join("\n")}\n`,"utf8");
writeFileSync(resolve(outDir,"syl-001-bank-possibility-editorial-v6-summary.json"),`${JSON.stringify(summary,null,2)}\n`,"utf8");
console.log(JSON.stringify({...summary,outputDir:outDir},null,2));
