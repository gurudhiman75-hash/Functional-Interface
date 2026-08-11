import {
  INT_CP003_EXACT_RATE_DEFINITIONS,
  INT_CP003_QL_IDS,
  amount,
  canonicalAnswer,
  compoundInterest,
  eq,
  factor,
  hash,
  mathematicalFingerprint,
  mathematicalStateEntries,
  pick,
  rat,
  verifyByRelation,
  yearlyInterest,
  type Cp003AnswerSemantic,
  type Cp003MathematicalState,
  type IntCp003QlId,
  type Rational,
} from "./cp003-math-authority";

export {
  INT_CP003_AUTHORITY_VERSION,
  INT_CP003_EXACT_RATE_DEFINITIONS,
  INT_CP003_EXACT_RATE_VALUES,
  INT_CP003_FINAL_REGISTRY,
  INT_CP003_LEGACY_FAMILIES,
  INT_CP003_QL_IDS,
  INT_CP003_SOLVER_VERSION,
  INT_CP003_VERIFIER_VERSION,
  add,
  amount,
  amountByRecurrence,
  canonicalAnswer,
  compoundInterest,
  div,
  eq,
  factor,
  getIntCp003RegistryEntry,
  hash,
  integer,
  mathematicalFingerprint,
  mul,
  pick,
  pow,
  rat,
  sub,
  verifyByRelation,
  yearlyInterest,
  yearlyInterestByRecurrence,
  type Cp003AnswerSemantic,
  type Cp003MathematicalState,
  type Cp003RegistryEntry,
  type Cp003Semantic,
  type Cp003SolveContract,
  type IntCp003LegacyFamily,
  type IntCp003QlId,
  type Rational,
} from "./cp003-math-authority";

export type Cp003Representation = "STANDARD_PROSE" | "ACCOUNT_TABLE" | "BALANCE_LEDGER" | "GROWTH_RATIO" | "BANK_STATEMENT" | "MISSING_ENTRY";
export type Cp003ContextClass = "ABSTRACT_SUM" | "INVESTMENT_SCHEME" | "BANK_DEPOSIT" | "ACCOUNT_RECORD";
export type Cp003Difficulty = "Easy" | "Medium" | "Hard";
export type Cp003Direction = "DIRECT" | "INVERSE" | "MULTI_STAGE";
export type Cp003ArithmeticLoad = "LOW" | "MEDIUM" | "HIGH";
export type Cp003RateTier = "CORE" | "EXTENDED" | "SELECTIVE";
export type Cp003RateProductionStatus = "CORE" | "LIMITED" | "EXPERIMENTAL" | "DISABLED";

export interface RateProfile {
  readonly id: string;
  readonly ratePercent: Rational;
  readonly annualFactor: Rational;
  readonly tier: Cp003RateTier;
  readonly weight: number;
  readonly allowedQlIds: readonly IntCp003QlId[];
  readonly maximumYearsByQl: Readonly<Partial<Record<IntCp003QlId, number>>>;
  readonly allowedContexts: readonly Cp003ContextClass[];
  readonly productionStatus: Cp003RateProductionStatus;
}

const CORE_RATE_IDS = new Set(["R05", "R10", "R125", "R20", "R25", "R50"]);
const SELECTIVE_RATE_IDS = new Set(["R0833", "R142857"]);
const BANK_RATE_IDS = new Set(["R04", "R05", "R0625", "R08", "R10", "R125", "R15", "R20", "R25"]);
const INVERSE_RATE_QLS = new Set<IntCp003QlId>(["INT-QL-057", "INT-QL-061"]);
const WEIGHTS: Readonly<Record<string, number>> = Object.freeze({
  R04: 2, R05: 5, R0625: 3, R08: 3, R0833: 1, R10: 7, R125: 6, R142857: 1,
  R15: 4, R1667: 2, R20: 7, R25: 6, R30: 3, R3333: 3, R40: 2, R50: 4,
});

function allowedQlIdsFor(rateId: string): readonly IntCp003QlId[] {
  if (!SELECTIVE_RATE_IDS.has(rateId)) return INT_CP003_QL_IDS;
  return Object.freeze(INT_CP003_QL_IDS.filter((qlId) => !INVERSE_RATE_QLS.has(qlId)));
}

function allowedContextsFor(rateId: string): readonly Cp003ContextClass[] {
  if (BANK_RATE_IDS.has(rateId)) return Object.freeze(["ABSTRACT_SUM", "INVESTMENT_SCHEME", "BANK_DEPOSIT", "ACCOUNT_RECORD"]);
  if (rateId === "R142857") return Object.freeze(["ABSTRACT_SUM", "INVESTMENT_SCHEME"]);
  return Object.freeze(["ABSTRACT_SUM", "INVESTMENT_SCHEME", "ACCOUNT_RECORD"]);
}

function maximumYearsByQlFor(rateId: string): Readonly<Partial<Record<IntCp003QlId, number>>> {
  if (rateId === "R142857") {
    return Object.freeze({
      "INT-QL-053": 2, "INT-QL-054": 2, "INT-QL-055": 2, "INT-QL-056": 2,
      "INT-QL-058": 2, "INT-QL-059": 2, "INT-QL-060": 2, "INT-QL-062": 2,
      "INT-QL-063": 2, "INT-QL-064": 2, "INT-QL-065": 2, "INT-QL-066": 2,
    });
  }
  if (SELECTIVE_RATE_IDS.has(rateId)) {
    return Object.freeze(Object.fromEntries(INT_CP003_QL_IDS.map((qlId) => [qlId, 3])) as Partial<Record<IntCp003QlId, number>>);
  }
  return Object.freeze({});
}

function buildRateProfile(definition: typeof INT_CP003_EXACT_RATE_DEFINITIONS[number]): RateProfile {
  const ratePercent = rat(definition.numerator, definition.denominator);
  const tier: Cp003RateTier = CORE_RATE_IDS.has(definition.id) ? "CORE" : SELECTIVE_RATE_IDS.has(definition.id) ? "SELECTIVE" : "EXTENDED";
  return Object.freeze({
    id: definition.id,
    ratePercent,
    annualFactor: factor(ratePercent),
    tier,
    weight: WEIGHTS[definition.id] ?? 1,
    allowedQlIds: allowedQlIdsFor(definition.id),
    maximumYearsByQl: maximumYearsByQlFor(definition.id),
    allowedContexts: allowedContextsFor(definition.id),
    productionStatus: tier === "CORE" ? "CORE" : tier === "SELECTIVE" ? "EXPERIMENTAL" : "LIMITED",
  });
}

export const INT_CP003_RATE_LIBRARY: readonly RateProfile[] = Object.freeze(INT_CP003_EXACT_RATE_DEFINITIONS.map(buildRateProfile));
export function rateProfileByValue(value: Rational): RateProfile | undefined { return INT_CP003_RATE_LIBRARY.find((profile) => eq(profile.ratePercent, value)); }
export function eligibleRateProfilesForQl(qlId: IntCp003QlId): readonly RateProfile[] {
  return Object.freeze(INT_CP003_RATE_LIBRARY.filter((profile) => profile.productionStatus !== "DISABLED" && profile.allowedQlIds.includes(qlId)));
}
export function verifyAnswer(state: Cp003MathematicalState, candidate: Rational): boolean { return verifyByRelation(state, candidate); }

export interface Cp003DifficultyProfile {
  readonly conceptualSteps: number;
  readonly arithmeticLoad: Cp003ArithmeticLoad;
  readonly direction: Cp003Direction;
  readonly representationBurden: 0 | 1 | 2;
  readonly shortcutAvailable: boolean;
  readonly score: number;
  readonly label: Cp003Difficulty;
}

export interface Cp003QuestionContract {
  readonly qlId: IntCp003QlId;
  readonly mathematicalState: Cp003MathematicalState;
  readonly presentation: Readonly<{ representation: Cp003Representation; stemFamilyId: string; contextClass: Cp003ContextClass }>;
  readonly difficultyProfile: Cp003DifficultyProfile;
  readonly mathematicalFingerprint: string;
  readonly numericFamilyKey: string;
  readonly rateProfileId: string;
  readonly seed: string;
}

const TARGET_PRINCIPALS = [
  800n, 1000n, 1200n, 1600n, 2000n, 2500n, 3200n, 4000n, 5000n, 6250n, 7680n, 8000n,
  10000n, 12000n, 12500n, 16000n, 20000n, 25000n, 32000n, 40000n, 50000n, 62500n,
  76800n, 80000n, 100000n, 125000n, 160000n, 200000n, 250000n, 300000n, 400000n, 500000n,
] as const;
const FRIENDLY_BASE_MULTIPLIERS = [
  1n, 2n, 3n, 4n, 5n, 6n, 8n, 10n, 12n, 15n, 16n, 20n, 24n, 25n, 30n, 32n, 40n, 48n,
  50n, 60n, 64n, 75n, 80n, 100n, 120n, 125n, 150n, 160n, 200n, 240n, 250n, 300n, 320n,
  400n, 500n, 625n, 800n, 1000n, 1200n, 1250n, 1600n, 2000n, 2500n, 3200n, 4000n, 5000n,
  6250n, 8000n, 10000n, 12500n, 16000n, 20000n, 25000n, 32000n, 40000n, 50000n,
] as const;
const abs = (value: bigint): bigint => value < 0n ? -value : value;

function selectRate(seed: string, qlId: IntCp003QlId): RateProfile {
  const weighted = eligibleRateProfilesForQl(qlId).flatMap((profile) => Array.from({ length: profile.weight }, () => profile));
  return pick(weighted, seed, `${qlId}:rate`);
}
function mathematicalMaximumYears(profile: RateProfile): number {
  if (profile.annualFactor.denominator <= 5n) return 5;
  if (profile.annualFactor.denominator <= 10n) return 4;
  if (profile.annualFactor.denominator <= 16n) return 3;
  return 2;
}
function maxYearsFor(profile: RateProfile, qlId: IntCp003QlId): number {
  return Math.min(mathematicalMaximumYears(profile), profile.maximumYearsByQl[qlId] ?? Number.POSITIVE_INFINITY);
}
function selectYears(seed: string, qlId: IntCp003QlId, profile: RateProfile, minimum = 2): number {
  const maximum = Math.max(minimum, maxYearsFor(profile, qlId));
  return minimum + hash(`${seed}:${qlId}:years`) % (maximum - minimum + 1);
}
function compatiblePrincipal(seed: string, qlId: IntCp003QlId, profile: RateProfile, requiredPower: number): Rational {
  const denominatorPower = profile.annualFactor.denominator ** BigInt(requiredPower);
  const target = pick(TARGET_PRINCIPALS, seed, `${qlId}:targetPrincipal`);
  if (target % denominatorPower === 0n) return rat(target);

  const candidates = [...new Set(
    FRIENDLY_BASE_MULTIPLIERS
      .map((base) => base * denominatorPower)
      .filter((value) => value >= 800n && value <= 500000n)
      .map((value) => value.toString()),
  )]
    .map((value) => BigInt(value))
    .sort((left, right) => {
      const leftDistance = abs(target - left);
      const rightDistance = abs(target - right);
      if (leftDistance !== rightDistance) return leftDistance < rightDistance ? -1 : 1;
      return left < right ? -1 : left > right ? 1 : 0;
    });

  if (candidates.length > 0) {
    const shortlist = candidates.slice(0, Math.min(3, candidates.length));
    return rat(pick(shortlist, seed, `${qlId}:friendlyPrincipalVariant`));
  }

  const quotient = target / denominatorPower;
  const lower = quotient > 0n ? quotient : 1n;
  const upper = lower + 1n;
  const lowerValue = lower * denominatorPower;
  const upperValue = upper * denominatorPower;
  return rat(abs(target - lowerValue) <= abs(upperValue - target) ? lowerValue : upperValue);
}

const ELIGIBLE_REPRESENTATIONS: Readonly<Record<IntCp003QlId, readonly Cp003Representation[]>> = Object.freeze({
  "INT-QL-053": ["STANDARD_PROSE", "ACCOUNT_TABLE", "BALANCE_LEDGER", "BANK_STATEMENT"],
  "INT-QL-054": ["STANDARD_PROSE", "ACCOUNT_TABLE", "BALANCE_LEDGER", "MISSING_ENTRY"],
  "INT-QL-055": ["STANDARD_PROSE", "ACCOUNT_TABLE", "GROWTH_RATIO", "BANK_STATEMENT"],
  "INT-QL-056": ["STANDARD_PROSE", "ACCOUNT_TABLE", "GROWTH_RATIO", "MISSING_ENTRY"],
  "INT-QL-057": ["STANDARD_PROSE", "GROWTH_RATIO", "ACCOUNT_TABLE", "BANK_STATEMENT"],
  "INT-QL-058": ["STANDARD_PROSE", "GROWTH_RATIO", "BALANCE_LEDGER", "BANK_STATEMENT"],
  "INT-QL-059": ["STANDARD_PROSE", "BALANCE_LEDGER", "ACCOUNT_TABLE", "MISSING_ENTRY"],
  "INT-QL-060": ["STANDARD_PROSE", "BALANCE_LEDGER", "ACCOUNT_TABLE", "MISSING_ENTRY"],
  "INT-QL-061": ["STANDARD_PROSE", "BALANCE_LEDGER", "GROWTH_RATIO", "MISSING_ENTRY"],
  "INT-QL-062": ["STANDARD_PROSE", "BALANCE_LEDGER", "BANK_STATEMENT", "MISSING_ENTRY"],
  "INT-QL-063": ["STANDARD_PROSE", "BALANCE_LEDGER", "BANK_STATEMENT", "ACCOUNT_TABLE"],
  "INT-QL-064": ["STANDARD_PROSE", "BALANCE_LEDGER", "BANK_STATEMENT", "GROWTH_RATIO"],
  "INT-QL-065": ["STANDARD_PROSE", "ACCOUNT_TABLE", "BALANCE_LEDGER", "MISSING_ENTRY"],
  "INT-QL-066": ["STANDARD_PROSE", "BALANCE_LEDGER", "GROWTH_RATIO", "MISSING_ENTRY"],
});

export const CP003_STEM_FAMILIES: Readonly<Record<IntCp003QlId, readonly string[]>> = Object.freeze({
  "INT-QL-053": ["DIRECT_AMOUNT", "MATURITY_VALUE", "INVESTMENT_OUTCOME"],
  "INT-QL-054": ["DIRECT_CI", "INTEREST_EARNED"],
  "INT-QL-055": ["ORIGINAL_SUM", "INITIAL_DEPOSIT"],
  "INT-QL-056": ["PRINCIPAL_FROM_CI"],
  "INT-QL-057": ["RATE_FROM_AMOUNT", "RATE_FROM_RATIO"],
  "INT-QL-058": ["TIME_FROM_AMOUNT"],
  "INT-QL-059": ["NTH_YEAR_INTEREST"],
  "INT-QL-060": ["PRINCIPAL_FROM_NTH_INTEREST"],
  "INT-QL-061": ["RATE_FROM_NTH_INTEREST"],
  "INT-QL-062": ["PREVIOUS_BALANCE"],
  "INT-QL-063": ["RATE_FROM_CONSECUTIVE_BALANCES"],
  "INT-QL-064": ["PRINCIPAL_FROM_OBSERVATIONS"],
  "INT-QL-065": ["AMOUNT_DIFFERENCE"],
  "INT-QL-066": ["LATER_YEAR_INTEREST"],
});

const STEM_FAMILY_CONTEXTS: Readonly<Record<string, readonly Cp003ContextClass[]>> = Object.freeze({
  DIRECT_AMOUNT: ["ABSTRACT_SUM", "INVESTMENT_SCHEME", "ACCOUNT_RECORD"],
  MATURITY_VALUE: ["INVESTMENT_SCHEME", "BANK_DEPOSIT", "ACCOUNT_RECORD"],
  INVESTMENT_OUTCOME: ["ABSTRACT_SUM", "INVESTMENT_SCHEME"],
  DIRECT_CI: ["ABSTRACT_SUM", "INVESTMENT_SCHEME", "ACCOUNT_RECORD"],
  INTEREST_EARNED: ["INVESTMENT_SCHEME", "BANK_DEPOSIT", "ACCOUNT_RECORD"],
  ORIGINAL_SUM: ["ABSTRACT_SUM", "INVESTMENT_SCHEME", "ACCOUNT_RECORD"],
  INITIAL_DEPOSIT: ["BANK_DEPOSIT"],
  PRINCIPAL_FROM_CI: ["ABSTRACT_SUM", "INVESTMENT_SCHEME", "ACCOUNT_RECORD"],
  RATE_FROM_AMOUNT: ["ABSTRACT_SUM", "INVESTMENT_SCHEME", "BANK_DEPOSIT", "ACCOUNT_RECORD"],
  RATE_FROM_RATIO: ["ABSTRACT_SUM", "INVESTMENT_SCHEME"],
});

function eligibleRepresentations(profile: RateProfile, qlId: IntCp003QlId): readonly Cp003Representation[] {
  return Object.freeze(ELIGIBLE_REPRESENTATIONS[qlId].filter((representation) => {
    if (representation === "BANK_STATEMENT") return profile.allowedContexts.includes("BANK_DEPOSIT");
    if (["ACCOUNT_TABLE", "BALANCE_LEDGER", "MISSING_ENTRY"].includes(representation)) return profile.allowedContexts.includes("ACCOUNT_RECORD");
    if (representation === "GROWTH_RATIO") return profile.allowedContexts.includes("ABSTRACT_SUM");
    return profile.allowedContexts.length > 0;
  }));
}
function contextForRepresentation(profile: RateProfile, representation: Cp003Representation, seed: string, qlId: IntCp003QlId): Cp003ContextClass {
  if (representation === "BANK_STATEMENT") return "BANK_DEPOSIT";
  if (["ACCOUNT_TABLE", "BALANCE_LEDGER", "MISSING_ENTRY"].includes(representation)) return "ACCOUNT_RECORD";
  if (representation === "GROWTH_RATIO") return "ABSTRACT_SUM";
  return pick(profile.allowedContexts, seed, `${qlId}:context`);
}
function stemFamilyFor(qlId: IntCp003QlId, contextClass: Cp003ContextClass, seed: string): string {
  const candidates = CP003_STEM_FAMILIES[qlId].filter((family) => !(family in STEM_FAMILY_CONTEXTS) || STEM_FAMILY_CONTEXTS[family]!.includes(contextClass));
  if (candidates.length === 0) throw new Error(`${qlId}: no stem family supports ${contextClass}`);
  return pick(candidates, seed, `${qlId}:stemFamily`);
}

function taskDirection(qlId: IntCp003QlId): Cp003Direction {
  if (["INT-QL-053", "INT-QL-054", "INT-QL-059"].includes(qlId)) return "DIRECT";
  if (["INT-QL-055", "INT-QL-056", "INT-QL-057", "INT-QL-058", "INT-QL-060", "INT-QL-061"].includes(qlId)) return "INVERSE";
  return "MULTI_STAGE";
}
function hasTerminatingDecimal(denominator: bigint): boolean {
  let value = denominator < 0n ? -denominator : denominator;
  while (value % 2n === 0n) value /= 2n;
  while (value % 5n === 0n) value /= 5n;
  return value === 1n;
}
function arithmeticLoad(profile: RateProfile, powerValue: number): Cp003ArithmeticLoad {
  const burden = profile.annualFactor.denominator.toString().length + profile.annualFactor.numerator.toString().length + powerValue;
  const baseLoad: Cp003ArithmeticLoad = burden <= 5 ? "LOW" : burden <= 8 ? "MEDIUM" : "HIGH";
  if ((!hasTerminatingDecimal(profile.ratePercent.denominator) || profile.tier === "SELECTIVE") && baseLoad === "LOW") return "MEDIUM";
  return baseLoad;
}
function representationBurden(representation: Cp003Representation): 0 | 1 | 2 {
  if (representation === "STANDARD_PROSE" || representation === "GROWTH_RATIO") return 0;
  if (representation === "ACCOUNT_TABLE" || representation === "BANK_STATEMENT") return 1;
  return 2;
}
function conceptualSteps(qlId: IntCp003QlId, _representation: Cp003Representation, yearGap: number): number {
  let steps = qlId === "INT-QL-053" ? 1 : qlId === "INT-QL-054" ? 3 : ["INT-QL-055", "INT-QL-058", "INT-QL-059", "INT-QL-062", "INT-QL-063"].includes(qlId) ? 2 : 3;
  if (["INT-QL-061", "INT-QL-064", "INT-QL-065", "INT-QL-066"].includes(qlId)) steps += 1;
  if (yearGap > 1) steps += 1;
  return steps;
}
function difficultyProfile(qlId: IntCp003QlId, representation: Cp003Representation, profile: RateProfile, powerValue: number, yearGap: number): Cp003DifficultyProfile {
  const direction = taskDirection(qlId);
  const load = arithmeticLoad(profile, powerValue);
  const rep = representationBurden(representation);
  const steps = conceptualSteps(qlId, representation, yearGap);
  const score = steps + (direction === "INVERSE" ? 1 : direction === "MULTI_STAGE" ? 2 : 0) + (load === "MEDIUM" ? 1 : load === "HIGH" ? 2 : 0) + rep;
  const label: Cp003Difficulty = score <= 2 ? "Easy" : score <= 6 ? "Medium" : "Hard";
  return Object.freeze({ conceptualSteps: steps, arithmeticLoad: load, direction, representationBurden: rep, shortcutAvailable: profile.annualFactor.denominator <= 10n, score, label });
}

function requiredPrincipalPower(
  qlId: IntCp003QlId,
  years: number,
  targetYear: number,
  currentYear: number,
  laterYear: number,
): number {
  switch (qlId) {
    case "INT-QL-053":
    case "INT-QL-054":
    case "INT-QL-055":
    case "INT-QL-056":
    case "INT-QL-057":
    case "INT-QL-058":
      return years;
    case "INT-QL-059":
    case "INT-QL-060":
    case "INT-QL-061":
      return targetYear;
    case "INT-QL-062":
    case "INT-QL-063":
      return currentYear;
    case "INT-QL-064":
      return currentYear + 1;
    case "INT-QL-065":
    case "INT-QL-066":
      return laterYear;
  }
}

function buildState(qlId: IntCp003QlId, seed: string, profile: RateProfile): Cp003MathematicalState {
  const years = selectYears(seed, qlId, profile, 2);
  const maximumYear = maxYearsFor(profile, qlId);
  const targetYear = 2 + hash(`${seed}:${qlId}:targetYear`) % Math.max(1, Math.min(4, maximumYear) - 1);
  const earlierYear = maximumYear <= 2 ? 1 : 1 + hash(`${seed}:${qlId}:earlierYear`) % 2;
  const gap = 1 + hash(`${seed}:${qlId}:yearGap`) % 2;
  const laterYear = Math.min(earlierYear + gap, Math.max(2, maximumYear));
  const currentYear = 1 + hash(`${seed}:${qlId}:currentYear`) % Math.max(1, Math.min(3, maximumYear));
  const principalPower = requiredPrincipalPower(qlId, years, targetYear, currentYear, laterYear);
  const principal = compatiblePrincipal(seed, qlId, profile, principalPower);
  const maturityAmount = amount(principal, profile.ratePercent, years);
  switch (qlId) {
    case "INT-QL-053": return Object.freeze({ qlId, principal, ratePercent: profile.ratePercent, years });
    case "INT-QL-054": return Object.freeze({ qlId, principal, ratePercent: profile.ratePercent, years });
    case "INT-QL-055": return Object.freeze({ qlId, amount: maturityAmount, ratePercent: profile.ratePercent, years });
    case "INT-QL-056": return Object.freeze({ qlId, compoundInterest: compoundInterest(principal, profile.ratePercent, years), ratePercent: profile.ratePercent, years });
    case "INT-QL-057": return Object.freeze({ qlId, principal, amount: maturityAmount, years });
    case "INT-QL-058": return Object.freeze({ qlId, principal, amount: maturityAmount, ratePercent: profile.ratePercent });
    case "INT-QL-059": return Object.freeze({ qlId, principal, ratePercent: profile.ratePercent, targetYear });
    case "INT-QL-060": return Object.freeze({ qlId, nthYearInterest: yearlyInterest(principal, profile.ratePercent, targetYear), ratePercent: profile.ratePercent, targetYear });
    case "INT-QL-061": return Object.freeze({ qlId, principal, nthYearInterest: yearlyInterest(principal, profile.ratePercent, targetYear), targetYear });
    case "INT-QL-062": return Object.freeze({ qlId, currentAmount: amount(principal, profile.ratePercent, currentYear), ratePercent: profile.ratePercent, currentYear });
    case "INT-QL-063": return Object.freeze({ qlId, openingAmount: amount(principal, profile.ratePercent, currentYear - 1), closingAmount: amount(principal, profile.ratePercent, currentYear), yearNumber: currentYear });
    case "INT-QL-064": return Object.freeze({ qlId, amountAtYear: amount(principal, profile.ratePercent, currentYear), nextYearAmount: amount(principal, profile.ratePercent, currentYear + 1), yearNumber: currentYear });
    case "INT-QL-065": return Object.freeze({ qlId, principal, ratePercent: profile.ratePercent, earlierYear, laterYear });
    case "INT-QL-066": return Object.freeze({ qlId, earlierYearInterest: yearlyInterest(principal, profile.ratePercent, earlierYear), ratePercent: profile.ratePercent, earlierYear, laterYear });
  }
}

export function generateCp003QuestionContract(qlId: IntCp003QlId, seed: string): Cp003QuestionContract {
  const profile = selectRate(seed, qlId);
  const state = buildState(qlId, seed, profile);
  const representation = pick(eligibleRepresentations(profile, qlId), seed, `${qlId}:representation`);
  const contextClass = contextForRepresentation(profile, representation, seed, qlId);
  const stemFamilyId = stemFamilyFor(qlId, contextClass, seed);
  const answer = canonicalAnswer(state);
  const yearGap = state.qlId === "INT-QL-065" || state.qlId === "INT-QL-066" ? state.laterYear - state.earlierYear : 1;
  const powerValue = "years" in state ? state.years : "targetYear" in state ? state.targetYear : "currentYear" in state ? state.currentYear : "yearNumber" in state ? state.yearNumber + 1 : "laterYear" in state ? state.laterYear : 2;
  const difficulty = difficultyProfile(qlId, representation, profile, powerValue, yearGap);
  const numericFamilyKey = `${profile.id}:${powerValue}:${mathematicalStateEntries(state).map(([key, value]) => key.includes("principal") || key.includes("amount") || key.includes("Interest") ? value : "-").join(":")}`;
  return Object.freeze({
    qlId,
    mathematicalState: state,
    presentation: Object.freeze({ representation, stemFamilyId, contextClass }),
    difficultyProfile: difficulty,
    mathematicalFingerprint: mathematicalFingerprint(state, answer),
    numericFamilyKey,
    rateProfileId: profile.id,
    seed,
  });
}
