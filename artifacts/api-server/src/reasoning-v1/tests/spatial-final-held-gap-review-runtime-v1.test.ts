import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1 } from "../foundation/spatial/spatial-final-held-gap-saturation-v1";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9,
  SPATIAL_FINAL_HELD_GAP_PERMANENT_QL_ALLOCATIONS_V9,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v9";
import {
  SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1,
  generateSpatialFinalHeldGapReviewQuestionV1,
  type SpatialFinalHeldGapLanguageV1,
  type SpatialFinalHeldGapQlIdV1,
} from "../foundation/spatial/spatial-final-held-gap-review-runtime-v1";

const qls = ["SPA-QL-048", "SPA-QL-049", "SPA-QL-050"] as const satisfies readonly SpatialFinalHeldGapQlIdV1[];
const languages = ["en", "hi", "pa"] as const satisfies readonly SpatialFinalHeldGapLanguageV1[];
const forbiddenLearnerTerms = [
  "solver-attested",
  "occupied-voxel",
  "renderer authority",
  "runtime proof",
  "geometry fingerprint",
  "canonical fingerprint",
];

assert.equal(SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.lifecycle.sourceAuditComplete, true);
assert.deepEqual(SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.promotedQlIds, qls);
assert.equal(SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.routing.bankingHeldGapEvidenceEstablished, false);
assert.equal(SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.routing.doNotAutoRouteNewHeldGapQlsToBanking, true);
assert.deepEqual(SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.retainedOrMergedHolds, [
  "WAT-HOLD-P01",
  "FCL-HOLD-P01",
  "EMB-HOLD-REFLECTION",
]);

assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.permanentQlCount, 50);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.permanentQlRange, "SPA-QL-001..SPA-QL-050");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.allocatedRange, "SPA-QL-048..SPA-QL-050");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.nextAvailablePermanentQlId, "SPA-QL-051");
assert.deepEqual(SPATIAL_FINAL_HELD_GAP_PERMANENT_QL_ALLOCATIONS_V9.map((row) => row.permanentQlId), qls);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.chapterCounts["FCT-001"], 3);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.chapterCounts["EMB-001"], 2);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.invariants.reflectionAllowedNotAllocated, true);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.invariants.analogClockWaterDiagramNotAllocated, true);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.invariants.identitySetReplacementStandaloneQlNotAllocated, true);

assert.deepEqual(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1.qlIds, qls);
assert.deepEqual(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1.supportedLanguages, languages);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1.rendererPolicy.strokeWidth, 1.35);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1.rendererPolicy.randomWholeFigureTilt, false);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1.lifecycle.questionStudioDiscoverable, false);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1.lifecycle.questionBankWritable, false);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1.lifecycle.testEligible, false);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1.lifecycle.automaticStudentPublication, false);

const metrics = {
  questions: 0,
  deterministicReplayChecks: 0,
  svgChecks: 0,
  optionChecks: 0,
  localizationChecks: 0,
  lifecycleChecks: 0,
  ql048: { motifs: new Set<string>(), difficulties: new Set<string>(), counts: new Set<number>() },
  ql049: { motifs: new Set<string>(), targets: new Set<string>(), difficulties: new Set<string>(), counts: new Set<number>() },
  ql050: { rotations: new Set<number>(), answerPositions: new Set<number>(), difficulties: new Set<string>() },
};

function assertSvg(svg: string, context: string): void {
  assert.match(svg, /^<svg\b/iu, `${context}: SVG root missing.`);
  assert.match(svg, /<rect[^>]+fill="white"/iu, `${context}: white exam background missing.`);
  assert.match(svg, /stroke="#111827"/iu, `${context}: exam stroke missing.`);
  assert.match(svg, /stroke-width="1\.35"/iu, `${context}: exact 1.35px stroke missing.`);
  assert.doesNotMatch(svg, /transform\s*=\s*"[^"]*(?:rotate|skew|matrix)/iu, `${context}: free whole-figure transform found.`);
  assert.doesNotMatch(svg, /NaN|Infinity|undefined/iu, `${context}: invalid geometry token found.`);
  metrics.svgChecks += 1;
}

function assertLearnerCopy(question: ReturnType<typeof generateSpatialFinalHeldGapReviewQuestionV1>, context: string): void {
  const copy = `${question.stem}\n${question.explanation.rule}\n${question.explanation.working.join("\n")}\n${question.explanation.answerLine}`.toLowerCase();
  for (const forbidden of forbiddenLearnerTerms) {
    assert(!copy.includes(forbidden), `${context}: forbidden learner-facing term '${forbidden}'.`);
  }
  assert(question.explanation.answerLine.trim().length >= 8, `${context}: explicit answer line missing.`);
  if (question.language === "hi") assert(/[\u0900-\u097F]/u.test(copy), `${context}: Hindi script missing.`);
  if (question.language === "pa") assert(/[\u0A00-\u0A7F]/u.test(copy), `${context}: Punjabi script missing.`);
  metrics.localizationChecks += 1;
}

function assertLifecycle(question: ReturnType<typeof generateSpatialFinalHeldGapReviewQuestionV1>, context: string): void {
  assert.equal(question.lifecycle.reviewOnly, true, `${context}: review-only lock missing.`);
  assert.equal(question.lifecycle.permanentQlAllocated, true, `${context}: permanent identity missing.`);
  assert.equal(question.lifecycle.learnerContentFrozen, false, `${context}: content must remain unfrozen.`);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false, `${context}: premature Studio discovery.`);
  assert.equal(question.lifecycle.persistenceAllowed, false, `${context}: premature persistence.`);
  assert.equal(question.lifecycle.questionBankWritable, false, `${context}: premature Question Bank write.`);
  assert.equal(question.lifecycle.testEligible, false, `${context}: premature test eligibility.`);
  assert.equal(question.lifecycle.mockTestEligible, false, `${context}: premature mock eligibility.`);
  assert.equal(question.lifecycle.publiclyPublishable, false, `${context}: premature publication.`);
  assert.equal(question.lifecycle.automaticStudentPublication, false, `${context}: automatic learner publication opened.`);
  metrics.lifecycleChecks += 1;
}

for (const qlId of qls) {
  for (let index = 0; index < 36; index += 1) {
    const seed = `final-held-gap-structural:${qlId}:${index}`;
    const question = generateSpatialFinalHeldGapReviewQuestionV1({ qlId, seed, language: "en" });
    const replay = generateSpatialFinalHeldGapReviewQuestionV1({ qlId, seed, language: "en" });
    assert.deepEqual(replay, question, `${qlId}:${index}: deterministic replay mismatch.`);
    metrics.deterministicReplayChecks += 1;
    metrics.questions += 1;
    assert.equal(question.qlId, qlId);
    assert.equal(question.stimulusSvgs.length, 1);
    assertSvg(question.stimulusSvgs[0], `${qlId}:${index}:stimulus`);
    assertLearnerCopy(question, `${qlId}:${index}:en`);
    assertLifecycle(question, `${qlId}:${index}`);

    if (question.version === "SPA-FINAL-HELD-GAP-NUMERIC-QUESTION-V1") {
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4, `${qlId}:${index}: duplicate numeric options.`);
      assert.equal(question.options[question.correctIndex], question.answer, `${qlId}:${index}: numeric answer ownership mismatch.`);
      assert(Number.isInteger(question.answer) && question.answer > 0, `${qlId}:${index}: invalid count answer.`);
      metrics.optionChecks += 1;
      if (qlId === "SPA-QL-048") {
        metrics.ql048.motifs.add(String(question.solveFacts.motif));
        metrics.ql048.difficulties.add(question.difficultyBand);
        metrics.ql048.counts.add(question.answer);
        assert.equal(question.solveFacts.verifiedUniqueStraightLines, question.answer);
      } else {
        metrics.ql049.motifs.add(String(question.solveFacts.motif));
        metrics.ql049.targets.add(String(question.solveFacts.target));
        metrics.ql049.difficulties.add(question.difficultyBand);
        metrics.ql049.counts.add(question.answer);
        assert.equal(question.solveFacts.verifiedPrimitiveCount, question.answer);
      }
    } else {
      assert.equal(question.optionSvgs.length, 4);
      assert.equal(new Set(question.optionSvgs).size, 4, `${qlId}:${index}: duplicate image options.`);
      question.optionSvgs.forEach((svg, optionIndex) => assertSvg(svg, `${qlId}:${index}:option${optionIndex}`));
      assert.equal(question.solveFacts.reflectionUsed, false);
      assert.equal(question.solveFacts.fixedOrientationWouldMatchCorrectOption, false);
      assert.notEqual(question.solveFacts.displayRotationDegrees % 360, 0);
      assert(question.correctIndex >= 0 && question.correctIndex <= 3);
      metrics.ql050.rotations.add(question.solveFacts.displayRotationDegrees);
      metrics.ql050.answerPositions.add(question.correctIndex);
      metrics.ql050.difficulties.add(question.difficultyBand);
      metrics.optionChecks += 1;
    }
  }
}

for (const qlId of qls) {
  for (const language of languages) {
    for (let index = 0; index < 5; index += 1) {
      const question = generateSpatialFinalHeldGapReviewQuestionV1({
        qlId,
        seed: `final-held-gap-locale:${qlId}:${index}`,
        language,
      });
      metrics.questions += 1;
      assert.equal(question.language, language);
      assertLearnerCopy(question, `${qlId}:${language}:${index}`);
      assertLifecycle(question, `${qlId}:${language}:${index}`);
    }
  }
}

assert.deepEqual([...metrics.ql048.motifs].sort(), ["CROSSHATCH", "ORTHOGONAL_GRID", "RADIAL_DIAMETERS"]);
assert.deepEqual([...metrics.ql048.difficulties].sort(), ["Easy", "Hard", "Medium"]);
assert(metrics.ql048.counts.size >= 6, "QL048 answer-count diversity is too thin.");
assert.deepEqual([...metrics.ql049.targets].sort(), ["CIRCLE", "SEMICIRCLE"]);
assert.deepEqual([...metrics.ql049.motifs].sort(), ["CIRCLE_ARRAY", "CONCENTRIC_RINGS", "NESTED_SEMICIRCLES", "SEMICIRCLE_ARRAY"]);
assert.deepEqual([...metrics.ql049.difficulties].sort(), ["Easy", "Hard", "Medium"]);
assert(metrics.ql049.counts.size >= 6, "QL049 answer-count diversity is too thin.");
assert(metrics.ql050.rotations.size >= 5, "QL050 rotation diversity is too thin.");
assert.deepEqual([...metrics.ql050.answerPositions].sort(), [0, 1, 2, 3]);
assert.deepEqual([...metrics.ql050.difficulties].sort(), ["Easy", "Hard", "Medium"]);

const evidence = {
  status: "PASS_SPA_FINAL_HELD_GAP_REVIEW_RUNTIME_V1",
  sourceAuditAuthorityId: SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.authorityId,
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.authorityId,
  runtimeAuthorityId: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1.authorityId,
  permanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.permanentQlRange,
  nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.nextAvailablePermanentQlId,
  promotedQlIds: qls,
  retainedOrMergedHolds: SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.retainedOrMergedHolds,
  routing: SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.routing,
  metrics: {
    ...metrics,
    ql048: { ...metrics.ql048, motifs: [...metrics.ql048.motifs], difficulties: [...metrics.ql048.difficulties], counts: [...metrics.ql048.counts] },
    ql049: { ...metrics.ql049, motifs: [...metrics.ql049.motifs], targets: [...metrics.ql049.targets], difficulties: [...metrics.ql049.difficulties], counts: [...metrics.ql049.counts] },
    ql050: { rotations: [...metrics.ql050.rotations], answerPositions: [...metrics.ql050.answerPositions], difficulties: [...metrics.ql050.difficulties] },
  },
  lifecycle: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1.lifecycle,
};

const outDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "spa-final-held-gap-review-runtime-v1-evidence.json"), JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence));
