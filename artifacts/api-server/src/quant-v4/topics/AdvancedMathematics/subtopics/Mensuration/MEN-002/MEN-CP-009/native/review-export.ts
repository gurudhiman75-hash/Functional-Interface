import fs from "node:fs";
import path from "node:path";
import { buildMenCp009V3StudentReviewBatch } from "../coverage-v2/student-review-batch-v3";
import { generateMenCp009NativeDraftView } from "./runtime";
import type { MenCp009NativeLanguage } from "./types";

function esc(value: unknown) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const labels: Record<MenCp009NativeLanguage, string> = {
  hi: "Hindi — हिन्दी",
  pa: "Punjabi — ਪੰਜਾਬੀ",
};

const reviewed = buildMenCp009V3StudentReviewBatch();
const languages = ["hi", "pa"] as const satisfies readonly MenCp009NativeLanguage[];

let questionNumber = 0;
const sections = languages.map((language) => {
  const cards = reviewed.rows.map((row) => {
    const item = generateMenCp009NativeDraftView(row.permanentQlId, row.seed, language);
    questionNumber += 1;
    const options = item.options
      .map(
        (option) => `<li class="option ${option.isCorrect ? "correct" : ""}"><strong>${option.label}.</strong> ${esc(option.display)}${option.isCorrect ? " <span>✓</span>" : ""}</li>`,
      )
      .join("");
    const explanation = item.explanationLines.map((line) => `<li>${esc(line)}</li>`).join("");
    return `<article class="question-card" data-language="${language}" data-ql="${esc(item.permanentQlId)}">
      <div class="meta"><span>Question ${questionNumber}</span><span>${esc(item.permanentQlId)}</span><span>${esc(item.difficulty)}</span><span>${esc(item.target)}</span></div>
      <div class="stem">${esc(item.stem)}</div>
      <ol class="options">${options}</ol>
      <div class="answer"><strong>${language === "hi" ? "उत्तर" : "ਉੱਤਰ"}:</strong> ${esc(item.answer)}</div>
      <div class="solution"><strong>${language === "hi" ? "समाधान" : "ਹੱਲ"}</strong><ol>${explanation}</ol></div>
      <details><summary>Reviewer metadata</summary>
        <div>Family: ${esc(item.familyId)}</div>
        <div>Solve mode: ${esc(item.solveMode)}</div>
        <div>Seed: ${esc(item.seed)}</div>
        <div>Source English: ${esc(item.sourceEnglishReleaseId)}</div>
        <div>Math parity: ${item.parity.valid ? "PASS" : "FAIL"}</div>
        <div>Human editorial: ${esc(item.humanReviewStatus)}</div>
      </details>
    </article>`;
  }).join("\n");
  return `<section><h2>${labels[language]}</h2><p class="section-note">110 semantic review questions · 28 permanent QLs · draft native editorial, not human-approved.</p>${cards}</section>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MEN-CP-009 Hindi Punjabi Review V1</title>
<style>
body{margin:0;background:#f5f7fb;color:#172033;font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;line-height:1.55}
main{max-width:980px;margin:auto;padding:32px 18px 60px}h1{margin-bottom:6px}.lead{color:#5c667a;margin-top:0}.notice{background:#fff4d6;border:1px solid #f1cf74;padding:14px 16px;border-radius:10px;margin:20px 0 32px}h2{margin-top:42px}.section-note{color:#5c667a}.question-card{background:white;border:1px solid #dbe1eb;border-radius:14px;padding:20px;margin:16px 0;box-shadow:0 4px 14px rgba(20,30,50,.04)}.meta{display:flex;gap:12px;flex-wrap:wrap;color:#667085;font-size:13px;margin-bottom:12px}.stem{font-size:18px;font-weight:650;margin:12px 0 16px}.options{list-style:none;padding:0;display:grid;gap:8px}.option{border:1px solid #dbe1eb;padding:9px 12px;border-radius:8px}.option.correct{background:#eef9f1;border-color:#9bd4a8}.answer{margin:14px 0;padding:10px 12px;background:#eef5ff;border-radius:8px}.solution{background:#f8fafc;padding:12px 14px;border-radius:8px}.solution ol{margin:8px 0 0;padding-left:22px}details{margin-top:12px;color:#596276;font-size:13px}summary{cursor:pointer}@media print{body{background:#fff}.question-card{box-shadow:none;break-inside:avoid}}
</style>
</head>
<body><main>
<h1>MEN-CP-009 — Spheres &amp; Hemispheres</h1>
<p class="lead">Hindi + Punjabi Native Editorial Review V1</p>
<div class="notice"><strong>Review-only draft.</strong> Mathematics, options and answer ownership come from the product-owner-approved English V3 release. Hindi/Punjabi wording has automated parity proof but has not yet received human editorial approval. Question Studio, Question Bank, mocks and public publication remain disabled.</div>
${sections}
</main></body></html>`;

const outDir = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "MEN-CP-009-HI-PA-REVIEW-V1.html");
fs.writeFileSync(outPath, html, "utf8");
console.log(`Wrote ${outPath} with ${reviewed.rows.length * languages.length} native review cards.`);
