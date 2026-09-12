import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1 } from "../foundation/spatial/spatial-final-held-gap-saturation-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9 } from "../foundation/spatial/spatial-permanent-ql-allocation-v9";
import {
  SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3,
  generateSpatialFinalHeldGapReviewQuestionV3,
} from "../foundation/spatial/spatial-final-held-gap-review-runtime-v3";
import type {
  SpatialFinalHeldGapLanguageV1,
  SpatialFinalHeldGapQlIdV1,
} from "../foundation/spatial/spatial-final-held-gap-review-runtime-v1";

const qls = ["SPA-QL-048", "SPA-QL-049", "SPA-QL-050"] as const satisfies readonly SpatialFinalHeldGapQlIdV1[];
const languages = ["en", "hi", "pa"] as const satisfies readonly SpatialFinalHeldGapLanguageV1[];

assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.permanentQlRange, "SPA-QL-001..SPA-QL-050");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.nextAvailablePermanentQlId, "SPA-QL-051");
assert.deepEqual(SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.promotedQlIds, qls);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.rendererPolicy.stroke, "#111827");
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.rendererPolicy.strokeWidth, 1.35);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.countingFigurePolicy.toyGridOnlyMotifsSuppressed, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.countingFigurePolicy.plainPrimitiveArrayOnlyMotifsSuppressed, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.lifecycle.questionStudioDiscoverable, false);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.lifecycle.questionBankWritable, false);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.lifecycle.testEligible, false);
assert.equal(SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.lifecycle.automaticStudentPublication, false);

const metrics = {
  structuralQuestions: 0,
  localeQuestions: 0,
  deterministicReplayChecks: 0,
  svgChecks: 0,
  ql048Motifs: new Set<string>(),
  ql048Counts: new Set<number>(),
  ql049Motifs: new Set<string>(),
  ql049Targets: new Set<string>(),
  ql049Counts: new Set<number>(),
  ql050Rotations: new Set<number>(),
  ql050Answers: new Set<number>(),
  ql050Difficulties: new Set<string>(),
};

function assertSvg(svg: string, label: string): void {
  assert.match(svg, /^<svg\b/iu, `${label}: SVG root missing.`);
  assert.match(svg, /<rect[^>]+fill="white"/iu, `${label}: white background missing.`);
  assert.match(svg, /stroke="#111827"/iu, `${label}: standard stroke missing.`);
  assert.match(svg, /stroke-width="1\.35"/iu, `${label}: exact 1.35px stroke missing.`);
  assert.doesNotMatch(svg, /stroke="black"|stroke-width="2\.2"/iu, `${label}: legacy heavy stroke leaked.`);
  assert.doesNotMatch(svg, /transform\s*=\s*"[^"]*(?:rotate|skew|matrix)/iu, `${label}: free whole-figure transform found.`);
  assert.doesNotMatch(svg, /NaN|Infinity|undefined/iu, `${label}: invalid coordinate token found.`);
  metrics.svgChecks += 1;
}

function assertCopy(question: ReturnType<typeof generateSpatialFinalHeldGapReviewQuestionV3>, label: string): void {
  const text = `${question.stem}\n${question.explanation.rule}\n${question.explanation.working.join("\n")}\n${question.explanation.answerLine}`.toLowerCase();
  for (const term of ["solver-attested", "renderer authority", "runtime proof", "geometry fingerprint", "canonical fingerprint", "occupied-voxel"]) {
    assert(!text.includes(term), `${label}: internal learner term leaked: ${term}`);
  }
  if (question.language === "hi") assert(/[\u0900-\u097F]/u.test(text), `${label}: Hindi script missing.`);
  if (question.language === "pa") assert(/[\u0A00-\u0A7F]/u.test(text), `${label}: Punjabi script missing.`);
  assert(question.explanation.answerLine.length >= 8, `${label}: answer line too thin.`);
}

function assertLocked(question: ReturnType<typeof generateSpatialFinalHeldGapReviewQuestionV3>, label: string): void {
  assert.equal(question.lifecycle.reviewOnly, true, `${label}: review-only lock missing.`);
  assert.equal(question.lifecycle.learnerContentFrozen, false, `${label}: learner content frozen prematurely.`);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false, `${label}: Studio opened prematurely.`);
  assert.equal(question.lifecycle.persistenceAllowed, false, `${label}: persistence opened prematurely.`);
  assert.equal(question.lifecycle.questionBankWritable, false, `${label}: Question Bank opened prematurely.`);
  assert.equal(question.lifecycle.testEligible, false, `${label}: test eligibility opened prematurely.`);
  assert.equal(question.lifecycle.mockTestEligible, false, `${label}: mock eligibility opened prematurely.`);
  assert.equal(question.lifecycle.publiclyPublishable, false, `${label}: public publication opened prematurely.`);
  assert.equal(question.lifecycle.automaticStudentPublication, false, `${label}: automatic learner publication opened.`);
}

for (const qlId of qls) {
  for (let index = 0; index < 96; index += 1) {
    const seed = `spa-final-v3:${qlId}:${index}`;
    const question = generateSpatialFinalHeldGapReviewQuestionV3({ qlId, seed, language: "en" });
    const replay = generateSpatialFinalHeldGapReviewQuestionV3({ qlId, seed, language: "en" });
    assert.deepEqual(replay, question, `${qlId}:${index}: deterministic replay mismatch.`);
    metrics.structuralQuestions += 1;
    metrics.deterministicReplayChecks += 1;
    assertSvg(question.stimulusSvgs[0], `${qlId}:${index}:stimulus`);
    assertCopy(question, `${qlId}:${index}`);
    assertLocked(question, `${qlId}:${index}`);

    if ("optionSvgs" in question) {
      assert.equal(question.optionSvgs.length, 4);
      assert.equal(new Set(question.optionSvgs).size, 4, `${qlId}:${index}: image options duplicate.`);
      question.optionSvgs.forEach((svg, optionIndex) => assertSvg(svg, `${qlId}:${index}:option${optionIndex}`));
      assert.equal(question.solveFacts.reflectionUsed, false);
      assert.equal(question.solveFacts.fixedOrientationWouldMatchCorrectOption, false);
      assert.notEqual(question.solveFacts.displayRotationDegrees % 360, 0);
      metrics.ql050Rotations.add(question.solveFacts.displayRotationDegrees);
      metrics.ql050Answers.add(question.correctIndex);
      metrics.ql050Difficulties.add(question.difficultyBand);
    } else {
      assert.equal(question.version, "SPA-FINAL-HELD-GAP-NUMERIC-QUESTION-V3");
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4, `${qlId}:${index}: numeric options duplicate.`);
      assert.equal(question.options[question.correctIndex], question.answer, `${qlId}:${index}: numeric answer ownership mismatch.`);
      if (qlId === "SPA-QL-048") {
        metrics.ql048Motifs.add(String(question.solveFacts.motif));
        metrics.ql048Counts.add(question.answer);
        assert.equal(question.solveFacts.verifiedUniqueStraightLines, question.answer);
      } else {
        metrics.ql049Motifs.add(String(question.solveFacts.motif));
        metrics.ql049Targets.add(String(question.solveFacts.target));
        metrics.ql049Counts.add(question.answer);
        assert.equal(question.solveFacts.verifiedPrimitiveCount, question.answer);
      }
    }
  }
}

for (const qlId of qls) {
  for (const language of languages) {
    for (let index = 0; index < 8; index += 1) {
      const question = generateSpatialFinalHeldGapReviewQuestionV3({ qlId, seed: `spa-final-v3-locale:${qlId}:${index}`, language });
      metrics.localeQuestions += 1;
      assertCopy(question, `${qlId}:${language}:${index}`);
      assertLocked(question, `${qlId}:${language}:${index}`);
      assertSvg(question.stimulusSvgs[0], `${qlId}:${language}:${index}:stimulus`);
    }
  }
}

const allowed048 = [...SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.countingFigurePolicy.straightLineMotifs].sort();
const allowed049 = [...SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.countingFigurePolicy.curvedPrimitiveMotifs].sort();
assert.deepEqual([...metrics.ql048Motifs].sort(), allowed048, "QL048 V3 did not cover every exam-real motif.");
assert.deepEqual([...metrics.ql049Motifs].sort(), allowed049, "QL049 V3 did not cover every exam-real motif.");
assert.deepEqual([...metrics.ql049Targets].sort(), ["CIRCLE", "SEMICIRCLE"]);
assert(metrics.ql048Counts.size >= 3, "QL048 V3 count diversity is too thin.");
assert(metrics.ql049Counts.size >= 4, "QL049 V3 count diversity is too thin.");
assert(metrics.ql050Rotations.size >= 5, "QL050 rotation diversity is too thin.");
assert.deepEqual([...metrics.ql050Answers].sort(), [0, 1, 2, 3]);
assert.deepEqual([...metrics.ql050Difficulties].sort(), ["Easy", "Hard", "Medium"]);

const evidence = {
  status: "PASS_SPA_FINAL_HELD_GAP_REVIEW_RUNTIME_V3",
  sourceAuditAuthorityId: SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.authorityId,
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.authorityId,
  runtimeAuthorityId: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.authorityId,
  permanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.permanentQlRange,
  nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.nextAvailablePermanentQlId,
  metrics: {
    structuralQuestions: metrics.structuralQuestions,
    localeQuestions: metrics.localeQuestions,
    deterministicReplayChecks: metrics.deterministicReplayChecks,
    svgChecks: metrics.svgChecks,
    ql048Motifs: [...metrics.ql048Motifs].sort(),
    ql048Counts: [...metrics.ql048Counts].sort((a, b) => a - b),
    ql049Motifs: [...metrics.ql049Motifs].sort(),
    ql049Targets: [...metrics.ql049Targets].sort(),
    ql049Counts: [...metrics.ql049Counts].sort((a, b) => a - b),
    ql050Rotations: [...metrics.ql050Rotations].sort((a, b) => a - b),
    ql050Answers: [...metrics.ql050Answers].sort((a, b) => a - b),
    ql050Difficulties: [...metrics.ql050Difficulties].sort(),
  },
  lifecycle: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.lifecycle,
};

const outDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "spa-final-held-gap-review-runtime-v3-evidence.json"), JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence));