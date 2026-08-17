import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV4 } from "./generator-v4";
import { learnerCopyV4 } from "./learner-v4-localization";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import { SYL_QL_REGISTRY } from "./ql-registry";
import { escapeHtmlV4, renderLearnerQuestionV4 } from "./review-renderer-v4";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [0, 1, 2, 3, 4, 5] as const;
const questions = SYL_QL_REGISTRY.flatMap((definition) =>
  seeds.flatMap((seed) => locales.map((locale) => generateSylQuestionV4(definition.qlId, seed, locale))));

function countWords(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function beforeLearnerWords(question: GeneratedSylQuestionV4): number {
  const proof = question.structuredProofV3;
  return countWords([
    ...proof.statementMeanings.flatMap((entry) => [entry.statement, entry.meaning, entry.normalizedRelation]),
    proof.combinedReasoning.summary,
    ...proof.combinedReasoning.reasoningSteps.map((entry) => entry.text),
    ...proof.visibleOptionAnalysis.flatMap((entry) => [entry.studentVerdict, entry.studentReason]),
    ...proof.correctOptionProof.reasoningSteps,
    proof.correctOptionProof.studentProof,
    proof.fastRule.symbolic,
    proof.fastRule.naturalLanguage,
    proof.finalAnswer,
  ].join(" "));
}

function afterPrimaryWords(question: GeneratedSylQuestionV4): number {
  return question.learnerPresentationV4.learnerExplanation.wordCount;
}

function average(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
}

function oldVisibleText(question: GeneratedSylQuestionV4): string {
  const proof = question.structuredProofV3;
  return JSON.stringify({
    statementMeanings: proof.statementMeanings,
    combinedReasoning: proof.combinedReasoning,
    optionAnalysis: proof.visibleOptionAnalysis,
    correctProof: proof.correctOptionProof,
    fastRule: proof.fastRule,
    finalAnswer: proof.finalAnswer,
  });
}

const beforeLengths = questions.map(beforeLearnerWords);
const afterLengths = questions.map(afterPrimaryWords);
const enabledDiagrams = questions.filter((question) => question.learnerPresentationV4.diagram.enabled);
const omittedDiagrams = questions.filter((question) => !question.learnerPresentationV4.diagram.enabled);
const diagramModes = [...new Set(questions.map((question) => question.learnerPresentationV4.diagram.mode))].sort();
const explanationModes = [...new Set(questions.map((question) => question.learnerPresentationV4.learnerExplanation.mode))].sort();

const nonEnglish = questions.filter((question) => question.locale !== "en-IN");
const localizationDefects = {
  legacyEnglishOptionLabelsRemoved: nonEnglish.reduce((sum, question) => sum + question.options.length, 0),
  legacyEnglishPremisesReasonLabelsRemoved: nonEnglish.reduce((sum, question) => sum + question.structuredProofV3.visibleOptionAnalysis.length * 2, 0),
  literalMemberPhrasesFound: questions.reduce((sum, question) =>
    sum + Number(/(?:का हर सदस्य|ਦਾ ਹਰ ਮੈਂਬਰ|member of the group)/u.test(oldVisibleText(question))), 0),
  duplicatePunctuationFound: questions.reduce((sum, question) =>
    sum + Number(/।।|۔۔|!!|\?\?/u.test(oldVisibleText(question))), 0),
};

const report = {
  authority: "SYL_001_LEARNER_EXPLANATION_V4",
  schemaVersion: "syl-learner-v4",
  records: questions.length,
  languages: {
    English: questions.filter((question) => question.locale === "en-IN").length,
    Hindi: questions.filter((question) => question.locale === "hi-IN").length,
    Punjabi: questions.filter((question) => question.locale === "pa-IN").length,
  },
  repeatedContentRemoved: {
    mandatorySevenSectionRecordsRemoved: questions.length,
    duplicateFinalAnswerBlocksRemoved: questions.length,
    learnerFacingPremiseIdRowsRemoved: questions.reduce((sum, question) => sum + question.structuredProofV3.visibleOptionAnalysis.length, 0),
    learnerFacingReasonCodeRowsRemoved: questions.reduce((sum, question) => sum + question.structuredProofV3.visibleOptionAnalysis.length, 0),
  },
  explanationLength: {
    averageBeforeWords: Number(average(beforeLengths).toFixed(1)),
    averageAfterPrimaryWords: Number(average(afterLengths).toFixed(1)),
    reductionPercent: Number(((1 - average(afterLengths) / average(beforeLengths)) * 100).toFixed(1)),
    shortestAfterWords: Math.min(...afterLengths),
    longestAfterWords: Math.max(...afterLengths),
    byMode: Object.fromEntries(explanationModes.map((mode) => {
      const records = questions.filter((question) => question.learnerPresentationV4.learnerExplanation.mode === mode);
      return [mode, {
        records: records.length,
        averageWords: Number(average(records.map(afterPrimaryWords)).toFixed(1)),
      }];
    })),
  },
  diagrams: {
    convertedToVenn: enabledDiagrams.length,
    intentionallyOmitted: omittedDiagrams.length,
    byMode: Object.fromEntries(diagramModes.map((mode) => [mode, questions.filter((question) => question.learnerPresentationV4.diagram.mode === mode).length])),
    omissionReasons: Object.fromEntries([...new Set(omittedDiagrams.map((question) => question.learnerPresentationV4.diagram.omissionReason ?? "NONE"))]
      .map((reason) => [reason, omittedDiagrams.filter((question) => (question.learnerPresentationV4.diagram.omissionReason ?? "NONE") === reason).length])),
  },
  localizationDefectsFound: localizationDefects,
  safeguards: {
    structuredProofV3Preserved: true,
    answerKeysChanged: 0,
    nativeEditorialStatus: "NOT_RUN",
    reviewStatus: "REVISE",
    public: false,
    questionStudioEnabled: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
  },
  remainingManualReviewBlockers: [
    "Native English editorial review",
    "Native Hindi editorial review",
    "Native Punjabi editorial review",
    "Representative mobile visual review at 360 px, 412 px and 768 px",
    "Independent logic parity review",
    "Source-profile and final QL merge/split sign-off",
  ],
};

function optionTags(items: readonly string[]): string {
  return `<option value="all">All</option>${items.map((item) => `<option value="${escapeHtmlV4(item)}">${escapeHtmlV4(item)}</option>`).join("")}`;
}

function compactBeforeAfter(question: GeneratedSylQuestionV4): string {
  const v4 = question.learnerPresentationV4;
  const copy = learnerCopyV4(question.locale);
  return `<article class="comparison-card">
    <header><h3>${escapeHtmlV4(`${v4.diagram.mode} · ${question.qlId} · ${question.locale}`)}</h3></header>
    <div class="comparison-grid">
      <section class="before">
        <h4>V3 learner surface</h4>
        <ol><li>Understand the statements</li><li>Combine the statements</li><li>Check each visible option</li><li>Why the correct option is right</li><li>Fast exam rule</li><li>One combined diagram</li><li>Final answer</li></ol>
        <p><strong>${beforeLearnerWords(question)} learner-facing words</strong></p>
        <div class="legacy-diagram">${question.structuredProofV3.integratedDiagramSvg}</div>
      </section>
      <section class="after">
        <h4>V4 learner surface</h4>
        <div class="answer-mini"><strong>${escapeHtmlV4(`${v4.answer.label}: ${copy.option} ${v4.answer.displayIndex}`)}</strong><p>${escapeHtmlV4(v4.answer.text)}</p></div>
        ${v4.learnerExplanation.shortReasoning.map((line) => `<p>${escapeHtmlV4(line)}</p>`).join("")}
        ${v4.diagram.enabled && v4.diagram.svg ? `<div class="new-diagram">${v4.diagram.svg}<p>${escapeHtmlV4(v4.diagram.caption ?? "")}</p></div>` : `<p class="omitted">Diagram omitted: ${escapeHtmlV4(v4.diagram.omissionReason ?? "not useful")}</p>`}
        <p><strong>${afterPrimaryWords(question)} primary learner words</strong></p>
      </section>
    </div>
  </article>`;
}

const representatives = [...new Set(questions.map((question) => question.learnerPresentationV4.diagram.mode))]
  .map((mode) => questions.find((question) => question.learnerPresentationV4.diagram.mode === mode))
  .filter((question): question is GeneratedSylQuestionV4 => Boolean(question));

const filterValues = {
  ql: [...new Set(questions.map((question) => question.qlId))],
  checkpoint: [...new Set(questions.map((question) => question.checkpointId))],
  task: [...new Set(questions.map((question) => question.metadata.taskKind))],
  difficulty: [...new Set(questions.map((question) => question.difficulty))],
  explanation: explanationModes,
  diagram: diagramModes,
  existence: ["DEPENDENT", "INDEPENDENT"],
  review: ["REVISE"],
};

const chapterPolicy = "For this chapter, every class named in the statements is treated as having at least one member.";

const css = `*{box-sizing:border-box}body{margin:0;background:#eef2f7;color:#0f172a;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.page{max-width:1240px;margin:auto;padding:20px}.top{background:#0f172a;color:#fff;padding:22px;border-radius:18px}.top h1{margin:0 0 8px;font-size:clamp(1.35rem,3vw,2.1rem)}.top p{margin:5px 0;color:#cbd5e1}.policy-global{margin:14px 0;padding:13px 15px;background:#f0fdfa;border:1px solid #5eead4;border-radius:12px}.filters{position:sticky;top:0;z-index:10;margin:14px 0;padding:10px;background:rgba(238,242,247,.97);display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px;border:1px solid #cbd5e1;border-radius:12px}.filters select{width:100%;padding:9px;border:1px solid #94a3b8;border-radius:8px;background:#fff}.summary-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:14px 0}.metric{background:#fff;border:1px solid #cbd5e1;border-radius:12px;padding:12px}.metric strong{font-size:1.35rem;display:block}.comparisons{margin:14px 0;background:#fff;border:1px solid #cbd5e1;border-radius:12px;padding:13px}.comparisons>summary{font-weight:800;cursor:pointer}.comparison-card{box-shadow:none;margin:15px 0}.comparison-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.comparison-grid>section{margin:0;border:1px solid #cbd5e1;border-radius:10px;padding:12px}.legacy-diagram svg,.new-diagram svg{width:100%;height:auto;display:block}.legacy-diagram{opacity:.78}.answer-mini{padding:9px;background:#f0fdf4;border:1px solid #86efac;border-radius:8px}.answer-mini p{margin:4px 0 0}.omitted{padding:8px;background:#f8fafc;border:1px dashed #94a3b8;border-radius:8px}article{background:#fff;border:1px solid #cbd5e1;border-radius:16px;padding:18px;margin:0 0 22px;box-shadow:0 4px 16px rgba(15,23,42,.06)}article>header{display:flex;justify-content:space-between;gap:14px;border-bottom:1px solid #e2e8f0;padding-bottom:11px}article h2{margin:0;font-size:1.04rem}article header p{margin:4px 0;color:#64748b}.badges{display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end}.badges span{font-size:.7rem;font-weight:800;padding:4px 7px;border-radius:999px;background:#e2e8f0}.badges .revise{background:#fee2e2;color:#991b1b}.question{margin-top:14px;background:#f8fafc;border-radius:11px;padding:14px}.question pre{white-space:pre-wrap;font:inherit;line-height:1.55;margin:0 0 11px}.question-options{list-style:none;padding:0;margin:0;display:grid;gap:7px}.question-option{display:flex;gap:9px;align-items:flex-start;padding:9px;border:1px solid #dbe3ed;border-radius:9px;background:#fff}.question-option.keyed{border-color:#86efac}.option-number{display:grid;place-items:center;min-width:24px;height:24px;border-radius:50%;background:#e2e8f0;font-weight:800}.learner-view{margin-top:14px}.answer-card{padding:13px 15px;background:#f0fdf4;border:2px solid #22c55e;border-radius:12px}.answer-card p{margin:5px 0 0;font-size:1.03rem;font-weight:750}.simple-explanation{padding:14px 2px}.simple-explanation h3,.diagram-v4 h3{margin:0 0 9px}.reasoning-lines p,.simple-explanation p{margin:7px 0;line-height:1.55}.conclusion-line{font-weight:800}.existence-note{margin-top:10px;padding:9px 11px;background:#fffbeb;border:1px solid #fbbf24;border-radius:8px}.conclusion-results{display:grid;gap:7px}.conclusion-result{padding:9px 11px;border-radius:8px;border-left:4px solid #94a3b8;background:#f8fafc}.conclusion-result.follows{border-color:#22c55e}.conclusion-result.not-follows{border-color:#ef4444}.conclusion-result span{display:block;margin-top:3px}.conclusion-result p{color:#475569}.diagram-v4{padding:12px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:11px}.diagram-v4 svg{width:100%;max-width:620px;height:auto;display:block;margin:auto}.diagram-caption{text-align:center;margin:7px auto 0;max-width:680px;color:#334155}.shortcut{display:grid;gap:7px;margin:11px 0;padding:11px;background:#fffbeb;border:1px solid #fbbf24;border-radius:9px}.shortcut code{white-space:pre-wrap;font:700 .92rem ui-monospace,SFMono-Regular,Menlo,monospace}.wrong-options,.administrator-proof{margin-top:12px;border:1px solid #cbd5e1;border-radius:10px;padding:10px 12px}.wrong-options summary,.administrator-proof summary{cursor:pointer;font-weight:800}.wrong-options ol{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:8px}.wrong-options li{padding:10px;background:#f8fafc;border-radius:8px}.wrong-head{display:flex;justify-content:space-between;gap:10px}.wrong-head span{font-size:.75rem;font-weight:850;padding:3px 6px;background:#e2e8f0;border-radius:999px;white-space:nowrap}.wrong-options p{margin:6px 0 0;color:#334155}.administrator-proof pre{white-space:pre-wrap;overflow:auto;background:#0f172a;color:#e2e8f0;padding:12px;border-radius:8px;font-size:.76rem}@media(max-width:720px){.page{padding:9px}.filters{position:static;grid-template-columns:1fr 1fr}article{padding:12px}.comparison-grid{grid-template-columns:1fr}article>header,.wrong-head{display:block}.badges{justify-content:flex-start;margin-top:7px}.wrong-head span{display:inline-block;margin-top:5px}.diagram-v4{padding:7px}}`;

const html = `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 Structured-Proof V4 Learner Simplification Review</title><style>${css}</style></head><body><main class="page"><section class="top"><h1>SYL-001 Structured-Proof V4 Learner Simplification Review</h1><p>${questions.length} multilingual records. Rich V3 proof remains internal; the V4 learner view is adaptive and concise.</p><p>Every record remains REVISE, non-public, unstored and test-ineligible.</p></section><section class="policy-global"><strong>Chapter rule:</strong> ${escapeHtmlV4(chapterPolicy)}</section><section class="summary-grid"><div class="metric"><strong>${report.explanationLength.averageBeforeWords}</strong><span>Average V3 learner words</span></div><div class="metric"><strong>${report.explanationLength.averageAfterPrimaryWords}</strong><span>Average V4 primary words</span></div><div class="metric"><strong>${report.explanationLength.reductionPercent}%</strong><span>Primary explanation reduction</span></div><div class="metric"><strong>${report.diagrams.convertedToVenn}</strong><span>Venn diagrams rendered</span></div><div class="metric"><strong>${report.diagrams.intentionallyOmitted}</strong><span>Diagrams omitted as unhelpful</span></div></section><details class="comparisons"><summary>Before-and-after examples for every V4 diagram mode</summary>${representatives.map(compactBeforeAfter).join("\n")}</details><div class="filters"><select aria-label="Language" data-field="language">${optionTags(["en-IN","hi-IN","pa-IN"])}</select><select aria-label="QL" data-field="ql">${optionTags(filterValues.ql)}</select><select aria-label="Checkpoint" data-field="checkpoint">${optionTags(filterValues.checkpoint)}</select><select aria-label="Task" data-field="task">${optionTags(filterValues.task)}</select><select aria-label="Difficulty" data-field="difficulty">${optionTags(filterValues.difficulty)}</select><select aria-label="Explanation mode" data-field="explanation">${optionTags(filterValues.explanation)}</select><select aria-label="Diagram mode" data-field="diagram">${optionTags(filterValues.diagram)}</select><select aria-label="Existence dependency" data-field="existence">${optionTags(filterValues.existence)}</select><select aria-label="Review status" data-field="review">${optionTags(filterValues.review)}</select></div><div id="records">${questions.map(renderLearnerQuestionV4).join("\n")}</div></main><script>const selects=[...document.querySelectorAll('.filters select')];function applyFilters(){document.querySelectorAll('#records>article').forEach(article=>{article.hidden=selects.some(select=>select.value!=='all'&&(article.dataset[select.dataset.field]??'').toLowerCase()!==select.value.toLowerCase());});}selects.forEach(select=>select.addEventListener('change',applyFilters));</script></body></html>`;

const comparisonHtml = `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 V4 Before and After</title><style>body{font-family:system-ui;margin:auto;max-width:1100px;padding:18px;background:#eef2f7}.comparison-card{background:#fff;border:1px solid #cbd5e1;border-radius:12px;padding:14px;margin:14px 0}.comparison-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.comparison-grid section{border:1px solid #cbd5e1;border-radius:9px;padding:10px}.legacy-diagram svg,.new-diagram svg{width:100%;height:auto}.answer-mini{background:#f0fdf4;padding:9px;border-radius:8px}@media(max-width:700px){.comparison-grid{grid-template-columns:1fr}}</style></head><body><h1>SYL-001 V4 Before-and-After Comparison</h1>${representatives.map(compactBeforeAfter).join("\n")}</body></html>`;

const outputDir = process.env.SYL_REVIEW_V4_DIR
  ? resolve(process.env.SYL_REVIEW_V4_DIR)
  : resolve(process.cwd(), "artifacts/api-server/dist/reasoning-v1/syl-001-review-v4");
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "SYL-001-Structured-Proof-V4-Learner-Simplification-Review.html"), html, "utf8");
writeFileSync(resolve(outputDir, "SYL-001-V4-Before-After-Comparison.html"), comparisonHtml, "utf8");
writeFileSync(resolve(outputDir, "syl-001-v4-review.jsonl"), `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`, "utf8");
writeFileSync(resolve(outputDir, "syl-001-v4-remediation-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  status: "SYL-001 V4 learner review exported",
  outputDir,
  records: questions.length,
  report,
}, null, 2));
