import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TRG_001_AUTHORITY_ALIGNED_IDS, authorityFamilyForTrg001Ql } from "./production-authority-runtime";
import { generateFinalEditorialTrg001Question } from "./production-final-editorial-runtime";

const outDir = join(
  process.cwd(),
  "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-001/review-artifacts",
);
mkdirSync(outDir, { recursive: true });

const sourceSha = process.env.TRG001_REVIEW_SOURCE_SHA?.trim() || "LOCAL_UNPINNED";

type ReviewOption = {
  label: string;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
};

function esc(value: unknown) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const records = TRG_001_AUTHORITY_ALIGNED_IDS.map((qlId, index) => {
  const seed = `trg001-human-review-${String(index + 1).padStart(3, "0")}`;
  const question: any = generateFinalEditorialTrg001Question(qlId, seed);

  if (question.qlId !== qlId) throw new Error(`${qlId}: permanent ID drift during review export.`);
  if (question.validation?.valid !== true || question.verification?.valid !== true) {
    throw new Error(`${qlId}: invalid final runtime state during review export.`);
  }
  if (question.options?.length !== 4 || question.options.filter((o: any) => o.isCorrect).length !== 1) {
    throw new Error(`${qlId}: option integrity failed during review export.`);
  }
  if (question.humanReviewStatus !== "PENDING") {
    throw new Error(`${qlId}: review export must not substitute for human approval.`);
  }
  if (
    question.questionBankStatus !== "NOT_STORED"
    || question.testEligibility !== "INELIGIBLE"
    || question.publiclyPublishable
    || question.questionStudioDiscoverable
  ) {
    throw new Error(`${qlId}: activation lock failed during review export.`);
  }

  return {
    qlId,
    cpId: question.cpId,
    solveMode: question.solveMode,
    authorityFamily: authorityFamilyForTrg001Ql(qlId),
    difficulty: question.difficulty,
    seed,
    sourceSha,
    stem: question.stem,
    options: question.options.map((option: any): ReviewOption => ({
      label: option.label,
      display: option.display,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
    })),
    answer: question.answer,
    explanation: {
      keyRule: question.explanation.keyRule,
      steps: question.explanation.steps,
      shortcut: question.explanation.shortcut,
      traps: question.explanation.traps,
    },
    canonicalState: question.canonicalState,
    verification: question.verification,
    reviewStatus: question.reviewStatus,
    aiEditorialStatus: question.aiEditorialStatus,
    humanReviewStatus: question.humanReviewStatus,
    activationLocks: {
      questionBankStatus: question.questionBankStatus,
      testEligibility: question.testEligibility,
      publiclyPublishable: question.publiclyPublishable,
      questionStudioDiscoverable: question.questionStudioDiscoverable,
    },
  };
});

if (records.length !== 144) throw new Error(`Expected 144 review records; found ${records.length}.`);

const cards = records.map((record) => {
  const options = record.options
    .map((option: ReviewOption) => `<li class="${option.isCorrect ? "correct" : ""}"><b>${esc(option.label)}.</b> ${esc(option.display)}${option.isCorrect ? " ✓" : ""}${option.misconceptionId ? `<span class="misconception">${esc(option.misconceptionId)}</span>` : ""}</li>`)
    .join("");
  const steps = record.explanation.steps
    .map((step: any) => `<li><b>${esc(step.title)}:</b> ${esc(step.body)}</li>`)
    .join("");
  const traps = record.explanation.traps.map((trap: string) => `<li>${esc(trap)}</li>`).join("");

  return `<article class="question-card" id="${esc(record.qlId)}">
    <header>
      <h2>${esc(record.qlId)} · ${esc(record.cpId)} · ${esc(record.difficulty)}</h2>
      <p class="meta"><b>Authority:</b> ${esc(record.authorityFamily)} · <b>Solve mode:</b> ${esc(record.solveMode)} · <b>Seed:</b> ${esc(record.seed)}</p>
    </header>
    <section><h3>Question</h3><p class="stem">${esc(record.stem)}</p><ol class="options">${options}</ol><p><b>Answer:</b> ${esc(record.answer)}</p></section>
    <section><h3>Explanation</h3><p><b>Rule:</b> ${esc(record.explanation.keyRule)}</p><ol>${steps}</ol><p><b>Shortcut:</b> ${esc(record.explanation.shortcut)}</p><h4>Traps</h4><ul>${traps}</ul></section>
    <details><summary>Canonical state & verification</summary><pre>${esc(JSON.stringify({ canonicalState: record.canonicalState, verification: record.verification }, null, 2))}</pre></details>
    <section class="review"><h3>Human review checklist</h3><ul>
      <li>☐ Stem is natural, direct and exam-appropriate.</li>
      <li>☐ Mathematics and requested quantity are unambiguous.</li>
      <li>☐ Four options are plausible, unique and only the marked answer is correct.</li>
      <li>☐ Explanation is specific, sufficient and consistent with the generated state.</li>
      <li>☐ Difficulty is appropriate for the reasoning required.</li>
      <li>☐ No duplicated/near-duplicated role or out-of-scope family is apparent.</li>
    </ul><p><b>Decision:</b> ☐ APPROVE &nbsp; ☐ CHANGES REQUIRED &nbsp; <b>Notes:</b> ______________________________</p></section>
  </article>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TRG-001 Final 144-QL Human Review Pack</title><style>
body{font-family:Arial,Helvetica,sans-serif;margin:0;background:#f4f5f7;color:#151515}.page{max-width:1100px;margin:auto;padding:24px}.summary,.question-card{background:#fff;border:1px solid #d7d7d7;border-radius:10px;padding:20px;margin:0 0 20px}.summary h1,.question-card h2{margin-top:0}.meta{color:#555}.stem{font-size:17px;line-height:1.5}.options{list-style:none;padding:0}.options li{padding:5px 0}.options .correct{font-weight:700}.misconception{font-size:12px;color:#666;margin-left:10px}.review{border-top:1px solid #ddd;margin-top:16px;padding-top:10px}.review ul{list-style:none;padding-left:0}.review li{padding:3px 0}pre{white-space:pre-wrap;background:#f7f7f7;padding:12px;border-radius:6px;overflow-wrap:anywhere}@media print{body{background:#fff}.question-card{break-inside:avoid;border-color:#aaa}}
</style></head><body><main class="page"><section class="summary"><h1>TRG-001 Final 144-QL Human Review Pack</h1><p>Generated directly from <code>production-final-editorial-runtime.ts</code> at one deterministic representative seed per permanent QL. Machine gates cover broader seed diversity separately.</p><p><b>Source head:</b> <code>${esc(sourceSha)}</code></p><p><b>Scope:</b> 144/144 permanent English QLs. <b>AI editorial:</b> PASS. <b>Human review:</b> PENDING. This artifact does not authorize freeze, Question Studio, Question Bank, tests or publication.</p><p>Review each card and record APPROVE or CHANGES REQUIRED. A chapter-level human approval record may be created only after all 144 QLs are approved.</p></section>${cards}</main></body></html>`;

writeFileSync(join(outDir, "TRG-001-FINAL-144-HUMAN-REVIEW.html"), html, "utf8");
writeFileSync(join(outDir, "TRG-001-FINAL-144-HUMAN-REVIEW.json"), JSON.stringify(records, null, 2), "utf8");
console.log(`TRG001_HUMAN_REVIEW_EXPORT_PASS count=${records.length} sourceSha=${sourceSha} humanReview=PENDING`);
