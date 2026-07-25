import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateDirCp002Question, type CombinedPathAnswer, type GeneratedPathQuestion } from "./generator";
import { DIR_CP002_QLS } from "./task-registry";

const REVIEW_SEEDS = [0, 1, 2, 3, 4] as const;
const OUTPUT_DIR = path.resolve(process.cwd(), "dist/reasoning-v1/dir-cp-002-review-export");

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function answerLabel(question: GeneratedPathQuestion): string {
  const answer = question.correctAnswer;
  if (typeof answer === "string") return answer;
  const pair = answer as CombinedPathAnswer;
  return `${pair.endpointDirection}; facing ${pair.finalFacing}`;
}

function renderOptions(question: GeneratedPathQuestion): string {
  return question.options.map((option, index) => {
    const letter = String.fromCharCode(65 + index);
    const correct = index === question.correctIndex;
    const error = option.errorLabel ? `<span class="error-label">${escapeHtml(option.errorLabel)}</span>` : "";
    return `<li class="${correct ? "correct" : ""}"><strong>${letter}.</strong> ${escapeHtml(option.label)} ${error}</li>`;
  }).join("");
}

function renderSteps(question: GeneratedPathQuestion): string {
  return question.explanation.steps.map((step) => [
    `<section class="step">`,
    `<h4>Step ${step.stepNumber}: ${escapeHtml(step.title)}</h4>`,
    `<p>${escapeHtml(step.statement)}</p>`,
    `<div class="calculation">${escapeHtml(step.calculation)}</div>`,
    `<p class="result"><strong>Result:</strong> ${escapeHtml(step.result)}</p>`,
    `</section>`,
  ].join("")).join("");
}

function renderQuestion(question: GeneratedPathQuestion, reviewNumber: number): string {
  const correctLetter = String.fromCharCode(65 + question.correctIndex);
  return [
    `<article class="question" id="${escapeHtml(question.qlId)}-seed-${question.seed}">`,
    `<header class="question-header">`,
    `<h2>Review ${reviewNumber}: ${escapeHtml(question.qlId)} · Seed ${question.seed}</h2>`,
    `<div class="badges"><span>${escapeHtml(question.difficulty)}</span><span>${escapeHtml(question.ruleId)}</span><span>${escapeHtml(question.metadata.answerDemand)}</span></div>`,
    `</header>`,
    `<h3>Question statement</h3>`,
    `<pre class="stem">${escapeHtml(question.stem)}</pre>`,
    `<ol class="options">${renderOptions(question)}</ol>`,
    `<div class="answer"><strong>Correct answer:</strong> ${correctLetter}. ${escapeHtml(question.options[question.correctIndex].label)} <span class="machine-answer">(${escapeHtml(answerLabel(question))})</span></div>`,
    `<h3>Detailed explanation</h3>`,
    `<p><strong>Concept:</strong> ${escapeHtml(question.explanation.concept)}</p>`,
    `<p><strong>Coordinate convention:</strong> ${escapeHtml(question.explanation.coordinateConvention)}</p>`,
    renderSteps(question),
    `<p class="asked"><strong>What was asked:</strong> ${escapeHtml(question.explanation.askedRelation)}</p>`,
    `<p class="conclusion"><strong>Conclusion:</strong> ${escapeHtml(question.explanation.conclusion)}</p>`,
    `<p class="trap"><strong>Closest trap:</strong> ${escapeHtml(question.explanation.closestTrapRejection)}</p>`,
    `<h3>Movement diagram</h3>`,
    `<div class="diagram">${question.explanation.diagram.svg}</div>`,
    `</article>`,
  ].join("");
}

function renderHtml(questions: readonly GeneratedPathQuestion[]): string {
  const cards = questions.map((question, index) => renderQuestion(question, index + 1)).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>ExamTree DIR-CP-002 Question Review</title>
<style>
:root { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111827; background: #eef2f7; }
* { box-sizing: border-box; }
body { margin: 0; padding: 24px; }
main { max-width: 1120px; margin: 0 auto; }
.cover, .question { background: #fff; border: 1px solid #d1d5db; border-radius: 16px; box-shadow: 0 8px 24px rgba(15,23,42,.06); }
.cover { padding: 28px; margin-bottom: 24px; }
.cover h1 { margin: 0 0 8px; }
.cover p { margin: 6px 0; color: #374151; }
.question { padding: 26px; margin: 0 0 28px; break-inside: avoid; }
.question-header { border-bottom: 2px solid #e5e7eb; padding-bottom: 14px; margin-bottom: 18px; }
.question-header h2 { margin: 0 0 10px; }
.badges { display: flex; flex-wrap: wrap; gap: 8px; }
.badges span { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 999px; padding: 4px 9px; font-size: 12px; font-weight: 700; color: #3730a3; }
.stem { white-space: pre-wrap; font: inherit; line-height: 1.65; background: #f8fafc; border-left: 5px solid #2563eb; border-radius: 8px; padding: 18px; }
.options { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.options li { border: 1px solid #d1d5db; border-radius: 9px; padding: 11px 13px; }
.options li.correct { background: #ecfdf5; border-color: #10b981; }
.error-label { display: inline-block; margin-left: 8px; color: #991b1b; font-size: 11px; font-weight: 700; }
.answer { background: #ecfdf5; border: 1px solid #10b981; border-radius: 9px; padding: 13px; margin: 16px 0 22px; }
.machine-answer { color: #4b5563; font-size: 12px; }
.step { border: 1px solid #dbe3ee; border-radius: 10px; padding: 14px 16px; margin: 12px 0; }
.step h4 { margin: 0 0 8px; color: #1d4ed8; }
.step p { margin: 7px 0; line-height: 1.55; }
.calculation { background: #111827; color: #f9fafb; border-radius: 8px; padding: 11px 13px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; }
.result { color: #065f46; }
.asked, .conclusion, .trap { border-radius: 9px; padding: 12px 14px; }
.asked { background: #fff7ed; border: 1px solid #fb923c; }
.conclusion { background: #eff6ff; border: 1px solid #60a5fa; }
.trap { background: #fef2f2; border: 1px solid #f87171; }
.diagram { overflow-x: auto; border: 1px solid #d1d5db; border-radius: 12px; padding: 10px; background: #fff; }
.diagram svg { width: 100%; min-width: 640px; height: auto; }
@media print { body { background: #fff; padding: 0; } .cover, .question { box-shadow: none; page-break-after: always; } }
@media (max-width: 760px) { body { padding: 10px; } .options { grid-template-columns: 1fr; } .question { padding: 16px; } }
</style>
</head>
<body>
<main>
<section class="cover">
<h1>ExamTree Reasoning V1 — DIR-CP-002 Review File</h1>
<p><strong>Coverage:</strong> ${DIR_CP002_QLS.length} implemented QLs × ${REVIEW_SEEDS.length} seeds = ${questions.length} questions.</p>
<p><strong>QLs:</strong> ${DIR_CP002_QLS.map((ql) => ql.qlId).join(", ")}</p>
<p>Each review item includes the exact generated stem, options, correct answer, detailed point-wise coordinate explanation, misconception labels, and the final movement/asked-relation SVG.</p>
</section>
${cards}
</main>
</body>
</html>`;
}

async function main(): Promise<void> {
  const questions = DIR_CP002_QLS.flatMap((ql) => REVIEW_SEEDS.map((seed) => generateDirCp002Question(ql.qlId, seed)));
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(path.join(OUTPUT_DIR, "DIR-CP-002-QUESTION-REVIEW.html"), renderHtml(questions), "utf8");
  await writeFile(
    path.join(OUTPUT_DIR, "DIR-CP-002-QUESTION-REVIEW.jsonl"),
    `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
    "utf8",
  );
  await writeFile(
    path.join(OUTPUT_DIR, "README.txt"),
    [
      "ExamTree DIR-CP-002 review export",
      `Questions: ${questions.length}`,
      `QLs: ${DIR_CP002_QLS.map((ql) => ql.qlId).join(", ")}`,
      `Seeds: ${REVIEW_SEEDS.join(", ")}`,
      "Open DIR-CP-002-QUESTION-REVIEW.html in a browser for the visual review file.",
      "Use the JSONL file for machine/editorial audit workflows.",
    ].join("\n"),
    "utf8",
  );
  console.log("DIR-CP-002 review export generated.", { outputDir: OUTPUT_DIR, questionCount: questions.length });
}

await main();
