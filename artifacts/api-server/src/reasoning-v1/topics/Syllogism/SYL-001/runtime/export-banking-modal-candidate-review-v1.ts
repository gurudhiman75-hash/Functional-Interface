import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import {
  buildBankingModalCandidateOverlayV1,
  type BankingModalCandidateBindingV1,
} from "./banking-modal-candidate-overlay-v1";

const plannerSeed = 731;
const requestedSlots = 100;
const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const outDir = resolve(process.cwd(), "dist/reasoning-v1/syl-001-bank-modal-candidate-review-v1");
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

function assertReviewBinding(binding: BankingModalCandidateBindingV1): void {
  const question = binding.question;
  if (binding.canonicalQlId !== null) {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: review candidate must not have a canonical QL ID.`);
  }
  if (
    binding.policy.registeredQlCreated
    || binding.policy.connectedToProductionGenerator
    || binding.policy.questionStudioVisible
    || binding.policy.questionBankWritable
    || binding.policy.testEligible
    || binding.policy.publiclyPublishable
    || binding.policy.sourceFrequencyClaim
    || binding.policy.activationPermitted
  ) {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: inactive review lock unexpectedly opened.`);
  }
  if (
    question.visualPolicy.stemDiagram !== "NONE"
    || question.visualPolicy.solutionDiagram !== "ONE_COMBINED_PREMISE_DIAGRAM"
    || question.visualPolicy.disclosure !== "AFTER_ATTEMPT"
    || question.visualPolicy.separateConclusionDiagrams
  ) {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: candidate visual policy drift.`);
  }
  if (
    !question.diagram.enabled
    || !question.diagram.svg
    || question.diagram.diagramCount !== 1
    || !question.diagram.premiseOnly
    || question.diagram.mobileViewBoxWidth !== 340
    || !question.diagram.svg.includes('data-premise-only="true"')
  ) {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: candidate must own one mobile-safe premise-only diagram.`);
  }
  if (question.explanation.length !== 2) {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: expected two learner explanation lines.`);
  }
  if (
    binding.locale !== "en-IN"
    && question.explanation.some((line) => line.includes("Banking possibility convention"))
  ) {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: mixed-language convention phrase leaked into learner explanation.`);
  }
  if (binding.candidateKind === "ORDINARY_POSSIBILITY") {
    if (binding.candidateAuthority !== "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3") {
      throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: ordinary editorial authority mismatch.`);
    }
    if (question.editorialAuthority !== "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3") {
      throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: ordinary question editorial authority mismatch.`);
    }
    if (question.semanticAuthority !== "SYL_001_BANKING_POSSIBILITY_SHELL_V2") {
      throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: ordinary semantic authority mismatch.`);
    }
  } else if (binding.candidateAuthority !== "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4") {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: can-never editorial authority mismatch.`);
  }
}

const records = locales.flatMap((locale) =>
  buildBankingModalCandidateOverlayV1(plannerSeed, requestedSlots, locale));
records.forEach(assertReviewBinding);

const localeCounts: Record<string, number> = {};
const candidateKindCounts: Record<string, number> = {};
const authorityCounts: Record<string, number> = {};
const semanticAuthorityCounts: Record<string, number> = {};
const semanticStatuses: Record<string, number> = {};
const diagramSchemas: Record<string, number> = {};
const geometrySources: Record<string, number> = {};
let diagramCount = 0;
let omittedDiagrams = 0;
let emittedQlIds = 0;
let nonEnglishConventionLeaks = 0;
let genericOrdinaryExplanationLines = 0;

for (const binding of records) {
  const question = binding.question;
  const diagram = question.diagram;
  increment(localeCounts, binding.locale);
  increment(candidateKindCounts, binding.candidateKind);
  increment(authorityCounts, binding.candidateAuthority);
  increment(semanticStatuses, question.semanticAnswer);
  increment(diagramSchemas, diagram.schemaVersion);
  increment(geometrySources, diagram.geometrySource);
  if ("semanticAuthority" in question) increment(semanticAuthorityCounts, question.semanticAuthority);
  if (binding.canonicalQlId !== null) emittedQlIds += 1;
  if (!diagram.enabled || !diagram.svg || diagram.diagramCount !== 1) omittedDiagrams += 1;
  else diagramCount += 1;
  if (
    binding.locale !== "en-IN"
    && question.explanation.some((line) => line.includes("Banking possibility convention"))
  ) nonEnglishConventionLeaks += 1;
  if (
    binding.candidateKind === "ORDINARY_POSSIBILITY"
    && binding.locale === "en-IN"
  ) {
    genericOrdinaryExplanationLines += question.explanation.filter((line) =>
      /The relation is|The ordinary conclusion/u.test(line)).length;
  }
}

if (records.length !== 60) throw new Error(`Expected 60 localized candidate records, received ${records.length}.`);
if (candidateKindCounts.ORDINARY_POSSIBILITY !== 30 || candidateKindCounts.CAN_NEVER !== 30) {
  throw new Error(`Expected 30 ordinary possibility and 30 can-never localized records.`);
}
if (Object.values(localeCounts).some((count) => count !== 20) || Object.keys(localeCounts).length !== 3) {
  throw new Error(`Expected 20 candidate records per locale.`);
}
if (diagramCount !== records.length || omittedDiagrams !== 0) {
  throw new Error(`Every human-review record must have exactly one combined premise diagram.`);
}
if (emittedQlIds !== 0) throw new Error(`Human-review pack must emit zero canonical QL IDs.`);
if (nonEnglishConventionLeaks !== 0) throw new Error(`Non-English explanations must not leak the English convention phrase.`);
if (genericOrdinaryExplanationLines !== 0) throw new Error(`Ordinary possibility explanations must remain term-specific.`);

const summary = {
  status: "HUMAN_REVIEW_REQUIRED_BANKING_MODAL_CANDIDATE_PACK_V1",
  authority: "SYL_001_BANKING_MODAL_CANDIDATE_OVERLAY_V1",
  plannerAuthority: "SYL_001_PROFILE_PLAN_V3",
  plannerSeed,
  requestedSlots,
  localizedRecords: records.length,
  logicalCandidateSlots: 20,
  localeCounts,
  candidateKindCounts,
  authorityCounts,
  semanticAuthorityCounts,
  semanticStatuses,
  diagrams: diagramCount,
  omittedDiagrams,
  diagramSchemas,
  geometrySources,
  diagramPolicy: "ONE_COMBINED_PREMISE_DIAGRAM_AFTER_ATTEMPT_FOR_HUMAN_REVIEW_V1",
  separateConclusionDiagrams: false,
  emittedQlIds,
  nonEnglishConventionLeaks,
  genericOrdinaryExplanationLines,
  sourceFrequencyClaim: false,
  humanEditorialStatus: "PENDING",
  humanLocalizationStatus: "PENDING",
  humanExamAuthenticityStatus: "PENDING",
  humanDiagramStatus: "PENDING",
  exactWeightingFrozen: false,
  connectedToProductionGenerator: false,
  questionStudioVisible: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  activationPermitted: false,
};

function card(binding: BankingModalCandidateBindingV1): string {
  const question = binding.question;
  const diagram = question.diagram;
  const answer = question.options[question.correctIndex]?.text ?? question.semanticAnswer;
  const semanticAuthority = "semanticAuthority" in question ? question.semanticAuthority : question.authority;
  return `<article class="card" lang="${esc(binding.locale)}">
<header><div><strong>Planner slot ${binding.plannerSlotIndex} · ${esc(binding.candidateKind)}</strong><br><span>${esc(binding.locale)} · candidate seed ${binding.candidateSeed}</span></div><div class="right">${esc(question.scenarioId)}<br>${esc(question.semanticAnswer)}</div></header>
<p class="authority">Editorial: ${esc(binding.candidateAuthority)} · Semantic: ${esc(semanticAuthority)} · canonical QL: none · review only</p>
<section><h3>Statements</h3><ol>${question.statements.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ol></section>
<section><h3>Conclusions</h3><ol class="roman">${question.conclusions.map((entry) => `<li>${esc(entry.text)}</li>`).join("")}</ol></section>
<section><h3>Options</h3><ol type="A">${question.options.map((entry) => `<li class="${entry.isCorrect ? "correct" : ""}">${esc(entry.text)}</li>`).join("")}</ol><p><b>Correct answer:</b> ${esc(answer)}</p></section>
<section class="diagram"><h3>One combined premise diagram — shown after attempt</h3><div class="svg-wrap">${diagram.svg}</div><p class="caption">${esc(diagram.caption ?? "")}</p><p class="meta">${esc(diagram.geometrySource)} · ${esc(diagram.schemaVersion)}</p></section>
<section><h3>Learner explanation</h3>${question.explanation.map((entry) => `<p>${esc(entry)}</p>`).join("")}</section>
</article>`;
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 Banking Modal Candidate Human Review V1</title><style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:18px}main{max-width:1040px;margin:auto}.notice,.card{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:16px;margin:0 0 18px}.notice{border-left:5px solid #d97706}.card header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid #e2e8f0;padding-bottom:10px}.right{text-align:right}.authority,.caption,.meta{font-size:.9rem;color:#475569}.roman{list-style-type:upper-roman}.correct{font-weight:800}.svg-wrap{max-width:560px;margin:10px auto}.svg-wrap svg{width:100%;height:auto;display:block}.meta{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}p,li{line-height:1.5}h1{margin-top:0}@media(max-width:700px){body{padding:8px}.card{padding:12px}.right{text-align:left}}</style></head><body><main><h1>SYL-001 Banking Modal Candidate — Human Review V1</h1><div class="notice"><b>Human review required; not an activation artifact.</b> This pack shows the exact inactive Banking planner candidate slots in English, Hindi and Punjabi. Both modal families use their learner/editorial authority while retaining separate semantic authority. Each solution owns one premise-only combined diagram after the attempt. The 10/10 family split is evaluation coverage, not a source-frequency claim. No permanent QL is created and all delivery surfaces remain locked.</div>${records.map(card).join("\n")}</main></body></html>`;

const markdown = [
  "# SYL-001 Banking Modal Candidate — Human Review V1",
  "",
  "> Human review required. Exact inactive Banking planner candidates only; no QL registration, production connection or activation. The 10/10 family split is evaluation coverage, not an exam-frequency claim.",
  "",
  ...records.flatMap((binding) => {
    const question = binding.question;
    const diagram = question.diagram;
    const semanticAuthority = "semanticAuthority" in question ? question.semanticAuthority : question.authority;
    return [
      `## Planner slot ${binding.plannerSlotIndex} — ${binding.candidateKind} — ${binding.locale}`,
      "",
      `- Editorial authority: ${binding.candidateAuthority}`,
      `- Semantic authority: ${semanticAuthority}`,
      `- Candidate seed: ${binding.candidateSeed}`,
      `- Scenario: ${question.scenarioId}`,
      `- Canonical QL: none`,
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
      `**Combined premise diagram:** ${diagram.geometrySource} · ${diagram.schemaVersion} · one diagram after attempt`,
      "",
      "### Learner explanation",
      ...question.explanation.map((entry) => `- ${entry}`),
      "",
    ];
  }),
].join("\n");

writeFileSync(resolve(outDir, "SYL-001-BANKING-MODAL-CANDIDATE-HUMAN-REVIEW-V1.html"), html, "utf8");
writeFileSync(resolve(outDir, "SYL-001-BANKING-MODAL-CANDIDATE-HUMAN-REVIEW-V1.md"), markdown, "utf8");
writeFileSync(resolve(outDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...summary, outputDir: outDir }, null, 2));