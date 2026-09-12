import { add, div, eq, hash, mul, rat, sub, type Rational } from "./cp003-exam-model";
import {
  INT_CP008_RATE_LIBRARY,
  intCp008BeginningInstallment,
  intCp008EndInstallment,
  intCp008EndPaymentBalance,
  intCp008GeometricSum,
  intCp008GrowthFactor,
  intCp008Pow,
} from "./cp008-instalment-discovery-v1";
import {
  INT_CP008_PERMANENT_ALLOCATION,
  INT_CP008_QL_IDS,
  INT_CP008_RUNTIME_VERSION,
  constructIntCp008State,
  solveIntCp008,
  verifyIntCp008Answer,
  type IntCp008PermanentState,
  type IntCp008QlId,
} from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_ENGLISH_VERSION = "INT-CP-008-EN-v1-exam-review" as const;

export type IntCp008Representation = "STANDARD_PROSE" | "SCHEDULE_CARD" | "BALANCE_LEDGER" | "PLAN_COMPARISON";
export type IntCp008ContextClass = "LOAN" | "FINANCED_PURCHASE" | "FUND" | "SAVINGS" | "GENERIC_SCHEDULE";

export interface IntCp008Option {
  readonly text: string;
  readonly value: Rational;
  readonly misconceptionId: string;
}

export interface IntCp008EnglishQuestion {
  readonly id: string;
  readonly runtimeVersion: typeof INT_CP008_RUNTIME_VERSION;
  readonly englishVersion: typeof INT_CP008_ENGLISH_VERSION;
  readonly checkpointId: "INT-CP-008";
  readonly qlId: IntCp008QlId;
  readonly locale: "en-IN";
  readonly seed: string;
  readonly mathematicalState: IntCp008PermanentState;
  readonly answerSemantic: IntCp008PermanentState["answerSemantic"];
  readonly presentation: Readonly<{
    readonly markdown: string;
    readonly prompt: string;
    readonly representation: IntCp008Representation;
    readonly contextClass: IntCp008ContextClass;
    readonly stemFamilyId: string;
  }>;
  readonly options: readonly IntCp008Option[];
  readonly correctIndex: 0 | 1 | 2 | 3;
  readonly correctAnswer: string;
  readonly explanation: Readonly<{
    readonly keyIdea: string;
    readonly steps: readonly string[];
    readonly finalAnswer: string;
    readonly commonMistake: string;
  }>;
  readonly mathematicalFingerprint: string;
  readonly editorialStatus: "ENGLISH_REVIEW";
  readonly approvalStatus: "PENDING_PRODUCT_REVIEW";
  readonly allocationStatus: "PERMANENT_QL_ALLOCATED_INACTIVE";
  readonly permanentIdentityFrozen: true;
  readonly learnerContentFrozen: false;
  readonly enabled: false;
  readonly stagingStatus: "NOT_STAGED";
  readonly registrationStatus: "NOT_REGISTERED";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly questionBankWritable: false;
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

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

function gcd(a: bigint, b: bigint): bigint {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) [left, right] = [right, left % right];
  return left;
}

function abs(value: Rational): Rational {
  return value.numerator < 0n ? rat(-value.numerator, value.denominator) : value;
}

function formatRational(value: Rational, maximumDecimals = 6): string {
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  const denominator = value.denominator;
  const whole = numerator / denominator;
  let remainder = numerator % denominator;
  if (remainder === 0n) return `${sign}${whole}`;
  let decimals = "";
  for (let index = 0; index < maximumDecimals && remainder !== 0n; index += 1) {
    remainder *= 10n;
    decimals += (remainder / denominator).toString();
    remainder %= denominator;
  }
  if (remainder === 0n) return `${sign}${whole}.${decimals}`;
  const divisor = gcd(numerator, denominator);
  return `${sign}${numerator / divisor}/${denominator / divisor}`;
}

function formatMoney(value: Rational): string {
  const paiseNumerator = value.numerator * 100n;
  if (paiseNumerator % value.denominator !== 0n) return `₹${formatRational(value)}`;
  const paise = paiseNumerator / value.denominator;
  const rupees = paise / 100n;
  const remainder = paise % 100n;
  const source = rupees.toString();
  const tail = source.length <= 3 ? source : source.slice(-3);
  let head = source.length <= 3 ? "" : source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  const integer = groups.length ? `${groups.join(",")},${tail}` : tail;
  return remainder === 0n ? `₹${integer}` : `₹${integer}.${remainder.toString().padStart(2, "0")}`;
}

const formatPercent = (value: Rational): string => `${formatRational(value)}%`;

function unitNoun(unit: "YEAR" | "HALF_YEAR", plural = false): string {
  if (unit === "YEAR") return plural ? "years" : "year";
  return plural ? "half-years" : "half-year";
}

function periodPhrase(periods: number, unit: "YEAR" | "HALF_YEAR"): string {
  return `${periods} ${unitNoun(unit, periods !== 1)}`;
}

function ratePhrase(ratePercent: Rational, unit: "YEAR" | "HALF_YEAR"): string {
  return `${formatPercent(ratePercent)} per ${unitNoun(unit)}`;
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function formulaRate(ratePercent: Rational): string {
  return `${formatRational(ratePercent)}/100`;
}

function uniqueWrongValues(state: IntCp008PermanentState, candidates: readonly Rational[]): Rational[] {
  const selected: Rational[] = [];
  for (const candidate of candidates) {
    if (candidate.numerator <= 0n) continue;
    if (verifyIntCp008Answer(state, candidate)) continue;
    if (selected.some((item) => eq(item, candidate))) continue;
    selected.push(candidate);
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) throw new Error(`${state.qlId}: insufficient distinct misconception values`);
  return selected;
}

function formatAnswer(state: IntCp008PermanentState, value: Rational): string {
  return state.answerSemantic === "PERIODIC_RATE_PERCENT" ? formatPercent(value) : formatMoney(value);
}

function arrangeOptions(
  state: IntCp008PermanentState,
  seed: string,
  answer: Rational,
  wrongValues: readonly Rational[],
  misconceptionIds: readonly string[],
): Readonly<{ options: readonly IntCp008Option[]; correctIndex: 0 | 1 | 2 | 3 }> {
  if (wrongValues.length !== 3 || misconceptionIds.length !== 3) throw new Error(`${state.qlId}/${seed}: invalid distractor contract`);
  const correctIndex = (hash(`${seed}:${state.qlId}:english-correct-index`) % 4) as 0 | 1 | 2 | 3;
  const options: IntCp008Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(deepFreeze({ text: formatAnswer(state, answer), value: answer, misconceptionId: "CORRECT" }));
    } else {
      const value = wrongValues[wrongIndex]!;
      options.push(deepFreeze({ text: formatAnswer(state, value), value, misconceptionId: misconceptionIds[wrongIndex]! }));
      wrongIndex += 1;
    }
  }
  return deepFreeze({ options: Object.freeze(options), correctIndex });
}

function representationForTemplate(template: number): IntCp008Representation {
  if (template <= 1) return "STANDARD_PROSE";
  if (template <= 3) return "SCHEDULE_CARD";
  if (template === 4) return "BALANCE_LEDGER";
  return "PLAN_COMPARISON";
}

function stem(
  qlId: IntCp008QlId,
  state: IntCp008PermanentState,
  template: number,
): Readonly<{ prompt: string; contextClass: IntCp008ContextClass; representation: IntCp008Representation; stemFamilyId: string }> {
  const c: any = state.contractState;
  const representation = representationForTemplate(template);
  const family = `${qlId}-T${template + 1}`;

  switch (qlId) {
    case "INT-QL-116": {
      const p = formatMoney(c.openingBalance);
      const rate = ratePhrase(c.periodicRatePercent, c.periodUnit);
      const duration = periodPhrase(c.periods, c.periodUnit);
      const variants = [
        { contextClass: "LOAN" as const, prompt: `A loan balance of ${p} carries interest at ${rate}. It is to be cleared by ${c.periods} equal payments made at the end of each ${unitNoun(c.periodUnit)}. Find each instalment.` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `${p} is outstanding. Interest is added at ${rate}, followed by one equal payment at the end of every ${unitNoun(c.periodUnit)}. If the balance must become zero after ${duration}, find the payment.` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `After the upfront payment on a financed purchase, ${p} remains due. The financed balance bears ${rate} and is repaid in ${c.periods} equal end-of-${unitNoun(c.periodUnit)} instalments. What is each instalment?` },
        { contextClass: "LOAN" as const, prompt: `A borrower wants to repay ${p} over ${duration}. The lender charges ${rate}, and every payment is made after that period's interest is added. Find the equal periodic instalment.` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `Balance ledger: opening balance ${p}; periodic rate ${rate}; ${c.periods} equal end-of-${unitNoun(c.periodUnit)} payments; closing balance after the last payment ₹0. Find the recurring payment.` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `A financed balance of ${p} is settled through ${c.periods} equal instalments over ${duration}. Interest is ${rate} and each instalment is paid at period-end. Determine the instalment amount.` },
      ];
      return deepFreeze({ ...variants[template]!, representation, stemFamilyId: family });
    }
    case "INT-QL-117": {
      const x = formatMoney(c.installment);
      const rate = ratePhrase(c.periodicRatePercent, c.periodUnit);
      const duration = periodPhrase(c.periods, c.periodUnit);
      const variants = [
        { contextClass: "LOAN" as const, prompt: `A loan is exactly cleared by ${c.periods} equal end-of-${unitNoun(c.periodUnit)} instalments of ${x}. Interest is ${rate}. Find the original loan amount.` },
        { contextClass: "FUND" as const, prompt: `A fund earns ${rate} and supports ${c.periods} equal withdrawals of ${x}, each made at the end of a ${unitNoun(c.periodUnit)}. If the fund is exhausted after the last withdrawal, find its opening balance.` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `${c.periods} end-of-${unitNoun(c.periodUnit)} payments of ${x} settle a balance over ${duration} at ${rate}. What balance was outstanding at the start?` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `A financed purchase is settled by ${c.periods} equal payments of ${x}, one at each ${unitNoun(c.periodUnit)}'s end. The periodic rate is ${rate}. Find the amount that was financed.` },
        { contextClass: "LOAN" as const, prompt: `Repayment ledger: instalment ${x}; number of instalments ${c.periods}; rate ${rate}; final balance ₹0. Find the opening debt.` },
        { contextClass: "FUND" as const, prompt: `An investment fund is drawn down by ${x} at the end of every ${unitNoun(c.periodUnit)} for ${duration}. It earns ${rate}. Determine the initial fund required so that nothing remains after the final withdrawal.` },
      ];
      return deepFreeze({ ...variants[template]!, representation, stemFamilyId: family });
    }
    case "INT-QL-118": {
      const p = formatMoney(c.openingBalance);
      const x = formatMoney(c.installment);
      const rate = ratePhrase(c.periodicRatePercent, c.periodUnit);
      const variants = [
        { contextClass: "LOAN" as const, prompt: `A loan starts at ${p}. Interest is ${rate}, then an instalment of ${x} is paid at each period-end. What balance remains immediately after payment ${c.afterPayments}?` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `Starting balance ${p}; periodic interest ${rate}; end-of-period payment ${x}. Find the outstanding balance just after ${c.afterPayments} payment${c.afterPayments === 1 ? "" : "s"}.` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `A financed balance of ${p} is being repaid by equal instalments of ${x}. The rate is ${rate}. How much is still due immediately after instalment ${c.afterPayments}?` },
        { contextClass: "LOAN" as const, prompt: `A borrower owes ${p} and pays ${x} at every ${unitNoun(c.periodUnit)}'s end after interest at ${rate} is added. Calculate the balance after the ${c.afterPayments}${c.afterPayments === 1 ? "st" : c.afterPayments === 2 ? "nd" : "th"} payment.` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `Balance ledger: ${p} opening debt; ${rate}; recurring payment ${x}; inspect the account immediately after payment ${c.afterPayments}. What is the outstanding balance?` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `An instalment account begins with ${p}. Each ${unitNoun(c.periodUnit)}, interest at ${rate} is posted before a payment of ${x}. Find the remaining balance after ${c.afterPayments} posted payment${c.afterPayments === 1 ? "" : "s"}.` },
      ];
      return deepFreeze({ ...variants[template]!, representation, stemFamilyId: family });
    }
    case "INT-QL-119": {
      const p = formatMoney(c.openingBalance);
      const x = formatMoney(c.regularInstallment);
      const rate = ratePhrase(c.periodicRatePercent, c.periodUnit);
      const earlier = c.periods - 1;
      const variants = [
        { contextClass: "LOAN" as const, prompt: `A debt of ${p} carries interest at ${rate}. The first ${earlier} end-of-${unitNoun(c.periodUnit)} payments are ${x} each. Find the final payment that clears the debt.` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `${p} is repaid over ${c.periods} periods at ${rate}. The first ${earlier} payments are fixed at ${x}; the last payment may differ. How much must the final payment be?` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `A financed balance of ${p} is charged ${rate}. After ${earlier} regular instalments of ${x}, one balancing instalment is due at the next period-end. Determine it.` },
        { contextClass: "LOAN" as const, prompt: `The account opens at ${p}. Interest is added at ${rate} before each payment. After ${earlier} payments of ${x}, what amount paid at the end of the final ${unitNoun(c.periodUnit)} will reduce the balance to zero?` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `Repayment ledger: opening ${p}; rate ${rate}; first ${earlier} payments ${x}; final closing balance ₹0. Find the balancing last payment.` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `A customer has ${p} financed at ${rate}. ${earlier} scheduled instalments of ${x} are followed by one settlement payment. Calculate that settlement payment.` },
      ];
      return deepFreeze({ ...variants[template]!, representation, stemFamilyId: family });
    }
    case "INT-QL-120": {
      const p = formatMoney(c.openingBalance);
      const rate = ratePhrase(c.periodicRatePercent, c.periodUnit);
      const duration = periodPhrase(c.periods, c.periodUnit);
      const variants = [
        { contextClass: "LOAN" as const, prompt: `A loan of ${p} is repaid by ${c.periods} equal payments made at the beginning of each ${unitNoun(c.periodUnit)}. The rate is ${rate}. Find each payment.` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `Payments are made before interest is charged in every period. What equal beginning-of-${unitNoun(c.periodUnit)} payment clears ${p} over ${duration} at ${rate}?` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `A financed balance of ${p} is settled through ${c.periods} equal instalments, with the first instalment due immediately. Interest is ${rate}. Find the instalment.` },
        { contextClass: "LOAN" as const, prompt: `A borrower pays at the start of each ${unitNoun(c.periodUnit)}, then interest at ${rate} is applied to the reduced balance. If ${c.periods} equal payments clear ${p}, find each payment.` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `Balance ledger uses payment-before-interest order: opening ${p}, ${c.periods} equal payments, rate ${rate}, final balance ₹0. Determine the recurring payment.` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `An instalment plan starts immediately on a financed balance of ${p}. There are ${c.periods} equal beginning-of-${unitNoun(c.periodUnit)} payments and the rate is ${rate}. What is each instalment?` },
      ];
      return deepFreeze({ ...variants[template]!, representation, stemFamilyId: family });
    }
    case "INT-QL-121": {
      const p = formatMoney(c.openingBalance);
      const x = formatMoney(c.installment);
      const duration = periodPhrase(c.periods, c.periodUnit);
      const variants = [
        { contextClass: "LOAN" as const, prompt: `A loan of ${p} is exactly cleared by ${c.periods} equal end-of-${unitNoun(c.periodUnit)} instalments of ${x}. Find the interest rate per ${unitNoun(c.periodUnit)}.` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `${p} is repaid over ${duration} by equal period-end payments of ${x}. What periodic interest rate makes the final balance exactly zero?` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `A financed balance of ${p} is settled by ${c.periods} equal payments of ${x}. Payments are made at each ${unitNoun(c.periodUnit)}'s end. Determine the exact rate per ${unitNoun(c.periodUnit)}.` },
        { contextClass: "LOAN" as const, prompt: `For an opening debt of ${p}, ${c.periods} end-of-${unitNoun(c.periodUnit)} payments of ${x} are sufficient to clear the account exactly. Find the periodic rate.` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `Repayment ledger: opening ${p}; instalment ${x}; count ${c.periods}; closing balance ₹0. Which periodic interest rate is consistent with this schedule?` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `An instalment contract finances ${p} for ${duration}. The equal payment is ${x} and is made after each period's interest. Find the interest rate per ${unitNoun(c.periodUnit)}.` },
      ];
      return deepFreeze({ ...variants[template]!, representation, stemFamilyId: family });
    }
    case "INT-QL-122": {
      const d = formatMoney(c.deposit);
      const rate = ratePhrase(c.periodicRatePercent, c.periodUnit);
      const duration = periodPhrase(c.periods, c.periodUnit);
      const variants = [
        { contextClass: "SAVINGS" as const, prompt: `${d} is deposited at the end of each ${unitNoun(c.periodUnit)} for ${duration}. The fund earns ${rate}. Find the balance immediately after the last deposit.` },
        { contextClass: "FUND" as const, prompt: `A saver adds ${d} to a fund at every ${unitNoun(c.periodUnit)}'s end. The fund earns ${rate}. What is the accumulated value after ${c.periods} deposits?` },
        { contextClass: "SAVINGS" as const, prompt: `A recurring saving plan accepts ${c.periods} equal end-of-${unitNoun(c.periodUnit)} deposits of ${d} and earns ${rate}. Calculate the maturity fund just after deposit ${c.periods}.` },
        { contextClass: "FUND" as const, prompt: `Starting from zero, a fund earns ${rate} and receives ${d} at the end of every ${unitNoun(c.periodUnit)}. Find the fund value after ${duration}.` },
        { contextClass: "SAVINGS" as const, prompt: `Savings ledger: opening ₹0; periodic rate ${rate}; deposit ${d} at each period-end; ${c.periods} deposits in all. Find the closing fund.` },
        { contextClass: "FUND" as const, prompt: `An end-of-period deposit plan runs for ${duration}. Each deposit is ${d}, and interest is ${rate}. Determine the accumulated amount immediately after the final deposit.` },
      ];
      return deepFreeze({ ...variants[template]!, representation, stemFamilyId: family });
    }
    case "INT-QL-123": {
      const x = formatMoney(c.installment);
      const rate = ratePhrase(c.periodicRatePercent, c.periodUnit);
      const variants = [
        { contextClass: "LOAN" as const, prompt: `A ${c.periods}-payment loan schedule uses equal end-of-${unitNoun(c.periodUnit)} instalments of ${x} at ${rate}. Instalment ${c.missedPaymentNumber} is missed. How much extra must be added to the final scheduled instalment to clear the debt?` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `One payment is skipped in an otherwise equal ${c.periods}-payment schedule: payment ${c.missedPaymentNumber}. The regular payment is ${x} and the rate is ${rate}. Find the catch-up amount required with the last payment.` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `An instalment plan has ${c.periods} equal payments of ${x} at ${rate}. Payment ${c.missedPaymentNumber} is not made. What additional amount, over and above the normal last instalment, is needed at the final due date?` },
        { contextClass: "LOAN" as const, prompt: `A borrower misses instalment ${c.missedPaymentNumber} in a ${c.periods}-instalment end-of-period schedule. Each normal instalment is ${x}; interest is ${rate}. Calculate the extra amount that must accompany the final instalment.` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `Payment ledger: ${c.periods} scheduled payments of ${x}; rate ${rate}; payment ${c.missedPaymentNumber} omitted; all later regular payments made. Find the final catch-up addition that restores a zero balance.` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `A customer skips the ${c.missedPaymentNumber}${c.missedPaymentNumber === 1 ? "st" : c.missedPaymentNumber === 2 ? "nd" : "th"} payment of ${x} in a ${c.periods}-payment plan at ${rate}. If the account is settled at the original final date, what extra amount is due then?` },
      ];
      return deepFreeze({ ...variants[template]!, representation, stemFamilyId: family });
    }
    case "INT-QL-124": {
      const p = formatMoney(c.openingBalance);
      const a = ratePhrase(c.rateAPercent, c.periodUnit);
      const b = ratePhrase(c.rateBPercent, c.periodUnit);
      const duration = periodPhrase(c.periods, c.periodUnit);
      const variants = [
        { contextClass: "LOAN" as const, prompt: `The same loan amount ${p} is repaid in ${c.periods} equal end-of-${unitNoun(c.periodUnit)} instalments. Plan A charges ${a}; Plan B charges ${b}. Find the absolute difference between the two instalment amounts.` },
        { contextClass: "PLAN_COMPARISON" as any, prompt: `Compare two repayment plans for ${p} over ${duration}. Both use equal period-end instalments; their rates are ${a} and ${b}. By how much do the required instalments differ?` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `A financed balance of ${p} can be repaid under two plans lasting ${duration}. One rate is ${a}, the other ${b}. Find the difference between their equal end-of-period instalments.` },
        { contextClass: "LOAN" as const, prompt: `For an opening debt of ${p}, calculate how much the equal periodic payment changes when the rate changes from ${a} to ${b}, with ${c.periods} end-of-period payments in either case.` },
        { contextClass: "GENERIC_SCHEDULE" as const, prompt: `Comparison ledger: opening ${p}; ${c.periods} end-of-${unitNoun(c.periodUnit)} payments; rate A ${a}; rate B ${b}. Find the absolute payment difference.` },
        { contextClass: "FINANCED_PURCHASE" as const, prompt: `Two finance offers cover the same ${p} balance for ${duration}. Each is repaid by equal end-of-period instalments, at rates ${a} and ${b}. Determine the difference between the instalments.` },
      ];
      const selected = variants[template]!;
      const contextClass: IntCp008ContextClass = selected.contextClass === ("PLAN_COMPARISON" as any) ? "GENERIC_SCHEDULE" : selected.contextClass;
      return deepFreeze({ prompt: selected.prompt, contextClass, representation, stemFamilyId: family });
    }
  }
}

function endBalanceRows(opening: Rational, ratePercent: Rational, installment: Rational, payments: number): string[] {
  const q = intCp008GrowthFactor(ratePercent);
  let balance = opening;
  const rows: string[] = [];
  for (let index = 1; index <= payments; index += 1) {
    const beforePayment = mul(balance, q);
    const afterPayment = sub(beforePayment, installment);
    rows.push(`After period ${index}, interest first takes the balance to ${formatMoney(beforePayment)}, then the payment leaves ${formatMoney(afterPayment)}.`);
    balance = afterPayment;
  }
  return rows;
}

function explanation(state: IntCp008PermanentState, answer: Rational): IntCp008EnglishQuestion["explanation"] {
  const c: any = state.contractState;
  switch (state.qlId) {
    case "INT-QL-116": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      const sum = intCp008GeometricSum(q, c.periods);
      return deepFreeze({
        keyIdea: "Each payment is made after that period's interest is added, so the same payment must amortize the balance through the end-of-period recurrence.",
        steps: Object.freeze([
          `We need one equal payment that reduces the opening balance ${formatMoney(c.openingBalance)} to zero after ${c.periods} payments.`,
          `The periodic rate is ${formatPercent(c.periodicRatePercent)}, so $q=1+r=1+${formulaRate(c.periodicRatePercent)}=${formatRational(q)}$.`,
          `For end-of-period payments, $B_k=B_{k-1}q-X$. Setting the balance after payment ${c.periods} equal to zero gives $X=Pq^n/(1+q+\cdots+q^{n-1})$.`,
          `Here $q^n=${formatRational(intCp008Pow(q, c.periods))}$ and $1+q+\cdots+q^{n-1}=${formatRational(sum)}$. Substituting the opening balance gives an equal instalment of ${formatMoney(answer)}.`,
          `Using ${formatMoney(answer)} each time makes the balance exactly zero after the final payment.`,
        ]),
        finalAnswer: formatMoney(answer),
        commonMistake: "Do not divide the original balance equally by the number of payments. Interest is charged on the outstanding balance before each payment.",
      });
    }
    case "INT-QL-117": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      const sum = intCp008GeometricSum(q, c.periods);
      return deepFreeze({
        keyIdea: "Work backwards from the equal end-of-period cash flows to the single opening balance that they exactly clear.",
        steps: Object.freeze([
          `The schedule gives ${c.periods} equal payments or withdrawals of ${formatMoney(c.installment)} and asks for the starting balance.`,
          `With periodic rate ${formatPercent(c.periodicRatePercent)}, $q=1+r=${formatRational(q)}$.`,
          `For an end-of-period equal-payment schedule, $P=X(1+q+\cdots+q^{n-1})/q^n$.`,
          `The geometric sum is ${formatRational(sum)} and $q^n=${formatRational(intCp008Pow(q, c.periods))}$. Substitution gives ${formatMoney(answer)}.`,
          `Starting with ${formatMoney(answer)} and applying interest before each ${formatMoney(c.installment)} cash flow leaves exactly zero after the last one.`,
        ]),
        finalAnswer: formatMoney(answer),
        commonMistake: "Simply multiplying the instalment by the number of periods ignores the interest earned or charged on the remaining balance.",
      });
    }
    case "INT-QL-118": {
      const rows = endBalanceRows(c.openingBalance, c.periodicRatePercent, c.installment, c.afterPayments);
      return deepFreeze({
        keyIdea: "Update the balance in the stated order: add interest first, then subtract the payment. Stop immediately after the required payment.",
        steps: Object.freeze([
          `We start from ${formatMoney(c.openingBalance)} and need the balance immediately after payment ${c.afterPayments}.`,
          `The recurrence is $B_k=B_{k-1}(1+r)-X$, with $r=${formulaRate(c.periodicRatePercent)}$ and payment ${formatMoney(c.installment)}.`,
          ...rows,
          `Therefore the outstanding balance at the requested point is ${formatMoney(answer)}.`,
        ]),
        finalAnswer: formatMoney(answer),
        commonMistake: "Do not subtract all instalments from the original loan at once. Interest is applied to the changing outstanding balance period by period.",
      });
    }
    case "INT-QL-119": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      const balanceAfterRegular = intCp008EndPaymentBalance(c.openingBalance, c.periodicRatePercent, c.regularInstallment, c.periods - 1);
      return deepFreeze({
        keyIdea: "First find the balance after the regular payments. The final balancing payment is the amount due after one last interest posting.",
        steps: Object.freeze([
          `The first ${c.periods - 1} payments are fixed at ${formatMoney(c.regularInstallment)}; only the last payment is unknown.`,
          `Using $B_k=B_{k-1}(1+r)-X$ for those regular payments leaves ${formatMoney(balanceAfterRegular)} immediately after payment ${c.periods - 1}.`,
          `One final period of interest is then added: multiply by $q=1+r=${formatRational(q)}$.`,
          `The amount due just before the last payment is ${formatMoney(answer)}. Paying exactly this amount makes the closing balance zero.`,
        ]),
        finalAnswer: formatMoney(answer),
        commonMistake: "Do not use the regular instalment automatically as the final payment. The earlier payments were intentionally set at a different amount.",
      });
    }
    case "INT-QL-120": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      const sum = intCp008GeometricSum(q, c.periods);
      const endPayment = intCp008EndInstallment(c.openingBalance, c.periodicRatePercent, c.periods);
      return deepFreeze({
        keyIdea: "Here payment comes before interest, so the event order is different from an ordinary end-of-period instalment schedule.",
        steps: Object.freeze([
          `The first instalment is paid immediately, and every later payment is also made before that period's interest is applied.`,
          `The correct recurrence is $B_k=(B_{k-1}-X)(1+r)$, not the end-of-period recurrence.`,
          `Solving $B_n=0$ gives $X=Pq^{n-1}/(1+q+\cdots+q^{n-1})$, where $q=${formatRational(q)}$ and the geometric sum is ${formatRational(sum)}$.`,
          `Substituting ${formatMoney(c.openingBalance)} gives ${formatMoney(answer)} per beginning-of-period payment.`,
          `For comparison, the end-of-period payment would be ${formatMoney(endPayment)}, which is higher because each payment is made later.`,
        ]),
        finalAnswer: formatMoney(answer),
        commonMistake: "Do not use the usual end-of-period instalment formula. Paying before interest reduces the balance sooner and changes the required instalment.",
      });
    }
    case "INT-QL-121": {
      const rows = endBalanceRows(c.openingBalance, answer, c.installment, c.periods);
      return deepFreeze({
        keyIdea: "The rate is an inverse variable. Use the exact repayment recurrence and find the periodic rate that makes the final balance exactly zero.",
        steps: Object.freeze([
          `The opening debt is ${formatMoney(c.openingBalance)}, the equal payment is ${formatMoney(c.installment)}, and there are ${c.periods} end-of-period payments.`,
          `For a trial rate $r$, the balance follows $B_k=B_{k-1}(1+r)-X$.`,
          `At ${formatPercent(answer)} per ${unitNoun(c.periodUnit)}, the schedule becomes:`,
          ...rows,
          `The last balance is exactly ₹0, so the required periodic rate is ${formatPercent(answer)}.`,
        ]),
        finalAnswer: formatPercent(answer),
        commonMistake: "Do not divide total interest by the opening balance as if this were simple interest. The balance changes after every instalment.",
      });
    }
    case "INT-QL-122": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      let fund = rat(0n);
      const rows: string[] = [];
      for (let index = 1; index <= c.periods; index += 1) {
        fund = add(mul(fund, q), c.deposit);
        rows.push(`After deposit ${index}, the fund is ${formatMoney(fund)}.`);
      }
      return deepFreeze({
        keyIdea: "For end-of-period deposits, the existing fund earns interest first and the new equal deposit is then added.",
        steps: Object.freeze([
          `The fund starts at ₹0 and receives ${c.periods} equal deposits of ${formatMoney(c.deposit)}.`,
          `With $q=1+r=${formatRational(q)}$, the recurrence is $F_k=F_{k-1}q+D$.`,
          ...rows,
          `So immediately after the final deposit, the accumulated fund is ${formatMoney(answer)}.`,
        ]),
        finalAnswer: formatMoney(answer),
        commonMistake: "The final deposit earns no interest before the stated valuation point because the balance is asked immediately after that deposit.",
      });
    }
    case "INT-QL-123": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      const remainingGrowthPeriods = c.periods - c.missedPaymentNumber;
      return deepFreeze({
        keyIdea: "A missed payment remains inside the debt and therefore accumulates interest until the original final due date.",
        steps: Object.freeze([
          `The missed amount is one regular instalment, ${formatMoney(c.installment)}, due at payment ${c.missedPaymentNumber}.`,
          `From that missed due date to the final due date there are ${remainingGrowthPeriods} full interest period${remainingGrowthPeriods === 1 ? "" : "s"}.`,
          `The extra amount required at the end is therefore $E=X(1+r)^{n-m}$.`,
          `Here $X=${formatRational(c.installment)}$, $1+r=${formatRational(q)}$, and $n-m=${remainingGrowthPeriods}$, giving ${formatMoney(answer)}.`,
          `This is added to the normal final instalment; the question asks only for the extra catch-up amount.`,
        ]),
        finalAnswer: formatMoney(answer),
        commonMistake: "Do not answer with the missed instalment alone. Because it was unpaid, it continues to carry interest until settlement.",
      });
    }
    case "INT-QL-124": {
      const installmentA = intCp008EndInstallment(c.openingBalance, c.rateAPercent, c.periods);
      const installmentB = intCp008EndInstallment(c.openingBalance, c.rateBPercent, c.periods);
      return deepFreeze({
        keyIdea: "Compute the equal instalment independently under each rate, then take the absolute difference between the two payments.",
        steps: Object.freeze([
          `Both plans finance the same opening balance ${formatMoney(c.openingBalance)} for the same ${c.periods} periods, so only the periodic rate changes.`,
          `Using the end-of-period instalment relation under rate A ${formatPercent(c.rateAPercent)} gives ${formatMoney(installmentA)}.`,
          `Using the same relation under rate B ${formatPercent(c.rateBPercent)} gives ${formatMoney(installmentB)}.`,
          `The asked difference is $|X_A-X_B|$, which equals ${formatMoney(answer)}.`,
        ]),
        finalAnswer: formatMoney(answer),
        commonMistake: "Do not subtract the two interest rates and treat that percentage as the payment difference. Each rate changes the whole repayment schedule.",
      });
    }
  }
}

function distractors(state: IntCp008PermanentState, answer: Rational): Readonly<{ values: readonly Rational[]; ids: readonly string[] }> {
  const c: any = state.contractState;
  const fallback = [
    div(answer, rat(2n)),
    mul(answer, rat(2n)),
    mul(answer, rat(3n, 2n)),
    mul(answer, rat(2n, 3n)),
    mul(answer, rat(4n, 3n)),
    mul(answer, rat(3n, 4n)),
  ];

  switch (state.qlId) {
    case "INT-QL-116": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      const candidates = [
        div(c.openingBalance, rat(BigInt(c.periods))),
        div(mul(c.openingBalance, intCp008Pow(q, c.periods)), rat(BigInt(c.periods))),
        mul(answer, q),
        div(answer, q),
        ...fallback,
      ];
      return deepFreeze({ values: uniqueWrongValues(state, candidates), ids: Object.freeze(["IGNORE_INTEREST", "DIVIDE_MATURITY_EQUALLY", "ONE_PERIOD_LATE"]) });
    }
    case "INT-QL-117": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      const candidates = [
        mul(c.installment, rat(BigInt(c.periods))),
        mul(c.installment, intCp008GeometricSum(q, c.periods)),
        mul(answer, q),
        div(answer, q),
        ...fallback,
      ];
      return deepFreeze({ values: uniqueWrongValues(state, candidates), ids: Object.freeze(["IGNORE_INTEREST", "USE_FUTURE_VALUE_AS_PRESENT", "SHIFT_ONE_PERIOD"]) });
    }
    case "INT-QL-118": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      const beforeRequestedPayment = mul(intCp008EndPaymentBalance(c.openingBalance, c.periodicRatePercent, c.installment, c.afterPayments - 1), q);
      const candidates = [
        sub(c.openingBalance, mul(c.installment, rat(BigInt(c.afterPayments)))),
        beforeRequestedPayment,
        add(answer, c.installment),
        div(answer, q),
        ...fallback,
      ];
      return deepFreeze({ values: uniqueWrongValues(state, candidates), ids: Object.freeze(["IGNORE_INTEREST", "STOP_BEFORE_PAYMENT", "FORGET_LATEST_PAYMENT"]) });
    }
    case "INT-QL-119": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      const afterRegular = intCp008EndPaymentBalance(c.openingBalance, c.periodicRatePercent, c.regularInstallment, c.periods - 1);
      const candidates = [
        c.regularInstallment,
        afterRegular,
        div(answer, q),
        sub(answer, c.regularInstallment),
        ...fallback,
      ];
      return deepFreeze({ values: uniqueWrongValues(state, candidates), ids: Object.freeze(["ASSUME_REGULAR_FINAL_PAYMENT", "FORGET_FINAL_INTEREST", "DISCOUNT_FINAL_DUE_AGAIN"]) });
    }
    case "INT-QL-120": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      const endPayment = intCp008EndInstallment(c.openingBalance, c.periodicRatePercent, c.periods);
      const candidates = [
        endPayment,
        div(c.openingBalance, rat(BigInt(c.periods))),
        mul(answer, q),
        div(answer, q),
        ...fallback,
      ];
      return deepFreeze({ values: uniqueWrongValues(state, candidates), ids: Object.freeze(["USE_END_PERIOD_FORMULA", "IGNORE_INTEREST", "SHIFT_PAYMENT_ONE_PERIOD"]) });
    }
    case "INT-QL-121": {
      const candidates = [...INT_CP008_RATE_LIBRARY.filter((value) => !eq(value, answer)), ...fallback];
      return deepFreeze({ values: uniqueWrongValues(state, candidates), ids: Object.freeze(["LOWER_BOUNDED_RATE", "NEIGHBOUR_BOUNDED_RATE", "OTHER_BOUNDED_RATE"]) });
    }
    case "INT-QL-122": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      const candidates = [
        mul(c.deposit, rat(BigInt(c.periods))),
        mul(c.deposit, intCp008Pow(q, c.periods)),
        sub(answer, c.deposit),
        mul(answer, q),
        ...fallback,
      ];
      return deepFreeze({ values: uniqueWrongValues(state, candidates), ids: Object.freeze(["IGNORE_INTEREST", "GROW_ONLY_ONE_DEPOSIT", "OMIT_FINAL_DEPOSIT"]) });
    }
    case "INT-QL-123": {
      const q = intCp008GrowthFactor(c.periodicRatePercent);
      const remaining = c.periods - c.missedPaymentNumber;
      const candidates = [
        c.installment,
        mul(c.installment, intCp008Pow(q, Math.max(0, remaining - 1))),
        mul(c.installment, intCp008Pow(q, remaining + 1)),
        mul(c.installment, q),
        ...fallback,
      ];
      return deepFreeze({ values: uniqueWrongValues(state, candidates), ids: Object.freeze(["IGNORE_MISSED_PAYMENT_INTEREST", "ONE_PERIOD_TOO_SHORT", "ONE_PERIOD_TOO_LONG"]) });
    }
    case "INT-QL-124": {
      const a = intCp008EndInstallment(c.openingBalance, c.rateAPercent, c.periods);
      const b = intCp008EndInstallment(c.openingBalance, c.rateBPercent, c.periods);
      const candidates = [
        a,
        b,
        mul(answer, rat(2n)),
        div(answer, rat(2n)),
        abs(sub(mul(c.openingBalance, div(c.rateAPercent, rat(100n))), mul(c.openingBalance, div(c.rateBPercent, rat(100n))))),
        ...fallback,
      ];
      return deepFreeze({ values: uniqueWrongValues(state, candidates), ids: Object.freeze(["RETURN_PLAN_A_PAYMENT", "RETURN_PLAN_B_PAYMENT", "DOUBLE_DIFFERENCE"]) });
    }
  }
}

export function generateIntCp008EnglishQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp008EnglishQuestion {
  if (!INT_CP008_QL_IDS.includes(qlId)) throw new Error(`Unknown CP008 QL ${qlId}`);
  const mathematicalState = constructIntCp008State(qlId, seed);
  const answer = solveIntCp008(mathematicalState);
  if (!verifyIntCp008Answer(mathematicalState, answer)) throw new Error(`${qlId}/${seed}: canonical answer failed verification`);

  const template = hash(`${seed}:${qlId}:english-stem-family`) % 6;
  const presentation = stem(qlId, mathematicalState, template);
  const wrong = distractors(mathematicalState, answer);
  const arranged = arrangeOptions(mathematicalState, seed, answer, wrong.values, wrong.ids);
  const learnerExplanation = explanation(mathematicalState, answer);
  const fingerprint = stable(mathematicalState);

  return deepFreeze({
    id: `int-cp008-en-v1:${qlId}:${hash(`${seed}:${fingerprint}`)}`,
    runtimeVersion: INT_CP008_RUNTIME_VERSION,
    englishVersion: INT_CP008_ENGLISH_VERSION,
    checkpointId: "INT-CP-008",
    qlId,
    locale,
    seed,
    mathematicalState,
    answerSemantic: mathematicalState.answerSemantic,
    presentation: deepFreeze({
      markdown: presentation.prompt,
      prompt: presentation.prompt,
      representation: presentation.representation,
      contextClass: presentation.contextClass,
      stemFamilyId: presentation.stemFamilyId,
    }),
    options: arranged.options,
    correctIndex: arranged.correctIndex,
    correctAnswer: formatAnswer(mathematicalState, answer),
    explanation: learnerExplanation,
    mathematicalFingerprint: fingerprint,
    editorialStatus: "ENGLISH_REVIEW",
    approvalStatus: "PENDING_PRODUCT_REVIEW",
    allocationStatus: "PERMANENT_QL_ALLOCATED_INACTIVE",
    permanentIdentityFrozen: INT_CP008_PERMANENT_ALLOCATION.permanentIdentityFrozen,
    learnerContentFrozen: false,
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  });
}
