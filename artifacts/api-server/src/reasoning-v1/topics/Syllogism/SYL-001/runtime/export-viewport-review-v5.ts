import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import { SYL_QL_REGISTRY } from "./ql-registry";
import {
  SYL_V5_VIEWPORT_CSS,
  SYL_V5_VIEWPORT_WIDTHS,
} from "./learner-v5-viewport-contract";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [0, 1, 2, 3, 4, 5] as const;
const outputDir = process.env.SYL_VIEWPORT_V5_DIR
  ? resolve(process.env.SYL_VIEWPORT_V5_DIR)
  : resolve(process.cwd(), "artifacts/api-server/dist/reasoning-v1/syl-001-viewport-v5");

mkdirSync(outputDir, { recursive: true });

const questions = SYL_QL_REGISTRY.flatMap((definition) =>
  seeds.flatMap((seed) => locales.map((locale) => generateSylQuestionV5(definition.qlId, seed, locale))));

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function omissionLabel(reason: string | null): string {
  if (reason === "MORE_THAN_THREE_TERMS") return "Diagram intentionally omitted: more than three sets.";
  if (reason === "NO_STABLE_SIMPLE_VENN") return "Diagram intentionally omitted: no clear simple Venn template.";
  return "Diagram intentionally omitted.";
}

function questionCard(question: ReturnType<typeof generateSylQuestionV5>): string {
  const answer = question.options[question.correctIndex]?.text ?? "";
  const options = question.options.map((option, index) => `
    <li class="option">
      <span class="option-key">${optionLetter(index)}.</span>
      <span>${escapeHtml(option.text)}</span>
    </li>`).join("");
  const reasons = question.learnerPresentationV5.learnerExplanation.shortReasoning
    .map((reason) => `<li class="reason">${escapeHtml(reason)}</li>`)
    .join("");
  const diagramState = question.learnerPresentationV5.diagram;
  const diagram = diagramState.enabled && diagramState.svg
    ? `<div class="diagram" role="img" aria-label="${escapeHtml(diagramState.accessibleDescription ?? "Syllogism diagram")}">
        ${diagramState.svg}
        ${diagramState.caption
          ? `<p class="diagram-caption">${escapeHtml(diagramState.caption)}</p>`
          : ""}
      </div>`
    : `<p class="diagram-omitted" data-omission-reason="${escapeHtml(diagramState.omissionReason ?? "UNKNOWN")}">${escapeHtml(omissionLabel(diagramState.omissionReason))}</p>`;

  return `<article class="question-card" data-locale="${question.locale}" data-ql="${question.qlId}" data-diagram="${diagramState.enabled ? "ENABLED" : "OMITTED"}">
    <div class="meta">
      <span class="badge">${question.qlId}</span>
      <span class="badge">seed ${question.seed}</span>
      <span class="badge">${question.locale}</span>
      <span class="badge">${question.difficulty}</span>
      <span class="badge">${escapeHtml(question.metadata.taskKind)}</span>
      <span class="badge">diagram ${diagramState.enabled ? "enabled" : "omitted"}</span>
    </div>
    <p class="direction" dir="auto">${escapeHtml(question.learnerPresentationV5.preTestDirection)}</p>
    <div class="stem" dir="auto">${escapeHtml(question.stem)}</div>
    <ol class="options">${options}</ol>
    <div class="answer" dir="auto">Answer: ${escapeHtml(answer)}</div>
    <details open>
      <summary>Explanation</summary>
      <ul class="reason-list" dir="auto">${reasons}</ul>
      <p class="reason" dir="auto">${escapeHtml(question.learnerPresentationV5.learnerExplanation.conclusion)}</p>
    </details>
    ${diagram}
  </article>`;
}

const cards = questions.map(questionCard).join("\n");
const qlOptions = SYL_QL_REGISTRY.map((definition) =>
  `<option value="${definition.qlId}">${definition.qlId}</option>`).join("");
const widthButtons = SYL_V5_VIEWPORT_WIDTHS.map((width, index) =>
  `<button type="button" data-width="${width}" aria-pressed="${index === 0 ? "true" : "false"}">${width}px</button>`).join("");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SYL-001 V5 Exact Venn Review</title>
  <style>${SYL_V5_VIEWPORT_CSS}
.diagram-omitted { margin-top: 14px; padding: 10px; border: 1px dashed #aeb8c2; border-radius: 10px; background: #f8fafb; color: #475569; }
  </style>
</head>
<body>
  <header class="toolbar">
    <strong>SYL-001 V5 Exact Venn Review</strong>
    ${widthButtons}
    <label>Language
      <select id="locale-filter">
        <option value="ALL">All</option>
        <option value="en-IN">English</option>
        <option value="hi-IN">Hindi</option>
        <option value="pa-IN">Punjabi</option>
      </select>
    </label>
    <label>QL
      <select id="ql-filter">
        <option value="ALL">All</option>
        ${qlOptions}
      </select>
    </label>
    <label>Diagram
      <select id="diagram-filter">
        <option value="ALL">All</option>
        <option value="ENABLED">Enabled only</option>
        <option value="OMITTED">Omitted only</option>
      </select>
    </label>
    <span id="visible-count" class="badge"></span>
  </header>
  <main class="device-shell">
    <section id="device" class="device" style="--device-width: 360px">
      ${cards}
    </section>
  </main>
  <script>
    const device = document.getElementById("device");
    const localeFilter = document.getElementById("locale-filter");
    const qlFilter = document.getElementById("ql-filter");
    const diagramFilter = document.getElementById("diagram-filter");
    const visibleCount = document.getElementById("visible-count");
    const cards = [...document.querySelectorAll(".question-card")];

    function applyFilters() {
      let visible = 0;
      for (const card of cards) {
        const localeMatches = localeFilter.value === "ALL" || card.dataset.locale === localeFilter.value;
        const qlMatches = qlFilter.value === "ALL" || card.dataset.ql === qlFilter.value;
        const diagramMatches = diagramFilter.value === "ALL" || card.dataset.diagram === diagramFilter.value;
        card.hidden = !(localeMatches && qlMatches && diagramMatches);
        if (!card.hidden) visible += 1;
      }
      visibleCount.textContent = visible + " records";
    }

    for (const button of document.querySelectorAll("button[data-width]")) {
      button.addEventListener("click", () => {
        device.style.setProperty("--device-width", button.dataset.width + "px");
        for (const other of document.querySelectorAll("button[data-width]")) {
          other.setAttribute("aria-pressed", String(other === button));
        }
      });
    }
    localeFilter.addEventListener("change", applyFilters);
    qlFilter.addEventListener("change", applyFilters);
    diagramFilter.addEventListener("change", applyFilters);
    applyFilters();
  </script>
</body>
</html>`;

const enabledDiagrams = questions.filter((question) => question.learnerPresentationV5.diagram.enabled).length;
const omittedComplex = questions.filter((question) =>
  question.learnerPresentationV5.diagram.omissionReason === "MORE_THAN_THREE_TERMS").length;
const omittedUnstable = questions.filter((question) =>
  question.learnerPresentationV5.diagram.omissionReason === "NO_STABLE_SIMPLE_VENN").length;
const evidence = questions[0]?.learnerPresentationV5.remediationEvidence;
const summary = {
  authority: "SYL_001_EXAM_READINESS_REMEDIATION_V5",
  schemaVersion: "syl-learner-v5-viewport-review-v1",
  records: questions.length,
  logicalQuestions: SYL_QL_REGISTRY.length * seeds.length,
  widths: SYL_V5_VIEWPORT_WIDTHS,
  languages: Object.fromEntries(locales.map((locale) => [
    locale,
    questions.filter((question) => question.locale === locale).length,
  ])),
  diagramCoverage: {
    enabled: enabledDiagrams,
    omitted: questions.length - enabledDiagrams,
    omittedComplex,
    omittedUnstable,
  },
  editorialStatus: "APPROVED_BY_PRODUCT_OWNER",
  humanViewportStatus: evidence?.humanViewportStatus ?? "PENDING",
};

writeFileSync(resolve(outputDir, "SYL-001-V5-VIEWPORT-REVIEW.html"), html, "utf8");
writeFileSync(
  resolve(outputDir, "syl-001-v5-viewport-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify({
  status: "SYL-001 V5 viewport evidence exported",
  outputDir,
  ...summary,
}, null, 2));
