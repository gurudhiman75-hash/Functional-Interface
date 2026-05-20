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
import { normalizeTeacherExplanation } from "../quality/teacher-explanation-normalizer";
import type { RealizationProfile } from "./realization-profiles";
import type {
  EditorialInput,
  EditorialRealization,
  EditorialStyle,
} from "./editorial-types";
import { selectCommercialObject } from "./commercial-object-pools";
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

function variantIndex(seed: number | string | undefined, modulo: number) {
  return (
    Math.abs(
      String(seed ?? "")
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0),
    ) % modulo
  );
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
      return `${opening}, ${percent(v.invalidPercent)} of the votes were invalid. The winning candidate got ${percent(v.winnerPercent)} of the valid votes and won by ${n(v.margin)} votes. Find the total number of votes polled.`;
    case "turnout_margin":
      return `${opening}, ${percent(v.turnoutPercent)} of the registered voters cast their votes. Out of these, ${percent(v.invalidPercent)} votes were invalid. The winning candidate got ${percent(v.winnerPercent)} of the valid votes and won by ${n(v.margin)} votes. Find the number of registered voters.`;
    case "multi_candidate_margin":
      return `${opening}, the winning candidate got ${percent(v.winnerPercent)} of the votes and candidate C got ${percent(v.thirdPercent)}. The winning candidate defeated candidate B by ${n(v.margin)} votes. Find the total number of votes.`;
    case "remaining_vote_margin":
      return `${opening}, the winning candidate got ${percent(v.winnerPercent)} of the votes and another candidate got ${percent(v.knownOtherPercent)}. The remaining votes went to a third candidate. The winning candidate defeated the third candidate by ${n(v.margin)} votes. Find the total number of votes.`;
    case "filtered_valid_vote_margin":
      return `${opening}, ${percent(v.turnoutPercent)} of the registered voters voted and ${percent(v.validPercent)} of those votes were valid. The winning candidate got ${percent(v.winnerPercent)} of the valid votes. The margin between the two candidates was ${n(v.margin)} votes. Find the winning candidate's votes.`;
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

function relationDirectionPhrase(
  direction: number | undefined,
  percentValue: number | undefined,
) {
  return direction === 0
    ? `${percent(percentValue)} less than`
    : `${percent(percentValue)} more than`;
}

function relationalStem(
  problem: CanonicalPercentageProblem,
) {
  const v = problem.variables;
  const relationCount = Math.max(1, Math.trunc(v.relationCount ?? 1));
  const baseEntity =
    relationCount >= 3
      ? "D"
      : relationCount >= 2
        ? "C"
        : "B";

  const relation1 =
    `A's income is ${relationDirectionPhrase(v.relation1Direction, v.relation1Percent)} B's income.`;
  const relation2 =
    relationCount >= 2
      ? ` B's income is ${relationDirectionPhrase(v.relation2Direction, v.relation2Percent)} C's income.`
      : "";
  const relation3 =
    relationCount >= 3
      ? ` C's income is ${relationDirectionPhrase(v.relation3Direction, v.relation3Percent)} D's income.`
      : "";

  return `${relation1}${relation2}${relation3} Find by what percent A's income is more or less than ${baseEntity}'s income.`;
}

function legacyStem(
  problem: CanonicalPercentageProblem,
  opening: string,
  subject: string,
  realizationProfile?: RealizationProfile,
  seed?: number | string,
) {
  const v = problem.variables;
  const subjectLine = compactSubjectLine(opening, subject);
  const commercialObject = selectCommercialObject({
    seed,
    namespace: `${problem.subtype}|${v.base ?? v.costPrice ?? v.sellingPrice ?? ""}`,
  });

  switch (problem.subtype) {
    case "increase_then_decrease":
      if (quantityTypeForStemSubject(subjectLine) === "currency") {
        const priceSubject =
          subjectLine === "The marked price"
            ? `The marked price of a ${commercialObject.en}`
            : `${commercialObject.en[0]?.toUpperCase() ?? ""}${commercialObject.en.slice(1)} price`;
        return `${priceSubject} was ${stemValue(v.base, subjectLine, realizationProfile)}. It first ${changePhrase(v.firstRate)} and then ${changePhrase(v.secondRate)}. What will be the final price of the ${commercialObject.en}?`;
      }
      return `${subjectLine} was ${stemValue(v.base, subjectLine, realizationProfile)}. It first ${changePhrase(v.firstRate)} and then ${changePhrase(v.secondRate)}. Find the final value.`;
    case "reverse_percentage":
      if (/mark|score/iu.test(subjectLine)) {
        return `A student scored ${n(v.part)} marks, which is ${percent(v.percent)} of the maximum marks. Find the maximum marks.`;
      }
      if (/population/iu.test(subjectLine)) {
        return `A census recorded ${n(v.part)} people, which is ${percent(v.percent)} of the total population. Find the total population.`;
      }
      return `The recorded quantity is ${n(v.part)}, which is ${percent(v.percent)} of the original quantity. Find the original quantity.`;
    case "restore_original":
      return `${subjectLine} was reduced by ${percent(v.cutPercent)} from its original level. By what percent should it be increased to restore the original level?`;
    case "salary_revision":
      return `${compactSubjectLine(opening, subject)} changed from ${currency(v.oldSalary, realizationProfile)} to ${currency(v.newSalary, realizationProfile)}. Find the percentage change based on the old salary.`;
    case "price_consumption":
      return `${opening} increased by ${percent(v.priceIncreasePercent)}. If total expenditure is kept the same, by what percent should consumption be reduced?`;
    case "profit_loss":
      return `A shopkeeper sold a ${commercialObject.en}. Cost price = ${currency(v.costPrice, realizationProfile)} and selling price = ${currency(v.sellingPrice, realizationProfile)}. Find the profit or loss percentage on cost price.`;
    case "mixture_percentage":
      switch (variantIndex(seed, 4)) {
        case 1:
          return `A vessel has ${n(v.total)} litres of milk-water mixture with ${percent(v.initialPercent)} milk. How much milk should be added so that milk becomes ${percent(v.targetPercent)} of the mixture?`;
        case 2:
          return `A milk-water mixture contains ${n(v.total)} litres, of which ${percent(v.initialPercent)} is milk. Find the milk to be added so that milk becomes ${percent(v.targetPercent)} of the mixture.`;
        case 3:
          return `In a milk-water mixture, total quantity is ${n(v.total)} litres and milk is ${percent(v.initialPercent)}. How much milk is needed to make milk ${percent(v.targetPercent)} of the mixture?`;
        default:
          return `A milk-water mixture contains ${n(v.total)} litres, of which ${percent(v.initialPercent)} is milk. How much milk should be added so that milk becomes ${percent(v.targetPercent)} of the mixture?`;
      }
    case "relational_percentage":
      return relationalStem(problem);
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
      input.seed,
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
    explanation: normalizeTeacherExplanation(
      normalizeRealizationBlock(explanation.explanation),
      "en",
    ),
    naturalization: {
      ...explanation.naturalization,
      stemPatternId: stem.stemPatternId,
      naturalizationScore: score,
    },
  };
}
