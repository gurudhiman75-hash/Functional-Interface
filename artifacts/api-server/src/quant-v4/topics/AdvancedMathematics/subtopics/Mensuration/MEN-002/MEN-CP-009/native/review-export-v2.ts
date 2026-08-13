import fs from "node:fs";
import path from "node:path";
import { buildMenCp009V3StudentReviewBatch } from "../coverage-v2/student-review-batch-v3";
import { buildMenCp009StudentViewV4Final } from "../coverage-v2/student-view-v4-final";
import { generateMenCp009NativeTeachingV2 } from "./runtime-v2";

function esc(value: unknown) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const reviewed = buildMenCp009V3StudentReviewBatch();
let number = 0;

function card(item: {
  permanentQlId: string;
  difficulty: string;
  target: string;
  familyId: string;
  solveMode: string;
  seed: string;
  stem: string;
  options: Array<{ label: string; display: string; isCorrect: boolean }>;
  answer: string;
  explanationLines: string[];
}, language: "en" | "hi" | "pa") {
  number += 1;
  const answerLabel = language === "hi" ? "उत्तर" : language === "pa" ? "ਉੱਤਰ" : "Answer";
  const solutionLabel = language === "hi" ? "समझकर हल" : language === "pa" ? "ਸਮਝ ਕੇ ਹੱਲ" : "Step-by-step solution";
  return `<article class="question-card" data-language="${language}" data-ql="${esc(item.permanentQlId)}">
    <div class="meta"><span>Question ${number}</span><span>${esc(item.permanentQlId)}</span><span>${esc(item.difficulty)}</span><span>${esc(item.target)}</span></div>
    <div class="stem">${esc(item.stem)}</div>
    <ol class="options">${item.options.map((option) => `<li class="option ${option.isCorrect ? "correct" : ""}"><strong>${option.label}.</strong> ${esc(option.display)}${option.isCorrect ? " <span>✓</span>" : ""}</li>`).join("")}</ol>
    <div class="answer"><strong>${answerLabel}:</strong> ${esc(item.answer)}</div>
    <div class="solution"><strong>${solutionLabel}</strong><ol>${item.explanationLines.map((line) => `<li>${esc(line)}</li>`).join("")}</ol></div>
    <details><summary>Reviewer metadata</summary><div>Family: ${esc(item.familyId)}</div><div>Solve mode: ${esc(item.solveMode)}</div><div>Seed: ${esc(item.seed)}</div></details>
  </article>`;
}

const englishCards = reviewed.rows
  .map((row) => card(buildMenCp009StudentViewV4Final(row), "en"))
  .join("\n");
const hindiCards = reviewed.rows
  .map((row) => card(generateMenCp009NativeTeachingV2(row.permanentQlId, row.seed, "hi"), "hi"))
  .join("\n");
const punjabiCards = reviewed.rows
  .map((row) => card(generateMenCp009NativeTeachingV2(row.permanentQlId, row.seed, "pa"), "pa"))
  .join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>MEN-CP-009 Teaching Review V2</title>
<style>
body{margin:0;background:#f5f7fb;color:#172033;font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;line-height:1.62}
main{max-width:1000px;margin:auto;padding:32px 18px 64px}h1{margin-bottom:6px}.lead{color:#5c667a;margin-top:0}.notice{background:#fff4d6;border:1px solid #f1cf74;padding:15px 17px;border-radius:10px;margin:20px 0 32px}.section-note{color:#5c667a}.question-card{background:#fff;border:1px solid #dbe1eb;border-radius:14px;padding:21px;margin:17px 0;box-shadow:0 4px 14px rgba(20,30,50,.04)}.meta{display:flex;gap:12px;flex-wrap:wrap;color:#667085;font-size:13px;margin-bottom:12px}.stem{font-size:18px;font-weight:650;margin:12px 0 16px}.options{list-style:none;padding:0;display:grid;gap:8px}.option{border:1px solid #dbe1eb;padding:9px 12px;border-radius:8px}.option.correct{background:#eef9f1;border-color:#9bd4a8}.answer{margin:14px 0;padding:10px 12px;background:#eef5ff;border-radius:8px}.solution{background:#f8fafc;padding:13px 15px;border-radius:8px}.solution ol{margin:9px 0 0;padding-left:24px}.solution li{margin:6px 0}details{margin-top:12px;color:#596276;font-size:13px}summary{cursor:pointer}h2{margin-top:46px;border-bottom:1px solid #dbe1eb;padding-bottom:8px}@media print{body{background:#fff}.question-card{box-shadow:none;break-inside:avoid}}
</style></head><body><main>
<h1>MEN-CP-009 — Spheres &amp; Hemispheres</h1>
<p class="lead">Teaching-first Editorial Review V2 · English + Hindi + Punjabi</p>
<div class="notice"><strong>Review candidate, not approved.</strong> This version directly addresses the feedback that explanations were robotic, too short and skipped middle calculations. It shows substitution, intermediate arithmetic, explicit use of π = 22/7 or 3.14 where required, and simpler learner wording. The existing approved English V3 remains untouched until this V2/V4 candidate receives explicit review approval. Product delivery stays locked.</div>
<section><h2>English</h2><p class="section-note">110 semantic questions · teaching-first V4 candidate.</p>${englishCards}</section>
<section><h2>Hindi — हिन्दी</h2><p class="section-note">110 semantic questions · simpler, more explanatory native V2 candidate.</p>${hindiCards}</section>
<section><h2>Punjabi — ਪੰਜਾਬੀ</h2><p class="section-note">110 semantic questions · simpler, more explanatory native V2 candidate.</p>${punjabiCards}</section>
</main></body></html>`;

const outDir = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "MEN-CP-009-TEACHING-REVIEW-V2.html");
fs.writeFileSync(outPath, html, "utf8");
console.log(`Wrote ${outPath} with ${reviewed.rows.length * 3} review cards.`);
