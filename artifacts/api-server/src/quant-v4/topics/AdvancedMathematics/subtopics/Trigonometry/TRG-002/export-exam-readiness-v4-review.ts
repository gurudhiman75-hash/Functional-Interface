import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { formatExactPlain } from "../foundation/exact";
import { generateTrg002V4CanonicalQuestion, isTrg002V4CanonicalOverride } from "./exam-readiness-v4-canonical";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";
import { buildTrg002V4BaselineAudit } from "./exam-readiness-v4-audit";
import { applyTrg002V4PhysicalSupportMigration } from "./exam-readiness-v4-physical-support";
import {
  applyTrg002V4RiverPlatformMigration,
  generateLocalizedTrg002V4RiverQl093,
  isTrg002V4RiverMathOverride,
} from "./exam-readiness-v4-river";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/exam-readiness-v4");
mkdirSync(outDir, { recursive: true });

function esc(value: unknown) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function stringify(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current, 2);
}

function englishRiverQl093(seed: string) {
  const q: any = generateLocalizedTrg002V4RiverQl093(seed, "hi-IN");
  const observer = q.canonicalSpatialState.observers[0];
  if (!observer) throw new Error("TRG-002-QL-093 V4 review: canonical observer missing.");
  const height = formatExactPlain(observer.eyeHeight);
  const width = q.exactAnswer.kind === "NUMBER" ? formatExactPlain(q.exactAnswer.value) : q.answer.replace(/ m$/, "");
  return {
    ...q,
    language: "en" as const,
    stem: `An observation platform on one bank of a river is ${height} m high. From its top, the point directly opposite on the other bank is seen at an angle of depression of 60°. Find the exact width of the river.`,
    explanation: {
      keyRule: "The platform height is the vertical drop and the river width is the horizontal side of the depression triangle.",
      steps: [
        { title: "Given", body: `The platform height is ${height} m. Let the river width be w m.` },
        { title: "Calculation", body: `tan60° = ${height}/w = √3, so w = ${height}/√3 = ${width} m.` },
      ],
      shortcut: "At 60°, river width = vertical platform height/√3.",
      traps: ["The river width is the perpendicular horizontal distance between the banks, not the sloping line of sight."],
    },
  };
}

function englishBridgeQl021(question: any) {
  const observer = question.canonicalSpatialState.observers[0];
  if (!observer) throw new Error("TRG-002-QL-021 V4 review: canonical observer missing.");
  const height = formatExactPlain(observer.eyeHeight);
  return {
    ...question,
    stem: `From the edge of a ${height} m high pedestrian overbridge above a level road, a point on the road is seen at an angle of depression of 45°. Find the horizontal distance from the point directly below the bridge edge to that road point.`,
    explanation: {
      keyRule: "The bridge height is the vertical drop. At a 45° angle of depression, the vertical drop and horizontal run are equal.",
      steps: [
        { title: "Given", body: `Bridge height = ${height} m and angle of depression = 45°.` },
        { title: "Calculation", body: `Let the horizontal distance be d. tan45° = ${height}/d = 1, so d = ${height} m.` },
      ],
      shortcut: "At 45°, the vertical and horizontal legs of the right triangle are equal.",
      traps: ["Do not use the sloping line of sight as the required horizontal road distance."],
    },
  };
}

const qlIds = Array.from({ length: 96 }, (_, index) => `TRG-002-QL-${String(index + 1).padStart(3, "0")}`);
const records = qlIds.map((qlId, index) => {
  const seed = `trg002-v4-human-review-${String(index + 1).padStart(3, "0")}`;
  const rawEn: any = isTrg002V4RiverMathOverride(qlId)
    ? englishRiverQl093(seed)
    : generateTrg002V4CanonicalQuestion(qlId, seed);
  const englishPhysicalSupport = applyTrg002V4PhysicalSupportMigration(rawEn);
  const englishRiverSupport = applyTrg002V4RiverPlatformMigration(englishPhysicalSupport.question);
  const enBase: any = englishRiverSupport.question;
  const en: any = qlId === "TRG-002-QL-021" ? englishBridgeQl021(enBase) : enBase;
  const hi: any = generateTrg002V4CandidateQuestion(qlId, seed, "hi-IN");
  const pa: any = generateTrg002V4CandidateQuestion(qlId, seed, "pa-IN");
  return {
    qlId,
    cpId: en.cpId,
    difficulty: en.difficulty,
    lockedFamily: en.lockedFamily,
    solveMode: en.solveMode,
    seed,
    v4CanonicalOverride: isTrg002V4CanonicalOverride(qlId) || isTrg002V4RiverMathOverride(qlId),
    v4PhysicalSupportMigrated: englishPhysicalSupport.migrated || englishRiverSupport.migrated,
    english: { stem: en.stem, options: en.options, answer: en.answer, explanation: en.explanation },
    hindi: { stem: hi.stem, options: hi.options, answer: hi.answer, explanation: hi.explanation, v4ExamReadiness: hi.v4ExamReadiness },
    punjabi: { stem: pa.stem, options: pa.options, answer: pa.answer, explanation: pa.explanation, v4ExamReadiness: pa.v4ExamReadiness },
    solutionDiagram: en.solutionDiagram,
    diagramEvidence: en.diagramEvidence,
    canonicalSpatialState: en.canonicalSpatialState,
    validation: en.validation,
    lifecycle: {
      historicalEnglishAuthorityMutated: false,
      v4CandidateOnly: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioDiscoverable: false,
    },
  };
});

const audit = buildTrg002V4BaselineAudit("trg002-v4-review-audit");
const cards = records.map((r) => {
  const lang = (title: string, q: any) => `<section class="lang"><h3>${title}</h3><p class="stem">${esc(q.stem)}</p><ol>${q.options.map((o: any) => `<li class="${o.isCorrect ? "correct" : ""}">${esc(o.label)}. ${esc(o.display)}${o.isCorrect ? " ✓" : ""}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p><p><b>Rule:</b> ${esc(q.explanation.keyRule)}</p><ol>${q.explanation.steps.map((s: any) => `<li><b>${esc(s.title)}:</b> ${esc(s.body)}</li>`).join("")}</ol>${q.v4ExamReadiness ? `<p><b>V4 topology:</b> ${esc(q.v4ExamReadiness.spatialTopology)} · <b>scenario:</b> ${esc(q.v4ExamReadiness.recommendedScenarioShell)} · <b>text applied:</b> ${esc(q.v4ExamReadiness.scenarioTextApplied)} · <b>full surface:</b> ${esc(q.v4ExamReadiness.scenarioSurfaceApplied)} · <b>physical support:</b> ${esc(q.v4ExamReadiness.physicalObserverSupport)} · <b>diagram pending:</b> ${esc(q.v4ExamReadiness.diagramMigrationRequired)}</p>` : ""}</section>`;
  return `<article class="card"><header><h2>${esc(r.qlId)} · ${esc(r.difficulty)}${r.v4CanonicalOverride ? " · V4 CANONICAL OVERRIDE" : ""}${r.v4PhysicalSupportMigrated ? " · V4 PHYSICAL-SUPPORT MIGRATION" : ""}</h2><p>${esc(r.lockedFamily)} · ${esc(r.solveMode)}</p></header><div class="langs">${lang("English V4 candidate", r.english)}${lang("Hindi V4 candidate", r.hindi)}${lang("Punjabi V4 candidate", r.punjabi)}</div><section class="visual"><h3>Solution diagram + evidence</h3><pre>${esc(stringify(r.solutionDiagram))}</pre><pre>${esc(stringify(r.diagramEvidence))}</pre><details><summary>Canonical spatial state</summary><pre>${esc(stringify(r.canonicalSpatialState))}</pre></details></section></article>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TRG-002 V4 Exam Readiness Review</title><style>body{font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;background:#f4f4f4;color:#111;margin:0}.page{max-width:1600px;margin:auto;padding:20px}.summary,.card{background:white;border:1px solid #ddd;border-radius:10px;padding:18px;margin-bottom:18px}.langs{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.lang{border:1px solid #e4e4e4;border-radius:8px;padding:14px}.stem{font-size:17px;line-height:1.55}.correct{font-weight:700}.visual{margin-top:16px;border-top:1px solid #ddd;padding-top:14px}.visual pre{white-space:pre-wrap;background:#f7f7f7;border:1px solid #eee;border-radius:6px;padding:10px;overflow:auto}.blocker{color:#8a1c1c;font-weight:700}@media(max-width:1050px){.langs{grid-template-columns:1fr}.page{padding:10px}}</style></head><body><main class="page"><section class="summary"><h1>TRG-002 V4 · Comprehensive Exam-Readiness Review</h1><p><b>Scope:</b> 96 V4 candidate QLs shown side-by-side in English, Hindi and Punjabi, with canonical spatial state, solution diagram specification and diagram evidence.</p><p class="blocker">This remains a blocker-discovery artifact, not a freeze artifact. Historical frozen English authority is untouched; V4 canonical overrides and physical-support migrations are separate candidates.</p><pre>${esc(stringify(audit))}</pre></section>${cards}</main></body></html>`;

writeFileSync(join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.json"), stringify({ audit, records }), "utf8");
writeFileSync(join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.html"), html, "utf8");
console.log(`TRG002_V4_REVIEW_EXPORT_PASS qls=${records.length} languages=3 canonicalOverrides=${records.filter((r) => r.v4CanonicalOverride).length} physicalSupportMigrations=${records.filter((r) => r.v4PhysicalSupportMigrated).length} diagrams=INCLUDED freeze=OFF activation=OFF`);
