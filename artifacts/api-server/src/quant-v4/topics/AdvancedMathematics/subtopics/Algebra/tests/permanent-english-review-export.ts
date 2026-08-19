import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ALG_ENGLISH_REVIEW_V2_ID,
  ALG_PERMANENT_ALLOCATION,
  generateAlgPermanentEnglishReviewV2,
  getAlgPermanentPrototypeIds,
} from "../permanent";

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function jsonText(value: unknown): string {
  return JSON.stringify(value, (_key, nested) => typeof nested === "bigint" ? nested.toString() : nested, 2);
}

function answerText(value: unknown): string {
  if (value === null || value === undefined) return String(value);
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object" && "text" in value && typeof (value as { text?: unknown }).text === "string") {
    return (value as { text: string }).text;
  }
  return jsonText(value);
}

const reviewRows = ALG_PERMANENT_ALLOCATION.flatMap((allocation, allocationIndex) => {
  const prototypeIds = getAlgPermanentPrototypeIds(allocation.qlId);
  return prototypeIds.map((_prototypeId, variantIndex) => {
    const seed = 101 + allocationIndex * 17 + variantIndex * 7;
    return generateAlgPermanentEnglishReviewV2(allocation.qlId, seed, variantIndex);
  });
});

if (reviewRows.length !== 109) {
  throw new Error(`Expected 109 mapped Algebra permanent-English variants, got ${reviewRows.length}`);
}

const qlCounts = Object.fromEntries(ALG_PERMANENT_ALLOCATION.map((allocation) => [
  allocation.qlId,
  reviewRows.filter((row) => row.qlId === allocation.qlId).length,
]));

function renderQuestion(row: (typeof reviewRows)[number], ordinal: number): string {
  return `
  <article class="question">
    <header>
      <strong>Q${ordinal} · ${escapeHtml(row.qlId)} · ${escapeHtml(row.title)}</strong>
      <span>${escapeHtml(row.packageId)} / ${escapeHtml(row.cpId)} / ${escapeHtml(row.prototypeId)}</span>
    </header>
    <p class="meta">Solve mode: ${escapeHtml(row.prototypeSolveMode)} · seed ${row.seed} · variant ${row.variantIndex + 1}</p>
    <section>
      <h3>Question</h3>
      <p class="stem">${escapeHtml(row.question)}</p>
    </section>
    <section class="answer">
      <h3>Answer</h3>
      <pre>${escapeHtml(answerText(row.canonicalAnswer))}</pre>
    </section>
    <section class="solution">
      <h3>Solution</h3>
      <p>${escapeHtml(row.explanation)}</p>
    </section>
  </article>`;
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Algebra English V2 Review</title>
<style>
body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f5f5f5;color:#171717;margin:0}.wrap{max-width:1020px;margin:auto;padding:24px 14px 64px}.top,.question{background:#fff;border:1px solid #ddd;border-radius:12px;padding:18px;margin:14px 0}.question header{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;border-bottom:1px solid #eee;padding-bottom:10px}.meta{font-size:12px;color:#555}.stem,.solution p{font-size:16px;line-height:1.58;white-space:pre-wrap}.answer,.solution{border-top:1px solid #eee;margin-top:14px;padding-top:10px}.answer pre{white-space:pre-wrap;word-break:break-word;background:#fafafa;border:1px solid #eee;border-radius:8px;padding:10px}.summary{display:flex;gap:7px;flex-wrap:wrap}.summary span{border:1px solid #ccc;border-radius:999px;padding:4px 8px;font-size:12px}.lock{font-weight:600}</style>
</head>
<body><main class="wrap">
<section class="top">
<h1>Algebra · English V2 Review</h1>
<p>This pack contains exactly one deterministic learner-facing sample for every permanent-mapped English prototype variant after the post-freeze editorial remediation pass. Semantic QLs and solver authority are unchanged.</p>
<p class="lock">Lifecycle remains locked: corrected English freeze false · Question Studio false · Question Bank false · tests/publication false.</p>
<div class="summary"><span>Review: ${ALG_ENGLISH_REVIEW_V2_ID}</span><span>Permanent QLs: ${ALG_PERMANENT_ALLOCATION.length}</span><span>Mapped variants: ${reviewRows.length}</span><span>ALG-001: ${reviewRows.filter((row) => row.packageId === "ALG-001").length}</span><span>ALG-002: ${reviewRows.filter((row) => row.packageId === "ALG-002").length}</span></div>
</section>
${reviewRows.map((row, index) => renderQuestion(row, index + 1)).join("\n")}
</main></body></html>`;

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/algebra");
mkdirSync(outputDirectory, { recursive: true });
const htmlPath = resolve(outputDirectory, "algebra-permanent-english-review-v2-109q.html");
const jsonPath = resolve(outputDirectory, "algebra-permanent-english-review-v2-109q.json");
writeFileSync(htmlPath, html, "utf8");
writeFileSync(jsonPath, jsonText({
  status: "ALGEBRA_PERMANENT_ENGLISH_REVIEW_CANDIDATE_V2",
  reviewCandidateId: ALG_ENGLISH_REVIEW_V2_ID,
  permanentQlCount: ALG_PERMANENT_ALLOCATION.length,
  mappedVariantCount: reviewRows.length,
  qlCounts,
  lifecycle: {
    semanticQlFrozen: true,
    solverAuthorityFrozen: true,
    correctedEnglishImplementationFrozen: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  questions: reviewRows.map((row, index) => ({
    ordinal: index + 1,
    qlId: row.qlId,
    title: row.title,
    packageId: row.packageId,
    cpId: row.cpId,
    prototypeId: row.prototypeId,
    prototypeSolveMode: row.prototypeSolveMode,
    variantIndex: row.variantIndex,
    seed: row.seed,
    question: row.question,
    canonicalAnswer: row.canonicalAnswer,
    explanation: row.explanation,
  })),
}), "utf8");

console.log(JSON.stringify({
  status: "PASS_ALGEBRA_PERMANENT_ENGLISH_REVIEW_V2_EXPORT",
  htmlPath,
  jsonPath,
  permanentQlCount: ALG_PERMANENT_ALLOCATION.length,
  mappedVariantCount: reviewRows.length,
}, null, 2));
