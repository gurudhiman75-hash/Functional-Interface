import { uniqueSorted } from "./canonical-set";
import { getPossibleImpossibleContract } from "./possible-impossible-contracts";
import {
  relationCandidateDomain,
  relationWitnessCount,
} from "./possible-impossible-options";
import type {
  PossibleImpossibleExplanation,
  PossibleImpossibleOption,
  PossibleImpossiblePrototypeId,
} from "./possible-impossible-types";
import type { EnglishSentenceCodeLanguageInstance } from "./language-instantiator.en";
import type { SentenceCodeSolutionSpace } from "./types";

function intersection(left: readonly string[], right: readonly string[]): string[] {
  const rightSet = new Set(right);
  return uniqueSorted(left.filter((value) => rightSet.has(value)));
}

function quoted(values: readonly string[]): string {
  return values.map((value) => `‘${value}’`).join(", ");
}

function commonAcrossRows(rows: readonly (readonly string[])[]): string[] {
  return rows.slice(1).reduce((current, next) => intersection(current, next), uniqueSorted(rows[0] ?? []));
}

function witnessLine(
  prototypeId: PossibleImpossiblePrototypeId,
  instance: EnglishSentenceCodeLanguageInstance,
  space: SentenceCodeSolutionSpace,
  correct: string,
): string {
  const contract = getPossibleImpossibleContract(prototypeId);
  const witness = space.solutions.find((solution) => contract.queryDirection === "WORD_TO_TOKEN"
    ? solution.wordToToken[instance.targetWord] === correct
    : solution.wordToToken[correct] === instance.targetDisplayToken);
  if (!witness) throw new Error(`No witness exists for possible option '${correct}'`);

  const candidateValues = relationCandidateDomain(
    space,
    contract.queryDirection,
    instance.targetWord,
    instance.targetDisplayToken,
  );
  const candidateWords = contract.queryDirection === "WORD_TO_TOKEN"
    ? space.activeWords.filter((word) => candidateValues.includes(witness.wordToToken[word]!))
    : candidateValues;
  const pairs = candidateWords
    .map((word) => `‘${word}’–‘${witness.wordToToken[word]}’`)
    .join(", ");
  return `One complete mapping allowed by all statements is ${pairs}. This mapping witnesses the offered relation.`;
}

export function buildPossibleImpossibleExplanation(
  prototypeId: PossibleImpossiblePrototypeId,
  instance: EnglishSentenceCodeLanguageInstance,
  space: SentenceCodeSolutionSpace,
  options: readonly PossibleImpossibleOption[],
): PossibleImpossibleExplanation {
  const contract = getPossibleImpossibleContract(prototypeId);
  const correct = options.find((option) => option.isCorrect)!;
  const commonWords = commonAcrossRows(instance.rows.map((row) => row.words));
  const commonTokens = commonAcrossRows(instance.rows.map((row) => row.displayedCodeTokens));
  const candidateValues = relationCandidateDomain(
    space,
    contract.queryDirection,
    instance.targetWord,
    instance.targetDisplayToken,
  );

  const evidenceComparison = [
    `The words common to all three statements are ${quoted(commonWords)}.`,
    `The code words common to all three code sets are ${quoted(commonTokens)}. Therefore these common words can map only among these common code words; their displayed order gives no pairing clue.`,
  ];

  if (contract.predicate === "POSSIBLE") {
    const witnessCount = relationWitnessCount(
      space,
      contract.queryDirection,
      instance.targetWord,
      instance.targetDisplayToken,
      correct.value,
    );
    const relation = contract.queryDirection === "WORD_TO_TOKEN"
      ? `‘${correct.value}’ can be the code for ‘${instance.targetWord}’`
      : `‘${correct.value}’ can be represented by ‘${instance.targetDisplayToken}’`;
    const trap = options.find((option) => !option.isCorrect)!;
    return {
      referenceAid: [
        "A possible answer needs at least one complete mapping that satisfies every statement.",
        "The relation must remain genuinely uncertain: at least one other complete mapping must assign the target differently.",
      ],
      quickMethod: "Find the common word group and common code group. Any cross-pair inside those two groups is possible unless later evidence fixes the pairing.",
      evidenceComparison,
      witnessOrExclusion: `${witnessLine(prototypeId, instance, space, correct.value)} The relation appears in ${witnessCount} of ${space.solutionCount} valid mappings, so it is possible but not definite.`,
      conclusion: `Therefore, ${relation}. The correct answer is ‘${correct.value}’.`,
      commonTrapAlert: `‘${trap.value}’ has zero valid witnesses because it does not belong to the target's candidate group ${quoted(candidateValues)}.`,
    };
  }

  const distractor = options.find((option) => !option.isCorrect)!;
  const relation = contract.queryDirection === "WORD_TO_TOKEN"
    ? `‘${correct.value}’ cannot be the code for ‘${instance.targetWord}’`
    : `‘${correct.value}’ cannot be represented by ‘${instance.targetDisplayToken}’`;
  return {
    referenceAid: [
      "An impossible answer must be absent from every complete mapping that satisfies all statements.",
      "Each alternative option should have at least one valid mapping witness; otherwise more than one option would be impossible.",
    ],
    quickMethod: "Identify the complete candidate group for the target. The option outside that group is impossible; every member inside the group remains possible.",
    evidenceComparison,
    witnessOrExclusion: `The target's complete candidate set is ${quoted(candidateValues)}. ‘${correct.value}’ lies outside this set and has 0 witnesses among ${space.solutionCount} valid mappings.`,
    conclusion: `Therefore, ${relation}. The correct answer is ‘${correct.value}’.`,
    commonTrapAlert: `‘${distractor.value}’ is not impossible: it has ${distractor.witnessCount} valid mapping witness${distractor.witnessCount === 1 ? "" : "es"}.`,
  };
}
