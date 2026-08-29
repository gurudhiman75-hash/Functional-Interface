import {
  base,
  createRng,
  crtMany,
  difficulty,
  geometricSumMod,
  geometricSumVerifier,
  gcd,
  inverse,
  lcm,
  mod,
  numericOptions,
  solutionsInRange,
  sources,
  systemSolutions,
  textOptions,
  type Rng,
} from "./common.ts";
import type { NumCp008Wave02Package, NumCp008Wave02PrototypeId } from "./types.ts";

function tier(seed: number): 0 | 1 | 2 {
  return ((seed - 1) % 3) as 0 | 1 | 2;
}

function fingerprint(id: NumCp008Wave02PrototypeId, state: Readonly<Record<string, unknown>>): string {
  return `${id}:${JSON.stringify(state)}`;
}

function progressionBounds(residue: number, modulus: number, lower: number, upper: number): { first: number; last: number; count: number } {
  const first = lower + mod(residue - lower, modulus);
  if (first > upper) return { first, last: first - modulus, count: 0 };
  const count = Math.floor((upper - first) / modulus) + 1;
  return { first, last: first + (count - 1) * modulus, count };
}

function setText(values: readonly number[]): string {
  return `{${values.join(", ")}}`;
}

function setOptions(answerValues: readonly number[], period: number, rng: Rng) {
  const answer = setText(answerValues);
  const variants = [
    answerValues.slice(1),
    answerValues.slice(0, -1),
    answerValues.map((value) => value + period),
    answerValues.length > 1 ? [...answerValues.slice(0, -1), answerValues.at(-1)! + period] : [answerValues[0]! + period],
  ];
  const wrong: { value: string; misconceptionId: string }[] = [];
  const seen = new Set([answer]);
  const ids = ["DROPPED_FIRST_SOLUTION", "DROPPED_LAST_SOLUTION", "SHIFTED_ALL_BY_PERIOD", "SHIFTED_ONE_SOLUTION"];
  for (let index = 0; index < variants.length && wrong.length < 3; index += 1) {
    const value = setText(variants[index]!);
    if (seen.has(value)) continue;
    seen.add(value);
    wrong.push({ value, misconceptionId: ids[index]! });
  }
  while (wrong.length < 3) {
    const value = `{${answerValues.join(", ")}, ${answerValues.at(-1)! + period}}`;
    if (!seen.has(value)) {
      seen.add(value);
      wrong.push({ value, misconceptionId: "ADDED_OUT_OF_RANGE_PERIODIC_VALUE" });
    } else {
      const shifted = `{${answerValues.map((item) => item - period).join(", ")}}`;
      if (!seen.has(shifted)) {
        seen.add(shifted);
        wrong.push({ value: shifted, misconceptionId: "SHIFTED_BELOW_RANGE" });
      }
    }
  }
  return textOptions(answer, wrong, rng);
}

function p009(seed: number): NumCp008Wave02Package {
  const rng = createRng(seed * 149 + 8);
  const t = tier(seed);
  const modulus = t === 0 ? rng.int(5, 11) : t === 1 ? rng.int(12, 23) : rng.int(24, 41);
  const residue = rng.int(0, modulus - 1);
  const firstWitness = residue + rng.int(2, 7) * modulus;
  const lower = firstWitness - rng.int(0, modulus - 1);
  const upper = firstWitness + rng.int(2, t === 2 ? 6 : 4) * modulus + rng.int(0, modulus - 1);
  const direction = seed % 2 === 0 ? "LEAST" : "GREATEST";
  const bounds = progressionBounds(residue, modulus, lower, upper);
  const answer = direction === "LEAST" ? bounds.first : bounds.last;
  const verifierSet = solutionsInRange(residue, modulus, lower, upper);
  const verifier = direction === "LEAST" ? verifierSet[0]! : verifierSet.at(-1)!;
  const options = numericOptions(answer, [
    { value: direction === "LEAST" ? bounds.last : bounds.first, misconceptionId: "CHOSE_WRONG_EXTREMUM" },
    { value: answer + modulus, misconceptionId: "MOVED_ONE_PERIOD_WRONG_DIRECTION" },
    { value: answer - modulus, misconceptionId: "IGNORED_RANGE_BOUND" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "BOUNDED_RESIDUE_EXTREMUM", residue, modulus, lower, upper, direction, first: bounds.first, last: bounds.last });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-009", seed, difficulty: difficulty(t, 1), answerSemantic: direction === "LEAST" ? "LEAST_VALUE" : "GREATEST_VALUE", representation: "BOUNDED_CONGRUENCE",
    stem: `Among integers from ${lower} to ${upper} inclusive satisfying x ≡ ${residue} (mod ${modulus}), find the ${direction === "LEAST" ? "least" : "greatest"} value.`,
    ...options, verifierAnswer: String(verifier), hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-009", hiddenState),
    explanation: { coreConcept: "All solutions of one congruence differ by whole multiples of its modulus.", strategy: "Find the first in-range representative, then step by the modulus to the requested endpoint.", steps: [`The first in-range solution is ${bounds.first}.`, `The last is ${bounds.first} + (${bounds.count}-1)×${modulus} = ${bounds.last}.`], finalAnswer: String(answer) },
    sourceAncestry: sources("CP008_DESIGN:LEAST_GREATEST_BOUNDED_SOLUTION"), prototypeAncestry: ["BOUNDED_SINGLE_CONGRUENCE_EXTREMUM"],
  });
}

function p010(seed: number): NumCp008Wave02Package {
  const rng = createRng(seed * 151 + 8);
  const t = tier(seed);
  const modulus = t === 0 ? rng.int(4, 10) : t === 1 ? rng.int(11, 21) : rng.int(22, 37);
  const residue = rng.int(0, modulus - 1);
  const witness = residue + rng.int(1, 6) * modulus;
  const lower = witness - rng.int(0, modulus - 1);
  const upper = witness + rng.int(3, t === 2 ? 9 : 6) * modulus + rng.int(0, modulus - 1);
  const bounds = progressionBounds(residue, modulus, lower, upper);
  const answer = bounds.count;
  const verifier = solutionsInRange(residue, modulus, lower, upper).length;
  const options = numericOptions(answer, [
    { value: answer - 1, misconceptionId: "MISSED_ONE_ENDPOINT" },
    { value: answer + 1, misconceptionId: "COUNTED_ONE_OUT_OF_RANGE" },
    { value: Math.floor((upper - lower) / modulus), misconceptionId: "DIVIDED_INTERVAL_WIDTH_ONLY" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "BOUNDED_RESIDUE_COUNT", residue, modulus, lower, upper, first: bounds.first, last: bounds.last, count: answer });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-010", seed, difficulty: difficulty(t, 1), answerSemantic: "COUNT", representation: "BOUNDED_CONGRUENCE",
    stem: `How many integers x in [${lower}, ${upper}] satisfy x ≡ ${residue} (mod ${modulus})?`,
    ...options, verifierAnswer: String(verifier), hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-010", hiddenState),
    explanation: { coreConcept: "In a fixed residue class, successive solutions are exactly one modulus apart.", strategy: "Locate the first and last in-range solutions and count the arithmetic progression.", steps: [`First solution = ${bounds.first}; last solution = ${bounds.last}.`, `Count = (${bounds.last}-${bounds.first})/${modulus}+1 = ${answer}.`], finalAnswer: String(answer) },
    sourceAncestry: sources("CP008_DESIGN:BOUNDED_SOLUTION_COUNT"), prototypeAncestry: ["BOUNDED_SINGLE_CONGRUENCE_COUNT"],
  });
}

const PAIRS = [[6, 8], [8, 9], [9, 10], [10, 12], [12, 15]] as const;

function p011(seed: number): NumCp008Wave02Package {
  const rng = createRng(seed * 157 + 8);
  const t = tier(seed);
  const [m1, m2] = rng.pick(PAIRS);
  const period = lcm(m1, m2);
  const source = rng.int(1, period);
  const constraints = [{ residue: mod(source, m1), modulus: m1 }, { residue: mod(source, m2), modulus: m2 }] as const;
  const merged = crtMany(constraints)!;
  const anchor = merged.residue === 0 ? merged.period : merged.residue;
  const lower = Math.max(1, anchor - rng.int(0, period));
  const upper = anchor + rng.int(2, t === 2 ? 6 : 4) * period + rng.int(0, period - 1);
  const bounds = progressionBounds(merged.residue, merged.period, lower, upper);
  const canonicalSet = Array.from({ length: bounds.count }, (_unused, index) => bounds.first + index * merged.period);
  const verifier = systemSolutions(constraints, lower, upper);
  const options = setOptions(canonicalSet, merged.period, rng);
  const hiddenState = Object.freeze({ mode: "BOUNDED_TWO_CONGRUENCE_SET", constraints, period: merged.period, residue: merged.residue, lower, upper, solutions: canonicalSet });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-011", seed, difficulty: difficulty(t, 2), answerSemantic: "COMPLETE_SET", representation: "CONGRUENCE_SYSTEM",
    stem: `List all integers x in [${lower}, ${upper}] satisfying x ≡ ${constraints[0].residue} (mod ${m1}) and x ≡ ${constraints[1].residue} (mod ${m2}).`,
    ...options, verifierAnswer: setText(verifier), hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-011", hiddenState),
    explanation: { coreConcept: "A compatible two-congruence system is one residue class modulo the LCM period.", strategy: "Combine the congruences once, then enumerate only that periodic class inside the stated bounds.", steps: [`The system combines to x ≡ ${merged.residue} (mod ${merged.period}).`, `Inside [${lower}, ${upper}], this gives ${setText(canonicalSet)}.`], finalAnswer: setText(canonicalSet) },
    sourceAncestry: sources("CP008_DESIGN:BOUNDED_COMPLETE_SOLUTION_SET"), prototypeAncestry: ["BOUNDED_TWO_CONGRUENCE_SET"],
  });
}

function p012(seed: number): NumCp008Wave02Package {
  const rng = createRng(seed * 163 + 8);
  const t = tier(seed);
  const modulus = rng.pick(t === 0 ? [7, 11, 13] as const : t === 1 ? [17, 19, 23] as const : [29, 31, 37, 41] as const);
  let x = rng.int(2, modulus - 1);
  while (gcd(x, modulus) !== 1) x = x % (modulus - 1) + 1;
  const targetA = rng.int(1, modulus - 1);
  const b = mod(targetA * x, modulus);
  const candidateSet = [targetA];
  while (candidateSet.length < 4) {
    const candidate = rng.int(1, modulus - 1);
    if (!candidateSet.includes(candidate)) candidateSet.push(candidate);
  }
  const shuffledCandidates = [...candidateSet].sort(() => rng.int(-1, 1));
  const answer = mod(b * inverse(x, modulus), modulus);
  const verifierMatches = shuffledCandidates.filter((candidate) => mod(candidate * x, modulus) === b);
  if (verifierMatches.length !== 1 || verifierMatches[0] !== targetA) throw new Error("Coefficient reconstruction is not unique");
  const options = numericOptions(answer, shuffledCandidates.filter((value) => value !== answer).map((value, index) => ({ value, misconceptionId: `CANDIDATE_FAILS_CONGRUENCE_${index + 1}` })), rng);
  const hiddenState = Object.freeze({ mode: "MISSING_COEFFICIENT", x, b, modulus, candidates: shuffledCandidates, coefficient: targetA });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-012", seed, difficulty: difficulty(t, 2), answerSemantic: "MISSING_COEFFICIENT", representation: "CANDIDATE_CONGRUENCE",
    stem: `In ax ≡ ${b} (mod ${modulus}), x = ${x}. Which candidate value of a from {${shuffledCandidates.join(", ")}} makes the congruence true?`,
    ...options, verifierAnswer: String(verifierMatches[0]), hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-012", hiddenState),
    explanation: { coreConcept: "If x is invertible modulo m, multiply by x⁻¹ to isolate the missing coefficient residue.", strategy: "Solve a ≡ b x⁻¹ (mod m), then match that residue to the candidate list.", steps: [`The inverse of ${x} modulo ${modulus} is ${inverse(x, modulus)}.`, `a ≡ ${b}×${inverse(x, modulus)} ≡ ${answer} (mod ${modulus}); only candidate ${answer} matches.`], finalAnswer: String(answer) },
    sourceAncestry: sources("CP008_DESIGN:MISSING_COEFFICIENT_INVERSE"), prototypeAncestry: ["MISSING_COEFFICIENT_CANDIDATE"],
  });
}

function p013(seed: number): NumCp008Wave02Package {
  const rng = createRng(seed * 167 + 8);
  const t = tier(seed);
  const targetModulus = t === 0 ? rng.int(5, 12) : t === 1 ? rng.int(13, 24) : rng.int(25, 40);
  const residue = rng.int(0, Math.min(targetModulus - 1, 7));
  const quotient = rng.int(3, t === 2 ? 15 : 9);
  const value = residue + quotient * targetModulus;
  const candidates = [targetModulus];
  for (let delta = 1; candidates.length < 4; delta += 1) {
    for (const candidate of [targetModulus - delta, targetModulus + delta]) {
      if (candidate <= residue || candidate <= 1 || candidates.includes(candidate) || mod(value, candidate) === residue) continue;
      candidates.push(candidate);
      if (candidates.length === 4) break;
    }
  }
  const verifierMatches = candidates.filter((candidate) => mod(value, candidate) === residue);
  if (verifierMatches.length !== 1 || verifierMatches[0] !== targetModulus) throw new Error("Modulus reconstruction is not unique");
  const options = numericOptions(targetModulus, candidates.filter((candidate) => candidate !== targetModulus).map((candidate, index) => ({ value: candidate, misconceptionId: `DOES_NOT_DIVIDE_DIFFERENCE_${index + 1}` })), rng);
  const difference = value - residue;
  const hiddenState = Object.freeze({ mode: "MISSING_MODULUS", value, residue, candidates, modulus: targetModulus, difference });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-013", seed, difficulty: difficulty(t, 2), answerSemantic: "MISSING_MODULUS", representation: "CANDIDATE_CONGRUENCE",
    stem: `If ${value} ≡ ${residue} (mod m), which candidate m from {${candidates.join(", ")}} is valid?`,
    ...options, verifierAnswer: String(verifierMatches[0]), hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-013", hiddenState),
    explanation: { coreConcept: "N ≡ r (mod m) means m divides N-r, with 0 ≤ r < m.", strategy: "Subtract the remainder and test which candidate modulus divides the difference exactly.", steps: [`${value}-${residue} = ${difference}.`, `${targetModulus} divides ${difference} and ${residue}<${targetModulus}; the other candidates fail the congruence.`], finalAnswer: String(targetModulus) },
    sourceAncestry: sources("CP008_DESIGN:MISSING_MODULUS_INVERSE"), prototypeAncestry: ["MISSING_MODULUS_CANDIDATE"],
  });
}

function p014(seed: number): NumCp008Wave02Package {
  const rng = createRng(seed * 173 + 8);
  const t = tier(seed);
  const modulus = t === 0 ? rng.int(5, 13) : t === 1 ? rng.int(14, 29) : rng.int(30, 53);
  const baseValue = rng.int(2, t === 2 ? 20 : 12);
  const highestExponent = t === 0 ? rng.int(4, 8) : t === 1 ? rng.int(9, 18) : rng.int(19, 35);
  const answer = geometricSumMod(baseValue, highestExponent, modulus);
  const verifier = geometricSumVerifier(baseValue, highestExponent, modulus);
  const options = numericOptions(answer, [
    { value: mod(answer - 1, modulus), misconceptionId: "OMITTED_CONSTANT_TERM" },
    { value: mod(answer - mod(baseValue ** Math.min(highestExponent, 6), modulus), modulus), misconceptionId: "OMITTED_FINAL_POWER" },
    { value: mod(baseValue * highestExponent, modulus), misconceptionId: "MULTIPLIED_BASE_BY_TERM_COUNT" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "GEOMETRIC_SUM_REMAINDER", base: baseValue, highestExponent, modulus, residue: answer });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-014", seed, difficulty: difficulty(t, 2), answerSemantic: "REMAINDER", representation: "STRUCTURED_EXPRESSION",
    stem: `Find the least non-negative remainder of 1 + ${baseValue} + ${baseValue}^2 + ... + ${baseValue}^${highestExponent} when divided by ${modulus}.`,
    ...options, verifierAnswer: String(verifier), hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-014", hiddenState),
    explanation: { coreConcept: "A structured sum can be reduced modulo m term by term without evaluating the full integer.", strategy: "Build successive powers modulo m and keep a running modular sum.", steps: [`Start with term 1 and running sum 1 modulo ${modulus}.`, `Reducing each next power of ${baseValue} and adding it gives final residue ${answer}.`], finalAnswer: String(answer) },
    sourceAncestry: sources("V2:ns_remainder_pattern"), prototypeAncestry: ["GEOMETRIC_SUM_REMAINDER"],
  });
}

const TRIPLES = [[6, 8, 9], [5, 8, 9], [7, 9, 10], [8, 9, 11]] as const;

function p015(seed: number): NumCp008Wave02Package {
  const rng = createRng(seed * 179 + 8);
  const t = tier(seed);
  const [m1, m2, m3] = rng.pick(TRIPLES);
  const period = lcm(lcm(m1, m2), m3);
  const sourceValue = rng.int(1, period * 2);
  const constraints = [
    { residue: mod(sourceValue, m1), modulus: m1 },
    { residue: mod(sourceValue, m2), modulus: m2 },
    { residue: mod(sourceValue, m3), modulus: m3 },
  ] as const;
  const merged = crtMany(constraints)!;
  const answer = merged.residue === 0 ? merged.period : merged.residue;
  const verifier = systemSolutions(constraints, 0, merged.period - 1);
  const verifierAnswer = verifier[0] === 0 ? merged.period : verifier[0]!;
  const options = numericOptions(answer, [
    { value: sourceValue, misconceptionId: "USED_NONLEAST_REPRESENTATIVE" },
    { value: answer + merged.period, misconceptionId: "MISSED_PERIODIC_REDUCTION" },
    { value: constraints.reduce((sum, item) => sum + item.residue, 0), misconceptionId: "ADDED_REMAINDERS" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "THREE_CONGRUENCE_COMPATIBLE", constraints, period: merged.period, residue: merged.residue });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-015", seed, difficulty: difficulty(t, 3), answerSemantic: "LEAST_POSITIVE_SOLUTION", representation: "THREE_CONGRUENCE_SYSTEM",
    stem: `Find the least positive x satisfying x ≡ ${constraints[0].residue} (mod ${m1}), x ≡ ${constraints[1].residue} (mod ${m2}), and x ≡ ${constraints[2].residue} (mod ${m3}).`,
    ...options, verifierAnswer: String(verifierAnswer), hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-015", hiddenState),
    explanation: { coreConcept: "Compatible congruences can be merged one at a time; the final period is the LCM of all moduli.", strategy: "Combine the first two congruences, then merge that residue class with the third.", steps: [`Sequential generalized CRT gives x ≡ ${merged.residue} (mod ${merged.period}).`, `The least positive representative is ${answer}.`], finalAnswer: String(answer) },
    sourceAncestry: sources("CP008_DESIGN:MULTI_CONGRUENCE_SYSTEM"), prototypeAncestry: ["COMPATIBLE_THREE_CONGRUENCE_SYSTEM"],
  });
}

function p016(seed: number): NumCp008Wave02Package {
  const rng = createRng(seed * 181 + 8);
  const t = tier(seed);
  const [m1, m2, m3] = rng.pick([[6, 8, 9], [8, 12, 9], [10, 12, 9], [12, 15, 8]] as const);
  const sourceValue = rng.int(1, lcm(lcm(m1, m2), m3));
  const firstTwo = [{ residue: mod(sourceValue, m1), modulus: m1 }, { residue: mod(sourceValue, m2), modulus: m2 }] as const;
  const mergedFirst = crtMany(firstTwo)!;
  const g = gcd(mergedFirst.period, m3);
  let thirdResidue = mod(sourceValue, m3);
  for (let delta = 1; (thirdResidue - mergedFirst.residue) % g === 0; delta += 1) thirdResidue = mod(thirdResidue + delta, m3);
  const constraints = [...firstTwo, { residue: thirdResidue, modulus: m3 }] as const;
  const canonical = crtMany(constraints);
  if (canonical !== null) throw new Error("Expected incompatible three-congruence system");
  const period = lcm(mergedFirst.period, m3);
  const verifier = systemSolutions(constraints, 0, period - 1);
  const answer = "INCOMPATIBLE — NO INTEGER SOLUTION";
  const options = textOptions(answer, [
    { value: "COMPATIBLE — ONE CLASS MODULO THE LCM", misconceptionId: "ASSUMED_ALL_CRT_SYSTEMS_COMPATIBLE" },
    { value: "COMPATIBLE — ONE CLASS MODULO THE PRODUCT", misconceptionId: "MULTIPLIED_MODULI_BLINDLY" },
    { value: "INDETERMINATE FROM THE GIVEN DATA", misconceptionId: "CONFUSED_CONTRADICTION_WITH_UNDERDETERMINATION" },
  ], rng);
  const hiddenState = Object.freeze({ mode: "THREE_CONGRUENCE_INCOMPATIBLE", constraints, firstTwoResidue: mergedFirst.residue, firstTwoPeriod: mergedFirst.period, compatibilityGcd: g });
  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-016", seed, difficulty: difficulty(t, 3), answerSemantic: "SOLUTION_CLASS", representation: "THREE_CONGRUENCE_SYSTEM",
    stem: `Classify the system x ≡ ${constraints[0].residue} (mod ${m1}), x ≡ ${constraints[1].residue} (mod ${m2}), x ≡ ${thirdResidue} (mod ${m3}).`,
    ...options, verifierAnswer: verifier.length === 0 ? answer : "VERIFIER_FOUND_SOLUTION", hiddenState, mathematicalFingerprint: fingerprint("NUM-CP008-PROT-016", hiddenState),
    explanation: { coreConcept: "After merging compatible conditions, the next residue must agree modulo the gcd of the current period and new modulus.", strategy: "Merge the first two conditions, then test the third for compatibility before constructing a solution.", steps: [`The first two combine to x ≡ ${mergedFirst.residue} (mod ${mergedFirst.period}).`, `gcd(${mergedFirst.period}, ${m3}) = ${g}, but ${thirdResidue}-${mergedFirst.residue} is not divisible by ${g}; no common integer exists.`], finalAnswer: answer },
    sourceAncestry: sources("CP008_DESIGN:MULTI_CONGRUENCE_INCOMPATIBILITY"), prototypeAncestry: ["INCOMPATIBLE_THREE_CONGRUENCE_SYSTEM"],
  });
}

export function generateNumCp008Wave02(prototypeId: NumCp008Wave02PrototypeId, seed: number): NumCp008Wave02Package {
  if (!Number.isSafeInteger(seed) || seed <= 0) throw new Error("Seed must be a positive safe integer");
  switch (prototypeId) {
    case "NUM-CP008-PROT-009": return p009(seed);
    case "NUM-CP008-PROT-010": return p010(seed);
    case "NUM-CP008-PROT-011": return p011(seed);
    case "NUM-CP008-PROT-012": return p012(seed);
    case "NUM-CP008-PROT-013": return p013(seed);
    case "NUM-CP008-PROT-014": return p014(seed);
    case "NUM-CP008-PROT-015": return p015(seed);
    case "NUM-CP008-PROT-016": return p016(seed);
  }
}
