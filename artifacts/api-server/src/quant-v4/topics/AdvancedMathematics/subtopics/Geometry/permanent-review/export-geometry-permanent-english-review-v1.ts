import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1,
  GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1,
  generateGeometryPermanentEnglishCandidateV1,
  type GeometryPermanentEnglishCandidateItemV1,
} from "./geometry-permanent-english-runtime-v1";
import { GEO_SOLVE_MODE_FREEZE_PROOF_V1 } from "./geometry-solve-mode-freeze-proof-v1";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-permanent-english-review-v1");
mkdirSync(outputDirectory, { recursive: true });

const reviewItems: GeometryPermanentEnglishCandidateItemV1[] = GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.flatMap(
  (definition) => definition.prototypeIds.map((_, variantIndex) =>
    generateGeometryPermanentEnglishCandidateV1(
      definition.qlId,
      `geo-en-review-${definition.qlId.toLowerCase()}-variant-${variantIndex}-${String.fromCharCode(97 + (variantIndex % 12))}`,
      variantIndex,
    ),
  ),
);

const stressSuffixes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"] as const;
let stressSampleCount = 0;
let diagramReviewItemCount = 0;
for (const item of reviewItems) if (item.stemSvg !== null || item.diagramModel !== null) diagramReviewItemCount += 1;
for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    for (const suffix of stressSuffixes) {
      generateGeometryPermanentEnglishCandidateV1(
        definition.qlId,
        `geo-en-stress-${definition.qlId.toLowerCase()}-${variantIndex}-${suffix}`,
        variantIndex,
      );
      stressSampleCount += 1;
    }
  }
}

const summary = Object.freeze({
  status: "GEOMETRY_PERMANENT_ENGLISH_REVIEW_V1_READY_FOR_EXPLICIT_APPROVAL",
  authorityRevision: 3,
  locale: "en-IN",
  permanentQlCount: GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length,
  mappedPrototypeVariantCount: reviewItems.length,
  deterministicReviewSampleCount: reviewItems.length,
  stressSampleCount,
  diagramReviewItemCount,
  solveModeFreezeProofRunId: GEO_SOLVE_MODE_FREEZE_PROOF_V1.proof.workflowRunId,
  englishImplementationFrozen: false,
  downstreamLocked: true,
  nextGate: "EXPLICIT_ENGLISH_ARTIFACT_APPROVAL",
});

writeFileSync(
  resolve(outputDirectory, "geometry-permanent-english-review-v1.json"),
  JSON.stringify({ summary, runtimeAuthority: GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1, reviewItems }, null, 2) + "\n",
);

const markdown = [
  "# ExamTree Geometry — Permanent English Review V1",
  "",
  `**QLs:** ${summary.permanentQlCount}`,
  `**Mapped prototype variants:** ${summary.mappedPrototypeVariantCount}`,
  `**Stress samples:** ${summary.stressSampleCount}`,
  `**Locale:** ${summary.locale}`,
  "",
  "This is a review artifact only. English content is not frozen and all downstream publication/Question Studio gates remain locked.",
  "",
  ...reviewItems.flatMap((item) => [
    `## ${item.qlId} / ${item.canonicalSolveModeFamilyId} — ${item.prototypeId}`,
    "",
    `**Solve mode:** \`${item.prototypeSolveMode}\`  `,
    `**Seed:** \`${item.seed}\``,
    "",
    item.question,
    "",
    ...item.options.map((option, index) => `${index + 1}. ${option}${index === item.correctIndex ? " **✓**" : ""}`),
    "",
    `**Answer:** ${item.canonicalAnswer}`,
    "",
    "**Explanation**",
    "",
    ...item.explanationLines.map((line) => `- ${line}`),
    "",
  ]),
  "Next gate: explicit product-owner approval of this exact review artifact before English freeze.",
  "",
].join("\n");
writeFileSync(resolve(outputDirectory, "geometry-permanent-english-review-v1.md"), markdown);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const cards = reviewItems.map((item) => {
  const options = item.options.map((option, index) =>
    `<li${index === item.correctIndex ? ' class="correct"' : ""}>${escapeHtml(option)}</li>`,
  ).join("");
  const explanation = item.explanationLines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
  const diagram = item.stemSvg ? `<div class="diagram">${item.stemSvg}</div>` : "";
  return `<article class="card"><div class="meta">${escapeHtml(item.qlId)} · ${escapeHtml(item.canonicalSolveModeFamilyId)} · ${escapeHtml(item.prototypeId)} · ${escapeHtml(item.prototypeSolveMode)}</div><h2>${escapeHtml(item.question)}</h2>${diagram}<ol>${options}</ol><div class="answer"><strong>Answer:</strong> ${escapeHtml(item.canonicalAnswer)}</div><div class="explanation"><strong>Explanation</strong>${explanation}</div></article>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Geometry Permanent English Review V1</title><style>body{font-family:Arial,sans-serif;background:#fff;color:#111;margin:0;padding:24px;line-height:1.45}.wrap{max-width:1000px;margin:auto}.summary{border:1px solid #ddd;padding:16px;margin-bottom:24px;border-radius:8px}.card{border:1px solid #ddd;border-radius:8px;padding:18px;margin:0 0 18px;break-inside:avoid}.meta{font-size:12px;color:#555;margin-bottom:8px}.card h2{font-size:18px;margin:8px 0 14px}.card ol{padding-left:24px}.card li{padding:3px 0}.card li.correct{font-weight:700}.answer{margin-top:12px}.explanation{margin-top:12px;border-top:1px solid #eee;padding-top:10px}.explanation p{margin:6px 0}.diagram{background:#fff;padding:12px;overflow:auto}.diagram svg{max-width:100%;height:auto}</style></head><body><div class="wrap"><h1>ExamTree Geometry — Permanent English Review V1</h1><div class="summary"><p>75 permanent QLs · 81 mapped prototype variants · ${stressSampleCount} stress samples · locale en-IN.</p><p><strong>Review only:</strong> English is not frozen. Localisation, Question Studio, Question Bank, test eligibility and publication remain locked.</p></div>${cards}</div></body></html>`;
writeFileSync(resolve(outputDirectory, "geometry-permanent-english-review-v1.html"), html);

console.log(JSON.stringify({
  status: "EXPORTED_GEOMETRY_PERMANENT_ENGLISH_REVIEW_V1",
  permanentQlCount: summary.permanentQlCount,
  mappedPrototypeVariantCount: summary.mappedPrototypeVariantCount,
  deterministicReviewSampleCount: summary.deterministicReviewSampleCount,
  stressSampleCount: summary.stressSampleCount,
  diagramReviewItemCount: summary.diagramReviewItemCount,
  outputDirectory,
  nextGate: summary.nextGate,
}));
