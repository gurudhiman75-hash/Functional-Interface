import assert from "node:assert/strict";
import { LP_011_ENGLISH_FREEZE_V1 } from "./lp-011-permanent-freeze-v1.ts";
import { LP_006_PROJECTION_ENGLISH_FREEZE_V1 } from "./lp-006-projection-permanent-freeze-v1.ts";
import { LP_001_011_PERMANENT_QL_REGISTRY_V2 } from "./lp-001-011-permanent-ql-registry-v2.ts";
import { generateLogicPuzzleQuestionStudioBatchV3, listLogicPuzzleQuestionStudioPackagesV3 } from "./question-studio-v3.ts";

assert.deepEqual(LP_011_ENGLISH_FREEZE_V1.permanentQlIds, ["LP-QL-041", "LP-QL-042", "LP-QL-043", "LP-QL-044"]);
assert.deepEqual(LP_006_PROJECTION_ENGLISH_FREEZE_V1.permanentQlIds, ["LP-QL-045", "LP-QL-046"]);
assert.equal(LP_001_011_PERMANENT_QL_REGISTRY_V2.permanentQlCount, 46);
assert.equal(LP_001_011_PERMANENT_QL_REGISTRY_V2.nextAvailableQlId, "LP-QL-047");
assert.equal(new Set(LP_001_011_PERMANENT_QL_REGISTRY_V2.permanentQlIds).size, 46);
assert.deepEqual(LP_001_011_PERMANENT_QL_REGISTRY_V2.permanentQlIds.slice(-6), ["LP-QL-041", "LP-QL-042", "LP-QL-043", "LP-QL-044", "LP-QL-045", "LP-QL-046"]);

const packages = listLogicPuzzleQuestionStudioPackagesV3();
assert.ok(packages.some((pkg: any) => pkg.id === "LP-011"));
assert.ok(packages.some((pkg: any) => pkg.id === "LP-006-PROJECTION"));

const lp011 = await generateLogicPuzzleQuestionStudioBatchV3({ packageId: "LP-011", language: "en", seed: "post-closure-lp011", count: 3 });
assert.equal(lp011.questions.length, 12);
assert.deepEqual(new Set(lp011.questions.map((question: any) => question.patternId)), new Set(["LP-QL-041", "LP-QL-042", "LP-QL-043", "LP-QL-044"]));
assert.ok(lp011.questions.every((question: any) => question.runtimeMode === "REVIEW_ONLY" && question.questionBankWritable === false));

const lp006 = await generateLogicPuzzleQuestionStudioBatchV3({ canonicalProblemId: "LP-QL-045", language: "en", seed: "post-closure-lp006", count: 4 });
assert.equal(lp006.questions.length, 8);
assert.deepEqual(new Set(lp006.questions.map((question: any) => question.patternId)), new Set(["LP-QL-045", "LP-QL-046"]));
assert.ok(lp006.questions.every((question: any) => question.runtimeMode === "REVIEW_ONLY" && question.questionBankWritable === false));

await assert.rejects(
  () => generateLogicPuzzleQuestionStudioBatchV3({ packageId: "LP-011", language: "pa", count: 1 }),
  /localization is not frozen yet/u,
);

console.log("Post-closure authority proof passed: permanent LP-QL-001..046 registry, English LP-011/LP-006 projection Question Studio review routes, and localization gate.");
