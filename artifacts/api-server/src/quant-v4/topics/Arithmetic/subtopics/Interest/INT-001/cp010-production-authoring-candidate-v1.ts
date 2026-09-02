import { createHash } from "node:crypto";
import { add, div, eq, hash, mul, rat, sub, type Rational } from "./cp003-exam-model";
import {
  solveIntCp010Discovery,
  verifyIntCp010DiscoveryAnswer,
  type IntCp010PrototypeState,
} from "./cp010-mixed-systems-discovery-v1";
import { INT_CP010_PROPOSED_AUTHORITIES } from "./cp010-two-authority-proposal-v1";

export const INT_CP010_PRODUCTION_CANDIDATE_VERSION = "INT-CP-010-PRODUCTION-AUTHORING-CANDIDATE-v1" as const;
export const INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES = Object.freeze([
  "INT-CP010-AUTH-01",
  "INT-CP010-AUTH-02",
] as const);
export type IntCp010CandidateAuthorityId = (typeof INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES)[number];

const RATE_LIBRARY = Object.freeze([rat(10n), rat(15n), rat(20n), rat(25n)] as const);
const AUTH01_CONTEXTS = Object.freeze([
  "bank loan",
  "education loan",
  "farm-machinery finance",
  "business equipment loan",
  "cooperative-society loan",
  "vehicle finance",
  "shop-expansion loan",
  "solar-equipment loan",
] as const);
const AUTH02_CONTEXTS = Object.freeze([
  "bank loan",
  "education loan",
  "farm-equipment loan",
  "business advance",
  "cooperative-society loan",
  "vehicle loan",
  "workshop-equipment finance",
  "crop-storage loan",
] as const);

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

function stableIndex(seed: string, modulo: number) {
  const digest = createHash("sha256").update(seed).digest();
  return digest.readUInt32BE(0) % modulo;
}

function rateFactor(ratePercent: Rational) {
  return add(rat(1n), div(ratePercent, rat(100n)));
}

function variableDebtBalance(openingDebt: Rational, repayments: readonly Rational[], ratesPercent: readonly Rational[]) {
  let balance = openingDebt;
  for (let index = 0; index < ratesPercent.length; index += 1) {
    balance = sub(mul(balance, rateFactor(ratesPercent[index]!)), repayments[index]!);
  }
  return balance;
}

function openingDebtFromVariableRepayments(repayments: readonly Rational[], ratesPercent: readonly Rational[]) {
  let balanceAfter = rat(0n);
  for (let index = ratesPercent.length - 1; index >= 0; index -= 1) {
    balanceAfter = div(add(balanceAfter, repayments[index]!), rateFactor(ratesPercent[index]!));
  }
  return balanceAfter;
}

function equalInstalmentForVariableRates(openingDebt: Rational, ratesPercent: readonly Rational[]) {
  let suffix = rat(1n);
  let weight = rat(0n);
  for (let index = ratesPercent.length - 1; index >= 0; index -= 1) {
    weight = add(weight, suffix);
    suffix = mul(suffix, rateFactor(ratesPercent[index]!));
  }
  return div(mul(openingDebt, suffix), weight);
}

function factorNumeratorProduct(rates: readonly Rational[]) {
  return rates.reduce((product, rate) => product * rateFactor(rate).numerator, 1n);
}

function deterministicRateSequence(seed: string) {
  const length = 2 + stableIndex(`${seed}:period-count`, 2);
  const rates = Array.from({ length }, (_, index) => RATE_LIBRARY[stableIndex(`${seed}:rate:${index}`, RATE_LIBRARY.length)]!);
  if (rates.every((rate) => eq(rate, rates[0]!))) {
    const last = rates.at(-1)!;
    const currentIndex = RATE_LIBRARY.findIndex((rate) => eq(rate, last));
    rates[rates.length - 1] = RATE_LIBRARY[(currentIndex + 1) % RATE_LIBRARY.length]!;
  }
  return Object.freeze(rates);
}

function constructCandidateState(authorityId: IntCp010CandidateAuthorityId, seed: string): IntCp010PrototypeState {
  const rates = deterministicRateSequence(`${authorityId}:${seed}`);
  const base = factorNumeratorProduct(rates);
  if (authorityId === "INT-CP010-AUTH-01") {
    const scale = BigInt(5 + stableIndex(`${seed}:auth01:scale`, 76));
    const instalment = rat(base * scale);
    const openingDebt = openingDebtFromVariableRepayments(rates.map(() => instalment), rates);
    if (openingDebt.denominator !== 1n) throw new Error(`${authorityId}/${seed}: friendly equal-instalment opening debt is not integral`);
    return deepFreeze({ prototypeId: "INT-CP010-PROT-003", openingDebt, periodRatesPercent: rates });
  }

  const scale = BigInt(4 + stableIndex(`${seed}:auth02:scale`, 42));
  const coefficients = Array.from({ length: rates.length }, (_, index) => 1n + BigInt(stableIndex(`${seed}:auth02:coefficient:${index}`, 3)));
  if (coefficients.every((value) => value === coefficients[0])) coefficients[coefficients.length - 1] = coefficients[0] === 3n ? 1n : coefficients[0]! + 1n;
  const repayments = Object.freeze(coefficients.map((coefficient) => rat(base * scale * coefficient)));
  const openingDebt = openingDebtFromVariableRepayments(repayments, rates);
  if (openingDebt.denominator !== 1n) throw new Error(`${authorityId}/${seed}: friendly heterogeneous opening debt is not integral`);
  return deepFreeze({ prototypeId: "INT-CP010-PROT-004", periodRatesPercent: rates, repayments });
}

function indianInteger(value: bigint): string {
  const negative = value < 0n;
  const source = (negative ? -value : value).toString();
  if (source.length <= 3) return `${negative ? "−" : ""}${source}`;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${negative ? "−" : ""}${groups.join(",")},${tail}`;
}

function money(value: Rational): string {
  const negative = value.numerator < 0n;
  const numerator = negative ? -value.numerator : value.numerator;
  let paise = (numerator * 100n) / value.denominator;
  const remainder = (numerator * 100n) % value.denominator;
  if (remainder * 2n >= value.denominator) paise += 1n;
  const rupees = paise / 100n;
  const p = paise % 100n;
  const body = p === 0n ? indianInteger(rupees) : `${indianInteger(rupees)}.${p.toString().padStart(2, "0")}`;
  return `${negative ? "−" : ""}₹${body}`;
}

function percent(value: Rational) {
  return value.denominator === 1n ? `${value.numerator}%` : `${value.numerator}/${value.denominator}%`;
}

function rateSchedule(rates: readonly Rational[]) {
  return rates.map((rate, index) => `year ${index + 1}: ${percent(rate)}`).join(", ");
}

function paymentSchedule(payments: readonly Rational[]) {
  return payments.map((payment, index) => `${money(payment)} at the end of year ${index + 1}`).join(", ");
}

function promptFor(authorityId: IntCp010CandidateAuthorityId, state: IntCp010PrototypeState, seed: string) {
  const familyIndex = stableIndex(`${seed}:stem-family`, 8);
  if (authorityId === "INT-CP010-AUTH-01" && state.prototypeId === "INT-CP010-PROT-003") {
    const context = AUTH01_CONTEXTS[familyIndex]!;
    const periods = state.periodRatesPercent.length;
    const variants = [
      `A ${context} of ${money(state.openingDebt)} is to be cleared by ${periods} equal annual instalments paid at the end of each year. The reducing-balance interest rates are ${rateSchedule(state.periodRatesPercent)}. Find each instalment.`,
      `${money(state.openingDebt)} is borrowed under a ${context}. The rate changes each year as follows: ${rateSchedule(state.periodRatesPercent)}. If the debt is cleared by the same payment at each year-end, what is the annual payment?`,
      `A borrower repays a ${context} of ${money(state.openingDebt)} in ${periods} equal year-end payments. The outstanding balance is charged successively at ${state.periodRatesPercent.map(percent).join(", ")}. Determine the equal repayment.`,
      `For a ${context}, the opening balance is ${money(state.openingDebt)}. Interest is charged at ${rateSchedule(state.periodRatesPercent)}, and one equal instalment is paid after each year's interest. Find that instalment.`,
      `A ${context} starts with a debt of ${money(state.openingDebt)}. Over the next ${periods} years the annual rates are ${state.periodRatesPercent.map(percent).join(", ")} respectively. Equal payments at each year-end exactly close the account. Find the payment.`,
      `A lender allows a ${context} of ${money(state.openingDebt)} to be repaid through ${periods} identical end-of-year instalments. Since the annual rates change according to ${rateSchedule(state.periodRatesPercent)}, calculate the instalment that leaves no balance after the last payment.`,
      `The outstanding amount on a ${context} is initially ${money(state.openingDebt)}. The next ${periods} yearly rates are ${state.periodRatesPercent.map(percent).join(", ")}. What equal amount must be paid at the end of every year to settle the balance exactly?`,
      `A ${context} worth ${money(state.openingDebt)} is financed on a reducing balance. Rates for successive years are ${state.periodRatesPercent.map(percent).join(", ")}. The borrower makes ${periods} equal payments, one after each year's interest is added. Find each payment.`,
    ];
    return deepFreeze({ stemFamilyId: `${authorityId}-CAND-T${familyIndex + 1}`, context, prompt: variants[familyIndex]! });
  }

  if (authorityId === "INT-CP010-AUTH-02" && state.prototypeId === "INT-CP010-PROT-004") {
    const context = AUTH02_CONTEXTS[familyIndex]!;
    const variants = [
      `A ${context} is exactly cleared by the repayments ${paymentSchedule(state.repayments)}. The reducing-balance rates are ${rateSchedule(state.periodRatesPercent)}. Find the amount originally borrowed.`,
      `Under a ${context}, the borrower pays ${paymentSchedule(state.repayments)}. The annual interest rates change as ${state.periodRatesPercent.map(percent).join(", ")} respectively. If the final payment clears the debt, what was the opening loan?`,
      `A borrower follows this repayment schedule for a ${context}: ${paymentSchedule(state.repayments)}. Interest on the outstanding balance is charged at ${rateSchedule(state.periodRatesPercent)}. Determine the initial debt.`,
      `The repayments on a ${context} are unequal: ${paymentSchedule(state.repayments)}. With yearly reducing-balance rates of ${state.periodRatesPercent.map(percent).join(", ")}, the account closes after the last payment. Find the starting balance.`,
      `A ${context} is settled through ${state.repayments.length} year-end repayments: ${state.repayments.map(money).join(", ")}. The corresponding yearly rates are ${state.periodRatesPercent.map(percent).join(", ")}. Calculate the amount financed at the start.`,
      `The final balance on a ${context} becomes zero after payments of ${paymentSchedule(state.repayments)}. The rate changes each year according to ${rateSchedule(state.periodRatesPercent)}. Work out the original loan amount.`,
      `For a ${context}, repayments of ${state.repayments.map(money).join(", ")} are made at successive year-ends. Rates in those years are ${state.periodRatesPercent.map(percent).join(", ")}. If nothing remains due after the last repayment, find the opening debt.`,
      `A lender records the following year-end receipts on a ${context}: ${paymentSchedule(state.repayments)}. The outstanding balance earns interest at ${rateSchedule(state.periodRatesPercent)} before each receipt. What balance was outstanding at the beginning?`,
    ];
    return deepFreeze({ stemFamilyId: `${authorityId}-CAND-T${familyIndex + 1}`, context, prompt: variants[familyIndex]! });
  }
  throw new Error(`${authorityId}/${seed}: authority/state mismatch`);
}

function constantRateEqualInstalment(openingDebt: Rational, rate: Rational, periods: number) {
  return equalInstalmentForVariableRates(openingDebt, Array.from({ length: periods }, () => rate));
}

function constantRateOpeningDebt(repayments: readonly Rational[], rate: Rational) {
  return openingDebtFromVariableRepayments(repayments, repayments.map(() => rate));
}

function uniqueMoneyOptions(correct: Rational, candidates: readonly { value: Rational; misconceptionId: string }[], seed: string) {
  const unique: { value: Rational; misconceptionId: string }[] = [];
  const seen = new Set([stable(correct)]);
  for (const candidate of candidates) {
    const key = stable(candidate.value);
    if (candidate.value.numerator > 0n && !seen.has(key)) { seen.add(key); unique.push(candidate); }
    if (unique.length === 3) break;
  }
  let offset = 1;
  while (unique.length < 3) {
    const step = rat(500n * BigInt(2 + stableIndex(`${seed}:near-miss:${offset}`, 9)));
    const candidate = add(correct, mul(step, rat(BigInt(offset))));
    const key = stable(candidate);
    if (!seen.has(key)) { seen.add(key); unique.push({ value: candidate, misconceptionId: "ARITHMETIC_NEAR_MISS" }); }
    offset += 1;
  }
  const desired = stableIndex(`${seed}:answer-position`, 4);
  const ordered = [...unique];
  ordered.splice(desired, 0, { value: correct, misconceptionId: "CORRECT" });
  return Object.freeze(ordered.map((item) => deepFreeze({
    value: item.value,
    text: money(item.value),
    misconceptionId: item.misconceptionId,
    isCorrect: eq(item.value, correct),
  })));
}

function optionsFor(authorityId: IntCp010CandidateAuthorityId, state: IntCp010PrototypeState, answer: Rational, seed: string) {
  if (authorityId === "INT-CP010-AUTH-01" && state.prototypeId === "INT-CP010-PROT-003") {
    return uniqueMoneyOptions(answer, [
      { value: div(state.openingDebt, rat(BigInt(state.periodRatesPercent.length))), misconceptionId: "IGNORE_INTEREST" },
      { value: constantRateEqualInstalment(state.openingDebt, state.periodRatesPercent[0]!, state.periodRatesPercent.length), misconceptionId: "USE_FIRST_RATE_FOR_ALL_YEARS" },
      { value: constantRateEqualInstalment(state.openingDebt, state.periodRatesPercent.at(-1)!, state.periodRatesPercent.length), misconceptionId: "USE_LAST_RATE_FOR_ALL_YEARS" },
    ], seed);
  }
  if (authorityId === "INT-CP010-AUTH-02" && state.prototypeId === "INT-CP010-PROT-004") {
    return uniqueMoneyOptions(answer, [
      { value: state.repayments.reduce((sum, value) => add(sum, value), rat(0n)), misconceptionId: "ADD_PAYMENTS_WITHOUT_DISCOUNTING" },
      { value: constantRateOpeningDebt(state.repayments, state.periodRatesPercent[0]!), misconceptionId: "USE_FIRST_RATE_FOR_ALL_YEARS" },
      { value: constantRateOpeningDebt(state.repayments, state.periodRatesPercent.at(-1)!), misconceptionId: "USE_LAST_RATE_FOR_ALL_YEARS" },
    ], seed);
  }
  throw new Error(`${authorityId}/${seed}: authority/state mismatch while building options`);
}

function explanationFor(authorityId: IntCp010CandidateAuthorityId, state: IntCp010PrototypeState, answer: Rational) {
  if (authorityId === "INT-CP010-AUTH-01" && state.prototypeId === "INT-CP010-PROT-003") {
    let balance = state.openingDebt;
    const lines = state.periodRatesPercent.map((rate, index) => {
      const factor = rateFactor(rate);
      const next = sub(mul(balance, factor), answer);
      const line = `Year ${index + 1}: ${money(balance)} × ${factor.numerator}/${factor.denominator} − ${money(answer)} = ${money(next)}.`;
      balance = next;
      return line;
    });
    if (!eq(balance, rat(0n))) throw new Error("AUTH-01 explanation replay did not close at zero");
    return deepFreeze({
      keyIdea: "The interest rate changes from year to year, so update the outstanding balance with that year's own rate and then subtract the same instalment.",
      steps: Object.freeze([
        `Given: opening debt ${money(state.openingDebt)}; yearly rates ${state.periodRatesPercent.map(percent).join(", ")}; ${state.periodRatesPercent.length} equal end-of-year instalments. We need the common instalment.`,
        ...lines,
        `The last balance is ₹0, so the equal instalment is ${money(answer)}.`,
      ]),
      finalAnswer: money(answer),
    });
  }

  if (authorityId === "INT-CP010-AUTH-02" && state.prototypeId === "INT-CP010-PROT-004") {
    let balanceAfter = rat(0n);
    const reverseLines: string[] = [];
    for (let index = state.periodRatesPercent.length - 1; index >= 0; index -= 1) {
      const factor = rateFactor(state.periodRatesPercent[index]!);
      const previous = div(add(balanceAfter, state.repayments[index]!), factor);
      reverseLines.unshift(`Before year ${index + 1}: (${money(balanceAfter)} + ${money(state.repayments[index]!)}) ÷ ${factor.numerator}/${factor.denominator} = ${money(previous)}.`);
      balanceAfter = previous;
    }
    if (!eq(balanceAfter, answer)) throw new Error("AUTH-02 explanation reverse replay drifted");
    return deepFreeze({
      keyIdea: "Start from the zero balance after the final repayment. For each year, add back that year's repayment and then undo that year's own interest factor.",
      steps: Object.freeze([
        `Given: repayments ${state.repayments.map(money).join(", ")} at successive year-ends and yearly rates ${state.periodRatesPercent.map(percent).join(", ")}. The final balance is zero; we need the opening debt.`,
        ...reverseLines,
        `Working back to the beginning gives the original debt ${money(answer)}.`,
      ]),
      finalAnswer: money(answer),
    });
  }
  throw new Error("CP010 candidate explanation authority/state mismatch");
}

export function generateIntCp010ProductionCandidate(authorityId: IntCp010CandidateAuthorityId, seed: string | number) {
  const sourceSeed = String(seed);
  const authority = INT_CP010_PROPOSED_AUTHORITIES.find((entry) => entry.authorityId === authorityId);
  if (!authority) throw new Error(`Unknown CP010 candidate authority ${authorityId}`);
  const state = constructCandidateState(authorityId, sourceSeed);
  const answer = solveIntCp010Discovery(state);
  if (!verifyIntCp010DiscoveryAnswer(state, answer)) throw new Error(`${authorityId}/${sourceSeed}: independent verifier rejected production candidate`);
  const presentation = promptFor(authorityId, state, sourceSeed);
  const options = optionsFor(authorityId, state, answer, sourceSeed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${authorityId}/${sourceSeed}: option ownership invalid`);
  const explanation = explanationFor(authorityId, state, answer);
  const mathematicalFingerprint = createHash("sha256").update(stable({ authorityId, state, answer })).digest("hex");

  return deepFreeze({
    productionCandidateVersion: INT_CP010_PRODUCTION_CANDIDATE_VERSION,
    checkpointId: "INT-CP-010" as const,
    authorityId,
    permanentQlId: null,
    permanentIdentityAllocated: false as const,
    sourcePrototypeId: state.prototypeId,
    solveContract: authority.solveContract,
    answerSemantic: authority.answerSemantic,
    seed: sourceSeed,
    locale: "en-IN" as const,
    mathematicalState: state,
    mathematicalFingerprint,
    stemFamilyId: presentation.stemFamilyId,
    context: presentation.context,
    stem: presentation.prompt,
    options,
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    answer,
    explanation,
    difficultyBand: "Hard" as const,
    maturity: "PRODUCTION_AUTHORING_CANDIDATE" as const,
    lifecycle: deepFreeze({
      active: false as const,
      permanentIdentityAllocated: false as const,
      stagingStatus: "NOT_STAGED" as const,
      registrationStatus: "NOT_REGISTERED" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}
