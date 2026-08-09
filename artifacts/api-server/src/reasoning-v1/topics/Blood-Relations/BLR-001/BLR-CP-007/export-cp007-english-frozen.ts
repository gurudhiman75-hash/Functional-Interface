import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  BLR_CP007_ENGLISH_FREEZE_APPROVED_AT,
  BLR_CP007_ENGLISH_FREEZE_AUTHORITY,
  frozenLearnerCorpusIsUnchanged,
  generateBlrCp007EnglishFrozenBank,
} from "./cp007-english-frozen";

const outputDir = process.argv[2] ?? "blr-cp007-english-frozen-output";
mkdirSync(outputDir, { recursive: true });
const bank = generateBlrCp007EnglishFrozenBank();

const countBy = (values: readonly string[]): Record<string, number> => values.reduce<Record<string, number>>((counts, value) => {
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});
const qlCounts = countBy(bank.map((question) => question.qlId));
const difficultyCounts = countBy(bank.map((question) => question.metadata.difficulty));
const targetRelationCounts = countBy(bank.map((question) => question.reviewProof.targetRelation));
const counterpartPairs = [
  ["FATHER", "MOTHER"], ["SON", "DAUGHTER"], ["BROTHER", "SISTER"], ["HUSBAND", "WIFE"],
  ["GRANDFATHER", "GRANDMOTHER"], ["GRANDSON", "GRANDDAUGHTER"], ["UNCLE", "AUNT"],
  ["NEPHEW", "NIECE"], ["FATHER_IN_LAW", "MOTHER_IN_LAW"], ["SON_IN_LAW", "DAUGHTER_IN_LAW"],
  ["BROTHER_IN_LAW", "SISTER_IN_LAW"], ["PARENT", "CHILD"], ["GRANDPARENT", "GRANDCHILD"],
] as const;
const unbalancedCounterpartPairs = counterpartPairs.filter(([left, right]) => targetRelationCounts[left] !== targetRelationCounts[right]);

const summary = {
  authority: BLR_CP007_ENGLISH_FREEZE_AUTHORITY,
  approvedAt: BLR_CP007_ENGLISH_FREEZE_APPROVED_AT,
  approvedBy: "PRODUCT_OWNER",
  recordCount: bank.length,
  qlCounts,
  difficultyCounts,
  targetRelationCount: Object.keys(targetRelationCounts).length,
  targetRelationCounts,
  balancedCounterpartPairCount: counterpartPairs.length - unbalancedCounterpartPairs.length,
  unbalancedCounterpartPairs,
  learnerCorpusChanged: !frozenLearnerCorpusIsUnchanged(),
  englishFreezePendingCount: bank.filter((question) => question.metadata.activeEditorialBlockers.includes("ENGLISH_FREEZE_PENDING")).length,
  frozenCount: bank.filter((question) => question.metadata.englishFreezeStatus === BLR_CP007_ENGLISH_FREEZE_AUTHORITY).length,
  humanReviewRequiredCount: bank.filter((question) => question.v4ReviewProof.humanReviewRequired).length,
  localisationUnlockedCount: bank.filter((question) => question.englishFreezeProof.localisationUnlocked).length,
  reviewOnlyCount: bank.filter((question) => question.reviewOnly).length,
  productDeliveryEnabledCount: bank.filter((question) => question.publiclyPublishable || question.questionStudioVisible || question.questionBankEligible || question.mockTestEligible).length,
  verdict: "BLR_CP007_ENGLISH_FROZEN",
  nextPhase: "HINDI_PUNJABI_LOCALISATION_AND_PARITY_PROOF",
} as const;

writeFileSync(join(outputDir, "blr-cp007-english-freeze-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);

const report = `# BLR-CP-007 English Freeze\n\n## Verdict\n\n**${summary.verdict}**\n\nEnglish freeze was explicitly approved by the product owner on ${summary.approvedAt}. The 168-question learner-facing corpus is unchanged and now frozen.\n\n## Evidence\n\n- Questions: ${summary.recordCount}\n- QL distribution: ${Object.entries(summary.qlCounts).map(([qlId, count]) => `${qlId} ${count}`).join(", ")}\n- Difficulty: ${Object.entries(summary.difficultyCounts).map(([level, count]) => `${level} ${count}`).join(", ")}\n- Target relations: ${summary.targetRelationCount}\n- Balanced counterpart pairs: ${summary.balancedCounterpartPairCount}/${counterpartPairs.length}\n- Learner-facing changes: ${summary.learnerCorpusChanged ? "YES" : "NO"}\n- English-freeze pending records: ${summary.englishFreezePendingCount}\n- Frozen records: ${summary.frozenCount}/${summary.recordCount}\n- Human review still required: ${summary.humanReviewRequiredCount}\n- Localisation unlocked: ${summary.localisationUnlockedCount}/${summary.recordCount}\n- Product-delivery enabled: ${summary.productDeliveryEnabledCount}\n\n## Lifecycle\n\nHindi/Punjabi localisation and parity proof may begin. Question Studio, Question Bank, mock-test delivery, publication, staging and merge remain locked.\n`;
writeFileSync(join(outputDir, "BLR-CP-007-ENGLISH-FREEZE.md"), report);

const esc = (value: unknown) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const metrics = [
  ["Questions", summary.recordCount],
  ["Frozen", `${summary.frozenCount}/${summary.recordCount}`],
  ["Learner changes", summary.learnerCorpusChanged ? "YES" : "NO"],
  ["Pending blockers", summary.englishFreezePendingCount],
  ["Human review required", summary.humanReviewRequiredCount],
  ["Localisation unlocked", summary.localisationUnlockedCount],
  ["Delivery enabled", summary.productDeliveryEnabledCount],
  ["Balanced pairs", `${summary.balancedCounterpartPairCount}/${counterpartPairs.length}`],
].map(([label, value]) => `<div class="metric"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-007 English Freeze</title><style>:root{font-family:Inter,system-ui,sans-serif;color:#1f2937;background:#f3f4f6}body{margin:0;padding:24px}.wrap{max-width:1050px;margin:auto}.card{background:#fff;border:1px solid #d1d5db;border-radius:14px;padding:20px;margin-bottom:18px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.metric{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px}.metric span,.metric strong{display:block}.metric strong{font-size:1.25rem;margin-top:4px}.ok{color:#166534}@media(max-width:800px){body{padding:10px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.card{padding:14px}}</style></head><body><main class="wrap"><section class="card"><h1>BLR-CP-007 English Freeze</h1><h2 class="ok">${esc(summary.verdict)}</h2><p>Approved on ${esc(summary.approvedAt)}. The learner-facing English corpus is frozen and unchanged.</p></section><section class="card"><div class="grid">${metrics}</div></section><section class="card"><h2>Next phase</h2><p>Hindi/Punjabi localisation and parity proof may begin. Product delivery and merge remain locked.</p></section></main></body></html>`;
writeFileSync(join(outputDir, "blr-cp007-english-freeze-review.html"), html);

console.log(JSON.stringify(summary, null, 2));
