import {
  createRng,
  difficulty,
  explanation,
  factorText,
  fractionEquals,
  fractionHcf,
  fractionLcm,
  fractionText,
  gcd,
  gcdMany,
  lcm,
  lcmMany,
  makeOptions,
  numericOptions,
  reduceFraction,
  sourceAncestry,
  type Fraction,
} from "./core";
import type { NumCp006GeneratedContent } from "./types";

function decimalText(numerator: bigint, scale: bigint): string {
  const whole = numerator / scale;
  const remainder = numerator % scale;
  if (remainder === 0n) return `${whole}`;
  const digits = String(scale).length - 1;
  return `${whole}.${String(remainder).padStart(digits, "0").replace(/0+$/, "")}`;
}

function rationalOptions(
  answer: Fraction,
  candidates: readonly { value: Fraction; misconceptionId: string; analysis: string }[],
  seed: number,
) {
  const rng = createRng(seed);
  const correct = fractionText(answer);
  const wrong: { value: string; misconceptionId: string; analysis: string }[] = [];
  const seen = new Set([correct]);
  for (const candidate of candidates) {
    const value = fractionText(candidate.value);
    if (seen.has(value)) continue;
    seen.add(value);
    wrong.push({ value, misconceptionId: candidate.misconceptionId, analysis: candidate.analysis });
  }
  let offset = 1n;
  while (wrong.length < 3) {
    const value = fractionText(reduceFraction(answer.numerator + offset, answer.denominator));
    if (!seen.has(value)) {
      seen.add(value);
      wrong.push({
        value,
        misconceptionId: "NEARBY_RATIONAL",
        analysis: "This nearby rational value does not satisfy the exact HCF/LCM rule.",
      });
    }
    offset += 1n;
  }
  return makeOptions(correct, wrong.slice(0, 3), rng);
}

export function generateQl091(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 853 + 91);
  const decimalMode = rng.bool(0.5);
  let values: Fraction[];
  let displayValues: string[];
  let answer: Fraction;
  if (decimalMode) {
    const scale = rng.bool() ? 10n : 100n;
    const base = BigInt(rng.int(2, 12));
    const multipliers = rng.pick([[2n, 3n, 5n], [3n, 4n, 5n], [4n, 6n, 9n]] as const);
    const scaled = multipliers.map((multiplier) => base * multiplier);
    values = scaled.map((value) => reduceFraction(value, scale));
    displayValues = scaled.map((value) => decimalText(value, scale));
    answer = fractionHcf(values);
  } else {
    const numerators = rng.pick([[6n, 9n, 15n], [8n, 12n, 20n], [10n, 15n, 25n]] as const);
    const denominators = rng.pick([[5n, 10n, 4n], [3n, 8n, 12n], [7n, 14n, 21n]] as const);
    values = numerators.map((numerator, index) => reduceFraction(numerator, denominators[index]!));
    displayValues = values.map(fractionText);
    answer = fractionHcf(values);
  }
  const wrongNumerator = reduceFraction(lcmMany(values.map((value) => value.numerator)), lcmMany(values.map((value) => value.denominator)));
  const wrongDenominator = reduceFraction(gcdMany(values.map((value) => value.numerator)), gcdMany(values.map((value) => value.denominator)));
  const reciprocal = reduceFraction(answer.denominator, answer.numerator);
  const options = rationalOptions(answer, [
    { value: wrongNumerator, misconceptionId: "LCM_NUMERATOR_USED", analysis: "LCM of numerators was used instead of HCF." },
    { value: wrongDenominator, misconceptionId: "HCF_DENOMINATOR_USED", analysis: "HCF of denominators was used instead of LCM." },
    { value: reciprocal, misconceptionId: "RECIPROCAL", analysis: "The final fraction was inverted." },
  ], seed * 859 + 1);
  return {
    difficulty: difficulty(values.flatMap((value) => [value.numerator, value.denominator]), { rational: true }),
    answerSemantic: "RATIONAL", representation: decimalMode ? "DECIMAL_NORMALISATION" : "FRACTION_NORMALISATION",
    stem: `Find the HCF of ${displayValues.join(", ")}. Give the answer in simplest form.`, ...options,
    hiddenState: {
      rationals: values.map((value) => ({ numerator: `${value.numerator}`, denominator: `${value.denominator}` })),
      target: "HCF", displayMode: decimalMode ? "DECIMAL" : "FRACTION", displayValues,
    },
    mathematicalFingerprint: `QL091:${values.map(fractionText).join(":")}:${fractionText(answer)}`,
    explanation: explanation(
      "For reduced fractions, HCF = HCF of numerators ÷ LCM of denominators; decimals must first be converted to a common exact unit.",
      "Write every value as a reduced fraction, then apply the rational HCF rule.",
      [`Normalised values: ${values.map(fractionText).join(", ")}.`, `HCF of numerators = ${gcdMany(values.map((value) => value.numerator))}.`, `LCM of denominators = ${lcmMany(values.map((value) => value.denominator))}.`, `HCF = ${fractionText(answer)}.`],
      "For decimals, multiply all values by the same power of 10, find the integer HCF, then divide by that power of 10.",
      options.canonicalAnswer,
      ["Use one common scaling factor for every decimal.", "Reduce fractions before applying the rule.", "Use LCM, not HCF, in the denominator."],
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-RATIONAL-NORMALISATION"),
    prototypeAncestry: ["NUM-CP006-PROT-022"],
  };
}

export function generateQl092(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 863 + 92);
  const decimalMode = rng.bool(0.5);
  let values: Fraction[];
  let displayValues: string[];
  let answer: Fraction;
  if (decimalMode) {
    const scale = rng.bool() ? 10n : 100n;
    const base = BigInt(rng.int(1, 5));
    const multipliers = rng.pick([[2n, 3n, 4n], [3n, 4n, 5n], [4n, 5n, 6n]] as const);
    const scaled = multipliers.map((multiplier) => base * multiplier);
    values = scaled.map((value) => reduceFraction(value, scale));
    displayValues = scaled.map((value) => decimalText(value, scale));
    answer = fractionLcm(values);
  } else {
    const numerators = rng.pick([[2n, 3n, 5n], [4n, 6n, 9n], [5n, 8n, 12n]] as const);
    const denominators = rng.pick([[3n, 4n, 5n], [5n, 10n, 15n], [7n, 14n, 21n]] as const);
    values = numerators.map((numerator, index) => reduceFraction(numerator, denominators[index]!));
    displayValues = values.map(fractionText);
    answer = fractionLcm(values);
  }
  const wrongNumerator = reduceFraction(gcdMany(values.map((value) => value.numerator)), gcdMany(values.map((value) => value.denominator)));
  const wrongDenominator = reduceFraction(lcmMany(values.map((value) => value.numerator)), lcmMany(values.map((value) => value.denominator)));
  const reciprocal = reduceFraction(answer.denominator, answer.numerator);
  const options = rationalOptions(answer, [
    { value: wrongNumerator, misconceptionId: "HCF_NUMERATOR_USED", analysis: "HCF of numerators was used instead of LCM." },
    { value: wrongDenominator, misconceptionId: "LCM_DENOMINATOR_USED", analysis: "LCM of denominators was used instead of HCF." },
    { value: reciprocal, misconceptionId: "RECIPROCAL", analysis: "The final fraction was inverted." },
  ], seed * 877 + 1);
  return {
    difficulty: difficulty(values.flatMap((value) => [value.numerator, value.denominator]), { rational: true }),
    answerSemantic: "RATIONAL", representation: decimalMode ? "DECIMAL_NORMALISATION" : "FRACTION_NORMALISATION",
    stem: `Find the LCM of ${displayValues.join(", ")}. Give the answer in simplest form.`, ...options,
    hiddenState: {
      rationals: values.map((value) => ({ numerator: `${value.numerator}`, denominator: `${value.denominator}` })),
      target: "LCM", displayMode: decimalMode ? "DECIMAL" : "FRACTION", displayValues,
    },
    mathematicalFingerprint: `QL092:${values.map(fractionText).join(":")}:${fractionText(answer)}`,
    explanation: explanation(
      "For reduced fractions, LCM = LCM of numerators ÷ HCF of denominators; decimals must first be placed in one exact unit.",
      "Write every value as a reduced fraction, then apply the rational LCM rule.",
      [`Normalised values: ${values.map(fractionText).join(", ")}.`, `LCM of numerators = ${lcmMany(values.map((value) => value.numerator))}.`, `HCF of denominators = ${gcdMany(values.map((value) => value.denominator))}.`, `LCM = ${fractionText(answer)}.`],
      "For decimals, multiply by one common power of 10, find the integer LCM, then divide by that power of 10.",
      options.canonicalAnswer,
      ["Use one common scale for all decimals.", "Reduce fractions first.", "Use HCF, not LCM, in the denominator."],
    ),
    sourceAncestry: sourceAncestry("SSC-LCM-RATIONAL-NORMALISATION"),
    prototypeAncestry: ["NUM-CP006-PROT-023"],
  };
}

export function generateQl093(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 881 + 93);
  const a = BigInt(rng.int(4, 60));
  const b = BigInt(rng.int(5, 70));
  const c = BigInt(rng.int(3, 30));
  const mode = rng.int(0, 3);
  let claim: string;
  let correct: string;
  let reason: string;
  if (mode === 0) {
    claim = `For the two positive integers ${a} and ${b}, HCF × LCM = product of the two integers.`;
    correct = "True";
    reason = `${gcd(a, b)} × ${lcm(a, b)} = ${a * b}.`;
  } else if (mode === 1) {
    claim = `For any three positive integers, HCF × LCM always equals the product of all three integers.`;
    correct = "False";
    reason = `The two-number identity does not extend unchanged to three numbers; for ${a}, ${b}, ${c} it would compare ${gcdMany([a, b, c]) * lcmMany([a, b, c])} with ${a * b * c}.`;
  } else if (mode === 2) {
    const coprime = gcd(a, b) === 1n;
    claim = `If two positive integers are co-prime, their LCM is their product.`;
    correct = "True";
    reason = "Co-prime numbers have HCF 1, so LCM = product ÷ 1.";
    if (!coprime) reason += ` The statement is a general conditional rule; ${a} and ${b} are only illustrative.`;
  } else {
    const smaller = a < b ? a : b;
    const larger = smaller * BigInt(rng.int(2, 8));
    claim = `If ${smaller} divides ${larger}, then their HCF is ${larger}.`;
    correct = "False";
    reason = `When one number divides the other, the HCF is the smaller number ${smaller}.`;
  }
  const options = makeOptions(correct, [
    { value: correct === "True" ? "False" : "True", misconceptionId: "TRUTH_REVERSED", analysis: "The governing HCF/LCM identity was reversed." },
    { value: "Cannot be determined", misconceptionId: "COMPLETE_DATA_IGNORED", analysis: "The claim can be decided from standard HCF/LCM rules." },
    { value: "True only for prime numbers", misconceptionId: "PRIME_RESTRICTION", analysis: "The relevant rule is not restricted to prime numbers." },
  ], rng);
  return {
    difficulty: difficulty([a, b, c], { reasoning: true }), answerSemantic: "TRUTH_VALUE", representation: "CLAIM_CARD",
    stem: `Evaluate the claim: ${claim}`, ...options,
    hiddenState: { claimMode: mode, a: `${a}`, b: `${b}`, c: `${c}`, correctTruth: correct },
    mathematicalFingerprint: `QL093:${mode}:${a}:${b}:${c}:${correct}`,
    explanation: explanation(
      "HCF/LCM identities must be applied within their exact domain.",
      "Check whether the claim concerns two numbers, three numbers, co-prime numbers or an exact divisibility pair.",
      [reason, `Therefore the claim is ${correct.toLowerCase()}.`],
      "Before calculating, identify whether the statement is a two-number identity or a special edge rule.",
      options.canonicalAnswer,
      ["Do not extend the two-number product identity to three numbers.", "Co-prime numbers need not both be prime.", "When one divides the other, smaller = HCF and larger = LCM."],
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-LCM-CLAIM-VERIFICATION"),
    prototypeAncestry: ["NUM-CP006-PROT-024"],
  };
}

export function generateQl094(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 883 + 94);
  const target = rng.bool() ? "HCF" : "LCM";
  const setA = rng.pick([[12n, 18n], [18n, 30n], [24n, 36n], [8n, 12n, 20n], [9n, 15n, 21n]] as const);
  const setB = rng.pick([[14n, 21n], [16n, 24n], [20n, 30n], [6n, 10n, 15n], [12n, 18n, 27n]] as const);
  const valueA = target === "HCF" ? gcdMany(setA) : lcmMany(setA);
  const valueB = target === "HCF" ? gcdMany(setB) : lcmMany(setB);
  const correct = `A = ${valueA}; B = ${valueB}`;
  const rawCandidates = [
    { value: `A = ${valueB}; B = ${valueA}`, misconceptionId: "VALUES_SWAPPED", analysis: "The two set results were interchanged." },
    { value: `A = ${target === "HCF" ? lcmMany(setA) : gcdMany(setA)}; B = ${target === "HCF" ? lcmMany(setB) : gcdMany(setB)}`, misconceptionId: "HCF_LCM_SWAPPED", analysis: "The opposite invariant was calculated for both sets." },
    { value: `A = ${setA[0]}; B = ${setB[0]}`, misconceptionId: "FIRST_VALUE_ONLY", analysis: "Only the first number of each set was used." },
    { value: `A = ${valueA + 1n}; B = ${valueB}`, misconceptionId: "A_OFF_BY_ONE", analysis: "Set A was calculated with a nearby but invalid value." },
    { value: `A = ${valueA}; B = ${valueB + 1n}`, misconceptionId: "B_OFF_BY_ONE", analysis: "Set B was calculated with a nearby but invalid value." },
  ];
  const seenCandidates = new Set([correct]);
  const candidates = rawCandidates.filter((candidate) => {
    if (seenCandidates.has(candidate.value)) return false;
    seenCandidates.add(candidate.value);
    return true;
  }).slice(0, 3);
  const options = makeOptions(correct, candidates, rng);
  return {
    difficulty: difficulty([...setA, ...setB], { reasoning: true }), answerSemantic: "VALUE_PAIR", representation: "COMPARISON_CASELET",
    stem: `Set A contains ${setA.join(", ")}; Set B contains ${setB.join(", ")}. Which option gives the ${target} of each set correctly?`, ...options,
    hiddenState: { setA: setA.map(String), setB: setB.map(String), target },
    mathematicalFingerprint: `QL094:${target}:${setA.join(":")}:${setB.join(":")}:${valueA}:${valueB}`,
    explanation: explanation(
      "The requested HCF or LCM must be computed separately for each complete set.",
      `Calculate the ${target} of Set A and Set B independently before comparing the options.`,
      [`${target}(A) = ${valueA}.`, `${target}(B) = ${valueB}.`, `Therefore the correct value pair is A = ${valueA}; B = ${valueB}.`],
      "Write two short calculations side by side; do not mix the numbers across sets.",
      options.canonicalAnswer,
      ["Do not swap the two set results.", "Use the requested invariant for both sets.", "Include every number in each set."],
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-LCM-COMPARISON-CASELET"),
    prototypeAncestry: ["NUM-CP006-PROT-025"],
  };
}

const COMBINATION_LABELS = [
  "I only", "II only", "III only", "I and II only", "I and III only", "II and III only", "All three",
] as const;

function combinationLabel(flags: readonly boolean[]): string {
  const trueIndices = flags.map((flag, index) => flag ? index + 1 : 0).filter(Boolean).join(",");
  const map: Record<string, string> = {
    "1": "I only", "2": "II only", "3": "III only", "1,2": "I and II only",
    "1,3": "I and III only", "2,3": "II and III only", "1,2,3": "All three",
  };
  return map[trueIndices] ?? "None";
}

export function generateQl095(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 887 + 95);
  const a = BigInt(rng.int(12, 80));
  const b = BigInt(rng.int(15, 90));
  const h = gcd(a, b);
  const L = lcm(a, b);
  const truthPattern = rng.pick([
    [true, false, false], [false, true, false], [false, false, true], [true, true, false],
    [true, false, true], [false, true, true], [true, true, true],
  ] as const);
  const statementIValue = truthPattern[0] ? h : h + 1n;
  const statementIIValue = truthPattern[1] ? L : L + h;
  const statementIIIValue = truthPattern[2] ? a * b : a * b + h;
  const statements = [
    `I. HCF(${a}, ${b}) = ${statementIValue}.`,
    `II. LCM(${a}, ${b}) = ${statementIIValue}.`,
    `III. HCF × LCM = ${statementIIIValue}.`,
  ];
  const correct = combinationLabel(truthPattern);
  const distractorLabels = COMBINATION_LABELS.filter((label) => label !== correct);
  const shuffled = [...distractorLabels].sort(() => rng.next() - 0.5).slice(0, 3);
  const options = makeOptions(correct, shuffled.map((value, index) => ({
    value,
    misconceptionId: `STATEMENT_PATTERN_${index + 1}`,
    analysis: "At least one statement in this combination has been evaluated incorrectly.",
  })), rng);
  return {
    difficulty: difficulty([a, b, h, L], { reasoning: true }), answerSemantic: "STATEMENT_COMBINATION", representation: "STATEMENT_SET",
    stem: `For the numbers ${a} and ${b}, consider the statements: ${statements.join(" ")} Which statements are correct?`, ...options,
    hiddenState: { a: `${a}`, b: `${b}`, statements, statementValues: [`${statementIValue}`, `${statementIIValue}`, `${statementIIIValue}`], truthPattern: [...truthPattern] },
    mathematicalFingerprint: `QL095:${a}:${b}:${truthPattern.join("")}`,
    explanation: explanation(
      "Each HCF/LCM statement must be checked independently.",
      "Compute the exact HCF, LCM and two-number product identity, then match the truth pattern.",
      [`HCF(${a}, ${b}) = ${h}.`, `LCM(${a}, ${b}) = ${L}.`, `${h} × ${L} = ${a * b}.`, `Hence the correct combination is ${correct}.`],
      "Calculate HCF and LCM once, then test all three statements against those two values.",
      options.canonicalAnswer,
      ["Do not assume a statement is true because its value is close.", "Use the product identity only for these two numbers.", "Match the final truth pattern carefully."],
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-LCM-STATEMENT-COMBINATION"),
    prototypeAncestry: ["NUM-CP006-PROT-026"],
  };
}

export function generateQl096(seed: number): NumCp006GeneratedContent {
  const rng = createRng(seed * 907 + 96);
  const a = BigInt(rng.int(6, 40));
  const b = BigInt(rng.int(8, 70));
  const h = gcd(a, b);
  const L = lcm(a, b);
  const product = a * b;
  const mode = rng.int(0, 3);
  let statementI: string;
  let statementII: string;
  let correct: string;
  if (mode === 0) {
    statementI = `The product of the two integers is ${product}.`;
    statementII = `Their HCF is ${h}.`;
    correct = "I alone is sufficient";
  } else if (mode === 1) {
    statementI = `Their HCF is ${h}.`;
    statementII = `The product of the two integers is ${product}.`;
    correct = "II alone is sufficient";
  } else if (mode === 2) {
    statementI = `Their HCF is ${h}.`;
    statementII = `Their LCM is ${L}.`;
    correct = "Both together are sufficient";
  } else {
    statementI = `Their HCF is ${h}.`;
    statementII = `The unknown integer is divisible by ${h}.`;
    correct = "Even together are insufficient";
  }
  const labels = [
    "I alone is sufficient", "II alone is sufficient", "Both together are sufficient", "Even together are insufficient",
  ];
  const options = makeOptions(correct, labels.filter((label) => label !== correct).map((value, index) => ({
    value,
    misconceptionId: `SUFFICIENCY_${index + 1}`,
    analysis: "This choice misjudges whether the unknown integer is uniquely fixed.",
  })), rng);
  return {
    difficulty: difficulty([a, b, h, L], { reasoning: true, inverse: true }), answerSemantic: "DATA_SUFFICIENCY", representation: "DATA_SUFFICIENCY_CARD",
    stem: `A positive integer a = ${a}; b is another positive integer. What is b? Statement I: ${statementI} Statement II: ${statementII}`, ...options,
    hiddenState: { known: `${a}`, actualUnknown: `${b}`, hcf: `${h}`, lcm: `${L}`, product: `${product}`, mode },
    mathematicalFingerprint: `QL096:${a}:${b}:${mode}:${correct}`,
    explanation: explanation(
      "A statement is sufficient only when it fixes the unknown integer uniquely.",
      "Test Statement I alone, Statement II alone, and then both together without importing unstated information.",
      mode === 0
        ? [`From I, b = ${product} ÷ ${a} = ${b}, so I alone is sufficient.`, `II allows several integers with HCF ${h}, so II alone is insufficient.`]
        : mode === 1
          ? [`I allows several integers with HCF ${h}.`, `From II, b = ${product} ÷ ${a} = ${b}, so II alone is sufficient.`]
          : mode === 2
            ? [`I alone does not determine b uniquely.`, `II alone does not determine b uniquely.`, `Together, b = HCF × LCM ÷ a = ${h} × ${L} ÷ ${a} = ${b}.`]
            : [`I permits many values of b.`, `II only repeats divisibility already implied by the HCF.`, `Even together, b is not unique.`],
      "For a known integer, a product statement fixes the other integer immediately; HCF and LCM together also do so.",
      options.canonicalAnswer,
      ["Do not combine statements when testing either one alone.", "HCF alone usually allows many partners.", "Sufficiency means a unique value, not merely a valid value."],
    ),
    sourceAncestry: sourceAncestry("SSC-HCF-LCM-DATA-SUFFICIENCY"),
    prototypeAncestry: ["NUM-CP006-PROT-027"],
  };
}

export function generateQl097(seed: number, prototypeId: "NUM-CP006-PROT-028" | "NUM-CP006-PROT-029"): NumCp006GeneratedContent {
  const rng = createRng(seed * 911 + (prototypeId.endsWith("028") ? 28 : 29));
  if (prototypeId.endsWith("028")) {
    const h = BigInt(rng.int(3, 15));
    const multipliers = rng.pick([[4n, 6n, 9n], [5n, 8n, 12n], [6n, 10n, 15n]] as const);
    const lengths = multipliers.map((multiplier) => h * multiplier);
    const totalPieces = lengths.reduce((sum, length) => sum + length / h, 0n);
    const options = numericOptions(totalPieces, [
      { value: h, misconceptionId: "GROUP_SIZE_NOT_COUNT", analysis: "This is the length of each piece, not the total number of pieces." },
      { value: lengths.length === 3 ? 3n : 2n, misconceptionId: "ITEM_COUNT_ONLY", analysis: "Only the number of original items was counted." },
      { value: lengths.reduce((sum, length) => sum + length, 0n) / lcmMany(lengths), misconceptionId: "LCM_USED", analysis: "LCM was used instead of the greatest common piece size." },
    ], rng);
    return {
      difficulty: difficulty(lengths, { caselet: true, reasoning: true }), answerSemantic: "COUNT", representation: "MINI_CASELET_GROUPING",
      stem: `A workshop has three metal rods of lengths ${lengths.join(", ")} cm. They are cut into equal longest pieces without waste. How many pieces are obtained in all?`, ...options,
      hiddenState: { caseletMode: "GROUPING", lengths: lengths.map(String), unit: "cm" },
      mathematicalFingerprint: `QL097:G:${lengths.join(":")}:${h}:${totalPieces}`,
      explanation: explanation(
        "A grouping caselet may require HCF first and a second count after that.",
        "Find the greatest common piece length, then divide each rod by that length and add the counts.",
        [`HCF(${lengths.join(", ")}) = ${h} cm.`, `Piece counts are ${lengths.map((length) => `${length}/${h}=${length / h}`).join(", ")}.`, `Total pieces = ${totalPieces}.`],
        "In two-step grouping questions, write 'size = HCF' before counting groups or pieces.",
        options.canonicalAnswer,
        ["Do not report the HCF when the question asks for a count.", "Divide every original quantity by the group size.", "Add the group counts only after finding the HCF."],
      ),
      sourceAncestry: sourceAncestry("SSC-HCF-MINI-CASELET"),
      prototypeAncestry: ["NUM-CP006-PROT-028"],
    };
  }

  const intervals = rng.pick([[6n, 8n, 12n], [8n, 10n, 15n], [9n, 12n, 18n], [10n, 12n, 15n]] as const);
  const cycle = lcmMany(intervals);
  const coincidencesAfterStart = BigInt(rng.int(3, 8));
  const duration = cycle * coincidencesAfterStart + BigInt(rng.int(0, Math.max(1, Number(cycle - 1n))));
  const answer = duration / cycle;
  const options = numericOptions(answer, [
    { value: answer + 1n, misconceptionId: "START_INCLUDED", analysis: "The starting coincidence was included even though the question asks after the start." },
    { value: cycle, misconceptionId: "CYCLE_NOT_COUNT", analysis: "This is the common cycle length, not the number of later coincidences." },
    { value: duration / gcdMany(intervals), misconceptionId: "HCF_USED", analysis: "HCF was used instead of the common repeat cycle." },
  ], rng);
  return {
    difficulty: difficulty([...intervals, duration], { caselet: true, reasoning: true }), answerSemantic: "COUNT", representation: "MINI_CASELET_EVENT_TIMELINE",
    stem: `Three indicator lights flash every ${intervals.join(", ")} seconds and flash together at time 0. During the next ${duration} seconds, how many times do they flash together after time 0?`, ...options,
    hiddenState: { caseletMode: "EVENT", intervals: intervals.map(String), duration: `${duration}`, startExcluded: true },
    mathematicalFingerprint: `QL097:E:${intervals.join(":")}:${duration}:${cycle}:${answer}`,
    explanation: explanation(
      "An event caselet may require the LCM cycle first and then a bounded count of cycles.",
      "Find the positive common repeat interval, divide the time window by it, and exclude time 0.",
      [`LCM(${intervals.join(", ")}) = ${cycle} seconds.`, `floor(${duration}/${cycle}) = ${answer}.`, `Therefore there are ${answer} later simultaneous flashes.`],
      "For a window after the start, count positive multiples of the LCM up to the duration.",
      options.canonicalAnswer,
      ["Do not include time 0 when it is explicitly excluded.", "Use LCM for common repeats.", "Count multiples within the stated duration, not beyond it."],
    ),
    sourceAncestry: sourceAncestry("SSC-LCM-MINI-CASELET"),
    prototypeAncestry: ["NUM-CP006-PROT-029"],
  };
}
