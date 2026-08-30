import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES } from "./wave9-prototypes";
import { GEO_GAP_REMEDIATION_WAVE9_SOURCE_EVIDENCE } from "./wave9-source-evidence";

function jsonStringify(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-gap-remediation-wave9-review");
mkdirSync(outputDirectory, { recursive: true });
const seeds = ["wave9-a", "wave9-b", "wave9-c"] as const;
const questions = GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES.flatMap((prototype) => seeds.map((seed) => prototype.generate(seed)));

writeFileSync(resolve(outputDirectory, "geometry-gap-remediation-wave9-review.json"), `${jsonStringify({
  status: "SOURCE_GAP_REMEDIATION_WAVE9_REVIEW_CANDIDATE",
  authorityRevision: 3,
  scope: "GEO-CP-001..003 lines and core triangle residuals",
  approvedTemporaryPrototypeCountBeforeWave9: 63,
  wave8ReviewCandidateCount: 3,
  wave9ReviewCandidateCount: GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES.length,
  currentTemporaryPrototypeCandidateCount: 70,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  sourceEvidence: GEO_GAP_REMEDIATION_WAVE9_SOURCE_EVIDENCE,
  questions,
})}\n`, "utf8");

const html = `<!doctype html><html><head><meta charset="utf-8"><title>Geometry Wave 9 Review</title><style>
body{font-family:Arial,sans-serif;background:#fff;color:#111;margin:24px;line-height:1.45}.card{border:1px solid #ddd;border-radius:10px;padding:18px;margin:0 0 24px;page-break-inside:avoid}.meta{font-size:13px;color:#555}.diagram{max-width:520px;margin:14px auto}.options{margin:12px 0}.answer{font-weight:700}.explain{background:#f7f7f7;padding:12px;border-radius:8px}svg{width:100%;height:auto}</style></head><body>
<h1>ExamTree Geometry — Wave 9 Review</h1><p><strong>Status:</strong> implementation/review candidate only. Not approved or frozen.</p><p><strong>Scope:</strong> CP001 around-point sum, CP002 alternate-interior transfer, CP003 triangle-inequality integer count and claim recognition.</p>
${questions.map((question, index) => `<section class="card"><div class="meta">${index + 1}. ${escapeHtml(question.temporaryPrototypeId)} · ${escapeHtml(question.seed)} · ${escapeHtml(question.diagramDisposition)}</div><h2>${escapeHtml(question.stem)}</h2>${question.stemSvg ? `<div class="diagram">${question.stemSvg}</div>` : ""}<div class="options">${question.options.map((option, optionIndex) => `<div>${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option)}</div>`).join("")}</div><div class="answer">Answer: ${String.fromCharCode(65 + question.correctIndex)}. ${escapeHtml(question.answer)}</div><div class="explain">${question.explanation.lines.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div><div class="meta">Source: ${question.sourceEvidenceIds.map(escapeHtml).join(", ")} · Clue minimality: ${question.minimalityProof.passed ? "PASS" : "FAIL"} · Verifier: ${question.independentVerifierResult.passed ? "PASS" : "FAIL"}</div></section>`).join("\n")}
</body></html>`;
writeFileSync(resolve(outputDirectory, "geometry-gap-remediation-wave9-review.html"), html, "utf8");
console.log(JSON.stringify({ status: "EXPORTED_GEO_GAP_REMEDIATION_WAVE9_REVIEW", temporaryPrototypeCount: GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES.length, questionCount: questions.length, outputDirectory }));
