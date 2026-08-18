import assert from "node:assert/strict";

import { auditRnkExamModeMix } from "./rnk-001-exam-delivery-policy-v1";
import { previewRnk001QuestionStudioReview } from "./question-studio-review";

const cases = [
  { profile: "IBPS_PO_PRE", count: 20, seed: "ibps-20-boundary" },
  { profile: "IBPS_PO_PRE", count: 24, seed: "ibps-24-rounding" },
  { profile: "IBPS_PO_PRE", count: 50, seed: "ibps-50-full" },
  { profile: "IBPS_CLERK_PRE", count: 20, seed: "ibps-clerk-20" },
  { profile: "SSC_CGL_T1", count: 20, seed: "ssc-cgl-20" },
  { profile: "SSC_MTS", count: 20, seed: "ssc-mts-20" },
  { profile: "PUNJAB_PSSSB_CLERK", count: 20, seed: "punjab-clerk-20" },
  { profile: "PUNJAB_POLICE", count: 20, seed: "punjab-police-20" },
] as const;

for (const { profile, count, seed } of cases) {
  const preview = previewRnk001QuestionStudioReview({
    language: "en",
    examProfileId: profile,
    count,
    seed,
  });
  const audit = auditRnkExamModeMix(preview.questions.map((question) => question.qlId));
  assert.equal(
    audit.passesExamRealismGuard,
    true,
    `${profile}/${count}: ${audit.violations.join(",")}`,
  );
  assert.equal(preview.questions.length, count);
  assert.ok(preview.questions.every((question) => question.examProfileId === profile));
  assert.ok(preview.questions.every((question) => question.validation.valid));
  const expectedOptionCount = profile.startsWith("IBPS_") ? 5 : 4;
  assert.ok(preview.questions.every((question) => question.optionCount === expectedOptionCount));
}

const deterministicA = previewRnk001QuestionStudioReview({
  language: "en",
  examProfileId: "IBPS_PO_PRE",
  count: 20,
  seed: "deterministic-quota-check",
});
const deterministicB = previewRnk001QuestionStudioReview({
  language: "en",
  examProfileId: "IBPS_PO_PRE",
  count: 20,
  seed: "deterministic-quota-check",
});
assert.deepEqual(
  deterministicA.questions.map((question) => question.qlId),
  deterministicB.questions.map((question) => question.qlId),
);

console.log(JSON.stringify({
  status: "PASS",
  cases: cases.length,
  boundaryBatchSizes: [20, 24, 50],
  integerQuotaGuard: true,
  deterministicReplay: true,
}, null, 2));
