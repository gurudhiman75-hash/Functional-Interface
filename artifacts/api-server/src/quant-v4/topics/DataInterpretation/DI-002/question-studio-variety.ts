import { presentationVariantIndex, structuredPresentationVariantOffset } from "../DI-001/exact";
import { generateDi002AdvancedTableSet as generateDi002AdvancedTableSetBase } from "./advanced-table-set";
import type {
  Di002ExamProfile,
  Di002Question,
  Di002QuestionSet,
  Di002Row,
  Di002TaskKind,
} from "./types";

type StemContext = Readonly<{
  rows: readonly Di002Row[];
  question: Di002Question;
}>;

type StemBuilder = (context: StemContext) => string;

function row(context: StemContext, key: string): Di002Row {
  const index = context.question.evidence[key];
  const resolved = index === undefined ? undefined : context.rows[index];
  if (!resolved) throw new Error(`DI-002 stem variety could not resolve evidence key '${key}'.`);
  return resolved;
}

const STEM_VARIANTS: Readonly<Record<Di002TaskKind, readonly StemBuilder[]>> = Object.freeze({
  MISSING_REVERSE_PERCENTAGE: Object.freeze([
    ({ question, rows }) => {
      const target = rows[question.evidence.hiddenIndex!]!;
      return `The Applicants figure for ${target.branch} is missing. If ${target.selected} candidates were selected at a selection rate of ${target.selectionPercent}%, find the number of applicants.`;
    },
    (context) => {
      const target = row(context, "hiddenIndex");
      return `At ${target.branch}, ${target.selected} selected candidates represent ${target.selectionPercent}% of all applicants. How many candidates applied there?`;
    },
    (context) => {
      const target = row(context, "hiddenIndex");
      return `What number should replace the missing Applicants entry for ${target.branch}, where ${target.selected} candidates were selected and the selection rate was ${target.selectionPercent}%?`;
    },
    (context) => {
      const target = row(context, "hiddenIndex");
      return `If ${target.selected} candidates form ${target.selectionPercent}% of the applicants at ${target.branch}, determine the total number of applicants at that branch.`;
    },
    (context) => {
      const target = row(context, "hiddenIndex");
      return `${target.branch} selected ${target.selected} candidates, equal to ${target.selectionPercent}% of those who applied. Find the number who applied.`;
    },
    (context) => {
      const target = row(context, "hiddenIndex");
      return `Using the Selected and Selection % entries for ${target.branch}, calculate its missing Applicants value.`;
    },
  ]),
  PERCENT_CHANGE_SELECTED: Object.freeze([
    (context) => {
      const from = row(context, "fromIndex");
      const to = row(context, "toIndex");
      return `By what percentage did the number of selected candidates increase from ${from.branch} to ${to.branch}?`;
    },
    (context) => {
      const from = row(context, "fromIndex");
      const to = row(context, "toIndex");
      return `The selected count at ${to.branch} is what percent more than the selected count at ${from.branch}?`;
    },
    (context) => {
      const from = row(context, "fromIndex");
      const to = row(context, "toIndex");
      return `Compared with ${from.branch}, by what percent is the number selected at ${to.branch} higher?`;
    },
    (context) => {
      const from = row(context, "fromIndex");
      const to = row(context, "toIndex");
      return `Find the percentage increase in selected candidates when moving from ${from.branch} to ${to.branch}.`;
    },
    (context) => {
      const from = row(context, "fromIndex");
      const to = row(context, "toIndex");
      return `Selected candidates rise from ${from.selected} at ${from.branch} to ${to.selected} at ${to.branch}. What is the percentage increase?`;
    },
    (context) => {
      const from = row(context, "fromIndex");
      const to = row(context, "toIndex");
      return `Taking the selected count of ${from.branch} as the base, calculate the percentage increase up to ${to.branch}.`;
    },
  ]),
  SHARE_OF_TOTAL_SELECTED: Object.freeze([
    (context) => {
      const first = row(context, "firstIndex");
      const second = row(context, "secondIndex");
      return `Together, what percentage of all selected candidates came from ${first.branch} and ${second.branch}?`;
    },
    (context) => {
      const first = row(context, "firstIndex");
      const second = row(context, "secondIndex");
      return `${first.branch} and ${second.branch} together account for what percentage of the total selected candidates?`;
    },
    (context) => {
      const first = row(context, "firstIndex");
      const second = row(context, "secondIndex");
      return `Selected candidates from ${first.branch} and ${second.branch} form what percent of the selected total across all five branches?`;
    },
    (context) => {
      const first = row(context, "firstIndex");
      const second = row(context, "secondIndex");
      return `Find the combined percentage share of ${first.branch} and ${second.branch} in the total number selected.`;
    },
    (context) => {
      const first = row(context, "firstIndex");
      const second = row(context, "secondIndex");
      return `Out of all selected candidates, what percentage belonged to ${first.branch} and ${second.branch} combined?`;
    },
    (context) => {
      const first = row(context, "firstIndex");
      const second = row(context, "secondIndex");
      return `What is the percentage contribution of ${first.branch} plus ${second.branch} to the overall Selected total?`;
    },
  ]),
  COMBINED_SELECTED_RATIO: Object.freeze([
    (context) => {
      const leftA = row(context, "leftA");
      const leftB = row(context, "leftB");
      const rightA = row(context, "rightA");
      const rightB = row(context, "rightB");
      return `What is the ratio of the combined number selected at ${leftA.branch} and ${leftB.branch} to the combined number selected at ${rightA.branch} and ${rightB.branch}?`;
    },
    (context) => {
      const leftA = row(context, "leftA");
      const leftB = row(context, "leftB");
      const rightA = row(context, "rightA");
      const rightB = row(context, "rightB");
      return `Find the ratio between the total selected at ${leftA.branch} and ${leftB.branch} together and the total selected at ${rightA.branch} and ${rightB.branch} together.`;
    },
    (context) => {
      const leftA = row(context, "leftA");
      const leftB = row(context, "leftB");
      const rightA = row(context, "rightA");
      const rightB = row(context, "rightB");
      return `Combine the selected counts of ${leftA.branch} with ${leftB.branch}, and ${rightA.branch} with ${rightB.branch}. What is the ratio of the two totals?`;
    },
    (context) => {
      const leftA = row(context, "leftA");
      const leftB = row(context, "leftB");
      const rightA = row(context, "rightA");
      const rightB = row(context, "rightB");
      return `The combined Selected count for ${leftA.branch} and ${leftB.branch} is in what ratio to that for ${rightA.branch} and ${rightB.branch}?`;
    },
    (context) => {
      const leftA = row(context, "leftA");
      const leftB = row(context, "leftB");
      const rightA = row(context, "rightA");
      const rightB = row(context, "rightB");
      return `Compare the selected candidates of the pair ${leftA.branch}-${leftB.branch} with the pair ${rightA.branch}-${rightB.branch}. Express the comparison as a ratio.`;
    },
    (context) => {
      const leftA = row(context, "leftA");
      const leftB = row(context, "leftB");
      const rightA = row(context, "rightA");
      const rightB = row(context, "rightB");
      return `What ratio is obtained when Selected candidates at ${leftA.branch} and ${leftB.branch} are added and compared with the sum for ${rightA.branch} and ${rightB.branch}?`;
    },
  ]),
  RELATIVE_SELECTION_RATE_CHANGE: Object.freeze([
    (context) => {
      const from = row(context, "fromIndex");
      const to = row(context, "toIndex");
      return `The selection rate at ${to.branch} is what percent higher than the selection rate at ${from.branch}?`;
    },
    (context) => {
      const from = row(context, "fromIndex");
      const to = row(context, "toIndex");
      return `By what percentage is the selection rate at ${to.branch} greater than that at ${from.branch}?`;
    },
    (context) => {
      const from = row(context, "fromIndex");
      const to = row(context, "toIndex");
      return `Taking the selection rate of ${from.branch} as the base, find the percentage increase in the rate at ${to.branch}.`;
    },
    (context) => {
      const from = row(context, "fromIndex");
      const to = row(context, "toIndex");
      return `The selection rate rises from ${from.selectionPercent}% at ${from.branch} to ${to.selectionPercent}% at ${to.branch}. What is the relative percentage increase?`;
    },
    (context) => {
      const from = row(context, "fromIndex");
      const to = row(context, "toIndex");
      return `Relative to ${from.branch}, by what percent is ${to.branch}'s selection rate higher?`;
    },
    (context) => {
      const from = row(context, "fromIndex");
      const to = row(context, "toIndex");
      return `What percentage increase does the Selection % show from ${from.branch} to ${to.branch}?`;
    },
  ]),
});

const STRUCTURED_OFFSET_KINDS = new Set<Di002TaskKind>([
  "MISSING_REVERSE_PERCENTAGE",
  "PERCENT_CHANGE_SELECTED",
  "RELATIVE_SELECTION_RATE_CHANGE",
]);

function diversifyStem(seed: string, rows: readonly Di002Row[], question: Di002Question): string {
  const variants = STEM_VARIANTS[question.kind];
  const baseVariantIndex = presentationVariantIndex(`${seed}:stem-variety:${question.kind}`, variants.length);
  const structuredOffset = STRUCTURED_OFFSET_KINDS.has(question.kind)
    ? structuredPresentationVariantOffset(seed, variants.length)
    : 0;
  const variantIndex = (baseVariantIndex + structuredOffset) % variants.length;
  return variants[variantIndex]!({ rows, question });
}

export function generateDi002AdvancedTableSet(
  input: { seed?: string; examProfile?: Di002ExamProfile } = {},
): Di002QuestionSet {
  const generated = generateDi002AdvancedTableSetBase(input);
  const questions = generated.questions.map((question) => Object.freeze({
    ...question,
    stem: diversifyStem(generated.seed, generated.stimulus.rows, question),
  }));

  return Object.freeze({
    ...generated,
    questions: Object.freeze(questions),
  });
}
