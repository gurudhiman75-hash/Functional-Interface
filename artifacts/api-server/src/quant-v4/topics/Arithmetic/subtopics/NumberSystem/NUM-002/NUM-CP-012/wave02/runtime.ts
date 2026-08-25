import { createHash } from "node:crypto";

import type {
  NumCp012Wave02Difficulty,
  NumCp012Wave02Option,
  NumCp012Wave02Package,
  NumCp012Wave02PrototypeId,
} from "./types.ts";

const lifecycle = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE02_REVIEW_REQUIRED" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

class Rng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next() {
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0;
    return this.state / 0x100000000;
  }

  int(min: number, max: number) {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  pick<T>(values: readonly T[]): T {
    return values[this.int(0, values.length - 1)]!;
  }
}

interface OptionDefinition {
  readonly value: string;
  readonly misconceptionId: string;
}

function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256")
    .update(JSON.stringify({ prototypeId, state }, (_key, value) => typeof value === "bigint" ? value.toString() : value))
    .digest("hex");
}

function shuffle<T>(values: readonly T[], rng: Rng): T[] {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function numericOptions(
  correct: bigint,
  distractors: readonly { value: bigint; misconceptionId: string }[],
): readonly OptionDefinition[] {
  const definitions: OptionDefinition[] = [{ value: correct.toString(), misconceptionId: "CORRECT" }];
  for (const distractor of distractors) {
    const value = distractor.value.toString();
    if (distractor.value >= 0n && !definitions.some((item) => item.value === value)) {
      definitions.push({ value, misconceptionId: distractor.misconceptionId });
    }
    if (definitions.length === 4) break;
  }

  let delta = 1n;
  while (definitions.length < 4) {
    for (const candidate of [correct + delta, correct >= delta ? correct - delta : 0n]) {
      const value = candidate.toString();
      if (!definitions.some((item) => item.value === value)) {
        definitions.push({ value, misconceptionId: "NEARBY_VALUE" });
      }
      if (definitions.length === 4) break;
    }
    delta += 1n;
  }
  return definitions;
}

function packageFrom(input: Readonly<{
  prototypeId: NumCp012Wave02PrototypeId;
  seed: number;
  difficulty: NumCp012Wave02Difficulty;
  answerSemantic: string;
  representation: string;
  stem: string;
  canonicalAnswer: string;
  verifierAnswer: string;
  optionDefinitions: readonly OptionDefinition[];
  state: Readonly<Record<string, unknown>>;
  concept: string;
  strategy: string;
  steps: readonly string[];
  sourceAncestry: readonly string[];
}>): NumCp012Wave02Package {
  if (input.optionDefinitions.length !== 4) {
    throw new Error(`${input.prototypeId}: expected exactly four option definitions`);
  }
  if (new Set(input.optionDefinitions.map((option) => option.value)).size !== 4) {
    throw new Error(`${input.prototypeId}: duplicate option definitions`);
  }

  const optionRng = new Rng(input.seed * 49979687 + Number(input.prototypeId.slice(-3)));
  const options = Object.freeze(shuffle(input.optionDefinitions, optionRng).map((definition) => Object.freeze({
    value: definition.value,
    isCorrect: definition.value === input.canonicalAnswer,
    misconceptionId: definition.misconceptionId,
  } satisfies NumCp012Wave02Option)));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0) throw new Error(`${input.prototypeId}: canonical answer missing from options`);

  return Object.freeze({
    packageId: "NUM-002",
    checkpointId: "NUM-CP-012",
    temporaryPrototypeId: input.prototypeId,
    seed: input.seed,
    locale: "en-IN",
    difficulty: input.difficulty,
    answerSemantic: input.answerSemantic,
    representation: input.representation,
    stem: input.stem,
    options,
    correctIndex,
    canonicalAnswer: input.canonicalAnswer,
    verifierAnswer: input.verifierAnswer,
    hiddenState: Object.freeze({ ...input.state }),
    mathematicalFingerprint: fingerprint(input.prototypeId, input.state),
    explanation: Object.freeze({
      coreConcept: input.concept,
      strategy: input.strategy,
      steps: Object.freeze([...input.steps]),
      finalAnswer: input.canonicalAnswer,
    }),
    sourceAncestry: Object.freeze([...input.sourceAncestry]),
    prototypeAncestry: Object.freeze([input.prototypeId]),
    lifecycle,
  });
}

function powBig(base: bigint, exponent: number) {
  return base ** BigInt(exponent);
}

function floorKthRoot(value: bigint, k: number) {
  if (value < 0n) throw new Error("floorKthRoot expects a non-negative integer");
  if (value <= 1n) return value;
  let low = 0n;
  let high = 1n;
  while (powBig(high, k) <= value) high *= 2n;
  while (low + 1n < high) {
    const mid = (low + high) / 2n;
    if (powBig(mid, k) <= value) low = mid;
    else high = mid;
  }
  return low;
}

function exactSignedKthRoot(value: bigint, k: number): bigint | null {
  if (value < 0n) {
    if (k % 2 === 0) return null;
    const positiveRoot = floorKthRoot(-value, k);
    return powBig(positiveRoot, k) === -value ? -positiveRoot : null;
  }
  const root = floorKthRoot(value, k);
  return powBig(root, k) === value ? root : null;
}

function perfectPowerLabel(k: number) {
  if (k === 2) return "perfect square";
  if (k === 3) return "perfect cube";
  return `perfect ${k}th power`;
}

function rootLabel(k: number) {
  if (k === 2) return "square root";
  if (k === 3) return "cube root";
  return `${k}th root`;
}

function exhaustiveSignedRoot(value: bigint, k: number) {
  const magnitude = value < 0n ? -value : value;
  const bound = floorKthRoot(magnitude, k) + 1n;
  for (let candidate = -bound; candidate <= bound; candidate += 1n) {
    if (powBig(candidate, k) === value) return candidate;
  }
  return null;
}

function p009(seed: number): NumCp012Wave02Package {
  const rng = new Rng(seed * 127 + 9);
  const mode = seed % 4;
  let k: number;
  let value: bigint;
  let canonical: string;
  let optionDefinitions: readonly OptionDefinition[];
  let representation: string;

  if (mode === 0) {
    k = rng.pick([2, 3, 4] as const);
    value = 0n;
    canonical = "0";
    representation = "ZERO_EXACT_POWER";
    optionDefinitions = [
      { value: "0", misconceptionId: "CORRECT" },
      { value: "1", misconceptionId: "CONFUSE_ZERO_WITH_ONE_BOUNDARY" },
      { value: "NO_INTEGER_ROOT", misconceptionId: "REJECT_ZERO_AS_PERFECT_POWER" },
      { value: String(k), misconceptionId: "RETURN_POWER_INDEX" },
    ];
  } else if (mode === 1) {
    k = rng.pick([2, 3, 4] as const);
    value = 1n;
    canonical = "1";
    representation = "ONE_EXACT_POWER";
    optionDefinitions = [
      { value: "1", misconceptionId: "CORRECT" },
      { value: "0", misconceptionId: "CONFUSE_ONE_WITH_ZERO_BOUNDARY" },
      { value: "NO_INTEGER_ROOT", misconceptionId: "REJECT_ONE_AS_PERFECT_POWER" },
      { value: String(k), misconceptionId: "RETURN_POWER_INDEX" },
    ].filter((option, index, values) => values.findIndex((candidate) => candidate.value === option.value) === index);
    if (optionDefinitions.length < 4) {
      optionDefinitions = [...optionDefinitions, { value: String(k + 1), misconceptionId: "RETURN_NEARBY_INDEX" }];
    }
  } else if (mode === 2) {
    k = 3;
    const root = -BigInt(rng.int(2, 11));
    value = powBig(root, k);
    canonical = root.toString();
    representation = "NEGATIVE_ODD_EXACT_POWER";
    optionDefinitions = [
      { value: canonical, misconceptionId: "CORRECT" },
      { value: (-root).toString(), misconceptionId: "DROP_NEGATIVE_SIGN" },
      { value: (root - 1n).toString(), misconceptionId: "ROOT_ONE_TOO_SMALL" },
      { value: "NO_INTEGER_ROOT", misconceptionId: "REJECT_NEGATIVE_ODD_POWER" },
    ];
  } else {
    k = rng.pick([2, 4] as const);
    const rootMagnitude = BigInt(rng.int(2, 9));
    value = -powBig(rootMagnitude, k);
    canonical = "NO_INTEGER_ROOT";
    representation = "NEGATIVE_EVEN_NO_INTEGER_ROOT";
    optionDefinitions = [
      { value: canonical, misconceptionId: "CORRECT" },
      { value: rootMagnitude.toString(), misconceptionId: "IGNORE_NEGATIVE_TARGET" },
      { value: (-rootMagnitude).toString(), misconceptionId: "ASSUME_NEGATIVE_EVEN_ROOT" },
      { value: "0", misconceptionId: "COLLAPSE_NON_EXISTENCE_TO_ZERO" },
    ];
  }

  const verifiedRoot = exhaustiveSignedRoot(value, k);
  const verifier = verifiedRoot === null ? "NO_INTEGER_ROOT" : verifiedRoot.toString();

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-009",
    seed,
    difficulty: mode >= 2 ? "MEDIUM" : "EASY",
    answerSemantic: "INTEGER_ROOT_OR_NO_INTEGER_ROOT",
    representation,
    stem: `Find the exact integer ${rootLabel(k)} of ${value}, or choose NO_INTEGER_ROOT if no such integer exists.`,
    canonicalAnswer: canonical,
    verifierAnswer: verifier,
    optionDefinitions,
    state: { mode, k, value: value.toString() },
    concept: `An integer ${k}th root must reproduce the target exactly. Zero and one are exact powers; a negative target has an integer root only when the power index is odd.`,
    strategy: "Respect the integer domain before calculating: handle zero and one directly, keep the negative sign for odd powers, and reject negative targets for even powers.",
    steps: [
      `The target is ${value} and the declared power index is ${k}.`,
      canonical === "NO_INTEGER_ROOT"
        ? `No integer raised to the even power ${k} can be negative, so there is no integer ${rootLabel(k)}.`
        : `${canonical}^${k} = ${value}, so the exact integer root is ${canonical}.`,
    ],
    sourceAncestry: ["DESIGN:ZERO_ONE_NEGATIVE_PERFECT_POWER", "SOURCE_GAP:SIGNED_EXACT_ROOT"],
  });
}

function p010(seed: number): NumCp012Wave02Package {
  const rng = new Rng(seed * 131 + 10);
  const k = rng.pick([2, 3, 4] as const);
  const direction = seed % 2 === 0 ? "AT_MOST" : "AT_LEAST";
  const root = BigInt(rng.int(2, k === 4 ? 8 : 15));
  const lower = powBig(root, k);
  const upper = powBig(root + 1n, k);
  const exactBoundary = seed % 5 === 0;
  const gap = upper - lower;
  const offset = exactBoundary ? 0n : BigInt(rng.int(1, Number(gap - 1n)));
  const bound = lower + offset;

  const floorRoot = floorKthRoot(bound, k);
  const canonicalValue = direction === "AT_MOST"
    ? powBig(floorRoot, k)
    : powBig(powBig(floorRoot, k) === bound ? floorRoot : floorRoot + 1n, k);

  let verifierValue = bound;
  if (direction === "AT_MOST") {
    while (verifierValue >= 0n && exactSignedKthRoot(verifierValue, k) === null) verifierValue -= 1n;
  } else {
    while (exactSignedKthRoot(verifierValue, k) === null) verifierValue += 1n;
  }

  const otherBoundary = canonicalValue === lower ? upper : lower;
  return packageFrom({
    prototypeId: "NUM-CP012-PROT-010",
    seed,
    difficulty: k === 4 ? "MEDIUM" : "EASY",
    answerSemantic: "PERFECT_POWER_BOUND_VALUE",
    representation: direction === "AT_MOST" ? "GREATEST_POWER_NOT_EXCEEDING_BOUND" : "LEAST_POWER_NOT_BELOW_BOUND",
    stem: direction === "AT_MOST"
      ? `What is the greatest ${perfectPowerLabel(k)} not exceeding ${bound}?`
      : `What is the least ${perfectPowerLabel(k)} that is at least ${bound}?`,
    canonicalAnswer: canonicalValue.toString(),
    verifierAnswer: verifierValue.toString(),
    optionDefinitions: numericOptions(canonicalValue, [
      { value: otherBoundary, misconceptionId: "CHOOSE_WRONG_BOUNDARY_DIRECTION" },
      { value: floorRoot, misconceptionId: "RETURN_ROOT_INSTEAD_OF_POWER" },
      { value: bound, misconceptionId: "RETURN_BOUND_WITHOUT_POWER_CHECK" },
    ]),
    state: { k, direction, root: root.toString(), lower: lower.toString(), upper: upper.toString(), bound: bound.toString(), exactBoundary },
    concept: "A perfect-power bound question asks for the power value itself. Locate the adjacent exact integer powers on the permitted side of the declared bound.",
    strategy: `Use the integer ${rootLabel(k)} boundary to identify the ${direction === "AT_MOST" ? "largest allowed power at or below" : "smallest allowed power at or above"} the bound, then return that power rather than its root.`,
    steps: [
      `The consecutive surrounding ${k}th powers are ${lower} and ${upper}.`,
      `${canonicalValue} is the required boundary value in the declared direction.`,
    ],
    sourceAncestry: ["DESIGN:PERFECT_POWER_BOUND_PROJECTION", "SOURCE_GAP:LEAST_GREATEST_POWER_UNDER_BOUND"],
  });
}

function p011(seed: number): NumCp012Wave02Package {
  const rng = new Rng(seed * 137 + 11);
  const k = rng.pick([2, 3, 4] as const);
  const root = BigInt(rng.int(2, k === 4 ? 8 : 13));
  const lower = powBig(root, k);
  const upper = powBig(root + 1n, k);
  const gap = upper - lower;
  const third = gap / 3n;
  const offset = seed % 2 === 0 ? (third > 0n ? third : 1n) : gap - (third > 0n ? third : 1n);
  const value = lower + offset;
  const lowerDistance = value - lower;
  const upperDistance = upper - value;
  if (lowerDistance === upperDistance) throw new Error("Integer nearest-power fixture unexpectedly produced a tie");
  const canonicalValue = lowerDistance < upperDistance ? lower : upper;

  let verifierValue = 0n;
  let verifierDistance: bigint | null = null;
  const maxRoot = floorKthRoot(upper, k) + 1n;
  for (let candidateRoot = 0n; candidateRoot <= maxRoot; candidateRoot += 1n) {
    const candidate = powBig(candidateRoot, k);
    const distance = candidate >= value ? candidate - value : value - candidate;
    if (verifierDistance === null || distance < verifierDistance) {
      verifierDistance = distance;
      verifierValue = candidate;
    }
  }

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-011",
    seed,
    difficulty: k === 4 ? "MEDIUM" : "EASY",
    answerSemantic: "NEAREST_PERFECT_POWER_VALUE",
    representation: canonicalValue === lower ? "NEAREST_LOWER_POWER" : "NEAREST_UPPER_POWER",
    stem: `Which ${perfectPowerLabel(k)} is nearest to ${value}?`,
    canonicalAnswer: canonicalValue.toString(),
    verifierAnswer: verifierValue.toString(),
    optionDefinitions: numericOptions(canonicalValue, [
      { value: canonicalValue === lower ? upper : lower, misconceptionId: "CHOOSE_FARTHER_ADJACENT_POWER" },
      { value, misconceptionId: "RETURN_ORIGINAL_VALUE" },
      { value: canonicalValue === lower ? root : root + 1n, misconceptionId: "RETURN_ROOT_INSTEAD_OF_POWER" },
    ]),
    state: { k, root: root.toString(), lower: lower.toString(), upper: upper.toString(), gap: gap.toString(), value: value.toString(), lowerDistance: lowerDistance.toString(), upperDistance: upperDistance.toString() },
    concept: "The nearest perfect power is found by comparing distances to the two consecutive exact powers surrounding the integer; for integer powers, their gap is odd, so an integer midpoint tie cannot occur.",
    strategy: "Locate the lower and upper consecutive perfect powers, subtract the query value from each boundary in the correct direction, and select the smaller distance.",
    steps: [
      `The surrounding exact powers are ${lower} and ${upper}; their distances from ${value} are ${lowerDistance} and ${upperDistance}.`,
      `${canonicalValue} has the smaller distance, so it is the nearest ${perfectPowerLabel(k)}.`,
    ],
    sourceAncestry: ["DESIGN:NEAREST_PERFECT_POWER", "SOURCE_GAP:NEAREST_POWER_NO_INTEGER_TIE"],
  });
}

function completionFactors(seed: number, k: number) {
  const rng = new Rng(seed);
  const alreadyPerfect = seed % 5 === 0;
  return ([2n, 3n, 5n] as const).map((prime, index) => {
    const quotient = rng.int(1, 2);
    const residue = alreadyPerfect ? 0 : index === 0 ? rng.int(1, k - 1) : rng.int(0, k - 1);
    return [prime, quotient * k + residue] as const;
  });
}

function productFromFactors(factors: readonly (readonly [bigint, number])[]) {
  return factors.reduce((product, [prime, exponent]) => product * powBig(prime, exponent), 1n);
}

function p012(seed: number): NumCp012Wave02Package {
  const rng = new Rng(seed * 139 + 12);
  const k = rng.pick([2, 3] as const);
  const factors = completionFactors(seed * 149 + k, k);
  const value = productFromFactors(factors);
  const multiplierFactors = factors
    .map(([prime, exponent]) => [prime, (k - exponent % k) % k] as const)
    .filter(([, exponent]) => exponent > 0);
  const multiplier = productFromFactors(multiplierFactors);
  const canonicalValue = value * multiplier;

  let verifierMultiplier = 1n;
  while (exactSignedKthRoot(value * verifierMultiplier, k) === null) verifierMultiplier += 1n;
  const verifierValue = value * verifierMultiplier;
  const completedRoot = exactSignedKthRoot(canonicalValue, k);
  if (completedRoot === null) throw new Error("Least-multiple completion did not produce an exact power");

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-012",
    seed,
    difficulty: k === 3 ? "MEDIUM" : "EASY",
    answerSemantic: "LEAST_PERFECT_POWER_MULTIPLE_VALUE",
    representation: "COMPLETED_MULTIPLE_PROJECTION",
    stem: `What is the least multiple of ${value} that is a ${perfectPowerLabel(k)}?`,
    canonicalAnswer: canonicalValue.toString(),
    verifierAnswer: verifierValue.toString(),
    optionDefinitions: numericOptions(canonicalValue, [
      { value: multiplier, misconceptionId: "RETURN_MULTIPLIER_INSTEAD_OF_MULTIPLE" },
      { value: completedRoot, misconceptionId: "RETURN_ROOT_INSTEAD_OF_MULTIPLE" },
      { value, misconceptionId: "KEEP_ORIGINAL_WITHOUT_COMPLETION" },
    ]),
    state: { k, factors, value: value.toString(), multiplier: multiplier.toString(), canonicalValue: canonicalValue.toString() },
    concept: `The least ${perfectPowerLabel(k)} multiple uses the same missing prime-exponent completion as a least-multiplier problem, but the requested answer is the completed multiple itself.`,
    strategy: `Complete every prime exponent to a multiple of ${k}, multiply the original number by only those missing factors, and return the resulting perfect-power value rather than the multiplier.`,
    steps: [
      `The least completion multiplier is ${multiplier}.`,
      `${value} × ${multiplier} = ${canonicalValue}, and this completed value is an exact ${k}th power.`,
    ],
    sourceAncestry: ["DESIGN:LEAST_PERFECT_POWER_MULTIPLE", "V2:ns_least_square_multiple", "V2:ns_least_cube_multiple"],
  });
}

const SQUARE_IMPOSSIBLE_UNIT_DIGITS = [2, 3, 7, 8] as const;
const SQUARE_POSSIBLE_UNIT_DIGITS = [0, 1, 4, 5, 6, 9] as const;
const CUBE_IMPOSSIBLE_LAST_TWO = [2, 5, 6, 10, 14, 15, 18, 20, 22, 26, 30, 34, 35, 38, 40, 42, 45, 46, 50, 54, 55, 58, 60, 62, 65, 66, 70, 74, 78, 80, 82, 85, 86, 90, 94, 95, 98] as const;
const CUBE_POSSIBLE_LAST_TWO = [0, 1, 3, 4, 7, 8, 9, 11, 12, 13, 16, 17] as const;

function formatResidue(value: number, modulus: number) {
  return modulus === 100 ? value.toString().padStart(2, "0") : value.toString();
}

function p013(seed: number): NumCp012Wave02Package {
  const rng = new Rng(seed * 151 + 13);
  const squareMode = seed % 2 === 0;
  const k = squareMode ? 2 : 3;
  const modulus = squareMode ? 10 : 100;
  const impossible = squareMode ? SQUARE_IMPOSSIBLE_UNIT_DIGITS : CUBE_IMPOSSIBLE_LAST_TWO;
  const possible = squareMode ? SQUARE_POSSIBLE_UNIT_DIGITS : CUBE_POSSIBLE_LAST_TWO;
  const correctResidue = rng.pick(impossible);
  const distractorResidues = [rng.pick(possible), rng.pick(possible), rng.pick(possible)] as number[];
  while (new Set(distractorResidues).size < 3) {
    distractorResidues[2] = rng.pick(possible);
    if (distractorResidues[2] === distractorResidues[0] || distractorResidues[2] === distractorResidues[1]) {
      distractorResidues[1] = rng.pick(possible);
    }
  }
  const correct = formatResidue(correctResidue, modulus);
  const optionDefinitions: OptionDefinition[] = [
    { value: correct, misconceptionId: "CORRECT" },
    ...distractorResidues.map((value) => ({ value: formatResidue(value, modulus), misconceptionId: "REACHABLE_TERMINAL_RESIDUE" })),
  ];

  const reachable = new Set<number>();
  for (let base = 0; base < modulus; base += 1) reachable.add(Number(powBig(BigInt(base), k) % BigInt(modulus)));
  const verifierCandidates = optionDefinitions.filter((option) => !reachable.has(Number(option.value)));
  if (verifierCandidates.length !== 1) throw new Error("Terminal-compatibility fixture must have exactly one impossible option");

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-013",
    seed,
    difficulty: squareMode ? "EASY" : "MEDIUM",
    answerSemantic: "IMPOSSIBLE_PERFECT_POWER_TERMINAL_PATTERN",
    representation: squareMode ? "SQUARE_UNIT_DIGIT_REJECTION" : "CUBE_LAST_TWO_DIGIT_REJECTION",
    stem: squareMode
      ? "Which of the following cannot be the unit digit of a perfect square?"
      : "Which of the following two-digit endings cannot occur at the end of a perfect cube?",
    canonicalAnswer: correct,
    verifierAnswer: verifierCandidates[0]!.value,
    optionDefinitions,
    state: { k, modulus, correctResidue, distractorResidues, reachableCount: reachable.size },
    concept: `Terminal residues can reject an impossible ${perfectPowerLabel(k)} pattern, but a compatible ending alone never proves that a particular integer is an exact perfect power.`,
    strategy: `Compare the offered ending with the residues actually reached by integer ${k}th powers modulo ${modulus}; select only the ending outside that reachable set.`,
    steps: [
      `Integer ${k}th powers occupy a restricted set of residues modulo ${modulus}.`,
      `${correct} is not in that reachable residue set, while each other option is reachable, so ${correct} is impossible.`,
    ],
    sourceAncestry: ["DESIGN:TERMINAL_COMPATIBILITY_REJECTION", "OWNERSHIP:CP009_TERMINAL_OUTPUT_EXCLUDED"],
  });
}

function classifySolutionCount(count: number) {
  if (count === 0) return "NO_SOLUTION";
  if (count === 1) return "ONE_SOLUTION";
  return "MULTIPLE_SOLUTIONS";
}

function p014(seed: number): NumCp012Wave02Package {
  const rng = new Rng(seed * 157 + 14);
  const k = rng.pick([2, 3, 4] as const);
  const desiredClass = seed % 3;
  const block = rng.int(2, 5);
  const target = block * k;
  let low: number;
  let high: number;

  if (desiredClass === 0) {
    low = target + 1;
    high = target + k - 1;
  } else if (desiredClass === 1) {
    low = target - (k - 1);
    high = target + (k - 1);
  } else {
    low = target;
    high = target + k;
  }

  const prime = rng.pick([2n, 3n, 5n] as const);
  const fixedPrime = prime === 2n ? 3n : 2n;
  const fixedExponent = k * rng.int(1, 3);
  const arithmeticValid: number[] = [];
  for (let x = low; x <= high; x += 1) if (x % k === 0) arithmeticValid.push(x);
  const canonical = classifySolutionCount(arithmeticValid.length);

  const verifierValid: number[] = [];
  for (let x = low; x <= high; x += 1) {
    const value = powBig(fixedPrime, fixedExponent) * powBig(prime, x);
    if (exactSignedKthRoot(value, k) !== null) verifierValid.push(x);
  }
  const verifier = classifySolutionCount(verifierValid.length);

  const optionDefinitions: readonly OptionDefinition[] = [
    { value: "NO_SOLUTION", misconceptionId: canonical === "NO_SOLUTION" ? "CORRECT" : "ASSUME_NO_VALID_EXPONENT" },
    { value: "ONE_SOLUTION", misconceptionId: canonical === "ONE_SOLUTION" ? "CORRECT" : "ASSUME_UNIQUE_EXPONENT" },
    { value: "MULTIPLE_SOLUTIONS", misconceptionId: canonical === "MULTIPLE_SOLUTIONS" ? "CORRECT" : "MISS_ADDITIONAL_VALID_EXPONENT" },
    { value: "ALL_VALUES", misconceptionId: "IGNORE_DIVISIBILITY_OF_EXPONENT" },
  ];

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-014",
    seed,
    difficulty: "HARD",
    answerSemantic: "BOUNDED_EXPONENT_SOLUTION_CLASS",
    representation: "NONE_ONE_MULTIPLE_CLASSIFICATION",
    stem: `For how many solution classes does x make ${fixedPrime}^${fixedExponent} × ${prime}^x a ${perfectPowerLabel(k)} when ${low} ≤ x ≤ ${high}? Choose NO_SOLUTION, ONE_SOLUTION or MULTIPLE_SOLUTIONS.`,
    canonicalAnswer: canonical,
    verifierAnswer: verifier,
    optionDefinitions,
    state: { k, fixedPrime: fixedPrime.toString(), fixedExponent, prime: prime.toString(), low, high, arithmeticValid, verifierValid },
    concept: `The fixed prime exponent already satisfies the ${k}-divisibility rule, so the number of valid states is determined by how many exponents x in the declared interval are multiples of ${k}.`,
    strategy: `Enumerate the bounded exponent interval completely, retain only values that make every prime exponent divisible by ${k}, then classify the result as none, one or multiple rather than selecting an arbitrary x.`,
    steps: [
      `The admissible exponent values are ${arithmeticValid.length === 0 ? "none" : arithmeticValid.join(", ")}.`,
      `That gives ${arithmeticValid.length} valid value(s), so the solution class is ${canonical}.`,
    ],
    sourceAncestry: ["DESIGN:INVERSE_SOLUTION_TOPOLOGY", "V2:ns_hidden_exponent_reconstruction", "SOURCE_GAP:NONE_ONE_MULTIPLE"],
  });
}

export function generateNumCp012Wave02(
  prototypeId: NumCp012Wave02PrototypeId,
  seed: number,
): NumCp012Wave02Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error("Wave 02 seed must be a positive safe integer");
  switch (prototypeId) {
    case "NUM-CP012-PROT-009": return p009(seed);
    case "NUM-CP012-PROT-010": return p010(seed);
    case "NUM-CP012-PROT-011": return p011(seed);
    case "NUM-CP012-PROT-012": return p012(seed);
    case "NUM-CP012-PROT-013": return p013(seed);
    case "NUM-CP012-PROT-014": return p014(seed);
    default: throw new Error(`Unsupported NUM-CP-012 Wave 02 prototype: ${prototypeId satisfies never}`);
  }
}
