import { presentationVariantIndex } from "./exact";
import { generateDi001TableSet as generateDi001TableSetBase } from "./table-set";
import type {
  Di001ExamProfile,
  Di001Question,
  Di001QuestionKind,
  Di001QuestionSet,
  Di001Stimulus,
} from "./types";

type StemBuilder = (stimulus: Di001Stimulus, question: Di001Question) => string;

const STEM_VARIANTS: Readonly<Record<Di001QuestionKind, readonly StemBuilder[]>> = Object.freeze({
  TOTAL: Object.freeze([
    () => "What is the total number of applicants across all five branches?",
    () => "Find the combined number of applicants at the five branches.",
    () => "How many applicants are there in all when the five branch figures are added?",
    () => "What is the sum of the Applicants column for all five branches?",
    () => "Calculate the overall number of applicants shown in the table.",
    () => "The applicant counts of all five branches together equal how many?",
  ]),
  DIFFERENCE: Object.freeze([
    (stimulus) => `How many more or fewer candidates were selected at ${stimulus.rows[1]!.branch} than at ${stimulus.rows[4]!.branch}?`,
    (stimulus) => `Find the difference between the Selected counts of ${stimulus.rows[1]!.branch} and ${stimulus.rows[4]!.branch}.`,
    (stimulus) => `By how many candidates do the selections at ${stimulus.rows[1]!.branch} and ${stimulus.rows[4]!.branch} differ?`,
    (stimulus) => `What is the absolute difference in selected candidates between ${stimulus.rows[1]!.branch} and ${stimulus.rows[4]!.branch}?`,
    (stimulus) => `Compare ${stimulus.rows[1]!.branch} with ${stimulus.rows[4]!.branch}. What is the difference in their Selected figures?`,
    (stimulus) => `The Selected values for ${stimulus.rows[1]!.branch} and ${stimulus.rows[4]!.branch} differ by how many candidates?`,
  ]),
  PERCENTAGE: Object.freeze([
    (stimulus) => `What percentage of the applicants at ${stimulus.rows[2]!.branch} were selected?`,
    (stimulus) => `At ${stimulus.rows[2]!.branch}, selected candidates form what percent of the applicants?`,
    (stimulus) => `Find the selection percentage for ${stimulus.rows[2]!.branch} from its Applicants and Selected figures.`,
    (stimulus) => `The number selected at ${stimulus.rows[2]!.branch} is what percentage of the number who applied there?`,
    (stimulus) => `Calculate Selected as a percentage of Applicants for ${stimulus.rows[2]!.branch}.`,
    (stimulus) => `For ${stimulus.rows[2]!.branch}, what percent of the total applicants were selected?`,
  ]),
  RATIO: Object.freeze([
    (stimulus) => `What is the ratio of the number of applicants at ${stimulus.rows[0]!.branch} to the number at ${stimulus.rows[3]!.branch}?`,
    (stimulus) => `Find the ratio of Applicants at ${stimulus.rows[0]!.branch} and ${stimulus.rows[3]!.branch}, in that order.`,
    (stimulus) => `Applicants at ${stimulus.rows[0]!.branch} are in what ratio to Applicants at ${stimulus.rows[3]!.branch}?`,
    (stimulus) => `Compare the applicant counts of ${stimulus.rows[0]!.branch} and ${stimulus.rows[3]!.branch} as a simplified ratio.`,
    (stimulus) => `What ratio is obtained from ${stimulus.rows[0]!.branch}'s Applicants count to ${stimulus.rows[3]!.branch}'s Applicants count?`,
    (stimulus) => `Express the Applicants figures for ${stimulus.rows[0]!.branch} and ${stimulus.rows[3]!.branch} as a ratio in the stated order.`,
  ]),
  AVERAGE: Object.freeze([
    () => "What is the average number of selected candidates per branch?",
    () => "Find the mean of the Selected counts across the five branches.",
    () => "On average, how many candidates were selected at each branch?",
    () => "What is the arithmetic mean of the five values in the Selected column?",
    () => "Calculate the average Selected figure for the branches shown.",
    () => "The total selected candidates, when equally averaged over five branches, gives what value?",
  ]),
});

function diversifyStem(stimulus: Di001Stimulus, question: Di001Question): string {
  const variants = STEM_VARIANTS[question.kind];
  const variantIndex = presentationVariantIndex(question.questionId, variants.length);
  return variants[variantIndex]!(stimulus, question);
}

export function generateDi001TableSet(
  input: { seed?: string; examProfile?: Di001ExamProfile } = {},
): Di001QuestionSet {
  const generated = generateDi001TableSetBase(input);
  const questions = generated.questions.map((question) => Object.freeze({
    ...question,
    stem: diversifyStem(generated.stimulus, question),
  }));
  return Object.freeze({ ...generated, questions: Object.freeze(questions) });
}
