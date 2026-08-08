import {
  createRng,
  difficulty,
  explanation,
  formatList,
  gcdMany,
  lcmMany,
  numericOptions,
  sourceAncestry,
} from "./core";
import type { NumCp006GeneratedContent } from "./types";

const DIVISOR_SETS = [
  [4n, 6n], [6n, 8n], [8n, 12n], [9n, 12n], [10n, 15n], [12n, 18n],
  [4n, 6n, 10n], [6n, 8n, 12n], [8n, 12n, 18n], [9n, 12n, 15n], [10n, 14n, 15n],
] as const;

const MULTIPLIER_TRIPLES = [
  [3n, 7n, 10n], [4n, 9n, 15n], [5n, 11n, 14n], [7n, 12n, 20n], [8n, 13n, 21n],
] as const;

export function generateQl082(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 787 + 82);
  const divisors = [...rng.pick(DIVISOR_SETS)];
  const common = lcmMany(divisors);
  const multiplier = BigInt(rng.int(3, 15));
  const lowerBound = common * multiplier - BigInt(rng.int(1, Math.max(2, Number(common / 2n))));
  const answer = ((lowerBound + common - 1n) / common) * common;
  const previous = answer - common;
  const options = numericOptions(answer, [
    { value: common, misconceptionId: "BOUND_IGNORED", analysis: "This is the basic LCM but it is below the required bound." },
    { value: previous, misconceptionId: "PREVIOUS_MULTIPLE", analysis: "This common multiple is still below the lower bound." },
    { value: lowerBound, misconceptionId: "BOUND_ASSUMED_DIVISIBLE", analysis: "The bound itself is not divisible by all the given numbers." },
  ], rng);
  return {
    difficulty: difficulty([...divisors, lowerBound], { bounded: true }), answerSemantic: "INTEGER", representation: "NUMBER_LINE",
    stem: `Find the least integer not less than ${lowerBound} that is divisible by ${formatList(divisors)}.`, ...options,
    hiddenState: { divisors: divisors.map(String), lowerBound: `${lowerBound}`, mode: "LEAST_AT_OR_ABOVE" },
    mathematicalFingerprint: `QL082:${divisors.join(":")}:${lowerBound}:${answer}`,
    explanation: explanation(
      "All common multiples are multiples of the LCM.",
      `First find LCM(${divisors.join(", ")}), then move to its first multiple at or above ${lowerBound}.`,
      [`LCM(${divisors.join(", ")}) = ${common}.`, `${lowerBound} ÷ ${common} lies between ${multiplier - 1n} and ${multiplier}.`, `Therefore the required multiple is ${common} × ${multiplier} = ${answer}.`],
      "Use ceiling(lower bound ÷ LCM) × LCM.",
      options.canonicalAnswer,
      ["Do not return the LCM when it is below the bound.", "Use ceiling, not floor.", "Check divisibility by every given number."],
    ),
    sourceAncestry: sourceAncestry("SSC-LEAST-BOUNDED-COMMON-MULTIPLE"),
    prototypeAncestry: ["NUM-CP006-PROT-013"],
  };
}

export function generateQl083(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 797 + 83);
  const divisors = [...rng.pick(DIVISOR_SETS)];
  const common = lcmMany(divisors);
  const multiplier = BigInt(rng.int(4, 18));
  const upperBound = common * multiplier + BigInt(rng.int(1, Math.max(2, Number(common / 2n))));
  const answer = (upperBound / common) * common;
  const next = answer + common;
  const options = numericOptions(answer, [
    { value: common, misconceptionId: "BOUND_IGNORED", analysis: "This is the basic LCM, not the greatest allowed multiple." },
    { value: next, misconceptionId: "NEXT_MULTIPLE", analysis: "This common multiple exceeds the upper bound." },
    { value: upperBound, misconceptionId: "BOUND_ASSUMED_DIVISIBLE", analysis: "The upper bound itself is not divisible by all given numbers." },
  ], rng);
  return {
    difficulty: difficulty([...divisors, upperBound], { bounded: true }), answerSemantic: "INTEGER", representation: "NUMBER_LINE",
    stem: `Find the greatest integer not exceeding ${upperBound} that is divisible by ${formatList(divisors)}.`, ...options,
    hiddenState: { divisors: divisors.map(String), upperBound: `${upperBound}`, mode: "GREATEST_AT_OR_BELOW" },
    mathematicalFingerprint: `QL083:${divisors.join(":")}:${upperBound}:${answer}`,
    explanation: explanation(
      "Every common multiple is a multiple of the LCM.",
      `Find the LCM and take its last multiple not exceeding ${upperBound}.`,
      [`LCM(${divisors.join(", ")}) = ${common}.`, `floor(${upperBound}/${common}) = ${upperBound / common}.`, `Required number = ${common} × ${upperBound / common} = ${answer}.`],
      "Use floor(upper bound ÷ LCM) × LCM.",
      options.canonicalAnswer,
      ["Use floor, not ceiling.", "The next common multiple may exceed the bound.", "The upper bound need not itself be divisible."],
    ),
    sourceAncestry: sourceAncestry("SSC-GREATEST-BOUNDED-COMMON-MULTIPLE"),
    prototypeAncestry: ["NUM-CP006-PROT-014"],
  };
}

export function generateQl084(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 809 + 84);
  const divisor = BigInt(rng.int(4, 40));
  const remainder = BigInt(rng.int(1, Number(divisor - 1n)));
  const multipliers = rng.pick(MULTIPLIER_TRIPLES);
  const numbers = multipliers.map((multiplier) => divisor * multiplier + remainder);
  const differences = [numbers[1]! - numbers[0]!, numbers[2]! - numbers[0]!];
  const answer = gcdMany(differences);
  const options = numericOptions(answer, [
    { value: gcdMany(numbers), misconceptionId: "HCF_OF_ORIGINALS", analysis: "The HCF of the original numbers does not model a shared remainder." },
    { value: remainder, misconceptionId: "REMAINDER_AS_DIVISOR", analysis: "The common remainder was mistaken for the divisor." },
    { value: differences[0]!, misconceptionId: "ONE_DIFFERENCE_ONLY", analysis: "Only one difference was used; all differences must be checked." },
  ], rng);
  return {
    difficulty: difficulty(numbers, { remainder: true }), answerSemantic: "DIVISOR", representation: "DIFFERENCE_TABLE",
    stem: `What is the greatest positive integer that divides ${numbers.join(", ")} leaving the same remainder in each case?`, ...options,
    hiddenState: { numbers: numbers.map(String), sameRemainder: true },
    mathematicalFingerprint: `QL084:${numbers.join(":")}:${answer}`,
    explanation: explanation(
      "If several numbers leave the same remainder on division by d, then d divides every pairwise difference.",
      "Subtract one number from the others and take the HCF of the differences.",
      [`Differences: ${numbers[1]} - ${numbers[0]} = ${differences[0]} and ${numbers[2]} - ${numbers[0]} = ${differences[1]}.`, `HCF(${differences.join(", ")}) = ${answer}.`, `Each original number leaves the same remainder ${remainder} on division by ${answer}.`],
      "For 'same remainder', immediately take the HCF of differences.",
      options.canonicalAnswer,
      ["Do not take the HCF of the original numbers.", "Use all independent differences.", "The divisor must be greater than the common remainder."],
    ),
    sourceAncestry: sourceAncestry("SSC-SAME-REMAINDER-GREATEST-DIVISOR"),
    prototypeAncestry: ["NUM-CP006-PROT-015"],
  };
}

export function generateQl085(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 811 + 85);
  const divisor = BigInt(rng.int(5, 35));
  const multipliers = rng.pick(MULTIPLIER_TRIPLES);
  const remainders = [1n, 2n, 3n].map((offset) => (BigInt(rng.int(1, Number(divisor - 1n))) + offset) % divisor).map((value) => value === 0n ? 1n : value);
  const adjusted = multipliers.map((multiplier) => divisor * multiplier);
  const numbers = adjusted.map((value, index) => value + remainders[index]!);
  const answer = gcdMany(adjusted);
  const options = numericOptions(answer, [
    { value: gcdMany(numbers), misconceptionId: "REMAINDERS_NOT_SUBTRACTED", analysis: "The stated remainders were not removed before taking the HCF." },
    { value: gcdMany(remainders), misconceptionId: "HCF_OF_REMAINDERS", analysis: "The HCF of the remainders is irrelevant." },
    { value: adjusted[0]!, misconceptionId: "ONE_ADJUSTED_VALUE", analysis: "Only one adjusted number was used." },
  ], rng);
  const conditions = numbers.map((number, index) => `${number} leaves remainder ${remainders[index]}`).join("; ");
  return {
    difficulty: difficulty(numbers, { remainder: true }), answerSemantic: "DIVISOR", representation: "ADJUSTED_VALUE_TABLE",
    stem: `Find the greatest positive integer d such that ${conditions} when divided by d.`, ...options,
    hiddenState: { numbers: numbers.map(String), remainders: remainders.map(String), mode: "SPECIFIED_REMAINDERS" },
    mathematicalFingerprint: `QL085:${numbers.join(":")}:${remainders.join(":")}:${answer}`,
    explanation: explanation(
      "If n leaves remainder r on division by d, then d divides n - r.",
      "Subtract each stated remainder, then take the HCF of the adjusted values.",
      [`Adjusted values: ${numbers.map((number, index) => `${number}-${remainders[index]}=${adjusted[index]}`).join(", ")}.`, `HCF(${adjusted.join(", ")}) = ${answer}.`],
      "Write each adjusted value n-r before doing any factorisation.",
      options.canonicalAnswer,
      ["Subtract the matching remainder from each number.", "Do not take the HCF of the remainders.", "Verify every remainder is smaller than the divisor."],
    ),
    sourceAncestry: sourceAncestry("SSC-SPECIFIED-REMAINDERS-GREATEST-DIVISOR"),
    prototypeAncestry: ["NUM-CP006-PROT-016"],
  };
}

export function generateQl086(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 821 + 86);
  const divisors = [...rng.pick(DIVISOR_SETS)];
  const common = lcmMany(divisors);
  const maximumAllowedRemainder = Number(divisors.reduce((x, y) => x < y ? x : y) - 1n);
  const remainder = BigInt(rng.int(1, Math.max(1, maximumAllowedRemainder)));
  const answer = common + remainder;
  const options = numericOptions(answer, [
    { value: common, misconceptionId: "REMAINDER_OMITTED", analysis: "The common remainder was not added back." },
    { value: remainder, misconceptionId: "TRIVIAL_REMAINDER", analysis: "The remainder alone is excluded because the number must exceed every divisor." },
    { value: common - remainder, misconceptionId: "REMAINDER_SUBTRACTED", analysis: "The remainder was subtracted instead of added." },
  ], rng);
  return {
    difficulty: difficulty([...divisors, answer], { remainder: true }), answerSemantic: "INTEGER", representation: "CONGRUENCE_STRIP",
    stem: `Find the least positive integer greater than every divisor in ${formatList(divisors)} that leaves remainder ${remainder} when divided by each of them.`, ...options,
    hiddenState: { divisors: divisors.map(String), commonRemainder: `${remainder}`, greaterThanEveryDivisor: true },
    mathematicalFingerprint: `QL086:${divisors.join(":")}:${remainder}:${answer}`,
    explanation: explanation(
      "After subtracting the common remainder, the number must be a common multiple of all divisors.",
      "Find the LCM and add the common remainder back.",
      [`LCM(${divisors.join(", ")}) = ${common}.`, `Least non-trivial number = ${common} + ${remainder} = ${answer}.`],
      "For a common remainder r, use LCM + r when the trivial value r is excluded.",
      options.canonicalAnswer,
      ["Check that the remainder is smaller than every divisor.", "Do not choose the trivial number equal to the remainder.", "Add the remainder after finding the LCM."],
    ),
    sourceAncestry: sourceAncestry("SSC-COMMON-REMAINDER-LEAST-NUMBER"),
    prototypeAncestry: ["NUM-CP006-PROT-017"],
  };
}

export function generateQl087(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 823 + 87);
  const divisors = [...rng.pick(DIVISOR_SETS)];
  const common = lcmMany(divisors);
  const quotient = BigInt(rng.int(3, 15));
  const residue = BigInt(rng.int(1, Number(common - 1n)));
  const number = common * quotient + residue;
  const answer = common - residue;
  const options = numericOptions(answer, [
    { value: residue, misconceptionId: "SUBTRACTION_ANSWER", analysis: "This is the amount to subtract, not the amount to add." },
    { value: common, misconceptionId: "FULL_LCM_ADDED", analysis: "Adding a full LCM is more than necessary." },
    { value: answer + common, misconceptionId: "NEXT_AFTER_NEXT", analysis: "This reaches a later common multiple rather than the nearest one." },
  ], rng);
  return {
    difficulty: difficulty([...divisors, number], { remainder: true }), answerSemantic: "INTEGER", representation: "NEXT_MULTIPLE_DIAGRAM",
    stem: `What is the least positive integer that must be added to ${number} so that the result is divisible by ${formatList(divisors)}?`, ...options,
    hiddenState: { number: `${number}`, divisors: divisors.map(String), operation: "ADD" },
    mathematicalFingerprint: `QL087:${number}:${divisors.join(":")}:${answer}`,
    explanation: explanation(
      "The target must be the next multiple of the LCM.",
      "Find the current remainder modulo the LCM and fill the gap to the next multiple.",
      [`LCM(${divisors.join(", ")}) = ${common}.`, `${number} leaves remainder ${residue} modulo ${common}.`, `Required addition = ${common} - ${residue} = ${answer}.`],
      "Use LCM - (number mod LCM), with zero handled separately.",
      options.canonicalAnswer,
      ["Do not return the current remainder when addition is asked.", "Use the LCM of all divisors.", "Choose the nearest next common multiple."],
    ),
    sourceAncestry: sourceAncestry("SSC-LEAST-ADDITION-COMMON-DIVISIBILITY"),
    prototypeAncestry: ["NUM-CP006-PROT-018"],
  };
}

export function generateQl088(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 827 + 88);
  const divisors = [...rng.pick(DIVISOR_SETS)];
  const common = lcmMany(divisors);
  const quotient = BigInt(rng.int(3, 15));
  const residue = BigInt(rng.int(1, Number(common - 1n)));
  const number = common * quotient + residue;
  const answer = residue;
  const options = numericOptions(answer, [
    { value: common - residue, misconceptionId: "ADDITION_ANSWER", analysis: "This is the amount to add, not subtract." },
    { value: common, misconceptionId: "FULL_LCM_SUBTRACTED", analysis: "Subtracting a full LCM is not minimal." },
    { value: residue + common, misconceptionId: "EXTRA_CYCLE", analysis: "An unnecessary full cycle was included." },
  ], rng);
  return {
    difficulty: difficulty([...divisors, number], { remainder: true }), answerSemantic: "INTEGER", representation: "PREVIOUS_MULTIPLE_DIAGRAM",
    stem: `What is the least positive integer that must be subtracted from ${number} so that the result is divisible by ${formatList(divisors)}?`, ...options,
    hiddenState: { number: `${number}`, divisors: divisors.map(String), operation: "SUBTRACT" },
    mathematicalFingerprint: `QL088:${number}:${divisors.join(":")}:${answer}`,
    explanation: explanation(
      "Subtracting the current remainder moves the number back to the previous multiple of the LCM.",
      "Find the remainder of the number when divided by the LCM.",
      [`LCM(${divisors.join(", ")}) = ${common}.`, `${number} mod ${common} = ${residue}.`, `Required subtraction = ${residue}.`],
      "For least subtraction, use number mod LCM.",
      options.canonicalAnswer,
      ["Do not use the gap to the next multiple.", "Use all divisors when finding the LCM.", "Subtract only the current remainder."],
    ),
    sourceAncestry: sourceAncestry("SSC-LEAST-SUBTRACTION-COMMON-DIVISIBILITY"),
    prototypeAncestry: ["NUM-CP006-PROT-019"],
  };
}

export function generateQl089(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 829 + 89);
  const divisors = [...rng.pick(DIVISOR_SETS)];
  const common = lcmMany(divisors);
  const deficiency = BigInt(rng.int(1, Math.max(1, Number(divisors.reduce((x, y) => x < y ? x : y) - 1n))));
  const multiplier = BigInt(rng.int(2, 6));
  const answer = common * multiplier - deficiency;
  const options = numericOptions(answer, [
    { value: common - deficiency, misconceptionId: "BOUND_OR_CYCLE_IGNORED", analysis: "This is a smaller cycle and does not satisfy the stated size condition." },
    { value: common * multiplier + deficiency, misconceptionId: "DEFICIENCY_ADDED", analysis: "The common deficiency was added rather than subtracted." },
    { value: common * multiplier, misconceptionId: "DEFICIENCY_OMITTED", analysis: "The deficiency condition was ignored." },
  ], rng);
  const lowerBound = common * (multiplier - 1n);
  return {
    difficulty: difficulty([...divisors, answer], { remainder: true, bounded: true }), answerSemantic: "INTEGER", representation: "COMMON_DEFICIENCY_STRIP",
    stem: `Find the least integer greater than ${lowerBound} that is ${deficiency} less than a number divisible by ${formatList(divisors)}.`, ...options,
    hiddenState: { divisors: divisors.map(String), deficiency: `${deficiency}`, lowerBound: `${lowerBound}` },
    mathematicalFingerprint: `QL089:${divisors.join(":")}:${deficiency}:${lowerBound}:${answer}`,
    explanation: explanation(
      "If N is c less than a common multiple, then N + c is divisible by every given divisor.",
      "Find the first common multiple above the bound after accounting for the deficiency.",
      [`LCM(${divisors.join(", ")}) = ${common}.`, `The first suitable common multiple is ${common * multiplier}.`, `N = ${common * multiplier} - ${deficiency} = ${answer}.`],
      "Translate 'c less than a common multiple' into N + c ≡ 0 modulo the LCM.",
      options.canonicalAnswer,
      ["Subtract the deficiency from the common multiple.", "Respect the lower-bound condition.", "Use the LCM of every listed divisor."],
    ),
    sourceAncestry: sourceAncestry("SSC-COMMON-DEFICIENCY-LCM"),
    prototypeAncestry: ["NUM-CP006-PROT-020"],
  };
}

export function generateQl090(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 839 + 90);
  const divisors = [...rng.pick(DIVISOR_SETS)];
  const common = lcmMany(divisors);
  const firstMultiplier = BigInt(rng.int(1, 6));
  const count = BigInt(rng.int(3, 12));
  const lower = common * firstMultiplier - BigInt(rng.int(0, Math.max(1, Number(common / 3n))));
  const upper = common * (firstMultiplier + count - 1n) + BigInt(rng.int(0, Math.max(1, Number(common / 3n))));
  const answer = upper / common - ((lower - 1n) / common);
  const options = numericOptions(answer, [
    { value: upper / common, misconceptionId: "LOWER_BOUND_IGNORED", analysis: "Multiples below the lower bound were included." },
    { value: answer + 1n, misconceptionId: "ENDPOINT_OVERCOUNT", analysis: "An extra endpoint was counted without checking divisibility." },
    { value: answer > 0n ? answer - 1n : 0n, misconceptionId: "ENDPOINT_UNDERCOUNT", analysis: "A valid boundary multiple was omitted." },
  ], rng);
  return {
    difficulty: difficulty([...divisors, lower, upper], { bounded: true, reasoning: true }), answerSemantic: "COUNT", representation: "BOUNDED_MULTIPLE_TABLE",
    stem: `How many integers from ${lower} to ${upper}, inclusive, are divisible by ${formatList(divisors)}?`, ...options,
    hiddenState: { divisors: divisors.map(String), lower: `${lower}`, upper: `${upper}`, inclusive: true },
    mathematicalFingerprint: `QL090:${divisors.join(":")}:${lower}:${upper}:${answer}`,
    explanation: explanation(
      "Numbers divisible by every listed divisor are exactly the multiples of their LCM.",
      "Count LCM multiples up to the upper bound and subtract those below the lower bound.",
      [`LCM(${divisors.join(", ")}) = ${common}.`, `Multiples up to ${upper}: floor(${upper}/${common}) = ${upper / common}.`, `Multiples below ${lower}: floor((${lower}-1)/${common}) = ${(lower - 1n) / common}.`, `Count = ${answer}.`],
      "Use floor(U/LCM) - floor((L-1)/LCM) for an inclusive interval [L,U].",
      options.canonicalAnswer,
      ["Use the LCM, not each divisor separately.", "Handle both endpoints explicitly.", "Subtract multiples below the lower bound."],
    ),
    sourceAncestry: sourceAncestry("SSC-BOUNDED-COMMON-MULTIPLE-COUNT"),
    prototypeAncestry: ["NUM-CP006-PROT-021"],
  };
}
