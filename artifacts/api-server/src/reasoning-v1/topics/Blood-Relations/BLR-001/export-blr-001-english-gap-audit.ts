import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  BLR_001_QL_CONTRACTS,
  BLR_001_SCOPE_COVERAGE,
  buildBlr001EnglishGapAudit,
  type NormalizedBlr001AuditQuestion,
} from "./blr-001-english-gap-audit";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function questionCard(question: NormalizedBlr001AuditQuestion): string {
  const options = question.options
    .map((option, index) => `<li class="${index === question.correctIndex ? "correct" : ""}"><strong>${String.fromCharCode(65 + index)}.</strong> ${escapeHtml(option)}</li>`)
    .join("");
  return `<article class="card">
    <div class="eyebrow">${escapeHtml(question.qlId)} · ${escapeHtml(question.checkpointId)} · ${escapeHtml(question.solveAuthority)}</div>
    ${question.sharedPrompt ? `<div class="passage">${escapeHtml(question.sharedPrompt).replace(/\n/g, "<br>")}</div>` : ""}
    <h3>${escapeHtml(question.stem).replace(/\n/g, "<br>")}</h3>
    <ol>${options}</ol>
    <details><summary>Answer</summary><p><strong>${escapeHtml(question.answer)}</strong></p><p class="muted">${escapeHtml(question.itemId)}</p></details>
  </article>`;
}

const outputDir = resolve(process.argv[2] ?? "blr-001-english-gap-audit-output");
mkdirSync(outputDir, { recursive: true });
const audit = buildBlr001EnglishGapAudit();

writeFileSync(resolve(outputDir, "blr-001-english-gap-audit-summary.json"), `${JSON.stringify({
  ...audit,
  reviewSamples: undefined,
}, null, 2)}\n`);
writeFileSync(resolve(outputDir, "blr-001-english-gap-audit-failures.txt"), audit.failures.length ? `${audit.failures.join("\n")}\n` : "No executable audit failures.\n");
writeFileSync(resolve(outputDir, "blr-001-english-gap-audit-ql-contracts.json"), `${JSON.stringify(BLR_001_QL_CONTRACTS, null, 2)}\n`);
writeFileSync(resolve(outputDir, "blr-001-english-gap-audit-scope.json"), `${JSON.stringify(BLR_001_SCOPE_COVERAGE, null, 2)}\n`);

const qlRows = BLR_001_QL_CONTRACTS.map((contract) => [
  contract.qlId,
  contract.checkpointId,
  contract.solveAuthority,
  String(audit.qlQuestionCounts[contract.qlId] ?? 0),
  contract.ownership,
].map((entry) => `"${String(entry).replace(/"/g, '""')}"`).join(","));
writeFileSync(resolve(outputDir, "blr-001-english-gap-audit-ql-contracts.csv"), [
  '"qlId","checkpointId","solveAuthority","auditedQuestions","ownership"',
  ...qlRows,
].join("\n") + "\n");

const summaryCards = [
  ["Permanent QLs", audit.permanentQlCount],
  ["Solve authorities", audit.solveAuthorityCount],
  ["Audited questions", audit.auditedQuestionCount],
  ["Exact cross-QL collisions", audit.exactCrossQlSurfaceCollisions],
  ["Learner-text failures", audit.learnerTextFailures],
  ["Gender-evidence failures", audit.genderEvidenceFailures],
  ["Option failures", audit.optionContractFailures],
  ["Lifecycle failures", audit.lifecycleLockFailures],
].map(([label, value]) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`).join("");

const contractRows = BLR_001_QL_CONTRACTS.map((contract) => `<tr>
  <td>${escapeHtml(contract.qlId)}</td><td>${escapeHtml(contract.checkpointId)}</td>
  <td><code>${escapeHtml(contract.solveAuthority)}</code></td>
  <td>${audit.qlQuestionCounts[contract.qlId] ?? 0}</td><td>${escapeHtml(contract.ownership)}</td>
</tr>`).join("");
const scopeRows = BLR_001_SCOPE_COVERAGE.map((entry) => `<tr>
  <td>${escapeHtml(entry.family)}</td><td>${escapeHtml(entry.status)}</td><td>${escapeHtml(entry.owners.join(", ") || "—")}</td>
</tr>`).join("");
const sampleCards = audit.reviewSamples.map(questionCard).join("");
const failures = audit.failures.length
  ? `<ul class="failures">${audit.failures.slice(0, 100).map((failure) => `<li>${escapeHtml(failure)}</li>`).join("")}</ul>`
  : `<p class="pass">No executable failures were detected.</p>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>BLR-001 English Gap Audit</title>
<style>
:root{font-family:Inter,system-ui,sans-serif;color:#172033;background:#f4f6fa}body{margin:0}.wrap{max-width:1240px;margin:auto;padding:28px}h1{margin-bottom:6px}.muted{color:#667085}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:22px 0}.metric,.card,.panel{background:white;border:1px solid #dfe3eb;border-radius:14px;padding:16px;box-shadow:0 3px 14px #1720330d}.metric strong{font-size:28px;display:block}.metric span{font-size:13px;color:#667085}.panel{margin:18px 0;overflow:auto}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;border-bottom:1px solid #eaecf0;padding:10px;vertical-align:top}code{white-space:nowrap}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.eyebrow{font-size:12px;color:#475467;font-weight:700}.passage{background:#f8fafc;border-left:4px solid #98a2b3;padding:10px;margin:12px 0;white-space:normal}.card h3{font-size:17px;line-height:1.45}.card ol{padding-left:24px}.card li{margin:7px 0}.correct{font-weight:700}.pass{background:#ecfdf3;color:#027a48;padding:12px;border-radius:10px}.failures{background:#fff1f3;color:#b42318;padding:16px 32px;border-radius:10px}@media(max-width:800px){.metrics{grid-template-columns:repeat(2,1fr)}.cards{grid-template-columns:1fr}.wrap{padding:16px}}@media(max-width:480px){.metrics{grid-template-columns:1fr}}
</style></head><body><main class="wrap">
<h1>BLR-001 Chapter-Wide English Gap Audit</h1>
<p class="muted">${escapeHtml(audit.auditVersion)} · ${escapeHtml(audit.permanentQlRange)} · verdict: <strong>${escapeHtml(audit.verdict)}</strong></p>
<section class="metrics">${summaryCards}</section>
<section class="panel"><h2>Executable verdict</h2>${failures}
<p>Normalized template overlaps are reported for editorial inspection and are not automatically treated as solve-authority collisions: <strong>${audit.normalizedCrossQlTemplateCollisions}</strong>.</p>
${audit.templateCollisionExamples.length ? `<p class="muted">Examples: ${escapeHtml(audit.templateCollisionExamples.join("; "))}</p>` : ""}</section>
<section class="panel"><h2>Permanent QL ownership</h2><table><thead><tr><th>QL</th><th>Checkpoint</th><th>Authority</th><th>Audited</th><th>Ownership</th></tr></thead><tbody>${contractRows}</tbody></table></section>
<section class="panel"><h2>Scope coverage</h2><table><thead><tr><th>Source family</th><th>Status</th><th>Owners</th></tr></thead><tbody>${scopeRows}</tbody></table></section>
<h2>Human-review samples</h2><p class="muted">Two deterministic samples per permanent QL. Correct answers are hidden inside each disclosure.</p>
<section class="cards">${sampleCards}</section>
</main></body></html>`;
writeFileSync(resolve(outputDir, "blr-001-english-gap-audit-review.html"), html);

const markdown = `# BLR-001 — Chapter-Wide English Gap Audit\n\nStatus: **${audit.verdict}**.\n\n\`\`\`text\nPermanent QLs:                  ${audit.permanentQlCount}\nSolve authorities:             ${audit.solveAuthorityCount}\nAudited questions:             ${audit.auditedQuestionCount}\nExact cross-QL collisions:     ${audit.exactCrossQlSurfaceCollisions}\nLearner-text failures:         ${audit.learnerTextFailures}\nGender-evidence failures:      ${audit.genderEvidenceFailures}\nOption-contract failures:      ${audit.optionContractFailures}\nLifecycle-lock failures:       ${audit.lifecycleLockFailures}\nOwnership failures:            ${audit.ownershipFailures}\nOpen included source families: ${audit.openIncludedScopeFamilies}\n\`\`\`\n\nThe planned chapter contains seven content checkpoints and 35 permanent English review-only QLs. There is no planned BLR-CP-008. The next available identity, BLR-QL-036, remains unallocated unless a later source audit proves a genuinely uncovered solve authority.\n\nManual English freeze, localisation, Question Studio integration, Question Bank storage, mock-test eligibility, publication, production staging and merge remain separate explicit gates.\n`;
writeFileSync(resolve(outputDir, "BLR-001-ENGLISH-GAP-AUDIT.md"), markdown);

console.log(JSON.stringify({ outputDir, verdict: audit.verdict, auditedQuestionCount: audit.auditedQuestionCount, failureCount: audit.failures.length }, null, 2));
