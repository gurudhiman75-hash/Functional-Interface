import { SeededRandom } from "../foundation/prng";
import { canonicalSetKey, uniqueSorted } from "./canonical-set";
import { getResolvedCompositionContract } from "./resolved-composition-contracts";
import type {
  ResolvedCompositionOption,
  ResolvedCompositionPrototypeId,
} from "./resolved-composition-types";
import type { ResolvedCompositionLanguageInstance } from "./resolved-composition-language.en";
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

export function buildResolvedCompositionOptions(
  prototypeId: ResolvedCompositionPrototypeId,
  instance: ResolvedCompositionLanguageInstance,
  space: SentenceCodeSolutionSpace,
  seed: number,
): { options: readonly ResolvedCompositionOption[]; correctIndex: number } {
  const contract = getResolvedCompositionContract(prototypeId);
  const random = new SeededRandom(`${prototypeId}:${seed}:options-v1`);
  const correctMembers = contract.queryDirection === "WORDS_TO_TOKENS"
    ? uniqueSorted(instance.targetDisplayTokens)
    : uniqueSorted(instance.targetWords);
  const activeValues = contract.queryDirection === "WORDS_TO_TOKENS" ? space.activeTokens : space.activeWords;
  const correctKey = canonicalSetKey(correctMembers);
  const displayedRowKeys = new Set(instance.rows.map((row) => canonicalSetKey(
    contract.queryDirection === "WORDS_TO_TOKENS" ? row.displayedCodeTokens : row.words,
  )));
  const wrongPairs = pairs(activeValues)
    .map((members) => uniqueSorted(members))
    .filter((members) => canonicalSetKey(members) !== correctKey);
  if (wrongPairs.length < 3) throw new Error(`${prototypeId}/${seed} lacks set distractors`);

  const correct: ResolvedCompositionOption = {
    value: correctMembers.join(" "),
    members: correctMembers,
    canonicalValue: correctKey,
    isCorrect: true,
  };
  const distractors = random.shuffle(wrongPairs).slice(0, 3).map((members) => ({
    value: members.join(" "),
    members,
    canonicalValue: canonicalSetKey(members),
    isCorrect: false,
    errorLabel: displayedRowKeys.has(canonicalSetKey(members))
      ? "DISPLAYED_ROW_COPIED" as const
      : "ONE_COMPONENT_REPLACED" as const,
  }));
  const correctIndex = (seed - 1) % 4;
  const options = [...distractors];
  options.splice(correctIndex, 0, correct);
  if (new Set(options.map((option) => option.canonicalValue)).size !== 4) {
    throw new Error(`${prototypeId}/${seed} produced duplicate options`);
  }
  return { options, correctIndex };
}
