import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { DIR_001_ENGLISH_FREEZE } from "./DIR-001-ENGLISH-FREEZE";
import { DIR_001_QLS, generateDirectionQuestion } from "./chapter-registry";

interface ReviewOption {
  readonly label: string;
}

interface ReviewQuestion {
  readonly qlId: string;
  readonly checkpointId: string;
  readonly ruleId: string;
  readonly seed: number;
  readonly difficulty: string;
  readonly stem: string;
  readonly options: readonly ReviewOption[];
  readonly correctIndex: number;
  readonly explanation: unknown;
  readonly metadata: Readonly<Record<string, unknown>>;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectNarrativeStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") {
    output.push(value);
    return output;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectNarrativeStrings(item, output);
    return output;
  }
  if (!isRecord(value)) return output;
  for (const [key, nested] of Object.entries(value)) {
    if (key !== "svg") collectNarrativeStrings(nested, output);
  }
  return output;
}

function collectSvgs(value: unknown, output: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) collectSvgs(item, output);
    return output;
  }
  if (!isRecord(value)) return output;
  for (const [key, nested] of Object.entries(value)) {
    if (key === "svg" && typeof nested === "string") output.push(nested);
    else collectSvgs(nested, output);
  }
  return output;
}

const escapeHtml = (value: string): string => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function card(question: ReviewQuestion, ordinal: number): string {
  const correctLetter = String.fromCharCode(65 + question.correctIndex);
  const options = question.options.map((option, index) => (
    `<li class="${index === question.correctIndex ? "correct" : ""}"><strong>${String.fromCharCode(65 + index)}.</strong> ${escapeHtml(option.label)}</li>`
  )).join("");
  const explanation = collectNarrativeStrings(question.explanation)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
  const diagrams = [...new Set(collectSvgs(question))]
    .map((svg, index) => `<section class="diagram"><h4>Diagram ${index + 1}</h4>${svg}</section>`)
    .join("");
  const answerDemand = typeof question.metadata.answerDemand === "string" ? question.metadata.answerDemand : "UNKNOWN";

  return `<article class="question">
<header><h2>${ordinal}. ${question.qlId} · Seed ${question.seed}</h2><div class="badges"><span>${question.checkpointId}</span><span>${escapeHtml(question.difficulty)}</span><span>${escapeHtml(answerDemand)}</span></div></header>
<h3>Question</h3><p class="stem">${escapeHtml(question.stem)}</p>
<ol class="options">${options}</ol>
<div class="answer"><strong>Correct answer:</strong> ${correctLetter}. ${escapeHtml(question.options[question.correctIndex].label)}</div>
<h3>Explanation</h3><section class="explanation">${explanation}</section>
${diagrams}
</article>`;
}

function buildHtml(questions: readonly ReviewQuestion[]): string {
  const checkpointSummary = Object.entries(
    questions.reduce<Record<string, number>>((summary, question) => {
      summary[question.checkpointId] = (summary[question.checkpointId] ?? 0) + 1;
      return summary;
    }, {}),
  ).map(([checkpointId, count]) => `${checkpointId}: ${count}`).join(" · ");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>DIR-001 English Freeze Review</title><style>
:root{font-family:Inter,system-ui,sans-serif;color:#172033;background:#eef2f7}*{box-sizing:border-box}body{margin:0;padding:24px}main{max-width:1120px;margin:auto}.cover,.question{background:#fff;border:1px solid #cbd5e1;border-radius:16px;padding:26px;margin-bottom:26px;box-shadow:0 8px 24px #0f172a0f}header{border-bottom:2px solid #e2e8f0}.badges{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}.badges span{background:#eff6ff;border:1px solid #93c5fd;border-radius:999px;padding:4px 9px;font-size:12px;font-weight:700}.stem{line-height:1.75;background:#f8fafc;border-left:5px solid #2563eb;border-radius:8px;padding:18px}.options{list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px}.options li{border:1px solid #cbd5e1;border-radius:9px;padding:12px}.options .correct,.answer{background:#ecfdf5;border-color:#10b981}.answer,.explanation{border:1px solid #cbd5e1;border-radius:9px;padding:14px;margin:14px 0;line-height:1.65}.explanation p{margin:.45rem 0}.diagram{overflow:auto;border:1px solid #cbd5e1;border-radius:12px;padding:12px;margin-top:16px}.diagram svg{width:100%;min-width:700px;height:auto}@media(max-width:760px){body{padding:10px}.options{grid-template-columns:1fr}}
</style></head><body><main><section class="cover"><h1>ExamTree Reasoning V1 — DIR-001 English Freeze Review</h1><p><strong>Status:</strong> ${DIR_001_ENGLISH_FREEZE.freezeStatus}; Hindi and Punjabi localization remain pending.</p><p><strong>Coverage:</strong> ${questions.length} questions, two deterministic samples from each of ${DIR_001_QLS.length} reviewed QLs.</p><p><strong>QL range:</strong> ${DIR_001_ENGLISH_FREEZE.firstQlId} through ${DIR_001_ENGLISH_FREEZE.lastQlId}.</p><p><strong>Checkpoint samples:</strong> ${checkpointSummary}.</p><p>The early fixed 240-QL production allocation is superseded. This artifact reflects the final need-based 44-QL English baseline.</p></section>${questions.map(card).join("")}</main></body></html>`;
}

async function main(): Promise<void> {
  const seeds = [0, 17] as const;
  const questions = DIR_001_QLS.flatMap((ql) => seeds.map((seed) => (
    generateDirectionQuestion(ql.qlId, seed) as unknown as ReviewQuestion
  )));
  const outputDirectory = path.resolve(process.cwd(), "dist/reasoning-v1/dir-001-english-freeze-review");
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, "DIR-001-ENGLISH-FREEZE-REVIEW.html"), buildHtml(questions));
  await writeFile(path.join(outputDirectory, "DIR-001-ENGLISH-FREEZE-REVIEW.jsonl"), `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`);
  await writeFile(path.join(outputDirectory, "README.txt"), [
    "ExamTree DIR-001 English freeze review",
    `Freeze status: ${DIR_001_ENGLISH_FREEZE.freezeStatus}`,
    `Questions: ${questions.length}`,
    `QLs: ${DIR_001_QLS.length}`,
    `Seeds: ${seeds.join(", ")}`,
    "Hindi and Punjabi localization remain pending.",
    "",
  ].join("\n"));
}

void main();
