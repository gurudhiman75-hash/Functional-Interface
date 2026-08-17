import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import {
  buildBankingModalCandidateReviewOverlayV3,
  type BankingModalCandidateReviewBindingV3,
} from "./banking-modal-candidate-review-overlay-v3";

const plannerSeed = 731;
const requestedSlots = 100;
const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const outDir = resolve(process.cwd(), "dist/reasoning-v1/syl-001-bank-modal-candidate-review-v3");
mkdirSync(outDir, { recursive: true });

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

const records = locales.flatMap((locale) =>
  buildBankingModalCandidateReviewOverlayV3(plannerSeed, requestedSlots, locale));

const localeCounts: Record<string, number> = {};
const kindCounts: Record<string, number> = {};
const authorityCounts: Record<string, number> = {};
const geometrySources: Record<string, number> = {};
const diagramSchemas: Record<string, number> = {};
let diagrams = 0;
let duplicateClassTokens = 0;

for (const binding of records) {
  increment(localeCounts, binding.locale);
  increment(kindCounts, binding.candidateKind);
  increment(authorityCounts, binding.candidateAuthority);
  increment(geometrySources, binding.question.diagram.geometrySource);
  increment(diagramSchemas, binding.question.diagram.schemaVersion);
  if (!binding.question.diagram.enabled || binding.question.diagram.diagramCount !== 1) {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: review pack requires one diagram.`);
  }
  const text = binding.question.explanation.join("\n");
  duplicateClassTokens += (text.match(/वर्ग वर्ग/gu) ?? []).length;
  duplicateClassTokens += (text.match(/ਵਰਗ ਵਰਗ/gu) ?? []).length;
  diagrams += 1;
}

if (duplicateClassTokens !== 0) throw new Error("Localized duplicate class token remains in review V3.");

const summary = {
  status: "HUMAN_REVIEW_REQUIRED_BANKING_MODAL_CANDIDATE_PACK_V3",
  authority: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V3",
  plannerAuthority: "SYL_001_PROFILE_PLAN_V3",
  plannerSeed,
  requestedSlots,
  logicalCandidateSlots: 20,
  localizedRecords: records.length,
  localeCounts,
  kindCounts,
  authorityCounts,
  diagrams,
  geometrySources,
  diagramSchemas,
  duplicateClassTokens,
  ordinaryEditorialAuthority: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4",
  canNeverEditorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5",
  sourceFrequencyClaim: false,
  emittedQlIds: 0,
  connectedToProductionGenerator: false,
  questionStudioVisible: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  humanEditorialStatus: "PENDING",
  humanLocalizationStatus: "PENDING",
  humanExamAuthenticityStatus: "PENDING",
  humanDiagramStatus: "PENDING",
  activationPermitted: false,
};

function card(binding: BankingModalCandidateReviewBindingV3): string {
  const question = binding.question;
  const answer = question.options[question.correctIndex]?.text ?? question.semanticAnswer;
  const semanticAuthority = "semanticAuthority" in question ? question.semanticAuthority : question.authority;
  return `<article class="card" lang="${esc(binding.locale)}">
<header><div><strong>Planner slot ${binding.plannerSlotIndex} · ${esc(binding.candidateKind)}</strong><br><span>${esc(binding.locale)} · candidate seed ${binding.candidateSeed}</span></div><div class="right">${esc(question.scenarioId)}<br>${esc(question.semanticAnswer)}</div></header>
<p class="authority">Editorial: ${esc(binding.candidateAuthority)} · Semantic: ${esc(semanticAuthority)} · canonical QL: none · review only</p>
<section><h3>Statements</h3><ol>${question.statements.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ol></section>
<section><h3>Conclusions</h3><ol class="roman">${question.conclusions.map((entry) => `<li>${esc(entry.text)}</li>`).join("")}</ol></section>
<section><h3>Options</h3><ol type="A">${question.options.map((entry) => `<li class="${entry.isCorrect ? "correct" : ""}">${esc(entry.text)}</li>`).join("")}</ol><p><b>Correct answer:</b> ${esc(answer)}</p></section>
<section class="diagram"><h3>One combined premise diagram — shown after attempt</h3><div class="svg-wrap">${question.diagram.svg}</div><p class="caption">${esc(question.diagram.caption ?? "")}</p><p class="meta">${esc(question.diagram.geometrySource)} · ${esc(question.diagram.schemaVersion)}</p></section>
<section><h3>Learner explanation</h3>${question.explanation.map((entry) => `<p>${esc(entry)}</p>`).join("")}</section>
</article>`;
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 Banking Modal Candidate Human Review V3</title><style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:18px}main{max-width:1040px;margin:auto}.notice,.card{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:16px;margin:0 0 18px}.notice{border-left:5px solid #d97706}.card header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid #e2e8f0;padding-bottom:10px}.right{text-align:right}.authority,.caption,.meta{font-size:.9rem;color:#475569}.roman{list-style-type:upper-roman}.correct{font-weight:800}.svg-wrap{max-width:560px;margin:10px auto}.svg-wrap svg{width:100%;height:auto;display:block}.meta{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}p,li{line-height:1.5}h1{margin-top:0}@media(max-width:700px){body{padding:8px}.card{padding:12px}.right{text-align:left}}</style></head><body><main><h1>SYL-001 Banking Modal Candidate — Human Review V3</h1><div class="notice"><b>Human review required; not an activation artifact.</b> These are the exact 20 inactive Banking planner slots in English, Hindi and Punjabi. Ordinary possibility uses localized Editorial V4; can-never uses polished Editorial V5. The 10/10 split is evaluation coverage, not an exam-frequency claim. No permanent QL is created and all delivery surfaces remain locked.</div>${records.map(card).join("\n")}</main></body></html>`;

const markdown = [
  "# SYL-001 Banking Modal Candidate — Human Review V3",
  "",
  "> Exact inactive Banking planner candidates. Review only; no QL registration, production connection or activation.",
  "",
  ...records.flatMap((binding) => {
    const question = binding.question;
    return [
      `## Planner slot ${binding.plannerSlotIndex} — ${binding.candidateKind} — ${binding.locale}`,
      "",
      `- Editorial authority: ${binding.candidateAuthority}`,
      `- Candidate seed: ${binding.candidateSeed}`,
      `- Scenario: ${question.scenarioId}`,
      "- Canonical QL: none",
      "",
      "### Statements",
      ...question.statements.map((entry, index) => `${index + 1}. ${entry}`),
      "",
      "### Conclusions",
      ...question.conclusions.map((entry, index) => `${index === 0 ? "I" : "II"}. ${entry.text}`),
      "",
      "### Options",
      ...question.options.map((entry, index) => `${String.fromCharCode(65 + index)}. ${entry.text}${entry.isCorrect ? " **✓**" : ""}`),
      "",
      `**Correct answer:** ${question.options[question.correctIndex]?.text ?? question.semanticAnswer}`,
      "",
      `**Combined premise diagram:** ${question.diagram.geometrySource} · ${question.diagram.schemaVersion}`,
      "",
      "### Learner explanation",
      ...question.explanation.map((entry) => `- ${entry}`),
      "",
    ];
  }),
].join("\n");

writeFileSync(resolve(outDir, "SYL-001-BANKING-MODAL-CANDIDATE-HUMAN-REVIEW-V3.html"), html, "utf8");
writeFileSync(resolve(outDir, "SYL-001-BANKING-MODAL-CANDIDATE-HUMAN-REVIEW-V3.md"), markdown, "utf8");
writeFileSync(resolve(outDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...summary, outputDir: outDir }, null, 2));
