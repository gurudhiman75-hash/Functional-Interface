import { WOR_WORD_FAMILIES, worFamilyById } from "./datasets/word-registry";
import { buildRankOptions, buildPairOptions, buildSequenceOptions, buildWordOptions, correctOptionIndex, renderWordSequence } from "./foundation/distractors";
import { calculateWorDifficultyFeatures, classifyWorDifficulty } from "./foundation/difficulty";
import { independentlyFindRank, independentlySortWorWords } from "./foundation/independent-lexical-solver";
import { adjacentComparisonTrace, sortWorWords } from "./foundation/lexical-comparator";
import { createWorRng } from "./foundation/prng";
import type { GeneratedWorQuestion, WorClassicTaskKind, WorDifficulty, WorLocale, WorOption, WorPrototypeContract, WorQuestionState } from "./foundation/types";
import { incorrectAdjacentPairs, misplacedCandidates, validateWorQuestion } from "./foundation/validation";
import { buildWorWordSet, difficultyForSeed, wordCountForDifficulty } from "./foundation/word-set-builder";
import { renderWorExplanation } from "./localization/explanations";
import { renderWorStem } from "./localization/language-pack";
import { worPrototypeById } from "./prototype-registry";
import { generateWorCp005Question } from "./WOR-CP-005/runtime";

type WorClassicPrototypeContract = WorPrototypeContract & {
  readonly taskKind: WorClassicTaskKind;
  readonly checkpointId: "WOR-CP-001" | "WOR-CP-002" | "WOR-CP-003" | "WOR-CP-004";
};

function sameOrder(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((word, index) => word === right[index]);
}

function moveWord(words: readonly string[], from: number, to: number): string[] {
  const result = [...words];
  const [word] = result.splice(from, 1);
  result.splice(to, 0, word!);
  return result;
}

function uniqueMisplacedSequence(canonical: readonly string[], seed: number): { sequence: string[]; answer: string } {
  const rng = createWorRng(seed, "MISPLACED");
  const attempts = rng.shuffle(canonical.flatMap((_word, from) => canonical.map((_target, to) => ({ from, to }))))
    .filter(({ from, to }) => Math.abs(from - to) >= 2);
  for (const { from, to } of attempts) {
    const sequence = moveWord(canonical, from, to);
    const candidates = misplacedCandidates(sequence);
    if (candidates.length === 1) return { sequence, answer: candidates[0]! };
  }
  throw new Error("Unable to construct a unique misplaced-word sequence.");
}

function closestWordCandidates(order: readonly string[], answer: string, reserve: readonly string[] = []): string[] {
  const rank = order.indexOf(answer);
  return [...order.filter((word) => word !== answer).sort((a, b) => Math.abs(order.indexOf(a) - rank) - Math.abs(order.indexOf(b) - rank)), ...reserve];
}

function selectDifficulty(contract: WorClassicPrototypeContract, seed: number, requested?: WorDifficulty): WorDifficulty {
  if (contract.hardOnly) return "HARD";
  return requested ?? difficultyForSeed(seed);
}

function buildStateAttempt(
  contract: WorClassicPrototypeContract,
  generationSeed: number,
  targetDifficulty: WorDifficulty,
): { state: WorQuestionState; reserve: readonly string[] } {
  const rng = createWorRng(generationSeed, contract.prototypeId);
  const isMiddle = contract.taskKind === "SELECT_MIDDLE";
  const isInsertion = ["INSERT_WORD", "RANK_AFTER_INSERTION", "PREDECESSOR_AFTER_INSERTION"].includes(contract.taskKind);
  const isCorrection = ["FIND_MISPLACED_WORD", "FIND_INCORRECT_PAIR"].includes(contract.taskKind);
  const isPartial = contract.taskKind === "COMPLETE_PARTIAL_ORDER";
  let count = wordCountForDifficulty(targetDifficulty, rng, isMiddle);
  if (isInsertion && count >= 7) count = 6;
  if ((isCorrection || isPartial) && count < 5) count = 5;
  if (isPartial) count = 5;
  const built = buildWorWordSet(targetDifficulty, count + (isInsertion ? 1 : 0), rng);
  let baseWords = [...built.selected];
  let insertionWord: string | undefined;
  if (isInsertion) {
    const fullOrder = sortWorWords(baseWords);
    insertionWord = fullOrder[rng.int(1, fullOrder.length - 2)]!;
    baseWords = baseWords.filter((word) => word !== insertionWord);
  }
  const fullWords = insertionWord ? [...baseWords, insertionWord] : [...baseWords];
  const canonicalAscendingOrder = sortWorWords(fullWords);
  const independentOrder = independentlySortWorWords(fullWords);
  if (!sameOrder(canonicalAscendingOrder, independentOrder)) throw new Error(`${contract.prototypeId} generator/solver disagreement.`);
  const sortDirection = contract.taskKind === "SELECT_DESCENDING_ORDER" ? "DESCENDING" as const : "ASCENDING" as const;
  const requestedOrder = sortDirection === "ASCENDING" ? canonicalAscendingOrder : [...canonicalAscendingOrder].reverse();
  let displayedWords = isInsertion ? independentlySortWorWords(baseWords) : rng.shuffle(baseWords);
  let targetWord: string | undefined;
  let queryRank: number | undefined;
  let presentedSequence: string[] | undefined;
  let partialSequence: string[] | undefined;
  let correctAnswer = "";

  switch (contract.taskKind) {
    case "SELECT_COMPLETE_ORDER":
    case "SELECT_DESCENDING_ORDER": correctAnswer = renderWordSequence(requestedOrder); break;
    case "SELECT_FIRST": correctAnswer = canonicalAscendingOrder[0]!; break;
    case "SELECT_LAST": correctAnswer = canonicalAscendingOrder.at(-1)!; break;
    case "SELECT_KTH":
      queryRank = rng.int(2, canonicalAscendingOrder.length - 1);
      correctAnswer = canonicalAscendingOrder[queryRank - 1]!;
      break;
    case "FIND_RANK": {
      const targetIndex = rng.int(1, canonicalAscendingOrder.length - 2);
      targetWord = canonicalAscendingOrder[targetIndex]!;
      correctAnswer = String(targetIndex + 1);
      break;
    }
    case "SELECT_PREDECESSOR": {
      const targetIndex = rng.int(1, canonicalAscendingOrder.length - 1);
      targetWord = canonicalAscendingOrder[targetIndex]!;
      correctAnswer = canonicalAscendingOrder[targetIndex - 1]!;
      break;
    }
    case "SELECT_SUCCESSOR": {
      const targetIndex = rng.int(0, canonicalAscendingOrder.length - 2);
      targetWord = canonicalAscendingOrder[targetIndex]!;
      correctAnswer = canonicalAscendingOrder[targetIndex + 1]!;
      break;
    }
    case "SELECT_MIDDLE":
      queryRank = Math.floor(canonicalAscendingOrder.length / 2) + 1;
      correctAnswer = canonicalAscendingOrder[queryRank - 1]!;
      break;
    case "INSERT_WORD":
      queryRank = independentlyFindRank(fullWords, insertionWord!);
      correctAnswer = String(queryRank);
      break;
    case "RANK_AFTER_INSERTION": {
      const insertionRank = independentlyFindRank(fullWords, insertionWord!);
      const shiftedCandidates = baseWords.filter((word) => independentlyFindRank(fullWords, word) > insertionRank);
      targetWord = rng.pick(shiftedCandidates);
      queryRank = independentlyFindRank(fullWords, targetWord);
      correctAnswer = String(queryRank);
      break;
    }
    case "PREDECESSOR_AFTER_INSERTION": {
      const insertionRank = independentlyFindRank(fullWords, insertionWord!);
      correctAnswer = canonicalAscendingOrder[insertionRank - 2]!;
      break;
    }
    case "FIND_MISPLACED_WORD": {
      const misplaced = uniqueMisplacedSequence(canonicalAscendingOrder, generationSeed);
      presentedSequence = misplaced.sequence;
      displayedWords = [...presentedSequence];
      correctAnswer = misplaced.answer;
      break;
    }
    case "FIND_INCORRECT_PAIR": {
      const traces = adjacentComparisonTrace(canonicalAscendingOrder);
      const hardestIndex = traces.map((trace, index) => ({ index, depth: trace.commonPrefixLength })).sort((a, b) => b.depth - a.depth)[0]!.index;
      presentedSequence = [...canonicalAscendingOrder];
      [presentedSequence[hardestIndex], presentedSequence[hardestIndex + 1]] = [presentedSequence[hardestIndex + 1]!, presentedSequence[hardestIndex]!];
      const pairs = incorrectAdjacentPairs(presentedSequence);
      if (pairs.length !== 1) throw new Error("Incorrect-pair constructor did not create exactly one violation.");
      displayedWords = [...presentedSequence];
      correctAnswer = pairs[0]!;
      break;
    }
    case "COMPLETE_PARTIAL_ORDER": {
      const missingIndex = rng.int(1, canonicalAscendingOrder.length - 2);
      targetWord = canonicalAscendingOrder[missingIndex]!;
      displayedWords = canonicalAscendingOrder.filter((_, index) => index !== missingIndex);
      partialSequence = canonicalAscendingOrder.map((word, index) => index === missingIndex ? "____" : word);
      correctAnswer = targetWord;
      break;
    }
  }
  const comparisonTrace = adjacentComparisonTrace(canonicalAscendingOrder);
  const difficultyFeatures = calculateWorDifficultyFeatures(canonicalAscendingOrder, sortDirection, contract.taskKind);
  const difficulty = classifyWorDifficulty(difficultyFeatures);
  return {
    state: {
      prototypeId: contract.prototypeId,
      checkpointId: contract.checkpointId,
      taskKind: contract.taskKind,
      words: displayedWords,
      sortDirection,
      canonicalAscendingOrder,
      requestedOrder,
      targetWord,
      insertionWord,
      queryRank,
      presentedSequence,
      partialSequence,
      comparisonTrace,
      correctAnswer,
      difficulty,
      difficultyFeatures,
      sourceFamilyId: built.familyId,
    },
    reserve: built.reserve,
  };
}

function buildState(contract: WorClassicPrototypeContract, seed: number, requestedDifficulty?: WorDifficulty): { state: WorQuestionState; reserve: readonly string[] } {
  const targetDifficulty = selectDifficulty(contract, seed, requestedDifficulty);
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const generationSeed = seed + attempt * 7919;
    const built = buildStateAttempt(contract, generationSeed, targetDifficulty);
    if (built.state.difficulty === targetDifficulty) return built;
  }
  throw new Error(`${contract.prototypeId} could not construct a structurally ${targetDifficulty} state for seed ${seed}.`);
}

function buildOptions(state: WorQuestionState, reserve: readonly string[], seed: number): WorOption[] {
  if (["SELECT_COMPLETE_ORDER", "SELECT_DESCENDING_ORDER"].includes(state.taskKind)) {
    return buildSequenceOptions(state.requestedOrder, seed);
  }
  if (["FIND_RANK", "INSERT_WORD", "RANK_AFTER_INSERTION"].includes(state.taskKind)) {
    return buildRankOptions(Number(state.correctAnswer), state.canonicalAscendingOrder.length, seed);
  }
  if (state.taskKind === "FIND_INCORRECT_PAIR") {
    const pairs = state.presentedSequence!.slice(0, -1).map((word, index) => `${word} – ${state.presentedSequence![index + 1]!}`);
    const canonicalPairs = state.canonicalAscendingOrder.slice(0, -1).map((word, index) => `${word} – ${state.canonicalAscendingOrder[index + 1]!}`);
    return buildPairOptions(state.correctAnswer, [...pairs, ...canonicalPairs], seed);
  }
  if (state.taskKind === "COMPLETE_PARTIAL_ORDER") {
    const sameFamily = worFamilyById(state.sourceFamilyId).words.map((entry) => entry.word);
    const invalidReserve = [...sameFamily, ...WOR_WORD_FAMILIES.flatMap((family) => family.words.map((entry) => entry.word))]
      .filter((candidate) => candidate !== state.correctAnswer && !state.words.includes(candidate))
      .filter((candidate) => {
        const filled = state.partialSequence!.map((word) => word === "____" ? candidate : word);
        return !sameOrder(filled, independentlySortWorWords(filled));
      });
    return buildWordOptions(state.correctAnswer, invalidReserve, seed);
  }
  return buildWordOptions(state.correctAnswer, closestWordCandidates(state.canonicalAscendingOrder, state.correctAnswer, reserve), seed);
}

export function generateWor001Question(
  prototypeId: string,
  seed = 0,
  locale: WorLocale = "en-IN",
  requestedDifficulty?: WorDifficulty,
): GeneratedWorQuestion {
  const contract = worPrototypeById(prototypeId);
  if (contract.checkpointId === "WOR-CP-005") return generateWorCp005Question(contract, seed, locale, requestedDifficulty);
  const classicContract = contract as WorClassicPrototypeContract;
  const { state, reserve } = buildState(classicContract, seed, requestedDifficulty);
  const options = buildOptions(state, reserve, seed);
  const correctIndex = correctOptionIndex(options);
  const question: GeneratedWorQuestion = {
    chapterId: "WOR-001",
    checkpointId: classicContract.checkpointId,
    prototypeId: classicContract.prototypeId,
    permanentQlId: null,
    lifecycleStatus: "REVIEW_ONLY",
    questionStudioVisible: false,
    locale,
    seed,
    difficulty: state.difficulty,
    renderer: "STRUCTURED_TEXT",
    taskKind: state.taskKind,
    stem: renderWorStem(state, locale),
    structuredPrompt: {
      words: state.words,
      ...(state.insertionWord ? { insertionWord: state.insertionWord } : {}),
      ...(state.presentedSequence ? { presentedSequence: state.presentedSequence } : {}),
      ...(state.partialSequence ? { partialSequence: state.partialSequence } : {}),
    },
    options,
    correctIndex,
    answer: state.correctAnswer,
    explanation: renderWorExplanation(state, locale),
    metadata: {
      runtimeVersion: "WOR-001-RUNTIME-V1",
      localeMode: "TRANSLATABLE",
      sortDirection: state.sortDirection,
      wordCount: state.canonicalAscendingOrder.length,
      sourceFamilyId: state.sourceFamilyId,
      independentSolverVerified: true,
      ambiguityAudit: "LEXICALLY_UNIQUE",
      difficultyFeatures: state.difficultyFeatures,
      canonicalOrder: state.canonicalAscendingOrder,
      comparisonTrace: state.comparisonTrace,
      allocationDecision: classicContract.allocationDecision,
      sourceEvidenceStatus: classicContract.sourceEvidenceStatus,
      optionCount: 4,
      objectMode: "REAL_WORD",
    },
  };
  validateWorQuestion(question, state);
  return question;
}
