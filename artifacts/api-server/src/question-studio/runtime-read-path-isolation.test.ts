import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const sourceRoot = resolve(process.cwd(), "src");
const index = readFileSync(resolve(sourceRoot, "routes/index.ts"), "utf8");
const capabilities = readFileSync(resolve(sourceRoot, "routes/admin-question-studio-capabilities.ts"), "utf8");
const build = readFileSync(resolve(process.cwd(), "build.mjs"), "utf8");
const runtimeBuild = readFileSync(resolve(process.cwd(), "build-runtime.mjs"), "utf8");

const capabilitiesMount = index.indexOf('router.use("/admin/question-studio", adminQuestionStudioCapabilitiesRouter)');
const reviewMount = index.indexOf('router.use("/admin/question-studio", adminQuestionStudioReviewPageRouter)');
const registryMount = index.indexOf('router.use("/admin/question-studio", adminQuestionStudioRegistryRouter)');

assert(capabilitiesMount >= 0, "Question Studio capabilities fast path is not mounted.");
assert(reviewMount >= 0, "Question Studio review-page fast path is not mounted.");
assert(registryMount >= 0, "Question Studio registry is not mounted.");
assert(capabilitiesMount < registryMount, "Capabilities must bypass the heavy registry.");
assert(reviewMount < registryMount, "Review page must bypass the heavy registry.");

const registry = readFileSync(
  resolve(sourceRoot, "routes/admin-question-studio-registry.ts"),
  "utf8",
);
// TRG-002 requests must reach the existing permission-checked engine without
// importing all preceding ARG-001 / SRI heavy chapter routers.
const trgRunFastPath = registry.indexOf('router.post("/runs", (req, res, next) => {');
const argRouterMount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp015Router);");
assert(trgRunFastPath >= 0 && trgRunFastPath < argRouterMount, "TRG-002 generation must precede unrelated ARG engine hydration.");
assert.match(registry, /req\.body\?\.packageId !== "TRG-002"/);
assert.match(registry, /adminQuestionStudioEngineV1Router\(req, res, next\)/);
assert.match(registry, /if \(req\.body\?\.packageId !== "TRG-002"\) \{\s+next\(\);/);
assert.match(index, /lazyExactRouter\("\/capabilities"/);
assert.match(index, /lazyExactRouter\("\/review-page"/);

assert.doesNotMatch(capabilities, /engine-registry|shared-generation-engine|quant-v4|reasoning-v1|knowledge-v1|language-v1/);
assert.match(capabilities, /question-studio-capabilities\.json/);
assert.match(build, /build-question-studio-capabilities-manifest/);
assert.match(build, /question-studio-capabilities\.json/);
assert.match(build, /execFileAsync/);
assert.match(runtimeBuild, /build-question-studio-capabilities-manifest/);
assert.match(runtimeBuild, /question-studio-capabilities\.json/);
assert.match(runtimeBuild, /QUESTION_STUDIO_CAPABILITIES_MANIFEST_OUT/);
assert.match(runtimeBuild, /execFileAsync/);

const app = readFileSync(resolve(sourceRoot, "app.ts"), "utf8");
const offThreadRouter = readFileSync(
  resolve(sourceRoot, "routes/admin-question-studio-trg002-worker.ts"), "utf8",
);
const offThreadWorker = readFileSync(
  resolve(sourceRoot, "question-studio/trg002-generation-worker.ts"), "utf8",
);
const workerMount = app.indexOf('app.use("/api/admin/question-studio", adminRequestObservability, (req, res, next) => {');
const legacyMount = app.indexOf('app.use("/api", adminRequestObservability, (req, res, next) => {');
assert(workerMount >= 0 && workerMount < legacyMount, "TRG-002 worker must precede the legacy API import.");
assert.match(app, /req\.body\?\.packageId !== "TRG-002"/);
assert.match(offThreadRouter, /new Worker\(workerFile/);
assert.match(offThreadRouter, /requireAdminPermission\("content\.generation\.run"\)/);
assert.match(offThreadRouter, /sqlClient\.begin/);
assert.match(offThreadRouter, /TRG002_GENERATOR_BUSY/);
assert.doesNotMatch(offThreadRouter, /engine-registry|quant-v4-adapter/);
assert.match(offThreadWorker, /generateProfiledQuantBatch/);
assert.match(offThreadWorker, /generateTrg002V4QuestionStudioBatch/);
assert.doesNotMatch(offThreadWorker, /engine-registry|quant-v4-adapter/);
assert.match(runtimeBuild, /trg002-generation-worker\.ts/);
assert.match(runtimeBuild, /question-studio-trg002-worker\.mjs/);

const manifestBuilder = readFileSync(
  resolve(sourceRoot, "question-studio/build-question-studio-capabilities-manifest.ts"),
  "utf8",
);
assert.match(manifestBuilder, /subject:\s*packageSubject\(pkg\)/);
assert.match(manifestBuilder, /chapter:\s*packageChapter\(pkg\)/);
assert.match(manifestBuilder, /return "Other"/);
assert.doesNotMatch(manifestBuilder, /from "\.\/engine-registry"/);
assert.match(manifestBuilder, /shared-generation-engine-arg/);
assert.match(manifestBuilder, /quantV4QuestionStudioAdapter/);
assert.match(manifestBuilder, /MEN-CP-001\.\.MEN-CP-013/);
assert.match(manifestBuilder, /packageSubject\(pkg\) !== "Quantitative Aptitude"/);

console.log("PASS_QUESTION_STUDIO_RUNTIME_READ_PATH_ISOLATION");
