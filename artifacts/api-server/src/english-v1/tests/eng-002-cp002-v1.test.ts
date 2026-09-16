import { rulesForDifficultyCp002V1 } from "../chapters/error-spotting/ENG-001/CP002/cp002-patterns-v1";
import { buildEng002Cp002ReviewV1 } from "../chapters/sentence-improvement/ENG-002/CP002/eng-002-cp002-review-v1-export";
import { generateEng002Cp002QuestionV1 } from "../chapters/sentence-improvement/ENG-002/CP002/eng-002-cp002-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const allowedRules = new Set(rulesForDifficultyCp002V1(difficulty));
  const domains = new Set<string>();
  const answerCounts = [0, 0, 0, 0];
  let noImprovementCount = 0;

  for (let index = 0; index < 2_000; index += 1) {
    const input = { difficulty, seed: `eng002-cp002-test:${difficulty}:${index}` } as const;
    const first = generateEng002Cp002QuestionV1(input);
    const second = generateEng002Cp002QuestionV1(input);

    assert(stable(first) === stable(second), `${first.questionId} is not deterministic`);
    assert(first.stem.includes("most appropriate option") && first.stem.includes("underlined part"), `${first.questionId} has the wrong instruction surface`);
    assert(first.options.length === 4, `${first.questionId} must expose exactly four options`);
    assert(first.options[3] === "No improvement", `${first.questionId} must keep No improvement as option D`);
    assert(new Set(first.options.map((option) => option.toLowerCase())).size === 4, `${first.questionId} has duplicate options`);
    assert(first.correctOptionIndex >= 0 && first.correctOptionIndex < 4, `${first.questionId} has an invalid answer index`);
    assert(first.targetIndex >= 0 && first.targetIndex < first.segments.length, `${first.questionId} has an invalid target index`);
    assert(first.targetText === first.segments[first.targetIndex]!.trim(), `${first.questionId} target text does not match the underlined segment`);
    assert(!first.sentence.includes(" / "), `${first.questionId} leaked Error Spotting slash segmentation`);
    assert(first.explanation.includes("Concept:"), `${first.questionId} does not teach the underlying concept`);
    assert(first.explanation.includes("Here,"), `${first.questionId} does not apply the concept to the sentence`);
    assert(first.explanation.includes("Correct sentence:"), `${first.questionId} does not show the corrected sentence`);
    assert(first.explanation.includes(first.correctedSentence), `${first.questionId} explanation lost the corrected sentence`);
    assert(first.metadata.reviewOnly === true, `${first.questionId} must remain review-only`);
    assert(first.metadata.chapterId === "ENG-002", `${first.questionId} has the wrong chapter id`);
    assert(first.metadata.cpId === "ENG-002-CP002", `${first.questionId} has the wrong checkpoint id`);
    assert(allowedRules.has(first.metadata.ruleId), `${first.questionId} uses ${first.metadata.ruleId} outside ${difficulty}`);
    assert(first.options.slice(0, 3).every((option) => option.toLowerCase() !== first.targetText.toLowerCase()), `${first.questionId} duplicates the visible target as a replacement option`);

    if (first.metadata.noImprovement) {
      noImprovementCount += 1;
      assert(first.correctOptionIndex === 3, `${first.questionId} No-improvement item must key D`);
      assert(first.sentence === first.correctedSentence, `${first.questionId} No-improvement surface must already be correct`);
      assert(first.explanation.startsWith("No improvement:"), `${first.questionId} No-improvement explanation must state that first`);
    } else {
      assert(first.correctOptionIndex !== 3, `${first.questionId} improvement item cannot key No improvement`);
      assert(first.sentence !== first.correctedSentence, `${first.questionId} improvement item must actually change the sentence`);
      assert(first.options[first.correctOptionIndex] !== first.targetText, `${first.questionId} correction must differ from the underlined error`);
      assert(first.explanation.startsWith("Error:"), `${first.questionId} explanation must state the error first`);
    }

    domains.add(first.metadata.semanticDomain);
    answerCounts[first.correctOptionIndex] += 1;
  }

  assert(domains.size === 20, `${difficulty} reaches only ${domains.size}/20 semantic domains`);
  const noImprovementShare = noImprovementCount / 2_000;
  assert(noImprovementShare >= 0.20 && noImprovementShare <= 0.30, `${difficulty} No-improvement share drifted to ${noImprovementShare}`);
  for (let option = 0; option < answerCounts.length; option += 1) {
    const share = answerCounts[option]! / 2_000;
    assert(share >= 0.18 && share <= 0.32, `${difficulty} answer ${option} share drifted to ${share}`);
  }
}

for (const noImprovement of [false, true] as const) {
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const question = generateEng002Cp002QuestionV1({
      difficulty,
      noImprovement,
      seed: `eng002-cp002-forced:${difficulty}:${noImprovement}`,
    });
    assert(question.metadata.noImprovement === noImprovement, "Forced No-improvement mode was not preserved");
    assert((question.correctOptionIndex === 3) === noImprovement, "Forced mode answer contract failed");
  }
}

const review = buildEng002Cp002ReviewV1();
assert(review.length === 60, `ENG-002 CP002 review must contain 60 questions; received ${review.length}`);
for (const difficulty of ["easy", "medium", "hard"] as const) {
  const slice = review.filter((item) => item.difficulty === difficulty);
  assert(slice.length === 20, `${difficulty} review slice must contain 20 questions`);
  assert(new Set(slice.map((item) => item.question.metadata.semanticDomain)).size === 20, `${difficulty} review slice must cover all 20 semantic domains`);
  assert(slice.filter((item) => item.question.metadata.noImprovement).length === 5, `${difficulty} review slice must contain exactly five No-improvement questions`);
}

console.log("ENG-002-CP002 V1 sentence-improvement tests passed.");
