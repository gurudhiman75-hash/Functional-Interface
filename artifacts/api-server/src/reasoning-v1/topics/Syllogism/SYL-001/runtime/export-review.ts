import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestion } from "./generator";
import { SYL_QL_REGISTRY } from "./ql-registry";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [0, 17] as const;
const questions = SYL_QL_REGISTRY.flatMap((definition) =>
  locales.flatMap((locale) => seeds.map((seed) => generateSylQuestion(definition.qlId, seed, locale))),
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

function correctBadge(locale: SylLocale): string {
  if (locale === "hi-IN") return "सही";
  if (locale === "pa-IN") return "ਸਹੀ";
  return "Correct";
}

function finalAnswerHeading(locale: SylLocale): string {
  if (locale === "hi-IN") return "✅ अंतिम उत्तर";
  if (locale === "pa-IN") return "✅ ਅੰਤਿਮ ਉੱਤਰ";
  return "✅ Final Answer";
}

function renderQuestion(question: (typeof questions)[number]): string {
  const options = question.options.map((entry, index) =>
    `<li class="option ${entry.isCorrect ? "correct" : ""}"><span class="option-number">${index + 1}</span><span>${escapeHtml(entry.text)}</span>${entry.isCorrect ? `<span class="answer-badge">${escapeHtml(correctBadge(question.locale))}</span>` : ""}</li>`,
  ).join("");
  const premiseBreakdown = question.explanation.tier1Concept.premiseBreakdown.map((point, index) =>
    `<li><strong>${index + 1}. ${escapeHtml(point.statement)}</strong><div>${escapeHtml(point.naturalRule)}</div><code>${escapeHtml(point.compactRule)}</code></li>`,
  ).join("");
  const conclusionSteps = question.explanation.tier2StepByStep.conclusionSteps.map((step) =>
    `<li class="conclusion-step ${step.verdict.toLowerCase()}"><div class="conclusion-line"><strong>${escapeHtml(step.label)}. ${escapeHtml(step.conclusion)}</strong><span class="verdict">${escapeHtml(step.verdictLabel)}</span></div><p>${escapeHtml(step.reasoning)}</p></li>`,
  ).join("");
  const combination = question.explanation.tier2StepByStep.combinationSummary
    ? `<p class="combination-summary">${escapeHtml(question.explanation.tier2StepByStep.combinationSummary)}</p>`
    : "";
  const adminMetadata = {
    structuredPrompt: question.structuredPrompt,
    reviewLogic: question.reviewLogic,
    diagnosticTag: question.explanation.tier4Trap.diagnosticTag,
    metadata: question.metadata,
  };

  return `<article data-locale="${question.locale}" data-ql="${question.qlId}">
<header class="question-header"><div><h2>${question.qlId} · ${question.checkpointId}</h2><p>${localeName(question.locale)} · seed ${question.seed} · ${question.difficulty}</p></div><div class="source-meta"><code>${question.sourcePatternId}</code><code>${question.scenarioId}</code></div></header>
<section class="question-card"><pre>${escapeHtml(question.stem)}</pre><ol class="options">${options}</ol></section>
<section class="tier tier-1"><h3>${escapeHtml(question.explanation.tier1Concept.heading)}</h3><p class="core-rule">${escapeHtml(question.explanation.tier1Concept.coreRule)}</p><ol class="premise-breakdown">${premiseBreakdown}</ol></section>
<section class="tier tier-2"><h3>${escapeHtml(question.explanation.tier2StepByStep.heading)}</h3><ol class="conclusion-analysis">${conclusionSteps}</ol>${combination}</section>
<section class="tier tier-3"><h3>${escapeHtml(question.explanation.tier3Shortcut.heading)}</h3><p><strong>${escapeHtml(question.explanation.tier3Shortcut.shortcut)}</strong></p><p>${escapeHtml(question.explanation.tier3Shortcut.application)}</p></section>
<section class="tier tier-4"><h3>${escapeHtml(question.explanation.tier4Trap.heading)}</h3><p>${escapeHtml(question.explanation.tier4Trap.studentWarning)}</p></section>
<section class="final-answer"><h3>${escapeHtml(finalAnswerHeading(question.locale))}</h3><p>${escapeHtml(question.explanation.finalAnswer)}</p></section>
<section class="diagram"><h3>${escapeHtml(question.explanation.diagramTitle)}</h3>${question.explanation.overlappingVennSvg}<p class="diagram-caption">${escapeHtml(question.explanation.diagramCaption)}</p></section>
<details><summary>Administrator-only structured evidence</summary><pre>${escapeHtml(JSON.stringify(adminMetadata, null, 2))}</pre></details>
</article>`;
}

const outputDir = process.env.SYL_REVIEW_DIR
  ? resolve(process.env.SYL_REVIEW_DIR)
  : resolve(process.cwd(), "artifacts/api-server/dist/reasoning-v1/syl-001-review");
mkdirSync(outputDir, { recursive: true });

const jsonl = questions.map((question) => JSON.stringify(question)).join("\n") + "\n";
writeFileSync(resolve(outputDir, "syl-001-multilingual-review.jsonl"), jsonl, "utf8");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 naturalized multilingual review</title><style>
:root{color-scheme:light}*{box-sizing:border-box}body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:1180px;margin:0 auto;padding:24px;background:#f1f5f9;color:#0f172a}h1{margin-bottom:6px}.lead{color:#475569;margin-top:0}.toolbar{position:sticky;top:0;z-index:5;background:rgba(241,245,249,.96);backdrop-filter:blur(8px);padding:12px 0;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap}.toolbar button{border:1px solid #cbd5e1;background:#fff;padding:8px 12px;border-radius:999px;cursor:pointer;font-weight:700}.toolbar button.active{background:#0f172a;color:#fff}article{background:#fff;border:1px solid #d8dee4;border-radius:16px;padding:22px;margin:0 0 28px;box-shadow:0 4px 18px rgba(15,23,42,.06)}.question-header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.question-header h2{margin:0}.question-header p{margin:6px 0;color:#64748b}.source-meta{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}code{background:#e2e8f0;padding:3px 6px;border-radius:6px;font-size:.85em}.question-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px}.question-card pre{white-space:pre-wrap;margin:0 0 14px;font:inherit;line-height:1.55}.options{list-style:none;padding:0;margin:0;display:grid;gap:8px}.option{display:flex;gap:10px;align-items:center;border:1px solid #e2e8f0;background:#fff;border-radius:10px;padding:10px 12px}.option.correct{border-color:#16a34a;background:#f0fdf4}.option-number{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#e2e8f0;font-weight:800}.answer-badge{margin-left:auto;background:#16a34a;color:#fff;border-radius:999px;padding:3px 8px;font-size:.78rem;font-weight:800}.tier{border-left:5px solid #94a3b8;padding:14px 16px;margin-top:16px;border-radius:8px;background:#fff}.tier h3{margin:0 0 10px}.tier-1{border-color:#2563eb;background:#eff6ff}.tier-2{border-color:#7c3aed;background:#faf5ff}.tier-3{border-color:#d97706;background:#fffbeb}.tier-4{border-color:#dc2626;background:#fef2f2}.core-rule{font-weight:700}.premise-breakdown,.conclusion-analysis{padding-left:22px}.premise-breakdown li,.conclusion-analysis li{margin:12px 0}.premise-breakdown div{margin:5px 0}.conclusion-step{padding:10px 12px;background:#fff;border-radius:10px;border:1px solid #e2e8f0}.conclusion-line{display:flex;gap:12px;justify-content:space-between;align-items:flex-start}.verdict{font-size:.82rem;font-weight:800;border-radius:999px;padding:4px 8px;background:#e2e8f0;white-space:nowrap}.conclusion-step.definitely_follows .verdict{background:#dcfce7;color:#166534}.conclusion-step.impossible .verdict{background:#fee2e2;color:#991b1b}.conclusion-step.possibility_only .verdict{background:#fef3c7;color:#92400e}.conclusion-step p{margin:8px 0 0;line-height:1.5}.combination-summary{font-weight:800}.final-answer{border:2px solid #16a34a;background:#f0fdf4;border-radius:12px;padding:14px 16px;margin-top:16px}.final-answer h3,.final-answer p{margin:0}.final-answer p{font-size:1.08rem;font-weight:800;margin-top:6px}.diagram{margin-top:18px}.diagram svg{max-width:100%;height:auto;display:block}.diagram-caption{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;color:#334155}details{margin-top:18px}details pre{white-space:pre-wrap;overflow:auto;background:#0f172a;color:#e2e8f0;padding:14px;border-radius:8px;font-size:.82rem}@media(max-width:720px){body{padding:12px}.question-header,.conclusion-line{display:block}.source-meta{justify-content:flex-start}.verdict{display:inline-block;margin-top:6px}}
</style></head><body><h1>SYL-001 Naturalized Multilingual Review</h1><p class="lead">${questions.length} review questions with four-tier teacher explanations and relation-accurate overlapping Venn diagrams.</p><div class="toolbar"><button class="active" data-filter="all">All</button><button data-filter="en-IN">English</button><button data-filter="hi-IN">Hindi</button><button data-filter="pa-IN">Punjabi</button></div>${questions.map(renderQuestion).join("\n")}<script>document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(item=>item.classList.remove('active'));button.classList.add('active');const filter=button.dataset.filter;document.querySelectorAll('article[data-locale]').forEach(article=>{article.hidden=filter!=='all'&&article.dataset.locale!==filter;});}));</script></body></html>`;
writeFileSync(resolve(outputDir, "syl-001-multilingual-review.html"), html, "utf8");

const summary = {
  authority: "SYL_001_MULTILINGUAL_REVIEW_RUNTIME_V2",
  status: "PEDAGOGY_REMODELED_MULTILINGUAL_REVIEW_RUNTIME",
  explanationSchema: "syl-pedagogy-v2",
  qlCount: SYL_QL_REGISTRY.length,
  checkpointCount: 7,
  localeCount: locales.length,
  seedsPerQlLocale: seeds.length,
  questionCount: questions.length,
  qlIds: SYL_QL_REGISTRY.map((entry) => entry.qlId),
  deliveryLocks: {
    questionStudioVisible: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
};
writeFileSync(resolve(outputDir, "summary.json"), JSON.stringify(summary, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ ...summary, outputDir }, null, 2));
