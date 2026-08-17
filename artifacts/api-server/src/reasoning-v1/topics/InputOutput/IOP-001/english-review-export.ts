import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateIopEnglishReviewCaselet } from "./english-review-generator.ts";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import type { IopEnglishProductionCaselet } from "./english-production-types.ts";

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

function traceHtml(title: string, trace: IopEnglishProductionCaselet["target"]): string {
  const steps = trace.steps.map((step, index) => traceRow(`Step ${index + 1}:`, step)).join("");
  return `<section class="trace"><h5>${escapeHtml(title)}</h5>${traceRow("Input:", trace.input)}${steps}</section>`;
}

function questionHtml(caselet: IopEnglishProductionCaselet): string {
  return caselet.children.map((child) => {
    const options = child.options.map((option, index) => `<li class="${option.isCorrect ? "correct" : ""}">${String.fromCharCode(65 + index)}. ${escapeHtml(option.display)}</li>`).join("");
    return `<article class="question">
      <h5>Q${child.questionOrder} · ${escapeHtml(child.kind)}</h5>
      <p>${escapeHtml(child.text)}</p>
      <ol>${options}</ol>
      <p><strong>Answer:</strong> ${escapeHtml(child.answerDisplay)}</p>
      <p><strong>Question-specific explanation:</strong> ${escapeHtml(child.explanation)}</p>
    </article>`;
  }).join("");
}

function caseletHtml(caselet: IopEnglishProductionCaselet): string {
  return `<article class="caselet">
    <h4>${escapeHtml(caselet.qlId)} · ${escapeHtml(caselet.sourceModeId)} · ${escapeHtml(caselet.difficulty)}</h4>
    <p><strong>Sources:</strong> ${escapeHtml(caselet.sourceEvidenceIds.join(", "))}</p>
    <p><strong>Directions:</strong> ${escapeHtml(caselet.directions)}</p>
    ${traceHtml("Illustration", caselet.demonstration)}
    <p><strong>Shared machine rule:</strong> ${escapeHtml(caselet.ruleExplanation)}</p>
    ${traceHtml("New input — reviewer trace", caselet.target)}
    ${questionHtml(caselet)}
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

const sections = [...byQl.entries()].map(([qlId, values]) => `<section class="ql"><h2>${escapeHtml(qlId)}</h2>${values.map(caseletHtml).join("")}</section>`).join("");
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>IOP-001 English Permanent Authority Review</title>
<style>
  body { font-family: Arial, sans-serif; line-height: 1.45; margin: 24px; color: #181818; }
  h1, h2, h3, h4, h5 { margin-bottom: 8px; }
  .summary { padding: 14px; border: 1px solid #bbb; border-radius: 8px; margin-bottom: 20px; }
  .ql { margin: 28px 0; }
  .caselet { border: 1px solid #bbb; border-radius: 10px; padding: 16px; margin: 16px 0; break-inside: avoid; }
  .trace { background: #f7f7f7; padding: 10px 12px; margin: 10px 0; border-radius: 8px; overflow-x: auto; }
  .trace-row { margin: 7px 0; }
  .token-row { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 3px; }
  .token { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; padding: 2px 4px; }
  .machine-box { display: inline-flex; flex-direction: column; align-items: center; min-width: 58px; border: 1px solid #777; border-radius: 6px; padding: 4px 6px; background: white; }
  .machine-box small { font-size: 10px; line-height: 1; margin-bottom: 3px; }
  .machine-box span { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; }
  .question { border-top: 1px dashed #bbb; padding-top: 10px; margin-top: 14px; }
  ol { list-style: none; padding-left: 0; }
  li { padding: 3px 0; }
  .correct { font-weight: 700; }
  @media (max-width: 640px) { body { margin: 12px; } .caselet { padding: 12px; } .machine-box { min-width: 52px; } }
</style>
</head>
<body>
<h1>IOP-001 — English Permanent Authority Review</h1>
<div class="summary">
  <p><strong>Status:</strong> ENGLISH_REVIEW_CANDIDATE; not frozen.</p>
  <p><strong>Permanent QLs:</strong> 8 &nbsp; <strong>Whitelisted source modes:</strong> ${IOP_ENGLISH_SOURCE_MODES.length} &nbsp; <strong>Caselets:</strong> ${caselets.length}</p>
  <p><strong>Product lifecycle:</strong> Question Studio OFF · Question Bank OFF · tests OFF · public OFF.</p>
  <p>The shared machine rule is shown once. Each child then carries only its question-specific explanation. The full target trace is reviewer-only evidence and must not be exposed in student delivery.</p>
  <p>Review rule inference, source realism, step correctness, distractors, explanation clarity, mobile readability and difficulty. A green automated proof is necessary but not a substitute for human editorial approval.</p>
</div>
${sections}
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
