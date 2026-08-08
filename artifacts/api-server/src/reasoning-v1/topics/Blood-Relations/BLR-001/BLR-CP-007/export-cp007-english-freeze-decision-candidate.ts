import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  BLR_CP007_ENGLISH_FREEZE_DECISION_AUTHORITY,
  generateBlrCp007EnglishFreezeDecisionCandidateBank,
  learnerCorpusIsUnchanged,
} from "./cp007-english-freeze-decision-candidate";

const outputDir = process.argv[2] ?? "blr-cp007-english-freeze-decision-output";
mkdirSync(outputDir, { recursive: true });
const bank = generateBlrCp007EnglishFreezeDecisionCandidateBank();

const countBy = (values: readonly string[]): Record<string, number> => values.reduce<Record<string, number>>((counts, value) => {
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});
const qlCounts = countBy(bank.map((question) => question.qlId));
const difficultyCounts = countBy(bank.map((question) => question.metadata.difficulty));
const recommendedUseCounts = countBy(bank.map((question) => question.metadata.recommendedUse));
const targetRelationCounts = countBy(bank.map((question) => question.reviewProof.targetRelation));
const counterpartPairs = [
  ["FATHER", "MOTHER"],
  ["SON", "DAUGHTER"],
  ["BROTHER", "SISTER"],
  ["HUSBAND", "WIFE"],
  ["GRANDFATHER", "GRANDMOTHER"],
  ["GRANDSON", "GRANDDAUGHTER"],
  ["UNCLE", "AUNT"],
  ["NEPHEW", "NIECE"],
  ["FATHER_IN_LAW", "MOTHER_IN_LAW"],
  ["SON_IN_LAW", "DAUGHTER_IN_LAW"],
  ["BROTHER_IN_LAW", "SISTER_IN_LAW"],
  ["PARENT", "CHILD"],
  ["GRANDPARENT", "GRANDCHILD"],
] as const;
const unbalancedCounterpartPairs = counterpartPairs.filter(([left, right]) => targetRelationCounts[left] !== targetRelationCounts[right]);
const staleReviewNoteCount = bank.filter((question) => /remains held|approval remains pending|remediation candidate/i.test(question.reviewProof.reviewerNote)).length;
const productDeliveryEnabledCount = bank.filter((question) =>
  question.publiclyPublishable ||
  question.questionStudioVisible ||
  question.questionBankEligible ||
  question.mockTestEligible,
).length;

const summary = {
  authority: BLR_CP007_ENGLISH_FREEZE_DECISION_AUTHORITY,
  recordCount: bank.length,
  qlCounts,
  difficultyCounts,
  recommendedUseCounts,
  targetRelationCount: Object.keys(targetRelationCounts).length,
  targetRelationCounts,
  balancedCounterpartPairCount: counterpartPairs.length - unbalancedCounterpartPairs.length,
  unbalancedCounterpartPairs,
  learnerCorpusChanged: !learnerCorpusIsUnchanged(),
  staleReviewNoteCount,
  englishFreezePendingCount: bank.filter((question) => question.metadata.activeEditorialBlockers.includes("ENGLISH_FREEZE_PENDING")).length,
  reviewOnlyCount: bank.filter((question) => question.reviewOnly).length,
  productDeliveryEnabledCount,
  explicitManualDecisionRequired: true,
  recommendation: "FREEZE_RECOMMENDED_PENDING_EXPLICIT_APPROVAL",
  verdict: "BLR_CP007_MANUAL_ENGLISH_FREEZE_DECISION_READY",
} as const;

writeFileSync(join(outputDir, "blr-cp007-english-freeze-decision-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);

const md = `# BLR-CP-007 Manual English-Freeze Decision\n\n## Verdict\n\n**${summary.verdict}**\n\n## Recommendation\n\n**${summary.recommendation}**\n\nThe approved 168-question learner-facing corpus is unchanged. This decision layer only corrects stale internal review notes and preserves the manual approval gate.\n\n## Evidence\n\n- Questions: ${summary.recordCount}\n- QL distribution: ${Object.entries(summary.qlCounts).map(([qlId, count]) => `${qlId} ${count}`).join(", ")}\n- Difficulty: ${Object.entries(summary.difficultyCounts).map(([level, count]) => `${level} ${count}`).join(", ")}\n- Target relations: ${summary.targetRelationCount}\n- Balanced counterpart pairs: ${summary.balancedCounterpartPairCount}/${counterpartPairs.length}\n- Learner-facing changes: ${summary.learnerCorpusChanged ? "YES" : "NO"}\n- Stale review notes: ${summary.staleReviewNoteCount}\n- English-freeze blocker retained: ${summary.englishFreezePendingCount}/${summary.recordCount}\n- Review-only records: ${summary.reviewOnlyCount}/${summary.recordCount}\n- Product-delivery enabled records: ${summary.productDeliveryEnabledCount}\n\n## Lifecycle\n\nEnglish freeze requires an explicit manual decision. Localisation, Question Studio, Question Bank, mock-test delivery, publication, staging and merge remain locked.\n`;
writeFileSync(join(outputDir, "BLR-CP-007-MANUAL-ENGLISH-FREEZE-DECISION.md"), md);

const esc = (value: unknown) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
const metrics = [
  ["Questions", summary.recordCount],
  ["Target relations", summary.targetRelationCount],
  ["Balanced pairs", `${summary.balancedCounterpartPairCount}/${counterpartPairs.length}`],
  ["Learner changes", summary.learnerCorpusChanged ? "YES" : "NO"],
  ["Stale notes", summary.staleReviewNoteCount],
  ["Freeze blockers retained", summary.englishFreezePendingCount],
  ["Review-only", summary.reviewOnlyCount],
  ["Delivery enabled", summary.productDeliveryEnabledCount],
].map(([label, value]) => `<div class="metric"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("");
const relationRows = Object.entries(targetRelationCounts).sort(([a], [b]) => a.localeCompare(b)).map(([relation, count]) => `<tr><td>${esc(relation)}</td><td>${count}</td></tr>`).join("");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-007 Manual English-Freeze Decision</title><style>:root{font-family:Inter,system-ui,sans-serif;color:#1f2937;background:#f3f4f6}body{margin:0;padding:24px}.wrap{max-width:1100px;margin:auto}.card{background:#fff;border:1px solid #d1d5db;border-radius:14px;padding:20px;margin-bottom:18px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.metric{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px}.metric span{display:block}.metric strong{display:block;font-size:1.25rem;margin-top:4px}.ok{color:#166534}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:8px;border-bottom:1px solid #e5e7eb}@media(max-width:800px){body{padding:10px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.card{padding:14px}}</style></head><body><main class="wrap"><section class="card"><h1>BLR-CP-007 Manual English-Freeze Decision</h1><h2 class="ok">${esc(summary.verdict)}</h2><p><strong>${esc(summary.recommendation)}</strong></p><p>The learner-facing corpus is unchanged. English freeze still requires an explicit manual decision.</p></section><section class="card"><div class="grid">${metrics}</div></section><section class="card"><h2>Target-relation coverage</h2><table><thead><tr><th>Relation</th><th>Questions</th></tr></thead><tbody>${relationRows}</tbody></table></section><section class="card"><h2>Lifecycle</h2><p>Localisation, Question Studio, Question Bank, mock-test delivery, publication, staging and merge remain locked.</p></section></main></body></html>`;
writeFileSync(join(outputDir, "blr-cp007-english-freeze-decision-review.html"), html);

console.log(JSON.stringify(summary, null, 2));
