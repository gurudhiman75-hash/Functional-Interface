import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildBlrCp007EditorialV4Telemetry,
  generateBlrCp007EditorialV4Bank,
} from "./cp007-editorial-v4";
import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";

function esc(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function csv(value: unknown): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function optionLetter(index: number): string {
  return "ABCD"[index] ?? "?";
}

function keyHtml(question: GeneratedBlrCp007EditorialV4Question): string {
  return `<div class="key">${question.codeKey.map((entry) =>
    `<span><b>${esc(entry.token)}</b> = ${esc(entry.relationId.replaceAll("_", " ").toLocaleLowerCase("en-IN"))}</span>`,
  ).join("")}</div>`;
}

function explanationHtml(question: GeneratedBlrCp007EditorialV4Question): string {
  const analyses = question.explanation.optionAnalysis.map((analysis) =>
    `<li class="${analysis.isCorrectAnswerForTask ? "correct" : ""}"><b>${esc(analysis.optionLabel)}. ${esc(analysis.optionText)}</b><p>${esc(analysis.explanation)}</p></li>`,
  ).join("");
  return `<details class="answer"><summary>Answer and explanation</summary>
    <p class="answer-line"><b>Correct answer:</b> ${optionLetter(question.correctIndex)}. ${esc(question.answer)}</p>
    <h4>How to solve</h4><ol>${question.explanation.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>
    <p class="conclusion"><b>Conclusion:</b> ${esc(question.explanation.conclusion)}</p>
    <div class="tips"><p><b>Exam shortcut:</b> ${esc(question.explanation.shortcut ?? "—")}</p><p><b>Common trap:</b> ${esc(question.explanation.commonTrap ?? "—")}</p></div>
    <h4>Why the options work or fail</h4><ul class="analysis">${analyses}</ul>
    <details class="evidence"><summary>Family evidence</summary><p>${esc(question.explanation.diagramProof.description)}</p><pre>${esc(question.explanation.familyTree.asciiFallback)}</pre></details>
  </details>`;
}

function itemHtml(question: GeneratedBlrCp007EditorialV4Question, number: number): string {
  const options = question.options.map((option, index) =>
    `<li><b>${optionLetter(index)}.</b> ${esc(option.text)}</li>`,
  ).join("");
  const blockers = question.metadata.activeEditorialBlockers
    .filter((value) => value !== "HUMAN_EDITORIAL_APPROVAL_PENDING")
    .map((value) => `<span>${esc(value.replaceAll("_", " "))}</span>`)
    .join("");
  return `<article class="item" data-ql="${esc(question.qlId)}" data-disposition="${esc(question.metadata.disposition)}">
    <header><div><b>#${number}</b> <span class="pill ql">${esc(question.qlId)}</span></div><div><span class="pill">${esc(question.metadata.difficulty)}</span> <span class="pill use">${esc(question.metadata.recommendedUse)}</span></div></header>
    <p class="meta">${esc(question.sourcePrototypeId)} · ${esc(question.semanticScenarioId)}</p>
    ${question.delivery.promptPlacement === "ITEM" ? `${keyHtml(question)}<p class="prompt">${esc(question.sharedPrompt)}</p>` : ""}
    <pre class="stem">${esc(question.stem)}</pre>
    <ol class="options">${options}</ol>
    ${blockers ? `<div class="blockers">${blockers}</div>` : ""}
    ${explanationHtml(question)}
    <details class="admin"><summary>Administrator review proof</summary><dl>
      <div><dt>Question ID</dt><dd>${esc(question.itemId)}</dd></div>
      <div><dt>Disposition</dt><dd>${esc(question.metadata.disposition)}</dd></div>
      <div><dt>Recommended use</dt><dd>${esc(question.metadata.recommendedUse)}</dd></div>
      <div><dt>Reasoning depth</dt><dd>${esc(question.v4ReviewProof.reasoningDepth)}</dd></div>
      <div><dt>Decisive links</dt><dd>${esc(question.v4ReviewProof.decisiveLinkCount)}</dd></div>
      <div><dt>Candidate components</dt><dd>${esc(question.v4ReviewProof.candidateNetworkComponentCount ?? "n/a")}</dd></div>
      <div><dt>V4 fingerprint</dt><dd>${esc(question.metadata.v4EditorialFingerprint)}</dd></div>
      <div><dt>Review status</dt><dd>HUMAN_REVIEW_REQUIRED</dd></div>
    </dl></details>
  </article>`;
}

function standaloneSection(question: GeneratedBlrCp007EditorialV4Question, number: number): string {
  return `<section class="standalone">${itemHtml(question, number)}</section>`;
}

function setSection(
  setId: string,
  questions: readonly GeneratedBlrCp007EditorialV4Question[],
  numberById: ReadonlyMap<string, number>,
): string {
  const first = questions[0]!;
  return `<section class="set" data-disposition="${esc(first.metadata.disposition)}">
    <div class="set-head"><h2>Shared set · ${esc(setId)}</h2><p>The code key below applies to all four items and is intentionally shown once.</p>${keyHtml(first)}<p class="prompt">${esc(first.sharedPrompt)}</p></div>
    ${questions.map((question) => itemHtml(question, numberById.get(question.itemId)!)).join("")}
  </section>`;
}

function html(bank: readonly GeneratedBlrCp007EditorialV4Question[], summary: ReturnType<typeof buildBlrCp007EditorialV4Telemetry>): string {
  const numberById = new Map(bank.map((question, index) => [question.itemId, index + 1]));
  const sharedSets = new Map<string, GeneratedBlrCp007EditorialV4Question[]>();
  for (const question of bank) {
    if (question.delivery.mode !== "SHARED_SET" || !question.delivery.setId) continue;
    sharedSets.set(question.delivery.setId, [...(sharedSets.get(question.delivery.setId) ?? []), question]);
  }
  const renderedSets = new Set<string>();
  const sections: string[] = [];
  for (const question of bank) {
    if (question.delivery.mode === "STANDALONE") {
      sections.push(standaloneSection(question, numberById.get(question.itemId)!));
      continue;
    }
    const setId = question.delivery.setId!;
    if (renderedSets.has(setId)) continue;
    renderedSets.add(setId);
    const questions = [...sharedSets.get(setId)!].sort((a, b) =>
      (a.delivery.itemNumber ?? 0) - (b.delivery.itemNumber ?? 0),
    );
    sections.push(setSection(setId, questions, numberById));
  }

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>BLR-CP-007 Editorial V4 Review</title><style>
:root{font-family:Inter,system-ui,sans-serif;color:#172033;background:#f2f5f9}*{box-sizing:border-box}body{margin:0}.hero{background:#172033;color:#fff;padding:28px 22px}.hero h1{margin:0 0 8px}.hero p{color:#dce5f6;max-width:920px}.warning{display:inline-block;background:#5b3810;border:1px solid #f1bd61;padding:8px 10px;border-radius:8px;font-weight:800}.stats{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.stats span{background:#293850;padding:6px 9px;border-radius:8px}.controls{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid #d9e0e9;padding:10px 16px;display:flex;gap:8px;flex-wrap:wrap}.controls input,.controls select,.controls button{font:inherit;padding:8px 10px;border:1px solid #c8d0dc;border-radius:8px;background:#fff}main{max-width:1160px;margin:20px auto;padding:0 14px}.standalone,.set{margin:0 0 18px}.set{border:2px solid #9ab0cc;border-radius:15px;background:#eaf0f7;padding:12px}.set-head{background:#fff;border-radius:11px;padding:14px;margin-bottom:12px}.set-head h2{margin:0 0 5px}.item{background:#fff;border:1px solid #d8e0ea;border-radius:13px;padding:16px;margin:10px 0;box-shadow:0 4px 14px #1720330d}.item header{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}.pill{display:inline-block;padding:4px 8px;border-radius:999px;background:#fff0d4;font-size:12px;font-weight:800}.pill.ql{background:#e8efff}.pill.use{background:#e9f7ef}.meta{font-size:12px;color:#6a7485;overflow-wrap:anywhere}.key{display:flex;gap:6px;flex-wrap:wrap}.key span{background:#eef7f2;border:1px solid #cee6d7;padding:6px 8px;border-radius:7px}.prompt{color:#4f5b6e}.stem{white-space:pre-wrap;font:600 16px/1.55 Inter,system-ui,sans-serif;background:#f7f9fc;padding:12px;border-radius:9px}.options li{padding:4px}.answer{border-top:1px solid #e1e6ee;padding-top:10px}.answer summary,.evidence summary,.admin summary{cursor:pointer;font-weight:800}.answer-line{background:#edf8f1;padding:10px;border-radius:8px}.conclusion{background:#fff7dc;padding:10px;border-radius:8px}.tips{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px}.tips p{background:#f4f6f9;padding:9px;border-radius:8px}.analysis{list-style:none;padding:0}.analysis li{border-left:4px solid #aab5c5;background:#f7f9fc;padding:9px 11px;margin:7px 0}.analysis li.correct{border-color:#268657;background:#eff9f3}.analysis p{margin:5px 0 0}.blockers{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}.blockers span{background:#ffe7e3;color:#742719;padding:5px 7px;border-radius:7px;font-size:12px;font-weight:800}.admin{border:1px dashed #8b98aa;padding:9px;border-radius:8px;margin-top:10px}.admin dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:7px}.admin dl div{background:#f4f6f9;padding:7px;border-radius:7px}.admin dt{font-size:11px;color:#6b7788}.admin dd{margin:3px 0 0;font-weight:700;overflow-wrap:anywhere}.hidden{display:none!important}@media(max-width:700px){.item header{display:block}.controls input{width:100%}}
</style></head><body><section class="hero"><h1>BLR-CP-007 — Editorial V4 Exam-Readiness Review</h1><p>V4 keeps the validated graph solver, removes artificial colour-word codes, renders real shared sets, remodels explanations and separates foundation content from mock candidates. All 32 QL-034 questions remain on remediation hold because their candidate clues form disconnected networks.</p><span class="warning">Human review required — not frozen, localised, staged or released.</span><div class="stats"><span>${summary.releaseCandidateCount} release candidates</span><span>${summary.foundationPracticeCount} foundation items</span><span>${summary.remediationHoldCount} remediation holds</span><span>${summary.sharedSetCount} shared sets</span><span>${summary.keyStyleCounts.SYMBOL ?? 0} symbol-key questions</span></div></section><section class="controls"><input id="search" placeholder="Search question, relation, QL or prototype"/><select id="ql"><option value="">All QLs</option>${Object.keys(summary.qlCounts).map((ql) => `<option>${esc(ql)}</option>`).join("")}</select><select id="disposition"><option value="">All dispositions</option><option>RELEASE_CANDIDATE</option><option>FOUNDATION_PRACTICE</option><option>REMEDIATION_HOLD</option></select><button id="reveal">Reveal all</button><button id="hide">Hide all</button><span id="count">${bank.length} shown</span></section><main>${sections.join("")}</main><script>
const items=[...document.querySelectorAll('.item')],search=document.querySelector('#search'),ql=document.querySelector('#ql'),disposition=document.querySelector('#disposition'),count=document.querySelector('#count');function filter(){const term=search.value.toLowerCase();let shown=0;items.forEach(item=>{const visible=(!term||item.textContent.toLowerCase().includes(term))&&(!ql.value||item.dataset.ql===ql.value)&&(!disposition.value||item.dataset.disposition===disposition.value);item.classList.toggle('hidden',!visible);if(visible)shown++});document.querySelectorAll('.set').forEach(set=>set.classList.toggle('hidden',![...set.querySelectorAll('.item')].some(item=>!item.classList.contains('hidden'))));count.textContent=shown+' shown'}search.addEventListener('input',filter);ql.addEventListener('change',filter);disposition.addEventListener('change',filter);document.querySelector('#reveal').onclick=()=>document.querySelectorAll('.answer').forEach(x=>x.open=true);document.querySelector('#hide').onclick=()=>document.querySelectorAll('.answer').forEach(x=>x.open=false);
</script></body></html>`;
}

const outputDir = resolve(process.argv[2] ?? "cp007-editorial-v4-review-output");
mkdirSync(outputDir, { recursive: true });
const bank = generateBlrCp007EditorialV4Bank();
const summary = buildBlrCp007EditorialV4Telemetry(bank);
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v4-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v4-records.jsonl"), `${bank.map((question) => JSON.stringify(question)).join("\n")}\n`);
const csvRows = [
  ["itemId", "qlId", "prototype", "difficulty", "disposition", "recommendedUse", "delivery", "stem", "answer"].map(csv).join(","),
  ...bank.map((question) => [
    question.itemId,
    question.qlId,
    question.sourcePrototypeId,
    question.metadata.difficulty,
    question.metadata.disposition,
    question.metadata.recommendedUse,
    question.delivery.mode,
    question.stem,
    question.answer,
  ].map(csv).join(",")),
];
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v4-records.csv"), `${csvRows.join("\n")}\n`);
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v4-review.html"), html(bank, summary));
writeFileSync(resolve(outputDir, "BLR-CP-007-EDITORIAL-V4-REVIEW.md"), `# BLR-CP-007 Editorial V4 Review\n\nStatus: **human-review candidate; no freeze or release authorised**.\n\n\`\`\`text\nrecords: ${summary.recordCount}\nrelease candidates: ${summary.releaseCandidateCount}\nfoundation practice: ${summary.foundationPracticeCount}\nremediation hold: ${summary.remediationHoldCount}\nshared sets: ${summary.sharedSetCount}\nneutral-word codes: ${summary.neutralWordCodeQuestions}\ncolour-token occurrences: ${summary.colourTokenOccurrences}\nQL-034 disconnected networks: ${summary.ql034DisconnectedNetworkCount}\n\`\`\`\n\nThe 32 QL-034 items remain excluded from release pending coherent connected-network reconstruction.\n`);
console.log(JSON.stringify(summary, null, 2));
