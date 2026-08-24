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
const routeIndex = readFileSync(resolve(sourceRoot, "routes/index.ts"), "utf8");

// Capabilities become engine-aware without removing the legacy field.
assert.match(engineRoute, /generationSystem:\s*"quant-v4"/);
assert.match(engineRoute, /defaultGenerationSystem:\s*"quant-v4"/);
assert.match(engineRoute, /generationSystems/);
assert.match(engineRoute, /listQuestionStudioPackages\(\)/);
assert.match(engineRoute, /engineId:\s*pkg\.engineId/);

// Existing Quant traffic must bypass the new non-Quant persistence path.
assert.match(engineRoute, /selectedEngineId === "quant-v4"/);
assert.match(engineRoute, /next\("route"\)/);
assert.doesNotMatch(engineRoute, /router\.use\(authenticate\)/);

// New-engine runs persist engine provenance in all important records.
assert.match(engineRoute, /engineId:\s*result\.engineId/);
assert.match(engineRoute, /generationSystem:\s*result\.engineId/);
assert.match(engineRoute, /\$\{result\.engineId\}/);
assert.match(engineRoute, /generationContext/);

// The compatibility composition must offer new engines first refusal, then
// fall through to the established exam-profile/mixed-difficulty router.
const engineUse = mixedRoute.indexOf(
  "router.use(adminQuestionStudioEngineV1Router)",
);
const legacyUse = mixedRoute.indexOf(
  "router.use(adminQuestionStudioExamProfilesRouter)",
);
assert.equal(engineUse >= 0, true);
assert.equal(legacyUse >= 0, true);
assert.equal(engineUse < legacyUse, true);

// There must be exactly one production mount path for the engine facade: it is
// composed inside the mixed-difficulty router, which is mounted by the shared
// route index. A second direct facade mount would make route ownership opaque.
assert.match(
  routeIndex,
  /adminQuestionStudioMixedDifficultyRouter from "\.\/admin-question-studio-mixed-difficulty"/,
);
assert.match(
  routeIndex,
  /router\.use\("\/admin\/question-studio", adminQuestionStudioMixedDifficultyRouter\)/,
);
assert.doesNotMatch(routeIndex, /adminQuestionStudioEngineV1Router/);
