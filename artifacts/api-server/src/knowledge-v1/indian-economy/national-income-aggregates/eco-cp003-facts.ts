export type EcoCp003AggregateRow = {
  id: string;
  term: "GDP" | "GNP" | "NDP" | "NNP";
  fullForm: string;
  compactMeaning: string;
  formula: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type EcoCp003ConceptRow = {
  id: string;
  term: string;
  compactMeaning: string;
  formula?: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const sources = ["NCERT-MACRO-NIA", "MOSPI-NAS-CONCEPTS"] as const;

export const ECO_CP003_AGGREGATE_ROWS_V1: readonly EcoCp003AggregateRow[] = Object.freeze([
  {
    id: "gdp",
    term: "GDP",
    fullForm: "Gross Domestic Product",
    compactMeaning: "value of final goods and services produced within the domestic territory during a period",
    formula: "GDP = NDP + Depreciation",
    sourceIds: sources,
    sourceFactIds: ["eco-cp003-gdp-meaning", "eco-cp003-gdp-ndp-relation"],
  },
  {
    id: "gnp",
    term: "GNP",
    fullForm: "Gross National Product",
    compactMeaning: "GDP adjusted by net factor income from abroad",
    formula: "GNP = GDP + NFIA",
    sourceIds: sources,
    sourceFactIds: ["eco-cp003-gnp-meaning", "eco-cp003-gnp-gdp-relation"],
  },
  {
    id: "ndp",
    term: "NDP",
    fullForm: "Net Domestic Product",
    compactMeaning: "GDP after deducting depreciation",
    formula: "NDP = GDP - Depreciation",
    sourceIds: sources,
    sourceFactIds: ["eco-cp003-ndp-meaning", "eco-cp003-ndp-gdp-relation"],
  },
  {
    id: "nnp",
    term: "NNP",
    fullForm: "Net National Product",
    compactMeaning: "GNP after deducting depreciation",
    formula: "NNP = GNP - Depreciation",
    sourceIds: sources,
    sourceFactIds: ["eco-cp003-nnp-meaning", "eco-cp003-nnp-gnp-relation"],
  },
]);

export const ECO_CP003_CONCEPT_ROWS_V1: readonly EcoCp003ConceptRow[] = Object.freeze([
  {
    id: "depreciation",
    term: "Depreciation",
    compactMeaning: "loss in value of fixed capital due to use, wear and obsolescence",
    sourceIds: sources,
    sourceFactIds: ["eco-cp003-depreciation"],
  },
  {
    id: "nfia",
    term: "Net factor income from abroad (NFIA)",
    compactMeaning: "factor income received from abroad minus factor income paid abroad",
    formula: "GNP = GDP + NFIA",
    sourceIds: sources,
    sourceFactIds: ["eco-cp003-nfia"],
  },
  {
    id: "nominal-gdp",
    term: "Nominal GDP",
    compactMeaning: "GDP measured at current prices",
    sourceIds: sources,
    sourceFactIds: ["eco-cp003-nominal-gdp"],
  },
  {
    id: "real-gdp",
    term: "Real GDP",
    compactMeaning: "GDP measured at constant prices",
    sourceIds: sources,
    sourceFactIds: ["eco-cp003-real-gdp"],
  },
  {
    id: "per-capita-income",
    term: "Per-capita income",
    compactMeaning: "average income per person",
    formula: "Per-capita income = National income / Population",
    sourceIds: sources,
    sourceFactIds: ["eco-cp003-per-capita"],
  },
  {
    id: "value-added",
    term: "Value added",
    compactMeaning: "value of output minus value of intermediate consumption",
    formula: "Value added = Output - Intermediate consumption",
    sourceIds: sources,
    sourceFactIds: ["eco-cp003-value-added"],
  },
  {
    id: "market-price",
    term: "Market price",
    compactMeaning: "factor cost adjusted for net indirect taxes in the traditional exam relationship",
    formula: "Market price = Factor cost + Net indirect taxes",
    sourceIds: sources,
    sourceFactIds: ["eco-cp003-market-price"],
  },
  {
    id: "net-indirect-taxes",
    term: "Net indirect taxes",
    compactMeaning: "indirect taxes minus subsidies",
    formula: "Net indirect taxes = Indirect taxes - Subsidies",
    sourceIds: sources,
    sourceFactIds: ["eco-cp003-net-indirect-taxes"],
  },
]);

export const ECO_CP003_NUMERICAL_CASES_V1 = Object.freeze([
  { id: "ndp-1", stem: "GDP is 500 and depreciation is 40. NDP is:", answer: "460", explanation: "NDP = 500 - 40 = 460.", sourceFactIds: ["eco-cp003-ndp-gdp-relation"] },
  { id: "gnp-1", stem: "GDP is 600 and NFIA is 20. GNP is:", answer: "620", explanation: "GNP = 600 + 20 = 620.", sourceFactIds: ["eco-cp003-gnp-gdp-relation"] },
  { id: "nnp-1", stem: "GNP is 700 and depreciation is 50. NNP is:", answer: "650", explanation: "NNP = 700 - 50 = 650.", sourceFactIds: ["eco-cp003-nnp-gnp-relation"] },
  { id: "per-capita-1", stem: "National income is 1,000 and population is 100. Per-capita income is:", answer: "10", explanation: "1,000 / 100 = 10.", sourceFactIds: ["eco-cp003-per-capita"] },
  { id: "value-added-1", stem: "Output is worth 300 and intermediate inputs cost 120. Value added is:", answer: "180", explanation: "Value added = 300 - 120 = 180.", sourceFactIds: ["eco-cp003-value-added"] },
] as const);
