import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { STA_ENGLISH_CORPUS_BY_QL, STA_ENGLISH_CORPUS_V1, getStaEnglishCorpusCoverage } from "./english-corpus/index.ts";
import { generateStaQuestionFromPool } from "./generator.ts";
import type { StaQlId } from "./types.ts";

const outputDir = process.env.STA_ENGLISH_REVIEW_OUTPUT_DIR ?? "/tmp/sta-001-english-corpus-review";
const examplesPerQl = Number(process.env.STA_ENGLISH_REVIEW_EXAMPLES_PER_QL ?? 15);
const qlIds: readonly StaQlId[] = ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"];
mkdirSync(outputDir, { recursive: true });

const questions = qlIds.flatMap((qlId) =>
  Array.from({ length: examplesPerQl }, (_, index) =>
    generateStaQuestionFromPool(`STA-EN-REVIEW-${qlId}-${index}`, qlId, STA_ENGLISH_CORPUS_BY_QL),
  ),
);

const exportRows = questions.map((question) => {
  const authority = STA_ENGLISH_CORPUS_V1.find((scenario) => scenario.scenarioId === question.scenarioId);
  if (!authority) throw new Error(`Missing corpus authority ${question.scenarioId}`);
  return {
    ...question,
    corpusFamilyId: authority.corpusFamilyId,
    domain: authority.domain,
    semanticShape: authority.semanticShape,
  };
});

writeFileSync(join(outputDir, "sta-001-english-corpus-review.json"), JSON.stringify(exportRows, null, 2), "utf8");
writeFileSync(join(outputDir, "sta-001-english-corpus-coverage.json"), JSON.stringify(getStaEnglishCorpusCoverage(), null, 2), "utf8");

function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const cards = exportRows.map((question) => {
  const assumptions = question.candidates.map((candidate) => `<li><strong>${candidate.label}.</strong> ${esc(candidate.text)}</li>`).join("");
  const options = question.options.map((option, index) => `<li>${String.fromCharCode(65 + index)}. ${esc(option.display)}</li>`).join("");
  const explanation = esc(question.explanation).replaceAll("\n", "<br>");
  return `<article data-ql="${question.qlId}" data-domain="${question.domain}">
    <h2>${question.qlId} · ${esc(question.domain)} · ${esc(question.corpusFamilyId)}</h2>
    <p class="meta">${esc(question.sourceProfile)} · ${esc(question.difficulty)} · ${question.candidates.length} assumptions · ${esc(question.semanticShape)} · ${esc(question.scenarioId)}</p>
    <p><strong>Statement:</strong> ${esc(question.statement)}</p>
    <p><strong>Assumptions:</strong></p><ol class="roman">${assumptions}</ol>
    <p><strong>Options:</strong></p><ol>${options}</ol>
    <p><strong>Answer:</strong> ${String.fromCharCode(65 + question.answerIndex)}. ${esc(question.options[question.answerIndex].display)}</p>
    <div class="explanation"><strong>Explanation</strong><br>${explanation}</div>
  </article>`;
}).join("\n");

const coverage = getStaEnglishCorpusCoverage();
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>STA-001 English Corpus Review</title><style>
body{font-family:system-ui,-apple-system,sans-serif;max-width:1040px;margin:32px auto;padding:0 18px;line-height:1.55;background:#fff;color:#111}
.summary{border:1px solid #ccc;border-radius:12px;padding:16px;margin-bottom:24px}article{border:1px solid #ddd;border-radius:12px;padding:20px;margin:0 0 24px;break-inside:avoid}h1,h2{line-height:1.2}.meta{color:#555;font-size:14px}.roman{list-style-type:upper-roman}.explanation{background:#f7f7f7;border-radius:8px;padding:14px;margin-top:14px}
</style></head><body><h1>STA-001 — English Corpus Candidate Review</h1>
<div class="summary"><strong>Corpus status:</strong> CANDIDATE_NOT_FROZEN<br>
<strong>Authorities:</strong> ${coverage.totalScenarios} · <strong>Families:</strong> ${coverage.familyCount} · <strong>Domains:</strong> ${coverage.domains.length}<br>
<strong>QL distribution:</strong> ${qlIds.map((qlId) => `${qlId}: ${coverage.byQl[qlId]}`).join(" · ")}<br>
Question Studio remains closed.</div>${cards}</body></html>`;

writeFileSync(join(outputDir, "sta-001-english-corpus-review.html"), html, "utf8");
console.log(`WROTE_STA_001_ENGLISH_CORPUS_REVIEW ${exportRows.length} questions -> ${outputDir}`);
