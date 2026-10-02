import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const sourceRoot = resolve(process.cwd(), "src");
const index = readFileSync(resolve(sourceRoot, "routes/index.ts"), "utf8");
const capabilities = readFileSync(resolve(sourceRoot, "routes/admin-question-studio-capabilities.ts"), "utf8");
const build = readFileSync(resolve(process.cwd(), "build.mjs"), "utf8");

const capabilitiesMount = index.indexOf('router.use("/admin/question-studio", adminQuestionStudioCapabilitiesRouter)');
const reviewMount = index.indexOf('router.use("/admin/question-studio", adminQuestionStudioReviewPageRouter)');
const registryMount = index.indexOf('router.use("/admin/question-studio", adminQuestionStudioRegistryRouter)');

assert(capabilitiesMount >= 0, "Question Studio capabilities fast path is not mounted.");
assert(reviewMount >= 0, "Question Studio review-page fast path is not mounted.");
assert(registryMount >= 0, "Question Studio registry is not mounted.");
assert(capabilitiesMount < registryMount, "Capabilities must bypass the heavy registry.");
assert(reviewMount < registryMount, "Review page must bypass the heavy registry.");
assert.match(index, /lazyExactRouter\("\/capabilities"/);
assert.match(index, /lazyExactRouter\("\/review-page"/);

assert.doesNotMatch(capabilities, /engine-registry|shared-generation-engine|quant-v4|reasoning-v1|knowledge-v1|language-v1/);
assert.match(capabilities, /question-studio-capabilities\.json/);
assert.match(build, /build-question-studio-capabilities-manifest/);
assert.match(build, /question-studio-capabilities\.json/);
assert.match(build, /execFileAsync/);

console.log("PASS_QUESTION_STUDIO_RUNTIME_READ_PATH_ISOLATION");
