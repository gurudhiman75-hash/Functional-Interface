import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderCp007EnglishReviewSamples } from "./english-rendered-sample-runtime";

const outputDir = process.env.TSD_CP007_REVIEW_OUTPUT_DIR ?? "/tmp/tsd-cp007-english-review";
mkdirSync(outputDir, { recursive: true });
const samples = renderCp007EnglishReviewSamples();

const markdown: string[] = [
  "# TSD-CP-007 Rendered English Question Review",
  "",
  "Status: **REVIEW_CANDIDATE — NOT FROZEN**",
  "",
  "Each sample below is bound to an executable CP007 case. Explanations intentionally show the specific givens, the human reasoning path, and the computed conclusion.",
  "",
];

let currentQl = "";
for (const sample of samples) {
  if (sample.qlId !== currentQl) {
    currentQl = sample.qlId;
    markdown.push(`## ${sample.qlId} — ${sample.authorityKey}`, "");
  }
  markdown.push(`### ${sample.familyId} · ${sample.difficulty} · ${sample.representation}`, "");
  markdown.push(`**Scene:** ${sample.scene}`, "");
  markdown.push(`**Question:** ${sample.stem}`, "");
  markdown.push(`**Answer:** ${sample.answer}`, "");
  markdown.push(`**Explanation:** ${sample.explanation}`, "");
}

const escapeHtml = (value: string): string => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const cards = samples.map((sample) => `
<section class="card">
  <div class="meta"><strong>${escapeHtml(sample.familyId)}</strong> · ${escapeHtml(sample.qlId)} · ${escapeHtml(sample.difficulty)} · ${escapeHtml(sample.representation)}</div>
  <div class="scene">${escapeHtml(sample.scene)}</div>
  <h3>Question</h3>
  <p>${escapeHtml(sample.stem)}</p>
  <h3>Answer</h3>
  <p class="answer">${escapeHtml(sample.answer)}</p>
  <h3>Explanation</h3>
  <p>${escapeHtml(sample.explanation)}</p>
</section>`).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TSD-CP-007 English Review</title>
<style>
body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;background:#fff;color:#161616;line-height:1.55}.wrap{max-width:980px;margin:0 auto;padding:28px 18px 60px}.status{border:1px solid #bbb;padding:12px 14px;border-radius:10px;margin:14px 0 24px}.card{border:1px solid #d8d8d8;border-radius:12px;padding:18px;margin:0 0 18px;break-inside:avoid}.meta{font-size:.9rem;margin-bottom:4px}.scene{font-size:.85rem;opacity:.72;margin-bottom:12px}.card h3{font-size:.95rem;margin:14px 0 5px}.card p{margin:0}.answer{font-weight:700}@media print{.card{page-break-inside:avoid}.wrap{max-width:none}}
</style>
</head>
<body><main class="wrap">
<h1>TSD-CP-007 Rendered English Question Review</h1>
<div class="status"><strong>REVIEW_CANDIDATE — NOT FROZEN.</strong> 66 samples across TSD-QL-084..094. Question Studio remains disabled.</div>
${cards}
</main></body></html>`;

const mdPath = join(outputDir, "TSD-CP007-RENDERED-ENGLISH-REVIEW.md");
const htmlPath = join(outputDir, "TSD-CP007-RENDERED-ENGLISH-REVIEW.html");
const jsonPath = join(outputDir, "TSD-CP007-RENDERED-ENGLISH-REVIEW.json");
writeFileSync(mdPath, `${markdown.join("\n")}\n`, "utf8");
writeFileSync(htmlPath, html, "utf8");
writeFileSync(jsonPath, `${JSON.stringify(samples, null, 2)}\n`, "utf8");

console.log(JSON.stringify({ status: "PASS", checkpoint: "TSD-CP-007", renderedSamples: samples.length, mdPath, htmlPath, jsonPath, englishStatus: "REVIEW_CANDIDATE", questionStudioEnabled: false }, null, 2));
