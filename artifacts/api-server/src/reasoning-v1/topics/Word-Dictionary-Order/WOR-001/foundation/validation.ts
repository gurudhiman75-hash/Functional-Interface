import { independentlySortWorWords } from "./independent-lexical-solver";
import { normalizeWorWord } from "./lexical-comparator";
import type { GeneratedWorQuestion, WorQuestionState } from "./types";

function sameOrder(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((word, index) => word === right[index]);
}

export function misplacedCandidates(sequence: readonly string[]): string[] {
  return sequence.filter((_word, index) => {
    const remaining = sequence.filter((_, candidateIndex) => candidateIndex !== index);
    return sameOrder(remaining, independentlySortWorWords(remaining));
  });
}

export function incorrectAdjacentPairs(sequence: readonly string[]): string[] {
  const canonical = independentlySortWorWords(sequence);
  const rank = new Map(canonical.map((word, index) => [word, index]));
  return sequence.slice(0, -1).flatMap((word, index) =>
    rank.get(word)! > rank.get(sequence[index + 1]!)! ? [`${word} – ${sequence[index + 1]!}`] : [],
  );
}

export function validateWorQuestion(question: GeneratedWorQuestion, state: WorQuestionState): void {
  if (question.options.length !== 4) throw new Error(`${question.prototypeId} must render exactly four options.`);
  if (new Set(question.options.map((option) => option.value)).size !== 4) throw new Error(`${question.prototypeId} rendered duplicate options.`);
  if (question.options.some((option) => !option.value.trim())) throw new Error(`${question.prototypeId} rendered a blank option.`);
  if (question.options.filter((option) => option.misconceptionId === null).length !== 1) throw new Error(`${question.prototypeId} must have one marked answer.`);
  if (question.options[question.correctIndex]?.value !== question.answer) throw new Error(`${question.prototypeId} answer/index mismatch.`);
  if (/\{\{|\}\}|undefined|null|WOR-PROT|WOR-CP/.test(`${question.stem} ${question.explanation}`)) throw new Error(`${question.prototypeId} leaked unresolved or internal text.`);
  question.structuredPrompt.words.forEach(normalizeWorWord);
  const fullWords = state.insertionWord ? [...state.words, state.insertionWord] : state.taskKind === "COMPLETE_PARTIAL_ORDER" ? [...state.words, state.targetWord!] : [...state.words];
  const independentlySorted = independentlySortWorWords(fullWords);
  if (!sameOrder(independentlySorted, state.canonicalAscendingOrder)) throw new Error(`${question.prototypeId} generator/solver order disagreement.`);
  if (state.taskKind === "FIND_MISPLACED_WORD") {
    const candidates = misplacedCandidates(state.presentedSequence!);
    if (candidates.length !== 1 || candidates[0] !== question.answer) throw new Error(`${question.prototypeId} misplaced-word answer is not unique.`);
  }
  if (state.taskKind === "FIND_INCORRECT_PAIR") {
    const pairs = incorrectAdjacentPairs(state.presentedSequence!);
    if (pairs.length !== 1 || pairs[0] !== question.answer) throw new Error(`${question.prototypeId} incorrect-pair answer is not unique.`);
  }
  if (state.taskKind === "COMPLETE_PARTIAL_ORDER") {
    const valid = question.options.filter((option) => {
      const filled = state.partialSequence!.map((word) => word === "____" ? option.value : word);
      return sameOrder(filled, independentlySortWorWords(filled));
    });
    if (valid.length !== 1 || valid[0]!.value !== question.answer) throw new Error(`${question.prototypeId} partial-order answer is ambiguous.`);
  }
}
