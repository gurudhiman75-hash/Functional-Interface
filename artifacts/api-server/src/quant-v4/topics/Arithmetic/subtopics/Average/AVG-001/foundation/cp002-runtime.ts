import ranges from "../variable-ranges.cp002.library.json";
import { getAvg001QuestionEntry, renderTemplate } from "./library";
import {
  add,
  divide,
  equals,
  formatRational,
  isInteger,
  multiply,
  rational,
  subtract,
  toNumber,
} from "./math";
import {
  AVG_001_PACKAGE_ID,
  type Avg001DisplayPolicy,
  type Avg001Language,
  type Avg001Parameters,
  type Avg001QuestionPackage,
  type Avg001ReasoningEvidence,
  type Avg001SolverResult,
  type Avg001ValidationCheck,
  type Rational,
} from "./types";

type CountParity = "odd" | "even" | "any";
type TermParity = "odd" | "even" | "any";
type Cp002Profile = {
  countParity: CountParity;
  differences: number[];
  termParity: TermParity;
  targetExtreme?: "smallest" | "largest";
  startPool: "positive" | "negative";
};

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
  if (!items.length) throw new Error("Cannot pick from an empty CP-002 range");
  return items[Math.floor(next() * items.length)]!;
}

function profileFor(variant: string): Cp002Profile {
  const profile = (ranges as any).variantProfiles?.[variant] as
    | Cp002Profile
    | undefined;
  if (!profile) throw new Error(`Missing CP-002 profile for ${variant}`);
  return profile;
}

function adjustParity(value: number, parity: TermParity) {
  if (parity === "any") return value;
  const isEven = value % 2 === 0;
  if (parity === "even") return isEven ? value : value + 1;
  return isEven ? value + 1 : value;
}

function natural(value: Rational) {
  if (value.denominator === 1) return String(value.numerator);
  const numeric = toNumber(value);
  if (Number.isInteger(numeric * 10)) return numeric.toFixed(1);
  return `${value.numerator}/${value.denominator}`;
}

function formatAnswer(value: Rational, policy: Avg001DisplayPolicy) {
  return formatRational(value, policy);
}

function buildTerms(first: Rational, difference: Rational, count: number) {
  const terms: Rational[] = [];
  for (let index = 0; index < count; index += 1) {
    terms.push(add(first, multiply(difference, rational(index))));
  }
  return terms;
}

function generateCp002Parameters(input: {
  questionLanguageId: string;
  seed: string;
  language: Avg001Language;
}): Avg001Parameters {
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  if (entry.cpId !== "AVG-CP-002") {
    throw new Error(`CP-002 runtime received ${entry.cpId}`);
  }
  if (input.language !== "en") {
    throw new Error(
      `AVG-001 runtime proof supports English only; received ${input.language}`,
    );
  }

  const next = prng(`${input.seed}:${entry.qlId}:cp002`);
  const profile = profileFor(entry.scenarioVariant);
  const countPools = (ranges as any).countPools[entry.difficulty] as Record<
    CountParity,
    number[]
  >;
  const count = pick(countPools[profile.countParity], next);
  const difference = rational(pick(profile.differences, next));

  let firstTerm: Rational;
  let lastTerm: Rational;
  let average: Rational;

  if (entry.scenarioVariant === "negativeToPositiveConsecutiveOddCount") {
    const middle = rational(pick([-3, -2, -1, 0, 1, 2, 3], next));
    const halfSpan = multiply(
      rational((count - 1) / 2),
      difference,
    );
    firstTerm = subtract(middle, halfSpan);
    lastTerm = add(middle, halfSpan);
    average = middle;
  } else if (entry.solveMode === "findMiddleTermFromAverage") {
    const middlePool = (ranges as any).middlePools as number[];
    const chosenMiddle = adjustParity(pick(middlePool, next), profile.termParity);
    average = rational(chosenMiddle);
    const halfSpan = multiply(
      rational((count - 1) / 2),
      difference,
    );
    firstTerm = subtract(average, halfSpan);
    lastTerm = add(average, halfSpan);
    if (firstTerm.numerator <= 0) {
      const lift = rational(Math.ceil((1 - firstTerm.numerator) / 10) * 10);
      firstTerm = add(firstTerm, lift);
      lastTerm = add(lastTerm, lift);
      average = add(average, lift);
    }
  } else {
    const pool = (ranges as any).startPools[profile.startPool] as number[];
    const chosenFirst = adjustParity(pick(pool, next), profile.termParity);
    firstTerm = rational(chosenFirst);
    lastTerm = add(
      firstTerm,
      multiply(difference, rational(count - 1)),
    );
    average = divide(add(firstTerm, lastTerm), rational(2));
  }

  const terms = buildTerms(firstTerm, difference, count);
  const middleIndex = Math.floor(count / 2);
  const middleTerm = terms[middleIndex]!;
  const lowerMiddleTerm = terms[Math.floor((count - 1) / 2)]!;
  const upperMiddleTerm = terms[Math.ceil((count - 1) / 2)]!;
  const total = multiply(average, rational(count));
  const targetExtreme = profile.targetExtreme;

  const renderVariables: Record<string, string | number> = {
    count,
    firstTerm: natural(firstTerm),
    lastTerm: natural(lastTerm),
    nextTerm: natural(add(firstTerm, difference)),
    average: natural(average),
    commonDifference: natural(difference),
    middleTerm: natural(middleTerm),
    lowerMiddleTerm: natural(lowerMiddleTerm),
    upperMiddleTerm: natural(upperMiddleTerm),
  };

  return {
    packageId: AVG_001_PACKAGE_ID,
    canonicalProblemId: "AVG-CP-002",
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
    values: {
      count,
      average,
      total,
      firstTerm,
      lastTerm,
      middleTerm,
      lowerMiddleTerm,
      upperMiddleTerm,
      commonDifference: difference,
      targetExtreme,
      sequenceParity: profile.termParity,
    },
    renderVariables,
  };
}

function solveCp002(parameters: Avg001Parameters): Avg001SolverResult {
  const {
    count,
    average,
    firstTerm,
    lastTerm,
    middleTerm,
    commonDifference,
    targetExtreme,
  } = parameters.values;
  if (!firstTerm || !lastTerm || !middleTerm || !commonDifference) {
    throw new Error("Incomplete CP-002 sequence state");
  }

  let exactAnswer: Rational;
  let equation: string;

  switch (parameters.solveMode) {
    case "findAverageOfConsecutiveSet":
    case "findAverageOfOddOrEvenSet":
      exactAnswer = divide(add(firstTerm, lastTerm), rational(2));
      equation = `(${natural(firstTerm)}+${natural(lastTerm)})÷2=${natural(exactAnswer)}`;
      break;
    case "findMiddleTermFromAverage":
      exactAnswer = average;
      equation = `Middle term = Average = ${natural(exactAnswer)}`;
      break;
    case "findExtremeFromAverageAndCount":
      exactAnswer = targetExtreme === "smallest" ? firstTerm : lastTerm;
      equation = `${targetExtreme === "smallest" ? "Smallest" : "Largest"} term=${natural(exactAnswer)}`;
      break;
    default:
      throw new Error(`Unsupported CP-002 solve mode: ${parameters.solveMode}`);
  }

  return {
    exactAnswer,
    answer: formatAnswer(exactAnswer, parameters.displayPolicy),
    equation,
    workingValues: {
      count,
      firstTerm: natural(firstTerm),
      lastTerm: natural(lastTerm),
      average: natural(average),
      middleTerm: natural(middleTerm),
      commonDifference: natural(commonDifference),
      targetExtreme: targetExtreme ?? "",
    },
  };
}

function independentlyVerifyCp002(parameters: Avg001Parameters) {
  const {
    count,
    firstTerm,
    commonDifference,
    targetExtreme,
  } = parameters.values;
  if (!firstTerm || !commonDifference) {
    throw new Error("Independent verifier missing CP-002 sequence data");
  }
  const terms = buildTerms(firstTerm, commonDifference, count);
  const enumeratedTotal = terms.reduce((sum, term) => add(sum, term), rational(0));
  const enumeratedAverage = divide(enumeratedTotal, rational(count));
  let exactAnswer: Rational;

  switch (parameters.solveMode) {
    case "findAverageOfConsecutiveSet":
    case "findAverageOfOddOrEvenSet":
      exactAnswer = enumeratedAverage;
      break;
    case "findMiddleTermFromAverage":
      exactAnswer = terms[Math.floor(count / 2)]!;
      break;
    case "findExtremeFromAverageAndCount":
      exactAnswer =
        targetExtreme === "smallest" ? terms[0]! : terms[terms.length - 1]!;
      break;
    default:
      throw new Error(
        `Independent CP-002 verifier unsupported mode: ${parameters.solveMode}`,
      );
  }

  return {
    supported: true,
    exactAnswer,
    displayAnswer: formatAnswer(exactAnswer, parameters.displayPolicy),
    method:
      "Enumerated every AP term, recomputed the exact sum and selected the requested quantity independently",
  };
}

function buildCp002ReasoningEvidence(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
): Avg001ReasoningEvidence {
  const {
    count,
    average,
    firstTerm,
    lastTerm,
    middleTerm,
    lowerMiddleTerm,
    upperMiddleTerm,
    commonDifference,
    targetExtreme,
  } = parameters.values;
  if (
    !firstTerm ||
    !lastTerm ||
    !middleTerm ||
    !lowerMiddleTerm ||
    !upperMiddleTerm ||
    !commonDifference
  ) {
    throw new Error("Missing CP-002 reasoning values");
  }

  if (
    parameters.solveMode === "findAverageOfConsecutiveSet" ||
    parameters.solveMode === "findAverageOfOddOrEvenSet"
  ) {
    return {
      conceptId: "ap-endpoint-symmetry",
      givens: {
        count,
        firstTerm: natural(firstTerm),
        lastTerm: natural(lastTerm),
        commonDifference: natural(commonDifference),
      },
      equations: ["Average = (First term + Last term) ÷ 2"],
      intermediateValues: {
        endpointSum: natural(add(firstTerm, lastTerm)),
      },
      decisiveCalculation: `(${natural(firstTerm)} + ${natural(lastTerm)}) ÷ 2 = ${solver.answer}`,
      verification: `${solver.answer} × ${count} = ${natural(parameters.values.total)}`,
      finalContext: getAvg001QuestionEntry(parameters.questionLanguageId).finalContext,
    };
  }

  if (parameters.solveMode === "findMiddleTermFromAverage") {
    return {
      conceptId: "odd-ap-middle-equals-average",
      givens: {
        count,
        average: natural(average),
        commonDifference: natural(commonDifference),
      },
      equations: ["For an odd number of equally spaced terms, Middle term = Average"],
      intermediateValues: {
        firstTerm: natural(firstTerm),
        lastTerm: natural(lastTerm),
      },
      decisiveCalculation: `Middle term = ${natural(average)}`,
      verification: `(${natural(firstTerm)} + ${natural(lastTerm)}) ÷ 2 = ${natural(average)}`,
      finalContext: getAvg001QuestionEntry(parameters.questionLanguageId).finalContext,
    };
  }

  const halfSpan = divide(
    multiply(rational(count - 1), commonDifference),
    rational(2),
  );
  return {
    conceptId: "ap-extreme-from-average-offset",
    givens: {
      count,
      average: natural(average),
      commonDifference: natural(commonDifference),
      targetExtreme: targetExtreme ?? "",
    },
    equations: [
      "Total span = (Count − 1) × Common difference",
      "Distance from average to either extreme = Total span ÷ 2",
    ],
    intermediateValues: {
      totalSpan: natural(multiply(rational(count - 1), commonDifference)),
      halfSpan: natural(halfSpan),
      lowerMiddleTerm: natural(lowerMiddleTerm),
      upperMiddleTerm: natural(upperMiddleTerm),
    },
    decisiveCalculation:
      targetExtreme === "smallest"
        ? `${natural(average)} − ${natural(halfSpan)} = ${solver.answer}`
        : `${natural(average)} + ${natural(halfSpan)} = ${solver.answer}`,
    verification: `(${natural(firstTerm)} + ${natural(lastTerm)}) ÷ 2 = ${natural(average)}`,
    finalContext: getAvg001QuestionEntry(parameters.questionLanguageId).finalContext,
  };
}

function cp002ResultLabel(parameters: Avg001Parameters) {
  const variant = parameters.scenarioVariant;
  if (variant.includes("seat")) return "seat number";
  if (variant.includes("house")) return "house number";
  if (variant.includes("price")) return "price";
  if (variant.includes("score")) return "score";
  if (variant.includes("target")) return "target";
  if (variant.includes("output")) return "output";
  if (variant.includes("roll")) return "roll number";
  if (variant.includes("code")) return "code";
  if (parameters.solveMode === "findMiddleTermFromAverage") return "middle term";
  if (parameters.solveMode === "findExtremeFromAverageAndCount") {
    return parameters.values.targetExtreme === "smallest" ? "smallest term" : "largest term";
  }
  return "average";
}

function renderCp002Explanation(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
  evidence: Avg001ReasoningEvidence,
) {
  const entry = getAvg001QuestionEntry(parameters.questionLanguageId);
  const givens = evidence.givens;
  const first = String(givens.firstTerm ?? parameters.renderVariables.firstTerm);
  const last = String(givens.lastTerm ?? parameters.renderVariables.lastTerm);
  const count = Number(givens.count ?? parameters.values.count);
  const average = String(givens.average ?? parameters.renderVariables.average);
  const difference = String(givens.commonDifference ?? parameters.renderVariables.commonDifference);
  const label = cp002ResultLabel(parameters);
  const total = natural(parameters.values.total);
  const halfSpan = String(evidence.intermediateValues.halfSpan ?? "");
  const totalSpan = String(evidence.intermediateValues.totalSpan ?? "");
  const isSmallest = parameters.values.targetExtreme === "smallest";

  switch (entry.explanationStrategyId) {
    case "ap-average-endpoint-pairs":
      return { lines: [
        `Pair the first and last terms: ${first} and ${last}.`,
        "Every pair taken from opposite ends has the same average.",
        `$$\\text{Average}=(${first}+${last})\\div2=${solver.answer}$$`,
        `So the ${label} is ${solver.answer}.`,
        `Check: ${solver.answer}\\times${count}=${total}.`,
      ] };
    case "ap-average-direct-formula":
      return { lines: [
        "For an arithmetic progression, the average is halfway between the first and last terms.",
        `Here the endpoints are ${first} and ${last}.`,
        `$$(${first}+${last})\\div2=${solver.answer}$$`,
        `Hence, the ${label} is ${solver.answer}.`,
      ] };
    case "ap-average-centre-balance":
      return { lines: [
        "The terms rise by an equal amount each time.",
        "Values equally far from the two ends balance around the centre.",
        `The centre value is the mean of ${first} and ${last}.`,
        `$$\\text{Average}=(${first}+${last})\\div2=${solver.answer}$$`,
        `Therefore, the ${label} is ${solver.answer}.`,
      ] };
    case "ap-middle-equals-average":
      return { lines: [
        `There are ${count} equally spaced terms, so there is one middle term.`,
        "Pairs on the two sides are equally far from the middle.",
        "Their deviations cancel, so the middle term equals the average.",
        `$$\\text{Middle term}=${average}$$`,
        `Thus, the ${label} is ${solver.answer}.`,
      ] };
    case "ap-middle-balanced-pairs":
      return { lines: [
        "Match the first term with the last, the second with the second-last, and so on.",
        `Each pair balances at ${average}.`,
        `With an odd number of terms, the central term must also be ${average}.`,
        `So the ${label} is ${solver.answer}.`,
        `Check: ${evidence.verification}.`,
      ] };
    case "ap-middle-direct-symmetry":
      return { lines: [
        "In an odd-sized arithmetic progression, the central term is the point of symmetry.",
        `The progression is centred at its average, ${average}.`,
        `Therefore, middle term = average = ${solver.answer}.`,
        `Hence, the ${label} is ${solver.answer}.`,
      ] };
    case "ap-extreme-half-span":
      return { lines: [
        `There are ${count - 1} equal gaps of ${difference}.`,
        `$$\\text{Total span}=(${count}-1)\\times${difference}=${totalSpan}$$`,
        `The average is halfway between the extremes, so the half-span is ${halfSpan}.`,
        `$$${average}${isSmallest ? "-" : "+"}${halfSpan}=${solver.answer}$$`,
        `So the ${label} is ${solver.answer}.`,
      ] };
    case "ap-extreme-offset-count":
      return { lines: [
        `From the centre to either end, the offset is half of ${count - 1} gaps.`,
        `Each gap is ${difference}, giving an offset of ${halfSpan}.`,
        `${isSmallest ? "Subtract" : "Add"} this offset ${isSmallest ? "from" : "to"} the average ${average}.`,
        `$$${average}${isSmallest ? "-" : "+"}${halfSpan}=${solver.answer}$$`,
        `Hence, the ${label} is ${solver.answer}.`,
      ] };
    case "ap-extreme-reconstruct-ends":
      return { lines: [
        `The two extreme terms are equally far from the average ${average}.`,
        `Their distance from the average is ${halfSpan}.`,
        `So the endpoints are ${average}-${halfSpan} and ${average}+${halfSpan}.`,
        `The requested ${label} is ${solver.answer}.`,
        `Check: ${evidence.verification}.`,
      ] };
    case "odd-even-endpoint-mean":
      return { lines: [
        `The first number is ${first} and the last is ${last}.`,
        "Consecutive odd or even numbers are equally spaced, so their average is the endpoint mean.",
        `$$(${first}+${last})\\div2=${solver.answer}$$`,
        `So the ${label} is ${solver.answer}.`,
      ] };
    case "odd-even-middle-balance":
      return { lines: [
        "The numbers are equally spaced by 2.",
        "Numbers at equal distances from the ends balance around the centre.",
        `That centre is (${first}+${last})÷2=${solver.answer}.`,
        `Hence, the ${label} is ${solver.answer}.`,
        `Check: ${solver.answer}\\times${count}=${total}.`,
      ] };
    case "odd-even-first-last-shortcut":
      return { lines: [
        "There is no need to add all the terms.",
        "For an equally spaced list, use (first + last) ÷ 2.",
        `$$\\text{Average}=(${first}+${last})\\div2=${solver.answer}$$`,
        `Therefore, the ${label} is ${solver.answer}.`,
      ] };
    default:
      throw new Error(`No CP-002 explanation renderer for ${entry.explanationStrategyId}`);
  }
}

function formatOption(
  value: Rational,
  policy: Avg001DisplayPolicy,
  canonical = false,
) {
  if (canonical) return formatRational(value, policy);
  if (policy === "EXACT_INTEGER") return String(Math.round(toNumber(value)));
  if (policy === "EXACT_DECIMAL_1") return toNumber(value).toFixed(1);
  if (policy === "EXACT_DECIMAL_2") return toNumber(value).toFixed(2);
  return natural(value);
}

function generateCp002Options(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
) {
  const {
    average,
    firstTerm,
    lastTerm,
    lowerMiddleTerm,
    upperMiddleTerm,
    commonDifference,
  } = parameters.values;
  if (
    !firstTerm ||
    !lastTerm ||
    !lowerMiddleTerm ||
    !upperMiddleTerm ||
    !commonDifference
  ) {
    throw new Error("Missing CP-002 option state");
  }

  const candidates: Rational[] = [];
  if (
    parameters.solveMode === "findAverageOfConsecutiveSet" ||
    parameters.solveMode === "findAverageOfOddOrEvenSet"
  ) {
    candidates.push(
      add(firstTerm, lastTerm),
      lowerMiddleTerm,
      upperMiddleTerm,
      firstTerm,
      lastTerm,
      subtract(average, commonDifference),
      add(average, commonDifference),
      subtract(average, multiply(commonDifference, rational(2))),
      add(average, multiply(commonDifference, rational(2))),
      subtract(average, rational(1)),
      add(average, rational(1)),
    );
  } else if (parameters.solveMode === "findMiddleTermFromAverage") {
    candidates.push(
      subtract(average, commonDifference),
      add(average, commonDifference),
      firstTerm,
      lastTerm,
    );
  } else {
    candidates.push(
      parameters.values.targetExtreme === "smallest" ? lastTerm : firstTerm,
      average,
      subtract(solver.exactAnswer, commonDifference),
      add(solver.exactAnswer, commonDifference),
      add(
        average,
        divide(
          multiply(rational(parameters.values.count), commonDifference),
          rational(parameters.values.targetExtreme === "smallest" ? -2 : 2),
        ),
      ),
    );
  }

  const canonical = formatOption(
    solver.exactAnswer,
    parameters.displayPolicy,
    true,
  );
  const unique = [canonical];
  for (const candidate of candidates) {
    const rendered = formatOption(candidate, parameters.displayPolicy);
    if (!unique.includes(rendered)) unique.push(rendered);
    if (unique.length === 4) break;
  }
  if (unique.length !== 4) {
    throw new Error(
      `Insufficient unique CP-002 distractors for ${parameters.questionLanguageId}`,
    );
  }

  const shift = hash(`${parameters.seed}:options`) % 4;
  const options = [...unique];
  for (let index = 0; index < shift; index += 1) {
    options.push(options.shift()!);
  }
  const correctIndex = options.indexOf(canonical);
  if (correctIndex < 0) throw new Error("CP-002 answer missing from options");
  return { options, correctIndex };
}

function validateCp002(
  pkg: Omit<Avg001QuestionPackage, "validation">,
) {
  const checks: Avg001ValidationCheck[] = [];
  const addCheck = (name: string, passed: boolean, message: string) =>
    checks.push({ name, passed, message });

  const {
    count,
    average,
    firstTerm,
    lastTerm,
    middleTerm,
    commonDifference,
    sequenceParity,
  } = pkg.parameters.values;

  addCheck("language", pkg.language === "en", "CP-002 is English only");
  addCheck(
    "cp-contract",
    pkg.canonicalProblemId === "AVG-CP-002",
    "Package belongs to CP-002",
  );
  addCheck(
    "resolved-stem",
    !/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem),
    "Stem is fully resolved",
  );
  addCheck(
    "sequence-state",
    Boolean(firstTerm && lastTerm && middleTerm && commonDifference),
    "All AP state values are present",
  );

  if (firstTerm && lastTerm && commonDifference) {
    addCheck(
      "last-term-formula",
      equals(
        lastTerm,
        add(firstTerm, multiply(commonDifference, rational(count - 1))),
      ),
      "Last term matches first + (count − 1)d",
    );
    addCheck(
      "endpoint-average",
      equals(average, divide(add(firstTerm, lastTerm), rational(2))),
      "Average equals endpoint mean",
    );
    const terms = buildTerms(firstTerm, commonDifference, count);
    const enumeratedMean = divide(
      terms.reduce((sum, term) => add(sum, term), rational(0)),
      rational(count),
    );
    addCheck(
      "enumerated-average",
      equals(average, enumeratedMean),
      "Enumerated AP mean matches generated average",
    );
    if (sequenceParity !== "any") {
      const expected = sequenceParity === "even" ? 0 : 1;
      addCheck(
        "term-parity",
        terms.every(
          (term) =>
            isInteger(term) &&
            Math.abs(term.numerator % 2) === expected,
        ),
        "All terms match the stated odd/even parity",
      );
    }
  }

  addCheck(
    "middle-rule",
    pkg.solveMode !== "findMiddleTermFromAverage" || count % 2 === 1,
    "Middle-term shortcut is used only for odd counts",
  );
  addCheck(
    "sequence-length",
    pkg.difficultyBand === "Hard" ? count <= 17 : count <= 15,
    "Sequence length matches difficulty limits",
  );
  addCheck(
    "independent-verifier",
    pkg.independentVerification.supported &&
      equals(
        pkg.solver.exactAnswer,
        pkg.independentVerification.exactAnswer,
      ) &&
      pkg.answer === pkg.independentVerification.displayAnswer,
    "Independent enumeration agrees exactly",
  );
  addCheck(
    "four-options",
    pkg.options.length === 4,
    "Exactly four options are present",
  );
  addCheck(
    "unique-options",
    new Set(pkg.options).size === 4,
    "All options are unique",
  );
  addCheck(
    "correct-index",
    pkg.options[pkg.correctIndex] === pkg.answer,
    "Correct index points to canonical answer",
  );
  addCheck(
    "answer-once",
    pkg.options.filter((option) => option === pkg.answer).length === 1,
    "Canonical answer appears once",
  );
  addCheck(
    "explanation-depth",
    pkg.explanation.lines.length >= 4 &&
      pkg.explanation.lines.length <= 8,
    "Explanation contains 4–8 meaningful moves",
  );
  addCheck(
    "explanation-arithmetic",
    pkg.explanation.lines.some(
      (line) =>
        line.includes("\\times") ||
        line.includes("\\div") ||
        line.includes("÷") ||
        line.includes("+") ||
        line.includes("−"),
    ),
    "Explanation contains actual arithmetic",
  );
  addCheck(
    "explanation-answer",
    pkg.explanation.lines.some((line) => line.includes(pkg.answer)),
    "Explanation contains the final answer",
  );
  addCheck(
    "maturity",
    pkg.maturity === "RUNTIME_PROOF" && !pkg.publiclyPublishable,
    "CP-002 remains a non-public runtime proof",
  );

  return { valid: checks.every((check) => check.passed), checks };
}

function buildFingerprint(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
) {
  const values = parameters.values;
  return JSON.stringify({
    cpId: parameters.canonicalProblemId,
    solveMode: parameters.solveMode,
    givens: {
      count: values.count,
      firstTerm: values.firstTerm,
      lastTerm: values.lastTerm,
      average: values.average,
      commonDifference: values.commonDifference,
      targetExtreme: values.targetExtreme,
      sequenceParity: values.sequenceParity,
    },
    requestedTarget: parameters.answerType,
    exactAnswer: solver.exactAnswer,
    displayPolicy: parameters.displayPolicy,
  });
}

export function runAvg001Cp002Pipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: Avg001Language;
}): Avg001QuestionPackage {
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  const parameters = generateCp002Parameters(input);
  const solver = solveCp002(parameters);
  const independentVerification = independentlyVerifyCp002(parameters);
  const reasoningEvidence = buildCp002ReasoningEvidence(parameters, solver);
  const explanation = renderCp002Explanation(
    parameters,
    solver,
    reasoningEvidence,
  );
  const stem = renderTemplate(entry.template, parameters.renderVariables);
  const { options, correctIndex } = generateCp002Options(parameters, solver);
  const mathematicalFingerprint = buildFingerprint(parameters, solver);

  const base = {
    packageId: AVG_001_PACKAGE_ID,
    archetypeId: AVG_001_PACKAGE_ID,
    canonicalProblemId: "AVG-CP-002" as const,
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
    answer: solver.answer,
    parameters,
    solver,
    independentVerification,
    reasoningEvidence,
    explanation,
    maturity: "RUNTIME_PROOF" as const,
    publiclyPublishable: false,
    mathematicalFingerprint,
    traceability: {
      packageId: AVG_001_PACKAGE_ID,
      canonicalProblemId: entry.cpId,
      questionLanguageId: entry.qlId,
      taskKind: entry.taskKind,
      solveMode: entry.solveMode,
      answerType: entry.answerType,
      contextDomain: entry.contextDomain,
      scenarioVariant: entry.scenarioVariant,
    },
  };

  const validation = validateCp002(base);
  if (!validation.valid) {
    throw new Error(
      validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join("\n"),
    );
  }

  return { ...base, validation };
}
