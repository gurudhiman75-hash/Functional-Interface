export const SER_CP001_TEMPORARY_TEMPLATE_IDS = [
  "SER-CP-001-TMP-001",
  "SER-CP-001-TMP-002",
  "SER-CP-001-TMP-003",
  "SER-CP-001-TMP-004",
] as const;

export type SerCp001TemporaryTemplateId =
  (typeof SER_CP001_TEMPORARY_TEMPLATE_IDS)[number];

export type SerCp001TaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM";

export type SerDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface SerCp001Template {
  readonly temporaryTemplateId: SerCp001TemporaryTemplateId;
  readonly taskKind: SerCp001TaskKind;
  readonly solveMode: "INFER_UNIFORM_ADDITIVE_STEP";
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
}

export const SER_CP001_TEMPORARY_TEMPLATES: readonly SerCp001Template[] = [
  {
    temporaryTemplateId: "SER-CP-001-TMP-001",
    taskKind: "NEXT_TERM",
    solveMode: "INFER_UNIFORM_ADDITIVE_STEP",
    answerSemantic: "TERM_VALUE",
  },
  {
    temporaryTemplateId: "SER-CP-001-TMP-002",
    taskKind: "MISSING_TERM",
    solveMode: "INFER_UNIFORM_ADDITIVE_STEP",
    answerSemantic: "TERM_VALUE",
  },
  {
    temporaryTemplateId: "SER-CP-001-TMP-003",
    taskKind: "PREVIOUS_TERM",
    solveMode: "INFER_UNIFORM_ADDITIVE_STEP",
    answerSemantic: "TERM_VALUE",
  },
  {
    temporaryTemplateId: "SER-CP-001-TMP-004",
    taskKind: "WRONG_TERM",
    solveMode: "INFER_UNIFORM_ADDITIVE_STEP",
    answerSemantic: "WRONG_DISPLAYED_TERM",
  },
] as const;

export interface SerCp001HiddenState {
  readonly start: number;
  readonly step: number;
  readonly canonicalSequence: readonly number[];
  readonly targetIndex: number;
  readonly corruptedValue: number | null;
  readonly correctReplacement: number;
}

export interface SerCp001Explanation {
  readonly ruleStatement: string;
  readonly working: readonly string[];
  readonly conclusion: string;
  readonly trapAnalyses: readonly string[];
}

export interface SerCp001Question {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-CP-001";
  readonly temporaryTemplateId: SerCp001TemporaryTemplateId;
  readonly permanentQlId: null;
  readonly ruleId: "UNIFORM_ADDITIVE_STEP";
  readonly taskKind: SerCp001TaskKind;
  readonly solveMode: "INFER_UNIFORM_ADDITIVE_STEP";
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
  readonly language: "en-IN";
  readonly difficulty: SerDifficulty;
  readonly seed: number;
  readonly stem: string;
  readonly sequence: readonly (number | null)[];
  readonly options: readonly number[];
  readonly correctAnswer: number;
  readonly correctIndex: number;
  readonly mathematicalFingerprint: string;
  readonly explanation: SerCp001Explanation;
  readonly hiddenState: SerCp001HiddenState;
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

export interface SerCp001IndependentSolution {
  readonly answer: number;
  readonly inferredStart: number;
  readonly inferredStep: number;
  readonly targetIndex: number;
  readonly correctReplacement: number;
  readonly candidateCount: number;
}

interface ArithmeticCandidate {
  readonly start: number;
  readonly step: number;
  readonly mismatches: readonly number[];
}

function assertPositiveSeed(seed: number): void {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`SER-CP-001 seed must be a positive integer; received ${seed}`);
  }
}

function templateFor(id: SerCp001TemporaryTemplateId): SerCp001Template {
  const template = SER_CP001_TEMPORARY_TEMPLATES.find(
    (entry) => entry.temporaryTemplateId === id,
  );
  if (!template) throw new Error(`Unknown SER-CP-001 temporary template: ${id}`);
  return template;
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

function difficultyFor(seed: number, templateIndex: number): SerDifficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[
    (seed + templateIndex) % 3
  ]!;
}

function generationDomain(
  difficulty: SerDifficulty,
  next: () => number,
): { start: number; step: number; length: number } {
  if (difficulty === "EASY") {
    return {
      start: integer(next, 2, 35),
      step: integer(next, 2, 12),
      length: 6,
    };
  }

  if (difficulty === "MEDIUM") {
    const magnitude = integer(next, 3, 18);
    return {
      start: integer(next, -25, 55),
      step: next() < 0.35 ? -magnitude : magnitude,
      length: 7,
    };
  }

  const magnitude = integer(next, 7, 30);
  return {
    start: integer(next, -80, 80),
    step: next() < 0.5 ? -magnitude : magnitude,
    length: 8,
  };
}

function candidateKey(start: number, step: number): string {
  return `${start}:${step}`;
}

function arithmeticCandidates(
  sequence: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
): ArithmeticCandidate[] {
  const candidateKeys = new Set<string>();
  for (let leftIndex = 0; leftIndex < sequence.length; leftIndex += 1) {
    const left = sequence[leftIndex];
    if (left == null) continue;
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < sequence.length;
      rightIndex += 1
    ) {
      const right = sequence[rightIndex];
      if (right == null) continue;
      const indexGap = rightIndex - leftIndex;
      const valueGap = right - left;
      if (valueGap % indexGap !== 0) continue;
      const step = valueGap / indexGap;
      if (step === 0 || Math.abs(step) > 100) continue;
      const start = left - leftIndex * step;
      candidateKeys.add(candidateKey(start, step));
    }
  }

  const candidates: ArithmeticCandidate[] = [];
  for (const key of candidateKeys) {
    const [startText, stepText] = key.split(":");
    const start = Number(startText);
    const step = Number(stepText);
    const mismatches: number[] = [];
    for (let index = 0; index < sequence.length; index += 1) {
      const value = sequence[index];
      if (value != null && value !== start + index * step) {
        mismatches.push(index);
      }
    }
    if (mismatches.length === allowedMismatchCount) {
      candidates.push({ start, step, mismatches });
    }
  }
  return candidates;
}

export function solveSerCp001Sequence(
  taskKind: SerCp001TaskKind,
  sequence: readonly (number | null)[],
): SerCp001IndependentSolution {
  if (sequence.length < 5) {
    throw new Error("SER-CP-001 requires at least five displayed positions");
  }

  const missingIndexes = sequence
    .map((value, index) => (value == null ? index : -1))
    .filter((index) => index >= 0);

  if (taskKind === "WRONG_TERM" && missingIndexes.length !== 0) {
    throw new Error("Wrong-term sequences cannot contain a missing position");
  }
  if (taskKind !== "WRONG_TERM" && missingIndexes.length !== 1) {
    throw new Error("Next, missing and previous tasks require exactly one missing position");
  }

  const candidates = arithmeticCandidates(
    sequence,
    taskKind === "WRONG_TERM" ? 1 : 0,
  );

  if (candidates.length !== 1) {
    throw new Error(
      `SER-CP-001 ambiguity rejection: expected one additive rule, found ${candidates.length}`,
    );
  }

  const candidate = candidates[0]!;
  const targetIndex =
    taskKind === "WRONG_TERM"
      ? candidate.mismatches[0]!
      : missingIndexes[0]!;
  const correctReplacement =
    candidate.start + targetIndex * candidate.step;
  const displayedValue = sequence[targetIndex];
  const answer =
    taskKind === "WRONG_TERM"
      ? displayedValue
      : correctReplacement;

  if (answer == null) {
    throw new Error("SER-CP-001 independent solver could not resolve the answer");
  }

  return {
    answer,
    inferredStart: candidate.start,
    inferredStep: candidate.step,
    targetIndex,
    correctReplacement,
    candidateCount: candidates.length,
  };
}

function formatSequence(sequence: readonly (number | null)[]): string {
  return sequence.map((value) => (value == null ? "?" : String(value))).join(", ");
}

function stemFor(
  taskKind: SerCp001TaskKind,
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

function distractorsFor(
  taskKind: SerCp001TaskKind,
  answer: number,
  step: number,
  sequence: readonly (number | null)[],
  next: () => number,
): number[] {
  if (taskKind === "WRONG_TERM") {
    const visible = shuffled(
      sequence.filter((value): value is number => value != null && value !== answer),
      next,
    );
    return visible.slice(0, 3);
  }
  return shuffled(
    [answer - step, answer + step, answer + 2 * step],
    next,
  );
}

function explanationFor(
  taskKind: SerCp001TaskKind,
  solution: SerCp001IndependentSolution,
  sequence: readonly (number | null)[],
  options: readonly number[],
  correctIndex: number,
): SerCp001Explanation {
  const step = solution.inferredStep;
  const sign = step >= 0 ? `+${step}` : String(step);
  const ruleStatement =
    `Each correct term changes by the same amount: ${sign}.`;
  const working = [
    `Check consecutive correct terms: each difference is ${step}.`,
    `At position ${solution.targetIndex + 1}, the additive rule gives ${solution.correctReplacement}.`,
  ];
  const conclusion =
    taskKind === "WRONG_TERM"
      ? `${solution.answer} is the wrong term; it should be ${solution.correctReplacement}.`
      : `Therefore, the required term is ${solution.answer}.`;
  const trapAnalyses = options.map((option, index) => {
    if (index === correctIndex) return `Option ${option}: follows the uniform additive rule.`;
    if (taskKind === "WRONG_TERM") {
      return `Option ${option}: this displayed term still fits the common difference.`;
    }
    const distance = option - solution.answer;
    return `Option ${option}: differs from the required term by ${distance}; it comes from an off-by-one step or direction error.`;
  });

  if (taskKind === "WRONG_TERM") {
    working[0] =
      `Compare the displayed terms against a constant difference of ${step}.`;
    working[1] =
      `The term at position ${solution.targetIndex + 1} is ${sequence[solution.targetIndex]}, but the rule requires ${solution.correctReplacement}.`;
  }

  return { ruleStatement, working, conclusion, trapAnalyses };
}

function buildQuestion(
  template: SerCp001Template,
  seed: number,
  attempt: number,
): SerCp001Question {
  const templateIndex = SER_CP001_TEMPORARY_TEMPLATE_IDS.indexOf(
    template.temporaryTemplateId,
  );
  const mixedSeed =
    (seed * 1_000_003 + (templateIndex + 1) * 97_409 + attempt * 65_537) >>> 0;
  const next = createPrng(mixedSeed || 1);
  const difficulty = difficultyFor(seed, templateIndex);
  const { start, step, length } = generationDomain(difficulty, next);
  const canonicalSequence = Array.from(
    { length },
    (_, index) => start + index * step,
  );

  let targetIndex = length - 1;
  if (template.taskKind === "MISSING_TERM") {
    targetIndex = integer(next, 2, length - 3);
  } else if (template.taskKind === "PREVIOUS_TERM") {
    targetIndex = 0;
  } else if (template.taskKind === "WRONG_TERM") {
    targetIndex = integer(next, 1, length - 2);
  }

  const sequence: (number | null)[] = [...canonicalSequence];
  let corruptedValue: number | null = null;
  if (template.taskKind === "WRONG_TERM") {
    const direction = next() < 0.5 ? -1 : 1;
    const corruption = direction * (Math.abs(step) * 2 + 1);
    corruptedValue = canonicalSequence[targetIndex]! + corruption;
    sequence[targetIndex] = corruptedValue;
  } else {
    sequence[targetIndex] = null;
  }

  const solution = solveSerCp001Sequence(template.taskKind, sequence);
  const correctAnswer = solution.answer;
  const distractors = distractorsFor(
    template.taskKind,
    correctAnswer,
    step,
    sequence,
    next,
  );
  const uniqueDistractors = [...new Set(distractors)].filter(
    (value) => value !== correctAnswer,
  );
  if (uniqueDistractors.length !== 3) {
    throw new Error("SER-CP-001 could not construct three unique distractors");
  }

  const correctIndex = (seed + templateIndex) % 4;
  const options: number[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) options.push(correctAnswer);
    else options.push(uniqueDistractors[distractorIndex++]!);
  }

  const explanation = explanationFor(
    template.taskKind,
    solution,
    sequence,
    options,
    correctIndex,
  );
  const correctReplacement = canonicalSequence[targetIndex]!;

  return {
    questionId: `SER-001:${template.temporaryTemplateId}:${seed}`,
    packageId: "SER-001",
    checkpointId: "SER-CP-001",
    temporaryTemplateId: template.temporaryTemplateId,
    permanentQlId: null,
    ruleId: "UNIFORM_ADDITIVE_STEP",
    taskKind: template.taskKind,
    solveMode: template.solveMode,
    answerSemantic: template.answerSemantic,
    language: "en-IN",
    difficulty,
    seed,
    stem: stemFor(template.taskKind, sequence),
    sequence,
    options,
    correctAnswer,
    correctIndex,
    mathematicalFingerprint: [
      template.taskKind,
      start,
      step,
      length,
      targetIndex,
      corruptedValue ?? "missing",
    ].join("|"),
    explanation,
    hiddenState: {
      start,
      step,
      canonicalSequence,
      targetIndex,
      corruptedValue,
      correctReplacement,
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

export function generateSerCp001Question(
  temporaryTemplateId: SerCp001TemporaryTemplateId,
  seed: number,
): SerCp001Question {
  assertPositiveSeed(seed);
  const template = templateFor(temporaryTemplateId);
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    try {
      const question = buildQuestion(template, seed, attempt);
      const independent = solveSerCp001Sequence(
        question.taskKind,
        question.sequence,
      );
      if (
        independent.answer !== question.correctAnswer
        || independent.correctReplacement !== question.hiddenState.correctReplacement
      ) {
        throw new Error("independent solver disagreement");
      }
      return question;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    `SER-CP-001 generation exhausted retries for ${temporaryTemplateId}/${seed}: ${String(lastError)}`,
  );
}

export function renderSerCp001Review(question: SerCp001Question): string {
  const optionLines = question.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${String.fromCharCode(65 + index)}. ${option}`,
  );
  return [
    `## ${question.temporaryTemplateId} · seed ${question.seed} · ${question.difficulty}`,
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
