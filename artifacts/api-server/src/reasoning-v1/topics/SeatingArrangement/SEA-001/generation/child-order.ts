import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";

const ANSWER_PATTERNS = [
  [1, 1, 3, 0],
  [2, 0, 1, 2],
  [1, 3, 0, 1],
  [1, 3, 2, 3],
  [3, 0, 3, 3],
  [2, 1, 2, 0],
  [3, 3, 3, 2],
  [2, 2, 2, 3],
  [0, 1, 1, 1],
  [0, 2, 3, 2],
  [3, 0, 0, 1],
  [3, 3, 1, 2],
  [1, 0, 0, 0],
  [2, 2, 0, 1],
  [0, 2, 1, 3],
  [0, 1, 2, 0],
] as const;

function fallbackHash(value: string): number {
  let hash = 0x811c9dc5;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193);
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

function generationOrdinal(seed: string): number {
  const normalised = seed.replace(/:retry:\d+$/, "");
  const match = normalised.match(/(\d+)(?!.*\d)/);
  return match?.[1] ? Number(match[1]) : fallbackHash(normalised);
}

function targetAnswerIndex(seed: string, questionOrder: number): 0 | 1 | 2 | 3 {
  const pattern = ANSWER_PATTERNS[generationOrdinal(seed) % ANSWER_PATTERNS.length];
  if (!pattern) throw new Error("Missing SEA-001 CP001 answer pattern");
  return pattern[questionOrder - 1] as 0 | 1 | 2 | 3;
}

/**
 * Varies presentation order without changing query semantics or answer facts.
 * CP001 uses 16 irregular answer-key patterns: each visible Q slot is balanced
 * across A/B/C/D over the generation cycle, while most passages still contain
 * repeated answer letters so the key does not look artificially permuted.
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
    const correct = child.options.find((option) => option.isCorrect);
    if (!correct) throw new Error(`SEA-001 child ${child.queryContractId} lost its correct option`);
    const wrongOptions = child.options.filter((option) => !option.isCorrect);
    if (wrongOptions.length !== child.options.length - 1) throw new Error(`SEA-001 child ${child.queryContractId} has invalid option correctness`);
    const optionRandom = new DeterministicRandom(
      `${seed}:sea001:visible-distractors:${child.queryContractId}:${child.answerDeterminingFactFingerprint}:Q${questionOrder}`,
    );
    const reorderedOptions = optionRandom.shuffle(wrongOptions);
    const answerIndex = targetAnswerIndex(seed, questionOrder);
    reorderedOptions.splice(answerIndex, 0, correct);
    return {
      ...child,
      questionOrder,
      options: reorderedOptions,
      answerIndex,
    };
  }) as T[];
}
