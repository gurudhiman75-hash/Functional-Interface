import { SeededRandom } from "../foundation/prng";
import { canonicalSetKey, uniqueSorted } from "./canonical-set";
import { getPossibleSetContract } from "./possible-set-contracts";
import type {
  PossibleSetDirection,
  PossibleSetOption,
  PossibleSetPrototypeId,
} from "./possible-set-types";
import {
  possibleTokenSetsForWords,
  possibleWordSetsForTokens,
} from "./solution-space";
import type { SentenceCodeSolutionSpace } from "./types";

function pairs(values: readonly string[]): readonly (readonly [string, string])[] {
  const output: [string, string][] = [];
  for (let left = 0; left < values.length; left += 1) {
    for (let right = left + 1; right < values.length; right += 1) {
      output.push([values[left]!, values[right]!]);
    }
  }
  return output;
}

export function possibleSetWitnessCount(
  space: SentenceCodeSolutionSpace,
  direction: PossibleSetDirection,
  targetWords: readonly string[],
  targetTokens: readonly string[],
  candidateMembers: readonly string[],
): number {
  const candidateKey = canonicalSetKey(candidateMembers);
  return space.solutions.filter((solution) => {
    if (direction === "WORDS_TO_TOKENS") {
      return canonicalSetKey(targetWords.map((word) => solution.wordToToken[word]!)) === candidateKey;
    }
    const decodedWords = space.activeWords.filter((word) => targetTokens.includes(solution.wordToToken[word]!));
    return canonicalSetKey(decodedWords) === candidateKey;
  }).length;
}

export function buildPossibleSetOptions(
  prototypeId: PossibleSetPrototypeId,
  space: SentenceCodeSolutionSpace,
  targetWords: readonly [string, string],
  targetTokens: readonly [string, string],
  seed: number,
): { options: readonly PossibleSetOption[]; correctIndex: number; possibleSetCount: 2 | 3 } {
  const contract = getPossibleSetContract(prototypeId);
  const random = new SeededRandom(`${prototypeId}:${seed}:set-options-v1`);
  const possibleSets = contract.queryDirection === "WORDS_TO_TOKENS"
    ? possibleTokenSetsForWords(space, targetWords)
    : possibleWordSetsForTokens(space, targetTokens);
  if (possibleSets.length !== 2 && possibleSets.length !== 3) {
    throw new Error(`${prototypeId}/${seed} expected two or three possible sets, received ${possibleSets.length}`);
  }

  const activeValues = contract.queryDirection === "WORDS_TO_TOKENS" ? space.activeTokens : space.activeWords;
  const possibleKeys = new Set(possibleSets.map((members) => canonicalSetKey(members)));
  const impossiblePairs = pairs(activeValues)
    .map((members) => uniqueSorted(members))
    .filter((members) => !possibleKeys.has(canonicalSetKey(members)));
  if (impossiblePairs.length < 3) throw new Error(`${prototypeId}/${seed} lacks three impossible set distractors`);

  const correctMembers = [...random.pick(possibleSets)];
  const raw: PossibleSetOption[] = [
    {
      value: uniqueSorted(correctMembers).join(" "),
      members: uniqueSorted(correctMembers),
      canonicalValue: canonicalSetKey(correctMembers),
      isCorrect: true,
      witnessCount: possibleSetWitnessCount(
        space,
        contract.queryDirection,
        targetWords,
        targetTokens,
        correctMembers,
      ),
    },
    ...random.shuffle(impossiblePairs).slice(0, 3).map((members) => ({
      value: members.join(" "),
      members,
      canonicalValue: canonicalSetKey(members),
      isCorrect: false,
      witnessCount: 0,
      errorLabel: "ZERO_WITNESS_SET" as const,
    })),
  ];

  const options = random.shuffle(raw);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || new Set(options.map((option) => option.canonicalValue)).size !== 4) {
    throw new Error(`${prototypeId}/${seed} produced an invalid set option package`);
  }
  return { options, correctIndex, possibleSetCount: possibleSets.length };
}
