import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildBlr001ApprovedEnglishFreezeReviewedAudit } from "./blr-001-approved-english-freeze-audit-reviewed";

const outputDir = process.argv[2] ?? "blr-001-approved-english-freeze-audit-output";
mkdirSync(outputDir, { recursive: true });
const result = buildBlr001ApprovedEnglishFreezeReviewedAudit();

const summary = {
  auditVersion: result.auditVersion,
  chapterBaselineVerdict: result.chapterBaselineVerdict,
  permanentQlCount: result.permanentQlCount,
  approvedCorpusQuestionCount: result.approvedCorpusQuestionCount,
  qlCounts: result.qlCounts,
  difficultyCounts: result.difficultyCounts,
  recommendedUseCounts: result.recommendedUseCounts,
  exactStemCount: result.exactStemCount,
  editorialFingerprintCount: result.editorialFingerprintCount,
  normalizedTemplateClusterCount: result.normalizedTemplateClusterCount,
  maximumNormalizedTemplateRepeat: result.maximumNormalizedTemplateRepeat,
  maximumShortcutRepeat: result.maximumShortcutRepeat,
  maximumTrapRepeat: result.maximumTrapRepeat,
  maximumStemWords: result.maximumStemWords,
  averageStemWords: result.averageStemWords,
  maximumOptionWords: result.maximumOptionWords,
  averageOptionWords: result.averageOptionWords,
  maximumExplanationWords: result.maximumExplanationWords,
  averageExplanationWords: result.averageExplanationWords,
  acceptedExamDirectiveStemCount: result.acceptedExamDirectiveStemCount,
  acceptedStructuredStemCount: result.acceptedStructuredStemCount,
  blockerCount: result.blockerCount,
  warningCount: result.warningCount,
  verdict: result.verdict,
  manualEnglishFreezeRequired: result.manualEnglishFreezeRequired,
};

const esc = (value: unknown) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");
const csv = (value: unknown) => `"${String(value).replace(/"/g, '""')}"`;

writeFileSync(join(outputDir, "blr-001-approved-english-freeze-audit-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(join(outputDir, "blr-001-approved-english-freeze-audit-findings.json"), `${JSON.stringify(result.findings, null, 2)}\n`);
writeFileSync(join(outputDir, "blr-001-approved-english-freeze-template-clusters.json"), `${JSON.stringify(result.normalizedTemplateClusters, null, 2)}\n`);
writeFileSync(
  join(outputDir, "blr-001-approved-english-freeze-audit-findings.csv"),
  [
    ["severity", "code", "itemId", "detail"].map(csv).join(","),
    ...result.findings.map((finding) => [finding.severity, finding.code, finding.itemId, finding.detail].map(csv).join(",")),
  ].join("\n") + "\n",
);

const metric = (label: string, value: unknown) => `<div class="metric"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`;
const findingRows = result.findings.length
  ? result.findings.map((finding) => `<tr><td>${esc(finding.severity)}</td><td>${esc(finding.code)}</td><td>${esc(finding.itemId)}</td><td>${esc(finding.detail)}</td></tr>`).join("\n")
  : '<tr><td colspan="4">No residual blockers or warnings.</td></tr>';
const qlRows = Object.entries(result.qlCounts).map(([qlId, count]) => `<tr><td>${esc(qlId)}</td><td>${count}</td></tr>`).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-001 Approved English Freeze Audit</title><style>:root{font-family:Inter,system-ui,sans-serif;color:#1f2937;background:#f3f4f6}body{margin:0;padding:24px}.wrap{max-width:1180px;margin:auto}.card{background:#fff;border:1px solid #d1d5db;border-radius:14px;padding:20px;margin-bottom:18px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.metric{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px}.metric span{display:block}.metric strong{display:block;font-size:1.3rem;margin-top:4px}table{width:100%;border-collapse:collapse}th,td{text-align:left;vertical-align:top;padding:9px;border-bottom:1px solid #e5e7eb}th{background:#f9fafb}.ok{color:#166534}.blocked{color:#991b1b}@media(max-width:800px){body{padding:10px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.card{padding:14px}table{font-size:.88rem}}</style></head><body><main class="wrap"><section class="card"><h1>BLR-001 Approved English Freeze Audit</h1><h2 class="${result.blockerCount === 0 ? "ok" : "blocked"}">${esc(result.verdict)}</h2><p>The renewed audit directly inspects the approved 168-question CP-007 corpus and retains the 35-QL chapter coverage proof. Standard exam directives such as “Select”, “Identify” and “Choose” are accepted as valid stems. QL-034 candidate lists and coded lines are measured separately from their short instruction sentence. This evidence does not itself grant English freeze or merge authority.</p></section><section class="card"><h2>Evidence</h2><div class="grid">${[
  metric("Questions", result.approvedCorpusQuestionCount),
  metric("Permanent QLs", result.permanentQlCount),
  metric("Blockers", result.blockerCount),
  metric("Warnings", result.warningCount),
  metric("Unique stems", result.exactStemCount),
  metric("Unique fingerprints", result.editorialFingerprintCount),
  metric("Accepted directive stems", result.acceptedExamDirectiveStemCount),
  metric("Structured coded stems", result.acceptedStructuredStemCount),
  metric("Max full stem words", result.maximumStemWords),
  metric("Average full stem words", result.averageStemWords),
  metric("Max option words", result.maximumOptionWords),
  metric("Average explanation words", result.averageExplanationWords),
].join("")}</div></section><section class="card"><h2>QL inventory</h2><table><thead><tr><th>QL</th><th>Questions</th></tr></thead><tbody>${qlRows}</tbody></table></section><section class="card"><h2>Residual findings</h2><table><thead><tr><th>Severity</th><th>Code</th><th>Item</th><th>Detail</th></tr></thead><tbody>${findingRows}</tbody></table></section><section class="card"><h2>Lifecycle</h2><p>Product-owner approval is recorded. English freeze remains pending. Localisation, Question Studio, Question Bank, mock-test release, publication, staging and merge remain locked.</p></section></main></body></html>`;
writeFileSync(join(outputDir, "blr-001-approved-english-freeze-audit-review.html"), html);

const md = `# BLR-001 Approved English Freeze Audit\n\n## Verdict\n\n**${result.verdict}**\n\n- Approved CP-007 questions audited: ${result.approvedCorpusQuestionCount}\n- Permanent QLs retained in chapter proof: ${result.permanentQlCount}\n- Unique stems / fingerprints: ${result.exactStemCount} / ${result.editorialFingerprintCount}\n- Standard exam directive stems accepted: ${result.acceptedExamDirectiveStemCount}\n- Structured QL-034 coded stems classified separately: ${result.acceptedStructuredStemCount}\n- Residual blockers: ${result.blockerCount}\n- Residual warnings: ${result.warningCount}\n- Full stem words average / maximum: ${result.averageStemWords} / ${result.maximumStemWords}\n- Option words average / maximum: ${result.averageOptionWords} / ${result.maximumOptionWords}\n- Explanation words average / maximum: ${result.averageExplanationWords} / ${result.maximumExplanationWords}\n\n## Findings\n\n${result.findings.length ? result.findings.map((finding) => `- ${finding.severity} — ${finding.code} — ${finding.itemId}: ${finding.detail}`).join("\n") : "No residual blockers or warnings."}\n\n## Lifecycle\n\nThis is evidence for a manual English-freeze decision. Localisation, product integration, publication, staging and merge remain locked.\n`;
writeFileSync(join(outputDir, "BLR-001-APPROVED-ENGLISH-FREEZE-AUDIT.md"), md);

console.log(JSON.stringify(summary, null, 2));
