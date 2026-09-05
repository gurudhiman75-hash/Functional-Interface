import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1 } from "./com003-question-studio-pre-registration-freeze-v1";
import { runCom003QuestionStudioPreRegistration } from "./com003-question-studio-pre-registration-adapter-v1";

const routeSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-com003.ts"),
  "utf8",
);
const registrySource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-registry.ts"),
  "utf8",
);
const routeIndexSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/index.ts"),
  "utf8",
);

for (const marker of [
  '"/computer/com003/package"',
  '"/computer/com003/preview"',
  '"/computer/com003/status"',
  "COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V1",
  "COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1",
  "runCom003QuestionStudioPreRegistration",
  "READ_ONLY_PRE_REGISTRATION",
  "databaseWriteEnabled: false",
  "persistenceAllowed: false",
  "questionStudioDiscoverable: false",
  "questionBankWritable: false",
  "testEligible: false",
  "publiclyPublishable: false",
  "productionReleased: false",
]) {
  assert(routeSource.includes(marker), `COM-003 read-only route missing marker: ${marker}`);
}

for (const forbidden of [
  "sqlClient",
  "content.generation_runs",
  "content.generation_run_items",
  "content.generation_item_versions",
  "question_bank",
  "router.post(",
  "router.patch(",
  "router.put(",
  "router.delete(",
]) {
  assert(!routeSource.includes(forbidden), `COM-003 read-only route contains forbidden persistence/write marker: ${forbidden}`);
}

assert(
  registrySource.includes('import adminQuestionStudioCom003Router from "./admin-question-studio-com003";'),
  "COM-003 router import is missing from the canonical Question Studio registry.",
);
const com003Mount = "router.use(adminQuestionStudioCom003Router);";
const legacyMount = "router.use(adminQuestionStudioRouter);";
const com003Index = registrySource.indexOf(com003Mount);
const legacyIndex = registrySource.indexOf(legacyMount);
assert(com003Index >= 0, "COM-003 Question Studio registry mount is missing.");
assert(legacyIndex >= 0, "Legacy Question Studio registry mount is missing.");
assert(com003Index < legacyIndex, "COM-003 read-only router must be mounted before the legacy catch-all router.");
assert(
  routeIndexSource.includes('import adminQuestionStudioRegistryRouter from "./admin-question-studio-registry";'),
  "Global route index must mount Question Studio through the dedicated registry.",
);
assert(
  !routeIndexSource.includes("adminQuestionStudioCom003Router"),
  "COM-003 must not be mounted directly from the global route index.",
);

const preview = runCom003QuestionStudioPreRegistration({
  packageId: "COM-003",
  qlId: "COM-003-QL-001",
  language: "pa",
  seed: "com003-read-only-route-contract",
  count: 3,
});
assert.equal(preview.questions.length, 3);
assert.equal(preview.generationContext.preRegistrationOnly, true);
assert.equal(preview.generationContext.readOnly, true);
assert.equal(preview.generationContext.questionStudioDiscoverable, false);
assert.equal(preview.generationContext.questionBankStatus, "NOT_STORED");
assert.equal(preview.generationContext.testEligibility, "INELIGIBLE");
assert.equal(preview.generationContext.publiclyPublishable, false);
assert.equal(preview.generationContext.productionReleased, false);
assert.equal(COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1.governance.questionStudioPreviewConnectionAuthorized, true);
assert.equal(COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1.governance.generationRunPersistenceAuthorized, false);
assert.equal(COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1.governance.questionStudioRegistered, false);
assert.equal(COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1.governance.productionReleased, false);

console.log("[COM003-QUESTION-STUDIO-READ-ONLY-ROUTE-CONTRACT-V1]", {
  valid: true,
  routeArchitecture: "QUESTION_STUDIO_REGISTRY",
  endpoints: ["package", "preview", "status"],
  writeEndpoints: 0,
  persistenceAllowed: false,
  questionStudioRegistered: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  productionReleased: false,
});
