import type { TsdCp005EnglishReviewQuestion } from "./english-review-runtime";
import { generateCp005EnglishAuditPoolV12, generateCp005ReviewSetV12 } from "./english-review-runtime-v12";

function polishStem(stem: string): string {
  return stem
    .replace("What is A's speed : B's speed?", "What is the speed ratio A:B?")
    .replace("while B starts at the same time at", "while B starts simultaneously at")
    .replace("B starts at the same time at", "B starts simultaneously at")
    .replace("A takes a halt at Q; B turns around immediately at P. They meet again for the second time", "A halts at Q; B turns around immediately at P. Their second meeting occurs");
}

export function generateCp005ReviewSetV12Final(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  return Object.freeze(generateCp005ReviewSetV12(perAuthority).map((question) => {
    const stem = polishStem(question.stem);
    return stem === question.stem ? question : Object.freeze({ ...question, stem });
  }));
}

/** Final wording polish changes only selected learner stems. */
export function generateCp005EnglishAuditPoolV12Final(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  return generateCp005EnglishAuditPoolV12(perAuthority);
}
