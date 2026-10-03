import { strict as assert } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// This test is bundled into dist/ for CI, so import.meta.dirname points at the
// generated bundle rather than the TypeScript source tree. Resolve source from
// the working directory instead and support both package-root and repo-root
// invocation.
const packageSourceRoot = resolve(process.cwd(), "src");
const sourceRoot = existsSync(resolve(packageSourceRoot, "routes"))
  ? packageSourceRoot
  : resolve(process.cwd(), "artifacts/api-server/src");

const engineRoute = readFileSync(
  resolve(sourceRoot, "routes/admin-question-studio-engine-v1.ts"),
  "utf8",
);
const mixedRoute = readFileSync(
  resolve(sourceRoot, "routes/admin-question-studio-mixed-difficulty.ts"),
  "utf8",
);
const questionStudioRegistry = readFileSync(
  resolve(sourceRoot, "routes/admin-question-studio-registry.ts"),
  "utf8",
);
const routeIndex = readFileSync(resolve(sourceRoot, "routes/index.ts"), "utf8");
const sharedReviewRoute = readFileSync(
  resolve(sourceRoot, "routes/admin-question-studio.ts"),
  "utf8",
);
const examProfileRoute = readFileSync(
  resolve(sourceRoot, "routes/admin-question-studio-exam-profiles.ts"),
  "utf8",
);
const quantProfile = readFileSync(
  resolve(sourceRoot, "question-studio/quant-exam-profile.ts"),
  "utf8",
);

// Capabilities become engine-aware without removing the legacy field.
assert.match(engineRoute, /generationSystem:\s*"quant-v4"/);
assert.match(engineRoute, /defaultGenerationSystem:\s*"quant-v4"/);
assert.match(engineRoute, /generationSystems/);
assert.match(engineRoute, /listQuestionStudioPackages\(\)/);
assert.match(engineRoute, /engineId:\s*pkg\.engineId/);
assert.match(engineRoute, /validatePackageLanguage/);
assert.match(engineRoute, /UNSUPPORTED_PACKAGE_LANGUAGE/);
assert.match(engineRoute, /validatePackageDifficulty/);
assert.match(engineRoute, /DIFFICULTY_FILTER_UNSUPPORTED/);
assert.match(engineRoute, /UNSUPPORTED_PACKAGE_DIFFICULTY/);
assert.match(engineRoute, /validatePackageRuntimeMode/);
assert.match(engineRoute, /UNSUPPORTED_PACKAGE_RUNTIME_MODE/);
assert.match(engineRoute, /supportedRuntimeModes\.includes\(requested\)/);
assert.match(engineRoute, /requested === pkg\.runtimeMode/);
assert.match(engineRoute, /INVALID_GENERATION_COUNT/);
assert.match(engineRoute, /TOO_MANY_SELECTED_CPS/);
assert.doesNotMatch(engineRoute, /slice\(0, 50\)/);
assert.match(engineRoute, /subject = selectedPackage/);
assert.match(engineRoute, /topic = selectedPackage\?\.topic/);
assert.match(engineRoute, /subtopic = selectedPackage\?\.subtopic/);

// Lifecycle is also package-generic; future engines must not need subject-specific capability fields.
for (const field of [
  "lifecycleId",
  "lifecycleStage",
  "reviewSurfaceRequired",
  "manualApprovalRequired",
  "questionBankWritable",
  "questionBankAcceptanceMode",
  "questionBankAcceptanceAuthority",
  "testEligible",
  "mockTestEligible",
  "automaticStudentPublication",
  "productionReleaseAuthorized",
]) {
  assert.match(engineRoute, new RegExp(`${field}:\\s*pkg\\.${field}`));
}

// Quant and non-Quant share the canonical persistence route. Quant takes the
// profile-aware generation branch. Only the explicitly enumerated bespoke
// generic Quant compatibility packages/selectors may fall through.
assert.match(engineRoute, /selectedEngineId === "quant-v4"/);
assert.match(engineRoute, /generateProfiledQuantBatch/);
assert.match(engineRoute, /selectedCpIds/);
assert.match(engineRoute, /questions\.length !== request\.count/);
assert.match(engineRoute, /expected exactly \$\{request\.count\}/);
assert.match(engineRoute, /difficultyDistribution/);
assert.doesNotMatch(engineRoute, /nonQuantRunGate/);
assert.match(engineRoute, /shouldDeferQuantCompatibilityRun/);
assert.match(engineRoute, /LEGACY_GENERIC_QUANT_PACKAGES/);
for (const packageId of [
  "sap",
]) {
  assert.equal(
    engineRoute.includes(`"${packageId}"`),
    true,
    `Quant compatibility package ${packageId} must remain explicitly deferred`,
  );
}
assert.match(engineRoute, /next\("route"\)/);
assert.doesNotMatch(engineRoute, /router\.use\(authenticate\)/);
assert.match(quantProfile, /buildQuantExamProfilePlan/);
assert.match(quantProfile, /generateProfiledQuantBatch/);
assert.match(quantProfile, /cpCounts/);
const legacyQuantPackagesStart = engineRoute.indexOf("const LEGACY_GENERIC_QUANT_PACKAGES");
const legacyQuantPackagesEnd = engineRoute.indexOf("]);", legacyQuantPackagesStart);
assert.ok(legacyQuantPackagesStart >= 0 && legacyQuantPackagesEnd > legacyQuantPackagesStart);
const legacyQuantPackagesBlock = engineRoute.slice(
  legacyQuantPackagesStart,
  legacyQuantPackagesEnd + 3,
);
assert.doesNotMatch(legacyQuantPackagesBlock, /"avg 001"/);
assert.doesNotMatch(legacyQuantPackagesBlock, /"tmw 001"/);
assert.doesNotMatch(legacyQuantPackagesBlock, /"num 001"/);
assert.doesNotMatch(legacyQuantPackagesBlock, /"num 002"/);
assert.match(engineRoute, /isNum001UnifiedRequest/);
assert.match(engineRoute, /packageId === "num 001"/);
assert.match(engineRoute, /isLegacyNum002QuestionLanguageId/);
assert.match(engineRoute, /includesLegacyNum002CpIds/);
assert.match(engineRoute, /"NUM-CP-013"/);
assert.match(engineRoute, /"NUM-CP-014"/);
assert.doesNotMatch(
  engineRoute.slice(
    engineRoute.indexOf("const LEGACY_NUMBER_SYSTEM_CPS"),
    engineRoute.indexOf("]);", engineRoute.indexOf("const LEGACY_NUMBER_SYSTEM_CPS")) + 3,
  ),
  /"NUM-CP-008"/,
);
assert.match(engineRoute, /number >= 237 && number <= 253/);
assert.match(engineRoute, /LEGACY_NUM002_CP_MIX_UNSUPPORTED/);
assert.doesNotMatch(engineRoute, /patternId\.includes\("num cp 008"\)/);
assert.doesNotMatch(engineRoute, /patternId\.includes\("num cp 012"\)/);
assert.match(engineRoute, /patternId\.includes\("num cp 013"\)/);
assert.match(engineRoute, /patternId\.includes\("num cp 014"\)/);
assert.match(engineRoute, /packageId === "AVG-001"/);
assert.match(engineRoute, /packageId === "TMW-001"/);
assert.match(engineRoute, /isBankingSapCompatibilityRequest/);
assert.match(engineRoute, /resolveLegacyQuantExamProfile/);
assert.match(engineRoute, /legacyProfile === "BANKING_PRELIMS"/);
assert.match(engineRoute, /legacyProfile === "BANKING_MAINS"/);
assert.match(engineRoute, /packageId === "sap"/);
assert.match(engineRoute, /isBankingSapCompatibilityRequest\(\(req\.body \?\? \{\}\)/);
assert.doesNotMatch(engineRoute, /"trg 001"/);
assert.doesNotMatch(engineRoute, /"trg 002"/);

// New-engine runs persist engine provenance in all important records.
assert.match(engineRoute, /engineId:\s*result\.engineId/);
assert.match(engineRoute, /generationSystem:\s*result\.engineId/);
assert.match(engineRoute, /\$\{result\.engineId\}/);
assert.match(engineRoute, /generationContext/);
assert.match(engineRoute, /const packageLifecycle = selectedPackage/);
assert.match(engineRoute, /\.\.\.packageLifecycle/);
assert.match(engineRoute, /packageLifecycle,/);

// The mixed-difficulty compatibility surface is now read-only and exposes only
// the Quant exam-profile catalog. It must not remount the canonical engine route.
assert.doesNotMatch(mixedRoute, /adminQuestionStudioEngineV1Router/);
assert.match(mixedRoute, /router\.use\(adminQuestionStudioExamProfilesRouter\)/);
assert.match(examProfileRoute, /router\.get\(\s*"\/exam-profiles"/);
assert.match(examProfileRoute, /listQuantExamProfiles/);
assert.doesNotMatch(examProfileRoute, /router\.post\(\s*"\/runs"/);
assert.doesNotMatch(examProfileRoute, /generateQuantV4Questions/);

// New-main owns Question Studio composition through the canonical registry.
// The mixed-difficulty compatibility router must be registered there before the
// catch-all router. The global route index mounts only the registry and must not
// directly mount either the mixed router or the engine facade.
assert.match(
  questionStudioRegistry,
  /adminQuestionStudioMixedDifficultyRouter from "\.\/admin-question-studio-mixed-difficulty"/,
);
const mixedRegistryUse = questionStudioRegistry.indexOf(
  "router.use(adminQuestionStudioMixedDifficultyRouter)",
);
const catchAllRegistryUse = questionStudioRegistry.indexOf(
  "router.use(adminQuestionStudioRouter)",
);
assert.equal(mixedRegistryUse >= 0, true);
assert.equal(catchAllRegistryUse >= 0, true);
assert.equal(mixedRegistryUse < catchAllRegistryUse, true);

assert.match(
  routeIndex,
  /adminQuestionStudioRegistryRouter from "\.\/admin-question-studio-registry"/,
);
assert.match(
  routeIndex,
  /router\.use\("\/admin\/question-studio", adminQuestionStudioRegistryRouter\)/,
);
assert.doesNotMatch(routeIndex, /adminQuestionStudioMixedDifficultyRouter/);
assert.doesNotMatch(routeIndex, /adminQuestionStudioEngineV1Router/);


// The final shared router owns paged review only. Bulk review is owned by the
// hardened router mounted earlier; all standard generation is owned by engine-v1.
assert.doesNotMatch(sharedReviewRoute, /router\.post\("\/runs"/);
assert.doesNotMatch(sharedReviewRoute, /router\.get\("\/capabilities"/);
assert.match(sharedReviewRoute, /router\.get\("\/review-page"/);
assert.match(sharedReviewRoute, /reviewSummary/);
assert.match(sharedReviewRoute, /'needsFix'/);
assert.match(sharedReviewRoute, /'rejected'/);
assert.doesNotMatch(sharedReviewRoute, /router\.patch\("\/items\/bulk"/);

const bulkHardeningRoute = readFileSync(
  resolve(sourceRoot, "routes/admin-question-studio-bulk-hardening.ts"),
  "utf8",
);
const qualityRoute = readFileSync(
  resolve(sourceRoot, "routes/admin-question-studio-quality.ts"),
  "utf8",
);
const regenerationRoute = readFileSync(
  resolve(sourceRoot, "routes/admin-question-studio-regeneration.ts"),
  "utf8",
);
const probabilityRoute = readFileSync(
  resolve(sourceRoot, "routes/admin-question-studio-probability.ts"),
  "utf8",
);
const contentReviewRoute = readFileSync(
  resolve(sourceRoot, "routes/admin-content-review.ts"),
  "utf8",
);

assert.match(bulkHardeningRoute, /MAX_BULK_REVIEW_ITEMS = 500/);
assert.match(qualityRoute, /MAX_BULK_REVIEW_ITEMS = 500/);
assert.doesNotMatch(bulkHardeningRoute, /slice\(0, 500\)/);
assert.doesNotMatch(qualityRoute, /slice\(0, 100\)/);
assert.match(bulkHardeningRoute, /TOO_MANY_REVIEW_ITEMS/);
assert.match(qualityRoute, /TOO_MANY_REVIEW_ITEMS/);
assert.match(qualityRoute, /INVALID_GENERATION_ITEM_ID/);
assert.match(qualityRoute, /QUESTION_STUDIO_DUPLICATE_BLOCKED/);
assert.match(qualityRoute, /normalizedStem/);
assert.match(qualityRoute, /contentFingerprint/);
assert.match(bulkHardeningRoute, /INVALID_GENERATION_ITEM_ID/);
assert.match(regenerationRoute, /MAX_REGENERATION_ITEMS = 50/);
assert.match(regenerationRoute, /TOO_MANY_REGENERATION_ITEMS/);
assert.match(regenerationRoute, /INVALID_GENERATION_ITEM_ID/);
assert.match(bulkHardeningRoute, /GENERATION_RUN_CANCELLED/);
assert.match(qualityRoute, /GENERATION_RUN_CANCELLED/);
assert.match(qualityRoute, /GENERATION_ITEM_VERSION_CONFLICT/);
assert.match(qualityRoute, /delete nextPayload\.contentFingerprint/);
assert.match(qualityRoute, /INVALID_EXPECTED_VERSION/);
assert.match(regenerationRoute, /GENERATION_RUN_CANCELLED/);
assert.doesNotMatch(probabilityRoute, /native-review\/items\/:itemId\/decision/);
assert.doesNotMatch(probabilityRoute, /reviewer_user_id/);
assert.match(contentReviewRoute, /GENERATION_RUN_CANCELLED/);
assert.match(contentReviewRoute, /GENERATION_ITEM_ALREADY_CONVERTED/);
assert.match(contentReviewRoute, /r\.status <> 'cancelled'::generation_run_status/);
assert.doesNotMatch(regenerationRoute, /slice\(0, 50\)/);
assert.match(
  bulkHardeningRoute,
  /Generated item is already converted to Question Bank; review the canonical question instead/,
);
assert.match(bulkHardeningRoute, /APPROVED_REOPEN_REASON_REQUIRED/);
assert.match(bulkHardeningRoute, /NO_REVIEW_STATUS_CHANGE/);
assert.match(bulkHardeningRoute, /EXPECTED_REVIEW_STATUS_REQUIRED/);
assert.match(bulkHardeningRoute, /GENERATION_ITEM_STATUS_CONFLICT/);
assert.match(bulkHardeningRoute, /analyzeGeneratedQuestionPayload\(item\.payload\)/);
assert.match(bulkHardeningRoute, /transactional approval quality gate/);
assert.match(bulkHardeningRoute, /Generated item is an exact duplicate of an existing generated question/);
assert.match(bulkHardeningRoute, /QUESTION_STUDIO_DUPLICATE_BLOCKED/);
assert.match(bulkHardeningRoute, /matchedRunCode/);
assert.match(engineRoute, /router\.post\(\s*"\/runs"/);
assert.match(engineRoute, /generateProfiledQuantBatch/);
