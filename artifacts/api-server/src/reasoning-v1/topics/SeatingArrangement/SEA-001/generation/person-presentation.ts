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

function normalizeStudentLanguage(text: string): string {
  let output = text
    .replace(/\bImmediate to the (left|right)\b/g, "Immediately to the $1")
    .replace(/\b6th to the (left|right)\b/g, "Sixth to the $1")
    .replace(/\b7th to the (left|right)\b/g, "Seventh to the $1")
    .replace(/\b8th to the (left|right)\b/g, "Eighth to the $1");

  // In a binary centre/outward system, most PBA-020 if/otherwise facing links
  // are exactly equivalent to SAME_FACING or OPPOSITE_FACING. Preserve the P1
  // anchor's explicit conditional form so the blueprint still teaches conditional
  // orientation, but render the remaining equivalent links in the shorter wording
  // commonly used in exam-style mixed-facing sets.
  const conditionalPattern = /^If (P\d+) faces (the centre|outward), (P\d+) faces (the centre|outward); otherwise, \3 faces (the centre|outward)\.$/;
  const match = output.match(conditionalPattern);
  if (match && match[1] !== "P1") {
    const conditionPerson = match[1] as string;
    const conditionFacing = match[2] as string;
    const targetPerson = match[3] as string;
    const thenFacing = match[4] as string;
    const elseFacing = match[5] as string;
    if (thenFacing !== elseFacing) {
      output = conditionFacing === thenFacing
        ? `${conditionPerson} and ${targetPerson} face the same direction.`
        : `${conditionPerson} and ${targetPerson} face opposite directions.`;
    }
  }
  return output;
}

export function presentSea001Text(
  text: string,
  displayNames: Readonly<Record<string, string>>,
): string {
  let output = normalizeStudentLanguage(text);
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

function containsWholeWord(text: string, value: string): boolean {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(text);
}

function fallbackExplanation(
  answerType: string,
  correctDisplay: string,
  wrongDisplay: string,
): string {
  if (answerType === "COUNT") {
    return `The required count is ${correctDisplay}; ${wrongDisplay} is not the count obtained from the specified seats or arc.`;
  }
  if (answerType === "PAIR") {
    return `The required pair is ${correctDisplay}; the pair ${wrongDisplay} does not occupy the two positions specified in the question.`;
  }
  if (answerType === "RELATION") {
    return `The solved positions give ${correctDisplay}; ${wrongDisplay} uses a different direction or distance.`;
  }
  if (answerType === "SEQUENCE") {
    return `The required order is ${correctDisplay}; ${wrongDisplay} does not follow the specified direction and order.`;
  }
  if (answerType === "STATEMENT") {
    return `The solved arrangement supports ${correctDisplay}; the statement ${wrongDisplay} does not satisfy the required truth condition.`;
  }
  return `Following the relation asked in the question reaches ${correctDisplay}, not ${wrongDisplay}.`;
}

export function presentSea001Children<T extends {
  readonly questionOrder: number;
  readonly queryContractId: string;
  readonly answerType: string;
  readonly answerDeterminingFactFingerprint: string;
  readonly answerIndex: number;
  readonly text: string;
  readonly explanation: string;
  readonly options: readonly {
    readonly display: string;
    readonly explanation: string;
    readonly isCorrect: boolean;
    readonly recomputation: Readonly<Record<string, unknown>>;
  }[];
}>(
  children: readonly T[],
  displayNames: Readonly<Record<string, string>>,
): T[] {
  const presented = children.map((child) => {
    const text = presentSea001Text(child.text, displayNames);
    const explanation = presentSea001Text(child.explanation, displayNames);
    const displayOptions = child.options.map((option) => ({
      ...option,
      display: presentSea001Text(option.display, displayNames),
      explanation: presentSea001Text(option.explanation, displayNames),
    }));
    const correctOption = displayOptions.find((option) => option.isCorrect);
    if (!correctOption) throw new Error(`SEA-001 child ${child.queryContractId} has no correct option before presentation`);

    const queriedNames = Object.values(displayNames).filter((name) => containsWholeWord(text, name));
    const options = displayOptions.map((option) => {
      if (option.isCorrect) {
        return { ...option, explanation };
      }
      const isFallback = Object.prototype.hasOwnProperty.call(option.recomputation, "fallbackVerifiedValue");
      if (!isFallback) return option;

      if ((child.answerType === "PERSON" || child.answerType === "PAIR")
        && queriedNames.some((name) => containsWholeWord(option.display, name))) {
        throw new Error(
          `SEA-001 ${child.queryContractId} fallback distractor reuses queried participant: ${option.display}`,
        );
      }
      return {
        ...option,
        explanation: fallbackExplanation(child.answerType, correctOption.display, option.display),
      };
    });

    return {
      ...child,
      text,
      explanation,
      options,
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
