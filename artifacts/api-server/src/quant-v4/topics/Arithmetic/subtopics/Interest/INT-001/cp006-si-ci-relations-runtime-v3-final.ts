import { add, div, eq, hash, mul, rat, sub, type Rational } from "./cp003-exam-model";
import {
  INT_CP006_DECISION,
  INT_CP006_LEGACY_RECOVERY,
  INT_CP006_QL_IDS,
  INT_CP006_RUNTIME_VERSION,
  constructIntCp006State,
  generateIntCp006Question as generateBase,
  siCiDifference,
  solveIntCp006,
  verifyIntCp006Answer,
  type IntCp006AnswerSemantic,
  type IntCp006Option,
  type IntCp006QlId,
  type IntCp006Question,
  type IntCp006Representation,
  type IntCp006State,
} from "./cp006-si-ci-relations-runtime-v2";

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

const HARDENED_QLS = new Set<IntCp006QlId>([
  "INT-QL-096", "INT-QL-097", "INT-QL-100", "INT-QL-102", "INT-QL-105", "INT-QL-106", "INT-QL-108",
]);

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}
function key(value: Rational): string { return `${value.numerator}/${value.denominator}`; }
function visible(value: Rational): boolean { return value.numerator > 0n && (value.numerator * 100n) % value.denominator === 0n; }
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
  if (!visible(value)) throw new Error(`CP006 hardened non-displayable value ${key(value)}`);
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
const yearText = (value: number): string => value === 1 ? "1 year" : `${value} years`;
function table(rows: readonly (readonly [string, string])[]): string {
  return `| Item | Value |\n|---|---:|\n${rows.map(([name, value]) => `| ${name} | ${value} |`).join("\n")}`;
}
function rateFromConsecutive(earlier: Rational, later: Rational): Rational {
  return mul(sub(div(later, earlier), rat(1)), rat(100));
}

interface WrongCandidate { readonly value: Rational; readonly misconceptionId: string; }
function selectWrong(state: IntCp006State, answer: Rational, pool: readonly WrongCandidate[]): readonly WrongCandidate[] {
  const selected: WrongCandidate[] = [];
  const seen = new Set<string>();
  for (const candidate of pool) {
    if (!visible(candidate.value) || eq(candidate.value, answer)) continue;
    const valueKey = key(candidate.value);
    if (seen.has(valueKey)) continue;
    if (verifyIntCp006Answer(state, candidate.value)) continue;
    seen.add(valueKey);
    selected.push(deepFreeze(candidate));
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) throw new Error(`${state.qlId}: only ${selected.length} robust exact misconception distractors`);
  return Object.freeze(selected);
}

function presentation(state: IntCp006State, seed: string): Readonly<{ markdown: string; prompt: string; representation: IntCp006Representation; stemFamilyId: string }> {
  const template = hash(`${seed}:cp006:template`) % 3;
  let markdown = "";
  let representation: IntCp006Representation = "STANDARD_PROSE";
  switch (state.qlId) {
    case "INT-QL-096": {
      const frames = [
        `Find the difference between compound interest and simple interest on ${money(state.principal)} for 2 years at ${percent(state.ratePercent)} per annum.`,
        `${money(state.principal)} is invested for 2 years at ${percent(state.ratePercent)} per annum. How much more interest is earned under annual compounding than under simple interest?`,
        `At ${percent(state.ratePercent)} per annum for 2 years, by how much does CI exceed SI on a principal of ${money(state.principal)}?`,
      ]; markdown = frames[template]!; break;
    }
    case "INT-QL-097": {
      const frames = [
        `Find the difference between compound interest and simple interest on ${money(state.principal)} for 3 years at ${percent(state.ratePercent)} per annum.`,
        `${money(state.principal)} is kept for 3 years at ${percent(state.ratePercent)} per annum. Find the excess of annual compound interest over simple interest.`,
        `For a principal of ${money(state.principal)} at ${percent(state.ratePercent)} per annum, how much greater is CI than SI after 3 years?`,
      ]; markdown = frames[template]!; break;
    }
    case "INT-QL-100": {
      const frames = [
        `For the same sum and the same rate over 2 years, the simple interest is ${money(state.simpleInterest2)} and the compound interest is ${money(state.compoundInterest2)}. Find the annual rate.`,
        `A 2-year investment gives SI = ${money(state.simpleInterest2)} and CI = ${money(state.compoundInterest2)} at one annual rate. Find the annual rate.`,
        `${table([["Simple interest for 2 years", money(state.simpleInterest2)], ["Compound interest for 2 years", money(state.compoundInterest2)]])}\n\nBoth refer to the same principal and annual rate. Find the annual rate.`,
      ]; markdown = frames[template]!; representation = template === 2 ? "COMPARISON_TABLE" : "STANDARD_PROSE"; break;
    }
    case "INT-QL-102": {
      const other = state.knownYears === 2 ? 3 : 2;
      const frames = [
        `At ${percent(state.ratePercent)} per annum, the CI−SI difference for ${state.knownYears} years is ${money(state.knownDifference)}. Find the CI−SI difference for ${other} years.`,
        `For the same principal at ${percent(state.ratePercent)} annually, CI exceeds SI by ${money(state.knownDifference)} after ${state.knownYears} years. By how much will CI exceed SI after ${other} years?`,
        `The ${state.knownYears}-year SI–CI difference is ${money(state.knownDifference)} at ${percent(state.ratePercent)} per annum. Determine the corresponding ${other}-year difference.`,
      ]; markdown = frames[template]!; break;
    }
    case "INT-QL-105":
    case "INT-QL-106": {
      const next = state.yearNumber + 1;
      const ask = state.qlId === "INT-QL-105" ? "Find the annual compound-interest rate." : "Find the original principal.";
      const suffix = state.yearNumber === 1 ? "st" : state.yearNumber === 2 ? "nd" : "rd";
      const frames = [
        `The interest earned in year ${state.yearNumber} is ${money(state.earlierInterest)}, and in year ${next} it is ${money(state.laterInterest)} under annual compounding. ${ask}`,
        `Under one fixed annual compound rate, the ${state.yearNumber}${suffix}-year interest is ${money(state.earlierInterest)} and the next year's interest is ${money(state.laterInterest)}. ${ask}`,
        `${table([[`Interest in year ${state.yearNumber}`, money(state.earlierInterest)], [`Interest in year ${next}`, money(state.laterInterest)]])}\n\nThe annual compound rate is constant. ${ask}`,
      ]; markdown = frames[template]!; representation = template === 2 ? "INTEREST_LEDGER" : "STANDARD_PROSE"; break;
    }
    case "INT-QL-108": {
      const frames = [
        `At ${percent(state.ratePercent)} compound interest, the interest earned in the second year exceeds that of the first year by ${money(state.secondYearExcess)}. Find the first-year interest.`,
        `The second-year compound interest is ${money(state.secondYearExcess)} more than the first-year interest at ${percent(state.ratePercent)} per annum. What was the interest in year 1?`,
        `Under annual compounding at ${percent(state.ratePercent)}, \\(J_2-J_1=${money(state.secondYearExcess)}\\). Find \\(J_1\\).`,
      ]; markdown = frames[template]!; break;
    }
    default: throw new Error(`${state.qlId}: no hardened presentation`);
  }
  return deepFreeze({ markdown, prompt: markdown, representation, stemFamilyId: `${state.qlId}-T${template + 1}` });
}

function explanation(state: IntCp006State, answer: Rational): Readonly<{ keyIdea: string; steps: readonly string[]; finalAnswer: string; commonMistake: string }> {
  switch (state.qlId) {
    case "INT-QL-096": return deepFreeze({
      keyIdea: `For 2 years, \\(CI-SI=P(r/100)^2\\).`,
      steps: Object.freeze([`\\(D_2=${money(state.principal)}\\times(${percent(state.ratePercent)}/100)^2=${money(answer)}\\).`]),
      finalAnswer: money(answer),
      commonMistake: "Do not use a two-year total rate inside the square; the excess comes from one extra annual compounding layer.",
    });
    case "INT-QL-097": {
      const d2 = siCiDifference(state.principal, state.ratePercent, 2);
      return deepFreeze({
        keyIdea: `For 3 years, \\(D_3=D_2(3+r/100)\\).`,
        steps: Object.freeze([`First, \\(D_2=${money(d2)}\\).`, `Then \\(D_3=${money(d2)}\\times(3+${percent(state.ratePercent)}/100)=${money(answer)}\\).`]),
        finalAnswer: money(answer),
        commonMistake: "Using exactly 3D₂ drops the cubic compounding term.",
      });
    }
    case "INT-QL-100": {
      const difference = sub(state.compoundInterest2, state.simpleInterest2);
      return deepFreeze({
        keyIdea: `For 2 years, \\(D_2/SI_2=r/2\\).`,
        steps: Object.freeze([`\\(D_2=${money(state.compoundInterest2)}-${money(state.simpleInterest2)}=${money(difference)}\\).`, `\\(r=2D_2/SI_2=2\\times${money(difference)}\\div${money(state.simpleInterest2)}=${percent(answer)}\\).`]),
        finalAnswer: percent(answer),
        commonMistake: "Dividing D₂ by SI₂ without the factor 2 gives half the annual rate.",
      });
    }
    case "INT-QL-102": {
      const other = state.knownYears === 2 ? 3 : 2;
      const step = state.knownYears === 2
        ? `\\(D_3=${money(state.knownDifference)}\\times(3+${percent(state.ratePercent)}/100)=${money(answer)}\\).`
        : `\\(D_2=${money(state.knownDifference)}\\div(3+${percent(state.ratePercent)}/100)=${money(answer)}\\).`;
      return deepFreeze({
        keyIdea: `For the same principal and rate, \\(D_3=D_2(3+r/100)\\).`,
        steps: Object.freeze([step, `Therefore the ${other}-year difference is ${money(answer)}.`]),
        finalAnswer: money(answer),
        commonMistake: "Do not treat D₂ and D₃ as simple integer multiples; the cubic term changes the factor from exactly 3.",
      });
    }
    case "INT-QL-105": return deepFreeze({
      keyIdea: `Consecutive yearly compound interests satisfy \\(J_{k+1}=J_k(1+r/100)\\).`,
      steps: Object.freeze([`\\(r=100(J_{k+1}/J_k-1)=100(${money(state.laterInterest)}\\div${money(state.earlierInterest)}-1)=${percent(answer)}\\).`]),
      finalAnswer: percent(answer),
      commonMistake: "Use the earlier year's interest as the base; the increase is not a percentage of their sum.",
    });
    case "INT-QL-106": {
      const ratePercent = rateFromConsecutive(state.earlierInterest, state.laterInterest);
      return deepFreeze({
        keyIdea: "First obtain the rate from the ratio of consecutive yearly interests, then reverse the earlier yearly-interest factor.",
        steps: Object.freeze([`The annual rate is ${percent(ratePercent)}.`, `Using \\(J_k=P(r/100)(1+r/100)^{k-1}\\), the original principal is ${money(answer)}.`]),
        finalAnswer: money(answer),
        commonMistake: "When k is greater than 1, the earlier observed interest already includes previous compounding; it is not automatically the first-year interest.",
      });
    }
    case "INT-QL-108": return deepFreeze({
      keyIdea: `Because \\(J_2-J_1=J_1(r/100)\\), the excess is r% of the first-year interest.`,
      steps: Object.freeze([`\\(J_1=${money(state.secondYearExcess)}\\div(${percent(state.ratePercent)}/100)=${money(answer)}\\).`]),
      finalAnswer: money(answer),
      commonMistake: "Do not split the excess between the two years; it is the interest earned on the first year's interest.",
    });
    default: throw new Error(`${state.qlId}: no hardened explanation`);
  }
}

function wrongPool(state: IntCp006State, answer: Rational): readonly WrongCandidate[] {
  switch (state.qlId) {
    case "INT-QL-096": return Object.freeze([
      { value: div(answer, rat(2)), misconceptionId: "HALVE_COMPOUND_EXCESS" },
      { value: mul(answer, rat(2)), misconceptionId: "APPLY_RATE_TO_TWO_YEAR_SI" },
      { value: mul(answer, rat(3)), misconceptionId: "USE_THREE_EXCESS_LAYERS" },
      { value: mul(answer, rat(4)), misconceptionId: "SQUARE_TWO_YEAR_TOTAL_RATE" },
    ]);
    case "INT-QL-097": {
      const d2 = siCiDifference(state.principal, state.ratePercent, 2);
      return Object.freeze([
        { value: mul(d2, rat(3)), misconceptionId: "OMIT_CUBIC_TERM" },
        { value: mul(d2, rat(2)), misconceptionId: "COUNT_ONLY_TWO_EXTRA_LAYERS" },
        { value: mul(d2, rat(4)), misconceptionId: "COUNT_FOUR_EQUAL_EXCESS_LAYERS" },
        { value: d2, misconceptionId: "USE_TWO_YEAR_DIFFERENCE_UNCHANGED" },
      ]);
    }
    case "INT-QL-100": return Object.freeze([
      { value: div(answer, rat(2)), misconceptionId: "MISS_TWO_YEAR_FACTOR" },
      { value: mul(answer, rat(2)), misconceptionId: "DOUBLE_TWO_YEAR_FACTOR" },
      { value: div(mul(answer, rat(3)), rat(2)), misconceptionId: "USE_THREE_YEAR_SCALE" },
      { value: mul(answer, rat(3)), misconceptionId: "TRIPLE_TWO_YEAR_FACTOR" },
    ]);
    case "INT-QL-102": return state.knownYears === 2 ? Object.freeze([
      { value: state.knownDifference, misconceptionId: "NO_DURATION_CHANGE" },
      { value: mul(state.knownDifference, rat(2)), misconceptionId: "COUNT_TWO_EXCESS_LAYERS" },
      { value: mul(state.knownDifference, rat(3)), misconceptionId: "OMIT_CUBIC_TERM" },
      { value: mul(state.knownDifference, rat(4)), misconceptionId: "COUNT_FOUR_EQUAL_EXCESS_LAYERS" },
    ]) : Object.freeze([
      { value: state.knownDifference, misconceptionId: "NO_DURATION_CHANGE" },
      { value: mul(answer, rat(2)), misconceptionId: "HALVE_REQUIRED_DIVISOR" },
      { value: mul(answer, rat(3)), misconceptionId: "USE_UNIT_DIVISOR_AFTER_REMOVING_THREE" },
      { value: mul(answer, rat(4)), misconceptionId: "USE_QUARTER_RELATION_SCALE" },
    ]);
    case "INT-QL-105": return Object.freeze([
      { value: div(answer, rat(2)), misconceptionId: "TREAT_INTERESTS_AS_TWO_YEAR_SPAN" },
      { value: mul(answer, rat(2)), misconceptionId: "DOUBLE_PERCENT_INCREASE" },
      { value: div(mul(answer, rat(3)), rat(2)), misconceptionId: "USE_THREE_HALVES_OF_PERCENT_INCREASE" },
      { value: mul(answer, rat(3)), misconceptionId: "TRIPLE_PERCENT_INCREASE" },
    ]);
    case "INT-QL-106": {
      const ratePercent = rateFromConsecutive(state.earlierInterest, state.laterInterest);
      return Object.freeze([
        { value: div(mul(state.earlierInterest, rat(100)), ratePercent), misconceptionId: "TREAT_EARLIER_INTEREST_AS_FIRST_YEAR_INTEREST" },
        { value: div(mul(state.laterInterest, rat(100)), ratePercent), misconceptionId: "TREAT_LATER_INTEREST_AS_FIRST_YEAR_INTEREST" },
        { value: div(answer, rat(2)), misconceptionId: "HALVE_RECONSTRUCTED_PRINCIPAL" },
        { value: mul(answer, rat(2)), misconceptionId: "DOUBLE_RECONSTRUCTED_PRINCIPAL" },
        { value: div(mul(answer, rat(3)), rat(2)), misconceptionId: "USE_ONE_AND_HALF_PRINCIPAL_SCALE" },
      ]);
    }
    case "INT-QL-108": return Object.freeze([
      { value: div(answer, rat(2)), misconceptionId: "DIVIDE_EXCESS_ACROSS_TWO_YEARS" },
      { value: add(answer, state.secondYearExcess), misconceptionId: "USE_SECOND_YEAR_INTEREST" },
      { value: mul(answer, rat(2)), misconceptionId: "TREAT_RATE_AS_HALF_ACTUAL" },
      { value: div(mul(answer, rat(3)), rat(2)), misconceptionId: "ADD_HALF_OF_FIRST_YEAR_INTEREST" },
    ]);
    default: throw new Error(`${state.qlId}: no hardened distractor pool`);
  }
}

function semanticFor(qlId: IntCp006QlId): IntCp006AnswerSemantic {
  if (qlId === "INT-QL-100" || qlId === "INT-QL-105") return "RATE_PERCENT";
  if (qlId === "INT-QL-106") return "PRINCIPAL";
  return "MONEY";
}
function answerText(value: Rational, semantic: IntCp006AnswerSemantic): string { return semantic === "RATE_PERCENT" ? percent(value) : money(value); }

function hardenedQuestion(qlId: IntCp006QlId, seed: string): IntCp006Question {
  const state = constructIntCp006State(qlId, seed);
  if (state.qlId !== qlId) throw new Error(`${qlId}/${seed}: state QL drift`);
  const answer = solveIntCp006(state);
  if (!verifyIntCp006Answer(state, answer)) throw new Error(`${qlId}/${seed}: canonical answer rejected`);
  const semantic = semanticFor(qlId);
  const wrong = selectWrong(state, answer, wrongPool(state, answer));
  const correctIndex = (hash(`${seed}:cp006:correct-index`) % 4) as 0 | 1 | 2 | 3;
  const options: IntCp006Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) options.push(deepFreeze({ text: answerText(answer, semantic), value: answer, misconceptionId: "CORRECT" }));
    else {
      const candidate = wrong[wrongIndex++]!;
      options.push(deepFreeze({ text: answerText(candidate.value, semantic), value: candidate.value, misconceptionId: candidate.misconceptionId }));
    }
  }
  const renderedPresentation = presentation(state, seed);
  return deepFreeze({
    id: `${qlId}:${seed}`,
    runtimeVersion: INT_CP006_RUNTIME_VERSION,
    checkpointId: "INT-CP-006",
    qlId,
    locale: "en-IN",
    seed,
    mathematicalState: state,
    answerSemantic: semantic,
    presentation: renderedPresentation,
    options: Object.freeze(options),
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    explanation: explanation(state, answer),
    mathematicalFingerprint: `${qlId}|${Object.entries(state).filter(([name]) => name !== "qlId").map(([name, value]) => typeof value === "object" && value && "numerator" in value ? `${name}=${key(value as Rational)}` : `${name}=${String(value)}`).join("|")}|answer=${key(answer)}|DISTRACTOR_FINAL_V3`,
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
  return HARDENED_QLS.has(qlId) ? hardenedQuestion(qlId, seed) : generateBase(qlId, seed, locale);
}
