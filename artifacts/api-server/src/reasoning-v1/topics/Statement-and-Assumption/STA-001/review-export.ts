import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateStaDiscoveryQuestion } from "./generator.ts";
import type { StaProposedQlId, StaQuestion } from "./types.ts";

const outputDir = process.env.STA_DISCOVERY_REVIEW_OUTPUT_DIR ?? "/tmp/sta-001-discovery-review";
const examplesPerQl = Number(process.env.STA_DISCOVERY_REVIEW_EXAMPLES_PER_QL ?? 6);
const qlIds: readonly StaProposedQlId[] = ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"];
mkdirSync(outputDir, { recursive: true });

const questions: StaQuestion[] = [];
for (const qlId of qlIds) {
  for (let index = 0; index < examplesPerQl; index += 1) {
    questions.push(generateStaDiscoveryQuestion(`STA-REVIEW-${qlId}-${index}`, qlId));
  }
}

writeFileSync(join(outputDir, "sta-001-discovery-review.json"), JSON.stringify(questions, null, 2), "utf8");

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const cards = questions.map((question) => {
  const assumptions = question.candidates.map((candidate) => `<li><strong>${candidate.label}.</strong> ${escapeHtml(candidate.text)}</li>`).join("");
  const options = question.options.map((option, index) => `<li>${String.fromCharCode(65 + index)}. ${escapeHtml(option.display)}</li>`).join("");
  const explanation = escapeHtml(question.explanation).replaceAll("\n", "<br>");
  return `<article>
    <h2>${question.proposedQlId} · ${question.scenarioId}</h2>
    <p class="meta">${question.sourceProfile} · ${question.difficulty} · ${question.candidates.length} assumptions · seed ${escapeHtml(question.seed)}</p>
    <p><strong>Statement:</strong> ${escapeHtml(question.statement)}</p>
    <p><strong>Assumptions:</strong></p><ol class="roman">${assumptions}</ol>
    <p><strong>Options:</strong></p><ol>${options}</ol>
    <p><strong>Answer:</strong> ${String.fromCharCode(65 + question.answerIndex)}. ${escapeHtml(question.options[question.answerIndex].display)}</p>
    <div class="explanation"><strong>Explanation</strong><br>${explanation}</div>
  </article>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>STA-001 Discovery Review</title>
<style>
body{font-family:system-ui,-apple-system,sans-serif;max-width:980px;margin:32px auto;padding:0 18px;line-height:1.55;background:#fff;color:#111}
article{border:1px solid #ddd;border-radius:12px;padding:20px;margin:0 0 24px;break-inside:avoid}h1,h2{line-height:1.2}.meta{color:#555;font-size:14px}.roman{list-style-type:upper-roman}.explanation{background:#f7f7f7;border-radius:8px;padding:14px;margin-top:14px}
</style></head><body>
<h1>STA-001 — Executable Discovery Review</h1>
<p>Temporary review pack only. Proposed QLs are not permanent. Question Studio remains closed.</p>
${cards}
</body></html>`;

writeFileSync(join(outputDir, "sta-001-discovery-review.html"), html, "utf8");
console.log(`WROTE_STA_001_DISCOVERY_REVIEW ${questions.length} questions -> ${outputDir}`);
