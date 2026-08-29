import {
  UNIT_DIGIT_CYCLES,
  base,
  bruteUnitCycleLength,
  createRng,
  difficulty,
  explanation,
  fixedWidthOptions,
  mod,
  multiplicativeOrder,
  numericOptions,
  optionsWithSlot,
  powMod,
  powModVerifier,
  sources,
  unitDigitByCycle,
} from "./core.ts";
import {
  NUM_CP009_WAVE01_PROTOTYPE_IDS,
  type NumCp009Wave01Package,
  type NumCp009Wave01PrototypeId,
} from "./types.ts";

function stemVariant(seed: number, direct: string, imperative: string, exam: string) {
  const index = mod(seed, 3);
  return index === 0
    ? { stemFamily: "DIRECT", stem: direct }
    : index === 1
      ? { stemFamily: "IMPERATIVE", stem: imperative }
      : { stemFamily: "EXAM_STYLE", stem: exam };
}

function fingerprint(prototypeId: NumCp009Wave01PrototypeId, state: Record<string, unknown>) {
  return JSON.stringify({ prototypeId, ...state });
}

function cycleText(lastDigit: number) {
  return UNIT_DIGIT_CYCLES[lastDigit]!.join(", ");
}

function generateP001(seed: number): NumCp009Wave01Package {
  const rng = createRng(seed * 101 + 9);
  const baseValue = rng.pick([12, 23, 34, 47, 58, 69, 70, 81, 95, 106, 217, 328, 439, 542, 673, 784, 895]);
  const exponent = seed % 17 === 0 ? 0 : rng.int(1, 420);
  const answer = unitDigitByCycle(baseValue, exponent);
  const verifier = powModVerifier(baseValue, exponent, 10);
  const lastDigit = mod(baseValue, 10);
  const cycle = UNIT_DIGIT_CYCLES[lastDigit]!;
  const wrongExponentPosition = exponent === 0 ? 0 : mod(exponent, cycle.length);
  const options = numericOptions(answer, [
    { value: lastDigit, misconceptionId: "USES_BASE_LAST_DIGIT_WITHOUT_POWER" },
    { value: cycle[Math.min(wrongExponentPosition, cycle.length - 1)]!, misconceptionId: "ZERO_REMAINDER_MAPPED_TO_FIRST_ENTRY" },
    { value: mod(exponent, 10), misconceptionId: "USES_EXPONENT_LAST_DIGIT" },
  ], rng, seed);
  const wording = stemVariant(
    seed,
    `What is the unit digit of ${baseValue}^${exponent}?`,
    `Find the unit digit of ${baseValue}^${exponent}.`,
    `The number ${baseValue}^${exponent} is evaluated only for its final digit. Which digit is obtained?`,
  );
  const steps = exponent === 0
    ? [
      `Any non-zero number raised to the power 0 equals 1.`,
      `Therefore ${baseValue}^0 has unit digit 1.`,
    ]
    : [
      `Only the last digit ${lastDigit} of the base matters. Its cycle is ${cycleText(lastDigit)}.`,
      `The cycle length is ${cycle.length}; ${exponent} gives position ${mod(exponent - 1, cycle.length) + 1} in that cycle.`,
      `That position gives the unit digit ${answer}.`,
    ];
  const state = { base: baseValue, exponent, lastDigit, cycleLength: cycle.length, answer };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-001",
    seed,
    difficulty: difficulty((cycle.length === 1 ? 0 : cycle.length === 2 ? 1 : 3) + (exponent > 99 ? 1 : 0)),
    answerSemantic: "UNIT_DIGIT",
    representation: "POWER_EXPRESSION",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-001", state),
    explanation: explanation(
      "Powers repeat in a fixed unit-digit cycle.",
      "Reduce the base to its final digit, then locate the exponent in that digit's cycle.",
      steps,
      `The unit digit is ${answer}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:SINGLE-POWER"),
    prototypeAncestry: ["QUANT-V3:NS-LASTDIG-001:CP-001"],
  });
}

function generateP002(seed: number): NumCp009Wave01Package {
  const rng = createRng(seed * 103 + 11);
  const termCount = seed % 4 === 0 ? 3 : 2;
  const bases = [rng.pick([12, 13, 17, 18, 23, 24, 27, 28, 32, 33, 37, 38]), rng.pick([14, 19, 22, 26, 29, 31, 34, 39, 42, 43, 47, 48])];
  if (termCount === 3) bases.push(rng.pick([16, 21, 25, 36, 45, 56, 65, 76, 85, 96]));
  const exponents = bases.map(() => rng.int(3, 180));
  const unitDigits = bases.map((value, index) => unitDigitByCycle(value, exponents[index]!));
  const answer = unitDigits.reduce((acc, value) => mod(acc * value, 10), 1);
  const verifier = bases.reduce((acc, value, index) => mod(acc * powModVerifier(value, exponents[index]!, 10), 10), 1);
  const expression = bases.map((value, index) => `${value}^${exponents[index]}`).join(" × ");
  const options = numericOptions(answer, [
    { value: unitDigits.reduce((acc, value) => acc + value, 0) % 10, misconceptionId: "ADDS_COMPONENT_DIGITS" },
    { value: mod(bases.reduce((acc, value) => acc * mod(value, 10), 1), 10), misconceptionId: "IGNORES_EXPONENTS" },
    { value: unitDigits[0]!, misconceptionId: "USES_ONLY_FIRST_POWER" },
  ], rng, seed);
  const wording = stemVariant(
    seed,
    `What is the unit digit of ${expression}?`,
    `Find the final digit of ${expression}.`,
    `After evaluating the cyclic unit digits of the factors in ${expression}, which unit digit does the product have?`,
  );
  const state = { bases, exponents, unitDigits, answer };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-002",
    seed,
    difficulty: difficulty(termCount === 2 ? 2 : 4),
    answerSemantic: "UNIT_DIGIT",
    representation: "PRODUCT_OF_POWERS",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-002", state),
    explanation: explanation(
      "Resolve each power's unit digit before multiplying.",
      "Work component by component; only then combine the resulting digits modulo 10.",
      [
        ...bases.map((value, index) => `${value}^${exponents[index]} has unit digit ${unitDigits[index]}.`),
        `Multiplying these unit digits gives final digit ${answer}.`,
      ],
      `The unit digit is ${answer}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:PRODUCT-OF-POWERS"),
    prototypeAncestry: ["QUANT-V3:NS-LASTDIG-001:CP-002"],
  });
}

function generateP003(seed: number): NumCp009Wave01Package {
  const rng = createRng(seed * 107 + 13);
  const firstBase = rng.pick([12, 13, 17, 18, 22, 23, 27, 28, 32, 33, 37, 38]);
  const secondBase = rng.pick([14, 19, 21, 24, 26, 29, 31, 34, 39, 42, 43, 47]);
  const firstExponent = rng.int(4, 160);
  const secondExponent = rng.int(3, 150);
  const operator = seed % 2 === 0 ? "+" : "−";
  const firstDigit = unitDigitByCycle(firstBase, firstExponent);
  const secondDigit = unitDigitByCycle(secondBase, secondExponent);
  const answer = operator === "+" ? mod(firstDigit + secondDigit, 10) : mod(firstDigit - secondDigit, 10);
  const verifier = operator === "+"
    ? mod(powModVerifier(firstBase, firstExponent, 10) + powModVerifier(secondBase, secondExponent, 10), 10)
    : mod(powModVerifier(firstBase, firstExponent, 10) - powModVerifier(secondBase, secondExponent, 10), 10);
  const expression = `${firstBase}^${firstExponent} ${operator} ${secondBase}^${secondExponent}`;
  const options = numericOptions(answer, [
    { value: mod(firstDigit + secondDigit, 10), misconceptionId: "TREATS_DIFFERENCE_AS_SUM" },
    { value: mod(Math.abs(firstDigit - secondDigit), 10), misconceptionId: "USES_ABSOLUTE_DIFFERENCE" },
    { value: firstDigit, misconceptionId: "USES_ONLY_FIRST_TERM" },
  ], rng, seed);
  const wording = stemVariant(
    seed,
    `What is the unit digit of ${expression}?`,
    `Determine the final digit of ${expression}.`,
    `Resolve the power cycles in ${expression}. Which digit appears in the units place?`,
  );
  const state = { firstBase, firstExponent, secondBase, secondExponent, operator, firstDigit, secondDigit, answer };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-003",
    seed,
    difficulty: difficulty(operator === "+" ? 2 : 4),
    answerSemantic: "UNIT_DIGIT",
    representation: "SUM_DIFFERENCE_OF_POWERS",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-003", state),
    explanation: explanation(
      "For sums and differences, first resolve each power's unit digit.",
      "Combine the two terminal residues only after both cycles are solved.",
      [
        `${firstBase}^${firstExponent} has unit digit ${firstDigit}.`,
        `${secondBase}^${secondExponent} has unit digit ${secondDigit}.`,
        operator === "+"
          ? `${firstDigit} + ${secondDigit} leaves unit digit ${answer}.`
          : `${firstDigit} − ${secondDigit} is normalised modulo 10 to ${answer}.`,
      ],
      `The unit digit is ${answer}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:SUM-DIFFERENCE"),
    prototypeAncestry: ["NUM-CP009-DESIGN:UNIT-DIGIT-SUM-DIFFERENCE"],
  });
}

function generateP004(seed: number): NumCp009Wave01Package {
  const rng = createRng(seed * 109 + 17);
  const outerBase = rng.pick([2, 3, 4, 7, 8, 9, 12, 13, 14, 17, 18, 19, 22, 23, 24, 27, 28, 29]);
  const innerBase = rng.int(2, 9);
  const innerExponent = rng.int(2, 5);
  const actualExponent = Number(BigInt(innerBase) ** BigInt(innerExponent));
  const answer = unitDigitByCycle(outerBase, actualExponent);
  const verifier = powModVerifier(outerBase, actualExponent, 10);
  const outerLastDigit = mod(outerBase, 10);
  const cycle = UNIT_DIGIT_CYCLES[outerLastDigit]!;
  const effectiveResidue = mod(actualExponent, cycle.length);
  const expression = `${outerBase}^(${innerBase}^${innerExponent})`;
  const options = numericOptions(answer, [
    { value: unitDigitByCycle(outerBase, innerBase * innerExponent), misconceptionId: "MULTIPLIES_TOWER_EXPONENTS" },
    { value: unitDigitByCycle(outerBase, innerExponent), misconceptionId: "USES_ONLY_TOP_EXPONENT" },
    { value: outerLastDigit, misconceptionId: "IGNORES_TOWER" },
  ], rng, seed);
  const wording = stemVariant(
    seed,
    `What is the unit digit of ${expression}?`,
    `Find the final digit of the power tower ${expression}.`,
    `For ${expression}, reduce the upper exponent only as far as the outer unit-digit cycle needs. What is the final digit?`,
  );
  const state = { outerBase, innerBase, innerExponent, actualExponent, cycleLength: cycle.length, effectiveResidue, answer };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-004",
    seed,
    difficulty: difficulty(cycle.length === 2 ? 3 : 5),
    answerSemantic: "UNIT_DIGIT",
    representation: "POWER_TOWER",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-004", state),
    explanation: explanation(
      "A power tower is reduced through the cycle length needed by the outer base.",
      "Find the outer unit-digit cycle, reduce the upper exponent to its cycle position, then read the final digit.",
      [
        `The outer base ends in ${outerLastDigit}, whose cycle is ${cycleText(outerLastDigit)}.`,
        `${innerBase}^${innerExponent} = ${actualExponent}, so its residue modulo cycle length ${cycle.length} is ${effectiveResidue}.`,
        effectiveResidue === 0
          ? `A zero cycle residue means the final member of the cycle, giving ${answer}.`
          : `Cycle position ${effectiveResidue} gives ${answer}.`,
      ],
      `The unit digit is ${answer}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:POWER-TOWER"),
    prototypeAncestry: ["QUANT-V3:NS-LASTDIG-001:CP-003"],
  });
}

function generateP005(seed: number): NumCp009Wave01Package {
  const rng = createRng(seed * 113 + 19);
  const lastDigit = rng.int(0, 9);
  const baseValue = rng.int(1, 80) * 10 + lastDigit;
  const answer = UNIT_DIGIT_CYCLES[lastDigit]!.length;
  const verifier = bruteUnitCycleLength(lastDigit);
  const options = numericOptions(answer, [
    { value: 4, misconceptionId: "ASSUMES_ALL_CYCLES_HAVE_LENGTH_FOUR" },
    { value: 2, misconceptionId: "ASSUMES_TWO_TERM_CYCLE" },
    { value: 1, misconceptionId: "ASSUMES_CONSTANT_UNIT_DIGIT" },
  ], rng, seed);
  const wording = stemVariant(
    seed,
    `What is the length of the repeating unit-digit cycle of powers of ${baseValue}?`,
    `Identify the unit-digit cycle length for successive positive powers of ${baseValue}.`,
    `The powers of ${baseValue} repeat in their units place. After how many powers does that units-digit pattern repeat?`,
  );
  const state = { base: baseValue, lastDigit, cycle: UNIT_DIGIT_CYCLES[lastDigit], answer };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-005",
    seed,
    difficulty: difficulty(answer === 1 ? 0 : answer === 2 ? 1 : 2),
    answerSemantic: "CYCLE_LENGTH",
    representation: "CYCLE_PATTERN",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-005", state),
    explanation: explanation(
      "The final digit of successive powers repeats in a short fixed cycle.",
      "Use only the last digit of the base and list powers until the first pattern returns.",
      [
        `${baseValue} ends in ${lastDigit}.`,
        `Its unit-digit pattern is ${cycleText(lastDigit)}.`,
        `This pattern contains ${answer} term${answer === 1 ? "" : "s"} before repeating.`,
      ],
      `The cycle length is ${answer}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:CYCLE-LENGTH"),
    prototypeAncestry: ["QUANT-V3:NS-LASTDIG-001:CP-004"],
  });
}

function classText(residue: number) {
  return `n ≡ ${residue} (mod 4)`;
}

function generateP006(seed: number): NumCp009Wave01Package {
  const rng = createRng(seed * 127 + 23);
  const lastDigit = rng.pick([2, 3, 7, 8]);
  const baseValue = rng.int(1, 70) * 10 + lastDigit;
  const residue = rng.int(0, 3);
  const cycle = UNIT_DIGIT_CYCLES[lastDigit]!;
  const targetDigit = residue === 0 ? cycle[3]! : cycle[residue - 1]!;
  const answer = classText(residue);
  const verifierResidues = [0, 1, 2, 3].filter((candidate) => {
    const exponent = candidate === 0 ? 4 : candidate;
    return powModVerifier(baseValue, exponent, 10) === targetDigit;
  });
  const verifier = verifierResidues.length === 1 ? classText(verifierResidues[0]!) : "AMBIGUOUS";
  const options = optionsWithSlot(answer, [0, 1, 2, 3]
    .filter((candidate) => candidate !== residue)
    .map((candidate) => ({ value: classText(candidate), misconceptionId: "WRONG_CYCLE_POSITION" })), rng, seed);
  const wording = stemVariant(
    seed,
    `For positive integer n, ${baseValue}^n ends in ${targetDigit}. Which exponent class must n belong to?`,
    `Choose the congruence class of n that makes ${baseValue}^n have unit digit ${targetDigit}.`,
    `The final digit of ${baseValue}^n is known to be ${targetDigit}. Which condition on n modulo 4 is correct?`,
  );
  const state = { base: baseValue, lastDigit, targetDigit, residue, cycle };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-006",
    seed,
    difficulty: difficulty(residue === 0 || residue === 3 ? 4 : 3),
    answerSemantic: "EXPONENT_CLASS",
    representation: "INVERSE_CYCLE_CLASS",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: verifier,
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-006", state),
    explanation: explanation(
      "A target unit digit identifies a position in the base's cycle.",
      "Read the target digit's cycle position and convert that position into an exponent congruence class.",
      [
        `${baseValue} ends in ${lastDigit}, so its cycle is ${cycleText(lastDigit)}.`,
        `The target digit ${targetDigit} occurs at the position corresponding to exponent residue ${residue} modulo 4.`,
        `Hence ${answer}.`,
      ],
      `The required class is ${answer}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:INVERSE-EXPONENT-CLASS"),
    prototypeAncestry: ["QUANT-V3:NS-LASTDIG-001:CP-005"],
  });
}

function countResidueInInterval(lower: number, upper: number, residue: number, modulus: number) {
  let count = 0;
  for (let value = lower; value <= upper; value += 1) if (mod(value, modulus) === residue) count += 1;
  return count;
}

function generateP007(seed: number): NumCp009Wave01Package {
  const rng = createRng(seed * 131 + 29);
  const lastDigit = rng.pick([2, 3, 4, 7, 8, 9]);
  const cycle = UNIT_DIGIT_CYCLES[lastDigit]!;
  const baseValue = rng.int(1, 80) * 10 + lastDigit;
  const modulus = cycle.length;
  const residue = rng.int(0, modulus - 1);
  const targetDigit = residue === 0 ? cycle[cycle.length - 1]! : cycle[residue - 1]!;
  const lower = rng.int(1, 45);
  const span = seed % 5 === 0 ? rng.int(1, 3) : rng.int(12, 85);
  const upper = lower + span;
  const answer = countResidueInInterval(lower, upper, residue, modulus);
  let verifier = 0;
  for (let exponent = lower; exponent <= upper; exponent += 1) {
    if (powModVerifier(baseValue, exponent, 10) === targetDigit) verifier += 1;
  }
  const options = numericOptions(answer, [
    { value: Math.floor((upper - lower + 1) / modulus), misconceptionId: "DROPS_INTERVAL_ALIGNMENT" },
    { value: Math.ceil((upper - lower + 1) / modulus), misconceptionId: "ROUNDS_WITHOUT_BOUNDARY_CHECK" },
    { value: upper - lower + 1, misconceptionId: "COUNTS_ALL_EXPONENTS" },
  ], rng, seed);
  const wording = stemVariant(
    seed,
    `How many integers n with ${lower} ≤ n ≤ ${upper} make ${baseValue}^n end in ${targetDigit}?`,
    `Count the exponents n from ${lower} through ${upper} for which ${baseValue}^n has unit digit ${targetDigit}.`,
    `Within the inclusive range ${lower} to ${upper}, how many exponent values place ${baseValue}^n at the cycle position giving final digit ${targetDigit}?`,
  );
  const state = { base: baseValue, lastDigit, cycle, modulus, residue, targetDigit, lower, upper, answer };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-007",
    seed,
    difficulty: difficulty((modulus === 4 ? 2 : 1) + (span > 40 ? 2 : 1)),
    answerSemantic: "COUNT",
    representation: "BOUNDED_EXPONENT_RANGE",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-007", state),
    explanation: explanation(
      "A target unit digit repeats at fixed exponent residues.",
      "Identify the required exponent residue, then count only those exponents inside the stated inclusive interval.",
      [
        `${baseValue} ends in ${lastDigit}, with cycle ${cycleText(lastDigit)}.`,
        `The digit ${targetDigit} occurs when n ≡ ${residue} (mod ${modulus}).`,
        `Counting that residue class from ${lower} to ${upper} gives ${answer} exponent${answer === 1 ? "" : "s"}.`,
      ],
      `The count is ${answer}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:BOUNDED-EXPONENT-COUNT"),
    prototypeAncestry: ["NUM-CP009-DESIGN:INVERSE-CYCLE-COUNT"],
  });
}

function generateP008(seed: number): NumCp009Wave01Package {
  const rng = createRng(seed * 137 + 31);
  const forcedLeadingZero = seed % 5 === 0;
  const baseValue = forcedLeadingZero ? 11 : rng.pick([3, 7, 9, 11, 13, 17, 19, 21, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49]);
  const exponent = forcedLeadingZero ? 20 : rng.int(2, 180);
  const order = multiplicativeOrder(baseValue, 100);
  const reducedExponent = mod(exponent, order);
  const effectiveExponent = reducedExponent === 0 ? order : reducedExponent;
  const answer = powMod(baseValue, effectiveExponent, 100);
  const verifier = powModVerifier(baseValue, exponent, 100);
  const options = fixedWidthOptions(answer, 2, [
    { value: mod(answer, 10), misconceptionId: "USES_ONLY_UNIT_DIGIT" },
    { value: powMod(baseValue, Math.max(1, mod(exponent, 10)), 100), misconceptionId: "REDUCES_EXPONENT_MODULO_TEN" },
    { value: mod(answer + 10, 100), misconceptionId: "WRONG_TENS_DIGIT" },
  ], rng, seed);
  const answerText = String(answer).padStart(2, "0");
  const wording = stemVariant(
    seed,
    `What are the last two digits of ${baseValue}^${exponent}?`,
    `Find the final two digits of ${baseValue}^${exponent}; write both digits, including a leading zero if needed.`,
    `Reduce ${baseValue}^${exponent} modulo 100. Which two-digit terminal block is obtained?`,
  );
  const state = { base: baseValue, exponent, modulus: 100, order, reducedExponent, effectiveExponent, answer: answerText };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-008",
    seed,
    difficulty: difficulty(order <= 4 ? 3 : 5),
    answerSemantic: "LAST_TWO_DIGITS",
    representation: "POWER_MOD_100",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier).padStart(2, "0"),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-008", state),
    explanation: explanation(
      "The last two digits are the residue modulo 100, and both digit places belong to the answer.",
      "Use the repeating power cycle modulo 100, reduce the exponent by that cycle length, then keep a two-digit result.",
      [
        `For base ${baseValue}, the power cycle modulo 100 has length ${order}.`,
        `${exponent} reduces to ${reducedExponent} modulo ${order}${reducedExponent === 0 ? `, so use the final cycle position ${order}` : ""}.`,
        `The resulting residue modulo 100 is ${answerText}.`,
      ],
      `The last two digits are ${answerText}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:LAST-TWO-SINGLE-POWER"),
    prototypeAncestry: ["NUM-CP009-DESIGN:LAST-TWO-DIGITS:SINGLE-POWER"],
  });
}

export const NUM_CP009_WAVE01_GENERATORS: Readonly<Record<NumCp009Wave01PrototypeId, (seed: number) => NumCp009Wave01Package>> = Object.freeze({
  "NUM-CP009-PROT-001": generateP001,
  "NUM-CP009-PROT-002": generateP002,
  "NUM-CP009-PROT-003": generateP003,
  "NUM-CP009-PROT-004": generateP004,
  "NUM-CP009-PROT-005": generateP005,
  "NUM-CP009-PROT-006": generateP006,
  "NUM-CP009-PROT-007": generateP007,
  "NUM-CP009-PROT-008": generateP008,
});

export function generateNumCp009Wave01(prototypeId: NumCp009Wave01PrototypeId, seed: number) {
  if (!Number.isInteger(seed) || seed < 0) throw new Error("Seed must be a non-negative integer");
  return NUM_CP009_WAVE01_GENERATORS[prototypeId](seed);
}

export function generateAllNumCp009Wave01(seed: number) {
  return NUM_CP009_WAVE01_PROTOTYPE_IDS.map((prototypeId) => generateNumCp009Wave01(prototypeId, seed));
}
