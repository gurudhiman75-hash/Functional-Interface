import { canonicalSetKey, uniqueSorted } from "./canonical-set";
import { getCompleteCandidateSetContract } from "./complete-candidate-set-contracts";
import type { CompleteCandidateSetDirection } from "./complete-candidate-set-types";
import type {
  CompleteCandidateSetOption,
  CompleteCandidateSetPrototypeId,
} from "./complete-candidate-set-types";
import { getEnglishSentenceCodeLexeme } from "./datasets/lexemes.en";
import type { SentenceCodeSolutionSpace } from "./types";

function wordAlternativeRank(value: string): number {
  const lexeme = getEnglishSentenceCodeLexeme(value);
  if (lexeme.semanticTags.includes("actor") || lexeme.semanticTags.includes("subject")) return 0;
  if (lexeme.partOfSpeech === "VERB") return 1;
  if (lexeme.semanticTags.includes("object") || lexeme.semanticTags.includes("activity")) return 2;
  if (lexeme.partOfSpeech === "ADJECTIVE") return 2;
  if (lexeme.partOfSpeech === "ADVERB") return 3;
  if (lexeme.partOfSpeech === "CONJUNCTION") return 4;
  return 2;
}

export function orderCompleteCandidateSetMembers(
  direction: CompleteCandidateSetDirection,
  members: readonly string[],
): string[] {
  if (direction === "WORD_TO_ALL_TOKENS") return uniqueSorted(members);
  return [...members].sort((left, right) =>
    wordAlternativeRank(left) - wordAlternativeRank(right) || left.localeCompare(right));
}

export function formatCompleteCandidateSetValue(
  direction: CompleteCandidateSetDirection,
  members: readonly string[],
): string {
  const values = orderCompleteCandidateSetMembers(direction, members);
  if (values.length === 1) return `${values[0]} only`;
  if (values.length === 2) return `${values[0]} or ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} or ${values.at(-1)}`;
}

export function buildCompleteCandidateSetOptions(
  prototypeId: CompleteCandidateSetPrototypeId,
  space: SentenceCodeSolutionSpace,
  targetWord: string,
  targetToken: string,
  seed: number,
): { options: readonly CompleteCandidateSetOption[]; correctIndex: number; completeCandidates: readonly string[] } {
  const contract = getCompleteCandidateSetContract(prototypeId);
  const candidates = uniqueSorted(
    contract.queryDirection === "WORD_TO_ALL_TOKENS"
      ? space.candidateTokensByWord[targetWord]!
      : space.candidateWordsByToken[targetToken]!,
  );
  if (candidates.length !== 2 && candidates.length !== 3) {
    throw new Error(`${prototypeId}/${seed} expected two or three candidates, received ${candidates.length}`);
  }
  const activeValues = contract.queryDirection === "WORD_TO_ALL_TOKENS" ? space.activeTokens : space.activeWords;
  const impossible = uniqueSorted(activeValues.filter((value) => !candidates.includes(value)));
  if (impossible.length === 0) throw new Error(`${prototypeId}/${seed} lacks impossible members`);
  const omitIndex = seed % candidates.length;
  const impossibleMember = impossible[seed % impossible.length]!;
  const omitted = candidates.filter((_, index) => index !== omitIndex);
  const extra = uniqueSorted([...candidates, impossibleMember]);
  const replaced = uniqueSorted(candidates.map((value, index) => index === omitIndex ? impossibleMember : value));

  const raw: CompleteCandidateSetOption[] = [
    {
      value: formatCompleteCandidateSetValue(contract.queryDirection, candidates),
      members: candidates,
      canonicalValue: canonicalSetKey(candidates),
      isCorrect: true,
    },
    {
      value: formatCompleteCandidateSetValue(contract.queryDirection, omitted),
      members: omitted,
      canonicalValue: canonicalSetKey(omitted),
      isCorrect: false,
      errorLabel: "CANDIDATE_OMITTED",
    },
    {
      value: formatCompleteCandidateSetValue(contract.queryDirection, extra),
      members: extra,
      canonicalValue: canonicalSetKey(extra),
      isCorrect: false,
      errorLabel: "IMPOSSIBLE_MEMBER_ADDED",
    },
    {
      value: formatCompleteCandidateSetValue(contract.queryDirection, replaced),
      members: replaced,
      canonicalValue: canonicalSetKey(replaced),
      isCorrect: false,
      errorLabel: "CANDIDATE_REPLACED",
    },
  ];
  const correctIndex = (seed - 1) % 4;
  const distractors = raw.slice(1);
  const options = [...distractors];
  options.splice(correctIndex, 0, raw[0]!);
  if (new Set(options.map((option) => option.canonicalValue)).size !== 4) {
    throw new Error(`${prototypeId}/${seed} produced duplicate candidate-set options`);
  }
  return { options, correctIndex, completeCandidates: candidates };
}
