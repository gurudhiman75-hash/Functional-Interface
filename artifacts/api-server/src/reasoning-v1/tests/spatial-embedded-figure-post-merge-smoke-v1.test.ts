import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { matchEmbeddedGraphV1 } from "../foundation/spatial/embedded-figure-graph-v1";
import { generateEmbeddedFigurePermanentEnglishQuestionV1 } from "../foundation/spatial/embedded-figure-permanent-english-runtime-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V3,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "../foundation/spatial/spatial-question-studio-integration-v3";
import {
  generateSpatialProductionStudioBatchV3,
  generateSpatialProductionStudioQuestionV3,
} from "../foundation/spatial/spatial-question-studio-production-v3";

const CURRENT_NEW_MAIN = "71b5ad3b862d4bf5ac7de544f7b09e81c7b3f86d" as const;
const EMB_QL = "SPA-QL-041" as const;
const LANGUAGES = ["en", "hi", "pa"] as const;

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
assert.ok(routeSource.includes("'review'::generation_run_status"));
assert.ok(routeSource.includes("'unreviewed'::generation_item_status"));
assert.ok(routeSource.includes("manualApprovalRequired: true"));
assert.ok(routeSource.includes("automaticStudentPublication: false"));
assert.ok(routeSource.includes("questionBankConversionEligibleAfterApproval: true"));
assert.ok(routeSource.includes("testEligibleAfterApproval: true"));

let solverOptionChecks = 0;
let parityChecks = 0;
let lifecycleChecks = 0;
let qbChecks = 0;
const fingerprints = new Set<string>();

for (let index = 0; index < 12; index += 1) {
  const seed = `EMB-POST-MERGE-SMOKE-${index}`;
  const source = generateEmbeddedFigurePermanentEnglishQuestionV1(seed);
  const surfaces = LANGUAGES.map((language) =>
    generateSpatialProductionStudioQuestionV3({ qlId: EMB_QL, seed, language }),
  );
  const [en, hi, pa] = surfaces;
  assert.ok(en && hi && pa);

  const solvedIndices = source.optionGraphs
    .map((option, optionIndex) =>
      matchEmbeddedGraphV1(source.targetGraph, option, "FIXED_ORIENTATION").matched ? optionIndex : -1,
    )
    .filter((optionIndex) => optionIndex >= 0);
  assert.deepEqual(solvedIndices, [source.correctIndex]);
  solverOptionChecks += 4;

  const projection = (question: typeof en) => ({
    stimulusSvgs: question.stimulusSvgs,
    optionSvgs: question.optionSvgs,
    correctIndex: question.correctIndex,
    answer: question.answer,
    contentFingerprint: question.contentFingerprint,
  });
  assert.deepEqual(projection(hi), projection(en));
  assert.deepEqual(projection(pa), projection(en));
  parityChecks += 2;

  for (const question of surfaces) {
    assert.equal(question.qlId, EMB_QL);
    assert.equal(question.chapterCode, "EMB-001");
    assert.equal(question.optionSvgs.length, 4);
    assert.equal(question.answer, question.optionLabels[question.correctIndex]);
    assert.equal(question.lifecycle.questionStudioDiscoverable, true);
    assert.equal(question.lifecycle.registrationStatus, "REGISTERED");
    assert.equal(question.lifecycle.persistenceAllowed, true);
    assert.equal(question.lifecycle.manualApprovalRequired, true);
    assert.equal(question.lifecycle.automaticStudentPublication, false);
    lifecycleChecks += 5;
  }

  const payload = {
    ...en,
    text: en.stem,
    options: [...en.optionLabels],
    correct: en.correctIndex,
    canonicalAnswer: en.answer,
    explanation: [
      en.explanation.observation,
      en.explanation.rule,
      en.explanation.application,
      en.explanation.check,
    ].join("\n\n"),
    difficulty: en.difficultyBand,
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
  assert.equal(getGeneratedQuestionBankEligibilityIssue(payload), null);
  assert.equal(getGeneratedItemApprovalDisposition(payload).mode, "question_bank");
  const normalized = normalizeGeneratedQuestionPayload(payload, {
    itemId: seed,
    generationRunCode: "EMB-POST-MERGE-SMOKE",
  });
  assert.equal(normalized.correctIndex, en.correctIndex);
  assert.equal(normalized.options.length, 4);
  qbChecks += 1;
  fingerprints.add(en.contentFingerprint);
}

assert.equal(fingerprints.size, 12);
for (const language of LANGUAGES) {
  const batch = generateSpatialProductionStudioBatchV3({
    seed: `EMB-POST-MERGE-${language}`,
    qlId: EMB_QL,
    count: 10,
    language,
  });
  assert.equal(batch.questions.length, 10);
  assert.equal(new Set(batch.questions.map((question) => question.contentFingerprint)).size, 10);
  assert.ok(batch.questions.every((question) => question.qlId === EMB_QL));
  assert.equal(batch.generationContext.manualApprovalRequired, true);
  assert.equal(batch.generationContext.automaticStudentPublication, false);
}

const evidence = {
  status: "PASS_EMB_001_POST_MERGE_SMOKE_V1",
  currentNewMainSha: CURRENT_NEW_MAIN,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.permanentQlCount,
  embeddedFigureQlId: EMB_QL,
  sampledSeeds: 12,
  sampledLanguageSurfaces: 36,
  solverOptionChecks,
  languageParityChecks: parityChecks,
  lifecycleChecks,
  questionBankChecks: qbChecks,
  languageBatchChecks: 3,
  perLanguageBatchCount: 10,
  persistenceContract: {
    runStatus: "review",
    generatedItemStatus: "unreviewed",
    manualApprovalRequired: true,
    questionBankConversionEligibleAfterApproval: true,
    testEligibleAfterApproval: true,
    automaticStudentPublication: false,
  },
  deploymentPerformed: false,
  nextGate: "CLOSE_EMB_001_AND_SELECT_SPA_QL_042",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-emb-001-post-merge-smoke-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence, null, 2));
