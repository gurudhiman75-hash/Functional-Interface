import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { TSD_CP004_AUTHORITIES, TSD_CP004_DISCOVERY_DISPOSITION, TSD_CP004_PROPOSED_QL_RANGE } from "./authority";
import { generateCp004MultilingualReviewCorpus, type TsdCp004NativeQuestion } from "./native";
import type { TsdCp004Question } from "./types";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const questions = generateCp004MultilingualReviewCorpus();
const outputDir = resolve(process.argv[2] ?? "dist/quant-v4/tsd-001/cp004-review");
mkdirSync(outputDir, { recursive: true });

type AnyReviewQuestion = TsdCp004Question | TsdCp004NativeQuestion;

const rows = questions.map((question: AnyReviewQuestion) => ({
  checkpointId: question.checkpointId,
  authorityId: question.authorityId,
  candidateQlId: question.candidateQlId,
  permanentQlId: question.permanentQlId,
  language: question.language,
  seed: question.seed,
  difficulty: question.difficulty,
  representation: question.state.representation,
  actorKind: question.state.actorKind,
  directionCase: question.state.directionCase,
  stem: question.stem,
  visual: question.visual ? { kind: question.visual.kind, svg: question.visual.svg, alt: question.visual.alt } : null,
  options: question.options,
  correctIndex: question.correctIndex,
  correctAnswer: "localizedAnswerText" in question ? question.localizedAnswerText : question.solution.answerText,
  explanation: question.explanation,
  mathematicalFingerprint: question.solution.mathematicalFingerprint,
  reviewStatus: question.reviewStatus,
  questionStudioDiscoverable: question.questionStudioDiscoverable,
  questionBankStatus: question.questionBankStatus,
  testEligibility: question.testEligibility,
  publiclyPublishable: question.publiclyPublishable,
}));

const evidence = {
  phase: "TSD_CP004_STRAIGHT_LINE_RELATIVE_MOTION_REVIEW_CANDIDATE",
  blueprintDiscoveryCandidates: 33,
  proposedAuthorities: TSD_CP004_AUTHORITIES,
  discoveryDisposition: TSD_CP004_DISCOVERY_DISPOSITION,
  proposedQlRange: TSD_CP004_PROPOSED_QL_RANGE,
  reviewRows: rows.length,
  languageCounts: {
    en: rows.filter((r) => r.language === "en").length,
    hi: rows.filter((r) => r.language === "hi").length,
    pa: rows.filter((r) => r.language === "pa").length,
  },
  permanentQlCount: 0,
  approvalRequired: true,
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  reviewStatus: "READY_FOR_PRODUCT_OWNER_CP004_COUNT_AND_CONTENT_REVIEW",
};

writeFileSync(resolve(outputDir, "tsd-cp004-review.json"), JSON.stringify({ evidence, rows }, null, 2));
writeFileSync(resolve(outputDir, "tsd-cp004-evidence.json"), JSON.stringify(evidence, null, 2));

const cards = rows.map((row, index) => {
  const options = row.options.map((option, i) => `<li${i === row.correctIndex ? ' class="correct"' : ""}><strong>${String.fromCharCode(65 + i)}.</strong> ${escapeHtml(option)}</li>`).join("");
  const steps = row.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const visual = row.visual ? `<div class="visual">${row.visual.svg}<div class="alt">${escapeHtml(row.visual.alt)}</div></div>` : "";
  return `<article class="card"><header><span>#${index + 1}</span><span>${escapeHtml(row.language.toUpperCase())}</span><span>${escapeHtml(row.authorityId)}</span><span>${escapeHtml(row.candidateQlId)}</span><span>${escapeHtml(row.difficulty)}</span></header><h3>${escapeHtml(row.stem)}</h3>${visual}<ol class="options">${options}</ol><section class="explanation"><p><strong>Method:</strong> ${escapeHtml(row.explanation.method)}</p><ol>${steps}</ol><p><strong>Shortcut:</strong> ${escapeHtml(row.explanation.shortcut)}</p><p><strong>${escapeHtml(row.explanation.answer)}</strong></p></section></article>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TSD CP004 Multilingual Review</title><style>body{font-family:system-ui,sans-serif;margin:0;background:#f5f5f5;color:#171717}.wrap{max-width:1100px;margin:auto;padding:24px}.summary,.card{background:white;border:1px solid #ddd;border-radius:12px;padding:18px;margin-bottom:16px}.card header{display:flex;gap:10px;flex-wrap:wrap;font-size:12px;color:#555}.options{padding-left:24px}.options li{padding:5px}.correct{font-weight:700}.explanation{border-top:1px solid #eee;margin-top:12px;padding-top:12px}.visual svg{max-width:100%;height:auto}.alt{font-size:12px;color:#666}.pill{display:inline-block;padding:4px 8px;border-radius:20px;background:#eee;margin:2px}</style></head><body><div class="wrap"><div class="summary"><h1>TSD CP004 — Straight-Line Relative Motion</h1><p>Review candidate only. 16 proposed learner authorities; candidate coordinates TSD-QL-048..063 are not permanent until explicit product-owner count approval.</p><p><span class="pill">48 English</span><span class="pill">48 Hindi</span><span class="pill">48 Punjabi</span><span class="pill">Studio locked</span><span class="pill">Bank NOT_STORED</span><span class="pill">Tests INELIGIBLE</span></p></div>${cards}</div></body></html>`;
writeFileSync(resolve(outputDir, "tsd-cp004-review.html"), html);
console.log(JSON.stringify({ status: "PASS", outputDir, files: ["tsd-cp004-review.json", "tsd-cp004-evidence.json", "tsd-cp004-review.html"], rows: rows.length }, null, 2));
