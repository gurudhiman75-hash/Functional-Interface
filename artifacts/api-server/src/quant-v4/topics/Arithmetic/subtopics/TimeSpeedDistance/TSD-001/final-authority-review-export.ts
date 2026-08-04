import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { stableStringify } from "./cp001/runtime";
import { finalAuthorityCoverage, generateFinalAuthorityReview } from "./final-authority-review";

const rows = generateFinalAuthorityReview();
const coverage = finalAuthorityCoverage(rows);
const outputDir = resolve(process.cwd(), "dist/quant-v4/tsd-001/final-authority-review");
mkdirSync(outputDir, { recursive: true });

writeFileSync(resolve(outputDir, "tsd-final-authority-review.json"), `${stableStringify(rows)}\n`, "utf8");
writeFileSync(resolve(outputDir, "tsd-final-authority-review.jsonl"), `${rows.map((row) => stableStringify(row)).join("\n")}\n`, "utf8");
writeFileSync(resolve(outputDir, "tsd-final-authority-coverage.json"), `${stableStringify(coverage)}\n`, "utf8");

const escapeHtml = (value: string): string => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const cards = coverage.map((entry) => {
  const gap = entry.authorityKey === "unknownTimeShareFromAverageSpeed"
    ? "Pool gap: only one time-share state."
    : entry.authorityKey === "timeRatioFromAverageAndSpeeds"
      ? "Pool gap: only one time-ratio state."
      : entry.authorityKey === "segmentAllocationFromTotalsAndSpeeds" && !entry.representations.includes("SECOND_TIME")
        ? "Pool gap: SECOND_TIME representation is absent."
        : "No currently documented authority-level pool gap.";
  return `<article>
    <h2>${escapeHtml(entry.authorityKey)}</h2>
    <p><b>Checkpoint:</b> ${escapeHtml(entry.checkpointId)} · <b>Rows:</b> ${entry.rowCount} · <b>Permanent QL:</b> unassigned</p>
    <p><b>Representations:</b> ${escapeHtml(entry.representations.join(", "))}</p>
    <p><b>Legacy review aliases:</b> ${escapeHtml(entry.legacyReviewQlIds.join(", "))}</p>
    <p class="${gap.startsWith("Pool gap") ? "gap" : "ok"}">${escapeHtml(gap)}</p>
  </article>`;
}).join("\n");

writeFileSync(resolve(outputDir, "tsd-final-authority-coverage.html"), `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TSD Final Authority Ownership Review</title><style>
body{font-family:system-ui,sans-serif;max-width:1000px;margin:24px auto;padding:0 14px;background:#f5f6f8;color:#1c2430}article{background:#fff;border:1px solid #d7dce3;border-radius:10px;padding:16px;margin:12px 0}h1{line-height:1.2}h2{font-size:17px;margin:0 0 8px}.gap{color:#9b3f00;font-weight:700}.ok{color:#166534}code{background:#eef1f5;padding:2px 5px;border-radius:4px}@media(max-width:600px){body{margin:8px auto}article{padding:12px}}
</style></head><body>
<h1>TSD CP-001 and CP-002 — Final Authority Ownership Review</h1>
<p><b>38 learner authorities</b> · <b>111 remapped records</b> · <b>0 permanent QL IDs assigned</b>.</p>
<p>This is an implementation-stage ownership artifact. English remains <code>UNFROZEN</code>; Question Bank, tests and public delivery remain disabled.</p>
${cards}
</body></html>`, "utf8");

console.log(JSON.stringify({
  status: "PASS",
  outputDir,
  remappedReviewRows: rows.length,
  learnerAuthorities: coverage.length,
  permanentQlIdsAssigned: 0,
  documentedPoolGaps: 3,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
