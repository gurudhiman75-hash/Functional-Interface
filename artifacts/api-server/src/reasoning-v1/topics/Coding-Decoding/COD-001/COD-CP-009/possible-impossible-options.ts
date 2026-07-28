import { SeededRandom } from "../foundation/prng";
import { getPossibleImpossibleContract } from "./possible-impossible-contracts";
import type {
  PossibleImpossibleDirection,
  PossibleImpossibleOption,
  PossibleImpossiblePrototypeId,
} from "./possible-impossible-types";
import type { SentenceCodeSolutionSpace } from "./types";

export function relationWitnessCount(
  space: SentenceCodeSolutionSpace,
  direction: PossibleImpossibleDirection,
  targetWord: string,
  targetToken: string,
  candidate: string,
): number {
  if (direction === "WORD_TO_TOKEN") {
    return space.solutions.filter((solution) => solution.wordToToken[targetWord] === candidate).length;
  }
  return space.solutions.filter((solution) => solution.wordToToken[candidate] === targetToken).length;
}

export function relationCandidateDomain(
  space: SentenceCodeSolutionSpace,
  direction: PossibleImpossibleDirection,
  targetWord: string,
  targetToken: string,
): readonly string[] {
  return direction === "WORD_TO_TOKEN"
    ? space.candidateTokensByWord[targetWord]!
    : space.candidateWordsByToken[targetToken]!;
}

export function relationActiveDomain(
  space: SentenceCodeSolutionSpace,
  direction: PossibleImpossibleDirection,
): readonly string[] {
  return direction === "WORD_TO_TOKEN" ? space.activeTokens : space.activeWords;
}

export function buildPossibleImpossibleOptions(
  prototypeId: PossibleImpossiblePrototypeId,
  space: SentenceCodeSolutionSpace,
  targetWord: string,
  targetToken: string,
  seed: number,
): { options: readonly PossibleImpossibleOption[]; correctIndex: number } {
  const contract = getPossibleImpossibleContract(prototypeId);
  const random = new SeededRandom(`${prototypeId}:${seed}:options-v1`);
  const candidates = [...relationCandidateDomain(space, contract.queryDirection, targetWord, targetToken)];
  const candidateSet = new Set(candidates);
  const impossibleValues = relationActiveDomain(space, contract.queryDirection)
    .filter((value) => !candidateSet.has(value));

  let raw: PossibleImpossibleOption[];
  if (contract.predicate === "POSSIBLE") {
    if (impossibleValues.length < 3) throw new Error(`${prototypeId}/${seed} needs three zero-witness distractors`);
    const correctValue = random.pick(candidates);
    raw = [
      {
        value: correctValue,
        isCorrect: true,
        witnessCount: relationWitnessCount(space, contract.queryDirection, targetWord, targetToken, correctValue),
      },
      ...random.shuffle(impossibleValues).slice(0, 3).map((value) => ({
        value,
        isCorrect: false,
        witnessCount: 0,
        errorLabel: "ZERO_WITNESS" as const,
      })),
    ];
  } else {
    if (candidates.length !== 3) throw new Error(`${prototypeId}/${seed} requires exactly three witnessed distractors`);
    const correctValue = random.pick(impossibleValues);
    raw = [
      {
        value: correctValue,
        isCorrect: true,
        witnessCount: 0,
      },
      ...candidates.map((value) => ({
        value,
        isCorrect: false,
        witnessCount: relationWitnessCount(space, contract.queryDirection, targetWord, targetToken, value),
        errorLabel: "POSSIBLE_WITNESS" as const,
      })),
    ];
  }

  const options = random.shuffle(raw);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || new Set(options.map((option) => option.value)).size !== 4) {
    throw new Error(`${prototypeId}/${seed} produced an invalid option set`);
  }
  return { options, correctIndex };
}
