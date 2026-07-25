import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateDirCp003Question, type GeneratedDistanceQuestion } from "./generator";
import { DIR_CP003_QLS } from "./task-registry";

const REVIEW_SEEDS = [0, 1, 2, 3, 4] as const;
const OUTPUT_DIR = path.resolve(process.cwd(), "dist/reasoning-v1/dir-cp-003-review-export");

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderOptions(question: GeneratedDistanceQuestion): string {
  return question.options.map((option, index) => {
    const letter = String.fromCharCode(65 + index);
    const correct = index === question.correctIndex;
    return `<li class="${correct ? "correct" : ""}"><strong>${letter}.</strong> ${escapeHtml(option.label)}</li>`;
  }).join("");
}

function renderMovementWalkthrough(question: GeneratedDistanceQuestion): string {
  return question.explanation.movementLines
    .map((line) => `<p class="movement-line">${escapeHtml(line)}</p>`)
    .join("");
}

function renderQuestion(question: GeneratedDistanceQuestion, reviewNumber: number): string {
  const correctLetter = String.fromCharCode(65 + question.correctIndex);
  return [
    `<article class="question" id="${escapeHtml(question.qlId)}-seed-${question.seed}">`,
    `<header class="question-header">`,
    `<h2>Review ${reviewNumber}: ${escapeHtml(question.qlId)} · Seed ${question.seed}</h2>`,
    `<div class="badges"><span>${escapeHtml(question.difficulty)}</span><span>${escapeHtml(question.metadata.answerDemand)}</span><span>${escapeHtml(question.metadata.pathProfile)}</span><span>${escapeHtml(question.metadata.displayMode)}</span></div>`,
    `</header>`,
    `<h3>Question</h3>`,
    `<p class="stem">${escapeHtml(question.stem)}</p>`,
    `<ol class="options">${renderOptions(question)}</ol>`,
    `<div class="answer"><strong>Correct answer:</strong> ${correctLetter}. ${escapeHtml(question.options[question.correctIndex].label)}</div>`,
    `<h3>Explanation</h3>`,
    `<p class="given">${escapeHtml(question.explanation.given)}</p>`,
    `<div class="walkthrough">${renderMovementWalkthrough(question)}</div>`,
    `<p class="net">${escapeHtml(question.explanation.netLine)}</p>`,
    `<p class="conclusion"><strong>Therefore:</strong> ${escapeHtml(question.explanation.conclusion)}</p>`,
    `<h3>Diagram</h3>`,
    `<div class="diagram">${question.explanation.diagram.svg}</div>`,
    `</article>`,
  ].join("");
}

function renderHtml(questions: readonly GeneratedDistanceQuestion[]): string {
  const cards = questions.map((question, index) => renderQuestion(question, index + 1)).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>ExamTree DIR-CP-003 Question Review</title>
<style>
:root { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111827; background: #eef2f7; }
* { box-sizing: border-box; }
body { margin: 0; padding: 24px; }
main { max-width: 1040px; margin: 0 auto; }
.cover, .question { background: #fff; border: 1px solid #d1d5db; border-radius: 16px; box-shadow: 0 8px 24px rgba(15,23,42,.06); }
.cover { padding: 28px; margin-bottom: 24px; }
.cover h1 { margin: 0 0 8px; }
.cover p { margin: 6px 0; color: #374151; }
.question { padding: 26px; margin: 0 0 28px; break-inside: avoid; }
.question-header { border-bottom: 2px solid #e5e7eb; padding-bottom: 14px; margin-bottom: 18px; }
.question-header h2 { margin: 0 0 10px; }
.badges { display: flex; flex-wrap: wrap; gap: 8px; }
.badges span { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 999px; padding: 4px 9px; font-size: 12px; font-weight: 700; color: #3730a3; }
.stem { line-height: 1.75; background: #f8fafc; border-left: 5px solid #2563eb; border-radius: 8px; padding: 18px; font-size: 16px; }
.options { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.options li { border: 1px solid #d1d5db; border-radius: 9px; padding: 11px 13px; }
.options li.correct { background: #ecfdf5; border-color: #10b981; }
.answer { background: #ecfdf5; border: 1px solid #10b981; border-radius: 9px; padding: 13px; margin: 16px 0 22px; }
.given { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 9px; padding: 14px 16px; line-height: 1.6; }
.walkthrough { margin: 14px 0; }
.movement-line { margin: 0; padding: 8px 4px; line-height: 1.55; border-bottom: 1px solid #e5e7eb; }
.movement-line:last-child { border-bottom: 0; }
.net { background: #fffbeb; border: 1px solid #fbbf24; border-radius: 9px; padding: 12px 14px; line-height: 1.6; }
.conclusion { background: #eff6ff; border: 1px solid #60a5fa; border-radius: 9px; padding: 13px 15px; line-height: 1.6; }
.diagram { overflow-x: auto; border: 1px solid #d1d5db; border-radius: 12px; padding: 10px; background: #fff; }
.diagram svg { width: 100%; min-width: 620px; height: auto; }
@media print { body { background: #fff; padding: 0; } .cover, .question { box-shadow: none; page-break-after: always; } }
@media (max-width: 760px) { body { padding: 10px; } .options { grid-template-columns: 1fr; } .question { padding: 16px; } }
</style>
</head>
<body>
<main>
<section class="cover">
<h1>ExamTree Reasoning V1 — DIR-CP-003 Review File</h1>
<p><strong>Coverage:</strong> ${DIR_CP003_QLS.length} need-based QLs × ${REVIEW_SEEDS.length} seeds = ${questions.length} questions.</p>
<p><strong>QLs:</strong> ${DIR_CP003_QLS.map((ql) => ql.qlId).join(", ")}</p>
<p>Each item contains a natural exam question, a short movement walkthrough, one net-movement sentence, one direct conclusion, and a plain route diagram at the end.</p>
</section>
${cards}
</main>
</body>
</html>`;
}

async function main(): Promise<void> {
  const questions = DIR_CP003_QLS.flatMap((ql) => REVIEW_SEEDS.map((seed) => generateDirCp003Question(ql.qlId, seed)));
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(path.join(OUTPUT_DIR, "DIR-CP-003-QUESTION-REVIEW.html"), renderHtml(questions), "utf8");
  await writeFile(
    path.join(OUTPUT_DIR, "DIR-CP-003-QUESTION-REVIEW.jsonl"),
    `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
    "utf8",
  );
  await writeFile(
    path.join(OUTPUT_DIR, "README.txt"),
    [
      "ExamTree DIR-CP-003 review export",
      `Questions: ${questions.length}`,
      `QLs: ${DIR_CP003_QLS.map((ql) => ql.qlId).join(", ")}`,
      `Seeds: ${REVIEW_SEEDS.join(", ")}`,
      "Open DIR-CP-003-QUESTION-REVIEW.html in a browser for the visual review file.",
      "Use the JSONL file for machine/editorial audit workflows.",
    ].join("\n"),
    "utf8",
  );
  console.log("DIR-CP-003 review export generated.", { outputDir: OUTPUT_DIR, questionCount: questions.length });
}

await main();
