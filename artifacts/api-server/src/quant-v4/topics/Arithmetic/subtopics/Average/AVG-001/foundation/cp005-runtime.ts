import { getAvg001QuestionEntry, renderTemplate } from "./library";
import { add, divide, formatRational, multiply, rational, subtract, toNumber } from "./math";
import { validateAvg001QuestionPackage } from "./validator";
import {
  AVG_001_PACKAGE_ID,
  type Avg001Language,
  type Avg001Parameters,
  type Avg001QuestionPackage,
  type Rational,
} from "./types";

function hash(value: string) {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function prng(seed: string) {
  let state = hash(seed) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pick<T>(items: readonly T[], next: () => number) {
  return items[Math.floor(next() * items.length)]!;
}

function abs(value: Rational) {
  return rational(Math.abs(value.numerator), value.denominator);
}

function unitValue(value: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>) {
  const raw = formatRational(value, entry.displayPolicy);
  switch (entry.unitKind) {
    case "currency": return `₹${raw}`;
    case "kg": return `${raw} kg`;
    case "years": return `${raw} years`;
    case "units": return `${raw} units`;
    case "marks": return `${raw} marks`;
    case "runs": return `${raw} runs`;
    default: return raw;
  }
}

function plain(value: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>) {
  return formatRational(value, entry.displayPolicy);
}

function valueBounds(entry: ReturnType<typeof getAvg001QuestionEntry>) {
  switch (entry.unitKind) {
    case "currency": return { minimum: 10000, maximum: 500000 };
    case "marks": return { minimum: 0, maximum: 100 };
    case "years": return { minimum: 1, maximum: 90 };
    case "kg": return { minimum: 1, maximum: 150 };
    case "runs": return { minimum: 0, maximum: 250 };
    case "units": return { minimum: 1, maximum: 500 };
    default: return { minimum: 1, maximum: 500 };
  }
}

function boundedPair(
  initialIncorrect: Rational,
  correction: Rational,
  entry: ReturnType<typeof getAvg001QuestionEntry>,
) {
  const { minimum, maximum } = valueBounds(entry);
  const correctionNumber = toNumber(correction);
  if (Math.abs(correctionNumber) > maximum - minimum) {
    throw new Error(`Correction exceeds realistic range for ${entry.qlId}`);
  }
  const lower = correctionNumber >= 0 ? minimum : minimum - correctionNumber;
  const upper = correctionNumber >= 0 ? maximum - correctionNumber : maximum;
  const denominator = initialIncorrect.denominator;
  const chosen = Math.min(upper, Math.max(lower, toNumber(initialIncorrect)));
  const incorrect = rational(Math.round(chosen * denominator), denominator);
  const correct = add(incorrect, correction);
  if (
    toNumber(incorrect) < minimum ||
    toNumber(correct) < minimum ||
    toNumber(incorrect) > maximum ||
    toNumber(correct) > maximum
  ) {
    throw new Error(`Unable to create realistic CP-005 values for ${entry.qlId}`);
  }
  return { incorrect, correct };
}

function averageStep(entry: ReturnType<typeof getAvg001QuestionEntry>, next: () => number) {
  if (entry.displayPolicy === "EXACT_DECIMAL_1") {
    return rational(pick([2, 4, 5, 6, 8], next), 10);
  }
  switch (entry.unitKind) {
    case "currency": return rational(pick([1000, 2000, 3000, 4000], next));
    case "marks": return rational(pick([1, 2], next));
    case "years": return rational(1);
    case "kg": return rational(pick([1, 2], next));
    case "runs": return rational(pick([1, 2, 3], next));
    default: return rational(pick([1, 2, 3, 4], next));
  }
}

function buildState(entry: ReturnType<typeof getAvg001QuestionEntry>, seed: string) {
  const next = prng(`${seed}:${entry.qlId}:cp005`);
  const decimal = entry.displayPolicy === "EXACT_DECIMAL_1";
  const currency = entry.unitKind === "currency";
  const counts = decimal
    ? [10, 20, 30, 40, 50]
    : entry.difficulty === "Easy"
      ? [8, 10, 12, 15, 20]
      : entry.difficulty === "Medium"
        ? [16, 20, 24, 25, 30]
        : [25, 30, 36, 40, 50];
  const count = pick(counts, next);
  const scale = currency ? 1000 : 1;
  const bases = entry.unitKind === "years"
    ? [24, 28, 32, 36, 40]
    : entry.unitKind === "kg"
      ? [20, 25, 30, 35, 40, 45]
      : entry.unitKind === "marks" || entry.unitKind === "runs"
        ? [35, 40, 45, 50, 55, 60, 65]
        : [20, 30, 40, 50, 60, 70];
  const correctedAverage = rational(
    pick(bases, next) * scale * (decimal ? 10 : 1) +
      (decimal ? pick([2, 4, 5, 6, 8], next) * scale : 0),
    decimal ? 10 : 1,
  );
  const step = averageStep(entry, next);
  const correctionDirection = next() < 0.5 ? "increase" as const : "decrease" as const;
  const signedAverageChange = correctionDirection === "increase"
    ? step
    : rational(-step.numerator, step.denominator);
  const netCorrection = multiply(signedAverageChange, rational(count));
  const entryDifference = abs(netCorrection);
  const reportedAverage = subtract(correctedAverage, signedAverageChange);
  const offset = rational(currency
    ? pick([10000, 15000, 20000, 25000], next)
    : pick([8, 10, 12, 15, 18], next));

  const singlePair = boundedPair(add(correctedAverage, offset), netCorrection, entry);

  const netNumber = toNumber(netCorrection);
  const firstNumber = netNumber >= 0
    ? Math.max(1, Math.floor(netNumber / 2))
    : Math.min(-1, Math.ceil(netNumber / 2));
  const firstCorrection = rational(firstNumber);
  const secondCorrection = subtract(netCorrection, firstCorrection);
  const firstPair = boundedPair(add(correctedAverage, offset), firstCorrection, entry);
  const secondPair = boundedPair(add(correctedAverage, multiply(offset, rational(2))), secondCorrection, entry);

  return {
    count,
    reportedAverage,
    correctedAverage,
    incorrectValue: singlePair.incorrect,
    correctValue: singlePair.correct,
    entryDifference,
    averageChange: abs(signedAverageChange),
    correctionDirection,
    incorrectValues: [firstPair.incorrect, secondPair.incorrect],
    correctValues: [firstPair.correct, secondPair.correct],
    netCorrection,
  };
}

function exactAnswer(mode: string, state: ReturnType<typeof buildState>) {
  switch (mode) {
    case "findCorrectedAverageFromMistake": return state.correctedAverage;
    case "findReportedAverageBeforeCorrection": return state.reportedAverage;
    case "findCorrectValueFromAverageShift": return state.correctValue;
    case "findIncorrectValueFromCorrection": return state.incorrectValue;
    case "findEntryDifferenceFromAverageCorrection": return state.entryDifference;
    case "findAverageChangeFromEntryCorrection": return state.averageChange;
    case "findNumberOfItemsFromTotalCorrection": return rational(state.count);
    case "findCorrectedAverageFromMultipleMistakes": return state.correctedAverage;
    default: throw new Error(`Unsupported CP-005 solve mode: ${mode}`);
  }
}

function independentlyReconstruct(mode: string, state: ReturnType<typeof buildState>) {
  const count = rational(state.count);
  const averageGap = subtract(state.correctedAverage, state.reportedAverage);
  switch (mode) {
    case "findCorrectedAverageFromMistake": return add(state.reportedAverage, divide(subtract(state.correctValue, state.incorrectValue), count));
    case "findReportedAverageBeforeCorrection": return subtract(state.correctedAverage, divide(subtract(state.correctValue, state.incorrectValue), count));
    case "findCorrectValueFromAverageShift": return add(state.incorrectValue, multiply(averageGap, count));
    case "findIncorrectValueFromCorrection": return subtract(state.correctValue, multiply(averageGap, count));
    case "findEntryDifferenceFromAverageCorrection": return abs(multiply(averageGap, count));
    case "findAverageChangeFromEntryCorrection": return abs(divide(subtract(state.correctValue, state.incorrectValue), count));
    case "findNumberOfItemsFromTotalCorrection": return divide(state.entryDifference, state.averageChange);
    case "findCorrectedAverageFromMultipleMistakes": {
      const net = state.correctValues.reduce(
        (sum, current, index) => add(sum, subtract(current, state.incorrectValues[index]!)),
        rational(0),
      );
      return add(state.reportedAverage, divide(net, count));
    }
    default: throw new Error(`Unsupported CP-005 verification mode: ${mode}`);
  }
}

function formatAnswer(value: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>) {
  return entry.answerType === "COUNT"
    ? formatRational(value, "EXACT_INTEGER")
    : unitValue(value, entry);
}

function optionsFor(answer: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>, seed: string) {
  const numeric = toNumber(answer);
  const step = entry.answerType === "COUNT"
    ? 1
    : entry.unitKind === "currency"
      ? 1000
      : entry.displayPolicy === "EXACT_DECIMAL_1"
        ? 0.1
        : 1;
  const candidates = [numeric, numeric + step, Math.max(step, numeric - step), numeric + step * 2];
  const unique = [...new Set(candidates.map((item) => Number(item.toFixed(entry.displayPolicy === "EXACT_DECIMAL_1" ? 1 : 0))))];
  while (unique.length < 4) unique.push(unique.at(-1)! + step);
  const values = unique.slice(0, 4).map((item) => entry.displayPolicy === "EXACT_DECIMAL_1"
    ? rational(Math.round(item * 10), 10)
    : rational(Math.round(item)));
  const answerText = formatAnswer(answer, entry);
  const wrong = values.filter((item) => formatAnswer(item, entry) !== answerText).slice(0, 3);
  while (wrong.length < 3) wrong.push(rational(answer.numerator + (wrong.length + 2) * answer.denominator, answer.denominator));
  const correctIndex = hash(`${seed}:${entry.qlId}:options`) % 4;
  const rendered = wrong.map((item) => formatAnswer(item, entry));
  rendered.splice(correctIndex, 0, answerText);
  return { options: rendered, correctIndex };
}

function explanation(entry: ReturnType<typeof getAvg001QuestionEntry>, state: ReturnType<typeof buildState>, answer: string) {
  const count = state.count;
  const reported = plain(state.reportedAverage, entry);
  const corrected = plain(state.correctedAverage, entry);
  const wrong = plain(state.incorrectValue, entry);
  const correct = plain(state.correctValue, entry);
  return [
    `${wrong} was entered instead of ${correct}, so correct the total before using the average.`,
    `$$Change in total = ${correct} - ${wrong}$$`,
    `$$Corrected average = ${reported} + [(${correct} - ${wrong}) ÷ ${count}] = ${corrected}$$`,
    `So the required value is ${answer}.`,
  ];
}

export function runAvg001Cp005Pipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: Avg001Language;
}): Avg001QuestionPackage {
  if (input.language !== "en") throw new Error(`AVG-CP-005 supports English only; received ${input.language}`);
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  if (entry.cpId !== "AVG-CP-005") throw new Error(`${entry.qlId} is not a CP-005 question`);
  const state = buildState(entry, input.seed);
  const answerValue = exactAnswer(entry.solveMode, state);
  const verifiedAnswer = independentlyReconstruct(entry.solveMode, state);
  const answer = formatAnswer(answerValue, entry);
  const firstCorrect = entry.solveMode === "findCorrectedAverageFromMultipleMistakes"
    ? state.correctValues[0]!
    : state.correctValue;
  const renderVariables: Record<string, string | number> = {
    count: state.count,
    reportedAverage: plain(state.reportedAverage, entry),
    correctedAverage: plain(state.correctedAverage, entry),
    incorrectValue: plain(entry.solveMode === "findCorrectedAverageFromMultipleMistakes" ? state.incorrectValues[0]! : state.incorrectValue, entry),
    correctValue: plain(firstCorrect, entry),
    entryDifference: plain(state.entryDifference, entry),
    averageChange: plain(state.averageChange, entry),
    incorrectValue2: plain(state.incorrectValues[1]!, entry),
    correctValue2: plain(state.correctValues[1]!, entry),
  };
  const total = multiply(state.correctedAverage, rational(state.count));
  const parameters: Avg001Parameters = {
    packageId: AVG_001_PACKAGE_ID,
    canonicalProblemId: "AVG-CP-005",
    questionLanguageId: entry.qlId,
    seed: input.seed,
    language: input.language,
    difficulty: entry.difficulty,
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    answerType: entry.answerType,
    displayPolicy: entry.displayPolicy,
    contextDomain: entry.contextDomain,
    scenarioVariant: entry.scenarioVariant,
    values: { count: state.count, average: state.correctedAverage, total, ...state },
    renderVariables,
  };
  const stem = renderTemplate(entry.template, renderVariables);
  const { options, correctIndex } = optionsFor(answerValue, entry, input.seed);
  const lines = explanation(entry, state, answer);
  const base: Omit<Avg001QuestionPackage, "validation"> = {
    packageId: AVG_001_PACKAGE_ID,
    archetypeId: AVG_001_PACKAGE_ID,
    canonicalProblemId: "AVG-CP-005",
    questionLanguageId: entry.qlId,
    questionId: `AVG-001:${entry.qlId}:${input.seed}`,
    seed: input.seed,
    language: input.language,
    difficultyBand: entry.difficulty,
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    stem,
    options,
    correctIndex,
    answer,
    parameters,
    solver: {
      exactAnswer: answerValue,
      answer,
      equation: "corrected average = reported average + (correct value - incorrect value) / count",
      workingValues: renderVariables,
    },
    independentVerification: {
      supported: true,
      exactAnswer: verifiedAnswer,
      displayAnswer: formatAnswer(verifiedAnswer, entry),
      method: "independent reverse reconstruction from the correction identity",
    },
    reasoningEvidence: {
      conceptId: "AVG-CP-005:delta-correction",
      givens: renderVariables,
      equations: [
        "correct total = reported total - wrong entry + correct entry",
        "average change = entry correction / count",
      ],
      intermediateValues: {
        entryDifference: plain(state.entryDifference, entry),
        averageChange: plain(state.averageChange, entry),
      },
      decisiveCalculation: `${plain(state.entryDifference, entry)} ÷ ${state.count} = ${plain(state.averageChange, entry)}`,
      verification: `reported total plus net correction equals ${plain(total, entry)}`,
      finalContext: entry.finalContext,
    },
    explanation: { lines },
    maturity: "RUNTIME_PROOF",
    publiclyPublishable: false,
    mathematicalFingerprint: `cp005|${entry.solveMode}|${state.count}|${state.reportedAverage.numerator}/${state.reportedAverage.denominator}|${state.netCorrection.numerator}/${state.netCorrection.denominator}`,
    traceability: {
      packageId: AVG_001_PACKAGE_ID,
      canonicalProblemId: "AVG-CP-005",
      questionLanguageId: entry.qlId,
      solveMode: entry.solveMode,
      explanationStrategyId: entry.explanationStrategyId,
      contextDomain: entry.contextDomain,
    },
  };
  const validation = validateAvg001QuestionPackage(base);
  if (!validation.valid) {
    throw new Error(validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join("\n"));
  }
  return { ...base, validation };
}
