import {
  countCoprimeFactorPairs,
  createRng,
  difficulty,
  euclideanRows,
  explanation,
  factorText,
  formatList,
  gcd,
  gcdMany,
  lcm,
  lcmMany,
  makeOptions,
  numericOptions,
  sourceAncestry,
  type Rng,
} from "./core";
import type { NumCp006GeneratedContent } from "./types";

const COPRIME_PAIRS = [
  [2n, 3n], [3n, 5n], [4n, 5n], [5n, 7n], [7n, 8n], [8n, 9n],
  [9n, 10n], [11n, 12n], [13n, 15n], [16n, 21n], [17n, 24n], [25n, 28n],
] as const;

const COPRIME_TRIPLES = [
  [2n, 3n, 5n], [3n, 4n, 5n], [4n, 9n, 25n], [5n, 8n, 9n],
  [7n, 8n, 9n], [8n, 15n, 21n], [9n, 10n, 11n], [11n, 12n, 13n],
] as const;

function scaledPair(rng: Rng): readonly [bigint, bigint, bigint] {
  const scale = BigInt(rng.int(2, rng.bool(0.35) ? 60 : 24));
  const [left, right] = rng.pick(COPRIME_PAIRS);
  return [scale * left, scale * right, scale];
}

function scaledTriple(rng: Rng): readonly [bigint, bigint, bigint, bigint] {
  const scale = BigInt(rng.int(1, rng.bool(0.35) ? 30 : 12));
  const [a, b, c] = rng.pick(COPRIME_TRIPLES);
  return [scale * a, scale * b, scale * c, scale];
}

const HCF_TRAPS = [
  "Use only factors common to every given number.",
  "The smallest number is not automatically the HCF.",
  "For prime powers, take the minimum exponent.",
] as const;

const LCM_TRAPS = [
  "The answer must be divisible by every given number.",
  "Do not multiply all numbers when factors overlap.",
  "For prime powers, take the maximum exponent.",
] as const;

export function generateQl070(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 701 + 70);
  const [a, b, h] = scaledPair(rng);
  const L = lcm(a, b);
  const options = numericOptions(h, [
    { value: L, misconceptionId: "HCF_LCM_SWAP", analysis: "This is the LCM, not the HCF." },
    { value: a < b ? a : b, misconceptionId: "SMALLER_NUMBER", analysis: "The smaller number need not divide the other number." },
    { value: h > 1n ? h / 2n : h + 2n, misconceptionId: "COMMON_FACTOR_DROPPED", analysis: "A common factor was omitted." },
  ], rng);
  return {
    difficulty: difficulty([a, b]), answerSemantic: "HCF", representation: "PLAIN_PROSE",
    stem: `Find the HCF of ${a} and ${b}.`, ...options,
    hiddenState: { numbers: [`${a}`, `${b}`], target: "HCF" },
    mathematicalFingerprint: `QL070:${a}:${b}:${h}`,
    explanation: explanation(
      "The HCF contains the lowest prime powers common to both numbers.",
      `Prime-factorise ${a} and ${b}, then keep only the common part.`,
      [`${a} = ${factorText(a)} and ${b} = ${factorText(b)}.`, `Their common minimum-power product is ${factorText(h)} = ${h}.`],
      "When one common factor is visible, divide both numbers by it before continuing.",
      options.canonicalAnswer, HCF_TRAPS,
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-LCM-DIRECT"),
    prototypeAncestry: ["NUM-CP006-PROT-001"],
  };
}

export function generateQl071(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 709 + 71);
  const [a, b, h] = scaledPair(rng);
  const answer = lcm(a, b);
  const options = numericOptions(answer, [
    { value: h, misconceptionId: "HCF_LCM_SWAP", analysis: "This is the HCF, not the LCM." },
    { value: a * b, misconceptionId: "RAW_PRODUCT", analysis: "The common factor has been counted twice." },
    { value: a > b ? a : b, misconceptionId: "LARGER_NUMBER", analysis: "The larger number need not be a multiple of the smaller one." },
  ], rng);
  return {
    difficulty: difficulty([a, b]), answerSemantic: "LCM", representation: "PLAIN_PROSE",
    stem: `Find the LCM of ${a} and ${b}.`, ...options,
    hiddenState: { numbers: [`${a}`, `${b}`], target: "LCM" },
    mathematicalFingerprint: `QL071:${a}:${b}:${answer}`,
    explanation: explanation(
      "The LCM contains every prime power required by either number.",
      `Prime-factorise ${a} and ${b}, then take the higher exponent of each prime.`,
      [`${a} = ${factorText(a)} and ${b} = ${factorText(b)}.`, `The maximum-power product is ${factorText(answer)} = ${answer}.`],
      `For two numbers, use LCM = (${a} × ${b}) ÷ ${h}.`,
      options.canonicalAnswer, LCM_TRAPS,
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-LCM-DIRECT"),
    prototypeAncestry: ["NUM-CP006-PROT-002"],
  };
}

export function generateQl072(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 719 + 72);
  const [a, b, c] = scaledTriple(rng);
  const answer = gcdMany([a, b, c]);
  const firstTwo = gcd(a, b);
  const options = numericOptions(answer, [
    { value: firstTwo, misconceptionId: "THIRD_NUMBER_IGNORED", analysis: "Only the first two numbers were checked." },
    { value: lcmMany([a, b, c]), misconceptionId: "HCF_LCM_SWAP", analysis: "Maximum powers give the LCM." },
    { value: [a, b, c].reduce((x, y) => x < y ? x : y), misconceptionId: "SMALLEST_NUMBER", analysis: "The smallest number need not divide the other two." },
  ], rng);
  return {
    difficulty: difficulty([a, b, c]), answerSemantic: "HCF", representation: "PRIME_EXPONENT_TABLE",
    stem: `Find the HCF of ${a}, ${b} and ${c}.`, ...options,
    hiddenState: { numbers: [`${a}`, `${b}`, `${c}`], target: "HCF" },
    mathematicalFingerprint: `QL072:${a}:${b}:${c}:${answer}`,
    explanation: explanation(
      "A prime power enters the HCF only when it is present in all three numbers.",
      "Compare the prime exponents column by column and take the minimum in each common column.",
      [`${a} = ${factorText(a)}, ${b} = ${factorText(b)}, ${c} = ${factorText(c)}.`, `The common minimum-power product is ${factorText(answer)} = ${answer}.`],
      "Find the HCF of the first two numbers, then take the HCF of that result with the third.",
      options.canonicalAnswer, HCF_TRAPS,
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-THREE-NUMBERS"),
    prototypeAncestry: ["NUM-CP006-PROT-003"],
  };
}

export function generateQl073(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 727 + 73);
  const [a, b, c] = scaledTriple(rng);
  const answer = lcmMany([a, b, c]);
  const firstTwo = lcm(a, b);
  const options = numericOptions(answer, [
    { value: firstTwo, misconceptionId: "THIRD_NUMBER_IGNORED", analysis: "Only the first two numbers were aligned." },
    { value: gcdMany([a, b, c]), misconceptionId: "HCF_LCM_SWAP", analysis: "Minimum powers give the HCF." },
    { value: [a, b, c].reduce((x, y) => x > y ? x : y), misconceptionId: "LARGEST_NUMBER", analysis: "The largest number need not contain every required prime power." },
  ], rng);
  return {
    difficulty: difficulty([a, b, c]), answerSemantic: "LCM", representation: "PRIME_EXPONENT_TABLE",
    stem: `Find the LCM of ${a}, ${b} and ${c}.`, ...options,
    hiddenState: { numbers: [`${a}`, `${b}`, `${c}`], target: "LCM" },
    mathematicalFingerprint: `QL073:${a}:${b}:${c}:${answer}`,
    explanation: explanation(
      "The LCM must contain every prime power required by any of the three numbers.",
      "Compare the prime exponents and take the maximum exponent for each prime.",
      [`${a} = ${factorText(a)}, ${b} = ${factorText(b)}, ${c} = ${factorText(c)}.`, `The maximum-power product is ${factorText(answer)} = ${answer}.`],
      "Find the LCM of two numbers, then take the LCM of that result with the third.",
      options.canonicalAnswer, LCM_TRAPS,
    ),
    sourceAncestry: sourceAncestry("SSC-LCM-THREE-NUMBERS"),
    prototypeAncestry: ["NUM-CP006-PROT-004"],
  };
}

export function generateQl074(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 733 + 74);
  const [a, b] = scaledPair(rng);
  const rows = euclideanRows(a, b);
  const answer = gcd(a, b);
  const penultimate = rows.length > 1 ? rows.at(-2)!.remainder : rows[0]!.divisor;
  const options = numericOptions(answer, [
    { value: rows[0]!.remainder, misconceptionId: "FIRST_REMAINDER", analysis: "The first remainder is not necessarily the HCF." },
    { value: penultimate, misconceptionId: "PENULTIMATE_REMAINDER", analysis: "The algorithm stops at the final non-zero remainder." },
    { value: rows[0]!.quotient, misconceptionId: "QUOTIENT_AS_HCF", analysis: "A quotient was mistaken for the HCF." },
  ], rng);
  const ladder = rows.map((row) => `${row.dividend} = ${row.divisor} × ${row.quotient} + ${row.remainder}`).join("; ");
  return {
    difficulty: difficulty([a, b], { reasoning: true }), answerSemantic: "HCF", representation: "EUCLIDEAN_DIVISION_LADDER",
    stem: `The Euclidean division ladder for ${a} and ${b} is: ${ladder}. What is their HCF?`, ...options,
    hiddenState: { numbers: [`${a}`, `${b}`], rows: rows.map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, `${value}`]))), target: "HCF" },
    mathematicalFingerprint: `QL074:${a}:${b}:${rows.map((row) => row.remainder).join(":")}`,
    explanation: explanation(
      "In the Euclidean algorithm, the final non-zero remainder is the HCF.",
      "Read the remainders in order until the next remainder becomes zero.",
      [...rows.map((row) => `${row.dividend} = ${row.divisor} × ${row.quotient} + ${row.remainder}.`), `Therefore the final non-zero remainder is ${answer}.`],
      "Ignore the quotients; track only the successive divisors and remainders.",
      options.canonicalAnswer,
      ["Do not stop at the first remainder.", "Zero is the stopping signal, not the answer.", "Use the last non-zero remainder."],
    ),
    sourceAncestry: sourceAncestry("SSC-EUCLIDEAN-ALGORITHM"),
    prototypeAncestry: ["NUM-CP006-PROT-009"],
  };
}

export function generateQl075(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 739 + 75);
  const smaller = BigInt(rng.int(3, 40));
  const multiplier = BigInt(rng.int(2, 15));
  const larger = smaller * multiplier;
  const target = rng.bool() ? "HCF" : "LCM";
  const answer = target === "HCF" ? smaller : larger;
  const options = numericOptions(answer, [
    { value: target === "HCF" ? larger : smaller, misconceptionId: "EDGE_RELATION_REVERSED", analysis: "The HCF and LCM roles were reversed." },
    { value: multiplier, misconceptionId: "MULTIPLIER_ONLY", analysis: "The quotient was used instead of the requested invariant." },
    { value: smaller + larger, misconceptionId: "ADDITION", analysis: "Adding the numbers does not produce their HCF or LCM." },
  ], rng);
  return {
    difficulty: difficulty([smaller, larger]), answerSemantic: target, representation: "DIVISIBILITY_RELATION",
    stem: `${smaller} divides ${larger} exactly. What is the ${target} of the two numbers?`, ...options,
    hiddenState: { numbers: [`${smaller}`, `${larger}`], target, dividesExactly: true },
    mathematicalFingerprint: `QL075:${smaller}:${larger}:${target}`,
    explanation: explanation(
      "When one positive integer divides the other, the smaller is the HCF and the larger is the LCM.",
      `Since ${larger} = ${smaller} × ${multiplier}, use the divisibility edge rule directly.`,
      [`${smaller} divides ${larger}.`, `${target} = ${answer}.`],
      "For an exact divisibility pair, no full prime factorisation is needed.",
      options.canonicalAnswer,
      ["Do not reverse HCF and LCM.", "The quotient is not the answer.", "Confirm exact divisibility first."],
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-LCM-DIVISIBILITY-EDGE"),
    prototypeAncestry: ["NUM-CP006-PROT-010"],
  };
}

export function generateQl076(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 743 + 76);
  const [a, b] = rng.pick(COPRIME_PAIRS);
  const scaleA = BigInt(rng.pick([1, 1, 1, 2]));
  const left = a * scaleA;
  let right = b;
  while (gcd(left, right) !== 1n) right += 1n;
  const target = rng.bool() ? "HCF" : "LCM";
  const answer = target === "HCF" ? 1n : left * right;
  const options = numericOptions(answer, [
    { value: target === "HCF" ? left * right : 1n, misconceptionId: "COPRIME_RULE_REVERSED", analysis: "The co-prime HCF and LCM rules were reversed." },
    { value: left + right, misconceptionId: "SUM_USED", analysis: "The sum is unrelated to the requested invariant." },
    { value: left > right ? left : right, misconceptionId: "LARGER_NUMBER", analysis: "The larger number is not the LCM unless it is divisible by the smaller one." },
  ], rng);
  return {
    difficulty: difficulty([left, right]), answerSemantic: target, representation: "COPRIME_RELATION",
    stem: `${left} and ${right} are co-prime. Find their ${target}.`, ...options,
    hiddenState: { numbers: [`${left}`, `${right}`], target, coprime: true },
    mathematicalFingerprint: `QL076:${left}:${right}:${target}`,
    explanation: explanation(
      "Co-prime positive integers have HCF 1, so their LCM is their product.",
      `Use gcd(${left}, ${right}) = 1 and the two-number product identity.`,
      [`HCF = 1.`, `LCM = ${left} × ${right} = ${left * right}.`, `Therefore the requested ${target} is ${answer}.`],
      "For a co-prime pair, jump directly to HCF 1 and LCM product.",
      options.canonicalAnswer,
      ["Co-prime does not mean both numbers are prime.", "Use the product rule only for two numbers.", "Do not confuse sum with LCM."],
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-LCM-COPRIME-EDGE"),
    prototypeAncestry: ["NUM-CP006-PROT-011"],
  };
}

export function generateQl077(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 751 + 77);
  const [a, b, h] = scaledPair(rng);
  const L = lcm(a, b);
  const known = rng.bool() ? a : b;
  const answer = known === a ? b : a;
  const options = numericOptions(answer, [
    { value: L / known, misconceptionId: "HCF_OMITTED", analysis: "The HCF factor was omitted from HCF × LCM." },
    { value: h * L, misconceptionId: "KNOWN_NOT_DIVIDED", analysis: "The known number was not divided out." },
    { value: known, misconceptionId: "KNOWN_REPEATED", analysis: "The given number was simply repeated." },
  ], rng);
  return {
    difficulty: difficulty([known, h, L], { inverse: true }), answerSemantic: "INTEGER", representation: "MATHEMATICAL_EXPRESSION",
    stem: `The HCF and LCM of two positive integers are ${h} and ${L}. If one integer is ${known}, find the other.`, ...options,
    hiddenState: { known: `${known}`, hcf: `${h}`, lcm: `${L}` },
    mathematicalFingerprint: `QL077:${known}:${h}:${L}:${answer}`,
    explanation: explanation(
      "For exactly two positive integers, product of the integers = HCF × LCM.",
      "Divide HCF × LCM by the known integer.",
      [`Other integer = (${h} × ${L}) ÷ ${known}.`, `Other integer = ${answer}.`, `Checking gives HCF ${h} and LCM ${L}.`],
      "Cancel the known number against the HCF or LCM before multiplying.",
      options.canonicalAnswer,
      ["Use the identity only for two numbers.", "Do not omit the HCF factor.", "Verify both HCF and LCM."],
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-LCM-INVERSE-PAIR"),
    prototypeAncestry: ["NUM-CP006-PROT-005"],
  };
}

function pairText(left: bigint, right: bigint): string {
  return `(${left}, ${right})`;
}

export function generateQl078(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 757 + 78);
  const [a, b, h] = scaledPair(rng);
  const L = lcm(a, b);
  const correct = pairText(a, b);
  const wrongPairs: readonly [bigint, bigint, string, string][] = [
    [a + h, b, "HCF_CHANGED", "The first number changes the common factor structure."],
    [a, b + h, "LCM_CHANGED", "The second number no longer preserves both invariants."],
    [a / h, b / h, "SCALE_OMITTED", "The reduced co-prime factors were not scaled by the HCF."],
    [h, L, "TRIVIAL_PAIR_ASSUMPTION", "The pair (HCF, LCM) does not always have the stated LCM after scaling conditions are checked."],
  ];
  const candidates = wrongPairs.filter(([left, right]) => gcd(left, right) !== h || lcm(left, right) !== L).slice(0, 3).map(([left, right, misconceptionId, analysis]) => ({ value: pairText(left, right), misconceptionId, analysis }));
  const options = makeOptions(correct, candidates, rng);
  return {
    difficulty: difficulty([a, b, h, L], { inverse: true, reasoning: true }), answerSemantic: "NUMBER_PAIR", representation: "OPTION_PAIR_TABLE",
    stem: `Which pair of positive integers has HCF ${h} and LCM ${L}?`, ...options,
    hiddenState: { hcf: `${h}`, lcm: `${L}`, optionPairs: options.options.map((option) => option.value) },
    mathematicalFingerprint: `QL078:${h}:${L}:${a}:${b}`,
    explanation: explanation(
      "If the HCF is h, write the numbers as hx and hy with gcd(x,y)=1.",
      "Check both the HCF and LCM of each option; the product test alone is not sufficient.",
      [`For ${correct}, gcd(${a}, ${b}) = ${h}.`, `LCM = (${a} × ${b}) ÷ ${h} = ${L}.`],
      "Reject an option immediately if its product is not HCF × LCM, then confirm its HCF.",
      options.canonicalAnswer,
      ["Product equality alone does not prove the HCF.", "Reduced factors must be co-prime.", "Scale both reduced factors by the HCF."],
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-LCM-PAIR-SELECTION"),
    prototypeAncestry: ["NUM-CP006-PROT-006"],
  };
}

export function generateQl079(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 761 + 79);
  const h = BigInt(rng.int(1, 15));
  const distinctPrimes = rng.pick([
    [2n, 3n], [2n, 5n], [3n, 5n], [2n, 3n, 5n], [2n, 3n, 7n], [2n, 5n, 7n], [2n, 3n, 5n, 7n],
  ] as const);
  const exponents = distinctPrimes.map(() => BigInt(rng.int(1, 3)));
  const quotient = distinctPrimes.reduce((product, prime, index) => product * prime ** exponents[index]!, 1n);
  const L = h * quotient;
  const answer = countCoprimeFactorPairs(quotient);
  const omega = BigInt(distinctPrimes.length);
  const options = numericOptions(answer, [
    { value: 2n ** omega, misconceptionId: "ORDERED_PAIR_COUNT", analysis: "Ordered pairs were counted instead of unordered pairs." },
    { value: omega, misconceptionId: "PRIME_COUNT_ONLY", analysis: "The number of distinct primes was used directly." },
    { value: answer + 1n, misconceptionId: "EXTRA_SYMMETRIC_PAIR", analysis: "A factor pair was counted twice or an invalid symmetric pair was added." },
  ], rng);
  return {
    difficulty: difficulty([h, L], { inverse: true, reasoning: true }), answerSemantic: "COUNT", representation: "FACTOR_PAIR_TABLE",
    stem: `How many unordered pairs of positive integers have HCF ${h} and LCM ${L}?`, ...options,
    hiddenState: { hcf: `${h}`, lcm: `${L}`, quotient: `${quotient}`, unordered: true },
    mathematicalFingerprint: `QL079:${h}:${L}:${quotient}:${answer}`,
    explanation: explanation(
      "After removing the HCF, the reduced factors must be co-prime and their product must be LCM/HCF.",
      `Factor ${quotient} = ${L}/${h}. Assign each complete prime-power block to one side or the other.`,
      [`LCM/HCF = ${quotient} = ${factorText(quotient)}.`, `There are ${distinctPrimes.length} distinct prime-power blocks.`, `Unordered co-prime factor pairs = 2^(${distinctPrimes.length} - 1) = ${answer}.`],
      "Count distinct prime factors of LCM/HCF, then use 2^(k-1) for unordered pairs.",
      options.canonicalAnswer,
      ["Do not split one prime-power block between both reduced factors.", "Do not count (x,y) and (y,x) separately.", "Remove the HCF before counting."],
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-LCM-PAIR-COUNT"),
    prototypeAncestry: ["NUM-CP006-PROT-012"],
  };
}

export function generateQl080(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 769 + 80);
  const [a, b, c] = scaledTriple(rng);
  const values = rng.bool(0.6) ? [a, b, c] : [a, b];
  const answer = gcdMany(values);
  const unit = rng.pick(["cm", "m", "kg"] as const);
  const context = unit === "kg" ? "quantities of grain" : rng.pick(["ribbons", "wires", "wooden strips"] as const);
  const options = numericOptions(answer, [
    { value: lcmMany(values), misconceptionId: "LCM_USED", analysis: "Greatest equal groups require HCF, not LCM." },
    { value: values.reduce((x, y) => x < y ? x : y), misconceptionId: "SMALLEST_VALUE", analysis: "The smallest quantity need not divide every other quantity." },
    { value: answer > 1n ? answer / 2n : answer + 2n, misconceptionId: "NOT_GREATEST", analysis: "This may divide all values but is not the greatest possible size." },
  ], rng, ` ${unit}`);
  return {
    difficulty: difficulty(values, { caselet: true }), answerSemantic: "MEASURE", representation: "GROUPING_DIAGRAM",
    stem: `${context[0]!.toUpperCase()}${context.slice(1)} measuring ${formatList(values)} ${unit} are divided into equal largest portions without waste. What is the size of each portion?`, ...options,
    hiddenState: { values: values.map(String), unit, target: "HCF" },
    mathematicalFingerprint: `QL080:${unit}:${values.join(":")}:${answer}`,
    explanation: explanation(
      "The greatest exact size that divides every quantity is their HCF.",
      `Find the HCF of ${formatList(values)}.`,
      [`HCF(${values.join(", ")}) = ${answer}.`, `Each largest equal portion is ${answer} ${unit}.`],
      "The phrase 'largest equal portions without waste' directly signals HCF.",
      options.canonicalAnswer,
      ["Use HCF, not LCM.", "Keep the measurement unit.", "The portion size must divide every quantity exactly."],
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-GROUPING-MEASUREMENT"),
    prototypeAncestry: ["NUM-CP006-PROT-007"],
  };
}

export function generateQl081(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 773 + 81);
  const [a, b, c] = scaledTriple(rng);
  const intervals = rng.bool(0.6) ? [a, b, c] : [a, b];
  const answer = lcmMany(intervals);
  const unit = rng.pick(["seconds", "minutes"] as const);
  const subject = rng.pick(["bells", "signal lights", "machines"] as const);
  const options = numericOptions(answer, [
    { value: gcdMany(intervals), misconceptionId: "HCF_USED", analysis: "A repeat alignment requires LCM, not HCF." },
    { value: intervals.reduce((x, y) => x > y ? x : y), misconceptionId: "LONGEST_INTERVAL", analysis: "The longest interval need not align all schedules." },
    { value: intervals.slice(0, 2).reduce((x, y) => lcm(x, y)), misconceptionId: "ONE_SCHEDULE_IGNORED", analysis: "One interval was omitted from the alignment." },
  ], rng, ` ${unit}`);
  return {
    difficulty: difficulty(intervals, { caselet: true }), answerSemantic: "EVENT_TIME", representation: "EVENT_TIMELINE",
    stem: `${intervals.length === 3 ? "Three" : "Two"} ${subject} operate every ${formatList(intervals)} ${unit}. They operate together now. After how much time will they next operate together?`, ...options,
    hiddenState: { intervals: intervals.map(String), unit, target: "LCM", timeZeroExcluded: true },
    mathematicalFingerprint: `QL081:${unit}:${intervals.join(":")}:${answer}`,
    explanation: explanation(
      "The first positive simultaneous repeat is the LCM of the intervals.",
      `Find the LCM of ${formatList(intervals)} and exclude the current time zero.`,
      [`LCM(${intervals.join(", ")}) = ${answer}.`, `The next common operation occurs after ${answer} ${unit}.`],
      "The phrases 'again together' and 'next coincide' signal LCM.",
      options.canonicalAnswer,
      ["Do not count the present instant.", "Do not add the intervals.", "Include every schedule."],
    ),
    sourceAncestry: sourceAncestry("SSC-LCM-COMMON-EVENT"),
    prototypeAncestry: ["NUM-CP006-PROT-008"],
  };
}
