import type { NumCp008PermanentPackage } from "./permanent-runtime.ts";

type State = Readonly<Record<string, unknown>>;
type Constraint = Readonly<{ residue: number; modulus: number }>;
type Explanation = NumCp008PermanentPackage["explanation"];

function integer(state: State, key: string): number {
  const value = state[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    throw new Error(`NUM-CP-008 English explanation V3 expected integer ${key}`);
  }
  return value;
}

function integerArray(state: State, key: string): number[] {
  const value = state[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isSafeInteger(item))) {
    throw new Error(`NUM-CP-008 English explanation V3 expected integer array ${key}`);
  }
  return [...value] as number[];
}

function constraintsFrom(value: unknown): Constraint[] {
  if (!Array.isArray(value)) throw new Error("NUM-CP-008 English explanation V3 expected constraints");
  return value.map((item) => {
    if (!item || typeof item !== "object") throw new Error("NUM-CP-008 English explanation V3 malformed constraint");
    const row = item as Readonly<Record<string, unknown>>;
    if (typeof row.residue !== "number" || typeof row.modulus !== "number") {
      throw new Error("NUM-CP-008 English explanation V3 malformed constraint values");
    }
    return { residue: row.residue, modulus: row.modulus };
  });
}

function constraints(state: State): Constraint[] {
  return constraintsFrom(state.constraints);
}

function mod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function inverse(a: number, modulus: number): number | undefined {
  for (let x = 1; x < modulus; x += 1) {
    if (mod(a * x, modulus) === 1) return x;
  }
  return undefined;
}

function explain(coreConcept: string, strategy: string, steps: readonly string[], finalAnswer: string): Explanation {
  return Object.freeze({
    coreConcept,
    strategy,
    steps: Object.freeze([...steps]),
    finalAnswer,
  });
}

function divisionSentence(value: number, divisor: number): string {
  const remainder = mod(value, divisor);
  const quotient = (value - remainder) / divisor;
  return `${value} = ${quotient} × ${divisor} + ${remainder}`;
}

function findFirstTwoResidue(items: readonly Constraint[]): Readonly<{ residue: number; period: number }> {
  const first = items[0]!;
  const second = items[1]!;
  const period = lcm(first.modulus, second.modulus);
  for (let x = 0; x < period; x += 1) {
    if (mod(x, first.modulus) === first.residue && mod(x, second.modulus) === second.residue) {
      return { residue: x, period };
    }
  }
  throw new Error("NUM-CP-008 English explanation V3 expected compatible first two conditions");
}

function valuesForCondition(lower: number, upper: number, residue: number, modulus: number): number[] {
  const first = lower + mod(residue - lower, modulus);
  if (first > upper) return [];
  const out: number[] = [];
  for (let value = first; value <= upper; value += modulus) out.push(value);
  return out;
}

function formatValues(values: readonly number[], max = 10): string {
  if (values.length === 0) return "none";
  if (values.length <= max) return values.join(", ");
  return `${values.slice(0, 5).join(", ")}, ..., ${values.slice(-2).join(", ")}`;
}

function powerExplanation(base: number, exponent: number, divisor: number, answer: number): Explanation {
  const baseRemainder = mod(base, divisor);
  if (exponent === 0) {
    return explain(
      "Any non-zero number raised to power 0 equals 1.",
      `We need the remainder of ${base}^0 on division by ${divisor}, so no large calculation is required.`,
      [
        `${base}^0 = 1.`,
        `${divisionSentence(1, divisor)}. Therefore the remainder is ${answer}.`,
      ],
      String(answer),
    );
  }

  if (baseRemainder === 0) {
    return explain(
      "If the base is exactly divisible by the divisor, every positive power of that base is also divisible by it.",
      `We are given ${base}^${exponent} and divisor ${divisor}. First check the base itself.`,
      [
        `${divisionSentence(base, divisor)}, so ${base} is divisible by ${divisor}.`,
        `Therefore ${base}^${exponent} is also divisible by ${divisor}, and its remainder is ${answer}.`,
      ],
      String(answer),
    );
  }

  const squareRows: string[] = [];
  const selected: { power: number; residue: number }[] = [];
  let residue = baseRemainder;
  let power = 1;
  while (power <= exponent) {
    if (power > 1) squareRows.push(`${base}^${power} → remainder ${residue}`);
    if ((exponent & power) !== 0) selected.push({ power, residue });
    residue = mod(residue * residue, divisor);
    power *= 2;
  }

  const powers = selected.map((item) => item.power).reverse();
  const chosen = selected.map((item) => item.residue).reverse();
  let combined = 1;
  for (const item of chosen) combined = mod(combined * item, divisor);

  return explain(
    "For a large power, we can repeatedly square the remainder instead of calculating the full number.",
    `We need the remainder of ${base}^${exponent} on division by ${divisor}. First reduce the base, then build only the powers needed for ${exponent}.`,
    [
      `${divisionSentence(base, divisor)}, so we can work with remainder ${baseRemainder}.`,
      `Repeated squaring gives ${squareRows.length ? squareRows.join("; ") : `${base}^1 → remainder ${baseRemainder}`}.`,
      `${exponent} = ${powers.join(" + ")}, so multiply the corresponding remainders ${chosen.join(" × ")} and reduce after each multiplication.`,
      `That gives remainder ${combined}, so the required remainder is ${answer}.`,
    ],
    String(answer),
  );
}

function geometricSumExplanation(base: number, highestExponent: number, divisor: number, answer: number): Explanation {
  const factor = base - 1;
  const factorInverse = gcd(factor, divisor) === 1 ? inverse(factor, divisor) : undefined;

  if (factor > 0 && factorInverse !== undefined) {
    let powerRemainder = 1;
    for (let i = 0; i < highestExponent + 1; i += 1) {
      powerRemainder = mod(powerRemainder * base, divisor);
    }
    const numeratorRemainder = mod(powerRemainder - 1, divisor);
    const final = mod(numeratorRemainder * factorInverse, divisor);
    return explain(
      "This is a geometric sum. Multiplying it by one less than the base makes the middle terms cancel.",
      `Let S = 1 + ${base} + ${base}^2 + ... + ${base}^${highestExponent}. We need only its remainder on division by ${divisor}.`,
      [
        `${factor}S = ${base}^${highestExponent + 1} − 1.`,
        `${base}^${highestExponent + 1} leaves remainder ${powerRemainder}, so ${factor}S leaves remainder ${numeratorRemainder}.`,
        `${factor} × ${factorInverse} leaves remainder 1 when divided by ${divisor}; multiplying by ${factorInverse} therefore isolates S.`,
        `${numeratorRemainder} × ${factorInverse} leaves remainder ${final}. Hence S leaves remainder ${answer}.`,
      ],
      String(answer),
    );
  }

  const termCount = highestExponent + 1;
  const seen = new Map<number, number>();
  const sequence: number[] = [];
  let current = 1;
  while (!seen.has(current)) {
    seen.set(current, sequence.length);
    sequence.push(current);
    current = mod(current * base, divisor);
  }
  const cycleStart = seen.get(current)!;

  if (termCount <= sequence.length) {
    const used = sequence.slice(0, termCount);
    const total = mod(used.reduce((sum, value) => sum + value, 0), divisor);
    return explain(
      "Keep only the remainder of each power and add those small remainders.",
      `There are ${termCount} terms from ${base}^0 to ${base}^${highestExponent}. We never need the full powers.`,
      [
        `The power remainders are ${used.join(", ")}.`,
        `Their sum is ${used.reduce((sum, value) => sum + value, 0)}, which leaves remainder ${total} when divided by ${divisor}.`,
        `Therefore the required remainder is ${answer}.`,
      ],
      String(answer),
    );
  }

  const prefix = sequence.slice(0, cycleStart);
  const cycle = sequence.slice(cycleStart);
  const remaining = termCount - prefix.length;
  const fullCycles = Math.floor(remaining / cycle.length);
  const tailCount = remaining % cycle.length;
  const cycleSum = cycle.reduce((sum, value) => sum + value, 0);
  const tailSum = cycle.slice(0, tailCount).reduce((sum, value) => sum + value, 0);
  const prefixSum = prefix.reduce((sum, value) => sum + value, 0);
  const total = mod(prefixSum + mod(fullCycles * cycleSum, divisor) + tailSum, divisor);

  return explain(
    "The remainders of successive powers eventually repeat, so we can add them cycle by cycle.",
    `There are ${termCount} terms. We find the short remainder cycle instead of calculating every power.`,
    [
      `The repeating power remainders are ${cycle.join(", ")}${prefix.length ? ` after the starting part ${prefix.join(", ")}` : ""}.`,
      `One cycle has ${cycle.length} terms and sum ${cycleSum}. After the starting part, there are ${fullCycles} complete cycles and ${tailCount} extra term${tailCount === 1 ? "" : "s"}.`,
      `The combined sum leaves remainder ${total} when divided by ${divisor}.`,
      `Therefore the required remainder is ${answer}.`,
    ],
    String(answer),
  );
}

function richerExplanation(q: NumCp008PermanentPackage): Explanation {
  const s = q.hiddenState as State;
  const answer = q.canonicalAnswer;

  switch (q.temporaryPrototypeId) {
    case "NUM-CP008-PROT-001": {
      const value = integer(s, "raw");
      const divisor = integer(s, "modulus");
      const remainder = integer(s, "residue");
      return explain(
        "A valid remainder must be from 0 to one less than the divisor.",
        `We are given ${value} and divisor ${divisor}. We need the valid remainder after division.`,
        value >= 0
          ? [
              `${divisionSentence(value, divisor)}.`,
              `This means ${Math.trunc((value - remainder) / divisor)} complete groups of ${divisor} can be removed and ${remainder} is left.`,
              `So the required remainder is ${remainder}.`,
            ]
          : [
              `${divisionSentence(value, divisor)}.`,
              `The number multiplying ${divisor} may be negative; what matters is that the remainder ${remainder} lies from 0 to ${divisor - 1}.`,
              `So the valid remainder is ${remainder}.`,
            ],
        answer,
      );
    }

    case "NUM-CP008-PROT-002": {
      const a = integer(s, "a");
      const b = integer(s, "b");
      const divisor = integer(s, "modulus");
      const raw = integer(s, "raw");
      const remainder = integer(s, "residue");
      const operation = String(s.operation);
      const symbol = operation === "SUM" ? "+" : operation === "DIFFERENCE" ? "−" : "×";
      return explain(
        "When two numbers are divided by the same divisor, their remainders are enough to find the remainder of their sum, difference or product.",
        `A leaves ${a} and B leaves ${b} on division by ${divisor}. We need the remainder of A ${symbol} B.`,
        [
          `Use the given remainders: ${a} ${symbol} ${b} = ${raw}.`,
          `${divisionSentence(raw, divisor)}.`,
          `Therefore A ${symbol} B leaves remainder ${remainder}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-003":
      return powerExplanation(integer(s, "base"), integer(s, "exponent"), integer(s, "modulus"), integer(s, "residue"));

    case "NUM-CP008-PROT-004": {
      const a = integer(s, "a");
      const b = integer(s, "b");
      const divisor = integer(s, "modulus");
      const solution = integer(s, "solution");
      const inv = inverse(a, divisor);
      if (inv === undefined) return q.explanation;
      const product = b * inv;
      return explain(
        "We want to undo the multiplication by the coefficient without changing the remainder condition.",
        `We need the least positive x for which ${a}x leaves remainder ${b} on division by ${divisor}.`,
        [
          `Find a small number that turns ${a} into remainder 1: ${a} × ${inv} leaves remainder 1 when divided by ${divisor}.`,
          `Multiply the required remainder by the same number: ${b} × ${inv} = ${product}.`,
          `${divisionSentence(product, divisor)}, so x must leave remainder ${solution}.`,
          `The least positive such value is x = ${solution}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-005": {
      const a = integer(s, "a");
      const b = integer(s, "b");
      const divisor = integer(s, "modulus");
      const d = integer(s, "gcd");
      const solutions = integerArray(s, "solutions");
      const reducedA = a / d;
      const reducedB = b / d;
      const reducedDivisor = divisor / d;
      const inv = inverse(reducedA, reducedDivisor);
      const base = inv === undefined ? solutions[0]! : mod(reducedB * inv, reducedDivisor);
      return explain(
        "A common factor of the coefficient and divisor can give several x-values in one complete range.",
        `We need all x from 0 to ${divisor - 1} for which ${a}x leaves remainder ${b} on division by ${divisor}.`,
        [
          `HCF(${a}, ${divisor}) = ${d}. Since ${d} divides ${b}, solutions are possible.`,
          `Divide the whole condition by ${d}: ${reducedA}x must leave remainder ${reducedB} when divided by ${reducedDivisor}. This gives the basic solution x = ${base}.`,
          `The solutions are ${reducedDivisor} apart inside 0 to ${divisor - 1}: ${solutions.join(", ")}.`,
          `Hence the number of valid values is ${solutions.length}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-006": {
      const a = integer(s, "a");
      const b = integer(s, "b");
      const divisor = integer(s, "modulus");
      const d = integer(s, "gcd");
      return explain(
        "For ax to leave a given remainder, the HCF of a and the divisor must also divide that remainder.",
        `We are checking whether ${a}x can leave remainder ${b} on division by ${divisor}.`,
        [
          `HCF(${a}, ${divisor}) = ${d}.`,
          `Every value of ${a}x is divisible by ${d}, and ${divisor} is also divisible by ${d}. Therefore any possible remainder must be divisible by ${d}.`,
          `${b} is not divisible by ${d}.`,
          `So no integer x can satisfy the condition.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-007": {
      const r1 = integer(s, "r1");
      const m1 = integer(s, "m1");
      const r2 = integer(s, "r2");
      const m2 = integer(s, "m2");
      const period = integer(s, "period");
      const solutionResidue = integer(s, "solutionResidue");
      const least = solutionResidue === 0 ? period : solutionResidue;
      const k = (least - r1) / m1;
      const needed = mod(r2 - r1, m2);
      return explain(
        "Write all numbers satisfying the first remainder condition, then choose the first one that also satisfies the second.",
        `We need the least positive x that leaves ${r1} on division by ${m1} and ${r2} on division by ${m2}.`,
        [
          `Numbers satisfying the first condition are x = ${r1} + ${m1}k.`,
          `For the second condition, ${m1}k must leave remainder ${needed} when divided by ${m2}. The smallest suitable k is ${k}.`,
          `So x = ${r1} + ${m1} × ${k} = ${least}.`,
          `Check: ${least} leaves remainders ${mod(least, m1)} and ${mod(least, m2)} respectively, so it satisfies both conditions.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-008": {
      const r1 = integer(s, "r1");
      const m1 = integer(s, "m1");
      const r2 = integer(s, "r2");
      const m2 = integer(s, "m2");
      const d = integer(s, "gcd");
      return explain(
        "Two remainder conditions can have a common number only if their remainders agree when checked against the HCF of the divisors.",
        `We need to decide whether one integer can leave ${r1} on division by ${m1} and ${r2} on division by ${m2}.`,
        [
          `HCF(${m1}, ${m2}) = ${d}.`,
          `${r1} leaves remainder ${mod(r1, d)} when divided by ${d}, while ${r2} leaves remainder ${mod(r2, d)}.`,
          `These do not agree, so the two conditions contradict each other.`,
          `Therefore no integer can satisfy both conditions.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-009": {
      const lower = integer(s, "lower");
      const upper = integer(s, "upper");
      const residue = integer(s, "residue");
      const divisor = integer(s, "modulus");
      const first = integer(s, "first");
      const last = integer(s, "last");
      const direction = String(s.direction);
      const firstK = (first - residue) / divisor;
      const lastK = (last - residue) / divisor;
      const wanted = direction === "LEAST" ? first : last;
      return explain(
        "All numbers leaving the same remainder differ by exactly the divisor.",
        `We need the ${direction === "LEAST" ? "least" : "greatest"} number from ${lower} to ${upper} that leaves remainder ${residue} on division by ${divisor}.`,
        [
          `Such numbers have the form ${residue} + ${divisor}k.`,
          `The first one inside the range is ${residue} + ${divisor} × ${firstK} = ${first}.`,
          `The last one inside the range is ${residue} + ${divisor} × ${lastK} = ${last}.`,
          `The question asks for the ${direction === "LEAST" ? "least" : "greatest"}, so the answer is ${wanted}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-010": {
      const lower = integer(s, "lower");
      const upper = integer(s, "upper");
      const residue = integer(s, "residue");
      const divisor = integer(s, "modulus");
      const first = integer(s, "first");
      const last = integer(s, "last");
      const count = integer(s, "count");
      return explain(
        "Numbers with a fixed remainder form an arithmetic progression whose common difference is the divisor.",
        `We need to count the integers from ${lower} to ${upper} that leave remainder ${residue} on division by ${divisor}.`,
        [
          `The first valid number is ${first}, and the last valid number is ${last}.`,
          `The valid list is ${first}, ${first + divisor}, ${first + 2 * divisor}, ... , ${last}; the gap is ${divisor}.`,
          `Number of terms = (${last} − ${first}) ÷ ${divisor} + 1 = ${count}.`,
          `Therefore there are ${count} valid integers.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-011": {
      const lower = integer(s, "lower");
      const upper = integer(s, "upper");
      const items = constraints(s);
      const period = integer(s, "period");
      const solutions = integerArray(s, "solutions");
      const first = solutions[0];
      return explain(
        "After several compatible remainder conditions are combined, all common solutions repeat after a fixed gap.",
        `We need every integer from ${lower} to ${upper} that satisfies ${items.length} remainder conditions at the same time.`,
        [
          `The combined pattern repeats every ${period}, the LCM-based common period of the conditions.`,
          first !== undefined
            ? `The first common value in the range is ${first}; checking it gives remainders ${items.map((item) => mod(first, item.modulus)).join(", ")} as required.`
            : "There is no common value inside the given range.",
          solutions.length
            ? `Adding ${period} repeatedly gives all values in the interval: ${solutions.join(", ")}.`
            : "So the required set is empty.",
          `Therefore the complete set is ${answer}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-012": {
      const x = integer(s, "x");
      const b = integer(s, "b");
      const divisor = integer(s, "modulus");
      const coefficient = integer(s, "coefficient");
      const product = coefficient * x;
      return explain(
        "With only a few answer choices, direct substitution is the quickest and clearest method.",
        `We know x = ${x}. We need the value of a for which a × ${x} leaves remainder ${b} on division by ${divisor}.`,
        [
          `Test a = ${coefficient}: ${coefficient} × ${x} = ${product}.`,
          `${divisionSentence(product, divisor)}.`,
          `The remainder is ${b}, exactly as required.`,
          `So a = ${coefficient}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-013": {
      const value = integer(s, "value");
      const residue = integer(s, "residue");
      const difference = integer(s, "difference");
      const divisor = integer(s, "modulus");
      return explain(
        "If a number leaves remainder r, then number − r must be exactly divisible by the divisor.",
        `We know ${value} leaves remainder ${residue} when divided by m. We need to identify m from the choices.`,
        [
          `${value} − ${residue} = ${difference}. Therefore m must be a factor of ${difference}.`,
          `Also, a divisor must be greater than its remainder, so m > ${residue}.`,
          `${divisor} satisfies both conditions: ${difference} ÷ ${divisor} = ${difference / divisor}.`,
          `Hence m = ${divisor}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-014":
      return geometricSumExplanation(integer(s, "base"), integer(s, "highestExponent"), integer(s, "modulus"), integer(s, "residue"));

    case "NUM-CP008-PROT-015": {
      const items = constraints(s);
      const pair = findFirstTwoResidue(items);
      const period = integer(s, "period");
      const residue = integer(s, "residue");
      const least = residue === 0 ? period : residue;
      const pairLeast = pair.residue === 0 ? pair.period : pair.residue;
      const k = (least - pair.residue) / pair.period;
      return explain(
        "For three compatible remainder conditions, combine two first and then apply the third to that repeating list.",
        `We need the least positive integer satisfying all three given remainder conditions.`,
        [
          `The first two conditions combine to x = ${pair.residue} + ${pair.period}k; the first positive value in that list is ${pairLeast}.`,
          `Now impose the third condition: the smallest suitable k is ${k}, giving x = ${pair.residue} + ${pair.period} × ${k} = ${least}.`,
          `Check: ${least} leaves remainders ${items.map((item) => mod(least, item.modulus)).join(", ")} on division by ${items.map((item) => item.modulus).join(", ")} respectively.`,
          `All three conditions are satisfied, so the least positive value is ${least}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-016": {
      const items = constraints(s);
      const firstTwoResidue = integer(s, "firstTwoResidue");
      const firstTwoPeriod = integer(s, "firstTwoPeriod");
      const d = integer(s, "compatibilityGcd");
      const third = items[2]!;
      return explain(
        "After the first two conditions are combined, the third condition must agree with that combined pattern on their common factor.",
        `We are checking whether all three remainder conditions can hold for the same integer.`,
        [
          `The first two conditions combine to numbers leaving remainder ${firstTwoResidue} when divided by ${firstTwoPeriod}.`,
          `HCF(${firstTwoPeriod}, ${third.modulus}) = ${d}.`,
          `The combined remainder gives ${mod(firstTwoResidue, d)} on division by ${d}, but the third remainder gives ${mod(third.residue, d)}.`,
          `They disagree, so no integer can satisfy all three conditions.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-017": {
      const least = integer(s, "least");
      const m2 = integer(s, "m2");
      const missing = integer(s, "missingResidue");
      return explain(
        "The given least solution itself tells us the missing remainder.",
        `The number ${least} is known to satisfy the condition involving divisor ${m2}. We only need its remainder on that division.`,
        [
          `${divisionSentence(least, m2)}.`,
          `The part left after complete groups of ${m2} is ${missing}.`,
          `Therefore r = ${missing}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-018": {
      const base = integer(s, "baseValue");
      const exponent = integer(s, "exponent");
      const add = integer(s, "add");
      const innerDivisor = integer(s, "innerModulus");
      const multiplier = integer(s, "multiplier");
      const shift = integer(s, "shift");
      const outerDivisor = integer(s, "outerModulus");
      const powerRemainder = integer(s, "powerResidue");
      const y = integer(s, "inner");
      const result = integer(s, "answer");
      return explain(
        "This is a two-stage question: first find y, then substitute that value into the outer expression.",
        `We first need the remainder of ${base}^${exponent} + ${add} on division by ${innerDivisor}; that remainder is y.`,
        [
          `${base}^${exponent} leaves remainder ${powerRemainder} when divided by ${innerDivisor}.`,
          `After adding ${add}, ${powerRemainder} + ${add} = ${powerRemainder + add}, which leaves remainder ${y}; hence y = ${y}.`,
          `Now ${multiplier}y + ${shift} = ${multiplier} × ${y} + ${shift} = ${multiplier * y + shift}.`,
          `${divisionSentence(multiplier * y + shift, outerDivisor)}, so the final remainder is ${result}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-019": {
      const items = constraints(s);
      const candidate = integer(s, "answer");
      const checks = items.map((item) => {
        const actual = mod(candidate, item.modulus);
        const quotient = (candidate - actual) / item.modulus;
        return `${candidate} = ${quotient} × ${item.modulus} + ${actual}, so it leaves remainder ${actual} when divided by ${item.modulus}.`;
      });
      return explain(
        "A correct candidate must satisfy every remainder condition, not just one of them.",
        `We test the answer choices against all ${items.length} divisors. The candidate ${candidate} is the one that passes every check.`,
        [
          ...checks,
          `All required remainders match, so ${candidate} is the correct choice.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-020": {
      const common = integer(s, "commonRemainder");
      const m1 = integer(s, "m1");
      const m2 = integer(s, "m2");
      const m3 = integer(s, "m3");
      const different = integer(s, "differentRemainder");
      const result = integer(s, "answer");
      const basePeriod = lcm(m1, m2);
      const k = (result - common) / basePeriod;
      return explain(
        "When two divisors have the same required remainder, combine them first using their LCM.",
        `We need x to leave remainder ${common} on division by both ${m1} and ${m2}, and remainder ${different} on division by ${m3}.`,
        [
          `LCM(${m1}, ${m2}) = ${basePeriod}, so the first two conditions combine to x = ${common} + ${basePeriod}k.`,
          `The smallest k that makes this number leave remainder ${different} on division by ${m3} is ${k}.`,
          `Therefore x = ${common} + ${basePeriod} × ${k} = ${result}.`,
          `Check: ${result} leaves remainders ${mod(result, m1)}, ${mod(result, m2)} and ${mod(result, m3)} respectively, so all conditions are satisfied.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-021": {
      const statements = s.statements as readonly Readonly<Record<string, unknown>>[];
      const truth = s.truth as readonly boolean[];
      const steps = statements.map((row, index) => {
        const candidate = Number(row.candidate);
        const required = Number(row.residue);
        const divisor = Number(row.modulus);
        const actual = mod(candidate, divisor);
        const quotient = (candidate - actual) / divisor;
        return `Statement ${["I", "II", "III"][index]}: ${candidate} = ${quotient} × ${divisor} + ${actual}. Required remainder = ${required}, so the statement is ${truth[index] ? "true" : "false"}.`;
      });
      return explain(
        "Each statement can be checked directly by division.",
        "The question asks which statements are correct, so we test I, II and III separately and compare the actual remainder with the stated one.",
        [
          ...steps,
          `Hence ${answer}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-022": {
      const lower = integer(s, "lower");
      const upper = integer(s, "upper");
      const one = s.statementI as Readonly<Record<string, unknown>>;
      const two = s.statementII as Readonly<Record<string, unknown>>;
      const r1 = Number(one.residue);
      const m1 = Number(one.modulus);
      const r2 = Number(two.residue);
      const m2 = Number(two.modulus);
      const values1 = valuesForCondition(lower, upper, r1, m1);
      const values2 = valuesForCondition(lower, upper, r2, m2);
      const set2 = new Set(values2);
      const both = values1.filter((value) => set2.has(value));
      return explain(
        "In Data Sufficiency, a statement is sufficient only when it fixes exactly one possible value of x.",
        `x lies from ${lower} to ${upper}. We list the values allowed by Statement I, Statement II and then both together.`,
        [
          `Statement I allows ${values1.length} value${values1.length === 1 ? "" : "s"}: ${formatValues(values1)}.`,
          `Statement II allows ${values2.length} value${values2.length === 1 ? "" : "s"}: ${formatValues(values2)}.`,
          `Using both statements leaves ${both.length} value${both.length === 1 ? "" : "s"}: ${formatValues(both)}.`,
          `Therefore ${answer}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-023": {
      const digit = integer(s, "digit");
      const length = integer(s, "length");
      const divisor = integer(s, "modulus");
      const result = integer(s, "answer");
      const sequence: number[] = [];
      let current = 0;
      for (let index = 0; index < length; index += 1) {
        current = mod(current * 10 + digit, divisor);
        sequence.push(current);
      }
      return explain(
        "Build the repeated-digit number one digit at a time, keeping only the remainder after each new digit.",
        `The number contains ${length} copies of digit ${digit}. We need its remainder on division by ${divisor}, without constructing a huge integer.`,
        [
          `Appending a digit changes a number N to 10N + ${digit}. So each new remainder is found from 10 × (previous remainder) + ${digit}.`,
          `The successive remainders are ${sequence.join(" → ")}.`,
          `After all ${length} digits, the remainder is ${result}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-024": {
      const lower = integer(s, "lower");
      const upper = integer(s, "upper");
      const period = integer(s, "period");
      const residue = integer(s, "residue");
      const count = integer(s, "answer");
      const first = lower + mod(residue - lower, period);
      const last = count > 0 ? first + (count - 1) * period : first;
      return explain(
        "Several compatible remainder conditions combine into one repeating arithmetic progression.",
        `We need to count the common solutions from ${lower} to ${upper}. The combined repeat gap is ${period}.`,
        count === 0
          ? [
              `The first value in the combined progression at or above ${lower} would be ${first}, which is beyond ${upper}.`,
              "So no common solution lies inside the interval.",
              "Therefore the answer is 0.",
            ]
          : [
              `The first common value in the interval is ${first}.`,
              `Each next common value is ${period} larger, so the last one is ${last}.`,
              `Number of common values = (${last} − ${first}) ÷ ${period} + 1 = ${count}.`,
              `Therefore the answer is ${count}.`,
            ],
        answer,
      );
    }

    case "NUM-CP008-PROT-025": {
      const items = constraints(s);
      const solutions = integerArray(s, "canonicalSolutions");
      const merged = s.merged as Readonly<Record<string, unknown>> | null;

      if (!merged) {
        let conflict: Readonly<{ left: Constraint; right: Constraint; d: number }> | undefined;
        for (let i = 0; i < items.length && !conflict; i += 1) {
          for (let j = i + 1; j < items.length; j += 1) {
            const left = items[i]!;
            const right = items[j]!;
            const d = gcd(left.modulus, right.modulus);
            if (mod(left.residue - right.residue, d) !== 0) {
              conflict = { left, right, d };
              break;
            }
          }
        }
        return explain(
          "Before counting solutions in the interval, first check whether the remainder conditions can coexist at all.",
          "These conditions are incompatible, so the interval cannot contain any common solution.",
          conflict
            ? [
                `For divisors ${conflict.left.modulus} and ${conflict.right.modulus}, HCF = ${conflict.d}.`,
                `The required remainders ${conflict.left.residue} and ${conflict.right.residue} disagree when checked against ${conflict.d}.`,
                "Therefore no integer can satisfy all the conditions, so the number of solutions is 0.",
                `Hence ${answer}.`,
              ]
            : [
                "The remainder conditions contradict one another, so no common integer exists.",
                `Therefore the interval contains 0 solutions and ${answer}.`,
              ],
          answer,
        );
      }

      const period = Number(merged.period);
      return explain(
        "Compatible remainder conditions produce a repeating list; the number of entries inside the interval determines the classification.",
        `The combined pattern repeats every ${period}. We now keep only the common values that lie in the stated interval.`,
        [
          solutions.length
            ? `The common values in the interval are ${solutions.join(", ")}.`
            : "No common value falls inside the interval.",
          `So the interval contains ${solutions.length} solution${solutions.length === 1 ? "" : "s"}.`,
          `Therefore ${answer}.`,
        ],
        answer,
      );
    }

    case "NUM-CP008-PROT-026": {
      const lower = integer(s, "lower");
      const upper = integer(s, "upper");
      const solutions = integerArray(s, "canonicalSolutions");
      const merged = s.merged as Readonly<Record<string, unknown>>;
      const period = Number(merged.period);
      return explain(
        "Once the combined remainder pattern is known, every later common solution is separated by the same fixed gap.",
        `We need the complete set of common solutions from ${lower} to ${upper}. The repeat gap is ${period}.`,
        [
          solutions.length
            ? `The first common value in the interval is ${solutions[0]}.`
            : "There is no common value in the interval.",
          solutions.length
            ? `Adding ${period} repeatedly and stopping at ${upper} gives ${solutions.join(", ")}.`
            : "Therefore the required set is empty.",
          `Hence the complete set is ${answer}.`,
        ],
        answer,
      );
    }

    default:
      return q.explanation;
  }
}

export function applyNumCp008EnglishExplanationHumanV3(q: NumCp008PermanentPackage): NumCp008PermanentPackage {
  return Object.freeze({
    ...q,
    explanation: richerExplanation(q),
  }) as NumCp008PermanentPackage;
}
