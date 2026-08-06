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

export function cp004TeacherAdvanced(row) {
  const state = row.question.hiddenState;
  const answer = row.question.canonicalAnswer;

  switch (state.mode) {
    case "MISSING_PRIME": {
      const hidden = state.factors[state.hiddenIndex];
      const knownProduct = state.factors.reduce((product, factor, index) =>
        index === state.hiddenIndex ? product : product * factor.prime ** factor.exponent, 1);
      const remaining = state.value / knownProduct;
      return {
        mainRule: [`Divide the number by all visible prime powers. The remaining perfect power contains the missing prime.`],
        steps: [
          `Product of the visible factors = ${mathNumber(knownProduct)}.`,
          `${displayEquation(`${formatNumber(state.value)} \\div ${formatNumber(knownProduct)} = ${formatNumber(remaining)}`)}`,
          `${displayEquation(`${formatNumber(remaining)} = ${hidden.prime}^{${hidden.exponent}}`)} Therefore, the missing prime is ${mathNumber(hidden.prime)}.`,
        ],
        speedTrick: [`Cancel the visible factors first. Then recognise the remaining square or cube.`],
      };
    }
    case "MISSING_EXPONENT": {
      const hidden = state.factors[state.hiddenIndex];
      const knownProduct = state.factors.reduce((product, factor, index) =>
        index === state.hiddenIndex ? product : product * factor.prime ** factor.exponent, 1);
      const remaining = state.value / knownProduct;
      return {
        mainRule: [`Divide out the known prime powers. The power left tells how many times the shown prime is repeated.`],
        steps: [
          `Product of the known factors = ${mathNumber(knownProduct)}.`,
          `${displayEquation(`${formatNumber(state.value)} \\div ${formatNumber(knownProduct)} = ${formatNumber(remaining)}`)}`,
          `${displayEquation(`${formatNumber(remaining)} = ${hidden.prime}^{${hidden.exponent}}`)} Therefore, ${mathValue(`x = ${hidden.exponent}`)}.`,
        ],
        speedTrick: [`After cancellation, compare the remaining number with familiar powers such as ${mathValue("2^2, 2^3, 3^2, 5^3")}.`],
      };
    }
    case "SELECT_COPRIME_PAIR": {
      const pairChecks = state.pairs.map(([a, b]) => ({ a, b, hcf: gcd(a, b) }));
      const correct = pairChecks.find((pair) => pair.hcf === 1);
      return {
        mainRule: [`Two numbers are co-prime when their HCF is ${mathNumber(1)}.`],
        steps: [
          ...pairChecks.map((pair) => `${displayEquation(`\\operatorname{HCF}(${pair.a}, ${pair.b}) = ${pair.hcf}`)}`),
          `Only ${mathValue(pairText([correct.a, correct.b]))} has HCF ${mathNumber(1)}.`,
        ],
        speedTrick: [`Look for an obvious shared factor first. Consecutive numbers are always co-prime.`],
      };
    }
    case "COPRIME_SET":
    case "COPRIME_COUNT":
    case "COPRIME_UNKNOWN": {
      const fixedFactors = primeFactors(state.fixed).map((factor) => factor.prime);
      const checks = state.candidates.map((candidate) => ({ candidate, hcf: gcd(state.fixed, candidate) }));
      const valid = checks.filter((item) => item.hcf === 1).map((item) => item.candidate);
      return {
        mainRule: [`A number is co-prime to ${mathNumber(state.fixed)} when it shares no prime factor with it, or equivalently when the HCF is ${mathNumber(1)}.`],
        steps: [
          `${displayEquation(`${formatNumber(state.fixed)} = ${factorisationMath(primeFactors(state.fixed))}`)} Avoid candidates divisible by ${mathValue(setText(fixedFactors))}.`,
          ...checks.map((item) => `${displayEquation(`\\operatorname{HCF}(${state.fixed}, ${item.candidate}) = ${item.hcf}`)}`),
          state.mode === "COPRIME_COUNT"
            ? `The co-prime values are ${mathValue(setText(valid))}. Count = ${mathNumber(valid.length)}.`
            : state.mode === "COPRIME_UNKNOWN"
              ? `Only ${mathNumber(valid[0])} has HCF ${mathNumber(1)}.`
              : `Therefore, the complete set is ${mathValue(setText(valid))}.`,
        ],
        speedTrick: [`Factor the fixed number once. Then cross out every candidate divisible by any of those prime factors.`],
      };
    }
    case "COPRIME_CLASS": {
      const [a, b, c] = state.values;
      const ab = gcd(a, b);
      const ac = gcd(a, c);
      const bc = gcd(b, c);
      const all = gcd(gcd(a, b), c);
      const pairwise = [ab, ac, bc].every((value) => value === 1);
      const collective = all === 1;
      return {
        mainRule: [`Pairwise co-prime means every pair has HCF ${mathNumber(1)}. Collectively co-prime means the HCF of all numbers together is ${mathNumber(1)}.`],
        steps: [
          `${displayEquation(`\\operatorname{HCF}(${a}, ${b}) = ${ab},\\quad \\operatorname{HCF}(${a}, ${c}) = ${ac},\\quad \\operatorname{HCF}(${b}, ${c}) = ${bc}`)}`,
          `${displayEquation(`\\operatorname{HCF}(${a}, ${b}, ${c}) = ${all}`)}`,
          `So the numbers are ${pairwise ? "pairwise" : "not pairwise"} co-prime and ${collective ? "collectively" : "not collectively"} co-prime.`,
        ],
        speedTrick: [`A single pair with HCF greater than ${mathNumber(1)} is enough to reject pairwise co-primality.`],
      };
    }
    case "COPRIME_CLAIM": {
      const evaluations = state.claims.map((claim) => {
        if (claim.kind === "PAIR") {
          const hcf = gcd(claim.values[0], claim.values[1]);
          return { claim, truth: hcf === 1, reason: `${mathValue(`HCF(${claim.values[0]}, ${claim.values[1]}) = ${hcf}`)}` };
        }
        if (claim.kind === "PAIRWISE_TRIPLE") {
          const [a, b, c] = claim.values;
          const values = [gcd(a, b), gcd(a, c), gcd(b, c)];
          return { claim, truth: values.every((value) => value === 1), reason: `The pairwise HCFs are ${mathValue(values.join(", "))}.` };
        }
        return { claim, truth: false, reason: `${mathNumber(9)} and ${mathNumber(15)} are both odd but have HCF ${mathNumber(3)}.` };
      });
      const correct = evaluations.find((item) => item.truth);
      return {
        mainRule: [`Co-prime numbers have HCF ${mathNumber(1)}. Being odd is not enough.`],
        steps: [
          ...evaluations.map((item) => `**${cleanText(item.claim.text)}** ${item.reason} So the statement is **${item.truth ? "true" : "false"}**.`),
          `Therefore, the correct statement is **${cleanText(correct.claim.text)}**`,
        ],
        speedTrick: [`For two numbers, look for one shared prime factor. Finding one is enough to reject co-primality.`],
      };
    }
    case "PRIME_PAIR": {
      const relation = state.relation === "SUM"
        ? `${state.first} + ${state.second} = ${state.target}`
        : state.relation === "DIFFERENCE"
          ? `${state.second} - ${state.first} = ${state.target}`
          : `${state.first} \\times ${state.second} = ${state.target}`;
      return {
        mainRule: [`Consecutive primes have no other prime between them. The pair must also satisfy the given relation.`],
        steps: [
          primeTestText(state.first),
          primeTestText(state.second),
          `There is no prime between ${mathNumber(state.first)} and ${mathNumber(state.second)}, so they are consecutive primes.`,
          `${displayEquation(relation)} Therefore, the pair is ${mathValue(pairText([state.first, state.second]))}.`,
        ],
        speedTrick: [`Check the relation first. It usually leaves only one pair to test for primality and consecutiveness.`],
      };
    }
    case "PRIME_TRIPLE": {
      return {
        mainRule: [`Three consecutive primes must all be prime, must be in increasing order, and must have no prime skipped between them.`],
        steps: [
          primeTestText(state.first),
          primeTestText(state.second),
          primeTestText(state.third),
          `${displayEquation(`${state.first} + ${state.second} + ${state.third} = ${state.sum}`)} Therefore, the triple is ${mathValue(`(${state.first}, ${state.second}, ${state.third})`)}.`,
        ],
        speedTrick: [`Start from the given smallest prime and write the next two primes. Then check the sum once.`],
      };
    }
    case "LEAST_PRIME_DIVISOR": {
      const factors = primeFactors(state.value);
      const least = factors[0].prime;
      const smallerPrimes = [2, 3, 5, 7, 11, 13, 17, 19].filter((prime) => prime < least);
      return {
        mainRule: [`The least prime divisor is the first prime number that divides the given number with remainder ${mathNumber(0)}.`],
        steps: [
          ...smallerPrimes.map((prime) => `${mathNumber(state.value)} is not divisible by ${mathNumber(prime)}.`),
          `${displayEquation(`${state.value} \\div ${least} = ${state.value / least}`)} The remainder is ${mathNumber(0)}.`,
          `Therefore, the least prime divisor is ${mathNumber(least)}.`,
        ],
        speedTrick: [`Test primes in order: ${mathValue("2, 3, 5, 7, 11, \\ldots")}. Stop at the first exact division.`],
      };
    }
    case "EXPRESSION_PRIME_DIVISOR": {
      const value = state.a + state.b;
      const checks = state.listed.map((prime) => ({ prime, remainder: value % prime }));
      const correct = checks.find((item) => item.remainder === 0);
      return {
        mainRule: [`First simplify the expression. Then check which listed prime divides the result with remainder ${mathNumber(0)}.`],
        steps: [
          `${displayEquation(`${state.a} + ${state.b} = ${value}`)}`,
          ...checks.map((item) => item.remainder === 0
            ? `${displayEquation(`${value} \\div ${item.prime} = ${value / item.prime}`)} Exact division.`
            : `${displayEquation(`${value} = ${item.prime} \\times ${Math.floor(value / item.prime)} + ${item.remainder}`)} Remainder ${mathNumber(item.remainder)}.`),
          `Therefore, ${mathNumber(correct.prime)} is the required prime divisor.`,
        ],
        speedTrick: [`Simplify first. Then use digit-sum or last-digit rules before exact division.`],
      };
    }
    case "FEASIBILITY": {
      const p = state.prime;
      return {
        mainRule: [`A composite number can have one distinct prime factor when it is a power such as ${mathValue(`${p}^2`)}. The only even prime is ${mathNumber(2)}.`],
        steps: [
          `${displayEquation(`${p}^2 = ${p * p}`)} This number is composite and has only one distinct prime factor, ${mathNumber(p)}.`,
          `An even prime greater than ${mathNumber(2)} is impossible because every larger even number is divisible by ${mathNumber(2)}.`,
          `Every composite positive integer has at least one prime factor.`,
          `The product of two primes has at least the two original factors, so it is composite.`,
          `Therefore, the possible statement is **${cleanText(answer)}**`,
        ],
        speedTrick: [`Use one counterexample or one basic rule for each statement. Do not expand unnecessary calculations.`],
      };
    }
    case "FACTOR_TREE": {
      const missing = state.children[0] * state.children[1];
      return {
        mainRule: [`In a factor tree, a parent node equals the product of its two child nodes.`],
        steps: [
          `${displayEquation(`m = ${state.children[0]} \\times ${state.children[1]} = ${missing}`)}`,
          `${displayEquation(`${missing} \\times ${state.right} = ${formatNumber(state.root)}`)} This matches the root of the tree.`,
          `Therefore, ${mathValue(`m = ${missing}`)}.`,
        ],
        speedTrick: [`Multiply the two children of the missing node first. Use the root only as a quick check.`],
      };
    }
    case "DATA_SUFFICIENCY": {
      const i = state.statementI;
      const ii = state.statementII;
      const together = i.filter((value) => ii.includes(value));
      const result = i.length === 1 && ii.length === 1
        ? "Each statement alone is sufficient"
        : i.length === 1
          ? "Statement I alone is sufficient"
          : ii.length === 1
            ? "Statement II alone is sufficient"
            : together.length === 1
              ? "Both statements together are sufficient"
              : "Even both statements together are not sufficient";
      return {
        mainRule: [`A statement is sufficient only when it leaves exactly one possible prime.`],
        steps: [
          `Statement I leaves ${mathValue(setText(i))}. Number of possibilities: ${mathNumber(i.length)}.`,
          `Statement II leaves ${mathValue(setText(ii))}. Number of possibilities: ${mathNumber(ii.length)}.`,
          `Together, the statements leave ${mathValue(setText(together))}. Number of possibilities: ${mathNumber(together.length)}.`,
          `Therefore, **${result}**.`,
        ],
        speedTrick: [`Write only the remaining candidates after each statement. A one-number set means the statement is sufficient.`],
      };
    }
    case "PRIME_ADJUSTMENT": {
      const value = state.value;
      let distance = 0;
      const searchSteps = [];
      let adjustments = [];
      while (adjustments.length === 0) {
        distance += 1;
        const lower = value - distance;
        const upper = value + distance;
        const lowerPrime = isPrime(lower);
        const upperPrime = isPrime(upper);
        searchSteps.push(`At distance ${mathNumber(distance)}: ${mathValue(`${value} - ${distance} = ${lower}`)} is ${lowerPrime ? "prime" : "composite"}, and ${mathValue(`${value} + ${distance} = ${upper}`)} is ${upperPrime ? "prime" : "composite"}.`);
        if (lowerPrime) adjustments.push(-distance);
        if (upperPrime) adjustments.push(distance);
      }
      const directionStep = adjustments.length === 2
        ? `Both directions reach a prime at the same smallest distance, so keep both changes.`
        : `Only the ${adjustments[0] < 0 ? "lower" : "upper"} number is prime at this smallest distance.`;
      return {
        mainRule: [`Check equal distances below and above the number. Keep every direction that reaches a prime at the first successful distance.`],
        steps: [
          ...searchSteps,
          directionStep,
          `The first successful distance is ${mathNumber(distance)}, so the complete set of smallest changes is ${mathValue(setText(adjustments.map((change) => change > 0 ? `+${change}` : String(change))))}.`,
        ],
        speedTrick: [`Check ${mathValue("n - 1")} and ${mathValue("n + 1")} together, then move outward only when needed.`],
      };
    }
    default:
      return null;
  }
}
