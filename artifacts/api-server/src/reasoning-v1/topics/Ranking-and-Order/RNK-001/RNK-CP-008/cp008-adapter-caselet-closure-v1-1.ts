import { selectRnkPeople } from "../foundation/rnk-object-pool-v2";
import {
  RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION,
  RNK_CP008_LIFECYCLE,
  type RnkCp008RelationalSideCountQuestion,
} from "./cp008-adapter-caselet-closure-v1";

export * from "./cp008-adapter-caselet-closure-v1";

export const RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1 =
  "RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1" as const;

function mix32(value: number): number {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function pickInt(seed: number, salt: number, min: number, max: number): number {
  return min + (mix32(seed ^ salt) % (max - min + 1));
}

function placeNumericOptions(answer: number, candidates: readonly number[], correctIndex: 0 | 1 | 2 | 3): readonly number[] {
  const distractors = [...new Set(candidates)].filter((value) => value > 0 && value !== answer);
  let n = answer + 2;
  while (distractors.length < 3) {
    if (!distractors.includes(n)) distractors.push(n);
    n += 1;
  }
  const output: number[] = [];
  let cursor = 0;
  for (let index = 0; index < 4; index += 1) {
    output.push(index === correctIndex ? answer : distractors[cursor++]!);
  }
  return output;
}

/**
 * V1.1 supersedes the V1 Q66-style generator. V1 omitted the total population
 * from the learner-visible evidence, so its hidden side count was not derivable.
 */
export function generateRnkCp008RelationalSideCountQuestionV1_1(
  seed: number,
): RnkCp008RelationalSideCountQuestion {
  const people = selectRnkPeople(seed ^ 0x51463636, 2, { genderMode: "BALANCED" });
  const source = people[0]!.names.en;
  const target = people[1]!.names.en;
  const sourceBehind = pickInt(seed, 0x42454849, 2, 8);
  const multiplier = pickInt(seed, 0x4d554c54, 2, 3);
  const sourceFront = multiplier * sourceBehind;
  const total = sourceFront + sourceBehind + 1;
  const targetFront = sourceBehind;
  const targetBehind = total - targetFront - 1;
  const correctIndex = (mix32(seed ^ 0x51414e53) % 4) as 0 | 1 | 2 | 3;
  const options = placeNumericOptions(
    targetBehind,
    [sourceBehind, sourceFront, targetBehind - 1, targetBehind + 1, total - targetFront],
    correctIndex,
  );

  return {
    adapterVersion: RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION,
    sourceForm: "RELATIONAL_SIDE_COUNT_EQUATION",
    mappedQlId: "RNK-QL-004",
    seed,
    stem: `There are ${total} people in a queue. The number of people ahead of ${source} is ${multiplier} times the number behind ${source}. The number of people ahead of ${target} is equal to the number behind ${source}. How many people are behind ${target}?`,
    options,
    correctIndex,
    answer: targetBehind,
    explanation: `Let the number behind ${source} be x. Then ${sourceFront} = ${multiplier}x and total = ${multiplier}x + x + 1 = ${total}, so x = ${sourceBehind}. Hence ${target} has ${targetFront} people ahead and rank ${targetFront + 1}. People behind ${target} = ${total} - ${targetFront + 1} = ${targetBehind}. The equation is only preprocessing; the normalized task is the total-and-rank side-count contract owned by RNK-QL-004.`,
    normalizedState: {
      sourceBehind,
      sourceFront,
      total,
      targetFront,
      targetBehind,
      multiplier,
    },
    lifecycle: RNK_CP008_LIFECYCLE,
  };
}
