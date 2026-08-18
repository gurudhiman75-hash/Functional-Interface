import assert from "node:assert/strict";

import { auditRnkExamModeMix } from "./rnk-001-exam-delivery-policy-v1";
import { previewRnk001QuestionStudioReview } from "./question-studio-review";

const profiles = [
  "SSC_CGL_T1",
  "SSC_CHSL_T1",
  "SSC_MTS",
  "IBPS_PO_PRE",
  "IBPS_CLERK_PRE",
  "PUNJAB_PSSSB_CLERK",
  "PUNJAB_EXCISE_INSP",
  "PUNJAB_POLICE",
] as const;

for (const count of [20, 24, 50] as const) {
  for (const profile of profiles) {
    for (const seed of ["quota-a", "quota-b"] as const) {
      const first = previewRnk001QuestionStudioReview({
        language: "en",
        examProfileId: profile,
        count,
        seed: `${profile}:${count}:${seed}`,
      });
      const replay = previewRnk001QuestionStudioReview({
        language: "en",
        examProfileId: profile,
        count,
        seed: `${profile}:${count}:${seed}`,
      });
      assert.deepEqual(
        replay.questions.map((question) => question.qlId),
        first.questions.map((question) => question.qlId),
        `${profile}/${count}/${seed} must replay the same QL schedule`,
      );
      const audit = auditRnkExamModeMix(first.questions.map((question) => question.qlId));
      assert.equal(
        audit.passesExamRealismGuard,
        true,
        `${profile}/${count}/${seed}: ${audit.violations.join(",")}`,
      );
      assert.equal(first.questions.length, count);
      assert.ok(first.questions.every((question) => question.examProfileId === profile));
      assert.ok(first.questions.every((question) => question.validation.valid));
      const expectedOptionCount = profile.startsWith("IBPS_") ? 5 : 4;
      assert.ok(first.questions.every((question) => question.optionCount === expectedOptionCount));
    }
  }
}

console.log(JSON.stringify({
  status: "PASS",
  profiles: profiles.length,
  batchSizes: [20, 24, 50],
  seedsPerCase: 2,
  integerQuotaGuard: true,
  deterministicReplay: true,
}, null, 2));
