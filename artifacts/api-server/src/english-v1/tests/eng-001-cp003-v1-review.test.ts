import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { buildEng001Cp003ReviewV1, renderEng001Cp003ReviewV1 } from "../chapters/error-spotting/ENG-001/CP003/eng-001-cp003-review-v1-export";
import { ENG001_CP003_HUMAN_EDITORIAL_APPROVAL_V1 } from "../chapters/error-spotting/ENG-001/CP003/eng-001-cp003-human-approval-v1";
import { validateEng001Cp003QuestionV1 } from "../chapters/error-spotting/ENG-001/CP003/eng-001-cp003-v1-validator";

const review = buildEng001Cp003ReviewV1();
for (const difficulty of ["easy", "medium", "hard"] as const) {
  assert.equal(review[difficulty].length, 20);
  for (const item of review[difficulty]) {
    const validation = validateEng001Cp003QuestionV1(item.question);
    assert.equal(validation.ok, true, `${item.question.questionId}: ${JSON.stringify(validation.issues)}`);
    assert.equal(item.question.metadata.reviewOnly, true);
  }
}

const rendered = renderEng001Cp003ReviewV1();
const renderedSha256 = createHash("sha256").update(rendered, "utf8").digest("hex");
assert.equal(
  renderedSha256,
  ENG001_CP003_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewContentSha256,
  `ENG-001 CP003 approved review changed: expected ${ENG001_CP003_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewContentSha256}, got ${renderedSha256}`,
);
console.log("ENG-001 CP003 V1 approved review hash gate passed.");
