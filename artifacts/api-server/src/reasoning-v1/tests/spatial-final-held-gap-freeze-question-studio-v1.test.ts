import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import { listQuestionStudioPackages } from "../../question-studio/shared-generation-engine-sri";
import { productionPayloadV5 } from "../../routes/admin-question-studio-spatial-v5";
import {
  SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1,
  SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1,
  SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1,
} from "../foundation/spatial/spatial-final-held-gap-freeze-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V5,
} from "../foundation/spatial/spatial-question-studio-integration-v5";
import {
  generateSpatialProductionStudioQuestionV5,
} from "../foundation/spatial/spatial-question-studio-production-v5";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9 } from "../foundation/spatial/spatial-permanent-ql-allocation-v9";

const qls = ["SPA-QL-048", "SPA-QL-049", "SPA-QL-050"] as const;
const languages = ["en", "hi", "pa"] as const;

assert.equal(SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1.productOwnerVerdict, "APPROVED");
assert.equal(SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1.reviewedPullRequest, 1359);
assert.equal(SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1.reviewedCi.workflowRunId, 33516904251);
assert.deepEqual(SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1.approvedQlIds, qls);
assert.equal(SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1.learnerContentFrozen, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1.geometryFrozen, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1.answerOwnershipFrozen, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1.rendererFrozen, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1.localizationFrozen, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1.contentMutationAuthorized, false);
assert.equal(SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.persistenceAllowed, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.questionBankWritable, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.questionBankAcceptanceMode, "FULL_RELEASE");
assert.equal(SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.testEligibility, "ELIGIBLE");
assert.equal(SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.testEligible, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.testBuilderEligible, true);
assert.equal(SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.mockTestEligible, false);
assert.equal(SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.publicReleaseAuthorized, false);
assert.equal(SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.studentDeliveryAuthorized, false);
assert.equal(SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.automaticStudentPublication, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.nextAvailablePermanentQlId, "SPA-QL-051");

assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.permanentQlCount, 45);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.qlIds.length, 45);
for (let id = 1; id <= 42; id += 1) {
  assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.qlIds.includes(`SPA-QL-${String(id).padStart(3, "0")}` as never));
}
for (const qlId of qls) assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.qlIds.includes(qlId));
for (const cndQl of ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"] as const) {
  assert(!SPATIAL_QUESTION_STUDIO_PACKAGE_V5.qlIds.includes(cndQl as never), `${cndQl} must remain in the separate CND package.`);
}
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.mockTestEligible, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.publicReleaseAuthorized, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.studentDeliveryAuthorized, false);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.automaticStudentPublication, false);

const packageList = listQuestionStudioPackages();
const spaPackages = packageList.filter((entry: any) => String(entry.packageId) === "SPA-001");
const cndPackages = packageList.filter((entry: any) => String(entry.packageId) === "SPA-001-CND-001-REVIEW");
assert.equal(spaPackages.length, 1, "Shared Question Studio must expose SPA-001 exactly once.");
assert.equal(cndPackages.length, 1, "Shared Question Studio must retain CND as a separate package.");
assert.equal(Number((spaPackages[0] as any).permanentQlCount), 45);
assert.equal((spaPackages[0] as any).testBuilderEligible, true);
assert.equal((spaPackages[0] as any).mockTestEligible, false);
assert.equal((spaPackages[0] as any).publicReleaseAuthorized, false);
assert.equal((spaPackages[0] as any).studentDeliveryAuthorized, false);

const metrics = {
  generated: 0,
  deterministicReplays: 0,
  bankEligibilityChecks: 0,
  normalizedConversionChecks: 0,
  numericPersistenceChecks: 0,
  imagePersistenceChecks: 0,
  languageCounts: { en: 0, hi: 0, pa: 0 },
  qlCounts: { "SPA-QL-048": 0, "SPA-QL-049": 0, "SPA-QL-050": 0 },
};

function learnerText(question: ReturnType<typeof generateSpatialProductionStudioQuestionV5>): string {
  return [
    question.stem,
    question.explanation.observation,
    question.explanation.rule,
    question.explanation.application,
    question.explanation.check,
  ].join("\n").toLowerCase();
}

for (const qlId of qls) {
  for (const language of languages) {
    for (let index = 0; index < 24; index += 1) {
      const seed = `spa-final-freeze-v1:${qlId}:${language}:${index}`;
      const question = generateSpatialProductionStudioQuestionV5({ qlId, language, seed });
      const replay = generateSpatialProductionStudioQuestionV5({ qlId, language, seed });
      assert.deepEqual(replay, question, `${qlId}/${language}/${index}: deterministic replay mismatch.`);
      metrics.generated += 1;
      metrics.deterministicReplays += 1;
      metrics.languageCounts[language] += 1;
      metrics.qlCounts[qlId] += 1;

      assert.equal(question.packageId, "SPA-001");
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority);
      assert.equal(question.lifecycle.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(question.lifecycle.questionBankWritable, true);
      assert.equal(question.lifecycle.questionBankAcceptanceMode, "FULL_RELEASE");
      assert.equal(question.lifecycle.testEligibility, "ELIGIBLE");
      assert.equal(question.lifecycle.testEligible, true);
      assert.equal(question.lifecycle.testBuilderEligible, true);
      assert.equal(question.lifecycle.publiclyPublishable, true);
      assert.equal(question.lifecycle.mockTestEligible, false);
      assert.equal(question.lifecycle.publicReleaseAuthorized, false);
      assert.equal(question.lifecycle.studentDeliveryAuthorized, false);
      assert.equal(question.lifecycle.automaticStudentPublication, false);
      assert.equal(question.lifecycle.manualApprovalRequired, true);
      assert.equal(question.sourceFreezeAuthority, SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1.authorityId);
      assert.match(question.stimulusSvgs[0], /<rect[^>]+fill="white"/iu);
      assert.match(question.stimulusSvgs[0], /stroke="#111827"/iu);
      assert.match(question.stimulusSvgs[0], /stroke-width="1\.35"/iu);
      assert.doesNotMatch(question.stimulusSvgs[0], /stroke-width="2\.2"|stroke="black"/iu);
      const text = learnerText(question);
      for (const forbidden of ["solver-attested", "renderer authority", "runtime proof", "geometry fingerprint", "canonical fingerprint"]) {
        assert(!text.includes(forbidden), `${qlId}/${language}/${index}: internal learner term leaked: ${forbidden}`);
      }
      if (language === "hi") assert(/[\u0900-\u097F]/u.test(text));
      if (language === "pa") assert(/[\u0A00-\u0A7F]/u.test(text));

      const payload = productionPayloadV5(question) as Record<string, unknown>;
      assert.equal(payload.packageId, "SPA-001");
      assert.equal(payload.qlId, qlId);
      assert.equal(payload.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(payload.questionBankWritable, true);
      assert.equal(payload.questionBankAcceptanceMode, "FULL_RELEASE");
      assert.equal(payload.testEligibility, "ELIGIBLE");
      assert.equal(payload.testEligible, true);
      assert.equal(payload.testBuilderEligible, true);
      assert.equal(payload.mockTestEligible, false);
      assert.equal(payload.publicReleaseAuthorized, false);
      assert.equal(payload.studentDeliveryAuthorized, false);
      assert.equal(payload.automaticStudentPublication, false);
      assert.equal(getGeneratedQuestionBankEligibilityIssue(payload), null);
      metrics.bankEligibilityChecks += 1;

      if (qlId === "SPA-QL-048" || qlId === "SPA-QL-049") {
        assert.equal((payload.renderer as Record<string, unknown>).kind, "SVG_WITH_NUMERIC_OPTIONS");
        assert(Array.isArray(payload.options) && payload.options.length === 4);
        assert((payload.options as unknown[]).every((value) => typeof value === "number"));
        assert.equal("optionSvgs" in payload, false, "Numeric option preview SVGs must not persist to Question Bank conversion.");
        metrics.numericPersistenceChecks += 1;
      } else {
        assert.equal((payload.renderer as Record<string, unknown>).kind, "SVG_WITH_IMAGE_OPTIONS");
        assert(Array.isArray(payload.optionSvgs) && payload.optionSvgs.length === 4);
        assert(Array.isArray(payload.options) && payload.options.length === 4);
        metrics.imagePersistenceChecks += 1;
      }

      const normalized = normalizeGeneratedQuestionPayload(payload, {
        itemId: `test-${qlId}-${language}-${index}`,
        generationRunCode: "SPA-FREEZE-V1-TEST",
      });
      assert.equal(normalized.options.length, 4);
      assert.equal(normalized.correctIndex, question.correctIndex);
      assert.match(normalized.stem, /data:image\/svg\+xml;base64,/u);
      const generation = normalized.answerModel.generation as Record<string, unknown>;
      assert.equal(generation.qlId, qlId);
      assert.equal(generation.mockTestEligible, false);
      assert.equal(generation.automaticStudentPublication, false);
      metrics.normalizedConversionChecks += 1;
    }
  }
}

const ql001 = generateSpatialProductionStudioQuestionV5({ qlId: "SPA-QL-001", language: "en", seed: "spa-v5-regression-001" });
const ql042 = generateSpatialProductionStudioQuestionV5({ qlId: "SPA-QL-042", language: "en", seed: "spa-v5-regression-042" });
assert.equal(ql001.qlId, "SPA-QL-001");
assert.equal(ql042.qlId, "SPA-QL-042");
assert.equal(ql001.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority);
assert.equal(ql042.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority);

const cwd = process.cwd();
const registry = readFileSync(resolve(cwd, "src/routes/admin-question-studio-registry.ts"), "utf8");
const workflow = readFileSync(resolve(cwd, "src/routes/admin-question-studio-spatial-workflow.ts"), "utf8");
const sharedEngine = readFileSync(resolve(cwd, "src/question-studio/shared-generation-engine-sri.ts"), "utf8");
assert.match(registry, /adminQuestionStudioSpatialWorkflowRouter/u);
assert.match(registry, /adminQuestionStudioSpatialV5Router/u);
assert(registry.indexOf("router.use(adminQuestionStudioSpatialWorkflowRouter)") < registry.indexOf("router.use(adminQuestionStudioSpatialV5Router)"));
assert(registry.indexOf("router.use(adminQuestionStudioSpatialV5Router)") < registry.indexOf("router.use(adminQuestionStudioSpatialRouter)"));
assert.match(workflow, /const SPA_PACKAGE_ID = "SPA-001"/u);
assert.match(workflow, /req\.url = "\/reasoning\/spatial\/runs"/u);
assert.match(sharedEngine, /SPA_001_QUESTION_STUDIO_PACKAGE/u);
assert.match(sharedEngine, /SPATIAL_QUESTION_STUDIO_PACKAGE_V5/u);

const evidence = {
  status: "PASS_SPA_FINAL_HELD_GAP_FREEZE_QUESTION_STUDIO_V1",
  approvalAuthority: SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  freezeAuthority: SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1.authorityId,
  activationAuthority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.authorityId,
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority,
  productionQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.permanentQlCount,
  globalPermanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.permanentQlRange,
  nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.nextAvailablePermanentQlId,
  activatedQlIds: qls,
  cndQlIdsRemainSeparate: ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"],
  metrics,
  gates: {
    questionStudio: true,
    persistence: true,
    questionBank: true,
    testBuilder: true,
    manualApprovalRequired: true,
    mockTest: false,
    publicRelease: false,
    studentDelivery: false,
    automaticStudentPublication: false,
  },
};

const outDir = resolve(cwd, "dist/reasoning-v1/spatial");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "spa-final-held-gap-freeze-question-studio-v1-evidence.json"), JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence));
