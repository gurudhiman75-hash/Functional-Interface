const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface SerCp007RotationQuestionLike {
  readonly temporaryTemplateId: string;
  readonly seed: number;
  readonly sourceRuleId: string;
  readonly canonicalAuthorityId: string;
  readonly taskKind: string;
  readonly correctIndex: number;
  readonly correctAnswer: string;
  readonly options: readonly string[];
  readonly stem: string;
  readonly sequence?: readonly (string | null)[];
  readonly mathematicalFingerprint?: string;
  readonly explanation: {
    readonly rule: string;
    readonly steps: readonly string[];
    readonly quickMethod: string;
    readonly commonMistake: string;
    readonly trapCode: string;
    readonly conclusion: string;
  };
  readonly hiddenState?: {
    readonly parameterKey?: string;
    readonly canonicalTerms?: readonly string[];
    readonly answerIndex?: number | null;
    readonly answerIndexes?: readonly number[];
    readonly corruptedIndex?: number | null;
    readonly displayedWrongTerm?: string | null;
    readonly rotationAmount?: number;
    readonly [key: string]: unknown;
  };
  readonly [key: string]: unknown;
}

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function letterAt(position: number): string {
  return ALPHABET[mod(position, 26)]!;
}

function rotateLeft(token: string, amount: number): string {
  const safe = mod(amount, token.length);
  return token.slice(safe) + token.slice(0, safe);
}

function mutateToken(token: string, salt: number): string {
  const characters = [...token];
  const index = mod(salt, characters.length);
  const rank = ALPHABET.indexOf(characters[index]!.toUpperCase());
  characters[index] = letterAt(rank + 1 + mod(salt, 3));
  return characters.join("");
}

function templateNumber(templateId: string): number {
  const match = templateId.match(/(\d+)$/);
  return match ? Number(match[1]) : templateId.length;
}

function buildSevenStateCycle(
  templateId: string,
  seed: number,
): { readonly base: string; readonly rotation: number; readonly terms: readonly string[] } {
  const number = templateNumber(templateId);
  const gaps = [1, 3, 5, 7, 9, 11] as const;
  const gap = gaps[mod(seed + number, gaps.length)]!;
  const start = mod(seed * 11 + number * 7, 26);
  const base = Array.from({ length: 7 }, (_, index) =>
    letterAt(start + index * gap),
  ).join("");
  const rotation = 1 + mod(seed * 3 + number, 6);
  const terms = Array.from({ length: 7 }, (_, index) =>
    rotateLeft(base, index * rotation),
  );
  if (new Set(terms).size !== 7) {
    throw new Error(`Expected seven distinct rotation states for ${templateId}:${seed}.`);
  }
  return { base, rotation, terms };
}

function stemFor(
  taskKind: string,
  sequence: readonly (string | null)[],
): string {
  const rendered = sequence.map((term) => term ?? "?").join(", ");
  switch (taskKind) {
    case "NEXT_TERM":
      return `Which letter group should come next?\n${rendered}, ?`;
    case "MISSING_TERM":
      return `Which letter group should replace the question mark?\n${rendered}`;
    case "PREVIOUS_TERM":
      return `Which letter group should come immediately before the first given term?\n?, ${rendered}`;
    case "WRONG_TERM":
      return `Which letter group should replace the incorrect term?\n${rendered}`;
    case "NEXT_TWO_TERMS":
      return `Which two letter groups should come next?\n${rendered}, ?, ?`;
    default:
      return `Complete the series.\n${rendered}`;
  }
}

function singleOptions(
  correctAnswer: string,
  correctIndex: number,
  salt: number,
): readonly string[] {
  const pool = [
    rotateLeft(correctAnswer, 1),
    rotateLeft(correctAnswer, -1),
    [...correctAnswer].reverse().join(""),
    mutateToken(correctAnswer, salt),
    mutateToken(correctAnswer, salt + 7),
  ];
  const distractors = [...new Set(pool)].filter(
    (candidate) => candidate && candidate !== correctAnswer,
  );
  let cursor = salt + 19;
  while (distractors.length < 3) {
    const candidate = mutateToken(correctAnswer, cursor);
    cursor += 1;
    if (candidate !== correctAnswer && !distractors.includes(candidate)) {
      distractors.push(candidate);
    }
  }
  const options = distractors.slice(0, 3);
  options.splice(correctIndex, 0, correctAnswer);
  return options;
}

function pairOptions(
  first: string,
  second: string,
  correctIndex: number,
  salt: number,
): readonly string[] {
  const correctAnswer = `${first}, ${second}`;
  const pool = [
    `${second}, ${first}`,
    `${first}, ${rotateLeft(second, 1)}`,
    `${rotateLeft(first, -1)}, ${second}`,
    `${mutateToken(first, salt)}, ${second}`,
    `${first}, ${mutateToken(second, salt + 5)}`,
  ];
  const distractors = [...new Set(pool)].filter(
    (candidate) => candidate !== correctAnswer,
  );
  const options = distractors.slice(0, 3);
  options.splice(correctIndex, 0, correctAnswer);
  return options;
}

function positionOrder(width: number, rotation: number): string {
  return [
    ...Array.from({ length: width - rotation }, (_, index) => index + rotation + 1),
    ...Array.from({ length: rotation }, (_, index) => index + 1),
  ].join(", ");
}

function transitionStep(from: string, to: string, rotation: number): string {
  return `${from} → ${to}: move the first ${rotation} ${rotation === 1 ? "letter" : "letters"} to the end. The new position order is ${positionOrder(from.length, rotation)}.`;
}

export function remediateSerCp007RotationQuestionV6<
  T extends SerCp007RotationQuestionLike,
>(question: T): T {
  const isRotation =
    question.sourceRuleId === "CYCLIC_CLUSTER_ROTATION" ||
    question.sourceRuleId === "NEXT_TWO_ROTATION";
  if (!isRotation) return question;

  const { base, rotation, terms } = buildSevenStateCycle(
    question.temporaryTemplateId,
    question.seed,
  );
  const salt = question.seed + templateNumber(question.temporaryTemplateId) * 17;
  let sequence: readonly (string | null)[];
  let answerIndexes: readonly number[];
  let corruptedIndex: number | null = null;
  let displayedWrongTerm: string | null = null;

  switch (question.taskKind) {
    case "NEXT_TERM":
      sequence = terms.slice(0, 6);
      answerIndexes = [6];
      break;
    case "MISSING_TERM": {
      const answerIndex = 2 + mod(salt, 2);
      sequence = terms.slice(0, 6).map((term, index) =>
        index === answerIndex ? null : term,
      );
      answerIndexes = [answerIndex];
      break;
    }
    case "PREVIOUS_TERM":
      sequence = terms.slice(1);
      answerIndexes = [0];
      break;
    case "WRONG_TERM": {
      corruptedIndex = 2 + mod(salt, 2);
      const displayed = [...terms.slice(0, 6)];
      displayedWrongTerm = mutateToken(displayed[corruptedIndex]!, salt);
      while (displayed.includes(displayedWrongTerm)) {
        displayedWrongTerm = mutateToken(displayedWrongTerm, salt + 11);
      }
      displayed[corruptedIndex] = displayedWrongTerm;
      sequence = displayed;
      answerIndexes = [corruptedIndex];
      break;
    }
    case "NEXT_TWO_TERMS":
      sequence = terms.slice(0, 5);
      answerIndexes = [5, 6];
      break;
    default:
      return question;
  }

  const answerTerms = answerIndexes.map((index) => terms[index]!);
  const correctAnswer = answerTerms.join(", ");
  const options =
    answerTerms.length === 2
      ? pairOptions(
          answerTerms[0]!,
          answerTerms[1]!,
          question.correctIndex,
          salt,
        )
      : singleOptions(correctAnswer, question.correctIndex, salt);

  const decisiveSteps: string[] = [];
  for (const answerIndex of answerIndexes) {
    if (answerIndex > 0) {
      decisiveSteps.push(
        transitionStep(terms[answerIndex - 1]!, terms[answerIndex]!, rotation),
      );
    } else {
      decisiveSteps.push(
        `${terms[0]} must precede ${terms[1]} because moving its first ${rotation} ${rotation === 1 ? "letter" : "letters"} to the end gives ${terms[1]}.`,
      );
    }
  }
  const conclusion =
    question.taskKind === "WRONG_TERM"
      ? `${displayedWrongTerm} breaks the rotation. It should be ${correctAnswer}.`
      : answerTerms.length === 2
        ? `Therefore, the next two groups are ${correctAnswer}.`
        : `Therefore, the required group is ${correctAnswer}.`;

  return {
    ...question,
    difficulty: "EASY",
    stem: stemFor(question.taskKind, sequence),
    sequence,
    options,
    correctAnswer,
    mathematicalFingerprint: [
      question.canonicalAuthorityId,
      "CYCLE_SAFE_ROTATION_V6",
      base,
      rotation,
      question.taskKind,
      answerIndexes.join("."),
      corruptedIndex ?? "clean",
    ].join("|"),
    explanation: {
      rule: `Keep the same seven letters and move the first ${rotation} ${rotation === 1 ? "letter" : "letters"} to the end each time. The series stops before any state repeats.`,
      steps: decisiveSteps,
      quickMethod: `Track positions, not alphabet jumps. Use the fixed order ${positionOrder(7, rotation)} each time.`,
      commonMistake: `Do not treat rearranged letters as alphabet shifts, and do not copy a repeated term from a completed cycle.`,
      trapCode: "VISIBLE_ROTATION_CYCLE_REMOVED_V6",
      conclusion,
    },
    hiddenState: {
      ...(question.hiddenState ?? {}),
      parameterKey: `${base}|rotation:${rotation}|cycle-length:7|v6`,
      canonicalTerms: terms,
      answerIndex: answerIndexes.length === 1 ? answerIndexes[0]! : null,
      answerIndexes,
      corruptedIndex,
      displayedWrongTerm,
      rotationAmount: rotation,
    },
  } as T;
}
