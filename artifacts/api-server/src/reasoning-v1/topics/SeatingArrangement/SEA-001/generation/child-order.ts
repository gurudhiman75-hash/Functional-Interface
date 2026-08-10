import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";

function stableNumber(value: string): number {
  let hash = 0x811c9dc5;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193);
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

/**
 * Varies presentation order without changing query semantics or answer facts,
 * then rebalances the visible correct-option position for the new Q slot.
 */
export function varySea001ChildOrder<T extends {
  readonly questionOrder: number;
  readonly queryContractId: string;
  readonly answerDeterminingFactFingerprint: string;
  readonly answerIndex: number;
  readonly options: readonly { readonly isCorrect: boolean }[];
}>(
  seed: string,
  children: readonly T[],
  options: { readonly preserveFirst?: boolean } = {},
): readonly T[] {
  if (children.length <= 1) return [...children];
  const random = new DeterministicRandom(`${seed}:sea001:child-order`);
  const fixed = options.preserveFirst ? children.slice(0, 1) : [];
  const variable = options.preserveFirst ? children.slice(1) : children;
  const ordered = [...fixed, ...random.shuffle(variable)];
  return ordered.map((child, index) => {
    const questionOrder = index + 1;
    const correct = child.options.find((option) => option.isCorrect);
    if (!correct) throw new Error(`SEA-001 child ${child.queryContractId} has no correct option`);
    const wrong = child.options.filter((option) => !option.isCorrect);
    if (wrong.length !== child.options.length - 1) throw new Error(`SEA-001 child ${child.queryContractId} has invalid correct-option count`);
    const answerIndex = stableNumber(
      `${seed}|${child.queryContractId}|${child.answerDeterminingFactFingerprint}|Q${questionOrder}`,
    ) % child.options.length;
    const reorderedOptions = [...wrong];
    reorderedOptions.splice(answerIndex, 0, correct);
    return {
      ...child,
      questionOrder,
      options: reorderedOptions,
      answerIndex,
    };
  }) as T[];
}
