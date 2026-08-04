import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { TSD_CP001_FROZEN_AUTHORITIES } from "./freeze-registry";
import { TSD_CP001_LEARNER_AUTHORITIES, TSD_CP001_NON_LEARNER_MODES, generateCp001ReviewRows, stableStringify } from "./runtime";

const rows = Object.freeze(generateCp001ReviewRows(3).map((sourceQuestion) => {
  const authority = TSD_CP001_FROZEN_AUTHORITIES.find((entry) => entry.solveMode === sourceQuestion.solveMode);
  if (!authority) throw new Error(`No current CP-001 review ID for ${sourceQuestion.solveMode}`);
  return Object.freeze({
    ...sourceQuestion,
    permanentQlId: authority.permanentQlId,
    authorityDecisionStatus: "REOPENED_PENDING_OVERLAP_AUDIT" as const,
  });
}));

for (const row of rows) {
  if (!row.validation.valid) throw new Error(`${row.permanentQlId}: ${row.validation.errors.join("; ")}`);
  if (row.lifecycle.reviewStatus !== "EDITORIAL_REVIEW_REQUIRED") throw new Error(`${row.permanentQlId}: editorial review was not reopened`);
  if (row.lifecycle.englishDecision !== "NEEDS_REVISION" || row.lifecycle.englishFreezeStatus !== "UNFROZEN") {
    throw new Error(`${row.permanentQlId}: stale English freeze status remains`);
  }
  if (row.lifecycle.questionBankStatus !== "NOT_STORED" || row.lifecycle.testEligibility !== "INELIGIBLE" || row.publiclyPublishable) {
    throw new Error(`${row.permanentQlId}: delivery lock failed`);
  }
}

const outputDir = resolve(process.cwd(), "dist/quant-v4/tsd-001/cp001-review");
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "tsd-cp001-review.json"), `${stableStringify(rows)}\n`, "utf8");
writeFileSync(resolve(outputDir, "tsd-cp001-review.jsonl"), `${rows.map((row) => stableStringify(row)).join("\n")}\n`, "utf8");

const escapeHtml = (value: string): string => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const cards = rows.map((row, index) => {
  const correctLabel = ["A", "B", "C", "D"][row.correctIndex];
  const optionItems = row.options.map((option) => `<li>${escapeHtml(option)}</li>`).join("");
  const solutionSteps = row.explanation.stepByStepSolution.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  const optionAnalysis = row.explanation.optionAnalysis.map((option) => {
    const cleanReason = option.reason.replace(/^[✅⚠️]\uFE0F?\s*/, "");
    return `<li class="${option.isCorrect ? "analysis-correct" : "analysis-wrong"}"><b>${option.isCorrect ? "✅" : "⚠️"} Option ${option.option} (${escapeHtml(option.text)}):</b> ${escapeHtml(cleanReason)}</li>`;
  }).join("");

  return `
<article>
  <h2>${escapeHtml(row.permanentQlId)} · Question ${index + 1} <span>${escapeHtml(row.difficulty.label)}</span></h2>
  <p class="status">Editorial status: NEEDS_REVISION / UNFROZEN · Difficulty: ${escapeHtml(row.difficulty.status)} · Question Bank: NOT_STORED · Tests: INELIGIBLE · Public: false</p>
  <p class="stem">${escapeHtml(row.stem)}</p>
  <ol type="A" class="options">${optionItems}</ol>
  <p class="correct-answer"><b>Correct Answer:</b> ${correctLabel} (${escapeHtml(row.answerText)})</p>
  <section class="solution-tier rule-tier"><h3>📌 Main Rule</h3><p>${escapeHtml(row.explanation.keyRule.replace(/^📌 Main Rule:\s*/i, ""))}</p></section>
  <section class="solution-tier steps-tier"><h3>📝 Step-by-Step Solution</h3><ol>${solutionSteps}</ol><p class="answer"><b>${escapeHtml(row.explanation.conclusion)}</b></p></section>
  <section class="solution-tier shortcut-tier"><h3>⚡ Exam Speed Trick</h3><p>${escapeHtml(row.explanation.examSpeedShortcut.replace(/^⚡ Exam Speed Trick:\s*/i, ""))}</p></section>
  <section class="solution-tier traps-tier"><h3>⚠️ Common Traps &amp; Option Analysis</h3><ul class="analysis">${optionAnalysis}</ul></section>
  <details><summary>Developer details</summary><p>${escapeHtml(row.questionLanguageId)} · ${escapeHtml(row.provisionalAuthorityId)} · ${escapeHtml(row.solveMode)} · ${escapeHtml(row.representation)} · ${escapeHtml(row.seed)}</p><p>${escapeHtml(row.mathematicalFingerprint)}</p></details>
</article>`;
}).join("\n");

writeFileSync(resolve(outputDir, "tsd-cp001-review.html"), `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TSD CP-001 P0 Editorial Remodel</title><style>
body{font-family:Arial,sans-serif;max-width:940px;margin:24px auto;padding:0 14px;line-height:1.55;color:#222;background:#f6f7f9}article{background:#fff;border:1px solid #d8dce2;border-radius:12px;padding:22px;margin:22px 0;box-shadow:0 2px 8px rgba(0,0,0,.04)}h1{line-height:1.2}h2{font-size:18px;margin:0 0 6px}h2 span{font-size:12px;font-weight:400;border:1px solid #aaa;border-radius:12px;padding:2px 8px;margin-left:8px}.status{font-size:12px;color:#8a3d14;margin:0 0 12px}.stem{font-weight:700;font-size:17px}.options{padding-left:28px}.options li{padding:3px 0}.correct-answer{border-top:1px solid #e4e7eb;padding-top:12px}.solution-tier{border-radius:8px;padding:12px 16px;margin-top:12px}.solution-tier h3{margin:0 0 8px;font-size:16px}.solution-tier p{margin:5px 0}.solution-tier ol,.solution-tier ul{margin:6px 0;padding-left:24px}.rule-tier{background:#eef6ff}.steps-tier{background:#f8f9fb}.shortcut-tier{background:#fff8df}.traps-tier{background:#fff1f1}.analysis{list-style:none!important;padding-left:0!important}.analysis li{padding:5px 0}.analysis-correct{color:#135f2f}.analysis-wrong{color:#713030}.answer{margin-top:10px!important}details{margin-top:14px;color:#666;font-size:12px}@media(max-width:600px){article{padding:14px}body{margin:8px auto}.stem{font-size:16px}}
</style></head><body><h1>Time, Speed and Distance — CP-001 P0 Editorial Remodel</h1><p>${rows.length} unfreezed review records across ${TSD_CP001_LEARNER_AUTHORITIES.length} current QL mappings. ${TSD_CP001_NON_LEARNER_MODES.size} internal validator modes are excluded. This artifact is not a refreeze approval.</p>${cards}</body></html>`, "utf8");

console.log(JSON.stringify({
  status: "PASS",
  phase: "P0_EDITORIAL_REMODEL",
  outputDir,
  rows: rows.length,
  currentReviewQlCount: new Set(rows.map((row) => row.permanentQlId)).size,
  currentReviewQlRange: `${rows[0]?.permanentQlId}..${rows.at(-1)?.permanentQlId}`,
  englishFreezeStatus: "UNFROZEN",
  questionBankStored: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));
