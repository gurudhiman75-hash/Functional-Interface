import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityReviewQuestionV3 } from "./banking-possibility-review-question-v3";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 24 }, (_, index) => index);
const outputDir = process.env.SYL_BANK_POSSIBILITY_REVIEW_V3_DIR
  ? resolve(process.env.SYL_BANK_POSSIBILITY_REVIEW_V3_DIR)
  : resolve(process.cwd(), "artifacts/api-server/dist/reasoning-v1/syl-001-bank-possibility-review-v3");
const svgDir = resolve(outputDir, "english-enabled-svg");

mkdirSync(outputDir, { recursive: true });
mkdirSync(svgDir, { recursive: true });

const questions = seeds.flatMap((seed) =>
  locales.map((locale) => generateBankingPossibilityReviewQuestionV3(seed, locale)));

const records = questions.map((question) => ({
  authority: question.authority,
  prototypeId: question.prototypeId,
  seed: question.seed,
  locale: question.locale,
  scenarioId: question.scenarioId,
  scenarioGroup: question.scenarioGroup,
  sourcePatternId: question.sourcePatternId,
  statements: question.statements,
  conclusions: question.conclusions.map((entry, index) => ({
    label: index === 0 ? "I" : "II",
    mode: entry.mode,
    text: entry.text,
    follows: entry.follows,
    classification: entry.classification,
    canBeTrue: entry.canBeTrue,
    canBeFalse: entry.canBeFalse,
  })),
  options: question.options.map((entry, index) => ({
    displayIndex: index + 1,
    text: entry.text,
    semanticValue: entry.semanticValue,
    isCorrect: entry.isCorrect,
  })),
  correctIndex: question.correctIndex + 1,
  semanticAnswer: question.semanticAnswer,
  explanation: question.explanation,
  diagram: question.diagram,
  metadata: question.metadata,
}));

function countBy(values: readonly string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const summary = {
  authority: "SYL_001_BANKING_POSSIBILITY_SHELL_V1",
  schemaVersion: "banking-possibility-review-v3-single-combined-diagram",
  status: "PROTOTYPE_HUMAN_REVIEW_REQUIRED",
  records: records.length,
  logicalQuestions: seeds.length,
  languages: countBy(records.map((entry) => entry.locale)),
  statuses: countBy(records.map((entry) => entry.semanticAnswer)),
  scenarioGroups: countBy(records.map((entry) => entry.scenarioGroup)),
  sourcePatterns: countBy(records.map((entry) => entry.sourcePatternId)),
  possibilityForms: countBy(questions.map((question) =>
    question.conclusions.find((entry) => entry.mode === "POSSIBILITY")?.canonicalConclusion.form ?? "MISSING")),
  possibilityPositions: countBy(questions.map((question) =>
    question.conclusions[0].mode === "POSSIBILITY" ? "FIRST" : "SECOND")),
  correctOptionPositions: countBy(records.map((entry) => String(entry.correctIndex))),
  diagramSlots: records.length,
  enabledDiagrams: records.filter((entry) => entry.diagram.enabled).length,
  omittedDiagrams: records.filter((entry) => !entry.diagram.enabled).length,
  geometrySources: countBy(records.map((entry) => entry.diagram.geometrySource)),
  omittedScenarios: countBy(records.filter((entry) => !entry.diagram.enabled).map((entry) => entry.scenarioId)),
  humanEditorialStatus: "PENDING",
  humanLocalizationStatus: "PENDING",
  humanExamAuthenticityStatus: "PENDING",
  humanDiagramStatus: "PENDING",
  supplementalGeometryProductApproval: "PENDING",
  activationPermitted: false,
};

for (const record of records) {
  if (record.locale !== "en-IN" || !record.diagram.enabled || !record.diagram.svg) continue;
  const fileName = `seed-${String(record.seed).padStart(2, "0")}-${record.scenarioId}-${record.diagram.geometrySource}.svg`;
  writeFileSync(resolve(svgDir, fileName), record.diagram.svg, "utf8");
}

writeFileSync(
  resolve(outputDir, "syl-001-bank-possibility-review-v3.jsonl"),
  `${records.map((entry) => JSON.stringify(entry)).join("\n")}\n`,
  "utf8",
);
writeFileSync(
  resolve(outputDir, "syl-001-bank-possibility-summary-v3.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

const markdown: string[] = [
  "# SYL-001 Banking Possibility Shell — Review V3",
  "",
  "This supersedes the diagram-free V1 review and the rejected two-diagram V2 review.",
  "",
  "## Review contract",
  "",
  "- One combined Venn diagram per question, never one diagram per conclusion.",
  "- Geometry is premise-only; Conclusions I and II are checked on the same arrangement.",
  "- Primary geometry comes from the previously approved V5 exact renderer.",
  "- A narrow supplemental finite-template family is used only after primary safe omission and must pass the same witness-closure and strong-relation safety checks.",
  "- Supplemental geometry remains pending product-owner visual approval.",
  "- Four-term questions remain safely diagram-omitted.",
  "",
  "## Summary",
  "",
  `- Logical questions: ${summary.logicalQuestions}`,
  `- Localized records: ${summary.records}`,
  `- English/Hindi/Punjabi: ${summary.languages["en-IN"]}/${summary.languages["hi-IN"]}/${summary.languages["pa-IN"]}`,
  `- Diagram slots: ${summary.diagramSlots}`,
  `- Enabled diagrams: ${summary.enabledDiagrams}`,
  `- Omitted diagrams: ${summary.omittedDiagrams}`,
  `- Geometry sources: ${JSON.stringify(summary.geometrySources)}`,
  `- Omitted scenarios: ${JSON.stringify(summary.omittedScenarios)}`,
  `- Human diagram status: ${summary.humanDiagramStatus}`,
  "",
  "## Records",
  "",
];

for (const record of records) {
  markdown.push(`### Seed ${record.seed} · ${record.locale} · ${record.scenarioId}`);
  markdown.push("");
  markdown.push("**Statements**");
  markdown.push("");
  record.statements.forEach((statement, index) => markdown.push(`${index + 1}. ${statement}`));
  markdown.push("");
  markdown.push("**Conclusions**");
  markdown.push("");
  record.conclusions.forEach((conclusion) => markdown.push(`${conclusion.label}. ${conclusion.text}`));
  markdown.push("");
  markdown.push("**Options**");
  markdown.push("");
  record.options.forEach((option) => {
    markdown.push(`${String.fromCharCode(64 + option.displayIndex)}. ${option.text}${option.isCorrect ? " ✓" : ""}`);
  });
  markdown.push("");
  markdown.push(`**Correct answer:** ${record.options[record.correctIndex - 1]?.text}`);
  markdown.push("");
  markdown.push("**Explanation**");
  markdown.push("");
  record.explanation.forEach((line) => markdown.push(`- ${line}`));
  markdown.push("");
  if (record.diagram.enabled) {
    markdown.push(`**Combined Venn diagram:** enabled · ${record.diagram.geometrySource}`);
    markdown.push("");
    markdown.push(record.diagram.caption ?? "");
  } else {
    markdown.push(`**Combined Venn diagram:** safely omitted · ${record.diagram.omissionReason}`);
  }
  markdown.push("");
  markdown.push(`_Audit metadata: ${record.semanticAnswer}; ${record.scenarioGroup}; ${record.sourcePatternId}_`);
  markdown.push("");
}

writeFileSync(
  resolve(outputDir, "SYL-001-BANKING-POSSIBILITY-REVIEW-V3.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);

const cards = records.map((record) => {
  const statements = record.statements
    .map((statement, index) => `<li>${escapeHtml(`${index + 1}. ${statement}`)}</li>`)
    .join("");
  const conclusions = record.conclusions
    .map((conclusion) => `<li><strong>${conclusion.label}.</strong> ${escapeHtml(conclusion.text)} <span class="mode">${conclusion.mode}</span></li>`)
    .join("");
  const options = record.options
    .map((option) => `<li class="${option.isCorrect ? "correct" : ""}">${String.fromCharCode(64 + option.displayIndex)}. ${escapeHtml(option.text)}</li>`)
    .join("");
  const explanations = record.explanation
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join("");
  const diagram = record.diagram.enabled && record.diagram.svg
    ? `<section class="diagram"><h3>Combined Venn diagram</h3><div class="source">${escapeHtml(record.diagram.geometrySource)}</div><div class="svg-wrap">${record.diagram.svg}</div><p>${escapeHtml(record.diagram.caption ?? "")}</p></section>`
    : `<section class="diagram omitted"><h3>Combined Venn diagram</h3><p>Safely omitted: ${escapeHtml(record.diagram.omissionReason ?? "unknown")}</p></section>`;
  return `
    <article class="card" data-locale="${escapeHtml(record.locale)}" data-status="${escapeHtml(record.semanticAnswer)}" data-group="${escapeHtml(record.scenarioGroup)}" data-geometry="${escapeHtml(record.diagram.geometrySource)}">
      <header>
        <h2>Seed ${record.seed} · ${escapeHtml(record.locale)}</h2>
        <p>${escapeHtml(record.scenarioId)} · ${escapeHtml(record.scenarioGroup)} · ${escapeHtml(record.sourcePatternId)}</p>
      </header>
      <section><h3>Statements</h3><ol>${statements}</ol></section>
      <section><h3>Conclusions</h3><ol>${conclusions}</ol></section>
      <section><h3>Options</h3><ol class="options">${options}</ol></section>
      <section><h3>Explanation</h3><ul>${explanations}</ul></section>
      ${diagram}
      <footer>${escapeHtml(record.semanticAnswer)} · correct option ${record.correctIndex}</footer>
    </article>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SYL-001 Banking Possibility Review V3</title>
<style>
  :root { font-family: system-ui, sans-serif; color: #111827; background: #f3f4f6; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 16px; }
  main { max-width: 1180px; margin: auto; }
  .summary, .controls, .card { background: white; border: 1px solid #d1d5db; border-radius: 12px; padding: 16px; }
  .summary, .controls { margin-bottom: 16px; }
  .controls { display: flex; gap: 12px; flex-wrap: wrap; position: sticky; top: 0; z-index: 2; }
  label { display: grid; gap: 4px; font-weight: 600; }
  select { padding: 8px; min-width: 170px; }
  .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr)); }
  .card h2 { margin: 0; font-size: 1.05rem; }
  .card header p, .card footer, .source { color: #4b5563; overflow-wrap: anywhere; }
  .card h3 { font-size: 0.95rem; margin-bottom: 6px; }
  .card li { margin: 6px 0; overflow-wrap: anywhere; }
  .options { list-style: none; padding-left: 0; }
  .correct { font-weight: 700; background: #ecfdf5; border-radius: 6px; padding: 6px; }
  .mode, .source { font-size: 0.72rem; font-weight: 700; background: #e5e7eb; border-radius: 999px; padding: 2px 6px; display: inline-block; }
  .diagram { border-top: 1px solid #e5e7eb; margin-top: 14px; padding-top: 12px; }
  .svg-wrap { width: 100%; max-width: 420px; margin: 8px auto; overflow: hidden; }
  .svg-wrap svg { display: block; width: 100%; height: auto; min-height: 190px; }
  .diagram.omitted { background: #f9fafb; padding: 10px; border-radius: 8px; }
  [hidden] { display: none !important; }
  @media (max-width: 420px) { body { padding: 8px; } .card, .summary, .controls { padding: 12px; } }
</style>
</head>
<body>
<main>
  <section class="summary">
    <h1>SYL-001 Banking Possibility Shell — Review V3</h1>
    <p>One combined premise-grounded Venn diagram per question. Supplemental geometry is safety-gated but still awaits product-owner visual approval.</p>
    <pre>${escapeHtml(JSON.stringify(summary, null, 2))}</pre>
  </section>
  <section class="controls">
    <label>Language
      <select id="locale"><option value="ALL">All</option><option>en-IN</option><option>hi-IN</option><option>pa-IN</option></select>
    </label>
    <label>Answer status
      <select id="status"><option value="ALL">All</option>${Object.keys(summary.statuses).map((value) => `<option>${escapeHtml(value)}</option>`).join("")}</select>
    </label>
    <label>Scenario group
      <select id="group"><option value="ALL">All</option>${Object.keys(summary.scenarioGroups).map((value) => `<option>${escapeHtml(value)}</option>`).join("")}</select>
    </label>
    <label>Geometry
      <select id="geometry"><option value="ALL">All</option>${Object.keys(summary.geometrySources).map((value) => `<option>${escapeHtml(value)}</option>`).join("")}</select>
    </label>
  </section>
  <section class="grid">${cards}</section>
</main>
<script>
  const filters = ["locale", "status", "group", "geometry"];
  function apply() {
    const selected = Object.fromEntries(filters.map((id) => [id, document.getElementById(id).value]));
    document.querySelectorAll(".card").forEach((card) => {
      card.hidden = filters.some((id) => selected[id] !== "ALL" && card.dataset[id] !== selected[id]);
    });
  }
  filters.forEach((id) => document.getElementById(id).addEventListener("change", apply));
</script>
</body>
</html>`;

writeFileSync(
  resolve(outputDir, "SYL-001-BANKING-POSSIBILITY-REVIEW-V3.html"),
  html,
  "utf8",
);

console.log(JSON.stringify({
  status: "SYL-001 Banking possibility V3 single-combined-diagram review exported",
  outputDir,
  ...summary,
}, null, 2));
