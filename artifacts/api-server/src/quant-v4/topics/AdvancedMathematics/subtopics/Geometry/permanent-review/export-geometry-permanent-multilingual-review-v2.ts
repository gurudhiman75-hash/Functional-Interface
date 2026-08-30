import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1 } from "./geometry-permanent-english-runtime-v1";
import {
  GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2,
  generateGeometryPermanentMultilingualReviewV2,
} from "./geometry-permanent-multilingual-review-v2";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-permanent-multilingual-review-v2");
mkdirSync(outputDirectory, { recursive: true });
const locales = GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.locales;
const reviewItems = GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.flatMap((definition) =>
  definition.prototypeIds.flatMap((_, variantIndex) =>
    locales.map((locale) => generateGeometryPermanentMultilingualReviewV2(
      definition.qlId,
      `geo-ml-v2-review-${definition.qlId.toLowerCase()}-${variantIndex}-${locale}`,
      locale,
      variantIndex,
    )),
  ),
);

const learnerProjection = reviewItems.map((item) => ({
  qlId: item.qlId,
  canonicalSolveModeFamilyId: item.canonicalSolveModeFamilyId,
  prototypeId: item.prototypeId,
  prototypeSolveMode: item.prototypeSolveMode,
  variantIndex: item.variantIndex,
  locale: item.locale,
  englishQuestion: item.englishQuestion,
  question: item.question,
  englishOptions: item.englishOptions,
  options: item.options,
  correctIndex: item.correctIndex,
  englishAnswer: item.englishAnswer,
  canonicalAnswer: item.canonicalAnswer,
  englishExplanation: item.englishExplanation,
  explanation: item.explanation,
  stemSvg: item.stemSvg,
  canonicalGeometryFingerprint: item.canonicalGeometryFingerprint,
  diagramFingerprint: item.diagramFingerprint,
  reviewStatus: item.reviewStatus,
}));

const summary = Object.freeze({
  status: "GEOMETRY_HINDI_PUNJABI_HUMAN_EDITORIAL_REVIEW_V2_READY_FOR_EXACT_ARTIFACT_AUDIT",
  permanentQlCount: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.permanentQlCount,
  mappedPrototypeVariantCount: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.mappedPrototypeVariantCount,
  humanEditorialTemplateCount: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.templateAuthorityCount,
  localeCount: locales.length,
  locales,
  deterministicReviewSampleCount: reviewItems.length,
  rejectedPriorArtifactId: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.rejectedPriorReviewArtifactId,
  multilingualImplementationFrozen: false,
  downstreamLocked: true,
  nextGate: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.postProofNextGate,
});

writeFileSync(
  resolve(outputDirectory, "geometry-permanent-multilingual-review-v2.json"),
  JSON.stringify({ summary, learnerProjection }, null, 2) + "\n",
);

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

const cards = reviewItems.map((item) => {
  const opts = item.options.map((option, index) => `<li${index === item.correctIndex ? ' class="correct"' : ""}>${escapeHtml(option)}</li>`).join("");
  const englishOpts = item.englishOptions.map((option, index) => `<li${index === item.correctIndex ? ' class="correct"' : ""}>${escapeHtml(option)}</li>`).join("");
  const diagram = item.stemSvg ? `<div class="diagram">${item.stemSvg}</div>` : "";
  return `<article class="card"><div class="meta">${escapeHtml(item.qlId)} · ${escapeHtml(item.prototypeId)} · ${escapeHtml(item.locale)}</div>${diagram}<div class="cols"><section><h3>Frozen English source</h3><p>${escapeHtml(item.englishQuestion)}</p><ol>${englishOpts}</ol><div class="exp">${escapeHtml(item.englishExplanation).replaceAll("\n", "<br>")}</div></section><section><h3>${item.locale === "hi-IN" ? "Hindi" : "Punjabi"} V2 human-editorial candidate</h3><p>${escapeHtml(item.question)}</p><ol>${opts}</ol><div class="exp">${escapeHtml(item.explanation).replaceAll("\n", "<br>")}</div></section></div></article>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Geometry Hindi Punjabi Human Editorial Review V2</title><style>body{font-family:Arial,Noto Sans Devanagari,Noto Sans Gurmukhi,sans-serif;background:#fff;color:#111;margin:0;padding:20px}.wrap{max-width:1200px;margin:auto}.notice{padding:12px;border:1px solid #aaa;border-radius:8px;margin-bottom:18px}.card{border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 18px}.meta{font-size:12px;color:#555}.cols{display:grid;grid-template-columns:1fr 1fr;gap:20px}.correct{font-weight:700}.exp{border-top:1px solid #eee;padding-top:8px;line-height:1.55}.diagram{background:#fff;padding:8px;overflow:auto}.diagram svg{max-width:100%;height:auto}@media(max-width:760px){.cols{grid-template-columns:1fr}}</style></head><body><div class="wrap"><h1>ExamTree Geometry — Hindi/Punjabi Human-Editorial Review V2</h1><div class="notice">V1 artifact ${summary.rejectedPriorArtifactId} was editorially rejected. V2 uses prototype-aware full-sentence templates tied to frozen English. This remains a review artifact, not a multilingual freeze.</div><p>${summary.permanentQlCount} permanent QLs · ${summary.mappedPrototypeVariantCount} mapped variants · ${summary.deterministicReviewSampleCount} side-by-side items · ${summary.humanEditorialTemplateCount} human-editorial prototype templates.</p>${cards}</div></body></html>`;
writeFileSync(resolve(outputDirectory, "geometry-permanent-multilingual-review-v2.html"), html);

const md = [
  "# ExamTree Geometry — Hindi/Punjabi Human-Editorial Review V2",
  "",
  `**Permanent QLs:** ${summary.permanentQlCount}`,
  `**Mapped variants:** ${summary.mappedPrototypeVariantCount}`,
  `**Human-editorial prototype templates:** ${summary.humanEditorialTemplateCount}`,
  `**Review items:** ${summary.deterministicReviewSampleCount}`,
  `**Rejected V1 artifact:** ${summary.rejectedPriorArtifactId}`,
  "",
  "V2 is a human-editorial review candidate anchored to the proven English freeze. Multilingual freeze and all downstream activation remain locked.",
  "",
  ...reviewItems.flatMap((item) => [
    `## ${item.qlId} — ${item.prototypeId} — ${item.locale}`,
    "",
    `**English:** ${item.englishQuestion}`,
    "",
    `**Localized V2:** ${item.question}`,
    "",
    ...item.options.map((option, index) => `${index + 1}. ${option}${index === item.correctIndex ? " **✓**" : ""}`),
    "",
    `**Explanation:** ${item.explanation.replaceAll("\n", "  \n")}`,
    "",
  ]),
].join("\n");
writeFileSync(resolve(outputDirectory, "geometry-permanent-multilingual-review-v2.md"), md);

console.log(JSON.stringify({
  status: "EXPORTED_GEOMETRY_HINDI_PUNJABI_HUMAN_EDITORIAL_REVIEW_V2",
  permanentQlCount: summary.permanentQlCount,
  mappedPrototypeVariantCount: summary.mappedPrototypeVariantCount,
  humanEditorialTemplateCount: summary.humanEditorialTemplateCount,
  localeCount: summary.localeCount,
  deterministicReviewSampleCount: summary.deterministicReviewSampleCount,
  rejectedPriorArtifactId: summary.rejectedPriorArtifactId,
  outputDirectory,
  nextGate: summary.nextGate,
}));
