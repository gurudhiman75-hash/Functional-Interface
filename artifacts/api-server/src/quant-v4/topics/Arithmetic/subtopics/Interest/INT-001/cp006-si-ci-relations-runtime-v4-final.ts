import { add, div, hash, rat, type Rational } from "./cp003-exam-model";
import { siCiDifference } from "./cp006-si-ci-relations-runtime-v2";
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
} from "./cp006-si-ci-relations-runtime-v3-final";

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
function compare(left: Rational, right: Rational): number {
  const delta = left.numerator * right.denominator - right.numerator * left.denominator;
  return delta < 0n ? -1 : delta > 0n ? 1 : 0;
}
function displayable(value: Rational): boolean { return value.numerator >= 0n && (value.numerator * 100n) % value.denominator === 0n; }
function indianInteger(value: bigint): string {
  const source = value.toString();
  if (source.length <= 3) return source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${groups.join(",")},${tail}`;
}
function decimal(value: Rational): string {
  if (!displayable(value)) throw new Error(`QL107 non-displayable value ${value.numerator}/${value.denominator}`);
  const hundredths = value.numerator * 100n / value.denominator;
  const whole = hundredths / 100n;
  const fraction = hundredths % 100n;
  const wholeText = indianInteger(whole);
  if (fraction === 0n) return wholeText;
  if (fraction % 10n === 0n) return `${wholeText}.${fraction / 10n}`;
  return `${wholeText}.${fraction.toString().padStart(2, "0")}`;
}
const money = (value: Rational): string => `₹${decimal(value)}`;
const percent = (value: Rational): string => `${decimal(value)}%`;
const yearText = (year: number): string => year === 1 ? "1 year" : `${year} years`;

const PRINCIPALS = Object.freeze([100000n, 125000n, 160000n, 200000n] as const);
const RATES = Object.freeze([10, 20, 25] as const);
const YEARS = Object.freeze([2, 3, 4, 5] as const);
type Boundary = "EXACT" | "BETWEEN";
type ThresholdState = Extract<IntCp006State, { qlId: "INT-QL-107" }>;

const THRESHOLD_CANDIDATES: readonly ThresholdState[] = (() => {
  const values: ThresholdState[] = [];
  for (const principalValue of PRINCIPALS) {
    for (const rateValue of RATES) {
      const principal = rat(principalValue);
      const ratePercent = rat(rateValue);
      for (const targetYear of YEARS) {
        const previous = siCiDifference(principal, ratePercent, targetYear - 1);
        const current = siCiDifference(principal, ratePercent, targetYear);
        if (!displayable(previous) || !displayable(current)) continue;
        values.push(deepFreeze({ qlId: "INT-QL-107", principal, ratePercent, targetDifference: current, boundary: "EXACT" }));
        const midpoint = div(add(previous, current), rat(2));
        if (displayable(midpoint) && compare(previous, midpoint) < 0 && compare(midpoint, current) < 0) {
          values.push(deepFreeze({ qlId: "INT-QL-107", principal, ratePercent, targetDifference: midpoint, boundary: "BETWEEN" }));
        }
      }
    }
  }
  for (const year of YEARS) for (const boundary of ["EXACT", "BETWEEN"] as const) {
    const count = values.filter((state) => Number(solveIntCp006(state).numerator) === year && state.boundary === boundary).length;
    if (count === 0) throw new Error(`QL107 curated pool missing ${year}/${boundary}`);
  }
  return Object.freeze(values);
})();

function curatedState(seed: string): ThresholdState {
  const targetYear = YEARS[hash(`${seed}:cp006:107-curated-year`) % YEARS.length]!;
  const boundary: Boundary = (hash(`${seed}:cp006:107-curated-boundary`) & 1) === 0 ? "EXACT" : "BETWEEN";
  const pool = THRESHOLD_CANDIDATES.filter((state) => Number(solveIntCp006(state).numerator) === targetYear && state.boundary === boundary);
  if (!pool.length) throw new Error(`QL107 curated selection empty for ${targetYear}/${boundary}`);
  return pool[hash(`${seed}:cp006:107-curated-state`) % pool.length]!;
}

function ql107Question(seed: string): IntCp006Question {
  const state = curatedState(seed);
  const answer = solveIntCp006(state);
  if (!verifyIntCp006Answer(state, answer)) throw new Error(`INT-QL-107/${seed}: curated answer rejected`);
  const correctYear = Number(answer.numerator);
  const wrongYears: number[] = [];
  for (const year of [correctYear - 1, correctYear + 1, correctYear - 2, correctYear + 2, 1, 6]) {
    if (year < 1 || year > 6 || year === correctYear || wrongYears.includes(year)) continue;
    const candidate = rat(year);
    if (verifyIntCp006Answer(state, candidate)) continue;
    wrongYears.push(year);
    if (wrongYears.length === 3) break;
  }
  if (wrongYears.length !== 3) throw new Error(`INT-QL-107/${seed}: insufficient threshold-year distractors`);

  const template = hash(`${seed}:cp006:template`) % 3;
  const frames = [
    `On ${money(state.principal)} at ${percent(state.ratePercent)} per annum, after how many complete years will the difference between CI and SI first reach at least ${money(state.targetDifference)}?`,
    `${money(state.principal)} is considered under simple and annual compound interest at ${percent(state.ratePercent)}. Find the first complete year when CI exceeds SI by ${money(state.targetDifference)} or more.`,
    `At ${percent(state.ratePercent)} per annum on ${money(state.principal)}, determine the earliest whole year for which CI−SI is at least ${money(state.targetDifference)}.`,
  ] as const;
  const markdown = frames[template]!;
  const correctIndex = (hash(`${seed}:cp006:correct-index`) % 4) as 0 | 1 | 2 | 3;
  const options: IntCp006Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) options.push(deepFreeze({ text: yearText(correctYear), value: answer, misconceptionId: "CORRECT" }));
    else {
      const year = wrongYears[wrongIndex++]!;
      options.push(deepFreeze({ text: yearText(year), value: rat(year), misconceptionId: "OFF_BY_THRESHOLD_YEAR" }));
    }
  }

  const previous = siCiDifference(state.principal, state.ratePercent, correctYear - 1);
  const current = siCiDifference(state.principal, state.ratePercent, correctYear);
  return deepFreeze({
    id: `INT-QL-107:${seed}`,
    runtimeVersion: INT_CP006_RUNTIME_VERSION,
    checkpointId: "INT-CP-006",
    qlId: "INT-QL-107",
    locale: "en-IN",
    seed,
    mathematicalState: state,
    answerSemantic: "TIME_YEARS",
    presentation: deepFreeze({ markdown, prompt: markdown, representation: "STANDARD_PROSE", stemFamilyId: `INT-QL-107-T${template + 1}` }),
    options: Object.freeze(options),
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    explanation: deepFreeze({
      keyIdea: "Check the SI–CI difference year by year and stop at the first complete year that reaches the target.",
      steps: Object.freeze([
        `After ${yearText(correctYear - 1)}, CI−SI = ${money(previous)}, which is below ${money(state.targetDifference)}.`,
        `After ${yearText(correctYear)}, CI−SI = ${money(current)}, so this is the first crossing year.`,
      ]),
      finalAnswer: yearText(correctYear),
      commonMistake: "Do not choose a later year merely because it also exceeds the target; the question asks for the first crossing.",
    }),
    mathematicalFingerprint: `INT-QL-107|principal=${state.principal.numerator}/${state.principal.denominator}|rate=${state.ratePercent.numerator}/${state.ratePercent.denominator}|target=${state.targetDifference.numerator}/${state.targetDifference.denominator}|boundary=${state.boundary}|answer=${correctYear}|CURATED_V4`,
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
  return qlId === "INT-QL-107" ? ql107Question(seed) : generateBase(qlId, seed, locale);
}
