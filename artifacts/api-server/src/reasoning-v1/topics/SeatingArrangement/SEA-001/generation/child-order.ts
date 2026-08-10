import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";

/**
 * Varies presentation order without changing query semantics, option order,
 * answers, or answer-determining facts.
 */
export function varySea001ChildOrder<T extends { readonly questionOrder: number }>(
  seed: string,
  children: readonly T[],
  options: { readonly preserveFirst?: boolean } = {},
): readonly T[] {
  if (children.length <= 1) return [...children];
  const random = new DeterministicRandom(`${seed}:sea001:child-order`);
  const fixed = options.preserveFirst ? children.slice(0, 1) : [];
  const variable = options.preserveFirst ? children.slice(1) : children;
  const ordered = [...fixed, ...random.shuffle(variable)];
  return ordered.map((child, index) => ({
    ...child,
    questionOrder: index + 1,
  })) as T[];
}
