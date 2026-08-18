import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateIopEnglishReviewCaselet } from "./english-review-generator.ts";
import { IOP_001_PERMANENT_QL_AUTHORITIES } from "./permanent-authorities.ts";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import type { IopEnglishProductionCaselet } from "./english-production-types.ts";
import type { IopPermanentSolveMode } from "./permanent-authorities.ts";

const outputDir = process.env.IOP_ENGLISH_REVIEW_OUTPUT_DIR ?? "/tmp/iop-english-review";
const examplesPerMode = Number(process.env.IOP_ENGLISH_REVIEW_EXAMPLES_PER_MODE ?? 2);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function solveModeLabel(kind: IopPermanentSolveMode): string {
  const labels: Record<IopPermanentSolveMode, string> = {
    STEP_OUTPUT: "Find a step",
    FINAL_OUTPUT: "Find the final arrangement",
    ELEMENT_AT_POSITION: "Find an element at a position",
    POSITION_OF_ELEMENT: "Find the position of an element",
    STEP_NUMBER: "Identify the step number",
    PREVIOUS_STEP: "Find the previous step",
    MISSING_STEP: "Find the missing step",
    REMAINING_STEP_COUNT: "Count the remaining steps",
  };
  return labels[kind];
}

function renderToken(value: string): string {
  const box = /^(B\d+)\[([^,]+),([^\]]+)\]$/.exec(value);
  if (box) return `<span class="machine-box"><small>${escapeHtml(box[1]!)}</small><span>${escapeHtml(box[2]!)} <b>|</b> ${escapeHtml(box[3]!)}</span></span>`;
  const group = /^(G\d+)\(([^,]+),([^\)]+)\)$/.exec(value);
  if (group) return `<span class="machine-box"><small>${escapeHtml(group[1]!)}</small><span>${escapeHtml(group[2]!)} <b>|</b> ${escapeHtml(group[3]!)}</span></span>`;
  return `<span class="token">${escapeHtml(value)}</span>`;
}

function traceRow(label: string, values: readonly string[]): string {
  return `<div class="trace-row"><strong>${escapeHtml(label)}</strong><div class="token-row">${values.map(renderToken).join("")}</div></div>`;
}

function fullTraceHtml(trace: IopEnglishProductionCaselet["target"]): string {
  const steps = trace.steps.map((step, index) => traceRow(`Step ${index + 1}:`, step)).join("");
  return `${traceRow("Input:", trace.input)}${steps}`;
}

function questionHtml(caselet: IopEnglishProductionCaselet): string {
  return caselet.children.map((child) => {
    const options = child.options
      .map((option, index) => `<li><span class="option-letter">${String.fromCharCode(65 + index)}.</span> ${escapeHtml(option.display)}</li>`)
      .join("");
    const answerLetter = String.fromCharCode(65 + child.answerIndex);
    return `<article class="question">
      <div class="question-heading">
        <h4>Question ${child.questionOrder} of 4</h4>
        <span class="question-type">Reviewer type: ${escapeHtml(solveModeLabel(child.kind))}</span>
      </div>
      <p class="question-text">${escapeHtml(child.text)}</p>
      <ol class="options">${options}</ol>
      <section class="answer-block">
        <p class="solution-title">Solution</p>
        <p><strong>Correct answer:</strong> ${answerLetter}. ${escapeHtml(child.answerDisplay)}</p>
        <p class="explanation"><strong>Explanation:</strong>\n${escapeHtml(child.explanation)}</p>
      </section>
    </article>`;
  }).join("");
}

function caseletHtml(caselet: IopEnglishProductionCaselet, exampleNumber: number): string {
  return `<article class="caselet">
    <div class="caselet-heading">
      <h3>Example ${exampleNumber}</h3>
      <span class="difficulty">${escapeHtml(caselet.difficulty)}</span>
    </div>

    <p class="directions"><strong>Directions:</strong> ${escapeHtml(caselet.directions)}</p>

    <section class="student-block worked-example">
      <h4>1. Study this machine</h4>
      <p class="helper">The exam gives an input and its step-by-step rearrangement. Use it to understand the machine pattern.</p>
      ${fullTraceHtml(caselet.demonstration)}
    </section>

    <section class="student-block new-input">
      <h4>2. Apply the same machine to this new input</h4>
      ${traceRow("New Input:", caselet.target.input)}
      <p class="helper">The solved steps are not shown here before the questions. Each solution below explains how the required answer is obtained.</p>
    </section>

    <section class="question-set">
      <h4>3. Questions, answers and worked explanations</h4>
      ${questionHtml(caselet)}
    </section>

    <details class="reviewer-solution">
      <summary>Reviewer only — show machine rule and complete solution trace</summary>
      <p><strong>Machine rule:</strong> ${escapeHtml(caselet.ruleExplanation)}</p>
      <div class="review-trace">${fullTraceHtml(caselet.target)}</div>
    </details>

    <details class="technical-details">
      <summary>Technical audit details</summary>
      <p><strong>QL:</strong> ${escapeHtml(caselet.qlId)}</p>
      <p><strong>Source mode:</strong> ${escapeHtml(caselet.sourceModeId)}</p>
      <p><strong>Caselet ID:</strong> ${escapeHtml(caselet.caseletId)}</p>
      <p><strong>Sources:</strong> ${escapeHtml(caselet.sourceEvidenceIds.join(", "))}</p>
    </details>
  </article>`;
}

const caselets: IopEnglishProductionCaselet[] = [];
for (const mode of IOP_ENGLISH_SOURCE_MODES) {
  for (let index = 0; index < examplesPerMode; index += 1) {
    caselets.push(generateIopEnglishReviewCaselet(
      `IOP-EN-REVIEW-${mode.sourceModeId}-${String(index).padStart(2, "0")}`,
      mode.qlId,
      mode.sourceModeId,
    ));
  }
}

const byQl = new Map<string, IopEnglishProductionCaselet[]>();
for (const caselet of caselets) {
  const existing = byQl.get(caselet.qlId) ?? [];
  existing.push(caselet);
  byQl.set(caselet.qlId, existing);
}

const sections = [...byQl.entries()].map(([qlId, values]) => {
  const authority = IOP_001_PERMANENT_QL_AUTHORITIES.find((candidate) => candidate.qlId === qlId);
  if (!authority) throw new Error(`Missing permanent authority for ${qlId}`);
  const familyNumber = Number(qlId.slice(-3));
  return `<section class="family">
    <div class="family-heading">
      <p class="eyebrow">Machine family ${familyNumber}</p>
      <h2>${escapeHtml(authority.title)}</h2>
      <p>Each example below contains one worked machine, one fresh input and four MCQs based on that fresh input.</p>
    </div>
    ${values.map((caselet, index) => caseletHtml(caselet, index + 1)).join("")}
  </section>`;
}).join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>IOP-001 Student-Facing English Review</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, sans-serif; line-height: 1.5; margin: 0; color: #181818; background: #f4f5f7; }
  main { max-width: 980px; margin: 0 auto; padding: 24px; }
  h1, h2, h3, h4 { line-height: 1.25; margin-top: 0; }
  .intro, .family-heading, .caselet { background: white; border: 1px solid #d8dadd; border-radius: 12px; }
  .intro { padding: 20px; margin-bottom: 28px; }
  .intro h1 { margin-bottom: 10px; }
  .status-note { font-size: 14px; color: #555; }
  .how-to-read { margin: 18px 0 0; padding: 14px 16px; background: #f7f7f7; border-radius: 9px; }
  .how-to-read ol { margin: 8px 0 0 20px; padding: 0; }
  .family { margin: 34px 0; }
  .family-heading { padding: 18px 20px; margin-bottom: 14px; }
  .family-heading h2 { margin-bottom: 6px; }
  .eyebrow { margin: 0 0 5px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: #555; }
  .caselet { padding: 20px; margin: 16px 0; break-inside: avoid; }
  .caselet-heading { display: flex; justify-content: space-between; gap: 12px; align-items: center; border-bottom: 1px solid #e4e4e4; padding-bottom: 12px; margin-bottom: 14px; }
  .caselet-heading h3 { margin: 0; }
  .difficulty, .question-type { font-size: 12px; border: 1px solid #bbb; border-radius: 999px; padding: 3px 8px; white-space: nowrap; }
  .directions { font-size: 16px; margin: 14px 0 18px; }
  .student-block { padding: 15px; border: 1px solid #ddd; border-radius: 10px; margin: 14px 0; overflow-x: auto; }
  .student-block h4, .question-set > h4 { margin-bottom: 5px; }
  .helper { margin: 0 0 12px; font-size: 14px; color: #555; }
  .trace-row { margin: 9px 0; }
  .token-row { display: flex; flex-wrap: wrap; gap: 7px; align-items: center; margin-top: 4px; }
  .token { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; padding: 3px 5px; }
  .machine-box { display: inline-flex; flex-direction: column; align-items: center; min-width: 62px; border: 1px solid #777; border-radius: 6px; padding: 5px 7px; background: white; }
  .machine-box small { font-size: 10px; line-height: 1; margin-bottom: 3px; }
  .machine-box span { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; }
  .question-set { margin-top: 22px; }
  .question { border-top: 1px solid #ddd; padding: 17px 0 4px; }
  .question:first-of-type { border-top: 0; }
  .question-heading { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
  .question-heading h4 { margin: 0; }
  .question-text { font-size: 16px; margin: 12px 0; }
  .options { list-style: none; padding: 0; margin: 0 0 12px; }
  .options li { padding: 7px 9px; margin: 5px 0; border: 1px solid #e1e1e1; border-radius: 7px; }
  .option-letter { font-weight: 700; margin-right: 4px; }
  details { margin-top: 10px; }
  summary { cursor: pointer; font-weight: 700; }
  .answer-block { padding: 12px 14px; margin-top: 12px; background: #f7f7f7; border-left: 4px solid #999; border-radius: 8px; }
  .answer-block p { margin: 7px 0; }
  .solution-title { font-weight: 700; font-size: 15px; margin-top: 0 !important; }
  .explanation { white-space: pre-line; }
  .reviewer-solution, .technical-details { margin-top: 18px; padding: 12px 14px; border: 1px dashed #aaa; border-radius: 8px; }
  .review-trace { margin-top: 12px; padding-top: 4px; }
  .technical-details { font-size: 13px; color: #555; }
  .technical-details p { margin: 6px 0; }
  @media (max-width: 640px) {
    main { padding: 12px; }
    .intro, .family-heading, .caselet { border-radius: 9px; }
    .caselet { padding: 14px; }
    .caselet-heading, .question-heading { align-items: flex-start; flex-direction: column; }
    .machine-box { min-width: 54px; }
  }
</style>
</head>
<body>
<main>
  <section class="intro">
    <h1>IOP-001 — Student-Facing English Review</h1>
    <p>This file shows the questions in the same logical order a student would understand them. Internal source IDs, QL IDs and solved target traces are kept out of the main question flow.</p>
    <div class="how-to-read">
      <strong>How to read each example</strong>
      <ol>
        <li>Study the worked machine: Input → Step 1 → Step 2 → …</li>
        <li>Look at the new input.</li>
        <li>Read the four MCQs based on that same input.</li>
        <li>Audit the correct answer and full worked explanation shown directly below each MCQ.</li>
      </ol>
    </div>
    <p class="status-note"><strong>Review status:</strong> ENGLISH_REVIEW_CANDIDATE · English not frozen · Question Studio OFF.</p>
  </section>
  ${sections}
</main>
</body>
</html>`;

await mkdir(outputDir, { recursive: true });
await writeFile(join(outputDir, "IOP-001-ENGLISH-PERMANENT-REVIEW.html"), html, "utf8");
await writeFile(join(outputDir, "IOP-001-ENGLISH-PERMANENT-REVIEW.json"), JSON.stringify({
  packageId: "IOP-001",
  status: "ENGLISH_REVIEW_CANDIDATE",
  permanentQlCount: 8,
  sourceModeCount: IOP_ENGLISH_SOURCE_MODES.length,
  caseletCount: caselets.length,
  reviewerTraceStudentVisible: false,
  questionStudioDiscoverable: false,
  caselets,
}, null, 2), "utf8");

console.log("PASS_IOP_001_ENGLISH_REVIEW_EXPORT");
console.log(`output ${outputDir}`);
console.log(`caselets ${caselets.length}`);
console.log(`questions ${caselets.reduce((sum, caselet) => sum + caselet.children.length, 0)}`);
