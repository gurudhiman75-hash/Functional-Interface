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

function renderCp002Explanation(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
  evidence: Avg001ReasoningEvidence,
) {
  const givens = evidence.givens;
  if (
    parameters.solveMode === "findAverageOfConsecutiveSet" ||
    parameters.solveMode === "findAverageOfOddOrEvenSet"
  ) {
    return {
      lines: [
        `The ${givens.count} values are equally spaced, so terms pair symmetrically from the two ends.`,
        `Each end-pair has the same mean; therefore the whole progression has the same mean as its first and last terms.`,
        "Use average = (first term + last term) ÷ 2.",
        `$$\\text{Average}=(${givens.firstTerm}+${givens.lastTerm})\\div2=${solver.answer}$$`,
        `Check: ${solver.answer} × ${givens.count} = ${natural(parameters.values.total)}, the exact sequence total.`,
        "This symmetry shortcut avoids adding every term separately.",
        `Therefore, the ${evidence.finalContext} is ${solver.answer}.`,
      ],
    };
  }

  if (parameters.solveMode === "findMiddleTermFromAverage") {
    return {
      lines: [
        `There are ${givens.count} equally spaced terms, and this count is odd.`,
        "An odd arithmetic progression has one central term with matching pairs at equal distances on both sides.",
        "Those symmetric pairs balance around the central term.",
        "Therefore, middle term = average.",
        `$$\\text{Middle term}=${givens.average}$$`,
        `Check: ${evidence.verification}.`,
        `Hence, the ${evidence.finalContext} is ${solver.answer}.`,
      ],
    };
  }

  return {
    lines: [
      `The progression has ${givens.count} terms with common difference ${givens.commonDifference}.`,
      "From the smallest term to the largest term, there are count − 1 equal gaps.",
      `$$\\text{Total span}=(${givens.count}-1)\\times${givens.commonDifference}=${evidence.intermediateValues.totalSpan}$$`,
      "The average lies exactly halfway between the two extreme terms.",
      `$$\\text{Half span}=${evidence.intermediateValues.totalSpan}\\div2=${evidence.intermediateValues.halfSpan}$$`,
      `Now calculate the requested extreme: ${evidence.decisiveCalculation}.`,
      `Check: ${evidence.verification}.`,
      `Therefore, the ${evidence.finalContext} is ${solver.answer}.`,
    ],
  };
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
    pkg.explanation.lines.length >= 6,
    "Explanation contains at least six meaningful moves",
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
