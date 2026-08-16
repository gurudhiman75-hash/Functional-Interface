import { div, eq, hash, mul, rat, type Rational } from "./cp003-exam-model";
import {
  INT_CP006_DECISION,
  INT_CP006_LEGACY_RECOVERY,
  INT_CP006_QL_IDS,
  INT_CP006_RUNTIME_VERSION,
  constructIntCp006State,
  generateIntCp006Question as generateBase,
  solveIntCp006,
  verifyIntCp006Answer,
  type IntCp006AnswerSemantic,
  type IntCp006Option,
  type IntCp006QlId,
  type IntCp006Question,
  type IntCp006Representation,
  type IntCp006State,
} from "./cp006-si-ci-relations-runtime-v1";

export {
  INT_CP006_DECISION,
  INT_CP006_LEGACY_RECOVERY,
  INT_CP006_QL_IDS,
  INT_CP006_RUNTIME_VERSION,
  constructIntCp006State,
  solveIntCp006,
  verifyIntCp006Answer,
};
export type { IntCp006AnswerSemantic, IntCp006Option, IntCp006QlId, IntCp006Question, IntCp006Representation, IntCp006State };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}
function key(value: Rational): string { return `${value.numerator}/${value.denominator}`; }
function indianInteger(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const source = (value < 0n ? -value : value).toString();
  if (source.length <= 3) return `${sign}${source}`;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}
function decimal(value: Rational): string {
  const scaled = value.numerator * 100n;
  if (scaled % value.denominator !== 0n) throw new Error(`QL098 non-displayable value ${key(value)}`);
  const hundredths = scaled / value.denominator;
  const sign = hundredths < 0n ? "-" : "";
  const magnitude = hundredths < 0n ? -hundredths : hundredths;
  const whole = magnitude / 100n;
  const fraction = magnitude % 100n;
  const wholeText = indianInteger(whole);
  if (fraction === 0n) return `${sign}${wholeText}`;
  if (fraction % 10n === 0n) return `${sign}${wholeText}.${fraction / 10n}`;
  return `${sign}${wholeText}.${fraction.toString().padStart(2, "0")}`;
}
const money = (value: Rational): string => `₹${decimal(value)}`;
const percent = (value: Rational): string => `${decimal(value)}%`;

function ql098Question(seed: string): IntCp006Question {
  const state = constructIntCp006State("INT-QL-098", seed);
  if (state.qlId !== "INT-QL-098") throw new Error("QL098 state construction drift");
  const answer = solveIntCp006(state);
  if (!verifyIntCp006Answer(state, answer)) throw new Error(`INT-QL-098/${seed}: canonical answer rejected`);

  const wrongCandidates = Object.freeze([
    Object.freeze({
      value: div(mul(state.difference2, rat(100)), state.ratePercent),
      misconceptionId: "TREAT_DIFFERENCE_AS_FIRST_YEAR_SI",
    }),
    Object.freeze({
      value: div(answer, rat(2)),
      misconceptionId: "ASSUME_D2_EQUALS_TWO_RATE_SQUARE_LAYERS",
    }),
    Object.freeze({
      value: div(answer, rat(4)),
      misconceptionId: "SQUARE_TWO_YEAR_RATE_INSTEAD_OF_ANNUAL_RATE",
    }),
  ] as const);
  if (wrongCandidates.some((item) => eq(item.value, answer))) throw new Error(`INT-QL-098/${seed}: distractor collided with answer`);
  if (new Set(wrongCandidates.map((item) => key(item.value))).size !== 3) throw new Error(`INT-QL-098/${seed}: distractor collision`);
  for (const item of wrongCandidates) {
    decimal(item.value);
    if (verifyIntCp006Answer(state, item.value)) throw new Error(`INT-QL-098/${seed}: distractor independently verifies`);
  }

  const template = hash(`${seed}:cp006:template`) % 3;
  const frames = [
    `For 2 years at ${percent(state.ratePercent)} per annum, CI exceeds SI by ${money(state.difference2)}. Find the principal.`,
    `The difference between compound and simple interest for 2 years is ${money(state.difference2)} at ${percent(state.ratePercent)} per annum. What sum was invested?`,
    `A sum gives ${money(state.difference2)} more under annual compound interest than under simple interest in 2 years at ${percent(state.ratePercent)}. Find the sum.`,
  ] as const;
  const markdown = frames[template]!;
  const correctIndex = (hash(`${seed}:cp006:correct-index`) % 4) as 0 | 1 | 2 | 3;
  const options: IntCp006Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) options.push(deepFreeze({ text: money(answer), value: answer, misconceptionId: "CORRECT" }));
    else {
      const wrong = wrongCandidates[wrongIndex++]!;
      options.push(deepFreeze({ text: money(wrong.value), value: wrong.value, misconceptionId: wrong.misconceptionId }));
    }
  }

  return deepFreeze({
    id: `INT-QL-098:${seed}`,
    runtimeVersion: INT_CP006_RUNTIME_VERSION,
    checkpointId: "INT-CP-006",
    qlId: "INT-QL-098",
    locale: "en-IN",
    seed,
    mathematicalState: state,
    answerSemantic: "PRINCIPAL",
    presentation: deepFreeze({ markdown, prompt: markdown, representation: "STANDARD_PROSE", stemFamilyId: `INT-QL-098-T${template + 1}` }),
    options: Object.freeze(options),
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    explanation: deepFreeze({
      keyIdea: `Use \\(D_2=P(r/100)^2\\) and solve for P.`,
      steps: Object.freeze([`\\(P=${money(state.difference2)}\\div(${percent(state.ratePercent)}/100)^2=${money(answer)}\\).`]),
      finalAnswer: money(answer),
      commonMistake: "The two-year excess contains the square of the annual rate; do not treat it as one year of simple interest or square the two-year rate.",
    }),
    mathematicalFingerprint: `INT-QL-098|difference2=${key(state.difference2)}|ratePercent=${key(state.ratePercent)}|answer=${key(answer)}|DISTRACTOR_V2`,
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  });
}

export function generateIntCp006Question(qlId: IntCp006QlId, seed: string, locale: "en-IN" = "en-IN"): IntCp006Question {
  if (locale !== "en-IN") throw new Error("CP006 v1 review authority is English-only");
  return qlId === "INT-QL-098" ? ql098Question(seed) : generateBase(qlId, seed, locale);
}
