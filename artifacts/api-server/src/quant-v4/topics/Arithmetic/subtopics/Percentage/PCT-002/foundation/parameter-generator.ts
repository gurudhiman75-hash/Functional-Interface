import {
  getAnswerType,
  getCommonQuestionLanguageIds,
  getQuestionLanguageIds,
  getExplanationId,
  getQuestionEntry,
  getRequiredVariables,
  getTaskKind,
} from "./library";
import { stableBucket } from "./math";
import {
  PCT_002_ARCHETYPE_ID,
  PCT_002_CP_IDS,
  type Pct002CanonicalProblemId,
  type Pct002DifficultyBand,
  type Pct002Language,
  type Pct002Parameters,
  type Pct002Variables,
} from "./types";

export interface Pct002ParameterInput {
  seed?: string;
  language?: Pct002Language;
  questionLanguageId?: string;
  difficultyBand?: Pct002DifficultyBand;
}

type ScenarioFactory = (difficulty: Pct002DifficultyBand, seed: string) => Pct002Variables;

const NON_ENGLISH_LOCALIZED_PILOT_QL_IDS = [
  "PCT-QL-001",
  "PCT-QL-002",
  "PCT-QL-003",
  "PCT-QL-004",
] as const;

const NON_ENGLISH_LOCALIZED_PILOT_QL_ID_SET = new Set<string>(
  NON_ENGLISH_LOCALIZED_PILOT_QL_IDS,
);

const PILOT_LABEL_LOCALIZATIONS: Partial<
  Record<Pct002Language, Record<string, Partial<Pct002Variables>>>
> = {
  hi: {
    "PCT-QL-001": { wholeLabel: "विद्यार्थी", partLabel: "लड़कियां" },
    "PCT-QL-002": { wholeLabel: "मासिक आय", partLabel: "बचत" },
  },
  pa: {
    "PCT-QL-001": { wholeLabel: "ਵਿਦਿਆਰਥੀ", partLabel: "ਲੜਕੀਆਂ" },
    "PCT-QL-002": { wholeLabel: "ਮਾਸਿਕ ਆਮਦਨ", partLabel: "ਬਚਤ" },
  },
};

const SAFE_PILOT_LABEL_LOCALIZATIONS: Partial<
  Record<Pct002Language, Record<string, Partial<Pct002Variables>>>
> = {
  hi: {
    "PCT-QL-001": {
      wholeLabel: "\u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940",
      partLabel: "\u0932\u095c\u0915\u093f\u092f\u093e\u0901",
    },
    "PCT-QL-002": {
      wholeLabel: "\u092e\u093e\u0938\u093f\u0915 \u0906\u092f",
      partLabel: "\u092c\u091a\u0924",
    },
    "PCT-QL-003": {
      wholeLabel: "\u0906\u092f",
      partLabel: "\u0906\u092f",
      targetLabel: "\u0930\u093e\u0936\u093f",
    },
    "PCT-QL-004": {
      wholeLabel: "\u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940",
      partLabel: "\u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940",
      targetLabel: "\u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940",
    },
  },
  pa: {
    "PCT-QL-001": {
      wholeLabel: "\u0a35\u0a3f\u0a26\u0a3f\u0a06\u0a30\u0a25\u0a40",
      partLabel: "\u0a32\u0a5c\u0a15\u0a40\u0a06\u0a02",
    },
    "PCT-QL-002": {
      wholeLabel: "\u0a2e\u0a3e\u0a38\u0a3f\u0a15 \u0a06\u0a2e\u0a26\u0a28",
      partLabel: "\u0a2c\u0a1a\u0a24",
    },
    "PCT-QL-003": {
      wholeLabel: "\u0a06\u0a2e\u0a26\u0a28",
      partLabel: "\u0a06\u0a2e\u0a26\u0a28",
      targetLabel: "\u0a30\u0a15\u0a2e",
    },
    "PCT-QL-004": {
      wholeLabel: "\u0a35\u0a3f\u0a26\u0a3f\u0a06\u0a30\u0a25\u0a40",
      partLabel: "\u0a35\u0a3f\u0a26\u0a3f\u0a06\u0a30\u0a25\u0a40",
      targetLabel: "\u0a35\u0a3f\u0a26\u0a3f\u0a06\u0a30\u0a25\u0a40",
    },
  },
};

function pick<T>(items: readonly T[], seed: string): T {
  return items[stableBucket(seed, items.length)]!;
}

function percentBase(seed: string, rates: readonly number[], totals: readonly number[]) {
  const rate = pick(rates, `${seed}:rate`);
  const total = pick(totals, `${seed}:total`);
  return { rate, total };
}

export function getSelectableQuestionLanguageIds(cpId: Pct002CanonicalProblemId, language: Pct002Language) {
  if (language === "en") {
    return getQuestionLanguageIds(cpId, "en");
  }

  return getCommonQuestionLanguageIds(cpId).filter((qlId) =>
    NON_ENGLISH_LOCALIZED_PILOT_QL_ID_SET.has(qlId),
  );
}

function assignDifficulty(cpId: Pct002CanonicalProblemId, language: Pct002Language, seed: string): Pct002DifficultyBand {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const qlId = qlIds[stableBucket(seed, qlIds.length)]!;
  return getQuestionEntry(cpId, qlId, language).difficulty;
}

const SCENARIO_BUILDERS: Record<string, ScenarioFactory> = {
  "PCT-QL-001": (_difficulty, seed) => {
    const { rate, total } = percentBase(seed, [20, 25, 30, 40, 45], [400, 600, 720, 800, 900, 1200]);
    return { knownRate: rate, wholeValue: total, knownValue: (total * rate) / 100, wholeLabel: "students", partLabel: "girls" };
  },
  "PCT-QL-002": (_difficulty, seed) => {
    const { rate, total } = percentBase(seed, [10, 15, 20, 25], [20000, 24000, 30000, 36000, 40000, 48000]);
    return { knownRate: rate, wholeValue: total, knownValue: (total * rate) / 100, wholeLabel: "monthly income", partLabel: "savings", valuePrefix: "Rs. " };
  },
  "PCT-QL-003": (_difficulty, seed) => {
    const wholeValue = pick([20000, 25000, 30000, 36000, 40000, 50000], `${seed}:whole`);
    const knownRate = pick([20, 25, 30, 40], `${seed}:knownRate`);
    const targetRate = pick([50, 55, 60, 65, 70], `${seed}:targetRate`);
    return { knownRate, targetRate, wholeValue, knownValue: (wholeValue * knownRate) / 100, wholeLabel: "income", partLabel: "income", targetLabel: "expenditure", valuePrefix: "Rs. " };
  },
  "PCT-QL-004": (_difficulty, seed) => {
    const wholeValue = pick([280, 320, 400, 560, 700, 840], `${seed}:whole`);
    const knownRate = pick([20, 25, 35, 40], `${seed}:knownRate`);
    const targetRate = pick([45, 50, 60, 75], `${seed}:targetRate`);
    return { knownRate, targetRate, wholeValue, knownValue: (wholeValue * knownRate) / 100, wholeLabel: "students", partLabel: "students", targetLabel: "students" };
  },
  "PCT-QL-005": (_difficulty, seed) => {
    const wholeValue = pick([240, 360, 480, 600, 720], `${seed}:whole`);
    const partRate = pick([20, 25, 30, 35, 40], `${seed}:rate`);
    return { wholeValue, partValue: (wholeValue * partRate) / 100, partLabel: "girls", wholeLabel: "students" };
  },
  "PCT-QL-006": (_difficulty, seed) => {
    const wholeValue = pick([20000, 30000, 36000, 40000, 48000], `${seed}:whole`);
    const partRate = pick([10, 15, 20, 25, 30], `${seed}:rate`);
    return { wholeValue, partValue: (wholeValue * partRate) / 100, partLabel: "savings", wholeLabel: "income", valuePrefix: "Rs. " };
  },
  "PCT-QL-007": (_difficulty, seed) => {
    const knownRate = pick([25, 30, 40, 45, 50], `${seed}:knownRate`);
    const totalValue = pick([4000, 5000, 6000, 8000, 10000], `${seed}:total`);
    const targetRate = pick([15, 20, 25, 30, 35], `${seed}:targetRate`);
    return { knownRate, totalValue, knownValue: (totalValue * knownRate) / 100, targetValue: (totalValue * targetRate) / 100, wholeLabel: "salary", partLabel: "rent", targetLabel: "books", valuePrefix: "Rs. " };
  },
  "PCT-QL-008": (_difficulty, seed) => {
    const knownRate = pick([20, 25, 30, 40], `${seed}:knownRate`);
    const totalValue = pick([300, 400, 500, 600, 800], `${seed}:total`);
    const targetRate = pick([10, 15, 20, 35, 50], `${seed}:targetRate`);
    return { knownRate, totalValue, knownValue: (totalValue * knownRate) / 100, targetValue: (totalValue * targetRate) / 100, wholeLabel: "books", partLabel: "reference books", targetLabel: "story books" };
  },
  "PCT-QL-009": (_difficulty, seed) => {
    const partA = pick([1, 2, 3, 4, 5], `${seed}:a`);
    const partB = pick([1, 2, 3, 4, 5], `${seed}:b`);
    return { partA, partB, targetPartLabel: "first part", targetPartIndex: 1 };
  },
  "PCT-QL-010": (_difficulty, seed) => {
    const partA = pick([1, 2, 3, 4, 5], `${seed}:a`);
    const partB = pick([1, 2, 3, 4, 5], `${seed}:b`);
    return { partA, partB, targetPartLabel: "second part", targetPartIndex: 2 };
  },
  "PCT-QL-011": (_difficulty, seed) => {
    return { knownRate: pick([20, 25, 30, 40, 45], `${seed}:rate`), partLabel: "girls", complementLabel: "boys" };
  },
  "PCT-QL-012": (_difficulty, seed) => {
    return { knownRate: pick([10, 15, 18, 20, 25], `${seed}:rate`), partLabel: "savings", complementLabel: "expenditure" };
  },
  "PCT-QL-013": (_difficulty, seed) => {
    return { rate1: pick([35, 40, 45, 50], `${seed}:rate1`), rate2: pick([15, 20, 25, 30], `${seed}:rate2`), partLabel: "boys", otherLabel: "girls" };
  },
  "PCT-QL-014": (_difficulty, seed) => {
    return { rate1: pick([30, 35, 40, 45], `${seed}:rate1`), rate2: pick([10, 15, 20, 25], `${seed}:rate2`), partLabel: "food expenses", otherLabel: "transport expenses" };
  },
  "PCT-QL-015": (_difficulty, seed) => {
    const totalValue = pick([400, 600, 800, 1000, 1200], `${seed}:total`);
    const targetRate = pick([25, 35, 40], `${seed}:targetRate`);
    const otherRate = pick([20, 30, 35], `${seed}:otherRate`);
    const thirdRate = 100 - targetRate - otherRate;
    return { totalValue, targetRate, otherRate, thirdRate, wholeLabel: "students", targetLabel: "girls", otherLabel: "boys", thirdLabel: "other students" };
  },
  "PCT-QL-016": (_difficulty, seed) => {
    const totalValue = pick([12000, 16000, 20000, 24000, 30000], `${seed}:total`);
    const targetRate = pick([25, 30, 35], `${seed}:targetRate`);
    const otherRate = pick([20, 25, 30], `${seed}:otherRate`);
    const thirdRate = 100 - targetRate - otherRate;
    return { totalValue, targetRate, otherRate, thirdRate, wholeLabel: "monthly expenses", targetLabel: "rent", otherLabel: "food", thirdLabel: "transport", valuePrefix: "Rs. " };
  },
  "PCT-QL-017": (_difficulty, seed) => {
    const rate1 = pick([25, 30, 35], `${seed}:rate1`);
    const rate2 = pick([15, 20, 25], `${seed}:rate2`);
    const rate3 = pick([10, 15, 20], `${seed}:rate3`);
    return { rate1, rate2, rate3, partLabel: "food", otherLabel: "rent", thirdLabel: "transport", complementLabel: "remaining" };
  },
  "PCT-QL-018": (_difficulty, seed) => {
    const rate1 = pick([20, 25, 30], `${seed}:rate1`);
    const rate2 = pick([15, 20, 25], `${seed}:rate2`);
    const rate3 = pick([10, 15, 20], `${seed}:rate3`);
    return { rate1, rate2, rate3, partLabel: "marketing", otherLabel: "salaries", thirdLabel: "rent", complementLabel: "other expenses" };
  },
  "PCT-QL-019": (_difficulty, seed) => {
    const totalValue = pick([4000, 5000, 6000, 8000, 10000], `${seed}:total`);
    const rateMale = pick([35, 40, 45], `${seed}:male`);
    const rateFemale = pick([30, 35, 40], `${seed}:female`);
    const rateChildren = 100 - rateMale - rateFemale;
    return { totalValue, targetRate: rateChildren, rate1: rateMale, rate2: rateFemale, wholeLabel: "population", targetLabel: "children", otherLabel: "males", thirdLabel: "females" };
  },
  "PCT-QL-020": (_difficulty, seed) => {
    const totalValue = pick([20000, 24000, 30000, 36000, 40000], `${seed}:total`);
    const rateFood = pick([25, 30, 35], `${seed}:food`);
    const rateRent = pick([20, 25, 30], `${seed}:rent`);
    const rateTransport = pick([10, 15, 20], `${seed}:transport`);
    const rateEducation = 100 - rateFood - rateRent - rateTransport;
    return { totalValue, targetRate: rateEducation, rate1: rateFood, rate2: rateRent, rate3: rateTransport, wholeLabel: "monthly expenses", targetLabel: "education", otherLabel: "food", thirdLabel: "rent", fourthLabel: "transport", valuePrefix: "Rs. " };
  },
};

const SCENARIO_ALIASES: Record<string, string> = Object.fromEntries(
  [
    ["021", "001"], ["022", "001"], ["023", "001"], ["024", "003"], ["025", "004"], ["026", "004"],
    ["027", "005"], ["028", "005"], ["029", "005"], ["030", "007"], ["031", "008"], ["032", "008"],
    ["033", "009"], ["034", "010"], ["035", "009"], ["036", "011"], ["037", "012"], ["038", "011"],
    ["039", "013"], ["040", "014"], ["041", "014"], ["042", "015"], ["043", "015"], ["044", "015"],
    ["045", "017"], ["046", "018"], ["047", "017"], ["048", "019"], ["049", "019"], ["050", "020"],
    ["051", "001"], ["052", "001"], ["053", "001"], ["054", "001"], ["055", "001"], ["056", "001"], ["057", "001"], ["058", "001"], ["059", "001"], ["060", "001"],
    ["061", "003"], ["062", "004"], ["063", "004"], ["064", "004"], ["065", "004"], ["066", "003"], ["067", "004"], ["068", "004"], ["069", "004"], ["070", "004"],
    ["071", "005"], ["072", "005"], ["073", "005"], ["074", "005"], ["075", "005"], ["076", "005"], ["077", "005"], ["078", "005"], ["079", "005"], ["080", "005"],
    ["081", "007"], ["082", "008"], ["083", "008"], ["084", "008"], ["085", "007"], ["086", "007"], ["087", "008"], ["088", "008"], ["089", "007"], ["090", "008"],
    ["091", "009"], ["092", "009"], ["093", "009"], ["094", "009"], ["095", "009"], ["096", "009"], ["097", "009"], ["098", "009"], ["099", "009"], ["100", "009"],
    ["101", "011"], ["102", "011"], ["103", "011"], ["104", "011"], ["105", "011"], ["106", "011"], ["107", "011"], ["108", "011"], ["109", "011"], ["110", "011"],
    ["111", "013"], ["112", "013"], ["113", "013"], ["114", "013"], ["115", "013"], ["116", "013"], ["117", "013"], ["118", "013"], ["119", "013"], ["120", "013"],
    ["121", "016"], ["122", "015"], ["123", "015"], ["124", "015"], ["125", "015"], ["126", "015"], ["127", "015"], ["128", "015"], ["129", "016"], ["130", "015"],
    ["131", "017"], ["132", "017"], ["133", "017"], ["134", "017"], ["135", "017"], ["136", "017"], ["137", "017"], ["138", "017"], ["139", "017"], ["140", "017"],
    ["141", "019"], ["142", "019"], ["143", "019"], ["144", "019"], ["145", "020"], ["146", "019"], ["147", "019"], ["148", "019"], ["149", "019"], ["150", "020"],
  ].map(([alias, base]) => [`PCT-QL-${alias}`, `PCT-QL-${base}`]),
);

const SCENARIO_VARIABLE_OVERRIDES: Record<string, Partial<Pct002Variables>> = {
  "PCT-QL-051": { wholeLabel: "respondents", partLabel: "Option A" },
  "PCT-QL-052": { wholeLabel: "items", partLabel: "damaged" },
  "PCT-QL-053": { wholeLabel: "students", partLabel: "present" },
  "PCT-QL-054": { wholeLabel: "passengers", partLabel: "sleeper class" },
  "PCT-QL-055": { wholeLabel: "applicants", partLabel: "approved" },
  "PCT-QL-056": { wholeLabel: "patients", partLabel: "recovered" },
  "PCT-QL-057": { wholeLabel: "valid votes", partLabel: "votes" },
  "PCT-QL-058": { wholeLabel: "crop sacks", partLabel: "sacks" },
  "PCT-QL-059": { wholeLabel: "employees", partLabel: "the accounts department" },
  "PCT-QL-060": { wholeLabel: "invoices", partLabel: "paid" },
  "PCT-QL-026": { wholeLabel: "output", targetLabel: "amount" },
  "PCT-QL-061": { wholeLabel: "payroll", targetLabel: "value" },
  "PCT-QL-062": { wholeLabel: "enrolment", targetLabel: "number" },
  "PCT-QL-063": { wholeLabel: "stock", targetLabel: "quantity" },
  "PCT-QL-064": { wholeLabel: "usage", targetLabel: "amount" },
  "PCT-QL-065": { wholeLabel: "rainfall collection", targetLabel: "amount" },
  "PCT-QL-066": { wholeLabel: "budget", targetLabel: "value" },
  "PCT-QL-067": { wholeLabel: "target output", targetLabel: "quantity" },
  "PCT-QL-068": { wholeLabel: "passenger count", targetLabel: "number" },
  "PCT-QL-069": { wholeLabel: "vote count", targetLabel: "votes" },
  "PCT-QL-070": { wholeLabel: "bed strength", targetLabel: "beds" },
  "PCT-QL-071": { wholeLabel: "units", partLabel: "defective" },
  "PCT-QL-072": { wholeLabel: "students", partLabel: "present" },
  "PCT-QL-073": { wholeLabel: "seats", partLabel: "booked" },
  "PCT-QL-074": { wholeLabel: "invoices", partLabel: "paid" },
  "PCT-QL-075": { wholeLabel: "sacks", partLabel: "spoiled" },
  "PCT-QL-076": { wholeLabel: "patients", partLabel: "recovered" },
  "PCT-QL-077": { wholeLabel: "votes", partLabel: "valid" },
  "PCT-QL-078": { wholeLabel: "applicants", partLabel: "selected" },
  "PCT-QL-079": { wholeLabel: "items", partLabel: "dispatched" },
  "PCT-QL-080": { wholeLabel: "forms", partLabel: "completed" },
  "PCT-QL-081": { wholeLabel: "electricity bill" },
  "PCT-QL-082": { wholeLabel: "stock" },
  "PCT-QL-083": { wholeLabel: "admission count" },
  "PCT-QL-084": { wholeLabel: "votes" },
  "PCT-QL-085": { wholeLabel: "fee collection" },
  "PCT-QL-086": { wholeLabel: "crop purchase bill" },
  "PCT-QL-087": { wholeLabel: "production batch" },
  "PCT-QL-088": { wholeLabel: "booking total" },
  "PCT-QL-089": { wholeLabel: "monthly budget" },
  "PCT-QL-090": { wholeLabel: "attendance" },
  "PCT-QL-091": { targetPartLabel: "boys", targetPartIndex: 1 },
  "PCT-QL-092": { targetPartLabel: "passed candidates", targetPartIndex: 1 },
  "PCT-QL-093": { targetPartLabel: "wheat bags", targetPartIndex: 1 },
  "PCT-QL-094": { targetPartLabel: "rural population", targetPartIndex: 1 },
  "PCT-QL-095": { targetPartLabel: "online applicants", targetPartIndex: 1 },
  "PCT-QL-096": { targetPartLabel: "first candidate", targetPartIndex: 1 },
  "PCT-QL-097": { targetPartLabel: "wheat crop", targetPartIndex: 1 },
  "PCT-QL-098": { targetPartLabel: "food allocation", targetPartIndex: 1 },
  "PCT-QL-099": { targetPartLabel: "male employees", targetPartIndex: 1 },
  "PCT-QL-100": { targetPartLabel: "booked seats", targetPartIndex: 1 },
  "PCT-QL-101": { partLabel: "present", complementLabel: "absent" },
  "PCT-QL-102": { partLabel: "sold", complementLabel: "unsold" },
  "PCT-QL-103": { partLabel: "recovered", complementLabel: "not recovered" },
  "PCT-QL-104": { partLabel: "used", complementLabel: "remaining" },
  "PCT-QL-105": { partLabel: "passed", complementLabel: "failed" },
  "PCT-QL-106": { partLabel: "booked", complementLabel: "vacant" },
  "PCT-QL-107": { partLabel: "valid", complementLabel: "invalid" },
  "PCT-QL-108": { partLabel: "completed", complementLabel: "pending" },
  "PCT-QL-109": { partLabel: "selected", complementLabel: "rejected" },
  "PCT-QL-110": { partLabel: "delivered", complementLabel: "undelivered" },
  "PCT-QL-111": { partLabel: "Candidate A", otherLabel: "Candidate B" },
  "PCT-QL-112": { partLabel: "food", otherLabel: "transport" },
  "PCT-QL-113": { partLabel: "wheat", otherLabel: "paddy" },
  "PCT-QL-114": { partLabel: "general wards", otherLabel: "ICU wards" },
  "PCT-QL-115": { partLabel: "Grade A units", otherLabel: "Grade B units" },
  "PCT-QL-116": { partLabel: "passed", otherLabel: "failed" },
  "PCT-QL-117": { partLabel: "daily commuters", otherLabel: "students" },
  "PCT-QL-118": { partLabel: "Yes", otherLabel: "No" },
  "PCT-QL-119": { partLabel: "ready stock", otherLabel: "reserved stock" },
  "PCT-QL-120": { partLabel: "the sales department", otherLabel: "the accounts department" },
  "PCT-QL-121": { wholeLabel: "department budget", targetLabel: "training", otherLabel: "salaries", thirdLabel: "maintenance" },
  "PCT-QL-122": { wholeLabel: "students", targetLabel: "girls", otherLabel: "boys", thirdLabel: "primary-section students" },
  "PCT-QL-123": { wholeLabel: "items", targetLabel: "ready items", otherLabel: "damaged items", thirdLabel: "reserved items" },
  "PCT-QL-124": { wholeLabel: "passengers", targetLabel: "daily-pass holders", otherLabel: "students", thirdLabel: "senior citizens" },
  "PCT-QL-125": { wholeLabel: "votes", targetLabel: "Candidate A", otherLabel: "Candidate B", thirdLabel: "Candidate C" },
  "PCT-QL-126": { wholeLabel: "units", targetLabel: "Grade A units", otherLabel: "Grade B units", thirdLabel: "Grade C units" },
  "PCT-QL-127": { wholeLabel: "patients", targetLabel: "surgical cases", otherLabel: "medical cases", thirdLabel: "maternity cases" },
  "PCT-QL-128": { wholeLabel: "land", targetLabel: "wheat", otherLabel: "paddy", thirdLabel: "maize" },
  "PCT-QL-129": { wholeLabel: "monthly expense budget", targetLabel: "rent", otherLabel: "food", thirdLabel: "transport" },
  "PCT-QL-130": { wholeLabel: "respondents", targetLabel: "satisfied respondents", otherLabel: "dissatisfied respondents", thirdLabel: "neutral respondents" },
  "PCT-QL-131": { partLabel: "Option A", otherLabel: "Option B", thirdLabel: "Option C", complementLabel: "other responses" },
  "PCT-QL-132": { partLabel: "Candidate A", otherLabel: "Candidate B", thirdLabel: "Candidate C", complementLabel: "other candidates" },
  "PCT-QL-133": { partLabel: "passed", otherLabel: "failed", thirdLabel: "absent", complementLabel: "compartment cases" },
  "PCT-QL-134": { partLabel: "wheat", otherLabel: "paddy", thirdLabel: "maize", complementLabel: "pulses" },
  "PCT-QL-135": { partLabel: "recovered", otherLabel: "referred", thirdLabel: "under observation", complementLabel: "critical cases" },
  "PCT-QL-136": { partLabel: "food", otherLabel: "rent", thirdLabel: "transport", complementLabel: "savings" },
  "PCT-QL-137": { partLabel: "Grade A units", otherLabel: "Grade B units", thirdLabel: "Grade C units", complementLabel: "rejected units" },
  "PCT-QL-138": { partLabel: "daily commuters", otherLabel: "students", thirdLabel: "senior citizens", complementLabel: "other passengers" },
  "PCT-QL-139": { partLabel: "ready stock", otherLabel: "reserved stock", thirdLabel: "damaged stock", complementLabel: "balance stock" },
  "PCT-QL-140": { partLabel: "approved", otherLabel: "rejected", thirdLabel: "pending", complementLabel: "under review" },
  "PCT-QL-141": { wholeLabel: "people", targetLabel: "children", otherLabel: "men", thirdLabel: "women" },
  "PCT-QL-142": { wholeLabel: "items", targetLabel: "spare parts", otherLabel: "raw materials", thirdLabel: "finished goods" },
  "PCT-QL-143": { wholeLabel: "passengers", targetLabel: "senior citizens", otherLabel: "daily commuters", thirdLabel: "students" },
  "PCT-QL-144": { wholeLabel: "students", targetLabel: "hostellers", otherLabel: "boys", thirdLabel: "girls" },
  "PCT-QL-145": { wholeLabel: "monthly budget", targetLabel: "education", otherLabel: "food", thirdLabel: "rent", fourthLabel: "transport" },
  "PCT-QL-146": { wholeLabel: "units", targetLabel: "Grade C units", otherLabel: "Grade A units", thirdLabel: "Grade B units" },
  "PCT-QL-147": { wholeLabel: "patients", targetLabel: "maternity cases", otherLabel: "general-ward patients", thirdLabel: "ICU patients" },
  "PCT-QL-148": { wholeLabel: "bags", targetLabel: "maize bags", otherLabel: "wheat bags", thirdLabel: "rice bags" },
  "PCT-QL-149": { wholeLabel: "respondents", targetLabel: "neutral respondents", otherLabel: "satisfied respondents", thirdLabel: "dissatisfied respondents" },
  "PCT-QL-150": { wholeLabel: "parcels", targetLabel: "national parcels", otherLabel: "local parcels", thirdLabel: "regional parcels", fourthLabel: "express parcels" },
};

function createVariables(questionLanguageId: string, difficultyBand: Pct002DifficultyBand, seed: string) {
  const builderId = SCENARIO_ALIASES[questionLanguageId] ?? questionLanguageId;
  const builder = SCENARIO_BUILDERS[builderId];
  if (!builder) throw new Error(`Missing scenario builder for ${questionLanguageId}`);
  return {
    ...builder(difficultyBand, seed),
    ...(SCENARIO_VARIABLE_OVERRIDES[questionLanguageId] ?? {}),
  };
}

function localizeVariables(
  language: Pct002Language,
  questionLanguageId: string,
  variables: Pct002Variables,
) {
  const localizedOverrides =
    SAFE_PILOT_LABEL_LOCALIZATIONS[language]?.[questionLanguageId] ??
    PILOT_LABEL_LOCALIZATIONS[language]?.[questionLanguageId];
  if (!localizedOverrides) {
    return variables;
  }

  return {
    ...variables,
    ...localizedOverrides,
  };
}

export function selectQuestionLanguageId(
  cpId: Pct002CanonicalProblemId,
  language: Pct002Language,
  seed: string,
  difficultyBand?: Pct002DifficultyBand,
) {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const filtered = difficultyBand
    ? qlIds.filter((qlId) => getQuestionEntry(cpId, qlId, language).difficulty === difficultyBand)
    : qlIds;
  const source = filtered.length > 0 ? filtered : qlIds;
  return source[stableBucket(seed, source.length)]!;
}

export function generatePct002Parameters(cpId: Pct002CanonicalProblemId, input: Pct002ParameterInput = {}): Pct002Parameters {
  const seed = input.seed ?? `PCT-002:${cpId}`;
  const language = input.language ?? "en";
  const difficultyBand = input.difficultyBand ?? assignDifficulty(cpId, language, seed);
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(cpId, language, seed, difficultyBand);

  if (language !== "en" && !NON_ENGLISH_LOCALIZED_PILOT_QL_ID_SET.has(questionLanguageId)) {
    throw new Error(
      `Question language ${questionLanguageId} is not localized for ${language} in PCT-002.`,
    );
  }

  const questionEntry = getQuestionEntry(cpId, questionLanguageId, language);
  const resolvedDifficulty = questionEntry.difficulty;
  const taskKind = getTaskKind(cpId, questionLanguageId);
  const answerType = getAnswerType(cpId, questionLanguageId);
  const requiredVariables = getRequiredVariables(cpId, questionLanguageId);
  const variables = localizeVariables(
    language,
    questionLanguageId,
    createVariables(questionLanguageId, resolvedDifficulty, seed),
  );

  for (const requiredVariable of requiredVariables) {
    if (!Object.hasOwn(variables, requiredVariable)) {
      throw new Error(`Missing required variable ${requiredVariable} for ${questionLanguageId}`);
    }
  }

  return {
    archetypeId: PCT_002_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${questionLanguageId}:${seed}`,
    questionLanguageId,
    explanationId: getExplanationId(cpId),
    language,
    difficultyBand: resolvedDifficulty,
    taskKind,
    answerType,
    requiredVariables,
    variables,
    sourceTrace: {
      questionLanguageSource: `question-language.${language}.json`,
      explanationSource: `explanation.${language}.json`,
      variableRangeSource: "variable-ranges.library.json",
    },
  };
}

export function getPct002ActiveCanonicalProblemIds() {
  return [...PCT_002_CP_IDS] as Pct002CanonicalProblemId[];
}

export function pickPct002CanonicalProblemId(seed: string) {
  return PCT_002_CP_IDS[stableBucket(seed, PCT_002_CP_IDS.length)]!;
}
