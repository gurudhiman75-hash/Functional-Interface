export type Cp003Semantic = "MONEY" | "PRINCIPAL" | "RATE_PERCENT" | "TIME_YEARS";
export type Cp003Difficulty = "Easy" | "Medium" | "Hard";
export type Cp003Representation = "NARRATIVE" | "TABLE" | "BALANCE_LEDGER" | "GROWTH_FACTOR_CARD";
export interface Rational { readonly numerator: bigint; readonly denominator: bigint }

const abs = (v: bigint) => v < 0n ? -v : v;
function gcd(a: bigint, b: bigint): bigint { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a || 1n; }
export function rat(n: bigint | number, d: bigint | number = 1): Rational {
  let nn = BigInt(n), dd = BigInt(d); if (!dd) throw new Error("zero denominator");
  if (dd < 0n) { nn = -nn; dd = -dd; } const g = gcd(nn, dd);
  return Object.freeze({ numerator: nn / g, denominator: dd / g });
}
export const add = (a: Rational, b: Rational) => rat(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
export const sub = (a: Rational, b: Rational) => rat(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
export const mul = (a: Rational, b: Rational) => rat(a.numerator * b.numerator, a.denominator * b.denominator);
export const div = (a: Rational, b: Rational) => { if (!b.numerator) throw new Error("divide by zero"); return rat(a.numerator * b.denominator, a.denominator * b.numerator); };
export const pow = (a: Rational, n: number) => { if (!Number.isInteger(n) || n < 0) throw new Error("bad power"); return rat(a.numerator ** BigInt(n), a.denominator ** BigInt(n)); };
export const eq = (a: Rational, b: Rational) => a.numerator === b.numerator && a.denominator === b.denominator;
export const integer = (a: Rational) => a.denominator === 1n ? Number(a.numerator) : null;

export function hash(text: string): number { let h = 2166136261; for (const ch of text) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function pick<T>(xs: readonly T[], seed: string, key: string): T { return xs[hash(`${seed}:${key}`) % xs.length]!; }

export const INT_CP003_QL_IDS = [
  "INT-QL-053","INT-QL-054","INT-QL-055","INT-QL-056","INT-QL-057","INT-QL-058","INT-QL-059",
  "INT-QL-060","INT-QL-061","INT-QL-062","INT-QL-063","INT-QL-064","INT-QL-065","INT-QL-066",
] as const;
export type IntCp003QlId = typeof INT_CP003_QL_IDS[number];
export const INT_CP003_LEGACY_FAMILIES = [
  "int_ci_amount_annual","int_ci_from_amount","int_ci_principal_from_amount","int_ci_rate_from_amount","int_ci_time_from_amount",
  "int_ci_two_year_formula","int_ci_three_year_formula","int_ci_sum_doubles","int_ci_amount_multiplier_gap","int_ci_specific_year_isolation",
  "int_ci_nth_year_interest_from_principal","int_amount_ratio_find_rate_ci","int_amount_ratio_find_time_ci","int_ci_specific_year_rate_principal",
] as const;
export type IntCp003LegacyFamily = typeof INT_CP003_LEGACY_FAMILIES[number];

export interface Cp003RegistryEntry {
  qlId: IntCp003QlId; solveContract: string; answerSemantic: Cp003Semantic;
  taskDirection: "FORWARD"|"INVERSE"|"RECONSTRUCTION"|"COMPARISON"; title: string;
  legacyFamilies: readonly IntCp003LegacyFamily[]; sourceDisposition: string;
  active: false; questionStudioDiscoverable: false; publiclyPublishable: false;
}
const reg = (qlId: IntCp003QlId, solveContract: string, answerSemantic: Cp003Semantic, taskDirection: Cp003RegistryEntry["taskDirection"], title: string, legacyFamilies: readonly IntCp003LegacyFamily[], sourceDisposition: string): Cp003RegistryEntry => Object.freeze({ qlId, solveContract, answerSemantic, taskDirection, title, legacyFamilies, sourceDisposition, active:false, questionStudioDiscoverable:false, publiclyPublishable:false });
export const INT_CP003_FINAL_REGISTRY: readonly Cp003RegistryEntry[] = Object.freeze([
  reg("INT-QL-053","FIND_ANNUAL_COMPOUND_AMOUNT","MONEY","FORWARD","Annual compound amount",["int_ci_amount_annual","int_ci_two_year_formula","int_ci_three_year_formula"],"Duration-specific shortcuts are parameters."),
  reg("INT-QL-054","FIND_ANNUAL_COMPOUND_INTEREST","MONEY","FORWARD","Annual compound interest",["int_ci_from_amount"],"Interest and amount remain separate answer contracts."),
  reg("INT-QL-055","FIND_PRINCIPAL_FROM_COMPOUND_AMOUNT","PRINCIPAL","INVERSE","Principal from amount",["int_ci_principal_from_amount"],"Exact amount inverse."),
  reg("INT-QL-056","FIND_PRINCIPAL_FROM_COMPOUND_INTEREST","PRINCIPAL","INVERSE","Principal from compound interest",[],"Inverse closure distinct from amount."),
  reg("INT-QL-057","FIND_ANNUAL_RATE_FROM_AMOUNT_OR_FACTOR","RATE_PERCENT","INVERSE","Rate from amount or factor",["int_ci_rate_from_amount","int_ci_sum_doubles","int_amount_ratio_find_rate_ci"],"Amount multiples are factor representations."),
  reg("INT-QL-058","FIND_COMPLETE_YEARS_FROM_AMOUNT_OR_FACTOR","TIME_YEARS","INVERSE","Years from amount or factor",["int_ci_time_from_amount","int_amount_ratio_find_time_ci"],"Bounded exact period matching."),
  reg("INT-QL-059","FIND_SPECIFIED_YEAR_INTEREST","MONEY","FORWARD","Specified-year interest",["int_ci_specific_year_isolation","int_ci_nth_year_interest_from_principal"],"Specific/nth-year wording merges."),
  reg("INT-QL-060","FIND_PRINCIPAL_FROM_SPECIFIED_YEAR_INTEREST","PRINCIPAL","INVERSE","Principal from yearly interest",["int_ci_specific_year_rate_principal"],"Principal inverse."),
  reg("INT-QL-061","FIND_RATE_FROM_SPECIFIED_YEAR_INTEREST","RATE_PERCENT","INVERSE","Rate from yearly interest",["int_ci_specific_year_rate_principal"],"Bounded rate inverse."),
  reg("INT-QL-062","FIND_PREVIOUS_YEAR_AMOUNT","MONEY","RECONSTRUCTION","Previous annual balance",["int_ci_amount_multiplier_gap"],"Reverse one annual transition."),
  reg("INT-QL-063","FIND_RATE_FROM_CONSECUTIVE_AMOUNTS","RATE_PERCENT","RECONSTRUCTION","Rate from consecutive balances",["int_ci_amount_multiplier_gap"],"One-year factor reconstruction."),
  reg("INT-QL-064","FIND_PRINCIPAL_FROM_CONSECUTIVE_AMOUNTS","PRINCIPAL","RECONSTRUCTION","Principal from consecutive balances",["int_ci_amount_multiplier_gap"],"Factor then principal reconstruction."),
  reg("INT-QL-065","FIND_AMOUNT_DIFFERENCE_BETWEEN_DURATIONS","MONEY","COMPARISON","Amount difference",[],"Pure CI duration comparison; SI-CI stays CP-006."),
  reg("INT-QL-066","FIND_LATER_YEAR_INTEREST_FROM_EARLIER_YEAR","MONEY","RECONSTRUCTION","Later yearly interest",["int_ci_specific_year_isolation","int_ci_nth_year_interest_from_principal"],"Yearly interests form a GP."),
]);
const REG = new Map(INT_CP003_FINAL_REGISTRY.map(x => [x.qlId, x]));
export function getIntCp003RegistryEntry(id: IntCp003QlId): Cp003RegistryEntry { const x = REG.get(id); if (!x) throw new Error(`unknown ${id}`); return x; }

export interface AnnualState { principal:Rational; ratePercent:Rational; years:number; specifiedYear:number; earlierYear:number; laterYear:number; observationYear:number; representation:Cp003Representation; useGrowthFactorEvidence:boolean }
const RATES=[10,20,25,50] as const; const REPS:Cp003Representation[]=["NARRATIVE","TABLE","BALANCE_LEDGER","GROWTH_FACTOR_CARD"];
export function stateFor(id:IntCp003QlId,seed:string):AnnualState {
  const rate=pick(RATES,seed,`${id}:r`), f=factor(rat(rate)), base=BigInt(1+hash(`${seed}:${id}:p`)%7), earlierYear=1+hash(`${seed}:${id}:e`)%2;
  return Object.freeze({ principal:rat(10n*(f.denominator**4n)*base), ratePercent:rat(rate), years:2+hash(`${seed}:${id}:n`)%3,
    specifiedYear:2+hash(`${seed}:${id}:k`)%3, earlierYear,
    laterYear:earlierYear+1+hash(`${seed}:${id}:l`)%2, observationYear:1+hash(`${seed}:${id}:o`)%3,
    representation:pick(REPS,seed,`${id}:rep`), useGrowthFactorEvidence:hash(`${seed}:${id}:gf`)%2===0 });
}
export const factor=(r:Rational)=>add(rat(1),div(r,rat(100)));
export const amount=(p:Rational,r:Rational,n:number)=>mul(p,pow(factor(r),n));
export function amountLoop(p:Rational,r:Rational,n:number):Rational { let b=p; for(let i=0;i<n;i++) b=mul(b,factor(r)); return b; }
export function yearInterest(p:Rational,r:Rational,k:number):Rational { const a=amountLoop(p,r,k-1), b=mul(a,factor(r)); return sub(b,a); }
export function canonical(id:IntCp003QlId,s:AnnualState):Rational {
  const a=amount(s.principal,s.ratePercent,s.years);
  switch(id){
    case"INT-QL-053":return a; case"INT-QL-054":return sub(a,s.principal); case"INT-QL-055":case"INT-QL-056":case"INT-QL-060":case"INT-QL-064":return s.principal;
    case"INT-QL-057":case"INT-QL-061":case"INT-QL-063":return s.ratePercent; case"INT-QL-058":return rat(s.years);
    case"INT-QL-059":return yearInterest(s.principal,s.ratePercent,s.specifiedYear);
    case"INT-QL-062":return amount(s.principal,s.ratePercent,s.observationYear-1);
    case"INT-QL-065":return sub(amount(s.principal,s.ratePercent,s.laterYear),amount(s.principal,s.ratePercent,s.earlierYear));
    case"INT-QL-066":return yearInterest(s.principal,s.ratePercent,s.laterYear);
  }
}
export function verify(id:IntCp003QlId,s:AnnualState,c:Rational):boolean {
  if(c.numerator<=0n)return false; const A=amountLoop(s.principal,s.ratePercent,s.years), I=sub(A,s.principal), J=yearInterest(s.principal,s.ratePercent,s.specifiedYear), O=amountLoop(s.principal,s.ratePercent,s.observationYear), N=amountLoop(s.principal,s.ratePercent,s.observationYear+1);
  switch(id){
    case"INT-QL-053":return eq(c,A); case"INT-QL-054":return eq(c,I); case"INT-QL-055":return eq(amountLoop(c,s.ratePercent,s.years),A); case"INT-QL-056":return eq(sub(amountLoop(c,s.ratePercent,s.years),c),I);
    case"INT-QL-057":return integer(c)!==null&&eq(amountLoop(s.principal,c,s.years),A); case"INT-QL-058":{const n=integer(c);return n!==null&&n>0&&n<13&&eq(amountLoop(s.principal,s.ratePercent,n),A)}
    case"INT-QL-059":return eq(c,J); case"INT-QL-060":return eq(yearInterest(c,s.ratePercent,s.specifiedYear),J); case"INT-QL-061":return integer(c)!==null&&eq(yearInterest(s.principal,c,s.specifiedYear),J);
    case"INT-QL-062":return eq(mul(c,factor(s.ratePercent)),O); case"INT-QL-063":return integer(c)!==null&&eq(mul(O,factor(c)),N); case"INT-QL-064":return eq(amountLoop(c,s.ratePercent,s.observationYear),O)&&eq(amountLoop(c,s.ratePercent,s.observationYear+1),N);
    case"INT-QL-065":return eq(c,sub(amountLoop(s.principal,s.ratePercent,s.laterYear),amountLoop(s.principal,s.ratePercent,s.earlierYear)));
    case"INT-QL-066":return eq(c,mul(yearInterest(s.principal,s.ratePercent,s.earlierYear),pow(factor(s.ratePercent),s.laterYear-s.earlierYear)));
  }
}
