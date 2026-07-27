import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateDirCp008Question } from "./generator";
import { DIR_CP008_QLS } from "./task-registry";
import type { GeneratedAdvancedQuestion } from "./types";

const SEEDS = [0, 1, 2, 3, 4] as const;
const OUT = path.resolve(process.cwd(), "dist/reasoning-v1/dir-cp-008-review-export");
const esc = (value: string): string => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

function card(question: GeneratedAdvancedQuestion, number: number): string {
  const answerLetter = String.fromCharCode(65 + question.correctIndex);
  const options = question.options.map((option, index) => `<li class="${index === question.correctIndex ? "correct" : ""}"><strong>${String.fromCharCode(65 + index)}.</strong> ${esc(option.label)}</li>`).join("");
  const steps = question.explanation.steps.map((step) => `<li>${esc(step)}</li>`).join("");
  const questionDiagram = question.questionDiagram ? `<h3>Question diagram</h3><div class="diagram">${question.questionDiagram.svg}</div>` : "";
  const explanationDiagram = question.explanation.diagram ? `<h3>Explanation diagram</h3><div class="diagram">${question.explanation.diagram.svg}</div>` : "";
  return `<article class="question"><header><h2>Review ${number}: ${question.qlId} · Seed ${question.seed}</h2><div class="badges"><span>${question.difficulty}</span><span>${question.metadata.answerDemand}</span>${question.metadata.caseletId ? `<span>${esc(question.metadata.caseletId)}</span>` : ""}</div></header><h3>Question</h3><p class="stem">${esc(question.stem)}</p>${questionDiagram}<ol class="options">${options}</ol><div class="answer"><strong>Correct answer:</strong> ${answerLetter}. ${esc(question.options[question.correctIndex].label)}</div><h3>Explanation</h3><p class="given">${esc(question.explanation.given)}</p><ol class="steps">${steps}</ol><p class="result">${esc(question.explanation.resultLine)}</p><p class="conclusion">${esc(question.explanation.conclusion)}</p>${explanationDiagram}</article>`;
}

function html(questions: readonly GeneratedAdvancedQuestion[]): string {
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>DIR-CP-008 Review</title><style>:root{font-family:Inter,system-ui;color:#111827;background:#eef2f7}*{box-sizing:border-box}body{margin:0;padding:24px}main{max-width:1120px;margin:auto}.cover,.question{background:#fff;border:1px solid #d1d5db;border-radius:16px;padding:26px;margin-bottom:26px;box-shadow:0 8px 24px #0f172a0f}header{border-bottom:2px solid #e5e7eb}.badges{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.badges span{background:#eef2ff;border:1px solid #a5b4fc;border-radius:999px;padding:4px 9px;font-size:12px;font-weight:700}.stem{line-height:1.75;background:#f8fafc;border-left:5px solid #6366f1;border-radius:8px;padding:18px}.options{list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px}.options li{border:1px solid #d1d5db;border-radius:9px;padding:11px}.options .correct,.answer{background:#ecfdf5;border-color:#10b981}.answer,.given,.steps,.result,.conclusion{border:1px solid #cbd5e1;border-radius:9px;padding:13px;margin:14px 0;line-height:1.6}.steps{background:#fffbeb;border-color:#fbbf24;padding-left:34px}.result{background:#f5f3ff;border-color:#a78bfa}.conclusion{background:#eff6ff;border-color:#60a5fa}.diagram{overflow:auto;border:1px solid #d1d5db;border-radius:12px;padding:10px}.diagram svg{width:100%;min-width:720px;height:auto}@media(max-width:760px){body{padding:10px}.options{grid-template-columns:1fr}}</style></head><body><main><section class="cover"><h1>ExamTree Reasoning V1 — DIR-CP-008 Review File</h1><p><strong>Coverage:</strong> 9 need-based QLs × 5 seeds = 45 questions.</p><p><strong>QLs:</strong> ${DIR_CP008_QLS.map((ql) => ql.qlId).join(", ")}</p><p>This final checkpoint covers inverse relation reconstruction, contradiction detection, missing path operations, endpoint-based frame reconstruction, graph-plus-movement synthesis, paired shared-stimulus caselets, and diagram-text hybrid evidence.</p></section>${questions.map((question, index) => card(question, index + 1)).join("")}</main></body></html>`;
}

async function main(): Promise<void> {
  const questions = DIR_CP008_QLS.flatMap((ql) => SEEDS.map((seed) => generateDirCp008Question(ql.qlId, seed)));
  await mkdir(OUT, { recursive: true });
  await writeFile(path.join(OUT, "DIR-CP-008-QUESTION-REVIEW.html"), html(questions));
  await writeFile(path.join(OUT, "DIR-CP-008-QUESTION-REVIEW.jsonl"), `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`);
  await writeFile(path.join(OUT, "README.txt"), `ExamTree DIR-CP-008 review export\nQuestions: ${questions.length}\nQLs: ${DIR_CP008_QLS.map((ql) => ql.qlId).join(", ")}\nSeeds: ${SEEDS.join(", ")}\n`);
}

void main();
