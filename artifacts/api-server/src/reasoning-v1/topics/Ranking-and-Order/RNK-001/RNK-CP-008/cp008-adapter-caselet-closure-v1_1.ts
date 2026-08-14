import {
  generateRnkCp008RelationalSideCountQuestion as generateV1RelationalSideCountQuestion,
  type RnkCp008RelationalSideCountQuestion,
} from "./cp008-adapter-caselet-closure-v1";

export * from "./cp008-adapter-caselet-closure-v1";

export const RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1 =
  "RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1" as const;

/**
 * V1 accidentally kept the total population only in normalizedState.
 * The Q66-style equation therefore lacked enough learner-visible evidence.
 * V1.1 preserves the frozen ownership decision but makes the numeric anchor
 * explicit in the stem, so the displayed evidence alone determines x.
 */
export function generateRnkCp008RelationalSideCountQuestionV1_1(
  seed: number,
): RnkCp008RelationalSideCountQuestion {
  const base = generateV1RelationalSideCountQuestion(seed);
  const sourceMatch = base.stem.match(/ahead of ([^ ]+)/);
  const targetMatch = base.stem.match(/ahead of ([^ ]+) is equal/);
  const source = sourceMatch?.[1] ?? "the first person";
  const target = targetMatch?.[1] ?? "the second person";
  const { total, multiplier } = base.normalizedState;

  return {
    ...base,
    stem: `In a queue of ${total} people, the number of people ahead of ${source} is ${multiplier} times the number behind ${source}. The number of people ahead of ${target} is equal to the number behind ${source}. How many people are behind ${target}?`,
  };
}
