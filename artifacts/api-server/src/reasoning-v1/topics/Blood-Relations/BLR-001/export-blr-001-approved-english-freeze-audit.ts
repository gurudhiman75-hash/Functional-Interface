import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildBlr001ApprovedEnglishFreezeAudit } from "./blr-001-approved-english-freeze-audit";

const outputDir = process.argv[2] ?? "blr-001-approved-english-freeze-audit-output";
mkdirSync(outputDir, { recursive: true });
const result = buildBlr001ApprovedEnglishFreezeAudit();

function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function csvCell(value: unknown): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

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
  blockerCount: result.blockerCount,
  warningCount: result.warningCount,
  verdict: result.verdict,
  manualEnglishFreezeRequired: result.manualEnglishFreezeRequired,
};

writeFileSync(join(outputDir, "blr-001-approved-english-freeze-audit-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(join(outputDir, "blr-001-approved-english-freeze-audit-findings.json"), `${JSON.stringify(result.findings, null, 2)}\n`);
writeFileSync(
  join(outputDir, "blr-001-approved-english-freeze-audit-findings.csv"),
  [
    ["severity", "code", "itemId", "detail"].map(csvCell).join(","),
    ...result.findings.map((finding) => [finding.severity, finding.code, finding.itemId, finding.detail].map(csvCell).join(",")),
  ].join("\n") + "\n",
);
writeFileSync(
  join(outputDir, "blr-001-approved-english-freeze-template-clusters.json"),
  `${JSON.stringify(result.normalizedTemplateClusters, null, 2)}\n`,
);

const findingsRows = result.findings.length
  ? result.findings.map((finding) => `<tr><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.code)}</td><td>${escapeHtml(finding.itemId)}</td><td>${escapeHtml(finding.detail)}</td></tr>`).join("\n")
  : '<tr><td colspan="4">No executable blockers or length warnings.</td></tr>';
const qlRows = Object.entries(result.qlCounts)
  .map(([qlId, count]) => `<tr><td>${escapeHtml(qlId)}</td><td>${count}</td></tr>`)
  .join("\n");
const templateRows = result.normalizedTemplateClusters.length
  ? result.normalizedTemplateClusters.map((entry) => `<tr><td>${entry.count}</td><td>${escapeHtml(entry.template)}</td></tr>`).join("\n")
  : '<tr><td colspan="2">No normalized template clusters.</td></tr>';

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BLR-001 Approved English Freeze Audit</title>
<style>
:root{font-family:Inter,system-ui,sans-serif;color:#1f2937;background:#f3f4f6}body{margin:0;padding:24px}.wrap{max-width:1180px;margin:auto}.card{background:#fff;border:1px solid #d1d5db;border-radius:14px;padding:20px;margin:0 0 18px;box-shadow:0 4px 14px rgba(0,0,0,.04)}h1,h2{margin-top:0}.verdict{font-weight:800;font-size:1.1rem}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.metric{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px}.metric strong{display:block;font-size:1.3rem;margin-top:4px}table{width:100%;border-collapse:collapse}th,td{text-align:left;vertical-align:top;padding:9px;border-bottom:1px solid #e5e7eb}th{background:#f9fafb}.ok{color:#166534}.blocked{color:#991b1b}code{white-space:pre-wrap;word-break:break-word}@media(max-width:800px){body{padding:10px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.card{padding:14px}table{font-size:.88rem}}
</style>
</head>
<body><main class="wrap">
<section class="card"><h1>BLR-001 Approved English Freeze Audit</h1><p class="verdict ${result.blockerCount === 0 ? "ok" : "blocked"}">${escapeHtml(result.verdict)}</p><p>This audit directly inspects the approved 168-question CP-007 corpus and retains the established 35-QL chapter coverage proof. A passing result is evidence for manual English-freeze review; it does not freeze, merge, localise or publish the chapter.</p></section>
<section class="card"><h2>Core evidence</h2><div class="grid">
<div class="metric">Questions<strong>${result.approvedCorpusQuestionCount}</strong></div>
<div class="metric">Permanent QLs<strong>${result.permanentQlCount}</strong></div>
<div class="metric">Blockers<strong>${result.blockerCount}</strong></div>
<div class="metric">Warnings<strong>${result.warningCount}</strong></div>
<div class="metric">Unique stems<strong>${result.exactStemCount}</strong></div>
<div class="metric">Unique fingerprints<strong>${result.editorialFingerprintCount}</strong></div>
<div class="metric">Max stem words<strong>${result.maximumStemWords}</strong></div>
<div class="metric">Avg stem words<strong>${result.averageStemWords}</strong></div>
<div class="metric">Max option words<strong>${result.maximumOptionWords}</strong></div>
<div class="metric">Avg option words<strong>${result.averageOptionWords}</strong></div>
<div class="metric">Max explanation words<strong>${result.maximumExplanationWords}</strong></div>
<div class="metric">Avg explanation words<strong>${result.averageExplanationWords}</strong></div>
</div></section>
<section class="card"><h2>QL inventory</h2><table><thead><tr><th>QL</th><th>Questions</th></tr></thead><tbody>${qlRows}</tbody></table></section>
<section class="card"><h2>Findings</h2><table><thead><tr><th>Severity</th><th>Code</th><th>Item</th><th>Detail</th></tr></thead><tbody>${findingsRows}</tbody></table></section>
<section class="card"><h2>Normalized stem clusters</h2><p>These are transparency diagnostics only. Similar exam templates are acceptable when people, symbols, reasoning paths and options remain distinct.</p><table><thead><tr><th>Count</th><th>Normalized template</th></tr></thead><tbody>${templateRows}</tbody></table></section>
<section class="card"><h2>Lifecycle</h2><p>Product-owner approval is recorded. English freeze remains pending. Question Studio, Question Bank, mock-test release, publication, staging, localisation and merge remain locked.</p></section>
</main></body></html>`;
writeFileSync(join(outputDir, "blr-001-approved-english-freeze-audit-review.html"), html);

const markdown = `# BLR-001 Approved English Freeze Audit

## Verdict

**${result.verdict}**

This audit directly inspects the approved 168-question CP-007 learner-facing corpus while retaining the established 35-QL chapter coverage audit.

## Evidence

- Questions audited: ${result.approvedCorpusQuestionCount}
- Permanent QLs covered by chapter baseline: ${result.permanentQlCount}
- Unique stems: ${result.exactStemCount}
- Unique editorial fingerprints: ${result.editorialFingerprintCount}
- Executable blockers: ${result.blockerCount}
- Length warnings: ${result.warningCount}
- Maximum exact shortcut repetition: ${result.maximumShortcutRepeat}
- Maximum exact common-trap repetition: ${result.maximumTrapRepeat}
- Stem words, average / maximum: ${result.averageStemWords} / ${result.maximumStemWords}
- Option words, average / maximum: ${result.averageOptionWords} / ${result.maximumOptionWords}
- Explanation words, average / maximum: ${result.averageExplanationWords} / ${result.maximumExplanationWords}

## QL inventory

${Object.entries(result.qlCounts).map(([qlId, count]) => `- ${qlId}: ${count}`).join("\n")}

## Findings

${result.findings.length ? result.findings.map((finding) => `- ${finding.severity} — ${finding.code} — ${finding.itemId}: ${finding.detail}`).join("\n") : "No executable blockers or length warnings."}

## Lifecycle

Product-owner approval is recorded. English freeze remains a manual decision. Localisation, product integration, publication, staging and merge remain locked.
`;
writeFileSync(join(outputDir, "BLR-001-APPROVED-ENGLISH-FREEZE-AUDIT.md"), markdown);

console.log(JSON.stringify(summary, null, 2));
