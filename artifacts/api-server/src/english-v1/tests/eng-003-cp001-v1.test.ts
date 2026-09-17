import { rulesForDifficultyV4 } from "../chapters/error-spotting/ENG-001/CP001/cp001-patterns-v4";
import { generateEng003Cp001QuestionV1 } from "../chapters/grammar-fillers/ENG-003/CP001/eng-003-cp001-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const allowedRules = new Set(rulesForDifficultyV4(difficulty));
  const seenRules = new Set<string>();
  const domains = new Set<string>();
  const answerCounts = [0, 0, 0, 0];

  for (let index = 0; index < 2_000; index += 1) {
    const input = { difficulty, seed: `eng003-cp001-test:${difficulty}:${index}` } as const;
    const first = generateEng003Cp001QuestionV1(input);
    const second = generateEng003Cp001QuestionV1(input);

    assert(stable(first) === stable(second), `${first.questionId} is not deterministic`);
    assert(first.stem === "Choose the most appropriate option to fill in the blank.", `${first.questionId} has the wrong stem`);
    assert(first.options.length === 4, `${first.questionId} must expose four options`);
    assert(new Set(first.options.map((option) => option.toLowerCase())).size === 4, `${first.questionId} has duplicate options`);
    assert(!first.options.includes("No improvement"), `${first.questionId} leaked sentence-improvement option text`);
    assert(first.correctOptionIndex >= 0 && first.correctOptionIndex <= 3, `${first.questionId} has an invalid answer index`);
    assert(first.blankIndex >= 0 && first.blankIndex < first.segments.length, `${first.questionId} has an invalid blank index`);
    assert(first.segments[first.blankIndex] === "_____", `${first.questionId} does not blank the intended segment`);
    assert((first.sentence.match(/_____/g) ?? []).length === 1, `${first.questionId} must contain exactly one visible blank`);
    assert(!first.correctedSentence.includes("_____"), `${first.questionId} corrected sentence still contains the blank`);
    assert(first.explanation.startsWith("The blank needs"), `${first.questionId} explanation must begin with the actual filler`);
    assert(first.explanation.includes("Concept:"), `${first.questionId} explanation must teach the grammar rule`);
    assert(first.explanation.includes("Here,"), `${first.questionId} explanation must apply the rule to this sentence`);
    assert(first.explanation.includes(first.correctedSentence), `${first.questionId} explanation must show the completed sentence`);
    assert(first.metadata.chapterId === "ENG-003", `${first.questionId} has the wrong chapter id`);
    assert(first.metadata.cpId === "ENG-003-CP001", `${first.questionId} has the wrong checkpoint id`);
    assert(first.metadata.reviewOnly === true, `${first.questionId} must remain review-only`);
    assert(allowedRules.has(first.metadata.ruleId), `${first.questionId} uses ${first.metadata.ruleId} outside ${difficulty}`);

    const answer = first.options[first.correctOptionIndex]!;
    assert(first.correctedSentence.includes(answer), `${first.questionId} answer does not appear in the completed sentence`);

    seenRules.add(first.metadata.ruleId);
    domains.add(first.metadata.semanticDomain);
    answerCounts[first.correctOptionIndex] += 1;
  }

  for (const ruleId of allowedRules) {
    assert(seenRules.has(ruleId), `${difficulty} never exercised ${ruleId}`);
  }
  assert(domains.size >= 18, `${difficulty} reaches only ${domains.size} semantic domains`);
  for (let option = 0; option < answerCounts.length; option += 1) {
    const share = answerCounts[option]! / 2_000;
    assert(share >= 0.18 && share <= 0.32, `${difficulty} answer option ${option} share drifted to ${share}`);
  }
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  for (const ruleId of rulesForDifficultyV4(difficulty)) {
    const question = generateEng003Cp001QuestionV1({
      difficulty,
      ruleId,
      seed: `eng003-cp001-rule-contract:${difficulty}:${ruleId}`,
    });
    assert(question.metadata.ruleId === ruleId, `${difficulty}/${ruleId} explicit rule selection drifted`);
  }
}

console.log("ENG-003-CP001 V1 grammar filler tests passed.");
