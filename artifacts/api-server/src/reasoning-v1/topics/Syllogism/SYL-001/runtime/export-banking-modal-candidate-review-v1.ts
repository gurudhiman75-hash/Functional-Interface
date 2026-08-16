import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import {
  buildBankingModalCandidateOverlayV1,
  type BankingModalCandidateBindingV1,
} from "./banking-modal-candidate-overlay-v1";
import type { BankingCanNeverEditorialV4Question } from "./banking-can-never-be-editorial-v4";
import {
  renderBankingPossibilityCombinedDiagramV3,
  type BankingPossibilityCombinedDiagramV3,
} from "./banking-possibility-combined-diagram-v3";
import {
  renderBankingFourTermPremiseVennV4,
  type BankingFourTermDiagramV4,
} from "./banking-possibility-four-term-venn-v4";
import type { BankingPossibilityShellQuestionV1 } from "./banking-possibility-shell-v1";
import type { BankingPossibilityShellQuestionV2 } from "./banking-possibility-shell-v2";

const plannerSeed = 731;
const requestedSlots = 100;
const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const outDir = resolve(process.cwd(), "dist/reasoning-v1/syl-001-bank-modal-candidate-review-v1");
mkdirSync(outDir, { recursive: true });

type ReviewDiagram = BankingPossibilityCombinedDiagramV3 | BankingFourTermDiagramV4;

interface ReviewRecord {
  binding: BankingModalCandidateBindingV1;
  diagram: ReviewDiagram;
  explanation: readonly string[];
  visualPolicy: {
    stemDiagram: "NONE";
    solutionDiagram: "ONE_COMBINED_PREMISE_DIAGRAM";
    disclosure: "AFTER_ATTEMPT";
    separateConclusionDiagrams: false;
  };
}

const VISUAL_POLICY = Object.freeze({
  stemDiagram: "NONE",
  solutionDiagram: "ONE_COMBINED_PREMISE_DIAGRAM",
  disclosure: "AFTER_ATTEMPT",
  separateConclusionDiagrams: false,
} as const);

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

function possibilityV1Carrier(question: BankingPossibilityShellQuestionV2): BankingPossibilityShellQuestionV1 {
  return {
    authority: "SYL_001_BANKING_POSSIBILITY_SHELL_V1",
    prototypeId: "SYL-PROTOTYPE-BANK-POSSIBILITY-001",
    seed: question.seed,
    locale: question.locale,
    scenarioId: question.scenarioId,
    scenarioGroup: question.scenarioGroup,
    sourcePatternId: question.sourcePatternId,
    statements: question.statements,
    conclusions: question.conclusions.map((entry) => ({
      mode: entry.mode,
      canonicalConclusion: entry.canonicalConclusion,
      text: entry.text,
      follows: entry.follows,
      classification: entry.classification,
      canBeTrue: entry.canBeTrue,
      canBeFalse: entry.canBeFalse,
      witnessModelAvailable: entry.witnessModelAvailable,
      counterModelAvailable: entry.counterModelAvailable,
    })),
    options: question.options,
    correctIndex: question.correctIndex,
    semanticAnswer: question.semanticAnswer,
    explanation: question.explanation,
    metadata: {
      answerTemplateId: "BANK_FIVE_OPTION_V1",
      renderer: "CONCLUSION_COMBINATION",
      possibilityConclusionCount: 1,
      definiteConclusionCount: 1,
      legacyQlChanged: false,
      registeredQlCreated: false,
      connectedToProfilePlanner: false,
      questionStudioVisible: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

function ordinaryPossibilityDiagram(question: BankingPossibilityShellQuestionV2): ReviewDiagram {
  const carrier = possibilityV1Carrier(question);
  const primary = renderBankingPossibilityCombinedDiagramV3(carrier);
  if (primary.enabled) return primary;
  if (question.scenarioId === "SYL-SC-CORE-009") return renderBankingFourTermPremiseVennV4(carrier);
  throw new Error(`${question.seed}/${question.locale}/${question.scenarioId}: ordinary possibility review diagram omitted.`);
}

function reviewRecord(binding: BankingModalCandidateBindingV1): ReviewRecord {
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

  if (binding.candidateKind === "ORDINARY_POSSIBILITY") {
    const question = binding.question as BankingPossibilityShellQuestionV2;
    if (binding.candidateAuthority !== "SYL_001_BANKING_POSSIBILITY_SHELL_V2") {
      throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: ordinary candidate authority mismatch.`);
    }
    return {
      binding,
      diagram: ordinaryPossibilityDiagram(question),
      explanation: question.explanation,
      visualPolicy: VISUAL_POLICY,
    };
  }

  const question = binding.question as BankingCanNeverEditorialV4Question;
  if (binding.candidateAuthority !== "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4") {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: can-never candidate authority mismatch.`);
  }
  if (
    question.visualPolicy.stemDiagram !== "NONE"
    || question.visualPolicy.solutionDiagram !== "ONE_COMBINED_PREMISE_DIAGRAM"
    || question.visualPolicy.disclosure !== "AFTER_ATTEMPT"
    || question.visualPolicy.separateConclusionDiagrams
  ) {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: can-never V4 visual policy drift.`);
  }
  return {
    binding,
    diagram: question.diagram,
    explanation: question.explanation,
    visualPolicy: VISUAL_POLICY,
  };
}

const records: ReviewRecord[] = locales.flatMap((locale) =>
  buildBankingModalCandidateOverlayV1(plannerSeed, requestedSlots, locale).map(reviewRecord));

const localeCounts: Record<string, number> = {};
const candidateKindCounts: Record<string, number> = {};
const authorityCounts: Record<string, number> = {};
const semanticStatuses: Record<string, number> = {};
const diagramSchemas: Record<string, number> = {};
const geometrySources: Record<string, number> = {};
let ordinaryPossibilityRecords = 0;
let canNeverRecords = 0;
let diagramCount = 0;
let omittedDiagrams = 0;
let emittedQlIds = 0;

for (const record of records) {
  const { binding, diagram } = record;
  increment(localeCounts, binding.locale);
  increment(candidateKindCounts, binding.candidateKind);
  increment(authorityCounts, binding.candidateAuthority);
  increment(semanticStatuses, binding.question.semanticAnswer);
  increment(diagramSchemas, diagram.schemaVersion);
  increment(geometrySources, diagram.geometrySource);
  if (binding.candidateKind === "ORDINARY_POSSIBILITY") ordinaryPossibilityRecords += 1;
  else canNeverRecords += 1;
  if (binding.canonicalQlId !== null) emittedQlIds += 1;
  if (!diagram.enabled || !diagram.svg || diagram.diagramCount !== 1) omittedDiagrams += 1;
  else diagramCount += 1;
  if (!diagram.premiseOnly || diagram.mobileViewBoxWidth !== 340) {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: diagram must remain premise-only at mobile width 340.`);
  }
  if (!diagram.svg?.includes('data-premise-only="true"')) {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: exported SVG is missing premise-only marker.`);
  }
  if (record.explanation.length !== 2) {
    throw new Error(`${binding.plannerSlotIndex}/${binding.locale}: expected two learner explanation lines.`);
  }
}

if (records.length !== 60) throw new Error(`Expected 60 localized candidate records, received ${records.length}.`);
if (ordinaryPossibilityRecords !== 30 || canNeverRecords !== 30) {
  throw new Error(`Expected 30 ordinary possibility and 30 can-never localized records.`);
}
if (Object.values(localeCounts).some((count) => count !== 20) || Object.keys(localeCounts).length !== 3) {
  throw new Error(`Expected 20 candidate records per locale.`);
}
if (diagramCount !== records.length || omittedDiagrams !== 0) {
  throw new Error(`Every human-review record must have exactly one combined premise diagram.`);
}
if (emittedQlIds !== 0) throw new Error(`Human-review pack must emit zero canonical QL IDs.`);

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
  semanticStatuses,
  diagrams: diagramCount,
  omittedDiagrams,
  diagramSchemas,
  geometrySources,
  diagramPolicy: "ONE_COMBINED_PREMISE_DIAGRAM_AFTER_ATTEMPT_FOR_HUMAN_REVIEW_V1",
  separateConclusionDiagrams: false,
  emittedQlIds,
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

function card(record: ReviewRecord): string {
  const { binding, diagram } = record;
  const question = binding.question;
  const answer = question.options[question.correctIndex]?.text ?? question.semanticAnswer;
  return `<article class="card" lang="${esc(binding.locale)}">
<header><div><strong>Planner slot ${binding.plannerSlotIndex} · ${esc(binding.candidateKind)}</strong><br><span>${esc(binding.locale)} · candidate seed ${binding.candidateSeed}</span></div><div class="right">${esc(question.scenarioId)}<br>${esc(question.semanticAnswer)}</div></header>
<p class="authority">${esc(binding.candidateAuthority)} · canonical QL: none · review only</p>
<section><h3>Statements</h3><ol>${question.statements.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ol></section>
<section><h3>Conclusions</h3><ol class="roman">${question.conclusions.map((entry) => `<li>${esc(entry.text)}</li>`).join("")}</ol></section>
<section><h3>Options</h3><ol type="A">${question.options.map((entry) => `<li class="${entry.isCorrect ? "correct" : ""}">${esc(entry.text)}</li>`).join("")}</ol><p><b>Correct answer:</b> ${esc(answer)}</p></section>
<section class="diagram"><h3>One combined premise diagram — shown after attempt</h3><div class="svg-wrap">${diagram.svg ?? ""}</div><p class="caption">${esc(diagram.caption ?? "")}</p><p class="meta">${esc(diagram.geometrySource)} · ${esc(diagram.schemaVersion)}</p></section>
<section><h3>Learner explanation</h3>${record.explanation.map((entry) => `<p>${esc(entry)}</p>`).join("")}</section>
</article>`;
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 Banking Modal Candidate Human Review V1</title><style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:18px}main{max-width:1040px;margin:auto}.notice,.card{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:16px;margin:0 0 18px}.notice{border-left:5px solid #d97706}.card header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid #e2e8f0;padding-bottom:10px}.right{text-align:right}.authority,.caption,.meta{font-size:.9rem;color:#475569}.roman{list-style-type:upper-roman}.correct{font-weight:800}.svg-wrap{max-width:560px;margin:10px auto}.svg-wrap svg{width:100%;height:auto;display:block}.meta{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}p,li{line-height:1.5}h1{margin-top:0}@media(max-width:700px){body{padding:8px}.card{padding:12px}.right{text-align:left}}</style></head><body><main><h1>SYL-001 Banking Modal Candidate — Human Review V1</h1><div class="notice"><b>Human review required; not an activation artifact.</b> This pack shows the exact inactive Banking planner candidate slots in English, Hindi and Punjabi. Each solution uses one premise-only combined diagram after the attempt. The 10/10 family split is evaluation coverage, not a source-frequency claim. No permanent QL is created and all delivery surfaces remain locked.</div>${records.map(card).join("\n")}</main></body></html>`;

const markdown = [
  "# SYL-001 Banking Modal Candidate — Human Review V1",
  "",
  "> Human review required. Exact inactive Banking planner candidates only; no QL registration, production connection or activation. The 10/10 family split is evaluation coverage, not an exam-frequency claim.",
  "",
  ...records.flatMap((record) => {
    const { binding, diagram } = record;
    const question = binding.question;
    return [
      `## Planner slot ${binding.plannerSlotIndex} — ${binding.candidateKind} — ${binding.locale}`,
      "",
      `- Candidate authority: ${binding.candidateAuthority}`,
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
      ...record.explanation.map((entry) => `- ${entry}`),
      "",
    ];
  }),
].join("\n");

writeFileSync(resolve(outDir, "SYL-001-BANKING-MODAL-CANDIDATE-HUMAN-REVIEW-V1.html"), html, "utf8");
writeFileSync(resolve(outDir, "SYL-001-BANKING-MODAL-CANDIDATE-HUMAN-REVIEW-V1.md"), markdown, "utf8");
writeFileSync(resolve(outDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...summary, outputDir: outDir }, null, 2));
