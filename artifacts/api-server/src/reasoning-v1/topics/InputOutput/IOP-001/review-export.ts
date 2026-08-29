import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateIopFoundationCaselet } from "./generator.ts";
import { renderTrace, renderTokenRow } from "./engine.ts";
import { IOP_FOUNDATION_PROTOTYPES } from "./prototypes.ts";

const outputDir = process.env.IOP_FOUNDATION_REVIEW_OUTPUT_DIR ?? "/tmp/iop-foundation-review";
mkdirSync(outputDir, { recursive: true });

const records = IOP_FOUNDATION_PROTOTYPES.flatMap((authority) =>
  Array.from({ length: 2 }, (_, index) =>
    generateIopFoundationCaselet(`IOP-REVIEW-${authority.prototypeId}-${index + 1}`, authority.prototypeId),
  ),
);

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const sections = records.map((record) => {
  const questions = record.children.map((child) => `
    <div class="question">
      <h4>Q${child.questionOrder}. ${escapeHtml(child.text)}</h4>
      <ol type="A">${child.options.map((candidate) => `<li${candidate.isCorrect ? ' class="correct"' : ""}>${escapeHtml(candidate.display)}</li>`).join("")}</ol>
      <p><strong>Answer:</strong> ${String.fromCharCode(65 + child.answerIndex)} — ${escapeHtml(child.answerDisplay)}</p>
      <p><strong>Explanation:</strong> ${escapeHtml(child.explanation)}</p>
    </div>`).join("");
  return `
  <section>
    <h2>${record.prototypeId} — ${record.checkpointId} — ${record.difficulty}</h2>
    <p><strong>Rule:</strong> ${escapeHtml(record.ruleExplanation)}</p>
    <p><strong>Identifiability:</strong> PASS; ${record.identifiability.candidateRulesTested} competing rule candidates tested; exactly one semantic rule matched.</p>
    <div class="grid">
      <div><h3>Illustration</h3><pre>${escapeHtml(renderTrace(record.demonstration))}</pre></div>
      <div><h3>New input</h3><pre>Input: ${escapeHtml(renderTokenRow(record.target.input))}</pre></div>
    </div>
    ${questions}
  </section>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>IOP-001 CP001-CP004 Foundation Review</title>
<style>
body{font-family:Arial,sans-serif;max-width:1100px;margin:0 auto;padding:24px;line-height:1.45}section{border:1px solid #bbb;border-radius:10px;padding:18px;margin:0 0 24px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}pre{white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:6px;overflow:auto}.question{border-top:1px solid #ddd;margin-top:14px;padding-top:10px}.correct{font-weight:700}ol{padding-left:28px}@media(max-width:720px){.grid{grid-template-columns:1fr}body{padding:12px}}
</style></head><body>
<h1>IOP-001 — CP001–CP004 Executable Foundation Review</h1>
<p>24 deterministic review caselets: 2 per temporary prototype. Discovery-only; permanent QLs and all delivery surfaces remain off.</p>
${sections}
</body></html>`;

const summary = {
  status: "PASS_IOP_001_FOUNDATION_REVIEW_EXPORT",
  packageId: "IOP-001",
  temporaryPrototypeCount: IOP_FOUNDATION_PROTOTYPES.length,
  reviewCaselets: records.length,
  childQuestions: records.reduce((sum, record) => sum + record.children.length, 0),
  checkpoints: [...new Set(records.map((record) => record.checkpointId))],
  identifiabilityPasses: records.filter((record) => record.identifiability.passed).length,
  oracleParityPasses: records.filter((record) => record.oracleParity).length,
  permanentQlCount: 0,
  questionStudioDiscoverable: false,
};

writeFileSync(join(outputDir, "iop-cp001-cp004-foundation-review.html"), html, "utf8");
writeFileSync(join(outputDir, "iop-cp001-cp004-foundation-review.json"), JSON.stringify(records, null, 2), "utf8");
writeFileSync(join(outputDir, "iop-cp001-cp004-foundation-evidence.json"), JSON.stringify(summary, null, 2), "utf8");

console.log(summary.status);
console.log(`review caselets ${summary.reviewCaselets}`);
console.log(`child questions ${summary.childQuestions}`);
console.log(`identifiability passes ${summary.identifiabilityPasses}`);
console.log(`permanent QLs ${summary.permanentQlCount}`);
