export interface Rational { readonly numerator: bigint; readonly denominator: bigint }

const abs = (value: bigint) => value < 0n ? -value : value;
function gcd(left: bigint, right: bigint): bigint {
  let a = abs(left), b = abs(right);
  while (b !== 0n) [a, b] = [b, a % b];
  return a || 1n;
}
export function rat(numerator: bigint | number, denominator: bigint | number = 1): Rational {
  let n = BigInt(numerator), d = BigInt(denominator);
  if (d === 0n) throw new Error("zero denominator");
  if (d < 0n) { n = -n; d = -d; }
  const divisor = gcd(n, d);
  return Object.freeze({ numerator: n / divisor, denominator: d / divisor });
}
export const add = (a: Rational, b: Rational) => rat(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
export const sub = (a: Rational, b: Rational) => rat(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
export const mul = (a: Rational, b: Rational) => rat(a.numerator * b.numerator, a.denominator * b.denominator);
export const div = (a: Rational, b: Rational) => { if (b.numerator === 0n) throw new Error("divide by zero"); return rat(a.numerator * b.denominator, a.denominator * b.numerator); };
export const pow = (value: Rational, exponent: number) => rat(value.numerator ** BigInt(exponent), value.denominator ** BigInt(exponent));
export const eq = (a: Rational, b: Rational) => a.numerator === b.numerator && a.denominator === b.denominator;
export const integer = (value: Rational) => value.denominator === 1n ? Number(value.numerator) : null;

export function hash(text: string): number {
  let value = 2166136261;
  for (const character of text) { value ^= character.charCodeAt(0); value = Math.imul(value, 16777619); }
  return value >>> 0;
}
export function pick<T>(values: readonly T[], seed: string, key: string): T {
  return values[hash(`${seed}:${key}`) % values.length]!;
}

export const INT_CP003_QL_IDS = [
  "INT-QL-053","INT-QL-054","INT-QL-055","INT-QL-056","INT-QL-057","INT-QL-058","INT-QL-059",
  "INT-QL-060","INT-QL-061","INT-QL-062","INT-QL-063","INT-QL-064","INT-QL-065","INT-QL-066",
] as const;
export type IntCp003QlId = typeof INT_CP003_QL_IDS[number];

export type Cp003AnswerSemantic = "MONEY" | "PRINCIPAL" | "RATE_PERCENT" | "TIME_YEARS";
export type Cp003Representation = "STANDARD_PROSE" | "ACCOUNT_TABLE" | "BALANCE_LEDGER" | "GROWTH_RATIO" | "BANK_STATEMENT" | "MISSING_ENTRY";
export type Cp003Difficulty = "Easy" | "Medium" | "Hard";
export type Cp003Direction = "DIRECT" | "INVERSE" | "MULTI_STAGE";
export type Cp003ArithmeticLoad = "LOW" | "MEDIUM" | "HIGH";

export interface RateProfile {
  readonly id: string;
  readonly ratePercent: Rational;
  readonly annualFactor: Rational;
  readonly tier: "CORE" | "EXTENDED" | "SELECTIVE";
  readonly weight: number;
}
function rate(id: string, numerator: number, denominator: number, tier: RateProfile["tier"], weight: number): RateProfile {
  const ratePercent = rat(numerator, denominator);
  return Object.freeze({ id, ratePercent, annualFactor: add(rat(1), div(ratePercent, rat(100))), tier, weight });
}
export const INT_CP003_RATE_LIBRARY: readonly RateProfile[] = Object.freeze([
  rate("R04",4,1,"EXTENDED",2), rate("R05",5,1,"CORE",5), rate("R0625",25,4,"EXTENDED",3),
  rate("R08",8,1,"EXTENDED",3), rate("R0833",25,3,"SELECTIVE",1), rate("R10",10,1,"CORE",7),
  rate("R125",25,2,"CORE",6), rate("R15",15,1,"EXTENDED",4), rate("R1667",50,3,"EXTENDED",2),
  rate("R20",20,1,"CORE",7), rate("R25",25,1,"CORE",6), rate("R30",30,1,"EXTENDED",3),
  rate("R3333",100,3,"EXTENDED",3), rate("R40",40,1,"EXTENDED",2), rate("R50",50,1,"CORE",4),
  rate("R142857",100,7,"SELECTIVE",1),
]);
const WEIGHTED_RATES = Object.freeze(INT_CP003_RATE_LIBRARY.flatMap((profile) => Array.from({ length: profile.weight }, () => profile)));
export function rateProfileByValue(value: Rational): RateProfile | undefined {
  return INT_CP003_RATE_LIBRARY.find((profile) => eq(profile.ratePercent, value));
}
export const factor = (ratePercent: Rational) => add(rat(1), div(ratePercent, rat(100)));
export const amount = (principal: Rational, ratePercent: Rational, years: number) => mul(principal, pow(factor(ratePercent), years));
export const compoundInterest = (principal: Rational, ratePercent: Rational, years: number) => sub(amount(principal, ratePercent, years), principal);
export const yearlyInterest = (principal: Rational, ratePercent: Rational, year: number) => sub(amount(principal, ratePercent, year), amount(principal, ratePercent, year - 1));

export type Cp003MathematicalState =
  | Readonly<{ qlId:"INT-QL-053"; principal:Rational; ratePercent:Rational; years:number }>
  | Readonly<{ qlId:"INT-QL-054"; principal:Rational; ratePercent:Rational; years:number }>
  | Readonly<{ qlId:"INT-QL-055"; amount:Rational; ratePercent:Rational; years:number }>
  | Readonly<{ qlId:"INT-QL-056"; compoundInterest:Rational; ratePercent:Rational; years:number }>
  | Readonly<{ qlId:"INT-QL-057"; principal:Rational; amount:Rational; years:number }>
  | Readonly<{ qlId:"INT-QL-058"; principal:Rational; amount:Rational; ratePercent:Rational }>
  | Readonly<{ qlId:"INT-QL-059"; principal:Rational; ratePercent:Rational; targetYear:number }>
  | Readonly<{ qlId:"INT-QL-060"; nthYearInterest:Rational; ratePercent:Rational; targetYear:number }>
  | Readonly<{ qlId:"INT-QL-061"; principal:Rational; nthYearInterest:Rational; targetYear:number }>
  | Readonly<{ qlId:"INT-QL-062"; currentAmount:Rational; ratePercent:Rational; currentYear:number }>
  | Readonly<{ qlId:"INT-QL-063"; openingAmount:Rational; closingAmount:Rational; yearNumber:number }>
  | Readonly<{ qlId:"INT-QL-064"; amountAtYear:Rational; nextYearAmount:Rational; yearNumber:number }>
  | Readonly<{ qlId:"INT-QL-065"; principal:Rational; ratePercent:Rational; earlierYear:number; laterYear:number }>
  | Readonly<{ qlId:"INT-QL-066"; earlierYearInterest:Rational; ratePercent:Rational; earlierYear:number; laterYear:number }>;

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
  readonly presentation: Readonly<{ representation:Cp003Representation; stemFamilyId:string; context?:string }>;
  readonly difficultyProfile: Cp003DifficultyProfile;
  readonly mathematicalFingerprint: string;
  readonly numericFamilyKey: string;
  readonly rateProfileId: string;
  readonly seed: string;
}

const TARGET_PRINCIPALS = [800n,1000n,1200n,1600n,2000n,2500n,3200n,4000n,5000n,6250n,7680n,8000n,10000n,12000n,12500n,16000n,20000n,25000n,32000n,40000n,50000n,62500n,76800n,80000n,100000n,125000n,160000n,200000n,250000n,300000n,400000n,500000n] as const;

function selectRate(seed: string, qlId: IntCp003QlId): RateProfile {
  return pick(WEIGHTED_RATES, seed, `${qlId}:rate`);
}
function maxYearsFor(profile: RateProfile): number {
  if (profile.annualFactor.denominator <= 5n) return 5;
  if (profile.annualFactor.denominator <= 10n) return 4;
  if (profile.annualFactor.denominator <= 16n) return 3;
  return 2;
}
function selectYears(seed: string, qlId: IntCp003QlId, profile: RateProfile, minimum = 2): number {
  const maximum = Math.max(minimum, maxYearsFor(profile));
  return minimum + hash(`${seed}:${qlId}:years`) % (maximum - minimum + 1);
}
function compatiblePrincipal(seed: string, qlId: IntCp003QlId, profile: RateProfile, maximumPower: number): Rational {
  const denominatorPower = profile.annualFactor.denominator ** BigInt(maximumPower);
  const target = pick(TARGET_PRINCIPALS, seed, `${qlId}:targetPrincipal`);
  const quotient = target / denominatorPower;
  const lower = quotient > 0n ? quotient : 1n;
  const upper = lower + 1n;
  const lowerValue = lower * denominatorPower;
  const upperValue = upper * denominatorPower;
  const selected = abs(target - lowerValue) <= abs(upperValue - target) ? lowerValue : upperValue;
  return rat(selected);
}

const ELIGIBLE_REPRESENTATIONS: Readonly<Record<IntCp003QlId, readonly Cp003Representation[]>> = Object.freeze({
  "INT-QL-053":["STANDARD_PROSE","ACCOUNT_TABLE","BALANCE_LEDGER","BANK_STATEMENT"],
  "INT-QL-054":["STANDARD_PROSE","ACCOUNT_TABLE","BALANCE_LEDGER","MISSING_ENTRY"],
  "INT-QL-055":["STANDARD_PROSE","ACCOUNT_TABLE","GROWTH_RATIO","BANK_STATEMENT"],
  "INT-QL-056":["STANDARD_PROSE","ACCOUNT_TABLE","GROWTH_RATIO","MISSING_ENTRY"],
  "INT-QL-057":["STANDARD_PROSE","GROWTH_RATIO","ACCOUNT_TABLE","BANK_STATEMENT"],
  "INT-QL-058":["STANDARD_PROSE","GROWTH_RATIO","BALANCE_LEDGER","BANK_STATEMENT"],
  "INT-QL-059":["STANDARD_PROSE","BALANCE_LEDGER","ACCOUNT_TABLE","MISSING_ENTRY"],
  "INT-QL-060":["STANDARD_PROSE","BALANCE_LEDGER","ACCOUNT_TABLE","MISSING_ENTRY"],
  "INT-QL-061":["STANDARD_PROSE","BALANCE_LEDGER","GROWTH_RATIO","MISSING_ENTRY"],
  "INT-QL-062":["STANDARD_PROSE","BALANCE_LEDGER","BANK_STATEMENT","MISSING_ENTRY"],
  "INT-QL-063":["STANDARD_PROSE","BALANCE_LEDGER","BANK_STATEMENT","ACCOUNT_TABLE"],
  "INT-QL-064":["STANDARD_PROSE","BALANCE_LEDGER","BANK_STATEMENT","GROWTH_RATIO"],
  "INT-QL-065":["STANDARD_PROSE","ACCOUNT_TABLE","BALANCE_LEDGER","MISSING_ENTRY"],
  "INT-QL-066":["STANDARD_PROSE","BALANCE_LEDGER","GROWTH_RATIO","MISSING_ENTRY"],
});

const STEM_FAMILIES: Readonly<Record<IntCp003QlId, readonly string[]>> = Object.freeze({
  "INT-QL-053":["DIRECT_AMOUNT","MATURITY_VALUE","INVESTMENT_OUTCOME","ACCOUNT_FORECAST"],
  "INT-QL-054":["DIRECT_CI","AMOUNT_MINUS_PRINCIPAL","INTEREST_EARNED","ACCOUNT_GAIN"],
  "INT-QL-055":["ORIGINAL_SUM","REVERSE_MATURITY","INITIAL_DEPOSIT","GROWTH_RATIO_INVERSE"],
  "INT-QL-056":["PRINCIPAL_FROM_CI","ORIGINAL_SUM_FROM_GAIN","REVERSE_INTEREST","UNKNOWN_DEPOSIT"],
  "INT-QL-057":["RATE_FROM_AMOUNT","RATE_FROM_RATIO","ANNUAL_MULTIPLIER","BANK_RETURN_RATE"],
  "INT-QL-058":["TIME_FROM_AMOUNT","TIME_FROM_RATIO","BALANCE_MILESTONE","YEAR_COUNT"],
  "INT-QL-059":["NTH_YEAR_INTEREST","YEAR_ONLY_GAIN","LEDGER_INTEREST","MISSING_YEAR_INTEREST"],
  "INT-QL-060":["PRINCIPAL_FROM_NTH_INTEREST","ORIGINAL_BALANCE","REVERSE_YEAR_GAIN","LEDGER_BASE"],
  "INT-QL-061":["RATE_FROM_NTH_INTEREST","YEAR_GAIN_RATE","OPTION_SUBSTITUTION_RATE","LEDGER_RATE"],
  "INT-QL-062":["PREVIOUS_BALANCE","REVERSE_ONE_YEAR","STATEMENT_PREVIOUS_ENTRY","LEDGER_BACKSTEP"],
  "INT-QL-063":["RATE_FROM_CONSECUTIVE_BALANCES","ONE_YEAR_GROWTH","STATEMENT_RATE","LEDGER_RATE"],
  "INT-QL-064":["PRINCIPAL_FROM_OBSERVATIONS","ORIGINAL_DEPOSIT_FROM_LEDGER","REVERSE_BALANCES","GROWTH_CHAIN"],
  "INT-QL-065":["AMOUNT_DIFFERENCE","LATER_PERIOD_INCREMENT","CONSECUTIVE_AMOUNT_GAP","DURATION_COMPARISON"],
  "INT-QL-066":["LATER_YEAR_INTEREST","YEARLY_INTEREST_GP","INTEREST_GROWTH","LEDGER_YEAR_GAIN"],
});

function taskDirection(qlId: IntCp003QlId): Cp003Direction {
  if (["INT-QL-053","INT-QL-054","INT-QL-059"].includes(qlId)) return "DIRECT";
  if (["INT-QL-055","INT-QL-056","INT-QL-057","INT-QL-058","INT-QL-060","INT-QL-061"].includes(qlId)) return "INVERSE";
  return "MULTI_STAGE";
}
function arithmeticLoad(rateProfile: RateProfile, power: number): Cp003ArithmeticLoad {
  const burden = rateProfile.annualFactor.denominator.toString().length + rateProfile.annualFactor.numerator.toString().length + power;
  return burden <= 5 ? "LOW" : burden <= 8 ? "MEDIUM" : "HIGH";
}
function representationBurden(representation: Cp003Representation): 0 | 1 | 2 {
  if (representation === "STANDARD_PROSE" || representation === "GROWTH_RATIO") return 0;
  if (representation === "ACCOUNT_TABLE" || representation === "BANK_STATEMENT") return 1;
  return 2;
}
function conceptualSteps(qlId: IntCp003QlId, representation: Cp003Representation, yearGap: number): number {
  let steps = ["INT-QL-053","INT-QL-054"].includes(qlId) ? 1 : ["INT-QL-055","INT-QL-058","INT-QL-059","INT-QL-062","INT-QL-063"].includes(qlId) ? 2 : 3;
  if (["INT-QL-061","INT-QL-064","INT-QL-065","INT-QL-066"].includes(qlId)) steps += 1;
  if (yearGap > 1) steps += 1;
  if (representationBurden(representation) === 2) steps += 1;
  return steps;
}
function difficultyProfile(qlId: IntCp003QlId, representation: Cp003Representation, profile: RateProfile, power: number, yearGap: number): Cp003DifficultyProfile {
  const direction = taskDirection(qlId);
  const load = arithmeticLoad(profile, power);
  const rep = representationBurden(representation);
  const steps = conceptualSteps(qlId, representation, yearGap);
  const score = steps + (direction === "INVERSE" ? 1 : direction === "MULTI_STAGE" ? 2 : 0) + (load === "MEDIUM" ? 1 : load === "HIGH" ? 2 : 0) + rep;
  const label: Cp003Difficulty = score <= 3 ? "Easy" : score <= 6 ? "Medium" : "Hard";
  return Object.freeze({ conceptualSteps:steps, arithmeticLoad:load, direction, representationBurden:rep, shortcutAvailable:profile.annualFactor.denominator <= 10n, score, label });
}

function sortedStateEntries(state: Cp003MathematicalState): readonly [string,string][] {
  return Object.entries(state)
    .filter(([key]) => key !== "qlId")
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([key,value]) => [key, typeof value === "number" ? String(value) : `${(value as Rational).numerator}/${(value as Rational).denominator}`] as const);
}
export function mathematicalFingerprint(state: Cp003MathematicalState, answer: Rational): string {
  return [state.qlId, ...sortedStateEntries(state).map(([key,value]) => `${key}=${value}`), `answer=${answer.numerator}/${answer.denominator}`].join("|");
}

function findRate(predicate: (profile: RateProfile) => boolean): Rational {
  const matches = INT_CP003_RATE_LIBRARY.filter(predicate);
  if (matches.length !== 1) throw new Error(`rate inverse expected one match, found ${matches.length}`);
  return matches[0]!.ratePercent;
}
export function canonicalAnswer(state: Cp003MathematicalState): Rational {
  switch (state.qlId) {
    case "INT-QL-053": return amount(state.principal,state.ratePercent,state.years);
    case "INT-QL-054": return compoundInterest(state.principal,state.ratePercent,state.years);
    case "INT-QL-055": return div(state.amount,pow(factor(state.ratePercent),state.years));
    case "INT-QL-056": return div(state.compoundInterest,sub(pow(factor(state.ratePercent),state.years),rat(1)));
    case "INT-QL-057": return findRate((profile) => eq(amount(state.principal,profile.ratePercent,state.years),state.amount));
    case "INT-QL-058": {
      const matches = Array.from({length:6},(_,index)=>index+1).filter((years)=>eq(amount(state.principal,state.ratePercent,years),state.amount));
      if (matches.length !== 1) throw new Error("time inverse expected one match");
      return rat(matches[0]!);
    }
    case "INT-QL-059": return yearlyInterest(state.principal,state.ratePercent,state.targetYear);
    case "INT-QL-060": return div(state.nthYearInterest,mul(sub(factor(state.ratePercent),rat(1)),pow(factor(state.ratePercent),state.targetYear-1)));
    case "INT-QL-061": return findRate((profile)=>eq(yearlyInterest(state.principal,profile.ratePercent,state.targetYear),state.nthYearInterest));
    case "INT-QL-062": return div(state.currentAmount,factor(state.ratePercent));
    case "INT-QL-063": return mul(sub(div(state.closingAmount,state.openingAmount),rat(1)),rat(100));
    case "INT-QL-064": {
      const ratePercent = mul(sub(div(state.nextYearAmount,state.amountAtYear),rat(1)),rat(100));
      return div(state.amountAtYear,pow(factor(ratePercent),state.yearNumber));
    }
    case "INT-QL-065": return sub(amount(state.principal,state.ratePercent,state.laterYear),amount(state.principal,state.ratePercent,state.earlierYear));
    case "INT-QL-066": return mul(state.earlierYearInterest,pow(factor(state.ratePercent),state.laterYear-state.earlierYear));
  }
}
export function verifyAnswer(state: Cp003MathematicalState, candidate: Rational): boolean {
  if (candidate.numerator <= 0n) return false;
  try { return eq(canonicalAnswer(state),candidate); } catch { return false; }
}

function buildState(qlId: IntCp003QlId, seed: string, profile: RateProfile): Cp003MathematicalState {
  const years = selectYears(seed,qlId,profile,2);
  const targetYear = 2 + hash(`${seed}:${qlId}:targetYear`) % Math.max(1,Math.min(4,maxYearsFor(profile))-1);
  const earlierYear = 1 + hash(`${seed}:${qlId}:earlierYear`) % 2;
  const gap = 1 + hash(`${seed}:${qlId}:yearGap`) % 2;
  const laterYear = earlierYear + gap;
  const currentYear = 1 + hash(`${seed}:${qlId}:currentYear`) % Math.max(1,Math.min(3,maxYearsFor(profile)));
  const maximumPower = Math.max(years,targetYear,laterYear,currentYear+1);
  const principal = compatiblePrincipal(seed,qlId,profile,maximumPower);
  const A = amount(principal,profile.ratePercent,years);
  switch (qlId) {
    case "INT-QL-053": return Object.freeze({qlId,principal,ratePercent:profile.ratePercent,years});
    case "INT-QL-054": return Object.freeze({qlId,principal,ratePercent:profile.ratePercent,years});
    case "INT-QL-055": return Object.freeze({qlId,amount:A,ratePercent:profile.ratePercent,years});
    case "INT-QL-056": return Object.freeze({qlId,compoundInterest:compoundInterest(principal,profile.ratePercent,years),ratePercent:profile.ratePercent,years});
    case "INT-QL-057": return Object.freeze({qlId,principal,amount:A,years});
    case "INT-QL-058": return Object.freeze({qlId,principal,amount:A,ratePercent:profile.ratePercent});
    case "INT-QL-059": return Object.freeze({qlId,principal,ratePercent:profile.ratePercent,targetYear});
    case "INT-QL-060": return Object.freeze({qlId,nthYearInterest:yearlyInterest(principal,profile.ratePercent,targetYear),ratePercent:profile.ratePercent,targetYear});
    case "INT-QL-061": return Object.freeze({qlId,principal,nthYearInterest:yearlyInterest(principal,profile.ratePercent,targetYear),targetYear});
    case "INT-QL-062": return Object.freeze({qlId,currentAmount:amount(principal,profile.ratePercent,currentYear),ratePercent:profile.ratePercent,currentYear});
    case "INT-QL-063": return Object.freeze({qlId,openingAmount:amount(principal,profile.ratePercent,currentYear-1),closingAmount:amount(principal,profile.ratePercent,currentYear),yearNumber:currentYear});
    case "INT-QL-064": return Object.freeze({qlId,amountAtYear:amount(principal,profile.ratePercent,currentYear),nextYearAmount:amount(principal,profile.ratePercent,currentYear+1),yearNumber:currentYear});
    case "INT-QL-065": return Object.freeze({qlId,principal,ratePercent:profile.ratePercent,earlierYear,laterYear});
    case "INT-QL-066": return Object.freeze({qlId,earlierYearInterest:yearlyInterest(principal,profile.ratePercent,earlierYear),ratePercent:profile.ratePercent,earlierYear,laterYear});
  }
}

export function generateCp003QuestionContract(qlId: IntCp003QlId, seed: string): Cp003QuestionContract {
  const profile = selectRate(seed,qlId);
  const state = buildState(qlId,seed,profile);
  const representation = pick(ELIGIBLE_REPRESENTATIONS[qlId],seed,`${qlId}:representation`);
  const stemFamilyId = pick(STEM_FAMILIES[qlId],seed,`${qlId}:stemFamily`);
  const answer = canonicalAnswer(state);
  const yearGap = state.qlId === "INT-QL-065" || state.qlId === "INT-QL-066" ? state.laterYear-state.earlierYear : 1;
  const power = "years" in state ? state.years : "targetYear" in state ? state.targetYear : "currentYear" in state ? state.currentYear : "yearNumber" in state ? state.yearNumber+1 : "laterYear" in state ? state.laterYear : 2;
  const difficulty = difficultyProfile(qlId,representation,profile,power,yearGap);
  const numericFamilyKey = `${profile.id}:${power}:${sortedStateEntries(state).map(([key,value])=>key.includes("principal")||key.includes("amount")||key.includes("Interest")?value:"-").join(":")}`;
  return Object.freeze({ qlId, mathematicalState:state, presentation:Object.freeze({representation,stemFamilyId}), difficultyProfile:difficulty, mathematicalFingerprint:mathematicalFingerprint(state,answer), numericFamilyKey, rateProfileId:profile.id, seed });
}
