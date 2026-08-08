import {
  divisorCountFromState,
  divisorCountOfInteger,
  factorMath,
  math,
  oddDivisorCountFromState,
  primePowers,
  secondPrimePowers,
  squareDivisorCountFromState,
} from "./english-remediation-common";
import {
  metricLabel,
  metricValue,
  multiplicativePatterns,
} from "./final-exam-readiness-question-corrections";

function explanation(coreConcept, strategy, steps, speedMethod, traps, finalAnswer) {
  return {
    coreConcept,
    givenDataAndStrategy: strategy,
    stepByStep: steps,
    examSpeedMethod: speedMethod,
    commonTraps: traps,
    finalAnswer,
  };
}

function parityMatches(value, parity) {
  return parity === "ANY" || (parity === "ODD" ? value % 2 === 1 : value % 2 === 0);
}

function factorisationFromPattern(pattern, parity) {
  const primes = parity === "ODD"
    ? [3, 5, 7, 11, 13, 17]
    : [2, 3, 5, 7, 11, 13];
  const exponents = pattern.map((factor) => factor - 1).sort((a, b) => b - a);
  const state = exponents.map((exponent, index) => ({ prime: primes[index], exponent }));
  const value = state.reduce((product, { prime, exponent }) => product * prime ** exponent, 1);
  return { state, value };
}

function patternText(pattern) {
  return pattern.map((factor) => String(factor - 1)).join(", ");
}

function ql057Explanation(input) {
  const target = Number(input.hiddenState.targetDivisorCount);
  const bound = Number(input.hiddenState.bound);
  const parity = String(input.hiddenState.parity ?? "ANY");
  const patterns = multiplicativePatterns(target);
  const patternSummary = patterns
    .map((pattern) => `(${patternText(pattern)})`)
    .join(", ");

  if (input.canonicalAnswer === "No such integer") {
    const minimumLines = patterns.map((pattern) => {
      const minimum = factorisationFromPattern(pattern, parity);
      return `For exponent pattern ${patternText(pattern)}, the smallest allowed number is ${math(`${minimum.state.map(({ prime, exponent }) => exponent === 1 ? String(prime) : `${prime}^{${exponent}}`).join(" \\times ")}=${minimum.value}`)}.`;
    });
    return explanation(
      `If ${math("n=p_1^{a_1}p_2^{a_2}\\cdots")}, then ${math(`(a_1+1)(a_2+1)\\cdots=${target}`)}.`,
      `The possible exponent patterns are ${patternSummary}. Find the smallest number from each pattern and compare it with ${bound}.`,
      [
        ...minimumLines,
        `Every smallest allowed value is greater than ${bound}, so no valid number lies within the bound.`,
      ],
      "Use exponent patterns first; do not test every integer below the bound.",
      [
        "A prime divisor count gives only one exponent pattern.",
        parity === "ODD" ? "For an odd answer, start with the prime 3, not 2." : parity === "EVEN" ? "An even answer must contain the prime 2." : "Use the smallest primes to test whether a pattern can fit the bound.",
        "If the smallest number for a pattern is too large, every other number from that pattern is also too large.",
      ],
      input.canonicalAnswer,
    );
  }

  const state = primePowers(input.hiddenState);
  const answer = Number(input.canonicalAnswer);
  const validValues = [];
  for (let value = 1; value <= bound; value += 1) {
    if (parityMatches(value, parity) && divisorCountOfInteger(value) === target) {
      validValues.push(value);
    }
  }
  const largestValues = validValues.slice(-3);
  const divisorFormula = state.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ");
  return explanation(
    `The divisor-count equation gives exponent patterns ${patternSummary}.`,
    `Generate only numbers with these patterns, apply the ${parity.toLowerCase()} condition, and keep values not exceeding ${bound}.`,
    [
      `The largest valid ${largestValues.length === 1 ? "value is" : "values are"} ${largestValues.join(", ")}.`,
      `${math(`${answer}=${state.map(({ prime, exponent }) => exponent === 1 ? String(prime) : `${prime}^{${exponent}}`).join(" \\times ")}`)} and ${math(`d(${answer})=${divisorFormula}=${target}`)}.`,
      `${answer} is the greatest valid value not exceeding ${bound}.`,
    ],
    "Use the divisor-count patterns to generate possible numbers; do not calculate d(n) for every integer.",
    [
      "Check the parity condition before accepting a number.",
      "The largest integer below the bound need not have the required divisor count.",
      "Stop only after all larger numbers from the allowed patterns have been ruled out.",
    ],
    input.canonicalAnswer,
  );
}

function parseFactorisation(value) {
  if (typeof value !== "string" || value.trim() === "" || value.trim() === "1") return [];
  return value.split(/\s*×\s*/u).map((term) => {
    const match = term.trim().match(/^(\d+)(?:\^(\d+))?$/u);
    if (!match) throw new Error(`Invalid factorisation: ${value}`);
    return { prime: Number(match[1]), exponent: Number(match[2] ?? 1) };
  });
}

function ql067Explanation(input) {
  const candidates = Array.isArray(input.hiddenState.candidateStates)
    ? input.hiddenState.candidateStates.map(String)
    : [];
  const targetTotal = Number(input.hiddenState.totalDivisors);
  const targetSquare = Number(input.hiddenState.squareDivisors);
  const steps = candidates.map((candidate) => {
    const state = parseFactorisation(candidate);
    const total = divisorCountFromState(state);
    const square = squareDivisorCountFromState(state);
    return `${factorMath(state)} gives ${math(`d(n)=${total}`)} and ${square} perfect-square ${square === 1 ? "divisor" : "divisors"}.`;
  });
  return explanation(
    "A correct option must satisfy both divisor conditions.",
    `For every option, calculate the total divisors and the perfect-square divisors, then compare them with ${targetTotal} and ${targetSquare}.`,
    steps,
    "Reject an option as soon as either count is wrong.",
    [
      "Matching only the total-divisor count is not enough.",
      "For square divisors, each exponent contributes floor(exponent/2)+1 choices.",
      "Check all four options before selecting the unique match.",
    ],
    input.canonicalAnswer,
  );
}

function totalFormula(state) {
  return state.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ") || "1";
}

function oddFormula(state) {
  const oddState = state.filter(({ prime }) => prime !== 2);
  return oddState.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ") || "1";
}

function squareFormula(state) {
  return state.map(({ exponent }) => `(\\lfloor${exponent}/2\\rfloor+1)`).join(" \\times ") || "1";
}

function sumFormula(state) {
  return state.map(({ prime, exponent }) => {
    const terms = [];
    for (let power = 0; power <= exponent; power += 1) {
      terms.push(power === 0 ? "1" : power === 1 ? String(prime) : `${prime}^{${power}}`);
    }
    return `(${terms.join("+")})`;
  }).join(" \\times ") || "1";
}

function metricFormula(state, metric) {
  if (metric === "DIVISOR_SUM") return sumFormula(state);
  if (metric === "SQUARE_DIVISORS") return squareFormula(state);
  if (metric === "ODD_DIVISORS") return oddFormula(state);
  return totalFormula(state);
}

function ql068Explanation(input) {
  const firstState = primePowers(input.hiddenState);
  const secondState = secondPrimePowers(input.hiddenState);
  const metric = String(input.hiddenState.metricKind);
  const first = metricValue(firstState, metric);
  const second = metricValue(secondState, metric);
  const sign = first > second ? ">" : first < second ? "<" : "=";
  return explanation(
    `Calculate the ${metricLabel(metric)} for both numbers by the same rule.`,
    `Work with A=${factorMath(firstState)} and B=${factorMath(secondState)} separately.`,
    [
      `For A: ${math(`${metricFormula(firstState, metric)}=${first}`)}.`,
      `For B: ${math(`${metricFormula(secondState, metric)}=${second}`)}.`,
      `Since ${math(`${first}${sign}${second}`)}, ${input.canonicalAnswer}`,
    ],
    "Calculate the two values first, then compare them.",
    [
      "Do not compare the sizes of A and B themselves.",
      "Use the same divisor function for both numbers.",
      "The comparison follows from the calculated values, not from the number of prime factors.",
    ],
    input.canonicalAnswer,
  );
}

function setText(values) {
  return `{${values.join(", ")}}`;
}

function ql069Explanation(input) {
  const first = Array.isArray(input.hiddenState.firstCandidates)
    ? input.hiddenState.firstCandidates.map(Number)
    : [];
  const second = Array.isArray(input.hiddenState.secondCandidates)
    ? input.hiddenState.secondCandidates.map(Number)
    : [];
  const combined = Array.isArray(input.hiddenState.combinedCandidates)
    ? input.hiddenState.combinedCandidates.map(Number)
    : [];
  return explanation(
    "A statement is sufficient only when it leaves one possible value of x.",
    "Find the possible x-values from each statement separately. Use their common values only if neither statement works alone.",
    [
      `Statement I leaves ${math(`S_I=${setText(first)}`)}.`,
      `Statement II leaves ${math(`S_{II}=${setText(second)}`)}.`,
      `Together they leave ${math(`S_I\\cap S_{II}=${setText(combined)}`)}. Therefore, ${input.canonicalAnswer}`,
    ],
    "One remaining value means sufficient; more than one means insufficient.",
    [
      "Judge Statement I and Statement II separately before combining them.",
      "Do not assume that two true statements must be sufficient.",
      "When both are used, take the common values.",
    ],
    input.canonicalAnswer,
  );
}

export function applyNumCp005FinalExamExplanationCorrections(input, explanationValue) {
  switch (input.qlId) {
    case "NUM-QL-057": return ql057Explanation(input);
    case "NUM-QL-067": return ql067Explanation(input);
    case "NUM-QL-068": return ql068Explanation(input);
    case "NUM-QL-069": return ql069Explanation(input);
    default: return explanationValue;
  }
}
