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

/**
 * Final student-language pass for SEA-001. Keep the maths exact, but phrase the
 * explanation like a teacher speaking to a learner rather than an engine log.
 */
export function normalizeSea001StudentLanguage(text: string): string {
  let output = text
    .replace(/\bImmediate to the (left|right)\b/g, "Immediately to the $1")
    .replace(/\brelation is immediate to the (left|right)\b/gi, "position is immediately to the $1")
    .replace(/\b6th to the (left|right)\b/g, "Sixth to the $1")
    .replace(/\b7th to the (left|right)\b/g, "Seventh to the $1")
    .replace(/\b8th to the (left|right)\b/g, "Eighth to the $1")
    .replace(
      /^Starting from (.+?) and moving two seats (clockwise|anticlockwise) reaches (.+?)\. This question uses the physical circular direction directly, independent of facing\.$/i,
      "Start from $1 and count two seats $2. You reach $3. The question already says $2, so facing does not matter here.",
    )
    .replace(
      /^The clockwise distance is (\d+) seats, so \1 − 1 = (\d+); therefore, \2 (?:person lies|persons lie|person sits|persons sit) strictly between them\.$/i,
      "Counting clockwise, the second person is $1 seats ahead. Count only the people in between, so the answer is $2.",
    )
    .replace(
      /^The clockwise distance is (\d+) seats, so \1 − 1 = (\d+) (?:person sits|persons sit) strictly between them\.$/i,
      "Counting clockwise, the second person is $1 seats ahead. Count only the people in between, so the answer is $2.",
    )
    .replace(
      /^In a circle of (\d+) persons, the opposite seat is (\d+) positions away\. That seat is occupied by (.+?)\.$/i,
      "With $1 people in the circle, the opposite seat is halfway around: $2 seats away. $3 sits there.",
    )
    .replace(
      /^With (\d+) seats, the opposite position is (\d+) seats away\. (.+?) occupies it\.$/i,
      "With $1 seats, the opposite seat is halfway around: $2 seats away. $3 sits there.",
    )
    .replace(
      /^(.+?) faces (north|south)\. From (.+?)'s point of view, (.+?) is (.+?), so the (?:relation|position) is (.+?)\.$/i,
      "$1 faces $2. Look from $3's side: $4 is $5. So $4 is $6 of $3.",
    )
    .replace(
      /^(.+?) is a plausible nearby occupant, but not the person at the queried seat\.$/i,
      "$1 sits nearby, but not in the seat asked about.",
    )
    .replace(/Facing does not change physical adjacency\.?/gi, "For neighbours, facing does not matter.")
    .replace(/Facing does not change adjacency\.?/gi, "For neighbours, facing does not matter.")
    .replace(/\bphysical adjacency\b/gi, "who sits next to whom")
    .replace(/\bstrictly between\b/gi, "between")
    .replace(/\bThis counts the other arc\./gi, "This counts in the other direction around the circle.")
    .replace(/\bThis follows the reverse arc\./gi, "This goes the wrong way around the circle.")
    .replace(/\bThis follows the reverse direction\./gi, "This goes the wrong way.")
    .replace(/\bThis includes one endpoint\./gi, "This wrongly counts one of the named people.")
    .replace(/\bThis includes both endpoints\./gi, "This wrongly counts both named people.")
    .replace(/\bThis includes one endpoint in the count\./gi, "This wrongly counts one of the named people.")
    .replace(/\bThis incorrectly includes the reference person\./gi, "This wrongly counts the person named in the question.")
    .replace(/\bThe reference person cannot be their own neighbour\./gi, "A person cannot be their own neighbour.")
    .replace(/\bThis reverses the centre-facing left\/right rule\./gi, "Everyone faces the centre, so left is clockwise and right is anticlockwise. This option uses the opposite side.")
    .replace(/\bThis applies the centre-facing rule\. For outward-facing persons, left is anticlockwise\./gi, "Everyone faces outward, so left is anticlockwise. This option uses the wrong side.")
    .replace(/\bFor outward-facing persons\b/gi, "For people facing outward")
    .replace(/\bthe reference person's facing\b/gi, "that person's facing")
    .replace(/\bthe reference person's left and right\b/gi, "that person's left and right")
    .replace(/\bthe reference person\b/gi, "the person named in the question")
    .replace(/\bthe reference\b/gi, "that person")
    .replace(/\bendpoint(?:s)?\b/gi, "named person")
    .replace(/\bphysical circular direction directly, independent of facing\b/gi, "direction written in the question")
    .replace(/\boccupy the two seats directly beside\b/gi, "sit in the two seats next to")
    .replace(/\boccupies the two seats directly beside\b/gi, "sits in one of the two seats next to")
    .replace(/\boccupy consecutive seats in the solved row\. Therefore that statement is true\./gi, "sit next to each other in the final row, so that statement is true.")
    .replace(/\boccupy consecutive seats, so this pair shares the common adjacency relation rather than being the odd pair\./gi, "sit next to each other, so this pair follows the same 'sitting next to' pattern and is not the odd pair.")
    .replace(/\boccupies seat (\d+) when the solved row is counted from the left end, so the position is ([^.]+)\./gi, "sits in seat $1 when we count from the left end, so the answer is $2.")
    .replace(/\bReading the solved row from the left end\b/gi, "Reading the final row from the left end")
    .replace(/\bThis chooses the occupant at the mirrored right-end seat\./gi, "This chooses the person at the opposite end of the row.")
    .replace(/\bThis skips the person immediately beside that person on one side\./gi, "This skips the person sitting immediately next to them on one side.")
    .replace(/\bThis statement is true because these two persons occupy the final two consecutive seats; it therefore cannot answer a false-statement query\./gi, "These two people really do sit next to each other, so this statement is true. The question asks for the false statement.")
    .replace(/\bThis statement is true because the two persons occupy consecutive seats; selecting it reverses the question's false-statement polarity\./gi, "These two people really do sit next to each other, so this statement is true. The question asks for the false statement.")
    .replace(/\bThis shifts the solved seat position by one or more places\./gi, "This gives the wrong seat number.")
    .replace(/\bThis treats a two-seat relation as an immediate relation\./gi, "This counts only one seat instead of two.")
    .replace(/\bThis moves one seat farther than the actual relation\./gi, "This counts one seat too far.")
    .replace(
      /^Count only the seats between (.+?) and (.+?); named person are excluded\. The result is (\d+)\.$/i,
      "Count only the people sitting between $1 and $2. Do not count $1 or $2. The answer is $3.",
    )
    .replace(
      /^Count only the seats between (.+?) and (.+?); endpoints are excluded\. The result is (\d+)\.$/i,
      "Count only the people sitting between $1 and $2. Do not count $1 or $2. The answer is $3.",
    )
    .replace(/\bApplying that person's (left|right)-direction rule and moving (\w+) seats reaches\b/gi, "Because of the way that person faces, count $2 seats to the $1. This reaches")
    .replace(/\bFrom that person's perspective\b/gi, "Looking from that person's side")
    .replace(/\bpositions away\b/gi, "seats away");

  // In a binary centre/outward system, most PBA-020 if/otherwise facing links
  // are exactly equivalent to SAME_FACING or OPPOSITE_FACING. Preserve the P1
  // anchor's explicit conditional form so the blueprint still teaches conditional
  // orientation, but render the remaining equivalent links in shorter exam wording.
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
  let output = normalizeSea001StudentLanguage(text);
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
    return `The answer is ${correctDisplay}. Counting the seats asked for does not give ${wrongDisplay}.`;
  }
  if (answerType === "PAIR") {
    return `The correct pair is ${correctDisplay}. ${wrongDisplay} are not the two people asked for.`;
  }
  if (answerType === "RELATION") {
    return `The correct position is ${correctDisplay}. ${wrongDisplay} counts in the wrong direction or by the wrong number of seats.`;
  }
  if (answerType === "SEQUENCE") {
    return `The correct order is ${correctDisplay}. ${wrongDisplay} does not follow the order asked in the question.`;
  }
  if (answerType === "STATEMENT") {
    return `${correctDisplay} is true in the final arrangement. ${wrongDisplay} is not.`;
  }
  return `Counting as the question asks reaches ${correctDisplay}, not ${wrongDisplay}.`;
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
    const shuffled = random.shuffle(child.options);
    const shuffledAnswerIndex = shuffled.findIndex((option) => option.isCorrect);
    if (shuffledAnswerIndex < 0) throw new Error(`SEA-001 child ${child.queryContractId} lost its correct option`);
    const correctOption = shuffled[shuffledAnswerIndex]!;
    const options = shuffled.filter((option) => !option.isCorrect);
    const semanticOffset = stableNumber(
      `${child.queryContractId}|${child.answerDeterminingFactFingerprint}|Q${questionOrder}|answer-offset-v1`,
    ) % 4;
    const answerIndex = ((shuffledAnswerIndex + semanticOffset) % 4) as 0 | 1 | 2 | 3;
    options.splice(answerIndex, 0, correctOption);
    return {
      ...child,
      questionOrder,
      options,
      answerIndex,
    };
  }) as T[];
}
