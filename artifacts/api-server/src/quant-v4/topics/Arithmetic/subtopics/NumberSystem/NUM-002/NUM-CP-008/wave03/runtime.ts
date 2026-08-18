import {
  base,
  countProgressionInRange,
  createRng,
  crtMany,
  difficulty,
  gcd,
  lcm,
  leastPositive,
  mod,
  numericOptions,
  sources,
  systemSolutions,
  textOptions,
  type Rng,
} from "./common.ts";
import type { NumCp008Wave03Package, NumCp008Wave03PrototypeId } from "./types.ts";

function tier(seed: number): 0 | 1 | 2 {
  return ((seed - 1) % 3) as 0 | 1 | 2;
}

function fingerprint(id: NumCp008Wave03PrototypeId, state: Readonly<Record<string, unknown>>): string {
  return `${id}:${JSON.stringify(state)}`;
}

function systemPeriod(constraints: readonly { residue: number; modulus: number }[]): number {
  return constraints.reduce((period, item) => lcm(period, item.modulus), 1);
}

function directLeastPositive(constraints: readonly { residue: number; modulus: number }[]): number {
  const period = systemPeriod(constraints);
  for (let x = 1; x <= period; x += 1) {
    if (constraints.every((item) => mod(x, item.modulus) === mod(item.residue, item.modulus))) return x;
  }
  throw new Error("No positive system solution");
}

function candidateOptions(answer: number, wrongValues: readonly number[], rng: Rng) {
  return numericOptions(answer, wrongValues.map((value, index) => ({ value, misconceptionId: `FAILED_SYSTEM_CHECK_${index + 1}` })), rng);
}

function p017(seed: number): NumCp008Wave03Package {
  const rng = createRng(seed * 173 + 8);
  const t = tier(seed);
  const pairs = t === 0 ? [[5, 7], [7, 9], [8, 11]] as const : t === 1 ? [[9, 14], [10, 13], [12, 17]] as const : [[14, 19], [15, 22], [16, 21]] as const;
  const [m1, m2] = rng.pick(pairs);
  const period = lcm(m1, m2);
  const least = rng.int(1, period);
  const r1 = mod(least, m1);
  const missingResidue = mod(least, m2);
  const constraints = [{ residue: r1, modulus: m1 }, { residue: missingResidue, modulus: m2 }] as const;
  const merged = crtMany(constraints);
  if (!merged || leastPositive(merged.residue, merged.period) !== least) return p017(seed + 997);
  const verifier = mod(least, m2);
  const options = numericOptions(missingResidue, [
    { value: mod(missingResidue + 1, m2), misconceptionId: "OFF_BY_ONE_RESIDUE" },
    { value: mod(least, m1), misconceptionId: "REUSED_OTHER_MODULUS_RESIDUE" },
    { value: mod(m2 - missingResidue, m2), misconceptionId: "USED_COMPLEMENT_RESIDUE" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "MISSING_RESIDUE_FROM_SYSTEM", least, m1, m2, r1, missingResidue, period });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-017",
    seed,
    difficulty: difficulty(t, 1),
    answerSemantic: "MISSING_RESIDUE",
    representation: "INVERSE_CONGRUENCE_SYSTEM",
    stem: `The least positive solution of x ≡ ${r1} (mod ${m1}) and x ≡ r (mod ${m2}) is ${least}. Find the least non-negative value of r.`,
    ...options,
    verifierAnswer: String(verifier),
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP008-PROT-017", hiddenState),
    explanation: {
      coreConcept: "A stated solution must leave the required residue under every modulus in the system.",
      strategy: "Use the given least solution directly in the congruence containing the missing residue.",
      steps: [`Compute ${least} mod ${m2}.`, `${least} = ${Math.floor(least / m2)}×${m2} + ${missingResidue}, so r = ${missingResidue}.`],
      finalAnswer: String(missingResidue),
    },
    sourceAncestry: sources("CP008_DESIGN:MISSING_RESIDUE_INVERSE_STATE"),
    prototypeAncestry: ["MISSING_RESIDUE_FROM_SYSTEM"],
  });
}

function p018(seed: number): NumCp008Wave03Package {
  const rng = createRng(seed * 179 + 8);
  const t = tier(seed);
  const baseValue = rng.int(2, t === 2 ? 12 : 9);
  const exponent = t === 0 ? rng.int(3, 6) : t === 1 ? rng.int(7, 11) : rng.int(12, 18);
  const innerModulus = t === 0 ? rng.int(5, 11) : t === 1 ? rng.int(12, 21) : rng.int(22, 35);
  const add = rng.int(1, 9);
  const multiplier = rng.int(2, 8);
  const shift = rng.int(1, 11);
  const outerModulus = t === 0 ? rng.int(6, 13) : t === 1 ? rng.int(14, 25) : rng.int(26, 41);

  let powerResidue = 1;
  let factor = mod(baseValue, innerModulus);
  let e = exponent;
  while (e > 0) {
    if (e % 2 === 1) powerResidue = mod(powerResidue * factor, innerModulus);
    factor = mod(factor * factor, innerModulus);
    e = Math.floor(e / 2);
  }
  const inner = mod(powerResidue + add, innerModulus);
  const answer = mod(inner * multiplier + shift, outerModulus);

  const exactPower = BigInt(baseValue) ** BigInt(exponent);
  const verifierInner = Number((exactPower + BigInt(add)) % BigInt(innerModulus));
  const verifier = Number((BigInt(verifierInner * multiplier + shift)) % BigInt(outerModulus));
  const options = numericOptions(answer, [
    { value: mod(powerResidue * multiplier + shift, outerModulus), misconceptionId: "FORGOT_INNER_ADDITION" },
    { value: mod(inner + multiplier + shift, outerModulus), misconceptionId: "ADDED_INSTEAD_OF_MULTIPLIED" },
    { value: mod((powerResidue + add) * multiplier + shift, innerModulus), misconceptionId: "USED_INNER_MODULUS_AT_END" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "NESTED_MODULAR_EXPRESSION", baseValue, exponent, add, innerModulus, multiplier, shift, outerModulus, powerResidue, inner, answer });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-018",
    seed,
    difficulty: difficulty(t, 2),
    answerSemantic: "REMAINDER",
    representation: "NESTED_MODULAR_EXPRESSION",
    stem: `First let y be the least non-negative residue of ${baseValue}^${exponent} + ${add} modulo ${innerModulus}. Find the least non-negative residue of ${multiplier}y + ${shift} modulo ${outerModulus}.`,
    ...options,
    verifierAnswer: String(verifier),
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP008-PROT-018", hiddenState),
    explanation: {
      coreConcept: "In a nested modular expression, finish the inner residue before applying the outer modulus.",
      strategy: "Reduce the power modulo the inner modulus, form y, then substitute y into the outer expression.",
      steps: [`${baseValue}^${exponent} ≡ ${powerResidue} (mod ${innerModulus}), so y ≡ ${powerResidue}+${add} ≡ ${inner}.`, `${multiplier}×${inner}+${shift} = ${multiplier * inner + shift}, whose remainder modulo ${outerModulus} is ${answer}.`],
      finalAnswer: String(answer),
    },
    sourceAncestry: sources("CP008_DESIGN:NESTED_MODULAR_EXPRESSIONS"),
    prototypeAncestry: ["NESTED_MODULAR_EXPRESSION"],
  });
}

function p019(seed: number): NumCp008Wave03Package {
  const rng = createRng(seed * 181 + 8);
  const t = tier(seed);
  const modulusSets = t === 0 ? [[5, 7], [6, 7]] as const : t === 1 ? [[7, 9, 10], [8, 9, 11]] as const : [[9, 10, 13], [10, 12, 17]] as const;
  const moduli = rng.pick(modulusSets);
  const period = moduli.reduce((acc, modulus) => lcm(acc, modulus), 1);
  const target = rng.int(1, period);
  const constraints = moduli.map((modulus) => ({ residue: mod(target, modulus), modulus }));
  const merged = crtMany(constraints)!;
  const answer = leastPositive(merged.residue, merged.period);
  const wrongValues = [answer + 1, answer + 2, answer + 3];
  const candidates = [answer, ...wrongValues];
  const verifierMatches = candidates.filter((candidate) => constraints.every((item) => mod(candidate, item.modulus) === item.residue));
  if (verifierMatches.length !== 1 || verifierMatches[0] !== answer) throw new Error("Candidate verification is not unique");
  const options = candidateOptions(answer, wrongValues, rng);
  const hiddenState = Object.freeze({ mode: "SYSTEM_CANDIDATE_VERIFICATION", constraints, candidates, answer, period: merged.period });
  const systemText = constraints.map((item) => `x ≡ ${item.residue} (mod ${item.modulus})`).join(", ");
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-019",
    seed,
    difficulty: difficulty(t, 2),
    answerSemantic: "VALID_CANDIDATE",
    representation: "CANDIDATE_SYSTEM_CHECK",
    stem: `Which candidate from {${candidates.join(", ")}} satisfies all of the following congruences: ${systemText}?`,
    ...options,
    verifierAnswer: String(verifierMatches[0]),
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP008-PROT-019", hiddenState),
    explanation: {
      coreConcept: "A valid candidate must satisfy every congruence, not merely one of them.",
      strategy: "Check each candidate against the complete system and keep only the one passing every remainder condition.",
      steps: constraints.map((item) => `${answer} mod ${item.modulus} = ${item.residue}.`),
      finalAnswer: String(answer),
    },
    sourceAncestry: sources("CP008_DESIGN:CANDIDATE_SYSTEM_VERIFICATION"),
    prototypeAncestry: ["SYSTEM_CANDIDATE_VERIFICATION"],
  });
}

function p020(seed: number): NumCp008Wave03Package {
  const rng = createRng(seed * 191 + 8);
  const t = tier(seed);
  const triples = t === 0 ? [[4, 6, 5], [5, 10, 7]] as const : t === 1 ? [[6, 8, 7], [8, 12, 11]] as const : [[9, 12, 7], [10, 15, 13]] as const;
  const [m1, m2, m3] = rng.pick(triples);
  const commonRemainder = rng.int(0, Math.min(m1, m2) - 1);
  const basePeriod = lcm(m1, m2);
  let source = commonRemainder + rng.int(1, 5) * basePeriod;
  let differentRemainder = mod(source, m3);
  for (let guard = 0; differentRemainder === commonRemainder && guard < 10; guard += 1) {
    source += basePeriod;
    differentRemainder = mod(source, m3);
  }
  if (differentRemainder === commonRemainder) return p020(seed + 991);
  const constraints = [
    { residue: commonRemainder, modulus: m1 },
    { residue: commonRemainder, modulus: m2 },
    { residue: differentRemainder, modulus: m3 },
  ] as const;
  const merged = crtMany(constraints);
  if (!merged) return p020(seed + 983);
  const answer = leastPositive(merged.residue, merged.period);
  const verifier = directLeastPositive(constraints);
  const options = numericOptions(answer, [
    { value: commonRemainder + basePeriod, misconceptionId: "USED_ONLY_SAME_REMAINDER_PAIR" },
    { value: answer + merged.period, misconceptionId: "USED_NEXT_PERIODIC_SOLUTION" },
    { value: Math.max(1, answer - basePeriod), misconceptionId: "SHIFTED_BY_PARTIAL_PERIOD" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "SAME_AND_DIFFERENT_REMAINDER_SYSTEM", commonRemainder, differentRemainder, m1, m2, m3, period: merged.period, answer });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-020",
    seed,
    difficulty: difficulty(t, 2),
    answerSemantic: "LEAST_POSITIVE_SOLUTION",
    representation: "SAME_DIFFERENT_REMAINDER_SYSTEM",
    stem: `Find the least positive integer x that leaves remainder ${commonRemainder} when divided by both ${m1} and ${m2}, and remainder ${differentRemainder} when divided by ${m3}.`,
    ...options,
    verifierAnswer: String(verifier),
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP008-PROT-020", hiddenState),
    explanation: {
      coreConcept: "Same-remainder conditions can be combined first, but every different-remainder condition must still be enforced.",
      strategy: "Combine the first two congruences into one periodic class, then merge the third condition.",
      steps: [`The first two conditions give x ≡ ${commonRemainder} (mod ${basePeriod}).`, `Combining x ≡ ${commonRemainder} (mod ${basePeriod}) with x ≡ ${differentRemainder} (mod ${m3}) gives least positive x = ${answer}.`],
      finalAnswer: String(answer),
    },
    sourceAncestry: sources("CP008_DESIGN:SAME_DIFFERENT_REMAINDER_SYSTEMS"),
    prototypeAncestry: ["SAME_REMAINDER_PAIR_WITH_DIFFERENT_REMAINDER"],
  });
}

const STATEMENT_ANSWERS = ["Only I is correct", "Only II is correct", "I and II only are correct", "I, II and III are correct"] as const;

function statementAnswer(values: readonly boolean[]): string {
  const key = values.map((value) => value ? "1" : "0").join("");
  if (key === "100") return STATEMENT_ANSWERS[0];
  if (key === "010") return STATEMENT_ANSWERS[1];
  if (key === "110") return STATEMENT_ANSWERS[2];
  if (key === "111") return STATEMENT_ANSWERS[3];
  throw new Error(`Unsupported statement mask ${key}`);
}

function p021(seed: number): NumCp008Wave03Package {
  const rng = createRng(seed * 193 + 8);
  const t = tier(seed);
  const m1 = t === 0 ? 7 : t === 1 ? 11 : 13;
  const m2 = t === 0 ? 9 : t === 1 ? 14 : 17;
  const period = lcm(m1, m2);
  const source = rng.int(1, period);
  const constraints = [{ residue: mod(source, m1), modulus: m1 }, { residue: mod(source, m2), modulus: m2 }] as const;
  const merged = crtMany(constraints)!;
  const least = leastPositive(merged.residue, merged.period);
  const masks = [[true, false, false], [false, true, false], [true, true, false], [true, true, true]] as const;
  const mask = masks[(seed - 1) % 4]!;
  const statements = [
    { candidate: least, residue: mask[0] ? constraints[0].residue : mod(constraints[0].residue + 1, m1), modulus: m1 },
    { candidate: least, residue: mask[1] ? constraints[1].residue : mod(constraints[1].residue + 1, m2), modulus: m2 },
    { candidate: mask[2] ? least + merged.period : least + 1, residue: constraints[0].residue, modulus: m1 },
  ] as const;
  const canonicalTruth = mask;
  const verifierTruth = statements.map((statement) => mod(statement.candidate, statement.modulus) === statement.residue);
  const answer = statementAnswer(canonicalTruth);
  const verifier = statementAnswer(verifierTruth);
  const wrong = STATEMENT_ANSWERS.filter((item) => item !== answer).map((value, index) => ({ value, misconceptionId: `WRONG_TRUTH_COMBINATION_${index + 1}` }));
  const options = textOptions(answer, wrong, rng);
  const hiddenState = Object.freeze({ mode: "MODULAR_STATEMENT_COMBINATION", constraints, least, period: merged.period, statements, truth: canonicalTruth });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-021",
    seed,
    difficulty: difficulty(t, 2),
    answerSemantic: "STATEMENT_COMBINATION",
    representation: "THREE_STATEMENTS",
    stem: `For the compatible system x ≡ ${constraints[0].residue} (mod ${m1}), x ≡ ${constraints[1].residue} (mod ${m2}), its least positive solution is ${least}.\nI. ${statements[0].candidate} ≡ ${statements[0].residue} (mod ${statements[0].modulus})\nII. ${statements[1].candidate} ≡ ${statements[1].residue} (mod ${statements[1].modulus})\nIII. ${statements[2].candidate} ≡ ${statements[2].residue} (mod ${statements[2].modulus})\nWhich statements are correct?`,
    ...options,
    verifierAnswer: verifier,
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP008-PROT-021", hiddenState),
    explanation: {
      coreConcept: "Each modular statement is checked independently by taking the stated candidate modulo the stated modulus.",
      strategy: "Evaluate I, II and III separately, then match the resulting truth pattern to the option.",
      steps: statements.map((statement, index) => `Statement ${["I", "II", "III"][index]}: ${statement.candidate} mod ${statement.modulus} = ${mod(statement.candidate, statement.modulus)}, so it is ${verifierTruth[index] ? "true" : "false"}.`),
      finalAnswer: answer,
    },
    sourceAncestry: sources("CP008_DESIGN:STATEMENT_COMBINATION"),
    prototypeAncestry: ["MODULAR_STATEMENT_COMBINATION"],
  });
}

const DS_ANSWERS = [
  "Statement I alone is sufficient",
  "Statement II alone is sufficient",
  "Both statements together are sufficient, but neither alone is sufficient",
  "Even both statements together are not sufficient",
] as const;

function dsAnswer(c1: number, c2: number, both: number): string {
  if (c1 === 1) return DS_ANSWERS[0];
  if (c2 === 1) return DS_ANSWERS[1];
  if (both === 1) return DS_ANSWERS[2];
  return DS_ANSWERS[3];
}

function p022(seed: number): NumCp008Wave03Package {
  const rng = createRng(seed * 197 + 8);
  const t = tier(seed);
  const mode = (seed - 1) % 4;
  const lower = 1;
  const upper = mode === 3 ? 30 : 20;
  const witness = rng.int(1, upper);
  let m1: number;
  let m2: number;
  if (mode === 0) [m1, m2] = [23, 5];
  else if (mode === 1) [m1, m2] = [5, 23];
  else if (mode === 2) [m1, m2] = [6, 7];
  else [m1, m2] = [4, 6];
  const r1 = mod(witness, m1);
  const r2 = mod(witness, m2);
  const c1 = countProgressionInRange(r1, m1, lower, upper);
  const c2 = countProgressionInRange(r2, m2, lower, upper);
  const merged = crtMany([{ residue: r1, modulus: m1 }, { residue: r2, modulus: m2 }]);
  const bothCount = merged ? countProgressionInRange(merged.residue, merged.period, lower, upper) : 0;
  const answer = dsAnswer(c1, c2, bothCount);
  const verifier1 = systemSolutions([{ residue: r1, modulus: m1 }], lower, upper).length;
  const verifier2 = systemSolutions([{ residue: r2, modulus: m2 }], lower, upper).length;
  const verifierBoth = systemSolutions([{ residue: r1, modulus: m1 }, { residue: r2, modulus: m2 }], lower, upper).length;
  const verifier = dsAnswer(verifier1, verifier2, verifierBoth);
  const wrong = DS_ANSWERS.filter((item) => item !== answer).map((value, index) => ({ value, misconceptionId: `WRONG_SUFFICIENCY_CLASS_${index + 1}` }));
  const options = textOptions(answer, wrong, rng);
  const hiddenState = Object.freeze({ mode: "MODULAR_DATA_SUFFICIENCY", lower, upper, witness, statementI: { residue: r1, modulus: m1 }, statementII: { residue: r2, modulus: m2 }, counts: { c1, c2, bothCount }, answer });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-022",
    seed,
    difficulty: difficulty(t, 2),
    answerSemantic: "DATA_SUFFICIENCY",
    representation: "BOUNDED_DATA_SUFFICIENCY",
    stem: `An integer x is known to lie in [${lower}, ${upper}]. Is x uniquely determined?\nI. x ≡ ${r1} (mod ${m1})\nII. x ≡ ${r2} (mod ${m2})`,
    ...options,
    verifierAnswer: verifier,
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP008-PROT-022", hiddenState),
    explanation: {
      coreConcept: "A statement is sufficient only when it leaves exactly one possible value in the stated range.",
      strategy: "Count candidates under I, under II and under both statements together.",
      steps: [`Statement I leaves ${c1} candidate${c1 === 1 ? "" : "s"}; Statement II leaves ${c2}.`, `Together the statements leave ${bothCount} candidate${bothCount === 1 ? "" : "s"}.`],
      finalAnswer: answer,
    },
    sourceAncestry: sources("CP008_DESIGN:DATA_SUFFICIENCY"),
    prototypeAncestry: ["BOUNDED_MODULAR_DATA_SUFFICIENCY"],
  });
}

function repeatedDigitRemainder(digit: number, length: number, modulus: number): number {
  let residue = 0;
  for (let index = 0; index < length; index += 1) residue = mod(residue * 10 + digit, modulus);
  return residue;
}

function p023(seed: number): NumCp008Wave03Package {
  const rng = createRng(seed * 199 + 8);
  const t = tier(seed);
  const digit = rng.int(1, 9);
  const length = t === 0 ? rng.int(4, 7) : t === 1 ? rng.int(8, 12) : rng.int(13, 18);
  const modulus = t === 0 ? rng.int(7, 13) : t === 1 ? rng.int(14, 25) : rng.int(26, 43);
  const answer = repeatedDigitRemainder(digit, length, modulus);
  const exact = BigInt(String(digit).repeat(length));
  const verifier = Number(exact % BigInt(modulus));
  const shorter = repeatedDigitRemainder(digit, Math.max(1, length - 1), modulus);
  const options = numericOptions(answer, [
    { value: shorter, misconceptionId: "USED_ONE_FEWER_DIGIT" },
    { value: mod(answer + digit, modulus), misconceptionId: "ADDED_DIGIT_WITHOUT_PLACE_SHIFT" },
    { value: mod(length * digit, modulus), misconceptionId: "TREATED_REPEATED_NUMBER_AS_DIGIT_SUM" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "REPEATED_NUMERAL_RECURRENCE", digit, length, modulus, answer });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-023",
    seed,
    difficulty: difficulty(t, 2),
    answerSemantic: "REMAINDER",
    representation: "REPEATED_NUMERAL",
    stem: `A base-10 integer is formed by writing the digit ${digit} exactly ${length} times. What remainder does this integer leave when divided by ${modulus}?`,
    ...options,
    verifierAnswer: String(verifier),
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP008-PROT-023", hiddenState),
    explanation: {
      coreConcept: "Appending a digit d changes a current residue r to (10r+d) modulo the divisor.",
      strategy: "Build the repeated numeral by a remainder recurrence instead of constructing the full decimal number.",
      steps: [`Start with r₀ = 0 and repeatedly use rₖ = (10rₖ₋₁ + ${digit}) mod ${modulus}.`, `After ${length} digits, the residue is ${answer}.`],
      finalAnswer: String(answer),
    },
    sourceAncestry: sources("CP008_DESIGN:REPEATED_NUMERAL_RECURRENCE"),
    prototypeAncestry: ["REPEATED_NUMERAL_REMAINDER"],
  });
}

function p024(seed: number): NumCp008Wave03Package {
  const rng = createRng(seed * 211 + 8);
  const t = tier(seed);
  const triples = t === 0 ? [[4, 5, 7], [5, 6, 7]] as const : t === 1 ? [[6, 8, 9], [7, 9, 10]] as const : [[8, 10, 12], [9, 12, 14]] as const;
  const moduli = rng.pick(triples);
  const period = moduli.reduce((acc, modulus) => lcm(acc, modulus), 1);
  const source = rng.int(1, period);
  const constraints = moduli.map((modulus) => ({ residue: mod(source, modulus), modulus }));
  const merged = crtMany(constraints)!;
  const first = leastPositive(merged.residue, merged.period);
  const lower = Math.max(1, first - rng.int(0, Math.max(0, merged.period - 1)));
  const upper = first + rng.int(2, t === 2 ? 6 : 4) * merged.period + rng.int(0, merged.period - 1);
  const answer = countProgressionInRange(merged.residue, merged.period, lower, upper);
  const verifier = systemSolutions(constraints, lower, upper).length;
  const options = numericOptions(answer, [
    { value: Math.max(0, answer - 1), misconceptionId: "MISSED_BOUNDARY_SOLUTION" },
    { value: answer + 1, misconceptionId: "COUNTED_EXTRA_PERIOD" },
    { value: Math.floor((upper - lower) / merged.period), misconceptionId: "USED_INTERVAL_WIDTH_ONLY" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "BOUNDED_TRIPLE_SYSTEM_COUNT", constraints, residue: merged.residue, period: merged.period, lower, upper, answer });
  const systemText = constraints.map((item) => `x ≡ ${item.residue} (mod ${item.modulus})`).join(", ");
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-024",
    seed,
    difficulty: difficulty(t, 2),
    answerSemantic: "COUNT",
    representation: "BOUNDED_THREE_CONGRUENCE_SYSTEM",
    stem: `How many integers x in [${lower}, ${upper}] satisfy all three congruences: ${systemText}?`,
    ...options,
    verifierAnswer: String(verifier),
    hiddenState,
    mathematicalFingerprint: fingerprint("NUM-CP008-PROT-024", hiddenState),
    explanation: {
      coreConcept: "A compatible multi-congruence system becomes one residue class modulo its final CRT period.",
      strategy: "Merge the three congruences, then count that one periodic class inside the interval.",
      steps: [`The system combines to x ≡ ${merged.residue} (mod ${merged.period}).`, `That residue class occurs ${answer} times in [${lower}, ${upper}].`],
      finalAnswer: String(answer),
    },
    sourceAncestry: sources("CP008_DESIGN:BOUNDED_THREE_SYSTEM_PROJECTION"),
    prototypeAncestry: ["BOUNDED_TRIPLE_SYSTEM_COUNT"],
  });
}

export function generateNumCp008Wave03(prototypeId: NumCp008Wave03PrototypeId, seed: number): NumCp008Wave03Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error("Seed must be a positive safe integer");
  switch (prototypeId) {
    case "NUM-CP008-PROT-017": return p017(seed);
    case "NUM-CP008-PROT-018": return p018(seed);
    case "NUM-CP008-PROT-019": return p019(seed);
    case "NUM-CP008-PROT-020": return p020(seed);
    case "NUM-CP008-PROT-021": return p021(seed);
    case "NUM-CP008-PROT-022": return p022(seed);
    case "NUM-CP008-PROT-023": return p023(seed);
    case "NUM-CP008-PROT-024": return p024(seed);
  }
}

export { gcd };
