export type EcoCp004MethodRow = {
  id: string;
  method: "Value added method" | "Income method" | "Expenditure method";
  compactMeaning: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type EcoCp004UseRow = {
  id: string;
  description: string;
  classification: "Final" | "Intermediate";
  reason: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type EcoCp004ComponentRow = {
  id: string;
  description: string;
  component: string;
  family: "Expenditure" | "Income";
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const sources = ["NCERT-ECON-SYLLABUS-XI-XII", "MOSPI-NAS-SOURCES-METHODS", "MOSPI-NAS-MANUAL"] as const;

export const ECO_CP004_METHOD_ROWS_V1: readonly EcoCp004MethodRow[] = Object.freeze([
  {
    id: "value-added",
    method: "Value added method",
    compactMeaning: "adds the value created at each stage of production",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-value-added-method"],
  },
  {
    id: "income",
    method: "Income method",
    compactMeaning: "adds incomes generated from production",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-income-method"],
  },
  {
    id: "expenditure",
    method: "Expenditure method",
    compactMeaning: "adds final expenditure on goods and services",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-expenditure-method"],
  },
]);

export const ECO_CP004_USE_ROWS_V1: readonly EcoCp004UseRow[] = Object.freeze([
  {
    id: "flour-bakery",
    description: "Flour bought by a bakery to make bread",
    classification: "Intermediate",
    reason: "it is used up in producing another good",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-intermediate-use"],
  },
  {
    id: "bread-household",
    description: "Bread bought by a household for consumption",
    classification: "Final",
    reason: "it is bought for final use, not for resale or further production",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-final-use"],
  },
  {
    id: "steel-car-maker",
    description: "Steel bought by a car manufacturer",
    classification: "Intermediate",
    reason: "it becomes an input in further production",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-intermediate-use"],
  },
  {
    id: "machine-factory",
    description: "A new machine bought by a factory for production",
    classification: "Final",
    reason: "a capital good bought for final investment is not intermediate consumption",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-capital-final-use"],
  },
  {
    id: "milk-household",
    description: "Milk bought by a household for drinking",
    classification: "Final",
    reason: "it is used directly by the final consumer",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-final-use"],
  },
]);

export const ECO_CP004_EXPENDITURE_ROWS_V1: readonly EcoCp004ComponentRow[] = Object.freeze([
  {
    id: "pfce",
    description: "Household spending on final goods and services",
    component: "Private final consumption expenditure",
    family: "Expenditure",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-pfce"],
  },
  {
    id: "gfce",
    description: "Government spending on final consumption services",
    component: "Government final consumption expenditure",
    family: "Expenditure",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-gfce"],
  },
  {
    id: "investment",
    description: "Purchase or creation of fixed capital for production",
    component: "Capital formation / investment",
    family: "Expenditure",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-investment"],
  },
  {
    id: "net-exports",
    description: "Exports minus imports",
    component: "Net exports",
    family: "Expenditure",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-net-exports"],
  },
]);

export const ECO_CP004_INCOME_ROWS_V1: readonly EcoCp004ComponentRow[] = Object.freeze([
  {
    id: "compensation",
    description: "Wages and salaries paid to employees",
    component: "Compensation of employees",
    family: "Income",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-compensation-employees"],
  },
  {
    id: "operating-surplus",
    description: "Surplus earned from production by enterprises",
    component: "Operating surplus",
    family: "Income",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-operating-surplus"],
  },
  {
    id: "mixed-income",
    description: "Income of self-employed units where labour and capital income are mixed",
    component: "Mixed income",
    family: "Income",
    sourceIds: sources,
    sourceFactIds: ["eco-cp004-mixed-income"],
  },
]);

export const ECO_CP004_RULES_V1 = Object.freeze({
  valueAddedFormula: "Value added = Output - Intermediate consumption",
  gdpFromGvaFormula: "GDP = Sum of GVA + Taxes on products - Subsidies on products",
  baseYearMeaning: "a reference year used to compare economic values at constant prices",
  baseRevisionPurpose: "to reflect structural change and update data sources and methods",
  publisher: "Ministry of Statistics and Programme Implementation (MoSPI)",
  sourceIds: ["MOSPI-NAS-SOURCES-METHODS", "MOSPI-NAS-MANUAL", "MOSPI-FAQ-NATIONAL-ACCOUNTS"] as const,
  sourceFactIds: [
    "eco-cp004-value-added-formula",
    "eco-cp004-gdp-gva-relation",
    "eco-cp004-base-year",
    "eco-cp004-base-revision-purpose",
    "eco-cp004-mospi-role",
  ] as const,
});

export const ECO_CP004_VALUE_ADDED_CASES_V1 = Object.freeze([
  { id: "va-1", output: 500, intermediate: 200, answer: "300" },
  { id: "va-2", output: 760, intermediate: 310, answer: "450" },
  { id: "va-3", output: 900, intermediate: 360, answer: "540" },
  { id: "va-4", output: 420, intermediate: 170, answer: "250" },
] as const);

export const ECO_CP004_GDP_GVA_CASES_V1 = Object.freeze([
  { id: "gdp-gva-1", gva: 900, taxesLessSubsidies: 60, answer: "960" },
  { id: "gdp-gva-2", gva: 1200, taxesLessSubsidies: 80, answer: "1280" },
  { id: "gdp-gva-3", gva: 700, taxesLessSubsidies: 40, answer: "740" },
  { id: "gdp-gva-4", gva: 1500, taxesLessSubsidies: 100, answer: "1600" },
] as const);
