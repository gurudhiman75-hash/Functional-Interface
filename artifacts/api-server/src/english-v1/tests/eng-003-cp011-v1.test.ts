import { cp011ScenePoolV1, rulesForDifficultyCp011V1 } from "../chapters/error-spotting/ENG-001/CP011/eng-001-cp011-v1";
import { generateEng003Cp011QuestionV1, materializeEng003Cp011AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP011/eng-003-cp011-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
const stable = (value: unknown) => JSON.stringify(value);
const malformed = /\bhad\s+(?:qualify|lead|handle|back|complete|identify)\b|\bwould\s+(?:completed|identified|handled|backed)\b|\bwould have was\b/i;
const duplicatedMarker = /\b(if|unless|had|should|were|would|will|could|might)\s+\1\b/i;
const barePassiveIf = /^(?:If|if)\s+(?!.*\b(?:had|has|have|was|were|would|could|might|should)\s+(?:have\s+)?been\b).+?\s+been\s+(?:sealed|issued|preserved)\b/i;

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const pool = cp011ScenePoolV1(difficulty);
  const allowedRules = new Set(rulesForDifficultyCp011V1(difficulty));
  const eligibleDomains = new Set(pool.map((scene) => scene.domain));
  const eligibleScenes = new Set(pool.map((scene) => scene.id));
  const seenRules = new Set<string>();
  const seenDomains = new Set<string>();
  const seenScenes = new Set<string>();
  const answerCounts = [0, 0, 0, 0];

  assert(pool.length === 20, `${difficulty} should expose 20 donor scenes`);

  for (let index = 0; index < 2_000; index += 1) {
    const input = { difficulty, seed: `eng003-cp011-test:${difficulty}:${index}` } as const;
    const first = generateEng003Cp011QuestionV1(input);
    const replay = generateEng003Cp011QuestionV1(input);

    assert(stable(first) === stable(replay), `${first.questionId} is not deterministic`);
    assert(first.stem === "Choose the most appropriate option to fill in the blank.", `${first.questionId} has the wrong stem`);
    assert(first.options.length === 4, `${first.questionId} must expose four options`);
    assert(new Set(first.options.map((option) => option.toLowerCase())).size === 4, `${first.questionId} has duplicate options`);
    assert(!first.options.some((option) => option.toLowerCase() === "no improvement"), `${first.questionId} leaked No improvement`);
    assert(first.correctOptionIndex >= 0 && first.correctOptionIndex <= 3, `${first.questionId} has invalid answer index`);
    assert(first.segments[first.blankIndex]?.includes("_____"), `${first.questionId} lost its conditional blank`);
    assert((first.sentence.match(/_____/g) ?? []).length === 1, `${first.questionId} must have exactly one blank`);
    assert(!first.sentence.includes(" / "), `${first.questionId} leaked Error Spotting segmentation`);
    assert(first.explanation.startsWith("The blank needs"), `${first.questionId} explanation does not begin with the answer`);
    assert(first.explanation.includes("Concept:"), `${first.questionId} lacks Concept`);
    assert(first.explanation.includes("Here,"), `${first.questionId} lacks sentence-specific application`);
    assert(first.explanation.includes("Correct sentence:"), `${first.questionId} lacks corrected sentence`);
    assert(first.explanation.includes(first.correctedSentence), `${first.questionId} explanation lost corrected sentence`);
    assert(first.metadata.chapterId === "ENG-003" && first.metadata.cpId === "ENG-003-CP011", `${first.questionId} has wrong ids`);
    assert(first.metadata.reviewOnly === true, `${first.questionId} must remain review-only`);
    assert(allowedRules.has(first.metadata.ruleId), `${first.questionId} uses ineligible rule ${first.metadata.ruleId}`);

    for (const option of first.options) {
      const rendered = materializeEng003Cp011AnswerV1(first.segments, first.blankIndex, option);
      assert(!duplicatedMarker.test(rendered), `${first.questionId} rendered duplicated conditional marker: ${rendered}`);
      assert(!malformed.test(rendered), `${first.questionId} rendered malformed conditional: ${rendered}`);
      assert(!barePassiveIf.test(rendered), `${first.questionId} rendered bare passive conditional: ${rendered}`);
    }

    const answer = first.options[first.correctOptionIndex]!;
    assert(
      materializeEng003Cp011AnswerV1(first.segments, first.blankIndex, answer) === first.correctedSentence,
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
    const scene = cp011ScenePoolV1(difficulty, ruleId)[0]!;
    const question = generateEng003Cp011QuestionV1({
      difficulty,
      ruleId,
      sceneId: scene.id,
      seed: `eng003-cp011-rule-contract:${difficulty}:${ruleId}`,
    });
    assert(question.metadata.ruleId === ruleId, `${difficulty}/${ruleId} explicit rule selection drifted`);
    assert(question.metadata.sceneId === scene.id, `${difficulty}/${ruleId} explicit scene selection drifted`);
  }
}

console.log("ENG-003-CP011 V1 conditional grammar filler tests passed.");
