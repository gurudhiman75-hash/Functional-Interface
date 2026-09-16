import { rulesForDifficultyV4 } from "../chapters/error-spotting/ENG-001/CP001/cp001-patterns-v4";
import { generateEng002Cp001QuestionV1 } from "../chapters/sentence-improvement/ENG-002/CP001/eng-002-cp001-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const allowedRules = new Set(rulesForDifficultyV4(difficulty));
  const domains = new Set<string>();
  const answerCounts = [0, 0, 0, 0];
  let noImprovementCount = 0;

  for (let index = 0; index < 2_000; index += 1) {
    const input = { difficulty, seed: `eng002-cp001-test:${difficulty}:${index}` } as const;
    const first = generateEng002Cp001QuestionV1(input);
    const second = generateEng002Cp001QuestionV1(input);

    assert(stable(first) === stable(second), `${first.questionId} is not deterministic`);
    assert(first.stem.includes("best replacement"), `${first.questionId} has the wrong instruction surface`);
    assert(first.options.length === 4, `${first.questionId} must expose exactly four options`);
    assert(first.options[3] === "No improvement", `${first.questionId} must keep No improvement as option D`);
    assert(new Set(first.options.map((option) => option.toLowerCase())).size === 4, `${first.questionId} has duplicate options`);
    assert(first.correctOptionIndex >= 0 && first.correctOptionIndex < 4, `${first.questionId} has an invalid answer index`);
    assert(first.targetIndex >= 0 && first.targetIndex < first.segments.length, `${first.questionId} has an invalid target index`);
    assert(first.targetText === first.segments[first.targetIndex]!.trim(), `${first.questionId} target text is not the underlined segment`);
    assert(first.explanation.includes(first.correctedSentence), `${first.questionId} explanation must show the corrected sentence`);
    assert(first.metadata.reviewOnly === true, `${first.questionId} must remain review-only`);
    assert(first.metadata.chapterId === "ENG-002", `${first.questionId} has the wrong chapter id`);
    assert(first.metadata.cpId === "ENG-002-CP001", `${first.questionId} has the wrong checkpoint id`);
    assert(allowedRules.has(first.metadata.ruleId), `${first.questionId} uses ${first.metadata.ruleId} outside ${difficulty}`);

    if (first.metadata.noImprovement) {
      noImprovementCount += 1;
      assert(first.correctOptionIndex === 3, `${first.questionId} no-improvement item must key D`);
      assert(first.sentence === first.correctedSentence, `${first.questionId} no-improvement surface must already be correct`);
    } else {
      assert(first.correctOptionIndex !== 3, `${first.questionId} improvement item cannot key No improvement`);
      assert(first.sentence !== first.correctedSentence, `${first.questionId} improvement item must actually change the sentence`);
      assert(first.options[first.correctOptionIndex] !== first.targetText, `${first.questionId} replacement must differ from the underlined error`);
    }

    domains.add(first.metadata.semanticDomain);
    answerCounts[first.correctOptionIndex] += 1;
  }

  assert(domains.size === 20, `${difficulty} reaches only ${domains.size}/20 semantic domains`);
  const noImprovementShare = noImprovementCount / 2_000;
  assert(noImprovementShare >= 0.20 && noImprovementShare <= 0.30, `${difficulty} no-improvement share drifted to ${noImprovementShare}`);
  for (let option = 0; option < answerCounts.length; option += 1) {
    const share = answerCounts[option]! / 2_000;
    assert(share >= 0.18 && share <= 0.32, `${difficulty} answer ${option} share drifted to ${share}`);
  }
}

// Forced-mode contracts make editorial review reproducible.
for (const noImprovement of [false, true] as const) {
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const question = generateEng002Cp001QuestionV1({
      difficulty,
      noImprovement,
      seed: `eng002-cp001-forced:${difficulty}:${noImprovement}`,
    });
    assert(question.metadata.noImprovement === noImprovement, "Forced no-improvement mode was not preserved");
    assert((question.correctOptionIndex === 3) === noImprovement, "Forced mode answer contract failed");
  }
}

console.log("ENG-002-CP001 V1 sentence-improvement tests passed.");
