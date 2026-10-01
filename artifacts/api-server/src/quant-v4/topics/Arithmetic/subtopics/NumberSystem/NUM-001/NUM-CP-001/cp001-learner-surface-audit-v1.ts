import assert from "node:assert/strict";

import {
  getNumCp001QuestionStudioReviewQlIds,
  runNumCp001QuestionStudioReview,
} from "./question-studio-review-release";

const SEEDS_PER_QL = 12;
const qlIds = [...getNumCp001QuestionStudioReviewQlIds()].sort();

function normalizeStem(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?%?/gu, "#")
    .replace(/\s+/gu, " ")
    .trim();
}

function numericSignature(value: string) {
  return (value.match(/\b\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?%?/gu) ?? []).join("|");
}

const perQl: any[] = [];

for (const qlId of qlIds) {
  const stems = new Set<string>();
  const structures = new Set<string>();
  const answers = new Set<string>();
  const numeric = new Set<string>();
  let minExplanationLines = Number.POSITIVE_INFINITY;

  for (let index = 0; index < SEEDS_PER_QL; index += 1) {
    const seed = `NUM-CP001-LEARNER-SURFACE-AUDIT-V1:${qlId}:${index + 1}`;
    const question: any = runNumCp001QuestionStudioReview({
      questionLanguageId: qlId as any,
      language: "en",
      seed,
    });

    assert.equal(question.questionLanguageId, qlId, qlId + ": Question Studio QL drift.");
    assert.equal(question.options.length, 4, qlId + ": learner option count drift.");
    assert.equal(new Set(question.options).size, 4, qlId + ": duplicate learner options.");
    assert.equal(question.options[question.correctIndex], question.answer, qlId + ": answer/index drift.");
    assert.ok(String(question.stem).trim().length >= 18, qlId + ": thin learner stem.");
    assert.ok((question.explanation?.lines ?? []).length >= 3, qlId + ": explanation should contain concept, working and answer.");

    stems.add(String(question.stem));
    structures.add(normalizeStem(String(question.stem)));
    answers.add(String(question.answer));
    numeric.add(numericSignature(String(question.stem)));
    minExplanationLines = Math.min(minExplanationLines, question.explanation.lines.length);
  }

  perQl.push({
    qlId,
    rawStemCount: stems.size,
    normalizedStemStructureCount: structures.size,
    answerCount: answers.size,
    numericSignatureCount: numeric.size,
    minExplanationLines,
  });
}

const ql125 = perQl.find((item) => item.qlId === "NUM-QL-125")!;
assert.ok(ql125.rawStemCount >= 4, "NUM-QL-125 learner stem breadth remains below 4.");

const ql129 = perQl.find((item) => item.qlId === "NUM-QL-129")!;
assert.ok(ql129.rawStemCount >= 3, "NUM-QL-129 learner stem breadth remains below 3.");

const ql141 = perQl.find((item) => item.qlId === "NUM-QL-141")!;
assert.equal(ql141.answerCount, 2, "NUM-QL-141 is a binary feasibility authority and should retain exactly two answer classes.");

for (const qlId of [
  "NUM-QL-128", "NUM-QL-130", "NUM-QL-131", "NUM-QL-132", "NUM-QL-133",
  "NUM-QL-134", "NUM-QL-135", "NUM-QL-136", "NUM-QL-137", "NUM-QL-140",
]) {
  const row = perQl.find((item) => item.qlId === qlId)!;
  assert.ok(row.minExplanationLines >= 4, qlId + ": learner explanation remains too thin.");
}

console.log(JSON.stringify({
  version: "NUM-CP-001-LEARNER-SURFACE-AUDIT-V1",
  qlCount: qlIds.length,
  seedsPerQl: SEEDS_PER_QL,
  perQl,
}, null, 2));
console.log("PASS_NUM_CP001_LEARNER_SURFACE_AUDIT_V1");
