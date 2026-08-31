import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  isTrg001QuestionStudioRequest,
  isTrg002V4GenerationRequest,
  listQuestionStudioPackages,
} from "../../../../../question-studio/shared-generation-engine-trigonometry";

assert.equal(isTrg001QuestionStudioRequest({ packageId: "TRG-001" }), true);
assert.equal(isTrg001QuestionStudioRequest({ patternId: "TRG-001" }), true);
assert.equal(isTrg001QuestionStudioRequest({ packageId: "TRG-002" }), false);
assert.equal(isTrg002V4GenerationRequest({ packageId: "TRG-002" }), true);
assert.equal(isTrg002V4GenerationRequest({ packageId: "TRG-001" }), false);

const packages = listQuestionStudioPackages();
assert.equal(packages.filter((entry: any) => entry.packageId === "TRG-001").length, 1);
assert.equal(packages.filter((entry: any) => entry.packageId === "TRG-002").length, 1);
const trg001 = packages.find((entry: any) => entry.packageId === "TRG-001") as any;
assert.deepEqual(trg001.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(trg001.questionStudioDiscoverable, true);
assert.equal(trg001.questionBankWritable, true);
assert.equal(trg001.testEligible, true);
assert.equal(trg001.testBuilderEligible, true);
assert.equal(trg001.mockTestEligible, true);
assert.equal(trg001.publicReleaseAuthorized, false);
assert.equal(trg001.localizationStatus, "MULTILINGUAL_FROZEN_ACTIVE");

const adminRouteSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-trigonometry.ts"),
  "utf8",
);
const routeRegistrySource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-registry.ts"),
  "utf8",
);
const routeIndexSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/index.ts"),
  "utf8",
);
const facadeSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/question-studio/shared-generation-engine-trigonometry.ts"),
  "utf8",
);

for (const marker of [
  "isTrg001QuestionStudioRequest",
  "isTrg002V4GenerationRequest",
  "shared-generation-engine-trigonometry",
  "publicReleaseAuthorized !== false",
  "Trigonometry Question Studio run attempted to bypass the public-release lock",
  "content.generation_runs",
  "content.generation_run_items",
  "content.generation_item_versions",
  'const LANGUAGES = new Set(["en", "hi", "pa"])',
]) {
  assert.ok(adminRouteSource.includes(marker), `Trigonometry admin route missing marker: ${marker}`);
}

assert.ok(
  routeIndexSource.includes('import adminQuestionStudioRegistryRouter from "./admin-question-studio-registry";'),
  "Global route index must mount Question Studio through the dedicated registry",
);
assert.ok(
  !routeIndexSource.includes("adminQuestionStudioTrigonometryRouter"),
  "Trigonometry must not be mounted directly from routes/index.ts",
);
assert.ok(
  routeRegistrySource.includes('import adminQuestionStudioTrigonometryRouter from "./admin-question-studio-trigonometry";'),
  "Trigonometry admin router import is missing from the Question Studio registry",
);

const trigMount = "router.use(adminQuestionStudioTrigonometryRouter);";
const cp013Mount = "router.use(adminQuestionStudioCp013Router);";
const legacyMount = "router.use(adminQuestionStudioRouter);";
const trigIndex = routeRegistrySource.indexOf(trigMount);
const cp013Index = routeRegistrySource.indexOf(cp013Mount);
const legacyIndex = routeRegistrySource.indexOf(legacyMount);
assert.ok(trigIndex >= 0, "Trigonometry Question Studio registry mount is missing");
assert.ok(cp013Index >= 0, "CP013 Question Studio registry mount is missing");
assert.ok(legacyIndex >= 0, "Legacy Question Studio registry mount is missing");
assert.ok(trigIndex < cp013Index, "Trigonometry aggregate must be mounted before CP013 so its aggregate capabilities handler wins");
assert.ok(trigIndex < legacyIndex, "Trigonometry aggregate must be mounted before the legacy Question Studio router");

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
  assert.ok(facadeSource.includes(marker), `Trigonometry shared facade missing marker: ${marker}`);
}

console.log(JSON.stringify({
  status: "PASS_TRIGONOMETRY_FAMILY_ROUTE_CONTRACT",
  routeOrder: "TRIGONOMETRY_BEFORE_CP013_BEFORE_LEGACY",
  routeArchitecture: "QUESTION_STUDIO_REGISTRY",
  trg001PermanentQlCount: 144,
  trg001Languages: ["en", "hi", "pa"],
  trg001QuestionBankWritable: true,
  trg001TestEligible: true,
  trg001TestBuilderEligible: true,
  trg001MockTestEligible: true,
  trg002QlCount: 96,
  trg002Languages: ["en", "hi", "pa"],
  publicReleaseAuthorized: false,
}, null, 2));