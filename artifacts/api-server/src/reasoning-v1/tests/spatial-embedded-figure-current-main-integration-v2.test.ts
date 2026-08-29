import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { matchEmbeddedGraphV1 } from "../foundation/spatial/embedded-figure-graph-v1";
import { EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/embedded-figure-english-freeze-v1";
import { EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/embedded-figure-localization-freeze-v1";
import { generateEmbeddedFigurePermanentEnglishQuestionV1 } from "../foundation/spatial/embedded-figure-permanent-english-runtime-v1";
import { EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/embedded-figure-question-studio-product-owner-approval-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5 } from "../foundation/spatial/spatial-permanent-ql-allocation-v5";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V2 } from "../foundation/spatial/spatial-question-studio-integration-v2";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V3,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "../foundation/spatial/spatial-question-studio-integration-v3";
import {
  generateSpatialProductionStudioBatchV3,
  generateSpatialProductionStudioQuestionV3,
} from "../foundation/spatial/spatial-question-studio-production-v3";

const CURRENT_MAIN_BASE = "2754618366072250467e4d862caa11525d4e0900" as const;
const EMB_QL = "SPA-QL-041" as const;
const LANGUAGES = ["en", "hi", "pa"] as const;

assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.status, "EMB_001_PERMANENT_ENGLISH_RUNTIME_V1_FROZEN");
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.localizationFrozen, true);
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.governance.standardQuestionStudioRegistrationAuthorized, true);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.permanentQlCount, 41);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.permanentQlCount, 40);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.permanentQlCount, 41);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.qlIds.at(-1), EMB_QL);
assert.ok(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.chapters.includes("EMB-001"));
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.questionStudioDiscoverable, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.persistenceAllowed, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.manualApprovalRequired, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.futureGeneratedItemsAutomaticallyApproved, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.automaticStudentPublication, false);

const routeSource = readFileSync("src/routes/admin-question-studio-spatial.ts", "utf8");
assert.ok(routeSource.includes('spatial-question-studio-integration-v3'));
assert.ok(routeSource.includes('spatial-question-studio-production-v3'));
assert.ok(routeSource.includes("embeddedFigureLocalizationAuthority"));
assert.ok(routeSource.includes("PRE_EMB_SPATIAL_QUESTION_STUDIO_PACKAGE_V2"));

function projection(question: ReturnType<typeof generateSpatialProductionStudioQuestionV3>) {
  return {
    qlId: question.qlId,
    chapterCode: question.chapterCode,
    stimulusSvgs: question.stimulusSvgs,
    optionSvgs: question.optionSvgs,
    correctIndex: question.correctIndex,
    answer: question.answer,
    contentFingerprint: question.contentFingerprint,
  };
}

function eligibilityPayload(question: ReturnType<typeof generateSpatialProductionStudioQuestionV3>) {
  return {
    ...question,
    text: question.stem,
    options: [...question.optionLabels],
    correct: question.correctIndex,
    canonicalAnswer: question.answer,
    explanation: [question.explanation.observation, question.explanation.rule, question.explanation.application, question.explanation.check].join("\n\n"),
    difficulty: question.difficultyBand,
    runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
    reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
    questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
    testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
    publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
    mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
    manualApprovalRequired: true,
    automaticStudentPublication: false,
    releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  };
}

const canonicalIds = new Set<string>();
const geometryFingerprints = new Set<string>();
let solverOptionChecks = 0;
let languageParityChecks = 0;
let lifecycleChecks = 0;
let questionBankNormalizationChecks = 0;

for (let index = 0; index < 24; index += 1) {
  const seed = `EMB-CURRENT-MAIN-V2-${index}`;
  const source = generateEmbeddedFigurePermanentEnglishQuestionV1(seed);
  const [en, hi, pa] = LANGUAGES.map((language) => generateSpatialProductionStudioQuestionV3({ qlId: EMB_QL, seed, language }));
  assert.ok(en && hi && pa);

  const solved = source.optionGraphs.map((option) => matchEmbeddedGraphV1(source.targetGraph, option, "FIXED_ORIENTATION"));
  const solvedIndices = solved.map((result, optionIndex) => result.matched ? optionIndex : -1).filter((optionIndex) => optionIndex >= 0);
  assert.deepEqual(solvedIndices, [source.correctIndex]);
  solverOptionChecks += 4;

  assert.deepEqual(projection(hi), projection(en));
  assert.deepEqual(projection(pa), projection(en));
  languageParityChecks += 2;

  for (const question of [en, hi, pa]) {
    assert.equal(question.qlId, EMB_QL);
    assert.equal(question.chapterCode, "EMB-001");
    assert.equal(question.answer, question.optionLabels[question.correctIndex]);
    assert.equal(question.optionSvgs.length, 4);
    assert.equal(new Set(question.optionSvgs).size, 4);
    assert.equal(question.lifecycle.questionStudioDiscoverable, true);
    assert.equal(question.lifecycle.registrationStatus, "REGISTERED");
    assert.equal(question.lifecycle.persistenceAllowed, true);
    assert.equal(question.lifecycle.questionBankStatus, "READY_FOR_STORAGE");
    assert.equal(question.lifecycle.manualApprovalRequired, true);
    assert.equal(question.lifecycle.automaticStudentPublication, false);
    lifecycleChecks += 6;
  }

  const payload = eligibilityPayload(en);
  assert.equal(getGeneratedQuestionBankEligibilityIssue(payload), null);
  assert.equal(getGeneratedItemApprovalDisposition(payload).mode, "question_bank");
  const normalized = normalizeGeneratedQuestionPayload(payload, { itemId: seed, generationRunCode: "EMB-CURRENT-MAIN-V2" });
  assert.equal(normalized.correctIndex, en.correctIndex);
  assert.equal(normalized.options.length, 4);
  assert.ok(normalized.options.every((option) => option.startsWith('<img src="data:image/svg+xml;base64,')));
  assert.ok(normalized.stem.includes('<img src="data:image/svg+xml;base64,'));
  questionBankNormalizationChecks += 1;

  canonicalIds.add(en.canonicalItemId);
  geometryFingerprints.add(en.geometryFingerprint);
  assert.deepEqual(generateSpatialProductionStudioQuestionV3({ qlId: EMB_QL, seed, language: "pa" }), pa);
}

assert.equal(canonicalIds.size, 24);
assert.equal(geometryFingerprints.size, 24);

const embBatch = generateSpatialProductionStudioBatchV3({ seed: "EMB-CURRENT-MAIN-V2-BATCH", qlId: EMB_QL, count: 50, language: "pa" });
assert.equal(embBatch.questions.length, 50);
assert.equal(new Set(embBatch.questions.map((question) => question.contentFingerprint)).size, 50);
assert.ok(embBatch.questions.every((question) => question.qlId === EMB_QL));
assert.equal(embBatch.generationContext.manualApprovalRequired, true);
assert.equal(embBatch.generationContext.automaticStudentPublication, false);

const fullBatch = generateSpatialProductionStudioBatchV3({ seed: "SPA-CURRENT-MAIN-V2-FULL-41", count: 41, language: "en" });
assert.equal(fullBatch.questions.length, 41);
assert.equal(new Set(fullBatch.questions.map((question) => question.qlId)).size, 41);
assert.ok(fullBatch.questions.some((question) => question.qlId === EMB_QL));

const evidence = {
  status: "PASS_EMB_001_CURRENT_NEW_MAIN_INTEGRATION_V2",
  currentMainBaseSha: CURRENT_MAIN_BASE,
  englishFreezeAuthority: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  localizationFreezeAuthority: EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  questionStudioApprovalAuthority: EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  allocationAuthority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.authorityId,
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.permanentQlCount,
  embeddedFigureQlId: EMB_QL,
  reviewedSeedCount: 24,
  reviewedLanguageSurfaceCount: 72,
  solverOptionChecks,
  languageParityChecks,
  lifecycleChecks,
  questionBankNormalizationChecks,
  embeddedFigureBatchCount: embBatch.questions.length,
  fullSpatialBatchCount: fullBatch.questions.length,
  routeUsesIntegrationV3: true,
  routeUsesProductionV3: true,
  inheritedV2PermanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V2.permanentQlCount,
  governance: {
    questionStudioDiscoverable: true,
    generationReviewPersistenceAllowed: true,
    manualGeneratedItemApprovalRequired: true,
    futureGeneratedItemsAutomaticallyApproved: false,
    automaticStudentPublication: false,
    deploymentPerformed: false,
  },
  nextGate: "MERGE_TO_NEW_MAIN",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-emb-001-current-main-integration-v2-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
