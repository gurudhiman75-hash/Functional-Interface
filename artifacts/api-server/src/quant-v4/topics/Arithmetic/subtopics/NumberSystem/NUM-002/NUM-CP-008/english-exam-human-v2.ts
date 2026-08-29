import type { NumCp008PermanentPackage } from "./permanent-runtime.ts";

type State = Readonly<Record<string, unknown>>;
type Constraint = Readonly<{ residue: number; modulus: number }>;

type Explanation = NumCp008PermanentPackage["explanation"];

function n(state: State, key: string): number {
  const value = state[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error(`NUM-CP-008 English V2 expected integer ${key}`);
  return value;
}

function text(state: State, key: string): string {
  const value = state[key];
  if (typeof value !== "string") throw new Error(`NUM-CP-008 English V2 expected string ${key}`);
  return value;
}

function nums(state: State, key: string): number[] {
  const value = state[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isSafeInteger(item))) {
    throw new Error(`NUM-CP-008 English V2 expected integer array ${key}`);
  }
  return [...value] as number[];
}

function constraintsFrom(value: unknown): Constraint[] {
  if (!Array.isArray(value)) throw new Error("NUM-CP-008 English V2 expected constraints array");
  return value.map((item) => {
    if (!item || typeof item !== "object") throw new Error("NUM-CP-008 English V2 malformed constraint");
    const row = item as Readonly<Record<string, unknown>>;
    if (typeof row.residue !== "number" || typeof row.modulus !== "number") throw new Error("NUM-CP-008 English V2 malformed constraint values");
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
  for (let x = 1; x < modulus; x += 1) if (mod(a * x, modulus) === 1) return x;
  return undefined;
}

function remainderCondition(item: Constraint): string {
  return `leaves remainder ${item.residue} when divided by ${item.modulus}`;
}

function joinedConditions(items: readonly Constraint[]): string {
  const parts = items.map(remainderCondition);
  if (parts.length === 1) return parts[0]!;
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts.at(-1)}`;
}

function explanation(coreConcept: string, strategy: string, steps: readonly string[], finalAnswer: string): Explanation {
  return Object.freeze({
    coreConcept,
    strategy,
    steps: Object.freeze([...steps]),
    finalAnswer,
  });
}

function powerWork(baseValue: number, exponent: number, modulus: number, answer: number): readonly string[] {
  if (exponent === 0) return [`Any non-zero number raised to power 0 is 1, so the remainder is ${answer}.`, `Therefore the required remainder is ${answer}.`];
  const first = mod(baseValue, modulus);
  if (first === 0) return [`${baseValue} is exactly divisible by ${modulus}.`, `Therefore every positive power of ${baseValue} is also divisible by ${modulus}, so the remainder is ${answer}.`];

  const rows: string[] = [];
  const selected: { power: number; residue: number }[] = [];
  let factor = first;
  let bit = 1;
  while (bit <= exponent) {
    rows.push(`${baseValue}^${bit} leaves remainder ${factor}`);
    if ((exponent & bit) !== 0) selected.push({ power: bit, residue: factor });
    factor = mod(factor * factor, modulus);
    bit *= 2;
  }
  const decomposition = selected.map((item) => item.power).reverse().join(" + ");
  const product = selected.map((item) => item.residue).join(" × ");
  return [
    `Using repeated squaring: ${rows.join("; ")}.`,
    `${exponent} = ${decomposition}, so use the corresponding remainders: ${product}. Their product leaves remainder ${answer} when divided by ${modulus}.`,
  ];
}

function repeatedDigitWork(digit: number, length: number, modulus: number, answer: number): readonly string[] {
  const sequence: number[] = [];
  let current = 0;
  for (let index = 0; index < length; index += 1) {
    current = mod(current * 10 + digit, modulus);
    sequence.push(current);
  }
  return [
    `Append one ${digit} at a time. Each time, multiply the previous remainder by 10, add ${digit}, and divide by ${modulus}.`,
    `The remainders are ${sequence.join(" → ")}. After ${length} digits, the remainder is ${answer}.`,
  ];
}

function examStem(q: NumCp008PermanentPackage): string {
  const s = q.hiddenState as State;
  switch (q.temporaryPrototypeId) {
    case "NUM-CP008-PROT-001": {
      const raw = n(s, "raw");
      const modulus = n(s, "modulus");
      return raw >= 0
        ? `What remainder is left when ${raw} is divided by ${modulus}?`
        : `Which remainder from 0 to ${modulus - 1} corresponds to ${raw} on division by ${modulus}?`;
    }
    case "NUM-CP008-PROT-002": {
      const a = n(s, "a");
      const b = n(s, "b");
      const modulus = n(s, "modulus");
      const operation = text(s, "operation");
      const symbol = operation === "SUM" ? "+" : operation === "DIFFERENCE" ? "−" : "×";
      return `A leaves remainder ${a} and B leaves remainder ${b} when each is divided by ${modulus}. What remainder will A ${symbol} B leave when divided by ${modulus}?`;
    }
    case "NUM-CP008-PROT-003":
      return `What is the remainder when ${n(s, "base")}^${n(s, "exponent")} is divided by ${n(s, "modulus")}?`;
    case "NUM-CP008-PROT-004":
      return `What is the least positive value of x for which ${n(s, "a")}x leaves remainder ${n(s, "b")} when divided by ${n(s, "modulus")}?`;
    case "NUM-CP008-PROT-005":
      return `How many values of x from 0 to ${n(s, "modulus") - 1} make ${n(s, "a")}x leave remainder ${n(s, "b")} when divided by ${n(s, "modulus")}?`;
    case "NUM-CP008-PROT-006":
      return `Which statement is correct for ${n(s, "a")}x when divided by ${n(s, "modulus")}, if the required remainder is ${n(s, "b")}?`;
    case "NUM-CP008-PROT-007":
      return `Find the least positive integer x that leaves remainder ${n(s, "r1")} when divided by ${n(s, "m1")} and remainder ${n(s, "r2")} when divided by ${n(s, "m2")}.`;
    case "NUM-CP008-PROT-008":
      return `Which statement is correct about an integer x that must leave remainder ${n(s, "r1")} when divided by ${n(s, "m1")} and remainder ${n(s, "r2")} when divided by ${n(s, "m2")}?`;
    case "NUM-CP008-PROT-009":
      return `Among the integers from ${n(s, "lower")} to ${n(s, "upper")}, find the ${text(s, "direction") === "LEAST" ? "least" : "greatest"} number that leaves remainder ${n(s, "residue")} when divided by ${n(s, "modulus")}.`;
    case "NUM-CP008-PROT-010":
      return `How many integers from ${n(s, "lower")} to ${n(s, "upper")} leave remainder ${n(s, "residue")} when divided by ${n(s, "modulus")}?`;
    case "NUM-CP008-PROT-011": {
      const cs = constraints(s);
      return `Which option lists all integers from ${n(s, "lower")} to ${n(s, "upper")} that ${joinedConditions(cs)}?`;
    }
    case "NUM-CP008-PROT-012":
      return `x = ${n(s, "x")}. When a × x is divided by ${n(s, "modulus")}, the remainder is ${n(s, "b")}. Which of the given values can be a?`;
    case "NUM-CP008-PROT-013":
      return `When ${n(s, "value")} is divided by m, the remainder is ${n(s, "residue")}. Which of the given values can be m?`;
    case "NUM-CP008-PROT-014":
      return `What is the remainder when 1 + ${n(s, "base")} + ${n(s, "base")}^2 + ... + ${n(s, "base")}^${n(s, "highestExponent")} is divided by ${n(s, "modulus")}?`;
    case "NUM-CP008-PROT-015": {
      const cs = constraints(s);
      return `Find the least positive integer x that ${joinedConditions(cs)}.`;
    }
    case "NUM-CP008-PROT-016": {
      const cs = constraints(s);
      return `Which statement is correct about an integer x that must ${joinedConditions(cs)}?`;
    }
    case "NUM-CP008-PROT-017":
      return `The least positive integer that leaves remainder ${n(s, "r1")} when divided by ${n(s, "m1")} and remainder r when divided by ${n(s, "m2")} is ${n(s, "least")}. Find r.`;
    case "NUM-CP008-PROT-018":
      return `Let y be the remainder when ${n(s, "baseValue")}^${n(s, "exponent")} + ${n(s, "add")} is divided by ${n(s, "innerModulus")}. What is the remainder when ${n(s, "multiplier")}y + ${n(s, "shift")} is divided by ${n(s, "outerModulus")}?`;
    case "NUM-CP008-PROT-019": {
      const cs = constraints(s);
      return `Which of the given numbers ${joinedConditions(cs)}?`;
    }
    case "NUM-CP008-PROT-020":
      return `Find the least positive integer x that leaves remainder ${n(s, "commonRemainder")} when divided by both ${n(s, "m1")} and ${n(s, "m2")}, and remainder ${n(s, "differentRemainder")} when divided by ${n(s, "m3")}.`;
    case "NUM-CP008-PROT-021": {
      const cs = constraints(s);
      const least = n(s, "least");
      const statements = s.statements as readonly Readonly<Record<string, unknown>>[];
      const lines = statements.map((row, index) => {
        const candidate = Number(row.candidate);
        const residue = Number(row.residue);
        const modulus = Number(row.modulus);
        return `${["I", "II", "III"][index]}. ${candidate} leaves remainder ${residue} when divided by ${modulus}.`;
      });
      return `The least positive integer satisfying both conditions (${joinedConditions(cs)}) is ${least}.\n${lines.join("\n")}\nWhich statements are correct?`;
    }
    case "NUM-CP008-PROT-022": {
      const one = s.statementI as Readonly<Record<string, unknown>>;
      const two = s.statementII as Readonly<Record<string, unknown>>;
      return `An integer x lies from ${n(s, "lower")} to ${n(s, "upper")}. Is x uniquely determined?\nI. x leaves remainder ${Number(one.residue)} when divided by ${Number(one.modulus)}.\nII. x leaves remainder ${Number(two.residue)} when divided by ${Number(two.modulus)}.`;
    }
    case "NUM-CP008-PROT-023":
      return `A number is formed by writing the digit ${n(s, "digit")} exactly ${n(s, "length")} times. What remainder does the number leave when divided by ${n(s, "modulus")}?`;
    case "NUM-CP008-PROT-024": {
      const cs = constraints(s);
      return `How many integers from ${n(s, "lower")} to ${n(s, "upper")} satisfy all these conditions: they ${joinedConditions(cs)}?`;
    }
    case "NUM-CP008-PROT-025": {
      const cs = constraints(s);
      return `For integers from ${n(s, "lower")} to ${n(s, "upper")}, which option correctly describes how many values ${joinedConditions(cs)}?`;
    }
    case "NUM-CP008-PROT-026": {
      const cs = constraints(s);
      return `Which option lists every integer from ${n(s, "lower")} to ${n(s, "upper")} that ${joinedConditions(cs)}?`;
    }
    default:
      return q.stem;
  }
}

function simpleExplanation(q: NumCp008PermanentPackage): Explanation {
  const s = q.hiddenState as State;
  const answer = q.canonicalAnswer;
  switch (q.temporaryPrototypeId) {
    case "NUM-CP008-PROT-001": {
      const raw = n(s, "raw");
      const modulus = n(s, "modulus");
      const residue = n(s, "residue");
      const quotient = (raw - residue) / modulus;
      return explanation("A remainder must lie from 0 to one less than the divisor.", "Write the number as a multiple of the divisor plus the required remainder.", [`${raw} = ${quotient} × ${modulus} + ${residue}.`, `So the required remainder is ${residue}.`], answer);
    }
    case "NUM-CP008-PROT-002": {
      const a = n(s, "a");
      const b = n(s, "b");
      const modulus = n(s, "modulus");
      const raw = n(s, "raw");
      const residue = n(s, "residue");
      const operation = text(s, "operation");
      const symbol = operation === "SUM" ? "+" : operation === "DIFFERENCE" ? "−" : "×";
      return explanation("Only the remainders are needed for addition, subtraction or multiplication.", "Do the same operation on the two remainders, then divide the result by the common divisor.", [`${a} ${symbol} ${b} = ${raw}.`, `${raw} leaves remainder ${residue} when divided by ${modulus}.`], answer);
    }
    case "NUM-CP008-PROT-003": {
      const baseValue = n(s, "base");
      const exponent = n(s, "exponent");
      const modulus = n(s, "modulus");
      const residue = n(s, "residue");
      return explanation("Large powers can be handled by keeping only remainders.", "Use repeated squaring so the full power never has to be calculated.", powerWork(baseValue, exponent, modulus, residue), answer);
    }
    case "NUM-CP008-PROT-004": {
      const a = n(s, "a");
      const b = n(s, "b");
      const modulus = n(s, "modulus");
      const solution = n(s, "solution");
      const inv = inverse(a, modulus)!;
      return explanation("We need a value of x that gives the required remainder after multiplication.", "Undo the multiplication by using a number that makes the coefficient behave like 1 for this divisor.", [`${a} × ${inv} leaves remainder 1 when divided by ${modulus}.`, `Therefore x has the same remainder as ${b} × ${inv} = ${b * inv}; this gives x = ${solution} as the least positive value.`], answer);
    }
    case "NUM-CP008-PROT-005": {
      const a = n(s, "a");
      const b = n(s, "b");
      const modulus = n(s, "modulus");
      const d = n(s, "gcd");
      const solutions = nums(s, "solutions");
      return explanation("A common factor in the coefficient and divisor can create several valid values.", "First check the HCF, then count the valid values from 0 to one less than the divisor.", [`HCF(${a}, ${modulus}) = ${d}, and ${d} divides ${b}, so solutions are possible.`, `The valid values are ${solutions.join(", ")}. Hence there are ${solutions.length} values.`], answer);
    }
    case "NUM-CP008-PROT-006": {
      const a = n(s, "a");
      const b = n(s, "b");
      const modulus = n(s, "modulus");
      const d = n(s, "gcd");
      return explanation("The common factor of the coefficient and divisor must also divide the required remainder.", "Check the HCF before trying values of x.", [`HCF(${a}, ${modulus}) = ${d}.`, `${d} does not divide ${b}, so no integer x can produce remainder ${b}.`], answer);
    }
    case "NUM-CP008-PROT-007": {
      const r1 = n(s, "r1");
      const m1 = n(s, "m1");
      const r2 = n(s, "r2");
      const m2 = n(s, "m2");
      const period = n(s, "period");
      const solutionResidue = n(s, "solutionResidue");
      const least = solutionResidue === 0 ? period : solutionResidue;
      const k = (least - r1) / m1;
      return explanation("Start with the numbers satisfying one remainder condition and impose the second condition on them.", "Write x from the first condition, then find the smallest multiplier that also satisfies the second.", [`Write x = ${r1} + ${m1}k.`, `The smallest suitable k is ${k}, giving x = ${r1} + ${m1} × ${k} = ${least}.`], answer);
    }
    case "NUM-CP008-PROT-008": {
      const r1 = n(s, "r1");
      const m1 = n(s, "m1");
      const r2 = n(s, "r2");
      const m2 = n(s, "m2");
      const d = n(s, "gcd");
      return explanation("Two remainder conditions can work together only if they agree on every common factor of the divisors.", "Compare the two remainders after division by the HCF of the divisors.", [`HCF(${m1}, ${m2}) = ${d}.`, `${r1} and ${r2} do not leave the same remainder when divided by ${d}, so no integer can satisfy both conditions.`], answer);
    }
    case "NUM-CP008-PROT-009": {
      const first = n(s, "first");
      const last = n(s, "last");
      const modulus = n(s, "modulus");
      return explanation("Numbers with the same remainder differ by the divisor.", "Find the first valid number in the range and keep adding the divisor.", [`The first valid number in the range is ${first}.`, `Adding ${modulus} each time gives the last valid number ${last}; choose the required end of the list.`], answer);
    }
    case "NUM-CP008-PROT-010": {
      const first = n(s, "first");
      const last = n(s, "last");
      const modulus = n(s, "modulus");
      const count = n(s, "count");
      return explanation("Valid numbers form an arithmetic progression with common difference equal to the divisor.", "Find the first and last valid numbers, then count the terms.", [`First valid number = ${first}; last valid number = ${last}.`, `Count = (${last} − ${first})/${modulus} + 1 = ${count}.`], answer);
    }
    case "NUM-CP008-PROT-011": {
      const period = n(s, "period");
      const solutions = nums(s, "solutions");
      return explanation("Once the first common value is found, every next common value is a fixed distance away.", "Find the first common value in the range, then keep adding the repeating gap.", [`The common values repeat every ${period}.`, `Inside the given range they are ${solutions.join(", ")}.`], answer);
    }
    case "NUM-CP008-PROT-012": {
      const x = n(s, "x");
      const b = n(s, "b");
      const modulus = n(s, "modulus");
      const coefficient = n(s, "coefficient");
      return explanation("Because only four choices are given, direct substitution is quickest.", "Multiply each candidate by x and check the remainder.", [`For a = ${coefficient}, ${coefficient} × ${x} = ${coefficient * x}.`, `${coefficient * x} leaves remainder ${b} when divided by ${modulus}; the other candidates do not.`], answer);
    }
    case "NUM-CP008-PROT-013": {
      const value = n(s, "value");
      const residue = n(s, "residue");
      const difference = n(s, "difference");
      const modulus = n(s, "modulus");
      return explanation("If a number leaves remainder r, the divisor must exactly divide number − r.", "Subtract the remainder and test the given divisors.", [`${value} − ${residue} = ${difference}.`, `${modulus} divides ${difference} exactly and is greater than the remainder ${residue}, so m = ${modulus}.`], answer);
    }
    case "NUM-CP008-PROT-014": {
      const baseValue = n(s, "base");
      const highestExponent = n(s, "highestExponent");
      const modulus = n(s, "modulus");
      const residue = n(s, "residue");
      const denominator = baseValue - 1;
      const inv = inverse(denominator, modulus);
      if (inv !== undefined) {
        const p = (() => {
          let result = 1;
          let factor = mod(baseValue, modulus);
          let e = highestExponent + 1;
          while (e > 0) {
            if (e % 2 === 1) result = mod(result * factor, modulus);
            factor = mod(factor * factor, modulus);
            e = Math.floor(e / 2);
          }
          return result;
        })();
        return explanation("The expression is a geometric sum.", "Use the geometric-sum formula, but keep only remainders throughout.", [`1 + ${baseValue} + ... + ${baseValue}^${highestExponent} = (${baseValue}^${highestExponent + 1} − 1)/${denominator}.`, `${baseValue}^${highestExponent + 1} leaves remainder ${p}; using ${denominator} × ${inv} as remainder 1 gives final remainder ${residue}.`], answer);
      }
      return explanation("Add the powers by keeping only their remainders after each step.", "Multiply by the base to get the next remainder and keep a running total.", [`Start with remainder 1. Repeatedly multiply the current power remainder by ${baseValue}, and after each step reduce by ${modulus}.`, `Adding these reduced terms through power ${highestExponent} gives remainder ${residue}.`], answer);
    }
    case "NUM-CP008-PROT-015": {
      const cs = constraints(s);
      const period = n(s, "period");
      const residue = n(s, "residue");
      const least = residue === 0 ? period : residue;
      const firstTwoPeriod = lcm(cs[0]!.modulus, cs[1]!.modulus);
      let firstTwo = 0;
      for (let x = 0; x < firstTwoPeriod; x += 1) if (cs.slice(0, 2).every((c) => mod(x, c.modulus) === c.residue)) { firstTwo = x; break; }
      return explanation("Handle the remainder conditions one at a time.", "First combine two conditions, then apply the third to that repeating list.", [`The first two conditions give numbers repeating every ${firstTwoPeriod}, starting with ${firstTwo}.`, `Applying the third condition gives the least positive common value ${least}.`], answer);
    }
    case "NUM-CP008-PROT-016": {
      const cs = constraints(s);
      const firstTwoResidue = n(s, "firstTwoResidue");
      const firstTwoPeriod = n(s, "firstTwoPeriod");
      const d = n(s, "compatibilityGcd");
      const third = cs[2]!;
      return explanation("After two conditions are combined, the third must agree with their repeating pattern.", "Compare the third remainder with the combined pattern using their common factor.", [`The first two conditions give numbers that leave remainder ${firstTwoResidue} when divided by ${firstTwoPeriod}.`, `HCF(${firstTwoPeriod}, ${third.modulus}) = ${d}, but the required remainders disagree on division by ${d}; therefore no common integer exists.`], answer);
    }
    case "NUM-CP008-PROT-017": {
      const least = n(s, "least");
      const m2 = n(s, "m2");
      const missing = n(s, "missingResidue");
      return explanation("The stated solution itself tells us the missing remainder.", "Divide the given least solution by the divisor attached to r.", [`${least} = ${Math.floor(least / m2)} × ${m2} + ${missing}.`, `Therefore r = ${missing}.`], answer);
    }
    case "NUM-CP008-PROT-018": {
      const baseValue = n(s, "baseValue");
      const exponent = n(s, "exponent");
      const add = n(s, "add");
      const innerModulus = n(s, "innerModulus");
      const multiplier = n(s, "multiplier");
      const shift = n(s, "shift");
      const outerModulus = n(s, "outerModulus");
      const powerResidue = n(s, "powerResidue");
      const inner = n(s, "inner");
      const result = n(s, "answer");
      return explanation("Finish the inner remainder first, then use that value in the outer expression.", "Solve for y before doing the final division.", [`${baseValue}^${exponent} leaves remainder ${powerResidue} on division by ${innerModulus}; after adding ${add}, y = ${inner}.`, `${multiplier} × ${inner} + ${shift} = ${multiplier * inner + shift}, which leaves remainder ${result} when divided by ${outerModulus}.`], answer);
    }
    case "NUM-CP008-PROT-019": {
      const cs = constraints(s);
      const candidate = n(s, "answer");
      return explanation("The correct candidate must satisfy every remainder condition.", "Check the candidates against all divisors; stop when one passes every check.", cs.map((c) => `${candidate} leaves remainder ${mod(candidate, c.modulus)} when divided by ${c.modulus}, as required.`), answer);
    }
    case "NUM-CP008-PROT-020": {
      const common = n(s, "commonRemainder");
      const m1 = n(s, "m1");
      const m2 = n(s, "m2");
      const m3 = n(s, "m3");
      const different = n(s, "differentRemainder");
      const result = n(s, "answer");
      const basePeriod = lcm(m1, m2);
      const k = (result - common) / basePeriod;
      return explanation("The two equal-remainder conditions can be combined first.", "Use their LCM to form one repeating list, then apply the third condition.", [`The first two conditions give x = ${common} + ${basePeriod}k.`, `The smallest k satisfying the division by ${m3} is ${k}; hence x = ${common} + ${basePeriod} × ${k} = ${result}.`], answer);
    }
    case "NUM-CP008-PROT-021": {
      const statements = s.statements as readonly Readonly<Record<string, unknown>>[];
      const truth = s.truth as readonly boolean[];
      const steps = statements.map((row, index) => {
        const candidate = Number(row.candidate);
        const residue = Number(row.residue);
        const modulus = Number(row.modulus);
        const actual = mod(candidate, modulus);
        return `Statement ${["I", "II", "III"][index]}: ${candidate} leaves remainder ${actual} when divided by ${modulus}, so the statement is ${truth[index] ? "true" : "false"}.`;
      });
      return explanation("Check each statement separately.", "For each statement, divide the stated number by the stated divisor and compare the remainder.", steps, answer);
    }
    case "NUM-CP008-PROT-022": {
      const counts = s.counts as Readonly<Record<string, unknown>>;
      const c1 = Number(counts.c1);
      const c2 = Number(counts.c2);
      const both = Number(counts.bothCount);
      return explanation("A statement is sufficient only if it leaves exactly one possible value in the given range.", "Count the possible values from statement I, statement II and then both together.", [`Statement I leaves ${c1} possible value${c1 === 1 ? "" : "s"}; statement II leaves ${c2}.`, `Using both statements leaves ${both} possible value${both === 1 ? "" : "s"}. Therefore ${answer}.`], answer);
    }
    case "NUM-CP008-PROT-023": {
      const digit = n(s, "digit");
      const length = n(s, "length");
      const modulus = n(s, "modulus");
      const result = n(s, "answer");
      return explanation("Build the repeated-digit number one digit at a time while keeping only its remainder.", "Each new digit shifts the previous number one place left, then adds the digit.", repeatedDigitWork(digit, length, modulus, result), answer);
    }
    case "NUM-CP008-PROT-024": {
      const period = n(s, "period");
      const residue = n(s, "residue");
      const lower = n(s, "lower");
      const upper = n(s, "upper");
      const count = n(s, "answer");
      const first = lower + mod(residue - lower, period);
      const last = first <= upper ? first + (count - 1) * period : first;
      return explanation("All three conditions together produce one repeating list of valid numbers.", "Find the first valid number in the range, then add the repeat gap and count.", [`The common pattern repeats every ${period}; the first valid number in the range is ${first}.`, `The last is ${last}. Count = (${last} − ${first})/${period} + 1 = ${count}.`], answer);
    }
    case "NUM-CP008-PROT-025": {
      const sols = nums(s, "canonicalSolutions");
      const merged = s.merged as Readonly<Record<string, unknown>> | null;
      if (!merged) return explanation("The remainder conditions contradict one another.", "Check whether a common number is possible before looking at the interval.", ["No integer can satisfy all three remainder conditions.", `Therefore the interval contains no solution.`], answer);
      const period = Number(merged.period);
      return explanation("All conditions together give one repeating list of common values.", "Find the common values inside the stated interval and classify their count.", [`The common values repeat every ${period}.`, sols.length ? `Inside the interval the values are ${sols.join(", ")}, so there ${sols.length === 1 ? "is" : "are"} ${sols.length} solution${sols.length === 1 ? "" : "s"}.` : "There is no common value inside the interval."], answer);
    }
    case "NUM-CP008-PROT-026": {
      const sols = nums(s, "canonicalSolutions");
      const merged = s.merged as Readonly<Record<string, unknown>>;
      const period = Number(merged.period);
      return explanation("Once the first common value is known, all later common values are separated by the same gap.", "Use the repeating gap and keep only the values inside the interval.", [`The three conditions repeat together every ${period}.`, `The values in the interval are ${sols.join(", ")}.`], answer);
    }
    default:
      return q.explanation;
  }
}

export function applyNumCp008EnglishExamHumanV2(q: NumCp008PermanentPackage): NumCp008PermanentPackage {
  return Object.freeze({
    ...q,
    stem: examStem(q),
    explanation: simpleExplanation(q),
  }) as NumCp008PermanentPackage;
}
