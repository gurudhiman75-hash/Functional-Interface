import {
  SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS,
  SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATES,
  type SerNumericWaveB1Difficulty,
  type SerNumericWaveB1Explanation,
  type SerNumericWaveB1IndependentSolution,
  type SerNumericWaveB1Question,
  type SerNumericWaveB1SourceFamilyId,
  type SerNumericWaveB1TaskKind,
  type SerNumericWaveB1Template,
  type SerNumericWaveB1TemporaryTemplateId,
} from "./inventory";
import {
  createPrng,
  integer,
  isSafeSequence,
  nonZeroInteger,
  projectFiniteDifference,
  projectPreviousThree,
  projectPreviousTwo,
  shuffled,
  solveSerNumericWaveB1Sequence,
} from "./solver";

export * from "./inventory";
export { solveSerNumericWaveB1Sequence } from "./solver";

interface GeneratedCanonical {
  readonly parameterKey: string;
  readonly sequence: readonly number[];
}

function assertPositiveSeed(seed: number): void {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Wave B1 seed must be a positive integer; received ${seed}`);
  }
}

function templateFor(
  temporaryTemplateId: SerNumericWaveB1TemporaryTemplateId,
): SerNumericWaveB1Template {
  const template = SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATES.find(
    (entry) => entry.temporaryTemplateId === temporaryTemplateId,
  );
  if (!template) {
    throw new Error(`Unknown Wave B1 temporary template: ${temporaryTemplateId}`);
  }
  return template;
}

function difficultyFor(
  seed: number,
  templateIndex: number,
): SerNumericWaveB1Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[
    (seed + templateIndex) % 3
  ]!;
}

function generateFiniteDifference(
  order: 4 | 5,
  difficulty: SerNumericWaveB1Difficulty,
  next: () => number,
): GeneratedCanonical {
  const length = order + (difficulty === "EASY" ? 5 : difficulty === "MEDIUM" ? 6 : 7);
  const coefficients = Array.from({ length: order + 1 }, (_, rank) => {
    if (rank === 0) return integer(next, difficulty === "EASY" ? 1 : -30, 45);
    if (rank === order) {
      return difficulty === "EASY"
        ? integer(next, 1, 3)
        : nonZeroInteger(next, -4, 4);
    }
    return difficulty === "EASY"
      ? integer(next, 0, 5)
      : integer(next, -6, 7);
  });
  return {
    parameterKey: `order=${order};coefficients=${coefficients.join(":")}`,
    sequence: projectFiniteDifference(coefficients, length),
  };
}

function generatePreviousTwo(
  sourceFamilyId: SerNumericWaveB1SourceFamilyId,
  difficulty: SerNumericWaveB1Difficulty,
  next: () => number,
): GeneratedCanonical {
  const length = difficulty === "EASY" ? 8 : difficulty === "MEDIUM" ? 9 : 10;
  const start0 = integer(next, difficulty === "EASY" ? 1 : -8, 10);
  const start1 = integer(next, difficulty === "EASY" ? 1 : -8, 10);
  let coefficient1 = 1;
  let coefficient2 = 1;
  let constant = 0;
  switch (sourceFamilyId) {
    case "ADD_PREVIOUS_TWO_REPROBE":
      break;
    case "DIFFERENCE_PREVIOUS_TWO":
      coefficient1 = 1;
      coefficient2 = -1;
      break;
    case "WEIGHTED_PREVIOUS_TWO":
      coefficient1 = integer(next, 1, difficulty === "HARD" ? 3 : 2);
      coefficient2 = nonZeroInteger(next, difficulty === "EASY" ? 1 : -2, 2);
      if (
        (coefficient1 === 1 && coefficient2 === 1)
        || (coefficient1 === 1 && coefficient2 === -1)
      ) {
        coefficient1 = 2;
      }
      break;
    case "AFFINE_PREVIOUS_TWO_PLUS_CONSTANT":
      coefficient1 = integer(next, 1, difficulty === "HARD" ? 3 : 2);
      coefficient2 = nonZeroInteger(next, difficulty === "EASY" ? 1 : -2, 2);
      constant = nonZeroInteger(next, difficulty === "EASY" ? 1 : -6, 6);
      break;
    default:
      throw new Error(`Invalid previous-two source: ${sourceFamilyId}`);
  }
  return {
    parameterKey: `start0=${start0};start1=${start1};a=${coefficient1};b=${coefficient2};c=${constant}`,
    sequence: projectPreviousTwo(
      start0,
      start1,
      coefficient1,
      coefficient2,
      constant,
      length,
    ),
  };
}

function generatePreviousThree(
  sourceFamilyId: SerNumericWaveB1SourceFamilyId,
  difficulty: SerNumericWaveB1Difficulty,
  next: () => number,
): GeneratedCanonical {
  const length = difficulty === "EASY" ? 9 : difficulty === "MEDIUM" ? 10 : 11;
  const start0 = integer(next, difficulty === "EASY" ? 1 : -5, 7);
  const start1 = integer(next, difficulty === "EASY" ? 1 : -5, 7);
  const start2 = integer(next, difficulty === "EASY" ? 1 : -5, 7);
  let coefficient1 = 1;
  let coefficient2 = 1;
  let coefficient3 = 1;
  if (sourceFamilyId === "WEIGHTED_PREVIOUS_THREE") {
    coefficient1 = nonZeroInteger(next, -2, 2);
    coefficient2 = integer(next, -2, 2);
    coefficient3 = nonZeroInteger(next, -2, 2);
    if (coefficient1 === 1 && coefficient2 === 1 && coefficient3 === 1) {
      coefficient1 = 2;
    }
  }
  return {
    parameterKey:
      `start0=${start0};start1=${start1};start2=${start2}`
      + `;a=${coefficient1};b=${coefficient2};c=${coefficient3}`,
    sequence: projectPreviousThree(
      start0,
      start1,
      start2,
      coefficient1,
      coefficient2,
      coefficient3,
      length,
    ),
  };
}

function generateCanonical(
  sourceFamilyId: SerNumericWaveB1SourceFamilyId,
  difficulty: SerNumericWaveB1Difficulty,
  next: () => number,
): GeneratedCanonical {
  switch (sourceFamilyId) {
    case "CONSTANT_NONZERO_FOURTH_DIFFERENCE":
      return generateFiniteDifference(4, difficulty, next);
    case "CONSTANT_NONZERO_FIFTH_DIFFERENCE":
      return generateFiniteDifference(5, difficulty, next);
    case "ADD_PREVIOUS_TWO_REPROBE":
    case "DIFFERENCE_PREVIOUS_TWO":
    case "WEIGHTED_PREVIOUS_TWO":
    case "AFFINE_PREVIOUS_TWO_PLUS_CONSTANT":
      return generatePreviousTwo(sourceFamilyId, difficulty, next);
    case "ADD_PREVIOUS_THREE":
    case "WEIGHTED_PREVIOUS_THREE":
      return generatePreviousThree(sourceFamilyId, difficulty, next);
  }
}

function minimumInteriorIndex(sourceFamilyId: SerNumericWaveB1SourceFamilyId): number {
  if (
    sourceFamilyId === "ADD_PREVIOUS_THREE"
    || sourceFamilyId === "WEIGHTED_PREVIOUS_THREE"
  ) {
    return 4;
  }
  return 3;
}

function targetIndexFor(
  template: SerNumericWaveB1Template,
  length: number,
  next: () => number,
): number {
  if (template.taskKind === "NEXT_TERM") return length - 1;
  if (template.taskKind === "PREVIOUS_TERM") return 0;
  return integer(next, minimumInteriorIndex(template.sourceFamilyId), length - 3);
}

function makeCorruptedValue(
  canonical: readonly number[],
  targetIndex: number,
  next: () => number,
): number {
  const current = canonical[targetIndex]!;
  const left = canonical[Math.max(0, targetIndex - 1)]!;
  const right = canonical[Math.min(canonical.length - 1, targetIndex + 1)]!;
  const scale = Math.max(2, Math.min(100, Math.abs(current - left) + Math.abs(right - current)));
  let corrupted = current;
  for (let attempt = 0; attempt < 24 && canonical.includes(corrupted); attempt += 1) {
    corrupted = current + (next() < 0.5 ? -1 : 1) * (scale + integer(next, 1, 9));
  }
  return corrupted;
}

function stemFor(
  taskKind: SerNumericWaveB1TaskKind,
  sequence: readonly (number | null)[],
): string {
  const rendered = sequence.map((value) => (value == null ? "?" : String(value))).join(", ");
  switch (taskKind) {
    case "NEXT_TERM":
      return `Find the next term in the series: ${rendered}`;
    case "MISSING_TERM":
      return `Which number replaces the question mark in the series: ${rendered}`;
    case "PREVIOUS_TERM":
      return `Which number comes before the first shown term in the series: ${rendered}`;
    case "WRONG_TERM":
      return `Identify the wrong term in the series: ${rendered}`;
  }
}

function completionDistractors(
  solution: SerNumericWaveB1IndependentSolution,
  canonical: readonly number[],
  next: () => number,
): number[] {
  const answer = solution.answer;
  const adjacent = [
    canonical[Math.max(0, solution.targetIndex - 1)]!,
    canonical[Math.min(canonical.length - 1, solution.targetIndex + 1)]!,
  ];
  const scale = Math.max(
    1,
    ...adjacent.map((value) => Math.abs(answer - value)),
  );
  const candidates = [
    answer + scale,
    answer - scale,
    answer + 2 * scale,
    answer - 2 * scale,
    answer + 1,
    answer - 1,
    answer + 3,
    answer - 3,
  ];
  return shuffled(
    [...new Set(candidates)].filter(
      (value) =>
        value !== answer
        && Number.isSafeInteger(value)
        && Math.abs(value) <= 1_000_000,
    ),
    next,
  ).slice(0, 3);
}

function distractorsFor(
  taskKind: SerNumericWaveB1TaskKind,
  solution: SerNumericWaveB1IndependentSolution,
  canonical: readonly number[],
  displayed: readonly (number | null)[],
  next: () => number,
): number[] {
  if (taskKind !== "WRONG_TERM") {
    return completionDistractors(solution, canonical, next);
  }
  const displayedTerms = displayed.filter(
    (value): value is number => value != null && value !== solution.answer,
  );
  return shuffled([...new Set(displayedTerms)], next).slice(0, 3);
}

function finiteDifferenceLevels(values: readonly number[]): number[][] {
  const levels: number[][] = [[...values]];
  while (levels[levels.length - 1]!.length > 1) {
    const previous = levels[levels.length - 1]!;
    levels.push(
      Array.from(
        { length: previous.length - 1 },
        (_, index) => previous[index + 1]! - previous[index]!,
      ),
    );
  }
  return levels;
}

function explanationFor(
  template: SerNumericWaveB1Template,
  solution: SerNumericWaveB1IndependentSolution,
  canonical: readonly number[],
  options: readonly number[],
  correctIndex: number,
): SerNumericWaveB1Explanation {
  const working: string[] = [];
  let ruleStatement: string;
  if (template.canonicalAuthorityId === "CONSTANT_HIGHER_ORDER_FINITE_DIFFERENCE") {
    const levels = finiteDifferenceLevels(canonical);
    const constantOrder = levels.findIndex(
      (level, index) =>
        index >= 4 && level.length > 1 && new Set(level).size === 1,
    );
    ruleStatement =
      `The sequence has a constant non-zero finite difference at order ${constantOrder}.`;
    for (let order = 1; order <= Math.min(constantOrder, 5); order += 1) {
      working.push(
        `Order-${order} differences: ${levels[order]!.slice(0, 6).join(", ")}`,
      );
    }
  } else if (template.sourceFamilyId === "ADD_PREVIOUS_TWO_REPROBE"
    || template.sourceFamilyId === "DIFFERENCE_PREVIOUS_TWO"
    || template.sourceFamilyId === "WEIGHTED_PREVIOUS_TWO"
    || template.sourceFamilyId === "AFFINE_PREVIOUS_TWO_PLUS_CONSTANT") {
    ruleStatement =
      "Each term is an affine combination of the previous two terms; addition, subtraction and weighting are parameter choices within one recurrence authority.";
    working.push(`Recovered recurrence candidate: ${solution.parameterKeys[0] ?? "unique projection"}`);
    working.push("Substituting consecutive term pairs reproduces every uncorrupted position.");
  } else {
    ruleStatement =
      "Each term is a linear combination of the previous three terms; simple three-term addition is one coefficient setting.";
    working.push(`Recovered recurrence candidate: ${solution.parameterKeys[0] ?? "unique projection"}`);
    working.push("Substituting consecutive triples reproduces every uncorrupted position.");
  }
  const conclusion =
    template.taskKind === "WRONG_TERM"
      ? `${solution.answer} is the wrong term; the rule requires ${solution.correctReplacement} at that position.`
      : `Therefore, the required term is ${solution.answer}.`;
  const trapAnalyses = options.map((option, index) => {
    if (index === correctIndex) {
      return `Option ${option}: preserves the complete higher-order or recurrence rule.`;
    }
    return `Option ${option}: fits only a local step or an incomplete recurrence, not the full sequence.`;
  });
  return { ruleStatement, working, conclusion, trapAnalyses };
}

function buildQuestion(
  template: SerNumericWaveB1Template,
  seed: number,
  attempt: number,
): SerNumericWaveB1Question {
  const templateIndex = SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS.indexOf(
    template.temporaryTemplateId,
  );
  const mixedSeed =
    (seed * 1_000_003 + (templateIndex + 1) * 210_379 + attempt * 97_409) >>> 0;
  const next = createPrng(mixedSeed || 1);
  const difficulty = difficultyFor(seed, templateIndex);
  const generated = generateCanonical(template.sourceFamilyId, difficulty, next);
  const canonicalSequence = [...generated.sequence];
  if (
    !isSafeSequence(canonicalSequence)
    || new Set(canonicalSequence).size < Math.min(5, canonicalSequence.length - 1)
  ) {
    throw new Error("Wave B1 generated an unsafe or degenerate canonical sequence");
  }

  const targetIndex = targetIndexFor(template, canonicalSequence.length, next);
  const displayed: (number | null)[] = [...canonicalSequence];
  let corruptedValue: number | null = null;
  if (template.taskKind === "WRONG_TERM") {
    corruptedValue = makeCorruptedValue(canonicalSequence, targetIndex, next);
    if (
      corruptedValue === canonicalSequence[targetIndex]
      || canonicalSequence.includes(corruptedValue)
      || !Number.isSafeInteger(corruptedValue)
      || Math.abs(corruptedValue) > 1_000_000
    ) {
      throw new Error("Wave B1 corruption is invalid");
    }
    displayed[targetIndex] = corruptedValue;
  } else {
    displayed[targetIndex] = null;
  }

  const solution = solveSerNumericWaveB1Sequence(template.taskKind, displayed);
  if (solution.canonicalAuthorityId !== template.canonicalAuthorityId) {
    throw new Error(
      `Wave B1 authority collision: expected ${template.canonicalAuthorityId}, solved ${solution.canonicalAuthorityId}`,
    );
  }
  const distractors = distractorsFor(
    template.taskKind,
    solution,
    canonicalSequence,
    displayed,
    next,
  );
  const uniqueDistractors = [...new Set(distractors)].filter(
    (value) => value !== solution.answer,
  );
  if (uniqueDistractors.length !== 3) {
    throw new Error("Wave B1 could not construct three unique distractors");
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

  const solveMode =
    template.canonicalAuthorityId === "CONSTANT_HIGHER_ORDER_FINITE_DIFFERENCE"
      ? "INFER_HIGHER_ORDER_FINITE_DIFFERENCE"
      : "INFER_STATEFUL_LINEAR_RECURRENCE";
  const explanation = explanationFor(
    template,
    solution,
    canonicalSequence,
    options,
    correctIndex,
  );

  return {
    questionId: `SER-001:${template.temporaryTemplateId}:${seed}`,
    packageId: "SER-001",
    checkpointId: "SER-NUMERIC-WAVE-B1",
    temporaryTemplateId: template.temporaryTemplateId,
    permanentQlId: null,
    sourceFamilyId: template.sourceFamilyId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    ownershipDisposition: template.ownershipDisposition,
    provisionalOwnerCheckpoint: template.provisionalOwnerCheckpoint,
    taskKind: template.taskKind,
    solveMode,
    answerSemantic: template.answerSemantic,
    language: "en-IN",
    difficulty,
    seed,
    stem: stemFor(template.taskKind, displayed),
    sequence: displayed,
    options,
    correctAnswer: solution.answer,
    correctIndex,
    mathematicalFingerprint:
      `${template.canonicalAuthorityId}|${generated.parameterKey}`
      + `|task=${template.taskKind}|target=${targetIndex}`,
    explanation,
    hiddenState: {
      parameterKey: generated.parameterKey,
      canonicalSequence,
      targetIndex,
      corruptedValue,
      correctReplacement: solution.correctReplacement,
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

export function generateSerNumericWaveB1Question(
  temporaryTemplateId: SerNumericWaveB1TemporaryTemplateId,
  seed: number,
): SerNumericWaveB1Question {
  assertPositiveSeed(seed);
  const template = templateFor(temporaryTemplateId);
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 180; attempt += 1) {
    try {
      return buildQuestion(template, seed, attempt);
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    `Wave B1 failed to generate ${temporaryTemplateId} seed ${seed}: ${String(lastError)}`,
  );
}
