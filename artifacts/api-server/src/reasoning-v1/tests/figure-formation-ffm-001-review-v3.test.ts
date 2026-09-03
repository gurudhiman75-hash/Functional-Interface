import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/figure-formation-source-saturated-discovery-v1";
import { FIGURE_FORMATION_SOURCE_EVIDENCE_V2 } from "../foundation/spatial/figure-formation-source-evidence-v2";
import {
  FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v10";
import { FIGURE_FORMATION_REVIEW_AUTHORITY_V3 } from "../foundation/spatial/figure-formation-review-authority-v3";
import { generateFigureFormationReviewQuestionV3 } from "../foundation/spatial/figure-formation-review-runtime-v3";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V5 } from "../foundation/spatial/spatial-question-studio-integration-v5";

const qlIds = ["SPA-QL-051", "SPA-QL-052", "SPA-QL-053"] as const;
const languages = ["en", "hi", "pa"] as const;
const seeds = Array.from({ length: 12 }, (_, index) => `ffm-review-v3-${String(index + 1).padStart(2, "0")}`);
const forbiddenLearnerTerms = /exact[- ]cover|solver|runtime proof|content fingerprint|geometry fingerprint|renderer authority|occupied cell|atomic triangle/i;

function hasDiagonalLine(svg: string): boolean {
  const line = /<line\s+[^>]*x1="([\d.-]+)"[^>]*y1="([\d.-]+)"[^>]*x2="([\d.-]+)"[^>]*y2="([\d.-]+)"/g;
  for (const match of svg.matchAll(line)) {
    const [, x1, y1, x2, y2] = match;
    if (Math.abs(Number(x1) - Number(x2)) > 0.01 && Math.abs(Number(y1) - Number(y2)) > 0.01) return true;
  }
  return false;
}

function assertSvg(svg: string, owner: string): void {
  assert.match(svg, /<svg\b/i, `${owner}: missing SVG root.`);
  assert.match(svg, /<rect[^>]+fill="white"/i, `${owner}: white background missing.`);
  assert.doesNotMatch(svg, /<script\b|javascript:|\sonload\s*=|\sonerror\s*=/i, `${owner}: unsafe SVG.`);
  assert.doesNotMatch(svg, /stroke-width="(?:1\.4|1\.45|1\.5|1\.55)"/i, `${owner}: legacy heavy Spatial stroke leaked.`);
  assert.doesNotMatch(svg, /stroke-width="(?:[2-9]|\d{2,})(?:\.\d+)?"/i, `${owner}: line weight is too bold.`);
  assert.match(svg, /#111827/i, `${owner}: standard exam stroke missing.`);
  assert.ok(svg.length > 180, `${owner}: SVG is unexpectedly thin.`);
}

assert.equal(FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.decision.allocatePermanentQlCount, 3);
assert.equal(FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.decision.sourceSaturationEstablishedForCoreFigureFormation, true);
assert.equal(FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.consolidation.reflectionAllowed, false);
assert.equal(FIGURE_FORMATION_SOURCE_EVIDENCE_V2.records.length, 4);
assert.equal(FIGURE_FORMATION_SOURCE_EVIDENCE_V2.conclusion.coreThreeSemanticQlSplitSupported, true);
assert.equal(FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10.length, 3);
assert.deepEqual(FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10.map((entry) => entry.permanentQlId), qlIds);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.permanentQlCount, 53);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.permanentQlRange, "SPA-QL-001..SPA-QL-053");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.nextAvailablePermanentQlId, "SPA-QL-054");
assert.equal(FIGURE_FORMATION_REVIEW_AUTHORITY_V3.lifecycle.reviewOnly, true);
assert.equal(FIGURE_FORMATION_REVIEW_AUTHORITY_V3.lifecycle.questionStudioDiscoverable, false);
assert.equal(FIGURE_FORMATION_REVIEW_AUTHORITY_V3.lifecycle.persistenceAllowed, false);
assert.equal(FIGURE_FORMATION_REVIEW_AUTHORITY_V3.lifecycle.questionBankWritable, false);
assert.equal(FIGURE_FORMATION_REVIEW_AUTHORITY_V3.lifecycle.testBuilderEligible, false);
assert.equal(FIGURE_FORMATION_REVIEW_AUTHORITY_V3.lifecycle.mockTestEligible, false);
assert.equal(FIGURE_FORMATION_REVIEW_AUTHORITY_V3.lifecycle.publicReleaseAuthorized, false);
assert.equal(FIGURE_FORMATION_REVIEW_AUTHORITY_V3.lifecycle.studentDeliveryAuthorized, false);
assert.equal(FIGURE_FORMATION_REVIEW_AUTHORITY_V3.lifecycle.automaticStudentPublication, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.permanentQlCount, 45);
for (const qlId of qlIds) assert.ok(!SPATIAL_QUESTION_STUDIO_PACKAGE_V5.qlIds.includes(qlId as any), `${qlId}: review QL leaked into SPA-001 V5 production package.`);

let generated = 0;
let deterministicReplayChecks = 0;
let multilingualParityChecks = 0;
let svgChecks = 0;
const geometryByQl = new Map<string, Set<string>>(qlIds.map((qlId) => [qlId, new Set()]));
const answerPositionsByQl = new Map<string, Set<number>>(qlIds.map((qlId) => [qlId, new Set()]));
const ql051PieceCounts = new Set<number>();
const targetKindsByQl = new Map<string, Set<string>>([["SPA-QL-052", new Set()], ["SPA-QL-053", new Set()]]);

for (const qlId of qlIds) {
  for (const seed of seeds) {
    const byLanguage = new Map<string, any>();
    for (const language of languages) {
      const question = generateFigureFormationReviewQuestionV3({ qlId, seed, language }) as any;
      const owner = `${qlId}:${language}:${seed}`;
      byLanguage.set(language, question);
      generated += 1;

      assert.equal(question.version, "SPA-FFM-001-REVIEW-QUESTION-V3", `${owner}: review wrapper missing.`);
      assert.equal(question.qlId, qlId, `${owner}: QL ownership drift.`);
      assert.equal(question.chapterCode, "FFM-001", `${owner}: chapter ownership drift.`);
      assert.equal(question.language, language, `${owner}: language ownership drift.`);
      assert.equal(question.optionSvgs.length, 4, `${owner}: exactly four options required.`);
      assert.equal(new Set(question.optionSvgs).size, 4, `${owner}: duplicate visual option.`);
      assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3, `${owner}: answer index invalid.`);
      assert.equal(question.answer, question.optionLabels[question.correctIndex], `${owner}: answer label drift.`);
      assert.equal(question.validation.exactCoverSolverBacked, true, `${owner}: exact-cover proof missing.`);
      assert.equal(question.validation.everyPieceUsedAccordingToQl, true, `${owner}: piece-use proof missing.`);
      assert.equal(question.validation.noIllegalOverlap, true, `${owner}: overlap proof missing.`);
      assert.equal(question.validation.exactBoundaryCoverage, true, `${owner}: target-boundary proof missing.`);
      assert.equal(question.validation.uniqueAnswer, true, `${owner}: unique-answer proof missing.`);
      assert.equal(question.validation.rotationAllowed, true, `${owner}: rotation policy drift.`);
      assert.equal(question.validation.reflectionDisallowed, true, `${owner}: reflection policy drift.`);
      assert.equal(question.solveFacts.reflectionUsed, false, `${owner}: reflected solution leaked.`);
      assert.equal(question.solveFacts.overlapCount, 0, `${owner}: overlap leaked.`);
      assert.equal(question.solveFacts.uncoveredTargetCells, 0, `${owner}: target not fully covered.`);
      assert.equal(question.lifecycle.reviewOnly, true, `${owner}: review lifecycle lost.`);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false, `${owner}: Question Studio gate opened before approval.`);
      assert.equal(question.lifecycle.persistenceAllowed, false, `${owner}: persistence gate opened before approval.`);
      assert.equal(question.lifecycle.questionBankWritable, false, `${owner}: Question Bank gate opened before approval.`);
      assert.equal(question.lifecycle.testBuilderEligible, false, `${owner}: Test Builder gate opened before approval.`);
      assert.equal(question.lifecycle.mockTestEligible, false, `${owner}: mock gate opened.`);
      assert.equal(question.lifecycle.publicReleaseAuthorized, false, `${owner}: public gate opened.`);
      assert.equal(question.lifecycle.studentDeliveryAuthorized, false, `${owner}: student-delivery gate opened.`);
      assert.equal(question.lifecycle.automaticStudentPublication, false, `${owner}: automatic publication opened.`);

      const explanation = `${question.explanation.observation} ${question.explanation.rule} ${question.explanation.application} ${question.explanation.check}`;
      assert.ok(explanation.length > 110, `${owner}: explanation too thin.`);
      assert.doesNotMatch(explanation, forbiddenLearnerTerms, `${owner}: learner explanation leaks implementation language.`);
      assert.match(question.explanation.application, /\d+°/, `${owner}: item-specific rotation working missing.`);

      for (const [index, svg] of question.stimulusSvgs.entries()) { assertSvg(svg, `${owner}:stimulus:${index}`); svgChecks += 1; }
      for (const [index, svg] of question.optionSvgs.entries()) { assertSvg(svg, `${owner}:option:${index}`); svgChecks += 1; }

      const replay = generateFigureFormationReviewQuestionV3({ qlId, seed, language }) as any;
      assert.equal(replay.contentFingerprint, question.contentFingerprint, `${owner}: deterministic content replay drift.`);
      assert.equal(replay.geometryFingerprint, question.geometryFingerprint, `${owner}: deterministic geometry replay drift.`);
      assert.equal(replay.correctIndex, question.correctIndex, `${owner}: deterministic answer replay drift.`);
      deterministicReplayChecks += 1;
      geometryByQl.get(qlId)!.add(question.geometryFingerprint);
      answerPositionsByQl.get(qlId)!.add(question.correctIndex);
      if (qlId === "SPA-QL-051") ql051PieceCounts.add(question.solveFacts.placements.length);
      if (qlId === "SPA-QL-052" || qlId === "SPA-QL-053") {
        targetKindsByQl.get(qlId)!.add(question.solveFacts.targetKind);
        assert.ok(question.stimulusSvgs.some(hasDiagonalLine) || question.optionSvgs.some(hasDiagonalLine), `${owner}: square/triangle construction surface has no diagonal edge.`);
      }
    }
    const en = byLanguage.get("en"); const hi = byLanguage.get("hi"); const pa = byLanguage.get("pa");
    assert.equal(en.geometryFingerprint, hi.geometryFingerprint, `${qlId}:${seed}: Hindi geometry parity drift.`);
    assert.equal(en.geometryFingerprint, pa.geometryFingerprint, `${qlId}:${seed}: Punjabi geometry parity drift.`);
    assert.equal(en.correctIndex, hi.correctIndex, `${qlId}:${seed}: Hindi answer parity drift.`);
    assert.equal(en.correctIndex, pa.correctIndex, `${qlId}:${seed}: Punjabi answer parity drift.`);
    assert.deepEqual(en.solveFacts, hi.solveFacts, `${qlId}:${seed}: Hindi solve-fact parity drift.`);
    assert.deepEqual(en.solveFacts, pa.solveFacts, `${qlId}:${seed}: Punjabi solve-fact parity drift.`);
    multilingualParityChecks += 2;
  }
}

for (const qlId of qlIds) {
  assert.ok(geometryByQl.get(qlId)!.size >= 8, `${qlId}: geometry pool is too thin across review seeds.`);
  assert.deepEqual([...answerPositionsByQl.get(qlId)!].sort(), [0, 1, 2, 3], `${qlId}: proof seeds must exercise all four answer positions.`);
}
assert.deepEqual([...ql051PieceCounts].sort(), [2, 3], "SPA-QL-051 must exercise both two-piece and three-piece forward assembly.");
for (const qlId of ["SPA-QL-052", "SPA-QL-053"] as const) {
  assert.deepEqual([...targetKindsByQl.get(qlId)!].sort(), ["SQUARE", "TRIANGLE"], `${qlId}: both square and triangle target construction are required.`);
}

const sharedEngine = readFileSync(resolve(process.cwd(), "src/question-studio/shared-generation-engine-sri.ts"), "utf8");
const registry = readFileSync(resolve(process.cwd(), "src/routes/admin-question-studio-registry.ts"), "utf8");
assert.doesNotMatch(sharedEngine, /SPA-QL-051|SPA-QL-052|SPA-QL-053|FFM-001/, "FFM-001 review work leaked into shared generation engine before approval.");
assert.doesNotMatch(registry, /figureFormation|FFM-001/i, "FFM-001 review work leaked into admin route registry before approval.");

const evidence = {
  status: "PASS_FFM_001_REVIEW_V3",
  authorityId: FIGURE_FORMATION_REVIEW_AUTHORITY_V3.authorityId,
  permanentQlIds: qlIds,
  permanentSpatialQlCount: 53,
  permanentSpatialQlRange: "SPA-QL-001..SPA-QL-053",
  nextAvailablePermanentQlId: "SPA-QL-054",
  generated,
  deterministicReplayChecks,
  multilingualParityChecks,
  svgChecks,
  geometryCounts: Object.fromEntries([...geometryByQl].map(([qlId, values]) => [qlId, values.size])),
  answerPositionCoverage: Object.fromEntries([...answerPositionsByQl].map(([qlId, values]) => [qlId, [...values].sort()])),
  ql051PieceCounts: [...ql051PieceCounts].sort(),
  targetKinds: Object.fromEntries([...targetKindsByQl].map(([qlId, values]) => [qlId, [...values].sort()])),
  lifecycle: FIGURE_FORMATION_REVIEW_AUTHORITY_V3.lifecycle,
};
const evidencePath = resolve(process.cwd(), "dist/reasoning-v1/spatial/ffm-001-review-v3-evidence.json");
mkdirSync(dirname(evidencePath), { recursive: true });
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(evidence.status, evidence);
