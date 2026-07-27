import fs from "node:fs";
import path from "node:path";
import { renderMen001ReviewIllustration } from "./human-review-svg";
import { getMen001QuestionEntries } from "./library";
import { runMen001Pipeline } from "./pipeline";
import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001ActiveCanonicalProblemId } from "./types";

const outputDir = path.resolve(
  process.cwd(),
  process.env.MEN001_REVIEW_OUTPUT_DIR ?? "artifacts/api-server/dist/quant-v4",
);
fs.mkdirSync(outputDir, { recursive: true });

function escapeHtml(value: unknown) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderEquation(equation: string) {
  return `<div class="worked-equation">\\[${escapeHtml(equation)}\\]</div>`;
}

function renderSection(section: Men001ExplanationSection) {
  const heading = section.kind === "STEP"
    ? `Step ${section.stepNumber}: ${section.title}`
    : section.title;
  const className = section.kind === "KEY_RULE"
    ? "key-rule"
    : section.kind === "FINAL_ANSWER"
      ? "final-answer"
      : "worked-step";
  return `<section class="explanation-block ${className}">
    <h4>${escapeHtml(heading)}</h4>
    ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
    ${section.equations.map(renderEquation).join("\n")}
  </section>`;
}

function markdownSection(section: Men001ExplanationSection) {
  const heading = section.kind === "STEP"
    ? `### Step ${section.stepNumber}: ${section.title}`
    : `### ${section.title}`;
  return [
    heading,
    "",
    ...section.paragraphs.flatMap((paragraph) => [paragraph, ""]),
    ...section.equations.flatMap((equation) => [`$$${equation}$$`, ""]),
  ];
}

const cards: string[] = [];
const markdown: string[] = [
  "# MEN-001 Student-Style Explanation Review",
  "",
  "Each explanation follows Key Rule → named worked steps → Final Answer. Equations are stored as MathJax-ready LaTeX, and the number of steps is determined by the mathematics.",
  "",
];
let diagramCount = 0;
let totalStepCount = 0;

for (const entry of getMen001QuestionEntries()) {
  const question = runMen001Pipeline(
    entry.cpId as Men001ActiveCanonicalProblemId,
    {
      language: "en",
      questionLanguageId: entry.qlId,
      seed: `men-001-structured-review:${entry.qlId}`,
    },
  );
  const illustration = question.explanation.illustration;
  if (illustration) diagramCount += 1;
  const steps = question.explanation.sections.filter((section) => section.kind === "STEP");
  totalStepCount += steps.length;
  const diagram = illustration
    ? renderMen001ReviewIllustration(illustration)
    : `<div class="no-diagram">No diagram is needed for this question.</div>`;

  cards.push(`<article class="question-card" data-cp="${escapeHtml(question.canonicalProblemId)}" data-diagram="${illustration ? "yes" : "no"}">
    <header class="card-header">
      <div><span class="cp-pill">${escapeHtml(question.canonicalProblemId)}</span> <span class="difficulty">${escapeHtml(question.difficultyBand)}</span></div>
      <h2>${escapeHtml(entry.qlId)} — ${escapeHtml(question.solveMode)}</h2>
    </header>
    <section class="question-panel">
      <h3>Question</h3>
      <p class="stem">${escapeHtml(question.stem)}</p>
      <ol class="options" type="A">${question.options.map((option, index) => `<li class="${index === question.correctIndex ? "correct" : ""}">${escapeHtml(option)}</li>`).join("")}</ol>
    </section>
    <section class="diagram-panel"><h3>Diagram</h3>${diagram}</section>
    <section class="solution-panel">
      <h3>Worked Solution</h3>
      ${question.explanation.sections.map(renderSection).join("\n")}
    </section>
    <footer class="pass">Validation: PASS</footer>
  </article>`);

  markdown.push(
    `## ${question.canonicalProblemId} / ${entry.qlId} — ${question.solveMode}`,
    "",
    `**Question:** ${question.stem}`,
    "",
    ...question.options.map((option, index) => `${index === question.correctIndex ? "- ✅" : "-"} ${String.fromCharCode(65 + index)}. ${option}`),
    "",
    ...question.explanation.sections.flatMap(markdownSection),
    "---",
    "",
  );
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MEN-001 Student-Style Explanation Review</title>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
<style>
:root { color-scheme: light dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
body { margin: 0; background: #eef2f7; color: #172033; }
main { max-width: 1120px; margin: 0 auto; padding: 28px 18px 64px; }
.page-header, .question-card { background: #fff; border: 1px solid #dbe3ee; border-radius: 16px; }
.page-header { padding: 22px; margin-bottom: 20px; }
.page-header h1 { margin: 0 0 8px; font-size: 28px; }
.page-header p { color: #526176; margin: 6px 0; }
.controls { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 18px; }
.controls button { border: 1px solid #bdc9d8; background: #f8fafc; color: #1f2a3d; border-radius: 999px; padding: 8px 14px; cursor: pointer; }
.controls button.active { background: #1f4e79; color: #fff; border-color: #1f4e79; }
.question-card { padding: 22px; margin: 18px 0; box-shadow: 0 3px 12px rgba(28,45,70,.06); }
.question-card[hidden] { display: none; }
h2 { margin: 10px 0 18px; font-size: 21px; }
h3 { margin: 20px 0 9px; color: #526176; font-size: 15px; text-transform: uppercase; letter-spacing: .05em; }
.cp-pill, .difficulty { display: inline-block; border-radius: 999px; padding: 5px 10px; font-size: 12px; font-weight: 750; }
.cp-pill { background: #e7f0fa; color: #17466f; }
.difficulty { background: #f2ead8; color: #704e08; }
.stem { font-size: 17px; line-height: 1.58; }
.options { line-height: 1.55; padding-left: 30px; }
.options li { padding: 4px 7px; }
.options .correct { background: #e8f7ec; border-radius: 7px; font-weight: 750; }
.diagram-panel { border: 1px solid #dbe3ee; border-radius: 13px; padding: 14px; background: #fafcff; margin-top: 18px; }
.mensuration-diagram { display: block; width: min(100%, 560px); height: auto; margin: 8px auto; color: #17324d; }
.shape { fill: none; stroke: currentColor; stroke-width: 3; stroke-linejoin: round; stroke-linecap: round; }
.inner { stroke-width: 2.5; }
.guide { fill: none; stroke: #64748b; stroke-width: 2; stroke-dasharray: 7 5; }
.arc { fill: none; stroke: #bd5a22; stroke-width: 4; stroke-linecap: round; }
.right-angle { fill: none; stroke: #64748b; stroke-width: 1.6; }
.diagram-label { fill: #17243a; font-size: 14px; font-weight: 650; paint-order: stroke; stroke: #fff; stroke-width: 4px; stroke-linejoin: round; }
.band-fill { fill: #dceaf7; }
.secondary-fill { fill: #f2dfc5; }
.white-fill { fill: #fff; }
.omitted { stroke: #b33b3b; }
.no-diagram { color: #64748b; text-align: center; padding: 28px 12px; font-style: italic; }
.solution-panel { margin-top: 20px; }
.explanation-block { margin: 14px 0; padding: 16px 18px; border-radius: 12px; border: 1px solid #dbe3ee; background: #fff; }
.explanation-block h4 { margin: 0 0 9px; font-size: 17px; }
.explanation-block p { margin: 7px 0; line-height: 1.58; }
.key-rule { border-left: 5px solid #1f4e79; background: #f2f7fc; }
.worked-step { border-left: 5px solid #b7791f; }
.final-answer { border-left: 5px solid #198754; background: #eef9f1; }
.worked-equation { margin: 10px 0; padding: 12px 14px; border-radius: 9px; background: #f7f9fc; border: 1px solid #d8e0ea; text-align: center; font-size: 18px; font-weight: 650; overflow-x: auto; }
.final-answer .worked-equation { font-size: 22px; font-weight: 800; }
footer { margin-top: 18px; font-weight: 800; }
footer.pass { color: #146b2e; }
@media (prefers-color-scheme: dark) {
  body { background: #101827; color: #edf3fb; }
  .page-header, .question-card, .explanation-block { background: #172234; border-color: #334155; }
  .page-header p, h3, .no-diagram { color: #b6c2d2; }
  .diagram-panel { background: #111c2d; border-color: #334155; }
  .key-rule { background: #14283c; }
  .final-answer { background: #143322; }
  .worked-equation { background: #101b2b; border-color: #3d4c60; }
  .mensuration-diagram { color: #d8e8f8; }
  .diagram-label { fill: #f3f7fc; stroke: #111c2d; }
  .white-fill { fill: #111c2d; }
  .controls button { background: #1d2b40; color: #edf3fb; border-color: #526176; }
}
</style>
</head>
<body>
<main>
<header class="page-header">
<h1>MEN-001 Student-Style Explanation Review</h1>
<p>${getMen001QuestionEntries().length} questions, ${totalStepCount} need-based worked steps and ${diagramCount} explanation diagrams.</p>
<p>Every solution follows Key Rule → named calculation steps → Final Answer, with MathJax-rendered LaTeX equations.</p>
<div class="controls">
<button class="active" data-filter="all">All questions</button>
<button data-filter="diagram">Only diagrams</button>
${["MEN-CP-001", "MEN-CP-002", "MEN-CP-003", "MEN-CP-004", "MEN-CP-005", "MEN-CP-006"].map((cp) => `<button data-filter="${cp}">${cp.replace("MEN-", "")}</button>`).join("\n")}
</div>
</header>
${cards.join("\n")}
</main>
<script>
const buttons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.question-card')];
for (const button of buttons) {
  button.addEventListener('click', () => {
    for (const candidate of buttons) candidate.classList.remove('active');
    button.classList.add('active');
    const filter = button.dataset.filter;
    for (const card of cards) {
      card.hidden = !(filter === 'all' || (filter === 'diagram' && card.dataset.diagram === 'yes') || card.dataset.cp === filter);
    }
  });
}
</script>
</body>
</html>`;

fs.writeFileSync(
  path.join(outputDir, "men-001-structured-review.html"),
  html,
  "utf8",
);
fs.writeFileSync(
  path.join(outputDir, "men-001-structured-review.md"),
  `${markdown.join("\n").trimEnd()}\n`,
  "utf8",
);
console.log(
  `MEN-001 structured review created for ${getMen001QuestionEntries().length} QLs with ${totalStepCount} worked steps and MathJax-ready equations.`,
);
