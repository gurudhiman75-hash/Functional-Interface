import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestion } from "./generator";
import { SYL_QL_REGISTRY } from "./ql-registry";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [0, 1, 2, 3, 4, 5] as const;
const questions = SYL_QL_REGISTRY.flatMap((definition) =>
  seeds.flatMap((seed) => locales.map((locale) => generateSylQuestion(definition.qlId, seed, locale))));

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function localeName(locale: SylLocale): string {
  if (locale === "hi-IN") return "Hindi";
  if (locale === "pa-IN") return "Punjabi";
  return "English";
}

function headings(locale: SylLocale): {
  statements: string;
  combine: string;
  options: string;
  proof: string;
  fast: string;
  diagram: string;
  final: string;
  existence: string;
  admin: string;
} {
  if (locale === "hi-IN") return {
    statements: "1. कथनों को समझें",
    combine: "2. कथनों को जोड़ें",
    options: "3. हर दिखाई देने वाले विकल्प की जाँच",
    proof: "4. सही विकल्प क्यों सही है",
    fast: "5. तेज़ परीक्षा नियम",
    diagram: "6. सही विकल्प का एक संयुक्त चित्र",
    final: "7. अंतिम उत्तर",
    existence: "अध्याय की सदस्यता-नीति",
    admin: "केवल प्रशासक के लिए संरचित प्रमाण",
  };
  if (locale === "pa-IN") return {
    statements: "1. ਕਥਨਾਂ ਨੂੰ ਸਮਝੋ",
    combine: "2. ਕਥਨਾਂ ਨੂੰ ਜੋੜੋ",
    options: "3. ਹਰ ਦਿਖਾਈ ਦੇ ਰਹੇ ਵਿਕਲਪ ਦੀ ਜਾਂਚ",
    proof: "4. ਸਹੀ ਵਿਕਲਪ ਕਿਉਂ ਸਹੀ ਹੈ",
    fast: "5. ਤੇਜ਼ ਪ੍ਰੀਖਿਆ ਨਿਯਮ",
    diagram: "6. ਸਹੀ ਵਿਕਲਪ ਦਾ ਇੱਕ ਇਕੱਠਾ ਚਿੱਤਰ",
    final: "7. ਅੰਤਿਮ ਉੱਤਰ",
    existence: "ਅਧਿਆਇ ਦੀ ਮੈਂਬਰਤਾ-ਨੀਤੀ",
    admin: "ਸਿਰਫ਼ ਪ੍ਰਬੰਧਕ ਲਈ ਬਣਤਰਬੱਧ ਸਬੂਤ",
  };
  return {
    statements: "1. Understand the statements",
    combine: "2. Combine the statements",
    options: "3. Check each visible option",
    proof: "4. Why the correct option is right",
    fast: "5. Fast exam rule",
    diagram: "6. One combined diagram for the correct option",
    final: "7. Final answer",
    existence: "Chapter existence policy",
    admin: "Administrator-only structured proof",
  };
}

function renderQuestion(question: (typeof questions)[number]): string {
  const proof = question.structuredProofV3;
  const h = headings(question.locale);
  const options = question.options.map((option, index) =>
    `<li class="question-option ${option.isCorrect ? "keyed" : ""}"><span class="number">${index + 1}</span><span>${escapeHtml(option.text)}</span>${option.isCorrect ? `<span class="key-badge">KEY</span>` : ""}</li>`,
  ).join("");
  const meanings = proof.statementMeanings.map((entry) =>
    `<li><strong>${entry.displayIndex}. ${escapeHtml(entry.statement)}</strong><p>${escapeHtml(entry.meaning)}</p><span class="relation">${escapeHtml(entry.normalizedRelation)}</span></li>`,
  ).join("");
  const reasoning = proof.combinedReasoning.reasoningSteps.map((step) =>
    `<li><span class="step-number">${step.stepIndex}</span><span>${escapeHtml(step.text)}</span></li>`,
  ).join("");
  const optionAnalysis = proof.visibleOptionAnalysis.map((analysis) =>
    `<li class="analysis ${analysis.isCorrectForTask ? "keyed" : ""}"><div class="analysis-head"><strong>Option ${analysis.displayIndex}: ${escapeHtml(analysis.text)}</strong><span class="verdict">${escapeHtml(analysis.studentVerdict)}</span></div><p>${escapeHtml(analysis.studentReason)}</p><small>Premises: ${escapeHtml(analysis.premiseIdsUsed.join(", "))} · Reason: ${escapeHtml(analysis.reasonCode)}</small></li>`,
  ).join("");
  const proofSteps = proof.correctOptionProof.reasoningSteps.map((step, index) =>
    `<li><span class="step-number">${index + 1}</span><span>${escapeHtml(step)}</span></li>`,
  ).join("");
  const metadata = {
    identity: proof.identity,
    sourcePatternId: question.sourcePatternId,
    scenarioId: question.scenarioId,
    taskKind: proof.taskKind,
    existencePolicy: proof.existencePolicy,
    validationEvidence: proof.validationEvidence,
    humanReview: proof.humanReview,
    structuredPrompt: question.structuredPrompt,
    reviewLogic: question.reviewLogic,
    diagramSpec: proof.diagramSpec,
  };

  return `<article lang="${question.locale}" data-language="${question.locale}" data-ql="${question.qlId}" data-checkpoint="${question.checkpointId}" data-task="${question.metadata.taskKind}" data-difficulty="${question.difficulty}" data-existence="${proof.existencePolicy.policyId}" data-diagram="${proof.diagramSpec.mode}" data-review="${proof.humanReview.status}">
<header><div><h2>${escapeHtml(proof.identity.questionLanguageId)}</h2><p>${question.qlId} · ${question.checkpointId} · ${localeName(question.locale)} · seed ${question.seed}</p></div><div class="badges"><span>${question.difficulty}</span><span>${escapeHtml(question.metadata.taskKind)}</span><span class="revise">REVISE</span></div></header>
<section class="question"><pre>${escapeHtml(question.stem)}</pre><ol class="question-options">${options}</ol></section>
<section class="policy"><h3>${escapeHtml(h.existence)}</h3><p>${escapeHtml(proof.existencePolicy.studentDirection)}</p>${proof.existencePolicy.dependentAnswer ? `<strong>Answer depends on this policy.</strong>` : ""}</section>
<section><h3>${escapeHtml(h.statements)}</h3><ol class="meanings">${meanings}</ol></section>
<section><h3>${escapeHtml(h.combine)}</h3><p class="summary">${escapeHtml(proof.combinedReasoning.summary)}</p><ol class="reasoning">${reasoning}</ol></section>
<section><h3>${escapeHtml(h.options)}</h3><ol class="option-analysis">${optionAnalysis}</ol></section>
<section class="correct-proof"><h3>${escapeHtml(h.proof)}</h3><ol class="reasoning">${proofSteps}</ol><p>${escapeHtml(proof.correctOptionProof.studentProof)}</p></section>
<section class="fast-rule"><h3>${escapeHtml(h.fast)}</h3><code>${escapeHtml(proof.fastRule.symbolic)}</code><p>${escapeHtml(proof.fastRule.naturalLanguage)}</p></section>
<section class="diagram"><h3>${escapeHtml(h.diagram)}</h3>${proof.integratedDiagramSvg}</section>
<section class="final"><h3>${escapeHtml(h.final)}</h3><p>${escapeHtml(proof.finalAnswer)}</p></section>
<details><summary>${escapeHtml(h.admin)}</summary><pre>${escapeHtml(JSON.stringify(metadata, null, 2))}</pre></details>
</article>`;
}

const outputDir = process.env.SYL_REVIEW_DIR
  ? resolve(process.env.SYL_REVIEW_DIR)
  : resolve(process.cwd(), "artifacts/api-server/dist/reasoning-v1/syl-001-review-v3");
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "syl-001-structured-proof-v3-review.jsonl"), `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`, "utf8");

const filterValues = {
  ql: [...new Set(questions.map((question) => question.qlId))],
  checkpoint: [...new Set(questions.map((question) => question.checkpointId))],
  task: [...new Set(questions.map((question) => question.metadata.taskKind))],
  difficulty: [...new Set(questions.map((question) => question.difficulty))],
  diagram: [...new Set(questions.map((question) => question.structuredProofV3.diagramSpec.mode))],
};
const optionTags = (items: readonly string[]): string => `<option value="all">All</option>${items.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}`;

const html = `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 Structured Proof V3 Review</title><style>
*{box-sizing:border-box}body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;background:#eef2f7;color:#0f172a}.page{max-width:1240px;margin:auto;padding:22px}.top{background:#0f172a;color:#fff;padding:20px;border-radius:16px}.top h1{margin:0 0 8px}.top p{margin:0;color:#cbd5e1}.filters{position:sticky;top:0;z-index:5;margin:16px 0;padding:12px;background:rgba(238,242,247,.96);display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:8px;border:1px solid #cbd5e1;border-radius:12px}.filters select{width:100%;padding:9px;border:1px solid #94a3b8;border-radius:8px;background:#fff}article{background:#fff;border:1px solid #cbd5e1;border-radius:16px;padding:20px;margin:0 0 24px;box-shadow:0 4px 16px rgba(15,23,42,.06)}header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;border-bottom:1px solid #e2e8f0;padding-bottom:12px}header h2{margin:0;font-size:1.1rem}header p{margin:5px 0 0;color:#64748b}.badges{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.badges span{font-size:.72rem;font-weight:800;padding:4px 7px;border-radius:999px;background:#e2e8f0}.badges .revise{background:#fee2e2;color:#991b1b}.question{background:#f8fafc;border-radius:12px;padding:16px;margin-top:16px}.question pre{white-space:pre-wrap;font:inherit;line-height:1.55;margin:0 0 12px}.question-options{list-style:none;padding:0;margin:0;display:grid;gap:7px}.question-option{display:flex;gap:9px;align-items:center;padding:9px;border:1px solid #dbe3ed;border-radius:9px;background:#fff}.question-option.keyed{border-color:#16a34a;background:#f0fdf4}.number,.step-number{display:inline-grid;place-items:center;min-width:25px;height:25px;border-radius:50%;background:#e2e8f0;font-weight:800}.key-badge{margin-left:auto;background:#16a34a;color:#fff;font-size:.68rem;font-weight:900;padding:3px 6px;border-radius:999px}section{margin-top:16px;padding:15px;border-left:5px solid #64748b;background:#f8fafc;border-radius:9px}section h3{margin:0 0 10px}.policy{border-color:#0f766e;background:#f0fdfa}.policy strong{color:#9f1239}.meanings,.reasoning,.option-analysis{padding-left:24px}.meanings li,.option-analysis li{margin:10px 0}.meanings p{margin:5px 0}.relation{font-size:.85rem;font-weight:800;color:#1d4ed8}.reasoning{list-style:none;padding:0;display:grid;gap:8px}.reasoning li{display:flex;gap:9px;align-items:flex-start}.summary{font-weight:700}.option-analysis{list-style:none;padding:0}.analysis{padding:11px;border:1px solid #dbe3ed;background:#fff;border-radius:10px}.analysis.keyed{border-color:#16a34a;background:#f0fdf4}.analysis-head{display:flex;justify-content:space-between;gap:10px}.verdict{font-size:.76rem;font-weight:900;background:#e2e8f0;padding:4px 7px;border-radius:999px;white-space:nowrap}.analysis p{margin:8px 0}.analysis small{color:#64748b}.correct-proof{border-color:#16a34a;background:#f0fdf4}.fast-rule{border-color:#d97706;background:#fffbeb}.fast-rule code{display:block;padding:10px;background:#fff;border-radius:8px;font-weight:800;white-space:pre-wrap}.diagram{border-color:#2563eb;background:#eff6ff}.diagram svg{width:100%;height:auto;display:block}.final{border:2px solid #16a34a;background:#f0fdf4}.final p{font-size:1.08rem;font-weight:900}details{margin-top:16px}details pre{white-space:pre-wrap;overflow:auto;background:#0f172a;color:#e2e8f0;padding:14px;border-radius:8px;font-size:.78rem}@media(max-width:650px){.page{padding:10px}article{padding:13px}header,.analysis-head{display:block}.badges{justify-content:flex-start;margin-top:8px}.verdict{display:inline-block;margin-top:6px}.filters{position:static;grid-template-columns:1fr 1fr}}
</style></head><body><main class="page"><div class="top"><h1>SYL-001 Structured Proof V3 Review</h1><p>${questions.length} provisional multilingual review records. Every record remains REVISE and non-public.</p></div><div class="filters"><select data-field="language">${optionTags(["en-IN","hi-IN","pa-IN"])}</select><select data-field="ql">${optionTags(filterValues.ql)}</select><select data-field="checkpoint">${optionTags(filterValues.checkpoint)}</select><select data-field="task">${optionTags(filterValues.task)}</select><select data-field="difficulty">${optionTags(filterValues.difficulty)}</select><select data-field="diagram">${optionTags(filterValues.diagram)}</select><select data-field="review">${optionTags(["REVISE"])}</select></div><div id="records">${questions.map(renderQuestion).join("\n")}</div></main><script>
const controls=[...document.querySelectorAll('[data-field]')];const records=[...document.querySelectorAll('article')];function apply(){records.forEach(record=>{record.hidden=controls.some(control=>control.value!=='all'&&record.dataset[control.dataset.field]!==control.value);});}controls.forEach(control=>control.addEventListener('change',apply));
</script></body></html>`;
writeFileSync(resolve(outputDir, "syl-001-structured-proof-v3-review.html"), html, "utf8");

const summary = {
  authority: "SYL_001_STRUCTURED_PROOF_PEDAGOGY_V3",
  status: "PROVISIONAL_REMEDIATION_REVIEW",
  provisionalQlCount: SYL_QL_REGISTRY.length,
  seedsPerQlLocale: seeds.length,
  locales,
  recordCount: questions.length,
  humanReviewStatus: "REVISE",
  publicationLocks: {
    questionStudioVisible: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
};
writeFileSync(resolve(outputDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...summary, outputDir }, null, 2));
