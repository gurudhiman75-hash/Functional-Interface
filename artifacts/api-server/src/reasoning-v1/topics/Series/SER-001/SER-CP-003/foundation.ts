export const SER_CP003_TEMPORARY_TEMPLATE_IDS = [
  "SER-CP-003-TMP-001",
  "SER-CP-003-TMP-002",
  "SER-CP-003-TMP-003",
  "SER-CP-003-TMP-004",
  "SER-CP-003-TMP-005",
  "SER-CP-003-TMP-006",
  "SER-CP-003-TMP-007",
  "SER-CP-003-TMP-008",
] as const;

export type SerCp003TemporaryTemplateId =
  (typeof SER_CP003_TEMPORARY_TEMPLATE_IDS)[number];

export type SerCp003RuleId =
  | "CONSTANT_NONZERO_SECOND_DIFFERENCE"
  | "CONSTANT_NONZERO_THIRD_DIFFERENCE";

export type SerCp003TaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM";

export type SerCp003Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface SerCp003Template {
  readonly temporaryTemplateId: SerCp003TemporaryTemplateId;
  readonly candidateRuleId: SerCp003RuleId;
  readonly taskKind: SerCp003TaskKind;
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
}

const TASKS = [
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
] as const;

export const SER_CP003_TEMPORARY_TEMPLATES: readonly SerCp003Template[] =
  SER_CP003_TEMPORARY_TEMPLATE_IDS.map((temporaryTemplateId, index) => {
    const taskKind = TASKS[index % TASKS.length]!;
    return {
      temporaryTemplateId,
      candidateRuleId:
        index < 4
          ? "CONSTANT_NONZERO_SECOND_DIFFERENCE"
          : "CONSTANT_NONZERO_THIRD_DIFFERENCE",
      taskKind,
      answerSemantic:
        taskKind === "WRONG_TERM"
          ? "WRONG_DISPLAYED_TERM"
          : "TERM_VALUE",
    };
  });

export interface SerCp003HiddenState {
  readonly start: number;
  readonly firstDifference: number;
  readonly secondDifference: number;
  readonly thirdDifference: number;
  readonly canonicalSequence: readonly number[];
  readonly targetIndex: number;
  readonly corruptedValue: number | null;
  readonly correctReplacement: number;
}

export interface SerCp003Explanation {
  readonly ruleStatement: string;
  readonly working: readonly string[];
  readonly conclusion: string;
  readonly trapAnalyses: readonly string[];
}

export interface SerCp003Question {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-CP-003";
  readonly temporaryTemplateId: SerCp003TemporaryTemplateId;
  readonly permanentQlId: null;
  readonly candidateRuleId: SerCp003RuleId;
  readonly taskKind: SerCp003TaskKind;
  readonly solveMode: "INFER_FINITE_DIFFERENCE_POLYNOMIAL";
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
  readonly language: "en-IN";
  readonly difficulty: SerCp003Difficulty;
  readonly seed: number;
  readonly stem: string;
  readonly sequence: readonly (number | null)[];
  readonly options: readonly number[];
  readonly correctAnswer: number;
  readonly correctIndex: number;
  readonly mathematicalFingerprint: string;
  readonly explanation: SerCp003Explanation;
  readonly hiddenState: SerCp003HiddenState;
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

export interface SerCp003IndependentSolution {
  readonly answer: number;
  readonly candidateRuleId: SerCp003RuleId;
  readonly inferredStart: number;
  readonly inferredFirstDifference: number;
  readonly inferredSecondDifference: number;
  readonly inferredThirdDifference: number;
  readonly targetIndex: number;
  readonly correctReplacement: number;
  readonly candidateCount: number;
}

interface DifferenceCandidate {
  readonly start: number;
  readonly firstDifference: number;
  readonly secondDifference: number;
  readonly thirdDifference: number;
  readonly candidateRuleId: SerCp003RuleId;
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

function nonZeroInteger(
  next: () => number,
  maximumMagnitude: number,
  positiveOnly: boolean,
): number {
  const magnitude = integer(next, 1, maximumMagnitude);
  return positiveOnly || next() < 0.5 ? magnitude : -magnitude;
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
  temporaryTemplateId: SerCp003TemporaryTemplateId,
): SerCp003Template {
  const template = SER_CP003_TEMPORARY_TEMPLATES.find(
    (entry) => entry.temporaryTemplateId === temporaryTemplateId,
  );
  if (!template) {
    throw new Error("Unknown SER-CP-003 temporary template: " + temporaryTemplateId);
  }
  return template;
}

function choose2(value: number): number {
  return (value * (value - 1)) / 2;
}

function choose3(value: number): number {
  return (value * (value - 1) * (value - 2)) / 6;
}

function projectSequence(
  start: number,
  firstDifference: number,
  secondDifference: number,
  thirdDifference: number,
  length: number,
): number[] {
  const sequence: number[] = [];
  let value = start;
  let first = firstDifference;
  let second = secondDifference;
  for (let index = 0; index < length; index += 1) {
    sequence.push(value);
    value += first;
    first += second;
    second += thirdDifference;
  }
  return sequence;
}

function solveLinearSystem(
  matrix: readonly (readonly number[])[],
  values: readonly number[],
): number[] | null {
  const size = matrix.length;
  const augmented = matrix.map((row, index) => [...row, values[index]!]);
  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row]![column]!) > Math.abs(augmented[pivot]![column]!)) {
        pivot = row;
      }
    }
    if (Math.abs(augmented[pivot]![column]!) < 1e-10) return null;
    const pivotRow = augmented[pivot]!;
    augmented[pivot] = augmented[column]!;
    augmented[column] = pivotRow;
    const divisor = augmented[column]![column]!;
    for (let entry = column; entry <= size; entry += 1) {
      augmented[column]![entry] = augmented[column]![entry]! / divisor;
    }
    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row]![column]!;
      for (let entry = column; entry <= size; entry += 1) {
        augmented[row]![entry] =
          augmented[row]![entry]! - factor * augmented[column]![entry]!;
      }
    }
  }
  return augmented.map((row) => row[size]!);
}

function combinations(values: readonly number[], size: number): number[][] {
  const result: number[][] = [];
  function visit(start: number, selected: number[]): void {
    if (selected.length === size) {
      result.push([...selected]);
      return;
    }
    for (
      let index = start;
      index <= values.length - (size - selected.length);
      index += 1
    ) {
      selected.push(values[index]!);
      visit(index + 1, selected);
      selected.pop();
    }
  }
  visit(0, []);
  return result;
}

function integerCoefficients(values: readonly number[]): number[] | null {
  const rounded = values.map((value) => Math.round(value));
  if (
    values.some((value, index) =>
      !Number.isFinite(value) || Math.abs(value - rounded[index]!) > 1e-7,
    )
  ) {
    return null;
  }
  return rounded;
}

function inferCandidates(
  sequence: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
): DifferenceCandidate[] {
  const visibleIndexes = sequence
    .map((value, index) => (value == null ? -1 : index))
    .filter((index) => index >= 0);
  const parameterKeys = new Set<string>();

  for (const degree of [2, 3] as const) {
    for (const selected of combinations(visibleIndexes, degree + 1)) {
      const matrix = selected.map((index) => {
        const row = [1, index, choose2(index)];
        if (degree === 3) row.push(choose3(index));
        return row;
      });
      const values = selected.map((index) => sequence[index]! as number);
      const solved = solveLinearSystem(matrix, values);
      if (!solved) continue;
      const coefficients = integerCoefficients(solved);
      if (!coefficients) continue;
      const start = coefficients[0]!;
      const firstDifference = coefficients[1]!;
      const secondDifference = coefficients[2]!;
      const thirdDifference = degree === 3 ? coefficients[3]! : 0;
      if (
        secondDifference === 0
        || (degree === 2 && thirdDifference !== 0)
        || (degree === 3 && thirdDifference === 0)
        || [start, firstDifference, secondDifference, thirdDifference].some(
          (value) => !Number.isSafeInteger(value) || Math.abs(value) > 100_000,
        )
      ) {
        continue;
      }
      parameterKeys.add(
        [start, firstDifference, secondDifference, thirdDifference].join(":"),
      );
    }
  }

  const candidates: DifferenceCandidate[] = [];
  for (const key of parameterKeys) {
    const [start, firstDifference, secondDifference, thirdDifference] =
      key.split(":").map(Number) as [number, number, number, number];
    const projected = projectSequence(
      start,
      firstDifference,
      secondDifference,
      thirdDifference,
      sequence.length,
    );
    if (
      projected.some(
        (value) => !Number.isSafeInteger(value) || Math.abs(value) > 100_000,
      )
    ) {
      continue;
    }
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
        firstDifference,
        secondDifference,
        thirdDifference,
        candidateRuleId:
          thirdDifference === 0
            ? "CONSTANT_NONZERO_SECOND_DIFFERENCE"
            : "CONSTANT_NONZERO_THIRD_DIFFERENCE",
        mismatches,
      });
    }
  }
  return candidates;
}

export function solveSerCp003Sequence(
  taskKind: SerCp003TaskKind,
  sequence: readonly (number | null)[],
): SerCp003IndependentSolution {
  if (sequence.length < 7) {
    throw new Error("SER-CP-003 requires at least seven displayed positions");
  }
  const missingIndexes = sequence
    .map((value, index) => (value == null ? index : -1))
    .filter((index) => index >= 0);
  if (taskKind === "WRONG_TERM" && missingIndexes.length !== 0) {
    throw new Error("Wrong-term difference sequences cannot contain a blank");
  }
  if (taskKind !== "WRONG_TERM" && missingIndexes.length !== 1) {
    throw new Error("Completion difference sequences require exactly one blank");
  }

  const candidates = inferCandidates(
    sequence,
    taskKind === "WRONG_TERM" ? 1 : 0,
  );
  if (candidates.length !== 1) {
    throw new Error(
      "SER-CP-003 ambiguity rejection: expected one authority, found "
        + candidates.length,
    );
  }
  const candidate = candidates[0]!;
  const targetIndex =
    taskKind === "WRONG_TERM"
      ? candidate.mismatches[0]!
      : missingIndexes[0]!;
  const projected = projectSequence(
    candidate.start,
    candidate.firstDifference,
    candidate.secondDifference,
    candidate.thirdDifference,
    sequence.length,
  );
  const correctReplacement = projected[targetIndex]!;
  const displayedValue = sequence[targetIndex];
  const answer =
    taskKind === "WRONG_TERM" ? displayedValue : correctReplacement;
  if (answer == null) {
    throw new Error("SER-CP-003 independent solver did not resolve an answer");
  }
  return {
    answer,
    candidateRuleId: candidate.candidateRuleId,
    inferredStart: candidate.start,
    inferredFirstDifference: candidate.firstDifference,
    inferredSecondDifference: candidate.secondDifference,
    inferredThirdDifference: candidate.thirdDifference,
    targetIndex,
    correctReplacement,
    candidateCount: candidates.length,
  };
}

function difficultyFor(seed: number, templateIndex: number): SerCp003Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[
    (seed + templateIndex) % 3
  ]!;
}

function generationDomain(
  candidateRuleId: SerCp003RuleId,
  difficulty: SerCp003Difficulty,
  next: () => number,
): {
  start: number;
  firstDifference: number;
  secondDifference: number;
  thirdDifference: number;
  length: number;
} {
  const easy = difficulty === "EASY";
  const medium = difficulty === "MEDIUM";
  if (candidateRuleId === "CONSTANT_NONZERO_SECOND_DIFFERENCE") {
    return {
      start: easy ? integer(next, 1, 50) : integer(next, -60, 90),
      firstDifference: easy
        ? integer(next, 2, 14)
        : medium
          ? integer(next, -14, 20)
          : integer(next, -24, 28),
      secondDifference: nonZeroInteger(
        next,
        easy ? 4 : medium ? 6 : 9,
        easy,
      ),
      thirdDifference: 0,
      length: easy ? 7 : medium ? 8 : 9,
    };
  }
  return {
    start: easy ? integer(next, 1, 35) : integer(next, -40, 65),
    firstDifference: easy
      ? integer(next, 2, 10)
      : medium
        ? integer(next, -10, 16)
        : integer(next, -18, 22),
    secondDifference: easy
      ? integer(next, 1, 4)
      : integer(next, -7, 8),
    thirdDifference: nonZeroInteger(
      next,
      easy ? 2 : medium ? 3 : 4,
      easy,
    ),
    length: easy ? 8 : medium ? 9 : 10,
  };
}

function formatSequence(sequence: readonly (number | null)[]): string {
  return sequence
    .map((value) => (value == null ? "?" : String(value)))
    .join(", ");
}

function stemFor(
  taskKind: SerCp003TaskKind,
  sequence: readonly (number | null)[],
): string {
  const rendered = formatSequence(sequence);
  if (taskKind === "NEXT_TERM") {
    return "Find the next term in the series: " + rendered;
  }
  if (taskKind === "MISSING_TERM") {
    return "Which number replaces the question mark in the series: " + rendered;
  }
  if (taskKind === "PREVIOUS_TERM") {
    return "Which number comes before the first shown term in the series: " + rendered;
  }
  return "Identify the wrong term in the series: " + rendered;
}

function completionDistractors(
  solution: SerCp003IndependentSolution,
  next: () => number,
): number[] {
  const answer = solution.answer;
  const magnitudes = [
    Math.max(1, Math.abs(solution.inferredFirstDifference)),
    Math.max(2, Math.abs(solution.inferredSecondDifference)),
    Math.max(3, Math.abs(solution.inferredThirdDifference)),
    Math.max(
      4,
      Math.abs(
        solution.inferredSecondDifference
          + solution.inferredThirdDifference,
      ),
    ),
  ];
  const candidates: number[] = [];
  for (const magnitude of magnitudes) {
    candidates.push(answer + magnitude, answer - magnitude);
  }
  for (let offset = 1; candidates.length < 20; offset += 1) {
    candidates.push(answer + (offset % 2 === 0 ? -1 : 1) * (offset + 5));
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
  taskKind: SerCp003TaskKind,
  solution: SerCp003IndependentSolution,
  displayedSequence: readonly (number | null)[],
  next: () => number,
): number[] {
  if (taskKind !== "WRONG_TERM") {
    return completionDistractors(solution, next);
  }
  return shuffled(
    [...new Set(displayedSequence.filter(
      (value): value is number => value != null && value !== solution.answer,
    ))],
    next,
  ).slice(0, 3);
}

function finiteDifferenceLevels(values: readonly number[]): number[][] {
  const levels: number[][] = [[...values]];
  while (levels[levels.length - 1]!.length > 1) {
    const previous = levels[levels.length - 1]!;
    const next: number[] = [];
    for (let index = 1; index < previous.length; index += 1) {
      next.push(previous[index]! - previous[index - 1]!);
    }
    levels.push(next);
  }
  return levels;
}

function shortened(values: readonly number[]): string {
  return values.slice(0, 6).join(", ") + (values.length > 6 ? ", ..." : "");
}

function explanationFor(
  taskKind: SerCp003TaskKind,
  solution: SerCp003IndependentSolution,
  canonicalSequence: readonly number[],
  options: readonly number[],
  correctIndex: number,
): SerCp003Explanation {
  const levels = finiteDifferenceLevels(canonicalSequence);
  const secondOrder =
    solution.candidateRuleId === "CONSTANT_NONZERO_SECOND_DIFFERENCE";
  const ruleStatement = secondOrder
    ? "The first differences change by the same non-zero amount at every step."
    : "The second differences change by the same non-zero amount at every step.";
  const working = [
    "First differences: " + shortened(levels[1]!),
    "Second differences: " + shortened(levels[2]!),
  ];
  if (!secondOrder) {
    working.push("Third differences: " + shortened(levels[3]!));
  }
  const conclusion =
    taskKind === "WRONG_TERM"
      ? String(solution.answer)
        + " is the wrong term; the difference pattern requires "
        + String(solution.correctReplacement)
        + " at that position."
      : "Therefore, the required term is " + String(solution.answer) + ".";
  const trapAnalyses = options.map((option, index) => {
    if (index === correctIndex) {
      return "Option " + option + ": preserves the complete finite-difference pattern.";
    }
    if (taskKind === "WRONG_TERM") {
      return "Option " + option + ": this displayed term agrees with the finite-difference pattern.";
    }
    return "Option " + option + ": results from extending the wrong difference level or changing the increment.";
  });
  return { ruleStatement, working, conclusion, trapAnalyses };
}

function buildQuestion(
  template: SerCp003Template,
  seed: number,
  attempt: number,
): SerCp003Question {
  const templateIndex = SER_CP003_TEMPORARY_TEMPLATE_IDS.indexOf(
    template.temporaryTemplateId,
  );
  const mixedSeed =
    (seed * 1_000_037 + (templateIndex + 1) * 150_371 + attempt * 81_749) >>> 0;
  const next = createPrng(mixedSeed || 1);
  const difficulty = difficultyFor(seed, templateIndex);
  const domain = generationDomain(template.candidateRuleId, difficulty, next);
  const canonicalSequence = projectSequence(
    domain.start,
    domain.firstDifference,
    domain.secondDifference,
    domain.thirdDifference,
    domain.length,
  );
  if (
    canonicalSequence.some(
      (value) => !Number.isSafeInteger(value) || Math.abs(value) > 100_000,
    )
    || new Set(canonicalSequence).size !== canonicalSequence.length
  ) {
    throw new Error("SER-CP-003 generated an unsafe or degenerate sequence");
  }

  let targetIndex = domain.length - 1;
  if (template.taskKind === "MISSING_TERM") {
    targetIndex = integer(next, 3, domain.length - 4);
  } else if (template.taskKind === "PREVIOUS_TERM") {
    targetIndex = 0;
  } else if (template.taskKind === "WRONG_TERM") {
    targetIndex = integer(next, 2, domain.length - 3);
  }

  const sequence: (number | null)[] = [...canonicalSequence];
  let corruptedValue: number | null = null;
  if (template.taskKind === "WRONG_TERM") {
    const direction = next() < 0.5 ? -1 : 1;
    const corruption = direction * (
      Math.abs(domain.secondDifference)
        + Math.abs(domain.thirdDifference) * 3
        + 7
    );
    corruptedValue = canonicalSequence[targetIndex]! + corruption;
    if (
      canonicalSequence.includes(corruptedValue)
      || Math.abs(corruptedValue) > 100_000
    ) {
      throw new Error("SER-CP-003 corruption duplicated or exceeded a valid term");
    }
    sequence[targetIndex] = corruptedValue;
  } else {
    sequence[targetIndex] = null;
  }

  const solution = solveSerCp003Sequence(template.taskKind, sequence);
  if (solution.candidateRuleId !== template.candidateRuleId) {
    throw new Error(
      "SER-CP-003 rule collision: expected "
        + template.candidateRuleId
        + ", solved "
        + solution.candidateRuleId,
    );
  }
  const distractors = distractorsFor(
    template.taskKind,
    solution,
    sequence,
    next,
  );
  const uniqueDistractors = [...new Set(distractors)].filter(
    (value) => value !== solution.answer,
  );
  if (uniqueDistractors.length !== 3) {
    throw new Error("SER-CP-003 could not construct three distractors");
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
    questionId:
      "SER-001:" + template.temporaryTemplateId + ":" + String(seed),
    packageId: "SER-001",
    checkpointId: "SER-CP-003",
    temporaryTemplateId: template.temporaryTemplateId,
    permanentQlId: null,
    candidateRuleId: template.candidateRuleId,
    taskKind: template.taskKind,
    solveMode: "INFER_FINITE_DIFFERENCE_POLYNOMIAL",
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
      domain.firstDifference,
      domain.secondDifference,
      domain.thirdDifference,
      domain.length,
      targetIndex,
      corruptedValue ?? "missing",
    ].join("|"),
    explanation: explanationFor(
      template.taskKind,
      solution,
      canonicalSequence,
      options,
      correctIndex,
    ),
    hiddenState: {
      start: domain.start,
      firstDifference: domain.firstDifference,
      secondDifference: domain.secondDifference,
      thirdDifference: domain.thirdDifference,
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

export function generateSerCp003Question(
  temporaryTemplateId: SerCp003TemporaryTemplateId,
  seed: number,
): SerCp003Question {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(
      "SER-CP-003 seed must be a positive integer; received " + String(seed),
    );
  }
  const template = templateFor(temporaryTemplateId);
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 96; attempt += 1) {
    try {
      const question = buildQuestion(template, seed, attempt);
      const independent = solveSerCp003Sequence(
        question.taskKind,
        question.sequence,
      );
      if (
        independent.answer !== question.correctAnswer
        || independent.candidateRuleId !== question.candidateRuleId
        || independent.correctReplacement
          !== question.hiddenState.correctReplacement
      ) {
        throw new Error("SER-CP-003 independent solver disagreement");
      }
      return question;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    "SER-CP-003 generation exhausted retries for "
      + temporaryTemplateId
      + "/"
      + seed
      + ": "
      + String(lastError),
  );
}

export function renderSerCp003Review(question: SerCp003Question): string {
  const optionLines = question.options.map(
    (option, index) =>
      (index === question.correctIndex ? "✓" : " ")
        + " "
        + String.fromCharCode(65 + index)
        + ". "
        + String(option),
  );
  return [
    "## "
      + question.temporaryTemplateId
      + " · "
      + question.candidateRuleId
      + " · seed "
      + question.seed
      + " · "
      + question.difficulty,
    "",
    question.stem,
    "",
    ...optionLines,
    "",
    "Rule: " + question.explanation.ruleStatement,
    ...question.explanation.working.map((line) => "- " + line),
    "- " + question.explanation.conclusion,
    "",
    "Trap review:",
    ...question.explanation.trapAnalyses.map((line) => "- " + line),
  ].join("\n");
}
