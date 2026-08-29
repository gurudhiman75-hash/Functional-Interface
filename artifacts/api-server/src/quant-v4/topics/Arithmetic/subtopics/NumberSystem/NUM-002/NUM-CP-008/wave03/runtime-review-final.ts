import { crtMany, mod, systemSolutions } from "./common.ts";
import { generateNumCp008Wave03 as generateSource } from "./runtime.ts";
import type { NumCp008Option, NumCp008Wave03Package, NumCp008Wave03PrototypeId } from "./types.ts";

function replaceInvalidResidueDistractors(q: NumCp008Wave03Package): readonly NumCp008Option[] {
  if (q.temporaryPrototypeId !== "NUM-CP008-PROT-017") return q.options;
  const state = q.hiddenState as Readonly<Record<string, unknown>>;
  const modulus = Number(state.m2);
  const used = new Set(q.options.filter((option) => option.isCorrect).map((option) => option.value));
  const result: NumCp008Option[] = [];

  for (const option of q.options) {
    if (option.isCorrect) {
      result.push(option);
      continue;
    }
    const value = Number(option.value);
    if (Number.isSafeInteger(value) && value >= 0 && value < modulus && !used.has(option.value)) {
      used.add(option.value);
      result.push(option);
      continue;
    }
    let replacement = 0;
    while (replacement < modulus && used.has(String(replacement))) replacement += 1;
    if (replacement >= modulus) throw new Error("Unable to construct valid residue distractor");
    used.add(String(replacement));
    result.push({ value: String(replacement), isCorrect: false, misconceptionId: "VALID_RANGE_WRONG_RESIDUE" });
  }
  return result;
}

function powerReviewSteps(q: NumCp008Wave03Package): readonly string[] {
  const s = q.hiddenState as Readonly<Record<string, unknown>>;
  const baseValue = Number(s.baseValue);
  const exponent = Number(s.exponent);
  const innerModulus = Number(s.innerModulus);
  const add = Number(s.add);
  const multiplier = Number(s.multiplier);
  const shift = Number(s.shift);
  const outerModulus = Number(s.outerModulus);
  const inner = Number(s.inner);
  const answer = Number(s.answer);

  const powers: Array<{ exponent: number; residue: number }> = [];
  let e = 1;
  let residue = mod(baseValue, innerModulus);
  while (e <= exponent) {
    powers.push({ exponent: e, residue });
    residue = mod(residue * residue, innerModulus);
    e *= 2;
  }
  const used = powers.filter((item) => (exponent & item.exponent) !== 0);
  const product = used.reduce((acc, item) => mod(acc * item.residue, innerModulus), 1);
  return [
    `Useful powers modulo ${innerModulus}: ${powers.map((item) => `${baseValue}^${item.exponent} ≡ ${item.residue}`).join(", ")}.`,
    `${exponent} = ${used.map((item) => item.exponent).join("+")}, so ${baseValue}^${exponent} ≡ ${used.map((item) => item.residue).join("×")} ≡ ${product}; hence y ≡ ${product}+${add} ≡ ${inner} (mod ${innerModulus}).`,
    `${multiplier}×${inner}+${shift} = ${multiplier * inner + shift}, and ${multiplier * inner + shift} mod ${outerModulus} = ${answer}.`,
  ];
}

function sameDifferentReviewSteps(q: NumCp008Wave03Package): readonly string[] {
  const s = q.hiddenState as Readonly<Record<string, unknown>>;
  const common = Number(s.commonRemainder);
  const different = Number(s.differentRemainder);
  const m1 = Number(s.m1);
  const m2 = Number(s.m2);
  const m3 = Number(s.m3);
  const basePeriod = Math.abs((m1 * m2) / gcdLocal(m1, m2));
  const answer = Number(s.answer);
  let k = 0;
  while (mod(common + basePeriod * k, m3) !== different) k += 1;
  return [
    `The first two conditions combine to x ≡ ${common} (mod ${basePeriod}), so write x = ${common}+${basePeriod}k.`,
    `The third condition requires ${common}+${basePeriod}k ≡ ${different} (mod ${m3}); the least non-negative k that works is ${k}.`,
    `Therefore x = ${common}+${basePeriod}×${k} = ${answer}.`,
  ];
}

function repeatedNumeralReviewSteps(q: NumCp008Wave03Package): readonly string[] {
  const s = q.hiddenState as Readonly<Record<string, unknown>>;
  const digit = Number(s.digit);
  const length = Number(s.length);
  const modulus = Number(s.modulus);
  const answer = Number(s.answer);
  const residues: number[] = [];
  let residue = 0;
  for (let index = 1; index <= length; index += 1) {
    residue = mod(residue * 10 + digit, modulus);
    residues.push(residue);
  }
  return [
    `Appending ${digit} changes a residue r to (10r+${digit}) mod ${modulus}.`,
    `Residues after digits 1 through ${length}: ${residues.join(", ")}.`,
    `The final residue is ${answer}.`,
  ];
}

function dataSufficiencyReviewSteps(q: NumCp008Wave03Package): readonly string[] {
  const s = q.hiddenState as Readonly<Record<string, unknown>>;
  const lower = Number(s.lower);
  const upper = Number(s.upper);
  const i = s.statementI as { residue: number; modulus: number };
  const ii = s.statementII as { residue: number; modulus: number };
  const setI = systemSolutions([i], lower, upper);
  const setII = systemSolutions([ii], lower, upper);
  const setBoth = systemSolutions([i, ii], lower, upper);
  return [
    `From I, the possible values are {${setI.join(", ")}} (${setI.length} candidate${setI.length === 1 ? "" : "s"}).`,
    `From II, the possible values are {${setII.join(", ")}} (${setII.length} candidate${setII.length === 1 ? "" : "s"}).`,
    `Using both statements leaves {${setBoth.join(", ")}} (${setBoth.length} candidate${setBoth.length === 1 ? "" : "s"}).`,
  ];
}

function boundedTripleReviewSteps(q: NumCp008Wave03Package): readonly string[] {
  const s = q.hiddenState as Readonly<Record<string, unknown>>;
  const constraints = s.constraints as Array<{ residue: number; modulus: number }>;
  const first = crtMany(constraints.slice(0, 2));
  const final = crtMany(constraints);
  if (!first || !final) throw new Error("Expected compatible triple system");
  const lower = Number(s.lower);
  const upper = Number(s.upper);
  const answer = Number(s.answer);
  const firstInRange = lower + mod(final.residue - lower, final.period);
  const lastInRange = firstInRange + Math.max(0, answer - 1) * final.period;
  return [
    `The first two congruences combine to x ≡ ${first.residue} (mod ${first.period}).`,
    `Combining that class with x ≡ ${constraints[2]!.residue} (mod ${constraints[2]!.modulus}) gives x ≡ ${final.residue} (mod ${final.period}).`,
    `In [${lower}, ${upper}], the first such value is ${firstInRange} and the last is ${lastInRange}; count = (${lastInRange}-${firstInRange})/${final.period}+1 = ${answer}.`,
  ];
}

function gcdLocal(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

export function generateNumCp008Wave03Reviewed(prototypeId: NumCp008Wave03PrototypeId, seed: number): NumCp008Wave03Package {
  const q = generateSource(prototypeId, seed);
  let steps = q.explanation.steps;
  if (prototypeId === "NUM-CP008-PROT-018") steps = powerReviewSteps(q);
  else if (prototypeId === "NUM-CP008-PROT-020") steps = sameDifferentReviewSteps(q);
  else if (prototypeId === "NUM-CP008-PROT-022") steps = dataSufficiencyReviewSteps(q);
  else if (prototypeId === "NUM-CP008-PROT-023") steps = repeatedNumeralReviewSteps(q);
  else if (prototypeId === "NUM-CP008-PROT-024") steps = boundedTripleReviewSteps(q);

  return {
    ...q,
    options: replaceInvalidResidueDistractors(q),
    explanation: { ...q.explanation, steps },
  };
}
