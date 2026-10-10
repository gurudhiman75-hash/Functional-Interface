import assert from "node:assert/strict";
import { quantV4QuestionStudioAdapter } from "./engines/quant-v4-adapter";
import {
  getTsdIntegratedReviewRowsForAudit,
  TSD_AUDIT_REVIEW_PACKAGE_ID,
} from "./quant-tsd-audit-review";
import {
  itemStem,
  itemExplanation,
} from "../../../admin-app/src/features/question-studio/quality";
const rows = getTsdIntegratedReviewRowsForAudit();
assert.equal(rows.length, 4680);
assert.equal(new Set(rows.map((r) => r.questionId)).size, rows.length);
for (const r of rows) {
  assert.ok(itemStem(r));
  assert.ok(itemExplanation(r));
  assert.equal(new Set(r.options!.map(String)).size, 4);
  assert.equal(r.answer, r.options![r.correctIndex!]);
  assert.ok(r.explanation!.length > 15);
  assert.equal(r.questionBankWritable, false);
  assert.equal(r.testEligible, false);
  assert.equal(r.publiclyPublishable, false);
  assert.equal(r.productionReleaseAuthorized, false);
  assert.equal(r.persistenceAllowed, false);
  assert.equal(r.productOwnerApprovalRecorded, false);
  assert.equal(r.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(r.lifecycleStage, "REVIEW_ONLY");
  assert.doesNotMatch(JSON.stringify(r), /\[object Object\]|NaN|\$\{/);
  if (r.language === "hi") assert.match(r.stem!, /[\u0900-\u097f]/);
  if (r.language === "pa") assert.match(r.stem!, /[\u0a00-\u0a7f]/);
}
const pkg = quantV4QuestionStudioAdapter
  .listPackages()
  .find((p) => p.packageId === TSD_AUDIT_REVIEW_PACKAGE_ID)!;
assert.ok(pkg);
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.cpIds.length, 11);
for (const canonicalProblemId of pkg.cpIds)
  for (const language of ["en", "hi", "pa"] as const) {
    const req = {
      packageId: TSD_AUDIT_REVIEW_PACKAGE_ID,
      canonicalProblemId,
      language,
      count: 1,
      seed: "TSD-FINAL-INTEGRATION",
    };
    const result = await quantV4QuestionStudioAdapter.generate(req);
    assert.equal(result.questions.length, 1);
    assert.equal(result.questions[0].canonicalProblemId, canonicalProblemId);
    assert.equal(result.questions[0].language, language);
    assert.deepEqual(result, await quantV4QuestionStudioAdapter.generate(req));
    JSON.stringify(result);
  }
const batch = await quantV4QuestionStudioAdapter.generate({
  packageId: TSD_AUDIT_REVIEW_PACKAGE_ID,
  language: "en",
  count: 50,
  seed: "unique",
});
assert.equal(
  new Set(
    batch.questions.map((q) =>
      JSON.stringify([q.canonicalProblemId, q.stem, q.options]),
    ),
  ).size,
  50,
);
for (const difficulty of ["Easy", "Medium", "Hard"]) {
  const r = await quantV4QuestionStudioAdapter.generate({
    packageId: TSD_AUDIT_REVIEW_PACKAGE_ID,
    language: "en",
    difficulty,
    count: 1,
  });
  assert.equal(r.questions[0].difficulty, difficulty);
}
await assert.rejects(() =>
  quantV4QuestionStudioAdapter.generate({
    packageId: TSD_AUDIT_REVIEW_PACKAGE_ID,
    canonicalProblemId: "UNKNOWN",
    count: 1,
  }),
);
await assert.rejects(() =>
  quantV4QuestionStudioAdapter.generate({
    packageId: TSD_AUDIT_REVIEW_PACKAGE_ID,
    count: 51,
  }),
);
const mutated = getTsdIntegratedReviewRowsForAudit();
mutated[0].options![0] = "changed";
assert.notEqual(getTsdIntegratedReviewRowsForAudit()[0].options![0], "changed");
console.log(
  "PASS: 4680 transport-safe TSD review rows; every CP003-CP012 and source-extension selector in all three languages; deterministic unique batches, difficulties, and release locks.",
);
