import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  generateDsfCp001NumberSystemQuestion,
  type DsfCp001NumberSystemQuestion,
} from "./cp001-number-system-runtime.ts";

const REVIEW_SEEDS = Array.from({ length: 60 }, (_, index) => index);
const questions = REVIEW_SEEDS.map(generateDsfCp001NumberSystemQuestion);

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function classBadge(semanticClass: string): string {
  return `<span class="badge">${escapeHtml(semanticClass.replaceAll("_", " "))}</span>`;
}

function renderOption(question: DsfCp001NumberSystemQuestion, index: number): string {
  const option = question.options[index]!;
  return `<li class="${option.isCorrect ? "correct" : ""}"><strong>${option.key}.</strong> ${escapeHtml(option.value)}${option.isCorrect ? " <span class=\"tick\">✓</span>" : ""}</li>`;
}

function renderQuestion(question: DsfCp001NumberSystemQuestion, ordinal: number): string {
  const proof = question.proof;
  return `
    <article class="question">
      <header>
        <div><strong>Q${ordinal}</strong> · Seed ${question.seed} · ${escapeHtml(question.difficulty)} · ${escapeHtml(question.solveModeId)}</div>
        ${classBadge(question.canonicalAnswer)}
      </header>
      <p class="stem">${escapeHtml(question.stem)}</p>
      <div class="statement"><strong>Statement I:</strong> ${escapeHtml(question.statements[0].text)}</div>
      <div class="statement"><strong>Statement II:</strong> ${escapeHtml(question.statements[1].text)}</div>
      <ol class="options" type="A">${question.options.map((_option, index) => renderOption(question, index)).join("")}</ol>
      <section class="solution">
        <h3>Solution</h3>
        <p><strong>Asked:</strong> ${escapeHtml(question.explanation.askedTarget)}</p>
        <p>${escapeHtml(question.explanation.statementI)}</p>
        <p>${escapeHtml(question.explanation.statementII)}</p>
        ${question.explanation.together ? `<p>${escapeHtml(question.explanation.together)}</p>` : ""}
        <p class="conclusion"><strong>Conclusion:</strong> ${escapeHtml(question.explanation.conclusion)}</p>
      </section>
      <details>
        <summary>Internal proof diagnostics</summary>
        <div class="proof-grid">
          <div><strong>Base X</strong><br>${escapeHtml(proof.baseDigits.join(", "))}</div>
          <div><strong>I → X</strong><br>${escapeHtml(proof.statementIDigits.join(", "))}</div>
          <div><strong>II → X</strong><br>${escapeHtml(proof.statementIIDigits.join(", "))}</div>
          <div><strong>I + II → X</strong><br>${escapeHtml(proof.togetherDigits.join(", "))}</div>
          <div><strong>I target answers</strong><br>${escapeHtml(proof.statementITargetAnswers.join(", "))}</div>
          <div><strong>II target answers</strong><br>${escapeHtml(proof.statementIITargetAnswers.join(", "))}</div>
          <div><strong>Together target answers</strong><br>${escapeHtml(proof.togetherTargetAnswers.join(", "))}</div>
          <div><strong>Minimal sufficient sets</strong><br>${escapeHtml(JSON.stringify(proof.minimalSufficientSets))}</div>
        </div>
      </details>
    </article>`;
}

const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
  semanticClass,
  questions.filter((question) => question.canonicalAnswer === semanticClass).length,
]));

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DSF CP-001 Number System Review Pack</title>
<style>
  :root { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #161616; background: #f5f5f5; }
  body { margin: 0; }
  main { max-width: 980px; margin: 0 auto; padding: 28px 18px 80px; }
  .top { background: white; border: 1px solid #ddd; border-radius: 14px; padding: 22px; margin-bottom: 20px; }
  h1 { margin: 0 0 8px; font-size: 28px; }
  .summary { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .summary span, .badge { display: inline-block; border: 1px solid #ccc; border-radius: 999px; padding: 5px 9px; font-size: 12px; background: #fafafa; }
  .question { background: white; border: 1px solid #d9d9d9; border-radius: 14px; padding: 22px; margin: 18px 0; }
  .question header { display: flex; gap: 12px; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; border-bottom: 1px solid #eee; padding-bottom: 12px; margin-bottom: 16px; font-size: 13px; }
  .stem { font-size: 17px; line-height: 1.55; }
  .statement { padding: 10px 12px; margin: 8px 0; border-left: 3px solid #777; background: #fafafa; line-height: 1.45; }
  .options { padding-left: 28px; line-height: 1.55; }
  .options li { padding: 5px 7px; margin: 4px 0; }
  .options li.correct { font-weight: 600; background: #f0f0f0; border-radius: 8px; }
  .tick { font-weight: 800; }
  .solution { margin-top: 18px; border-top: 1px solid #eee; padding-top: 14px; line-height: 1.55; }
  .solution h3 { margin: 0 0 8px; }
  .conclusion { padding: 9px 11px; background: #f6f6f6; border-radius: 8px; }
  details { margin-top: 14px; border-top: 1px dashed #ccc; padding-top: 12px; }
  summary { cursor: pointer; font-weight: 600; }
  .proof-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 10px; margin-top: 12px; }
  .proof-grid > div { border: 1px solid #ddd; border-radius: 8px; padding: 10px; font-size: 13px; line-height: 1.4; }
  .note { color: #555; line-height: 1.5; }
  @media (max-width: 600px) { main { padding: 16px 10px 50px; } .question, .top { padding: 15px; border-radius: 10px; } }
</style>
</head>
<body>
<main>
  <section class="top">
    <h1>Data Sufficiency · CP-001 Number System Review</h1>
    <p class="note">English review candidate. This pack is for editorial/semantic inspection only; Question Studio, question-bank and mock-test publication remain locked.</p>
    <div class="summary">
      <span>Questions: ${questions.length}</span>
      <span>QL: DSF-QL-001</span>
      <span>Missing digit: ${questions.filter((q) => q.targetKind === "MISSING_DIGIT").length}</span>
      <span>Digit parity: ${questions.filter((q) => q.targetKind === "DIGIT_PARITY").length}</span>
      ${SUFFICIENCY_CLASSES.map((semanticClass) => `<span>${escapeHtml(semanticClass)}: ${classCounts[semanticClass]}</span>`).join("")}
    </div>
  </section>
  ${questions.map((question, index) => renderQuestion(question, index + 1)).join("\n")}
</main>
</body>
</html>`;

const outputDirectory = resolve(process.cwd(), "dist/reasoning-v1/dsf");
mkdirSync(outputDirectory, { recursive: true });
const htmlPath = resolve(outputDirectory, "dsf-cp001-number-system-review.html");
const jsonPath = resolve(outputDirectory, "dsf-cp001-number-system-review.json");
writeFileSync(htmlPath, html, "utf8");
writeFileSync(jsonPath, JSON.stringify({
  generatedAtRuntime: true,
  packageId: "DSF-001",
  checkpointId: "DSF-CP-001",
  qlId: "DSF-QL-001",
  classCounts,
  questions,
}, null, 2), "utf8");

console.log(JSON.stringify({
  status: "PASS_DSF_CP_001_REVIEW_EXPORT",
  htmlPath,
  jsonPath,
  questions: questions.length,
  classCounts,
}, null, 2));
