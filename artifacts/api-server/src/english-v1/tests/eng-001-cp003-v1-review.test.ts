import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildEng001Cp003ReviewV1, renderEng001Cp003ReviewV1 } from "../chapters/error-spotting/ENG-001/CP003/eng-001-cp003-review-v1-export";
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

const expected = renderEng001Cp003ReviewV1();
const path = resolve("artifacts/api-server/src/english-v1/chapters/error-spotting/ENG-001/CP003/ENG-001-CP003-REVIEW-V1.md");
const frozen = await readFile(path, "utf8");
if (frozen !== expected) {
  console.log("===BEGIN ENG-001-CP003 REVIEW V1===");
  console.log(expected);
  console.log("===END ENG-001-CP003 REVIEW V1===");
  throw new Error("ENG-001 CP003 frozen review is stale.");
}
console.log("ENG-001 CP003 V1 review freeze passed.");
