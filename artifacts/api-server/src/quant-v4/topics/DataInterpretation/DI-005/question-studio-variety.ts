import { presentationVariantIndex } from "../DI-001/exact";
import { generateDi005PieSet as generateDi005PieSetBase } from "./pie-set";
import type {
  Di005ExamProfile,
  Di005Question,
  Di005QuestionSet,
  Di005Stimulus,
  Di005TaskKind,
} from "./types";

type StemBuilder = (stimulus: Di005Stimulus, question: Di005Question) => string;

function slice(stimulus: Di005Stimulus, question: Di005Question, key: string) {
  const index = question.evidence[key];
  const resolved = index === undefined ? undefined : stimulus.slices[index];
  if (!resolved) throw new Error(`DI-005 stem variety could not resolve evidence key '${key}'.`);
  return resolved;
}

const STEM_VARIANTS: Readonly<Record<Di005TaskKind, readonly StemBuilder[]>> = Object.freeze({
  MISSING_SECTOR_PERCENT: Object.freeze([
    (stimulus, question) => { const target = slice(stimulus, question, "hiddenIndex"); return `The percentage for ${target.category} is missing from the pie chart. What percentage of the students are in ${target.category}?`; },
    (stimulus, question) => { const target = slice(stimulus, question, "hiddenIndex"); return `What percentage should replace the missing value for ${target.category} in the pie chart?`; },
    (stimulus, question) => { const target = slice(stimulus, question, "hiddenIndex"); return `Find the missing percentage share of ${target.category}.`; },
    (stimulus, question) => { const target = slice(stimulus, question, "hiddenIndex"); return `${target.category}'s sector has no percentage label. Determine its share of the whole pie.`; },
    (stimulus, question) => { const target = slice(stimulus, question, "hiddenIndex"); return `The four visible sector percentages are given. What is the remaining percentage for ${target.category}?`; },
    (stimulus, question) => { const target = slice(stimulus, question, "hiddenIndex"); return `Complete the pie chart by calculating the percentage represented by ${target.category}.`; },
  ]),
  SECTOR_ANGLE_DEGREES: Object.freeze([
    (stimulus, question) => { const target = slice(stimulus, question, "categoryIndex"); return `What angle at the centre of the pie chart represents ${target.category}?`; },
    (stimulus, question) => { const target = slice(stimulus, question, "categoryIndex"); return `Find the central angle corresponding to the ${target.category} sector.`; },
    (stimulus, question) => { const target = slice(stimulus, question, "categoryIndex"); return `How many degrees of the full pie are occupied by ${target.category}?`; },
    (stimulus, question) => { const target = slice(stimulus, question, "categoryIndex"); return `Convert ${target.category}'s percentage share into its sector angle.`; },
    (stimulus, question) => { const target = slice(stimulus, question, "categoryIndex"); return `What is the angle, in degrees, subtended at the centre by ${target.category}?`; },
    (stimulus, question) => { const target = slice(stimulus, question, "categoryIndex"); return `Determine the degree measure of the ${target.category} slice of the pie chart.`; },
  ]),
  SECTOR_COUNT_FROM_TOTAL: Object.freeze([
    (stimulus, question) => { const target = slice(stimulus, question, "categoryIndex"); return `How many of the ${stimulus.totalStudents} students are in ${target.category}?`; },
    (stimulus, question) => { const target = slice(stimulus, question, "categoryIndex"); return `Find the number of students represented by the ${target.category} sector out of ${stimulus.totalStudents} students.`; },
    (stimulus, question) => { const target = slice(stimulus, question, "categoryIndex"); return `The pie chart represents ${stimulus.totalStudents} students. How many belong to ${target.category}?`; },
    (stimulus, question) => { const target = slice(stimulus, question, "categoryIndex"); return `Convert ${target.category}'s sector share into a student count when the total is ${stimulus.totalStudents}.`; },
    (stimulus, question) => { const target = slice(stimulus, question, "categoryIndex"); return `What is the actual number of students in ${target.category}, given a total of ${stimulus.totalStudents}?`; },
    (stimulus, question) => { const target = slice(stimulus, question, "categoryIndex"); return `Using the pie percentage for ${target.category}, calculate its count from the total ${stimulus.totalStudents} students.`; },
  ]),
  RATIO_OF_TWO_SECTORS: Object.freeze([
    (stimulus, question) => { const first = slice(stimulus, question, "firstIndex"); const second = slice(stimulus, question, "secondIndex"); return `What is the ratio of the number of students in ${first.category} to the number in ${second.category}?`; },
    (stimulus, question) => { const first = slice(stimulus, question, "firstIndex"); const second = slice(stimulus, question, "secondIndex"); return `Students in ${first.category} are in what ratio to students in ${second.category}?`; },
    (stimulus, question) => { const first = slice(stimulus, question, "firstIndex"); const second = slice(stimulus, question, "secondIndex"); return `Find the simplified ratio of the ${first.category} sector to the ${second.category} sector.`; },
    (stimulus, question) => { const first = slice(stimulus, question, "firstIndex"); const second = slice(stimulus, question, "secondIndex"); return `Compare the numbers represented by ${first.category} and ${second.category} as a ratio.`; },
    (stimulus, question) => { const first = slice(stimulus, question, "firstIndex"); const second = slice(stimulus, question, "secondIndex"); return `What ratio is obtained from ${first.category}'s share to ${second.category}'s share?`; },
    (stimulus, question) => { const first = slice(stimulus, question, "firstIndex"); const second = slice(stimulus, question, "secondIndex"); return `Express the student counts for ${first.category} and ${second.category} in the stated order as a ratio.`; },
  ]),
  RELATIVE_SECTOR_PERCENT_EXCESS: Object.freeze([
    (stimulus, question) => { const larger = slice(stimulus, question, "largerIndex"); const smaller = slice(stimulus, question, "smallerIndex"); return `${larger.category} has what percentage more students than ${smaller.category}?`; },
    (stimulus, question) => { const larger = slice(stimulus, question, "largerIndex"); const smaller = slice(stimulus, question, "smallerIndex"); return `By what percent is the number of students in ${larger.category} greater than in ${smaller.category}?`; },
    (stimulus, question) => { const larger = slice(stimulus, question, "largerIndex"); const smaller = slice(stimulus, question, "smallerIndex"); return `Taking ${smaller.category} as the base, find the percentage excess of ${larger.category}.`; },
    (stimulus, question) => { const larger = slice(stimulus, question, "largerIndex"); const smaller = slice(stimulus, question, "smallerIndex"); return `Compared with ${smaller.category}, what is the relative percentage increase for ${larger.category}?`; },
    (stimulus, question) => { const larger = slice(stimulus, question, "largerIndex"); const smaller = slice(stimulus, question, "smallerIndex"); return `How much higher, in percentage terms, is ${larger.category}'s share than ${smaller.category}'s share?`; },
    (stimulus, question) => { const larger = slice(stimulus, question, "largerIndex"); const smaller = slice(stimulus, question, "smallerIndex"); return `Find the percentage by which ${larger.category} exceeds ${smaller.category} in student count.`; },
  ]),
});

function diversifyStem(seed: string, stimulus: Di005Stimulus, question: Di005Question): string {
  const variants = STEM_VARIANTS[question.kind];
  const variantIndex = presentationVariantIndex(`${seed}:stem-variety:${question.kind}`, variants.length);
  return variants[variantIndex]!(stimulus, question);
}

export function generateDi005PieSet(
  input: { seed?: string; examProfile?: Di005ExamProfile } = {},
): Di005QuestionSet {
  const generated = generateDi005PieSetBase(input);
  const questions = generated.questions.map((question) => Object.freeze({
    ...question,
    stem: diversifyStem(generated.seed, generated.stimulus, question),
  }));
  return Object.freeze({ ...generated, questions: Object.freeze(questions) });
}
