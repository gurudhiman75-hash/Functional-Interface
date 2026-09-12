import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion,
  type ApprovedOpsQuestion,
} from "./approved-teaching-runtime";

const REVIEW_SEEDS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55] as const;

interface ReviewRecord extends ApprovedOpsQuestion {
  reviewId: string;
}

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function toRecord(question: ApprovedOpsQuestion): ReviewRecord {
  return {
    ...question,
    reviewId: `${question.candidateId}-S${String(question.seed).padStart(3, "0")}`,
  };
}

function card(record: ReviewRecord, ordinal: number): string {
  const options = record.options.map((option, index) => `
    <li><span class="option-label">${optionLetter(index)}</span><span>${escapeHtml(option.value)}</span></li>`).join("");
  const steps = record.explanation.steps.map((step, index) => `
    <li>
      <strong>${index + 1}. ${escapeHtml(step.label)}</strong>
      <div class="trace"><span>${escapeHtml(step.expression)}</span><span class="arrow">→</span><span>${escapeHtml(step.result)}</span></div>
    </li>`).join("");
  const metadata = Object.entries(record.metadata).map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
  return `
  <article class="question-card" data-cp="${escapeHtml(record.checkpointId)}" data-candidate="${escapeHtml(record.candidateId)}">
    <header>
      <div><span class="ordinal">#${ordinal}</span><strong>${escapeHtml(record.reviewId)}</strong></div>
      <div class="meta-line">${escapeHtml(record.checkpointId)} · ${escapeHtml(record.taskKind)} · ${escapeHtml(record.renderer)}</div>
    </header>
    <section class="question-body">
      <h2>${escapeHtml(record.stem)}</h2>
      <ol class="options">${options}</ol>
    </section>
    <section class="review-grid">
      <label><input type="checkbox"> Question natural</label>
      <label><input type="checkbox"> Symbols correct</label>
      <label><input type="checkbox"> Replacement visible</label>
      <label><input type="checkbox"> BODMAS correct</label>
      <label><input type="checkbox"> Option justified</label>
      <label><input type="checkbox"> Explanation teaches</label>
    </section>
    <label class="notes">Reviewer notes<textarea rows="3" placeholder="Record any remaining question, option or explanation issue..."></textarea></label>
    <details class="answer-panel">
      <summary>Answer and approved teaching explanation</summary>
      <p class="answer"><strong>Correct option:</strong> ${optionLetter(record.correctIndex)} — ${escapeHtml(record.answer)}</p>
      <p><strong>Method:</strong> ${escapeHtml(record.explanation.ruleStatement)}</p>
      <ol class="steps">${steps}</ol>
      <p class="conclusion"><strong>${escapeHtml(record.explanation.conclusion)}</strong></p>
      <table>
        <tr><th>Solve mode</th><td>${escapeHtml(record.solveMode)}</td></tr>
        <tr><th>Solver route</th><td>${escapeHtml(record.proof.solverRoute)}</td></tr>
        <tr><th>Eligible candidates</th><td>${record.proof.eligibleCandidateCount}</td></tr>
        <tr><th>Survivors</th><td>${record.proof.survivingCandidateCount}</td></tr>
        <tr><th>Fingerprint</th><td><code>${escapeHtml(record.proof.semanticFingerprint)}</code></td></tr>
        ${metadata}
      </table>
    </details>
  </article>`;
}

function renderHtml(records: readonly ReviewRecord[]): string {
  const checkpoints = [...new Set(records.map((record) => record.checkpointId))].sort();
  const candidates = [...new Set(records.map((record) => record.candidateId))].sort();
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>OPS-001 Approved English Review — 310 Questions</title>
<style>
:root { font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif; line-height: 1.5; color: #18181b; background: #f4f4f5; }
body { margin: 0; }
.toolbar { position: sticky; top: 0; z-index: 5; padding: 11px 16px; background: rgba(255,255,255,.98); border-bottom: 1px solid #d4d4d8; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.toolbar input,.toolbar select,.toolbar button { padding: 8px 10px; border: 1px solid #a1a1aa; border-radius: 6px; background: white; }
main { max-width: 1080px; margin: auto; padding: 22px; }
.hero,.question-card { background: white; border: 1px solid #d4d4d8; border-radius: 10px; margin-bottom: 18px; }
.hero { padding: 19px; }.hero h1 { margin-top: 0; }.notice { border-left: 5px solid #16a34a; background: #f0fdf4; padding: 10px; }
.question-card { overflow: hidden; break-inside: avoid; }.question-card>header { padding: 11px 15px; background: #fafafa; border-bottom: 1px solid #e4e4e7; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.ordinal { color: #52525b; margin-right: 8px; }.meta-line { color: #52525b; font-size: .86rem; }
.question-body { padding: 15px; }.question-body h2 { margin-top: 0; font-size: 1.08rem; }
.options { list-style: none; padding: 0; display: grid; gap: 8px; }.options li { border: 1px solid #e4e4e7; border-radius: 7px; padding: 9px; display: flex; gap: 10px; }.option-label { min-width: 25px; height: 25px; border-radius: 50%; background: #e4e4e7; text-align: center; font-weight: 700; }
.review-grid { padding: 0 15px 12px; display: grid; grid-template-columns: repeat(auto-fit,minmax(185px,1fr)); gap: 7px; font-size: .9rem; }.notes { display: block; padding: 0 15px 14px; font-weight: 700; }.notes textarea { width: 100%; box-sizing: border-box; margin-top: 5px; padding: 8px; font: inherit; }
.answer-panel { border-top: 1px solid #e4e4e7; padding: 12px 15px; background: #fafafa; }.answer-panel summary { cursor: pointer; font-weight: 700; }.answer { background: #ecfdf5; border-left: 4px solid #10b981; padding: 8px; }.steps li { margin-bottom: 12px; }.trace { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1.4fr); gap: 9px; align-items: start; margin-top: 4px; padding: 8px; background: white; border: 1px solid #e4e4e7; border-radius: 6px; }.arrow { font-weight: 800; }.conclusion { padding: 8px; background: white; }
table { border-collapse: collapse; width: 100%; font-size: .86rem; }th,td { border: 1px solid #d4d4d8; padding: 6px; vertical-align: top; }th { width: 190px; text-align: left; }.hidden { display: none!important; }
@media(max-width:650px){main{padding:10px}.trace{grid-template-columns:1fr}.arrow{transform:rotate(90deg);width:max-content}}
@media print { .toolbar { display:none } main { max-width:none; padding:0 }.question-card { page-break-inside:avoid } details { display:block } details>* { display:block } }
</style>
</head>
<body>
<div class="toolbar">
  <input id="search" placeholder="Search question, ID or explanation">
  <select id="cp"><option value="">All CPs</option>${checkpoints.map((cp) => `<option>${escapeHtml(cp)}</option>`).join("")}</select>
  <select id="candidate"><option value="">All contracts</option>${candidates.map((candidate) => `<option>${escapeHtml(candidate)}</option>`).join("")}</select>
  <button onclick="toggleAnswers(true)">Open explanations</button>
  <button onclick="toggleAnswers(false)">Close explanations</button>
  <button onclick="window.print()">Print / Save PDF</button>
  <span id="count"></span>
</div>
<main>
<section class="hero">
<h1>OPS-001 Approved English Review</h1>
<p class="notice"><strong>310 questions:</strong> ten deterministic seeds for each of the 31 retained logical contracts. All records are generated through the V3 approved teaching runtime; the rejected V1/V2 explanation traces are not used.</p>
<p>Review the question and options first. Then open the explanation and verify visible replacement, correct precedence, complete inference and option justification.</p>
</section>
${records.map((record, index) => card(record, index + 1)).join("\n")}
</main>
<script>
const cards=[...document.querySelectorAll('.question-card')];const search=document.getElementById('search');const cp=document.getElementById('cp');const candidate=document.getElementById('candidate');const count=document.getElementById('count');
function filter(){const q=search.value.trim().toLowerCase();let visible=0;for(const card of cards){const ok=(!q||card.textContent.toLowerCase().includes(q))&&(!cp.value||card.dataset.cp===cp.value)&&(!candidate.value||card.dataset.candidate===candidate.value);card.classList.toggle('hidden',!ok);if(ok)visible+=1}count.textContent=visible+' visible'}
function toggleAnswers(open){for(const item of document.querySelectorAll('.answer-panel'))item.open=open}
search.addEventListener('input',filter);cp.addEventListener('change',filter);candidate.addEventListener('change',filter);filter();
</script>
</body>
</html>`;
}

function renderMarkdown(records: readonly ReviewRecord[]): string {
  const lines = [
    "# OPS-001 Approved English Review — 310 Questions",
    "",
    "Ten deterministic seeds for each of the 31 retained logical contracts. Generated through the V3 approved teaching runtime.",
    "",
  ];
  records.forEach((record, index) => {
    lines.push(`## ${index + 1}. ${record.reviewId} — ${record.checkpointId}`, "", `**Question:** ${record.stem}`, "");
    record.options.forEach((option, optionIndex) => lines.push(`${optionLetter(optionIndex)}. ${option.value}`));
    lines.push("", "<details><summary>Answer and approved teaching explanation</summary>", "", `**Answer:** ${optionLetter(record.correctIndex)} — ${record.answer}`, "", `**Method:** ${record.explanation.ruleStatement}`, "");
    record.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. **${step.label}:** ${step.expression} → ${step.result}`));
    lines.push("", `**Conclusion:** ${record.explanation.conclusion}`, "", "</details>", "", "Reviewer: [ ] question  [ ] symbols  [ ] replacement  [ ] BODMAS  [ ] option proof  [ ] teaching", "", "Notes: ________________________________________________", "");
  });
  return lines.join("\n");
}

function renderCsv(records: readonly ReviewRecord[]): string {
  const headers = ["reviewId","candidateId","checkpointId","seed","sourceSeed","stem","optionA","optionB","optionC","optionD","correctIndex","answer","ruleStatement","steps","conclusion","solveMode","solverRoute","metadataJson"];
  const rows = records.map((record) => [
    record.reviewId, record.candidateId, record.checkpointId, record.seed, record.metadata.sourceSeed, record.stem,
    ...record.options.map((option) => option.value), record.correctIndex, record.answer, record.explanation.ruleStatement,
    record.explanation.steps.map((step) => `${step.label}: ${step.expression} -> ${step.result}`).join(" | "),
    record.explanation.conclusion, record.solveMode, record.proof.solverRoute, record.metadata,
  ]);
  return [headers.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))].join("\n");
}

async function main(): Promise<void> {
  const outputDir = resolve(process.argv[2] ?? "ops-001-approved-review");
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const records = OPS_APPROVED_CANDIDATE_IDS.flatMap((candidateId) => REVIEW_SEEDS.map((seed) => toRecord(generateApprovedOpsQuestion(candidateId, seed))));
  if (records.length !== 310) throw new Error(`Expected 310 approved review records; found ${records.length}.`);

  await Promise.all([
    writeFile(resolve(outputDir, "OPS-001-EN-APPROVED-310.html"), renderHtml(records), "utf8"),
    writeFile(resolve(outputDir, "OPS-001-EN-APPROVED-310.md"), renderMarkdown(records), "utf8"),
    writeFile(resolve(outputDir, "OPS-001-EN-APPROVED-310.csv"), renderCsv(records), "utf8"),
    writeFile(resolve(outputDir, "OPS-001-EN-APPROVED-310.json"), JSON.stringify({
      generatedAt: new Date().toISOString(),
      branch: "feat/ops-001-end-to-end-design",
      teachingVersion: "V3_APPROVED",
      candidateIds: OPS_APPROVED_CANDIDATE_IDS,
      reviewSeeds: REVIEW_SEEDS,
      count: records.length,
      records,
    }, null, 2), "utf8"),
    writeFile(resolve(outputDir, "README.md"), `# OPS-001 approved English manual review\n\nOpen \`OPS-001-EN-APPROVED-310.html\` first.\n\nThis bundle contains 310 questions: ten deterministic seeds for each of the 31 retained logical contracts. Every record is generated through the V3 approved teaching runtime. The earlier V1 and V2 explanation exports remain rejected.\n\nReview order:\n\n1. question naturalness and symbol correctness;\n2. visible and simultaneous replacement/interchange;\n3. multiplication/division before addition/subtraction;\n4. complete-number versus digit identity;\n5. hidden-operation inference;\n6. option-selection justification;\n7. final answer consistency.\n`, "utf8"),
  ]);

  console.log("OPS-001 approved review bundle generated.", { records: records.length, outputDir });
}

await main();
