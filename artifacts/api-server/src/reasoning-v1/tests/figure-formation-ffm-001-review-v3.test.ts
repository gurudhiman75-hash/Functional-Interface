import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { FFM_001_SOURCE_SATURATION_AUTHORITY_V2 } from "../foundation/spatial/figure-formation-source-saturation-v2";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10, FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10 } from "../foundation/spatial/spatial-permanent-ql-allocation-v10";
import { generateFigureFormationReviewQuestionV3 } from "../foundation/spatial/figure-formation-review-runtime-v3";

const languages = ["en", "hi", "pa"] as const;
const qlIds = ["SPA-QL-051", "SPA-QL-052"] as const;
const seeds = Array.from({ length: 48 }, (_, index) => `ffm-review-v3-${String(index + 1).padStart(2, "0")}`);
const forbidden = /solver|fingerprint|runtime|authority|exact-cover|internal|debug|occupied|matrix/i;

function assertSvg(svg: string, owner: string) {
  assert.match(svg, /<svg\b/i, `${owner}: missing SVG root`);
  assert.match(svg, /fill="white"/i, `${owner}: white background missing`);
  const hasGeometry = /<(?:line|path|polygon|polyline)\b/i.test(svg);
  if (hasGeometry) {
    assert.match(svg, /stroke="#111827"/i, `${owner}: standard exam stroke missing`);
    assert.match(svg, /stroke-width="1\.35"/i, `${owner}: non-standard stroke width`);
    assert.doesNotMatch(svg, /stroke-width="(?:[2-9]|[1-9]\d)/i, `${owner}: overly heavy stroke`);
  } else {
    assert.match(svg, /<text\b[^>]*fill="#111827"/i, `${owner}: text-only option must use standard exam ink`);
  }
  assert.doesNotMatch(svg, /<script|javascript:|onload=|onerror=/i, `${owner}: unsafe SVG`);
}
function explanationText(question: any) { return Object.values(question.explanation ?? {}).join(" "); }
function visualProjection(question: any) {
  return JSON.stringify({
    qlId: question.qlId,
    motifFamily: question.motifFamily,
    answerSurface: question.answerSurface,
    targetKind: question.targetKind,
    difficultyBand: question.difficultyBand,
    stimulusSvgs: question.stimulusSvgs,
    optionSvgs: question.optionSvgs,
    correctIndex: question.correctIndex,
    geometryFingerprint: question.geometryFingerprint,
  });
}

assert.equal(FFM_001_SOURCE_SATURATION_AUTHORITY_V2.semanticQlDecision.length, 2);
assert.equal(FFM_001_SOURCE_SATURATION_AUTHORITY_V2.rejectedThirdQl.disposition, "MERGED_INTO_SPA_QL_052");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.permanentQlCount, 52);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.permanentQlRange, "SPA-QL-001..SPA-QL-052");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.nextAvailablePermanentQlId, "SPA-QL-053");
assert.equal(FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10.length, 2);
assert.ok(!SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.allocations.some((entry: any) => entry.permanentQlId === "SPA-QL-053"));

let generated = 0;
let deterministicReplayChecks = 0;
let multilingualParityChecks = 0;
let svgChecks = 0;
const coverage = {
  ql051TwoPieces: false,
  ql051ThreePieces: false,
  ql051Motifs: new Set<string>(),
  ql052Square: false,
  ql052Triangle: false,
  ql052LabelledSubset: false,
  ql052VisualPieceSet: false,
  ql052SplitFamilies: new Set<string>(),
  ql051AnswerPositions: new Set<number>(),
  ql052AnswerPositions: new Set<number>(),
};

for (const qlId of qlIds) {
  for (const seed of seeds) {
    const byLanguage = new Map<string, any>();
    for (const language of languages) {
      const question = generateFigureFormationReviewQuestionV3({ qlId, seed, language }) as any;
      const owner = `${qlId}/${seed}/${language}`;
      assert.equal(question.version, "SPA-FFM-001-REVIEW-RUNTIME-V3", `${owner}: runtime version drift`);
      assert.equal(question.qlId, qlId, `${owner}: QL drift`);
      assert.equal(question.language, language, `${owner}: language drift`);
      assert.equal(question.lifecycle.reviewOnly, true, `${owner}: review-only gate opened`);
      assert.equal(question.lifecycle.learnerContentFrozen, false, `${owner}: content frozen before approval`);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false, `${owner}: Question Studio opened before approval`);
      assert.equal(question.lifecycle.persistenceAllowed, false, `${owner}: persistence opened before approval`);
      assert.equal(question.lifecycle.questionBankWritable, false, `${owner}: Question Bank opened before approval`);
      assert.equal(question.lifecycle.testEligible, false, `${owner}: Test Builder opened before approval`);
      assert.equal(question.lifecycle.mockTestEligible, false, `${owner}: mock gate opened before approval`);
      assert.equal(question.lifecycle.publiclyPublishable, false, `${owner}: public gate opened before approval`);
      assert.equal(question.lifecycle.studentDeliveryAuthorized, false, `${owner}: student delivery opened before approval`);
      assert.equal(question.lifecycle.automaticStudentPublication, false, `${owner}: automatic publication opened`);
      assert.equal(question.validation.exactCoverSolverBacked, true, `${owner}: solver proof missing`);
      assert.equal(question.validation.cleanBoundaryMotifsOnly, true, `${owner}: clean-boundary proof missing`);
      assert.equal(question.validation.reflectionAllowed, false, `${owner}: reflection policy drift`);
      assert.equal(question.validation.noGapNoOverlap, true, `${owner}: exact assembly contract drift`);
      assert.equal(question.optionSvgs.length, 4, `${owner}: must have four options`);
      assert.ok(question.stimulusSvgs.length >= 1, `${owner}: missing stimulus`);
      question.stimulusSvgs.forEach((svg: string, index: number) => { assertSvg(svg, `${owner}/stimulus/${index}`); svgChecks += 1; });
      question.optionSvgs.forEach((svg: string, index: number) => { assertSvg(svg, `${owner}/option/${index}`); svgChecks += 1; });
      assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3, `${owner}: invalid answer index`);
      assert.ok(String(question.stem).length >= 20, `${owner}: stem too thin`);
      const learnerText = `${question.stem} ${explanationText(question)}`;
      assert.doesNotMatch(learnerText, forbidden, `${owner}: internal implementation language leaked`);
      assert.ok(explanationText(question).length >= 80, `${owner}: explanation too thin`);
      const replay = generateFigureFormationReviewQuestionV3({ qlId, seed, language }) as any;
      assert.equal(replay.contentFingerprint, question.contentFingerprint, `${owner}: deterministic fingerprint drift`);
      assert.equal(replay.correctIndex, question.correctIndex, `${owner}: deterministic answer drift`);
      deterministicReplayChecks += 1;
      byLanguage.set(language, question);
      generated += 1;
    }
    const en = byLanguage.get("en")!;
    for (const language of ["hi", "pa"] as const) {
      const localized = byLanguage.get(language)!;
      assert.equal(visualProjection(localized), visualProjection(en), `${qlId}/${seed}/${language}: visual-answer parity drift`);
      assert.equal(localized.canonicalItemId, en.canonicalItemId, `${qlId}/${seed}/${language}: canonical identity drift`);
      assert.notEqual(localized.questionLanguageId, en.questionLanguageId, `${qlId}/${seed}/${language}: language ID collision`);
      multilingualParityChecks += 1;
    }
    if (qlId === "SPA-QL-051") {
      const pieceCount = en.solveFacts.placements.length;
      if (pieceCount === 2) coverage.ql051TwoPieces = true;
      if (pieceCount === 3) coverage.ql051ThreePieces = true;
      coverage.ql051Motifs.add(en.motifFamily);
      coverage.ql051AnswerPositions.add(en.correctIndex);
    } else {
      if (en.targetKind === "SQUARE") coverage.ql052Square = true;
      if (en.targetKind === "TRIANGLE") coverage.ql052Triangle = true;
      if (en.answerSurface === "LABELLED_SUBSET") coverage.ql052LabelledSubset = true;
      if (en.answerSurface === "VISUAL_PIECE_SET") coverage.ql052VisualPieceSet = true;
      coverage.ql052SplitFamilies.add(en.motifFamily);
      coverage.ql052AnswerPositions.add(en.correctIndex);
    }
  }
}

assert.ok(coverage.ql051TwoPieces && coverage.ql051ThreePieces, "QL051 must cover 2-piece and 3-piece assembly.");
assert.ok(coverage.ql051Motifs.size >= 4, `QL051 must cover all four clean assembly motif families; got ${[...coverage.ql051Motifs].join(", ")}`);
assert.ok(coverage.ql052Square && coverage.ql052Triangle, "QL052 must cover square and triangle construction.");
assert.ok(coverage.ql052LabelledSubset && coverage.ql052VisualPieceSet, "QL052 must cover both answer-surface representations.");
assert.ok(coverage.ql052SplitFamilies.size >= 4, `QL052 must cover at least four clean split families; got ${[...coverage.ql052SplitFamilies].join(", ")}`);
assert.deepEqual([...coverage.ql051AnswerPositions].sort(), [0,1,2,3], "QL051 answer positions must cover A-D.");
assert.deepEqual([...coverage.ql052AnswerPositions].sort(), [0,1,2,3], "QL052 answer positions must cover A-D.");

const reviewSeeds = Array.from({ length: 12 }, (_, index) => `ffm-v3-visual-${String(index + 1).padStart(2, "0")}`);
const reviewQuestions = qlIds.flatMap((qlId) => reviewSeeds.map((seed) => generateFigureFormationReviewQuestionV3({ qlId, seed, language: "en" }) as any));
function card(question: any) {
  const stimuli = question.stimulusSvgs.map((svg: string) => `<div class="stimulus">${svg}</div>`).join("");
  const options = question.optionSvgs.map((svg: string, index: number) => `<div class="option"><b>${String.fromCharCode(65 + index)}</b>${svg}</div>`).join("");
  return `<article><header><strong>${question.qlId}</strong> · ${question.answerSurface}${question.targetKind ? ` · ${question.targetKind}` : ""} · ${question.motifFamily} · ${question.difficultyBand}<br><small>${question.seed}</small></header><p>${question.stem}</p><div class="stimuli">${stimuli}</div><div class="options">${options}</div><p class="answer">Answer: ${question.answer}</p></article>`;
}
const html = `<!doctype html><html><head><meta charset="utf-8"><title>FFM-001 V3 visual review</title><style>body{font-family:Arial,sans-serif;margin:24px;background:#f5f6f8;color:#111827}h1{margin:0 0 20px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(620px,1fr));gap:18px}article{background:white;border:1px solid #d1d5db;border-radius:10px;padding:16px}.stimuli{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.stimulus svg{max-width:410px;height:auto}.options{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.option{border:1px solid #d1d5db;border-radius:8px;padding:8px;display:flex;align-items:center;gap:8px}.option svg{max-width:200px;height:auto}.answer{font-weight:700}small{color:#4b5563}</style></head><body><h1>FFM-001 — 24-question V3 visual remediation review</h1><main>${reviewQuestions.map(card).join("")}</main></body></html>`;

const outDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "ffm-001-visual-review-v3.html"), html, "utf8");
const evidence = {
  status: "PASS_FFM_001_TWO_QL_REVIEW_V3",
  permanentQlRange: "SPA-QL-051..SPA-QL-052",
  nextAvailablePermanentQlId: "SPA-QL-053",
  generated,
  deterministicReplayChecks,
  multilingualParityChecks,
  svgChecks,
  reviewSurfaceCount: reviewQuestions.length,
  coverage: {
    ql051TwoPieces: coverage.ql051TwoPieces,
    ql051ThreePieces: coverage.ql051ThreePieces,
    ql051Motifs: [...coverage.ql051Motifs].sort(),
    ql052Square: coverage.ql052Square,
    ql052Triangle: coverage.ql052Triangle,
    ql052LabelledSubset: coverage.ql052LabelledSubset,
    ql052VisualPieceSet: coverage.ql052VisualPieceSet,
    ql052SplitFamilies: [...coverage.ql052SplitFamilies].sort(),
    ql051AnswerPositions: [...coverage.ql051AnswerPositions].sort(),
    ql052AnswerPositions: [...coverage.ql052AnswerPositions].sort(),
  },
  visuals: "CLEAN_POLYGON_AND_TRIANGLE_PARTITIONS_WHITE_1_35PX",
  lifecycle: "REVIEW_ONLY_ALL_DOWNSTREAM_GATES_CLOSED",
};
writeFileSync(resolve(outDir, "ffm-001-review-v3-evidence.json"), `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
