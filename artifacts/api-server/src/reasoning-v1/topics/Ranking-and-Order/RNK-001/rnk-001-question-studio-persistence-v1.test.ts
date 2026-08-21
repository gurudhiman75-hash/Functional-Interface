import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { getGeneratedItemApprovalDisposition } from "../../../../lib/admin-question-studio-approval-policy";
import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../../question-studio/shared-generation-engine";

const SAMPLE_QLS = [
  "RNK-QL-001",
  "RNK-QL-009",
  "RNK-QL-018",
  "RNK-QL-027",
  "RNK-QL-035",
  "RNK-QL-036",
  "RNK-QL-039",
  "RNK-QL-042",
] as const;
const LANGUAGES = ["en", "hi", "pa"] as const;

const packages = listQuestionStudioPackages();
const rnk = packages.find((entry: any) => String(entry.packageId) === "RNK-001") as any;
assert.ok(rnk, "RNK-001 must be exposed by the shared Question Studio registry");
assert.equal(rnk.enabled, true);
assert.deepEqual([...rnk.supportedLanguages], ["en", "hi", "pa"]);
assert.equal(rnk.questionBankStatus, "NOT_STORED");
assert.equal(rnk.questionBankWritable, false);
assert.equal(rnk.testEligibility, "INELIGIBLE");
assert.equal(rnk.publiclyPublishable, false);

let checked = 0;
for (const language of LANGUAGES) {
  for (const qlId of SAMPLE_QLS) {
    const result = await generateQuestion({
      packageId: "RNK-001",
      patternId: qlId,
      language,
      difficulty: "Medium",
      examProfileId: "CHAPTER_COVERAGE",
      seed: `rnk-persistence-v1:${language}:${qlId}`,
      count: 1,
    });
    const context = result.generationContext as Record<string, unknown>;
    const question = result.questions[0] as Record<string, unknown>;
    assert.ok(question, `${language} ${qlId} must generate a review payload`);
    assert.equal(context.packageId, "RNK-001");
    assert.equal(context.lifecycleStatus, "REVIEW_ONLY");
    assert.equal(context.questionBankStatus, "NOT_STORED");
    assert.equal(context.questionBankWritable, false);
    assert.equal(context.testEligible, false);
    assert.equal(context.mockTestEligible, false);
    assert.equal(context.publiclyPublishable, false);
    assert.equal(context.automaticStudentPublication, false);

    const disposition = getGeneratedItemApprovalDisposition({
      ...question,
      generationContext: context,
    });
    assert.equal(disposition.mode, "review_only");
    assert.match(String(disposition.reason), /disables Question Bank storage/u);
    checked += 1;
  }
}

for (const language of ["hi", "pa"] as const) {
  const banking = await generateQuestion({
    packageId: "RNK-001",
    patternId: "RNK-QL-001",
    language,
    difficulty: "Medium",
    examProfileId: "IBPS_PO_PRE",
    seed: `rnk-persistence-v1:banking:${language}`,
    count: 1,
  });
  const question = banking.questions[0] as Record<string, unknown>;
  const options = question.options as unknown[];
  assert.equal(options.length, 5, `${language} banking review delivery must keep five options`);
  assert.equal(
    getGeneratedItemApprovalDisposition({
      ...question,
      generationContext: banking.generationContext,
    }).mode,
    "review_only",
  );
}

const routeSource = readFileSync(
  "artifacts/api-server/src/routes/admin-question-studio-rnk-persistence.ts",
  "utf8",
);
assert.match(routeSource, /content\.generation_runs/u);
assert.match(routeSource, /content\.generation_run_items/u);
assert.match(routeSource, /content\.generation_item_versions/u);
assert.match(routeSource, /RNK_PERSISTENCE_LIFECYCLE_GUARD_FAILED/u);
assert.match(routeSource, /questionBankStatus !== "NOT_STORED"/u);
assert.match(routeSource, /questionBankWritable !== false/u);
assert.match(routeSource, /testEligible !== false/u);
assert.match(routeSource, /mockTestEligible !== false/u);
assert.match(routeSource, /publiclyPublishable !== false/u);
assert.doesNotMatch(routeSource, /convertApprovedGenerationItem/u);
assert.doesNotMatch(routeSource, /INSERT INTO content\.questions/u);
assert.doesNotMatch(routeSource, /INSERT INTO content\.question_versions/u);

const indexSource = readFileSync("artifacts/api-server/src/routes/index.ts", "utf8");
const persistenceMount = indexSource.indexOf("adminQuestionStudioRnkPersistenceRouter");
const bulkMount = indexSource.indexOf("adminQuestionStudioBulkHardeningRouter", persistenceMount);
const legacyMount = indexSource.indexOf("adminQuestionStudioRouter", persistenceMount);
assert.ok(persistenceMount >= 0, "RNK persistence router must be mounted");
assert.ok(bulkMount > persistenceMount, "RNK run persistence must precede bulk-review routing");
assert.ok(legacyMount > persistenceMount, "RNK run persistence must precede the legacy /runs route");

console.log("PASS_RNK_001_QUESTION_STUDIO_PERSISTENCE_V1", {
  generatedReviewPayloadsChecked: checked,
  bankingLocalesChecked: 2,
  questionBankConversion: "LOCKED",
  testMockPublication: "LOCKED",
});
