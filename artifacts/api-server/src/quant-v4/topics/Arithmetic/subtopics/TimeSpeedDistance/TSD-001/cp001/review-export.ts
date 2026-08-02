import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateCp001FrozenEnglishReview } from "./freeze-registry";
import { inlineMathText } from "./pedagogy";
import { TSD_CP001_LEARNER_AUTHORITIES, TSD_CP001_NON_LEARNER_MODES, stableStringify } from "./runtime";

const frozenRecords = generateCp001FrozenEnglishReview();
const rows = Object.freeze(frozenRecords.map((record) => Object.freeze({
  ...record.sourceQuestion,
  permanentQlId: record.permanentQlId,
  englishDecision: record.englishDecision,
  lifecycle: Object.freeze({
    ...record.sourceQuestion.lifecycle,
    englishFreezeStatus: "FROZEN" as const,
    questionBankStatus: record.questionBankStatus,
    testEligibility: record.testEligibility,
    publiclyPublishable: record.publiclyPublishable,
  }),
})));

for (const row of rows) {
  if (!row.validation.valid) throw new Error(`${row.permanentQlId}: ${row.validation.errors.join("; ")}`);
  if (row.englishDecision !== "APPROVED") throw new Error(`${row.permanentQlId}: English approval is missing`);
  if (row.lifecycle.englishFreezeStatus !== "FROZEN") throw new Error(`${row.permanentQlId}: English freeze status is missing`);
  if (row.lifecycle.questionBankStatus !== "NOT_STORED" || row.lifecycle.testEligibility !== "INELIGIBLE" || row.publiclyPublishable) {
    throw new Error(`${row.permanentQlId}: delivery lock failed`);
  }
}

const outputDir = resolve(process.cwd(), "dist/quant-v4/tsd-001/cp001-review");
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "tsd-cp001-review.json"), `${stableStringify(rows)}\n`, "utf8");
writeFileSync(
  resolve(outputDir, "tsd-cp001-review.jsonl"),
  `${rows.map((row) => stableStringify(row)).join("\n")}\n`,
  "utf8",
);

const escapeHtml = (value: string): string => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const cards = rows.map((row, index) => {
  const correctLabel = ["A", "B", "C", "D"][row.correctIndex];
  const optionItems = row.options.map((option) =>
    `<li>${escapeHtml(inlineMathText(option))}</li>`,
  ).join("");
  const solutionSteps = row.explanation.stepByStepSolution.map((line) =>
    `<li>${escapeHtml(line)}</li>`,
  ).join("");
  const optionAnalysis = row.explanation.optionAnalysis.map((option) =>
    `<li class="${option.isCorrect ? "analysis-correct" : "analysis-wrong"}"><b>${option.isCorrect ? "✅" : "⚠️"} Option ${option.option} (${escapeHtml(inlineMathText(option.text))}):</b> ${escapeHtml(option.reason.replace(/^[✅⚠️]\s*/, ""))}</li>`,
  ).join("");

  return `
<article>
  <h2>${escapeHtml(row.permanentQlId)} · Question ${index + 1} <span>${escapeHtml(row.difficulty)}</span></h2>
  <p class="status">English: APPROVED/FROZEN · Question Bank: NOT_STORED · Tests: INELIGIBLE · Public: false</p>
  <p class="stem">${escapeHtml(row.stemMathJax)}</p>
  <ol type="A" class="options">${optionItems}</ol>
  <p class="correct-answer"><b>Correct Answer:</b> ${correctLabel} (${escapeHtml(inlineMathText(row.answerText))})</p>
  <section class="solution-tier rule-tier">
    <h3>📌 Main Rule</h3>
    <p>${escapeHtml(row.explanation.keyRule.replace(/^📌 Main Rule:\s*/i, ""))}</p>
  </section>
  <section class="solution-tier steps-tier">
    <h3>📝 Step-by-Step Solution</h3>
    <ol>${solutionSteps}</ol>
    <p class="answer"><b>${escapeHtml(row.explanation.conclusion)}</b></p>
  </section>
  <section class="solution-tier shortcut-tier">
    <h3>⚡ Exam Speed Trick</h3>
    <p>${escapeHtml(row.explanation.examSpeedShortcut.replace(/^⚡ Exam Speed Trick:\s*/i, ""))}</p>
  </section>
  <section class="solution-tier traps-tier">
    <h3>⚠️ Common Traps &amp; Option Analysis</h3>
    <ul class="analysis">${optionAnalysis}</ul>
  </section>
  <details><summary>Developer details</summary><p>${escapeHtml(row.provisionalAuthorityId)} | ${escapeHtml(row.solveMode)} | ${escapeHtml(row.seed)}</p><p>${escapeHtml(row.mathematicalFingerprint)}</p></details>
</article>`;
}).join("\n");

writeFileSync(resolve(outputDir, "tsd-cp001-review.html"), `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>TSD CP-001 Frozen English Review</title>
  <script>
    window.MathJax = { tex: { inlineMath: [['\\\\(', '\\\\)']], displayMath: [['\\\\[', '\\\\]']] }, svg: { fontCache: 'global' } };
  </script>
  <script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
  <style>
    body{font-family:Arial,sans-serif;max-width:940px;margin:24px auto;padding:0 14px;line-height:1.55;color:#222;background:#f6f7f9}
    article{background:#fff;border:1px solid #d8dce2;border-radius:12px;padding:22px;margin:22px 0;box-shadow:0 2px 8px rgba(0,0,0,.04)}
    h1{line-height:1.2}h2{font-size:18px;margin:0 0 6px}h2 span{font-size:12px;font-weight:400;border:1px solid #aaa;border-radius:12px;padding:2px 8px;margin-left:8px}
    .status{font-size:12px;color:#596573;margin:0 0 12px}.stem{font-weight:700;font-size:17px}.options{padding-left:28px}.options li{padding:3px 0}.correct-answer{border-top:1px solid #e4e7eb;padding-top:12px}
    .solution-tier{border-radius:8px;padding:12px 16px;margin-top:12px}.solution-tier h3{margin:0 0 8px;font-size:16px}.solution-tier p{margin:5px 0}.solution-tier ol,.solution-tier ul{margin:6px 0;padding-left:24px}
    .rule-tier{background:#eef6ff}.steps-tier{background:#f8f9fb}.shortcut-tier{background:#fff8df}.traps-tier{background:#fff1f1}
    .analysis{list-style:none!important;padding-left:0!important}.analysis li{padding:5px 0}.analysis-correct{color:#135f2f}.analysis-wrong{color:#713030}
    .answer{margin-top:10px!important}details{margin-top:14px;color:#666;font-size:12px}
  </style>
</head>
<body>
  <h1>Time, Speed and Distance — CP-001 Frozen English Review</h1>
  <p>${rows.length} approved English questions across ${TSD_CP001_LEARNER_AUTHORITIES.length} permanent learner authorities (${rows[0]?.permanentQlId} through ${rows.at(-1)?.permanentQlId}). ${TSD_CP001_NON_LEARNER_MODES.size} internal validator modes are excluded. Delivery remains disabled.</p>
  ${cards}
</body>
</html>`, "utf8");

console.log(JSON.stringify({
  status: "PASS",
  outputDir,
  rows: rows.length,
  permanentQlCount: new Set(rows.map((row) => row.permanentQlId)).size,
  permanentQlRange: `${rows[0]?.permanentQlId}..${rows.at(-1)?.permanentQlId}`,
  approvedEnglishRows: rows.filter((row) => row.englishDecision === "APPROVED").length,
  questionBankStored: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));
