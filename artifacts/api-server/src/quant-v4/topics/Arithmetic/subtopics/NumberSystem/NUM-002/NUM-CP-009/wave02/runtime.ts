import {
  UNIT_DIGIT_CYCLES,
  base,
  createRng,
  difficulty,
  directTerminalVerifier,
  explanation,
  fixedWidthOptions,
  formatSet,
  mod,
  optionsWithSlot,
  powMod,
  powModVerifier,
  sources,
  unitDigitByCycle,
} from "./core.ts";
import {
  NUM_CP009_WAVE02_PROTOTYPE_IDS,
  type NumCp009Wave02Package,
  type NumCp009Wave02PrototypeId,
} from "./types.ts";

function stemVariant(seed: number, direct: string, imperative: string, exam: string) {
  const index = mod(seed, 3);
  return index === 0
    ? { stemFamily: "DIRECT", stem: direct }
    : index === 1
      ? { stemFamily: "IMPERATIVE", stem: imperative }
      : { stemFamily: "EXAM_STYLE", stem: exam };
}

function fingerprint(prototypeId: NumCp009Wave02PrototypeId, state: Record<string, unknown>) {
  return JSON.stringify({ prototypeId, ...state });
}

function expressionText(terms: readonly { base: number; exponent: number }[], operator: "SUM" | "DIFFERENCE" | "PRODUCT") {
  const symbol = operator === "SUM" ? " + " : operator === "DIFFERENCE" ? " − " : " × ";
  return terms.map((term) => `${term.base}^${term.exponent}`).join(symbol);
}

function generateP009(seed: number): NumCp009Wave02Package {
  const rng = createRng(seed * 149 + 37);
  const operator = rng.pick(["SUM", "DIFFERENCE", "PRODUCT"] as const);
  const termCount = seed % 4 === 0 ? 3 : 2;
  const bases = [
    rng.pick([3, 7, 9, 11, 13, 17, 19, 21, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49]),
    rng.pick([3, 7, 9, 11, 13, 17, 19, 21, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49]),
  ];
  if (termCount === 3) bases.push(rng.pick([3, 7, 9, 11, 13, 17, 19, 21, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49]));
  const terms = bases.map((baseValue) => ({ base: baseValue, exponent: rng.int(3, 140) }));
  const residues = terms.map((term) => powMod(term.base, term.exponent, 100));
  const answer = operator === "SUM"
    ? mod(residues.reduce((sum, value) => sum + value, 0), 100)
    : operator === "PRODUCT"
      ? mod(residues.reduce((product, value) => product * value, 1), 100)
      : mod(residues[0]! - residues.slice(1).reduce((sum, value) => sum + value, 0), 100);
  const verifier = directTerminalVerifier(terms, operator, 100);
  const expression = expressionText(terms, operator);
  const options = fixedWidthOptions(answer, 2, [
    { value: mod(answer, 10), misconceptionId: "USES_ONLY_UNIT_DIGIT" },
    { value: mod(residues.reduce((sum, value) => sum + value, 0), 100), misconceptionId: "COMBINES_WITH_ADDITION" },
    { value: mod(residues.reduce((product, value) => product * value, 1), 100), misconceptionId: "COMBINES_WITH_MULTIPLICATION" },
  ], rng, seed);
  const answerText = String(answer).padStart(2, "0");
  const wording = stemVariant(
    seed,
    `What are the last two digits of ${expression}?`,
    `Find the final two digits of ${expression}; keep a leading zero if it occurs.`,
    `Resolve each power in ${expression} modulo 100 and combine the terminal blocks. Which final two-digit block is obtained?`,
  );
  const state = { operator, terms, residues, answer: answerText };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-009",
    seed,
    difficulty: difficulty(termCount === 2 && operator === "SUM" ? 3 : 5),
    answerSemantic: "LAST_TWO_DIGITS",
    representation: `LAST_TWO_${operator}_OF_POWERS`,
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier).padStart(2, "0"),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-009", state),
    explanation: explanation(
      "The last two digits of an expression are its residue modulo 100.",
      "Find each power's two-digit residue first, then apply the displayed operation modulo 100.",
      [
        ...terms.map((term, index) => `${term.base}^${term.exponent} leaves ${String(residues[index]).padStart(2, "0")} modulo 100.`),
        `Combining those residues with the displayed operation gives ${answerText} modulo 100.`,
      ],
      `The last two digits are ${answerText}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:LAST-TWO-COMPOSITION"),
    prototypeAncestry: ["NUM-CP009-DESIGN:LAST-TWO-SUM-PRODUCT-EXPRESSION"],
  });
}

function generateP010(seed: number): NumCp009Wave02Package {
  const rng = createRng(seed * 151 + 41);
  const baseValue = rng.pick([3, 7, 9, 11, 13, 17, 19, 21, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49, 51, 53, 57, 59]);
  const exponent = seed % 5 === 0 ? rng.int(2, 24) : rng.int(40, 220);
  const answer = powMod(baseValue, exponent, 1000);
  const verifier = powModVerifier(baseValue, exponent, 1000);
  const options = fixedWidthOptions(answer, 3, [
    { value: mod(answer, 100), misconceptionId: "USES_ONLY_LAST_TWO_DIGITS" },
    { value: powMod(baseValue, mod(exponent, 10) || 10, 1000), misconceptionId: "REDUCES_EXPONENT_MODULO_TEN" },
    { value: mod(answer + 100, 1000), misconceptionId: "WRONG_HUNDREDS_DIGIT" },
  ], rng, seed);
  const answerText = String(answer).padStart(3, "0");
  const wording = stemVariant(
    seed,
    `What are the last three digits of ${baseValue}^${exponent}?`,
    `Find the final three digits of ${baseValue}^${exponent}; preserve any leading zeroes.`,
    `Work modulo 1000 for ${baseValue}^${exponent}. Which three-digit terminal block results?`,
  );
  const state = { base: baseValue, exponent, modulus: 1000, answer: answerText };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-010",
    seed,
    difficulty: difficulty(exponent <= 24 ? 3 : 5),
    answerSemantic: "LAST_THREE_DIGITS",
    representation: "POWER_MOD_1000",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier).padStart(3, "0"),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-010", state),
    explanation: explanation(
      "The last three digits are exactly the residue modulo 1000.",
      "Reduce the power modulo 1000 while preserving all three output positions.",
      [
        `Compute ${baseValue}^${exponent} modulo 1000 by repeated squaring rather than expanding the full number.`,
        `The residue is ${answerText}.`,
        `Because three terminal places are requested, ${answerText} is kept as a three-digit block.`,
      ],
      `The last three digits are ${answerText}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:LAST-THREE-SINGLE-POWER"),
    prototypeAncestry: ["NUM-CP009-DESIGN:LAST-THREE-DIGITS:SINGLE-POWER"],
  });
}

function generateP011(seed: number): NumCp009Wave02Package {
  const rng = createRng(seed * 157 + 43);
  const operator = rng.pick(["SUM", "DIFFERENCE", "PRODUCT"] as const);
  const termCount = seed % 3 === 0 ? 3 : 2;
  const pool = [3, 7, 9, 11, 13, 17, 19, 21, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49];
  const terms = Array.from({ length: termCount }, () => ({ base: rng.pick(pool), exponent: rng.int(3, 90) }));
  const residues = terms.map((term) => powMod(term.base, term.exponent, 1000));
  const answer = operator === "SUM"
    ? mod(residues.reduce((sum, value) => sum + value, 0), 1000)
    : operator === "PRODUCT"
      ? mod(residues.reduce((product, value) => product * value, 1), 1000)
      : mod(residues[0]! - residues.slice(1).reduce((sum, value) => sum + value, 0), 1000);
  const verifier = directTerminalVerifier(terms, operator, 1000);
  const expression = expressionText(terms, operator);
  const options = fixedWidthOptions(answer, 3, [
    { value: mod(answer, 100), misconceptionId: "USES_ONLY_LAST_TWO_DIGITS" },
    { value: mod(residues.reduce((sum, value) => sum + value, 0), 1000), misconceptionId: "COMBINES_WITH_ADDITION" },
    { value: mod(residues.reduce((product, value) => product * value, 1), 1000), misconceptionId: "COMBINES_WITH_MULTIPLICATION" },
  ], rng, seed);
  const answerText = String(answer).padStart(3, "0");
  const wording = stemVariant(
    seed,
    `What are the last three digits of ${expression}?`,
    `Determine the final three-digit block of ${expression}.`,
    `Reduce every power in ${expression} modulo 1000, then combine them. Which terminal block remains?`,
  );
  const state = { operator, terms, residues, answer: answerText };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-011",
    seed,
    difficulty: difficulty(termCount === 2 && operator === "SUM" ? 3 : 5),
    answerSemantic: "LAST_THREE_DIGITS",
    representation: `LAST_THREE_${operator}_OF_POWERS`,
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier).padStart(3, "0"),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-011", state),
    explanation: explanation(
      "A three-digit terminal block is computed modulo 1000.",
      "Resolve each powered term modulo 1000 before combining the terms.",
      [
        ...terms.map((term, index) => `${term.base}^${term.exponent} leaves ${String(residues[index]).padStart(3, "0")} modulo 1000.`),
        `Applying the displayed operation to those residues gives ${answerText}.`,
      ],
      `The last three digits are ${answerText}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:LAST-THREE-COMPOSITION"),
    prototypeAncestry: ["NUM-CP009-DESIGN:LAST-THREE-SUM-PRODUCT-EXPRESSION"],
  });
}

function exponentsForTarget(baseValue: number, targetDigit: number, lower: number, upper: number) {
  const values: number[] = [];
  for (let exponent = lower; exponent <= upper; exponent += 1) {
    if (powModVerifier(baseValue, exponent, 10) === targetDigit) values.push(exponent);
  }
  return values;
}

function setDistractors(correct: readonly number[], baseValue: number, lower: number, upper: number, rng: ReturnType<typeof createRng>) {
  const candidates: { value: string; misconceptionId: string }[] = [];
  const correctText = correct.length ? formatSet(correct) : "∅";
  for (let digit = 0; digit <= 9; digit += 1) {
    const set = exponentsForTarget(baseValue, digit, lower, upper);
    const text = set.length ? formatSet(set) : "∅";
    if (text !== correctText) candidates.push({ value: text, misconceptionId: "WRONG_CYCLE_CLASS" });
  }
  if (correct.length > 1) {
    candidates.push({ value: formatSet(correct.slice(0, -1)), misconceptionId: "DROPS_FINAL_VALID_EXPONENT" });
    candidates.push({ value: formatSet(correct.slice(1)), misconceptionId: "DROPS_FIRST_VALID_EXPONENT" });
  }
  const fallback = [
    [lower],
    [upper],
    [lower, upper],
    [],
  ];
  for (const values of fallback) {
    const text = values.length ? formatSet(values) : "∅";
    if (text !== correctText) candidates.push({ value: text, misconceptionId: "UNVERIFIED_BOUNDARY_SET" });
  }
  return candidates.sort(() => rng.next() - 0.5);
}

function generateP012(seed: number): NumCp009Wave02Package {
  const rng = createRng(seed * 163 + 47);
  const lastDigit = rng.pick([2, 3, 4, 7, 8, 9]);
  const baseValue = rng.int(1, 75) * 10 + lastDigit;
  const cycle = UNIT_DIGIT_CYCLES[lastDigit]!;
  const targetDigit = seed % 7 === 0 ? rng.pick([0, 5, 6]) : rng.pick(cycle);
  const lower = rng.int(1, 18);
  const span = seed % 5 === 0 ? rng.int(1, 3) : rng.int(5, 22);
  const upper = lower + span;
  const answerValues = exponentsForTarget(baseValue, targetDigit, lower, upper);
  const answer = answerValues.length ? formatSet(answerValues) : "∅";
  const verifierValues = exponentsForTarget(baseValue, targetDigit, lower, upper);
  const verifier = verifierValues.length ? formatSet(verifierValues) : "∅";
  const options = optionsWithSlot(answer, setDistractors(answerValues, baseValue, lower, upper, rng), rng, seed);
  const wording = stemVariant(
    seed,
    `For ${lower} ≤ n ≤ ${upper}, what is the complete set of n for which ${baseValue}^n ends in ${targetDigit}?`,
    `List every exponent n from ${lower} through ${upper} that makes ${baseValue}^n have unit digit ${targetDigit}.`,
    `Which option gives the complete bounded exponent set producing final digit ${targetDigit} for ${baseValue}^n, where ${lower} ≤ n ≤ ${upper}?`,
  );
  const state = { base: baseValue, lastDigit, cycle, targetDigit, lower, upper, answerValues };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-012",
    seed,
    difficulty: difficulty(answerValues.length === 1 ? 3 : 5),
    answerSemantic: "EXPONENT_SET",
    representation: "BOUNDED_EXPONENT_SET",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: verifier,
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-012", state),
    explanation: explanation(
      "A target unit digit corresponds to one or more repeating exponent positions.",
      "Find the relevant cycle position, then enumerate only the matching exponents inside the stated bounds.",
      [
        `${baseValue} ends in ${lastDigit}, whose unit-digit cycle is ${cycle.join(", ")}.`,
        answerValues.length === 0
          ? `The digit ${targetDigit} is not reached by any exponent from ${lower} to ${upper}.`
          : `Checking the matching cycle positions from ${lower} to ${upper} gives ${answer}.`,
        `No exponent outside that displayed set satisfies the terminal-digit condition within the bounds.`,
      ],
      `The complete set is ${answer}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:BOUNDED-EXPONENT-SET"),
    prototypeAncestry: ["NUM-CP009-DESIGN:RECOVER-BOUNDED-EXPONENT"],
  });
}

function generateP013(seed: number): NumCp009Wave02Package {
  const rng = createRng(seed * 167 + 53);
  const asksImpossible = seed % 2 === 0;
  const lastDigit = asksImpossible ? rng.pick([2, 3, 7, 8]) : rng.pick([4, 9]);
  const baseValue = rng.int(1, 80) * 10 + lastDigit;
  const cycle = [...UNIT_DIGIT_CYCLES[lastDigit]!];
  const outside = Array.from({ length: 10 }, (_, digit) => digit).filter((digit) => !cycle.includes(digit));
  let answer: number;
  let distractors: number[];
  if (asksImpossible) {
    answer = rng.pick(outside);
    distractors = cycle.slice(0, 3);
  } else {
    answer = rng.pick(cycle);
    distractors = outside.slice(0, 3);
  }
  const options = optionsWithSlot(String(answer), distractors.map((value) => ({
    value: String(value),
    misconceptionId: asksImpossible ? "ACTUALLY_REACHABLE_CYCLE_DIGIT" : "NOT_IN_POWER_CYCLE",
  })), rng, seed);
  const wording = asksImpossible
    ? stemVariant(
      seed,
      `Which of the following can never be the unit digit of ${baseValue}^n for positive integer n?`,
      `Choose the digit that is impossible in the units place of ${baseValue}^n, where n is positive.`,
      `The powers of ${baseValue} repeat through a fixed units-digit cycle. Which option lies outside that cycle?`,
    )
    : stemVariant(
      seed,
      `Which of the following can be the unit digit of ${baseValue}^n for some positive integer n?`,
      `Choose the digit that occurs in the units place of a positive power of ${baseValue}.`,
      `Among the options, which digit belongs to the repeating unit-digit cycle of ${baseValue}^n?`,
    );
  const state = { base: baseValue, lastDigit, cycle, asksImpossible, answer };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-013",
    seed,
    difficulty: difficulty(asksImpossible ? 4 : 2),
    answerSemantic: asksImpossible ? "IMPOSSIBLE_TERMINAL_DIGIT" : "POSSIBLE_TERMINAL_DIGIT",
    representation: "TERMINAL_DIGIT_FEASIBILITY",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(answer),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-013", state),
    explanation: explanation(
      "A positive power can end only in digits contained in the base's repeating unit-digit cycle.",
      "List the cycle and compare the options with it.",
      [
        `${baseValue} ends in ${lastDigit}, so its unit-digit cycle is ${cycle.join(", ")}.`,
        asksImpossible
          ? `${answer} does not occur anywhere in that cycle.`
          : `${answer} occurs in that cycle and is therefore reachable.`,
      ],
      asksImpossible ? `The impossible unit digit is ${answer}.` : `A possible unit digit is ${answer}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:FEASIBILITY"),
    prototypeAncestry: ["NUM-CP009-DESIGN:POSSIBLE-IMPOSSIBLE-TERMINAL-DIGIT"],
  });
}

function generateP014(seed: number): NumCp009Wave02Package {
  const rng = createRng(seed * 173 + 59);
  const baseValue = rng.pick([2, 3, 4, 7, 8, 9, 12, 13, 14, 17, 18, 19, 22, 23, 24, 27, 28, 29]);
  const n = rng.int(4, 24);
  const squareSum = seed % 2 === 1;
  const exponent = squareSum
    ? (n * (n + 1) * (2 * n + 1)) / 6
    : (n * (n + 1)) / 2;
  const answer = unitDigitByCycle(baseValue, exponent);
  const verifier = powModVerifier(baseValue, exponent, 10);
  const lastDigit = mod(baseValue, 10);
  const cycle = UNIT_DIGIT_CYCLES[lastDigit]!;
  const options = optionsWithSlot(String(answer), [
    { value: String(unitDigitByCycle(baseValue, n)), misconceptionId: "USES_N_AS_EXPONENT" },
    { value: String(lastDigit), misconceptionId: "IGNORES_STRUCTURED_EXPONENT" },
    { value: String(mod(exponent, 10)), misconceptionId: "USES_EXPONENT_LAST_DIGIT" },
    { value: String(cycle[0]!), misconceptionId: "USES_FIRST_CYCLE_MEMBER" },
  ], rng, seed);
  const exponentText = squareSum ? `1^2 + 2^2 + ... + ${n}^2` : `1 + 2 + ... + ${n}`;
  const wording = stemVariant(
    seed,
    `What is the unit digit of ${baseValue}^(${exponentText})?`,
    `Find the final digit of ${baseValue} raised to the exponent ${exponentText}.`,
    `First simplify the structured exponent ${exponentText}, then use the terminal cycle of ${baseValue}. Which unit digit results?`,
  );
  const state = { base: baseValue, n, exponentKind: squareSum ? "SUM_OF_SQUARES" : "TRIANGULAR_SUM", exponent, lastDigit, cycle, answer };
  return base({
    temporaryPrototypeId: "NUM-CP009-PROT-014",
    seed,
    difficulty: difficulty(squareSum ? 5 : 3),
    answerSemantic: "UNIT_DIGIT",
    representation: squareSum ? "STRUCTURED_SQUARE_SUM_EXPONENT" : "STRUCTURED_TRIANGULAR_EXPONENT",
    ...wording,
    options: options.options,
    correctIndex: options.correctIndex,
    canonicalAnswer: options.canonicalAnswer,
    verifierAnswer: String(verifier),
    hiddenState: state,
    mathematicalFingerprint: fingerprint("NUM-CP009-PROT-014", state),
    explanation: explanation(
      "When the exponent is itself an arithmetic pattern, simplify that exponent before locating the power-cycle position.",
      "Compute the structured exponent exactly, reduce it by the unit-digit cycle length, and then read the terminal digit.",
      [
        squareSum
          ? `1^2 + 2^2 + ... + ${n}^2 = ${n}×${n + 1}×${2 * n + 1}/6 = ${exponent}.`
          : `1 + 2 + ... + ${n} = ${n}×${n + 1}/2 = ${exponent}.`,
        `${baseValue} ends in ${lastDigit}, with cycle ${cycle.join(", ")}.`,
        `Exponent ${exponent} selects the cycle position giving unit digit ${answer}.`,
      ],
      `The unit digit is ${answer}.`,
    ),
    sourceAncestry: sources("TERMINAL-DIGIT:STRUCTURED-EXPONENT"),
    prototypeAncestry: ["NUM-CP009-DESIGN:FACTORIAL-OR-STRUCTURED-EXPONENT"],
  });
}

export const NUM_CP009_WAVE02_GENERATORS: Readonly<Record<NumCp009Wave02PrototypeId, (seed: number) => NumCp009Wave02Package>> = Object.freeze({
  "NUM-CP009-PROT-009": generateP009,
  "NUM-CP009-PROT-010": generateP010,
  "NUM-CP009-PROT-011": generateP011,
  "NUM-CP009-PROT-012": generateP012,
  "NUM-CP009-PROT-013": generateP013,
  "NUM-CP009-PROT-014": generateP014,
});

export function generateNumCp009Wave02(prototypeId: NumCp009Wave02PrototypeId, seed: number) {
  if (!Number.isInteger(seed) || seed < 0) throw new Error("Seed must be a non-negative integer");
  return NUM_CP009_WAVE02_GENERATORS[prototypeId](seed);
}

export function generateAllNumCp009Wave02(seed: number) {
  return NUM_CP009_WAVE02_PROTOTYPE_IDS.map((prototypeId) => generateNumCp009Wave02(prototypeId, seed));
}
