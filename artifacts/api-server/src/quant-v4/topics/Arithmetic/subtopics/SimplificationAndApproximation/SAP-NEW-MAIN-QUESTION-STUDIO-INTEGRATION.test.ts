import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  getGeneratedQuestionBankEligibilityIssue,
} from "../../../../../lib/admin-question-conversion";
import {
  getGeneratedItemApprovalDisposition,
} from "../../../../../lib/admin-question-studio-approval-policy";
import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../question-studio-review-engine";
import {
  SAP_QUESTION_STUDIO_CP_IDS,
} from "./question-studio-adapter";

const packages = listQuantV4Packages();
const sap = packages.find((entry: any) => entry.packageId === "SAP") as any;
assert.ok(sap, "SAP must be discoverable through the current Question Studio review engine.");
assert.equal(sap.subtopic, "Simplification & Approximation");
assert.deepEqual(sap.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(sap.cpIds, [...SAP_QUESTION_STUDIO_CP_IDS]);
assert.equal(sap.cpIds.length, 12);
assert.equal(sap.enabled, true);
assert.equal(sap.runtimeMode, "QUESTION_STUDIO_ACTIVE");
assert.equal(sap.reviewStatus, "LOCALIZATION_CONTENT_APPROVED_REVIEW_READY");
assert.equal(sap.questionBankStatus, "WRITABLE");
assert.equal(sap.questionBankWritable, true);
assert.equal(sap.testEligibility, "ELIGIBLE");
assert.equal(sap.publiclyPublishable, true);

assert.ok(packages.some((entry: any) => entry.packageId === "NUM-001"), "Current Number System package disappeared during SAP restack.");
assert.ok(packages.some((entry: any) => entry.packageId === "TMW-001"), "Current Time & Work package disappeared during SAP restack.");

function assertStandardLifecycleQuestion(question: any, language: "en" | "hi" | "pa", qlId: string) {
  assert.equal(question.packageId, "SAP");
  assert.equal(question.language, language);
  assert.equal(question.questionLanguageId, qlId);
  assert.ok(SAP_QUESTION_STUDIO_CP_IDS.includes(question.canonicalProblemId));
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.ok(Number.isInteger(question.correctIndex));
  assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
  assert.equal(question.options[question.correctIndex], question.answer);
  assert.ok(String(question.text ?? "").trim().length > 0);
  assert.ok(String(question.explanation ?? "").trim().length > 0);
  assert.equal(question.questionBankStatus, "WRITABLE");
  assert.equal(question.questionBankWritable, true);
  assert.equal(question.testEligibility, "ELIGIBLE");
  assert.equal(question.testEligible, true);
  assert.equal(question.publiclyPublishable, true);
}

for (const language of ["en", "hi", "pa"] as const) {
  const qlId = language === "en" ? "SAP-QL-180" : "SAP-QL-062";
  const result = await generateQuestion({
    packageId: "SAP",
    topic: "Arithmetic",
    subtopic: "Simplification & Approximation",
    questionLanguageId: qlId,
    language,
    count: 2,
    seed: `sap-new-main-review-engine:${language}:${qlId}`,
  });

  assert.equal(result.questions.length, 2, `${language}: current review engine under-filled SAP batch.`);
  assert.equal(result.generationContext.runtimeMode, "QUESTION_STUDIO_ACTIVE");
  assert.equal(result.generationContext.reviewStatus, "LOCALIZATION_CONTENT_APPROVED_REVIEW_READY");
  assert.equal(result.generationContext.questionBankStatus, "WRITABLE");
  assert.equal(result.generationContext.questionBankWritable, true);
  assert.equal(result.generationContext.testEligibility, "ELIGIBLE");
  assert.equal(result.generationContext.publiclyPublishable, true);
  assert.equal(result.generationContext.language, language);

  for (const question of result.questions as any[]) {
    assertStandardLifecycleQuestion(question, language, qlId);
    const storedPayload = {
      ...question,
      generationContext: result.generationContext,
    };
    assert.equal(
      getGeneratedItemApprovalDisposition(storedPayload).mode,
      "question_bank",
      `${language}: standard Question Studio approval must route SAP to Question Bank conversion.`,
    );
    assert.equal(
      getGeneratedQuestionBankEligibilityIssue(storedPayload),
      null,
      `${language}: standard Question Bank conversion guard must accept SAP after admin approval.`,
    );
  }
}

const ql180 = await generateQuestion({
  packageId: "SAP",
  questionLanguageId: "SAP-QL-180",
  language: "en",
  count: 1,
  seed: "sap-new-main-ql180-power-only",
});
const ql180Question = ql180.questions[0] as any;
assert.ok(ql180Question);
assert.equal(ql180Question.questionLanguageId, "SAP-QL-180");
assert.ok(/power/iu.test(JSON.stringify(ql180Question.traceability ?? ql180Question.semanticMetadata ?? {})));
assert.ok(!/root or power/iu.test(JSON.stringify(ql180Question.traceability ?? ql180Question.semanticMetadata ?? {})));

const routeSource = readFileSync(
  resolve(process.cwd(), "src/routes/admin-question-studio-average.ts"),
  "utf8",
);
assert.ok(
  routeSource.includes('from "../quant-v4/question-studio-review-engine"'),
  "Shared /runs route must use the current Question Studio review engine.",
);
assert.ok(routeSource.includes("isSimplificationRequest"));
assert.ok(routeSource.includes('"SAP"'));
assert.ok(routeSource.includes("isTimeAndWorkRequest"), "TMW shared route support was lost during SAP restack.");
assert.ok(routeSource.includes("content.generation_runs"));
assert.ok(routeSource.includes("content.generation_run_items"));
assert.ok(routeSource.includes("content.generation_item_versions"));
assert.ok(routeSource.includes("question_studio.generation_run.created"));

console.log(JSON.stringify({
  status: "PASS_SAP_NEW_MAIN_SHARED_QUESTION_STUDIO_INTEGRATION",
  packageId: sap.packageId,
  cpCount: sap.cpIds.length,
  supportedLanguages: sap.supportedLanguages,
  reviewStatus: sap.reviewStatus,
  questionBankStatus: sap.questionBankStatus,
  questionBankWritable: sap.questionBankWritable,
  testEligibility: sap.testEligibility,
  publiclyPublishable: sap.publiclyPublishable,
  standardQuestionBankPromotionVerified: true,
  reviewEngineDelegationVerified: true,
  sharedRunsRouteVerified: true,
  currentNumberSystemPreserved: true,
  currentTimeAndWorkPreserved: true,
}));
