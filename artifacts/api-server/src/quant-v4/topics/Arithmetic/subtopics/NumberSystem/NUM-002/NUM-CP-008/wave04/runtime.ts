import {
  base,
  countClassInRange,
  createRng,
  crtMany,
  difficulty,
  lcm,
  leastPositive,
  mod,
  numericOptions,
  sources,
  systemSolutions,
  textOptions,
} from "./common.ts";
import type { NumCp008Wave04Package, NumCp008Wave04PrototypeId } from "./types.ts";

function tier(seed: number): 0 | 1 | 2 {
  return ((seed - 1) % 3) as 0 | 1 | 2;
}

function fingerprint(id: NumCp008Wave04PrototypeId, state: Readonly<Record<string, unknown>>): string {
  return `${id}:${JSON.stringify(state)}`;
}

function repeatedDigitResidues(digit: number, modulus: number, limit: number): number[] {
  const residues: number[] = [];
  let residue = 0;
  for (let length = 1; length <= limit; length += 1) {
    residue = mod(residue * 10 + digit, modulus);
    residues.push(residue);
  }
  return residues;
}

function leastRepeatedDigitLengthExact(digit: number, modulus: number, limit: number): number {
  for (let length = 1; length <= limit; length += 1) {
    const value = BigInt(String(digit).repeat(length));
    if (value % BigInt(modulus) === 0n) return length;
  }
  return -1;
}

const REPEATED_DIGIT_CASES = [
  { digit: 2, modulus: 18, maxLength: 12 },
  { digit: 5, modulus: 13, maxLength: 12 },
  { digit: 1, modulus: 7, maxLength: 12 },
  { digit: 3, modulus: 37, maxLength: 8 },
  { digit: 7, modulus: 13, maxLength: 12 },
  { digit: 4, modulus: 11, maxLength: 8 },
  { digit: 8, modulus: 27, maxLength: 18 },
  { digit: 6, modulus: 7, maxLength: 12 },
] as const;

function p025(seed: number): NumCp008Wave04Package {
  const rng = createRng(seed * 223 + 8);
  const t = tier(seed);
  const band = t === 0 ? REPEATED_DIGIT_CASES.slice(0, 3) : t === 1 ? REPEATED_DIGIT_CASES.slice(2, 6) : REPEATED_DIGIT_CASES.slice(4);
  const chosen = rng.pick(band);
  const residues = repeatedDigitResidues(chosen.digit, chosen.modulus, chosen.maxLength);
  const answer = residues.findIndex((residue) => residue === 0) + 1;
  if (answer <= 0) throw new Error(`No repeated-digit divisibility state for ${chosen.digit}/${chosen.modulus}`);
  const verifier = leastRepeatedDigitLengthExact(chosen.digit, chosen.modulus, chosen.maxLength);
  const options = numericOptions(answer, [
    { value: Math.max(1, answer - 1), misconceptionId: "STOPPED_ONE_DIGIT_EARLY" },
    { value: answer + 1, misconceptionId: "ADDED_ONE_EXTRA_DIGIT" },
    { value: chosen.modulus, misconceptionId: "USED_MODULUS_AS_LENGTH" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "LEAST_REPEATED_DIGIT_LENGTH", digit: chosen.digit, modulus: chosen.modulus, maxLength: chosen.maxLength, residues: residues.slice(0, answer), answer });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-025",
    seed,
    difficulty: difficulty(t, answer >= 7 ? 2 : 1),
    answerSemantic: "COUNT",
    representation: "REMAINDER_RECURRENCE_LENGTH",
    stem: `A positive integer is made only by repeating the digit ${chosen.digit}. What is the least number of ${chosen.digit}s needed so that the integer is divisible by ${chosen.modulus}?`,
    ...options,
    verifierAnswer: String(verifier),
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP008-PROT-025", hiddenState),
    explanation: {
      coreConcept: "Appending the same digit creates a remainder recurrence; the first zero remainder gives the minimum length.",
      strategy: `Starting from remainder 0, repeatedly use r_new = (10r + ${chosen.digit}) mod ${chosen.modulus}.`,
      steps: [
        `Remainders for lengths 1 through ${answer}: ${residues.slice(0, answer).join(", ")}.`,
        `The first zero appears at length ${answer}, so no shorter repeated-${chosen.digit} number is divisible by ${chosen.modulus}.`,
      ],
      finalAnswer: String(answer),
    },
    sourceAncestry: sources("CP008_DESIGN:LEAST_REPEATED_NUMERAL_LENGTH", "UPLOAD:RS-AGGARWAL:NUMBER-SYSTEM-EX31-32-REPEATED-DIGIT-MINIMUM"),
    prototypeAncestry: ["LEAST_REPEATED_DIGIT_LENGTH"],
  });
}

function blockRemainders(block: number, repeats: number, modulus: number): number[] {
  const width = String(block).length;
  const placeMultiplier = Number(10n ** BigInt(width) % BigInt(modulus));
  const blockResidue = mod(block, modulus);
  const residues: number[] = [];
  let residue = 0;
  for (let index = 1; index <= repeats; index += 1) {
    residue = mod(residue * placeMultiplier + blockResidue, modulus);
    residues.push(residue);
  }
  return residues;
}

function p026(seed: number): NumCp008Wave04Package {
  const rng = createRng(seed * 227 + 8);
  const t = tier(seed);
  const blocks = t === 0 ? [23, 47, 311] : t === 1 ? [137, 311, 547, 703] : [211, 347, 619, 823];
  const moduli = t === 0 ? [7, 11, 13] : t === 1 ? [13, 17, 19, 23] : [17, 19, 23, 29];
  const block = rng.pick(blocks);
  const modulus = rng.pick(moduli);
  const repeats = t === 0 ? rng.int(3, 6) : t === 1 ? rng.int(6, 9) : rng.int(9, 12);
  const residues = blockRemainders(block, repeats, modulus);
  const answer = residues[residues.length - 1]!;
  const exact = BigInt(String(block).repeat(repeats));
  const verifier = Number(exact % BigInt(modulus));
  const previous = residues.length > 1 ? residues[residues.length - 2]! : mod(block, modulus);
  const options = numericOptions(answer, [
    { value: previous, misconceptionId: "USED_ONE_FEWER_BLOCK" },
    { value: mod(answer + mod(block, modulus), modulus), misconceptionId: "ADDED_BLOCK_WITHOUT_PLACE_SHIFT" },
    { value: mod(block * repeats, modulus), misconceptionId: "TREATED_CONCATENATION_AS_SUM" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "REPEATED_BLOCK_CONCATENATION_REMAINDER", block, repeats, modulus, residues, answer });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-026",
    seed,
    difficulty: difficulty(t, 2),
    answerSemantic: "REMAINDER",
    representation: "REPEATED_BLOCK_CONCATENATION",
    stem: `The block ${block} is written consecutively ${repeats} times to form one integer. What remainder does this integer leave when divided by ${modulus}?`,
    ...options,
    verifierAnswer: String(verifier),
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP008-PROT-026", hiddenState),
    explanation: {
      coreConcept: "Appending a whole block shifts the existing number by the block's place value before adding the block.",
      strategy: `Work only with remainders after each ${String(block).length}-digit block instead of constructing the full integer.`,
      steps: [
        `Remainders after blocks 1 through ${repeats}: ${residues.join(", ")}.`,
        `After the final block, the remainder modulo ${modulus} is ${answer}.`,
      ],
      finalAnswer: String(answer),
    },
    sourceAncestry: sources("CP008_DESIGN:STRUCTURED_CONCATENATION_REMAINDER", "UPLOAD:DISHA-SSC:REPEATED-311-BLOCK;UPLOAD:ARUN-SHARMA:REPEATED-NUMERAL-REMAINDER"),
    prototypeAncestry: ["REPEATED_BLOCK_CONCATENATION_REMAINDER"],
  });
}

function p027(seed: number): NumCp008Wave04Package {
  const rng = createRng(seed * 229 + 8);
  const t = tier(seed);
  const modulusSets = t === 0 ? [[4, 5], [5, 7], [6, 7]] as const : t === 1 ? [[5, 7, 9], [6, 8, 11], [7, 9, 10]] as const : [[8, 9, 11], [9, 10, 13], [10, 12, 17]] as const;
  const moduli = rng.pick(modulusSets);
  const rawPeriod = moduli.reduce((acc, modulus) => lcm(acc, modulus), 1);
  const source = rng.int(1, rawPeriod);
  const constraints = moduli.map((modulus) => ({ residue: mod(source, modulus), modulus }));
  const merged = crtMany(constraints);
  if (!merged) throw new Error("Expected compatible system");
  const upper = t === 0 ? rng.int(500, 999) : t === 1 ? rng.int(2000, 5999) : rng.int(6000, 9999);
  const first = leastPositive(merged.residue, merged.period);
  if (first > upper) return p027(seed + 1200);
  const answer = first + Math.floor((upper - first) / merged.period) * merged.period;
  const verifierSet = systemSolutions(constraints, 1, upper);
  const verifier = verifierSet[verifierSet.length - 1];
  const options = numericOptions(answer, [
    { value: Math.max(1, answer - merged.period), misconceptionId: "USED_PREVIOUS_PERIODIC_SOLUTION" },
    { value: answer + merged.period, misconceptionId: "EXCEEDED_UPPER_BOUND" },
    { value: upper, misconceptionId: "USED_BOUND_WITHOUT_CHECKING_SYSTEM" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "GREATEST_BOUNDED_SYSTEM_SOLUTION", constraints, residue: merged.residue, period: merged.period, upper, first, answer });
  const systemText = constraints.map((item) => `x ≡ ${item.residue} (mod ${item.modulus})`).join(", ");
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-027",
    seed,
    difficulty: difficulty(t, 2),
    answerSemantic: "GREATEST_BOUNDED_SOLUTION",
    representation: "BOUNDED_CONGRUENCE_SYSTEM",
    stem: `Find the greatest positive integer x not exceeding ${upper} that satisfies all of these congruences: ${systemText}.`,
    ...options,
    verifierAnswer: String(verifier),
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP008-PROT-027", hiddenState),
    explanation: {
      coreConcept: "A compatible congruence system becomes one periodic residue class; the greatest bounded solution is the last member of that class below the limit.",
      strategy: "Combine the congruences, identify the least positive representative and step forward by the final period.",
      steps: [
        `The system combines to x ≡ ${merged.residue} (mod ${merged.period}); its least positive representative is ${first}.`,
        `${first} + floor((${upper}-${first})/${merged.period})×${merged.period} = ${answer}.`,
        `${answer} satisfies every congruence, while ${answer + merged.period} exceeds ${upper}.`,
      ],
      finalAnswer: String(answer),
    },
    sourceAncestry: sources("CP008_DESIGN:GREATEST_BOUNDED_SYSTEM_SOLUTION", "UPLOAD:RS-AGGARWAL:Q109-GREATEST-4DIGIT-DIFFERENT-REMAINDERS"),
    prototypeAncestry: ["GREATEST_BOUNDED_SYSTEM_SOLUTION"],
  });
}

const SOLUTION_CLASSES = ["No solution in the interval", "Exactly one solution in the interval", "More than one solution in the interval", "The system is incompatible"] as const;

function p028(seed: number): NumCp008Wave04Package {
  const rng = createRng(seed * 233 + 8);
  const t = tier(seed);
  const mode = (seed - 1) % 3;
  const modulusSets = t === 0 ? [[5, 7], [6, 7]] as const : t === 1 ? [[6, 8, 11], [7, 9, 10]] as const : [[8, 9, 11], [9, 10, 13]] as const;
  const moduli = rng.pick(modulusSets);
  const rawPeriod = moduli.reduce((acc, modulus) => lcm(acc, modulus), 1);
  const source = rng.int(1, rawPeriod);
  const constraints = moduli.map((modulus) => ({ residue: mod(source, modulus), modulus }));
  const merged = crtMany(constraints);
  if (!merged) throw new Error("Expected compatible system");
  const first = leastPositive(merged.residue, merged.period);
  let lower: number;
  let upper: number;
  let answer: string;
  if (mode === 0) {
    lower = first + 1;
    upper = first + merged.period - 1;
    answer = SOLUTION_CLASSES[0];
  } else if (mode === 1) {
    lower = first;
    upper = first + merged.period - 1;
    answer = SOLUTION_CLASSES[1];
  } else {
    lower = first;
    upper = first + 2 * merged.period;
    answer = SOLUTION_CLASSES[2];
  }
  const canonicalCount = countClassInRange(merged.residue, merged.period, lower, upper);
  const verifierSet = systemSolutions(constraints, lower, upper);
  const verifier = verifierSet.length === 0 ? SOLUTION_CLASSES[0] : verifierSet.length === 1 ? SOLUTION_CLASSES[1] : SOLUTION_CLASSES[2];
  const wrong = SOLUTION_CLASSES.filter((value) => value !== answer).map((value, index) => ({ value, misconceptionId: `WRONG_BOUNDED_SOLUTION_CLASS_${index + 1}` }));
  const options = textOptions(answer, wrong, rng);
  const hiddenState = Object.freeze({ mode: "BOUNDED_SYSTEM_SOLUTION_CLASS", constraints, residue: merged.residue, period: merged.period, lower, upper, canonicalCount, verifierSet, answer });
  const systemText = constraints.map((item) => `x ≡ ${item.residue} (mod ${item.modulus})`).join(", ");
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-028",
    seed,
    difficulty: difficulty(t, mode === 2 ? 2 : 1),
    answerSemantic: "SOLUTION_CLASS",
    representation: "BOUNDED_SYSTEM_CLASSIFICATION",
    stem: `For integers x in [${lower}, ${upper}], classify the solutions of the compatible system ${systemText}.`,
    ...options,
    verifierAnswer: verifier,
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP008-PROT-028", hiddenState),
    explanation: {
      coreConcept: "Compatibility alone does not tell how many representatives lie inside a particular interval.",
      strategy: "Combine the system to one residue class, then inspect its representatives inside the stated bounds.",
      steps: [
        `The system combines to x ≡ ${merged.residue} (mod ${merged.period}).`,
        `Representatives in [${lower}, ${upper}] are ${verifierSet.length ? `{${verifierSet.join(", ")}}` : "none"}.`,
        `Therefore the interval contains ${canonicalCount} solution${canonicalCount === 1 ? "" : "s"}: ${answer}.`,
      ],
      finalAnswer: answer,
    },
    sourceAncestry: sources("CP008_DESIGN:BOUNDED_ONE_MANY_NO_SOLUTION_TOPOLOGY", "DESIGN:NUMBER-SYSTEM-UNIVERSAL-DISCOVERY-MATRIX"),
    prototypeAncestry: ["BOUNDED_SYSTEM_SOLUTION_CLASS"],
  });
}

export function generateNumCp008Wave04(prototypeId: NumCp008Wave04PrototypeId, seed: number): NumCp008Wave04Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error("Seed must be a positive safe integer");
  switch (prototypeId) {
    case "NUM-CP008-PROT-025": return p025(seed);
    case "NUM-CP008-PROT-026": return p026(seed);
    case "NUM-CP008-PROT-027": return p027(seed);
    case "NUM-CP008-PROT-028": return p028(seed);
  }
}
