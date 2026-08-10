import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  getGeneratedItemApprovalDisposition,
} from "../../../../../lib/admin-question-studio-approval-policy";
import {
  SER_CP007_FROZEN_TEMPLATE_AUTHORITIES,
} from "../SER-CP-007-ENGLISH-FREEZE/ser-cp-007-english-freeze-authority";
import {
  SER_CP007_PERMANENT_QL_IDS,
} from "../SER-PERMANENT-QL-REGISTRY";
import {
  SER_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewSer001QuestionStudioReview,
} from "./question-studio-review-adapter";
import {
  generateSerCp007QuestionStudioReviewSweep,
  SER_CP007_QUESTION_STUDIO_RUNTIME_STATE,
} from "./ser-cp-007-question-studio-runtime";

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";
const {
  assertGeneratedQuestionBankEligible,
  getGeneratedQuestionBankEligibilityIssue,
} = await import("../../../../../lib/admin-question-conversion");

assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId, "SER-001");
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.enabled, true);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioDiscoverable, true);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.generationDomain, "reasoning-v1");
assert.deepEqual(
  SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages,
  ["en", "hi", "pa"],
);
assert.deepEqual(
  SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.qlIds,
  [...SER_CP007_PERMANENT_QL_IDS],
);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.frozenTemplateCount, 140);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualProofPayloadCount, 420);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankStatus, "NOT_STORED");
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligibility, "INELIGIBLE");
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);

assert.deepEqual(SER_CP007_QUESTION_STUDIO_RUNTIME_STATE, {
  authority: "SER_CP007_QUESTION_STUDIO_REVIEW_RUNTIME_V1",
  packageId: "SER-001",
  canonicalProblemId: "SER-CP-007",
  runtimeMode: "FROZEN_REVIEW",
  reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
  active: true,
  questionStudioDiscoverable: true,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  publiclyPublishable: false,
});

const sweep = generateSerCp007QuestionStudioReviewSweep(97);
assert.equal(SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length, 140);
assert.equal(SER_CP007_PERMANENT_QL_IDS.length, 13);
assert.equal(sweep.length, 420);

const localeCounts = new Map<string, number>();
const localeQlCoverage = new Map<string, Set<string>>();
const identities = new Set<string>();
let questionBankRejectionProofs = 0;
let localizedScriptProofs = 0;

for (const item of sweep) {
  const identity = `${item.temporaryTemplateId}:${item.seed}:${item.locale}`;
  assert.equal(identities.has(identity), false, `${identity}: duplicate`);
  identities.add(identity);

  localeCounts.set(item.locale, (localeCounts.get(item.locale) ?? 0) + 1);
  const qls = localeQlCoverage.get(item.locale) ?? new Set<string>();
  qls.add(item.permanentQlId);
  localeQlCoverage.set(item.locale, qls);

  assert.equal(item.packageId, "SER-001");
  assert.equal(item.canonicalProblemId, "SER-CP-007");
  assert.equal(item.options.length, 4);
  assert.equal(new Set(item.options).size, 4);
  assert.equal(item.options[item.correctIndex], item.canonicalAnswer);
  assert.equal(item.validation.valid, true);
  assert.equal(item.questionBankStatus, "NOT_STORED");
  assert.equal(item.questionBankWritable, false);
  assert.equal(item.testEligibility, "INELIGIBLE");
  assert.equal(item.testEligible, false);
  assert.equal(item.publiclyPublishable, false);

  assert.equal(
    getGeneratedQuestionBankEligibilityIssue(item),
    "questionBankStatus is NOT_STORED",
  );
  assert.throws(
    () => assertGeneratedQuestionBankEligible(item),
    /questionBankStatus is NOT_STORED/,
  );
  questionBankRejectionProofs += 1;

  if (item.language !== "en") {
    const script = item.language === "hi"
      ? /[\u0900-\u097F]/u
      : /[\u0A00-\u0A7F]/u;
    assert.ok(
      script.test(`${item.stem}\n${item.explanation}`),
      `${identity}: localized script missing`,
    );
    localizedScriptProofs += 1;
  }
}

for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
  assert.equal(localeCounts.get(locale), 140, `${locale}: template coverage`);
  assert.deepEqual(
    [...(localeQlCoverage.get(locale) ?? new Set<string>())].sort(),
    [...SER_CP007_PERMANENT_QL_IDS].sort(),
    `${locale}: permanent QL coverage`,
  );
}

let deterministicBatchProofs = 0;
let targetedQlProofs = 0;
for (const language of ["en", "hi", "pa"] as const) {
  const first = previewSer001QuestionStudioReview({
    language,
    count: 50,
    seed: `ser-current-main:${language}`,
  });
  const second = previewSer001QuestionStudioReview({
    language,
    count: 50,
    seed: `ser-current-main:${language}`,
  });
  assert.equal(first.questions.length, 50);
  assert.deepEqual(
    first.questions.map((question) => question.questionId),
    second.questions.map((question) => question.questionId),
  );
  assert.ok(first.questions.every((question) => question.questionBankWritable === false));
  assert.ok(first.questions.every((question) => question.testEligible === false));
  assert.ok(first.questions.every((question) => question.publiclyPublishable === false));
  deterministicBatchProofs += 1;

  for (const qlId of SER_CP007_PERMANENT_QL_IDS) {
    const targeted = previewSer001QuestionStudioReview({
      language,
      qlId,
      count: 1,
      seed: `ser-targeted:${language}:${qlId}`,
    });
    assert.equal(targeted.questions.length, 1);
    assert.equal(targeted.questions[0]!.qlId, qlId);
    assert.equal(targeted.questions[0]!.language, language);
    targetedQlProofs += 1;
  }
}

assert.deepEqual(
  getGeneratedItemApprovalDisposition({
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
  }),
  {
    mode: "review_only",
    reason: "Payload explicitly disables Question Bank storage",
  },
);
assert.deepEqual(
  getGeneratedItemApprovalDisposition({
    questionBankStatus: "STORED",
    questionBankWritable: true,
  }),
  { mode: "question_bank", reason: null },
);

const seriesRoute = readFileSync(
  "artifacts/api-server/src/routes/admin-question-studio-series.ts",
  "utf8",
);
const bulkReviewRoute = readFileSync(
  "artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts",
  "utf8",
);
const routeIndex = readFileSync(
  "artifacts/api-server/src/routes/index.ts",
  "utf8",
);
const adminOperationsPage = readFileSync(
  "artifacts/admin-app/src/pages/content/QuestionStudioOperationsPage.tsx",
  "utf8",
);

assert.match(seriesRoute, /SER_001_QUESTION_STUDIO_REVIEW_PACKAGE/);
assert.match(seriesRoute, /\/reasoning\/series\/package/);
assert.match(seriesRoute, /\/reasoning\/series\/preview/);
assert.match(seriesRoute, /\/reasoning\/series\/runs/);
assert.match(seriesRoute, /\/reasoning\/series\/status/);
assert.match(seriesRoute, /questionBankWritable: false/);
assert.match(seriesRoute, /testEligible: false/);
assert.match(seriesRoute, /publiclyPublishable: false/);
assert.match(routeIndex, /adminQuestionStudioSeriesRouter/);
assert.ok(
  routeIndex.indexOf("adminQuestionStudioSeriesRouter")
    < routeIndex.indexOf("adminQuestionStudioRouter"),
  "Series router must be mounted before the generic Question Studio router.",
);
assert.match(bulkReviewRoute, /getGeneratedItemApprovalDisposition/);
assert.match(bulkReviewRoute, /disposition\.mode === "question_bank"/);
assert.match(bulkReviewRoute, /reviewOnlyApprovedCount/);
assert.match(adminOperationsPage, /QuestionStudioSeriesReviewPanel/);

console.log(JSON.stringify({
  status: "PASS_SER_CP007_CURRENT_MAIN_QUESTION_STUDIO_INTEGRATION",
  packageId: "SER-001",
  runtimeMode: "FROZEN_REVIEW",
  frozenTemplates: SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length,
  permanentQls: SER_CP007_PERMANENT_QL_IDS.length,
  multilingualPayloads: sweep.length,
  payloadsPerLocale: Object.fromEntries(localeCounts),
  questionBankRejectionProofs,
  localizedScriptProofs,
  deterministicBatchProofs,
  targetedQlProofs,
  reviewOnlyApprovalProofs: 1,
  routeMountProofs: 1,
  adminPanelProofs: 1,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
