// @ts-nocheck
import * as core from "./simple-teacher-voice-core";
const {
  rawText, cleanText, mathNumber, mathValue, displayEquation, titleCaseClass,
  studentOptionDisplay, optionValues, correctIndex, gcd, isPrime, primeFactors,
  factorisationPlain, productFromFactors, digitSum, fillTemplate, setText,
  pairSetText, divisibilityEvidence, simpleDiagnostic, parseNumericOption,
  parseAdjustmentSet, parseIntegerList, smallestNonTrivialDivisor, listDifference,
} = core;

export function cp004TrapMessage(row, optionValue, tag) {
  const state = row.question.hiddenState ?? {};
  const numeric = parseNumericOption(optionValue);

  switch (state.mode) {
    case "CLASSIFY": {
      const value = Number(state.value);
      const choice = rawText(optionValue);
      if (choice === "PRIME") {
        return value === 1
          ? `${mathNumber(1)} has only one positive factor, so it is not prime.`
          : value <= 0
            ? `Prime numbers are positive integers greater than ${mathNumber(1)}, so ${mathNumber(value)} is not prime.`
            : `${mathNumber(value)} has a divisor other than ${mathNumber(1)} and itself, so it is not prime.`;
      }
      if (choice === "COMPOSITE") {
        return value <= 1
          ? `Composite numbers are positive integers greater than ${mathNumber(1)}, so ${mathNumber(value)} is not composite.`
          : `${mathNumber(value)} does not have more than two positive factors.`;
      }
      if (choice === "UNIT") return `Only ${mathNumber(1)} is the unit in this classification.`;
      return value === 1
        ? `${mathNumber(1)} has a special class: it is a unit.`
        : `${mathNumber(value)} is either prime or composite under the rule above.`;
    }
    case "INTERVAL_SET": {
      const primes = [];
      for (let n = state.lower; n <= state.upper; n += 1) if (isPrime(n)) primes.push(n);
      return `The complete prime set is ${mathValue(setText(primes))}. This option has a missing or extra number.`;
    }
    case "INTERVAL_COUNT": {
      let count = 0;
      for (let n = state.lower; n <= state.upper; n += 1) if (isPrime(n)) count += 1;
      return `There are ${mathNumber(count)} primes in the range, not ${studentOptionDisplay(optionValue)}.`;
    }
    case "ADJACENT_PRIME":
      return numeric !== null && !isPrime(numeric)
        ? `${mathNumber(numeric)} is composite, so it cannot be the required prime.`
        : `This prime is in the wrong direction or skips a nearer prime.`;
    case "DIGIT_RANGE_PRIME": {
      if (numeric === null) return `The answer must be a number in the given range.`;
      if (numeric < state.lower || numeric > state.upper) return `${mathNumber(numeric)} lies outside the given range.`;
      if (digitSum(numeric) !== state.digitSum) return `The digit sum of ${mathNumber(numeric)} is ${mathNumber(digitSum(numeric))}, not ${mathNumber(state.digitSum)}.`;
      if (!isPrime(numeric)) return `${mathNumber(numeric)} satisfies the digit condition but is composite.`;
      return `This option does not match all the conditions together.`;
    }
    case "PRIME_CLAIM": {
      const claim = state.claims.find((item) => cleanText(item.text) === cleanText(optionValue));
      if (!claim) return `The statement does not follow the prime-number rule.`;
      if (claim.value === 1) {
        return `${mathNumber(1)} has only one positive factor. A prime must have exactly two positive factors, so ${mathNumber(1)} is not prime.`;
      }
      const divisor = smallestNonTrivialDivisor(claim.value);
      if (divisor !== null) {
        return `${displayEquation(`${claim.value} = ${divisor} \\times ${claim.value / divisor}`)} Therefore, ${mathNumber(claim.value)} is composite, not prime.`;
      }
      return `${mathNumber(claim.value)} has no divisor from ${mathNumber(2)} to ${mathValue(`\\sqrt{${claim.value}}`)}, so it is prime. This option gives the wrong truth value.`;
    }
    case "FACTORISATION": {
      const correct = mathValue(factorisationPlain(primeFactors(state.value)));
      if (tag === "REPEATED_FACTOR_OMITTED") {
        return `${studentOptionDisplay(optionValue)} drops one or more repeated prime factors. The complete factorisation is ${correct}.`;
      }
      if (tag === "EXPONENT_OVERCOUNTED") {
        return `${studentOptionDisplay(optionValue)} uses an exponent that is too large. Repeated division gives ${correct}.`;
      }
      if (tag === "COMPOSITE_FACTOR_NOT_SPLIT") {
        return `${studentOptionDisplay(optionValue)} still contains a composite factor or the useless factor ${mathNumber(1)}. Prime factorisation must use primes only: ${correct}.`;
      }
      return `Multiplying and splitting every factor into primes gives ${correct}, not ${studentOptionDisplay(optionValue)}.`;
    }
    case "PRIME_FACTOR_EXTREMUM": {
      const factors = primeFactors(state.value).map((factor) => factor.prime);
      const answer = state.direction === "LARGEST" ? Math.max(...factors) : Math.min(...factors);
      return `The prime factors are ${mathValue(setText(factors))}; the required ${state.direction.toLowerCase()} one is ${mathNumber(answer)}.`;
    }
    case "DISTINCT_FACTOR_COUNT":
      return `Count only different prime bases. The factorisation has ${mathNumber(primeFactors(state.value).length)} distinct prime factors.`;
    case "MULTIPLICITY_COUNT": {
      const count = primeFactors(state.value).reduce((sum, factor) => sum + factor.exponent, 0);
      return `Add the exponents to count repeated prime factors. The total is ${mathNumber(count)}.`;
    }
    case "RECONSTRUCT_INTEGER":
      return `The prime powers must be multiplied, not added. Their product is ${mathNumber(productFromFactors(state.factors))}.`;
    case "COMPARE_STRUCTURES": {
      const metricA = state.target === "DISTINCT"
        ? state.factorsA.length
        : state.target === "MULTIPLICITY"
          ? state.factorsA.reduce((sum, factor) => sum + factor.exponent, 0)
          : productFromFactors(state.factorsA);
      const metricB = state.target === "DISTINCT"
        ? state.factorsB.length
        : state.target === "MULTIPLICITY"
          ? state.factorsB.reduce((sum, factor) => sum + factor.exponent, 0)
          : productFromFactors(state.factorsB);
      const ruleName = state.target === "DISTINCT"
        ? "distinct prime bases"
        : state.target === "MULTIPLICITY"
          ? "prime factors with repetition"
          : "numerical value";
      const correctChoice = metricA > metricB ? "A" : metricB > metricA ? "B" : "Equal";
      return `A has ${ruleName} ${mathNumber(metricA)}, while B has ${mathNumber(metricB)}. Therefore, the correct comparison is **${correctChoice}**, not **${titleCaseClass(optionValue)}**.`;
    }
    case "MISSING_PRIME":
      return `Divide out the visible prime powers. The remaining power gives the missing prime ${mathNumber(state.factors[state.hiddenIndex].prime)}.`;
    case "MISSING_EXPONENT":
      return `The prime base is already shown. Counting its repetitions gives exponent ${mathNumber(state.factors[state.hiddenIndex].exponent)}.`;
    case "SELECT_COPRIME_PAIR": {
      const pair = String(optionValue).match(/\d+/g)?.map(Number) ?? [];
      return pair.length === 2
        ? `The HCF of ${mathNumber(pair[0])} and ${mathNumber(pair[1])} is ${mathNumber(gcd(pair[0], pair[1]))}, not ${mathNumber(1)}.`
        : `Co-prime numbers must have HCF ${mathNumber(1)}.`;
    }
    case "COPRIME_SET": {
      const correctValues = state.candidates.filter((value) => gcd(state.fixed, value) === 1);
      const selected = parseIntegerList(optionValue);
      const missing = listDifference(correctValues, selected);
      const extra = listDifference(selected, correctValues);
      const details = [];
      if (missing.length > 0) details.push(`It leaves out ${mathValue(setText(missing))}, whose HCF with ${mathNumber(state.fixed)} is ${mathNumber(1)}.`);
      if (extra.length > 0) details.push(`It wrongly includes ${mathValue(setText(extra))}; these values share a factor with ${mathNumber(state.fixed)}.`);
      return `The complete co-prime set is ${mathValue(setText(correctValues))}. ${details.join(" ")}`;
    }
    case "COPRIME_COUNT": {
      const correctValues = state.candidates.filter((value) => gcd(state.fixed, value) === 1);
      return `The co-prime values are ${mathValue(setText(correctValues))}. Their count is ${mathNumber(correctValues.length)}, not ${studentOptionDisplay(optionValue)}.`;
    }
    case "COPRIME_UNKNOWN":
      return numeric !== null
        ? `The HCF of ${mathNumber(state.fixed)} and ${mathNumber(numeric)} is ${mathNumber(gcd(state.fixed, numeric))}, so they are not co-prime.`
        : `The selected value shares a factor with ${mathNumber(state.fixed)}.`;
    case "COPRIME_CLASS": {
      const [a, b, c] = state.values;
      const ab = gcd(a, b);
      const ac = gcd(a, c);
      const bc = gcd(b, c);
      const all = gcd(gcd(a, b), c);
      const pairwise = ab === 1 && ac === 1 && bc === 1;
      const collective = all === 1;
      const actual = pairwise && collective
        ? "pairwise and collectively co-prime"
        : pairwise
          ? "pairwise but not collectively co-prime"
          : collective
            ? "collectively but not pairwise co-prime"
            : "not collectively co-prime";
      return `${mathValue(`\\gcd(${a},${b})=${ab}`)}, ${mathValue(`\\gcd(${a},${c})=${ac}`)}, ${mathValue(`\\gcd(${b},${c})=${bc}`)}, and ${mathValue(`\\gcd(${a},${b},${c})=${all}`)}. Therefore, the numbers are **${actual}**, not **${cleanText(optionValue)}**.`;
    }
    case "COPRIME_CLAIM": {
      const claim = state.claims.find((item) => cleanText(item.text) === cleanText(optionValue));
      if (!claim) return `The HCF calculation does not support this statement.`;
      if (claim.kind === "PAIR") {
        const [a, b] = claim.values;
        const hcf = gcd(a, b);
        return `${mathValue(`\\gcd(${a},${b})=${hcf}`)}. The pair ${hcf === 1 ? "is" : "is not"} co-prime, so the displayed statement is false.`;
      }
      if (claim.kind === "PAIRWISE_TRIPLE") {
        const [a, b, c] = claim.values;
        return `${mathValue(`\\gcd(${a},${b})=${gcd(a,b)}`)}, ${mathValue(`\\gcd(${a},${c})=${gcd(a,c)}`)}, and ${mathValue(`\\gcd(${b},${c})=${gcd(b,c)}`)}. Since at least one HCF is greater than ${mathNumber(1)}, the triple is not pairwise co-prime.`;
      }
      return `${mathNumber(9)} and ${mathNumber(15)} are both odd, but ${mathValue("\\gcd(9,15)=3")}. Therefore, odd numbers are not always co-prime.`;
    }
    case "PRIME_PAIR": {
      const pair = parseIntegerList(optionValue);
      if (pair.length !== 2) return `The answer must be an ordered pair of two prime numbers.`;
      const [a, b] = pair;
      const failures = [];
      if (!isPrime(a)) failures.push(`${mathNumber(a)} is composite`);
      if (!isPrime(b)) failures.push(`${mathNumber(b)} is composite`);
      if (isPrime(a) && isPrime(b)) {
        const between = [];
        for (let n = a + 1; n < b; n += 1) if (isPrime(n)) between.push(n);
        if (between.length > 0) failures.push(`the prime ${mathNumber(between[0])} lies between them, so they are not consecutive`);
      }
      const relationValue = state.relation === "SUM" ? a + b : state.relation === "DIFFERENCE" ? b - a : a * b;
      if (relationValue !== state.target) failures.push(`the ${state.relation.toLowerCase()} is ${mathNumber(relationValue)}, not ${mathNumber(state.target)}`);
      return `${studentOptionDisplay(optionValue)} fails because ${failures.join("; ")}.`;
    }
    case "PRIME_TRIPLE": {
      const triple = parseIntegerList(optionValue);
      if (triple.length !== 3) return `The answer must contain three prime numbers in order.`;
      const [a, b, c] = triple;
      const failures = [];
      for (const value of triple) if (!isPrime(value)) failures.push(`${mathNumber(value)} is composite`);
      if (a !== state.first) failures.push(`the first prime must be ${mathNumber(state.first)}`);
      if (a + b + c !== state.sum) failures.push(`the sum is ${mathNumber(a + b + c)}, not ${mathNumber(state.sum)}`);
      const expected = [state.first, state.second, state.third];
      if (triple.join(",") !== expected.join(",")) failures.push(`the consecutive triple is ${mathValue(`(${expected.join(", ")})`)}`);
      return `${studentOptionDisplay(optionValue)} fails because ${[...new Set(failures)].join("; ")}.`;
    }
    case "LEAST_PRIME_DIVISOR": {
      if (numeric === null) return `The least prime divisor must be a prime number.`;
      const least = primeFactors(state.value)[0].prime;
      if (numeric === 1) return `${mathNumber(1)} is not prime, so it cannot be a prime divisor.`;
      const remainder = state.value % numeric;
      if (remainder !== 0) return `${displayEquation(`${state.value} = ${numeric} \\times ${Math.floor(state.value / numeric)} + ${remainder}`)} So ${mathNumber(numeric)} is not even a divisor.`;
      return `${displayEquation(`${state.value} \\div ${numeric} = ${state.value / numeric}`)} The division is exact, but ${mathNumber(least)} is the smaller prime divisor and must be chosen first.`;
    }
    case "EXPRESSION_PRIME_DIVISOR": {
      const value = state.a + state.b;
      if (numeric !== null) return `${mathNumber(value)} leaves remainder ${mathNumber(value % numeric)} when divided by ${mathNumber(numeric)}.`;
      return `Substitute first, then check exact division.`;
    }
    case "FEASIBILITY": {
      if (tag === "EVEN_PRIME_EXCEPTION_EXTENDED") {
        return `${mathNumber(2)} is the only even prime. Every even number greater than ${mathNumber(2)} is divisible by ${mathNumber(2)}, so it is composite.`;
      }
      if (tag === "COMPOSITE_WITHOUT_FACTOR_ACCEPTED") {
        return `Every composite positive integer is made from prime factors. A composite number with no prime factor is impossible.`;
      }
      if (tag === "PRODUCT_OF_PRIMES_TREATED_AS_PRIME") {
        return `For primes ${mathValue("p")} and ${mathValue("q")}, the product ${mathValue("pq")} is divisible by both ${mathValue("p")} and ${mathValue("q")}; therefore it is composite.`;
      }
      return `The displayed statement contradicts a basic prime-number rule.`;
    }
    case "FACTOR_TREE":
      return `The missing node is the product ${mathNumber(state.children[0])} × ${mathNumber(state.children[1])} = ${mathNumber(state.children[0] * state.children[1])}.`;
    case "DATA_SUFFICIENCY": {
      const i = state.statementI;
      const ii = state.statementII;
      const together = i.filter((value) => ii.includes(value));
      const actual = i.length === 1 && ii.length === 1
        ? "Each statement alone is sufficient"
        : i.length === 1
          ? "Statement I alone is sufficient"
          : ii.length === 1
            ? "Statement II alone is sufficient"
            : together.length === 1
              ? "Both statements together are sufficient"
              : "Even both statements together are not sufficient";
      return `Statement I leaves ${mathValue(setText(i))}; Statement II leaves ${mathValue(setText(ii))}; together they leave ${mathValue(setText(together))}. Therefore, **${actual}**, not **${cleanText(optionValue)}**.`;
    }
    case "PRIME_ADJUSTMENT": {
      const changes = parseAdjustmentSet(optionValue);
      let distance = 1;
      let correctChanges = [];
      while (correctChanges.length === 0) {
        if (isPrime(state.value - distance)) correctChanges.push(-distance);
        if (isPrime(state.value + distance)) correctChanges.push(distance);
        if (correctChanges.length === 0) distance += 1;
      }
      const checks = changes.map((change) => ({
        change,
        result: state.value + change,
        prime: isPrime(state.value + change),
      }));
      const checkText = checks.map((item) =>
        `${mathValue(`${state.value} ${item.change >= 0 ? "+" : "-"} ${Math.abs(item.change)} = ${item.result}`)} is ${item.prime ? "prime" : "composite"}`).join("; ");
      const sameDistanceMissing = changes.length < correctChanges.length
        && changes.every((change) => correctChanges.includes(change));
      if (sameDistanceMissing) {
        const missing = correctChanges.filter((change) => !changes.includes(change));
        return `${checkText}. The option misses the equally small change ${mathValue(setText(missing.map((change) => change > 0 ? `+${change}` : String(change))))}.`;
      }
      return `${checkText}. The first successful distance is ${mathNumber(distance)}, so the complete answer is ${mathValue(setText(correctChanges.map((change) => change > 0 ? `+${change}` : String(change))))}.`;
    }
    default:
      return `This option does not match the calculation shown in the solution.`;
  }
}
