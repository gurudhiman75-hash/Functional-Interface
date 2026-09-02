import fs from "node:fs";
import path from "node:path";

import { COM003_EXAM_REALNESS_AUDIT_V1 } from "./com003-exam-realness-audit-v1";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V5 } from "./com003-review-synthesis-v5";

function esc(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildCom003QuestionReviewHtmlV1() {
  if (!COM003_EXAM_REALNESS_AUDIT_V1.valid) {
    throw new Error(`COM-003 V5 exam-realness audit failed: ${COM003_EXAM_REALNESS_AUDIT_V1.blockers.join(", ")}`);
  }

  const groups = COM003_PERMANENT_QLS.map((ql) => ({
    ql,
    questions: COM003_ENGLISH_REVIEW_CORPUS_V5.filter((question) => question.qlId === ql.qlId),
  }));

  const sections = groups.map(({ ql, questions }) => `
    <section class="ql-section">
      <div class="ql-heading">
        <div>
          <div class="ql-id">${esc(ql.qlId)}</div>
          <h2>${esc(ql.title)}</h2>
        </div>
        <div class="ql-count">${questions.length} questions</div>
      </div>
      ${questions.map((q, i) => `
        <article class="question">
          <div class="q-meta"><span>Q${i + 1}</span><span>${esc(q.surfaceMode)}</span><span>${esc(q.targetFactId)}</span></div>
          <div class="stem">${esc(q.stem)}</div>
          <ol class="options" type="A">
            ${q.options.map((option, optionIndex) => `<li class="${optionIndex === q.correctIndex ? "correct" : ""}">${esc(option)}</li>`).join("")}
          </ol>
          <div class="answer"><strong>Answer:</strong> ${String.fromCharCode(65 + q.correctIndex)}. ${esc(q.canonicalAnswer)}</div>
          <div class="explanation"><strong>Explanation:</strong> ${esc(q.explanation)}</div>
          <details><summary>Review metadata</summary><div class="details-grid">
            <div><b>Question ID</b><br>${esc(q.questionId)}</div>
            <div><b>Source facts</b><br>${esc(q.sourceFactIds.join(", "))}</div>
            <div><b>Source IDs</b><br>${esc(q.sourceIds.join(", "))}</div>
            <div><b>Version scoped</b><br>${q.versionScoped ? "Yes" : "No"}</div>
          </div></details>
        </article>`).join("")}
    </section>`).join("");

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>COM-003 Office & Productivity Software - English V5 Exam-Realness Review</title>
  <style>
  :root{font-family:Inter,Arial,sans-serif;color:#172033;background:#f4f6f8}body{margin:0}.wrap{max-width:980px;margin:auto;padding:28px 18px 60px}.hero{background:#fff;border:1px solid #dfe4ea;border-radius:16px;padding:24px;margin-bottom:22px}.hero h1{margin:0 0 8px;font-size:28px}.hero p{margin:5px 0;color:#526174}.stats{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.stat{background:#eef3f8;border-radius:9px;padding:8px 12px;font-weight:700}.ql-section{margin:24px 0}.ql-heading{display:flex;justify-content:space-between;gap:16px;align-items:end;margin-bottom:10px}.ql-heading h2{margin:2px 0 0;font-size:21px}.ql-id{font-size:12px;font-weight:800;color:#60738b;letter-spacing:.04em}.ql-count{font-size:13px;color:#60738b}.question{background:#fff;border:1px solid #dfe4ea;border-radius:12px;padding:18px;margin:11px 0;break-inside:avoid}.q-meta{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}.q-meta span{font-size:11px;background:#f0f3f6;border-radius:999px;padding:4px 8px;color:#536274}.stem{font-size:16px;font-weight:700;line-height:1.5}.options{margin:10px 0 12px;padding-left:28px}.options li{padding:4px 7px;line-height:1.4}.options li.correct{background:#edf8ef;border-radius:6px;font-weight:700}.answer{margin-top:9px;padding:9px 11px;background:#edf8ef;border-left:4px solid #4f8f59;border-radius:6px}.explanation{margin-top:8px;padding:10px 11px;background:#f7f8fa;border-radius:6px;line-height:1.5}details{margin-top:10px;color:#5f6e80;font-size:12px}summary{cursor:pointer;font-weight:700}.details-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.review-note{padding:12px 14px;background:#fff8e7;border-radius:8px;margin-top:12px;color:#67511f}.rejected{padding:12px 14px;background:#fff1f2;border:1px solid #fecdd3;border-radius:8px;margin-top:12px;color:#881337}@media print{body{background:#fff}.wrap{max-width:none;padding:0}.hero,.question{box-shadow:none}.question{page-break-inside:avoid}.q-meta,details{display:none}}
  </style></head><body><main class="wrap"><header class="hero"><h1>COM-003 - Office & Productivity Software</h1><p>English V5 Exam-Realness Remediation Candidate</p><div class="stats"><div class="stat">19 permanent QLs</div><div class="stat">228 questions</div><div class="stat">12 per QL</div><div class="stat">V5 · review only</div></div><div class="rejected"><b>Previous V4 disposition:</b> REJECTED — stems not exam level. V4 remains historical evidence only for this review cycle.</div><div class="review-note"><b>Review V5 for:</b> SSC/Banking/Punjab-state exam realness, concise natural stems, wording variety, option quality, ambiguity, factual correctness and QL coverage. Correct options are highlighted for reviewer convenience. Approval of this file is required before any refreeze, relocalization or Question Studio replacement.</div></header>${sections}</main></body></html>`;
}

export function writeCom003QuestionReviewFileV1(outputDir = path.resolve("dist/com003-review-file")) {
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "COM-003-Office-Productivity-English-Question-Review-V1.html");
  fs.writeFileSync(outputPath, buildCom003QuestionReviewHtmlV1(), "utf8");
  return outputPath;
}

if (process.argv[1]?.includes("com003-question-review-file-v1")) {
  const outputPath = writeCom003QuestionReviewFileV1();
  console.log(`[COM003-QUESTION-REVIEW-FILE-V1] ${outputPath}`);
  console.log(`[COM003-QUESTION-REVIEW-FILE-V1] questions=${COM003_ENGLISH_REVIEW_CORPUS_V5.length}`);
  console.log(`[COM003-QUESTION-REVIEW-FILE-V1] examRealness=${COM003_EXAM_REALNESS_AUDIT_V1.status}`);
}
