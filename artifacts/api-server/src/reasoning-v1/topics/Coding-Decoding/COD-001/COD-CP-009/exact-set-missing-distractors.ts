import { SeededRandom } from "../foundation/prng";
import { canonicalSetKey, uniqueSorted } from "./canonical-set";
import type {
  ExactSetMissingOption,
  ExactSetMissingPrototypeId,
  ExactSetMissingErrorLabel,
} from "./exact-set-missing-types";
import type { EnglishSentenceCodeLanguageInstance } from "./language-instantiator.en";
import {
  classifyTokenSetToWordsRelation,
  classifyWordsToTokenSetRelation,
  possibleMissingTokens,
  possibleMissingWords,
} from "./solution-space";
import type { SentenceCodeSolutionSpace } from "./types";

interface CandidateOption {
  values: readonly string[];
  errorLabel: ExactSetMissingErrorLabel;
}

function combinations(values: readonly string[], size: number): string[][] {
  const output: string[][] = [];
  const current: string[] = [];
  const recurse = (start: number): void => {
    if (current.length === size) {
      output.push([...current]);
      return;
    }
    for (let index = start; index < values.length; index += 1) {
      current.push(values[index]!);
      recurse(index + 1);
      current.pop();
    }
  };
  recurse(0);
  return output;
}

function sharedCount(left: readonly string[], right: readonly string[]): number {
  const rightSet = new Set(right);
  return left.filter((value) => rightSet.has(value)).length;
}

function displaySet(values: readonly string[], kind: "TOKEN" | "WORD"): string {
  const canonical = uniqueSorted(values);
  return kind === "TOKEN" ? canonical.join(" ") : canonical.join(", ");
}

function optionFromSet(
  values: readonly string[],
  kind: "TOKEN" | "WORD",
  isCorrect: boolean,
  errorLabel?: ExactSetMissingErrorLabel,
): ExactSetMissingOption {
  return {
    value: displaySet(values, kind),
    canonicalValue: canonicalSetKey(values),
    isCorrect,
    errorLabel,
  };
}

function optionFromAtomic(
  value: string,
  isCorrect: boolean,
  errorLabel?: ExactSetMissingErrorLabel,
): ExactSetMissingOption {
  return { value, canonicalValue: value, isCorrect, errorLabel };
}

function shuffleAndValidate(
  options: readonly ExactSetMissingOption[],
  random: SeededRandom,
): { options: readonly ExactSetMissingOption[]; correctIndex: number } {
  const shuffled = random.shuffle(options);
  if (shuffled.length !== 4) throw new Error("Exact set/missing prototypes require four options");
  if (new Set(shuffled.map((option) => option.canonicalValue)).size !== 4) {
    throw new Error("Exact set/missing options must be canonically unique");
  }
  if (shuffled.filter((option) => option.isCorrect).length !== 1) {
    throw new Error("Exact set/missing options must contain exactly one correct answer");
  }
  return { options: shuffled, correctIndex: shuffled.findIndex((option) => option.isCorrect) };
}

function exactPhraseOptions(
  prototypeId: ExactSetMissingPrototypeId,
  instance: EnglishSentenceCodeLanguageInstance,
  space: SentenceCodeSolutionSpace,
  random: SeededRandom,
): { options: readonly ExactSetMissingOption[]; correctIndex: number } {
  const forward = prototypeId === "COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS";
  const correctValues = forward ? instance.phraseDisplayTokens! : instance.phraseWords!;
  const universe = forward ? space.activeTokens : space.activeWords;
  const candidateSets = combinations(universe, correctValues.length);
  const wrongCandidates: CandidateOption[] = [];

  for (const candidate of random.shuffle(candidateSets)) {
    if (canonicalSetKey(candidate) === canonicalSetKey(correctValues)) continue;
    const status = forward
      ? classifyWordsToTokenSetRelation(space, instance.phraseWords!, candidate)
      : classifyTokenSetToWordsRelation(space, instance.phraseDisplayTokens!, candidate);
    if (status !== "IMPOSSIBLE") continue;
    wrongCandidates.push({
      values: candidate,
      errorLabel: sharedCount(candidate, correctValues) === correctValues.length - 1
        ? "ONE_MEMBER_REPLACED"
        : "RELATED_STATEMENT_SET",
    });
  }

  wrongCandidates.sort((left, right) => {
    const leftShared = sharedCount(left.values, correctValues);
    const rightShared = sharedCount(right.values, correctValues);
    return rightShared - leftShared;
  });
  const selected = wrongCandidates.slice(0, 2);
  if (selected.length < 2) throw new Error(`${prototypeId} could not build two impossible set distractors`);

  const kind = forward ? "TOKEN" : "WORD";
  return shuffleAndValidate([
    optionFromSet(correctValues, kind, true),
    ...selected.map((candidate) => optionFromSet(candidate.values, kind, false, candidate.errorLabel)),
    {
      value: "Cannot be determined",
      canonicalValue: "<CANNOT_BE_DETERMINED>",
      isCorrect: false,
      errorLabel: "INDIVIDUAL_AMBIGUITY_CONFUSED_WITH_SET_AMBIGUITY",
    },
  ], random);
}

function missingOptions(
  prototypeId: ExactSetMissingPrototypeId,
  instance: EnglishSentenceCodeLanguageInstance,
  space: SentenceCodeSolutionSpace,
  random: SeededRandom,
): { options: readonly ExactSetMissingOption[]; correctIndex: number } {
  const presentation = instance.missingPresentation!;
  const tokenQuestion = prototypeId === "COD-CP009-PROT-MISSING-TOKEN";
  const correct = tokenQuestion ? presentation.correctDisplayToken : presentation.missingWord;
  const exactCandidates = tokenQuestion
    ? possibleMissingTokens(space, presentation.sentence.replace(/,/g, "").split(/\s+/), presentation.displayedKnownTokens)
    : possibleMissingWords(
      space,
      instance.rows.find((row) => row.rowId === presentation.rowId)!.displayedCodeTokens,
      presentation.sentence.replace(/,/g, "").split(/\s+/).filter((word) => word !== presentation.missingWord),
    );
  if (exactCandidates.length !== 1 || exactCandidates[0] !== correct) {
    throw new Error(`${prototypeId} missing-member result is not uniquely invariant`);
  }

  const universe = tokenQuestion ? space.activeTokens : space.activeWords;
  const wrongValues = random.shuffle(universe.filter((value) => value !== correct)).slice(0, 2);
  if (wrongValues.length < 2) throw new Error(`${prototypeId} could not build two missing-member distractors`);

  return shuffleAndValidate([
    optionFromAtomic(correct, true),
    optionFromAtomic(wrongValues[0]!, false, tokenQuestion ? "MISSING_MEMBER_WRONG_DIFFERENCE" : "RELATED_WORD_SELECTED"),
    optionFromAtomic(wrongValues[1]!, false, tokenQuestion ? "MISSING_MEMBER_WRONG_DIFFERENCE" : "RELATED_WORD_SELECTED"),
    {
      value: "Cannot be determined",
      canonicalValue: "<CANNOT_BE_DETERMINED>",
      isCorrect: false,
      errorLabel: "UNRESOLVED_ASSUMED",
    },
  ], random);
}

export function buildExactSetMissingOptions(
  prototypeId: ExactSetMissingPrototypeId,
  instance: EnglishSentenceCodeLanguageInstance,
  space: SentenceCodeSolutionSpace,
  seed: number,
): { options: readonly ExactSetMissingOption[]; correctIndex: number } {
  const random = new SeededRandom(`${prototypeId}:${seed}:options-v1`);
  return prototypeId.includes("PHRASE") || prototypeId.includes("TOKENS-TO-PHRASE")
    ? exactPhraseOptions(prototypeId, instance, space, random)
    : missingOptions(prototypeId, instance, space, random);
}
