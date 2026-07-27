import { canonicalSetKey, uniqueSorted } from "./canonical-set";
import { getCompleteCandidateSetContract } from "./complete-candidate-set-contracts";
import type {
  CompleteCandidateSetOption,
  CompleteCandidateSetPrototypeId,
} from "./complete-candidate-set-types";
import type { SentenceCodeSolutionSpace } from "./types";

function listValue(members: readonly string[]): string {
  const values = uniqueSorted(members);
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
      value: listValue(candidates),
      members: candidates,
      canonicalValue: canonicalSetKey(candidates),
      isCorrect: true,
    },
    {
      value: listValue(omitted),
      members: omitted,
      canonicalValue: canonicalSetKey(omitted),
      isCorrect: false,
      errorLabel: "CANDIDATE_OMITTED",
    },
    {
      value: listValue(extra),
      members: extra,
      canonicalValue: canonicalSetKey(extra),
      isCorrect: false,
      errorLabel: "IMPOSSIBLE_MEMBER_ADDED",
    },
    {
      value: listValue(replaced),
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
