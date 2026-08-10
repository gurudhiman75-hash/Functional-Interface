import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";

/**
 * Varies presentation order without changing query semantics or answer facts.
 * When a child moves to a new visible Q slot, reshuffle its four options and
 * recompute answerIndex so the new slot does not inherit a query-family bias.
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
    if (options.preserveFirst && index === 0) {
      return {
        ...child,
        questionOrder,
      };
    }
    const optionRandom = new DeterministicRandom(
      `${seed}:sea001:visible-options:${child.queryContractId}:${child.answerDeterminingFactFingerprint}:Q${questionOrder}`,
    );
    const reorderedOptions = optionRandom.shuffle(child.options);
    const answerIndex = reorderedOptions.findIndex((option) => option.isCorrect);
    if (answerIndex < 0) throw new Error(`SEA-001 child ${child.queryContractId} lost its correct option`);
    return {
      ...child,
      questionOrder,
      options: reorderedOptions,
      answerIndex,
    };
  }) as T[];
}
