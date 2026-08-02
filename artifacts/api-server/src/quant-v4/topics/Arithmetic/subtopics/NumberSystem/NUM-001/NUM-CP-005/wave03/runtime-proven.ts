import type {
  NumCp005Difficulty,
  NumCp005Explanation,
  NumCp005Option,
  NumCp005PrimePower,
} from "../wave01/types";
import { generateNumCp005Wave03Package as generateBasePackage } from "./runtime";
import {
  NUM_CP005_WAVE03_PROTOTYPE_IDS,
  type NumCp005Wave03Package,
  type NumCp005Wave03PrototypeId,
} from "./types";

const SPECIAL_IDS = new Set<NumCp005Wave03PrototypeId>([
  "NUM-CP005-PROT-017",
  "NUM-CP005-PROT-018",
  "NUM-CP005-PROT-019",
  "NUM-CP005-PROT-020",
  "NUM-CP005-PROT-021",
]);
const PRIME_POOL = [2, 3, 5, 7] as const;
const LIFECYCLE = Object.freeze({
  permanentQlId: null,
  maturity: "EXECUTABLE_DISCOVERY_PROOF" as const,
  reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

class Rng {
  private state: number;
  constructor(text: string) {
    let state = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      state ^= text.charCodeAt(index);
      state = Math.imul(state, 16777619);
    }
    this.state = state >>> 0 || 0x9e3779b9;
  }
  next(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state;
  }
  int(minimum: number, maximum: number): number {
    return minimum + (this.next() % (maximum - minimum + 1));
  }
  pick<T>(values: readonly T[]): T {
    return values[this.next() % values.length]!;
  }
}

function difficulty(seed: number): NumCp005Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!;
}

function indexOf(prototypeId: NumCp005Wave03PrototypeId): number {
  return NUM_CP005_WAVE03_PROTOTYPE_IDS.indexOf(prototypeId);
}

function factorText(factors: readonly NumCp005PrimePower[]): string {
  return factors.map(({ prime, exponent }) =>
    exponent === 1 ? `${prime}` : `${prime}^${exponent}`).join(" × ");
}

function numberFromFactors(factors: readonly NumCp005PrimePower[]): bigint {
  return factors.reduce(
    (value, factor) => value * BigInt(factor.prime) ** BigInt(factor.exponent),
    1n,
  );
}

function enumerateFromFactors(factors: readonly NumCp005PrimePower[]): bigint[] {
  let divisors = [1n];
  for (const factor of factors) {
    const additions: bigint[] = [];
    let power = 1n;
    for (let exponent = 1; exponent <= factor.exponent; exponent += 1) {
      power *= BigInt(factor.prime);
      for (const divisor of divisors) additions.push(divisor * power);
    }
    divisors = [...divisors, ...additions];
  }
  return divisors.sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
}

function enumerateByPairs(n: bigint): bigint[] {
  const low: bigint[] = [];
  const high: bigint[] = [];
  for (let divisor = 1n; divisor * divisor <= n; divisor += 1n) {
    if (n % divisor !== 0n) continue;
    low.push(divisor);
    const partner = n / divisor;
    if (partner !== divisor) high.push(partner);
  }
  high.reverse();
  return [...low, ...high];
}

function makeFactors(
  prototypeId: NumCp005Wave03PrototypeId,
  seed: number,
  band: NumCp005Difficulty,
  rng: Rng,
): readonly NumCp005PrimePower[] {
  const count = band === "HARD" ? 3 : 2;
  const selected: number[] = [];
  if ((seed + indexOf(prototypeId)) % 2 === 0) selected.push(2);
  while (selected.length < count) {
    const prime = rng.pick(PRIME_POOL);
    if (!selected.includes(prime)) selected.push(prime);
  }
  selected.sort((left, right) => left - right);
  return Object.freeze(selected.map((prime) => Object.freeze({
    prime,
    exponent: band === "EASY" ? rng.int(1, 2) : rng.int(2, 3),
  })));
}

function requirementValue(requirements: readonly NumCp005PrimePower[]): bigint {
  return requirements.reduce(
    (value, requirement) => value * BigInt(requirement.prime) ** BigInt(requirement.exponent),
    1n,
  );
}

function requirementText(requirements: readonly NumCp005PrimePower[]): string {
  return factorText(requirements.filter((requirement) => requirement.exponent > 0));
}

function countDivisible(
  factors: readonly NumCp005PrimePower[],
  requirements: readonly NumCp005PrimePower[],
): number {
  return factors.reduce((count, factor) => {
    const minimum = requirements.find((entry) => entry.prime === factor.prime)?.exponent ?? 0;
    return minimum > factor.exponent ? 0 : count * (factor.exponent - minimum + 1);
  }, 1);
}

function requirementMaximum(
  first: readonly NumCp005PrimePower[],
  second: readonly NumCp005PrimePower[],
): readonly NumCp005PrimePower[] {
  return Object.freeze(first.map((entry) => Object.freeze({
    prime: entry.prime,
    exponent: Math.max(
      entry.exponent,
      second.find((candidate) => candidate.prime === entry.prime)?.exponent ?? 0,
    ),
  })));
}

function twoRequirements(
  factors: readonly NumCp005PrimePower[],
  rng: Rng,
) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const first = factors.map((factor) => ({ prime: factor.prime, exponent: rng.int(0, factor.exponent) }));
    const second = factors.map((factor) => ({ prime: factor.prime, exponent: rng.int(0, factor.exponent) }));
    if (first.every((entry) => entry.exponent === 0)) first[0]!.exponent = 1;
    if (second.every((entry) => entry.exponent === 0)) second[second.length - 1]!.exponent = 1;
    const frozenFirst = Object.freeze(first.map((entry) => Object.freeze(entry)));
    const frozenSecond = Object.freeze(second.map((entry) => Object.freeze(entry)));
    const both = requirementMaximum(frozenFirst, frozenSecond);
    const count = countDivisible(factors, frozenFirst) - countDivisible(factors, both);
    if (count > 0 && requirementValue(frozenFirst) !== requirementValue(frozenSecond)) {
      return { first: frozenFirst, second: frozenSecond, both, count };
    }
  }
  throw new Error("Unable to construct proven two-condition divisor state.");
}

function totalCount(factors: readonly NumCp005PrimePower[]): bigint {
  return BigInt(factors.reduce((count, factor) => count * (factor.exponent + 1), 1));
}

function oddCount(factors: readonly NumCp005PrimePower[]): bigint {
  return BigInt(factors.reduce(
    (count, factor) => count * (factor.prime === 2 ? 1 : factor.exponent + 1),
    1,
  ));
}

function squareCount(factors: readonly NumCp005PrimePower[]): bigint {
  return BigInt(factors.reduce(
    (count, factor) => count * (Math.floor(factor.exponent / 2) + 1),
    1,
  ));
}

function divisorSum(factors: readonly NumCp005PrimePower[]): bigint {
  return factors.reduce((product, factor) => {
    let local = 0n;
    let power = 1n;
    for (let exponent = 0; exponent <= factor.exponent; exponent += 1) {
      local += power;
      power *= BigInt(factor.prime);
    }
    return product * local;
  }, 1n);
}

function numericOptions(answer: bigint, correctIndex: number): readonly NumCp005Option[] {
  const candidates = [answer + 1n, answer > 0n ? answer - 1n : 2n, answer + 2n, answer * 2n, answer + 3n];
  const wrongs: bigint[] = [];
  for (const candidate of candidates) {
    if (candidate >= 0n && candidate !== answer && !wrongs.includes(candidate)) wrongs.push(candidate);
    if (wrongs.length === 3) break;
  }
  const traps = [
    ["NUM-CP005-TRAP-CONDITION-LOSS", "This ignores one of the displayed divisor conditions."],
    ["NUM-CP005-TRAP-ORDER-BOUNDARY", "This misreads the bound, rank, or divisor-pair boundary."],
    ["NUM-CP005-TRAP-RELATED-VALUE", "This is a nearby or related divisor value, not the requested result."],
  ] as const;
  let wrongIndex = 0;
  return Object.freeze(Array.from({ length: 4 }, (_unused, index) => {
    if (index === correctIndex) {
      return Object.freeze({
        value: answer.toString(),
        isCorrect: true,
        misconceptionId: null,
        analysis: "This matches the exponent construction and independent factor-pair verifier.",
      });
    }
    const trap = traps[wrongIndex]!;
    const option = Object.freeze({
      value: wrongs[wrongIndex]!.toString(),
      isCorrect: false,
      misconceptionId: trap[0],
      analysis: trap[1],
    });
    wrongIndex += 1;
    return option;
  }));
}

function claimOptions(answer: "True" | "False", correctIndex: number): readonly NumCp005Option[] {
  const values = [answer, ...["True", "False", "Cannot be determined", "True only when n is prime"]
    .filter((value) => value !== answer)];
  return Object.freeze(Array.from({ length: 4 }, (_unused, index) => {
    const value = values[(index - correctIndex + 4) % 4]!;
    const isCorrect = index === correctIndex;
    return Object.freeze({
      value,
      isCorrect,
      misconceptionId: isCorrect ? null
        : value === "Cannot be determined" ? "NUM-CP005-TRAP-CLAIM-UNRESOLVED"
          : value === "True only when n is prime" ? "NUM-CP005-TRAP-IRRELEVANT-PRIMALITY"
            : "NUM-CP005-TRAP-CLAIM-POLARITY",
      analysis: isCorrect
        ? "The claim has the verified truth value."
        : value === "Cannot be determined"
          ? "The prime factorisation determines this property exactly."
          : value === "True only when n is prime"
            ? "Primality is not the governing condition for this claim."
            : "This reverses the independently verified truth value.",
    });
  }));
}

function explanation(
  prototypeId: NumCp005Wave03PrototypeId,
  answer: string,
  state: Readonly<Record<string, unknown>>,
): NumCp005Explanation {
  let concept = "The divisor structure is controlled by the prime exponents.";
  let strategy = "Apply the displayed restriction and verify from factor pairs.";
  let steps: string[] = [];
  let speed = "Use exponent restrictions before constructing the divisor list.";

  if (prototypeId === "NUM-CP005-PROT-017") {
    steps = [
      `Divisible by k1: ${String(state.divisibleByFirst)} divisors.`,
      `Divisible by both k1 and k2: ${String(state.divisibleByBoth)} divisors.`,
      `Subtract to obtain ${answer}.`,
    ];
    speed = "A but not B = count(A) - count(A and B).";
  } else if (prototypeId === "NUM-CP005-PROT-018") {
    steps = [
      `Order the divisors of n = ${String(state.integerValue)}.`,
      `Keep only values not exceeding ${String(state.bound)}.`,
      `The greatest remaining value is ${answer}.`,
    ];
    speed = "Check the divisor pair closest to the bound.";
  } else if (prototypeId === "NUM-CP005-PROT-019") {
    steps = [
      `There are ${String(state.divisorCount)} positive divisors.`,
      `Use one-based position ${String(state.requestedIndex)} in ascending order.`,
      `The requested divisor is ${answer}.`,
    ];
    speed = "Build factor pairs from both ends and stop at the required rank.";
  } else if (prototypeId === "NUM-CP005-PROT-020") {
    concept = "A divisor claim is true only when the claimed and exact property values agree.";
    steps = [
      `Exact ${String(state.propertyLabel)} value: ${String(state.actualValue)}.`,
      `Claimed value: ${String(state.claimedValue)}.`,
      `The claim is ${answer}.`,
    ];
    speed = "Compute first, compare second.";
  } else {
    concept = "Every divisor pair has product n.";
    steps = [
      `Visible partner: ${String(state.visiblePartner)}; n = ${String(state.integerValue)}.`,
      `Missing entry = n ÷ visible partner = ${answer}.`,
      "The completed pair is present in the factor-pair inventory.",
    ];
    speed = "Divide n by the visible partner.";
  }

  return Object.freeze({
    coreConcept: concept,
    givenDataAndStrategy: strategy,
    stepByStep: Object.freeze(steps),
    examSpeedMethod: speed,
    commonTraps: Object.freeze([
      "Do not discard one of the stated conditions.",
      "Include both 1 and n and use one-based indexing.",
      "Do not confuse a nearby divisor with the requested bound, rank, or pair entry.",
    ]),
    finalAnswer: `The required result is ${answer}.`,
  });
}

function propertyLabel(kind: string): string {
  if (kind === "TOTAL_DIVISORS") return "positive-divisor count";
  if (kind === "ODD_DIVISORS") return "odd-divisor count";
  if (kind === "SQUARE_DIVISORS") return "square-divisor count";
  return "sum of positive divisors";
}

function generateSpecial(
  prototypeId: NumCp005Wave03PrototypeId,
  seed: number,
): NumCp005Wave03Package {
  const band = difficulty(seed);
  const rng = new Rng(`PROVEN:${prototypeId}:${seed}`);
  const correctIndex = (seed + indexOf(prototypeId)) % 4;
  const factors = makeFactors(prototypeId, seed, band, rng);
  const n = numberFromFactors(factors);
  const divisors = enumerateFromFactors(factors);
  const verifiedDivisors = enumerateByPairs(n);
  if (divisors.join(",") !== verifiedDivisors.join(",")) {
    throw new Error(`${prototypeId} seed ${seed}: divisor inventories differ.`);
  }

  let answer = "";
  let verifier = "";
  let stem = "";
  let state: Record<string, unknown> = {};
  let options: readonly NumCp005Option[];
  let semantic: NumCp005Wave03Package["answerSemantic"];
  let representation: NumCp005Wave03Package["representation"] = "DIRECT";

  if (prototypeId === "NUM-CP005-PROT-017") {
    const requirements = twoRequirements(factors, rng);
    const firstValue = requirementValue(requirements.first);
    const secondValue = requirementValue(requirements.second);
    const verified = verifiedDivisors.filter((divisor) =>
      divisor % firstValue === 0n && divisor % secondValue !== 0n).length;
    answer = requirements.count.toString();
    verifier = verified.toString();
    stem = `Let n = ${factorText(factors)}. How many positive divisors of n are divisible by k1 = ${requirementText(requirements.first)} but not divisible by k2 = ${requirementText(requirements.second)}?`;
    state = {
      integerValue: n.toString(),
      firstRequirement: requirementText(requirements.first),
      secondRequirement: requirementText(requirements.second),
      divisibleByFirst: countDivisible(factors, requirements.first),
      divisibleByBoth: countDivisible(factors, requirements.both),
    };
    options = numericOptions(BigInt(answer), correctIndex);
    semantic = "DIVISOR_COUNT";
  } else if (prototypeId === "NUM-CP005-PROT-018") {
    const candidateIndex = rng.int(0, divisors.length - 2);
    const selected = divisors[candidateIndex]!;
    const next = divisors[candidateIndex + 1]!;
    const gap = Number(next - selected - 1n);
    const bound = selected + BigInt(gap > 0 ? rng.int(0, gap) : 0);
    const canonical = [...divisors].reverse().find((divisor) => divisor <= bound)!;
    const verified = [...verifiedDivisors].reverse().find((divisor) => divisor <= bound)!;
    answer = canonical.toString();
    verifier = verified.toString();
    stem = `For n = ${factorText(factors)}, find the greatest positive divisor of n that does not exceed ${bound}.`;
    state = { integerValue: n.toString(), bound: bound.toString(), divisorCount: divisors.length };
    options = numericOptions(canonical, correctIndex);
    semantic = "DIVISOR_VALUE";
  } else if (prototypeId === "NUM-CP005-PROT-019") {
    const positionClass = (seed - 1) % 3;
    const requestedIndex = positionClass === 0 ? 1
      : positionClass === 1 ? Math.ceil(divisors.length / 2)
        : divisors.length;
    answer = divisors[requestedIndex - 1]!.toString();
    verifier = verifiedDivisors[requestedIndex - 1]!.toString();
    const suffix = requestedIndex % 10 === 1 && requestedIndex % 100 !== 11 ? "st"
      : requestedIndex % 10 === 2 && requestedIndex % 100 !== 12 ? "nd"
        : requestedIndex % 10 === 3 && requestedIndex % 100 !== 13 ? "rd" : "th";
    stem = `Arrange the positive divisors of n = ${factorText(factors)} in ascending order. What is the ${requestedIndex}${suffix} divisor?`;
    state = {
      integerValue: n.toString(),
      divisorCount: divisors.length,
      requestedIndex,
      positionClass: positionClass === 0 ? "FIRST" : positionClass === 1 ? "MIDDLE" : "LAST",
    };
    options = numericOptions(BigInt(answer), correctIndex);
    semantic = "DIVISOR_VALUE";
  } else if (prototypeId === "NUM-CP005-PROT-020") {
    const kinds = ["TOTAL_DIVISORS", "ODD_DIVISORS", "SQUARE_DIVISORS", "DIVISOR_SUM"] as const;
    const kind = kinds[(seed - 1) % kinds.length]!;
    const actual = kind === "TOTAL_DIVISORS" ? totalCount(factors)
      : kind === "ODD_DIVISORS" ? oddCount(factors)
        : kind === "SQUARE_DIVISORS" ? squareCount(factors)
          : divisorSum(factors);
    const verifiedActual = kind === "TOTAL_DIVISORS" ? BigInt(verifiedDivisors.length)
      : kind === "ODD_DIVISORS" ? BigInt(verifiedDivisors.filter((divisor) => divisor % 2n !== 0n).length)
        : kind === "SQUARE_DIVISORS" ? BigInt(verifiedDivisors.filter((divisor) => {
          for (let root = 1n; root * root <= divisor; root += 1n) {
            if (root * root === divisor) return true;
          }
          return false;
        }).length)
          : verifiedDivisors.reduce((sum, divisor) => sum + divisor, 0n);
    const claimed = seed % 2 === 0 ? actual : actual + BigInt(1 + (seed % 3));
    answer = actual === claimed ? "True" : "False";
    verifier = verifiedActual === claimed ? "True" : "False";
    stem = `For n = ${factorText(factors)}, consider the claim: “The ${propertyLabel(kind)} is ${claimed}.” Is the claim true?`;
    state = {
      integerValue: n.toString(),
      propertyKind: kind,
      propertyLabel: propertyLabel(kind),
      actualValue: actual.toString(),
      claimedValue: claimed.toString(),
      claimPolarity: answer,
    };
    options = claimOptions(answer as "True" | "False", correctIndex);
    semantic = "BOOLEAN_CLAIM";
    representation = "CLAIM";
  } else {
    const pairs = divisors
      .filter((divisor) => divisor <= n / divisor)
      .map((divisor) => [divisor, n / divisor] as const);
    const pairIndex = rng.int(0, pairs.length - 1);
    const pair = pairs[pairIndex]!;
    const blankLeft = seed % 2 === 0;
    const visible = blankLeft ? pair[1] : pair[0];
    const missing = blankLeft ? pair[0] : pair[1];
    answer = missing.toString();
    verifier = (n / visible).toString();
    const renderedRows = pairs.map(([left, right], rowIndex) =>
      rowIndex === pairIndex ? blankLeft ? `? × ${right}` : `${left} × ?` : `${left} × ${right}`);
    stem = `The following are divisor pairs of n = ${n}: ${renderedRows.join("; ")}. Find the missing entry.`;
    state = {
      integerValue: n.toString(),
      pairTable: renderedRows,
      pairIndex,
      blankSide: blankLeft ? "LEFT" : "RIGHT",
      visiblePartner: visible.toString(),
    };
    options = numericOptions(missing, correctIndex);
    semantic = "DIVISOR_VALUE";
    representation = "DIVISOR_PAIR_TABLE";
  }

  if (answer !== verifier) throw new Error(`${prototypeId} seed ${seed}: proven verifier mismatch.`);
  const frozenFactors = Object.freeze(factors.map((factor) => Object.freeze({ ...factor })));
  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty: band,
    answerSemantic: semantic,
    representation,
    stem,
    options: options!,
    correctIndex,
    canonicalAnswer: answer,
    verifierAnswer: verifier,
    hiddenState: Object.freeze({ factorState: frozenFactors, factorisation: factorText(factors), ...state }),
    mathematicalFingerprint: `${prototypeId}|${factorText(factors)}|${Object.entries(state)
      .filter(([key]) => key !== "pairTable")
      .map(([key, value]) => `${key}=${String(value)}`).join("|")}`,
    explanation: explanation(prototypeId, answer, state),
    sourceAncestry: Object.freeze([
      "NUM-CP005-WAVE01-DIVISOR-FOUNDATION",
      "NUM-CP005-WAVE02-AGGREGATE-INVERSE",
      "NUM-CP005-WAVE03-SOURCE-REPRESENTATION-DESIGN",
      "SSC-DIVISOR-SOURCE-REPRESENTATION-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId]),
    lifecycle: LIFECYCLE,
  });
}

export function generateNumCp005Wave03ProvenPackage(
  prototypeId: NumCp005Wave03PrototypeId,
  seed: number,
): NumCp005Wave03Package {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error("NUM-CP-005 Wave 03 seed must be a positive integer.");
  }
  return SPECIAL_IDS.has(prototypeId)
    ? generateSpecial(prototypeId, seed)
    : generateBasePackage(prototypeId, seed);
}

export function generateNumCp005Wave03ProvenSweep(
  seedsPerPrototype: number,
): readonly NumCp005Wave03Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("NUM-CP-005 Wave 03 sweep size must be a positive integer.");
  }
  return Object.freeze(NUM_CP005_WAVE03_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerPrototype }, (_unused, index) =>
      generateNumCp005Wave03ProvenPackage(prototypeId, index + 1)),
  ));
}
