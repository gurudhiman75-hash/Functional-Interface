import { cp003ScenePoolV1 } from "../chapters/error-spotting/ENG-001/CP003/eng-001-cp003-v1";
import { generateEng003Cp003QuestionV1, materializeEng003Cp003AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP003/eng-003-cp003-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const pool = cp003ScenePoolV1(difficulty);
  const allowedRules = new Set(pool.map((scene) => scene.ruleId));
  const eligibleDomains = new Set(pool.map((scene) => scene.domain));
  const eligibleScenes = new Set(pool.map((scene) => scene.id));
  const seenRules = new Set<string>();
  const domains = new Set<string>();
  const scenes = new Set<string>();
  const answerCounts = [0, 0, 0, 0];

  for (let index = 0; index < 2_000; index += 1) {
    const input = { difficulty, seed: `eng003-cp003-test:${difficulty}:${index}` } as const;
    const first = generateEng003Cp003QuestionV1(input);
    const second = generateEng003Cp003QuestionV1(input);

    assert(stable(first) === stable(second), `${first.questionId} is not deterministic`);
    assert(first.stem === "Choose the most appropriate option to fill in the blank.", `${first.questionId} has the wrong stem`);
    assert(first.options.length === 4, `${first.questionId} must expose four options`);
    assert(new Set(first.options.map((option) => option.toLowerCase())).size === 4, `${first.questionId} has duplicate options`);
    assert(!first.options.some((option) => option.toLowerCase() === "no improvement"), `${first.questionId} leaked sentence-improvement option text`);
    assert(first.correctOptionIndex >= 0 && first.correctOptionIndex <= 3, `${first.questionId} has an invalid answer index`);
    assert(first.blankIndex >= 0 && first.blankIndex < first.segments.length, `${first.questionId} has an invalid blank index`);
    assert(first.segments[first.blankIndex]?.startsWith("_____ "), `${first.questionId} does not blank only the intended determiner`);
    assert((first.sentence.match(/_____/g) ?? []).length === 1, `${first.questionId} must contain exactly one visible blank`);
    assert(!first.correctedSentence.includes("_____"), `${first.questionId} corrected sentence still contains the blank`);
    assert(!first.sentence.includes(" / "), `${first.questionId} leaked Error Spotting slash segmentation`);
    assert(first.explanation.startsWith("The blank needs"), `${first.questionId} explanation must begin with the exact filler`);
    assert(first.explanation.includes("Concept:"), `${first.questionId} explanation must teach the article/determiner concept`);
    assert(first.explanation.includes("Here,"), `${first.questionId} explanation must apply the concept to the sentence`);
    assert(first.explanation.includes("Correct sentence:"), `${first.questionId} explanation must show the completed sentence`);
    assert(first.explanation.includes(first.correctedSentence), `${first.questionId} explanation lost the completed sentence`);
    assert(first.metadata.chapterId === "ENG-003", `${first.questionId} has the wrong chapter id`);
    assert(first.metadata.cpId === "ENG-003-CP003", `${first.questionId} has the wrong checkpoint id`);
    assert(first.metadata.reviewOnly === true, `${first.questionId} must remain review-only`);
    assert(allowedRules.has(first.metadata.ruleId), `${first.questionId} uses ${first.metadata.ruleId} outside ${difficulty}`);

    const answer = first.options[first.correctOptionIndex]!;
    assert(first.correctedSentence.includes(answer), `${first.questionId} answer does not reconstruct the approved sentence`);

    seenRules.add(first.metadata.ruleId);
    domains.add(first.metadata.semanticDomain);
    scenes.add(first.metadata.sceneId);
    answerCounts[first.correctOptionIndex] += 1;
  }

  for (const ruleId of allowedRules) {
    assert(seenRules.has(ruleId), `${difficulty} never exercised ${ruleId}`);
  }
  assert(domains.size === eligibleDomains.size, `${difficulty} reaches ${domains.size}/${eligibleDomains.size} eligible semantic domains`);
  assert(scenes.size === eligibleScenes.size, `${difficulty} reaches ${scenes.size}/${eligibleScenes.size} eligible donor scenes`);
  for (let option = 0; option < answerCounts.length; option += 1) {
    const share = answerCounts[option]! / 2_000;
    assert(share >= 0.18 && share <= 0.32, `${difficulty} answer option ${option} share drifted to ${share}`);
  }
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const pool = cp003ScenePoolV1(difficulty);
  const rules = [...new Set(pool.map((scene) => scene.ruleId))];
  for (const ruleId of rules) {
    const question = generateEng003Cp003QuestionV1({
      difficulty,
      ruleId,
      seed: `eng003-cp003-rule-contract:${difficulty}:${ruleId}`,
    });
    assert(question.metadata.ruleId === ruleId, `${difficulty}/${ruleId} explicit rule selection drifted`);
  }
}

console.log("ENG-003-CP003 V1 articles and determiners grammar filler tests passed.");
