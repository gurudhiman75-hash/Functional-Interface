import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import {
  generateBankingPossibilityEditorialV2Candidate,
} from "./banking-possibility-editorial-v2-candidate";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);
const outDir = resolve(process.cwd(), "dist/reasoning-v1/syl-001-bank-possibility-editorial-v2-candidate");
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
  generateBankingPossibilityEditorialV2Candidate(seed, locale)));

const possibilityForms: Record<string, number> = {};
const dispositions: Record<string, number> = {};
const answerStatuses: Record<string, number> = {};
const geometrySources: Record<string, number> = {};
const scenarioCounts: Record<string, number> = {};
const sourceCounts: Record<string, number> = {};
const correctOptionPositions: Record<string, number> = {};
const languageCounts: Record<string, number> = {};

for (const question of records) {
  const possibility = question.conclusions.find((entry) => entry.mode === "POSSIBILITY");
  if (!possibility || !possibility.possibilityDisposition) {
    throw new Error(`${question.seed}/${question.locale}: missing V2 possibility conclusion.`);
  }
  increment(possibilityForms, possibility.canonicalConclusion.form);
  increment(dispositions, possibility.possibilityDisposition);
  increment(answerStatuses, question.semanticAnswer);
  increment(geometrySources, question.diagram.geometrySource);
  increment(scenarioCounts, question.scenarioId);
  increment(sourceCounts, question.sourcePatternId);
  increment(correctOptionPositions, String(question.correctIndex));
  increment(languageCounts, question.locale);
}

const summary = {
  status: "PROTOTYPE_V2_HUMAN_REVIEW_REQUIRED",
  authority: "SYL_001_BANKING_POSSIBILITY_SHELL_V2",
  possibilitySemanticProfile: "BANKING_EXAM_POSSIBILITY_V2",
  schemaVersion: "banking-possibility-editorial-v2-candidate",
  logicalQuestions: seeds.length,
  records: records.length,
  explanationLines: records.reduce((total, entry) => total + entry.explanation.length, 0),
  languages: languageCounts,
  possibilityForms,
  possibilityDispositions: dispositions,
  semanticStatuses: answerStatuses,
  geometrySources,
  scenarios: scenarioCounts,
  sourcePatterns: sourceCounts,
  correctOptionPositions,
  diagramSlots: records.length,
  enabledDiagrams: records.filter((entry) => entry.diagram.enabled).length,
  omittedDiagrams: records.filter((entry) => !entry.diagram.enabled).length,
  semanticAndDiagramParityRequired: true,
  humanEditorialStatus: "PENDING_FOR_V2",
  humanLocalizationStatus: "PENDING_FOR_V2",
  humanExamAuthenticityStatus: "PENDING_FOR_V2",
  humanDiagramStatus: "PENDING_FOR_V2",
  activationPermitted: false,
};

function conclusionMeta(question: (typeof records)[number], index: number): string {
  const conclusion = question.conclusions[index];
  if (!conclusion) return "";
  return conclusion.mode === "POSSIBILITY"
    ? `${conclusion.mode} · ${conclusion.possibilityDisposition} · ${conclusion.canonicalConclusion.form}`
    : `${conclusion.mode} · ${conclusion.classification} · ${conclusion.canonicalConclusion.form}`;
}

function card(question: (typeof records)[number]): string {
  const correct = question.options[question.correctIndex]?.text ?? question.semanticAnswer;
  const possibility = question.conclusions.find((entry) => entry.mode === "POSSIBILITY");
  return `<article class="card" id="seed-${question.seed}-${question.locale}">
    <header>
      <strong>Seed ${question.seed} · ${esc(question.locale)}</strong>
      <span>${esc(question.scenarioId)} · ${esc(question.diagram.geometrySource)}</span>
    </header>
    <div class="chips">
      <span>${esc(question.semanticAnswer)}</span>
      <span>${esc(possibility?.possibilityDisposition ?? "")}</span>
      <span>${esc(possibility?.canonicalConclusion.form ?? "")}</span>
    </div>
    <div class="grid">
      <section>
        <h3>Statements</h3>
        <ol>${question.statements.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ol>
        <h3>Conclusions</h3>
        <ol class="roman">${question.conclusions.map((entry, index) =>
          `<li><small>${esc(conclusionMeta(question, index))}</small><br>${esc(entry.text)}</li>`).join("")}</ol>
        <h3>Options</h3>
        <ol type="A">${question.options.map((entry) =>
          `<li class="${entry.isCorrect ? "correct" : ""}">${esc(entry.text)}</li>`).join("")}</ol>
        <p class="answer"><b>Correct answer:</b> ${esc(correct)}</p>
        <h3>Student explanation</h3>
        ${question.explanation.map((entry) => `<p>${esc(entry)}</p>`).join("")}
      </section>
      <section class="diagram">
        <h3>One combined premise diagram</h3>
        ${question.diagram.svg ?? ""}
        <p class="caption">${esc(question.diagram.caption ?? "")}</p>
      </section>
    </div>
  </article>`;
}

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SYL-001 Banking Possibility — Corrected V2 Editorial Candidate</title>
<style>
body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:18px}main{max-width:1240px;margin:auto}.notice,.card{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:16px;margin:0 0 18px}.notice{border-left:5px solid #d97706}.card header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid #e2e8f0;padding-bottom:10px}.chips{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.chips span{font-size:.78rem;background:#e2e8f0;border-radius:999px;padding:4px 8px}.grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr);gap:20px}.diagram{align-self:start;position:sticky;top:10px}.diagram svg{display:block;max-width:100%;height:auto;margin:auto;background:#fff;border-radius:10px}.correct{font-weight:800}.answer{padding:9px 11px;background:#f8fafc;border-radius:8px}.caption,small{font-size:.86rem;color:#475569}.roman{list-style-type:upper-roman}h1{margin-top:0}h3{margin-bottom:6px}ol{margin-top:6px}p{line-height:1.55}@media(max-width:760px){body{padding:8px}.grid{grid-template-columns:1fr}.diagram{position:static}.card{padding:12px}}
</style></head><body><main>
<h1>SYL-001 Banking Possibility — Corrected V2 Editorial Candidate</h1>
<div class="notice"><b>Human review required.</b> This pack uses corrected Banking V2 semantics. Open possibility follows; an already-definite relation is rejected when presented only as a possibility; impossible possibility does not follow. Diagrams are premise-only. Registration and delivery remain disabled.</div>
${records.map(card).join("\n")}
</main></body></html>`;

const markdown = [
  "# SYL-001 Banking Possibility — Corrected V2 Editorial Candidate",
  "",
  "> Human review required. Corrected V2 semantics and combined premise diagrams; no registration or activation is permitted.",
  "",
  ...records.flatMap((question) => [
    `## Seed ${question.seed} — ${question.locale} — ${question.scenarioId}`,
    "",
    `**Geometry:** ${question.diagram.geometrySource}`,
    "",
    "### Statements",
    ...question.statements.map((entry, index) => `${index + 1}. ${entry}`),
    "",
    "### Conclusions",
    ...question.conclusions.map((entry, index) =>
      `${index === 0 ? "I" : "II"}. [${conclusionMeta(question, index)}] ${entry.text}`),
    "",
    `**Correct answer:** ${question.options[question.correctIndex]?.text ?? question.semanticAnswer}`,
    "",
    "### Student explanation",
    ...question.explanation.map((entry) => `- ${entry}`),
    "",
  ]),
].join("\n");

writeFileSync(resolve(outDir, "SYL-001-BANKING-POSSIBILITY-EDITORIAL-V2-CANDIDATE.html"), html, "utf8");
writeFileSync(resolve(outDir, "SYL-001-BANKING-POSSIBILITY-EDITORIAL-V2-CANDIDATE.md"), markdown, "utf8");
writeFileSync(resolve(outDir, "syl-001-bank-possibility-editorial-v2-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
writeFileSync(resolve(outDir, "syl-001-bank-possibility-editorial-v2-records.jsonl"), `${records.map((entry) => JSON.stringify(entry)).join("\n")}\n`, "utf8");

console.log(JSON.stringify({ ...summary, outputDir: outDir }, null, 2));
