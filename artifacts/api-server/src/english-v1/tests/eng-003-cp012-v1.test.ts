import { cp012ScenePoolV1, rulesForDifficultyCp012V1 } from "../chapters/error-spotting/ENG-001/CP012/eng-001-cp012-v1";
import { generateEng003Cp012QuestionV1, materializeEng003Cp012AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP012/eng-003-cp012-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
const stable = (value: unknown) => JSON.stringify(value);
const malformedAux = /\b(was|were|is|are|has|have|had|will|would|can|could|may|might|must|should)\s+\1\b/i;
const malformedPerfect = /\bhad\s+(?:qualify|complete|identify|finish|join)\b/i;
const malformedModal = /\bwould\s+(?:qualified|completed|identified|finished|joined)\b/i;
const overFormalExplanation = /\b(?:co-referential|deictic|lexical verb|auxiliary chain|patient role|indisputable universal)\b/i;

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const pool = cp012ScenePoolV1(difficulty);
  const allowedRules = new Set(rulesForDifficultyCp012V1(difficulty));
  const eligibleDomains = new Set(pool.map((scene) => scene.domain));
  const eligibleScenes = new Set(pool.map((scene) => scene.id));
  const seenRules = new Set<string>();
  const seenDomains = new Set<string>();
  const seenScenes = new Set<string>();
  const answerCounts = [0, 0, 0, 0];

  assert(pool.length === (difficulty === "easy" ? 20 : 24), `${difficulty} donor scene count drifted`);

  for (let index = 0; index < 2_000; index += 1) {
    const input = { difficulty, seed: `eng003-cp012-test:${difficulty}:${index}` } as const;
    const first = generateEng003Cp012QuestionV1(input);
    const replay = generateEng003Cp012QuestionV1(input);

    assert(stable(first) === stable(replay), `${first.questionId} is not deterministic`);
    assert(first.stem === "Choose the most appropriate option to fill in the blank.", `${first.questionId} has wrong stem`);
    assert(first.options.length === 4, `${first.questionId} must expose four options`);
    assert(new Set(first.options.map((option) => option.toLowerCase())).size === 4, `${first.questionId} has duplicate options`);
    assert(!first.options.some((option) => option.toLowerCase() === "no improvement"), `${first.questionId} leaked No improvement`);
    assert((first.sentence.match(/_____/g) ?? []).length === 1, `${first.questionId} must have exactly one blank`);
    assert(first.segments[first.blankIndex]?.includes("_____"), `${first.questionId} lost its focused blank`);
    assert(!first.sentence.includes(" / "), `${first.questionId} leaked Error Spotting segmentation`);
    assert(first.explanation.startsWith("The blank needs"), `${first.questionId} explanation does not begin with the answer`);
    assert(first.explanation.includes("Concept:"), `${first.questionId} lacks Concept`);
    assert(first.explanation.includes("Here,"), `${first.questionId} lacks application`);
    assert(first.explanation.includes("Correct sentence:"), `${first.questionId} lacks corrected sentence`);
    assert(first.explanation.includes(first.correctedSentence), `${first.questionId} explanation lost corrected sentence`);
    assert(!overFormalExplanation.test(first.explanation), `${first.questionId} explanation became too formal`);
    assert(first.metadata.chapterId === "ENG-003" && first.metadata.cpId === "ENG-003-CP012", `${first.questionId} has wrong ids`);
    assert(first.metadata.reviewOnly === true, `${first.questionId} must remain review-only`);
    assert(allowedRules.has(first.metadata.ruleId), `${first.questionId} uses ineligible rule ${first.metadata.ruleId}`);
    if (first.metadata.ruleId === "GR-VNR-001") {
      const wrongs = first.options.filter((_, optionIndex) => optionIndex !== first.correctOptionIndex);
      assert(!wrongs.some((option) => /\b(?:is|are|was|were) being\b|\bhad been\b/i.test(option)), `${first.questionId} VNR-001 should not use valid alternate passive tenses`);
    }
    if (first.metadata.ruleId === "GR-VNR-002") {
      const wrongs = first.options.filter((_, optionIndex) => optionIndex !== first.correctOptionIndex);
      assert(!wrongs.some((option) => /\b(?:is|are|was|were) being\b|\b(?:has|have|had) been\b|\bwill have been\b/i.test(option)), `${first.questionId} VNR-002 distractor looks like a valid competing passive chain`);
    }
    if (first.metadata.ruleId === "GR-VNR-007") {
      assert(first.options.every((option) => /^[A-Za-z]+$/.test(option)), `${first.questionId} pronoun filler should use pronoun-only options`);
    }

    for (const option of first.options) {
      const rendered = materializeEng003Cp012AnswerV1(first.segments, first.blankIndex, option);
      assert(!malformedAux.test(rendered), `${first.questionId} duplicated an auxiliary: ${rendered}`);
      assert(!malformedPerfect.test(rendered), `${first.questionId} malformed perfect sequence: ${rendered}`);
      assert(!malformedModal.test(rendered), `${first.questionId} malformed modal sequence: ${rendered}`);
    }

    const answer = first.options[first.correctOptionIndex]!;
    assert(
      materializeEng003Cp012AnswerV1(first.segments, first.blankIndex, answer) === first.correctedSentence,
      `${first.questionId} answer does not reconstruct the approved sentence`,
    );

    seenRules.add(first.metadata.ruleId);
    seenDomains.add(first.metadata.semanticDomain);
    seenScenes.add(first.metadata.sceneId);
    answerCounts[first.correctOptionIndex] += 1;
  }

  for (const ruleId of allowedRules) assert(seenRules.has(ruleId), `${difficulty} never exercised ${ruleId}`);
  assert(seenDomains.size === eligibleDomains.size, `${difficulty} reaches ${seenDomains.size}/${eligibleDomains.size} domains`);
  assert(seenScenes.size === eligibleScenes.size, `${difficulty} reaches ${seenScenes.size}/${eligibleScenes.size} scenes`);
  for (let option = 0; option < 4; option += 1) {
    const share = answerCounts[option]! / 2_000;
    assert(share >= 0.18 && share <= 0.32, `${difficulty} answer option ${option} share drifted to ${share}`);
  }

  for (const ruleId of allowedRules) {
    const scene = cp012ScenePoolV1(difficulty, ruleId)[0]!;
    const q = generateEng003Cp012QuestionV1({
      difficulty, ruleId, sceneId: scene.id,
      seed: `eng003-cp012-rule-contract:${difficulty}:${ruleId}`,
    });
    assert(q.metadata.ruleId === ruleId, `${difficulty}/${ruleId} explicit rule selection drifted`);
    assert(q.metadata.sceneId === scene.id, `${difficulty}/${ruleId} explicit scene selection drifted`);
  }
}

console.log("ENG-003-CP012 V1 voice and narration filler tests passed.");
