import { fractionToString, gcd, simplifyFraction } from "./math";
import { getQuestionLanguageEntries } from "./library";
import { NS_FRACDEC_001_ARCHETYPE_ID, type FractionInput, type MixedFractionInput, type NsFracdec001CanonicalProblemId, type NsFracdec001DifficultyBand, type NsFracdec001Parameters, type RationalToken } from "./types";

export interface NsFracdec001ParameterInput {
  seed?: string;
  difficultyBand?: NsFracdec001DifficultyBand;
  questionLanguageId?: string;
  numerator?: number;
  denominator?: number;
  improper?: FractionInput;
  mixed?: MixedFractionInput;
  decimal?: string;
  recurringDecimal?: string;
  operands?: RationalToken[];
  operation?: string;
  rationalValues?: FractionInput[];
  targetType?: "HCF" | "LCM";
  fractions?: FractionInput[];
}

export function hashSeed(seed: string) {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function stableBucket(seed: string, modulo: number) {
  return modulo <= 0 ? 0 : hashSeed(seed) % modulo;
}

export function generateNsFracdec001Parameters(cpId: NsFracdec001CanonicalProblemId, input: NsFracdec001ParameterInput = {}): NsFracdec001Parameters {
  const seed = input.seed ?? `NS-FRACDEC-001:${cpId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficulty(seed);
  const questionLanguageId = input.questionLanguageId ?? selectQl(cpId, seed);
  const base = {
    archetypeId: NS_FRACDEC_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `NS-FRACDEC-001:${cpId}:${seed}`,
    difficultyBand,
    questionLanguageId,
    explanationId: `ES-${cpId.slice(-3)}`,
  };
  if (cpId === "CP-001") return { ...base, ...cp001(seed, input) };
  if (cpId === "CP-002") return { ...base, ...cp002(seed, questionLanguageId, input) };
  if (cpId === "CP-003") return { ...base, ...cp003(seed, input) };
  if (cpId === "CP-004") return { ...base, ...cp004(seed, questionLanguageId, input) };
  if (cpId === "CP-005") return { ...base, ...cp005(seed, input) };
  if (cpId === "CP-006") return { ...base, ...cp006(seed, input) };
  if (cpId === "CP-007") return { ...base, ...cp007(seed, input) };
  if (cpId === "CP-008") return { ...base, ...cp008(seed, input) };
  return { ...base, ...cp009(seed, input) };
}

function selectDifficulty(seed: string): NsFracdec001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectQl(cpId: NsFracdec001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(cpId);
  return entries[stableBucket(`${seed}:ql`, entries.length)].id;
}

function fractionPool(seed: string, index: number): FractionInput {
  const numerator = 2 + stableBucket(`${seed}:n:${index}`, 47);
  const denominator = 2 + stableBucket(`${seed}:d:${index}`, 23);
  return { numerator, denominator };
}

function cp001(seed: string, input: NsFracdec001ParameterInput) {
  const fixtures: FractionInput[] = [
    { numerator: 3, denominator: 8 },
    { numerator: 11, denominator: 6 },
    { numerator: 36, denominator: 48 },
    { numerator: 5, denominator: 7 },
  ];
  const chosen = input.numerator && input.denominator ? { numerator: input.numerator, denominator: input.denominator } : fixtures[stableBucket(`${seed}:fixture`, fixtures.length)];
  const simple = simplifyFraction(chosen);
  return {
    numerator: chosen.numerator,
    denominator: chosen.denominator,
    fraction: `${chosen.numerator}/${chosen.denominator}`,
    fractionType: chosen.numerator < chosen.denominator ? "properFraction" : "improperFraction",
    reductionStatus: gcd(chosen.numerator, chosen.denominator) > 1 ? "reducibleFraction" : "alreadySimplified",
    denominatorBand: denominatorBand(chosen.denominator),
    fractions: fractionToString(simple),
  };
}

function cp002(seed: string, questionLanguageId: string, input: NsFracdec001ParameterInput) {
  const mixedQl = new Set(["QL-014", "QL-015", "QL-016", "QL-018", "QL-020"]);
  const direction = mixedQl.has(questionLanguageId) ? "mixedToImproper" : "improperToMixed";
  if (input.improper || direction === "improperToMixed") {
    const improper = input.improper ?? { numerator: 17 + stableBucket(`${seed}:n`, 40), denominator: 3 + stableBucket(`${seed}:d`, 8) };
    return { direction: "improperToMixed" as const, improperFraction: `${improper.numerator}/${improper.denominator}`, conversionType: "improperToMixed", denominatorBand: denominatorBand(improper.denominator) };
  }
  const mixed = input.mixed ?? { whole: 1 + stableBucket(`${seed}:w`, 8), numerator: 1 + stableBucket(`${seed}:n`, 5), denominator: 6 + stableBucket(`${seed}:d`, 7) };
  return { direction: "mixedToImproper" as const, mixedFraction: `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`, conversionType: "mixedToImproper", denominatorBand: denominatorBand(mixed.denominator) };
}

function cp003(seed: string, input: NsFracdec001ParameterInput) {
  const operations = ["addition", "subtraction", "multiplication", "division", "mixedOperations"];
  const operation = input.operation ?? operations[stableBucket(`${seed}:op`, operations.length)];
  const operands = input.operands ?? Array.from({ length: operation === "mixedOperations" ? 4 : 2 + stableBucket(`${seed}:count`, 2) }, (_v, i) => fractionPool(seed, i));
  const expression = expressionFromOperands(operands, operation);
  return { operands, operation, expression, operationType: operation, operandCount: String(operands.length), expressionType: operands.some((item) => typeof item === "number") ? "decimal arithmetic" : "fraction arithmetic" };
}

function cp004(seed: string, qlId: string, input: NsFracdec001ParameterInput) {
  const count = qlId <= "QL-054" ? 2 : 3 + stableBucket(`${seed}:count`, 2);
  const values = input.rationalValues ?? Array.from({ length: count }, (_v, i) => simplifyFraction(fractionPool(seed, i)));
  const mode = qlId.includes("055") || qlId.includes("058") || qlId.includes("059") || qlId.includes("063") || qlId.includes("069") || qlId.includes("073") || qlId.includes("084") ? "ascendingOrder" : qlId.includes("056") || qlId.includes("060") || qlId.includes("064") || qlId.includes("070") || qlId.includes("085") ? "descendingOrder" : qlId.includes("052") || qlId.includes("054") || qlId.includes("062") || qlId.includes("068") || qlId.includes("077") || qlId.includes("082") ? "smallestSelection" : "largestSelection";
  return { rationalValues: values, values: values.map(fractionToString).join(", "), valueA: fractionToString(values[0]), valueB: fractionToString(values[1]), comparisonMode: count === 2 ? "pairComparison" : mode, valueCount: String(count) };
}

function cp005(seed: string, input: NsFracdec001ParameterInput) {
  const recurring = stableBucket(`${seed}:type`, 2) === 1;
  const fraction = input.fractions?.[0] ?? (recurring ? { numerator: 2 + stableBucket(`${seed}:n`, 7), denominator: 3 + stableBucket(`${seed}:d`, 6) * 3 } : { numerator: 1 + stableBucket(`${seed}:n`, 9), denominator: [2, 4, 5, 8, 10, 20][stableBucket(`${seed}:d`, 6)] });
  return { numerator: fraction.numerator, denominator: fraction.denominator, fraction: fractionToString(fraction), decimalType: recurring ? "recurringResult" : "terminatingResult", denominatorClass: recurring ? "otherPrimeFactors" : "only2And5" };
}

function cp006(seed: string, input: NsFracdec001ParameterInput) {
  const places = 1 + stableBucket(`${seed}:places`, 3);
  const decimal = input.decimal ?? (stableBucket(`${seed}:value`, 9 * 10 ** places) / 10 ** places + 0.1).toFixed(places);
  return { decimal, decimalPlaces: places === 1 ? "oneDecimalPlace" : places === 2 ? "twoDecimalPlaces" : "threeDecimalPlaces", reductionStatus: "reducibleFraction" };
}

function cp007(seed: string, input: NsFracdec001ParameterInput) {
  const multi = stableBucket(`${seed}:multi`, 2) === 1;
  const recurringDecimal = input.recurringDecimal ?? (multi ? `0.(${12 + stableBucket(`${seed}:r`, 87)})` : `0.(${1 + stableBucket(`${seed}:r`, 8)})`);
  return { recurringDecimal, repeatBlockLength: multi ? "multiDigitRecurring" : "singleDigitRecurring", decimalPattern: multi ? "multi-digit repeating block" : "single repeating digit" };
}

function cp008(seed: string, input: NsFracdec001ParameterInput) {
  const terminating = stableBucket(`${seed}:type`, 2) === 0;
  const fraction = input.fractions?.[0] ?? (terminating ? { numerator: 3 + stableBucket(`${seed}:n`, 9), denominator: [2, 4, 5, 8, 10, 20, 25][stableBucket(`${seed}:d`, 7)] } : { numerator: 2 + stableBucket(`${seed}:n`, 9), denominator: [3, 6, 7, 9, 11, 14][stableBucket(`${seed}:d`, 6)] });
  return { fraction: fractionToString(fraction), numerator: fraction.numerator, denominator: fraction.denominator, denominatorPrimeProfile: terminating ? "denominator factors only 2 and 5" : "denominator contains other prime factors", classification: terminating ? "terminatingDecimal" : "recurringDecimal" };
}

function cp009(seed: string, input: NsFracdec001ParameterInput) {
  const targetType = input.targetType ?? (stableBucket(`${seed}:target`, 2) === 0 ? "HCF" : "LCM");
  const fractions = input.fractions ?? [fractionPool(seed, 1), fractionPool(seed, 2), fractionPool(seed, 3)].map(simplifyFraction);
  return { targetType, rationalValues: fractions, fractions: fractions.map(fractionToString).join(", "), fractionCount: String(fractions.length) };
}

function denominatorBand(denominator: number) {
  if (denominator <= 5) return "small";
  if (denominator <= 12) return "medium";
  return "large";
}

function expressionFromOperands(operands: RationalToken[], operation: string) {
  const symbol = operation === "addition" ? " + " : operation === "subtraction" ? " - " : operation === "multiplication" ? " x " : operation === "division" ? " / " : " + ";
  if (operation === "mixedOperations") return `(${formatToken(operands[0])} + ${formatToken(operands[1])}) x ${formatToken(operands[2])} / ${formatToken(operands[3])}`;
  return operands.map(formatToken).join(symbol);
}

function formatToken(value: RationalToken) {
  return typeof value === "number" ? String(value) : fractionToString(value);
}
