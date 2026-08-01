// @ts-nocheck
import * as core from "./simple-teacher-voice-core";
const {
  rawText,
  cleanText,
  formatNumber,
  mathNumber,
  mathValue,
  displayEquation,
  titleCaseClass,
  studentOptionDisplay,
  optionValues,
  correctIndex,
  correctAnswerDisplay,
  gcd,
  isPrime,
  primeFactors,
  factorisationMath,
  factorisationPlain,
  productFromFactors,
  digitSum,
  alternatingSums,
  fillTemplate,
  setText,
  pairText,
  pairSetText,
  assignmentLabel,
  primitiveDivisors,
  ruleSentence,
  divisibilityEvidence,
  templateDigitSum,
  templateRuleSteps,
  simpleDiagnostic,
  parseNumericOption,
  parseAdjustmentSet,
  parseIntegerList,
  smallestNonTrivialDivisor,
  listDifference,
  SIMPLE_NUMBER_SYSTEM_QL_TITLES,
  COMPOSITE_RULE_PARTS
} = core;
import { classification, primeTestText } from "./simple-teacher-voice-cp003";

function numericSafe(value) {
  return Number(value);
}

export function cp004TeacherFoundation(row) {
  const state = row.question.hiddenState;
  const answer = row.question.canonicalAnswer;

  switch (state.mode) {
    case "CLASSIFY": {
      const value = Number(state.value);
      const result = classification(value);
      const steps = [];
      if (value === 1) {
        steps.push(`${mathNumber(1)} has only one positive factor: ${mathNumber(1)}.`);
        steps.push(`A prime needs exactly two positive factors, and a composite number needs more than two.`);
        steps.push(`Therefore, ${mathNumber(1)} is a **unit**.`);
      } else if (value <= 0) {
        steps.push(`Prime and composite numbers are positive integers greater than ${mathNumber(1)}.`);
        steps.push(`${mathNumber(value)} does not meet that condition.`);
        steps.push(`Therefore, it is **neither prime nor composite**.`);
      } else {
        steps.push(primeTestText(value));
        steps.push(`The positive factors are checked using primes up to ${mathValue(`\\sqrt{${value}}`)}.`);
        steps.push(`Therefore, ${mathNumber(value)} is **${result.toLowerCase()}**.`);
      }
      return {
        mainRule: [`A prime number has exactly two positive factors: ${mathNumber(1)} and itself. A composite number has more than two.`],
        steps,
        speedTrick: [`Check ${mathNumber(1)}, ${mathNumber(0)} and negative numbers first. They can be classified without any division.`],
      };
    }
    case "INTERVAL_SET":
    case "INTERVAL_COUNT": {
      const primes = [];
      const checks = [];
      for (let n = state.lower; n <= state.upper; n += 1) {
        if (isPrime(n)) primes.push(n);
        checks.push(`${mathNumber(n)}: ${isPrime(n) ? "prime" : `composite (${primeFactors(n)[0]?.prime ?? 1} divides it)`}`);
      }
      return {
        mainRule: [`To test whether ${mathNumber(numericSafe(state.lower))} to ${mathNumber(numericSafe(state.upper))} contain primes, try prime divisors only up to the square root of each number.`],
        steps: [
          `Check the integers from ${mathNumber(state.lower)} to ${mathNumber(state.upper)} one by one.`,
          ...checks.map((check) => `${check}.`),
          `The prime numbers are ${mathValue(setText(primes))}.`,
          state.mode === "INTERVAL_COUNT"
            ? `Count them: there are ${mathNumber(primes.length)} primes.`
            : `Therefore, the complete prime set is ${mathValue(setText(primes))}.`,
        ],
        speedTrick: [`Remove even numbers greater than ${mathNumber(2)} first. Then test only small prime divisors such as ${mathValue("3, 5, 7")}.`],
      };
    }
    case "ADJACENT_PRIME": {
      const steps = [];
      if (state.direction === "NEXT") {
        steps.push(`Start with the integer just above ${mathNumber(state.value)}.`);
        let n = state.value + 1;
        while (!isPrime(n)) {
          steps.push(`${mathNumber(n)} is composite. ${primeTestText(n)}`);
          n += 1;
        }
        steps.push(primeTestText(n));
        steps.push(`Therefore, ${mathNumber(n)} is the next prime after ${mathNumber(state.value)}.`);
      } else if (state.direction === "PREVIOUS") {
        steps.push(`Start with the integer just below ${mathNumber(state.value)}.`);
        let n = state.value - 1;
        while (!isPrime(n)) {
          steps.push(`${mathNumber(n)} is composite. ${primeTestText(n)}`);
          n -= 1;
        }
        steps.push(primeTestText(n));
        steps.push(`Therefore, ${mathNumber(n)} is the previous prime before ${mathNumber(state.value)}.`);
      } else {
        steps.push(`Start at the lower end of the interval, ${mathNumber(state.lower)}.`);
        let n = state.lower;
        while (n <= state.upper && !isPrime(n)) {
          steps.push(`${mathNumber(n)} is not prime.`);
          n += 1;
        }
        steps.push(primeTestText(n));
        steps.push(`Therefore, ${mathNumber(n)} is the least prime in the interval.`);
      }
      return {
        mainRule: [`Move one number at a time in the required direction and stop at the first prime.`],
        steps,
        speedTrick: [`Skip even numbers greater than ${mathNumber(2)}. This cuts the search almost in half.`],
      };
    }
    case "DIGIT_RANGE_PRIME": {
      const matching = [];
      for (let n = state.lower; n <= state.upper; n += 1) if (digitSum(n) === state.digitSum) matching.push(n);
      const primeMatches = matching.filter(isPrime);
      return {
        mainRule: [`The number must satisfy both conditions: it must be in the range and it must be prime. The digit sum is only a filter.`],
        steps: [
          `Numbers in the range with digit sum ${mathNumber(state.digitSum)} are ${mathValue(setText(matching))}.`,
          ...matching.map((value) => primeTestText(value)),
          `Only ${mathValue(setText(primeMatches))} satisfies the digit condition and the prime test.`,
        ],
        speedTrick: [`Use the digit sum first to reduce the list. Then test primality only for the few values that remain.`],
      };
    }
    case "PRIME_CLAIM": {
      const correct = state.claims.find((claim) => isPrime(claim.value));
      return {
        mainRule: [`A prime is greater than ${mathNumber(1)} and has no divisor other than ${mathNumber(1)} and itself.`],
        steps: [
          ...state.claims.map((claim) => `**${cleanText(claim.text)}** ${primeTestText(claim.value)}`),
          `Therefore, the correct statement is **${cleanText(correct.text)}**`,
        ],
        speedTrick: [`Check even numbers, ${mathNumber(1)}, and obvious squares first. They can be rejected immediately.`],
      };
    }
    case "FACTORISATION":
    case "PRIME_FACTOR_EXTREMUM":
    case "DISTINCT_FACTOR_COUNT":
    case "MULTIPLICITY_COUNT": {
      const factors = primeFactors(state.value);
      const expansion = factors.flatMap(({ prime, exponent }) => Array(exponent).fill(prime));
      const steps = [
        `Divide by the smallest possible primes until only ${mathNumber(1)} remains: ${mathValue(expansion.join(" \\times "))}.`,
        `${displayEquation(`${formatNumber(state.value)} = ${factorisationMath(factors)}`)}`,
      ];
      if (state.mode === "FACTORISATION") steps.push(`This is the complete prime factorisation.`);
      if (state.mode === "PRIME_FACTOR_EXTREMUM") {
        const primes = factors.map((factor) => factor.prime);
        const result = state.direction === "LARGEST" ? Math.max(...primes) : Math.min(...primes);
        steps.push(`The distinct prime factors are ${mathValue(setText(primes))}. The ${state.direction.toLowerCase()} is ${mathNumber(result)}.`);
      }
      if (state.mode === "DISTINCT_FACTOR_COUNT") {
        steps.push(`Count only the different prime bases: ${mathValue(setText(factors.map((factor) => factor.prime)))}. Total = ${mathNumber(factors.length)}.`);
      }
      if (state.mode === "MULTIPLICITY_COUNT") {
        const total = factors.reduce((sum, factor) => sum + factor.exponent, 0);
        steps.push(`${displayEquation(`${factors.map((factor) => factor.exponent).join(" + ")} = ${total}`)} Counting repetitions gives ${mathNumber(total)} prime factors.`);
      }
      return {
        mainRule: [`A complete prime factorisation uses only prime numbers. Exponents show how many times a prime is repeated.`],
        steps,
        speedTrick: [`Try ${mathNumber(2)}, ${mathNumber(3)} and ${mathNumber(5)} first using the last digit and digit sum.`],
      };
    }
    case "RECONSTRUCT_INTEGER": {
      const powerValues = state.factors.map((factor) => ({
        ...factor,
        value: factor.prime ** factor.exponent,
      }));
      let running = 1;
      const multiplicationSteps = powerValues.map((factor) => {
        const before = running;
        running *= factor.value;
        return `${mathValue(`${factor.prime}^{${factor.exponent}}`)} = ${mathNumber(factor.value)}; ${mathNumber(before)} × ${mathNumber(factor.value)} = ${mathNumber(running)}.`;
      });
      return {
        mainRule: [`To recover the number, calculate each prime power and multiply the results.`],
        steps: [
          ...multiplicationSteps,
          `Therefore, the integer is ${mathNumber(running)}.`,
        ],
        speedTrick: [`Calculate small powers first, then multiply in an order that creates easy round numbers.`],
      };
    }
    case "COMPARE_STRUCTURES": {
      const describe = (factors) => ({
        distinct: factors.length,
        multiplicity: factors.reduce((sum, factor) => sum + factor.exponent, 0),
        value: productFromFactors(factors),
      });
      const a = describe(state.factorsA);
      const b = describe(state.factorsB);
      const target = state.target === "DISTINCT" ? "distinct prime factors" : state.target === "MULTIPLICITY" ? "prime factors with repetition" : "numerical value";
      const aValue = state.target === "DISTINCT" ? a.distinct : state.target === "MULTIPLICITY" ? a.multiplicity : a.value;
      const bValue = state.target === "DISTINCT" ? b.distinct : state.target === "MULTIPLICITY" ? b.multiplicity : b.value;
      return {
        mainRule: [`Compare only the value asked for: number of different primes, total repetitions, or the full numerical value.`],
        steps: [
          state.target === "VALUE"
            ? `For ${mathValue("A")}, the numerical value is ${mathNumber(aValue)}.`
            : `For ${mathValue("A")}, the number of ${target} is ${mathNumber(aValue)}.`,
          state.target === "VALUE"
            ? `For ${mathValue("B")}, the numerical value is ${mathNumber(bValue)}.`
            : `For ${mathValue("B")}, the number of ${target} is ${mathNumber(bValue)}.`,
          aValue === bValue ? `Both are equal.` : `${mathValue(aValue > bValue ? "A" : "B")} has the greater value.`,
        ],
        speedTrick: [`Do not expand the full numbers unless the question asks for value. For counts, read the bases or add the exponents directly.`],
      };
    }
    default:
      return null;
  }
}
