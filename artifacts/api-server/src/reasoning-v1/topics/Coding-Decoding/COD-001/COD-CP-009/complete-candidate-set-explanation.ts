import { uniqueSorted } from "./canonical-set";
import { getCompleteCandidateSetContract } from "./complete-candidate-set-contracts";
import { orderCompleteCandidateSetMembers } from "./complete-candidate-set-options";
import type {
  CompleteCandidateSetDirection,
  CompleteCandidateSetExplanation,
  CompleteCandidateSetOption,
  CompleteCandidateSetPrototypeId,
} from "./complete-candidate-set-types";
import type { EnglishSentenceCodeLanguageInstance } from "./language-instantiator.en";
import type { SentenceCodeSolutionSpace } from "./types";

function intersection(left: readonly string[], right: readonly string[]): string[] {
  const rightSet = new Set(right);
  return uniqueSorted(left.filter((value) => rightSet.has(value)));
}

function commonAcrossRows(rows: readonly (readonly string[])[]): string[] {
  return rows.slice(1).reduce((current, next) => intersection(current, next), uniqueSorted(rows[0] ?? []));
}

function quoted(direction: CompleteCandidateSetDirection, values: readonly string[]): string {
  const rendered = orderCompleteCandidateSetMembers(direction, values).map((value) => `‘${value}’`);
  if (rendered.length === 2) return `${rendered[0]} or ${rendered[1]}`;
  return `${rendered.slice(0, -1).join(", ")} or ${rendered.at(-1)}`;
}

function candidateWitnessCount(
  contractDirection: CompleteCandidateSetDirection,
  space: SentenceCodeSolutionSpace,
  targetWord: string,
  targetToken: string,
  candidate: string,
): number {
  return contractDirection === "WORD_TO_ALL_TOKENS"
    ? space.solutions.filter((solution) => solution.wordToToken[targetWord] === candidate).length
    : space.solutions.filter((solution) => solution.wordToToken[candidate] === targetToken).length;
}

export function buildCompleteCandidateSetExplanation(
  prototypeId: CompleteCandidateSetPrototypeId,
  instance: EnglishSentenceCodeLanguageInstance,
  space: SentenceCodeSolutionSpace,
  completeCandidates: readonly string[],
  options: readonly CompleteCandidateSetOption[],
): CompleteCandidateSetExplanation {
  const contract = getCompleteCandidateSetContract(prototypeId);
  const commonWords = commonAcrossRows(instance.rows.map((row) => row.words));
  const commonTokens = commonAcrossRows(instance.rows.map((row) => row.displayedCodeTokens));
  const orderedCandidates = orderCompleteCandidateSetMembers(contract.queryDirection, completeCandidates);
  const witnessDetails = orderedCandidates.map((candidate) => {
    const witnesses = candidateWitnessCount(
      contract.queryDirection,
      space,
      instance.targetWord,
      instance.targetDisplayToken,
      candidate,
    );
    return `‘${candidate}’ has ${witnesses} valid mapping witness${witnesses === 1 ? "" : "es"}`;
  });
  const omittedTrap = options.find((option) => option.errorLabel === "CANDIDATE_OMITTED")!;
  const extraTrap = options.find((option) => option.errorLabel === "IMPOSSIBLE_MEMBER_ADDED")!;
  const targetDescription = contract.queryDirection === "WORD_TO_ALL_TOKENS"
    ? `the word ‘${instance.targetWord}’`
    : `the code word ‘${instance.targetDisplayToken}’`;

  return {
    referenceAid: [
      "A complete candidate-set answer must include every value that appears in at least one valid mapping.",
      "It must exclude every value that appears in no valid mapping; returning just one possible member is incomplete.",
    ],
    quickMethod: "Find the full common word group and full common code group. The target can pair with every member of the opposite group and with no member outside it.",
    evidenceComparison: [
      `The words common to all three statements are ${quoted("TOKEN_TO_ALL_WORDS", commonWords)}.`,
      `The code words common to all three code sets are ${quoted("WORD_TO_ALL_TOKENS", commonTokens)}. Since their internal pairing is unresolved, ${targetDescription} can correspond to every member of the opposite common group.`,
    ],
    completenessProof: `${witnessDetails.join("; ")}. No value outside ${quoted(contract.queryDirection, completeCandidates)} has any valid witness. Therefore this is the complete candidate set, not merely one possible answer.`,
    conclusion: `The complete answer is ‘${options.find((option) => option.isCorrect)!.value}’.`,
    commonTrapAlert: `‘${omittedTrap.value}’ omits a witnessed candidate, while ‘${extraTrap.value}’ adds a member with zero valid witnesses.`,
  };
}
