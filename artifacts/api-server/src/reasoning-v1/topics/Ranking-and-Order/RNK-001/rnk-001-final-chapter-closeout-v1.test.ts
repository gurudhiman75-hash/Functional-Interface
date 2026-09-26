import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { getGeneratedItemApprovalDisposition } from "../../../../lib/admin-question-studio-approval-policy";
import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../../question-studio/shared-generation-engine";
import { RNK_001_CHAPTER_AUTHORITY } from "./manifest";

const authority = RNK_001_CHAPTER_AUTHORITY;

assert.equal(authority.packageId, "RNK-001");
assert.equal(authority.status, "CLOSED_FOR_QUESTION_STUDIO_REVIEW_PERSISTENCE__DELIVERY_LOCKED");
assert.equal(authority.developmentClosureStatus, "CLOSED");
assert.equal(authority.mathematicalAuthorityStatus, "FROZEN");
assert.equal(authority.multilingualContentStatus, "APPROVED_FROZEN");
assert.equal(authority.permanentQlCount, 42);
assert.equal(authority.permanentQlRange, "RNK-QL-001..042");
assert.equal(authority.permanentQlIds.length, 42);
assert.equal(authority.permanentQlIds[0], "RNK-QL-001");
assert.equal(authority.permanentQlIds[41], "RNK-QL-042");
assert.equal(new Set(authority.permanentQlIds).size, 42);
assert.equal(authority.permanentQlIds.includes("RNK-QL-043"), false);
assert.equal(authority.ql043Allocated, false);

assert.deepEqual([...authority.supportedLanguages], ["en", "hi", "pa"]);
assert.equal(authority.englishContentFrozen, true);
assert.equal(authority.hindiContentApproved, true);
assert.equal(authority.punjabiContentApproved, true);
assert.equal(authority.multilingualContentFrozen, true);
assert.equal(authority.questionStudioVisible, true);
assert.equal(authority.questionStudioGenerationEnabled, true);
assert.equal(authority.questionStudioReviewPersistenceEnabled, true);
assert.equal(authority.persistedLifecycleStatus, "REVIEW_ONLY_PERSISTED");

assert.equal(authority.questionBankStatus, "NOT_STORED");
assert.equal(authority.questionBankWritable, false);
assert.equal(authority.testEligibility, "INELIGIBLE");
assert.equal(authority.testEligible, false);
assert.equal(authority.mockTestEligible, false);
assert.equal(authority.publiclyPublishable, false);
assert.equal(authority.automaticStudentPublication, false);

assert.equal(authority.frozenEvidence.multilingualFreeze.pr, 945);
assert.equal(authority.frozenEvidence.multilingualQuestionStudioActivation.pr, 966);
assert.equal(authority.frozenEvidence.reviewPersistence.pr, 974);
assert.equal(authority.frozenEvidence.reviewPersistence.run, 32463680002);
assert.equal(authority.frozenEvidence.reviewPersistence.artifact, 9440232238);
assert.ok(authority.reopeningRule.length >= 3);

const packages = listQuestionStudioPackages();
const rnk = packages.find((pkg: any) => String(pkg.packageId) === "RNK-001") as any;
assert.ok(rnk, "RNK-001 must remain registered in shared Question Studio");
assert.equal(rnk.enabled, true);
assert.equal(rnk.permanentQlCount, 42);
assert.equal(rnk.questionBankStatus, "NOT_STORED");
assert.equal(rnk.questionBankWritable, false);
assert.equal(rnk.testEligibility, "INELIGIBLE");
assert.equal(rnk.publiclyPublishable, false);
assert.deepEqual([...rnk.supportedLanguages], ["en", "hi", "pa"]);

for (const language of ["en", "hi", "pa"] as const) {
  const generated = await generateQuestion({
    packageId: "RNK-001",
    patternId: "RNK-QL-042",
    language,
    difficulty: "Medium",
    examProfileId: "CHAPTER_COVERAGE",
    seed: `rnk-final-closeout:${language}`,
    count: 1,
  });
  const question = generated.questions[0] as Record<string, unknown>;
  const context = generated.generationContext as Record<string, unknown>;
  assert.ok(question, `${language} closeout sample must generate`);
  assert.equal(context.questionBankStatus, "NOT_STORED");
  assert.equal(context.questionBankWritable, false);
  assert.equal(context.testEligible, false);
  assert.equal(context.mockTestEligible, false);
  assert.equal(context.publiclyPublishable, false);
  assert.equal(
    getGeneratedItemApprovalDisposition({ ...question, generationContext: context }).mode,
    "review_only",
  );
}

const banking = await generateQuestion({
  packageId: "RNK-001",
  patternId: "RNK-QL-001",
  language: "pa",
  difficulty: "Medium",
  examProfileId: "IBPS_PO_PRE",
  seed: "rnk-final-closeout:banking-pa",
  count: 1,
});
assert.equal((banking.questions[0] as any).options.length, 5);
assert.equal(
  getGeneratedItemApprovalDisposition({
    ...(banking.questions[0] as Record<string, unknown>),
    generationContext: banking.generationContext,
  }).mode,
  "review_only",
);

const closeout = readFileSync(
  "artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/RNK-001-FINAL-CHAPTER-CLOSEOUT-V1.md",
  "utf8",
);
assert.match(closeout, /RNK-QL-001\.\.042/u);
assert.match(closeout, /RNK-QL-043.*not allocated/u);
assert.match(closeout, /Question Bank writable:\s+false/u);
assert.match(closeout, /Test eligible:\s+false/u);
assert.match(closeout, /Publicly publishable:\s+false/u);
assert.match(closeout, /Reopening rule/u);

console.log("PASS_RNK_001_FINAL_CHAPTER_CLOSEOUT_V1", {
  status: authority.status,
  permanentQlCount: authority.permanentQlCount,
  languages: authority.supportedLanguages,
  questionStudioReviewPersistence: "ENABLED",
  questionBank: "LOCKED",
  testsMocksPublication: "LOCKED",
  ql043: "UNALLOCATED",
});
