import {
  getAnswerType,
  getCommonQuestionLanguageIds,
  getQuestionLanguageIds,
  getExplanationId,
  getQuestionEntry,
  getRequiredVariables,
  getTaskKind,
} from "./library";
import type { EntityReference } from "../../../../../../common/entity-types";
import {
  getLocalizedQuestionLanguageIds,
  isQlLocalized,
  resolveEntityLabels,
} from "../../../../../../common/language-coverage";
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
type LabelField =
  | "wholeLabel"
  | "partLabel"
  | "targetLabel"
  | "complementLabel"
  | "otherLabel"
  | "thirdLabel"
  | "fourthLabel"
  | "targetPartLabel";

const LABEL_FIELDS = [
  "wholeLabel",
  "partLabel",
  "targetLabel",
  "complementLabel",
  "otherLabel",
  "thirdLabel",
  "fourthLabel",
  "targetPartLabel",
] as const satisfies readonly LabelField[];
const LABEL_FIELD_SET = new Set<string>(LABEL_FIELDS);

function pick<T>(items: readonly T[], seed: string): T {
  return items[stableBucket(seed, items.length)]!;
}

function entityRef(categoryId: EntityReference["categoryId"], entityId: string): EntityReference {
  return { categoryId, entityId };
}

function normalizeResolvedLabel(value: string, language: Pct002Language) {
  return language === "en" ? value.toLowerCase() : value;
}

function percentBase(seed: string, rates: readonly number[], totals: readonly number[]) {
  const rate = pick(rates, `${seed}:rate`);
  const total = pick(totals, `${seed}:total`);
  return { rate, total };
}

export function getSelectableQuestionLanguageIds(cpId: Pct002CanonicalProblemId, language: Pct002Language) {
  const englishIds =
    language === "en" ? getQuestionLanguageIds(cpId, "en") : getCommonQuestionLanguageIds(cpId);
  return getLocalizedQuestionLanguageIds("PCT-002", language, englishIds);
}

function assignDifficulty(cpId: Pct002CanonicalProblemId, language: Pct002Language, seed: string): Pct002DifficultyBand {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const qlId = qlIds[stableBucket(seed, qlIds.length)]!;
  return getQuestionEntry(cpId, qlId, language).difficulty;
}

const SCENARIO_BUILDERS: Record<string, ScenarioFactory> = {
  "PCT-QL-001": (_difficulty, seed) => {
    const { rate, total } = percentBase(seed, [20, 25, 30, 40, 45], [400, 600, 720, 800, 900, 1200]);
    return { knownRate: rate, wholeValue: total, knownValue: (total * rate) / 100, wholeLabel: entityRef("group", "students"), partLabel: entityRef("group", "girls") };
  },
  "PCT-QL-002": (_difficulty, seed) => {
    const { rate, total } = percentBase(seed, [10, 15, 20, 25], [20000, 24000, 30000, 36000, 40000, 48000]);
    return { knownRate: rate, wholeValue: total, knownValue: (total * rate) / 100, wholeLabel: entityRef("financial-concept", "monthly_income"), partLabel: entityRef("financial-concept", "savings"), valuePrefix: "Rs. " };
  },
  "PCT-QL-003": (_difficulty, seed) => {
    const wholeValue = pick([20000, 25000, 30000, 36000, 40000, 50000], `${seed}:whole`);
    const knownRate = pick([20, 25, 30, 40], `${seed}:knownRate`);
    const targetRate = pick([50, 55, 60, 65, 70], `${seed}:targetRate`);
    return { knownRate, targetRate, wholeValue, knownValue: (wholeValue * knownRate) / 100, wholeLabel: entityRef("financial-concept", "income"), partLabel: entityRef("financial-concept", "income"), targetLabel: entityRef("financial-concept", "target_amount"), valuePrefix: "Rs. " };
  },
  "PCT-QL-004": (_difficulty, seed) => {
    const wholeValue = pick([280, 320, 400, 560, 700, 840], `${seed}:whole`);
    const knownRate = pick([20, 25, 35, 40], `${seed}:knownRate`);
    const targetRate = pick([45, 50, 60, 75], `${seed}:targetRate`);
    return { knownRate, targetRate, wholeValue, knownValue: (wholeValue * knownRate) / 100, wholeLabel: entityRef("group", "students"), partLabel: entityRef("group", "students"), targetLabel: entityRef("group", "students") };
  },
  "PCT-QL-005": (_difficulty, seed) => {
    const wholeValue = pick([240, 360, 480, 600, 720], `${seed}:whole`);
    const partRate = pick([20, 25, 30, 35, 40], `${seed}:rate`);
    return { wholeValue, partValue: (wholeValue * partRate) / 100, partLabel: entityRef("group", "girls"), wholeLabel: entityRef("group", "students") };
  },
  "PCT-QL-006": (_difficulty, seed) => {
    const wholeValue = pick([20000, 30000, 36000, 40000, 48000], `${seed}:whole`);
    const partRate = pick([10, 15, 20, 25, 30], `${seed}:rate`);
    return { wholeValue, partValue: (wholeValue * partRate) / 100, partLabel: entityRef("financial-concept", "savings"), wholeLabel: entityRef("financial-concept", "income"), valuePrefix: "Rs. " };
  },
  "PCT-QL-007": (_difficulty, seed) => {
    const knownRate = pick([25, 30, 40, 45, 50], `${seed}:knownRate`);
    const totalValue = pick([4000, 5000, 6000, 8000, 10000], `${seed}:total`);
    const targetRate = pick([15, 20, 25, 30, 35], `${seed}:targetRate`);
    return { knownRate, totalValue, knownValue: (totalValue * knownRate) / 100, targetValue: (totalValue * targetRate) / 100, wholeLabel: entityRef("financial-concept", "salary"), partLabel: entityRef("financial-concept", "rent"), targetLabel: entityRef("object", "books"), valuePrefix: "Rs. " };
  },
  "PCT-QL-008": (_difficulty, seed) => {
    const knownRate = pick([20, 25, 30, 40], `${seed}:knownRate`);
    const totalValue = pick([300, 400, 500, 600, 800], `${seed}:total`);
    const targetRate = pick([10, 15, 20, 35, 50], `${seed}:targetRate`);
    return { knownRate, totalValue, knownValue: (totalValue * knownRate) / 100, targetValue: (totalValue * targetRate) / 100, wholeLabel: entityRef("object", "books"), partLabel: entityRef("object", "reference_books"), targetLabel: entityRef("object", "story_books") };
  },
  "PCT-QL-009": (_difficulty, seed) => {
    const partA = pick([1, 2, 3, 4, 5], `${seed}:a`);
    const partB = pick([1, 2, 3, 4, 5], `${seed}:b`);
    return { partA, partB, targetPartLabel: entityRef("unit", "first_part"), targetPartIndex: 1 };
  },
  "PCT-QL-010": (_difficulty, seed) => {
    const partA = pick([1, 2, 3, 4, 5], `${seed}:a`);
    const partB = pick([1, 2, 3, 4, 5], `${seed}:b`);
    return { partA, partB, targetPartLabel: entityRef("unit", "second_part"), targetPartIndex: 2 };
  },
  "PCT-QL-011": (_difficulty, seed) => {
    return { knownRate: pick([20, 25, 30, 40, 45], `${seed}:rate`), partLabel: entityRef("group", "girls"), complementLabel: entityRef("group", "boys") };
  },
  "PCT-QL-012": (_difficulty, seed) => {
    return { knownRate: pick([10, 15, 18, 20, 25], `${seed}:rate`), partLabel: entityRef("financial-concept", "savings"), complementLabel: entityRef("financial-concept", "expenditure") };
  },
  "PCT-QL-013": (_difficulty, seed) => {
    return { rate1: pick([35, 40, 45, 50], `${seed}:rate1`), rate2: pick([15, 20, 25, 30], `${seed}:rate2`), partLabel: entityRef("group", "boys"), otherLabel: entityRef("group", "girls") };
  },
  "PCT-QL-014": (_difficulty, seed) => {
    return { rate1: pick([30, 35, 40, 45], `${seed}:rate1`), rate2: pick([10, 15, 20, 25], `${seed}:rate2`), partLabel: entityRef("financial-concept", "food_expenses"), otherLabel: entityRef("financial-concept", "transport_expenses") };
  },
  "PCT-QL-015": (_difficulty, seed) => {
    const totalValue = pick([400, 600, 800, 1000, 1200], `${seed}:total`);
    const targetRate = pick([25, 35, 40], `${seed}:targetRate`);
    const otherRate = pick([20, 30, 35], `${seed}:otherRate`);
    const thirdRate = 100 - targetRate - otherRate;
    return { totalValue, targetRate, otherRate, thirdRate, wholeLabel: entityRef("group", "students"), targetLabel: entityRef("group", "girls"), otherLabel: entityRef("group", "boys"), thirdLabel: entityRef("group", "other_students") };
  },
  "PCT-QL-016": (_difficulty, seed) => {
    const totalValue = pick([12000, 16000, 20000, 24000, 30000], `${seed}:total`);
    const targetRate = pick([25, 30, 35], `${seed}:targetRate`);
    const otherRate = pick([20, 25, 30], `${seed}:otherRate`);
    const thirdRate = 100 - targetRate - otherRate;
    return { totalValue, targetRate, otherRate, thirdRate, wholeLabel: entityRef("financial-concept", "monthly_expenses"), targetLabel: entityRef("financial-concept", "rent"), otherLabel: entityRef("financial-concept", "food"), thirdLabel: entityRef("financial-concept", "transport"), valuePrefix: "Rs. " };
  },
  "PCT-QL-017": (_difficulty, seed) => {
    const rate1 = pick([25, 30, 35], `${seed}:rate1`);
    const rate2 = pick([15, 20, 25], `${seed}:rate2`);
    const rate3 = pick([10, 15, 20], `${seed}:rate3`);
    return { rate1, rate2, rate3, partLabel: entityRef("financial-concept", "food"), otherLabel: entityRef("financial-concept", "rent"), thirdLabel: entityRef("financial-concept", "transport"), complementLabel: entityRef("financial-concept", "remaining") };
  },
  "PCT-QL-018": (_difficulty, seed) => {
    const rate1 = pick([20, 25, 30], `${seed}:rate1`);
    const rate2 = pick([15, 20, 25], `${seed}:rate2`);
    const rate3 = pick([10, 15, 20], `${seed}:rate3`);
    return { rate1, rate2, rate3, partLabel: entityRef("financial-concept", "marketing"), otherLabel: entityRef("financial-concept", "salaries"), thirdLabel: entityRef("financial-concept", "rent"), complementLabel: entityRef("financial-concept", "other_expenses") };
  },
  "PCT-QL-019": (_difficulty, seed) => {
    const totalValue = pick([4000, 5000, 6000, 8000, 10000], `${seed}:total`);
    const rateMale = pick([35, 40, 45], `${seed}:male`);
    const rateFemale = pick([30, 35, 40], `${seed}:female`);
    const rateChildren = 100 - rateMale - rateFemale;
    return { totalValue, targetRate: rateChildren, rate1: rateMale, rate2: rateFemale, wholeLabel: entityRef("group", "population"), targetLabel: entityRef("group", "children"), otherLabel: entityRef("group", "males"), thirdLabel: entityRef("group", "females") };
  },
  "PCT-QL-020": (_difficulty, seed) => {
    const totalValue = pick([20000, 24000, 30000, 36000, 40000], `${seed}:total`);
    const rateFood = pick([25, 30, 35], `${seed}:food`);
    const rateRent = pick([20, 25, 30], `${seed}:rent`);
    const rateTransport = pick([10, 15, 20], `${seed}:transport`);
    const rateEducation = 100 - rateFood - rateRent - rateTransport;
    return { totalValue, targetRate: rateEducation, rate1: rateFood, rate2: rateRent, rate3: rateTransport, wholeLabel: entityRef("financial-concept", "monthly_expenses"), targetLabel: entityRef("financial-concept", "education"), otherLabel: entityRef("financial-concept", "food"), thirdLabel: entityRef("financial-concept", "rent"), fourthLabel: entityRef("financial-concept", "transport"), valuePrefix: "Rs. " };
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
  "PCT-QL-022": { wholeLabel: "votes", partLabel: "valid" },
  "PCT-QL-028": { partLabel: "present" },
  "PCT-QL-029": { wholeLabel: "seats", partLabel: "booked" },
  "PCT-QL-035": { targetPartLabel: "first candidate", targetPartIndex: 1 },
  "PCT-QL-037": { partLabel: "used", complementLabel: "remaining" },
  "PCT-QL-038": { partLabel: "sold", complementLabel: "unsold" },
  "PCT-QL-039": { partLabel: "Candidate A", otherLabel: "Candidate B" },
  "PCT-QL-040": { partLabel: "general wards", otherLabel: "ICU wards" },
  "PCT-QL-041": { partLabel: "wheat", otherLabel: "paddy" },
  "PCT-QL-042": { wholeLabel: "respondents", targetLabel: "satisfied respondents", otherLabel: "dissatisfied respondents", thirdLabel: "neutral respondents" },
  "PCT-QL-043": { wholeLabel: "stock", targetLabel: "ready stock", otherLabel: "reserved stock", thirdLabel: "damaged stock" },
  "PCT-QL-044": { wholeLabel: "passengers", targetLabel: "daily-pass holders", otherLabel: "students", thirdLabel: "senior citizens" },
  "PCT-QL-045": { partLabel: "Option A", otherLabel: "Option B", thirdLabel: "Option C", complementLabel: "other responses" },
  "PCT-QL-046": { partLabel: "Candidate A", otherLabel: "Candidate B", thirdLabel: "Candidate C", complementLabel: "other candidates" },
  "PCT-QL-047": { partLabel: "passed", otherLabel: "failed", thirdLabel: "absent", complementLabel: "compartment cases" },
  "PCT-QL-048": { wholeLabel: "people", targetLabel: "children", otherLabel: "men", thirdLabel: "women" },
  "PCT-QL-050": { wholeLabel: "passengers", targetLabel: "other passengers", otherLabel: "daily commuters", thirdLabel: "students", fourthLabel: "senior citizens" },
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

const NON_ENGLISH_LABEL_ENTITY_MAP: Record<
  string,
  { categoryId: EntityReference["categoryId"]; entityId: string }
> = {
  amount: { categoryId: "financial-concept", entityId: "amount" },
  applicants: { categoryId: "unit", entityId: "applicants" },
  approved: { categoryId: "unit", entityId: "approved" },
  "Candidate A": { categoryId: "unit", entityId: "candidate_a" },
  "Candidate B": { categoryId: "unit", entityId: "candidate_b" },
  "Candidate C": { categoryId: "unit", entityId: "candidate_c" },
  "Grade A units": { categoryId: "unit", entityId: "grade_a_units" },
  "Grade B units": { categoryId: "unit", entityId: "grade_b_units" },
  "Grade C units": { categoryId: "unit", entityId: "grade_c_units" },
  "ICU patients": { categoryId: "unit", entityId: "icu_patients" },
  "ICU wards": { categoryId: "unit", entityId: "icu_wards" },
  No: { categoryId: "unit", entityId: "no" },
  "Option A": { categoryId: "unit", entityId: "option_a" },
  "Option B": { categoryId: "unit", entityId: "option_b" },
  "Option C": { categoryId: "unit", entityId: "option_c" },
  Yes: { categoryId: "unit", entityId: "yes" },
  absent: { categoryId: "unit", entityId: "absent" },
  "admission count": { categoryId: "unit", entityId: "admission_count" },
  attendance: { categoryId: "unit", entityId: "attendance" },
  bags: { categoryId: "unit", entityId: "bags" },
  "balance stock": { categoryId: "unit", entityId: "balance_stock" },
  "bed strength": { categoryId: "unit", entityId: "bed_strength" },
  beds: { categoryId: "unit", entityId: "beds" },
  booked: { categoryId: "unit", entityId: "booked" },
  "booked seats": { categoryId: "unit", entityId: "booked_seats" },
  "booking total": { categoryId: "unit", entityId: "booking_total" },
  boys: { categoryId: "group", entityId: "boys" },
  budget: { categoryId: "financial-concept", entityId: "budget" },
  children: { categoryId: "group", entityId: "children" },
  "compartment cases": { categoryId: "unit", entityId: "compartment_cases" },
  completed: { categoryId: "unit", entityId: "completed" },
  "critical cases": { categoryId: "unit", entityId: "critical_cases" },
  "crop purchase bill": { categoryId: "unit", entityId: "crop_purchase_bill" },
  "crop sacks": { categoryId: "unit", entityId: "crop_sacks" },
  "daily commuters": { categoryId: "unit", entityId: "daily_commuters" },
  "daily-pass holders": { categoryId: "unit", entityId: "daily_pass_holders" },
  damaged: { categoryId: "unit", entityId: "damaged" },
  "damaged items": { categoryId: "unit", entityId: "damaged_items" },
  "damaged stock": { categoryId: "unit", entityId: "damaged_stock" },
  defective: { categoryId: "unit", entityId: "defective" },
  delivered: { categoryId: "unit", entityId: "delivered" },
  undelivered: { categoryId: "unit", entityId: "undelivered" },
  "department budget": { categoryId: "unit", entityId: "department_budget" },
  dispatched: { categoryId: "unit", entityId: "dispatched" },
  "dissatisfied respondents": { categoryId: "unit", entityId: "dissatisfied_respondents" },
  education: { categoryId: "financial-concept", entityId: "education" },
  "electricity bill": { categoryId: "unit", entityId: "electricity_bill" },
  employees: { categoryId: "group", entityId: "employees" },
  enrolment: { categoryId: "unit", entityId: "enrolment" },
  "express parcels": { categoryId: "unit", entityId: "express_parcels" },
  failed: { categoryId: "unit", entityId: "failed" },
  "fee collection": { categoryId: "unit", entityId: "fee_collection" },
  "finished goods": { categoryId: "unit", entityId: "finished_goods" },
  "first candidate": { categoryId: "unit", entityId: "first_candidate" },
  food: { categoryId: "financial-concept", entityId: "food" },
  "food allocation": { categoryId: "unit", entityId: "food_allocation" },
  forms: { categoryId: "unit", entityId: "forms" },
  "general wards": { categoryId: "unit", entityId: "general_wards" },
  "general-ward patients": { categoryId: "unit", entityId: "general_ward_patients" },
  girls: { categoryId: "group", entityId: "girls" },
  hostellers: { categoryId: "unit", entityId: "hostellers" },
  invalid: { categoryId: "unit", entityId: "invalid" },
  invoices: { categoryId: "unit", entityId: "invoices" },
  items: { categoryId: "unit", entityId: "items" },
  land: { categoryId: "unit", entityId: "land" },
  "local parcels": { categoryId: "unit", entityId: "local_parcels" },
  maintenance: { categoryId: "unit", entityId: "maintenance" },
  maize: { categoryId: "unit", entityId: "maize" },
  "maize bags": { categoryId: "unit", entityId: "maize_bags" },
  "male employees": { categoryId: "unit", entityId: "male_employees" },
  "maternity cases": { categoryId: "unit", entityId: "maternity_cases" },
  "medical cases": { categoryId: "unit", entityId: "medical_cases" },
  men: { categoryId: "group", entityId: "men" },
  "monthly budget": { categoryId: "unit", entityId: "monthly_budget" },
  "monthly expense budget": { categoryId: "unit", entityId: "monthly_expense_budget" },
  "national parcels": { categoryId: "unit", entityId: "national_parcels" },
  "neutral respondents": { categoryId: "unit", entityId: "neutral_respondents" },
  "not recovered": { categoryId: "unit", entityId: "not_recovered" },
  number: { categoryId: "unit", entityId: "number" },
  "online applicants": { categoryId: "unit", entityId: "online_applicants" },
  "other candidates": { categoryId: "unit", entityId: "other_candidates" },
  "other passengers": { categoryId: "unit", entityId: "other_passengers" },
  "other responses": { categoryId: "unit", entityId: "other_responses" },
  output: { categoryId: "unit", entityId: "output" },
  paddy: { categoryId: "unit", entityId: "paddy" },
  paid: { categoryId: "unit", entityId: "paid" },
  parcels: { categoryId: "unit", entityId: "parcels" },
  passed: { categoryId: "unit", entityId: "passed" },
  "passed candidates": { categoryId: "unit", entityId: "passed_candidates" },
  "passenger count": { categoryId: "unit", entityId: "passenger_count" },
  passengers: { categoryId: "group", entityId: "passengers" },
  patients: { categoryId: "group", entityId: "patients" },
  payroll: { categoryId: "unit", entityId: "payroll" },
  pending: { categoryId: "unit", entityId: "pending" },
  people: { categoryId: "unit", entityId: "people" },
  present: { categoryId: "unit", entityId: "present" },
  "primary-section students": { categoryId: "unit", entityId: "primary_section_students" },
  "production batch": { categoryId: "unit", entityId: "production_batch" },
  pulses: { categoryId: "unit", entityId: "pulses" },
  quantity: { categoryId: "unit", entityId: "quantity" },
  "rainfall collection": { categoryId: "unit", entityId: "rainfall_collection" },
  "raw materials": { categoryId: "unit", entityId: "raw_materials" },
  "ready items": { categoryId: "unit", entityId: "ready_items" },
  "ready stock": { categoryId: "unit", entityId: "ready_stock" },
  recovered: { categoryId: "unit", entityId: "recovered" },
  referred: { categoryId: "unit", entityId: "referred" },
  "regional parcels": { categoryId: "unit", entityId: "regional_parcels" },
  rejected: { categoryId: "unit", entityId: "rejected" },
  "rejected units": { categoryId: "unit", entityId: "rejected_units" },
  remaining: { categoryId: "unit", entityId: "remaining" },
  rent: { categoryId: "financial-concept", entityId: "rent" },
  "reserved items": { categoryId: "unit", entityId: "reserved_items" },
  "reserved stock": { categoryId: "unit", entityId: "reserved_stock" },
  respondents: { categoryId: "unit", entityId: "respondents" },
  "rice bags": { categoryId: "unit", entityId: "rice_bags" },
  "rural population": { categoryId: "unit", entityId: "rural_population" },
  sacks: { categoryId: "unit", entityId: "sacks" },
  salaries: { categoryId: "financial-concept", entityId: "salaries" },
  "satisfied respondents": { categoryId: "unit", entityId: "satisfied_respondents" },
  savings: { categoryId: "financial-concept", entityId: "savings" },
  seats: { categoryId: "unit", entityId: "seats" },
  selected: { categoryId: "unit", entityId: "selected" },
  "senior citizens": { categoryId: "unit", entityId: "senior_citizens" },
  "sleeper class": { categoryId: "unit", entityId: "sleeper_class" },
  sold: { categoryId: "unit", entityId: "sold" },
  "spare parts": { categoryId: "unit", entityId: "spare_parts" },
  spoiled: { categoryId: "unit", entityId: "spoiled" },
  stock: { categoryId: "unit", entityId: "stock" },
  students: { categoryId: "group", entityId: "students" },
  "surgical cases": { categoryId: "unit", entityId: "surgical_cases" },
  "target output": { categoryId: "unit", entityId: "target_output" },
  "the accounts department": { categoryId: "unit", entityId: "accounts_department" },
  "the sales department": { categoryId: "unit", entityId: "sales_department" },
  training: { categoryId: "unit", entityId: "training" },
  transport: { categoryId: "financial-concept", entityId: "transport" },
  "under observation": { categoryId: "unit", entityId: "under_observation" },
  "under review": { categoryId: "unit", entityId: "under_review" },
  units: { categoryId: "unit", entityId: "units" },
  unsold: { categoryId: "unit", entityId: "unsold" },
  usage: { categoryId: "unit", entityId: "usage" },
  used: { categoryId: "unit", entityId: "used" },
  vacant: { categoryId: "unit", entityId: "vacant" },
  valid: { categoryId: "unit", entityId: "valid" },
  "valid votes": { categoryId: "unit", entityId: "valid_votes" },
  value: { categoryId: "unit", entityId: "value" },
  "vote count": { categoryId: "unit", entityId: "vote_count" },
  votes: { categoryId: "unit", entityId: "votes" },
  wheat: { categoryId: "unit", entityId: "wheat" },
  "wheat bags": { categoryId: "unit", entityId: "wheat_bags" },
  "wheat crop": { categoryId: "unit", entityId: "wheat_crop" },
  women: { categoryId: "group", entityId: "women" },
};

function localizeScenarioOverrideLabels(
  overrides: Partial<Pct002Variables>,
): Partial<Pct002Variables> {
  const localizedOverrides: Partial<Pct002Variables> = {};

  for (const [field, value] of Object.entries(overrides) as [keyof Pct002Variables & string, Pct002Variables[keyof Pct002Variables]][]) {
    if (typeof value === "string" && LABEL_FIELD_SET.has(field)) {
      const mapping = NON_ENGLISH_LABEL_ENTITY_MAP[value];
      if (!mapping) {
        throw new Error(`Missing non-English entity mapping for label "${value}".`);
      }
      localizedOverrides[field] = entityRef(mapping.categoryId, mapping.entityId) as Pct002Variables[keyof Pct002Variables];
      continue;
    }
    localizedOverrides[field] = value;
  }

  return localizedOverrides;
}

function createVariables(
  questionLanguageId: string,
  difficultyBand: Pct002DifficultyBand,
  seed: string,
  language: Pct002Language,
) {
  const builderId = SCENARIO_ALIASES[questionLanguageId] ?? questionLanguageId;
  const builder = SCENARIO_BUILDERS[builderId];
  if (!builder) throw new Error(`Missing scenario builder for ${questionLanguageId}`);
  return {
    ...builder(difficultyBand, seed),
    ...(SCENARIO_VARIABLE_OVERRIDES[questionLanguageId] ?? {}),
    ...(language === "en"
      ? {}
      : localizeScenarioOverrideLabels(SCENARIO_VARIABLE_OVERRIDES[questionLanguageId] ?? {})),
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

  if (!isQlLocalized("PCT-002", questionLanguageId, language)) {
    throw new Error(
      `Question language ${questionLanguageId} is not localized for ${language} in PCT-002.`,
    );
  }

  const questionEntry = getQuestionEntry(cpId, questionLanguageId, language);
  const resolvedDifficulty = questionEntry.difficulty;
  const taskKind = getTaskKind(cpId, questionLanguageId);
  const answerType = getAnswerType(cpId, questionLanguageId);
  const requiredVariables = getRequiredVariables(cpId, questionLanguageId);
  const variables = resolveEntityLabels(
    createVariables(questionLanguageId, resolvedDifficulty, seed, language),
    language,
    LABEL_FIELDS,
    (resolvedValue, field) =>
      LABEL_FIELDS.includes(field as LabelField)
        ? normalizeResolvedLabel(resolvedValue, language)
        : resolvedValue,
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
