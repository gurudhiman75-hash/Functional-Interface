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
import { renderRelationalPercentageExplanation } from "./relation-explanation";
import { selectScenario } from "./scenario-engine";
import {
  renderAdvancedPercentageExplanation,
  renderAdvancedPercentageStem,
} from "../canonical/percentage-advanced-motifs";

function n(value: number | undefined) {
  if (typeof value !== "number") {
    return "";
  }
  const rounded = roundClean(value, 2);
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
}

function formatPercentMixed(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const integerPart = Math.floor(abs);
  const fraction = abs - integerPart;

  const closeTo = (a: number, b: number) => Math.abs(a - b) < 0.001;

  if (closeTo(fraction, 1 / 3)) return `$${sign}${integerPart}\\frac{1}{3}\\%$`;
  if (closeTo(fraction, 2 / 3)) return `$${sign}${integerPart}\\frac{2}{3}\\%$`;
  if (closeTo(fraction, 1 / 6)) return `$${sign}${integerPart}\\frac{1}{6}\\%$`;
  if (closeTo(fraction, 5 / 6)) return `$${sign}${integerPart}\\frac{5}{6}\\%$`;
  if (closeTo(fraction, 1 / 7)) return `$${sign}${integerPart}\\frac{1}{7}\\%$`;
  if (closeTo(fraction, 2 / 7)) return `$${sign}${integerPart}\\frac{2}{7}\\%$`;
  if (closeTo(fraction, 3 / 7)) return `$${sign}${integerPart}\\frac{3}{7}\\%$`;
  if (closeTo(fraction, 4 / 7)) return `$${sign}${integerPart}\\frac{4}{7}\\%$`;
  if (closeTo(fraction, 5 / 7)) return `$${sign}${integerPart}\\frac{5}{7}\\%$`;
  if (closeTo(fraction, 6 / 7)) return `$${sign}${integerPart}\\frac{6}{7}\\%$`;
  if (closeTo(fraction, 1 / 8)) return `$${sign}${integerPart}\\frac{1}{8}\\%$`;
  if (closeTo(fraction, 3 / 8)) return `$${sign}${integerPart}\\frac{3}{8}\\%$`;
  if (closeTo(fraction, 5 / 8)) return `$${sign}${integerPart}\\frac{5}{8}\\%$`;
  if (closeTo(fraction, 7 / 8)) return `$${sign}${integerPart}\\frac{7}{8}\\%$`;
  if (closeTo(fraction, 1 / 9)) return `$${sign}${integerPart}\\frac{1}{9}\\%$`;
  if (closeTo(fraction, 2 / 9)) return `$${sign}${integerPart}\\frac{2}{9}\\%$`;
  if (closeTo(fraction, 4 / 9)) return `$${sign}${integerPart}\\frac{4}{9}\\%$`;
  if (closeTo(fraction, 5 / 9)) return `$${sign}${integerPart}\\frac{5}{9}\\%$`;
  if (closeTo(fraction, 7 / 9)) return `$${sign}${integerPart}\\frac{7}{9}\\%$`;
  if (closeTo(fraction, 8 / 9)) return `$${sign}${integerPart}\\frac{8}{9}\\%$`;
  if (closeTo(fraction, 1 / 11)) return `$${sign}${integerPart}\\frac{1}{11}\\%$`;
  if (closeTo(fraction, 2 / 11)) return `$${sign}${integerPart}\\frac{2}{11}\\%$`;
  if (closeTo(fraction, 3 / 11)) return `$${sign}${integerPart}\\frac{3}{11}\\%$`;
  if (closeTo(fraction, 0.5)) return `$${sign}${integerPart}\\frac{1}{2}\\%$`;

  return `${sign}${n(abs)}%`;
}

function percent(value: number | undefined) {
  if (typeof value === "number" && !Number.isInteger(value)) {
    return formatPercentMixed(value);
  }
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

function phraseVariant<T extends readonly string[]>(
  variants: T,
  seed: number | string | undefined,
  salt: string,
) {
  return variants[variantIndex(`${seed ?? ""}|${salt}`, variants.length)]!;
}

const LEGACY_STEM_PHRASE_BANKS = {
  taxation: [
    "The income tax rate is reduced",
    "In a tax revision notice, the income tax rate is lowered",
    "After a tax-rate revision, the income tax rate falls",
    "For a taxable income slab, the tax rate is reduced",
  ],
  salaryRevision: [
    "Following a corporate annual performance review",
    "After the annual payroll revision",
    "In a company salary revision cycle",
    "During a regular salary review",
  ],
  restoreOriginal: [
    "Due to an off-season clearance sale",
    "During a store clearance offer",
    "In a temporary discount campaign",
    "After a seasonal markdown",
  ],
  priceConsumption: [
    "The price of sugar increased",
    "In the market, the price of sugar increased",
    "A household noticed that sugar price increased",
    "For the same grocery item, the price increased",
  ],
  expenditureConsumption: [
    "The price of a household commodity increased",
    "For a regular-use commodity, the price increased",
    "A household commodity price increased",
    "The unit price of a commodity increased",
  ],
  commission: [
    "A salesman gets a commission",
    "A sales agent earns commission",
    "Under a sales-incentive plan, a salesperson earns commission",
    "In a commission scheme, a salesperson receives commission",
  ],
  mixture: [
    "A vessel has a milk-water mixture",
    "A container holds a milk-water mixture",
    "In a milk-water mixture",
    "A milk-water mixture contains",
  ],
  venn: [
    "In an examination",
    "In a school result summary",
    "In a class test report",
    "For a group of students",
  ],
  election: [
    "In a municipal election",
    "During a constituency election",
    "In a local body election",
    "In an election report",
  ],
  passFail: [
    "In a screening test",
    "In a recruitment exam",
    "In a scholarship test",
    "In a qualifying examination",
  ],
  population: [
    "In a district population survey",
    "According to a census report",
    "In an urban-rural population report",
    "In a migration report",
  ],
  relation: [
    "A's income is",
    "For the given income comparison, A's income is",
    "Comparing the listed incomes, A's income is",
    "In an income comparison, A's income is",
  ],
} as const;

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
  seed?: number | string,
) {
  const v = problem.variables;
  const electionOpening = phraseVariant(
    LEGACY_STEM_PHRASE_BANKS.election,
    seed,
    `${problem.topology?.variant ?? "election"}|${v.margin ?? ""}`,
  );

  switch (problem.topology?.variant) {
    case "invalid_vote_margin":
      return `${electionOpening}, ${percent(v.invalidPercent)} of the votes were invalid. The winning candidate got ${percent(v.winnerPercent)} of the valid votes and won by ${n(v.margin)} votes. Find the total number of votes polled.`;
    case "turnout_margin":
      return `${electionOpening}, ${percent(v.turnoutPercent)} of the registered voters cast their votes. Out of these, ${percent(v.invalidPercent)} votes were invalid. The winning candidate got ${percent(v.winnerPercent)} of the valid votes and won by ${n(v.margin)} votes. Find the number of registered voters.`;
    case "multi_candidate_margin":
      return `${electionOpening}, the winning candidate got ${percent(v.winnerPercent)} of the votes and candidate C got ${percent(v.thirdPercent)}. The winning candidate defeated candidate B by ${n(v.margin)} votes. Find the total number of votes.`;
    case "remaining_vote_margin":
      return `${electionOpening}, the winning candidate got ${percent(v.winnerPercent)} of the votes and another candidate got ${percent(v.knownOtherPercent)}. The remaining votes went to a third candidate. The winning candidate defeated the third candidate by ${n(v.margin)} votes. Find the total number of votes.`;
    case "filtered_valid_vote_margin":
      return `${electionOpening}, ${percent(v.turnoutPercent)} of the registered voters voted and ${percent(v.validPercent)} of those votes were valid. The winning candidate got ${percent(v.winnerPercent)} of the valid votes. The margin between the two candidates was ${n(v.margin)} votes. Find the winning candidate's votes.`;
    case "direct_margin":
    default:
      return `${electionOpening}, the winning candidate secured ${percent(v.winnerPercent)} of the votes and defeated the opponent by ${n(v.margin)} votes. Find the total number of votes polled.`;
  }
}

function passFailStem(
  problem: CanonicalPercentageProblem,
  opening: string,
  seed?: number | string,
) {
  const v = problem.variables;
  const examOpening = phraseVariant(
    LEGACY_STEM_PHRASE_BANKS.passFail,
    seed,
    `${problem.topology?.variant ?? "pass"}|${v.shortBy ?? v.remainingMarksRequired ?? ""}`,
  );

  switch (problem.topology?.variant) {
    case "pass_fail_gap":
      return `${examOpening}, a candidate scored ${percent(v.scoredPercent)} marks and was short of passing by ${n(v.shortBy)} marks. Another candidate scored ${percent(v.highScorePercent)} marks and exceeded the pass mark by ${n(v.excessBy)} marks. Find the maximum marks.`;
    case "successive_mark_adjustment":
      return `${examOpening}, a candidate first scored ${percent(v.rawPercent)} marks. After adding a bonus of ${percent(v.bonusPercent)}, the score was still short of the pass mark by ${n(v.shortBy)} marks. The pass mark was ${percent(v.passPercent)}. Find the maximum marks.`;
    case "remaining_marks_required":
      return `${examOpening}, ${percent(v.completedPercent)} of the paper has been evaluated. A student scored ${percent(v.scoredOnCompletedPercent)} of those marks. To secure ${percent(v.requiredOverallPercent)} overall, the student still needs ${n(v.remainingMarksRequired)} marks. Find the maximum marks.`;
    case "simple_shortfall":
    default:
      return `${examOpening}, a candidate scored ${percent(v.scoredPercent)} marks and failed by ${n(v.shortBy)} marks. The pass mark was ${percent(v.passPercent)}. Find the maximum marks.`;
  }
}

function populationStem(
  problem: CanonicalPercentageProblem,
  opening: string,
  seed?: number | string,
) {
  const v = problem.variables;
  const populationOpening = phraseVariant(
    LEGACY_STEM_PHRASE_BANKS.population,
    seed,
    `${problem.topology?.variant ?? "population"}|${v.population ?? v.totalPopulation ?? ""}`,
  );

  switch (problem.topology?.variant) {
    case "growth_then_decay":
      return `${populationOpening}, the population was ${n(v.population)}. It increased by ${percent(v.growthRate)} and then decreased by ${percent(v.decayRate)}. Find the final population.`;
    case "migration_adjusted_population":
      return `${populationOpening}, the population was ${n(v.population)}. It increased by ${percent(v.growthRate)}. In addition, people equal to ${percent(v.migrationPercent)} of the original population migrated in. Find the final population.`;
    case "male_female_population_shift":
      return `${populationOpening}, the total population was ${n(v.totalPopulation)}. Males were ${percent(v.malePercent)} and females were the rest. The male population increased by ${percent(v.maleGrowthRate)}, while the female population decreased by ${percent(v.femaleDecayRate)}. Find the final population.`;
    case "single_growth":
    default:
      return `${populationOpening}, the population was ${n(v.population)}. It increased by ${percent(v.rate)} per year for ${n(v.years)} years. Find the population after this period.`;
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
  seed?: number | string,
) {
  const v = problem.variables;
  const relationCount = Math.max(1, Math.trunc(v.relationCount ?? 1));
  const baseEntity =
    relationCount >= 3
      ? "D"
      : relationCount >= 2
        ? "C"
        : "B";

  const relationStart = phraseVariant(
    LEGACY_STEM_PHRASE_BANKS.relation,
    seed,
    `${relationCount}|${v.relation1Percent}|${v.relation2Percent}|${v.relation3Percent}`,
  );
  const relation1 = relationStart === "A's income is"
    ? `A's income is ${relationDirectionPhrase(v.relation1Direction, v.relation1Percent)} B's income.`
    : `${relationStart} ${percent(v.relation1Percent)} ${v.relation1Direction === 0 ? "less than" : "more than"} B's income.`;
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
  const advancedStem = renderAdvancedPercentageStem(problem, "en");
  if (advancedStem) {
    return advancedStem;
  }

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
        return `In a competitive engineering entrance examination, a candidate secured ${n(v.part)} marks, which corresponds to exactly ${percent(v.percent)} of the maximum aggregate marks. What are the maximum aggregate marks of the test?`;
      }
      if (Number(v.part ?? 0) >= 100) {
        return `In an employee recruitment drive for the state administrative services, ${n(v.part)} successful candidates constitute ${percent(v.percent)} of the total registered applicants. Find the total number of registered applicants who applied.`;
      }
      return `In a wholesale grocery warehouse, a batch of ${n(v.part)} kg of sugar represents exactly ${percent(v.percent)} of the total quantity of available stock. Find the total sugar stock currently stored in the warehouse.`;
    case "restore_original":
      return `${phraseVariant(LEGACY_STEM_PHRASE_BANKS.restoreOriginal, seed, `${commercialObject.id}|${v.cutPercent}`)}, the marked price of a ${commercialObject.en} was reduced by ${percent(v.cutPercent)} from its original level. By what percentage should the reduced price be increased to restore it to the original marked price?`;
    case "salary_revision":
      return `${phraseVariant(LEGACY_STEM_PHRASE_BANKS.salaryRevision, seed, `${v.oldSalary}|${v.newSalary}`)}, the monthly ${compactSubjectLine(opening, subject).toLowerCase()} was revised from ${currency(v.oldSalary, realizationProfile)} to ${currency(v.newSalary, realizationProfile)}. Find the net percentage change relative to the original salary.`;
    case "price_consumption":
      if (v.quantityDifference !== undefined) {
        return `${phraseVariant(LEGACY_STEM_PHRASE_BANKS.priceConsumption, seed, `${v.priceIncreasePercent}|${v.totalExpenditure}`)} by ${percent(v.priceIncreasePercent)}. As a result, a person can buy ${n(v.quantityDifference)} kg less for ${currency(v.totalExpenditure, realizationProfile)}. Find the original price per kg.`;
      }
      if (v.expenditureIncreasePercent !== undefined) {
        return `${phraseVariant(LEGACY_STEM_PHRASE_BANKS.expenditureConsumption, seed, `${v.priceIncreasePercent}|${v.expenditureIncreasePercent}`)} by ${percent(v.priceIncreasePercent)}, but a household decided to increase its total expenditure by only ${percent(v.expenditureIncreasePercent)}. Find the percentage change in consumption.`;
      }
      return `${phraseVariant(LEGACY_STEM_PHRASE_BANKS.expenditureConsumption, seed, `${v.priceIncreasePercent}|same`)} by ${percent(v.priceIncreasePercent)}. If total expenditure is kept the same, by what percent should consumption be reduced?`;
    case "profit_loss":
      return `A shopkeeper purchased a new ${commercialObject.en} from a distributor. If the cost price of the ${commercialObject.en} was ${currency(v.costPrice, realizationProfile)} and its selling price was ${currency(v.sellingPrice, realizationProfile)}, find the net profit or loss percentage.`;
    case "mixture_percentage":
      switch (variantIndex(`${seed}|mixture|${v.total}|${v.initialPercent}`, 4)) {
        case 1:
          return `${LEGACY_STEM_PHRASE_BANKS.mixture[0]} with ${n(v.total)} litres and ${percent(v.initialPercent)} milk. How much milk should be added so that milk becomes ${percent(v.targetPercent)} of the mixture?`;
        case 2:
          return `${LEGACY_STEM_PHRASE_BANKS.mixture[1]} of ${n(v.total)} litres, of which ${percent(v.initialPercent)} is milk. Find the milk to be added so that milk becomes ${percent(v.targetPercent)} of the mixture.`;
        case 3:
          return `${LEGACY_STEM_PHRASE_BANKS.mixture[2]}, total quantity is ${n(v.total)} litres and milk is ${percent(v.initialPercent)}. How much milk is needed to make milk ${percent(v.targetPercent)} of the mixture?`;
        default:
          return `${LEGACY_STEM_PHRASE_BANKS.mixture[3]} ${n(v.total)} litres, of which ${percent(v.initialPercent)} is milk. How much milk should be added so that milk becomes ${percent(v.targetPercent)} of the mixture?`;
      }
    case "relational_percentage":
      return relationalStem(problem, seed);
    case "venn_diagram":
      return `${phraseVariant(LEGACY_STEM_PHRASE_BANKS.venn, seed, `${v.subjectA}|${v.subjectB}|${v.bothPct}`)}, ${percent(v.subjectA)} of students failed in Mathematics, ${percent(v.subjectB)} failed in English, and ${percent(v.bothPct)} failed in both. If ${n(v.neitherValue)} students passed in both subjects, find the total number of students who appeared for the exam.`;
    case "taxation":
      return `${phraseVariant(LEGACY_STEM_PHRASE_BANKS.taxation, seed, `${v.oldTaxRate}|${v.newTaxRate}|${v.taxDifference}`)} from ${percent(v.oldTaxRate)} to ${percent(v.newTaxRate)}. As a result, a person's tax liability decreases by ${currency(v.taxDifference, realizationProfile)}. Find the total taxable income of the person.`;
    case "commission":
      return `${phraseVariant(LEGACY_STEM_PHRASE_BANKS.commission, seed, `${v.baseCommissionRate}|${v.baseSales}|${v.bonusRate}`)} of ${percent(v.baseCommissionRate)} on total sales up to ${currency(v.baseSales, realizationProfile)} and an additional bonus of ${percent(v.bonusRate)} on sales above this amount. If the total commission is ${currency(v.totalCommission, realizationProfile)}, find the total sales.`;
    default:
      return `${opening}, find the required value from the percentage relation.`;
  }
}

function reversePercentageLabelFromStem(stem: string) {
  const normalized = stem.toLowerCase();
  if (/\bmarks?\b|\bscore\b/.test(normalized)) {
    return "Maximum marks";
  }
  if (/\bpopulation\b|\bpeople\b/.test(normalized)) {
    return "Total population";
  }
  if (/\bapplicants?\b|\bcandidates?\b/.test(normalized)) {
    return "Total applicants";
  }
  if (/\bvoters?\b|\bvotes?\b/.test(normalized)) {
    return "Total voters";
  }
  if (/\bsugar\b|\bstock\b/.test(normalized)) {
    return "Total sugar stock";
  }
  return "Total value";
}

function polishEnglishExplanationForStem(input: {
  problem: CanonicalPercentageProblem;
  stem: string;
  explanation: string;
}) {
  if (input.problem.subtype === "relational_percentage") {
    return renderRelationalPercentageExplanation(input.problem, "en");
  }

  if (input.problem.subtype !== "reverse_percentage") {
    return input.explanation;
  }

  const label = reversePercentageLabelFromStem(input.stem);
  return input.explanation
    .replace(/^Total quantity is:/gmu, `${label}:`)
    .replace(/^Total quantity =/gmu, `${label} =`)
    .replace(/^Hence, total quantity for the record =/gmu, `${label} =`)
    .replace(/^Therefore, total quantity for the record =/gmu, `${label} =`)
    .replace(/^Required total quantity for the record =/gmu, `${label} =`);
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
      stem: electionStem(input.problem, opening, input.seed),
      stemPatternId: `${input.problem.topology?.variant ?? input.problem.subtype}:election`,
    };
  }
  if (input.problem.subtype === "pass_fail") {
    return {
      stem: passFailStem(input.problem, opening, input.seed),
      stemPatternId: `${input.problem.topology?.variant ?? input.problem.subtype}:exam`,
    };
  }
  if (input.problem.subtype === "population_growth") {
    return {
      stem: populationStem(input.problem, opening, input.seed),
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
  const advancedExplanation = renderAdvancedPercentageExplanation(
    input.problem,
    "en",
  );
  const score = Math.min(
    100,
    explanation.naturalization.naturalizationScore +
      (stem.stemPatternId.includes("scenario_default") ? 0 : 5),
  );
  const normalizedStem = normalizeRealizationText(stem.stem);
  const normalizedExplanation = normalizeTeacherExplanation(
    normalizeRealizationBlock(advancedExplanation ?? explanation.explanation),
    "en",
  );

  return {
    scenario,
    style: plan.style,
    stem: normalizedStem,
    explanation: polishEnglishExplanationForStem({
      problem: input.problem,
      stem: normalizedStem,
      explanation: normalizedExplanation,
    }),
    naturalization: {
      ...explanation.naturalization,
      stemPatternId: stem.stemPatternId,
      naturalizationScore: score,
    },
  };
}
