import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateDirCp005Question, type GeneratedMultiMoverQuestion } from "./generator";
import { DIR_CP005_QLS } from "./task-registry";

const REVIEW_SEEDS = [0, 1, 2, 3, 4] as const;
const OUTPUT_DIR = path.resolve(process.cwd(), "dist/reasoning-v1/dir-cp-005-review-export");

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function renderQuestion(question: GeneratedMultiMoverQuestion, reviewNumber: number): string {
  const correctLetter = String.fromCharCode(65 + question.correctIndex);
  const options = question.options.map((option, index) => `<li class="${index === question.correctIndex ? "correct" : ""}"><strong>${String.fromCharCode(65 + index)}.</strong> ${escapeHtml(option.label)}</li>`).join("");
  const movements = question.explanation.movementLines.map((line) => `<p class="movement-line">${escapeHtml(line)}</p>`).join("");
  const endpoints = question.explanation.endpointLines.map((line) => `<p class="endpoint-line">${escapeHtml(line)}</p>`).join("");
  return [
    `<article class="question" id="${question.qlId}-seed-${question.seed}">`,
    `<header><h2>Review ${reviewNumber}: ${question.qlId} · Seed ${question.seed}</h2><div class="badges"><span>${question.difficulty}</span><span>${question.metadata.answerDemand}</span><span>${question.metadata.sameOrigin ? "SAME_ORIGIN" : "DIFFERENT_ORIGINS"}</span></div></header>`,
    `<h3>Question</h3><p class="stem">${escapeHtml(question.stem)}</p>`,
    `<ol class="options">${options}</ol>`,
    `<div class="answer"><strong>Correct answer:</strong> ${correctLetter}. ${escapeHtml(question.options[question.correctIndex].label)}</div>`,
    `<h3>Explanation</h3><p class="given">${escapeHtml(question.explanation.given)}</p>`,
    `<div class="movements">${movements}</div>`,
    `<div class="endpoints">${endpoints}</div>`,
    `<p class="comparison">${escapeHtml(question.explanation.comparisonLine)}</p>`,
    question.explanation.calculationLine ? `<p class="calculation">${escapeHtml(question.explanation.calculationLine)}</p>` : "",
    `<p class="conclusion">${escapeHtml(question.explanation.conclusion)}</p>`,
    `<h3>Diagram</h3><div class="diagram">${question.explanation.diagram.svg}</div>`,
    `</article>`,
  ].join("");
}

function renderHtml(questions: readonly GeneratedMultiMoverQuestion[]): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>ExamTree DIR-CP-005 Review</title><style>
:root{font-family:Inter,ui-sans-serif,system-ui;color:#111827;background:#eef2f7}*{box-sizing:border-box}body{margin:0;padding:24px}main{max-width:1080px;margin:auto}.cover,.question{background:#fff;border:1px solid #d1d5db;border-radius:16px;box-shadow:0 8px 24px rgba(15,23,42,.06)}.cover{padding:28px;margin-bottom:24px}.question{padding:26px;margin-bottom:28px}.question header{border-bottom:2px solid #e5e7eb;padding-bottom:14px}.badges{display:flex;gap:8px;flex-wrap:wrap}.badges span{background:#eef2ff;border:1px solid #c7d2fe;border-radius:999px;padding:4px 9px;font-size:12px;font-weight:700}.stem{line-height:1.75;background:#f8fafc;border-left:5px solid #2563eb;border-radius:8px;padding:18px}.options{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.options li{border:1px solid #d1d5db;border-radius:9px;padding:11px 13px}.options li.correct{background:#ecfdf5;border-color:#10b981}.answer{background:#ecfdf5;border:1px solid #10b981;border-radius:9px;padding:13px;margin:16px 0 22px}.given,.comparison,.calculation,.conclusion{border-radius:9px;padding:12px 14px;line-height:1.6}.given{background:#f8fafc;border:1px solid #cbd5e1}.movement-line,.endpoint-line{margin:0;padding:7px 4px;border-bottom:1px solid #e5e7eb}.comparison{background:#eff6ff;border:1px solid #93c5fd}.calculation{background:#fffbeb;border:1px solid #fbbf24}.conclusion{background:#ecfdf5;border:1px solid #6ee7b7;font-weight:700}.diagram svg{display:block;width:100%;height:auto;border-radius:12px}@media(max-width:700px){.options{grid-template-columns:1fr}body{padding:10px}.question{padding:16px}}
</style></head><body><main><section class="cover"><h1>DIR-CP-005 English Question Review</h1><p>Seven need-based QLs · five deterministic seeds each · 35 questions.</p><p>Review focus: natural multi-mover stems, endpoint-only comparison, concise derivation, and clear diagrams.</p></section>${questions.map(renderQuestion).join("")}</main></body></html>`;
}

async function main(): Promise<void> {
  const questions = DIR_CP005_QLS.flatMap((ql) => REVIEW_SEEDS.map((seed) => generateDirCp005Question(ql.qlId, seed)));
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(path.join(OUTPUT_DIR, "DIR-CP-005-QUESTION-REVIEW.html"), renderHtml(questions), "utf8");
  await writeFile(path.join(OUTPUT_DIR, "DIR-CP-005-QUESTION-REVIEW.jsonl"), questions.map((question) => JSON.stringify(question)).join("\n") + "\n", "utf8");
  await writeFile(path.join(OUTPUT_DIR, "README.txt"), "DIR-CP-005 English review artifact. Manual approval is required before merge.\n", "utf8");
  console.log(`Wrote ${questions.length} DIR-CP-005 review questions to ${OUTPUT_DIR}`);
}

void main();
