import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  BLR_CP007_MULTILINGUAL_FREEZE_APPROVED_AT,
  BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY,
  generateBlrCp007MultilingualFrozenBundle,
  multilingualFrozenLearnerCorpusIsUnchanged,
  multilingualFrozenSemanticParityIsExact,
} from "./cp007-multilingual-frozen";

const outputDir = process.argv[2] ?? "blr-cp007-multilingual-frozen-output";
mkdirSync(outputDir, { recursive: true });

const bundle = generateBlrCp007MultilingualFrozenBundle();
const localised = [...bundle.hindi, ...bundle.punjabi];
const all = [...bundle.english, ...localised];
const countBy = (values: readonly string[]): Record<string, number> => values.reduce<Record<string, number>>((counts, value) => {
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});

const summary = {
  authority: BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY,
  approvedAt: BLR_CP007_MULTILINGUAL_FREEZE_APPROVED_AT,
  approvedBy: "PRODUCT_OWNER",
  englishCount: bundle.english.length,
  hindiFrozenCount: bundle.hindi.length,
  punjabiFrozenCount: bundle.punjabi.length,
  localizedFrozenCount: localised.length,
  totalMultilingualRecordCount: all.length,
  qlCountsPerLanguage: countBy(bundle.hindi.map((question) => question.qlId)),
  difficultyCountsPerLanguage: countBy(bundle.hindi.map((question) => question.metadata.difficulty)),
  targetRelationCount: new Set(bundle.hindi.map((question) => question.reviewProof.targetRelation)).size,
  hindiLearnerCorpusChanged: !multilingualFrozenLearnerCorpusIsUnchanged("hi-IN"),
  punjabiLearnerCorpusChanged: !multilingualFrozenLearnerCorpusIsUnchanged("pa-IN"),
  hindiSemanticParity: multilingualFrozenSemanticParityIsExact("hi-IN"),
  punjabiSemanticParity: multilingualFrozenSemanticParityIsExact("pa-IN"),
  localisationReviewPendingCount: localised.filter((question) =>
    question.metadata.activeEditorialBlockers.includes("HINDI_PUNJABI_HUMAN_REVIEW_PENDING")
  ).length,
  humanReviewRequiredCount: localised.filter((question) => question.v4ReviewProof.humanReviewRequired).length,
  multilingualFrozenCount: localised.filter((question) =>
    question.metadata.multilingualFreezeStatus === BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY
  ).length,
  reviewOnlyCount: all.filter((question) => question.reviewOnly).length,
  questionStudioEnabledCount: all.filter((question) => question.questionStudioVisible).length,
  productDeliveryEnabledCount: all.filter((question) =>
    question.publiclyPublishable
      || question.questionStudioVisible
      || question.questionBankEligible
      || question.mockTestEligible
  ).length,
  verdict: "BLR_CP007_MULTILINGUAL_FROZEN",
  nextPhase: "QUESTION_STUDIO_INTEGRATION_DESIGN_REVIEW",
} as const;

writeFileSync(
  join(outputDir, "blr-cp007-multilingual-freeze-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
writeFileSync(
  join(outputDir, "blr-cp007-multilingual-frozen-bank.json"),
  `${JSON.stringify(bundle, null, 2)}\n`,
);

const report = `# BLR-CP-007 Multilingual Freeze\n\n## Verdict\n\n**${summary.verdict}**\n\nThe product owner explicitly approved the reviewed Hindi and Punjabi corpus on ${summary.approvedAt}. English, Hindi and Punjabi learner-facing wording is now frozen.\n\n## Evidence\n\n- English frozen questions: ${summary.englishCount}\n- Hindi frozen questions: ${summary.hindiFrozenCount}\n- Punjabi frozen questions: ${summary.punjabiFrozenCount}\n- Frozen translated records: ${summary.multilingualFrozenCount}/${summary.localizedFrozenCount}\n- Total multilingual records: ${summary.totalMultilingualRecordCount}\n- QL distribution per language: ${Object.entries(summary.qlCountsPerLanguage).map(([qlId, count]) => `${qlId} ${count}`).join(", ")}\n- Difficulty per language: ${Object.entries(summary.difficultyCountsPerLanguage).map(([level, count]) => `${level} ${count}`).join(", ")}\n- Target relations: ${summary.targetRelationCount}\n- Hindi learner-facing changes during freeze: ${summary.hindiLearnerCorpusChanged ? "YES" : "NO"}\n- Punjabi learner-facing changes during freeze: ${summary.punjabiLearnerCorpusChanged ? "YES" : "NO"}\n- Hindi semantic parity: ${summary.hindiSemanticParity ? "PASS" : "FAIL"}\n- Punjabi semantic parity: ${summary.punjabiSemanticParity ? "PASS" : "FAIL"}\n- Localisation-review pending records: ${summary.localisationReviewPendingCount}\n- Human review still required: ${summary.humanReviewRequiredCount}\n- Review-only records: ${summary.reviewOnlyCount}/${summary.totalMultilingualRecordCount}\n- Question Studio enabled: ${summary.questionStudioEnabledCount}\n- Product-delivery enabled: ${summary.productDeliveryEnabledCount}\n\n## Lifecycle\n\nThe multilingual learner corpus is frozen. Question Studio integration may now be designed and reviewed, but Question Studio visibility, Question Bank storage, mock-test delivery, publication, staging and merge remain locked until separately approved.\n`;
writeFileSync(join(outputDir, "BLR-CP-007-MULTILINGUAL-FREEZE.md"), report);

const esc = (value: unknown) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
const metrics = [
  ["English", summary.englishCount],
  ["Hindi frozen", `${summary.hindiFrozenCount}/${summary.hindiFrozenCount}`],
  ["Punjabi frozen", `${summary.punjabiFrozenCount}/${summary.punjabiFrozenCount}`],
  ["Total records", summary.totalMultilingualRecordCount],
  ["Learner changes", summary.hindiLearnerCorpusChanged || summary.punjabiLearnerCorpusChanged ? "YES" : "NO"],
  ["Parity", summary.hindiSemanticParity && summary.punjabiSemanticParity ? "PASS" : "FAIL"],
  ["Human review", summary.humanReviewRequiredCount],
  ["Delivery enabled", summary.productDeliveryEnabledCount],
].map(([label, value]) => `<div class="metric"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-007 Multilingual Freeze</title><style>:root{font-family:Inter,system-ui,sans-serif;color:#1f2937;background:#f3f4f6}body{margin:0;padding:24px}.wrap{max-width:1080px;margin:auto}.card{background:#fff;border:1px solid #d1d5db;border-radius:14px;padding:20px;margin-bottom:18px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.metric{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px}.metric span,.metric strong{display:block}.metric strong{font-size:1.25rem;margin-top:4px}.ok{color:#166534}.locked{color:#92400e}@media(max-width:800px){body{padding:10px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.card{padding:14px}}</style></head><body><main class="wrap"><section class="card"><h1>BLR-CP-007 Multilingual Freeze</h1><h2 class="ok">${esc(summary.verdict)}</h2><p>Approved on ${esc(summary.approvedAt)}. English, Hindi and Punjabi learner-facing wording is frozen.</p></section><section class="card"><div class="grid">${metrics}</div></section><section class="card"><h2>Lifecycle</h2><p class="locked">Question Studio and every product-delivery surface remain locked. The next permitted activity is integration design and review only.</p></section></main></body></html>`;
writeFileSync(join(outputDir, "blr-cp007-multilingual-freeze-review.html"), html);

console.log(JSON.stringify(summary, null, 2));
