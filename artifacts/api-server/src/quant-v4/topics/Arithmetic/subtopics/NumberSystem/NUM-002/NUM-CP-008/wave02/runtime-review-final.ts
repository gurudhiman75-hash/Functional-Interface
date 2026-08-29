import { generateNumCp008Wave02 } from "./runtime.ts";
import type { NumCp008Wave02Package, NumCp008Wave02PrototypeId } from "./types.ts";

type State = Readonly<Record<string, unknown>>;
type Constraint = Readonly<{ residue: number; modulus: number }>;

function integer(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error(`Expected integer ${label}`);
  return value;
}

function constraints(value: unknown, label: string): Constraint[] {
  if (!Array.isArray(value)) throw new Error(`Expected constraint array ${label}`);
  return value.map((entry, index) => {
    if (!entry || typeof entry !== "object") throw new Error(`Expected constraint ${label}/${index}`);
    const row = entry as Readonly<Record<string, unknown>>;
    return Object.freeze({
      residue: integer(row.residue, `${label}/${index}/residue`),
      modulus: integer(row.modulus, `${label}/${index}/modulus`),
    });
  });
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
  return Math.abs((a / gcd(a, b)) * b);
}

function egcd(a: number, b: number): { g: number; x: number; y: number } {
  if (b === 0) return { g: Math.abs(a), x: a < 0 ? -1 : 1, y: 0 };
  const next = egcd(b, a % b);
  return { g: next.g, x: next.y, y: next.x - Math.trunc(a / b) * next.y };
}

function inverse(a: number, modulus: number): number {
  const result = egcd(a, modulus);
  if (result.g !== 1) throw new Error(`No inverse for ${a} modulo ${modulus}`);
  return mod(result.x, modulus);
}

function combine(
  leftResidue: number,
  leftModulus: number,
  rightResidue: number,
  rightModulus: number,
): Readonly<{
  gcd: number;
  difference: number;
  reducedLeft: number;
  reducedRightModulus: number;
  reducedDifference: number;
  inverse: number;
  k: number;
  residue: number;
  period: number;
}> {
  const g = gcd(leftModulus, rightModulus);
  const difference = rightResidue - leftResidue;
  if (difference % g !== 0) throw new Error("Attempted to combine incompatible congruences");
  const reducedLeft = leftModulus / g;
  const reducedRightModulus = rightModulus / g;
  const reducedDifference = difference / g;
  const inv = inverse(mod(reducedLeft, reducedRightModulus), reducedRightModulus);
  const k = mod(reducedDifference * inv, reducedRightModulus);
  const period = lcm(leftModulus, rightModulus);
  return Object.freeze({
    gcd: g,
    difference,
    reducedLeft,
    reducedRightModulus,
    reducedDifference,
    inverse: inv,
    k,
    residue: mod(leftResidue + leftModulus * k, period),
    period,
  });
}

function boundedSystemWorking(state: State): readonly string[] {
  const rows = constraints(state.constraints, "constraints");
  if (rows.length !== 2) throw new Error("Expected two constraints");
  const [first, second] = rows;
  const combined = combine(first!.residue, first!.modulus, second!.residue, second!.modulus);
  if (!Array.isArray(state.solutions) || state.solutions.some((value) => typeof value !== "number" || !Number.isSafeInteger(value))) {
    throw new Error("Expected bounded solution set");
  }
  const solutions = [...state.solutions] as number[];
  const lower = integer(state.lower, "lower");
  const upper = integer(state.upper, "upper");
  return Object.freeze([
    `Let x = ${first!.residue} + ${first!.modulus}k. Then ${first!.modulus}k ≡ ${combined.difference} (mod ${second!.modulus}).`,
    `After dividing by gcd ${combined.gcd}: ${combined.reducedLeft}k ≡ ${combined.reducedDifference} (mod ${combined.reducedRightModulus}); the inverse is ${combined.inverse}, so k ≡ ${combined.k}.`,
    `Thus x ≡ ${combined.residue} (mod ${combined.period}). Inside [${lower}, ${upper}], the complete set is {${solutions.join(", ")}}.`,
  ]);
}

function coefficientWorking(state: State): readonly string[] {
  const x = integer(state.x, "x");
  const b = integer(state.b, "b");
  const modulus = integer(state.modulus, "modulus");
  const coefficient = integer(state.coefficient, "coefficient");
  const inv = inverse(x, modulus);
  const witness = x * inv;
  const quotient = (witness - 1) / modulus;
  return Object.freeze([
    `${x} × ${inv} = ${witness} = ${quotient} × ${modulus} + 1, so ${inv} is the inverse of ${x} modulo ${modulus}.`,
    `Multiply ax ≡ ${b} by ${inv}: a ≡ ${b} × ${inv} ≡ ${coefficient} (mod ${modulus}).`,
    `Among the listed candidates, only ${coefficient} has that residue.`,
  ]);
}

function geometricSumWorking(state: State): readonly string[] {
  const base = integer(state.base, "base");
  const highestExponent = integer(state.highestExponent, "highestExponent");
  const modulus = integer(state.modulus, "modulus");
  const answer = integer(state.residue, "residue");

  const powerResidues: number[] = [1];
  const runningSums: number[] = [1 % modulus];
  let term = 1;
  let sum = 1 % modulus;
  for (let exponent = 1; exponent <= highestExponent; exponent += 1) {
    term = mod(term * base, modulus);
    sum = mod(sum + term, modulus);
    powerResidues.push(term);
    runningSums.push(sum);
  }
  if (runningSums.at(-1) !== answer) throw new Error("Geometric-sum review reconstruction mismatch");

  return Object.freeze([
    `Power residues for exponents 0 through ${highestExponent}: ${powerResidues.join(", ")}.`,
    `Running sums modulo ${modulus}: ${runningSums.join(", ")}.`,
    `The final running sum is ${answer}, so the required remainder is ${answer}.`,
  ]);
}

function tripleCrtWorking(state: State, finalAnswer: string): readonly string[] {
  const rows = constraints(state.constraints, "constraints");
  if (rows.length !== 3) throw new Error("Expected three constraints");
  const [first, second, third] = rows;
  const step1 = combine(first!.residue, first!.modulus, second!.residue, second!.modulus);
  const step2 = combine(step1.residue, step1.period, third!.residue, third!.modulus);
  const leastPositive = step2.residue === 0 ? step2.period : step2.residue;
  if (String(leastPositive) !== finalAnswer) throw new Error(`Triple CRT review mismatch: ${leastPositive} != ${finalAnswer}`);

  return Object.freeze([
    `First combine x ≡ ${first!.residue} (mod ${first!.modulus}) and x ≡ ${second!.residue} (mod ${second!.modulus}): solve ${step1.reducedLeft}k ≡ ${step1.reducedDifference} (mod ${step1.reducedRightModulus}), giving k ≡ ${step1.k}.`,
    `So the first two conditions become x ≡ ${step1.residue} (mod ${step1.period}).`,
    `Now combine with x ≡ ${third!.residue} (mod ${third!.modulus}): solve ${step2.reducedLeft}k ≡ ${step2.reducedDifference} (mod ${step2.reducedRightModulus}), giving k ≡ ${step2.k}.`,
    `Hence x ≡ ${step2.residue} (mod ${step2.period}); the least positive solution is ${leastPositive}.`,
  ]);
}

function reviewSteps(question: NumCp008Wave02Package): readonly string[] {
  const state = question.hiddenState as State;
  switch (question.temporaryPrototypeId) {
    case "NUM-CP008-PROT-011": return boundedSystemWorking(state);
    case "NUM-CP008-PROT-012": return coefficientWorking(state);
    case "NUM-CP008-PROT-014": return geometricSumWorking(state);
    case "NUM-CP008-PROT-015": return tripleCrtWorking(state, question.canonicalAnswer);
    default: return question.explanation.steps;
  }
}

export function generateNumCp008Wave02ReviewFinal(
  prototypeId: NumCp008Wave02PrototypeId,
  seed: number,
): NumCp008Wave02Package {
  const question = generateNumCp008Wave02(prototypeId, seed);
  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      ...question.explanation,
      steps: reviewSteps(question),
    }),
  });
}
