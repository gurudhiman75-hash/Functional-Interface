import { add, div, eq, hash, mul, rat, sub, type Rational } from "./cp003-exam-model";

export const INT_CP008_DISCOVERY_VERSION = "INT-CP-008-DISCOVERY-WAVE01-v1" as const;

export const INT_CP008_PROTOTYPE_IDS = Object.freeze([
  "INT-CP008-PROT-001",
  "INT-CP008-PROT-002",
  "INT-CP008-PROT-003",
  "INT-CP008-PROT-004",
  "INT-CP008-PROT-005",
  "INT-CP008-PROT-006",
  "INT-CP008-PROT-007",
  "INT-CP008-PROT-008",
  "INT-CP008-PROT-009",
  "INT-CP008-PROT-010",
  "INT-CP008-PROT-011",
] as const);

export type IntCp008PrototypeId = (typeof INT_CP008_PROTOTYPE_IDS)[number];
export type IntCp008PeriodUnit = "YEAR" | "HALF_YEAR";
export type IntCp008AnswerSemantic =
  | "INSTALLMENT_AMOUNT"
  | "OPENING_BALANCE"
  | "OUTSTANDING_BALANCE"
  | "FINAL_BALANCING_PAYMENT"
  | "PERIODIC_RATE_PERCENT"
  | "FUTURE_FUND"
  | "EXTRA_PAYMENT"
  | "INSTALLMENT_DIFFERENCE";

interface CommonSchedule {
  readonly periodicRatePercent: Rational;
  readonly periods: number;
  readonly periodUnit: IntCp008PeriodUnit;
}

type EqualInstallmentState = CommonSchedule & Readonly<{ prototypeId: "INT-CP008-PROT-001"; openingBalance: Rational }>;
type OpeningBalanceState = CommonSchedule & Readonly<{ prototypeId: "INT-CP008-PROT-002"; installment: Rational }>;
type OutstandingBalanceState = CommonSchedule & Readonly<{ prototypeId: "INT-CP008-PROT-003"; openingBalance: Rational; installment: Rational; afterPayments: number }>;
type FinalBalancingState = CommonSchedule & Readonly<{ prototypeId: "INT-CP008-PROT-004"; openingBalance: Rational; regularInstallment: Rational }>;
type BeginningInstallmentState = CommonSchedule & Readonly<{ prototypeId: "INT-CP008-PROT-005"; openingBalance: Rational }>;
type DownPaymentState = CommonSchedule & Readonly<{ prototypeId: "INT-CP008-PROT-006"; purchasePrice: Rational; downPayment: Rational }>;
type RecoverRateState = Omit<CommonSchedule, "periodicRatePercent"> & Readonly<{ prototypeId: "INT-CP008-PROT-007"; openingBalance: Rational; installment: Rational }>;
type RecurringSavingsState = CommonSchedule & Readonly<{ prototypeId: "INT-CP008-PROT-008"; deposit: Rational }>;
type WithdrawalFundState = CommonSchedule & Readonly<{ prototypeId: "INT-CP008-PROT-009"; withdrawal: Rational }>;
type MissedInstallmentState = CommonSchedule & Readonly<{ prototypeId: "INT-CP008-PROT-010"; openingBalance: Rational; installment: Rational; missedPaymentNumber: number }>;
type CompareInstallmentState = Readonly<{ prototypeId: "INT-CP008-PROT-011"; openingBalance: Rational; rateAPercent: Rational; rateBPercent: Rational; periods: number; periodUnit: IntCp008PeriodUnit }>;

export type IntCp008PrototypeState = EqualInstallmentState | OpeningBalanceState | OutstandingBalanceState | FinalBalancingState | BeginningInstallmentState | DownPaymentState | RecoverRateState | RecurringSavingsState | WithdrawalFundState | MissedInstallmentState | CompareInstallmentState;

export const INT_CP008_RATE_LIBRARY = Object.freeze([rat(5n), rat(10n), rat(20n), rat(25n)] as const);
const PERIODS = Object.freeze([2, 3, 4] as const);
const BASES = Object.freeze([1n, 2n, 5n, 10n] as const);
const OPENING_BALANCES = Object.freeze([10000n, 20000n, 40000n, 50000n, 80000n] as const);

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}
function pick<T>(values: readonly T[], seed: string, salt: string): T { return values[hash(`${seed}:${salt}`) % values.length]!; }
function abs(value: Rational): Rational { return value.numerator < 0n ? rat(-value.numerator, value.denominator) : value; }
function rateDecimal(ratePercent: Rational): Rational { return div(ratePercent, rat(100n)); }

export function intCp008GrowthFactor(ratePercent: Rational): Rational { return add(rat(1n), rateDecimal(ratePercent)); }
export function intCp008Pow(base: Rational, exponent: number): Rational {
  if (!Number.isInteger(exponent) || exponent < 0) throw new Error(`CP008 invalid exponent ${exponent}`);
  let result = rat(1n);
  for (let index = 0; index < exponent; index += 1) result = mul(result, base);
  return result;
}
export function intCp008GeometricSum(factor: Rational, terms: number): Rational {
  if (!Number.isInteger(terms) || terms < 1) throw new Error(`CP008 invalid term count ${terms}`);
  let sum = rat(0n), power = rat(1n);
  for (let index = 0; index < terms; index += 1) { sum = add(sum, power); power = mul(power, factor); }
  return sum;
}
export function intCp008EndInstallment(openingBalance: Rational, ratePercent: Rational, periods: number): Rational {
  const factor = intCp008GrowthFactor(ratePercent);
  return div(mul(openingBalance, intCp008Pow(factor, periods)), intCp008GeometricSum(factor, periods));
}
export function intCp008OpeningForEndInstallment(installment: Rational, ratePercent: Rational, periods: number): Rational {
  const factor = intCp008GrowthFactor(ratePercent);
  return div(mul(installment, intCp008GeometricSum(factor, periods)), intCp008Pow(factor, periods));
}
export function intCp008BeginningInstallment(openingBalance: Rational, ratePercent: Rational, periods: number): Rational {
  const factor = intCp008GrowthFactor(ratePercent);
  return div(mul(openingBalance, intCp008Pow(factor, periods - 1)), intCp008GeometricSum(factor, periods));
}
export function intCp008OpeningForBeginningInstallment(installment: Rational, ratePercent: Rational, periods: number): Rational {
  const factor = intCp008GrowthFactor(ratePercent);
  return div(mul(installment, intCp008GeometricSum(factor, periods)), intCp008Pow(factor, periods - 1));
}
export function intCp008EndPaymentBalance(openingBalance: Rational, ratePercent: Rational, installment: Rational, payments: number): Rational {
  const factor = intCp008GrowthFactor(ratePercent); let balance = openingBalance;
  for (let index = 0; index < payments; index += 1) balance = sub(mul(balance, factor), installment);
  return balance;
}
export function intCp008BeginningPaymentBalance(openingBalance: Rational, ratePercent: Rational, installment: Rational, payments: number): Rational {
  const factor = intCp008GrowthFactor(ratePercent); let balance = openingBalance;
  for (let index = 0; index < payments; index += 1) balance = mul(sub(balance, installment), factor);
  return balance;
}
export function intCp008RecurringDepositFutureValue(deposit: Rational, ratePercent: Rational, periods: number): Rational {
  return mul(deposit, intCp008GeometricSum(intCp008GrowthFactor(ratePercent), periods));
}
function recurrenceInstallmentFromOpening(openingBalance: Rational, ratePercent: Rational, periods: number): Rational {
  const factor = intCp008GrowthFactor(ratePercent); let noPaymentBalance = openingBalance; let oneUnitPaymentAccumulation = rat(0n);
  for (let index = 0; index < periods; index += 1) { noPaymentBalance = mul(noPaymentBalance, factor); oneUnitPaymentAccumulation = add(mul(oneUnitPaymentAccumulation, factor), rat(1n)); }
  return div(noPaymentBalance, oneUnitPaymentAccumulation);
}

function baseSchedule(seed: string, salt: string) {
  const periodicRatePercent = pick(INT_CP008_RATE_LIBRARY.slice(1), seed, `${salt}:rate`);
  const periods = pick(PERIODS, seed, `${salt}:periods`);
  const periodUnit = pick(["YEAR", "HALF_YEAR"] as const, seed, `${salt}:unit`);
  const factor = intCp008GrowthFactor(periodicRatePercent);
  const installment = rat(pick(BASES, seed, `${salt}:base`) * (factor.numerator ** BigInt(periods)));
  const openingBalance = intCp008OpeningForEndInstallment(installment, periodicRatePercent, periods);
  if (openingBalance.denominator !== 1n) throw new Error(`${salt}: friendly opening balance is not integral`);
  return deepFreeze({ periodicRatePercent, periods, periodUnit, installment, openingBalance });
}
function beginningSchedule(seed: string, salt: string) {
  const periodicRatePercent = pick(INT_CP008_RATE_LIBRARY.slice(1), seed, `${salt}:rate`);
  const periods = pick(PERIODS, seed, `${salt}:periods`);
  const periodUnit = pick(["YEAR", "HALF_YEAR"] as const, seed, `${salt}:unit`);
  const factor = intCp008GrowthFactor(periodicRatePercent);
  const installment = rat(pick(BASES, seed, `${salt}:base`) * (factor.numerator ** BigInt(periods - 1)));
  const openingBalance = intCp008OpeningForBeginningInstallment(installment, periodicRatePercent, periods);
  if (openingBalance.denominator !== 1n) throw new Error(`${salt}: friendly beginning-payment opening is not integral`);
  return deepFreeze({ periodicRatePercent, periods, periodUnit, installment, openingBalance });
}

export function constructIntCp008PrototypeState(prototypeId: IntCp008PrototypeId, seed: string): IntCp008PrototypeState {
  switch (prototypeId) {
    case "INT-CP008-PROT-001": { const s = baseSchedule(seed, prototypeId); return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periods: s.periods, periodUnit: s.periodUnit, openingBalance: s.openingBalance }); }
    case "INT-CP008-PROT-002": { const s = baseSchedule(seed, prototypeId); return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periods: s.periods, periodUnit: s.periodUnit, installment: s.installment }); }
    case "INT-CP008-PROT-003": { const s = baseSchedule(seed, prototypeId); return deepFreeze({ prototypeId, ...s, afterPayments: 1 + hash(`${seed}:${prototypeId}:after`) % (s.periods - 1) }); }
    case "INT-CP008-PROT-004": { const s = baseSchedule(seed, prototypeId); return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periods: s.periods, periodUnit: s.periodUnit, openingBalance: s.openingBalance, regularInstallment: mul(s.installment, rat(9n, 10n)) }); }
    case "INT-CP008-PROT-005": { const s = beginningSchedule(seed, prototypeId); return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periods: s.periods, periodUnit: s.periodUnit, openingBalance: s.openingBalance }); }
    case "INT-CP008-PROT-006": { const s = baseSchedule(seed, prototypeId); const downPayment = rat(BigInt(1000 + 500 * (hash(`${seed}:${prototypeId}:down`) % 7))); return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periods: s.periods, periodUnit: s.periodUnit, purchasePrice: add(s.openingBalance, downPayment), downPayment }); }
    case "INT-CP008-PROT-007": { const s = baseSchedule(seed, prototypeId); return deepFreeze({ prototypeId, periods: s.periods, periodUnit: s.periodUnit, openingBalance: s.openingBalance, installment: s.installment }); }
    case "INT-CP008-PROT-008": { const periodicRatePercent = pick(INT_CP008_RATE_LIBRARY, seed, `${prototypeId}:rate`); const periods = pick(PERIODS, seed, `${prototypeId}:periods`); const periodUnit = pick(["YEAR", "HALF_YEAR"] as const, seed, `${prototypeId}:unit`); const deposit = rat(BigInt(500 * (1 + hash(`${seed}:${prototypeId}:deposit`) % 12))); return deepFreeze({ prototypeId, periodicRatePercent, periods, periodUnit, deposit }); }
    case "INT-CP008-PROT-009": { const s = baseSchedule(seed, prototypeId); return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periods: s.periods, periodUnit: s.periodUnit, withdrawal: s.installment }); }
    case "INT-CP008-PROT-010": { const s = baseSchedule(seed, prototypeId); return deepFreeze({ prototypeId, ...s, missedPaymentNumber: 1 + hash(`${seed}:${prototypeId}:missed`) % (s.periods - 1) }); }
    case "INT-CP008-PROT-011": { const periods = pick([2, 3] as const, seed, `${prototypeId}:periods`); const periodUnit = pick(["YEAR", "HALF_YEAR"] as const, seed, `${prototypeId}:unit`); const openingBalance = rat(pick(OPENING_BALANCES, seed, `${prototypeId}:opening`)); const rateAIndex = hash(`${seed}:${prototypeId}:rateA`) % INT_CP008_RATE_LIBRARY.length; let rateBIndex = hash(`${seed}:${prototypeId}:rateB`) % INT_CP008_RATE_LIBRARY.length; if (rateBIndex === rateAIndex) rateBIndex = (rateBIndex + 1) % INT_CP008_RATE_LIBRARY.length; return deepFreeze({ prototypeId, openingBalance, rateAPercent: INT_CP008_RATE_LIBRARY[rateAIndex]!, rateBPercent: INT_CP008_RATE_LIBRARY[rateBIndex]!, periods, periodUnit }); }
  }
}

export function answerSemanticForIntCp008Prototype(prototypeId: IntCp008PrototypeId): IntCp008AnswerSemantic {
  switch (prototypeId) {
    case "INT-CP008-PROT-001": case "INT-CP008-PROT-005": case "INT-CP008-PROT-006": return "INSTALLMENT_AMOUNT";
    case "INT-CP008-PROT-002": case "INT-CP008-PROT-009": return "OPENING_BALANCE";
    case "INT-CP008-PROT-003": return "OUTSTANDING_BALANCE";
    case "INT-CP008-PROT-004": return "FINAL_BALANCING_PAYMENT";
    case "INT-CP008-PROT-007": return "PERIODIC_RATE_PERCENT";
    case "INT-CP008-PROT-008": return "FUTURE_FUND";
    case "INT-CP008-PROT-010": return "EXTRA_PAYMENT";
    case "INT-CP008-PROT-011": return "INSTALLMENT_DIFFERENCE";
  }
}

export function solveIntCp008Prototype(state: IntCp008PrototypeState): Rational {
  switch (state.prototypeId) {
    case "INT-CP008-PROT-001": return intCp008EndInstallment(state.openingBalance, state.periodicRatePercent, state.periods);
    case "INT-CP008-PROT-002": return intCp008OpeningForEndInstallment(state.installment, state.periodicRatePercent, state.periods);
    case "INT-CP008-PROT-003": return intCp008EndPaymentBalance(state.openingBalance, state.periodicRatePercent, state.installment, state.afterPayments);
    case "INT-CP008-PROT-004": return mul(intCp008EndPaymentBalance(state.openingBalance, state.periodicRatePercent, state.regularInstallment, state.periods - 1), intCp008GrowthFactor(state.periodicRatePercent));
    case "INT-CP008-PROT-005": return intCp008BeginningInstallment(state.openingBalance, state.periodicRatePercent, state.periods);
    case "INT-CP008-PROT-006": return intCp008EndInstallment(sub(state.purchasePrice, state.downPayment), state.periodicRatePercent, state.periods);
    case "INT-CP008-PROT-007": { const matches = INT_CP008_RATE_LIBRARY.filter((candidate) => eq(intCp008EndPaymentBalance(state.openingBalance, candidate, state.installment, state.periods), rat(0n))); if (matches.length !== 1) throw new Error(`${state.prototypeId}: expected one bounded exact rate, found ${matches.length}`); return matches[0]!; }
    case "INT-CP008-PROT-008": return intCp008RecurringDepositFutureValue(state.deposit, state.periodicRatePercent, state.periods);
    case "INT-CP008-PROT-009": return intCp008OpeningForEndInstallment(state.withdrawal, state.periodicRatePercent, state.periods);
    case "INT-CP008-PROT-010": return mul(state.installment, intCp008Pow(intCp008GrowthFactor(state.periodicRatePercent), state.periods - state.missedPaymentNumber));
    case "INT-CP008-PROT-011": return abs(sub(intCp008EndInstallment(state.openingBalance, state.rateAPercent, state.periods), intCp008EndInstallment(state.openingBalance, state.rateBPercent, state.periods)));
  }
}

export function verifyIntCp008PrototypeAnswer(state: IntCp008PrototypeState, candidate: Rational): boolean {
  if (candidate.numerator < 0n) return false;
  switch (state.prototypeId) {
    case "INT-CP008-PROT-001": return eq(intCp008EndPaymentBalance(state.openingBalance, state.periodicRatePercent, candidate, state.periods), rat(0n));
    case "INT-CP008-PROT-002": return eq(intCp008EndPaymentBalance(candidate, state.periodicRatePercent, state.installment, state.periods), rat(0n));
    case "INT-CP008-PROT-003": return eq(candidate, intCp008EndPaymentBalance(state.openingBalance, state.periodicRatePercent, state.installment, state.afterPayments));
    case "INT-CP008-PROT-004": { const beforeFinal = intCp008EndPaymentBalance(state.openingBalance, state.periodicRatePercent, state.regularInstallment, state.periods - 1); return eq(sub(mul(beforeFinal, intCp008GrowthFactor(state.periodicRatePercent)), candidate), rat(0n)); }
    case "INT-CP008-PROT-005": return eq(intCp008BeginningPaymentBalance(state.openingBalance, state.periodicRatePercent, candidate, state.periods), rat(0n));
    case "INT-CP008-PROT-006": return eq(intCp008EndPaymentBalance(sub(state.purchasePrice, state.downPayment), state.periodicRatePercent, candidate, state.periods), rat(0n));
    case "INT-CP008-PROT-007": return INT_CP008_RATE_LIBRARY.some((rate) => eq(rate, candidate)) && eq(intCp008EndPaymentBalance(state.openingBalance, candidate, state.installment, state.periods), rat(0n));
    case "INT-CP008-PROT-008": { const factor = intCp008GrowthFactor(state.periodicRatePercent); let balance = rat(0n); for (let i = 0; i < state.periods; i += 1) balance = add(mul(balance, factor), state.deposit); return eq(candidate, balance); }
    case "INT-CP008-PROT-009": return eq(intCp008EndPaymentBalance(candidate, state.periodicRatePercent, state.withdrawal, state.periods), rat(0n));
    case "INT-CP008-PROT-010": { const factor = intCp008GrowthFactor(state.periodicRatePercent); let balance = state.openingBalance; for (let paymentNumber = 1; paymentNumber <= state.periods; paymentNumber += 1) { balance = mul(balance, factor); if (paymentNumber === state.missedPaymentNumber) continue; const payment = paymentNumber === state.periods ? add(state.installment, candidate) : state.installment; balance = sub(balance, payment); } return eq(balance, rat(0n)); }
    case "INT-CP008-PROT-011": return eq(candidate, abs(sub(recurrenceInstallmentFromOpening(state.openingBalance, state.rateAPercent, state.periods), recurrenceInstallmentFromOpening(state.openingBalance, state.rateBPercent, state.periods))));
  }
}

function rationalKey(value: Rational): string { return `${value.numerator}/${value.denominator}`; }
export function displayIntCp008Rational(value: Rational): string { return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`; }
function money(value: Rational): string { return `₹${displayIntCp008Rational(value)}`; }
function rate(value: Rational): string { return `${displayIntCp008Rational(value)}%`; }
function periodLabel(unit: IntCp008PeriodUnit): string { return unit === "YEAR" ? "year" : "half-year"; }

function stemsFor(state: IntCp008PrototypeState): readonly string[] {
  const unit = periodLabel(state.periodUnit);
  switch (state.prototypeId) {
    case "INT-CP008-PROT-001": return [`A debt of ${money(state.openingBalance)} is repaid by ${state.periods} equal ${unit}-end instalments at ${rate(state.periodicRatePercent)} per ${unit}. Find each instalment.`, `${money(state.openingBalance)} is outstanding. Interest is ${rate(state.periodicRatePercent)} per ${unit}, and the balance is cleared by ${state.periods} equal payments made at each ${unit}'s end. Find the payment.`, `Find the equal end-of-${unit} instalment that clears ${money(state.openingBalance)} in ${state.periods} payments when the periodic rate is ${rate(state.periodicRatePercent)}.`];
    case "INT-CP008-PROT-002": return [`${state.periods} equal ${unit}-end instalments of ${money(state.installment)} clear a loan charging ${rate(state.periodicRatePercent)} per ${unit}. Find the original loan.`, `A loan is fully repaid by ${state.periods} payments of ${money(state.installment)} at the end of each ${unit}, with interest at ${rate(state.periodicRatePercent)} per ${unit}. What was borrowed?`, `Find the opening balance corresponding to ${state.periods} equal end-of-${unit} payments of ${money(state.installment)} at ${rate(state.periodicRatePercent)} per ${unit}.`];
    case "INT-CP008-PROT-003": return [`A loan of ${money(state.openingBalance)} carries ${rate(state.periodicRatePercent)} per ${unit} and is repaid by equal instalments of ${money(state.installment)}. Find the balance just after payment ${state.afterPayments}.`, `Starting from ${money(state.openingBalance)}, apply ${rate(state.periodicRatePercent)} interest each ${unit} and then pay ${money(state.installment)}. What remains after ${state.afterPayments} payment(s)?`, `Find the outstanding balance after ${state.afterPayments} end-of-${unit} instalment(s) of ${money(state.installment)} on an opening debt of ${money(state.openingBalance)} at ${rate(state.periodicRatePercent)} per ${unit}.`];
    case "INT-CP008-PROT-004": return [`A debt of ${money(state.openingBalance)} carries ${rate(state.periodicRatePercent)} per ${unit}. The first ${state.periods - 1} end-of-${unit} payments are ${money(state.regularInstallment)} each. Find the final payment that clears the balance.`, `After ${state.periods - 1} regular payments of ${money(state.regularInstallment)}, what balancing payment is due at the end of the next ${unit} on ${money(state.openingBalance)} at ${rate(state.periodicRatePercent)} per ${unit}?`, `Find the last clearing instalment when ${money(state.openingBalance)} is charged ${rate(state.periodicRatePercent)} each ${unit} and the earlier ${state.periods - 1} instalments are ${money(state.regularInstallment)} each.`];
    case "INT-CP008-PROT-005": return [`${money(state.openingBalance)} is cleared by ${state.periods} equal payments made at the beginning of each ${unit}. The rate is ${rate(state.periodicRatePercent)} per ${unit}. Find each payment.`, `Payments are made before interest is applied in each ${unit}. Find the equal payment that clears ${money(state.openingBalance)} in ${state.periods} payments at ${rate(state.periodicRatePercent)} per ${unit}.`, `For a beginning-of-${unit} repayment schedule of ${state.periods} equal payments, find the instalment on ${money(state.openingBalance)} at ${rate(state.periodicRatePercent)} per ${unit}.`];
    case "INT-CP008-PROT-006": return [`An item costs ${money(state.purchasePrice)}. A down payment of ${money(state.downPayment)} is made, and the rest is cleared by ${state.periods} equal end-of-${unit} instalments at ${rate(state.periodicRatePercent)} per ${unit}. Find each instalment.`, `After paying ${money(state.downPayment)} immediately on a price of ${money(state.purchasePrice)}, the financed balance bears ${rate(state.periodicRatePercent)} per ${unit}. Find each of ${state.periods} equal end-of-${unit} payments.`, `Find the equal instalment for the financed part of ${money(state.purchasePrice)} after a ${money(state.downPayment)} down payment, using ${state.periods} end-of-${unit} payments at ${rate(state.periodicRatePercent)} per ${unit}.`];
    case "INT-CP008-PROT-007": return [`A loan of ${money(state.openingBalance)} is exactly cleared by ${state.periods} end-of-${unit} instalments of ${money(state.installment)}. Find the periodic interest rate from the allowed exact rates.`, `${state.periods} equal payments of ${money(state.installment)} clear ${money(state.openingBalance)} when paid at each ${unit}'s end. Determine the exact rate per ${unit}.`, `Which exact periodic rate makes ${money(state.installment)} the equal end-of-${unit} instalment for ${money(state.openingBalance)} over ${state.periods} payments?`];
    case "INT-CP008-PROT-008": return [`${money(state.deposit)} is deposited at the end of each ${unit} for ${state.periods} periods. The fund earns ${rate(state.periodicRatePercent)} per ${unit}. Find the accumulated fund immediately after the last deposit.`, `A saver deposits ${money(state.deposit)} at every ${unit}'s end and earns ${rate(state.periodicRatePercent)} per ${unit}. What is the balance after ${state.periods} deposits?`, `Find the future value of ${state.periods} equal end-of-${unit} deposits of ${money(state.deposit)} at ${rate(state.periodicRatePercent)} per ${unit}.`];
    case "INT-CP008-PROT-009": return [`A fund must support ${state.periods} withdrawals of ${money(state.withdrawal)} at the end of each ${unit}, earning ${rate(state.periodicRatePercent)} per ${unit}. Find the required opening fund.`, `What initial fund, earning ${rate(state.periodicRatePercent)} per ${unit}, is exactly exhausted by ${state.periods} equal end-of-${unit} withdrawals of ${money(state.withdrawal)}?`, `Find the opening balance needed for ${state.periods} equal withdrawals of ${money(state.withdrawal)} made at each ${unit}'s end at ${rate(state.periodicRatePercent)} per ${unit}.`];
    case "INT-CP008-PROT-010": return [`A ${state.periods}-payment loan schedule uses equal end-of-${unit} instalments of ${money(state.installment)} at ${rate(state.periodicRatePercent)} per ${unit}. Payment ${state.missedPaymentNumber} is missed. How much extra must be added to the final scheduled instalment to clear the debt?`, `One instalment is skipped: payment ${state.missedPaymentNumber} of ${state.periods}. The regular instalment is ${money(state.installment)} and the rate is ${rate(state.periodicRatePercent)} per ${unit}. Find the extra amount due with the last instalment.`, `Find the final catch-up addition caused by missing instalment ${state.missedPaymentNumber} in a ${state.periods}-payment end-of-${unit} schedule at ${rate(state.periodicRatePercent)} per ${unit}.`];
    case "INT-CP008-PROT-011": return [`For the same opening debt ${money(state.openingBalance)} and ${state.periods} end-of-${unit} payments, compare rates ${rate(state.rateAPercent)} and ${rate(state.rateBPercent)} per ${unit}. Find the absolute difference between the two equal instalments.`, `${money(state.openingBalance)} is repaid in ${state.periods} equal end-of-${unit} instalments. Find how much the instalment changes when the periodic rate changes from ${rate(state.rateAPercent)} to ${rate(state.rateBPercent)}.`, `Find the difference between the equal instalments required for ${money(state.openingBalance)} over ${state.periods} ${unit}s at periodic rates ${rate(state.rateAPercent)} and ${rate(state.rateBPercent)}.`];
  }
}

function distractors(state: IntCp008PrototypeState, answer: Rational): readonly Rational[] {
  if (state.prototypeId === "INT-CP008-PROT-007") return Object.freeze([answer, ...INT_CP008_RATE_LIBRARY.filter((candidate) => !eq(candidate, answer)).slice(0, 3)]);
  return Object.freeze([answer, mul(answer, rat(9n, 10n)), mul(answer, rat(11n, 10n)), mul(answer, rat(6n, 5n))]);
}
function difficultyFor(prototypeId: IntCp008PrototypeId): "Easy" | "Medium" | "Hard" {
  if (["INT-CP008-PROT-001", "INT-CP008-PROT-002", "INT-CP008-PROT-008"].includes(prototypeId)) return "Easy";
  if (["INT-CP008-PROT-007", "INT-CP008-PROT-010", "INT-CP008-PROT-011"].includes(prototypeId)) return "Hard";
  return "Medium";
}

export function buildIntCp008DiscoveryPackage(prototypeId: IntCp008PrototypeId, seed: string) {
  const state = constructIntCp008PrototypeState(prototypeId, seed); const answer = solveIntCp008Prototype(state);
  if (!verifyIntCp008PrototypeAnswer(state, answer)) throw new Error(`${prototypeId}/${seed}: solver/verifier disagreement`);
  const baseOptions = distractors(state, answer); if (new Set(baseOptions.map(rationalKey)).size !== 4) throw new Error(`${prototypeId}/${seed}: duplicate options`);
  const correctIndex = hash(`${seed}:${prototypeId}:correct-index`) % 4; const options = [...baseOptions]; const [correct] = options.splice(0, 1); options.splice(correctIndex, 0, correct!);
  const stemFamilyIndex = hash(`${seed}:${prototypeId}:stem-family`) % 3;
  return deepFreeze({ discoveryVersion: INT_CP008_DISCOVERY_VERSION, checkpointId: "INT-CP-008" as const, prototypeId, permanentQlId: null, seed, mathematicalState: state, answerSemantic: answerSemanticForIntCp008Prototype(prototypeId), answer, stemFamilyId: `${prototypeId}-T${stemFamilyIndex + 1}`, stem: stemsFor(state)[stemFamilyIndex]!, options: Object.freeze(options), correctIndex, difficulty: difficultyFor(prototypeId), lifecycle: Object.freeze({ permanentQlCount: 0 as const, permanentQlAllocationAuthorized: false as const, enabled: false as const, stagingStatus: "NOT_STAGED" as const, registrationStatus: "NOT_REGISTERED" as const, questionStudioDiscoverable: false as const, questionBankStatus: "NOT_STORED" as const, questionBankWritable: false as const, testEligibility: "INELIGIBLE" as const, publiclyPublishable: false as const }) });
}

export const INT_CP008_DISCOVERY_BOUNDARY = deepFreeze({ owner: "single opening balance + explicitly ordered equal periodic payments/withdrawals", heterogeneousDatedCashFlowsOwner: "INT-CP-009", variableRateInstalmentsOwner: "INT-CP-010_UNLESS_SOURCE_PROVES_CP008_EXTENSION", equalPeriodicCashFlows: true, solverAuthority: "FINITE_GEOMETRIC_SUM", verifierAuthority: "OUTSTANDING_BALANCE_RECURRENCE", permanentQlAllocationAuthorized: false, learnerContentFrozen: false, learnerDeliveryAuthorized: false });
