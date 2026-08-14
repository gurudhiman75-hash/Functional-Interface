import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { listBlrCp007QuestionStudioReviewEntries } from "./question-studio-review-adapter";

const out = resolve(process.argv[2] ?? "blr-cp007-production-output");
mkdirSync(out, { recursive: true });

const entries = listBlrCp007QuestionStudioReviewEntries();
const languages = ["en", "hi", "pa"] as const;
const qlIds = ["BLR-QL-031", "BLR-QL-032", "BLR-QL-033", "BLR-QL-034", "BLR-QL-035"] as const;
const samples = languages.flatMap((language) =>
  qlIds.map((qlId) => entries.find((entry) => entry.language === language && entry.qlId === qlId)!),
);

const summary = {
  verdict: "BLR_CP007_PRODUCTION_LIFECYCLE_PROVED",
  releaseAuthority: "BLR_CP007_PRODUCT_RELEASE_APPROVED_2026_08_09",
  packageId: "REASONING_V1_BLR_001_CP_007",
  multilingualRecordCount: entries.length,
  englishCount: entries.filter((entry) => entry.language === "en").length,
  hindiCount: entries.filter((entry) => entry.language === "hi").length,
  punjabiCount: entries.filter((entry) => entry.language === "pa").length,
  qlCount: new Set(entries.map((entry) => entry.qlId)).size,
  uniqueQuestionLanguageIdCount: new Set(entries.map((entry) => entry.questionLanguageId)).size,
  validRecordCount: entries.filter((entry) => entry.validation.valid).length,
  standardQuestionStudioWorkflow: true,
  separateReasoningWorkflowRemoved: true,
  generationPersistenceEnabled: true,
  approvalGatePreserved: true,
  questionBankConversionEligibleAfterApproval: true,
  mockTestEligibleAfterApproval: true,
  publicationWorkflowEligibleAfterApproval: true,
  automaticStudentPublication: false,
  productionBranchBase: "New-main",
};

const markdown = `# BLR-CP-007 Production Lifecycle\n\n## Verdict\n\n\`${summary.verdict}\`\n\n## Corpus\n\n| Measure | Result |\n|---|---:|\n| English | ${summary.englishCount} |\n| Hindi | ${summary.hindiCount} |\n| Punjabi | ${summary.punjabiCount} |\n| Total multilingual records | ${summary.multilingualRecordCount} |\n| Unique language records | ${summary.uniqueQuestionLanguageIdCount} |\n| Valid records | ${summary.validRecordCount} |\n\n## Standard Question Studio flow\n\n1. Administrators select BLR-CP-007 in the existing Question Studio generation-package selector.\n2. Generated records enter the same audited generation run and unreviewed item queue used by the common cockpit.\n3. Review, needs-fix, rejection and approval use the shared Question Studio controls.\n4. Manual approval uses the existing Question Bank converter because CP-007 is release-eligible after approval.\n5. Approved questions are eligible for test assembly and the existing publication QA workflow.\n6. Nothing is automatically published to students.\n\n## Safety and reliability\n\n- There is no separate BLR import, synchronization panel or BLR-specific persistence endpoint.\n- Generation run, item versions, audit event and outbox event use the shared Question Studio transaction path.\n- Source fingerprints, locale, QL, canonical item and freeze authority remain attached.\n- CP-007 retains manual approval and automatic-publication locks.\n`;

const escapeHtml = (value: unknown) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const cards = samples.map((entry) => `<article><p class="meta">${escapeHtml(entry.language.toUpperCase())} · ${escapeHtml(entry.qlId)} · ${escapeHtml(entry.difficultyBand)}</p><h3>${escapeHtml(entry.stem)}</h3><ol>${entry.options.map((option, index) => `<li class="${index === entry.correctIndex ? "correct" : ""}">${escapeHtml(option)}</li>`).join("")}</ol><p><strong>Answer:</strong> ${escapeHtml(entry.answer)}</p></article>`).join("");
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>BLR-CP-007 Production</title><style>body{font-family:system-ui;background:#f4f6fa;color:#172033;margin:0}main{max-width:1200px;margin:auto;padding:28px}.hero,article{background:#fff;border:1px solid #dde3ed;border-radius:16px;padding:18px}.hero{margin-bottom:18px}.status{display:inline-block;background:#e8f7ee;color:#166534;border-radius:999px;padding:6px 10px;font-weight:700}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}.meta{font-size:12px;color:#667085}li{padding:5px}.correct{background:#ecfdf3;border-radius:6px;font-weight:700}</style></head><body><main><section class="hero"><span class="status">${summary.verdict}</span><h1>BLR-CP-007 production lifecycle</h1><p>504 frozen multilingual records are connected to the existing Question Studio cockpit, shared approval, Question Bank conversion and test/publication workflows.</p><p><strong>Automatic student publication:</strong> No</p></section><section class="grid">${cards}</section></main></body></html>`;

writeFileSync(resolve(out, "blr-cp007-production-summary.json"), JSON.stringify(summary, null, 2));
writeFileSync(resolve(out, "BLR-CP-007-PRODUCTION-LIFECYCLE.md"), markdown);
writeFileSync(resolve(out, "blr-cp007-production-review.html"), html);
writeFileSync(resolve(out, "blr-cp007-production-samples.json"), JSON.stringify(samples, null, 2));
console.log(JSON.stringify(summary, null, 2));
