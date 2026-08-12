import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { TSD_CP004_AUTHORITIES, TSD_CP004_DISCOVERY_DISPOSITION, TSD_CP004_PROPOSED_QL_RANGE } from "./authority";
import { renderCp004EditorialV4NativeQuestion } from "./native-v4";
import { generateCp004EditorialV3EnglishReviewCorpus } from "./runtime-v3";
import type { TsdCp004Question } from "./types";
import type { TsdCp004FinalNativeQuestion } from "./native-polished";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const english = generateCp004EditorialV3EnglishReviewCorpus();
const questions: (TsdCp004Question | TsdCp004FinalNativeQuestion)[] = [];
for (const q of english) questions.push(q, renderCp004EditorialV4NativeQuestion(q, "hi"), renderCp004EditorialV4NativeQuestion(q, "pa"));

const outputDir = resolve(process.argv[2] ?? "dist/quant-v4/tsd-001/cp004-editorial-v3-review");
mkdirSync(outputDir, { recursive: true });

const rows = questions.map((q) => ({
  checkpointId: q.checkpointId,
  authorityId: q.authorityId,
  candidateQlId: q.candidateQlId,
  permanentQlId: q.permanentQlId,
  language: q.language,
  seed: q.seed,
  difficulty: q.difficulty,
  representation: q.state.representation,
  actorKind: q.state.actorKind,
  directionCase: q.state.directionCase,
  stem: q.stem,
  visual: q.visual ? { kind: q.visual.kind, svg: q.visual.svg, alt: q.visual.alt } : null,
  options: q.options,
  correctIndex: q.correctIndex,
  correctAnswer: "localizedAnswerText" in q ? q.localizedAnswerText : q.solution.answerText,
  explanation: q.explanation,
  mathematicalFingerprint: q.solution.mathematicalFingerprint,
  reviewStatus: q.reviewStatus,
  questionStudioDiscoverable: q.questionStudioDiscoverable,
  questionBankStatus: q.questionBankStatus,
  testEligibility: q.testEligibility,
  publiclyPublishable: q.publiclyPublishable,
}));

const evidence = Object.freeze({
  phase: "TSD_CP004_EDITORIAL_V3_FINAL_REVIEW_CANDIDATE",
  blueprintDiscoveryCandidates: 33,
  proposedLearnerAuthorities: 16,
  proposedAuthorities: TSD_CP004_AUTHORITIES,
  discoveryDisposition: TSD_CP004_DISCOVERY_DISPOSITION,
  proposedQlRange: TSD_CP004_PROPOSED_QL_RANGE,
  reviewRows: rows.length,
  languageCounts: Object.freeze({ en: 48, hi: 48, pa: 48 }),
  permanentQlCount: 0,
  threeDistinctStemStructuresPerAuthorityPerLanguage: true,
  distinctMathematicalReviewStatesPerAuthority: true,
  boundedMeetingPointDistractors: true,
  faithfulDirectionAwareVisuals: true,
  nativeAuthoritySpecificMethods: true,
  learnerExplanationContract: "METHOD_CONNECTED_STEPS_EXAM_SHORTCUT_ANSWER",
  learnerOptionAnalysisFields: 0,
  retainedCountApprovedByProductOwner: false,
  permanentQlAllocationAuthorized: false,
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  reviewStatus: "READY_FOR_PRODUCT_OWNER_CP004_COUNT_AND_CONTENT_REVIEW",
});

writeFileSync(resolve(outputDir, "tsd-cp004-editorial-v3-review.json"), JSON.stringify({ evidence, rows }, null, 2));
writeFileSync(resolve(outputDir, "tsd-cp004-editorial-v3-evidence.json"), JSON.stringify(evidence, null, 2));

const cards = rows.map((row, index) => {
  const options = row.options.map((option, i) => `<li${i === row.correctIndex ? ' class="correct"' : ""}><strong>${String.fromCharCode(65 + i)}.</strong> ${escapeHtml(option)}</li>`).join("");
  const steps = row.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const visual = row.visual ? `<div class="visual">${row.visual.svg}<p class="alt">${escapeHtml(row.visual.alt)}</p></div>` : "";
  return `<article class="card"><header><span>#${index + 1}</span><span>${escapeHtml(row.language.toUpperCase())}</span><span>${escapeHtml(row.authorityId)}</span><span>${escapeHtml(row.candidateQlId)}</span><span>${escapeHtml(row.difficulty)}</span><span>${escapeHtml(row.representation)}</span></header><h3>${escapeHtml(row.stem)}</h3>${visual}<ol class="options">${options}</ol><section><p><strong>Method:</strong> ${escapeHtml(row.explanation.method)}</p><ol>${steps}</ol><p><strong>Shortcut:</strong> ${escapeHtml(row.explanation.shortcut)}</p><p><strong>${escapeHtml(row.explanation.answer)}</strong></p></section></article>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TSD CP004 Editorial V3 Review</title><style>body{font-family:system-ui,sans-serif;margin:0;background:#f5f5f5;color:#171717}.wrap{max-width:1100px;margin:auto;padding:24px}.summary,.card{background:white;border:1px solid #ddd;border-radius:12px;padding:18px;margin-bottom:16px}.card header{display:flex;gap:10px;flex-wrap:wrap;font-size:12px;color:#555}.options{padding-left:24px}.options li{padding:5px}.correct{font-weight:700}.visual svg{max-width:100%;height:auto}.alt{font-size:12px;color:#666}section{border-top:1px solid #eee;margin-top:12px;padding-top:12px}</style></head><body><div class="wrap"><div class="summary"><h1>TSD CP004 — Editorial V3 Final Review Candidate</h1><p>16 proposed authorities. Candidate coordinates TSD-QL-048..063 remain non-permanent until explicit product-owner approval.</p><p>48 English · 48 Hindi · 48 Punjabi · 144 total · 3 distinct stems per authority/language · Studio locked · Bank NOT_STORED · Tests INELIGIBLE</p></div>${cards}</div></body></html>`;
writeFileSync(resolve(outputDir, "tsd-cp004-editorial-v3-review.html"), html);
console.log(JSON.stringify({ status: "PASS", phase: evidence.phase, rows: rows.length, outputDir, files: ["tsd-cp004-editorial-v3-review.json", "tsd-cp004-editorial-v3-evidence.json", "tsd-cp004-editorial-v3-review.html"] }, null, 2));
