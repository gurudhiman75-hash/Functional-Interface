import { generateNumCp008Wave01 } from "./runtime.ts";
import type { NumCp008Wave01Package, NumCp008Wave01PrototypeId } from "./types.ts";

type State = Readonly<Record<string, unknown>>;

function integer(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error(`Expected integer ${label}`);
  return value;
}

function mod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
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

function powerWorking(state: State): readonly string[] {
  const base = integer(state.base, "base");
  const exponent = integer(state.exponent, "exponent");
  const modulus = integer(state.modulus, "modulus");
  const answer = integer(state.residue, "residue");
  const baseResidue = mod(base, modulus);

  if (exponent === 0) {
    return Object.freeze([
      `The exponent is 0, so ${base}^0 = 1.`,
      `Therefore the remainder is 1 modulo ${modulus}.`,
    ]);
  }

  const squareParts: string[] = [];
  const usedBits: number[] = [];
  const usedResidues: number[] = [];
  let power = 1;
  let residue = baseResidue;
  while (power <= exponent) {
    squareParts.push(`${base}^${power} ≡ ${residue} (mod ${modulus})`);
    if ((exponent & power) !== 0) {
      usedBits.push(power);
      usedResidues.push(residue);
    }
    residue = mod(residue * residue, modulus);
    power *= 2;
  }

  return Object.freeze([
    `Reduce the base first: ${base} ≡ ${baseResidue} (mod ${modulus}).`,
    `Successive squares: ${squareParts.join("; ")}.`,
    `${exponent} = ${usedBits.join(" + ")}, so multiply the corresponding residues: ${usedResidues.join(" × ")} ≡ ${answer} (mod ${modulus}).`,
  ]);
}

function uniqueLinearWorking(state: State): readonly string[] {
  const a = integer(state.a, "a");
  const b = integer(state.b, "b");
  const modulus = integer(state.modulus, "modulus");
  const answer = integer(state.solution, "solution");
  const inv = inverse(a, modulus);
  const witness = a * inv;
  const quotient = (witness - 1) / modulus;
  const product = inv * b;
  return Object.freeze([
    `gcd(${a}, ${modulus}) = 1, so ${a} has a modular inverse.`,
    `${a} × ${inv} = ${witness} = ${quotient} × ${modulus} + 1, so the inverse of ${a} modulo ${modulus} is ${inv}.`,
    `Hence x ≡ ${inv} × ${b} = ${product} ≡ ${answer} (mod ${modulus}).`,
  ]);
}

function multipleLinearWorking(state: State): readonly string[] {
  const a = integer(state.a, "a");
  const b = integer(state.b, "b");
  const modulus = integer(state.modulus, "modulus");
  const d = integer(state.gcd, "gcd");
  if (!Array.isArray(state.solutions) || state.solutions.some((value) => typeof value !== "number" || !Number.isSafeInteger(value))) {
    throw new Error("Expected solution array");
  }
  const solutions = [...state.solutions] as number[];
  const reducedA = a / d;
  const reducedB = b / d;
  const reducedModulus = modulus / d;
  const inv = inverse(reducedA, reducedModulus);
  const baseSolution = mod(inv * reducedB, reducedModulus);
  return Object.freeze([
    `gcd(${a}, ${modulus}) = ${d}, and ${d} divides ${b}, so solutions exist and there are ${d} classes modulo ${modulus}.`,
    `Divide the congruence by ${d}: ${reducedA}x ≡ ${reducedB} (mod ${reducedModulus}).`,
    `The inverse of ${reducedA} modulo ${reducedModulus} is ${inv}, so x ≡ ${baseSolution} (mod ${reducedModulus}).`,
    `Thus the solution classes modulo ${modulus} are {${solutions.join(", ")}}; their count is ${solutions.length}.`,
  ]);
}

function compatibleCrtWorking(state: State, finalAnswer: string): readonly string[] {
  const r1 = integer(state.r1, "r1");
  const m1 = integer(state.m1, "m1");
  const r2 = integer(state.r2, "r2");
  const m2 = integer(state.m2, "m2");
  const g = integer(state.gcd, "gcd");
  const period = integer(state.period, "period");
  const residue = integer(state.solutionResidue, "solutionResidue");
  const difference = r2 - r1;
  const reducedM1 = m1 / g;
  const reducedM2 = m2 / g;
  const reducedDifference = difference / g;
  const inv = inverse(mod(reducedM1, reducedM2), reducedM2);
  const k = mod(reducedDifference * inv, reducedM2);
  const constructed = r1 + m1 * k;
  if (constructed !== residue) throw new Error(`CRT working mismatch: ${constructed} != ${residue}`);
  const witness = reducedM1 * inv;
  return Object.freeze([
    `gcd(${m1}, ${m2}) = ${g}, and ${r2} - ${r1} = ${difference} is divisible by ${g}, so the system is compatible.`,
    `Let x = ${r1} + ${m1}k. Then ${m1}k ≡ ${difference} (mod ${m2}); dividing by ${g} gives ${reducedM1}k ≡ ${reducedDifference} (mod ${reducedM2}).`,
    `${reducedM1} × ${inv} = ${witness} ≡ 1 (mod ${reducedM2}), so k ≡ ${k} (mod ${reducedM2}).`,
    `Therefore x = ${r1} + ${m1} × ${k} = ${residue}. Solutions repeat every ${period}; the least positive solution is ${finalAnswer}.`,
  ]);
}

function reviewSteps(question: NumCp008Wave01Package): readonly string[] {
  const state = question.hiddenState as State;
  switch (question.temporaryPrototypeId) {
    case "NUM-CP008-PROT-003": return powerWorking(state);
    case "NUM-CP008-PROT-004": return uniqueLinearWorking(state);
    case "NUM-CP008-PROT-005": return multipleLinearWorking(state);
    case "NUM-CP008-PROT-007": return compatibleCrtWorking(state, question.canonicalAnswer);
    default: return question.explanation.steps;
  }
}

export function generateNumCp008Wave01ReviewFinal(
  prototypeId: NumCp008Wave01PrototypeId,
  seed: number,
): NumCp008Wave01Package {
  const question = generateNumCp008Wave01(prototypeId, seed);
  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      ...question.explanation,
      steps: reviewSteps(question),
    }),
  });
}
