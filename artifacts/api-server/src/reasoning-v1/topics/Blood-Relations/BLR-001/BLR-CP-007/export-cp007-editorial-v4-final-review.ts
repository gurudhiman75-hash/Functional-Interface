import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildBlrCp007EditorialV4Wave2Telemetry,
  generateBlrCp007EditorialV4Wave2Bank,
} from "./cp007-editorial-v4-wave2";
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

function letter(index: number): string {
  return "ABCD"[index] ?? "?";
}

function codeKeyHtml(question: GeneratedBlrCp007EditorialV4Question): string {
  return `<div class="key">${question.codeKey.map((entry) =>
    `<span><b>${esc(entry.token)}</b> = ${esc(entry.relationId.replaceAll("_", " ").toLocaleLowerCase("en-IN"))}</span>`,
  ).join("")}</div>`;
}

function explanationHtml(question: GeneratedBlrCp007EditorialV4Question): string {
  return `<details class="answer"><summary>Answer and explanation</summary>
    <p class="answer-line"><b>Correct answer:</b> ${letter(question.correctIndex)}. ${esc(question.answer)}</p>
    <h4>How to solve</h4>
    <ol>${question.explanation.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>
    <p class="conclusion"><b>Conclusion:</b> ${esc(question.explanation.conclusion)}</p>
    <div class="tips">
      <p><b>Exam shortcut:</b> ${esc(question.explanation.shortcut ?? "—")}</p>
      <p><b>Common trap:</b> ${esc(question.explanation.commonTrap ?? "—")}</p>
    </div>
    <h4>Why the options work or fail</h4>
    <ul class="analysis">${question.explanation.optionAnalysis.map((analysis) =>
      `<li class="${analysis.isCorrectAnswerForTask ? "correct" : ""}"><b>${esc(analysis.optionLabel)}. ${esc(analysis.optionText)}</b><p>${esc(analysis.explanation)}</p></li>`,
    ).join("")}</ul>
    <details class="evidence"><summary>Family evidence</summary>
      <p>${esc(question.explanation.familyTree.accessibleSummary)}</p>
      <pre>${esc(question.explanation.familyTree.asciiFallback)}</pre>
    </details>
  </details>`;
}

function itemHtml(question: GeneratedBlrCp007EditorialV4Question, number: number): string {
  const options = question.options.map((option, index) =>
    `<li><b>${letter(index)}.</b> ${esc(option.text)}</li>`,
  ).join("");
  return `<article class="item" data-ql="${esc(question.qlId)}" data-use="${esc(question.metadata.recommendedUse)}" data-disposition="${esc(question.metadata.disposition)}">
    <header>
      <div><b>#${number}</b> <span class="pill ql">${esc(question.qlId)}</span></div>
      <div><span class="pill">${esc(question.metadata.difficulty)}</span> <span class="pill use">${esc(question.metadata.recommendedUse)}</span></div>
    </header>
    <p class="meta">${esc(question.sourcePrototypeId)} · ${esc(question.semanticScenarioId)}</p>
    ${question.delivery.promptPlacement === "ITEM" ? `${codeKeyHtml(question)}<p class="prompt">${esc(question.sharedPrompt)}</p>` : ""}
    <pre class="stem">${esc(question.stem)}</pre>
    <ol class="options">${options}</ol>
    ${explanationHtml(question)}
    <details class="admin"><summary>Administrator review proof</summary><dl>
      <div><dt>Question ID</dt><dd>${esc(question.itemId)}</dd></div>
      <div><dt>Disposition</dt><dd>${esc(question.metadata.disposition)}</dd></div>
      <div><dt>Recommended use</dt><dd>${esc(question.metadata.recommendedUse)}</dd></div>
      <div><dt>Reasoning depth</dt><dd>${esc(question.v4ReviewProof.reasoningDepth)}</dd></div>
      <div><dt>Decisive links</dt><dd>${esc(question.v4ReviewProof.decisiveLinkCount)}</dd></div>
      <div><dt>Candidate components</dt><dd>${esc(question.metadata.candidateNetworkComponentCount ?? "n/a")}</dd></div>
      <div><dt>V4 fingerprint</dt><dd>${esc(question.metadata.v4EditorialFingerprint)}</dd></div>
      <div><dt>Active blocker</dt><dd>${esc(question.metadata.activeEditorialBlockers.join(", "))}</dd></div>
    </dl></details>
  </article>`;
}

function setHtml(
  setId: string,
  questions: readonly GeneratedBlrCp007EditorialV4Question[],
  numberById: ReadonlyMap<string, number>,
): string {
  const first = questions[0]!;
  return `<section class="set">
    <div class="set-head">
      <h2>Shared set · ${esc(setId)}</h2>
      <p>The code key and common instruction below apply to all four items and are shown once.</p>
      ${codeKeyHtml(first)}
      <p class="prompt">${esc(first.sharedPrompt)}</p>
    </div>
    ${questions.map((question) => itemHtml(question, numberById.get(question.itemId)!)).join("")}
  </section>`;
}

function renderHtml(
  bank: readonly GeneratedBlrCp007EditorialV4Question[],
  summary: ReturnType<typeof buildBlrCp007EditorialV4Wave2Telemetry>,
): string {
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
      sections.push(itemHtml(question, numberById.get(question.itemId)!));
      continue;
    }
    const setId = question.delivery.setId!;
    if (renderedSets.has(setId)) continue;
    renderedSets.add(setId);
    const questions = [...sharedSets.get(setId)!].sort((left, right) =>
      (left.delivery.itemNumber ?? 0) - (right.delivery.itemNumber ?? 0),
    );
    sections.push(setHtml(setId, questions, numberById));
  }

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>BLR-CP-007 Editorial V4 Final Review</title><style>
:root{font-family:Inter,system-ui,sans-serif;color:#172033;background:#f2f5f9}*{box-sizing:border-box}body{margin:0}.hero{background:#172033;color:#fff;padding:28px 22px}.hero h1{margin:0 0 8px}.hero p{max-width:980px;color:#dce5f6}.warning{display:inline-block;background:#5b3810;border:1px solid #efbd68;border-radius:8px;padding:8px 10px;font-weight:800}.stats{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.stats span{background:#293850;border-radius:8px;padding:6px 9px}.controls{position:sticky;top:0;z-index:10;display:flex;gap:8px;flex-wrap:wrap;background:#fff;border-bottom:1px solid #d8e0ea;padding:10px 16px}.controls input,.controls select,.controls button{font:inherit;border:1px solid #c7d0dc;border-radius:8px;padding:8px 10px;background:#fff}main{max-width:1160px;margin:20px auto;padding:0 14px}.set{border:2px solid #9ab0cc;border-radius:15px;background:#eaf0f7;padding:12px;margin:18px 0}.set-head{background:#fff;border-radius:11px;padding:14px}.set-head h2{margin:0 0 5px}.item{background:#fff;border:1px solid #d8e0ea;border-radius:13px;padding:16px;margin:12px 0;box-shadow:0 4px 14px #1720330d}.item>header{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}.pill{display:inline-block;border-radius:999px;background:#fff0d4;padding:4px 8px;font-size:12px;font-weight:800}.pill.ql{background:#e8efff}.pill.use{background:#e9f7ef}.meta{font-size:12px;color:#69768a;overflow-wrap:anywhere}.key{display:flex;gap:6px;flex-wrap:wrap}.key span{background:#eef7f2;border:1px solid #cee6d7;border-radius:7px;padding:6px 8px}.prompt{color:#4f5b6e}.stem{white-space:pre-wrap;background:#f7f9fc;border-radius:9px;padding:12px;font:600 16px/1.55 Inter,system-ui,sans-serif}.options li{padding:4px}.answer{border-top:1px solid #e1e6ee;padding-top:10px}.answer summary,.evidence summary,.admin summary{cursor:pointer;font-weight:800}.answer-line{background:#edf8f1;border-radius:8px;padding:10px}.conclusion{background:#fff7dc;border-radius:8px;padding:10px}.tips{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px}.tips p{background:#f4f6f9;border-radius:8px;padding:9px}.analysis{list-style:none;padding:0}.analysis li{background:#f7f9fc;border-left:4px solid #aab5c5;padding:9px 11px;margin:7px 0}.analysis li.correct{background:#eff9f3;border-color:#268657}.analysis p{margin:5px 0 0}.admin{border:1px dashed #8b98aa;border-radius:8px;padding:9px;margin-top:10px}.admin dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:7px}.admin dl div{background:#f4f6f9;border-radius:7px;padding:7px}.admin dt{font-size:11px;color:#6b7788}.admin dd{margin:3px 0 0;font-weight:700;overflow-wrap:anywhere}.hidden{display:none!important}@media(max-width:700px){.controls input{width:100%}.item>header{display:block}}
</style></head><body><section class="hero"><h1>BLR-CP-007 — Editorial V4 Final Human Review</h1><p>This is the complete final V4 English corpus: exam-style symbol and letter codes, genuine four-item shared sets, reasoning-depth calibration, remodelled explanations and 32 connected QL-034 missing-person networks.</p><span class="warning">Human approval required — English freeze, localisation and all product delivery remain locked.</span><div class="stats"><span>${summary.recordCount} questions</span><span>${summary.releaseCandidateCount} release candidates</span><span>${summary.foundationPracticeCount} foundation items</span><span>${summary.remediationHoldCount} holds</span><span>${summary.sharedSetCount} shared sets</span></div></section><section class="controls"><input id="search" placeholder="Search question, relation, QL or prototype"/><select id="ql"><option value="">All QLs</option>${Object.keys(summary.qlCounts).map((ql) => `<option>${esc(ql)}</option>`).join("")}</select><select id="use"><option value="">All uses</option><option>GUIDED_PRACTICE</option><option>STANDARD_MOCK</option><option>ADVANCED_PRACTICE</option></select><button id="reveal">Reveal all</button><button id="hide">Hide all</button><span id="count">${bank.length} shown</span></section><main>${sections.join("")}</main><script>
const items=[...document.querySelectorAll('.item')],search=document.querySelector('#search'),ql=document.querySelector('#ql'),use=document.querySelector('#use'),count=document.querySelector('#count');function filter(){const term=search.value.toLowerCase();let shown=0;items.forEach(item=>{const visible=(!term||item.textContent.toLowerCase().includes(term))&&(!ql.value||item.dataset.ql===ql.value)&&(!use.value||item.dataset.use===use.value);item.classList.toggle('hidden',!visible);if(visible)shown++});document.querySelectorAll('.set').forEach(set=>set.classList.toggle('hidden',![...set.querySelectorAll('.item')].some(item=>!item.classList.contains('hidden'))));count.textContent=shown+' shown'}search.addEventListener('input',filter);ql.addEventListener('change',filter);use.addEventListener('change',filter);document.querySelector('#reveal').onclick=()=>document.querySelectorAll('.answer').forEach(value=>value.open=true);document.querySelector('#hide').onclick=()=>document.querySelectorAll('.answer').forEach(value=>value.open=false);
</script></body></html>`;
}

const outputDir = resolve(process.argv[2] ?? "cp007-editorial-v4-final-review-output");
mkdirSync(outputDir, { recursive: true });
const bank = generateBlrCp007EditorialV4Wave2Bank();
const summary = buildBlrCp007EditorialV4Wave2Telemetry(bank);
const answerPositions = [0, 1, 2, 3].map((index) =>
  bank.filter((question) => question.correctIndex === index).length,
);
const finalSummary = {
  ...summary,
  answerPositions,
  finalReviewRecordCount: bank.length,
  finalReviewUniqueStemCount: new Set(bank.map((question) => question.stem)).size,
  finalReviewUniqueEditorialFingerprintCount: new Set(bank.map((question) => question.metadata.v4EditorialFingerprint)).size,
};
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v4-final-summary.json"), `${JSON.stringify(finalSummary, null, 2)}\n`);
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v4-final-records.jsonl"), `${bank.map((question) => JSON.stringify(question)).join("\n")}\n`);
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
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v4-final-records.csv"), `${csvRows.join("\n")}\n`);
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v4-final-review.html"), renderHtml(bank, summary));
writeFileSync(resolve(outputDir, "BLR-CP-007-EDITORIAL-V4-FINAL-REVIEW.md"), `# BLR-CP-007 Editorial V4 Final Review\n\nStatus: **complete 168-question English human-review candidate; approval and freeze remain locked**.\n\n\`\`\`text\nrecords: ${summary.recordCount}\nrelease candidates: ${summary.releaseCandidateCount}\nfoundation practice: ${summary.foundationPracticeCount}\nremediation holds: ${summary.remediationHoldCount}\nshared sets: ${summary.sharedSetCount}\nneutral-word codes: ${summary.neutralWordCodeQuestions}\ncolour-token occurrences: ${summary.colourTokenOccurrences}\nQL-034 disconnected networks: ${summary.ql034DisconnectedNetworkCount}\nanswer positions: ${answerPositions.join(" / ")}\nunique stems: ${finalSummary.finalReviewUniqueStemCount}\n\`\`\`\n\nAll 32 QL-034 questions now use connected candidate networks. Human review of this final combined pack is required before a renewed chapter-wide English audit or any freeze decision.\n`);
console.log(JSON.stringify(finalSummary, null, 2));
