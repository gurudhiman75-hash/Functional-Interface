import type {
  DifficultyLabel,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  createReasoningStep,
  pickRandomItem,
} from "../shared";
import type { QuantProceduralScenario } from "./time-work-scenarios";

type PercentageDefinition = {
  id: string;
  difficulty: DifficultyLabel[];
  create: () => Omit<
    QuantProceduralScenario,
    "topicCluster"
  >;
};

const round2 = (value: number) =>
  Number(value.toFixed(2));

const pct = (
  value: number,
  rate: number,
) => (value * rate) / 100;

const gcd = (a: number, b: number): number =>
  b === 0 ? Math.abs(a) : gcd(b, a % b);

const ratioEngine = {
  reduce(a: number, b: number) {
    const factor = gcd(a, b);
    return [a / factor, b / factor] as const;
  },
  parts(total: number, a: number, b: number) {
    const sum = a + b;
    return {
      first: (total * a) / sum,
      second: (total * b) / sum,
    };
  },
};

const variation = {
  retainedSolidWeight(
    totalWeight: number,
    waterPercent: number,
  ) {
    return totalWeight * (1 - waterPercent / 100);
  },
  finalWeightFromSolid(
    solidWeight: number,
    finalWaterPercent: number,
  ) {
    return solidWeight / (1 - finalWaterPercent / 100);
  },
  applyPercent(
    base: number,
    retainedPercent: number,
  ) {
    return base * (retainedPercent / 100);
  },
};

const scenario = (
  id: string,
  values: Record<string, number>,
  text: string,
  correctAnswer: number,
  steps: string[],
): Omit<
  QuantProceduralScenario,
  "topicCluster"
> => ({
  scenarioType: id,
  motifId: id,
  scenarioLogicBranch: id,
  values,
  text,
  correctAnswer: round2(correctAnswer),
  formula: id,
  reasoningSteps: steps.map((step, index) =>
    createReasoningStep(
      index === 0
        ? "percentage"
        : "infer",
      step,
    ),
  ),
  context: {
    entity: "percentage case",
    metric: "required value",
    context: "percentage",
  },
  validationTokens:
    id === "perc_mixture_replacement"
      ? ["ratio"]
      : ["percentage"],
});

const definitions: PercentageDefinition[] = [
  {
    id: "perc_basic_of",
    difficulty: ["Easy"],
    create: () => {
      const base = pickRandomItem([120, 160, 240, 320, 480, 600, 750, 900]);
      const rate = pickRandomItem([5, 10, 12.5, 20, 25, 40, 50, 75]);
      return scenario("perc_basic_of", { base, rate }, `What is ${rate} percentage of ${base}?`, pct(base, rate), [`Required value = ${base} x ${rate} / 100.`]);
    },
  },
  {
    id: "perc_reverse_find",
    difficulty: ["Easy", "Medium"],
    create: () => {
      const base = pickRandomItem([160, 240, 320, 400, 600, 800]);
      const rate = pickRandomItem([10, 20, 25, 40, 50, 75]);
      const value = pct(base, rate);
      return scenario("perc_reverse_find", { value, rate, base }, `${value} is ${rate} percentage of what number?`, base, [`Base = ${value} x 100 / ${rate}.`]);
    },
  },
  {
    id: "perc_fraction_to_perc",
    difficulty: ["Easy"],
    create: () => {
      const pairs = [[1, 2], [1, 4], [3, 4], [2, 5], [3, 5], [7, 20]];
      const [a, b] = pickRandomItem(pairs)!;
      return scenario("perc_fraction_to_perc", { a, b }, `Convert the fraction ${a}/${b} into percentage.`, (a / b) * 100, [`Percentage = ${a}/${b} x 100.`]);
    },
  },
  {
    id: "perc_decimal_to_perc",
    difficulty: ["Easy"],
    create: () => {
      const decimal = pickRandomItem([0.12, 0.25, 0.36, 0.45, 0.64, 0.875]);
      return scenario("perc_decimal_to_perc", { decimal }, `Convert ${decimal} into percentage.`, decimal * 100, [`Percentage = ${decimal} x 100.`]);
    },
  },
  {
    id: "perc_basic_sum",
    difficulty: ["Easy", "Medium"],
    create: () => {
      const y = pickRandomItem([100, 160, 200, 240, 300]);
      const b = pickRandomItem([120, 180, 240, 360, 400]);
      const x = pickRandomItem([10, 20, 25, 40]);
      const a = pickRandomItem([5, 10, 12.5, 25]);
      return scenario("perc_basic_sum", { x, y, a, b }, `Find ${x} percentage of ${y} plus ${a} percentage of ${b}.`, pct(y, x) + pct(b, a), [`First value = ${y} x ${x}/100.`, `Second value = ${b} x ${a}/100; add both values.`]);
    },
  },
  {
    id: "perc_marks_calc",
    difficulty: ["Easy"],
    create: () => {
      const total = pickRandomItem([80, 100, 120, 150, 200]);
      const rate = pickRandomItem([55, 60, 65, 72, 75, 80]);
      const scored = pct(total, rate);
      return scenario("perc_marks_calc", { scored, total, rate }, `A student scored ${scored} marks out of ${total}. Find the percentage.`, rate, [`Percentage = ${scored}/${total} x 100.`]);
    },
  },
  {
    id: "perc_a_more_than_b",
    difficulty: ["Medium"],
    create: () => {
      const more = pickRandomItem([20, 25, 40, 50, 75]);
      const less = (more / (100 + more)) * 100;
      return scenario("perc_a_more_than_b", { more }, `If A is ${more} percentage more than B, by what percentage is B less than A?`, less, [`Take B = 100, so A = ${100 + more}.`, `B is less than A by ${more}/${100 + more} x 100.`]);
    },
  },
  {
    id: "perc_price_increase",
    difficulty: ["Medium"],
    create: () => {
      const price = pickRandomItem([400, 500, 800, 1200, 1500]);
      const rate = pickRandomItem([10, 12.5, 20, 25, 40]);
      return scenario("perc_price_increase", { price, rate }, `A price of ${price} is increased by ${rate} percentage. Find the new price.`, price * (1 + rate / 100), [`New price = ${price} x (1 + ${rate}/100).`]);
    },
  },
  {
    id: "perc_price_decrease",
    difficulty: ["Medium"],
    create: () => {
      const price = pickRandomItem([400, 500, 800, 1200, 1500]);
      const rate = pickRandomItem([10, 12.5, 20, 25, 40]);
      return scenario("perc_price_decrease", { price, rate }, `A price of ${price} is decreased by ${rate} percentage. Find the new price.`, price * (1 - rate / 100), [`New price = ${price} x (1 - ${rate}/100).`]);
    },
  },
  {
    id: "perc_salary_hike",
    difficulty: ["Medium"],
    create: () => {
      const oldSalary = pickRandomItem([20000, 24000, 30000, 36000, 50000]);
      const hike = pickRandomItem([10, 15, 20, 25, 30]);
      const newSalary = oldSalary * (1 + hike / 100);
      return scenario("perc_salary_hike", { oldSalary, newSalary }, `A salary increases from ${oldSalary} to ${newSalary}. Find the percentage hike.`, hike, [`Hike percentage = (${newSalary} - ${oldSalary})/${oldSalary} x 100.`]);
    },
  },
  {
    id: "perc_population_growth",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const population = pickRandomItem([10000, 20000, 50000, 80000]);
      const rate = pickRandomItem([5, 10, 12, 20]);
      return scenario("perc_population_growth", { population, rate, years: 2 }, `A population of ${population} grows at ${rate} percentage per year for 2 years. Find the final population.`, population * (1 + rate / 100) ** 2, [`Final population = ${population} x (1 + ${rate}/100)^2.`]);
    },
  },
  {
    id: "perc_machine_depreciation",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const value = pickRandomItem([20000, 40000, 50000, 80000]);
      const rate = pickRandomItem([10, 12.5, 20, 25]);
      return scenario("perc_machine_depreciation", { value, rate, years: 2 }, `A machine worth ${value} depreciates by ${rate} percentage every year for 2 years. Find its value after 2 years.`, value * (1 - rate / 100) ** 2, [`Final value = ${value} x (1 - ${rate}/100)^2.`]);
    },
  },
  {
    id: "perc_sequential_spend",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const income = pickRandomItem([20000, 30000, 40000, 50000]);
      const rent = pickRandomItem([20, 25, 30]);
      const food = pickRandomItem([10, 20, 25]);
      const remaining = income * (1 - rent / 100) * (1 - food / 100);
      return scenario("perc_sequential_spend", { income, rent, food }, `A person spends ${rent} percentage of income on rent and then ${food} percentage of the remaining amount on food. If income is ${income}, find the amount left.`, remaining, [`After rent, remaining = ${income} x (1 - ${rent}/100).`, `After food, remaining = previous amount x (1 - ${food}/100).`]);
    },
  },
  {
    id: "perc_successive_hike",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const value = pickRandomItem([1000, 2000, 5000, 10000]);
      const r1 = pickRandomItem([10, 20, 25]);
      const r2 = pickRandomItem([10, 15, 20]);
      return scenario("perc_successive_hike", { value, r1, r2 }, `A value of ${value} receives successive hikes of ${r1} percentage and ${r2} percentage. Find the final value.`, value * (1 + r1 / 100) * (1 + r2 / 100), [`Final value = ${value} x (1 + ${r1}/100) x (1 + ${r2}/100).`]);
    },
  },
  {
    id: "perc_restore_value",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const cut = pickRandomItem([10, 20, 25, 40]);
      return scenario("perc_restore_value", { cut }, `After a ${cut} percentage cut, what percentage increase is required to restore the original value?`, (cut / (100 - cut)) * 100, [`New value is ${100 - cut} when original is 100.`, `Required increase = ${cut}/${100 - cut} x 100.`]);
    },
  },
  {
    id: "perc_compound_error",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const rate = pickRandomItem([10, 20, 25, 40]);
      return scenario("perc_compound_error", { rate }, `A value is increased by ${rate} percentage and then decreased by ${rate} percentage. Find the net percentage change.`, -(rate * rate) / 100, [`Net change = -(${rate} x ${rate})/100 percentage.`]);
    },
  },
  {
    id: "perc_vote_election",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const winnerRate = pickRandomItem([55, 60, 65]);
      const margin = pickRandomItem([1200, 2400, 3600, 4800]);
      return scenario("perc_vote_election", { winnerRate, margin }, `In an election between two candidates, the winner got ${winnerRate} percentage of the votes and won by ${margin} votes. Find the total votes.`, margin / ((2 * winnerRate - 100) / 100), [`Vote difference percentage = ${winnerRate} - ${100 - winnerRate}.`, `Total votes = ${margin} / difference percentage.`]);
    },
  },
  {
    id: "perc_exam_pass_fail",
    difficulty: ["Medium", "Hard"],
    create: () => {
      const scoredRate = pickRandomItem([30, 35, 40]);
      const passRate = scoredRate + pickRandomItem([5, 10, 15]);
      const shortBy = pickRandomItem([20, 30, 45, 60]);
      return scenario("perc_exam_pass_fail", { scoredRate, passRate, shortBy }, `A candidate scored ${scoredRate} percentage marks and failed by ${shortBy} marks. If the pass percentage is ${passRate}, find the maximum marks.`, shortBy / ((passRate - scoredRate) / 100), [`Difference percentage = ${passRate} - ${scoredRate}.`, `Maximum marks = ${shortBy} / difference percentage.`]);
    },
  },
  {
    id: "perc_rect_length_increase",
    difficulty: ["Hard"],
    create: () => {
      const l = pickRandomItem([10, 20, 25]);
      const b = pickRandomItem([10, 15, 20]);
      return scenario("perc_rect_length_increase", { lengthChange: l, breadthChange: -b }, `The length of a rectangle is increased by ${l} percentage and breadth is decreased by ${b} percentage. Find the percentage change in area.`, ((1 + l / 100) * (1 - b / 100) - 1) * 100, [`Area multiplier = (1 + ${l}/100)(1 - ${b}/100).`]);
    },
  },
  {
    id: "perc_circle_radius_change",
    difficulty: ["Hard"],
    create: () => {
      const rate = pickRandomItem([10, 20, 25, 50]);
      return scenario("perc_circle_radius_change", { rate }, `The radius of a circle is increased by ${rate} percentage. Find the percentage change in area.`, ((1 + rate / 100) ** 2 - 1) * 100, [`Area depends on radius squared, so multiplier = (1 + ${rate}/100)^2.`]);
    },
  },
  {
    id: "perc_cube_volume_change",
    difficulty: ["Hard"],
    create: () => {
      const rate = pickRandomItem([10, 20, 25]);
      return scenario("perc_cube_volume_change", { rate }, `The side of a cube is increased by ${rate} percentage. Find the percentage change in volume.`, ((1 + rate / 100) ** 3 - 1) * 100, [`Volume depends on side cubed, so multiplier = (1 + ${rate}/100)^3.`]);
    },
  },
  {
    id: "perc_square_perimeter",
    difficulty: ["Hard"],
    create: () => {
      const rate = pickRandomItem([10, 20, 25, 40]);
      return scenario("perc_square_perimeter", { rate }, `The perimeter of a square is increased by ${rate} percentage. Find the percentage increase in side.`, rate, [`Perimeter is directly proportional to side.`]);
    },
  },
  {
    id: "perc_mixture_replacement",
    difficulty: ["Hard"],
    create: () => {
      const candidates = [
        { r1: 3, r2: 2, total: 100, replaced: 20 },
        { r1: 4, r2: 1, total: 120, replaced: 30 },
        { r1: 5, r2: 3, total: 160, replaced: 40 },
        { r1: 7, r2: 5, total: 240, replaced: 60 },
        { r1: 2, r2: 1, total: 90, replaced: 30 },
      ];
      const item = pickRandomItem(candidates);
      const initial =
        ratioEngine.parts(
          item.total,
          item.r1,
          item.r2,
        );
      const retainedTotal =
        item.total - item.replaced;
      const retained =
        ratioEngine.parts(
          retainedTotal,
          item.r1,
          item.r2,
        );
      const finalMilk = retained.first;
      const finalWater =
        retained.second + item.replaced;
      const [r3, r4] =
        ratioEngine.reduce(
          Math.round(finalMilk),
          Math.round(finalWater),
        );

      return scenario(
        "perc_mixture_replacement",
        {
          r1: item.r1,
          r2: item.r2,
          replaced: item.replaced,
          r3,
          r4,
          total: item.total,
          initialMilk: initial.first,
          initialWater: initial.second,
        },
        `A vessel contains milk and water in the ratio ${item.r1}:${item.r2}. ${item.replaced} liters of mixture are replaced with water. If the new ratio is ${r3}:${r4}, find the original quantity of mixture.`,
        item.total,
        [
          `Initial milk and water are in the ratio ${item.r1}:${item.r2}.`,
          `${item.replaced} liters removed keeps the same ratio in the remaining mixture.`,
          `${item.replaced} liters of pure water is then added, and the final ratio becomes ${r3}:${r4}.`,
        ],
      );
    },
  },
  {
    id: "perc_mixture_water_add",
    difficulty: ["Hard"],
    create: () => {
      const mixture = pickRandomItem([40, 50, 60, 80]);
      const initial = pickRandomItem([10, 20, 25]);
      const target = initial + pickRandomItem([10, 15, 20]);
      const water = pct(mixture, initial);
      const add = ((target / 100) * mixture - water) / (1 - target / 100);
      return scenario("perc_mixture_water_add", { mixture, initial, target }, `${mixture} L mixture contains ${initial} percentage water. How much water must be added to make water ${target} percentage?`, add, [`Initial water = ${mixture} x ${initial}/100.`, `Let added water be x; (initial water + x)/(mixture + x) = ${target}/100.`]);
    },
  },
  {
    id: "perc_fruit_dry_weight",
    difficulty: ["Hard"],
    create: () => {
      const fresh = pickRandomItem([100, 180, 200]);
      const freshWater = pickRandomItem([75, 80]);
      const dryWater = pickRandomItem([10, 20]);
      const solids =
        variation.retainedSolidWeight(
          fresh,
          freshWater,
        );
      return scenario("perc_fruit_dry_weight", { fresh, freshWater, dryWater }, `Fresh fruit weighs ${fresh} kg and contains ${freshWater} percentage water. Dry fruit contains ${dryWater} percentage water. Find the dry weight.`, variation.finalWeightFromSolid(solids, dryWater), [`Solid matter remains constant = ${fresh} x (1 - ${freshWater}/100).`, `Dry weight = solid matter / (1 - ${dryWater}/100).`]);
    },
  },
  {
    id: "perc_tax_income",
    difficulty: ["Hard"],
    create: () => {
      const increase = pickRandomItem([3000, 6000, 9000, 12000]);
      return scenario("perc_tax_income", { increase, oldRate: 20, newRate: 15 }, `Income increases by ${increase}, while tax rate drops from 20 percentage to 15 percentage. If total tax remains the same, find the original income.`, 3 * increase, [`Let original income be x.`, `20% of x = 15% of (x + ${increase}).`]);
    },
  },
  {
    id: "perc_election_invalid",
    difficulty: ["Hard"],
    create: () => {
      const voters = pickRandomItem([50000, 80000, 100000]);
      const noVote = 10;
      const invalid = 10;
      const winnerValid = 54;
      const castVotes =
        variation.applyPercent(
          voters,
          100 - noVote,
        );
      const validVotes =
        variation.applyPercent(
          castVotes,
          100 - invalid,
        );
      return scenario("perc_election_invalid", { voters, noVote, invalid, winnerValid }, `${noVote} percentage voters did not vote and ${invalid} percentage of cast votes were invalid. The winner got ${winnerValid} percentage of valid votes. If total voters are ${voters}, find the winner's votes.`, pct(validVotes, winnerValid), [`Cast votes = ${voters} x (1 - ${noVote}/100).`, `Valid votes = cast votes x (1 - ${invalid}/100).`, `Winner votes = valid votes x ${winnerValid}/100.`]);
    },
  },
  {
    id: "perc_sales_commission",
    difficulty: ["Hard"],
    create: () => {
      const salary = pickRandomItem([12000, 15000, 20000]);
      const threshold = pickRandomItem([50000, 80000, 100000]);
      const sales = threshold + pickRandomItem([20000, 40000, 60000]);
      const rate = pickRandomItem([5, 8, 10]);
      return scenario("perc_sales_commission", { salary, threshold, sales, rate }, `A salesperson gets fixed salary ${salary} and ${rate} percentage commission on sales above ${threshold}. If sales are ${sales}, find total income.`, salary + pct(sales - threshold, rate), [`Commission applies only on ${sales} - ${threshold}.`, `Total income = salary + commission.`]);
    },
  },
  {
    id: "perc_price_consumption",
    difficulty: ["Hard"],
    create: () => {
      const increase = pickRandomItem([20, 25, 40, 50]);
      return scenario("perc_price_consumption", { increase }, `The price of sugar increases by ${increase} percentage. By what percentage must consumption decrease to keep the budget unchanged?`, (increase / (100 + increase)) * 100, [`Required decrease = ${increase}/${100 + increase} x 100.`]);
    },
  },
  {
    id: "perc_population_gender",
    difficulty: ["Hard"],
    create: () => {
      const males = pickRandomItem([30000, 40000, 50000]);
      const females = pickRandomItem([20000, 30000, 40000]);
      const maleRate = pickRandomItem([10, 20, 25]);
      const femaleRate = pickRandomItem(
        [5, 10, 15].filter(
          (rate) => rate !== maleRate,
        ),
      );
      const total = males + females;
      const newTotal = males * (1 + maleRate / 100) + females * (1 + femaleRate / 100);
      return scenario("perc_population_gender", { total, maleRate, femaleRate, newTotal }, `A town has total population ${total}. Males increase by ${maleRate} percentage and females by ${femaleRate} percentage, making the new population ${newTotal}. Find the original male population.`, males, [`Let original males be x and females be ${total} - x.`, `x(1 + ${maleRate}/100) + (${total} - x)(1 + ${femaleRate}/100) = ${newTotal}.`]);
    },
  },
  {
    id: "perc_alloy_composition",
    difficulty: ["Hard"],
    create: () => {
      const high = pickRandomItem([60, 70, 80]);
      const low = pickRandomItem([20, 30, 40]);
      const target = pickRandomItem([45, 50, 55]);
      return scenario("perc_alloy_composition", { high, low, target }, `Alloy A has ${high} percentage copper and Alloy B has ${low} percentage copper. In what ratio should they be mixed to get ${target} percentage copper?`, round2((target - low) / (high - target)), [`By alligation, A:B = (${target} - ${low}) : (${high} - ${target}).`, `Numeric ratio value A/B is the required answer.`]);
    },
  },
];

export function createPercentageScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const selected =
    definitions.find(
      (definition) =>
        definition.id === motif?.id &&
        definition.difficulty.includes(difficulty),
    ) ??
    pickRandomItem(
      definitions.filter((definition) =>
        definition.difficulty.includes(difficulty),
      ),
    );

  return {
    topicCluster: "percentage",
    ...selected.create(),
    context: {
      entity: pattern.topic,
      metric: "percentage value",
      context: "percentage",
    },
  };
}
