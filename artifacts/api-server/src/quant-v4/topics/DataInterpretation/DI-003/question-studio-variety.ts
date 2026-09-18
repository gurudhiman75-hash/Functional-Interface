import { presentationVariantIndex } from "../DI-001/exact";
import { generateDi003GroupedBarSet as generateDi003GroupedBarSetBase } from "./grouped-bar-set";
import type {
  Di003ExamProfile,
  Di003Question,
  Di003QuestionSet,
  Di003Stimulus,
  Di003TaskKind,
} from "./types";

type StemBuilder = (stimulus: Di003Stimulus, question: Di003Question) => string;

function point(stimulus: Di003Stimulus, question: Di003Question, key: string) {
  const index = question.evidence[key];
  const resolved = index === undefined ? undefined : stimulus.points[index];
  if (!resolved) throw new Error(`DI-003 stem variety could not resolve evidence key '${key}'.`);
  return resolved;
}

const STEM_VARIANTS: Readonly<Record<Di003TaskKind, readonly StemBuilder[]>> = Object.freeze({
  CROSS_SERIES_DIFFERENCE: Object.freeze([
    (stimulus, question) => { const target = point(stimulus, question, "categoryIndex"); return `In ${target.category}, what was the difference between the sales of Product A and Product B?`; },
    (stimulus, question) => { const target = point(stimulus, question, "categoryIndex"); return `Find the absolute difference between Product A and Product B sales in ${target.category}.`; },
    (stimulus, question) => { const target = point(stimulus, question, "categoryIndex"); return `By how many units did the two products differ in ${target.category}?`; },
    (stimulus, question) => { const target = point(stimulus, question, "categoryIndex"); return `What is the gap between the Product A and Product B bars for ${target.category}?`; },
    (stimulus, question) => { const target = point(stimulus, question, "categoryIndex"); return `Compare the two sales values in ${target.category}. What is their difference?`; },
    (stimulus, question) => { const target = point(stimulus, question, "categoryIndex"); return `The Product A and Product B sales figures for ${target.category} differ by how many units?`; },
  ]),
  COMBINED_CATEGORY_RATIO: Object.freeze([
    (stimulus, question) => { const first = point(stimulus, question, "firstIndex"); const second = point(stimulus, question, "secondIndex"); return `What is the ratio of the combined sales of both products in ${first.category} to their combined sales in ${second.category}?`; },
    (stimulus, question) => { const first = point(stimulus, question, "firstIndex"); const second = point(stimulus, question, "secondIndex"); return `Add Product A and Product B for ${first.category} and for ${second.category}. Find the ratio of the two totals.`; },
    (stimulus, question) => { const first = point(stimulus, question, "firstIndex"); const second = point(stimulus, question, "secondIndex"); return `The combined sales in ${first.category} are in what ratio to the combined sales in ${second.category}?`; },
    (stimulus, question) => { const first = point(stimulus, question, "firstIndex"); const second = point(stimulus, question, "secondIndex"); return `Compare total sales of both products in ${first.category} with total sales of both products in ${second.category} as a ratio.`; },
    (stimulus, question) => { const first = point(stimulus, question, "firstIndex"); const second = point(stimulus, question, "secondIndex"); return `What ratio is obtained when the two product bars in ${first.category} are combined and compared with the two bars in ${second.category}?`; },
    (stimulus, question) => { const first = point(stimulus, question, "firstIndex"); const second = point(stimulus, question, "secondIndex"); return `Find (${first.category} total for Product A + Product B) : (${second.category} total for Product A + Product B).`; },
  ]),
  PERCENT_CHANGE_WITHIN_SERIES: Object.freeze([
    (stimulus, question) => { const from = point(stimulus, question, "fromIndex"); const to = point(stimulus, question, "toIndex"); return `Product A sales in ${to.category} were what percentage higher than in ${from.category}?`; },
    (stimulus, question) => { const from = point(stimulus, question, "fromIndex"); const to = point(stimulus, question, "toIndex"); return `By what percent did Product A sales increase from ${from.category} to ${to.category}?`; },
    (stimulus, question) => { const from = point(stimulus, question, "fromIndex"); const to = point(stimulus, question, "toIndex"); return `Taking Product A sales in ${from.category} as the base, find the percentage increase up to ${to.category}.`; },
    (stimulus, question) => { const from = point(stimulus, question, "fromIndex"); const to = point(stimulus, question, "toIndex"); return `Compared with ${from.category}, by what percentage are Product A sales higher in ${to.category}?`; },
    (stimulus, question) => { const from = point(stimulus, question, "fromIndex"); const to = point(stimulus, question, "toIndex"); return `Find the relative increase in Product A sales between ${from.category} and ${to.category}.`; },
    (stimulus, question) => { const from = point(stimulus, question, "fromIndex"); const to = point(stimulus, question, "toIndex"); return `What percentage rise is seen in the Product A bar from ${from.category} to ${to.category}?`; },
  ]),
  CATEGORY_SHARE_OF_SERIES_TOTAL: Object.freeze([
    (stimulus, question) => { const target = point(stimulus, question, "categoryIndex"); return `Product B sales in ${target.category} formed what percentage of Product B's total sales over all five years?`; },
    (stimulus, question) => { const target = point(stimulus, question, "categoryIndex"); return `What percent of Product B's five-category total came from ${target.category}?`; },
    (stimulus, question) => { const target = point(stimulus, question, "categoryIndex"); return `Find ${target.category}'s percentage contribution to the total sales of Product B.`; },
    (stimulus, question) => { const target = point(stimulus, question, "categoryIndex"); return `Product B's value in ${target.category} is what percentage of its overall total?`; },
    (stimulus, question) => { const target = point(stimulus, question, "categoryIndex"); return `Out of total Product B sales shown, what percentage belongs to ${target.category}?`; },
    (stimulus, question) => { const target = point(stimulus, question, "categoryIndex"); return `Calculate the share, in percent, of ${target.category} in the full Product B series total.`; },
  ]),
  TOTAL_SERIES_PERCENT_EXCESS: Object.freeze([
    () => "By what percentage did the total sales of Product A over the five years exceed the total sales of Product B?",
    () => "Product A's overall total was what percent higher than Product B's overall total?",
    () => "Find the percentage by which total Product A sales exceeded total Product B sales.",
    () => "Taking Product B's total as the base, by what percent was Product A's total greater?",
    () => "Across all five categories, what percentage excess did Product A have over Product B?",
    () => "After summing each product series, calculate how much higher Product A's total was than Product B's, in percentage terms.",
  ]),
});

function diversifyStem(seed: string, stimulus: Di003Stimulus, question: Di003Question): string {
  const variants = STEM_VARIANTS[question.kind];
  const variantIndex = presentationVariantIndex(`${seed}:stem-variety:${question.kind}`, variants.length);
  return variants[variantIndex]!(stimulus, question);
}

export function generateDi003GroupedBarSet(
  input: { seed?: string; examProfile?: Di003ExamProfile } = {},
): Di003QuestionSet {
  const generated = generateDi003GroupedBarSetBase(input);
  const questions = generated.questions.map((question) => Object.freeze({
    ...question,
    stem: diversifyStem(generated.seed, generated.stimulus, question),
  }));
  return Object.freeze({ ...generated, questions: Object.freeze(questions) });
}
