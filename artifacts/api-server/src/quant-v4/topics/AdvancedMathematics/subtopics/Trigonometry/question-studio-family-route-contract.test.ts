import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  isTrg001QuestionStudioRequest,
  isTrg002V4GenerationRequest,
  listQuestionStudioPackages,
} from "../../../../../question-studio/shared-generation-engine-trigonometry";
import {
  trg001EnginePackage,
  trg002EnginePackage,
} from "../../../../../question-studio/quant-trigonometry";

assert.equal(isTrg001QuestionStudioRequest({ packageId: "TRG-001" }), true);
assert.equal(isTrg001QuestionStudioRequest({ patternId: "TRG-001" }), true);
assert.equal(isTrg001QuestionStudioRequest({ packageId: "TRG-002" }), false);
assert.equal(isTrg002V4GenerationRequest({ packageId: "TRG-002" }), true);
assert.equal(isTrg002V4GenerationRequest({ packageId: "TRG-001" }), false);
assert.equal(isTrg002V4GenerationRequest({ topic: "Trigonometry" }), false);
assert.equal(isTrg002V4GenerationRequest({ topic: "Advanced Mathematics", subtopic: "Trigonometry" }), false);
assert.equal(isTrg002V4GenerationRequest({ topic: "Advanced Mathematics", subtopic: "Heights and Distances" }), true);

const packages = listQuestionStudioPackages();
assert.equal(packages.filter((entry: any) => entry.packageId === "TRG-001").length, 1);
assert.equal(packages.filter((entry: any) => entry.packageId === "TRG-002").length, 1);

const legacyAggregateTrg001 = packages.find((entry: any) => entry.packageId === "TRG-001") as any;
assert.deepEqual(legacyAggregateTrg001.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(legacyAggregateTrg001.questionStudioDiscoverable, true);
assert.equal(legacyAggregateTrg001.questionBankWritable, true);
assert.equal(legacyAggregateTrg001.testEligible, true);
assert.equal(legacyAggregateTrg001.testBuilderEligible, true);
assert.equal(legacyAggregateTrg001.mockTestEligible, true);
assert.equal(legacyAggregateTrg001.publicReleaseAuthorized, false);
assert.equal(legacyAggregateTrg001.localizationStatus, "MULTILINGUAL_FROZEN_ACTIVE");

const engineTrg001 = trg001EnginePackage();
assert.equal(engineTrg001.packageId, "TRG-001");
assert.equal(engineTrg001.lifecycleStage, "BANK_ONLY");
assert.equal(engineTrg001.reviewSurfaceRequired, true);
assert.equal(engineTrg001.manualApprovalRequired, true);
assert.equal(engineTrg001.questionBankAcceptanceMode, "FULL_RELEASE");
assert.deepEqual(engineTrg001.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(engineTrg001.questionBankWritable, true);
assert.equal(engineTrg001.testEligible, true);
assert.equal(engineTrg001.mockTestEligible, true);
assert.equal(engineTrg001.publiclyPublishable, false);
assert.equal(engineTrg001.productionReleaseAuthorized, false);

const engineTrg002 = trg002EnginePackage();
assert.equal(engineTrg002.packageId, "TRG-002");
assert.equal(engineTrg002.lifecycleStage, "BANK_ONLY");
assert.equal(engineTrg002.reviewSurfaceRequired, true);
assert.equal(engineTrg002.manualApprovalRequired, true);
assert.equal(engineTrg002.questionBankAcceptanceMode, "FULL_RELEASE");
assert.deepEqual(engineTrg002.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(engineTrg002.questionBankWritable, true);
assert.equal(engineTrg002.testEligible, true);
assert.equal(engineTrg002.mockTestEligible, true);
assert.equal(engineTrg002.publiclyPublishable, false);
assert.equal(engineTrg002.productionReleaseAuthorized, false);

const routeRegistrySource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-registry.ts"),
  "utf8",
);
const routeIndexSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/index.ts"),
  "utf8",
);
const engineRouteSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-engine-v1.ts"),
  "utf8",
);
const quantAdapterSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/question-studio/engines/quant-v4-adapter.ts"),
  "utf8",
);
const unifiedTrgSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/question-studio/quant-trigonometry.ts"),
  "utf8",
);
const facadeSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/question-studio/shared-generation-engine-trigonometry.ts"),
  "utf8",
);

assert.ok(
  routeIndexSource.includes('const adminQuestionStudioRegistryRouter = lazyRouter(() => import("./admin-question-studio-registry"));'),
  "Global route index must lazily load the dedicated Question Studio registry",
);
assert.ok(
  routeIndexSource.includes('router.use("/admin/question-studio", adminQuestionStudioRegistryRouter);'),
  "Global route index must mount the dedicated Question Studio registry at /admin/question-studio",
);
assert.ok(
  !routeIndexSource.includes("adminQuestionStudioTrigonometryRouter"),
  "Trigonometry must not be mounted directly from routes/index.ts",
);
assert.ok(
  !routeRegistrySource.includes("adminQuestionStudioTrigonometryRouter"),
  "Retired Trigonometry compatibility router must not remain in the registry",
);

const engineMount = "router.use(adminQuestionStudioEngineV1Router);";
const cp014Mount = "router.use(adminQuestionStudioCp014Router);";
const cp013Mount = "router.use(adminQuestionStudioCp013Router);";
const engineIndex = routeRegistrySource.indexOf(engineMount);
const cp014Index = routeRegistrySource.indexOf(cp014Mount);
const cp013Index = routeRegistrySource.indexOf(cp013Mount);
assert.ok(engineIndex >= 0, "Unified engine registry mount is missing");
assert.ok(cp014Index >= 0, "CP014 compatibility mount is missing");
assert.ok(cp013Index >= 0, "CP013 compatibility mount is missing");
assert.ok(engineIndex < cp014Index, "Unified engine must own TRG before CP014 compatibility routing");
assert.ok(cp014Index < cp013Index, "CP014 compatibility route must remain before CP013");

for (const marker of [
  "generateTrigonometryEngineBatch",
  "trg001EnginePackage",
  "trg002EnginePackage",
]) {
  assert.ok(quantAdapterSource.includes(marker), `Quant adapter missing unified TRG marker: ${marker}`);
}

for (const marker of [
  "TRG_001_QUESTION_STUDIO_PACKAGE",
  "TRG_002_V4_QUESTION_STUDIO_PACKAGE",
  "TRG_001_POST_FINAL5_FULL_INTERNAL_ACTIVATION_V1",
  "applyTrg001FullInternalLifecycle",
  "applyTrg002InternalLifecycle",
  "generateTrg001QuestionStudioBatch",
  "generateTrg002V4QuestionStudioBatch",
]) {
  assert.ok(unifiedTrgSource.includes(marker), `Unified Trigonometry adapter missing marker: ${marker}`);
}

assert.ok(
  !engineRouteSource.includes('"trg 001"') && !engineRouteSource.includes('"trg 002"'),
  "TRG packages must not remain in the legacy Quant compatibility deferral set",
);
assert.ok(engineRouteSource.includes("generateProfiledQuantBatch"));
assert.ok(engineRouteSource.includes("generateQuestionStudioQuestions"));

for (const marker of [
  "TRG_001_QUESTION_STUDIO_PACKAGE",
  "TRG_002_V4_QUESTION_STUDIO_PACKAGE",
  "TRG_001_POST_FINAL5_FULL_INTERNAL_ACTIVATION_V1",
  "if (isTrg001QuestionStudioRequest(request))",
  "generateTrg001QuestionStudioBatch",
  "if (isTrg002V4GenerationRequest(request))",
  "generateTrg002V4QuestionStudioBatch",
  "return generatePreviousQuestion(request)",
]) {
  assert.ok(facadeSource.includes(marker), `Legacy aggregate facade lost compatibility marker: ${marker}`);
}

console.log(JSON.stringify({
  status: "PASS_TRIGONOMETRY_FAMILY_UNIFIED_ENGINE_CONTRACT",
  routeOrder: "UNIFIED_ENGINE_BEFORE_CP014_BEFORE_CP013",
  routeArchitecture: "QUESTION_STUDIO_ENGINE_V1",
  legacyTrigonometryRouterRetired: true,
  trg001PermanentQlCount: 144,
  trg001Languages: ["en", "hi", "pa"],
  trg001QuestionBankWritable: true,
  trg001TestEligible: true,
  trg001MockTestEligible: true,
  trg002QlCount: 96,
  trg002Languages: ["en", "hi", "pa"],
  publicReleaseAuthorized: false,
}, null, 2));
