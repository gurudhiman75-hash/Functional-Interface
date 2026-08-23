import { rat, type Rational } from "./cp003-exam-model";
import {
  answerSemanticForIntCp009Prototype,
  intCp009DebtBalanceByRecurrence,
  type IntCp009PrototypeId,
} from "./cp009-dated-cash-flow-discovery-v1";
import {
  buildIntCp009ExamReadyDiscoveryPackage as buildV2,
} from "./cp009-dated-cash-flow-exam-ready-v2";

export * from "./cp009-dated-cash-flow-exam-ready-v2";
export const INT_CP009_EXAM_READY_POLISH_VERSION = "INT-CP-009-DATED-CASH-FLOW-EXAM-READY-v3-polish" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function indianInteger(value: bigint): string {
  const source = value.toString();
  if (source.length <= 3) return source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  return `${groups.join(",")},${tail}`;
}

function signedMoney(value: Rational): string {
  const negative = value.numerator < 0n;
  const numerator = negative ? -value.numerator : value.numerator;
  let paise = (numerator * 100n) / value.denominator;
  const remainder = (numerator * 100n) % value.denominator;
  if (remainder * 2n >= value.denominator) paise += 1n;
  const rupees = paise / 100n;
  const p = paise % 100n;
  const amount = p === 0n ? indianInteger(rupees) : `${indianInteger(rupees)}.${p.toString().padStart(2, "0")}`;
  return `${negative ? "−" : ""}₹${amount}`;
}

function percent(value: Rational): string {
  return value.denominator === 1n ? `${value.numerator}%` : `${value.numerator}/${value.denominator}%`;
}

export function buildIntCp009ExamReadyPolishedPackage(prototypeId: IntCp009PrototypeId, seed: string) {
  const source = buildV2(prototypeId, seed) as any;
  let presentation = source.presentation;
  let explanation = source.explanation;

  if (prototypeId === "INT-CP009-PROT-004") {
    const prompt = String(source.presentation.prompt).replace(
      /determine the balance left immediately after (the end of (?:year \d+|the \w+ half-year))\./u,
      "determine the balance left immediately after the repayment made at $1.",
    );
    presentation = deepFreeze({ ...source.presentation, prompt });
  }

  if (prototypeId === "INT-CP009-PROT-007") {
    const state = source.mathematicalState;
    const finalPeriod = Math.max(...state.repayments.map((flow: any) => flow.atPeriod));
    const candidateRates = [rat(10n), rat(15n), rat(20n), rat(25n)];
    const results = candidateRates.map((rate) => ({
      rate,
      balance: intCp009DebtBalanceByRecurrence(state.openingDebt, state.repayments, rate, finalPeriod),
    }));
    explanation = deepFreeze({
      keyIdea: "Test the option rates in the repayment recurrence. The correct rate is the only one that leaves a zero balance after the final repayment.",
      steps: Object.freeze([
        `Start with ${signedMoney(state.openingDebt)} and use B(new) = B(old) × (1 + r) − payment for every dated repayment.`,
        `${percent(results[0]!.rate)} leaves ${signedMoney(results[0]!.balance)}; ${percent(results[1]!.rate)} leaves ${signedMoney(results[1]!.balance)}.`,
        `${percent(results[2]!.rate)} leaves ${signedMoney(results[2]!.balance)}; ${percent(results[3]!.rate)} leaves ${signedMoney(results[3]!.balance)}.`,
        `Only ${percent(source.answer)} leaves ₹0, so the required rate is ${percent(source.answer)}.`,
      ]),
      finalAnswer: source.correctAnswer,
    });
  }

  return deepFreeze({
    ...source,
    examReadyVersion: INT_CP009_EXAM_READY_POLISH_VERSION,
    answerSemantic: answerSemanticForIntCp009Prototype(prototypeId),
    presentation,
    explanation,
  });
}
