export const SER_CP002_TEMPORARY_TEMPLATE_IDS = [
  "SER-CP-002-TMP-001",
  "SER-CP-002-TMP-002",
  "SER-CP-002-TMP-003",
  "SER-CP-002-TMP-004",
  "SER-CP-002-TMP-005",
  "SER-CP-002-TMP-006",
  "SER-CP-002-TMP-007",
  "SER-CP-002-TMP-008",
] as const;

export type SerCp002TemporaryTemplateId =
  (typeof SER_CP002_TEMPORARY_TEMPLATE_IDS)[number];

export type SerCp002RuleId =
  | "UNIFORM_MULTIPLICATIVE_RATIO"
  | "AFFINE_MULTIPLY_THEN_ADD";

export type SerCp002TaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM";

export type SerCp002Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface SerCp002Template {
  readonly temporaryTemplateId: SerCp002TemporaryTemplateId;
  readonly candidateRuleId: SerCp002RuleId;
  readonly taskKind: SerCp002TaskKind;
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
}

const TASKS = [
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
] as const;

export const SER_CP002_TEMPORARY_TEMPLATES: readonly SerCp002Template[] =
  SER_CP002_TEMPORARY_TEMPLATE_IDS.map((temporaryTemplateId, index) => {
    const taskKind = TASKS[index % TASKS.length]!;
    return {
      temporaryTemplateId,
      candidateRuleId:
        index < 4
          ? "UNIFORM_MULTIPLICATIVE_RATIO"
          : "AFFINE_MULTIPLY_THEN_ADD",
      taskKind,
      answerSemantic:
        taskKind === "WRONG_TERM"
          ? "WRONG_DISPLAYED_TERM"
          : "TERM_VALUE",
    };
  });

export interface SerCp002HiddenState {
  readonly start: number;
  readonly multiplier: number;
  readonly addition: number;
  readonly canonicalSequence: readonly number[];
  readonly targetIndex: number;
  readonly corruptedValue: number | null;
  readonly correctReplacement: number;
}

export interface SerCp002Explanation {
  readonly ruleStatement: string;
  readonly working: readonly string[];
  readonly conclusion: string;
  readonly trapAnalyses: readonly string[];
}

export interface SerCp002Question {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-CP-002";
  readonly temporaryTemplateId: SerCp002TemporaryTemplateId;
  readonly permanentQlId: null;
  readonly candidateRuleId: SerCp002RuleId;
  readonly taskKind: SerCp002TaskKind;
  readonly solveMode: "INFER_FIRST_ORDER_INTEGER_RECURRENCE";
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
  readonly language: "en-IN";
  readonly difficulty: SerCp002Difficulty;
  readonly seed: number;
  readonly stem: string;
  readonly sequence: readonly (number | null)[];
  readonly options: readonly number[];
  readonly correctAnswer: number;
  readonly correctIndex: number;
  readonly mathematicalFingerprint: string;
  readonly explanation: SerCp002Explanation;
  readonly hiddenState: SerCp002HiddenState;
  readonly lifecycle: {
    readonly maturity: "OPEN_EXECUTABLE_DISCOVERY";
    readonly sourceSaturation: "OPEN";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export interface SerCp002IndependentSolution {
  readonly answer: number;
  readonly candidateRuleId: SerCp002RuleId;
  readonly inferredStart: number;
  readonly inferredMultiplier: number;
  readonly inferredAddition: number;
  readonly targetIndex: number;
  readonly correctReplacement: number;
  readonly candidateCount: number;
}

interface RecurrenceCandidate {
  readonly start: number;
  readonly multiplier: number;
  readonly addition: number;
  readonly candidateRuleId: SerCp002RuleId;
  readonly mismatches: readonly number[];
}

function createPrng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function integer(next: () => number, minimum: number, maximum: number): number {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

function shuffled<T>(values: readonly T[], next: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = integer(next, 0, index);
    const value = result[index]!;
    result[index] = result[swapIndex]!;
    result[swapIndex] = value;
  }
  return result;
}

function templateFor(
  temporaryTemplateId: SerCp002TemporaryTemplateId,
): SerCp002Template {
  const template = SER_CP002_TEMPORARY_TEMPLATES.find(
    (entry) => entry.temporaryTemplateId === temporaryTemplateId,
  );
  if (!template) {
    throw new Error(
      `Unknown SER-CP-002 temporary template: ${temporaryTemplateId}`,
    );
  }
  return template;
}

function classifyRule(addition: number): SerCp002RuleId {
  return addition === 0
    ? "UNIFORM_MULTIPLICATIVE_RATIO"
    : "AFFINE_MULTIPLY_THEN_ADD";
}

function projectSequence(
  start: number,
  multiplier: number,
  addition: number,
  length: number,
): number[] {
  const sequence = [start];
  while (sequence.length < length) {
    sequence.push(sequence[sequence.length - 1]! * multiplier + addition);
  }
  return sequence;
}

function startFromVisibleValue(
  value: number,
  index: number,
  multiplier: number,
  addition: number,
): number | null {
  let scale = 1;
  let offset = 0;
  for (let step = 0; step < index; step += 1) {
    scale *= multiplier;
    offset = offset * multiplier + addition;
  }
  const numerator = value - offset;
  if (numerator % scale !== 0) return null;
  return numerator / scale;
}

function recurrenceCandidates(
  sequence: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
): RecurrenceCandidate[] {
  const keys = new Set<string>();
  for (let multiplier = 2; multiplier <= 4; multiplier += 1) {
    for (let addition = -12; addition <= 12; addition += 1) {
      for (let index = 0; index < sequence.length; index += 1) {
        const value = sequence[index];
        if (value == null) continue;
        const start = startFromVisibleValue(
          value,
          index,
          multiplier,
          addition,
        );
        if (start != null && Number.isSafeInteger(start)) {
          keys.add(`${start}:${multiplier}:${addition}`);
        }
      }
    }
  }

  const candidates: RecurrenceCandidate[] = [];
  for (const key of keys) {
    const [startText, multiplierText, additionText] = key.split(":");
    const start = Number(startText);
    const multiplier = Number(multiplierText);
    const addition = Number(additionText);
    const projected = projectSequence(
      start,
      multiplier,
      addition,
      sequence.length,
    );
    const mismatches: number[] = [];
    for (let index = 0; index < sequence.length; index += 1) {
      const displayed = sequence[index];
      if (displayed != null && displayed !== projected[index]) {
        mismatches.push(index);
      }
    }
    if (mismatches.length === allowedMismatchCount) {
      candidates.push({
        start,
        multiplier,
        addition,
        candidateRuleId: classifyRule(addition),
        mismatches,
      });
    }
  }
  return candidates;
}

export function solveSerCp002Sequence(
  taskKind: SerCp002TaskKind,
  sequence: readonly (number | null)[],
): SerCp002IndependentSolution {
  if (sequence.length < 5) {
    throw new Error("SER-CP-002 requires at least five displayed positions");
  }
  const missingIndexes = sequence
    .map((value, index) => (value == null ? index : -1))
    .filter((index) => index >= 0);

  if (taskKind === "WRONG_TERM" && missingIndexes.length !== 0) {
    throw new Error("Wrong-term recurrence sequences cannot contain a blank");
  }
  if (taskKind !== "WRONG_TERM" && missingIndexes.length !== 1) {
    throw new Error("Completion recurrence sequences require exactly one blank");
  }

  const candidates = recurrenceCandidates(
    sequence,
    taskKind === "WRONG_TERM" ? 1 : 0,
  );
  if (candidates.length !== 1) {
    throw new Error(
      `SER-CP-002 ambiguity rejection: expected one recurrence, found ${candidates.length}`,
    );
  }

  const candidate = candidates[0]!;
  const targetIndex =
    taskKind === "WRONG_TERM"
      ? candidate.mismatches[0]!
      : missingIndexes[0]!;
  const projected = projectSequence(
    candidate.start,
    candidate.multiplier,
    candidate.addition,
    sequence.length,
  );
  const correctReplacement = projected[targetIndex]!;
  const displayedValue = sequence[targetIndex];
  const answer =
    taskKind === "WRONG_TERM"
      ? displayedValue
      : correctReplacement;
  if (answer == null) {
    throw new Error("SER-CP-002 independent solver did not resolve an answer");
  }

  return {
    answer,
    candidateRuleId: candidate.candidateRuleId,
    inferredStart: candidate.start,
    inferredMultiplier: candidate.multiplier,
    inferredAddition: candidate.addition,
    targetIndex,
    correctReplacement,
    candidateCount: candidates.length,
  };
}

function difficultyFor(
  seed: number,
  templateIndex: number,
): SerCp002Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[
    (seed + templateIndex) % 3
  ]!;
}

function nonZeroAddition(
  next: () => number,
  difficulty: SerCp002Difficulty,
): number {
  const maximum = difficulty === "EASY" ? 6 : difficulty === "MEDIUM" ? 9 : 12;
  const magnitude = integer(next, 1, maximum);
  if (difficulty === "EASY") return magnitude;
  return next() < 0.35 ? -magnitude : magnitude;
}

function generationDomain(
  candidateRuleId: SerCp002RuleId,
  difficulty: SerCp002Difficulty,
  next: () => number,
): {
  start: number;
  multiplier: number;
  addition: number;
  length: number;
} {
  const multiplier =
    difficulty === "EASY"
      ? 2
      : difficulty === "MEDIUM"
        ? integer(next, 2, 3)
        : integer(next, 2, 4);
  const length =
    difficulty === "EASY" ? 5 : difficulty === "MEDIUM" ? 6 : 7;
  const startMaximum =
    difficulty === "EASY"
      ? 60
      : difficulty === "MEDIUM"
        ? 50
        : multiplier === 4
          ? 18
          : 40;
  return {
    start: integer(next, 1, startMaximum),
    multiplier,
    addition:
      candidateRuleId === "UNIFORM_MULTIPLICATIVE_RATIO"
        ? 0
        : nonZeroAddition(next, difficulty),
    length,
  };
}

function formatSequence(sequence: readonly (number | null)[]): string {
  return sequence
    .map((value) => (value == null ? "?" : String(value)))
    .join(", ");
}

function stemFor(
  taskKind: SerCp002TaskKind,
  sequence: readonly (number | null)[],
): string {
  const rendered = formatSequence(sequence);
  if (taskKind === "NEXT_TERM") {
    return `Find the next term in the series: ${rendered}`;
  }
  if (taskKind === "MISSING_TERM") {
    return `Which number replaces the question mark in the series: ${rendered}`;
  }
  if (taskKind === "PREVIOUS_TERM") {
    return `Which number comes before the first shown term in the series: ${rendered}`;
  }
  return `Identify the wrong term in the series: ${rendered}`;
}

function completionDistractors(
  solution: SerCp002IndependentSolution,
  canonicalSequence: readonly number[],
  next: () => number,
): number[] {
  const answer = solution.answer;
  const candidates: number[] = [];
  const targetIndex = solution.targetIndex;
  if (targetIndex > 0) {
    const previous = canonicalSequence[targetIndex - 1]!;
    candidates.push(
      previous * solution.inferredMultiplier,
      previous * Math.max(1, solution.inferredMultiplier - 1)
        + solution.inferredAddition,
      (previous + solution.inferredAddition)
        * solution.inferredMultiplier,
    );
  } else {
    const shownNext = canonicalSequence[1]!;
    candidates.push(
      Math.trunc(shownNext / solution.inferredMultiplier),
      Math.trunc(
        (shownNext + solution.inferredAddition)
          / solution.inferredMultiplier,
      ),
      shownNext - solution.inferredAddition,
    );
  }

  const magnitude = Math.max(
    2,
    solution.inferredMultiplier + Math.abs(solution.inferredAddition),
  );
  for (let offset = 1; candidates.length < 12; offset += 1) {
    candidates.push(
      answer + (offset % 2 === 0 ? -1 : 1) * magnitude * offset,
    );
  }

  return shuffled(
    [...new Set(candidates)].filter(
      (value) =>
        value !== answer
        && Number.isSafeInteger(value)
        && Math.abs(value) <= 100_000,
    ),
    next,
  ).slice(0, 3);
}

function distractorsFor(
  taskKind: SerCp002TaskKind,
  solution: SerCp002IndependentSolution,
  canonicalSequence: readonly number[],
  displayedSequence: readonly (number | null)[],
  next: () => number,
): number[] {
  if (taskKind === "WRONG_TERM") {
    return shuffled(
      displayedSequence.filter(
        (value): value is number =>
          value != null && value !== solution.answer,
      ),
      next,
    ).slice(0, 3);
  }
  return completionDistractors(solution, canonicalSequence, next);
}

function signedOperation(addition: number): string {
  return addition >= 0 ? `add ${addition}` : `subtract ${Math.abs(addition)}`;
}

function explanationFor(
  taskKind: SerCp002TaskKind,
  solution: SerCp002IndependentSolution,
  canonicalSequence: readonly number[],
  displayedSequence: readonly (number | null)[],
  options: readonly number[],
  correctIndex: number,
): SerCp002Explanation {
  const isUniform =
    solution.candidateRuleId === "UNIFORM_MULTIPLICATIVE_RATIO";
  const ruleStatement = isUniform
    ? `Multiply each term by ${solution.inferredMultiplier} to get the next term.`
    : `Multiply each term by ${solution.inferredMultiplier}, then ${signedOperation(solution.inferredAddition)}.`;

  let calculation: string;
  if (solution.targetIndex === 0) {
    calculation = isUniform
      ? `${solution.correctReplacement} × ${solution.inferredMultiplier} = ${canonicalSequence[1]}`
      : `${solution.correctReplacement} × ${solution.inferredMultiplier} ${solution.inferredAddition >= 0 ? "+" : "-"} ${Math.abs(solution.inferredAddition)} = ${canonicalSequence[1]}`;
  } else {
    const previous = canonicalSequence[solution.targetIndex - 1]!;
    calculation = isUniform
      ? `${previous} × ${solution.inferredMultiplier} = ${solution.correctReplacement}`
      : `${previous} × ${solution.inferredMultiplier} ${solution.inferredAddition >= 0 ? "+" : "-"} ${Math.abs(solution.inferredAddition)} = ${solution.correctReplacement}`;
  }

  const conclusion =
    taskKind === "WRONG_TERM"
      ? `${solution.answer} is the wrong term; the rule requires ${solution.correctReplacement} at that position.`
      : `Therefore, the required term is ${solution.answer}.`;
  const trapAnalyses = options.map((option, index) => {
    if (index === correctIndex) {
      return `Option ${option}: preserves the complete recurrence.`;
    }
    if (taskKind === "WRONG_TERM") {
      return `Option ${option}: this displayed term agrees with the recurrence.`;
    }
    return `Option ${option}: comes from skipping, reversing or misordering the multiplication and adjustment.`;
  });

  if (taskKind === "WRONG_TERM") {
    const displayed = displayedSequence[solution.targetIndex];
    return {
      ruleStatement,
      working: [
        "Apply the same recurrence from one correct term to the next.",
        `At position ${solution.targetIndex + 1}, the series shows ${displayed}, but ${calculation}.`,
      ],
      conclusion,
      trapAnalyses,
    };
  }

  return {
    ruleStatement,
    working: [
      "Use the same recurrence at every step.",
      calculation,
    ],
    conclusion,
    trapAnalyses,
  };
}

function buildQuestion(
  template: SerCp002Template,
  seed: number,
  attempt: number,
): SerCp002Question {
  const templateIndex = SER_CP002_TEMPORARY_TEMPLATE_IDS.indexOf(
    template.temporaryTemplateId,
  );
  const mixedSeed =
    (seed * 1_000_033 + (templateIndex + 1) * 130_363 + attempt * 71_743) >>> 0;
  const next = createPrng(mixedSeed || 1);
  const difficulty = difficultyFor(seed, templateIndex);
  const domain = generationDomain(
    template.candidateRuleId,
    difficulty,
    next,
  );
  const canonicalSequence = projectSequence(
    domain.start,
    domain.multiplier,
    domain.addition,
    domain.length,
  );

  if (
    canonicalSequence.some(
      (value) => !Number.isSafeInteger(value) || Math.abs(value) > 100_000,
    )
    || new Set(canonicalSequence).size !== canonicalSequence.length
  ) {
    throw new Error("SER-CP-002 generated an unsafe or degenerate sequence");
  }

  let targetIndex = domain.length - 1;
  if (template.taskKind === "MISSING_TERM") {
    targetIndex = integer(next, 2, domain.length - 3);
  } else if (template.taskKind === "PREVIOUS_TERM") {
    targetIndex = 0;
  } else if (template.taskKind === "WRONG_TERM") {
    targetIndex = integer(next, 1, domain.length - 2);
  }

  const sequence: (number | null)[] = [...canonicalSequence];
  let corruptedValue: number | null = null;
  if (template.taskKind === "WRONG_TERM") {
    const direction = next() < 0.5 ? -1 : 1;
    const corruption =
      direction
      * (domain.multiplier * 5 + Math.abs(domain.addition) + 1);
    corruptedValue = canonicalSequence[targetIndex]! + corruption;
    if (canonicalSequence.includes(corruptedValue)) {
      throw new Error("SER-CP-002 corruption duplicated a valid term");
    }
    sequence[targetIndex] = corruptedValue;
  } else {
    sequence[targetIndex] = null;
  }

  const solution = solveSerCp002Sequence(template.taskKind, sequence);
  if (solution.candidateRuleId !== template.candidateRuleId) {
    throw new Error(
      `SER-CP-002 rule collision: expected ${template.candidateRuleId}, solved ${solution.candidateRuleId}`,
    );
  }

  const distractors = distractorsFor(
    template.taskKind,
    solution,
    canonicalSequence,
    sequence,
    next,
  );
  const uniqueDistractors = [...new Set(distractors)].filter(
    (value) => value !== solution.answer,
  );
  if (uniqueDistractors.length !== 3) {
    throw new Error("SER-CP-002 could not construct three distractors");
  }

  const correctIndex = (seed + templateIndex) % 4;
  const options: number[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(
      index === correctIndex
        ? solution.answer
        : uniqueDistractors[distractorIndex++]!,
    );
  }

  return {
    questionId: `SER-001:${template.temporaryTemplateId}:${seed}`,
    packageId: "SER-001",
    checkpointId: "SER-CP-002",
    temporaryTemplateId: template.temporaryTemplateId,
    permanentQlId: null,
    candidateRuleId: template.candidateRuleId,
    taskKind: template.taskKind,
    solveMode: "INFER_FIRST_ORDER_INTEGER_RECURRENCE",
    answerSemantic: template.answerSemantic,
    language: "en-IN",
    difficulty,
    seed,
    stem: stemFor(template.taskKind, sequence),
    sequence,
    options,
    correctAnswer: solution.answer,
    correctIndex,
    mathematicalFingerprint: [
      template.candidateRuleId,
      template.taskKind,
      domain.start,
      domain.multiplier,
      domain.addition,
      domain.length,
      targetIndex,
      corruptedValue ?? "missing",
    ].join("|"),
    explanation: explanationFor(
      template.taskKind,
      solution,
      canonicalSequence,
      sequence,
      options,
      correctIndex,
    ),
    hiddenState: {
      start: domain.start,
      multiplier: domain.multiplier,
      addition: domain.addition,
      canonicalSequence,
      targetIndex,
      corruptedValue,
      correctReplacement: canonicalSequence[targetIndex]!,
    },
    lifecycle: {
      maturity: "OPEN_EXECUTABLE_DISCOVERY",
      sourceSaturation: "OPEN",
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

export function generateSerCp002Question(
  temporaryTemplateId: SerCp002TemporaryTemplateId,
  seed: number,
): SerCp002Question {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(
      `SER-CP-002 seed must be a positive integer; received ${seed}`,
    );
  }
  const template = templateFor(temporaryTemplateId);
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 64; attempt += 1) {
    try {
      const question = buildQuestion(template, seed, attempt);
      const independent = solveSerCp002Sequence(
        question.taskKind,
        question.sequence,
      );
      if (
        independent.answer !== question.correctAnswer
        || independent.candidateRuleId !== question.candidateRuleId
        || independent.correctReplacement
          !== question.hiddenState.correctReplacement
      ) {
        throw new Error("SER-CP-002 independent solver disagreement");
      }
      return question;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    `SER-CP-002 generation exhausted retries for ${temporaryTemplateId}/${seed}: ${String(lastError)}`,
  );
}

export function renderSerCp002Review(
  question: SerCp002Question,
): string {
  const optionLines = question.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${String.fromCharCode(65 + index)}. ${option}`,
  );
  return [
    `## ${question.temporaryTemplateId} · ${question.candidateRuleId} · seed ${question.seed} · ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...optionLines,
    "",
    `Rule: ${question.explanation.ruleStatement}`,
    ...question.explanation.working.map((line) => `- ${line}`),
    `- ${question.explanation.conclusion}`,
    "",
    "Trap review:",
    ...question.explanation.trapAnalyses.map((line) => `- ${line}`),
  ].join("\n");
}
