import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityReviewQuestionV1 } from "./banking-possibility-review-question-v1";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 24 }, (_, index) => index);
const outputDir = process.env.SYL_BANK_POSSIBILITY_REVIEW_DIR
  ? resolve(process.env.SYL_BANK_POSSIBILITY_REVIEW_DIR)
  : resolve(process.cwd(), "artifacts/api-server/dist/reasoning-v1/syl-001-bank-possibility-review-v2");

mkdirSync(outputDir, { recursive: true });

const questions = seeds.flatMap((seed) =>
  locales.map((locale) => generateBankingPossibilityReviewQuestionV1(seed, locale)));

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
  diagrams: question.diagrams,
  options: question.options.map((entry, index) => ({
    displayIndex: index + 1,
    text: entry.text,
    semanticValue: entry.semanticValue,
    isCorrect: entry.isCorrect,
  })),
  correctIndex: question.correctIndex + 1,
  semanticAnswer: question.semanticAnswer,
  explanation: question.explanation,
  metadata: question.metadata,
}));

const diagramSlots = records.flatMap((record) => record.diagrams);
const summary = {
  authority: "SYL_001_BANKING_POSSIBILITY_SHELL_V1",
  schemaVersion: "banking-possibility-review-v2-with-restored-diagrams",
  status: "PROTOTYPE_HUMAN_REVIEW_REQUIRED",
  records: records.length,
  logicalQuestions: seeds.length,
  languages: countBy(records.map((entry) => entry.locale)),
  statuses: countBy(records.map((entry) => entry.semanticAnswer)),
  diagramSlots: diagramSlots.length,
  enabledDiagrams: diagramSlots.filter((entry) => entry.enabled).length,
  omittedDiagrams: diagramSlots.filter((entry) => !entry.enabled).length,
  explanationModes: countBy(diagramSlots.map((entry) => entry.explanationMode)),
  humanEditorialStatus: "PENDING",
  humanLocalizationStatus: "PENDING",
  humanExamAuthenticityStatus: "PENDING",
  humanDiagramStatus: "PENDING",
  activationPermitted: false,
};

writeFileSync(
  resolve(outputDir, "syl-001-bank-possibility-review-v2.jsonl"),
  `${records.map((entry) => JSON.stringify(entry)).join("\n")}\n`,
  "utf8",
);
writeFileSync(
  resolve(outputDir, "syl-001-bank-possibility-summary-v2.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

const markdown: string[] = [
  "# SYL-001 Banking Possibility Shell — Prototype Review V2",
  "",
  "This pack restores the existing approved V5 diagram renderer that was accidentally bypassed by the V1 prototype exporter.",
  "",
  `- Localized records: ${summary.records}`,
  `- Diagram slots: ${summary.diagramSlots}`,
  `- Enabled diagrams: ${summary.enabledDiagrams}`,
  `- Intentionally omitted diagrams: ${summary.omittedDiagrams}`,
  "- Human diagram review: PENDING",
  "",
];

for (const record of records) {
  markdown.push(`## Seed ${record.seed} · ${record.locale} · ${record.scenarioId}`);
  markdown.push("");
  markdown.push("### Statements");
  record.statements.forEach((statement, index) => markdown.push(`${index + 1}. ${statement}`));
  markdown.push("");

  record.conclusions.forEach((conclusion, index) => {
    const diagram = record.diagrams[index];
    markdown.push(`### Conclusion ${conclusion.label}`);
    markdown.push("");
    markdown.push(`${conclusion.text}`);
    markdown.push("");
    if (diagram.enabled) {
      markdown.push(`**Diagram caption:** ${diagram.caption ?? ""}`);
      markdown.push("");
      markdown.push(diagram.svg ?? "");
    } else {
      markdown.push(`**Diagram intentionally omitted:** ${diagram.omissionReason}`);
    }
    markdown.push("");
  });

  markdown.push("### Options");
  record.options.forEach((option) => {
    markdown.push(`${String.fromCharCode(64 + option.displayIndex)}. ${option.text}${option.isCorrect ? " ✓" : ""}`);
  });
  markdown.push("");
  markdown.push("### Explanation");
  record.explanation.forEach((line) => markdown.push(`- ${line}`));
  markdown.push("");
}

writeFileSync(
  resolve(outputDir, "SYL-001-BANKING-POSSIBILITY-PROTOTYPE-REVIEW-V2.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);

const cards = records.map((record) => {
  const statements = record.statements
    .map((statement, index) => `<li>${escapeHtml(`${index + 1}. ${statement}`)}</li>`)
    .join("");
  const conclusionBlocks = record.conclusions.map((conclusion, index) => {
    const diagram = record.diagrams[index];
    const visual = diagram.enabled && diagram.svg
      ? `<div class="diagram" aria-label="${escapeHtml(diagram.accessibleDescription ?? diagram.caption ?? "Syllogism diagram")}">${diagram.svg}</div><p class="caption">${escapeHtml(diagram.caption ?? "")}</p>`
      : `<p class="omitted">Diagram intentionally omitted: ${escapeHtml(diagram.omissionReason ?? "not useful")}</p>`;
    return `<section class="conclusion-block"><h3>Conclusion ${conclusion.label}</h3><p>${escapeHtml(conclusion.text)} <span class="mode">${conclusion.mode}</span></p>${visual}</section>`;
  }).join("");
  const options = record.options
    .map((option) => `<li class="${option.isCorrect ? "correct" : ""}">${String.fromCharCode(64 + option.displayIndex)}. ${escapeHtml(option.text)}</li>`)
    .join("");
  const explanations = record.explanation.map((line) => `<li>${escapeHtml(line)}</li>`).join("");

  return `<article class="card" data-locale="${record.locale}" data-status="${record.semanticAnswer}">
    <header><h2>Seed ${record.seed} · ${record.locale}</h2><p>${escapeHtml(record.scenarioId)} · ${escapeHtml(record.sourcePatternId)}</p></header>
    <section><h3>Statements</h3><ol>${statements}</ol></section>
    ${conclusionBlocks}
    <section><h3>Options</h3><ol class="options">${options}</ol></section>
    <section><h3>Explanation</h3><ul>${explanations}</ul></section>
    <footer>${escapeHtml(record.semanticAnswer)} · correct option ${record.correctIndex}</footer>
  </article>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>SYL-001 Banking Possibility Review V2 — Restored Diagrams</title>
<style>
:root{font-family:system-ui,sans-serif;color:#111827;background:#f3f4f6}*{box-sizing:border-box}body{margin:0;padding:18px}main{max-width:1200px;margin:auto}.summary,.controls,.card{background:#fff;border:1px solid #d1d5db;border-radius:12px;padding:16px}.summary,.controls{margin-bottom:16px}.controls{display:flex;gap:12px;flex-wrap:wrap;position:sticky;top:0;z-index:2}.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr))}.card h2{margin:0;font-size:1.05rem}.card header p,.card footer,.caption,.omitted{color:#4b5563;overflow-wrap:anywhere}.card li{margin:6px 0}.options{list-style:none;padding:0}.correct{font-weight:700;background:#ecfdf5;border-radius:6px;padding:6px}.mode{font-size:.72rem;font-weight:700;background:#e5e7eb;border-radius:999px;padding:2px 6px}.conclusion-block{border-top:1px solid #e5e7eb;padding-top:10px}.diagram{width:100%;overflow:hidden}.diagram svg{display:block;width:100%;height:auto;max-width:340px;margin:8px auto}.caption{font-size:.88rem}.omitted{font-style:italic}select{padding:8px;min-width:170px}[hidden]{display:none!important}
</style></head><body><main>
<section class="summary"><h1>SYL-001 Banking Possibility Shell — Review V2</h1><p>The V1 exporter accidentally omitted the existing diagrams. This pack restores one focused V5 diagram per conclusion.</p><pre>${escapeHtml(JSON.stringify(summary,null,2))}</pre></section>
<section class="controls"><label>Language <select id="locale"><option value="ALL">All</option><option>en-IN</option><option>hi-IN</option><option>pa-IN</option></select></label><label>Status <select id="status"><option value="ALL">All</option>${Object.keys(summary.statuses).map((value)=>`<option>${escapeHtml(value)}</option>`).join("")}</select></label></section>
<section class="grid">${cards}</section></main>
<script>const ids=["locale","status"];function apply(){const s=Object.fromEntries(ids.map(id=>[id,document.getElementById(id).value]));document.querySelectorAll(".card").forEach(c=>{c.hidden=ids.some(id=>s[id]!=="ALL"&&c.dataset[id]!==s[id])})}ids.forEach(id=>document.getElementById(id).addEventListener("change",apply));</script>
</body></html>`;

writeFileSync(
  resolve(outputDir, "SYL-001-BANKING-POSSIBILITY-PROTOTYPE-REVIEW-V2.html"),
  html,
  "utf8",
);

console.log(JSON.stringify({
  status: "SYL-001 Banking possibility review V2 exported with restored diagrams",
  outputDir,
  ...summary,
}, null, 2));
