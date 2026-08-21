import {
  UNIT_DIGIT_CYCLES,
  base,
  createRng,
  difficulty,
  explanation,
  fixedWidthOptions,
  formatClassSet,
  mod,
  numericOptions,
  optionsWithSlot,
  powMod,
  powModVerifier,
  sources,
  unitDigitByCycle,
} from "./core.ts";
import {
  NUM_CP009_WAVE03_PROTOTYPE_IDS,
  type NumCp009Wave03Package,
  type NumCp009Wave03PrototypeId,
} from "./types.ts";

function stemVariant(seed: number, direct: string, imperative: string, exam: string) {
  const index = mod(seed, 3);
  return index === 0
    ? { stemFamily: "DIRECT", stem: direct }
    : index === 1
      ? { stemFamily: "IMPERATIVE", stem: imperative }
      : { stemFamily: "EXAM_STYLE", stem: exam };
}

function fingerprint(prototypeId: NumCp009Wave03PrototypeId, state: Record<string, unknown>) {
  return JSON.stringify({ prototypeId, ...state });
}

function generateP015(seed: number): NumCp009Wave03Package {
  const rng = createRng(seed * 179 + 61);
  const mode = seed % 4;
  const width = mode === 0 || mode === 2 ? 2 : 3;
  const modulus = 10 ** width;
  let baseValue: number;
  let exponent: number;

  if (mode === 0) {
    baseValue = rng.pick([20, 30, 40, 50, 60, 70, 80, 90]);
    exponent = rng.int(2, 18);
  } else if (mode === 1) {
    baseValue = rng.pick([100, 200, 300, 400, 500, 600, 700, 800, 900]);
    exponent = rng.int(2, 10);
  } else if (mode === 2) {
    baseValue = rng.pick([10, 25, 50, 75, 125, 150, 250, 350]);
    exponent = rng.int(1, 14);
  } else {
    baseValue = rng.pick([10, 20, 25, 40, 50, 75, 125, 150, 250, 375, 500, 625]);
    exponent = rng.int(1, 12);
  }

  const answer = powMod(baseValue, exponent, modulus);
  const verifier = powModVerifier(baseValue, exponent, modulus);
  const answerText = String(answer).padStart(width, "0");
  const options = fixedWidthOptions(answer, width, [
    { value: mod(answer, 10), misconceptionId: "USES_ONLY_UNIT_DIGIT" },
    { value: mod(baseValue, modulus), misconceptionId: "IGNORES_EXPONENT" },
    { value: mod(answer + 10 ** (width - 1), modulus), misconceptionId: "WRONG_HIGH_TERMINAL_PLACE" },
  ], rng, seed);
  const terminalName = width === 2 ? "last two digits" : "last three digits";
  const wording = stemVariant(
    seed,
    `What are the ${terminalName} of ${baseValue}^${exponent}?`,
    `Find the ${terminalName} of ${baseValue}^${exponent}, preserving any leading zeroes.`,
    `${baseValue} is not coprime to ${modulus}, so do not assume a coprime power cycle. Compute ${baseValue}^${exponent} modulo ${modulus}. What terminal block remains?`,
  );
  const state = {
    width,
    modulus,
    base: baseValue,
    exponent,
    gcdWithModulus: (() => {
      let a = baseValue;
      let b = modulus;
      while (b !== 0) [a, b] = [b, a % b];
      return Math.abs(a);
    })(),
    answer: answerText,
  };

  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-015",
    seed,
    difficulty: difficulty(width === 2 && exponent <= 5 ? 3 : 5),
    answerSemantic: width === 2 ? "LAST_TWO_DIGITS" : "LAST_THREE_DIGITS",
    representation: width === 2 ? "NON_COPRIME_POWER_MOD_100" : "NON_COPRIME_POWER_MOD_1000",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier).padStart(width, "0"),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-015", state),
    explanation: explanation(
      "Terminal digits are still modular residues even when the base shares factors with 10, 100 or 1000.",
      `Work directly modulo ${modulus}; do not use a multiplicative-order shortcut that requires coprimality.`,
      [
        `${baseValue} shares a factor with ${modulus}, so the coprime-cycle shortcut is not assumed.`,
        `Repeated squaring modulo ${modulus} gives residue ${answerText}.`,
        answer === 0
          ? `The residue is zero, so every requested terminal position is written explicitly as ${answerText}.`
          : `Keep all ${width} requested terminal positions, including any leading zero.`,
      ],
      `The ${terminalName} are ${answerText}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:NON-COPRIME-ZERO-CREATION"),
    prototypeAncestry: ["NUM-CP009-POST-WAVE02:NON_COPRIME_TERMINAL_BLOCK_ZERO_CREATION"],
  });
}

const RESIDUE_SUBSETS: readonly (readonly number[])[] = Object.freeze([
  Object.freeze([0, 1]),
  Object.freeze([0, 2]),
  Object.freeze([0, 3]),
  Object.freeze([1, 2]),
  Object.freeze([1, 3]),
  Object.freeze([2, 3]),
  Object.freeze([0, 1, 2]),
  Object.freeze([0, 1, 3]),
  Object.freeze([0, 2, 3]),
  Object.freeze([1, 2, 3]),
]);

function residueToCycleIndex(residue: number) {
  return residue === 0 ? 3 : residue - 1;
}

function normaliseResidues(values: readonly number[]) {
  return [...values].sort((a, b) => a - b);
}

function classCandidates(correctResidues: readonly number[]) {
  const correct = JSON.stringify(normaliseResidues(correctResidues));
  return RESIDUE_SUBSETS
    .filter((candidate) => JSON.stringify(normaliseResidues(candidate)) !== correct)
    .map((candidate) => ({
      value: formatClassSet(normaliseResidues(candidate), 4),
      misconceptionId: candidate.length === correctResidues.length
        ? "WRONG_MULTI_CLASS_POSITIONS"
        : "WRONG_NUMBER_OF_EXPONENT_CLASSES",
    }));
}

function generateP016(seed: number): NumCp009Wave03Package {
  const rng = createRng(seed * 181 + 67);
  const lastDigit = rng.pick([2, 3, 7, 8]);
  const baseValue = rng.int(1, 90) * 10 + lastDigit;
  const desiredClassCount = seed % 2 === 0 ? 2 : 3;
  const subsetPool = RESIDUE_SUBSETS.filter((subset) => subset.length === desiredClassCount);
  const residues = normaliseResidues(rng.pick(subsetPool));
  const cycle = UNIT_DIGIT_CYCLES[lastDigit]!;
  const allowedDigits = residues.map((residue) => cycle[residueToCycleIndex(residue)]!).sort((a, b) => a - b);
  const answer = formatClassSet(residues, 4);
  const verifierResidues = [0, 1, 2, 3].filter((residue) => {
    const exponent = residue === 0 ? 4 : residue;
    return allowedDigits.includes(powModVerifier(baseValue, exponent, 10));
  });
  const verifier = formatClassSet(normaliseResidues(verifierResidues), 4);
  const options = optionsWithSlot(answer, classCandidates(residues), rng, seed);
  const allowedText = `{${allowedDigits.join(", ")}}`;
  const wording = stemVariant(
    seed,
    `For positive integer n, the unit digit of ${baseValue}^n must belong to ${allowedText}. Which complete set of exponent classes is valid?`,
    `Choose all congruence classes of n modulo 4 for which ${baseValue}^n ends in one of ${allowedText}.`,
    `The terminal condition for ${baseValue}^n accepts more than one cycle position: its unit digit must lie in ${allowedText}. Which option gives every valid class of n modulo 4?`,
  );
  const state = { base: baseValue, lastDigit, cycle, allowedDigits, residues, classCount: residues.length };

  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-016",
    seed,
    difficulty: difficulty(residues.length === 2 ? 3 : 5),
    answerSemantic: "EXPONENT_CLASS_SET",
    representation: "COMPOSITE_TERMINAL_CONDITION_MULTI_CLASS",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: verifier,
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-016", state),
    explanation: explanation(
      "A composite terminal condition can accept several positions in one power cycle, so the answer can contain several exponent classes.",
      "Map each allowed unit digit to its cycle position and keep the complete union of those exponent residues.",
      [
        `${baseValue} ends in ${lastDigit}, whose unit-digit cycle is ${cycle.join(", ")}.`,
        `The allowed digits ${allowedText} occur at exponent residues ${residues.join(", ")} modulo 4.`,
        `Keeping every accepted position gives ${answer}.`,
      ],
      `The complete exponent-class set is ${answer}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:COMPOSITE-MULTI-CLASS"),
    prototypeAncestry: ["NUM-CP009-POST-WAVE02:COMPOSITE_TERMINAL_CONDITION_MULTI_CLASS"],
  });
}

function generateP017(seed: number): NumCp009Wave03Package {
  const rng = createRng(seed * 191 + 71);
  const lastDigit = rng.pick([2, 3, 4, 7, 8, 9]);
  const baseValue = rng.int(1, 85) * 10 + lastDigit;
  const cycle = UNIT_DIGIT_CYCLES[lastDigit]!;
  const cycleLength = cycle.length;
  let termCount: number;
  if (seed % 5 === 0) {
    termCount = cycleLength * rng.int(12, 80);
  } else {
    termCount = rng.int(35, 420);
    if (termCount % cycleLength === 0) termCount += 1;
  }
  const fullBlocks = Math.floor(termCount / cycleLength);
  const leftoverCount = termCount % cycleLength;
  const cycleSum = cycle.reduce((sum, value) => sum + value, 0);
  const leftoverSum = cycle.slice(0, leftoverCount).reduce((sum, value) => sum + value, 0);
  const answer = mod(fullBlocks * cycleSum + leftoverSum, 10);
  let verifier = 0;
  for (let exponent = 1; exponent <= termCount; exponent += 1) {
    verifier = mod(verifier + powModVerifier(baseValue, exponent, 10), 10);
  }
  const noLeftover = mod(fullBlocks * cycleSum, 10);
  const options = numericOptions(answer, [
    { value: noLeftover, misconceptionId: "IGNORES_LEFTOVER_TERMS" },
    { value: unitDigitByCycle(baseValue, termCount), misconceptionId: "USES_ONLY_FINAL_POWER" },
    { value: mod(cycleSum, 10), misconceptionId: "USES_ONE_CYCLE_ONLY" },
    { value: mod(termCount, 10), misconceptionId: "USES_TERM_COUNT_AS_DIGIT" },
  ], rng, seed);
  const wording = stemVariant(
    seed,
    `What is the unit digit of ${baseValue}^1 + ${baseValue}^2 + ... + ${baseValue}^${termCount}?`,
    `Find the final digit of the sum ${baseValue} + ${baseValue}^2 + ... + ${baseValue}^${termCount}.`,
    `A long sum contains the first ${termCount} positive powers of ${baseValue}. Aggregate complete unit-digit cycles instead of expanding every term. What unit digit does the sum have?`,
  );
  const state = {
    base: baseValue,
    lastDigit,
    cycle,
    cycleLength,
    termCount,
    cycleSum,
    fullBlocks,
    leftoverCount,
    leftoverSum,
    answer,
  };

  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-017",
    seed,
    difficulty: difficulty(cycleLength === 2 && leftoverCount === 0 ? 3 : 5),
    answerSemantic: "UNIT_DIGIT",
    representation: "LONG_REPEATED_POWER_SUM",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-017", state),
    explanation: explanation(
      "In a long sum of consecutive powers, the unit digits repeat in blocks, so whole cycles can be aggregated at once.",
      "Find one complete unit-digit cycle, count full cycle blocks, then add the leftover cycle terms.",
      [
        `${baseValue} ends in ${lastDigit}; its power cycle is ${cycle.join(", ")} and one full cycle sums to ${cycleSum}.`,
        `${termCount} terms contain ${fullBlocks} complete cycle block${fullBlocks === 1 ? "" : "s"} with ${leftoverCount} leftover term${leftoverCount === 1 ? "" : "s"}.`,
        `The leftover cycle contribution is ${leftoverSum}, so the total is congruent to ${fullBlocks}×${cycleSum} + ${leftoverSum} modulo 10.`,
        `That gives unit digit ${answer}.`,
      ],
      `The unit digit is ${answer}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:LONG-REPEATED-POWER-SUM"),
    prototypeAncestry: ["NUM-CP009-POST-WAVE02:LONG_GEOMETRIC_OR_REPEATED_POWER_TERMINAL_SUM"],
  });
}

export const NUM_CP009_WAVE03_GENERATORS: Readonly<Record<NumCp009Wave03PrototypeId, (seed: number) => NumCp009Wave03Package>> = Object.freeze({
  "NUM-CP009-PROT-015": generateP015,
  "NUM-CP009-PROT-016": generateP016,
  "NUM-CP009-PROT-017": generateP017,
});

export function generateNumCp009Wave03(prototypeId: NumCp009Wave03PrototypeId, seed: number) {
  if (!Number.isInteger(seed) || seed < 0) throw new Error("Seed must be a non-negative integer");
  return NUM_CP009_WAVE03_GENERATORS[prototypeId](seed);
}

export function generateAllNumCp009Wave03(seed: number) {
  return NUM_CP009_WAVE03_PROTOTYPE_IDS.map((prototypeId) => generateNumCp009Wave03(prototypeId, seed));
}
