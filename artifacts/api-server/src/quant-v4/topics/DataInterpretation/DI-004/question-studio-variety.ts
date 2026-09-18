import { presentationVariantIndex } from "../DI-001/exact";
import { generateDi004LineSet as generateDi004LineSetBase } from "./line-set";
import type {
  Di004ExamProfile,
  Di004Question,
  Di004QuestionSet,
  Di004Stimulus,
  Di004TaskKind,
} from "./types";

type StemBuilder = (stimulus: Di004Stimulus, question: Di004Question) => string;

function point(stimulus: Di004Stimulus, question: Di004Question, key: string) {
  const index = question.evidence[key];
  const resolved = index === undefined ? undefined : stimulus.points[index];
  if (!resolved) throw new Error(`DI-004 stem variety could not resolve evidence key '${key}'.`);
  return resolved;
}

const STEM_VARIANTS: Readonly<Record<Di004TaskKind, readonly StemBuilder[]>> = Object.freeze({
  FIRST_OVERTAKE_PERIOD: Object.freeze([
    () => "Region B was ahead initially. In which quarter did Region A first move above Region B?",
    () => "In which period did Region A first overtake Region B?",
    () => "Identify the first quarter in which the Region A line is above the Region B line.",
    () => "When did Region A first become higher than Region B on the chart?",
    () => "The two line series change order at which quarter for the first time, with Region A moving ahead?",
    () => "From left to right, which is the first period where Region A exceeds Region B?",
  ]),
  CLOSEST_LINES_PERIOD: Object.freeze([
    () => "In which quarter were the numbers of online orders in Region A and Region B closest to each other?",
    () => "At which period is the gap between Region A and Region B the smallest?",
    () => "Find the quarter in which the two regional order figures are nearest to one another.",
    () => "Which plotted period has the minimum difference between Region A and Region B?",
    () => "The two lines are closest in which quarter?",
    () => "Where on the time axis is the absolute Region A–Region B gap least?",
  ]),
  CONSECUTIVE_PERCENT_INCREASE_A: Object.freeze([
    (stimulus, question) => { const from = point(stimulus, question, "fromIndex"); const to = point(stimulus, question, "toIndex"); return `By what percentage did Region A's online orders increase from ${from.period} to ${to.period}?`; },
    (stimulus, question) => { const from = point(stimulus, question, "fromIndex"); const to = point(stimulus, question, "toIndex"); return `Find the percentage rise in Region A orders between ${from.period} and ${to.period}.`; },
    (stimulus, question) => { const from = point(stimulus, question, "fromIndex"); const to = point(stimulus, question, "toIndex"); return `Region A's order count in ${to.period} is what percent higher than in ${from.period}?`; },
    (stimulus, question) => { const from = point(stimulus, question, "fromIndex"); const to = point(stimulus, question, "toIndex"); return `Taking ${from.period} as the base, calculate Region A's percentage increase up to ${to.period}.`; },
    (stimulus, question) => { const from = point(stimulus, question, "fromIndex"); const to = point(stimulus, question, "toIndex"); return `What relative increase is shown by Region A from ${from.period} to the next selected period, ${to.period}?`; },
    (stimulus, question) => { const from = point(stimulus, question, "fromIndex"); const to = point(stimulus, question, "toIndex"); return `Calculate the percent change upward in Region A orders from ${from.period} to ${to.period}.`; },
  ]),
  THREE_PERIOD_AVERAGE_B: Object.freeze([
    (stimulus, question) => { const start = point(stimulus, question, "startIndex"); const endIndex = question.evidence.startIndex! + 2; const end = stimulus.points[endIndex]!; return `What was the average number of online orders in Region B from ${start.period} through ${end.period}?`; },
    (stimulus, question) => { const start = point(stimulus, question, "startIndex"); const end = stimulus.points[question.evidence.startIndex! + 2]!; return `Find Region B's mean order count over the three periods from ${start.period} to ${end.period}.`; },
    (stimulus, question) => { const start = point(stimulus, question, "startIndex"); const end = stimulus.points[question.evidence.startIndex! + 2]!; return `What is the average of Region B's three consecutive values from ${start.period} through ${end.period}?`; },
    (stimulus, question) => { const start = point(stimulus, question, "startIndex"); const end = stimulus.points[question.evidence.startIndex! + 2]!; return `Calculate the three-quarter average for Region B covering ${start.period} to ${end.period}.`; },
    (stimulus, question) => { const start = point(stimulus, question, "startIndex"); const end = stimulus.points[question.evidence.startIndex! + 2]!; return `Across ${start.period}, the middle quarter and ${end.period}, what is Region B's average number of orders?`; },
    (stimulus, question) => { const start = point(stimulus, question, "startIndex"); const end = stimulus.points[question.evidence.startIndex! + 2]!; return `For Region B, determine the arithmetic mean of the values plotted from ${start.period} through ${end.period}.`; },
  ]),
  B_RANGE_PERCENT_INCREASE: Object.freeze([
    () => "Region B's highest quarterly orders were what percentage higher than its lowest quarterly orders?",
    () => "By what percent does Region B's maximum quarterly value exceed its minimum quarterly value?",
    () => "Find the percentage increase from Region B's lowest plotted order count to its highest.",
    () => "Taking Region B's minimum as the base, how much higher is its maximum value in percentage terms?",
    () => "What is the relative percentage gap from the lowest to the highest Region B order figure?",
    () => "Region B ranges from its minimum to its maximum by what percentage increase?",
  ]),
});

function diversifyStem(seed: string, stimulus: Di004Stimulus, question: Di004Question): string {
  const variants = STEM_VARIANTS[question.kind];
  const variantIndex = presentationVariantIndex(question.questionId, variants.length);
  return variants[variantIndex]!(stimulus, question);
}

export function generateDi004LineSet(
  input: { seed?: string; examProfile?: Di004ExamProfile } = {},
): Di004QuestionSet {
  const generated = generateDi004LineSetBase(input);
  const questions = generated.questions.map((question) => Object.freeze({
    ...question,
    stem: diversifyStem(generated.seed, generated.stimulus, question),
  }));
  return Object.freeze({ ...generated, questions: Object.freeze(questions) });
}
