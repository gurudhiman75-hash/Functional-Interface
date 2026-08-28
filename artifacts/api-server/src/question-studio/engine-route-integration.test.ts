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

// Capabilities become engine-aware without removing the legacy field.
assert.match(engineRoute, /generationSystem:\s*"quant-v4"/);
assert.match(engineRoute, /defaultGenerationSystem:\s*"quant-v4"/);
assert.match(engineRoute, /generationSystems/);
assert.match(engineRoute, /listQuestionStudioPackages\(\)/);
assert.match(engineRoute, /engineId:\s*pkg\.engineId/);

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

// Existing Quant traffic must bypass the new non-Quant persistence path.
assert.match(engineRoute, /selectedEngineId === "quant-v4"/);
assert.match(engineRoute, /next\("route"\)/);
assert.doesNotMatch(engineRoute, /router\.use\(authenticate\)/);

// New-engine runs persist engine provenance in all important records.
assert.match(engineRoute, /engineId:\s*result\.engineId/);
assert.match(engineRoute, /generationSystem:\s*result\.engineId/);
assert.match(engineRoute, /\$\{result\.engineId\}/);
assert.match(engineRoute, /generationContext/);

// The compatibility composition offers new engines first refusal, then falls
// through to the established exam-profile/mixed-difficulty router.
const engineUse = mixedRoute.indexOf(
  "router.use(adminQuestionStudioEngineV1Router)",
);
const legacyUse = mixedRoute.indexOf(
  "router.use(adminQuestionStudioExamProfilesRouter)",
);
assert.equal(engineUse >= 0, true);
assert.equal(legacyUse >= 0, true);
assert.equal(engineUse < legacyUse, true);

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
