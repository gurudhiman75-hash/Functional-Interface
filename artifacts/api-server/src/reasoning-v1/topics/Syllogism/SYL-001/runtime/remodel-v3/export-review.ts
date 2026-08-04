import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../../foundation/types";
import { SYL_QL_REGISTRY } from "../ql-registry";
import { generateSylQuestionV3 } from "./generator";
import { validateSylQuestionV3 } from "./validation";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [0, 7, 17, 29, 43, 61] as const;
const questions = SYL_QL_REGISTRY.flatMap((definition) =>
  seeds.flatMap((seed) => locales.map((locale) => generateSylQuestionV3(definition.qlId, seed, locale))),
);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localeName(locale: SylLocale): string {
  if (locale === "hi-IN") return "Hindi";
  if (locale === "pa-IN") return "Punjabi";
  return "English";
}

function reviewRows(): string {
  return [
    "Logic and answer under declared existence policy",
    "Every visible option has a precise reason",
    "Impossible versus possible-not-definite distinction",
    "Correct-option proof is complete",
    "Exactly one integrated diagram",
    "Diagram contains all relevant statements",
    "Diagram supports only the keyed option",
    "Mobile readability and accessibility",
    "Natural language and exam terminology",
    "Final disposition",
  ].map((label) => `<tr><td>${escapeHtml(label)}</td><td><code>REVISE</code></td><td></td></tr>`).join("");
}

function renderQuestion(question: (typeof questions)[number]): string {
  const validation = validateSylQuestionV3(question);
  const options = question.options.map((option) =>
    `<li class="option ${option.isCorrect ? "correct" : ""}"><span class="index">${option.displayIndex}</span><span>${escapeHtml(option.text)}</span>${option.isCorrect ? '<span class="badge">KEY</span>' : ""}</li>`,
  ).join("");
  const meanings = question.explanation.statementMeanings.map((meaning) =>
    `<li><strong>${meaning.displayIndex}. ${escapeHtml(meaning.statement)}</strong><p>${escapeHtml(meaning.normalizedMeaning)}</p><code>${escapeHtml(meaning.normalizedRelation)}</code></li>`,
  ).join("");
  const optionAnalysis = question.explanation.optionAnalysis.map((analysis) =>
    `<li class="analysis ${analysis.taskDisposition === "CORRECT_FOR_TASK" ? "correct-analysis" : ""}"><div class="analysis-head"><strong>${escapeHtml(`Option ${analysis.displayIndex}: ${analysis.optionText}`)}</strong><span>${escapeHtml(analysis.studentVerdict)}</span></div><p>${escapeHtml(analysis.studentReason)}</p><div class="evidence"><code>${analysis.reasonCode}</code><span>Premises: ${escapeHtml(analysis.premiseIdsUsed.join(", "))}</span></div></li>`,
  ).join("");
  const proofSteps = question.explanation.correctOptionProof.reasoningSteps.map((step, index) =>
    `<li>${index + 1}. ${escapeHtml(step)}</li>`,
  ).join("");
  const adminEvidence = {
    contentIdentity: question.contentIdentity,
    versionTuple: question.versionTuple,
    structuredPrompt: question.structuredPrompt,
    reviewLogic: question.reviewLogic,
    optionAnalysis: question.explanation.optionAnalysis,
    diagramSpec: {
      ...question.explanation.combinedDiagram,
      svg: "[rendered above]",
    },
    difficultyScore: question.difficultyScore,
    difficultyEvidence: question.difficultyEvidence,
    validation,
    lifecycle: question.lifecycle,
  };

  return `<article lang="${question.locale}" data-locale="${question.locale}" data-ql="${question.qlId}" data-review-status="${question.humanReviewStatus}">
<header><div><h2>${question.qlId} · ${question.checkpointId}</h2><p>${localeName(question.locale)} · seed ${question.seed} · ${question.difficulty} (${question.difficultyScore})</p></div><div class="ids"><code>${question.questionLanguageId}</code><code>${question.scenarioId}</code></div></header>
<section class="question"><pre>${escapeHtml(question.stem)}</pre><ol class="options">${options}</ol></section>
<section><h3>${escapeHtml(question.explanation.understandStatementsHeading)}</h3><p class="policy">${escapeHtml(question.explanation.existencePolicy.studentDirection)}</p><ol class="meaning-list">${meanings}</ol></section>
<section><h3>${escapeHtml(question.explanation.combineStatementsHeading)}</h3><p>${escapeHtml(question.explanation.combinedRelation)}</p></section>
<section><h3>${escapeHtml(question.explanation.checkOptionsHeading)}</h3><ol class="option-analysis">${optionAnalysis}</ol></section>
<section><h3>${escapeHtml(question.explanation.correctProofHeading)}</h3><ol>${proofSteps}</ol><p class="proof">${escapeHtml(question.explanation.correctOptionProof.studentProof)}</p></section>
<section><h3>${escapeHtml(question.explanation.fastRuleHeading)}</h3><p><code>${escapeHtml(question.explanation.fastRule.symbolic)}</code></p><p>${escapeHtml(question.explanation.fastRule.naturalLanguage)}</p></section>
<section class="diagram"><h3>${escapeHtml(question.explanation.diagramHeading)}</h3>${question.explanation.combinedDiagram.svg}<p>${escapeHtml(question.explanation.combinedDiagram.textAlternative)}</p></section>
<section class="final"><h3>${escapeHtml(question.explanation.finalAnswerHeading)}</h3><p>${escapeHtml(question.explanation.finalAnswer)}</p></section>
<section class="review"><h3>Human review · immutable V3</h3><table><thead><tr><th>Dimension</th><th>Decision</th><th>Reviewer note</th></tr></thead><tbody>${reviewRows()}</tbody></table></section>
<details><summary>Administrator-only proof evidence</summary><pre>${escapeHtml(JSON.stringify(adminEvidence, null, 2))}</pre></details>
</article>`;
}

const outputDir = process.env.SYL_V3_REVIEW_DIR
  ? resolve(process.env.SYL_V3_REVIEW_DIR)
  : resolve(process.cwd(), "dist/reasoning-v1/syl-001-remodel-v3-review");
mkdirSync(outputDir, { recursive: true });

writeFileSync(
  resolve(outputDir, "syl-001-remodel-v3-review.jsonl"),
  `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
  "utf8",
);

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 Remodel V3 Review</title><style>
*{box-sizing:border-box}body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;max-width:1200px;margin:auto;padding:22px;background:#eef2f7;color:#0f172a}h1{margin-bottom:4px}.lead{margin-top:0;color:#475569}.toolbar{position:sticky;top:0;z-index:5;padding:12px 0;background:rgba(238,242,247,.96);display:flex;gap:8px;flex-wrap:wrap}.toolbar button{border:1px solid #cbd5e1;background:#fff;border-radius:999px;padding:8px 12px;font-weight:800}.toolbar button.active{background:#0f172a;color:#fff}article{background:#fff;border:1px solid #cbd5e1;border-radius:18px;padding:22px;margin:0 0 30px;box-shadow:0 5px 22px rgba(15,23,42,.08)}header{display:flex;justify-content:space-between;gap:14px}header h2{margin:0}header p{color:#64748b}.ids{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}code{background:#e2e8f0;border-radius:6px;padding:3px 7px}.question{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px}.question pre{font:inherit;white-space:pre-wrap;line-height:1.55}.options,.option-analysis{list-style:none;padding:0}.option{display:flex;gap:10px;align-items:center;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;margin:8px 0}.option.correct{border-color:#16a34a;background:#f0fdf4}.index{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#e2e8f0;font-weight:900}.badge{margin-left:auto;border-radius:999px;background:#16a34a;color:#fff;padding:3px 9px;font-size:.8rem;font-weight:900}section{margin-top:18px;border-left:5px solid #64748b;padding:13px 16px;background:#f8fafc;border-radius:10px}section h3{margin:0 0 10px}.policy{font-weight:800}.meaning-list li{margin:12px 0}.meaning-list p{margin:5px 0}.analysis{padding:12px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;margin:10px 0}.correct-analysis{border-color:#16a34a;background:#f0fdf4}.analysis-head{display:flex;justify-content:space-between;gap:12px}.analysis-head span{font-weight:800}.evidence{display:flex;gap:10px;flex-wrap:wrap;color:#475569}.proof{font-weight:800}.diagram{border-left-color:#2563eb;background:#eff6ff}.diagram svg{display:block;width:100%;height:auto;max-width:960px;margin:auto}.final{border:2px solid #16a34a;border-left-width:5px;background:#f0fdf4}.final p{font-size:1.1rem;font-weight:900}.review{border-left-color:#d97706;background:#fffbeb}table{border-collapse:collapse;width:100%}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left}details{margin-top:18px}details pre{white-space:pre-wrap;overflow:auto;background:#0f172a;color:#e2e8f0;padding:14px;border-radius:10px;font-size:.8rem}@media(max-width:720px){body{padding:10px}article{padding:14px}header,.analysis-head{display:block}.ids{justify-content:flex-start}.diagram svg{min-width:0}th,td{font-size:.82rem}}
</style></head><body><h1>SYL-001 Structured-Proof Remodel V3</h1><p class="lead">${questions.length} localized records · ${SYL_QL_REGISTRY.length * seeds.length} unique logical payloads · one integrated diagram per question · human review status REVISE.</p><div class="toolbar"><button class="active" data-filter="all">All</button><button data-filter="en-IN">English</button><button data-filter="hi-IN">Hindi</button><button data-filter="pa-IN">Punjabi</button></div>${questions.map(renderQuestion).join("\n")}<script>document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(item=>item.classList.remove('active'));button.classList.add('active');const filter=button.dataset.filter;document.querySelectorAll('article[data-locale]').forEach(article=>{article.hidden=filter!=='all'&&article.dataset.locale!==filter;});}));</script></body></html>`;
writeFileSync(resolve(outputDir, "syl-001-remodel-v3-review.html"), html, "utf8");

const validationFailures = questions.filter((question) => !validateSylQuestionV3(question).ok);
const summary = {
  authority: "SYL_001_STRUCTURED_PROOF_REMODEL_V3",
  reviewVersion: "SYL_001_REMODEL_V3",
  localizedRecordCount: questions.length,
  uniqueLogicalPayloadCount: SYL_QL_REGISTRY.length * seeds.length,
  qlCount: SYL_QL_REGISTRY.length,
  seedsPerQl: seeds.length,
  locales,
  validationFailureCount: validationFailures.length,
  humanReviewStatus: "REVISE",
  lifecycle: {
    questionStudioVisible: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
};
writeFileSync(resolve(outputDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...summary, outputDir }, null, 2));
