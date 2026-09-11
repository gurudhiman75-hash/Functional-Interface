import { generateLp011Batch, type Lp011Caselet, type Lp011Child } from "./lp-011.ts";

export const LP_011_STABILIZED_V1_1 = Object.freeze({
  authorityId: "LP_011_STABILIZED_V1_1" as const,
  parentAuthority: "LP_011_REVIEW_PACKAGE" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  purpose: "DETERMINISTIC_DIFFICULTY_SAFE_RETRY_WITH_GLOBAL_OPTION_BALANCE" as const,
  changesPuzzleSemantics: false as const,
  changesClueSemantics: false as const,
  changesExplanationContract: false as const,
});

function rebalanceChild(child: Lp011Child, targetIndex: number): Lp011Child {
  const wrong = child.options.filter((option) => option !== child.answer);
  const options = [...wrong];
  options.splice(targetIndex, 0, child.answer);
  return { ...child, options, correctIndex: targetIndex };
}

function rebalanceCaselet(caselet: Lp011Caselet, globalIndex: number, seed: string): Lp011Caselet {
  const caseletId = `LP-011:${seed}:${globalIndex + 1}`;
  return {
    ...caselet,
    caseletId,
    children: caselet.children.map((child, childIndex) => rebalanceChild({
      ...child,
      questionId: `${caseletId}:${child.qlId}`,
    }, (globalIndex + childIndex) % 4)),
  };
}

function generateOneForDifficulty(seed: string, globalIndex: number): Lp011Caselet {
  const desiredIndex = globalIndex % 3;
  const requiredCount = desiredIndex + 1;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const batch = generateLp011Batch(`${seed}:difficulty:${desiredIndex}:attempt:${attempt}`, requiredCount);
      const caselet = batch[desiredIndex];
      if (caselet) return caselet;
    } catch {
      // Some randomly constructed hard hidden states need a different deterministic seed.
      // Retry selection only; puzzle/clue semantics remain unchanged.
    }
  }
  throw new Error(`LP-011 V1.1 could not build difficulty slot ${desiredIndex} for caselet ${globalIndex + 1}`);
}

export function generateLp011BatchStabilizedV1_1(seed = "lp-011-stabilized-v1-1", count = 8): Lp011Caselet[] {
  const result: Lp011Caselet[] = [];
  for (let index = 0; index < count; index += 1) {
    result.push(rebalanceCaselet(generateOneForDifficulty(seed, index), index, seed));
  }
  return result;
}
