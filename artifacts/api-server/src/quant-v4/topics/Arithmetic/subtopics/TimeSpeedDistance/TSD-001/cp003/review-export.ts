import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateCp003PostOverlapReviewRows } from "./post-overlap-review";

function json(value: unknown, spacing = 2): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, spacing);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const rows = generateCp003PostOverlapReviewRows(3);
const outputDir = resolve(process.cwd(), "dist/quant-v4/tsd-001/cp003-review");
mkdirSync(outputDir, { recursive: true });

writeFileSync(resolve(outputDir, "tsd-cp003-review.json"), `${json(rows)}\n`, "utf8");
writeFileSync(
  resolve(outputDir, "tsd-cp003-review.jsonl"),
  `${rows.map((row) => json(row, 0)).join("\n")}\n`,
  "utf8",
);

const htmlRows = rows.map((row, index) => {
  const options = row.options.map((option, optionIndex) => {
    const analysis = row.explanation.optionAnalysis[optionIndex];
    const marker = optionIndex === row.correctIndex ? "✓" : "";
    return `<li><strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${escapeHtml(option)} ${marker}<br><small>${escapeHtml(analysis.reason)}</small></li>`;
  }).join("");
  const steps = row.explanation.stepByStepSolution.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  return `<article>
<h2>${index + 1}. ${escapeHtml(row.authorityKey)} · source mode ${escapeHtml(row.solveMode)}</h2>
<p><strong>Ownership:</strong> ${escapeHtml(row.ownershipDisposition)} · <strong>Authority owner:</strong> ${escapeHtml(row.authorityOwnerCheckpointId)} · <strong>Content checkpoint:</strong> ${escapeHtml(row.contentCheckpointId)}</p>
<p><strong>Representation:</strong> ${escapeHtml(row.representation)} · <strong>Difficulty:</strong> ${escapeHtml(row.difficulty.label)} / ${escapeHtml(row.difficulty.status)}</p>
<p><strong>Stem:</strong> ${escapeHtml(row.stem)}</p>
<ol type="A">${options}</ol>
<p><strong>Key rule:</strong> ${escapeHtml(row.explanation.keyRule)}</p>
<ol>${steps}</ol>
<p><strong>Shortcut:</strong> ${escapeHtml(row.explanation.examSpeedShortcut)}</p>
<p><strong>Conclusion:</strong> ${escapeHtml(row.explanation.conclusion)}</p>
</article>`;
}).join("\n");

const authorityTargets = new Set(rows.map((row) => row.authorityKey));
const newAuthorityTargets = new Set(rows.filter((row) => row.authorityOwnerCheckpointId === "TSD-CP-003").map((row) => row.authorityKey));
const priorAuthorityTargets = new Set(rows.filter((row) => row.authorityOwnerCheckpointId !== "TSD-CP-003").map((row) => row.authorityKey));
const priorRepresentationFamilies = new Set(rows.filter((row) => row.ownershipDisposition === "PRIOR_CHECKPOINT_REPRESENTATION").map((row) => row.solveMode));

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TSD-CP-003 Post-Overlap Editorial Review</title>
<style>body{font-family:Arial,sans-serif;max-width:1050px;margin:32px auto;padding:0 20px;line-height:1.45}article{border:1px solid #ddd;border-radius:8px;padding:18px;margin:0 0 22px}small{color:#444}h1{margin-bottom:4px}.meta{color:#555}li{margin:6px 0}</style></head><body>
<h1>TSD-CP-003 — Accepted Post-Overlap Editorial Review</h1>
<p class="meta">63 learner rows · 21 accepted discovery families × 3 answer-diverse rows · 18 represented authority targets · 10 new CP-003 authority candidates · 9 prior-authority representation families across 8 existing targets · scheduleBuffer rejected · English UNFROZEN · permanent QLs 0</p>
${htmlRows}
</body></html>`;
writeFileSync(resolve(outputDir, "tsd-cp003-review.html"), html, "utf8");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_ACCEPTED_POST_OVERLAP_EDITORIAL_REVIEW_EXPORT",
  rows: rows.length,
  acceptedDiscoverySolveModes: new Set(rows.map((row) => row.solveMode)).size,
  representedAuthorityTargets: authorityTargets.size,
  newCp003AuthorityTargets: newAuthorityTargets.size,
  priorRepresentationFamilies: priorRepresentationFamilies.size,
  distinctPriorAuthorityTargets: priorAuthorityTargets.size,
  rejectedStandaloneLearnerAuthorities: 1,
  rejectedSolveModes: ["scheduleBuffer"],
  validRows: rows.filter((row) => row.validation.valid).length,
  permanentQlCount: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
  difficultyStatus: "EDITORIAL_CALIBRATION_REQUIRED",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  outputDir,
}, null, 2));
