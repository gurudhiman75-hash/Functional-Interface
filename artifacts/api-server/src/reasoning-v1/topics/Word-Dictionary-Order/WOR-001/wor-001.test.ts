import assert from "node:assert/strict";
import { WOR_WORD_FAMILIES } from "./datasets/word-registry";
import { classifyWorDifficulty } from "./foundation/difficulty";
import { compareWorWords, normalizeWorWord, sortWorWords, traceWorComparison } from "./foundation/lexical-comparator";
import { independentlySortWorWords } from "./foundation/independent-lexical-solver";
import type { WorDifficulty } from "./foundation/types";
import { WOR_001_CHECKPOINTS, WOR_001_PROTOTYPES } from "./prototype-registry";
import { WOR_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import { buildWorReviewPack, renderWorReviewMarkdown } from "./review-pack";
import { generateWor001Question } from "./runtime";

const allWords = [...new Set(WOR_WORD_FAMILIES.flatMap((family) => family.words.map((entry) => entry.word)))];
for (const word of allWords) assert.match(normalizeWorWord(word), /^[A-Z]+$/);
for (const family of WOR_WORD_FAMILIES) {
  assert.ok(family.words.length >= 9, `${family.id} has a thin object pool.`);
  assert.equal(new Set(family.words.map((entry) => entry.normalized)).size, family.words.length, `${family.id} has duplicates.`);
  assert.ok(family.words.every((entry) => entry.editorialStatus === "PROVISIONAL_REVIEW"));
}

assert.ok(compareWorWords("Apple", "Ball") < 0);
assert.ok(compareWorWords("Card", "Care") < 0);
assert.ok(compareWorWords("Car", "Card") < 0);
assert.ok(compareWorWords("Product", "Production") < 0);
assert.equal(traceWorComparison("Car", "Card").decision, "LEFT_IS_PREFIX");
assert.equal(traceWorComparison("State", "Star").commonPrefix, "STA");
assert.throws(() => traceWorComparison("Car", "car"), /distinct words/);

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
assert.equal(WOR_001_PROTOTYPES.filter((entry) => entry.allocationDecision === "RETAIN").length, 12);
assert.equal(WOR_001_PROTOTYPES.filter((entry) => entry.allocationDecision === "MERGE_AS_INSTANCE_VARIANT").length, 7);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.questionStudioVisible, false);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.publicReleaseEnabled, false);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.permanentQlCount, 0);

const requestedBands: readonly WorDifficulty[] = ["EASY", "MEDIUM", "HARD"];
for (const prototype of WOR_001_PROTOTYPES) {
  if (prototype.hardOnly) {
    const question = generateWor001Question(prototype.prototypeId, 17001, "en-IN", "EASY");
    assert.equal(question.difficulty, "HARD", `${prototype.prototypeId} hard-only contract escaped HARD.`);
    continue;
  }
  requestedBands.forEach((difficulty, index) => {
    const question = generateWor001Question(prototype.prototypeId, 17001 + index * 101, "en-IN", difficulty);
    assert.equal(question.difficulty, difficulty, `${prototype.prototypeId} failed requested ${difficulty} calibration.`);
    assert.equal(question.difficulty, classifyWorDifficulty(question.metadata.difficultyFeatures));
  });
}

interface StructureCoverage {
  questions: number;
  comparisons: number;
  prefix: number;
  deep: number;
  maxDepthTotal: number;
}

const answerPositions = [0, 0, 0, 0];
const checkpointDifficulties = new Map<string, Set<string>>();
const taskKinds = new Set<string>();
const familyCoverage = new Set<string>();
const structureCoverage: Record<WorDifficulty, StructureCoverage> = {
  EASY: { questions: 0, comparisons: 0, prefix: 0, deep: 0, maxDepthTotal: 0 },
  MEDIUM: { questions: 0, comparisons: 0, prefix: 0, deep: 0, maxDepthTotal: 0 },
  HARD: { questions: 0, comparisons: 0, prefix: 0, deep: 0, maxDepthTotal: 0 },
};
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

    const traces = english.metadata.comparisonTrace;
    const prefixCount = traces.filter((trace) => trace.decision !== "FIRST_DIFFERING_CHARACTER").length;
    const deepCount = traces.filter((trace) => trace.commonPrefixLength >= 3).length;
    prefixCaseCount += prefixCount;
    deepComparisonCount += deepCount;
    const bandCoverage = structureCoverage[english.difficulty];
    bandCoverage.questions += 1;
    bandCoverage.comparisons += traces.length;
    bandCoverage.prefix += prefixCount;
    bandCoverage.deep += deepCount;
    bandCoverage.maxDepthTotal += english.metadata.difficultyFeatures.commonPrefixDepthMax;

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
      assert.equal(localized.difficulty, classifyWorDifficulty(localized.metadata.difficultyFeatures));
      assert.ok(localized.explanation.length >= 180, `${localized.locale} explanation is too thin.`);
      assert.ok(localized.explanation.includes(localized.answer), `${localized.locale} explanation omits the answer.`);
      localized.metadata.canonicalOrder.slice(0, -1).forEach((word, index) => {
        const pair = `${word} < ${localized.metadata.canonicalOrder[index + 1]!}`;
        assert.ok(localized.explanation.includes(pair), `${localized.locale} explanation omits adjacent proof ${pair}.`);
      });
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
    if (english.taskKind === "FIND_RANK") {
      const rank = Number(english.answer);
      assert.ok(rank > 1 && rank < english.metadata.canonicalOrder.length, `${prototype.prototypeId}/${seed} rank question collapsed to an endpoint.`);
    }
    if (english.taskKind === "RANK_AFTER_INSERTION") {
      const match = english.stem.match(/new position of ([A-Za-z]+)\?$/);
      assert.ok(match, `${prototype.prototypeId}/${seed} could not recover rank-after-insertion target.`);
      const oldRank = english.structuredPrompt.words.indexOf(match[1]!) + 1;
      assert.ok(oldRank > 0, `${prototype.prototypeId}/${seed} target missing from pre-insertion order.`);
      assert.equal(Number(english.answer), oldRank + 1, `${prototype.prototypeId}/${seed} insertion did not actually shift the target rank.`);
    }
    if (english.taskKind === "FIND_INCORRECT_PAIR") {
      const pairs = english.structuredPrompt.presentedSequence!.slice(0, -1).map((word, index) => `${word} – ${english.structuredPrompt.presentedSequence![index + 1]!}`);
      assert.ok(pairs.includes(english.answer), `${prototype.prototypeId}/${seed} answer is not an adjacent displayed pair.`);
      assert.ok(english.options.filter((option) => option.misconceptionId !== null).every((option) => option.misconceptionId === "CHOSE_CORRECTLY_ORDERED_ADJACENT_PAIR"));
    }
    if (["FIND_RANK", "INSERT_WORD", "RANK_AFTER_INSERTION"].includes(english.taskKind)) {
      const answerRank = Number(english.answer);
      english.options.filter((option) => option.misconceptionId !== null).forEach((option) => {
        const delta = Number(option.value) - answerRank;
        const label = option.misconceptionId!;
        if (delta === -1) assert.equal(label, "RANK_ONE_PLACE_EARLY");
        else if (delta === 1) assert.equal(label, "RANK_ONE_PLACE_LATE");
        else if (delta === -2) assert.equal(label, "RANK_TWO_PLACES_EARLY");
        else if (delta === 2) assert.equal(label, "RANK_TWO_PLACES_LATE");
        else assert.equal(label, delta < 0 ? "RANK_MULTIPLE_PLACES_EARLY" : "RANK_MULTIPLE_PLACES_LATE");
      });
    }
  }
  assert.ok(visibleVariants.size >= 30, `${prototype.prototypeId} visible variety is too low.`);
}

assert.deepEqual(answerPositions, [570, 570, 570, 570]);
assert.equal(taskKinds.size, 15);
assert.equal(familyCoverage.size, WOR_WORD_FAMILIES.length);
assert.ok(prefixCaseCount > 400, `Chapter-wide prefix containment coverage is unexpectedly low: ${prefixCaseCount}`);
assert.ok(deepComparisonCount > 1000, `Chapter-wide deep-comparison coverage is unexpectedly low: ${deepComparisonCount}`);

for (const difficulty of requestedBands) {
  assert.ok(structureCoverage[difficulty].questions > 0, `${difficulty} structural coverage is empty.`);
  assert.ok(structureCoverage[difficulty].comparisons > 0, `${difficulty} comparison coverage is empty.`);
}
const meanMaxDepth = (difficulty: WorDifficulty) => structureCoverage[difficulty].maxDepthTotal / structureCoverage[difficulty].questions;
const deepRate = (difficulty: WorDifficulty) => structureCoverage[difficulty].deep / structureCoverage[difficulty].comparisons;
const prefixRate = (difficulty: WorDifficulty) => structureCoverage[difficulty].prefix / structureCoverage[difficulty].comparisons;
assert.ok(meanMaxDepth("MEDIUM") > meanMaxDepth("EASY"), `MEDIUM max-prefix depth should exceed EASY: ${JSON.stringify(structureCoverage)}`);
assert.ok(meanMaxDepth("HARD") > meanMaxDepth("MEDIUM"), `HARD max-prefix depth should exceed MEDIUM: ${JSON.stringify(structureCoverage)}`);
assert.ok(deepRate("MEDIUM") > deepRate("EASY"), `MEDIUM deep-comparison rate should exceed EASY: ${JSON.stringify(structureCoverage)}`);
assert.ok(deepRate("HARD") > deepRate("MEDIUM"), `HARD deep-comparison rate should exceed MEDIUM: ${JSON.stringify(structureCoverage)}`);
assert.ok(prefixRate("HARD") > prefixRate("EASY"), `HARD prefix-containment rate should exceed EASY: ${JSON.stringify(structureCoverage)}`);

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
  assert.doesNotMatch(markdown, /undefined|null|\{\{|\}\}/);
  assert.doesNotMatch(markdown, /क्रम \/ ਕ੍ਰਮ \/ Order/);
  if (locale === "en-IN") {
    assert.ok(markdown.includes("Questions: 136"));
    assert.ok(markdown.includes("**Words:**") || markdown.includes("**Order:**"));
  } else if (locale === "hi-IN") {
    assert.ok(markdown.includes("प्रश्न: 136"));
    assert.ok(markdown.includes("**शब्द:**") || markdown.includes("**क्रम:**"));
    assert.doesNotMatch(markdown, /\*\*(Words|Answer|Explanation|Order):\*\*/);
  } else {
    assert.ok(markdown.includes("ਪ੍ਰਸ਼ਨ: 136"));
    assert.ok(markdown.includes("**ਸ਼ਬਦ:**") || markdown.includes("**ਕ੍ਰਮ:**"));
    assert.doesNotMatch(markdown, /\*\*(Words|Answer|Explanation|Order):\*\*/);
  }
}

console.log("WOR-001 end-to-end runtime and multilingual audit passed.", {
  prototypeCount: WOR_001_PROTOTYPES.length,
  retainedSolveContracts: 12,
  generatedCount,
  answerPositions,
  taskKinds: [...taskKinds].sort(),
  familyCoverage: familyCoverage.size,
  prefixCaseCount,
  deepComparisonCount,
  structureCoverage,
});
