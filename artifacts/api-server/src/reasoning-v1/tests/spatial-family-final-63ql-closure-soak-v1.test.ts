import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V9,
  SPATIAL_QUESTION_STUDIO_QLS_V9,
} from "../foundation/spatial/spatial-question-studio-integration-v9";
import { generateSpatialProductionStudioQuestionV9 } from "../foundation/spatial/spatial-question-studio-production-v9";
import { CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "../foundation/spatial/cubes-dice-test-builder-activation-v1";
import { generateCubesDiceQuestionStudioTestBuilderV1 } from "../foundation/spatial/cubes-dice-question-studio-test-builder-runtime-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13 } from "../foundation/spatial/spatial-permanent-ql-allocation-v13";
import { SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2 } from "../foundation/spatial/spatial-family-final-closure-audit-v2";

const cwd = process.cwd();
const languages = ["en", "hi", "pa"] as const;
const seeds = ["63ql-closure-A", "63ql-closure-B"] as const;
const cndQlIds = ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"] as const;
const expectedQlNumbers = Array.from({ length: 63 }, (_, index) => index + 1);
const forbiddenLearnerTerms = /solver-attested|runtime proof|content fingerprint|geometry fingerprint|renderer authority|occupied-voxel|height matrix|internal activation authority/i;

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

function visualSurfaces(question: any): string[] {
  const stimulus = Array.isArray(question.stimulusSvgs)
    ? question.stimulusSvgs
    : typeof question.stimulusSvg === "string" ? [question.stimulusSvg] : [];
  const options = Array.isArray(question.optionSvgs) ? question.optionSvgs : [];
  return [...stimulus, ...options];
}

function assertExplanation(question: any, owner: string): void {
  const explanation = question.explanation ?? question.solution;
  assert.ok(explanation, `${owner}: missing explanation/solution.`);
  const text = typeof explanation === "string" ? explanation : JSON.stringify(explanation);
  assert.ok(text.length >= 20, `${owner}: explanation is too thin.`);
  assert.doesNotMatch(text, forbiddenLearnerTerms, `${owner}: learner explanation leaks implementation language.`);
}

function stableFingerprint(question: any): string {
  return String(
    question.contentFingerprint
      ?? question.geometryFingerprint
      ?? question.questionId
      ?? JSON.stringify([question.stem, question.correctIndex, question.optionLabels, question.options]),
  );
}

function assertClosedReleaseGates(lifecycle: any, owner: string): void {
  if (!lifecycle) return;
  if ("mockTestEligible" in lifecycle) assert.equal(lifecycle.mockTestEligible, false, `${owner}: mock gate opened.`);
  if ("publicReleaseAuthorized" in lifecycle) assert.equal(lifecycle.publicReleaseAuthorized, false, `${owner}: public-release gate opened.`);
  if ("studentDeliveryAuthorized" in lifecycle) assert.equal(lifecycle.studentDeliveryAuthorized, false, `${owner}: student-delivery gate opened.`);
  if ("automaticStudentPublication" in lifecycle) assert.equal(lifecycle.automaticStudentPublication, false, `${owner}: automatic publication gate opened.`);
}

function assertCommonQuestion(question: any, qlId: string, language: string, owner: string): void {
  assert.equal(question.qlId, qlId, `${owner}: QL ownership drift.`);
  assert.equal(question.language, language, `${owner}: language ownership drift.`);
  assert.equal(typeof question.stem, "string", `${owner}: missing stem.`);
  assert.ok(question.stem.trim().length >= 8, `${owner}: stem too short.`);
  assert.ok(Number.isInteger(question.correctIndex), `${owner}: correctIndex must be an integer.`);
  assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3, `${owner}: correctIndex out of range.`);

  const visuals = visualSurfaces(question);
  assert.ok(visuals.length >= 1, `${owner}: missing visual question surface.`);
  visuals.forEach((svg, index) => assertSvg(svg, `${owner}:visual:${index}`));
  if (Array.isArray(question.optionSvgs)) {
    assert.equal(question.optionSvgs.length, 4, `${owner}: visual option count must be four.`);
  }

  const options = Array.isArray(question.options) ? question.options : question.optionLabels;
  assert.ok(Array.isArray(options) && options.length === 4, `${owner}: option surface must contain four choices.`);
  assertExplanation(question, owner);
  assertClosedReleaseGates(question.lifecycle, owner);
}

assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.authorityId, "SPA-FND-001-FAMILY-FINAL-CLOSURE-AUDIT-V2");
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.lifecycle.chapterInventoryComplete, true);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.lifecycle.finalUnified63QlSoakRequired, true);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.lifecycle.familyFreezeAuthorized, false);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.blockingMissingChapters.length, 0);

assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.permanentQlCount, 63);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.permanentQlRange, "SPA-QL-001..SPA-QL-063");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.nextAvailablePermanentQlId, "SPA-QL-064");
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.permanentQlCount, 58);
assert.equal(SPATIAL_QUESTION_STUDIO_QLS_V9.length, 58);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.questionStudioDiscoverable, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.questionBankWritable, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.testBuilderEligible, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.mockTestEligible, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.publicReleaseAuthorized, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.studentDeliveryAuthorized, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V9.automaticStudentPublication, false);
assert.deepEqual(CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.permanentQlIds, cndQlIds);

const mainQlIds = [...SPATIAL_QUESTION_STUDIO_PACKAGE_V9.qlIds];
const union = [...mainQlIds, ...cndQlIds];
assert.equal(new Set(mainQlIds).size, 58, "Main Spatial Question Studio package contains duplicate QL identities.");
assert.equal(new Set(union).size, 63, "Main + CND union must contain 63 unique permanent QLs.");
assert.deepEqual(
  union.map(qlNumber).sort((a, b) => a - b),
  expectedQlNumbers,
  "Spatial production union must cover SPA-QL-001..063 without holes.",
);
for (const qlId of cndQlIds) assert.ok(!mainQlIds.includes(qlId as any), `${qlId}: CND must remain separately owned.`);

const requiredFormerBlockerQls = [
  "SPA-QL-051", "SPA-QL-052", "SPA-QL-053", "SPA-QL-054",
  "SPA-QL-055", "SPA-QL-056", "SPA-QL-057", "SPA-QL-058", "SPA-QL-059", "SPA-QL-060",
  "SPA-QL-061", "SPA-QL-062", "SPA-QL-063",
] as const;
for (const qlId of requiredFormerBlockerQls) {
  assert.ok(mainQlIds.includes(qlId as any), `${qlId}: resolved secondary chapter QL is missing from the live main package.`);
}

let mainGenerated = 0;
let cndGenerated = 0;
let deterministicReplayChecks = 0;
let svgChecks = 0;
const chapterGeneratedCounts = new Map<string, number>();
const mainFingerprints = new Set<string>();
const cndFingerprints = new Set<string>();

for (const ql of SPATIAL_QUESTION_STUDIO_QLS_V9) {
  for (const language of languages) {
    for (const seed of seeds) {
      const generationSeed = `spa-63ql-final:${ql.permanentQlId}:${language}:${seed}`;
      const question = generateSpatialProductionStudioQuestionV9({
        qlId: ql.permanentQlId,
        language,
        seed: generationSeed,
      }) as any;
      const owner = `${ql.permanentQlId}:${language}:${seed}`;
      assertCommonQuestion(question, ql.permanentQlId, language, owner);
      assert.equal(question.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V9.integrationAuthority, `${owner}: stale integration authority.`);

      const replay = generateSpatialProductionStudioQuestionV9({
        qlId: ql.permanentQlId,
        language,
        seed: generationSeed,
      }) as any;
      assert.equal(stableFingerprint(replay), stableFingerprint(question), `${owner}: deterministic content replay drift.`);
      assert.equal(replay.correctIndex, question.correctIndex, `${owner}: deterministic answer replay drift.`);
      deterministicReplayChecks += 1;

      const fingerprint = stableFingerprint(question);
      const uniquenessKey = `${ql.permanentQlId}:${language}:${fingerprint}`;
      assert.ok(!mainFingerprints.has(uniquenessKey), `${owner}: duplicate fingerprint across distinct soak seeds.`);
      mainFingerprints.add(uniquenessKey);

      svgChecks += visualSurfaces(question).length;
      mainGenerated += 1;
      chapterGeneratedCounts.set(ql.chapterCode, (chapterGeneratedCounts.get(ql.chapterCode) ?? 0) + 1);
    }
  }
}

for (const qlId of cndQlIds) {
  for (const language of languages) {
    for (const seed of seeds) {
      const generationSeed = `spa-63ql-final:${qlId}:${language}:${seed}`;
      const question = generateCubesDiceQuestionStudioTestBuilderV1({
        qlId,
        language,
        seed: generationSeed,
      }) as any;
      const owner = `${qlId}:${language}:${seed}`;
      assertCommonQuestion(question, qlId, language, owner);
      assert.equal(question.lifecycle.testBuilderEligible, true, `${owner}: CND internal Test Builder eligibility regressed.`);
      assert.equal(question.lifecycle.mockTestEligible, false, `${owner}: CND mock gate opened.`);
      assert.equal(question.lifecycle.publicReleaseAuthorized, false, `${owner}: CND public-release gate opened.`);
      assert.equal(question.lifecycle.studentDeliveryAuthorized, false, `${owner}: CND student-delivery gate opened.`);

      const replay = generateCubesDiceQuestionStudioTestBuilderV1({ qlId, language, seed: generationSeed }) as any;
      assert.equal(stableFingerprint(replay), stableFingerprint(question), `${owner}: deterministic CND replay drift.`);
      assert.equal(replay.correctIndex, question.correctIndex, `${owner}: deterministic CND answer replay drift.`);
      deterministicReplayChecks += 1;

      const fingerprint = stableFingerprint(question);
      const uniquenessKey = `${qlId}:${language}:${fingerprint}`;
      assert.ok(!cndFingerprints.has(uniquenessKey), `${owner}: duplicate CND fingerprint across distinct soak seeds.`);
      cndFingerprints.add(uniquenessKey);

      svgChecks += visualSurfaces(question).length;
      cndGenerated += 1;
    }
  }
}

for (const chapterCode of SPATIAL_QUESTION_STUDIO_PACKAGE_V9.chapters) {
  assert.ok((chapterGeneratedCounts.get(chapterCode) ?? 0) > 0, `${chapterCode}: no generated coverage in unified soak.`);
}

const sharedEngine = readFileSync(resolve(cwd, "src/question-studio/shared-generation-engine-sri.ts"), "utf8");
const registry = readFileSync(resolve(cwd, "src/routes/admin-question-studio-registry.ts"), "utf8");
assert.match(sharedEngine, /packageId: "SPA-001"/);
assert.match(sharedEngine, /packageId: "SPA-001-CND-001-REVIEW"/);
assert.match(registry, /adminQuestionStudioSpatialWorkflowRouter/);
assert.match(registry, /adminQuestionStudioCubesDiceWorkflowRouter/);

const expectedMainGenerated = 58 * languages.length * seeds.length;
const expectedCndGenerated = 5 * languages.length * seeds.length;
assert.equal(mainGenerated, expectedMainGenerated);
assert.equal(cndGenerated, expectedCndGenerated);
assert.equal(mainGenerated + cndGenerated, 63 * languages.length * seeds.length);
assert.equal(deterministicReplayChecks, mainGenerated + cndGenerated);
assert.ok(svgChecks >= mainGenerated + cndGenerated, "Every generated question must expose at least one visual surface.");

const evidence = {
  authorityId: "SPA_63_QL_FINAL_UNIFIED_CLOSURE_SOAK_V1",
  status: "PASS_UNIFIED_63_QL_SPATIAL_CORPUS_READY_FOR_FREEZE_REVIEW",
  baseAuditAuthority: SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.authorityId,
  permanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.permanentQlRange,
  permanentQlCount: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.permanentQlCount,
  nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.nextAvailablePermanentQlId,
  mainQuestionStudioQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.permanentQlCount,
  separateCndQlCount: cndQlIds.length,
  packageUnionComplete: true,
  packageUnionGapFree: true,
  cndSeparateOwnershipPreserved: true,
  formerBlockingQlIdsPresent: requiredFormerBlockerQls,
  languages,
  seedsPerQlPerLanguage: seeds.length,
  mainGeneratedQuestions: mainGenerated,
  cndGeneratedQuestions: cndGenerated,
  totalGeneratedQuestions: mainGenerated + cndGenerated,
  deterministicReplayChecks,
  svgChecks,
  chapterGeneratedCounts: Object.fromEntries([...chapterGeneratedCounts.entries()].sort()),
  releaseGates: {
    mockTestEligible: false,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
    automaticStudentPublication: false,
  },
  soakPassed: true,
  familyFreezeAuthorizedByThisSoak: false,
  nextGate: "SPA_FAMILY_FREEZE_AUTHORITY_V1",
} as const;

const evidencePath = resolve(cwd, "dist/reasoning-v1/spatial/spa-family-final-63ql-closure-soak-v1-evidence.json");
mkdirSync(dirname(evidencePath), { recursive: true });
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(evidence.status, evidence);
