import {
  base,
  createRng,
  difficulty,
  explanation,
  gcd,
  lcm,
  mod,
  numericOptions,
  powMod,
  powModVerifier,
  solveResidues,
  sources,
  systemResidues,
  textOptions,
  type Rng,
} from "./core.ts";
import type { NumCp008Wave01Package, NumCp008Wave01PrototypeId } from "./types.ts";

function tier(seed: number): 0 | 1 | 2 {
  return ((seed - 1) % 3) as 0 | 1 | 2;
}

function fingerprint(id: NumCp008Wave01PrototypeId, state: Readonly<Record<string, unknown>>): string {
  return `${id}:${JSON.stringify(state)}`;
}

function egcd(a: number, b: number): { g: number; x: number; y: number } {
  if (b === 0) return { g: Math.abs(a), x: a < 0 ? -1 : 1, y: 0 };
  const next = egcd(b, a % b);
  return { g: next.g, x: next.y, y: next.x - Math.trunc(a / b) * next.y };
}

function inverse(a: number, modulus: number): number {
  const result = egcd(a, modulus);
  if (result.g !== 1) throw new Error(`No inverse for ${a} mod ${modulus}`);
  return mod(result.x, modulus);
}

function generalizedCrt(r1: number, m1: number, r2: number, m2: number): { residue: number; period: number } | null {
  const g = gcd(m1, m2);
  const difference = r2 - r1;
  if (difference % g !== 0) return null;
  const reducedM1 = m1 / g;
  const reducedM2 = m2 / g;
  const k = mod((difference / g) * inverse(mod(reducedM1, reducedM2), reducedM2), reducedM2);
  const period = lcm(m1, m2);
  return { residue: mod(r1 + m1 * k, period), period };
}

function residueOptions(answer: number, modulus: number, rng: Rng, raw?: number) {
  return numericOptions(answer, [
    { value: raw ?? modulus - answer, misconceptionId: "UNNORMALISED_OR_UNREDUCED_VALUE" },
    { value: answer === 0 ? modulus : modulus - answer, misconceptionId: "COMPLEMENT_OF_RESIDUE" },
    { value: mod(answer + 1, modulus), misconceptionId: "OFF_BY_ONE_RESIDUE" },
    { value: mod(answer - 1, modulus), misconceptionId: "WRONG_NORMALISATION_DIRECTION" },
  ], rng);
}

function p001(seed: number): NumCp008Wave01Package {
  const rng = createRng(seed * 101 + 8);
  const t = tier(seed);
  const modulus = t === 0 ? rng.int(5, 11) : t === 1 ? rng.int(12, 23) : rng.int(24, 47);
  const residue = seed % 10 === 0 ? 0 : rng.int(1, modulus - 1);
  const multiple = rng.int(2, t === 2 ? 12 : 7);
  const raw = seed % 2 === 0 ? residue - multiple * modulus : residue + multiple * modulus;
  const answer = mod(raw, modulus);
  const options = residueOptions(answer, modulus, rng, raw % modulus);
  const hiddenState = Object.freeze({ mode: "SIGNED_RESIDUE_NORMALISATION", raw, modulus, residue: answer });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-001", seed, difficulty: difficulty(t), answerSemantic: "REMAINDER", representation: "CONGRUENCE_NOTATION",
    stem: `What is the least non-negative residue of ${raw} modulo ${modulus}?`,
    ...options,
    verifierAnswer: String(((raw % modulus) + modulus) % modulus), hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-001", hiddenState),
    explanation: explanation("A standard remainder is always between 0 and m - 1.", "Shift the signed value by whole multiples of the modulus until it lies in the standard residue range.", [`${raw} = ${Math.trunc((raw - answer) / modulus)} × ${modulus} + ${answer}.`, `Therefore ${raw} ≡ ${answer} (mod ${modulus}).`], String(answer)),
    sourceAncestry: sources("V2:ns_modular_arithmetic"), prototypeAncestry: ["SIGNED_RESIDUE_NORMALISATION"],
  });
}

function p002(seed: number): NumCp008Wave01Package {
  const rng = createRng(seed * 103 + 8);
  const t = tier(seed);
  const modulus = t === 0 ? rng.int(5, 11) : t === 1 ? rng.int(12, 29) : rng.int(30, 59);
  const a = rng.int(0, modulus - 1);
  const b = rng.int(0, modulus - 1);
  const operation = (["SUM", "DIFFERENCE", "PRODUCT"] as const)[seed % 3]!;
  const raw = operation === "SUM" ? a + b : operation === "DIFFERENCE" ? a - b : a * b;
  const answer = mod(raw, modulus);
  const options = residueOptions(answer, modulus, rng, raw);
  const symbol = operation === "SUM" ? "+" : operation === "DIFFERENCE" ? "−" : "×";
  const hiddenState = Object.freeze({ mode: "MODULAR_BINARY_OPERATION", operation, a, b, modulus, raw, residue: answer });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-002", seed, difficulty: difficulty(t, operation === "PRODUCT" ? 1 : 0), answerSemantic: "REMAINDER", representation: "CONGRUENCE_NOTATION",
    stem: `If A ≡ ${a} (mod ${modulus}) and B ≡ ${b} (mod ${modulus}), what is the least non-negative residue of A ${symbol} B modulo ${modulus}?`,
    ...options,
    verifierAnswer: String(mod(operation === "SUM" ? (a + 2 * modulus) + (b + 3 * modulus) : operation === "DIFFERENCE" ? (a + 4 * modulus) - (b + modulus) : (a + 2 * modulus) * (b + 3 * modulus), modulus)),
    hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-002", hiddenState),
    explanation: explanation("Congruent values may be added, subtracted or multiplied before reducing modulo m.", "Apply the requested operation to the known residues, then normalize once.", [`Residue calculation: ${a} ${symbol} ${b} = ${raw}.`, `${raw} ≡ ${answer} (mod ${modulus}).`], String(answer)),
    sourceAncestry: sources("V2:ns_modular_arithmetic"), prototypeAncestry: ["MODULAR_SUM_DIFFERENCE_PRODUCT"],
  });
}

function p003(seed: number): NumCp008Wave01Package {
  const rng = createRng(seed * 107 + 8);
  const t = tier(seed);
  const modulus = t === 0 ? rng.int(5, 13) : t === 1 ? rng.int(14, 31) : rng.int(32, 61);
  const baseValue = rng.int(2, t === 2 ? 80 : 40);
  const exponent = seed % 17 === 0 ? 0 : t === 0 ? rng.int(4, 12) : t === 1 ? rng.int(13, 45) : rng.int(46, 120);
  const answer = powMod(baseValue, exponent, modulus);
  const options = residueOptions(answer, modulus, rng, mod(baseValue, modulus));
  const verifier = powModVerifier(baseValue, exponent, modulus);
  const hiddenState = Object.freeze({ mode: "POWER_REMAINDER", base: baseValue, exponent, modulus, residue: answer });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-003", seed, difficulty: difficulty(t, 1), answerSemantic: "REMAINDER", representation: "EXPRESSION",
    stem: `Find the least non-negative remainder when ${baseValue}^${exponent} is divided by ${modulus}.`,
    ...options, verifierAnswer: String(verifier), hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-003", hiddenState),
    explanation: explanation("Large powers can be reduced modulo m at every multiplication step.", "Use exact repeated squaring rather than evaluating the full power.", [`Reduce the base first: ${baseValue} ≡ ${mod(baseValue, modulus)} (mod ${modulus}).`, `Repeated modular squaring gives ${baseValue}^${exponent} ≡ ${answer} (mod ${modulus}).`], String(answer)),
    sourceAncestry: sources("V2:ns_remainder_after_power"), prototypeAncestry: ["POWER_REMAINDER_REPEATED_SQUARING"],
  });
}

function p004(seed: number): NumCp008Wave01Package {
  const rng = createRng(seed * 109 + 8);
  const t = tier(seed);
  const modulus = t === 0 ? rng.int(7, 17) : t === 1 ? rng.int(18, 37) : rng.int(38, 67);
  let a = rng.int(2, modulus - 1);
  while (gcd(a, modulus) !== 1) a = a % (modulus - 1) + 1;
  const intended = rng.int(1, modulus - 1);
  const b = mod(a * intended, modulus);
  const answer = mod(inverse(a, modulus) * b, modulus);
  const verifier = solveResidues(a, b, modulus);
  if (verifier.length !== 1) throw new Error("Expected one residue class");
  const options = numericOptions(answer, [
    { value: b, misconceptionId: "TREATED_RESIDUE_AS_SOLUTION" },
    { value: mod(a * b, modulus), misconceptionId: "MULTIPLIED_INSTEAD_OF_INVERTING" },
    { value: modulus - answer, misconceptionId: "USED_COMPLEMENT" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "LINEAR_CONGRUENCE_UNIQUE", a, b, modulus, gcd: 1, solution: answer });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-004", seed, difficulty: difficulty(t, 1), answerSemantic: "RESIDUE_CLASS", representation: "CONGRUENCE_NOTATION",
    stem: `Solve ${a}x ≡ ${b} (mod ${modulus}). Which least non-negative residue represents the solution class?`,
    ...options, verifierAnswer: String(verifier[0]), hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-004", hiddenState),
    explanation: explanation("When gcd(a,m)=1, a has a modular inverse and the linear congruence has one residue class modulo m.", "Multiply both sides by the inverse of a modulo m.", [`gcd(${a}, ${modulus}) = 1, so ${a} is invertible modulo ${modulus}.`, `${a}^(-1) × ${b} ≡ ${answer} (mod ${modulus}).`], String(answer)),
    sourceAncestry: sources("V2:ns_modular_arithmetic"), prototypeAncestry: ["LINEAR_CONGRUENCE_SINGLE_CLASS"],
  });
}

function makeNonCoprimeLinear(seed: number, rng: Rng) {
  const d = ([2, 3, 4, 5] as const)[seed % 4]!;
  const n = rng.pick([5, 7, 11, 13] as const);
  const modulus = d * n;
  const reducedA = rng.int(1, n - 1);
  const a = d * reducedA;
  const intended = rng.int(0, modulus - 1);
  return { d, n, modulus, a, intended };
}

function p005(seed: number): NumCp008Wave01Package {
  const rng = createRng(seed * 113 + 8);
  const t = tier(seed);
  const { d, modulus, a, intended } = makeNonCoprimeLinear(seed, rng);
  const b = mod(a * intended, modulus);
  const canonicalCount = gcd(a, modulus);
  if (b % canonicalCount !== 0) throw new Error("Constructed solvable congruence is invalid");
  const verifier = solveResidues(a, b, modulus);
  const options = numericOptions(canonicalCount, [
    { value: 1, misconceptionId: "ASSUMED_UNIQUE_CLASS" },
    { value: modulus / canonicalCount, misconceptionId: "USED_REDUCED_MODULUS_AS_COUNT" },
    { value: canonicalCount + 1, misconceptionId: "OFF_BY_ONE_CLASS_COUNT" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "LINEAR_CONGRUENCE_MULTIPLE_CLASSES", a, b, modulus, gcd: d, solutions: verifier });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-005", seed, difficulty: difficulty(t, 2), answerSemantic: "COUNT", representation: "RESIDUE_CLASS_TABLE",
    stem: `For ${a}x ≡ ${b} (mod ${modulus}), how many distinct residue classes modulo ${modulus} satisfy the congruence?`,
    ...options, verifierAnswer: String(verifier.length), hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-005", hiddenState),
    explanation: explanation("If d=gcd(a,m) divides b, a linear congruence has exactly d solution classes modulo m.", "Check the gcd divisibility condition before counting residue classes.", [`gcd(${a}, ${modulus}) = ${d}, and ${d} divides ${b}.`, `Therefore there are ${d} residue classes modulo ${modulus}.`], String(canonicalCount)),
    sourceAncestry: sources("V2:ns_modular_arithmetic"), prototypeAncestry: ["LINEAR_CONGRUENCE_MULTIPLE_CLASSES"],
  });
}

function p006(seed: number): NumCp008Wave01Package {
  const rng = createRng(seed * 127 + 8);
  const t = tier(seed);
  const { d, modulus, a, intended } = makeNonCoprimeLinear(seed, rng);
  const divisibleResidue = mod(a * intended, modulus);
  const b = divisibleResidue + 1;
  const canonical = b % d !== 0 ? "NO SOLUTION" : "ERROR";
  if (canonical === "ERROR") throw new Error("Failed to construct unsolvable congruence");
  const verifier = solveResidues(a, b, modulus);
  const options = textOptions(canonical, [
    { value: "ONE RESIDUE CLASS", misconceptionId: "ASSUMED_INVERTIBLE_COEFFICIENT" },
    { value: "MULTIPLE RESIDUE CLASSES", misconceptionId: "USED_GCD_WITHOUT_DIVISIBILITY_TEST" },
    { value: "ALL RESIDUES", misconceptionId: "IGNORED_CONGRUENCE_CONSTRAINT" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "LINEAR_CONGRUENCE_NO_SOLUTION", a, b, modulus, gcd: d });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-006", seed, difficulty: difficulty(t, 1), answerSemantic: "SOLUTION_CLASS", representation: "CONGRUENCE_NOTATION",
    stem: `Classify the solution set of ${a}x ≡ ${b} (mod ${modulus}).`,
    ...options, verifierAnswer: verifier.length === 0 ? "NO SOLUTION" : "VERIFIER_FOUND_SOLUTION", hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-006", hiddenState),
    explanation: explanation("The congruence ax≡b (mod m) is solvable only when gcd(a,m) divides b.", "Compute the gcd, then test divisibility of the residue.", [`gcd(${a}, ${modulus}) = ${d}.`, `${d} does not divide ${b}, so no residue class can satisfy the congruence.`], canonical),
    sourceAncestry: sources("V2:ns_modular_arithmetic"), prototypeAncestry: ["LINEAR_CONGRUENCE_NO_SOLUTION"],
  });
}

const COMPATIBLE_PAIRS = [[5, 7], [7, 9], [8, 15], [11, 12]] as const;
const NON_COPRIME_PAIRS = [[6, 9], [8, 12], [10, 15], [12, 18]] as const;

function p007(seed: number): NumCp008Wave01Package {
  const rng = createRng(seed * 131 + 8);
  const t = tier(seed);
  const [m1, m2] = seed % 2 === 0 ? rng.pick(NON_COPRIME_PAIRS) : rng.pick(COMPATIBLE_PAIRS);
  const period = lcm(m1, m2);
  const sourceValue = rng.int(1, period * 2);
  const r1 = mod(sourceValue, m1);
  const r2 = mod(sourceValue, m2);
  const canonical = generalizedCrt(r1, m1, r2, m2);
  if (!canonical) throw new Error("Constructed compatible system became incompatible");
  const answer = canonical.residue === 0 ? canonical.period : canonical.residue;
  const verifier = systemResidues(r1, m1, r2, m2);
  const verifierPositive = verifier[0] === 0 ? period : verifier[0]!;
  const options = numericOptions(answer, [
    { value: r1 + r2, misconceptionId: "ADDED_REMAINDERS" },
    { value: sourceValue, misconceptionId: "USED_A_NONLEAST_REPRESENTATIVE" },
    { value: answer + period, misconceptionId: "MISSED_LEAST_POSITIVE_REQUIREMENT" },
    { value: Math.abs(m1 * m2 - answer), misconceptionId: "USED_PRODUCT_PERIOD_BLINDLY" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "TWO_CONGRUENCE_COMPATIBLE", r1, m1, r2, m2, gcd: gcd(m1, m2), period, solutionResidue: canonical.residue });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-007", seed, difficulty: difficulty(t, gcd(m1, m2) > 1 ? 2 : 1), answerSemantic: "LEAST_POSITIVE_SOLUTION", representation: "CONGRUENCE_SYSTEM",
    stem: `Find the least positive integer x satisfying x ≡ ${r1} (mod ${m1}) and x ≡ ${r2} (mod ${m2}).`,
    ...options, verifierAnswer: String(verifierPositive), hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-007", hiddenState),
    explanation: explanation("A compatible two-congruence system has one residue class modulo lcm of the moduli.", "Check compatibility first, then combine the congruences with generalized CRT.", [`gcd(${m1}, ${m2}) = ${gcd(m1, m2)}, and ${r2}-${r1} is divisible by that gcd.`, `Combining the two conditions gives x ≡ ${canonical.residue} (mod ${period}); the least positive representative is ${answer}.`], String(answer)),
    sourceAncestry: sources("CP007_LEDGER:DIFFERENT_REMAINDER_SYSTEMS_TO_CP008"), prototypeAncestry: ["COMPATIBLE_TWO_CONGRUENCE_SYSTEM"],
  });
}

function p008(seed: number): NumCp008Wave01Package {
  const rng = createRng(seed * 137 + 8);
  const t = tier(seed);
  const [m1, m2] = rng.pick(NON_COPRIME_PAIRS);
  const g = gcd(m1, m2);
  const r1 = rng.int(0, m1 - 1);
  let r2 = rng.int(0, m2 - 1);
  while ((r2 - r1) % g === 0) r2 = (r2 + 1) % m2;
  const canonical = generalizedCrt(r1, m1, r2, m2);
  if (canonical !== null) throw new Error("Expected incompatible system");
  const verifier = systemResidues(r1, m1, r2, m2);
  const answer = "INCOMPATIBLE — NO INTEGER SOLUTION";
  const options = textOptions(answer, [
    { value: "COMPATIBLE — UNIQUE MODULO THE PRODUCT", misconceptionId: "MULTIPLIED_MODULI_WITHOUT_COMPATIBILITY_CHECK" },
    { value: "COMPATIBLE — UNIQUE MODULO THE LCM", misconceptionId: "ASSUMED_CRT_ALWAYS_APPLIES" },
    { value: "INDETERMINATE FROM THE GIVEN DATA", misconceptionId: "CONFUSED_INCOMPATIBILITY_WITH_UNDERDETERMINATION" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "TWO_CONGRUENCE_INCOMPATIBLE", r1, m1, r2, m2, gcd: g });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-008", seed, difficulty: difficulty(t, 2), answerSemantic: "SOLUTION_CLASS", representation: "CONGRUENCE_SYSTEM",
    stem: `Classify the system x ≡ ${r1} (mod ${m1}), x ≡ ${r2} (mod ${m2}).`,
    ...options, verifierAnswer: verifier.length === 0 ? answer : "VERIFIER_FOUND_SOLUTION", hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-008", hiddenState),
    explanation: explanation("For two congruences, the residue difference must be divisible by gcd of the moduli.", "Check compatibility before trying to construct a CRT solution.", [`gcd(${m1}, ${m2}) = ${g}.`, `${r2}-${r1} is not divisible by ${g}, so the two conditions cannot hold for the same integer.`], answer),
    sourceAncestry: sources("CP007_LEDGER:UNRELATED_MODULUS_INCOMPATIBILITY_TO_CP008"), prototypeAncestry: ["INCOMPATIBLE_TWO_CONGRUENCE_SYSTEM"],
  });
}

export function generateNumCp008Wave01(prototypeId: NumCp008Wave01PrototypeId, seed: number): NumCp008Wave01Package {
  if (!Number.isSafeInteger(seed) || seed <= 0) throw new Error("Seed must be a positive safe integer");
  switch (prototypeId) {
    case "NUM-CP008-PROT-001": return p001(seed);
    case "NUM-CP008-PROT-002": return p002(seed);
    case "NUM-CP008-PROT-003": return p003(seed);
    case "NUM-CP008-PROT-004": return p004(seed);
    case "NUM-CP008-PROT-005": return p005(seed);
    case "NUM-CP008-PROT-006": return p006(seed);
    case "NUM-CP008-PROT-007": return p007(seed);
    case "NUM-CP008-PROT-008": return p008(seed);
  }
}
