import { buildEng002Cp003ReviewV1 } from "../chapters/sentence-improvement/ENG-002/CP003/eng-002-cp003-review-v1-export";
import { generateEng002Cp003QuestionV1 } from "../chapters/sentence-improvement/ENG-002/CP003/eng-002-cp003-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string { return JSON.stringify(value); }

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const answerCounts = [0, 0, 0, 0];
  const domains = new Set<string>();
  let noImprovementCount = 0;
  for (let index = 0; index < 2_000; index += 1) {
    const input = { difficulty, seed: `eng002-cp003-test:${difficulty}:${index}` } as const;
    const first = generateEng002Cp003QuestionV1(input);
    const second = generateEng002Cp003QuestionV1(input);
    assert(stable(first) === stable(second), `${first.questionId} is not deterministic`);
    assert(first.options.length === 4, `${first.questionId} must expose four options`);
    assert(first.options[3] === "No improvement", `${first.questionId} must keep No improvement at D`);
    assert(new Set(first.options.map((option) => option.toLowerCase())).size === 4, `${first.questionId} has duplicate options`);
    assert(first.correctOptionIndex >= 0 && first.correctOptionIndex < 4, `${first.questionId} has an invalid answer index`);
    assert(first.targetText === first.segments[first.targetIndex]!.trim(), `${first.questionId} target mismatch`);
    assert(!first.sentence.includes(" / "), `${first.questionId} leaked Error Spotting segmentation`);
    assert(first.explanation.includes("Concept:"), `${first.questionId} lacks concept teaching`);
    assert(first.explanation.includes("Here:"), `${first.questionId} lacks sentence application`);
    assert(first.explanation.includes("Correct sentence:"), `${first.questionId} lacks corrected sentence`);
    assert(first.explanation.includes(first.correctedSentence), `${first.questionId} explanation lost corrected sentence`);
    assert(first.metadata.reviewOnly === true, `${first.questionId} must remain review-only`);
    assert(first.metadata.chapterId === "ENG-002" && first.metadata.cpId === "ENG-002-CP003", `${first.questionId} has wrong ids`);
    assert(first.options.slice(0, 3).every((option) => option.toLowerCase() !== first.targetText.toLowerCase()), `${first.questionId} repeats the visible target as a replacement`);
    if (first.metadata.noImprovement) {
      noImprovementCount += 1;
      assert(first.correctOptionIndex === 3, `${first.questionId} No-improvement item must key D`);
      assert(first.sentence === first.correctedSentence, `${first.questionId} No-improvement item must already be correct`);
      assert(first.explanation.startsWith("No improvement:"), `${first.questionId} must state No improvement first`);
    } else {
      assert(first.correctOptionIndex !== 3, `${first.questionId} improvement item cannot key D`);
      assert(first.sentence !== first.correctedSentence, `${first.questionId} improvement item must change the sentence`);
      assert(first.explanation.startsWith("Error:"), `${first.questionId} must state the error first`);
    }
    domains.add(first.metadata.semanticDomain);
    answerCounts[first.correctOptionIndex] += 1;
  }
  assert(domains.size >= 10, `${difficulty} reaches only ${domains.size} semantic domains`);
  const niShare = noImprovementCount / 2_000;
  assert(niShare >= 0.20 && niShare <= 0.30, `${difficulty} No-improvement share drifted to ${niShare}`);
  for (let option = 0; option < 4; option += 1) {
    const share = answerCounts[option]! / 2_000;
    assert(share >= 0.15 && share <= 0.35, `${difficulty} answer position ${option} drifted to ${share}`);
  }
}

for (const noImprovement of [false, true] as const) {
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const question = generateEng002Cp003QuestionV1({ difficulty, noImprovement, seed: `eng002-cp003-forced:${difficulty}:${noImprovement}` });
    assert(question.metadata.noImprovement === noImprovement, "Forced No-improvement mode was not preserved");
    assert((question.correctOptionIndex === 3) === noImprovement, "Forced No-improvement answer contract failed");
  }
}

const review = buildEng002Cp003ReviewV1();
assert(review.length === 60, `ENG-002 CP003 review must contain 60 questions; received ${review.length}`);
const allRules = new Set<string>();
for (const difficulty of ["easy", "medium", "hard"] as const) {
  const slice = review.filter((item) => item.difficulty === difficulty);
  assert(slice.length === 20, `${difficulty} review slice must contain 20 questions`);
  assert(slice.filter((item) => item.question.metadata.noImprovement).length === 5, `${difficulty} review slice must contain exactly five No-improvement questions`);
  slice.forEach((item) => allRules.add(item.question.metadata.ruleId));
}
assert(allRules.size === 10, `Review reaches only ${allRules.size}/10 article/determiner rule families`);

console.log("ENG-002-CP003 V1 sentence-improvement tests passed.");
