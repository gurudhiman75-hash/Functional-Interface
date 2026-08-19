import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import { generateDsfCp001PercentageEnglish } from "./cp001-percentage-editorial-runtime.ts";
import type { DsfCp001PercentageQuestion } from "./cp001-percentage-runtime.ts";

const questions = Array.from({ length: 50 }, (_, seed) => generateDsfCp001PercentageEnglish(seed));

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderQuestion(
  question: DsfCp001PercentageQuestion & { readonly editorialVersion: string },
  ordinal: number,
): string {
  return `
  <article class="question">
    <header><strong>Q${ordinal}</strong><span>${escapeHtml(question.canonicalAnswer)} · ${escapeHtml(question.targetKind)} · ${escapeHtml(question.difficulty)}</span></header>
    <p class="stem">${escapeHtml(question.stem)}</p>
    <p><strong>Statement I:</strong> ${escapeHtml(question.statements[0].text)}</p>
    <p><strong>Statement II:</strong> ${escapeHtml(question.statements[1].text)}</p>
    <ol type="A">${question.options.map((option) => `<li class="${option.isCorrect ? "correct" : ""}">${escapeHtml(option.value)}${option.isCorrect ? " ✓" : ""}</li>`).join("")}</ol>
    <section class="solution">
      <h3>Solution</h3>
      <p>${escapeHtml(question.explanation.askedTarget)}</p>
      <p>${escapeHtml(question.explanation.statementI)}</p>
      <p>${escapeHtml(question.explanation.statementII)}</p>
      ${question.explanation.together ? `<p>${escapeHtml(question.explanation.together)}</p>` : ""}
      <p><strong>Conclusion:</strong> ${escapeHtml(question.explanation.conclusion)}</p>
    </section>
    <details>
      <summary>Internal proof diagnostics</summary>
      <div class="grid">
        <div><strong>I worlds</strong><br>${question.proof.statementIWorldCount}</div>
        <div><strong>II worlds</strong><br>${question.proof.statementIIWorldCount}</div>
        <div><strong>Together worlds</strong><br>${question.proof.togetherWorldCount}</div>
        <div><strong>I targets</strong><br>${escapeHtml(question.proof.statementITargetAnswers.join(", "))}</div>
        <div><strong>II targets</strong><br>${escapeHtml(question.proof.statementIITargetAnswers.join(", "))}</div>
        <div><strong>Together targets</strong><br>${escapeHtml(question.proof.togetherTargetAnswers.join(", "))}</div>
        <div><strong>I examples</strong><br>${escapeHtml(question.proof.statementIExampleWorlds.join("; "))}</div>
        <div><strong>II examples</strong><br>${escapeHtml(question.proof.statementIIExampleWorlds.join("; "))}</div>
        <div><strong>Together examples</strong><br>${escapeHtml(question.proof.togetherExampleWorlds.join("; "))}</div>
      </div>
    </details>
  </article>`;
}

const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
  semanticClass,
  questions.filter((question) => question.canonicalAnswer === semanticClass).length,
]));
const exactCount = questions.filter((question) => question.targetKind === "NET_PERCENT_CHANGE").length;
const directionCount = questions.length - exactCount;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DSF CP-001 Percentage Review</title>
<style>
body{font-family:system-ui,sans-serif;background:#f5f5f5;color:#171717;margin:0}.wrap{max-width:960px;margin:auto;padding:24px 14px 60px}.top,.question{background:white;border:1px solid #ddd;border-radius:12px;padding:18px;margin:14px 0}.question header{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;border-bottom:1px solid #eee;padding-bottom:10px}.stem{font-size:17px;line-height:1.5}.correct{font-weight:700;background:#f2f2f2;border-radius:6px;padding:4px}.solution{border-top:1px solid #eee;margin-top:14px;padding-top:10px;line-height:1.5}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin-top:10px}.grid>div{border:1px solid #ddd;border-radius:7px;padding:8px;font-size:13px}.summary{display:flex;gap:7px;flex-wrap:wrap}.summary span{border:1px solid #ccc;border-radius:999px;padding:4px 8px;font-size:12px}</style>
</head><body><main class="wrap">
<section class="top"><h1>Data Sufficiency · CP-001 Percentage Review</h1><p>English review candidate only. Publication remains locked.</p><div class="summary"><span>Questions: ${questions.length}</span><span>Exact net-change: ${exactCount}</span><span>Final direction: ${directionCount}</span>${SUFFICIENCY_CLASSES.map((semanticClass) => `<span>${escapeHtml(semanticClass)}: ${classCounts[semanticClass]}</span>`).join("")}</div></section>
${questions.map((question, index) => renderQuestion(question, index + 1)).join("\n")}
</main></body></html>`;

const outputDirectory = resolve(process.cwd(), "dist/reasoning-v1/dsf");
mkdirSync(outputDirectory, { recursive: true });
const htmlPath = resolve(outputDirectory, "dsf-cp001-percentage-review.html");
const jsonPath = resolve(outputDirectory, "dsf-cp001-percentage-review.json");
writeFileSync(htmlPath, html, "utf8");
writeFileSync(jsonPath, JSON.stringify({
  packageId: "DSF-001",
  checkpointId: "DSF-CP-001",
  qlId: "DSF-QL-001",
  classCounts,
  exactCount,
  directionCount,
  questions,
}, null, 2), "utf8");

console.log(JSON.stringify({
  status: "PASS_DSF_CP_001_PERCENTAGE_REVIEW_EXPORT",
  htmlPath,
  jsonPath,
  questions: questions.length,
  classCounts,
  exactCount,
  directionCount,
}, null, 2));
