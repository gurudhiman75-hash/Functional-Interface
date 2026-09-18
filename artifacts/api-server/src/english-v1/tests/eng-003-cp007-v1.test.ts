import { cp007ScenePoolV1, rulesForDifficultyCp007V1 } from "../chapters/error-spotting/ENG-001/CP007/eng-001-cp007-v1";
import { generateEng003Cp007QuestionV1, materializeEng003Cp007AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP007/eng-003-cp007-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
const stable = (value: unknown) => JSON.stringify(value);
const mechanical = /\b(?:but but|but so|but or|and and|and but|and or|or or|having to how|to how to|to for those|having to for|having to to)\b/i;

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const pool = cp007ScenePoolV1(difficulty);
  const allowedRules = new Set(rulesForDifficultyCp007V1(difficulty));
  const eligibleDomains = new Set(pool.map((scene) => scene.domain));
  const eligibleScenes = new Set(pool.map((scene) => scene.id));
  const seenRules = new Set<string>();
  const seenDomains = new Set<string>();
  const seenScenes = new Set<string>();
  const answerCounts = [0, 0, 0, 0];

  assert(pool.length === 20, `${difficulty} should expose 20 donor scenes`);

  for (let index = 0; index < 2_000; index += 1) {
    const input = { difficulty, seed: `eng003-cp007-test:${difficulty}:${index}` } as const;
    const first = generateEng003Cp007QuestionV1(input);
    const replay = generateEng003Cp007QuestionV1(input);

    assert(stable(first) === stable(replay), `${first.questionId} is not deterministic`);
    assert(first.stem === "Choose the most appropriate option to fill in the blank.", `${first.questionId} has the wrong stem`);
    assert(first.options.length === 4, `${first.questionId} must expose four options`);
    assert(new Set(first.options.map((option) => option.toLowerCase())).size === 4, `${first.questionId} has duplicate options`);
    assert(!first.options.some((option) => option.toLowerCase() === "no improvement"), `${first.questionId} leaked No improvement`);
    assert(!first.options.some((option) => mechanical.test(option)), `${first.questionId} contains a mechanical conjunction option`);
    assert(first.correctOptionIndex >= 0 && first.correctOptionIndex <= 3, `${first.questionId} has invalid answer index`);
    assert(first.segments[first.blankIndex] === "_____", `${first.questionId} lost its focused target blank`);
    assert((first.sentence.match(/_____/g) ?? []).length === 1, `${first.questionId} must have exactly one blank`);
    assert(!first.sentence.includes(" / "), `${first.questionId} leaked Error Spotting segmentation`);
    assert(first.explanation.startsWith("The blank needs"), `${first.questionId} explanation does not begin with the answer`);
    assert(first.explanation.includes("Concept:"), `${first.questionId} lacks Concept`);
    assert(first.explanation.includes("Here,"), `${first.questionId} lacks sentence-specific application`);
    assert(first.explanation.includes("Correct sentence:"), `${first.questionId} lacks corrected sentence`);
    assert(first.explanation.includes(first.correctedSentence), `${first.questionId} explanation lost corrected sentence`);
    assert(first.metadata.chapterId === "ENG-003" && first.metadata.cpId === "ENG-003-CP007", `${first.questionId} has wrong ids`);
    assert(first.metadata.reviewOnly === true, `${first.questionId} must remain review-only`);
    assert(allowedRules.has(first.metadata.ruleId), `${first.questionId} uses ineligible rule ${first.metadata.ruleId}`);

    const answer = first.options[first.correctOptionIndex]!;
    assert(
      materializeEng003Cp007AnswerV1(first.segments, first.blankIndex, answer) === first.correctedSentence,
      `${first.questionId} answer does not reconstruct the approved sentence`,
    );

    seenRules.add(first.metadata.ruleId);
    seenDomains.add(first.metadata.semanticDomain);
    seenScenes.add(first.metadata.sceneId);
    answerCounts[first.correctOptionIndex] += 1;
  }

  for (const ruleId of allowedRules) assert(seenRules.has(ruleId), `${difficulty} never exercised ${ruleId}`);
  assert(seenDomains.size === eligibleDomains.size, `${difficulty} reaches ${seenDomains.size}/${eligibleDomains.size} domains`);
  assert(seenScenes.size === eligibleScenes.size, `${difficulty} reaches ${seenScenes.size}/${eligibleScenes.size} donor scenes`);

  for (let option = 0; option < answerCounts.length; option += 1) {
    const share = answerCounts[option]! / 2_000;
    assert(share >= 0.18 && share <= 0.32, `${difficulty} answer option ${option} share drifted to ${share}`);
  }

  for (const ruleId of allowedRules) {
    const scene = cp007ScenePoolV1(difficulty, ruleId)[0]!;
    const question = generateEng003Cp007QuestionV1({
      difficulty,
      ruleId,
      sceneId: scene.id,
      seed: `eng003-cp007-rule-contract:${difficulty}:${ruleId}`,
    });
    assert(question.metadata.ruleId === ruleId, `${difficulty}/${ruleId} explicit rule selection drifted`);
    assert(question.metadata.sceneId === scene.id, `${difficulty}/${ruleId} explicit scene selection drifted`);
  }
}

console.log("ENG-003-CP007 V1 conjunction and parallelism filler tests passed.");
