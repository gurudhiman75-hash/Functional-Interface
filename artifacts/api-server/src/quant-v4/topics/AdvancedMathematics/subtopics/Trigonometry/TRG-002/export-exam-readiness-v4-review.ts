import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { generateTrg002ExamRealnessV2CanonicalQuestion } from "./production-exam-realness-v2";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";
import { buildTrg002V4BaselineAudit } from "./exam-readiness-v4-audit";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/exam-readiness-v4");
mkdirSync(outDir, { recursive: true });

function esc(value: unknown) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function stringify(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current, 2);
}

const qlIds = Array.from({ length: 96 }, (_, index) => `TRG-002-QL-${String(index + 1).padStart(3, "0")}`);
const records = qlIds.map((qlId, index) => {
  const seed = `trg002-v4-human-review-${String(index + 1).padStart(3, "0")}`;
  const en: any = generateTrg002ExamRealnessV2CanonicalQuestion(qlId, seed);
  const hi: any = generateTrg002V4CandidateQuestion(qlId, seed, "hi-IN");
  const pa: any = generateTrg002V4CandidateQuestion(qlId, seed, "pa-IN");
  return {
    qlId,
    cpId: en.cpId,
    difficulty: en.difficulty,
    lockedFamily: en.lockedFamily,
    solveMode: en.solveMode,
    seed,
    english: { stem: en.stem, options: en.options, answer: en.answer, explanation: en.explanation },
    hindi: { stem: hi.stem, options: hi.options, answer: hi.answer, explanation: hi.explanation, v4ExamReadiness: hi.v4ExamReadiness },
    punjabi: { stem: pa.stem, options: pa.options, answer: pa.answer, explanation: pa.explanation, v4ExamReadiness: pa.v4ExamReadiness },
    solutionDiagram: en.solutionDiagram,
    diagramEvidence: en.diagramEvidence,
    canonicalSpatialState: en.canonicalSpatialState,
    validation: en.validation,
    lifecycle: {
      englishBaselineFrozen: Boolean(en.frozen),
      v4CandidateOnly: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioDiscoverable: false,
    },
  };
});

const audit = buildTrg002V4BaselineAudit("trg002-v4-review-audit");
const cards = records.map((r) => {
  const lang = (title: string, q: any) => `<section class="lang"><h3>${title}</h3><p class="stem">${esc(q.stem)}</p><ol>${q.options.map((o: any) => `<li class="${o.isCorrect ? "correct" : ""}">${esc(o.label)}. ${esc(o.display)}${o.isCorrect ? " ✓" : ""}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p><p><b>Rule:</b> ${esc(q.explanation.keyRule)}</p><ol>${q.explanation.steps.map((s: any) => `<li><b>${esc(s.title)}:</b> ${esc(s.body)}</li>`).join("")}</ol>${q.v4ExamReadiness ? `<p><b>V4 topology:</b> ${esc(q.v4ExamReadiness.spatialTopology)} · <b>recommended scenario:</b> ${esc(q.v4ExamReadiness.recommendedScenarioShell)} · <b>surface applied:</b> ${esc(q.v4ExamReadiness.scenarioSurfaceApplied)}</p>` : ""}</section>`;
  return `<article class="card"><header><h2>${esc(r.qlId)} · ${esc(r.difficulty)}</h2><p>${esc(r.lockedFamily)} · ${esc(r.solveMode)}</p></header><div class="langs">${lang("English frozen/V2 canonical", r.english)}${lang("Hindi V4 candidate", r.hindi)}${lang("Punjabi V4 candidate", r.punjabi)}</div><section class="visual"><h3>Solution diagram + evidence</h3><pre>${esc(stringify(r.solutionDiagram))}</pre><pre>${esc(stringify(r.diagramEvidence))}</pre><details><summary>Canonical spatial state</summary><pre>${esc(stringify(r.canonicalSpatialState))}</pre></details></section></article>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TRG-002 V4 Exam Readiness Review</title><style>body{font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;background:#f4f4f4;color:#111;margin:0}.page{max-width:1600px;margin:auto;padding:20px}.summary,.card{background:white;border:1px solid #ddd;border-radius:10px;padding:18px;margin-bottom:18px}.langs{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.lang{border:1px solid #e4e4e4;border-radius:8px;padding:14px}.stem{font-size:17px;line-height:1.55}.correct{font-weight:700}.visual{margin-top:16px;border-top:1px solid #ddd;padding-top:14px}.visual pre{white-space:pre-wrap;background:#f7f7f7;border:1px solid #eee;border-radius:6px;padding:10px;overflow:auto}.blocker{color:#8a1c1c;font-weight:700}@media(max-width:1050px){.langs{grid-template-columns:1fr}.page{padding:10px}}</style></head><body><main class="page"><section class="summary"><h1>TRG-002 V4 · Comprehensive Exam-Readiness Review</h1><p><b>Scope:</b> 96 QLs shown side-by-side in English and V4 Hindi/Punjabi candidate surfaces, with canonical spatial state, solution diagram specification and diagram evidence.</p><p class="blocker">This is a blocker-discovery artifact, not a freeze artifact. Scenario recommendations are not considered applied until stem + explanation + diagram are converted together.</p><pre>${esc(stringify(audit))}</pre></section>${cards}</main></body></html>`;

writeFileSync(join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.json"), stringify({ audit, records }), "utf8");
writeFileSync(join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.html"), html, "utf8");
console.log(`TRG002_V4_REVIEW_EXPORT_PASS qls=${records.length} languages=3 diagrams=INCLUDED v4Candidate=YES freeze=OFF activation=OFF`);
