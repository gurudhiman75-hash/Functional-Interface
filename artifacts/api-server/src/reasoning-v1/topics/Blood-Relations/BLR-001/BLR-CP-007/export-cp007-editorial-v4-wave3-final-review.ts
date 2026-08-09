import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildBlrCp007EditorialV4Wave3FinalTelemetry,
  generateBlrCp007EditorialV4Wave3FinalBank,
} from "./cp007-editorial-v4-wave3-final";
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

function keyHtml(question: GeneratedBlrCp007EditorialV4Question): string {
  return `<div class="key">${question.codeKey.map((entry) =>
    `<span><b>${esc(entry.token)}</b> = ${esc(entry.relationId.replaceAll("_", " ").toLocaleLowerCase("en-IN"))}</span>`,
  ).join("")}</div>`;
}

function itemHtml(question: GeneratedBlrCp007EditorialV4Question, number: number): string {
  const options = question.options.map((option, index) =>
    `<li><b>${letter(index)}.</b> ${esc(option.text)}</li>`,
  ).join("");
  const analysis = question.explanation.optionAnalysis.map((option) =>
    `<li class="${option.isCorrectAnswerForTask ? "correct" : ""}"><b>${esc(option.optionLabel)}. ${esc(option.optionText)}</b><p>${esc(option.explanation)}</p></li>`,
  ).join("");
  return `<article class="item" data-ql="${esc(question.qlId)}" data-use="${esc(question.metadata.recommendedUse)}">
    <header><b>#${number}</b><span>${esc(question.qlId)} · ${esc(question.metadata.difficulty)} · ${esc(question.metadata.recommendedUse)}</span></header>
    <p class="meta">${esc(question.sourcePrototypeId)} · ${esc(question.topologyId)}</p>
    ${question.delivery.promptPlacement === "ITEM" ? `${keyHtml(question)}<p>${esc(question.sharedPrompt)}</p>` : ""}
    <pre class="stem">${esc(question.stem)}</pre>
    <ol>${options}</ol>
    <details><summary>Answer and explanation</summary>
      <p class="answer"><b>${letter(question.correctIndex)}. ${esc(question.answer)}</b></p>
      <h4>How to solve</h4><ol>${question.explanation.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>
      <p class="conclusion"><b>Conclusion:</b> ${esc(question.explanation.conclusion)}</p>
      <div class="tips"><p><b>Exam shortcut:</b> ${esc(question.explanation.shortcut ?? "—")}</p><p><b>Common trap:</b> ${esc(question.explanation.commonTrap ?? "—")}</p></div>
      <h4>Why the options work or fail</h4><ul class="analysis">${analysis}</ul>
    </details>
  </article>`;
}

function renderHtml(
  bank: readonly GeneratedBlrCp007EditorialV4Question[],
  summary: ReturnType<typeof buildBlrCp007EditorialV4Wave3FinalTelemetry>,
): string {
  const numberById = new Map(bank.map((question, index) => [question.itemId, index + 1]));
  const sets = new Map<string, GeneratedBlrCp007EditorialV4Question[]>();
  for (const question of bank) {
    if (question.delivery.mode !== "SHARED_SET" || !question.delivery.setId) continue;
    sets.set(question.delivery.setId, [...(sets.get(question.delivery.setId) ?? []), question]);
  }
  const rendered = new Set<string>();
  const sections: string[] = [];
  for (const question of bank) {
    if (question.delivery.mode === "STANDALONE") {
      sections.push(itemHtml(question, numberById.get(question.itemId)!));
      continue;
    }
    const setId = question.delivery.setId!;
    if (rendered.has(setId)) continue;
    rendered.add(setId);
    const questions = [...sets.get(setId)!].sort((a, b) => (a.delivery.itemNumber ?? 0) - (b.delivery.itemNumber ?? 0));
    sections.push(`<section class="set"><div class="sethead"><h2>Shared set · ${esc(setId)}</h2><p>The key below applies to all four questions.</p>${keyHtml(questions[0]!)}<p>${esc(questions[0]!.sharedPrompt)}</p></div>${questions.map((item) => itemHtml(item, numberById.get(item.itemId)!)).join("")}</section>`);
  }
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>BLR-CP-007 V4 Wave 3 Final Review</title><style>
:root{font-family:Inter,system-ui,sans-serif;color:#172033;background:#f3f6fa}*{box-sizing:border-box}body{margin:0}.hero{background:#172033;color:#fff;padding:28px}.hero p{max-width:980px}.warning{display:inline-block;background:#5b3810;border:1px solid #f1bd61;padding:8px 10px;border-radius:8px;font-weight:800}.stats{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.stats span{background:#293850;padding:6px 9px;border-radius:8px}.controls{position:sticky;top:0;background:#fff;border-bottom:1px solid #d8e0ea;padding:10px;z-index:5}.controls input,.controls select,.controls button{padding:8px;margin:3px;border:1px solid #c7d0dc;border-radius:8px}main{max-width:1160px;margin:20px auto;padding:0 14px}.set{background:#e9f0f8;border:2px solid #9ab0cc;border-radius:14px;padding:12px;margin:18px 0}.sethead,.item{background:#fff;border-radius:11px;padding:14px;margin:10px 0}.item{border:1px solid #d8e0ea}.item header{display:flex;justify-content:space-between;gap:8px}.meta{font-size:12px;color:#6a7485}.key{display:flex;flex-wrap:wrap;gap:6px}.key span{background:#eef7f2;border:1px solid #cee6d7;padding:6px;border-radius:7px}.stem{white-space:pre-wrap;background:#f7f9fc;padding:12px;border-radius:8px;font:600 16px/1.5 Inter,system-ui}.answer{background:#edf8f1;padding:9px;border-radius:8px}.conclusion{background:#fff7dc;padding:9px;border-radius:8px}.tips{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px}.tips p{background:#f4f6f9;padding:9px;border-radius:8px}.analysis{list-style:none;padding:0}.analysis li{border-left:4px solid #aab5c5;background:#f7f9fc;padding:8px;margin:7px 0}.analysis li.correct{border-color:#268657;background:#eff9f3}.hidden{display:none!important}
</style></head><body><section class="hero"><h1>BLR-CP-007 — V4 Wave 3 Final Human Review</h1><p>Complete 168-question English corpus after self-review remediation, semantic option-security proof, compact connected missing-person networks and final learner-facing polish.</p><span class="warning">Product-owner approval required — not frozen, localised, staged or released.</span><div class="stats"><span>${summary.recordCount} questions</span><span>${summary.releaseCandidateCount} release candidates</span><span>${summary.foundationPracticeCount} foundation items</span><span>${summary.semanticAmbiguityCount} semantic ambiguities</span><span>${summary.ql034DistinctDecisiveStructureCount} QL-034 structures</span><span>${summary.ql034AverageStatementCount} average QL-034 statements</span></div></section><section class="controls"><input id="search" placeholder="Search"/><select id="ql"><option value="">All QLs</option>${Object.keys(summary.qlCounts).map((ql) => `<option>${esc(ql)}</option>`).join("")}</select><button id="reveal">Reveal all</button><button id="hide">Hide all</button><span id="count">${bank.length} shown</span></section><main>${sections.join("")}</main><script>
const items=[...document.querySelectorAll('.item')],search=document.querySelector('#search'),ql=document.querySelector('#ql'),count=document.querySelector('#count');function filter(){const term=search.value.toLowerCase();let shown=0;items.forEach(item=>{const visible=(!term||item.textContent.toLowerCase().includes(term))&&(!ql.value||item.dataset.ql===ql.value);item.classList.toggle('hidden',!visible);if(visible)shown++});document.querySelectorAll('.set').forEach(set=>set.classList.toggle('hidden',![...set.querySelectorAll('.item')].some(item=>!item.classList.contains('hidden'))));count.textContent=shown+' shown'}search.oninput=filter;ql.onchange=filter;document.querySelector('#reveal').onclick=()=>document.querySelectorAll('details').forEach(x=>x.open=true);document.querySelector('#hide').onclick=()=>document.querySelectorAll('details').forEach(x=>x.open=false);
</script></body></html>`;
}

const outputDir = resolve(process.argv[2] ?? "cp007-editorial-v4-wave3-final-review-output");
mkdirSync(outputDir, { recursive: true });
const bank = generateBlrCp007EditorialV4Wave3FinalBank();
const summary = buildBlrCp007EditorialV4Wave3FinalTelemetry(bank);
const answerPositions = [0, 1, 2, 3].map((index) => bank.filter((question) => question.correctIndex === index).length);
const finalSummary = {
  ...summary,
  answerPositions,
  uniqueStemCount: new Set(bank.map((question) => question.stem)).size,
  uniqueFingerprintCount: new Set(bank.map((question) => question.metadata.v4EditorialFingerprint)).size,
};
writeFileSync(resolve(outputDir, "blr-cp007-v4-wave3-final-summary.json"), `${JSON.stringify(finalSummary, null, 2)}\n`);
writeFileSync(resolve(outputDir, "blr-cp007-v4-wave3-final-records.jsonl"), `${bank.map((question) => JSON.stringify(question)).join("\n")}\n`);
const csvRows = [
  ["itemId", "qlId", "prototype", "topology", "difficulty", "recommendedUse", "keySize", "stem", "answer"].map(csv).join(","),
  ...bank.map((question) => [question.itemId, question.qlId, question.sourcePrototypeId, question.topologyId, question.metadata.difficulty, question.metadata.recommendedUse, question.codeKey.length, question.stem, question.answer].map(csv).join(",")),
];
writeFileSync(resolve(outputDir, "blr-cp007-v4-wave3-final-records.csv"), `${csvRows.join("\n")}\n`);
writeFileSync(resolve(outputDir, "blr-cp007-v4-wave3-final-review.html"), renderHtml(bank, summary));
writeFileSync(resolve(outputDir, "BLR-CP-007-V4-WAVE3-FINAL-REVIEW.md"), `# BLR-CP-007 V4 Wave 3 Final Review\n\nStatus: **product-owner human-review candidate; no freeze or release authorised**.\n\n\`\`\`text\nrecords: ${summary.recordCount}\nrelease candidates: ${summary.releaseCandidateCount}\nfoundation practice: ${summary.foundationPracticeCount}\nsemantic ambiguities: ${summary.semanticAmbiguityCount}\nmalformed learner explanations: ${summary.malformedLearnerExplanationCount}\nQL-032 blank-meaning mismatches: ${summary.ql032BlankMeaningMismatchCount}\nlearner token-word occurrences: ${summary.learnerTokenWordOccurrences}\ncode/person collisions: ${summary.codePersonCollisionCount}\nQL-031 single-position derived distractors: ${summary.ql031SinglePositionDerivedDistractorCount}\nQL-033 fixed-blank questions: ${summary.ql033FixedBlankOptionCount}\nQL-034 distinct decisive structures: ${summary.ql034DistinctDecisiveStructureCount}\nQL-034 maximum statements: ${summary.ql034MaximumStatementCount}\nQL-034 average statements: ${summary.ql034AverageStatementCount}\nmaximum shortcut repetition: ${summary.maximumExactShortcutRepeat}\nmaximum trap repetition: ${summary.maximumExactTrapRepeat}\naverage displayed key size: ${summary.averageDisplayedCodeKeySize}\nanswer positions: ${answerPositions.join(" / ")}\n\`\`\`\n`);
console.log(JSON.stringify(finalSummary, null, 2));
