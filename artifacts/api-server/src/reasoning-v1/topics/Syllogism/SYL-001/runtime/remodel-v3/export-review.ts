import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../../foundation/types";
import { SYL_QL_REGISTRY } from "../ql-registry";
import {
  buildSylV3ReviewSelection,
  SYL_V3_REVIEW_LOCALES,
  SYL_V3_REVIEW_TARGET_PER_QL,
} from "./review-selection";
import { validateSylQuestionV3 } from "./validation";

const reviewSelection = buildSylV3ReviewSelection();
const questions = reviewSelection.questions;
const locales = SYL_V3_REVIEW_LOCALES;

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

function optionHeading(locale: SylLocale, index: number, text: string): string {
  if (locale === "hi-IN") return `विकल्प ${index}: ${text}`;
  if (locale === "pa-IN") return `ਵਿਕਲਪ ${index}: ${text}`;
  return `Option ${index}: ${text}`;
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
  const correctAnalysis = question.explanation.optionAnalysis[question.correctIndex]!;
  const premiseForms = [...new Set(question.structuredPrompt.premises.map((premise) => premise.form))].join(",");
  const options = question.options.map((option) =>
    `<li class="option ${option.isCorrect ? "correct" : ""}"><span class="index">${option.displayIndex}</span><span>${escapeHtml(option.text)}</span>${option.isCorrect ? '<span class="badge">KEY</span>' : ""}</li>`,
  ).join("");
  const meanings = question.explanation.statementMeanings.map((meaning) =>
    `<li><strong>${meaning.displayIndex}. ${escapeHtml(meaning.statement)}</strong><p>${escapeHtml(meaning.normalizedMeaning)}</p><code>${escapeHtml(meaning.normalizedRelation)}</code></li>`,
  ).join("");
  const optionAnalysis = question.explanation.optionAnalysis.map((analysis) =>
    `<li class="analysis ${analysis.taskDisposition === "CORRECT_FOR_TASK" ? "correct-analysis" : ""}"><div class="analysis-head"><strong>${escapeHtml(optionHeading(question.locale, analysis.displayIndex, analysis.optionText))}</strong><span>${escapeHtml(analysis.studentVerdict)}</span></div><p>${escapeHtml(analysis.studentReason)}</p></li>`,
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

  return `<article lang="${question.locale}" data-locale="${question.locale}" data-ql="${question.qlId}" data-checkpoint="${question.checkpointId}" data-task="${question.metadata.taskKind}" data-difficulty="${question.difficulty}" data-premise-forms="${escapeHtml(premiseForms)}" data-modality="${correctAnalysis.logicalStatus}" data-scenario="${question.scenarioId}" data-existence="${question.explanation.existencePolicy.id}" data-diagram="${question.explanation.combinedDiagram.mode}" data-review-status="${question.humanReviewStatus}">
<header><div><h2>${question.qlId} · ${question.checkpointId}</h2><p>${localeName(question.locale)} · seed ${question.seed} · ${question.difficulty} (${question.difficultyScore})</p></div><div class="ids"><code>${question.questionId}</code><code>${question.questionLanguageId}</code><code>${question.scenarioId}</code></div></header>
<section class="metadata"><dl><div><dt>Task</dt><dd>${escapeHtml(question.metadata.taskKind)}</dd></div><div><dt>Existence policy</dt><dd>${escapeHtml(question.explanation.existencePolicy.id)}</dd></div><div><dt>Diagram mode</dt><dd>${escapeHtml(question.explanation.combinedDiagram.mode)}</dd></div><div><dt>Auto-validation</dt><dd>${validation.ok ? "PASS" : "FAIL"}</dd></div><div><dt>Human review</dt><dd>${question.humanReviewStatus}</dd></div></dl></section>
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

const filterFields = [
  ["locale", "Language"],
  ["ql", "QL"],
  ["checkpoint", "Checkpoint"],
  ["task", "Task kind"],
  ["difficulty", "Difficulty"],
  ["premiseForms", "Premise form"],
  ["modality", "Correct modality"],
  ["scenario", "Scenario"],
  ["existence", "Existence policy"],
  ["diagram", "Diagram mode"],
  ["reviewStatus", "Review status"],
] as const;
const filterControls = filterFields.map(([field, label]) => `<label>${label}<select data-filter-field="${field}"><option value="">All</option></select></label>`).join("");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 Remodel V3 Review</title><style>
*{box-sizing:border-box}body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;max-width:1240px;margin:auto;padding:22px;background:#eef2f7;color:#0f172a}h1{margin-bottom:4px}.lead{margin-top:0;color:#475569}.toolbar{position:sticky;top:0;z-index:5;padding:12px;background:rgba(238,242,247,.97);display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;border:1px solid #cbd5e1;border-radius:14px;margin-bottom:18px}.toolbar label{display:grid;gap:4px;font-size:.78rem;font-weight:800;color:#475569}.toolbar select{width:100%;border:1px solid #94a3b8;background:#fff;border-radius:8px;padding:7px}.toolbar .actions{display:flex;align-items:end}.toolbar button{width:100%;border:1px solid #0f172a;background:#0f172a;color:#fff;border-radius:8px;padding:8px;font-weight:900}.result-count{font-weight:900;margin:10px 0}article{background:#fff;border:1px solid #cbd5e1;border-radius:18px;padding:22px;margin:0 0 30px;box-shadow:0 5px 22px rgba(15,23,42,.08)}header{display:flex;justify-content:space-between;gap:14px}header h2{margin:0}header p{color:#64748b}.ids{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}code{background:#e2e8f0;border-radius:6px;padding:3px 7px}.metadata dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin:0}.metadata dl div{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:8px}.metadata dt{font-size:.76rem;color:#64748b;font-weight:800}.metadata dd{margin:3px 0 0;font-weight:800;overflow-wrap:anywhere}.question{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px}.question pre{font:inherit;white-space:pre-wrap;line-height:1.55}.options,.option-analysis{list-style:none;padding:0}.option{display:flex;gap:10px;align-items:center;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;margin:8px 0}.option.correct{border-color:#16a34a;background:#f0fdf4}.index{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#e2e8f0;font-weight:900}.badge{margin-left:auto;border-radius:999px;background:#16a34a;color:#fff;padding:3px 9px;font-size:.8rem;font-weight:900}section{margin-top:18px;border-left:5px solid #64748b;padding:13px 16px;background:#f8fafc;border-radius:10px}section h3{margin:0 0 10px}.policy{font-weight:800}.meaning-list li{margin:12px 0}.meaning-list p{margin:5px 0}.analysis{padding:12px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;margin:10px 0}.correct-analysis{border-color:#16a34a;background:#f0fdf4}.analysis-head{display:flex;justify-content:space-between;gap:12px}.analysis-head span{font-weight:800}.proof{font-weight:800}.diagram{border-left-color:#2563eb;background:#eff6ff}.diagram svg{display:block;width:100%;height:auto;max-width:960px;margin:auto}.final{border:2px solid #16a34a;border-left-width:5px;background:#f0fdf4}.final p{font-size:1.1rem;font-weight:900}.review{border-left-color:#d97706;background:#fffbeb}table{border-collapse:collapse;width:100%}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left}details{margin-top:18px}details pre{white-space:pre-wrap;overflow:auto;background:#0f172a;color:#e2e8f0;padding:14px;border-radius:10px;font-size:.8rem}@media(max-width:720px){body{padding:10px}article{padding:14px}header,.analysis-head{display:block}.ids{justify-content:flex-start}.diagram svg{min-width:0}th,td{font-size:.82rem}.toolbar{position:static}}
</style></head><body><h1>SYL-001 Structured-Proof Remodel V3</h1><p class="lead">${questions.length} localized records · ${reviewSelection.uniqueLogicalPayloadCount} unique logical payloads · one integrated diagram per question · human review status REVISE.</p><div class="toolbar">${filterControls}<div class="actions"><button type="button" id="clear-filters">Clear filters</button></div></div><p class="result-count" id="result-count"></p>${questions.map(renderQuestion).join("\n")}<script>
const articles=[...document.querySelectorAll('article[data-locale]')];
const selects=[...document.querySelectorAll('select[data-filter-field]')];
for(const select of selects){const field=select.dataset.filterField;const values=new Set();for(const article of articles){const raw=article.dataset[field]||'';for(const value of raw.split(',').map(item=>item.trim()).filter(Boolean))values.add(value);}for(const value of [...values].sort((a,b)=>a.localeCompare(b))){const option=document.createElement('option');option.value=value;option.textContent=value;select.append(option);}}
function applyFilters(){let visible=0;for(const article of articles){const matches=selects.every(select=>{if(!select.value)return true;const raw=article.dataset[select.dataset.filterField]||'';return raw.split(',').map(item=>item.trim()).includes(select.value);});article.hidden=!matches;if(matches)visible+=1;}document.getElementById('result-count').textContent='Showing '+visible+' of '+articles.length+' localized records';}
for(const select of selects)select.addEventListener('change',applyFilters);document.getElementById('clear-filters').addEventListener('click',()=>{for(const select of selects)select.value='';applyFilters();});applyFilters();
</script></body></html>`;
writeFileSync(resolve(outputDir, "syl-001-remodel-v3-review.html"), html, "utf8");

const validationFailures = questions.filter((question) => !validateSylQuestionV3(question).ok);
const summary = {
  authority: "SYL_001_STRUCTURED_PROOF_REMODEL_V3",
  reviewVersion: "SYL_001_REMODEL_V3",
  localizedRecordCount: questions.length,
  uniqueLogicalPayloadCount: reviewSelection.uniqueLogicalPayloadCount,
  qlCount: SYL_QL_REGISTRY.length,
  logicalPayloadsPerQl: SYL_V3_REVIEW_TARGET_PER_QL,
  locales,
  selectedSeedsByQl: reviewSelection.selectedSeedsByQl,
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
