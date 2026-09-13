export type EcoCp001ConceptRow = {
  id: string;
  term: string;
  definition: string;
  compactMeaning: string;
  family: "CORE" | "ACTIVITY" | "MARKET" | "BRANCH" | "OUTPUT";
  examples: readonly string[];
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type EcoCp001FactorRow = {
  id: string;
  factor: "Land" | "Labour" | "Capital" | "Entrepreneurship";
  meaning: string;
  reward: "Rent" | "Wages" | "Interest" | "Profit";
  examples: readonly string[];
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const MICRO = "NCERT-INTRO-MICRO-CH01";
const SYLLABUS = "NCERT-ECON-SYLLABUS-XI-XII";
const FACTORS = "NCERT-FACTORS-PRODUCTION";

export const ECO_CP001_CONCEPT_ROWS_V1: readonly EcoCp001ConceptRow[] = Object.freeze([
  {
    id: "scarcity",
    term: "Scarcity",
    definition: "the condition in which available resources are limited in relation to wants, so choices have to be made",
    compactMeaning: "limited resources require choices",
    family: "CORE",
    examples: [
      "A village has enough water to expand either irrigation or household supply, but not both fully.",
      "A government has limited funds and must choose among competing uses.",
    ],
    sourceIds: [MICRO],
    sourceFactIds: ["eco-cp001-scarcity-choice"],
  },
  {
    id: "opportunity-cost",
    term: "Opportunity cost",
    definition: "the value of the next best alternative that is forgone when a choice is made",
    compactMeaning: "next best alternative forgone",
    family: "CORE",
    examples: [
      "Using a field for wheat means giving up the best alternative crop that could have been grown there.",
      "Spending an evening at work can mean giving up the best alternative use of that time.",
    ],
    sourceIds: [MICRO, SYLLABUS],
    sourceFactIds: ["eco-cp001-opportunity-cost"],
  },
  {
    id: "utility",
    term: "Utility",
    definition: "the want-satisfying capacity of a good or service",
    compactMeaning: "want-satisfying capacity",
    family: "CORE",
    examples: ["The satisfaction a consumer receives from using a product."],
    sourceIds: [SYLLABUS],
    sourceFactIds: ["eco-cp001-utility"],
  },
  {
    id: "production",
    term: "Production",
    definition: "the economic activity of creating goods or services or adding to their usefulness",
    compactMeaning: "creation of goods and services",
    family: "ACTIVITY",
    examples: [
      "A bakery turns flour into bread.",
      "A software firm creates a digital service for customers.",
    ],
    sourceIds: [MICRO, SYLLABUS],
    sourceFactIds: ["eco-cp001-production"],
  },
  {
    id: "consumption",
    term: "Consumption",
    definition: "the use of goods and services to satisfy wants",
    compactMeaning: "use of goods and services to satisfy wants",
    family: "ACTIVITY",
    examples: [
      "A household uses electricity for lighting.",
      "A passenger uses a bus service for travel.",
    ],
    sourceIds: [MICRO],
    sourceFactIds: ["eco-cp001-consumption"],
  },
  {
    id: "distribution",
    term: "Distribution",
    definition: "the economic process through which the results of production are allocated among participants in the economy",
    compactMeaning: "allocation of the results of production",
    family: "ACTIVITY",
    examples: ["Income from production is shared among the factors that contributed to production."],
    sourceIds: [MICRO],
    sourceFactIds: ["eco-cp001-distribution"],
  },
  {
    id: "demand",
    term: "Demand",
    definition: "the quantity of a good or service consumers are willing and able to buy under given conditions",
    compactMeaning: "willingness and ability to buy",
    family: "MARKET",
    examples: ["Consumers want and can afford to buy a particular quantity of rice at a given price."],
    sourceIds: [SYLLABUS],
    sourceFactIds: ["eco-cp001-demand"],
  },
  {
    id: "supply",
    term: "Supply",
    definition: "the quantity of a good or service producers are willing and able to offer for sale under given conditions",
    compactMeaning: "willingness and ability to offer for sale",
    family: "MARKET",
    examples: ["Farmers are prepared to offer a particular quantity of wheat for sale at a given price."],
    sourceIds: [SYLLABUS],
    sourceFactIds: ["eco-cp001-supply"],
  },
  {
    id: "market",
    term: "Market",
    definition: "an arrangement through which buyers and sellers interact for the exchange of goods or services",
    compactMeaning: "interaction of buyers and sellers",
    family: "MARKET",
    examples: ["Buyers and sellers of vegetables interact to exchange produce."],
    sourceIds: [MICRO],
    sourceFactIds: ["eco-cp001-market"],
  },
  {
    id: "microeconomics",
    term: "Microeconomics",
    definition: "the branch of economics that studies individual economic units such as consumers, firms and particular markets",
    compactMeaning: "study of individual consumers, firms and markets",
    family: "BRANCH",
    examples: [
      "Study of how the price of one product affects a firm's output.",
      "Study of the demand for tea in a particular market.",
    ],
    sourceIds: [MICRO, SYLLABUS],
    sourceFactIds: ["eco-cp001-microeconomics"],
  },
  {
    id: "macroeconomics",
    term: "Macroeconomics",
    definition: "the branch of economics that studies the economy as a whole and broad economic aggregates",
    compactMeaning: "study of the economy as a whole",
    family: "BRANCH",
    examples: [
      "Study of economy-wide employment.",
      "Study of overall output in an economy.",
    ],
    sourceIds: [MICRO, SYLLABUS],
    sourceFactIds: ["eco-cp001-macroeconomics"],
  },
  {
    id: "goods",
    term: "Goods",
    definition: "tangible products that can be used to satisfy wants",
    compactMeaning: "tangible products",
    family: "OUTPUT",
    examples: ["A book", "A bicycle", "A bag of rice"],
    sourceIds: [MICRO],
    sourceFactIds: ["eco-cp001-goods"],
  },
  {
    id: "services",
    term: "Services",
    definition: "intangible activities or benefits supplied to satisfy wants",
    compactMeaning: "intangible activities or benefits",
    family: "OUTPUT",
    examples: ["Banking", "Transport", "Teaching"],
    sourceIds: [MICRO],
    sourceFactIds: ["eco-cp001-services"],
  },
]);

export const ECO_CP001_FACTOR_ROWS_V1: readonly EcoCp001FactorRow[] = Object.freeze([
  {
    id: "land",
    factor: "Land",
    meaning: "natural resources used in production, including land, water, forests and minerals",
    reward: "Rent",
    examples: ["farmland", "a mineral deposit", "water used for production", "a forest resource"],
    sourceIds: [FACTORS],
    sourceFactIds: ["eco-cp001-factor-land", "eco-cp001-reward-rent"],
  },
  {
    id: "labour",
    factor: "Labour",
    meaning: "human physical or mental effort used in production",
    reward: "Wages",
    examples: ["a carpenter's work", "a teacher's work", "a factory worker's effort", "a doctor's work"],
    sourceIds: [FACTORS],
    sourceFactIds: ["eco-cp001-factor-labour", "eco-cp001-reward-wages"],
  },
  {
    id: "capital",
    factor: "Capital",
    meaning: "man-made resources such as tools, machines and equipment used to produce other goods and services",
    reward: "Interest",
    examples: ["a tractor used on a farm", "a factory machine", "production tools", "business equipment"],
    sourceIds: [FACTORS],
    sourceFactIds: ["eco-cp001-factor-capital", "eco-cp001-reward-interest"],
  },
  {
    id: "entrepreneurship",
    factor: "Entrepreneurship",
    meaning: "the function of organising other factors of production, making decisions and bearing business risk",
    reward: "Profit",
    examples: ["a person who organises a new factory and bears its business risk", "a founder who combines land, labour and capital for production"],
    sourceIds: [FACTORS],
    sourceFactIds: ["eco-cp001-factor-entrepreneurship", "eco-cp001-reward-profit"],
  },
]);

export const ECO_CP001_ACTIVITY_ROWS_V1 = Object.freeze([
  {
    id: "bakery-production",
    stem: "A bakery converts flour into bread for sale.",
    answer: "Production",
    explanation: "The bakery is creating a good, so the activity is production.",
    sourceIds: [MICRO, SYLLABUS],
    sourceFactIds: ["eco-cp001-production"],
  },
  {
    id: "bus-consumption",
    stem: "A passenger uses a bus service to travel to work.",
    answer: "Consumption",
    explanation: "The passenger is using a service to satisfy a need, so this is consumption.",
    sourceIds: [MICRO],
    sourceFactIds: ["eco-cp001-consumption"],
  },
  {
    id: "factory-output-allocation",
    stem: "Income generated by production is shared among the factors that helped produce the output.",
    answer: "Distribution",
    explanation: "This concerns how the results of production are allocated, which is distribution.",
    sourceIds: [MICRO],
    sourceFactIds: ["eco-cp001-distribution"],
  },
]);

export const ECO_CP001_BRANCH_SCENARIOS_V1 = Object.freeze([
  {
    id: "tea-demand",
    stem: "A study examines how a rise in the price of tea affects the quantity of tea bought by consumers.",
    answer: "Microeconomics",
    sourceIds: [MICRO, SYLLABUS],
    sourceFactIds: ["eco-cp001-microeconomics", "eco-cp001-demand"],
  },
  {
    id: "firm-output",
    stem: "A study examines how one firm's production decision changes when its costs rise.",
    answer: "Microeconomics",
    sourceIds: [MICRO, SYLLABUS],
    sourceFactIds: ["eco-cp001-microeconomics"],
  },
  {
    id: "economy-employment",
    stem: "A study examines the level of employment in the economy as a whole.",
    answer: "Macroeconomics",
    sourceIds: [MICRO, SYLLABUS],
    sourceFactIds: ["eco-cp001-macroeconomics"],
  },
  {
    id: "overall-output",
    stem: "A study examines changes in total output across the entire economy.",
    answer: "Macroeconomics",
    sourceIds: [MICRO, SYLLABUS],
    sourceFactIds: ["eco-cp001-macroeconomics"],
  },
]);
