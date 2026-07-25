import fs from "node:fs";
import path from "node:path";
import { getMen001QuestionEntries, getMen001QuestionLanguageIds } from "./library";
import { runMen001Pipeline } from "./pipeline";
import { renderMen001ReviewIllustration } from "./human-review-svg";
import type { Men001ActiveCanonicalProblemId } from "./types";

const outputDir = path.resolve(
  process.cwd(),
  process.env.MEN001_REVIEW_OUTPUT_DIR ?? "artifacts/api-server/dist/quant-v4",
);
fs.mkdirSync(outputDir, { recursive: true });

function csvCell(value: unknown) {
  const text = String(value ?? "").replace(/\r?\n/g, " ");
  return `"${text.replace(/"/g, '""')}"`;
}

function escapeHtml(value: unknown) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const rows: string[][] = [[
  "cpId",
  "qlId",
  "difficulty",
  "solveMode",
  "seed",
  "stem",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctOption",
  "answer",
  "explanation",
  "explanationIllustration",
  "validation",
]];

const markdown: string[] = [
  "# MEN-001 Human Review Export",
  "",
  "Three deterministic samples are exported per active QL to CSV. The Markdown view shows the first sample for each QL.",
  "Open `men-001-human-review.html` for the visual review with rendered diagrams.",
  "",
];

const htmlCards: string[] = [];
let renderedIllustrationCount = 0;

for (const entry of getMen001QuestionEntries()) {
  const qlId = entry.qlId;
  for (let index = 0; index < 3; index += 1) {
    const seed = `men-001-human-review:${qlId}:${index}`;
    const question = runMen001Pipeline(entry.cpId as Men001ActiveCanonicalProblemId, {
      language: "en",
      questionLanguageId: qlId,
      seed,
    });
    const correctOption = question.options[question.correctIndex] ?? "";
    const explanationIllustration = question.explanation.illustration
      ? JSON.stringify(question.explanation.illustration)
      : "NONE";
    rows.push([
      question.canonicalProblemId,
      qlId,
      question.difficultyBand,
      question.solveMode,
      seed,
      question.stem,
      ...question.options,
      correctOption,
      question.answer,
      question.explanation.lines.join(" | "),
      explanationIllustration,
      question.validation.valid ? "PASS" : question.validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join(" | "),
    ]);

    if (index === 0) {
      const illustration = question.explanation.illustration;
      if (illustration) renderedIllustrationCount += 1;
      const visualDiagram = illustration
        ? renderMen001ReviewIllustration(illustration)
        : `<div class="no-diagram">No diagram is needed for this question.</div>`;
      const metadata = illustration
        ? `<details><summary>Diagram contract</summary><dl>
            <dt>Kind</dt><dd>${escapeHtml(illustration.kind)}</dd>
            <dt>Purpose</dt><dd>${escapeHtml(illustration.purpose)}</dd>
            <dt>Placement</dt><dd>${escapeHtml(illustration.placement)}</dd>
            <dt>Labels</dt><dd><code>${escapeHtml(JSON.stringify(illustration.labels))}</code></dd>
            <dt>Accessible text</dt><dd>${escapeHtml(illustration.accessibleText)}</dd>
          </dl></details>`
        : "";

      htmlCards.push(`<article class="question-card" data-cp="${escapeHtml(question.canonicalProblemId)}" data-diagram="${illustration ? "yes" : "no"}">
        <header>
          <div><span class="cp-pill">${escapeHtml(question.canonicalProblemId)}</span> <span class="difficulty">${escapeHtml(question.difficultyBand)}</span></div>
          <h2>${escapeHtml(qlId)} — ${escapeHtml(question.solveMode)}</h2>
        </header>
        <section><h3>Question</h3><p class="stem">${escapeHtml(question.stem)}</p></section>
        <section class="diagram-panel"><h3>Diagram</h3>${visualDiagram}${metadata}</section>
        <section><h3>Options</h3><ol class="options" type="A">${question.options.map((option, optionIndex) => `<li class="${optionIndex === question.correctIndex ? "correct" : ""}">${escapeHtml(option)}</li>`).join("")}</ol></section>
        <section><h3>Answer</h3><p class="answer">${escapeHtml(question.answer)}</p></section>
        <section><h3>Explanation</h3><ol class="explanation">${question.explanation.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol></section>
        <footer class="${question.validation.valid ? "pass" : "fail"}">Validation: ${question.validation.valid ? "PASS" : "FAIL"}</footer>
      </article>`);

      markdown.push(
        `## ${question.canonicalProblemId} / ${qlId} — ${question.solveMode}`,
        "",
        `**Difficulty:** ${question.difficultyBand}`,
        "",
        `**Stem:** ${question.stem}`,
        "",
        "**Question diagram:** None",
        "",
        "**Options:**",
        "",
        ...question.options.map(
          (option, optionIndex) =>
            `${optionIndex === question.correctIndex ? "- ✅" : "-"} ${String.fromCharCode(65 + optionIndex)}. ${option}`,
        ),
        "",
        `**Answer:** ${question.answer}`,
        "",
        "**Explanation:**",
        "",
        ...question.explanation.lines.map((line) => `- ${line}`),
        "",
      );
      if (illustration) {
        markdown.push(
          "**Explanation illustration:** Rendered in `men-001-human-review.html`",
          "",
          `- Kind: ${illustration.kind}`,
          `- Purpose: ${illustration.purpose}`,
          `- Placement: ${illustration.placement}`,
          `- Labels: ${JSON.stringify(illustration.labels)}`,
          `- Accessible text: ${illustration.accessibleText}`,
          "- Rendering: inline SVG, font-neutral and not drawn to scale",
          "",
        );
      } else {
        markdown.push("**Explanation illustration:** Not needed", "");
      }
      markdown.push(
        `**Validation:** ${question.validation.valid ? "PASS" : "FAIL"}`,
        "",
      );
    }
  }
}

const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
fs.writeFileSync(path.join(outputDir, "men-001-human-review.csv"), `${csv}\n`, "utf8");
fs.writeFileSync(path.join(outputDir, "men-001-human-review.md"), `${markdown.join("\n").trimEnd()}\n`, "utf8");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MEN-001 Visual Human Review</title>
<style>
:root { color-scheme: light dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
body { margin: 0; background: #eef2f7; color: #162033; }
main { max-width: 1120px; margin: 0 auto; padding: 28px 18px 64px; }
.page-header { background: #fff; border: 1px solid #dbe3ee; border-radius: 16px; padding: 22px; margin-bottom: 20px; }
.page-header h1 { margin: 0 0 8px; font-size: 28px; }
.page-header p { margin: 6px 0; color: #526176; }
.controls { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
.controls button { border: 1px solid #bdc9d8; background: #f8fafc; color: #1f2a3d; border-radius: 999px; padding: 8px 14px; cursor: pointer; }
.controls button.active { background: #1f4e79; color: #fff; border-color: #1f4e79; }
.question-card { background: #fff; border: 1px solid #dbe3ee; border-radius: 16px; padding: 22px; margin: 18px 0; box-shadow: 0 3px 12px rgba(28,45,70,.06); }
.question-card[hidden] { display: none; }
h2 { font-size: 21px; margin: 10px 0 18px; }
h3 { font-size: 15px; text-transform: uppercase; letter-spacing: .05em; color: #526176; margin: 20px 0 8px; }
.cp-pill, .difficulty { display: inline-block; border-radius: 999px; padding: 5px 10px; font-size: 12px; font-weight: 700; }
.cp-pill { background: #e7f0fa; color: #17466f; }
.difficulty { background: #f2ead8; color: #704e08; }
.stem { font-size: 17px; line-height: 1.55; }
.diagram-panel { border: 1px solid #dbe3ee; border-radius: 13px; padding: 14px; background: #fafcff; }
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
.options, .explanation { padding-left: 28px; line-height: 1.55; }
.options li, .explanation li { padding: 4px 7px; }
.options .correct { background: #e8f7ec; border-radius: 7px; font-weight: 700; }
.answer { font-weight: 800; font-size: 18px; }
details { margin-top: 12px; color: #526176; }
details dl { display: grid; grid-template-columns: 110px 1fr; gap: 6px 12px; }
details dt { font-weight: 700; }
footer { margin-top: 20px; font-weight: 800; }
footer.pass { color: #146b2e; } footer.fail { color: #a72828; }
@media (prefers-color-scheme: dark) {
  body { background: #101827; color: #edf3fb; }
  .page-header, .question-card { background: #172234; border-color: #334155; }
  .page-header p, h3, details, .no-diagram { color: #b6c2d2; }
  .diagram-panel { background: #111c2d; border-color: #334155; }
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
<h1>MEN-001 Visual Human Review</h1>
<p>${getMen001QuestionLanguageIds().length} first-sample questions. ${renderedIllustrationCount} explanation illustrations are rendered as inline SVGs.</p>
<p>Diagrams are explanatory and not drawn to scale. CP-006 remains text-only because its current conversion, scaling and reshaping states do not require a figure.</p>
<div class="controls">
<button class="active" data-filter="all">All questions</button>
<button data-filter="diagram">Only diagrams</button>
<button data-filter="MEN-CP-001">CP-001</button>
<button data-filter="MEN-CP-002">CP-002</button>
<button data-filter="MEN-CP-003">CP-003</button>
<button data-filter="MEN-CP-004">CP-004</button>
<button data-filter="MEN-CP-005">CP-005</button>
<button data-filter="MEN-CP-006">CP-006</button>
</div>
</header>
${htmlCards.join("\n")}
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
fs.writeFileSync(path.join(outputDir, "men-001-human-review.html"), html, "utf8");

console.log(`MEN-001 human review export created: ${rows.length - 1} CSV samples, ${getMen001QuestionLanguageIds().length} Markdown/HTML samples and ${renderedIllustrationCount} rendered SVG illustrations.`);
