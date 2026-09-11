import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  buildEng001Cp002ReviewV1,
  renderEng001Cp002ReviewV1,
} from "../chapters/error-spotting/ENG-001/CP002/eng-001-cp002-review-v1-export";
import { validateEng001Cp002QuestionV1 } from "../chapters/error-spotting/ENG-001/CP002/eng-001-cp002-v1-validator";

const review = buildEng001Cp002ReviewV1();
for (const difficulty of ["easy", "medium", "hard"] as const) {
  assert.equal(review[difficulty].length, 20, `${difficulty} review must contain 20 questions`);
  assert.equal(new Set(review[difficulty].map((item) => item.domain)).size, 20, `${difficulty} review must cover 20 domains`);
  for (const item of review[difficulty]) {
    const validation = validateEng001Cp002QuestionV1(item.question);
    assert.equal(validation.ok, true, `${item.question.questionId}: ${JSON.stringify(validation.issues)}`);
    assert.equal(item.question.metadata.reviewOnly, true);
    assert.equal(item.question.metadata.cpId, "ENG-001-CP002");
  }
}

const expected = renderEng001Cp002ReviewV1();
const reviewPath = resolve(
  "artifacts/api-server/src/english-v1/chapters/error-spotting/ENG-001/CP002/ENG-001-CP002-REVIEW-V1.md",
);
const frozen = await readFile(reviewPath, "utf8");

if (frozen !== expected) {
  console.log("===BEGIN ENG-001-CP002 REVIEW V1===");
  console.log(expected);
  console.log("===END ENG-001-CP002 REVIEW V1===");
  throw new Error("ENG-001 CP002 frozen review is stale. Replace the review file with the deterministic export above.");
}

console.log("ENG-001 CP002 V1 deterministic review freeze passed.");
