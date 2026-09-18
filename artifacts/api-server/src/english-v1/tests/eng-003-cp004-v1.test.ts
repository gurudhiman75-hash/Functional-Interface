import { cp004ScenePoolV1, rulesForDifficultyCp004V1 } from "../chapters/error-spotting/ENG-001/CP004/eng-001-cp004-v1";
import { generateEng003Cp004QuestionV1 } from "../chapters/grammar-fillers/ENG-003/CP004/eng-003-cp004-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string { return JSON.stringify(value); }
function materialize(segments: readonly string[], blankIndex: number, answer: string): string {
  const out = [...segments];
  out[blankIndex] = answer;
  return out.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const pool = cp004ScenePoolV1(difficulty);
  const allowedRules = new Set(rulesForDifficultyCp004V1(difficulty));
  const eligibleDomains = new Set(pool.map((scene) => scene.domain));
  const eligibleScenes = new Set(pool.map((scene) => scene.id));
  const seenRules = new Set<string>();
  const seenDomains = new Set<string>();
  const seenScenes = new Set<string>();
  const answerCounts = [0, 0, 0, 0];

  for (let index = 0; index < 2_000; index += 1) {
    const input = { difficulty, seed: `eng003-cp004-test:${difficulty}:${index}` } as const;
    const first = generateEng003Cp004QuestionV1(input);
    const replay = generateEng003Cp004QuestionV1(input);

    assert(stable(first) === stable(replay), `${first.questionId} is not deterministic`);
    assert(first.stem === "Choose the most appropriate option to fill in the blank.", `${first.questionId} has the wrong stem`);
    assert(first.options.length === 4, `${first.questionId} must expose four options`);
    assert(new Set(first.options.map((option) => option.toLowerCase())).size === 4, `${first.questionId} has duplicate options`);
    assert(!first.options.some((option) => option.toLowerCase() === "no improvement"), `${first.questionId} leaked No improvement`);
    assert(first.correctOptionIndex >= 0 && first.correctOptionIndex <= 3, `${first.questionId} has invalid answer index`);
    assert(first.segments[first.blankIndex] === "_____", `${first.questionId} lost its target blank`);
    assert((first.sentence.match(/_____/g) ?? []).length === 1, `${first.questionId} must have exactly one blank`);
    assert(!first.sentence.includes(" / "), `${first.questionId} leaked Error Spotting segmentation`);
    assert(first.explanation.startsWith("The blank needs"), `${first.questionId} explanation does not begin with the answer`);
    assert(first.explanation.includes("In this sentence,"), `${first.questionId} lacks sentence-specific application`);
    assert(first.explanation.includes("Correct sentence:"), `${first.questionId} lacks completed sentence`);
    assert(first.explanation.includes(first.correctedSentence), `${first.questionId} explanation lost corrected sentence`);
    assert(first.metadata.chapterId === "ENG-003" && first.metadata.cpId === "ENG-003-CP004", `${first.questionId} has wrong ids`);
    assert(first.metadata.reviewOnly === true, `${first.questionId} must remain review-only`);
    assert(allowedRules.has(first.metadata.ruleId), `${first.questionId} uses ineligible rule ${first.metadata.ruleId}`);

    const answer = first.options[first.correctOptionIndex]!;
    assert(materialize(first.segments, first.blankIndex, answer) === first.correctedSentence, `${first.questionId} answer does not reconstruct the approved sentence`);

    if (first.metadata.ruleId === "GR-PRN-010") {
      assert(first.options.every((option) => /^(?:whose|who's|who|whom|which)$/i.test(option)), `${first.questionId} has non-pronoun whose/who's options`);
    }

    seenRules.add(first.metadata.ruleId);
    seenDomains.add(first.metadata.semanticDomain);
    seenScenes.add(first.metadata.sceneId);
    answerCounts[first.correctOptionIndex] += 1;
  }

  for (const ruleId of allowedRules) assert(seenRules.has(ruleId), `${difficulty} never exercised ${ruleId}`);
  assert(seenDomains.size === eligibleDomains.size, `${difficulty} reaches ${seenDomains.size}/${eligibleDomains.size} domains`);
  assert(seenScenes.size === eligibleScenes.size, `${difficulty} reaches ${seenScenes.size}/${eligibleScenes.size} donor scenes`);
  for (let option = 0; option < 4; option += 1) {
    const share = answerCounts[option]! / 2_000;
    assert(share >= 0.18 && share <= 0.32, `${difficulty} answer position ${option} drifted to ${share}`);
  }
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  for (const ruleId of rulesForDifficultyCp004V1(difficulty)) {
    const scene = cp004ScenePoolV1(difficulty, ruleId)[0]!;
    const question = generateEng003Cp004QuestionV1({
      difficulty,
      ruleId,
      sceneId: scene.id,
      seed: `eng003-cp004-rule-contract:${difficulty}:${ruleId}`,
    });
    assert(question.metadata.ruleId === ruleId, `${difficulty}/${ruleId} explicit rule selection drifted`);
    assert(question.metadata.sceneId === scene.id, `${difficulty}/${ruleId} explicit scene selection drifted`);
  }
}

console.log("ENG-003-CP004 V1 pronoun grammar filler tests passed.");
