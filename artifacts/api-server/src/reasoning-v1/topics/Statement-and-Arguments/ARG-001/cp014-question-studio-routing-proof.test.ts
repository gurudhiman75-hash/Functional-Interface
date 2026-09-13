import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ARG_CP014_CHECKPOINT_ID,
  ARG_CP014_LEARNER_RELEASE,
  ARG_CP014_QUESTION_STUDIO_AUTHORITY,
  ARG_CP014_QUESTION_STUDIO_PACKAGE,
  generateArgCp014QuestionStudioBatch,
} from "./cp014-manual-editorial-approval.ts";

const registryCandidates = [
  resolve(process.cwd(), "src/routes/admin-question-studio-registry.ts"),
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-registry.ts"),
  fileURLToPath(new URL("../../../../routes/admin-question-studio-registry.ts", import.meta.url)),
];
const registryPath = registryCandidates.find((candidate) => existsSync(candidate));
assert.ok(registryPath, `admin Question Studio registry was not found; checked: ${registryCandidates.join(", ")}`);
const registry = readFileSync(registryPath, "utf8");

const cp014Import = registry.indexOf('adminQuestionStudioArgumentsCp014Router from "./admin-question-studio-arguments-cp014"');
const cp013Import = registry.indexOf('adminQuestionStudioArgumentsCp013Router from "./admin-question-studio-arguments-cp013"');
const cp012Import = registry.indexOf('adminQuestionStudioArgumentsCp012Router from "./admin-question-studio-arguments-cp012"');
assert.ok(cp014Import >= 0 && cp013Import >= 0 && cp012Import >= 0, "ARG CP014/CP013/CP012 route imports are incomplete");
assert.ok(cp014Import < cp013Import, "CP014 import must precede CP013");

const cp014Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp014Router)");
const cp013Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp013Router)");
const cp012Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp012Router)");
const cp010Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp010Router)");
const cp007Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp007Router)");
const cp005Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsRouter)");
assert.ok(cp014Mount >= 0, "CP014 current ARG route is not mounted");
assert.ok(cp014Mount < cp013Mount, "CP014 must run before CP013");
assert.ok(cp014Mount < cp012Mount, "CP014 must run before CP012");
assert.ok(cp014Mount < cp010Mount, "CP014 must run before CP010");
assert.ok(cp014Mount < cp007Mount, "CP014 must run before CP007");
assert.ok(cp014Mount < cp005Mount, "CP014 must run before legacy ARG route");

assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.currentRealPaperCheckpointId, ARG_CP014_CHECKPOINT_ID);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.currentQuestionStudioAuthority, ARG_CP014_QUESTION_STUDIO_AUTHORITY);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.manualApprovalRequired, false);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.questionBankWritable, true);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.testEligible, true);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.mockTestEligible, true);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.publicReleaseAuthorized, false);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.studentDeliveryAuthorized, false);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.learnerRelease, ARG_CP014_LEARNER_RELEASE);

const routeCandidates = [
  resolve(process.cwd(), "src/routes/admin-question-studio-arguments-cp014.ts"),
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-arguments-cp014.ts"),
  fileURLToPath(new URL("../../../../routes/admin-question-studio-arguments-cp014.ts", import.meta.url)),
];
const routePath = routeCandidates.find((candidate) => existsSync(candidate));
assert.ok(routePath, `CP014 route was not found; checked: ${routeCandidates.join(", ")}`);
const route = readFileSync(routePath, "utf8");
assert.match(route, /question\.questionBankWritable !== true/);
assert.match(route, /question\.testEligible !== true/);
assert.match(route, /question\.mockTestEligible !== true/);
assert.match(route, /question\.publiclyPublishable !== false/);
assert.match(route, /question\.publicReleaseAuthorized !== false/);
assert.match(route, /question\.studentDeliveryAuthorized !== false/);
assert.match(route, /question\.automaticStudentPublication !== false/);
assert.match(route, /question\.manualApprovalRequired !== false/);

for (const input of [
  { qlId: "ARG-QL-004", language: "en", difficulty: "Medium", count: 5, seed: "CP014-ROUTE-CORE" },
  { cpId: "ARG-CP-014", qlId: "ARG-QL-005", language: "pa", difficulty: "Hard", examProfile: "BANKING_COMBO_4X5", count: 5, seed: "CP014-ROUTE-REAL" },
] as const) {
  const result = generateArgCp014QuestionStudioBatch(input);
  assert.equal(result.checkpointId, ARG_CP014_CHECKPOINT_ID);
  assert.equal(result.authority, ARG_CP014_QUESTION_STUDIO_AUTHORITY);
  for (const question of result.questions) {
    assert.equal(question.currentQuestionStudioAuthority, ARG_CP014_QUESTION_STUDIO_AUTHORITY);
    assert.equal(question.manualApprovalRequired, false);
    assert.equal(question.questionBankWritable, true);
    assert.equal(question.testEligible, true);
    assert.equal(question.mockTestEligible, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.publicReleaseAuthorized, false);
    assert.equal(question.studentDeliveryAuthorized, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.learnerRelease, ARG_CP014_LEARNER_RELEASE);
  }
}

console.log("ARG-001 CP014 Question Studio routing: PASS (CP014 current; internal eligible; public/automatic delivery blocked)");
