import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/figure-formation-source-saturated-discovery-v1";
import { FIGURE_FORMATION_INTERNAL_ACTIVATION_V1 } from "../foundation/spatial/figure-formation-internal-activation-v1";
import {
  FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v10";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V6,
  SPATIAL_QUESTION_STUDIO_QLS_V6,
} from "../foundation/spatial/spatial-question-studio-integration-v6";
import { generateSpatialProductionStudioQuestionV6 } from "../foundation/spatial/spatial-question-studio-production-v6";
import { productionPayloadV6 } from "../../routes/admin-question-studio-spatial-v6";
import { listQuestionStudioPackages } from "../../question-studio/shared-generation-engine-sri";

const languages = ["en", "hi", "pa"] as const;
const qlIds = ["SPA-QL-051", "SPA-QL-052", "SPA-QL-053"] as const;
const seeds = Array.from({ length: 12 }, (_, index) => `ffm-proof-${String(index + 1).padStart(2, "0")}`);
const forbiddenLearnerTerms = /exact[- ]cover|solver|runtime proof|content fingerprint|geometry fingerprint|renderer authority|occupied cell/i;

function assertSvg(svg: string, owner: string) {
  assert.match(svg, /<svg\b/i, `${owner}: missing SVG root.`);
  assert.match(svg, /fill="white"/i, `${owner}: white background missing.`);
  assert.doesNotMatch(svg, /<script\b|javascript:|\sonload\s*=|\sonerror\s*=/i, `${owner}: unsafe SVG.`);
  assert.doesNotMatch(svg, /stroke-width="(?:[2-9]|\d{2,})(?:\.\d+)?"/i, `${owner}: exam-line weight is too bold.`);
  assert.ok(svg.length > 250, `${owner}: SVG is unexpectedly thin.`);
}

assert.equal(FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.decision.allocatePermanentQlCount, 3);
assert.equal(FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.decision.sourceSaturationEstablishedForCoreFigureFormation, true);
assert.equal(FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.consolidation.reflectionAllowed, false);
assert.equal(FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10.length, 3);
assert.deepEqual(FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10.map((entry) => entry.permanentQlId), qlIds);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.permanentQlCount, 53);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.permanentQlRange, "SPA-QL-001..SPA-QL-053");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.nextAvailablePermanentQlId, "SPA-QL-054");
assert.deepEqual(FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.permanentQlIds, qlIds);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable, true);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.questionBankWritable, true);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.testBuilderEligible, true);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.mockTestEligible, false);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.publicReleaseAuthorized, false);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.studentDeliveryAuthorized, false);
assert.equal(FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.automaticStudentPublication, false);

assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V6.permanentQlCount, 48);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V6.figureFormationPermanentQlCount, 3);
assert.equal(SPATIAL_QUESTION_STUDIO_QLS_V6.length, 48);
for (const qlId of qlIds) assert.ok(SPATIAL_QUESTION_STUDIO_PACKAGE_V6.qlIds.includes(qlId), `${qlId}: missing from SPA-001 V6 package.`);
for (const cndQlId of ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"]) {
  assert.ok(!SPATIAL_QUESTION_STUDIO_PACKAGE_V6.qlIds.includes(cndQlId as any), `${cndQlId}: CND must remain separately owned.`);
}

const sharedPackage = listQuestionStudioPackages().find((entry: any) => String(entry.packageId) === "SPA-001") as any;
assert.ok(sharedPackage, "SPA-001 missing from shared Question Studio registry.");
assert.equal(sharedPackage.permanentQlCount, 48);
for (const qlId of qlIds) assert.ok(sharedPackage.permanentQlIds.includes(qlId), `${qlId}: missing from shared Question Studio package.`);

let generated = 0;
let deterministicReplayChecks = 0;
let multilingualParityChecks = 0;
let svgChecks = 0;
let persistencePayloadChecks = 0;
const geometryByQl = new Map<string, Set<string>>();
const stemsByQlLanguage = new Map<string, Set<string>>();

for (const qlId of qlIds) {
  geometryByQl.set(qlId, new Set<string>());
  for (const language of languages) stemsByQlLanguage.set(`${qlId}:${language}`, new Set<string>());

  for (const seed of seeds) {
    const byLanguage = new Map<string, ReturnType<typeof generateSpatialProductionStudioQuestionV6>>();
    for (const language of languages) {
      const question = generateSpatialProductionStudioQuestionV6({ qlId, seed, language }) as any;
      const owner = `${qlId}:${language}:${seed}`;
      byLanguage.set(language, question);
      generated += 1;

      assert.equal(question.qlId, qlId, `${owner}: QL drift.`);
      assert.equal(question.chapterCode, "FFM-001", `${owner}: chapter drift.`);
      assert.equal(question.language, language, `${owner}: language drift.`);
      assert.equal(question.optionSvgs.length, 4, `${owner}: four visual options required.`);
      assert.equal(question.optionLabels.length, 4, `${owner}: four labels required.`);
      assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3, `${owner}: answer index invalid.`);
      assert.equal(question.answer, question.optionLabels[question.correctIndex], `${owner}: answer label drift.`);
      assert.equal(question.validation.exactCoverSolverBacked, true, `${owner}: exact-cover proof missing.`);
      assert.equal(question.validation.everyPieceUsedAccordingToQl, true, `${owner}: piece-use proof missing.`);
      assert.equal(question.validation.noIllegalOverlap, true, `${owner}: overlap proof missing.`);
      assert.equal(question.validation.exactBoundaryCoverage, true, `${owner}: target-boundary proof missing.`);
      assert.equal(question.validation.uniqueAnswer, true, `${owner}: unique-answer proof missing.`);
      assert.equal(question.validation.rotationAllowed, true, `${owner}: rotation policy drift.`);
      assert.equal(question.validation.reflectionDisallowed, true, `${owner}: reflection policy drift.`);
      assert.equal(question.solveFacts.reflectionUsed, false, `${owner}: reflected placement leaked.`);
      assert.equal(question.solveFacts.overlapCount, 0, `${owner}: overlap count drift.`);
      assert.equal(question.solveFacts.uncoveredTargetCells, 0, `${owner}: uncovered target cells.`);
      assert.equal(question.lifecycle.questionBankWritable, true, `${owner}: Question Bank gate closed.`);
      assert.equal(question.lifecycle.testBuilderEligible, true, `${owner}: Test Builder gate closed.`);
      assert.equal(question.lifecycle.mockTestEligible, false, `${owner}: mock gate opened.`);
      assert.equal(question.lifecycle.publicReleaseAuthorized, false, `${owner}: public gate opened.`);
      assert.equal(question.lifecycle.studentDeliveryAuthorized, false, `${owner}: student-delivery gate opened.`);
      assert.equal(question.lifecycle.automaticStudentPublication, false, `${owner}: auto-publication opened.`);

      const explanation = `${question.explanation.observation} ${question.explanation.rule} ${question.explanation.application} ${question.explanation.check}`;
      assert.ok(explanation.length > 120, `${owner}: explanation too thin.`);
      assert.doesNotMatch(explanation, forbiddenLearnerTerms, `${owner}: learner explanation leaks implementation language.`);
      assert.match(question.explanation.application, /\d+°/, `${owner}: item-specific rotation working missing.`);

      for (const [index, svg] of question.stimulusSvgs.entries()) {
        assertSvg(svg, `${owner}:stimulus:${index}`);
        svgChecks += 1;
      }
      for (const [index, svg] of question.optionSvgs.entries()) {
        assertSvg(svg, `${owner}:option:${index}`);
        svgChecks += 1;
      }

      const replay = generateSpatialProductionStudioQuestionV6({ qlId, seed, language }) as any;
      assert.equal(replay.contentFingerprint, question.contentFingerprint, `${owner}: deterministic content replay drift.`);
      assert.equal(replay.geometryFingerprint, question.geometryFingerprint, `${owner}: deterministic geometry replay drift.`);
      assert.equal(replay.correctIndex, question.correctIndex, `${owner}: deterministic answer replay drift.`);
      deterministicReplayChecks += 1;

      const payload = productionPayloadV6(question) as any;
      assert.equal(payload.qlId, qlId, `${owner}: persistence QL drift.`);
      assert.equal(payload.canonicalProblemId, "FFM-001", `${owner}: persistence chapter drift.`);
      assert.equal(payload.optionSvgs.length, 4, `${owner}: persistence lost image options.`);
      assert.equal(payload.questionBankWritable, true, `${owner}: persistence bank gate drift.`);
      assert.equal(payload.testBuilderEligible, true, `${owner}: persistence Test Builder gate drift.`);
      assert.equal(payload.mockTestEligible, false, `${owner}: persistence mock gate opened.`);
      assert.equal(payload.automaticStudentPublication, false, `${owner}: persistence auto-publication opened.`);
      persistencePayloadChecks += 1;

      geometryByQl.get(qlId)!.add(question.geometryFingerprint);
      stemsByQlLanguage.get(`${qlId}:${language}`)!.add(question.stem);
    }

    const en = byLanguage.get("en") as any;
    const hi = byLanguage.get("hi") as any;
    const pa = byLanguage.get("pa") as any;
    assert.equal(en.geometryFingerprint, hi.geometryFingerprint, `${qlId}:${seed}: Hindi geometry parity drift.`);
    assert.equal(en.geometryFingerprint, pa.geometryFingerprint, `${qlId}:${seed}: Punjabi geometry parity drift.`);
    assert.equal(en.contentFingerprint, hi.contentFingerprint, `${qlId}:${seed}: Hindi content parity drift.`);
    assert.equal(en.contentFingerprint, pa.contentFingerprint, `${qlId}:${seed}: Punjabi content parity drift.`);
    assert.equal(en.correctIndex, hi.correctIndex, `${qlId}:${seed}: Hindi answer parity drift.`);
    assert.equal(en.correctIndex, pa.correctIndex, `${qlId}:${seed}: Punjabi answer parity drift.`);
    assert.deepEqual(en.solveFacts, hi.solveFacts, `${qlId}:${seed}: Hindi solve-fact parity drift.`);
    assert.deepEqual(en.solveFacts, pa.solveFacts, `${qlId}:${seed}: Punjabi solve-fact parity drift.`);
    multilingualParityChecks += 2;
  }
}

assert.equal(generated, qlIds.length * languages.length * seeds.length);
assert.equal(deterministicReplayChecks, generated);
assert.equal(persistencePayloadChecks, generated);
assert.equal(multilingualParityChecks, qlIds.length * seeds.length * 2);
for (const qlId of qlIds) {
  assert.ok(geometryByQl.get(qlId)!.size >= 4, `${qlId}: object pool is too thin across proof seeds.`);
  for (const language of languages) {
    assert.ok(stemsByQlLanguage.get(`${qlId}:${language}`)!.size >= 2, `${qlId}/${language}: stem variation is too thin.`);
  }
}

const evidence = {
  status: "PASS_FFM_001_END_TO_END_V1",
  authorityId: FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.authorityId,
  permanentQlIds: qlIds,
  permanentSpatialQlCount: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.permanentQlCount,
  permanentSpatialQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.permanentQlRange,
  nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.nextAvailablePermanentQlId,
  spa001NonCndQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V6.permanentQlCount,
  generated,
  deterministicReplayChecks,
  multilingualParityChecks,
  persistencePayloadChecks,
  svgChecks,
  objectPoolGeometryCounts: Object.fromEntries([...geometryByQl.entries()].map(([key, values]) => [key, values.size])),
  lifecycle: {
    questionStudioDiscoverable: true,
    questionBankWritable: true,
    testBuilderEligible: true,
    mockTestEligible: false,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
    automaticStudentPublication: false,
  },
};

const evidencePath = resolve(process.cwd(), "dist/reasoning-v1/spatial/ffm-001-end-to-end-v1-evidence.json");
mkdirSync(dirname(evidencePath), { recursive: true });
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(evidence.status, evidence);
