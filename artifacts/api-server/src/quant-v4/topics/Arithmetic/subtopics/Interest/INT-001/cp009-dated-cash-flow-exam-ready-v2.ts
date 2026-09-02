import { add, div, eq, hash, mul, rat, sub, type Rational } from "./cp003-exam-model";
import {
  INT_CP009_PROTOTYPE_IDS,
  INT_CP009_RATE_LIBRARY,
  intCp009DebtBalanceByRecurrence,
  intCp009EquivalentAt,
  intCp009FundByRecurrence,
  intCp009GrowthFactor,
  intCp009ShiftAmount,
  solveIntCp009Prototype,
  verifyIntCp009PrototypeAnswer,
  type IntCp009DatedFlow,
  type IntCp009PeriodUnit,
  type IntCp009PrototypeId,
  type IntCp009PrototypeState,
} from "./cp009-dated-cash-flow-discovery-v1";

export {
  INT_CP009_PROTOTYPE_IDS,
  INT_CP009_RATE_LIBRARY,
  solveIntCp009Prototype,
  verifyIntCp009PrototypeAnswer,
};
export type { IntCp009DatedFlow, IntCp009PeriodUnit, IntCp009PrototypeId, IntCp009PrototypeState };

export const INT_CP009_EXAM_READY_VERSION = "INT-CP-009-DATED-CASH-FLOW-EXAM-READY-v2" as const;
const PERIOD_UNITS = Object.freeze(["YEAR", "HALF_YEAR"] as const);
const OPENING_DEBTS = Object.freeze([40_000n, 50_000n, 60_000n, 70_000n, 80_000n, 90_000n, 100_000n] as const);
const TIMING_SETS = Object.freeze([
  Object.freeze([0, 1, 3] as const),
  Object.freeze([0, 2, 3] as const),
  Object.freeze([1, 2, 3] as const),
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

function powBigInt(base: bigint, exponent: number): bigint {
  let result = 1n;
  for (let index = 0; index < exponent; index += 1) result *= base;
  return result;
}

function integer(value: Rational, label: string): bigint {
  if (value.denominator !== 1n) throw new Error(`${label}: expected integer rational`);
  return value.numerator;
}

function quantizeDown(value: bigint, quantum: bigint): bigint {
  return (value / quantum) * quantum;
}

function repaymentSchedule(seed: string, salt: string, forcedRate?: Rational) {
  const periodicRatePercent = forcedRate ?? pick(INT_CP009_RATE_LIBRARY, seed, `${salt}:rate`);
  const periodUnit = pick(PERIOD_UNITS, seed, `${salt}:unit`);
  const periods = 3 + (hash(`${seed}:${salt}:periods`) % 2);
  const openingDebt = rat(pick(OPENING_DEBTS, seed, `${salt}:opening`));
  const factor = intCp009GrowthFactor(periodicRatePercent);
  const repayments: IntCp009DatedFlow[] = [];
  let balance = openingDebt;

  for (let period = 1; period <= periods; period += 1) {
    const grown = mul(balance, factor);
    const grownInteger = integer(grown, `${salt}:grown:${period}`);
    let payment: bigint;
    if (period === periods) {
      payment = grownInteger;
      balance = rat(0n);
    } else {
      const ratio = period === 1 ? 70n : period === 2 ? 52n : 35n;
      let target = quantizeDown((grownInteger * ratio) / 100n, 5_000n);
      if (target < 5_000n) target = 5_000n;
      if (target >= grownInteger) target = grownInteger - 5_000n;
      payment = grownInteger - target;
      balance = rat(target);
    }
    if (payment < 2_000n || payment > 150_000n) throw new Error(`${salt}: unrealistic repayment ${payment}`);
    repayments.push(deepFreeze({ atPeriod: period, amount: rat(payment), direction: "REPAYMENT" as const }));
  }

  if (!eq(balance, rat(0n))) throw new Error(`${salt}: repayment schedule did not settle`);
  return deepFreeze({ periodicRatePercent, periodUnit, periods, openingDebt, repayments: Object.freeze(repayments) });
}

function depositSchedule(seed: string, salt: string) {
  const periodicRatePercent = pick(INT_CP009_RATE_LIBRARY, seed, `${salt}:rate`);
  const periodUnit = pick(PERIOD_UNITS, seed, `${salt}:unit`);
  const duePeriod = 4;
  const timings = pick(TIMING_SETS, seed, `${salt}:timings`);
  const denominator = intCp009GrowthFactor(periodicRatePercent).denominator;
  const desired = [12_000n, 16_000n, 20_000n];
  const deposits: IntCp009DatedFlow[] = [];
  const used = new Set<string>();

  timings.forEach((atPeriod, index) => {
    const remaining = duePeriod - atPeriod;
    const quantum = powBigInt(denominator, remaining);
    const variation = BigInt(hash(`${seed}:${salt}:deposit:${index}`) % 4) * 1_000n;
    const target = desired[index]! + variation;
    let amount = ((target + quantum / 2n) / quantum) * quantum;
    if (amount < 5_000n) amount = ((5_000n + quantum - 1n) / quantum) * quantum;
    while (used.has(amount.toString())) amount += quantum;
    if (amount > 30_000n) throw new Error(`${salt}: unrealistic deposit ${amount}`);
    used.add(amount.toString());
    deposits.push(deepFreeze({ atPeriod, amount: rat(amount), direction: "DEPOSIT" as const }));
  });

  const targetFund = intCp009EquivalentAt(deposits, periodicRatePercent, duePeriod);
  integer(targetFund, `${salt}:target-fund`);
  return deepFreeze({ periodicRatePercent, periodUnit, duePeriod, deposits: Object.freeze(deposits), targetFund });
}

function withoutPeriod(flows: readonly IntCp009DatedFlow[], period: number): readonly IntCp009DatedFlow[] {
  return Object.freeze(flows.filter((flow) => flow.atPeriod !== period));
}

export function constructIntCp009ExamReadyState(prototypeId: IntCp009PrototypeId, seed: string): IntCp009PrototypeState {
  switch (prototypeId) {
    case "INT-CP009-PROT-001": {
      const s = depositSchedule(seed, prototypeId);
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, duePeriod: s.duePeriod, deposits: s.deposits }) as IntCp009PrototypeState;
    }
    case "INT-CP009-PROT-002": {
      const s = repaymentSchedule(seed, prototypeId);
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, repayments: s.repayments }) as IntCp009PrototypeState;
    }
    case "INT-CP009-PROT-003": {
      const s = repaymentSchedule(seed, prototypeId);
      const missingAtPeriod = s.periods === 3 ? 2 : 2 + (hash(`${seed}:${prototypeId}:missing`) % 2);
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, openingDebt: s.openingDebt, repayments: withoutPeriod(s.repayments, missingAtPeriod), missingAtPeriod }) as IntCp009PrototypeState;
    }
    case "INT-CP009-PROT-004": {
      const s = repaymentSchedule(seed, prototypeId);
      const afterPeriod = 1 + (hash(`${seed}:${prototypeId}:after`) % (s.periods - 1));
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, openingDebt: s.openingDebt, repayments: s.repayments, afterPeriod }) as IntCp009PrototypeState;
    }
    case "INT-CP009-PROT-005": {
      const s = repaymentSchedule(seed, prototypeId);
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, openingDebt: s.openingDebt, knownRepayments: Object.freeze(s.repayments.slice(0, -1)), finalPeriod: s.periods }) as IntCp009PrototypeState;
    }
    case "INT-CP009-PROT-006": {
      const s = depositSchedule(seed, prototypeId);
      const candidatePeriods = s.deposits.map((flow) => flow.atPeriod).filter((period) => period > 0 && period < s.duePeriod);
      const missingAtPeriod = candidatePeriods[hash(`${seed}:${prototypeId}:missing`) % candidatePeriods.length]!;
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, duePeriod: s.duePeriod, targetFund: s.targetFund, deposits: withoutPeriod(s.deposits, missingAtPeriod), missingAtPeriod }) as IntCp009PrototypeState;
    }
    case "INT-CP009-PROT-007": {
      const rate = pick(INT_CP009_RATE_LIBRARY, seed, `${prototypeId}:rate`);
      const s = repaymentSchedule(seed, prototypeId, rate);
      return deepFreeze({ prototypeId, periodUnit: s.periodUnit, openingDebt: s.openingDebt, repayments: s.repayments }) as IntCp009PrototypeState;
    }
    case "INT-CP009-PROT-008": {
      const s = repaymentSchedule(seed, prototypeId);
      return deepFreeze({ prototypeId, periodicRatePercent: s.periodicRatePercent, periodUnit: s.periodUnit, repayments: s.repayments, comparisonPeriod: 2 }) as IntCp009PrototypeState;
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
  return value.denominator === 1n ? `${value.numerator}%` : `${value.numerator}/${value.denominator}%`;
}

const ORDINALS = Object.freeze(["", "first", "second", "third", "fourth", "fifth"] as const);
function timePhrase(period: number, unit: IntCp009PeriodUnit): string {
  if (period === 0) return "today";
  const ordinal = ORDINALS[period] ?? `${period}th`;
  return unit === "YEAR" ? `at the end of the ${ordinal} year` : `at the end of the ${ordinal} half-year`;
}

function shortTime(period: number, unit: IntCp009PeriodUnit): string {
  if (period === 0) return "today";
  const ordinal = ORDINALS[period] ?? `${period}th`;
  return unit === "YEAR" ? `the end of year ${period}` : `the end of the ${ordinal} half-year`;
}

function rateText(rate: Rational, unit: IntCp009PeriodUnit): string {
  return unit === "YEAR" ? `${percent(rate)} p.a., compounded annually` : `${percent(rate)} per half-year, compounded half-yearly`;
}

function flowList(flows: readonly IntCp009DatedFlow[], unit: IntCp009PeriodUnit): string {
  return flows.map((flow) => `${money(flow.amount)} ${timePhrase(flow.atPeriod, unit)}`).join(", ");
}

function familyIndex(prototypeId: IntCp009PrototypeId, seed: string): number {
  return hash(`${seed}:${prototypeId}:exam-stem`) % 3;
}

function promptFor(state: IntCp009PrototypeState, seed: string) {
  const index = familyIndex(state.prototypeId, seed);
  const stemFamilyId = `${state.prototypeId}-ER-T${index + 1}`;
  switch (state.prototypeId) {
    case "INT-CP009-PROT-001": {
      const list = flowList(state.deposits, state.periodUnit);
      const target = shortTime(state.duePeriod, state.periodUnit);
      const variants = [
        `A savings account earns ${rateText(state.periodicRatePercent, state.periodUnit)}. Deposits of ${list} are made. Find the value of the account at ${target}.`,
        `Riya deposits ${list} into an account earning ${rateText(state.periodicRatePercent, state.periodUnit)}. What amount will be in the account at ${target}?`,
        `Three unequal deposits—${list}—earn ${rateText(state.periodicRatePercent, state.periodUnit)}. Determine their total accumulated value at ${target}.`,
      ];
      return deepFreeze({ stemFamilyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-002": {
      const list = flowList(state.repayments, state.periodUnit);
      const variants = [
        `A loan carrying ${rateText(state.periodicRatePercent, state.periodUnit)} is fully cleared by repayments of ${list}. Find the amount originally borrowed.`,
        `A borrower repays a loan by paying ${list}. If interest is ${rateText(state.periodicRatePercent, state.periodUnit)} and the final balance is zero, what was the opening loan?`,
        `The repayments ${list} exactly settle a debt charged at ${rateText(state.periodicRatePercent, state.periodUnit)}. Determine the debt outstanding today before any repayment is made.`,
      ];
      return deepFreeze({ stemFamilyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-003": {
      const list = flowList(state.repayments, state.periodUnit);
      const missing = timePhrase(state.missingAtPeriod, state.periodUnit);
      const variants = [
        `A loan of ${money(state.openingDebt)} carries ${rateText(state.periodicRatePercent, state.periodUnit)}. The known repayments are ${list}. One repayment ${missing} is missing from the record. Find it if the loan is exactly cleared by the end of the schedule.`,
        `A borrower owes ${money(state.openingDebt)} today and pays ${list}. An additional repayment ${missing} is not stated. At ${rateText(state.periodicRatePercent, state.periodUnit)}, what must that payment be so that no balance remains?`,
        `The opening loan is ${money(state.openingDebt)}. Its repayment schedule contains ${list} and one unknown payment ${missing}. If the rate is ${rateText(state.periodicRatePercent, state.periodUnit)}, determine the unknown payment that settles the debt exactly.`,
      ];
      return deepFreeze({ stemFamilyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-004": {
      const list = flowList(state.repayments, state.periodUnit);
      const requested = shortTime(state.afterPeriod, state.periodUnit);
      const variants = [
        `A loan of ${money(state.openingDebt)} carries ${rateText(state.periodicRatePercent, state.periodUnit)} and is repaid through ${list}. Find the outstanding balance immediately after the repayment at ${requested}.`,
        `The opening debt is ${money(state.openingDebt)}. Repayments are ${list} and interest is ${rateText(state.periodicRatePercent, state.periodUnit)}. How much remains due just after the payment at ${requested}?`,
        `A borrower starts with a debt of ${money(state.openingDebt)} and follows the repayment schedule ${list}. Under ${rateText(state.periodicRatePercent, state.periodUnit)}, determine the balance left immediately after ${requested}.`,
      ];
      return deepFreeze({ stemFamilyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-005": {
      const list = flowList(state.knownRepayments, state.periodUnit);
      const finalTime = timePhrase(state.finalPeriod, state.periodUnit);
      const variants = [
        `A loan of ${money(state.openingDebt)} carries ${rateText(state.periodicRatePercent, state.periodUnit)}. Repayments of ${list} are made. What final payment ${finalTime} will clear the loan exactly?`,
        `A borrower owes ${money(state.openingDebt)} and makes repayments of ${list}. At ${rateText(state.periodicRatePercent, state.periodUnit)}, find the single balancing payment due ${finalTime}.`,
        `The opening debt is ${money(state.openingDebt)}. After paying ${list}, one final settlement is due ${finalTime}. If interest is ${rateText(state.periodicRatePercent, state.periodUnit)}, determine that settlement.`,
      ];
      return deepFreeze({ stemFamilyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-006": {
      const list = flowList(state.deposits, state.periodUnit);
      const missing = timePhrase(state.missingAtPeriod, state.periodUnit);
      const target = shortTime(state.duePeriod, state.periodUnit);
      const variants = [
        `A savings fund must equal ${money(state.targetFund)} at ${target}. The known deposits are ${list}; one more deposit is made ${missing}. If the account earns ${rateText(state.periodicRatePercent, state.periodUnit)}, find the missing deposit.`,
        `The required account balance at ${target} is ${money(state.targetFund)}. Deposits of ${list} are known, but the deposit ${missing} is not. At ${rateText(state.periodicRatePercent, state.periodUnit)}, determine that deposit.`,
        `A saver wants exactly ${money(state.targetFund)} at ${target}. With interest at ${rateText(state.periodicRatePercent, state.periodUnit)}, the known deposits are ${list} plus an unknown amount ${missing}. Find the unknown amount.`,
      ];
      return deepFreeze({ stemFamilyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-007": {
      const list = flowList(state.repayments, state.periodUnit);
      const unit = state.periodUnit === "YEAR" ? "per year" : "per half-year";
      const variants = [
        `A loan of ${money(state.openingDebt)} is exactly cleared by repayments of ${list}. Which of the following compound interest rates ${unit} is applicable?`,
        `A debt starts at ${money(state.openingDebt)} and is fully settled by ${list}. Find the compound interest rate ${unit}.`,
        `The opening loan is ${money(state.openingDebt)} and repayments of ${list} leave a zero balance. Determine the interest rate ${unit}.`,
      ];
      return deepFreeze({ stemFamilyId, prompt: variants[index]! });
    }
    case "INT-CP009-PROT-008": {
      const list = flowList(state.repayments, state.periodUnit);
      const when = timePhrase(state.comparisonPeriod, state.periodUnit);
      const variants = [
        `At ${rateText(state.periodicRatePercent, state.periodUnit)}, repayments of ${list} are to be replaced by one financially equivalent payment ${when}. Find that single payment.`,
        `The repayment schedule is ${list}. Using ${rateText(state.periodicRatePercent, state.periodUnit)}, determine the one payment ${when} that is equivalent to the entire schedule.`,
        `Replace the unequal repayments ${list} by a single equivalent repayment ${when}. If money grows at ${rateText(state.periodicRatePercent, state.periodUnit)}, what should the replacement payment be?`,
      ];
      return deepFreeze({ stemFamilyId, prompt: variants[index]! });
    }
  }
}

function exactFactor(rate: Rational): string {
  const factor = intCp009GrowthFactor(rate);
  return `${factor.numerator}/${factor.denominator}`;
}

function explanationFor(state: IntCp009PrototypeState, answer: Rational) {
  switch (state.prototypeId) {
    case "INT-CP009-PROT-001": {
      const factor = exactFactor(state.periodicRatePercent);
      const parts = state.deposits.map((flow) => {
        const periods = state.duePeriod - flow.atPeriod;
        const value = intCp009ShiftAmount(flow.amount, state.periodicRatePercent, flow.atPeriod, state.duePeriod);
        return `${money(flow.amount)} × (${factor})^${periods} = ${money(value)}`;
      });
      return deepFreeze({
        keyIdea: "Each deposit earns interest only from its own deposit date. First move every deposit to the target date, then add them.",
        steps: Object.freeze([
          `Growth factor per period = 1 + rate = ${factor}.`,
          `Values at the target date: ${parts.join("; ")}.`,
          `Total = ${parts.map((_part, index) => money(intCp009ShiftAmount(state.deposits[index]!.amount, state.periodicRatePercent, state.deposits[index]!.atPeriod, state.duePeriod))).join(" + ")} = ${money(answer)}.`,
          `Therefore, the fund value is ${money(answer)}.`,
        ]),
        finalAnswer: money(answer),
      });
    }
    case "INT-CP009-PROT-002": {
      const factor = intCp009GrowthFactor(state.periodicRatePercent);
      let balanceAfter = rat(0n);
      const lines: string[] = [];
      for (let period = state.repayments.length; period >= 1; period -= 1) {
        const payment = state.repayments.find((flow) => flow.atPeriod === period)!.amount;
        const previous = div(add(balanceAfter, payment), factor);
        lines.push(`Before period ${period}: (${money(balanceAfter)} + ${money(payment)}) ÷ ${factor.numerator}/${factor.denominator} = ${money(previous)}`);
        balanceAfter = previous;
      }
      return deepFreeze({
        keyIdea: "Because the final balance is zero, work backward through the repayments. Before each repayment, undo one period of compound growth.",
        steps: Object.freeze([
          `Use B(previous) = (B(after payment) + payment) ÷ ${factor.numerator}/${factor.denominator}.`,
          lines.slice(0, 2).join("; "),
          lines.slice(2).join("; "),
          `Working back to today gives the opening debt ${money(answer)}.`,
        ]),
        finalAnswer: money(answer),
      });
    }
    case "INT-CP009-PROT-003": {
      const factor = intCp009GrowthFactor(state.periodicRatePercent);
      let beforeMissingBase = state.openingDebt;
      for (let period = 1; period < state.missingAtPeriod; period += 1) {
        const payment = state.repayments.find((flow) => flow.atPeriod === period)?.amount ?? rat(0n);
        beforeMissingBase = sub(mul(beforeMissingBase, factor), payment);
      }
      const beforeMissing = mul(beforeMissingBase, factor);
      const finalPeriod = Math.max(state.missingAtPeriod, ...state.repayments.map((flow) => flow.atPeriod));
      let requiredAfterMissing = rat(0n);
      const backward: string[] = [];
      for (let period = finalPeriod; period > state.missingAtPeriod; period -= 1) {
        const payment = state.repayments.find((flow) => flow.atPeriod === period)?.amount ?? rat(0n);
        const previous = div(add(requiredAfterMissing, payment), factor);
        backward.push(`(${money(requiredAfterMissing)} + ${money(payment)}) ÷ ${factor.numerator}/${factor.denominator} = ${money(previous)}`);
        requiredAfterMissing = previous;
      }
      return deepFreeze({
        keyIdea: "Find the balance just before the missing payment from the earlier part of the loan, and the balance that must remain just after it from the later repayments. Their difference is the missing payment.",
        steps: Object.freeze([
          `Using B(new) = B(old) × ${factor.numerator}/${factor.denominator} − payment, the balance just before the missing payment is ${money(beforeMissing)}.`,
          `Working backward from the final zero balance through the later repayments gives the required balance just after the missing payment: ${backward.join("; ")}.`,
          `Missing payment = ${money(beforeMissing)} − ${money(requiredAfterMissing)} = ${money(answer)}.`,
          `Therefore, the missing repayment is ${money(answer)}.`,
        ]),
        finalAnswer: money(answer),
      });
    }
    case "INT-CP009-PROT-004": {
      const factor = intCp009GrowthFactor(state.periodicRatePercent);
      let balance = state.openingDebt;
      const lines: string[] = [];
      for (let period = 1; period <= state.afterPeriod; period += 1) {
        const payment = state.repayments.find((flow) => flow.atPeriod === period)!.amount;
        const next = sub(mul(balance, factor), payment);
        lines.push(`Period ${period}: ${money(balance)} × ${factor.numerator}/${factor.denominator} − ${money(payment)} = ${money(next)}`);
        balance = next;
      }
      return deepFreeze({
        keyIdea: "For each completed period, add that period's compound interest first and then subtract the repayment made at the period end.",
        steps: Object.freeze([
          `Opening debt = ${money(state.openingDebt)}; growth factor = ${factor.numerator}/${factor.denominator}.`,
          lines.slice(0, 2).join("; "),
          lines.slice(2).join("; ") || `Stop after period ${state.afterPeriod}.`,
          `Outstanding balance = ${money(answer)}.`,
        ]),
        finalAnswer: money(answer),
      });
    }
    case "INT-CP009-PROT-005": {
      const factor = intCp009GrowthFactor(state.periodicRatePercent);
      let balance = state.openingDebt;
      const lines: string[] = [];
      for (let period = 1; period < state.finalPeriod; period += 1) {
        const payment = state.knownRepayments.find((flow) => flow.atPeriod === period)!.amount;
        const next = sub(mul(balance, factor), payment);
        lines.push(`Period ${period}: ${money(balance)} × ${factor.numerator}/${factor.denominator} − ${money(payment)} = ${money(next)}`);
        balance = next;
      }
      const due = mul(balance, factor);
      return deepFreeze({
        keyIdea: "Update the debt after each known repayment. The balance after one final interest period is the payment needed to close the account.",
        steps: Object.freeze([
          `Opening debt = ${money(state.openingDebt)}; growth factor = ${factor.numerator}/${factor.denominator}.`,
          lines.join("; "),
          `Amount due at the final payment date = ${money(balance)} × ${factor.numerator}/${factor.denominator} = ${money(due)}.`,
          `So the balancing payment is ${money(answer)}.`,
        ]),
        finalAnswer: money(answer),
      });
    }
    case "INT-CP009-PROT-006": {
      const factor = exactFactor(state.periodicRatePercent);
      const contributions = state.deposits.map((flow) => {
        const periods = state.duePeriod - flow.atPeriod;
        const value = intCp009ShiftAmount(flow.amount, state.periodicRatePercent, flow.atPeriod, state.duePeriod);
        return { text: `${money(flow.amount)} × (${factor})^${periods} = ${money(value)}`, value };
      });
      const knownTotal = contributions.reduce((sum, item) => add(sum, item.value), rat(0n));
      const residual = sub(state.targetFund, knownTotal);
      const missingPeriods = state.duePeriod - state.missingAtPeriod;
      return deepFreeze({
        keyIdea: "Move the known deposits to the target date. The shortfall at that date is the future value of the missing deposit, so discount that shortfall back to the missing deposit date.",
        steps: Object.freeze([
          `Known deposits at the target date: ${contributions.map((item) => item.text).join("; ")}.`,
          `Known total = ${money(knownTotal)}; shortfall = ${money(state.targetFund)} − ${money(knownTotal)} = ${money(residual)}.`,
          `Missing deposit = ${money(residual)} ÷ (${factor})^${missingPeriods} = ${money(answer)}.`,
          `Therefore, the required deposit is ${money(answer)}.`,
        ]),
        finalAnswer: money(answer),
      });
    }
    case "INT-CP009-PROT-007": {
      const candidateRates = [rat(10n), rat(15n), rat(20n), rat(25n)];
      const finalPeriod = Math.max(...state.repayments.map((flow) => flow.atPeriod));
      const results = candidateRates.map((rate) => ({
        rate,
        balance: intCp009DebtBalanceByRecurrence(state.openingDebt, state.repayments, rate, finalPeriod),
      }));
      return deepFreeze({
        keyIdea: "Test the option rates in the repayment recurrence. The correct rate is the only one that leaves a zero balance after the last repayment.",
        steps: Object.freeze([
          `Use B(new) = B(old) × (1 + r) − payment, starting from ${money(state.openingDebt)}.`,
          `${percent(results[0]!.rate)} gives final balance ${money(results[0]!.balance)}; ${percent(results[1]!.rate)} gives ${money(results[1]!.balance)}.`,
          `${percent(results[2]!.rate)} gives final balance ${money(results[2]!.balance)}; ${percent(results[3]!.rate)} gives ${money(results[3]!.balance)}.`,
          `Only ${percent(answer)} gives a zero final balance, so the rate is ${percent(answer)}.`,
        ]),
        finalAnswer: percent(answer),
      });
    }
    case "INT-CP009-PROT-008": {
      const parts = state.repayments.map((flow) => ({
        value: intCp009ShiftAmount(flow.amount, state.periodicRatePercent, flow.atPeriod, state.comparisonPeriod),
        flow,
      }));
      const factor = exactFactor(state.periodicRatePercent);
      return deepFreeze({
        keyIdea: "Move every repayment to the replacement-payment date. Their values at that common date add to the single equivalent payment.",
        steps: Object.freeze([
          `Growth factor per period = ${factor}; comparison date = period ${state.comparisonPeriod}.`,
          `Equivalent values: ${parts.map((item) => `${money(item.flow.amount)} → ${money(item.value)}`).join("; ")}.`,
          `Single payment = ${parts.map((item) => money(item.value)).join(" + ")} = ${money(answer)}.`,
          `Therefore, the equivalent replacement payment is ${money(answer)}.`,
        ]),
        finalAnswer: money(answer),
      });
    }
  }
}

function moneyOptions(correct: Rational): readonly Rational[] {
  const whole = integer(correct, "option-answer");
  let step = whole / 20n;
  if (step < 500n) step = 500n;
  step = ((step + 499n) / 500n) * 500n;
  const lower = whole - step > 0n ? whole - step : whole + 3n * step;
  return Object.freeze([rat(whole), rat(lower), rat(whole + step), rat(whole + 2n * step)]);
}

function targetCorrectIndex(seed: string): number {
  const match = seed.match(/:(\d+)$/u);
  return match ? Number(match[1]) % 4 : hash(`${seed}:answer-position`) % 4;
}

function optionsFor(state: IntCp009PrototypeState, answer: Rational, seed: string) {
  const values = state.prototypeId === "INT-CP009-PROT-007"
    ? [answer, ...[rat(10n), rat(15n), rat(20n), rat(25n)].filter((value) => !eq(value, answer)).slice(0, 3)]
    : [...moneyOptions(answer)];
  const correct = values[0]!;
  const distractors = values.slice(1);
  const desired = targetCorrectIndex(seed);
  const ordered = [...distractors];
  ordered.splice(desired, 0, correct);
  return Object.freeze(ordered.map((value) => deepFreeze({ value, text: state.prototypeId === "INT-CP009-PROT-007" ? percent(value) : money(value) })));
}

export function buildIntCp009ExamReadyDiscoveryPackage(prototypeId: IntCp009PrototypeId, seed: string) {
  const mathematicalState = constructIntCp009ExamReadyState(prototypeId, seed);
  const answer = solveIntCp009Prototype(mathematicalState);
  if (!verifyIntCp009PrototypeAnswer(mathematicalState, answer)) throw new Error(`${prototypeId}/${seed}: independent verifier rejected exam-ready answer`);
  const presentation = promptFor(mathematicalState, seed);
  const options = optionsFor(mathematicalState, answer, seed);
  const correctIndex = options.findIndex((option) => eq(option.value, answer));
  const explanation = explanationFor(mathematicalState, answer);
  return deepFreeze({
    examReadyVersion: INT_CP009_EXAM_READY_VERSION,
    checkpointId: "INT-CP-009" as const,
    prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN" as const,
    mathematicalState,
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
