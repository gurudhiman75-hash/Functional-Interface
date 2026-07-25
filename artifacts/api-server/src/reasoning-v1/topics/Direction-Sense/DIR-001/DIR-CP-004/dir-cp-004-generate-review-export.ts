import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateDirCp004Question, type GeneratedRelativeGraphQuestion } from "./generator";
import { DIR_CP004_QLS } from "./task-registry";

const REVIEW_SEEDS = [0, 1, 2, 3, 4] as const;
const OUTPUT_DIR = path.resolve(process.cwd(), "dist/reasoning-v1/dir-cp-004-review-export");

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function renderQuestion(question: GeneratedRelativeGraphQuestion, reviewNumber: number): string {
  const correctLetter = String.fromCharCode(65 + question.correctIndex);
  const options = question.options.map((option, index) => `<li class="${index === question.correctIndex ? "correct" : ""}"><strong>${String.fromCharCode(65 + index)}.</strong> ${escapeHtml(option.label)}</li>`).join("");
  const placements = question.explanation.placementLines.map((line) => `<p class="placement">${escapeHtml(line)}</p>`).join("");
  return [
    `<article class="question" id="${question.qlId}-seed-${question.seed}">`,
    `<header><h2>Review ${reviewNumber}: ${question.qlId} · Seed ${question.seed}</h2><div class="badges"><span>${question.difficulty}</span><span>${question.metadata.answerDemand}</span><span>${question.metadata.entityCount} entities</span></div></header>`,
    `<h3>Question</h3><p class="stem">${escapeHtml(question.stem)}</p>`,
    `<ol class="options">${options}</ol>`,
    `<div class="answer"><strong>Correct answer:</strong> ${correctLetter}. ${escapeHtml(question.options[question.correctIndex].label)}</div>`,
    `<h3>Explanation</h3>`,
    `<p class="given">${escapeHtml(question.explanation.given)}</p>`,
    `<div class="placements">${placements}</div>`,
    `<p class="result">${escapeHtml(question.explanation.resultLine)}</p>`,
    question.explanation.calculationLine ? `<p class="calculation">${escapeHtml(question.explanation.calculationLine)}</p>` : "",
    `<p class="conclusion"><strong>Therefore:</strong> ${escapeHtml(question.explanation.conclusion)}</p>`,
    `<h3>Diagram</h3><div class="diagram">${question.explanation.diagram.svg}</div>`,
    `</article>`,
  ].join("");
}

function renderHtml(questions: readonly GeneratedRelativeGraphQuestion[]): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>ExamTree DIR-CP-004 Review</title><style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#111827;background:#eef2f7}*{box-sizing:border-box}body{margin:0;padding:24px}main{max-width:1040px;margin:0 auto}.cover,.question{background:#fff;border:1px solid #d1d5db;border-radius:16px;box-shadow:0 8px 24px rgba(15,23,42,.06)}.cover{padding:28px;margin-bottom:24px}.cover h1{margin:0 0 8px}.cover p{margin:6px 0;color:#374151}.question{padding:26px;margin:0 0 28px;break-inside:avoid}header{border-bottom:2px solid #e5e7eb;padding-bottom:14px;margin-bottom:18px}header h2{margin:0 0 10px}.badges{display:flex;flex-wrap:wrap;gap:8px}.badges span{background:#eef2ff;border:1px solid #c7d2fe;border-radius:999px;padding:4px 9px;font-size:12px;font-weight:700;color:#3730a3}.stem{line-height:1.75;background:#f8fafc;border-left:5px solid #2563eb;border-radius:8px;padding:18px;font-size:16px}.options{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.options li{border:1px solid #d1d5db;border-radius:9px;padding:11px 13px}.options li.correct{background:#ecfdf5;border-color:#10b981}.answer{background:#ecfdf5;border:1px solid #10b981;border-radius:9px;padding:13px;margin:16px 0 22px}.given{background:#f8fafc;border:1px solid #cbd5e1;border-radius:9px;padding:14px 16px;line-height:1.6}.placements{margin:14px 0}.placement{margin:0;padding:8px 4px;line-height:1.55;border-bottom:1px solid #e5e7eb}.placement:last-child{border-bottom:0}.result{background:#fffbeb;border:1px solid #fbbf24;border-radius:9px;padding:12px 14px;line-height:1.6}.calculation{background:#f0f9ff;border:1px solid #38bdf8;border-radius:9px;padding:12px 14px;line-height:1.65;font-weight:650}.conclusion{background:#eff6ff;border:1px solid #60a5fa;border-radius:9px;padding:13px 15px;line-height:1.6}.diagram{overflow-x:auto;border:1px solid #d1d5db;border-radius:12px;padding:10px;background:#fff}.diagram svg{width:100%;min-width:620px;height:auto}@media print{body{background:#fff;padding:0}.cover,.question{box-shadow:none;page-break-after:always}}@media(max-width:760px){body{padding:10px}.options{grid-template-columns:1fr}.question{padding:16px}}
</style></head><body><main><section class="cover"><h1>ExamTree Reasoning V1 — DIR-CP-004 Review File</h1><p><strong>Coverage:</strong> ${DIR_CP004_QLS.length} need-based QLs × ${REVIEW_SEEDS.length} seeds = ${questions.length} questions.</p><p><strong>QLs:</strong> ${DIR_CP004_QLS.map((ql) => ql.qlId).join(", ")}</p><p>Each item uses a natural static-position paragraph, one placement sentence per relation, a direct result, any required shortest-distance calculation, and a plain named-point diagram at the end.</p></section>${questions.map((question, index) => renderQuestion(question, index + 1)).join("")}</main></body></html>`;
}

async function main(): Promise<void> {
  const questions = DIR_CP004_QLS.flatMap((ql) => REVIEW_SEEDS.map((seed) => generateDirCp004Question(ql.qlId, seed)));
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(path.join(OUTPUT_DIR, "DIR-CP-004-QUESTION-REVIEW.html"), renderHtml(questions), "utf8");
  await writeFile(path.join(OUTPUT_DIR, "DIR-CP-004-QUESTION-REVIEW.jsonl"), `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`, "utf8");
  await writeFile(path.join(OUTPUT_DIR, "README.txt"), ["ExamTree DIR-CP-004 review export", `Questions: ${questions.length}`, `QLs: ${DIR_CP004_QLS.map((ql) => ql.qlId).join(", ")}`, `Seeds: ${REVIEW_SEEDS.join(", ")}`].join("\n"), "utf8");
}

void main();
