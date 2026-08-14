import assert from "node:assert/strict";
import { WOR_WORD_FAMILIES } from "./datasets/word-registry";
import { compareWorWords, normalizeWorWord, sortWorWords, traceWorComparison } from "./foundation/lexical-comparator";
import { independentlySortWorWords } from "./foundation/independent-lexical-solver";
import { WOR_001_CHECKPOINTS, WOR_001_PROTOTYPES } from "./prototype-registry";
import { WOR_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import { buildWorReviewPack, renderWorReviewMarkdown } from "./review-pack";
import { generateWor001Question } from "./runtime";

const allWords = [...new Set(WOR_WORD_FAMILIES.flatMap((family) => family.words.map((entry) => entry.word)))];
for (const word of allWords) assert.match(normalizeWorWord(word), /^[A-Z]+$/);
for (const family of WOR_WORD_FAMILIES) {
  assert.ok(family.words.length >= 9, `${family.id} has a thin object pool.`);
  assert.equal(new Set(family.words.map((entry) => entry.normalized)).size, family.words.length, `${family.id} has duplicates.`);
  assert.ok(family.words.every((entry) => entry.editorialStatus === "APPROVED"));
}

assert.ok(compareWorWords("Apple", "Ball") < 0);
assert.ok(compareWorWords("Card", "Care") < 0);
assert.ok(compareWorWords("Car", "Card") < 0);
assert.ok(compareWorWords("Product", "Production") < 0);
assert.equal(traceWorComparison("Car", "Card").decision, "LEFT_IS_PREFIX");
assert.equal(traceWorComparison("State", "Star").commonPrefix, "STA");

for (const left of allWords) {
  for (const right of allWords) {
    const forward = Math.sign(compareWorWords(left, right));
    const backward = Math.sign(compareWorWords(right, left));
    assert.equal(forward + backward, 0, `Antisymmetry failed for ${left}/${right}.`);
  }
}
for (let index = 0; index < allWords.length - 2; index += 1) {
  const triple = sortWorWords([allWords[index]!, allWords[index + 1]!, allWords[index + 2]!]);
  assert.ok(compareWorWords(triple[0]!, triple[1]!) <= 0 && compareWorWords(triple[1]!, triple[2]!) <= 0);
  assert.ok(compareWorWords(triple[0]!, triple[2]!) <= 0, "Transitivity failed.");
  assert.deepEqual(sortWorWords(triple), triple, "Sorting is not idempotent.");
  assert.deepEqual(independentlySortWorWords(triple), triple, "Independent solver disagrees.");
}

assert.equal(WOR_001_PROTOTYPES.length, 19);
assert.equal(new Set(WOR_001_PROTOTYPES.map((entry) => entry.prototypeId)).size, 19);
assert.deepEqual(WOR_001_CHECKPOINTS.map((entry) => entry.prototypeCount), [4, 5, 6, 4]);
assert.equal(WOR_001_PROTOTYPES.filter((entry) => entry.allocationDecision === "RETAIN").length, 15);
assert.equal(WOR_001_PROTOTYPES.filter((entry) => entry.allocationDecision === "MERGE_AS_INSTANCE_VARIANT").length, 4);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.questionStudioVisible, false);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.publicReleaseEnabled, false);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.permanentQlCount, 0);

const answerPositions = [0, 0, 0, 0];
const checkpointDifficulties = new Map<string, Set<string>>();
const taskKinds = new Set<string>();
const familyCoverage = new Set<string>();
let generatedCount = 0;
let prefixCaseCount = 0;
let deepComparisonCount = 0;

for (const prototype of WOR_001_PROTOTYPES) {
  const visibleVariants = new Set<string>();
  for (let seed = 0; seed < 120; seed += 1) {
    const english = generateWor001Question(prototype.prototypeId, seed, "en-IN");
    const repeated = generateWor001Question(prototype.prototypeId, seed, "en-IN");
    const hindi = generateWor001Question(prototype.prototypeId, seed, "hi-IN");
    const punjabi = generateWor001Question(prototype.prototypeId, seed, "pa-IN");
    assert.deepEqual(english, repeated, `${prototype.prototypeId}/${seed} is not deterministic.`);
    generatedCount += 3;
    visibleVariants.add(`${english.stem}|${english.structuredPrompt.words.join(",")}|${english.options.map((option) => option.value).join("|")}`);
    answerPositions[english.correctIndex] += 1;
    taskKinds.add(english.taskKind);
    familyCoverage.add(english.metadata.sourceFamilyId);
    checkpointDifficulties.set(english.checkpointId, checkpointDifficulties.get(english.checkpointId) ?? new Set());
    checkpointDifficulties.get(english.checkpointId)!.add(english.difficulty);
    prefixCaseCount += english.metadata.comparisonTrace.filter((trace) => trace.decision !== "FIRST_DIFFERING_CHARACTER").length;
    deepComparisonCount += english.metadata.comparisonTrace.filter((trace) => trace.commonPrefixLength >= 3).length;

    for (const localized of [english, hindi, punjabi]) {
      assert.equal(localized.options.length, 4);
      assert.equal(new Set(localized.options.map((option) => option.value)).size, 4);
      assert.ok(localized.options.every((option) => option.value.trim().length > 0));
      assert.equal(localized.options[localized.correctIndex]!.value, localized.answer);
      assert.equal(localized.options.filter((option) => option.misconceptionId === null).length, 1);
      assert.equal(localized.permanentQlId, null);
      assert.equal(localized.questionStudioVisible, false);
      assert.equal(localized.lifecycleStatus, "REVIEW_ONLY");
      assert.equal(localized.metadata.independentSolverVerified, true);
      assert.equal(localized.metadata.ambiguityAudit, "LEXICALLY_UNIQUE");
      assert.ok(localized.explanation.length >= 180, `${localized.locale} explanation is too thin.`);
      assert.ok(localized.explanation.includes(localized.answer), `${localized.locale} explanation omits the answer.`);
      assert.doesNotMatch(`${localized.stem} ${localized.explanation}`, /undefined|null|\{\{|\}\}|WOR-PROT|WOR-CP/);
      assert.ok(localized.structuredPrompt.words.every((word) => /^[A-Za-z]+$/.test(word)), "Logic words were translated or corrupted.");
    }
    assert.match(hindi.stem, /[\u0900-\u097F]/);
    assert.match(hindi.explanation, /[\u0900-\u097F]/);
    assert.match(punjabi.stem, /[\u0A00-\u0A7F]/);
    assert.match(punjabi.explanation, /[\u0A00-\u0A7F]/);
    assert.deepEqual(hindi.structuredPrompt, english.structuredPrompt);
    assert.deepEqual(punjabi.structuredPrompt, english.structuredPrompt);
    assert.deepEqual(hindi.options, english.options);
    assert.deepEqual(punjabi.options, english.options);
    assert.equal(hindi.correctIndex, english.correctIndex);
    assert.equal(punjabi.correctIndex, english.correctIndex);
    assert.deepEqual(hindi.metadata.canonicalOrder, english.metadata.canonicalOrder);
    assert.deepEqual(punjabi.metadata.comparisonTrace, english.metadata.comparisonTrace);
    if (english.taskKind === "FIND_INCORRECT_PAIR") {
      const pairs = english.structuredPrompt.presentedSequence!.slice(0, -1).map((word, index) => `${word} – ${english.structuredPrompt.presentedSequence![index + 1]!}`);
      assert.ok(pairs.includes(english.answer), `${prototype.prototypeId}/${seed} answer is not an adjacent displayed pair.`);
    }
  }
  assert.ok(visibleVariants.size >= 30, `${prototype.prototypeId} visible variety is too low.`);
}

assert.deepEqual(answerPositions, [570, 570, 570, 570]);
assert.equal(taskKinds.size, 15);
assert.equal(familyCoverage.size, WOR_WORD_FAMILIES.length);
assert.ok(prefixCaseCount > 700, `Prefix coverage is too low: ${prefixCaseCount}`);
assert.ok(deepComparisonCount > 3000, `Deep-comparison coverage is too low: ${deepComparisonCount}`);
for (const checkpoint of WOR_001_CHECKPOINTS) {
  const difficulties = checkpointDifficulties.get(checkpoint.checkpointId)!;
  if (checkpoint.checkpointId === "WOR-CP-004") assert.deepEqual([...difficulties], ["HARD"]);
  else assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
}

for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
  const review = buildWorReviewPack(locale);
  assert.equal(review.length, 136);
  assert.ok(review.every((question) => question.options.length === 4));
  const markdown = renderWorReviewMarkdown(locale, review);
  assert.ok(markdown.includes("Questions: 136"));
  assert.doesNotMatch(markdown, /undefined|null|\{\{|\}\}/);
}

console.log("WOR-001 end-to-end runtime and multilingual audit passed.", {
  prototypeCount: WOR_001_PROTOTYPES.length,
  retainedSolveContracts: 15,
  generatedCount,
  answerPositions,
  taskKinds: [...taskKinds].sort(),
  familyCoverage: familyCoverage.size,
  prefixCaseCount,
  deepComparisonCount,
});
