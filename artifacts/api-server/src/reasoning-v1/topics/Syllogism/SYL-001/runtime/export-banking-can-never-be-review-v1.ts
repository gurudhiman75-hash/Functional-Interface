import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateBankingCanNeverShellV1 } from "./banking-can-never-be-shell-v1";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);
const outDir = resolve(process.cwd(), "dist/reasoning-v1/syl-001-bank-can-never-be-review-v1");
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

const records = seeds.flatMap((seed) =>
  locales.map((locale) => generateBankingCanNeverShellV1(seed, locale)));

const surfaceKinds: Record<string, number> = {};
const dispositions: Record<string, number> = {};
const semanticStatuses: Record<string, number> = {};
const sourcePatterns: Record<string, number> = {};
const correctOptionPositions: Record<string, number> = {};
const languages: Record<string, number> = {};

for (const question of records) {
  const negative = question.conclusions.find((entry) => entry.mode === "CAN_NEVER_BE");
  if (!negative || !negative.surfaceKind || !negative.disposition) {
    throw new Error(`${question.seed}/${question.locale}: missing can-never-be conclusion.`);
  }
  increment(surfaceKinds, negative.surfaceKind);
  increment(dispositions, negative.disposition);
  increment(semanticStatuses, question.semanticAnswer);
  increment(sourcePatterns, question.sourcePatternId);
  increment(correctOptionPositions, String(question.correctIndex));
  increment(languages, question.locale);
}

const summary = {
  status: "PROTOTYPE_CAN_NEVER_BE_HUMAN_REVIEW_REQUIRED",
  authority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V1",
  semanticProfile: "BANKING_EXAM_CAN_NEVER_BE_V1",
  schemaVersion: "banking-can-never-be-review-v1",
  logicalQuestions: seeds.length,
  records: records.length,
  languages,
  surfaceKinds,
  dispositions,
  semanticStatuses,
  sourcePatterns,
  correctOptionPositions,
  humanEditorialStatus: "PENDING",
  humanLocalizationStatus: "PENDING",
  humanExamAuthenticityStatus: "PENDING",
  humanDiagramStatus: "NOT_APPLICABLE_IN_THIS_TEXT_REVIEW_PACK",
  activationPermitted: false,
};

function meta(question: (typeof records)[number], index: number): string {
  const conclusion = question.conclusions[index];
  if (!conclusion) return "";
  return conclusion.mode === "CAN_NEVER_BE"
    ? `${conclusion.mode} · ${conclusion.surfaceKind} · ${conclusion.disposition} · ${conclusion.canonicalConclusion.form}`
    : `${conclusion.mode} · ${conclusion.classification} · ${conclusion.canonicalConclusion.form}`;
}

function card(question: (typeof records)[number]): string {
  const correct = question.options[question.correctIndex]?.text ?? question.semanticAnswer;
  const negative = question.conclusions.find((entry) => entry.mode === "CAN_NEVER_BE");
  return `<article class="card" id="seed-${question.seed}-${question.locale}">
    <header>
      <strong>Seed ${question.seed} · ${esc(question.locale)}</strong>
      <span>${esc(question.scenarioId)} · ${esc(question.sourcePatternId)}</span>
    </header>
    <div class="chips">
      <span>${esc(question.semanticAnswer)}</span>
      <span>${esc(negative?.surfaceKind ?? "")}</span>
      <span>${esc(negative?.disposition ?? "")}</span>
      <span>Answer ${String.fromCharCode(65 + question.correctIndex)}</span>
    </div>
    <h3>Statements</h3>
    <ol>${question.statements.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ol>
    <h3>Conclusions</h3>
    <ol class="roman">${question.conclusions.map((entry, index) =>
      `<li><small>${esc(meta(question, index))}</small><br>${esc(entry.text)}</li>`).join("")}</ol>
    <h3>Options</h3>
    <ol type="A">${question.options.map((entry) =>
      `<li class="${entry.isCorrect ? "correct" : ""}">${esc(entry.text)}</li>`).join("")}</ol>
    <p class="answer"><b>Correct answer:</b> ${esc(correct)}</p>
    <h3>Student explanation</h3>
    ${question.explanation.map((entry) => `<p>${esc(entry)}</p>`).join("")}
  </article>`;
}

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SYL-001 Banking Can Never Be — Review V1</title>
<style>
body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:18px}main{max-width:980px;margin:auto}.notice,.card{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:16px;margin:0 0 18px}.notice{border-left:5px solid #d97706}.card header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid #e2e8f0;padding-bottom:10px}.chips{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.chips span{font-size:.78rem;background:#e2e8f0;border-radius:999px;padding:4px 8px}.correct{font-weight:800}.answer{padding:9px 11px;background:#f8fafc;border-radius:8px}small{font-size:.86rem;color:#475569}.roman{list-style-type:upper-roman}h1{margin-top:0}h3{margin-bottom:6px}ol{margin-top:6px}p{line-height:1.55}@media(max-width:760px){body{padding:8px}.card{padding:12px}}
</style></head><body><main>
<h1>SYL-001 Banking “Can Never Be” — Human Review V1</h1>
<div class="notice"><b>Human review required.</b> Check exam-like wording, English/Hindi/Punjabi naturalness, and whether each explanation communicates the negative-modal rule clearly. This is a text review pack only; no QL registration or activation is permitted.</div>
${records.map(card).join("\n")}
</main></body></html>`;

const markdown = [
  "# SYL-001 Banking “Can Never Be” — Human Review V1",
  "",
  "> Human review required. Text-only review pack; no QL registration or activation is permitted.",
  "",
  ...records.flatMap((question) => [
    `## Seed ${question.seed} — ${question.locale} — ${question.scenarioId}`,
    "",
    "### Statements",
    ...question.statements.map((entry, index) => `${index + 1}. ${entry}`),
    "",
    "### Conclusions",
    ...question.conclusions.map((entry, index) =>
      `${index === 0 ? "I" : "II"}. [${meta(question, index)}] ${entry.text}`),
    "",
    "### Options",
    ...question.options.map((entry, index) =>
      `${String.fromCharCode(65 + index)}. ${entry.text}${entry.isCorrect ? " **✓**" : ""}`),
    "",
    `**Correct answer:** ${question.options[question.correctIndex]?.text ?? question.semanticAnswer}`,
    "",
    "### Student explanation",
    ...question.explanation.map((entry) => `- ${entry}`),
    "",
  ]),
].join("\n");

writeFileSync(resolve(outDir, "SYL-001-BANKING-CAN-NEVER-BE-REVIEW-V1.html"), html, "utf8");
writeFileSync(resolve(outDir, "SYL-001-BANKING-CAN-NEVER-BE-REVIEW-V1.md"), markdown, "utf8");
writeFileSync(resolve(outDir, "syl-001-bank-can-never-be-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
writeFileSync(resolve(outDir, "syl-001-bank-can-never-be-records.jsonl"), `${records.map((entry) => JSON.stringify(entry)).join("\n")}\n`, "utf8");

console.log(JSON.stringify({ ...summary, outputDir: outDir }, null, 2));
