import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import { roundClean } from "../utils/math-utils";
import {
  currency,
  formatQuantity,
  quantityTypeForStemSubject,
} from "./quantity-formatting";
import {
  normalizeRealizationBlock,
  normalizeRealizationText,
} from "./realization-normalizer";
import type { RealizationProfile } from "./realization-profiles";
import type {
  EditorialInput,
  EditorialRealization,
  EditorialStyle,
} from "./editorial-types";
import { selectContextualGrounding } from "./contextual-grounding";
import { createEditorialPlan } from "./editorial-planner";
import { realizeExplanationWithNaturalization } from "./explanation-realizer";
import { selectScenario } from "./scenario-engine";

function n(value: number | undefined) {
  if (typeof value !== "number") {
    return "";
  }
  const rounded = roundClean(value, 2);
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
}

function percent(value: number | undefined) {
  return `${n(value)}%`;
}

function changePhrase(value: number | undefined) {
  if (typeof value !== "number") {
    return "changed";
  }

  return value < 0
    ? `decreased by ${percent(Math.abs(value))}`
    : `increased by ${percent(value)}`;
}

function normalizedPhrase(value: string) {
  return value
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLowerCase();
}

function compactSubjectLine(opening: string, subject: string) {
  const normalizedOpening = normalizedPhrase(opening);
  const normalizedSubject = normalizedPhrase(subject);
  if (
    opening === "A quantity" ||
    normalizedOpening === normalizedSubject ||
    normalizedOpening.endsWith(normalizedSubject)
  ) {
    return opening;
  }
  return `${opening}, ${subject}`;
}

function stemValue(
  value: number | undefined,
  subjectLine: string,
  profile?: RealizationProfile,
) {
  return formatQuantity({
    value,
    type: quantityTypeForStemSubject(subjectLine),
    profile,
  });
}

function electionStem(
  problem: CanonicalPercentageProblem,
  opening: string,
) {
  const v = problem.variables;

  switch (problem.topology?.variant) {
    case "invalid_vote_margin":
      return `${opening}, ${percent(v.invalidPercent)} of the votes were invalid. The winner got ${percent(v.winnerPercent)} of the valid votes and won by ${n(v.margin)} votes. Find the total number of votes polled.`;
    case "turnout_margin":
      return `${opening}, ${percent(v.turnoutPercent)} of the registered voters cast their votes. Out of these, ${percent(v.invalidPercent)} votes were invalid. The winner got ${percent(v.winnerPercent)} of the valid votes and won by ${n(v.margin)} votes. Find the number of registered voters.`;
    case "multi_candidate_margin":
      return `${opening}, candidate A got ${percent(v.winnerPercent)} of the votes and candidate C got ${percent(v.thirdPercent)}. Candidate A defeated candidate B by ${n(v.margin)} votes. Find the total number of votes.`;
    case "remaining_vote_margin":
      return `${opening}, one candidate got ${percent(v.winnerPercent)} of the votes and another got ${percent(v.knownOtherPercent)}. The remaining votes went to a third candidate. The first candidate defeated the third candidate by ${n(v.margin)} votes. Find the total number of votes.`;
    case "filtered_valid_vote_margin":
      return `${opening}, ${percent(v.turnoutPercent)} of the registered voters voted and ${percent(v.validPercent)} of those votes were valid. The winner got ${percent(v.winnerPercent)} of the valid votes. The margin between the two candidates was ${n(v.margin)} votes. Find the winner's votes.`;
    case "direct_margin":
    default:
      return `${opening}, the winning candidate secured ${percent(v.winnerPercent)} of the votes and defeated the opponent by ${n(v.margin)} votes. Find the total number of votes polled.`;
  }
}

function passFailStem(
  problem: CanonicalPercentageProblem,
  opening: string,
) {
  const v = problem.variables;

  switch (problem.topology?.variant) {
    case "pass_fail_gap":
      return `${opening}, a candidate scored ${percent(v.scoredPercent)} marks and was short of passing by ${n(v.shortBy)} marks. Another candidate scored ${percent(v.highScorePercent)} marks and exceeded the pass mark by ${n(v.excessBy)} marks. Find the maximum marks.`;
    case "successive_mark_adjustment":
      return `${opening}, a candidate first scored ${percent(v.rawPercent)} marks. After adding a bonus of ${percent(v.bonusPercent)}, the score was still short of the pass mark by ${n(v.shortBy)} marks. The pass mark was ${percent(v.passPercent)}. Find the maximum marks.`;
    case "remaining_marks_required":
      return `${opening}, ${percent(v.completedPercent)} of the paper has been evaluated. A student scored ${percent(v.scoredOnCompletedPercent)} of those marks. To secure ${percent(v.requiredOverallPercent)} overall, the student still needs ${n(v.remainingMarksRequired)} marks. Find the maximum marks.`;
    case "simple_shortfall":
    default:
      return `${opening}, a candidate scored ${percent(v.scoredPercent)} marks and failed by ${n(v.shortBy)} marks. The pass mark was ${percent(v.passPercent)}. Find the maximum marks.`;
  }
}

function populationStem(
  problem: CanonicalPercentageProblem,
  opening: string,
) {
  const v = problem.variables;

  switch (problem.topology?.variant) {
    case "growth_then_decay":
      return `${opening}, the population was ${n(v.population)}. It increased by ${percent(v.growthRate)} and then decreased by ${percent(v.decayRate)}. Find the final population.`;
    case "migration_adjusted_population":
      return `${opening}, the population was ${n(v.population)}. It increased by ${percent(v.growthRate)}. In addition, people equal to ${percent(v.migrationPercent)} of the original population migrated in. Find the final population.`;
    case "male_female_population_shift":
      return `${opening}, the total population was ${n(v.totalPopulation)}. Males were ${percent(v.malePercent)} and females were the rest. The male population increased by ${percent(v.maleGrowthRate)}, while the female population decreased by ${percent(v.femaleDecayRate)}. Find the final population.`;
    case "single_growth":
    default:
      return `${opening}, the population was ${n(v.population)}. It increased by ${percent(v.rate)} per year for ${n(v.years)} years. Find the population after this period.`;
  }
}

function legacyStem(
  problem: CanonicalPercentageProblem,
  opening: string,
  subject: string,
  realizationProfile?: RealizationProfile,
) {
  const v = problem.variables;
  const subjectLine = compactSubjectLine(opening, subject);

  switch (problem.subtype) {
    case "increase_then_decrease":
      return `${subjectLine} was ${stemValue(v.base, subjectLine, realizationProfile)}. It first ${changePhrase(v.firstRate)} and then ${changePhrase(v.secondRate)}. Find the final value.`;
    case "reverse_percentage":
      return `${subjectLine} is ${n(v.part)}, which is ${percent(v.percent)} of the total. Find the total value represented by 100%.`;
    case "restore_original":
      return `${subjectLine} was reduced by ${percent(v.cutPercent)} from its original level. By what percent should it be increased to restore the original level?`;
    case "salary_revision":
      return `${compactSubjectLine(opening, subject)} changed from ${currency(v.oldSalary, realizationProfile)} to ${currency(v.newSalary, realizationProfile)}. Find the percentage change based on the old salary.`;
    case "price_consumption":
      return `${opening} increased by ${percent(v.priceIncreasePercent)}. If total expenditure is kept the same, by what percent should consumption be reduced?`;
    case "profit_loss":
      return `${opening}. Cost price = ${currency(v.costPrice, realizationProfile)} and selling price = ${currency(v.sellingPrice, realizationProfile)}. Find the profit or loss percentage on cost price.`;
    case "mixture_percentage":
      return `${opening}, ${subject} has ${n(v.total)} units and contains ${percent(v.initialPercent)} pure component. How much pure component should be added to make it ${percent(v.targetPercent)} pure?`;
    default:
      return `${opening}, find the required value from the percentage relation.`;
  }
}

function realizeQuestionStemWithPattern(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  style?: EditorialStyle;
  seed?: number | string;
  realizationProfile?: RealizationProfile;
}): { stem: string; stemPatternId: string } {
  const scenario = selectScenario(input.problem, input.seed);
  const grounding = selectContextualGrounding({
    problem: input.problem,
    scenario,
    seed: input.seed,
  });
  const opening = grounding.opening;

  if (input.problem.subtype === "election_margin") {
    return {
      stem: electionStem(input.problem, opening),
      stemPatternId: `${input.problem.topology?.variant ?? input.problem.subtype}:election`,
    };
  }
  if (input.problem.subtype === "pass_fail") {
    return {
      stem: passFailStem(input.problem, opening),
      stemPatternId: `${input.problem.topology?.variant ?? input.problem.subtype}:exam`,
    };
  }
  if (input.problem.subtype === "population_growth") {
    return {
      stem: populationStem(input.problem, opening),
      stemPatternId: `${input.problem.topology?.variant ?? input.problem.subtype}:population`,
    };
  }

  return {
    stem: normalizeRealizationText(legacyStem(
      input.problem,
      opening,
      grounding.subject,
      input.realizationProfile,
    )),
    stemPatternId: grounding.stemPatternId,
  };
}

export function realizeQuestionStem(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  style?: EditorialStyle;
  seed?: number | string;
  realizationProfile?: RealizationProfile;
}): string {
  return realizeQuestionStemWithPattern(input).stem;
}

export function realizeEditorialProblem(
  input: EditorialInput,
): EditorialRealization {
  const scenario = selectScenario(input.problem, input.seed);
  const plan = createEditorialPlan({
    ...input,
    scenario,
  });
  const stem = realizeQuestionStemWithPattern(input);
  const explanation = realizeExplanationWithNaturalization({
    ...input,
    style: plan.style,
  });
  const score = Math.min(
    100,
    explanation.naturalization.naturalizationScore +
      (stem.stemPatternId.includes("scenario_default") ? 0 : 5),
  );

  return {
    scenario,
    style: plan.style,
    stem: normalizeRealizationText(stem.stem),
    explanation: normalizeRealizationBlock(explanation.explanation),
    naturalization: {
      ...explanation.naturalization,
      stemPatternId: stem.stemPatternId,
      naturalizationScore: score,
    },
  };
}
