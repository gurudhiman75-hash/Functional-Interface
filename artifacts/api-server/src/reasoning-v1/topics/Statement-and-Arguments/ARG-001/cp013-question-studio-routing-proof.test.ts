import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ARG_CP013_CHECKPOINT_ID,
  ARG_CP013_QUESTION_STUDIO_AUTHORITY,
  ARG_CP013_QUESTION_STUDIO_PACKAGE,
  generateArgCp013QuestionStudioBatch,
} from "./cp013-final-editorial-surface.ts";

const registryCandidates = [
  resolve(process.cwd(), "src/routes/admin-question-studio-registry.ts"),
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-registry.ts"),
  fileURLToPath(new URL("../../../../routes/admin-question-studio-registry.ts", import.meta.url)),
];
const registryPath = registryCandidates.find((candidate) => existsSync(candidate));
assert.ok(registryPath, `admin Question Studio registry was not found; checked: ${registryCandidates.join(", ")}`);
const registry = readFileSync(registryPath, "utf8");

const cp013Import = registry.indexOf('adminQuestionStudioArgumentsCp013Router from "./admin-question-studio-arguments-cp013"');
const cp012Import = registry.indexOf('adminQuestionStudioArgumentsCp012Router from "./admin-question-studio-arguments-cp012"');
const cp010Import = registry.indexOf('adminQuestionStudioArgumentsCp010Router from "./admin-question-studio-arguments-cp010"');
const cp007Import = registry.indexOf('adminQuestionStudioArgumentsCp007Router from "./admin-question-studio-arguments-cp007-v2"');
const cp005Import = registry.indexOf('adminQuestionStudioArgumentsRouter from "./admin-question-studio-arguments"');
assert.ok(cp013Import >= 0 && cp012Import >= 0 && cp010Import >= 0 && cp007Import >= 0 && cp005Import >= 0, "ARG route imports are incomplete");

const cp013Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp013Router)");
const cp012Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp012Router)");
const cp010Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp010Router)");
const cp007Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsCp007Router)");
const cp005Mount = registry.indexOf("router.use(adminQuestionStudioArgumentsRouter)");
assert.ok(cp013Mount >= 0, "CP013 current ARG route is not mounted");
assert.ok(cp013Mount < cp012Mount, "CP013 must run before CP012");
assert.ok(cp013Mount < cp010Mount, "CP013 must run before CP010");
assert.ok(cp013Mount < cp007Mount, "CP013 must run before CP007");
assert.ok(cp013Mount < cp005Mount, "CP013 must run before CP005");

assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.currentRealPaperCheckpointId, ARG_CP013_CHECKPOINT_ID);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.currentQuestionStudioAuthority, ARG_CP013_QUESTION_STUDIO_AUTHORITY);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.learnerRelease, "LOCKED");

for (const input of [
  { qlId: "ARG-QL-004", language: "en", difficulty: "Medium", count: 5, seed: "CP013-ROUTE-CORE" },
  { cpId: "ARG-CP-013", qlId: "ARG-QL-005", language: "pa", difficulty: "Hard", examProfile: "BANKING_COMBO_4X5", count: 5, seed: "CP013-ROUTE-REAL" },
] as const) {
  const result = generateArgCp013QuestionStudioBatch(input);
  assert.equal(result.checkpointId, ARG_CP013_CHECKPOINT_ID);
  assert.equal(result.authority, ARG_CP013_QUESTION_STUDIO_AUTHORITY);
  for (const question of result.questions) {
    assert.equal(question.currentQuestionStudioAuthority, ARG_CP013_QUESTION_STUDIO_AUTHORITY);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.learnerRelease, "LOCKED");
  }
}

console.log("ARG-001 CP013 Question Studio routing: PASS (CP013 precedes CP012/CP010/CP007/CP005; learner gates locked)");
