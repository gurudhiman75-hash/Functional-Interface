import assert from "node:assert/strict";
import { WFM_CANDIDATE_WORDS, WFM_SOURCE_WORDS, analyseCandidate } from "./lexicon";
import { WFM_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import { buildWfm001ReviewPack, renderWfm001ReviewMarkdown } from "./review-pack";
import { generateWfm001Question, WFM_001_QL_IDS } from "./runtime";
import { solveWfmOptions } from "./solver";
import type { WfmDifficulty, WfmQlId } from "./types";

assert(WFM_CANDIDATE_WORDS.length >= 500, "WFM candidate corpus must remain broad.");
assert(WFM_SOURCE_WORDS.length >= 18, "WFM source pool must not regress below the governed floor.");
assert.equal(new Set(WFM_SOURCE_WORDS).size, WFM_SOURCE_WORDS.length, "WFM source words must be unique.");

for (const qlId of WFM_001_QL_IDS) {
  const answerPositions = [0, 0, 0, 0];
  const sources = new Set<string>();
  const difficulties = new Set<WfmDifficulty>();
  const visible = new Set<string>();

  for (let seed = 0; seed < 360; seed += 1) {
    const question = generateWfm001Question({ qlId, seed, language: "en-IN", examProfile: "SSC_CGL_4" });
    const replay = generateWfm001Question({ qlId, seed, language: "en-IN", examProfile: "SSC_CGL_4" });
    assert.deepEqual(question, replay, `${qlId} seed ${seed} must replay deterministically.`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.text)).size, 4, `${qlId} seed ${seed} has duplicate options.`);
    assert.equal(question.metadata.lifecycle, "REVIEW_ONLY");
    assert.equal(question.metadata.questionBankStored, false);
    assert.equal(question.metadata.testEligible, false);
    assert.equal(question.metadata.publiclyPublishable, false);
    assert.equal(question.metadata.difficultyBasis, "GENERATED_INSTANCE");

    const solvedIndex = solveWfmOptions(question.sourceWord, question.options.map((option) => option.text), question.task);
    assert.equal(question.correctOptionId, question.options[solvedIndex].id, `${qlId} seed ${seed} failed independent solve.`);

    answerPositions[solvedIndex] += 1;
    sources.add(question.sourceWord);
    difficulties.add(question.difficulty);
    visible.add(`${question.stem}|${question.options.map((option) => option.text).join("|")}`);

    if (question.difficulty === "HARD" && question.task === "CAN_FORM") {
      const repeatedLetterTraps = question.options.filter((option) => option.provenance === "IGNORED_REPEATED_LETTER_LIMIT").length;
      assert(repeatedLetterTraps >= 2, `${qlId} seed ${seed} hard item must be hard because of multiplicity traps.`);
    }
    if (question.difficulty === "HARD" && question.task === "CANNOT_FORM") {
      const correct = question.options.find((option) => option.id === question.correctOptionId)!;
      const analysis = analyseCandidate(question.sourceWord, correct.text);
      assert.equal(analysis.deficitKind, "MULTIPLICITY", `${qlId} seed ${seed} hard inverse item must use a multiplicity deficit.`);
      assert.equal(analysis.totalDeficit, 1, `${qlId} seed ${seed} hard inverse item must be a one-letter-count near miss.`);
    }
  }

  assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"], `${qlId} must generate all three difficulty levels.`);
  assert(sources.size >= 15, `${qlId} source-word diversity is too low: ${sources.size}.`);
  assert(visible.size >= 300, `${qlId} visible diversity is too low: ${visible.size}/360.`);
  for (let index = 0; index < 4; index += 1) assert(answerPositions[index] >= 20, `${qlId} answer position ${index} is underused.`);
}

for (const qlId of WFM_001_QL_IDS) {
  for (const language of ["en-IN", "hi-IN", "pa-IN"] as const) {
    const question = generateWfm001Question({ qlId, seed: 14, language, examProfile: "PUNJAB_4" });
    assert(question.stem.includes(question.sourceWord));
    assert(question.explanation.length > 80, `${qlId}/${language} explanation is too thin.`);
  }
}

for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const) {
  for (const qlId of WFM_001_QL_IDS) {
    const question = WFM_001_QUESTION_STUDIO_ADAPTER.generate({ qlId, difficulty, seed: 500, language: "en-IN", examProfile: "SSC_CGL_4" });
    assert.equal(question.difficulty, difficulty, `${qlId} Question Studio difficulty filter failed.`);
  }
}

assert.throws(
  () => WFM_001_QUESTION_STUDIO_ADAPTER.generate({ seed: 1, examProfile: "BANKING_5" as any }),
  /does not support exam profile/i,
  "Unsupported five-option delivery must fail closed.",
);

const review = buildWfm001ReviewPack("en-IN", 2);
assert.equal(review.length, 12, "Review pack must contain 2 QLs × 3 difficulties × 2 samples.");
const markdown = renderWfm001ReviewMarkdown(review);
assert(markdown.includes("WFM-QL-001"));
assert(markdown.includes("WFM-QL-002"));
assert(!markdown.includes("Option A is wrong"), "Review explanations must not become option-by-option boilerplate.");

console.log(JSON.stringify({
  status: "PASS",
  qlIds: WFM_001_QL_IDS,
  candidateWords: WFM_CANDIDATE_WORDS.length,
  eligibleSourceWords: WFM_SOURCE_WORDS.length,
  reviewedQuestions: 720,
  reviewPackQuestions: review.length,
}, null, 2));
