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

function letter(index: number): string {
  return "ABCD"[index] ?? "?";
}

function key(question: GeneratedBlrCp007EditorialV4Question): string {
  return question.codeKey.map((entry) =>
    `<span><b>${esc(entry.token)}</b> = ${esc(entry.relationId.replaceAll("_", " ").toLocaleLowerCase("en-IN"))}</span>`,
  ).join("");
}

function card(question: GeneratedBlrCp007EditorialV4Question, index: number): string {
  const options = question.options.map((option, optionIndex) =>
    `<li class="${option.isCorrectAnswerForTask ? "correct" : ""}"><b>${letter(optionIndex)}.</b> ${esc(option.text)}<p>${esc(option.studentExplanation)}</p></li>`,
  ).join("");
  return `<article><header><b>#${index + 1}</b><span>${esc(question.sourcePrototypeId)}</span><span>${esc(question.metadata.difficulty)}</span></header><p class="meta">${esc(question.itemId)} · ${esc(question.semanticScenarioId)}</p><div class="key">${key(question)}</div><p>${esc(question.sharedPrompt)}</p><pre>${esc(question.stem)}</pre><ol class="choices">${question.options.map((option, optionIndex) => `<li><b>${letter(optionIndex)}.</b> ${esc(option.text)}</li>`).join("")}</ol><details><summary>Answer and reasoning</summary><p class="answer"><b>Correct answer:</b> ${letter(question.correctIndex)}. ${esc(question.answer)}</p><ol>${question.explanation.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol><p><b>Conclusion:</b> ${esc(question.explanation.conclusion)}</p><p><b>Shortcut:</b> ${esc(question.explanation.shortcut ?? "—")}</p><p><b>Trap:</b> ${esc(question.explanation.commonTrap ?? "—")}</p><h3>Option analysis</h3><ol class="analysis">${options}</ol><h3>Connected family proof</h3><pre>${esc(question.explanation.familyTree.asciiFallback)}</pre><dl><div><dt>Components</dt><dd>${esc(question.metadata.candidateNetworkComponentCount)}</dd></div><div><dt>Disposition</dt><dd>${esc(question.metadata.disposition)}</dd></div><div><dt>Recommended use</dt><dd>${esc(question.metadata.recommendedUse)}</dd></div><div><dt>Blockers</dt><dd>${esc(question.metadata.activeEditorialBlockers.join(", "))}</dd></div></dl></details></article>`;
}

const outputDir = resolve(process.argv[2] ?? "cp007-editorial-v4-wave2-review-output");
mkdirSync(outputDir, { recursive: true });
const bank = generateBlrCp007EditorialV4Wave2Bank();
const ql034 = bank.filter((question) => question.qlId === "BLR-QL-034");
const telemetry = buildBlrCp007EditorialV4Wave2Telemetry(bank);
const answerCounts = Object.fromEntries(["P", "Q", "R", "S"].map((candidate) => [
  candidate,
  ql034.filter((question) => question.answer === candidate).length,
]));
const summary = {
  ...telemetry,
  ql034Questions: ql034.length,
  ql034ConnectedNetworks: ql034.filter((question) => question.metadata.candidateNetworkComponentCount === 1).length,
  ql034AnswerCounts: answerCounts,
};

writeFileSync(resolve(outputDir, "blr-cp007-v4-wave2-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(resolve(outputDir, "blr-cp007-v4-wave2-ql034-records.jsonl"), `${ql034.map((question) => JSON.stringify(question)).join("\n")}\n`);
writeFileSync(resolve(outputDir, "BLR-CP-007-V4-WAVE2-REVIEW.md"), `# BLR-CP-007 V4 Wave 2 Review\n\nStatus: **32-question QL-034 coherent-network human-review candidate; English freeze remains locked**.\n\n\`\`\`text\nQL-034 questions: ${ql034.length}\nconnected networks: ${summary.ql034ConnectedNetworks}\nrelease candidates chapter-wide: ${summary.releaseCandidateCount}\nremediation holds chapter-wide: ${summary.remediationHoldCount}\nP / Q / R / S answers: ${answerCounts.P} / ${answerCounts.Q} / ${answerCounts.R} / ${answerCounts.S}\n\`\`\`\n\nEvery candidate appears in the connected clue network. All four substitutions remain graph-valid, but exactly one establishes the requested relation. Human editorial approval is still required.\n`);
writeFileSync(resolve(outputDir, "blr-cp007-v4-wave2-ql034-review.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>BLR-CP-007 V4 Wave 2 QL-034 Review</title><style>:root{font-family:Inter,system-ui,sans-serif;color:#172033;background:#f3f6fa}*{box-sizing:border-box}body{margin:0}.hero{background:#172033;color:white;padding:28px}.hero p{color:#dce5f6}.warning{display:inline-block;background:#5b3810;border:1px solid #f2c26f;padding:8px;border-radius:8px;font-weight:800}main{max-width:1080px;margin:20px auto;padding:0 14px}article{background:white;border:1px solid #d9e1eb;border-radius:14px;padding:16px;margin:16px 0;box-shadow:0 4px 14px #1720330d}header{display:flex;gap:10px;justify-content:space-between;flex-wrap:wrap}.meta{font-size:12px;color:#68758a}.key{display:flex;gap:6px;flex-wrap:wrap}.key span{background:#edf7f1;border:1px solid #cce4d5;padding:6px 8px;border-radius:7px}pre{white-space:pre-wrap;background:#f7f9fc;padding:12px;border-radius:9px;font:600 15px/1.5 Inter,system-ui,sans-serif}.choices li{padding:4px}.answer{background:#edf8f1;padding:10px;border-radius:8px}.analysis{list-style:none;padding:0}.analysis li{background:#f7f9fc;border-left:4px solid #aab5c5;padding:9px;margin:7px 0}.analysis li.correct{background:#eff9f3;border-color:#268657}.analysis p{margin:5px 0 0}details summary{cursor:pointer;font-weight:800}dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:7px}dl div{background:#f4f6f9;padding:7px;border-radius:7px}dt{font-size:11px;color:#6b7788}dd{margin:3px 0 0;font-weight:700}</style></head><body><section class="hero"><h1>BLR-CP-007 V4 Wave 2 — QL-034 Coherent Networks</h1><p>32 missing-person questions rebuilt as connected family networks. Each candidate appears in the clues, each substitution remains graph-valid and exactly one completes the target relation.</p><span class="warning">Human review required — not frozen, localised, staged or released.</span></section><main>${ql034.map(card).join("")}</main></body></html>`);
console.log(JSON.stringify(summary, null, 2));
