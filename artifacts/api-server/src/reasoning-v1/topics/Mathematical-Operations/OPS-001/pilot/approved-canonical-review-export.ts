import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion,
  type ApprovedOpsQuestion,
} from "./approved-teaching-canonical";

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

function letter(index: number): string {
  return String.fromCharCode(65 + index);
}

function record(question: ApprovedOpsQuestion): ReviewRecord {
  return { ...question, reviewId: `${question.candidateId}-S${String(question.seed).padStart(3, "0")}` };
}

function renderCard(item: ReviewRecord, ordinal: number): string {
  const options = item.options.map((option, index) => `<li><b>${letter(index)}.</b> ${escapeHtml(option.value)}</li>`).join("");
  const steps = item.explanation.steps.map((step, index) => `
    <li>
      <strong>${index + 1}. ${escapeHtml(step.label)}</strong>
      <div class="trace"><span>${escapeHtml(step.expression)}</span><span class="arrow">→</span><span>${escapeHtml(step.result)}</span></div>
    </li>`).join("");
  return `<article class="card" data-cp="${escapeHtml(item.checkpointId)}" data-candidate="${escapeHtml(item.candidateId)}">
    <header><span><b>#${ordinal} ${escapeHtml(item.reviewId)}</b></span><span>${escapeHtml(item.checkpointId)} · ${escapeHtml(item.taskKind)}</span></header>
    <section class="question"><h2>${escapeHtml(item.stem)}</h2><ol class="options">${options}</ol></section>
    <section class="checks">
      <label><input type="checkbox"> Question natural</label>
      <label><input type="checkbox"> Symbols correct</label>
      <label><input type="checkbox"> Replacement visible</label>
      <label><input type="checkbox"> BODMAS correct</label>
      <label><input type="checkbox"> Option justified</label>
      <label><input type="checkbox"> Explanation teaches</label>
    </section>
    <label class="notes">Reviewer notes<textarea rows="3"></textarea></label>
    <details>
      <summary>Answer and approved V3 explanation</summary>
      <p class="answer"><b>Correct option: ${letter(item.correctIndex)} — ${escapeHtml(item.answer)}</b></p>
      <p><b>Method:</b> ${escapeHtml(item.explanation.ruleStatement)}</p>
      <ol class="steps">${steps}</ol>
      <p class="conclusion"><b>${escapeHtml(item.explanation.conclusion)}</b></p>
      <p class="proof">Solver: ${escapeHtml(item.proof.solverRoute)} · eligible ${item.proof.eligibleCandidateCount} · survivors ${item.proof.survivingCandidateCount}</p>
    </details>
  </article>`;
}

function renderHtml(records: readonly ReviewRecord[]): string {
  const cps = [...new Set(records.map((item) => item.checkpointId))].sort();
  const candidates = [...new Set(records.map((item) => item.candidateId))].sort();
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>OPS-001 Approved V3 English Review</title>
<style>
:root{font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.5;color:#18181b;background:#f4f4f5}body{margin:0}.toolbar{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid #d4d4d8;padding:10px 14px;display:flex;flex-wrap:wrap;gap:8px}.toolbar input,.toolbar select,.toolbar button{padding:8px;border:1px solid #a1a1aa;border-radius:6px;background:#fff}main{max-width:1080px;margin:auto;padding:20px}.hero,.card{background:#fff;border:1px solid #d4d4d8;border-radius:10px;margin-bottom:18px}.hero{padding:18px}.pass{background:#ecfdf5;border-left:5px solid #10b981;padding:10px}.card{overflow:hidden;break-inside:avoid}.card header{padding:10px 14px;background:#fafafa;border-bottom:1px solid #e4e4e7;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#52525b}.question{padding:14px}.question h2{font-size:1.08rem;margin-top:0}.options{list-style:none;padding:0;display:grid;gap:7px}.options li{border:1px solid #e4e4e7;border-radius:7px;padding:8px}.checks{padding:0 14px 12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:7px}.notes{display:block;padding:0 14px 14px;font-weight:700}.notes textarea{display:block;width:100%;box-sizing:border-box;margin-top:4px}details{border-top:1px solid #e4e4e7;padding:12px 14px;background:#fafafa}summary{font-weight:700;cursor:pointer}.answer{background:#ecfdf5;border-left:4px solid #10b981;padding:8px}.steps li{margin-bottom:12px}.trace{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1.5fr);gap:8px;background:#fff;border:1px solid #e4e4e7;border-radius:6px;padding:8px;margin-top:4px}.arrow{font-weight:800}.conclusion{background:#fff;padding:8px}.proof{font-size:.85rem;color:#52525b}.hidden{display:none!important}@media(max-width:650px){main{padding:9px}.trace{grid-template-columns:1fr}.arrow{transform:rotate(90deg);width:max-content}}@media print{.toolbar{display:none}main{max-width:none;padding:0}.card{page-break-inside:avoid}details{display:block}details>*{display:block}}
</style></head><body>
<div class="toolbar"><input id="search" placeholder="Search question, contract or explanation"><select id="cp"><option value="">All CPs</option>${cps.map((cp) => `<option>${cp}</option>`).join("")}</select><select id="candidate"><option value="">All contracts</option>${candidates.map((candidate) => `<option>${candidate}</option>`).join("")}</select><button onclick="toggleAll(true)">Open explanations</button><button onclick="toggleAll(false)">Close explanations</button><button onclick="window.print()">Print / Save PDF</button><span id="count"></span></div>
<main><section class="hero"><h1>OPS-001 Approved V3 English Review</h1><p class="pass"><b>310 canonical questions:</b> 31 retained logical contracts × 10 deterministic review seeds. The runtime has separately passed 3,100 teaching-quality test instances.</p><p>Review the question and options first, then open the explanation to verify replacement, operation order, inference and option justification.</p></section>${records.map(renderCard).join("\n")}</main>
<script>const cards=[...document.querySelectorAll('.card')],search=document.getElementById('search'),cp=document.getElementById('cp'),candidate=document.getElementById('candidate'),count=document.getElementById('count');function filter(){const q=search.value.trim().toLowerCase();let n=0;for(const card of cards){const ok=(!q||card.textContent.toLowerCase().includes(q))&&(!cp.value||card.dataset.cp===cp.value)&&(!candidate.value||card.dataset.candidate===candidate.value);card.classList.toggle('hidden',!ok);if(ok)n++}count.textContent=n+' visible'}function toggleAll(open){document.querySelectorAll('details').forEach(x=>x.open=open)}search.addEventListener('input',filter);cp.addEventListener('change',filter);candidate.addEventListener('change',filter);filter();</script>
</body></html>`;
}

function renderMarkdown(records: readonly ReviewRecord[]): string {
  const lines = ["# OPS-001 Approved V3 English Review", "", "310 canonical questions: 31 retained contracts × 10 review seeds.", ""];
  records.forEach((item, index) => {
    lines.push(`## ${index + 1}. ${item.reviewId} — ${item.checkpointId}`, "", `**Question:** ${item.stem}`, "");
    item.options.forEach((option, optionIndex) => lines.push(`${letter(optionIndex)}. ${option.value}`));
    lines.push("", "<details><summary>Answer and approved V3 explanation</summary>", "", `**Answer:** ${letter(item.correctIndex)} — ${item.answer}`, "", `**Method:** ${item.explanation.ruleStatement}`, "");
    item.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. **${step.label}:** ${step.expression} → ${step.result}`));
    lines.push("", `**Conclusion:** ${item.explanation.conclusion}`, "", "</details>", "", "Reviewer: [ ] question  [ ] symbols  [ ] replacement  [ ] BODMAS  [ ] option proof  [ ] teaching", "", "Notes: ________________________________________________", "");
  });
  return lines.join("\n");
}

function renderCsv(records: readonly ReviewRecord[]): string {
  const headers = ["reviewId","candidateId","checkpointId","seed","stem","optionA","optionB","optionC","optionD","correctIndex","answer","ruleStatement","steps","conclusion","solveMode","solverRoute","metadataJson"];
  const rows = records.map((item) => [item.reviewId,item.candidateId,item.checkpointId,item.seed,item.stem,...item.options.map((option)=>option.value),item.correctIndex,item.answer,item.explanation.ruleStatement,item.explanation.steps.map((step)=>`${step.label}: ${step.expression} -> ${step.result}`).join(" | "),item.explanation.conclusion,item.solveMode,item.proof.solverRoute,item.metadata]);
  return [headers.map(csvCell).join(","),...rows.map((row)=>row.map(csvCell).join(","))].join("\n");
}

async function main(): Promise<void> {
  const outputDir = resolve(process.argv[2] ?? "ops-001-approved-canonical-review");
  await rm(outputDir,{recursive:true,force:true});
  await mkdir(outputDir,{recursive:true});
  const records = OPS_APPROVED_CANDIDATE_IDS.flatMap((candidateId)=>REVIEW_SEEDS.map((seed)=>record(generateApprovedOpsQuestion(candidateId,seed))));
  if(records.length!==310) throw new Error(`Expected 310 records; found ${records.length}.`);
  await Promise.all([
    writeFile(resolve(outputDir,"OPS-001-EN-APPROVED-V3-310.html"),renderHtml(records),"utf8"),
    writeFile(resolve(outputDir,"OPS-001-EN-APPROVED-V3-310.md"),renderMarkdown(records),"utf8"),
    writeFile(resolve(outputDir,"OPS-001-EN-APPROVED-V3-310.csv"),renderCsv(records),"utf8"),
    writeFile(resolve(outputDir,"OPS-001-EN-APPROVED-V3-310.json"),JSON.stringify({generatedAt:new Date().toISOString(),branch:"feat/ops-001-end-to-end-design",teachingVersion:"V3_APPROVED",candidateIds:OPS_APPROVED_CANDIDATE_IDS,reviewSeeds:REVIEW_SEEDS,count:records.length,records},null,2),"utf8"),
    writeFile(resolve(outputDir,"README.md"),"# OPS-001 Approved V3 English Review\n\nOpen `OPS-001-EN-APPROVED-V3-310.html` first.\n\nThis bundle contains 310 canonical questions across all 31 retained contracts. The dedicated runtime proof tests 100 seeds per contract (3,100 total). Earlier V1/V2 review exports remain rejected.\n","utf8"),
  ]);
  console.log("OPS-001 canonical approved review generated.",{records:records.length,outputDir});
}

await main();
