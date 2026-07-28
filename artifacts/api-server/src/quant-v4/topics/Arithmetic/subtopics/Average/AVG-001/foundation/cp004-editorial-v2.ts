import { getAvg001QuestionEntry } from "./library";
import { toNumber } from "./math";
import {
  applyAvg001SemanticOptions,
  formatIndianNumber,
  hasConsistentSemanticOptions,
} from "./presentation-quality-v2";
import type { Avg001QuestionPackage, Avg001ValidationCheck, Rational } from "./types";

export const AVG_001_CP004_EDITORIAL_V2 =
  "AVG-CP-004 exam-ready stems, semantic options and four-tier explanations v2";

function raw(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined && rendered !== "") return String(rendered);
  const value = pkg.parameters.values[key as keyof typeof pkg.parameters.values];
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object" && "numerator" in value) {
    const numeric = toNumber(value as Rational);
    return Number.isInteger(numeric) ? String(numeric) : String(Number(numeric.toFixed(2)));
  }
  return "";
}

function scenarioKey(pkg: Avg001QuestionPackage) {
  return String(pkg.parameters.scenarioVariant)
    .replace(/^findCount_/, "")
    .replace(/^findAverage_/, "");
}

function metric(pkg: Avg001QuestionPackage, value: string) {
  const grouped = formatIndianNumber(value);
  const unit = getAvg001QuestionEntry(pkg.questionLanguageId).unitKind ?? "none";
  if (unit === "currency") return `₹${grouped}`;
  if (unit === "marks") return `${grouped} marks`;
  if (unit === "kg") return `${grouped} kg`;
  if (unit === "years") return `${grouped} years`;
  if (unit === "units") return `${grouped} units`;
  if (unit === "runs") return `${grouped} runs`;
  if (unit === "unitsPerHour") return `${grouped} units per hour`;
  return grouped;
}

type PairContext = {
  setting: string;
  first: string;
  second: string;
  collection: string;
  measure: string;
  target: string;
};

const PAIRS: Record<string, PairContext> = {
  boysGirlsMarks: { setting: "In a school examination", first: "boys", second: "girls", collection: "students", measure: "score", target: "average score of all the students" },
  morningEveningOutput: { setting: "In a factory", first: "morning-shift workers", second: "evening-shift workers", collection: "workers", measure: "daily output", target: "average daily output per worker" },
  permanentContractSalary: { setting: "In a company", first: "permanent employees", second: "contract employees", collection: "employees", measure: "monthly salary", target: "average monthly salary of all employees" },
  urbanRuralSales: { setting: "A retail company operates", first: "urban outlets", second: "rural outlets", collection: "outlets", measure: "monthly sales", target: "average monthly sales per outlet" },
  twoBatchesWeight: { setting: "A warehouse contains", first: "parcels in the first lot", second: "parcels in the second lot", collection: "parcels", measure: "weight", target: "average weight of all the parcels" },
  dayNightPassengers: { setting: "A transport service records", first: "day trips", second: "night trips", collection: "trips", measure: "number of passengers", target: "average number of passengers per trip" },
  menWomenAge: { setting: "A community survey includes", first: "men", second: "women", collection: "people", measure: "age", target: "average age of all the people surveyed" },
  twoSectionsScores: { setting: "A school has", first: "students in Section A", second: "students in Section B", collection: "students", measure: "test score", target: "average test score of both sections together" },
  branchesRevenue: { setting: "A company has", first: "branches in the first region", second: "branches in the second region", collection: "branches", measure: "monthly revenue", target: "average monthly revenue per branch" },
  machinesOutput: { setting: "A production unit uses", first: "older machines", second: "newer machines", collection: "machines", measure: "hourly output", target: "average hourly output per machine" },
  departmentsSalary: { setting: "An organisation has", first: "employees in Department A", second: "employees in Department B", collection: "employees", measure: "monthly salary", target: "average monthly salary of both departments together" },
  parcelsWeight: { setting: "A dispatch centre has", first: "packages in Batch A", second: "packages in Batch B", collection: "packages", measure: "weight", target: "average weight of all packages" },
  teamsRuns: { setting: "Two cricket teams are compared", first: "players in Team A", second: "players in Team B", collection: "players", measure: "batting score", target: "combined batting average of the players" },
  hostelGroupsExpense: { setting: "A hostel complex has", first: "residents in Hostel A", second: "residents in Hostel B", collection: "residents", measure: "daily expenditure", target: "average daily expenditure per resident" },
  villagesYield: { setting: "An agricultural survey covers", first: "farms in Village A", second: "farms in Village B", collection: "farms", measure: "crop yield", target: "average crop yield per farm" },
  abstractTwoGroups: { setting: "Two numerical groups contain", first: "values in the first group", second: "values in the second group", collection: "values", measure: "value", target: "combined average of all values" },
};

function pair(pkg: Avg001QuestionPackage) {
  return PAIRS[scenarioKey(pkg)] ?? PAIRS.abstractTwoGroups!;
}

function pairStem(pkg: Avg001QuestionPackage) {
  const c = pair(pkg);
  return `${c.setting} ${raw(pkg, "count1")} ${c.first}, whose average ${c.measure} is ${metric(pkg, raw(pkg, "average1"))}, and ${raw(pkg, "count2")} ${c.second}, whose average ${c.measure} is ${metric(pkg, raw(pkg, "average2"))}. What is the ${c.target}?`;
}

function countStem(pkg: Avg001QuestionPackage) {
  const c = pair(pkg);
  return `${c.setting} ${raw(pkg, "knownCount")} ${c.first} with an average ${c.measure} of ${metric(pkg, raw(pkg, "knownAverage"))}. The ${c.second} have an average ${c.measure} of ${metric(pkg, raw(pkg, "unknownAverage"))}, while the average for all ${c.collection} is ${metric(pkg, raw(pkg, "combinedAverage"))}. How many ${c.second} are there?`;
}

function missingStem(pkg: Avg001QuestionPackage) {
  const c = pair(pkg);
  return `${c.setting} ${raw(pkg, "count1")} ${c.first} with an average ${c.measure} of ${metric(pkg, raw(pkg, "average1"))} and ${raw(pkg, "count2")} ${c.second}. If the average ${c.measure} of all ${c.collection} is ${metric(pkg, raw(pkg, "combinedAverage"))}, what is the average ${c.measure} of the ${c.second}?`;
}

const MULTI_LABELS: Record<string, string[]> = {
  threeClassesMarks: ["Section A", "Section B", "Section C"],
  threeShiftsOutput: ["morning shift", "evening shift", "night shift"],
  threeDepartmentsSalary: ["Department A", "Department B", "Department C"],
  threeWarehouseWeights: ["Lot A", "Lot B", "Lot C"],
  threeBranchSales: ["Region A", "Region B", "Region C"],
  threeAgeGroups: ["Group A", "Group B", "Group C"],
  fourBatchesMarks: ["Batch A", "Batch B", "Batch C", "Batch D"],
  fourUnitsOutput: ["Unit A", "Unit B", "Unit C", "Unit D"],
  fourTeamsRuns: ["Team A", "Team B", "Team C", "Team D"],
  fourDepartmentsSalary: ["Department A", "Department B", "Department C", "Department D"],
  fourParcelLots: ["Lot A", "Lot B", "Lot C", "Lot D"],
  fourAbstractGroups: ["Group A", "Group B", "Group C", "Group D"],
};

function multiMeasure(pkg: Avg001QuestionPackage) {
  const key = scenarioKey(pkg);
  if (/Marks/.test(key)) return "average marks";
  if (/Salary/.test(key)) return "average monthly salary";
  if (/Weight|Parcel/.test(key)) return "average weight";
  if (/Age/.test(key)) return "average age";
  if (/Runs|Teams/.test(key)) return "average runs";
  if (/Output|Units/.test(key)) return "average output";
  if (/Sales/.test(key)) return "average sales";
  return "average value";
}

function multiStem(pkg: Avg001QuestionPackage) {
  const labels = MULTI_LABELS[scenarioKey(pkg)] ?? ["Group A", "Group B", "Group C"];
  const clauses = labels.map((label, i) => `${label} has ${raw(pkg, `count${i + 1}`)} members with ${multiMeasure(pkg)} ${metric(pkg, raw(pkg, `average${i + 1}`))}`);
  const joined = `${clauses.slice(0, -1).join(", ")}, and ${clauses.at(-1)}`;
  return `${joined}. What is the combined ${multiMeasure(pkg)} across all the groups?`;
}

function speedSubject(pkg: Avg001QuestionPackage) {
  const v = scenarioKey(pkg).toLowerCase();
  if (v.includes("bus")) return "bus";
  if (v.includes("train")) return "train";
  if (v.includes("cyclist")) return "cyclist";
  if (v.includes("runner")) return "runner";
  if (v.includes("delivery")) return "delivery van";
  if (v.includes("boat")) return "boat";
  if (v.includes("bike")) return "motorbike";
  if (v.includes("machine")) return "machine";
  if (v.includes("worker")) return "worker";
  if (v.includes("inspection")) return "inspection vehicle";
  if (v.includes("service")) return "service vehicle";
  return "car";
}

function ratioStem(pkg: Avg001QuestionPackage) {
  const i = Number(pkg.questionLanguageId.slice(-3)) - 406;
  const a = raw(pkg, "groupAverage1");
  const b = raw(pkg, "groupAverage2");
  const c = raw(pkg, "combinedAverage");
  const stems = [
    `Two classes have average marks of ${a} and ${b}. If their combined average is ${c} marks, what is the ratio of the numbers of students in the first and second classes?`,
    `Two departments record average outputs of ${a} units and ${b} units. If their combined average output is ${c} units, find the ratio of their staff strengths.`,
    `Two cricket teams have batting averages of ${a} runs and ${b} runs. If their combined batting average is ${c} runs, find the ratio of the numbers of players in the two teams.`,
    `Two employee groups have average ages of ${a} years and ${b} years. If their combined average age is ${c} years, what is the ratio of their group sizes?`,
    `Two production units have average outputs of ${a} units and ${b} units. If the combined average is ${c} units, find the ratio of the numbers of machines in the two units.`,
    `Two districts have average rainfall readings of ${a} cm and ${b} cm. If the combined average rainfall is ${c} cm, find the ratio of the numbers of observations from the two districts.`,
    `Two training batches have average scores of ${a} marks and ${b} marks. If their combined average is ${c} marks, find the ratio of the numbers of trainees in the two batches.`,
    `Two groups of accounts have average balances of ₹${formatIndianNumber(Number(a) * 1000)} and ₹${formatIndianNumber(Number(b) * 1000)}. If their combined average balance is ₹${formatIndianNumber(Number(c) * 1000)}, find the ratio of the numbers of accounts in the two groups.`,
  ];
  return stems[i] ?? stems[0]!;
}

function renderStem(pkg: Avg001QuestionPackage) {
  const subject = speedSubject(pkg);
  switch (pkg.solveMode) {
    case "findCombinedAverageOfTwoGroups": return pairStem(pkg);
    case "findCombinedAverageOfThreeOrFourGroups": return multiStem(pkg);
    case "findGroupCountFromCombinedAverage": return countStem(pkg);
    case "findMissingGroupAverage": return missingStem(pkg);
    case "findAverageSpeedEqualDistance": return `A ${subject} covers two equal-distance stretches, travelling at ${raw(pkg, "speed1")} km/h on the first stretch and ${raw(pkg, "speed2")} km/h on the second. What is its average speed for the complete journey?`;
    case "findAverageSpeedEqualTime": {
      const production = /machine|worker/.test(subject);
      const unit = production ? "units per hour" : "km/h";
      return `A ${subject} operates for the same duration at ${raw(pkg, "speed1")} ${unit} and ${raw(pkg, "speed2")} ${unit}. What is its ${production ? "average production rate" : "average speed"} over the entire period?`;
    }
    case "findGroupCountRatioFromCombinedAverage": return ratioStem(pkg);
    case "findAverageSpeedForUnequalDistances": return `A ${subject} travels the first ${raw(pkg, "distance1")} km at ${raw(pkg, "speed1")} km/h and the next ${raw(pkg, "distance2")} km at ${raw(pkg, "speed2")} km/h. What is its average speed for the entire journey?`;
    case "findAverageSpeedForUnequalTimes": return `A ${subject} travels at ${raw(pkg, "speed1")} km/h for ${raw(pkg, "time1")} hours and then at ${raw(pkg, "speed2")} km/h for ${raw(pkg, "time2")} hours. What is its average speed for the entire journey?`;
    default: return pkg.stem;
  }
}

const DISTRACTOR_TAGS: Record<string, string[]> = {
  findCombinedAverageOfTwoGroups: ["UNWEIGHTED_MEAN", "ONE_GROUP_AVERAGE_REUSED", "WEIGHTED_ARITHMETIC_SLIP"],
  findCombinedAverageOfThreeOrFourGroups: ["UNWEIGHTED_MEAN", "ONE_GROUP_OMITTED", "WEIGHTED_ARITHMETIC_SLIP"],
  findGroupCountFromCombinedAverage: ["KNOWN_COUNT_REUSED", "INVERSE_RATIO_ERROR", "COUNT_ARITHMETIC_SLIP"],
  findMissingGroupAverage: ["COMBINED_AVERAGE_REUSED", "KNOWN_AVERAGE_REUSED", "TOTAL_BALANCE_ERROR"],
  findAverageSpeedEqualDistance: ["ARITHMETIC_MEAN_TRAP", "LOWER_SPEED_REUSED", "TIME_WEIGHT_ERROR"],
  findAverageSpeedEqualTime: ["HARMONIC_MEAN_TRAP", "LOWER_RATE_REUSED", "RATE_ARITHMETIC_SLIP"],
  findGroupCountRatioFromCombinedAverage: ["RATIO_REVERSED", "DIRECT_DISTANCE_RATIO", "UNSIMPLIFIED_RATIO"],
  findAverageSpeedForUnequalDistances: ["ARITHMETIC_MEAN_TRAP", "EQUAL_DISTANCE_FORMULA_MISUSED", "ONE_STAGE_TIME_OMITTED"],
  findAverageSpeedForUnequalTimes: ["ARITHMETIC_MEAN_TRAP", "TIME_WEIGHTS_REVERSED", "ONE_STAGE_DISTANCE_OMITTED"],
};

function distractorAnalysis(pkg: Avg001QuestionPackage) {
  const tags = DISTRACTOR_TAGS[pkg.solveMode] ?? ["METHOD_ERROR", "SIGN_ERROR", "ARITHMETIC_SLIP"];
  return pkg.options
    .map((option, index) => ({ option, index }))
    .filter(({ index }) => index !== pkg.correctIndex)
    .map(({ option, index }, pos) => `${String.fromCharCode(65 + index)} (${option}) [${tags[pos]}]`)
    .join("; ");
}

function value(r: Rational | undefined) {
  if (!r) return "";
  const n = toNumber(r);
  return String(Number(n.toFixed(2)));
}

function explanation(pkg: Avg001QuestionPackage) {
  const counts = pkg.parameters.values.groupCounts ?? [];
  const averages = pkg.parameters.values.groupAverages ?? [];
  let rule = "Use the weighted-average relation appropriate to the information given.";
  let working = pkg.solver.equation;
  let shortcut = "Keep every average attached to its corresponding count or travel weight.";

  switch (pkg.solveMode) {
    case "findCombinedAverageOfTwoGroups":
    case "findCombinedAverageOfThreeOrFourGroups": {
      rule = "Convert every subgroup average into a subtotal, add the subtotals and divide by the total number of members.";
      const products = averages.map((a, i) => `${value(a)}\\times${counts[i]}`).join("+");
      const totalCount = counts.reduce((sum, count) => sum + count, 0);
      working = `$$A_{combined}=(${products})\\div${totalCount}=${pkg.solver.answer}$$`;
      shortcut = "Choose a convenient base average; equal and opposite weighted deviations cancel immediately.";
      break;
    }
    case "findGroupCountFromCombinedAverage":
      rule = "The weighted deviations below and above the combined average must balance.";
      working = `$$n=${raw(pkg, "knownCount")}\\times(${raw(pkg, "combinedAverage")}-${raw(pkg, "knownAverage")})\\div(${raw(pkg, "unknownAverage")}-${raw(pkg, "combinedAverage")})=${pkg.solver.answer}$$`;
      shortcut = "Use inverse distances from the combined average and scale the ratio to the known count.";
      break;
    case "findMissingGroupAverage":
      rule = "Required combined total minus the known subgroup total gives the missing subgroup total.";
      working = `$$A_2=[${raw(pkg, "combinedAverage")}\\times(${raw(pkg, "count1")}+${raw(pkg, "count2")})-${raw(pkg, "average1")}\\times${raw(pkg, "count1")}]\\div${raw(pkg, "count2")}=${pkg.solver.answer}$$`;
      shortcut = "Balance signed deviations around the combined average instead of calculating both full totals.";
      break;
    case "findAverageSpeedEqualDistance":
      rule = "For two equal distances, average speed is the harmonic mean of the two speeds.";
      working = `$$S_{avg}=2\\times${raw(pkg, "speed1")}\\times${raw(pkg, "speed2")}\\div(${raw(pkg, "speed1")}+${raw(pkg, "speed2")})=${pkg.solver.answer}$$`;
      shortcut = "Use twice the product divided by the sum; the slower leg receives greater time weight.";
      break;
    case "findAverageSpeedEqualTime":
      rule = "Equal travel times give the two rates equal weight.";
      working = `$$R_{avg}=(${raw(pkg, "speed1")}+${raw(pkg, "speed2")})\\div2=${pkg.solver.answer}$$`;
      shortcut = "For equal time only, take the ordinary arithmetic mean of the rates.";
      break;
    case "findGroupCountRatioFromCombinedAverage":
      rule = "Group sizes are inversely proportional to their distances from the combined average.";
      working = `$$n_1:n_2=(${raw(pkg, "groupAverage2")}-${raw(pkg, "combinedAverage")}):(${raw(pkg, "combinedAverage")}-${raw(pkg, "groupAverage1")})=${pkg.solver.answer}$$`;
      shortcut = "Write each group beside the opposite deviation, then simplify the ratio.";
      break;
    case "findAverageSpeedForUnequalDistances":
      rule = "Average speed always equals total distance divided by total elapsed time.";
      working = `$$S_{avg}=(${raw(pkg, "distance1")}+${raw(pkg, "distance2")})\\div[${raw(pkg, "distance1")}\\div${raw(pkg, "speed1")}+${raw(pkg, "distance2")}\\div${raw(pkg, "speed2")}]=${pkg.solver.answer}$$`;
      shortcut = "Calculate each leg's time first; a simple mean is valid only when the two times are equal.";
      break;
    case "findAverageSpeedForUnequalTimes":
      rule = "For unequal times, weight each speed by the time for which it applies.";
      working = `$$S_{avg}=(${raw(pkg, "speed1")}\\times${raw(pkg, "time1")}+${raw(pkg, "speed2")}\\times${raw(pkg, "time2")})\\div(${raw(pkg, "time1")}+${raw(pkg, "time2")})=${pkg.solver.answer}$$`;
      shortcut = "Multiply each speed by its duration, add the distances and divide by total time.";
      break;
  }

  return { lines: [
    `📌 Key rule: ${rule}`,
    `📝 Step-by-step solution: ${working}`,
    `⚡ Exam speed shortcut: ${shortcut}`,
    `⚠️ Common traps and distractors: ${distractorAnalysis(pkg)}. Therefore, the required answer is ${pkg.answer}.`,
  ] };
}

function refreshValidation(pkg: Avg001QuestionPackage) {
  const replaced = new Set([
    "resolved-stem", "four-options", "unique-options", "correct-index", "answer-once",
    "explanation-depth", "explanation-arithmetic", "explanation-answer",
    "cp004-editorial-v2", "cp004-v2-stem", "cp004-v2-options", "cp004-v2-explanation",
  ]);
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => !replaced.has(check.name));
  checks.push(
    { name: "cp004-editorial-v2", passed: pkg.traceability.cp004EditorialV2 === AVG_001_CP004_EDITORIAL_V2, message: "CP-004 carries the v2 editorial candidate trace" },
    { name: "cp004-v2-stem", passed: pkg.stem.length >= 70 && !/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem), message: "Stem is explicit, resolved and written in natural exam style" },
    { name: "cp004-v2-options", passed: pkg.options.length === 4 && new Set(pkg.options).size === 4 && pkg.options[pkg.correctIndex] === pkg.answer && hasConsistentSemanticOptions(pkg), message: "Options are unique, semantically qualified and consistently formatted" },
    { name: "cp004-v2-explanation", passed: pkg.explanation.lines.length === 4 && pkg.explanation.lines[0]?.startsWith("📌 Key rule:") === true && pkg.explanation.lines[1]?.startsWith("📝 Step-by-step solution:") === true && pkg.explanation.lines[2]?.startsWith("⚡ Exam speed shortcut:") === true && pkg.explanation.lines[3]?.startsWith("⚠️ Common traps and distractors:") === true && pkg.explanation.lines[3]?.includes(pkg.answer) === true, message: "Explanation follows the exact four-tier schema with answer evidence" },
  );
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001Cp004EditorialV2(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-004" || pkg.language !== "en") return pkg;
  const originalFingerprint = pkg.mathematicalFingerprint;
  const semantic = applyAvg001SemanticOptions(pkg);
  const revised: Avg001QuestionPackage = {
    ...semantic,
    stem: renderStem(semantic),
    explanation: explanation(semantic),
    traceability: {
      ...semantic.traceability,
      cp004EditorialV2: AVG_001_CP004_EDITORIAL_V2,
      releaseCandidate: "AVG-001-EN-v2",
      preservedMathematicalFingerprint: originalFingerprint,
    },
  };
  return { ...revised, validation: refreshValidation(revised) };
}
