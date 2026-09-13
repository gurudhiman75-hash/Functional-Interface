import { POL_CP004_ARTICLES_V1 } from "./pol-cp004-facts";
import { generatePolCp004ReviewBatchV2 } from "./pol-cp004-review-generator-v2";
import type { PolCp004ReviewQuestion } from "./pol-cp004-review-types";

const article = (n: string) => POL_CP004_ARTICLES_V1.find((row) => row.article === n)!;

function makeSavingQuestion(articleNo: "31A" | "31B" | "31C", index: number): PolCp004ReviewQuestion {
  const row = article(articleNo);
  const target = index % 4;
  const all = [article("31A"), article("31B"), article("31C")];
  const correct = row.subject;
  const distractors = all.filter((item) => item.article !== articleNo).map((item) => item.subject);
  distractors.push("Constitutional remedies for enforcement of Fundamental Rights");
  const options = [...distractors, correct];
  const correctIndex = options.indexOf(correct);
  [options[correctIndex], options[target]] = [options[target], options[correctIndex]];
  return {
    questionId: `POL-CP004-V3-${String(index + 1).padStart(3, "0")}`,
    chapterId: "POL-001",
    cpId: "POL-CP-004",
    qlId: "POL-004-QL-021",
    qlName: "Saving of Certain Laws — Articles 31A, 31B and 31C",
    difficulty: "Medium",
    stem: `Article ${articleNo} deals with:`,
    options,
    correctIndex: target,
    canonicalAnswer: correct,
    explanation: row.simpleRule,
    sourceIds: [...row.sourceIds],
    sourceFactIds: [...row.sourceFactIds],
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generatePolCp004ReviewBatchV3() {
  const base = generatePolCp004ReviewBatchV2().map((q, index) => ({
    ...q,
    questionId: `POL-CP004-V3-${String(index + 1).padStart(3, "0")}`,
  }));
  base.push(makeSavingQuestion("31A", base.length));
  base.push(makeSavingQuestion("31B", base.length));
  base.push(makeSavingQuestion("31C", base.length));
  return base;
}
