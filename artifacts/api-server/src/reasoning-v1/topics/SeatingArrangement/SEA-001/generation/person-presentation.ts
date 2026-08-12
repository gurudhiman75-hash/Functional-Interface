import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { selectSea001Names } from "./name-pool.ts";

export function sea001PersonIds(count: number): string[] {
  if (!Number.isInteger(count) || count < 1) throw new Error(`Invalid SEA-001 person count: ${count}`);
  return Array.from({ length: count }, (_, index) => `P${index + 1}`);
}

export function sea001DisplayNameMap(
  seed: string,
  personIds: readonly string[],
  context: string,
): Readonly<Record<string, string>> {
  const names = selectSea001Names(seed, personIds.length, context);
  return Object.fromEntries(personIds.map((personId, index) => [personId, names[index] as string]));
}

export function sea001DisplayName(
  personId: string,
  displayNames: Readonly<Record<string, string>>,
): string {
  return displayNames[personId] ?? personId;
}

export function presentSea001Text(
  text: string,
  displayNames: Readonly<Record<string, string>>,
): string {
  let output = text;
  const ids = Object.keys(displayNames).sort((left, right) => right.length - left.length);
  for (const personId of ids) {
    const escaped = personId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    output = output.replace(new RegExp(`\\b${escaped}\\b`, "g"), displayNames[personId] as string);
  }
  return output;
}

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

export function presentSea001Children<T extends {
  readonly questionOrder: number;
  readonly queryContractId: string;
  readonly answerDeterminingFactFingerprint: string;
  readonly answerIndex: number;
  readonly text: string;
  readonly explanation: string;
  readonly options: readonly {
    readonly display: string;
    readonly explanation: string;
    readonly isCorrect: boolean;
  }[];
}>(
  children: readonly T[],
  displayNames: Readonly<Record<string, string>>,
): T[] {
  const presented = children.map((child) => {
    const explanation = presentSea001Text(child.explanation, displayNames);
    return {
      ...child,
      text: presentSea001Text(child.text, displayNames),
      explanation,
      options: child.options.map((option) => ({
        ...option,
        display: presentSea001Text(option.display, displayNames),
        // The correct option must carry the same question-specific reasoning as the
        // child explanation. Wrong options retain their misconception-specific rationale.
        explanation: option.isCorrect
          ? explanation
          : presentSea001Text(option.explanation, displayNames),
      })),
    };
  }) as unknown as T[];

  // CP003/CP004 deliberately use QC009 in their four-question mix and keep
  // the facing-rule detector at Q1. Other checkpoints may vary all children.
  const preserveFirst = presented.some((child) => child.queryContractId === "SEA-QC-009");
  const fixed = preserveFirst ? presented.slice(0, 1) : [];
  const variable = preserveFirst ? presented.slice(1) : presented;
  const varied = [...variable].sort((left, right) => {
    const leftKey = stableNumber(`${left.queryContractId}|${left.answerDeterminingFactFingerprint}`);
    const rightKey = stableNumber(`${right.queryContractId}|${right.answerDeterminingFactFingerprint}`);
    return leftKey - rightKey || left.queryContractId.localeCompare(right.queryContractId);
  });
  const presentationSeed = Object.entries(displayNames)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([personId, name]) => `${personId}:${name}`)
    .join("|");

  return [...fixed, ...varied].map((child, index) => {
    const questionOrder = index + 1;
    if (preserveFirst && index === 0) {
      return {
        ...child,
        questionOrder,
      };
    }

    const random = new DeterministicRandom(
      `${presentationSeed}:visible-options:${child.queryContractId}:${child.answerDeterminingFactFingerprint}:Q${questionOrder}`,
    );
    const options = random.shuffle(child.options);
    const answerIndex = options.findIndex((option) => option.isCorrect);
    if (answerIndex < 0) throw new Error(`SEA-001 child ${child.queryContractId} lost its correct option`);
    return {
      ...child,
      questionOrder,
      options,
      answerIndex,
    };
  }) as T[];
}
