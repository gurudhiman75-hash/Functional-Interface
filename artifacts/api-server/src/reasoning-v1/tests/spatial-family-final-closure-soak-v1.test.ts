import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V5,
  SPATIAL_QUESTION_STUDIO_QLS_V5,
} from "../foundation/spatial/spatial-question-studio-integration-v5";
import { generateSpatialProductionStudioQuestionV5 } from "../foundation/spatial/spatial-question-studio-production-v5";
import { CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "../foundation/spatial/cubes-dice-test-builder-activation-v1";
import { generateCubesDiceQuestionStudioTestBuilderV1 } from "../foundation/spatial/cubes-dice-question-studio-test-builder-runtime-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9 } from "../foundation/spatial/spatial-permanent-ql-allocation-v9";
import { SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1 } from "../foundation/spatial/spatial-family-final-closure-audit-v1";

const cwd = process.cwd();
const languages = ["en", "hi", "pa"] as const;
const seeds = ["closure-A", "closure-B"] as const;
const cndQlIds = ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"] as const;
const forbiddenLearnerTerms = /solver-attested|runtime proof|content fingerprint|geometry fingerprint|renderer authority|occupied-voxel|height matrix/i;

function qlNumber(id: string): number {
  const match = /^SPA-QL-(\d{3})$/.exec(id);
  assert.ok(match, `Malformed permanent Spatial QL id: ${id}`);
  return Number(match[1]);
}

function assertSvg(svg: unknown, owner: string): void {
  assert.equal(typeof svg, "string", `${owner}: SVG must be a string.`);
  const source = String(svg);
  assert.match(source, /<svg\b/i, `${owner}: missing SVG root.`);
  assert.ok(source.length > 40, `${owner}: SVG is unexpectedly thin.`);
  assert.doesNotMatch(source, /<script\b|javascript:|\sonload\s*=|\sonerror\s*=/i, `${owner}: unsafe SVG content.`);
  assert.doesNotMatch(source, /fill=["'](?:#000000|#000|black)["'][^>]*width=["'](?:100%|[2-9]\d{2,})/i, `${owner}: suspicious full black background.`);
}

function visualCount(question: any): number {
  const stimulus = Array.isArray(question.stimulusSvgs) ? question.stimulusSvgs : [];
  const options = Array.isArray(question.optionSvgs) ? question.optionSvgs : [];
  return stimulus.length + options.length;
}

function assertExplanation(question: any, owner: string): void {
  const explanation = question.explanation ?? question.solution;
  assert.ok(explanation, `${owner}: missing explanation/solution.`);
  const text = typeof explanation === "string" ? explanation : JSON.stringify(explanation);
  assert.ok(text.length >= 20, `${owner}: explanation is too thin.`);
  assert.doesNotMatch(text, forbiddenLearnerTerms, `${owner}: learner explanation leaks internal implementation language.`);
}

function assertCommonQuestion(question: any, qlId: string, language: string, owner: string): void {
  assert.equal(question.qlId, qlId, `${owner}: QL ownership drift.`);
  assert.equal(question.language, language, `${owner}: language ownership drift.`);
  assert.equal(typeof question.stem, "string", `${owner}: missing stem.`);
  assert.ok(question.stem.trim().length >= 8, `${owner}: stem too short.`);
  assert.ok(Number.isInteger(question.correctIndex), `${owner}: correctIndex must be an integer.`);
  assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3, `${owner}: correctIndex out of range.`);

  const stimulusSvgs = Array.isArray(question.stimulusSvgs) ? question.stimulusSvgs : [];
  const optionSvgs = Array.isArray(question.optionSvgs) ? question.optionSvgs : [];
  assert.ok(stimulusSvgs.length + optionSvgs.length >= 1, `${owner}: missing visual question surface.`);
  stimulusSvgs.forEach((svg: string, index: number) => assertSvg(svg, `${owner}:stimulus:${index}`));
  if (optionSvgs.length) {
    assert.equal(optionSvgs.length, 4, `${owner}: visual option count must be four.`);
    optionSvgs.forEach((svg: string, index: number) => assertSvg(svg, `${owner}:option:${index}`));
  }

  const options = Array.isArray(question.options) ? question.options : question.optionLabels;
  assert.ok(Array.isArray(options) && options.length === 4, `${owner}: option surface must contain four choices.`);
  assertExplanation(question, owner);
  if (question.lifecycle) {
    assert.equal(question.lifecycle.automaticStudentPublication, false, `${owner}: automatic student publication must stay closed.`);
  }
}

assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.permanentQlCount, 50);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.permanentQlRange, "SPA-QL-001..SPA-QL-050");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.nextAvailablePermanentQlId, "SPA-QL-051");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.permanentQlCount, 45);
assert.deepEqual(CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.permanentQlIds, cndQlIds);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1.lifecycle.familyFreezeAuthorized, false);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1.blockingMissingChapters.length, 4);

const spaQlIds = [...SPATIAL_QUESTION_STUDIO_PACKAGE_V5.qlIds];
const union = [...spaQlIds, ...cndQlIds];
assert.equal(new Set(union).size, 50, "Current Spatial production packages must own 50 unique permanent QLs.");
assert.deepEqual(
  union.map(qlNumber).sort((a, b) => a - b),
  Array.from({ length: 50 }, (_, index) => index + 1),
  "Current production package union must cover SPA-QL-001..050 without holes.",
);
assert.equal(SPATIAL_QUESTION_STUDIO_QLS_V5.length, 45);
for (const qlId of cndQlIds) assert.ok(!spaQlIds.includes(qlId as any), `${qlId}: CND must remain separately owned.`);

let spaGenerated = 0;
let cndGenerated = 0;
let svgChecks = 0;
let deterministicReplayChecks = 0;
const spaFingerprints = new Set<string>();
const cndFingerprints = new Set<string>();

for (const ql of SPATIAL_QUESTION_STUDIO_QLS_V5) {
  for (const language of languages) {
    for (const seed of seeds) {
      const generationSeed = `spa-final-closure:${ql.permanentQlId}:${language}:${seed}`;
      const question = generateSpatialProductionStudioQuestionV5({
        qlId: ql.permanentQlId,
        language,
        seed: generationSeed,
      }) as any;
      const owner = `${ql.permanentQlId}:${language}:${seed}`;
      assertCommonQuestion(question, ql.permanentQlId, language, owner);
      const replay = generateSpatialProductionStudioQuestionV5({
        qlId: ql.permanentQlId,
        language,
        seed: generationSeed,
      }) as any;
      assert.equal(replay.contentFingerprint, question.contentFingerprint, `${owner}: deterministic content replay drift.`);
      assert.equal(replay.correctIndex, question.correctIndex, `${owner}: deterministic answer replay drift.`);
      deterministicReplayChecks += 1;
      if (typeof question.contentFingerprint === "string") {
        const key = `${ql.permanentQlId}:${language}:${question.contentFingerprint}`;
        assert.ok(!spaFingerprints.has(key), `${owner}: duplicate content fingerprint across distinct soak seeds.`);
        spaFingerprints.add(key);
      }
      svgChecks += visualCount(question);
      spaGenerated += 1;
    }
  }
}

for (const qlId of cndQlIds) {
  for (const language of languages) {
    for (const seed of seeds) {
      const generationSeed = `spa-final-closure:${qlId}:${language}:${seed}`;
      const question = generateCubesDiceQuestionStudioTestBuilderV1({
        qlId,
        language,
        seed: generationSeed,
      }) as any;
      const owner = `${qlId}:${language}:${seed}`;
      assertCommonQuestion(question, qlId, language, owner);
      assert.equal(question.lifecycle.testBuilderEligible, true, `${owner}: CND internal Test Builder eligibility regressed.`);
      assert.equal(question.lifecycle.mockTestEligible, false, `${owner}: CND mock gate must remain closed.`);
      assert.equal(question.lifecycle.publicReleaseAuthorized, false, `${owner}: CND public-release gate must remain closed.`);
      assert.equal(question.lifecycle.studentDeliveryAuthorized, false, `${owner}: CND student-delivery gate must remain closed.`);
      const replay = generateCubesDiceQuestionStudioTestBuilderV1({ qlId, language, seed: generationSeed }) as any;
      const fingerprint = String(question.contentFingerprint ?? question.geometryFingerprint ?? question.questionId ?? JSON.stringify([question.stem, question.correctIndex]));
      const replayFingerprint = String(replay.contentFingerprint ?? replay.geometryFingerprint ?? replay.questionId ?? JSON.stringify([replay.stem, replay.correctIndex]));
      assert.equal(replayFingerprint, fingerprint, `${owner}: deterministic CND replay drift.`);
      assert.equal(replay.correctIndex, question.correctIndex, `${owner}: deterministic CND answer replay drift.`);
      deterministicReplayChecks += 1;
      const key = `${qlId}:${language}:${fingerprint}`;
      assert.ok(!cndFingerprints.has(key), `${owner}: duplicate CND fingerprint across distinct soak seeds.`);
      cndFingerprints.add(key);
      svgChecks += visualCount(question);
      cndGenerated += 1;
    }
  }
}

const sharedEngine = readFileSync(resolve(cwd, "src/question-studio/shared-generation-engine-sri.ts"), "utf8");
const registry = readFileSync(resolve(cwd, "src/routes/admin-question-studio-registry.ts"), "utf8");
assert.match(sharedEngine, /packageId: "SPA-001"/);
assert.match(sharedEngine, /packageId: "SPA-001-CND-001-REVIEW"/);
assert.match(registry, /adminQuestionStudioSpatialWorkflowRouter/);
assert.match(registry, /adminQuestionStudioCubesDiceWorkflowRouter/);

const evidence = {
  status: "PASS_CURRENT_50_QL_SPATIAL_CORPUS_BUT_BLOCK_FAMILY_FREEZE",
  authorityId: SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1.authorityId,
  currentPermanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.permanentQlRange,
  currentPermanentQlCount: 50,
  nextAvailablePermanentQlId: "SPA-QL-051",
  languages,
  seedsPerQlPerLanguage: seeds.length,
  spa001GeneratedQuestions: spaGenerated,
  cndGeneratedQuestions: cndGenerated,
  totalGeneratedQuestions: spaGenerated + cndGenerated,
  deterministicReplayChecks,
  svgChecks,
  packageUnionComplete: true,
  cndSeparateOwnershipPreserved: true,
  automaticStudentPublicationClosed: true,
  blockingMissingChapters: SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1.blockingMissingChapters.map((entry) => entry.chapterCode),
  familyFreezeAuthorized: false,
  verdict: SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1.verdict,
};

const evidencePath = resolve(cwd, "dist/reasoning-v1/spatial/spa-001-final-closure-soak-v1-evidence.json");
mkdirSync(dirname(evidencePath), { recursive: true });
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(evidence.status, evidence);
