export type EcoCp005ConceptRow = {
  id: string;
  term: string;
  compactMeaning: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type EcoCp005IndexRow = {
  id: string;
  index: "CPI" | "WPI" | "GDP deflator";
  focus: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const rbiSources = ["RBI-INFLATION-MEASUREMENT", "RBI-CORE-INFLATION"] as const;

export const ECO_CP005_CONCEPT_ROWS_V1: readonly EcoCp005ConceptRow[] = Object.freeze([
  {
    id: "inflation",
    term: "Inflation",
    compactMeaning: "a sustained rise in the general price level",
    sourceIds: rbiSources,
    sourceFactIds: ["eco-cp005-inflation"],
  },
  {
    id: "deflation",
    term: "Deflation",
    compactMeaning: "a sustained fall in the general price level",
    sourceIds: rbiSources,
    sourceFactIds: ["eco-cp005-deflation"],
  },
  {
    id: "disinflation",
    term: "Disinflation",
    compactMeaning: "a fall in the inflation rate while the general price level may still be rising",
    sourceIds: rbiSources,
    sourceFactIds: ["eco-cp005-disinflation"],
  },
  {
    id: "demand-pull",
    term: "Demand-pull inflation",
    compactMeaning: "inflation caused by aggregate demand rising faster than available output",
    sourceIds: rbiSources,
    sourceFactIds: ["eco-cp005-demand-pull"],
  },
  {
    id: "cost-push",
    term: "Cost-push inflation",
    compactMeaning: "inflation caused by rising production costs or adverse supply conditions",
    sourceIds: rbiSources,
    sourceFactIds: ["eco-cp005-cost-push"],
  },
  {
    id: "headline",
    term: "Headline inflation",
    compactMeaning: "inflation measured using the full selected price basket",
    sourceIds: ["RBI-CORE-INFLATION"],
    sourceFactIds: ["eco-cp005-headline"],
  },
  {
    id: "core",
    term: "Core inflation",
    compactMeaning: "an underlying inflation measure commonly obtained by excluding volatile items such as food and fuel",
    sourceIds: ["RBI-CORE-INFLATION"],
    sourceFactIds: ["eco-cp005-core"],
  },
  {
    id: "purchasing-power",
    term: "Purchasing power",
    compactMeaning: "the quantity of goods and services that a unit of money can buy",
    sourceIds: rbiSources,
    sourceFactIds: ["eco-cp005-purchasing-power"],
  },
  {
    id: "base-effect",
    term: "Base effect",
    compactMeaning: "the effect of the comparison-period price level on the measured inflation rate",
    sourceIds: ["RBI-CORE-INFLATION"],
    sourceFactIds: ["eco-cp005-base-effect"],
  },
]);

export const ECO_CP005_INDEX_ROWS_V1: readonly EcoCp005IndexRow[] = Object.freeze([
  {
    id: "cpi",
    index: "CPI",
    focus: "changes in prices of a basket of goods and services acquired by households for consumption",
    sourceIds: ["MOSPI-CPI-FAQ", "RBI-INFLATION-MEASUREMENT"],
    sourceFactIds: ["eco-cp005-cpi"],
  },
  {
    id: "wpi",
    index: "WPI",
    focus: "price movement at the wholesale level",
    sourceIds: ["OEA-WPI-MANUAL", "RBI-INFLATION-MEASUREMENT"],
    sourceFactIds: ["eco-cp005-wpi"],
  },
  {
    id: "gdp-deflator",
    index: "GDP deflator",
    focus: "price change for domestically produced final goods and services covered by GDP",
    sourceIds: ["RBI-INFLATION-MEASUREMENT"],
    sourceFactIds: ["eco-cp005-gdp-deflator"],
  },
]);

export const ECO_CP005_DEMAND_SCENARIOS_V1 = Object.freeze([
  {
    id: "demand-1",
    stem: "Household and business spending rises strongly while output cannot increase quickly.",
    answer: "Demand-pull inflation",
    explanation: "Demand is rising faster than available output. Buyers compete for limited output, so prices tend to rise.",
  },
  {
    id: "demand-2",
    stem: "Total demand rises sharply in an economy already operating near full capacity.",
    answer: "Demand-pull inflation",
    explanation: "Near full capacity, production cannot expand quickly. Extra demand therefore creates upward pressure on prices.",
  },
  {
    id: "demand-3",
    stem: "Consumers and firms increase spending faster than producers can expand supply.",
    answer: "Demand-pull inflation",
    explanation: "Spending is growing faster than supply. This excess demand pushes the general price level upward.",
  },
] as const);

export const ECO_CP005_COST_SCENARIOS_V1 = Object.freeze([
  {
    id: "cost-1",
    stem: "Fuel and transport costs rise sharply, increasing production costs across many industries.",
    answer: "Cost-push inflation",
    explanation: "Fuel and transport are production costs for many firms. When these costs rise, firms may raise prices to cover them.",
  },
  {
    id: "cost-2",
    stem: "A supply disruption makes a key industrial input much more expensive.",
    answer: "Cost-push inflation",
    explanation: "The supply disruption raises the cost of an important input. Higher production costs can then push final prices upward.",
  },
  {
    id: "cost-3",
    stem: "Widespread input costs rise even though demand has not increased.",
    answer: "Cost-push inflation",
    explanation: "Demand is not the source of the pressure here. Prices rise because firms face higher costs of production.",
  },
] as const);

export const ECO_CP005_INDEX_CASES_V1 = Object.freeze([
  { id: "index-1", oldIndex: 100, newIndex: 108, answer: "8%", explanation: "The index increased by 8 points from a base of 100. So, (108 - 100) / 100 × 100 = 8%." },
  { id: "index-2", oldIndex: 120, newIndex: 126, answer: "5%", explanation: "The index increased by 6 points from a base of 120. So, (126 - 120) / 120 × 100 = 5%." },
  { id: "index-3", oldIndex: 200, newIndex: 210, answer: "5%", explanation: "The index increased by 10 points from a base of 200. So, (210 - 200) / 200 × 100 = 5%." },
  { id: "index-4", oldIndex: 150, newIndex: 162, answer: "8%", explanation: "The index increased by 12 points from a base of 150. So, (162 - 150) / 150 × 100 = 8%." },
] as const);
