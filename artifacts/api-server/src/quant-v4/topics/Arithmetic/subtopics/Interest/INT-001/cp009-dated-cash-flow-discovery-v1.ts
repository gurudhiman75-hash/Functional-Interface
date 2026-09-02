import { add, div, eq, hash, mul, rat, sub, type Rational } from "./cp003-exam-model";

export const INT_CP009_DISCOVERY_VERSION = "INT-CP-009-DATED-CASH-FLOW-DISCOVERY-WAVE01-v1" as const;

export const INT_CP009_PROTOTYPE_IDS = Object.freeze([
  "INT-CP009-PROT-001",
  "INT-CP009-PROT-002",
  "INT-CP009-PROT-003",
  "INT-CP009-PROT-004",
  "INT-CP009-PROT-005",
  "INT-CP009-PROT-006",
  "INT-CP009-PROT-007",
  "INT-CP009-PROT-008",
] as const);

export type IntCp009PrototypeId = (typeof INT_CP009_PROTOTYPE_IDS)[number];
export type IntCp009PeriodUnit = "YEAR" | "HALF_YEAR";
export type IntCp009FlowDirection = "DEPOSIT" | "REPAYMENT";
export type IntCp009AnswerSemantic =
  | "FUTURE_FUND"
  | "OPENING_DEBT"
  | "MISSING_REPAYMENT"
  | "OUTSTANDING_BALANCE"
  | "FINAL_BALANCING_PAYMENT"
  | "MISSING_DEPOSIT"
  | "PERIODIC_RATE_PERCENT"
  | "EQUIVALENT_SINGLE_PAYMENT";

export type IntCp009DatedFlow = Readonly<{
  atPeriod: number;
  amount: Rational;
  direction: IntCp009FlowDirection;
}>;

type CommonState = Readonly<{
  periodicRatePercent: Rational;
  periodUnit: IntCp009PeriodUnit;
}>;

type FutureFundState = CommonState & Readonly<{
  prototypeId: "INT-CP009-PROT-001";
  duePeriod: number;
  deposits: readonly IntCp009DatedFlow[];
}>;

type OpeningDebtState = CommonState & Readonly<{
  prototypeId: "INT-CP009-PROT-002";
  repayments: readonly IntCp009DatedFlow[];
}>;

type MissingRepaymentState = CommonState & Readonly<{
  prototypeId: "INT-CP009-PROT-003";
  openingDebt: Rational;
  repayments: readonly IntCp009DatedFlow[];
  missingAtPeriod: number;
}>;

type OutstandingBalanceState = CommonState & Readonly<{
  prototypeId: "INT-CP009-PROT-004";
  openingDebt: Rational;
  repayments: readonly IntCp009DatedFlow[];
  afterPeriod: number;
}>;

type FinalBalancingState = CommonState & Readonly<{
  prototypeId: "INT-CP009-PROT-005";
  openingDebt: Rational;
  knownRepayments: readonly IntCp009DatedFlow[];
  finalPeriod: number;
}>;

type MissingDepositState = CommonState & Readonly<{
  prototypeId: "INT-CP009-PROT-006";
  duePeriod: number;
  targetFund: Rational;
  deposits: readonly IntCp009DatedFlow[];
  missingAtPeriod: number;
}>;

type RecoverRateState = Readonly<{
  prototypeId: "INT-CP009-PROT-007";
  periodUnit: IntCp009PeriodUnit;
  openingDebt: Rational;
  repayments: readonly IntCp009DatedFlow[];
}>;

type EquivalentSingleState = CommonState & Readonly<{
  prototypeId: "INT-CP009-PROT-008";
  repayments: readonly IntCp009DatedFlow[];
  comparisonPeriod: number;
}>;

export type IntCp009PrototypeState =
  | FutureFundState
  | OpeningDebtState
  | MissingRepaymentState
  | OutstandingBalanceState
  | FinalBalancingState
  | MissingDepositState
  | RecoverRateState
  | EquivalentSingleState;

export const INT_CP009_RATE_LIBRARY = Object.freeze([rat(10n), rat(20n), rat(25n)] as const);
const PERIOD_UNITS = Object.freeze(["YEAR", "HALF_YEAR"] as const);
const SCHEDULE_LENGTHS = Object.freeze([3, 4] as const);

export const INT_CP009_MANDATORY_SOURCE_DIRECTIONS = Object.freeze([
  "DEPOSITS_ON_DIFFERENT_DATES",
  "UNEQUAL_REPAYMENTS",
  "CHANGED_MIDDLE_PAYMENT",
] as const);

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
  return Object.freeze(value);
}

function pick<T>(values: readonly T[], seed: string, salt: string): T {
  return values[hash(`${seed}:${salt}`) % values.length]!;
}

function rateDecimal(ratePercent: Rational): Rational {
  return div(ratePercent, rat(100n));
}

export function intCp009GrowthFactor(ratePercent: Rational): Rational {
  return add(rat(1n), rateDecimal(ratePercent));
}

export function intCp009Pow(base: Rational, exponent: number): Rational {
  if (!Number.isInteger(exponent) || exponent < 0) throw new Error(`CP009 invalid exponent ${exponent}`);
  let result = rat(1n);
  for (let index = 0; index < exponent; index += 1) result = mul(result, base);
  return result;
}

export function intCp009ShiftAmount(
  amount: Rational,
  ratePercent: Rational,
  fromPeriod: number,
  toPeriod: number,
): Rational {
  if (!Number.isInteger(fromPeriod) || !Number.isInteger(toPeriod) || fromPeriod < 0 || toPeriod < 0) {
    throw new Error(`CP009 invalid cash-flow timing ${fromPeriod}->${toPeriod}`);
  }
  const factor = intCp009GrowthFactor(ratePercent);
  if (toPeriod >= fromPeriod) return mul(amount, intCp009Pow(factor, toPeriod - fromPeriod));
  return div(amount, intCp009Pow(factor, fromPeriod - toPeriod));
}

export function intCp009EquivalentAt(
  flows: readonly IntCp009DatedFlow[],
  ratePercent: Rational,
  comparisonPeriod: number,
): Rational {
  let total = rat(0n);
  for (const flow of flows) {
    total = add(total, intCp009ShiftAmount(flow.amount, ratePercent, flow.atPeriod, comparisonPeriod));
  }
  return total;
}

export function intCp009FundByRecurrence(
  deposits: readonly IntCp009DatedFlow[],
  ratePercent: Rational,
  duePeriod: number,
): Rational {
  let balance = rat(0n);
  for (const flow of deposits) {
    if (flow.direction !== "DEPOSIT") throw new Error("CP009 fund recurrence received a non-deposit flow");
  }
  for (let period = 0; period <= duePeriod; period += 1) {
    if (period > 0) balance = mul(balance, intCp009GrowthFactor(ratePercent));
    for (const flow of deposits) if (flow.atPeriod === period) balance = add(balance, flow.amount);
  }
  return balance;
}

export function intCp009DebtBalanceByRecurrence(
  openingDebt: Rational,
  repayments: readonly IntCp009DatedFlow[],
  ratePercent: Rational,
  throughPeriod: number,
): Rational {
  let balance = openingDebt;
  for (const flow of repayments) {
    if (flow.direction !== "REPAYMENT") throw new Error("CP009 debt recurrence received a non-repayment flow");
  }
  for (let period = 1; period <= throughPeriod; period += 1) {
    balance = mul(balance, intCp009GrowthFactor(ratePercent));
    for (const flow of repayments) if (flow.atPeriod === period) balance = sub(balance, flow.amount);
  }
  return balance;
}

function repaymentSchedule(seed: string, salt: string, forcedRate?: Rational) {
  const periodicRatePercent = forcedRate ?? pick(INT_CP009_RATE_LIBRARY, seed, `${salt}:rate`);
  const periods = pick(SCHEDULE_LENGTHS, seed, `${salt}:periods`);
  const periodUnit = pick(PERIOD_UNITS, seed, `${salt}:unit`);
  const factor = intCp009GrowthFactor(periodicRatePercent);
  const base = 20n * BigInt(1 + (hash(`${seed}:${salt}:base`) % 5));
  const repayments: IntCp009DatedFlow[] = [];
  for (let period = 1; period <= periods; period += 1) {
    const coefficient = BigInt(1 + ((hash(`${seed}:${salt}:coefficient:${period}`) + period) % 3));
    const amount = rat(base * coefficient * (factor.numerator ** BigInt(period)));
    repayments.push(deepFreeze({ atPeriod: period, amount, direction: "REPAYMENT" as const }));
  }
  const openingDebt = intCp009EquivalentAt(repayments, periodicRatePercent, 0);
  if (openingDebt.denominator !== 1n) throw new Error(`${salt}: friendly opening debt is not integral`);
  return deepFreeze({ periodicRatePercent, periods, periodUnit, repayments: Object.freeze(repayments), openingDebt });
}

function depositSchedule(seed: string, salt: string) {
  const periodicRatePercent = pick(INT_CP009_RATE_LIBRARY, seed, `${salt}:rate`);
  const periodUnit = pick(PERIOD_UNITS, seed, `${salt}:unit`);
  const duePeriod = 4;
  const timingSets = Object.freeze([
    Object.freeze([0, 1, 3] as const),
    Object.freeze([0, 2, 3] as const),
    Object.freeze([1, 2, 3] as const),
  ] as const);
  const timings = pick(timingSets, seed, `${salt}:timings`);
  const factor = intCp009GrowthFactor(periodicRatePercent);
  const base = 20n * BigInt(1 + (hash(`${seed}:${salt}:base`) % 5));
  const deposits: IntCp009DatedFlow[] = timings.map((atPeriod, index) => {
    const coefficient = BigInt(1 + ((hash(`${seed}:${salt}:coefficient:${index}`) + index) % 3));
    const remaining = duePeriod - atPeriod;
    const amount = rat(base * coefficient * (factor.denominator ** BigInt(remaining)));
    return deepFreeze({ atPeriod, amount, direction: "DEPOSIT" as const });
  });
  const targetFund = intCp009EquivalentAt(deposits, periodicRatePercent, duePeriod);
  if (targetFund.denominator !== 1n) throw new Error(`${salt}: friendly target fund is not integral`);
  return deepFreeze({ periodicRatePercent, periodUnit, duePeriod, deposits: Object.freeze(deposits), targetFund });
}

function withoutPeriod(flows: readonly IntCp009DatedFlow[], period: number): readonly IntCp009DatedFlow[] {
  return Object.freeze(flows.filter((flow) => flow.atPeriod !== period));
}

export function constructIntCp009PrototypeState(
  prototypeId: IntCp009PrototypeId,
  seed: string,
): IntCp009PrototypeState {
  switch (prototypeId) {
    case "INT-CP009-PROT-001": {
      const s = depositSchedule(seed, prototypeId);
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, duePeriod: s.duePeriod, deposits: s.deposits });
    }
    case "INT-CP009-PROT-002": {
      const s = repaymentSchedule(seed, prototypeId);
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, repayments: s.repayments });
    }
    case "INT-CP009-PROT-003": {
      const s = repaymentSchedule(seed, prototypeId);
      const missingAtPeriod = s.periods === 3 ? 2 : 2 + (hash(`${seed}:${prototypeId}:missing`) % 2);
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, openingDebt: s.openingDebt, repayments: withoutPeriod(s.repayments, missingAtPeriod), missingAtPeriod });
    }
    case "INT-CP009-PROT-004": {
      const s = repaymentSchedule(seed, prototypeId);
      const afterPeriod = 1 + (hash(`${seed}:${prototypeId}:after`) % (s.periods - 1));
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, openingDebt: s.openingDebt, repayments: s.repayments, afterPeriod });
    }
    case "INT-CP009-PROT-005": {
      const s = repaymentSchedule(seed, prototypeId);
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, openingDebt: s.openingDebt, knownRepayments: Object.freeze(s.repayments.slice(0, -1)), finalPeriod: s.periods });
    }
    case "INT-CP009-PROT-006": {
      const s = depositSchedule(seed, prototypeId);
      const candidatePeriods = s.deposits.map((flow) => flow.atPeriod).filter((period) => period > 0 && period < s.duePeriod);
      const missingAtPeriod = candidatePeriods[hash(`${seed}:${prototypeId}:missing`) % candidatePeriods.length]!;
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, duePeriod: s.duePeriod, targetFund: s.targetFund, deposits: withoutPeriod(s.deposits, missingAtPeriod), missingAtPeriod });
    }
    case "INT-CP009-PROT-007": {
      const rate = pick(INT_CP009_RATE_LIBRARY, seed, `${prototypeId}:forced-rate`);
      const s = repaymentSchedule(seed, prototypeId, rate);
      return deepFreeze({ prototypeId, periodUnit: s.periodUnit, openingDebt: s.openingDebt, repayments: s.repayments });
    }
    case "INT-CP009-PROT-008": {
      const s = repaymentSchedule(seed, prototypeId);
      const comparisonPeriod = Math.min(2, s.periods - 1);
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, repayments: s.repayments, comparisonPeriod });
    }
  }
}

export function answerSemanticForIntCp009Prototype(prototypeId: IntCp009PrototypeId): IntCp009AnswerSemantic {
  switch (prototypeId) {
    case "INT-CP009-PROT-001": return "FUTURE_FUND";
    case "INT-CP009-PROT-002": return "OPENING_DEBT";
    case "INT-CP009-PROT-003": return "MISSING_REPAYMENT";
    case "INT-CP009-PROT-004": return "OUTSTANDING_BALANCE";
    case "INT-CP009-PROT-005": return "FINAL_BALANCING_PAYMENT";
    case "INT-CP009-PROT-006": return "MISSING_DEPOSIT";
    case "INT-CP009-PROT-007": return "PERIODIC_RATE_PERCENT";
    case "INT-CP009-PROT-008": return "EQUIVALENT_SINGLE_PAYMENT";
  }
}

function lastPeriod(flows: readonly IntCp009DatedFlow[]): number {
  return Math.max(...flows.map((flow) => flow.atPeriod));
}

export function solveIntCp009Prototype(state: IntCp009PrototypeState): Rational {
  switch (state.prototypeId) {
    case "INT-CP009-PROT-001":
      return intCp009EquivalentAt(state.deposits, state.periodicRatePercent, state.duePeriod);
    case "INT-CP009-PROT-002":
      return intCp009EquivalentAt(state.repayments, state.periodicRatePercent, 0);
    case "INT-CP009-PROT-003": {
      const duePeriod = Math.max(lastPeriod(state.repayments), state.missingAtPeriod);
      const debtAtDue = intCp009ShiftAmount(state.openingDebt, state.periodicRatePercent, 0, duePeriod);
      const knownAtDue = intCp009EquivalentAt(state.repayments, state.periodicRatePercent, duePeriod);
      return intCp009ShiftAmount(sub(debtAtDue, knownAtDue), state.periodicRatePercent, duePeriod, state.missingAtPeriod);
    }
    case "INT-CP009-PROT-004":
      return intCp009DebtBalanceByRecurrence(state.openingDebt, state.repayments, state.periodicRatePercent, state.afterPeriod);
    case "INT-CP009-PROT-005": {
      const balanceBeforeFinal = intCp009DebtBalanceByRecurrence(state.openingDebt, state.knownRepayments, state.periodicRatePercent, state.finalPeriod - 1);
      return mul(balanceBeforeFinal, intCp009GrowthFactor(state.periodicRatePercent));
    }
    case "INT-CP009-PROT-006": {
      const knownAtDue = intCp009EquivalentAt(state.deposits, state.periodicRatePercent, state.duePeriod);
      return intCp009ShiftAmount(sub(state.targetFund, knownAtDue), state.periodicRatePercent, state.duePeriod, state.missingAtPeriod);
    }
    case "INT-CP009-PROT-007": {
      const finalPeriod = lastPeriod(state.repayments);
      const matches = INT_CP009_RATE_LIBRARY.filter((rate) => eq(intCp009DebtBalanceByRecurrence(state.openingDebt, state.repayments, rate, finalPeriod), rat(0n)));
      if (matches.length !== 1) throw new Error(`${state.prototypeId}: expected one exact rate, found ${matches.length}`);
      return matches[0]!;
    }
    case "INT-CP009-PROT-008":
      return intCp009EquivalentAt(state.repayments, state.periodicRatePercent, state.comparisonPeriod);
  }
}

function insertFlow(
  flows: readonly IntCp009DatedFlow[],
  atPeriod: number,
  amount: Rational,
  direction: IntCp009FlowDirection,
): readonly IntCp009DatedFlow[] {
  return Object.freeze([...flows, deepFreeze({ atPeriod, amount, direction })].sort((a, b) => a.atPeriod - b.atPeriod));
}

export function verifyIntCp009PrototypeAnswer(state: IntCp009PrototypeState, candidate: Rational): boolean {
  switch (state.prototypeId) {
    case "INT-CP009-PROT-001":
      return eq(intCp009FundByRecurrence(state.deposits, state.periodicRatePercent, state.duePeriod), candidate);
    case "INT-CP009-PROT-002": {
      const finalPeriod = lastPeriod(state.repayments);
      return eq(intCp009DebtBalanceByRecurrence(candidate, state.repayments, state.periodicRatePercent, finalPeriod), rat(0n));
    }
    case "INT-CP009-PROT-003": {
      const flows = insertFlow(state.repayments, state.missingAtPeriod, candidate, "REPAYMENT");
      const finalPeriod = lastPeriod(flows);
      return eq(intCp009DebtBalanceByRecurrence(state.openingDebt, flows, state.periodicRatePercent, finalPeriod), rat(0n));
    }
    case "INT-CP009-PROT-004": {
      const futureRepayments = state.repayments.filter((flow) => flow.atPeriod > state.afterPeriod);
      return eq(candidate, intCp009EquivalentAt(futureRepayments, state.periodicRatePercent, state.afterPeriod));
    }
    case "INT-CP009-PROT-005": {
      const flows = insertFlow(state.knownRepayments, state.finalPeriod, candidate, "REPAYMENT");
      return eq(intCp009DebtBalanceByRecurrence(state.openingDebt, flows, state.periodicRatePercent, state.finalPeriod), rat(0n));
    }
    case "INT-CP009-PROT-006": {
      const flows = insertFlow(state.deposits, state.missingAtPeriod, candidate, "DEPOSIT");
      return eq(intCp009FundByRecurrence(flows, state.periodicRatePercent, state.duePeriod), state.targetFund);
    }
    case "INT-CP009-PROT-007": {
      if (!INT_CP009_RATE_LIBRARY.some((rate) => eq(rate, candidate))) return false;
      const finalPeriod = lastPeriod(state.repayments);
      return eq(intCp009DebtBalanceByRecurrence(state.openingDebt, state.repayments, candidate, finalPeriod), rat(0n));
    }
    case "INT-CP009-PROT-008": {
      const duePeriod = lastPeriod(state.repayments);
      const originalAtDue = intCp009EquivalentAt(state.repayments, state.periodicRatePercent, duePeriod);
      const singleAtDue = intCp009ShiftAmount(candidate, state.periodicRatePercent, state.comparisonPeriod, duePeriod);
      return eq(originalAtDue, singleAtDue);
    }
  }
}

function indianInteger(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const source = (value < 0n ? -value : value).toString();
  if (source.length <= 3) return `${sign}${source}`;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}

function money(value: Rational): string {
  let paise = (value.numerator * 100n) / value.denominator;
  const remainder = (value.numerator * 100n) % value.denominator;
  if (remainder * 2n >= value.denominator) paise += 1n;
  const rupees = paise / 100n;
  const p = paise % 100n;
  return p === 0n ? `₹${indianInteger(rupees)}` : `₹${indianInteger(rupees)}.${p.toString().padStart(2, "0")}`;
}

function percent(value: Rational): string {
  if (value.denominator === 1n) return `${value.numerator}%`;
  return `${value.numerator}/${value.denominator}%`;
}

function periodText(period: number, unit: IntCp009PeriodUnit): string {
  if (period === 0) return "today";
  if (unit === "YEAR") return `after ${period} ${period === 1 ? "year" : "years"}`;
  return `after ${period} ${period === 1 ? "half-year period" : "half-year periods"}`;
}

function rateText(rate: Rational, unit: IntCp009PeriodUnit): string {
  return unit === "YEAR"
    ? `${percent(rate)} per year, compounded annually`
    : `${percent(rate)} every half-year`;
}

function listFlows(flows: readonly IntCp009DatedFlow[], unit: IntCp009PeriodUnit): string {
  return flows.map((flow) => `${money(flow.amount)} ${periodText(flow.atPeriod, unit)}`).join(", ");
}

function familyIndex(prototypeId: IntCp009PrototypeId, seed: string): number {
  return hash(`${seed}:${prototypeId}:stem-family`) % 3;
}

function promptFor(state: IntCp009PrototypeState, seed: string): Readonly<{ stemFamilyId: string; prompt: string }> {
  const index = familyIndex(state.prototypeId, seed);
  const familyId = `${state.prototypeId}-T${index + 1}`;
  switch (state.prototypeId) {
    case "INT-CP009-PROT-001": {
      const flows = listFlows(state.deposits, state.periodUnit);
      const due = periodText(state.duePeriod, state.periodUnit);
      const variants = [
        `An account earns ${rateText(state.periodicRatePercent, state.periodUnit)}. Unequal deposits of ${flows} are made. What will the fund be worth ${due}?`,
        `A saver makes deposits of ${flows}. If the account grows at ${rateText(state.periodicRatePercent, state.periodUnit)}, find the accumulated balance ${due}.`,
        `Three differently sized deposits are placed in the same account: ${flows}. At ${rateText(state.periodicRatePercent, state.periodUnit)}, determine their combined value ${due}.`,
      ];
      return deepFreeze({ stemFamilyId: familyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-002": {
      const flows = listFlows(state.repayments, state.periodUnit);
      const variants = [
        `A loan is cleared by unequal repayments of ${flows}. Interest is ${rateText(state.periodicRatePercent, state.periodUnit)}. What was the original loan amount?`,
        `A borrower fully settles a debt through these repayments: ${flows}. If the debt grows at ${rateText(state.periodicRatePercent, state.periodUnit)}, find the opening debt.`,
        `The following unequal payments exactly discharge a loan: ${flows}. Using ${rateText(state.periodicRatePercent, state.periodUnit)}, determine the amount owed today.`,
      ];
      return deepFreeze({ stemFamilyId: familyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-003": {
      const flows = listFlows(state.repayments, state.periodUnit);
      const when = periodText(state.missingAtPeriod, state.periodUnit);
      const variants = [
        `A debt of ${money(state.openingDebt)} carries ${rateText(state.periodicRatePercent, state.periodUnit)}. Known repayments are ${flows}; one changed repayment is made ${when}. If the debt is then exactly cleared, find that changed repayment.`,
        `A borrower owes ${money(state.openingDebt)} today. The recorded repayments are ${flows}, but the repayment ${when} is missing from the record. At ${rateText(state.periodicRatePercent, state.periodUnit)}, what must that missing repayment be for full settlement?`,
        `For a loan of ${money(state.openingDebt)}, the unequal repayment schedule includes ${flows} and one unknown payment ${when}. The rate is ${rateText(state.periodicRatePercent, state.periodUnit)}. Find the unknown payment that closes the account exactly.`,
      ];
      return deepFreeze({ stemFamilyId: familyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-004": {
      const flows = listFlows(state.repayments, state.periodUnit);
      const when = periodText(state.afterPeriod, state.periodUnit);
      const variants = [
        `A loan of ${money(state.openingDebt)} grows at ${rateText(state.periodicRatePercent, state.periodUnit)} and has unequal repayments ${flows}. What balance remains immediately after the repayment ${when}?`,
        `Starting debt is ${money(state.openingDebt)}. The repayment ledger is ${flows} and the rate is ${rateText(state.periodicRatePercent, state.periodUnit)}. Find the outstanding balance just after the payment ${when}.`,
        `A borrower begins with a debt of ${money(state.openingDebt)} and follows the unequal schedule ${flows}. Under ${rateText(state.periodicRatePercent, state.periodUnit)}, determine the balance remaining immediately after ${when}.`,
      ];
      return deepFreeze({ stemFamilyId: familyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-005": {
      const flows = listFlows(state.knownRepayments, state.periodUnit);
      const when = periodText(state.finalPeriod, state.periodUnit);
      const variants = [
        `A loan of ${money(state.openingDebt)} carries ${rateText(state.periodicRatePercent, state.periodUnit)}. Earlier unequal repayments are ${flows}. What final payment ${when} will clear the balance exactly?`,
        `A borrower owes ${money(state.openingDebt)} and makes the repayments ${flows}. At ${rateText(state.periodicRatePercent, state.periodUnit)}, find the balancing repayment required ${when}.`,
        `The opening debt is ${money(state.openingDebt)}. After the unequal payments ${flows}, one last settlement is due ${when}. If interest is ${rateText(state.periodicRatePercent, state.periodUnit)}, determine that final settlement.`,
      ];
      return deepFreeze({ stemFamilyId: familyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-006": {
      const flows = listFlows(state.deposits, state.periodUnit);
      const missing = periodText(state.missingAtPeriod, state.periodUnit);
      const due = periodText(state.duePeriod, state.periodUnit);
      const variants = [
        `A savings fund must reach ${money(state.targetFund)} ${due}. Known deposits are ${flows}, and one deposit is to be made ${missing}. At ${rateText(state.periodicRatePercent, state.periodUnit)}, find the missing deposit.`,
        `The target account value is ${money(state.targetFund)} ${due}. Deposits already specified are ${flows}; the deposit ${missing} is unknown. If the account earns ${rateText(state.periodicRatePercent, state.periodUnit)}, what should that deposit be?`,
        `A saver wants exactly ${money(state.targetFund)} ${due}. With ${rateText(state.periodicRatePercent, state.periodUnit)}, the dated deposits are ${flows} plus an unknown amount ${missing}. Determine the unknown amount.`,
      ];
      return deepFreeze({ stemFamilyId: familyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-007": {
      const flows = listFlows(state.repayments, state.periodUnit);
      const variants = [
        `A loan of ${money(state.openingDebt)} is exactly cleared by unequal repayments of ${flows}. Which periodic compound rate applies?`,
        `A debt starts at ${money(state.openingDebt)} and is fully settled by the schedule ${flows}. Determine the exact rate per ${state.periodUnit === "YEAR" ? "year" : "half-year period"}.`,
        `The opening loan is ${money(state.openingDebt)} and the unequal repayments ${flows} leave no balance. Find the compound interest rate for each ${state.periodUnit === "YEAR" ? "year" : "half-year period"}.`,
      ];
      return deepFreeze({ stemFamilyId: familyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-008": {
      const flows = listFlows(state.repayments, state.periodUnit);
      const when = periodText(state.comparisonPeriod, state.periodUnit);
      const variants = [
        `At ${rateText(state.periodicRatePercent, state.periodUnit)}, the repayments ${flows} are to be replaced by one financially equivalent payment ${when}. What should that single payment be?`,
        `A repayment schedule consists of ${flows}. Using ${rateText(state.periodicRatePercent, state.periodUnit)}, find the one payment ${when} that has the same value as the whole schedule.`,
        `Replace the unequal cash flows ${flows} by a single equivalent repayment ${when}. If money grows at ${rateText(state.periodicRatePercent, state.periodUnit)}, determine the equivalent payment.`,
      ];
      return deepFreeze({ stemFamilyId: familyId, prompt: variants[index]! });
    }
  }
}

function moneyDistractors(correct: Rational, seed: string): readonly Rational[] {
  const step = rat(BigInt(100 + 100 * (hash(`${seed}:money-step`) % 9)));
  const lower = sub(correct, step);
  return Object.freeze([
    lower.numerator > 0n ? lower : add(correct, mul(step, rat(3n))),
    add(correct, step),
    add(correct, mul(step, rat(2n))),
  ]);
}

function candidateOptions(state: IntCp009PrototypeState, correct: Rational, seed: string): readonly Rational[] {
  if (state.prototypeId === "INT-CP009-PROT-007") {
    const others = INT_CP009_RATE_LIBRARY.filter((rate) => !eq(rate, correct));
    const extra = rat(15n);
    return Object.freeze([correct, ...others, ...(others.length < 3 ? [extra] : [])].slice(0, 4));
  }
  return Object.freeze([correct, ...moneyDistractors(correct, seed)]);
}

function shuffleOptions(values: readonly Rational[], seed: string): readonly Rational[] {
  let result = [...values];
  const rotation = hash(`${seed}:option-rotation`) % result.length;
  result = [...result.slice(rotation), ...result.slice(0, rotation)];
  if (hash(`${seed}:option-direction`) % 2 === 1) result.reverse();
  return Object.freeze(result);
}

function explanationFor(state: IntCp009PrototypeState, answer: Rational): Readonly<{ keyIdea: string; steps: readonly string[]; finalAnswer: string }> {
  const rate = state.prototypeId === "INT-CP009-PROT-007" ? answer : state.periodicRatePercent;
  const factor = intCp009GrowthFactor(rate);
  const answerText = state.prototypeId === "INT-CP009-PROT-007" ? percent(answer) : money(answer);
  const common = `For each period, use the exact growth factor ${factor.numerator}/${factor.denominator}. Cash flows at different dates cannot be added until they are moved to a common date.`;
  switch (state.prototypeId) {
    case "INT-CP009-PROT-001":
      return deepFreeze({ keyIdea: common, steps: Object.freeze(["Take the target date as the common comparison date.", "Grow each deposit separately from its own deposit date to the target date.", "Add the accumulated values of all deposits.", `The combined future fund is ${answerText}.`]), finalAnswer: answerText });
    case "INT-CP009-PROT-002":
      return deepFreeze({ keyIdea: common, steps: Object.freeze(["Take today as the comparison date.", "Discount every repayment back by the exact number of periods until today.", "Add those present values because together they exactly clear the debt.", `The opening debt is ${answerText}.`]), finalAnswer: answerText });
    case "INT-CP009-PROT-003":
      return deepFreeze({ keyIdea: common, steps: Object.freeze(["Move the opening debt to the final repayment date.", "Move every known repayment to that same final date and subtract their combined value.", "The remaining value belongs to the missing repayment; move it back to its stated date.", `The missing repayment is ${answerText}.`]), finalAnswer: answerText });
    case "INT-CP009-PROT-004":
      return deepFreeze({ keyIdea: common, steps: Object.freeze(["Start with the opening debt.", "For each completed period, first add that period's interest and then subtract the repayment made at the period end.", "Stop immediately after the requested repayment.", `The outstanding balance is ${answerText}.`]), finalAnswer: answerText });
    case "INT-CP009-PROT-005":
      return deepFreeze({ keyIdea: common, steps: Object.freeze(["Update the debt through every known repayment using interest first and payment second.", "After the last known repayment, carry the remaining balance through one more interest period to the final date.", "That final-date balance is exactly the balancing payment needed to close the account.", `The final payment is ${answerText}.`]), finalAnswer: answerText });
    case "INT-CP009-PROT-006":
      return deepFreeze({ keyIdea: common, steps: Object.freeze(["Move all known deposits to the target date and add them.", "Subtract this known accumulated value from the required target fund.", "Move the remaining target value back from the target date to the missing deposit date.", `The missing deposit is ${answerText}.`]), finalAnswer: answerText });
    case "INT-CP009-PROT-007":
      return deepFreeze({ keyIdea: "The rate is recovered by exact bounded search: test only the admissible periodic rates and keep the unique rate whose repayment recurrence closes the debt at zero.", steps: Object.freeze(["Start from the stated opening debt.", "For each candidate rate, apply interest and then each dated repayment in order.", "Reject every candidate that leaves a non-zero final balance.", `The unique exact periodic rate is ${answerText}.`]), finalAnswer: answerText });
    case "INT-CP009-PROT-008":
      return deepFreeze({ keyIdea: common, steps: Object.freeze(["Choose the stated replacement-payment date as the common comparison date.", "Move every original repayment forward or backward to that date using the exact compound factor.", "Add the equivalent values at the comparison date.", `The single equivalent payment is ${answerText}.`]), finalAnswer: answerText });
  }
}

export function buildIntCp009DiscoveryPackage(prototypeId: IntCp009PrototypeId, seed: string) {
  const mathematicalState = constructIntCp009PrototypeState(prototypeId, seed);
  const answer = solveIntCp009Prototype(mathematicalState);
  const semantic = answerSemanticForIntCp009Prototype(prototypeId);
  const presentation = promptFor(mathematicalState, seed);
  const optionValues = shuffleOptions(candidateOptions(mathematicalState, answer, seed), seed);
  const correctIndex = optionValues.findIndex((value) => eq(value, answer));
  if (correctIndex < 0) throw new Error(`${prototypeId}/${seed}: correct option missing`);
  const options = Object.freeze(optionValues.map((value) => deepFreeze({
    value,
    text: semantic === "PERIODIC_RATE_PERCENT" ? percent(value) : money(value),
  })));
  const explanation = explanationFor(mathematicalState, answer);
  return deepFreeze({
    discoveryVersion: INT_CP009_DISCOVERY_VERSION,
    checkpointId: "INT-CP-009" as const,
    prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN" as const,
    mathematicalState,
    answerSemantic: semantic,
    answer,
    presentation,
    options,
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    explanation,
    lifecycle: deepFreeze({
      enabled: false as const,
      stagingStatus: "NOT_STAGED" as const,
      registrationStatus: "NOT_REGISTERED" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
  });
}
