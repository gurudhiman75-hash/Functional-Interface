import { applyAvg001Cp004EditorialV2 } from "./cp004-editorial-v2";
import { getAvg001QuestionEntry } from "./library";
import { toNumber } from "./math";
import { formatIndianNumber } from "./presentation-quality-v2";
import type { Avg001QuestionPackage, Rational } from "./types";

export const AVG_001_CP004_EDITORIAL_V2_POLISH =
  "AVG-CP-004 editorial v2 final stem polish v2";

function raw(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined && rendered !== "") return String(rendered);
  const value = pkg.parameters.values[key as keyof typeof pkg.parameters.values];
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object" && "numerator" in value) {
    const numeric = toNumber(value as Rational);
    return Number.isInteger(numeric)
      ? String(numeric)
      : String(Number(numeric.toFixed(2)));
  }
  return "";
}

function key(pkg: Avg001QuestionPackage) {
  return String(pkg.parameters.scenarioVariant)
    .replace(/^findCount_/, "")
    .replace(/^findAverage_/, "");
}

function inferredUnit(pkg: Avg001QuestionPackage) {
  const entryUnit = getAvg001QuestionEntry(pkg.questionLanguageId).unitKind;
  if (entryUnit && entryUnit !== "none") return entryUnit;
  const scenario = key(pkg);
  if (/Marks|Scores/.test(scenario)) return "marks";
  if (/Salary|Sales|Revenue|Expense/.test(scenario)) return "currency";
  if (/Weight|Parcel/.test(scenario)) return "kg";
  if (/Age/.test(scenario)) return "years";
  if (/Runs|Teams/.test(scenario)) return "runs";
  if (/Output|Yield|Machines/.test(scenario)) return "units";
  return "none";
}

function metric(pkg: Avg001QuestionPackage, value: string) {
  const grouped = formatIndianNumber(value);
  switch (inferredUnit(pkg)) {
    case "currency": return `₹${grouped}`;
    case "marks": return `${grouped} marks`;
    case "kg": return `${grouped} kg`;
    case "years": return `${grouped} years`;
    case "runs": return `${grouped} runs`;
    case "units": return `${grouped} units`;
    default: return grouped;
  }
}

type PairContext = {
  intro: string;
  first: string;
  second: string;
  collection: string;
  measure: string;
  target: string;
};

const PAIR_CONTEXTS: Record<string, PairContext> = {
  boysGirlsMarks: { intro: "In a school examination", first: "boys", second: "girls", collection: "students", measure: "score", target: "average score of all the students" },
  morningEveningOutput: { intro: "In a factory", first: "morning-shift workers", second: "evening-shift workers", collection: "workers", measure: "daily output", target: "average daily output per worker" },
  permanentContractSalary: { intro: "In a company", first: "permanent employees", second: "contract employees", collection: "employees", measure: "monthly salary", target: "average monthly salary of all employees" },
  urbanRuralSales: { intro: "In a retail network", first: "urban outlets", second: "rural outlets", collection: "outlets", measure: "monthly sales", target: "average monthly sales per outlet" },
  twoBatchesWeight: { intro: "At a warehouse", first: "parcels in the first lot", second: "parcels in the second lot", collection: "parcels", measure: "weight", target: "average weight of all the parcels" },
  dayNightPassengers: { intro: "For a transport service", first: "day trips", second: "night trips", collection: "trips", measure: "passenger count", target: "average number of passengers per trip" },
  menWomenAge: { intro: "In a community survey", first: "men", second: "women", collection: "people", measure: "age", target: "average age of all the people surveyed" },
  twoSectionsScores: { intro: "At a school", first: "students in Section A", second: "students in Section B", collection: "students", measure: "test score", target: "average test score of both sections together" },
  branchesRevenue: { intro: "In a company", first: "branches in the first region", second: "branches in the second region", collection: "branches", measure: "monthly revenue", target: "average monthly revenue per branch" },
  machinesOutput: { intro: "At a production unit", first: "older machines", second: "newer machines", collection: "machines", measure: "hourly output", target: "average hourly output per machine" },
  departmentsSalary: { intro: "In an organisation", first: "employees in Department A", second: "employees in Department B", collection: "employees", measure: "monthly salary", target: "average monthly salary of both departments together" },
  parcelsWeight: { intro: "At a dispatch centre", first: "packages in Batch A", second: "packages in Batch B", collection: "packages", measure: "weight", target: "average weight of all packages" },
  teamsRuns: { intro: "In a cricket league", first: "players in Team A", second: "players in Team B", collection: "players", measure: "batting score", target: "combined batting average of all players" },
  hostelGroupsExpense: { intro: "In a hostel complex", first: "residents in Hostel A", second: "residents in Hostel B", collection: "residents", measure: "daily expenditure", target: "average daily expenditure per resident" },
  villagesYield: { intro: "In an agricultural survey", first: "farms in Village A", second: "farms in Village B", collection: "farms", measure: "crop yield", target: "average crop yield per farm" },
  abstractTwoGroups: { intro: "In two numerical groups", first: "values in the first group", second: "values in the second group", collection: "values", measure: "value", target: "combined average of all values" },
};

function pairContext(pkg: Avg001QuestionPackage) {
  return PAIR_CONTEXTS[key(pkg)] ?? PAIR_CONTEXTS.abstractTwoGroups!;
}

function pairStem(pkg: Avg001QuestionPackage) {
  const context = pairContext(pkg);
  return `${context.intro}, ${raw(pkg, "count1")} ${context.first} have an average ${context.measure} of ${metric(pkg, raw(pkg, "average1"))}, while ${raw(pkg, "count2")} ${context.second} have an average ${context.measure} of ${metric(pkg, raw(pkg, "average2"))}. What is the ${context.target}?`;
}

function countStem(pkg: Avg001QuestionPackage) {
  const context = pairContext(pkg);
  return `${context.intro}, ${raw(pkg, "knownCount")} ${context.first} have an average ${context.measure} of ${metric(pkg, raw(pkg, "knownAverage"))}. The ${context.second} have an average ${context.measure} of ${metric(pkg, raw(pkg, "unknownAverage"))}, while the average for all ${context.collection} is ${metric(pkg, raw(pkg, "combinedAverage"))}. How many ${context.second} are there?`;
}

function missingStem(pkg: Avg001QuestionPackage) {
  const context = pairContext(pkg);
  return `${context.intro}, ${raw(pkg, "count1")} ${context.first} have an average ${context.measure} of ${metric(pkg, raw(pkg, "average1"))}, and the other group contains ${raw(pkg, "count2")} ${context.second}. If the average ${context.measure} of all ${context.collection} is ${metric(pkg, raw(pkg, "combinedAverage"))}, what is the average ${context.measure} of the ${context.second}?`;
}

type MultiContext = {
  labels: string[];
  entity: string;
  averagePhrase: string;
  target: string;
};

const MULTI_CONTEXTS: Record<string, MultiContext> = {
  threeClassesMarks: { labels: ["Section A", "Section B", "Section C"], entity: "students", averagePhrase: "an average score of", target: "average score of all students" },
  threeShiftsOutput: { labels: ["the morning shift", "the evening shift", "the night shift"], entity: "workers", averagePhrase: "an average output of", target: "average output per worker" },
  threeDepartmentsSalary: { labels: ["Department A", "Department B", "Department C"], entity: "employees", averagePhrase: "an average monthly salary of", target: "average monthly salary of all employees" },
  threeWarehouseWeights: { labels: ["Lot A", "Lot B", "Lot C"], entity: "packages", averagePhrase: "an average weight of", target: "average weight of all packages" },
  threeBranchSales: { labels: ["Region A", "Region B", "Region C"], entity: "outlets", averagePhrase: "average monthly sales of", target: "average monthly sales per outlet" },
  threeAgeGroups: { labels: ["Group A", "Group B", "Group C"], entity: "people", averagePhrase: "an average age of", target: "average age of all the people" },
  fourBatchesMarks: { labels: ["Batch A", "Batch B", "Batch C", "Batch D"], entity: "candidates", averagePhrase: "an average score of", target: "average score of all candidates" },
  fourUnitsOutput: { labels: ["Unit A", "Unit B", "Unit C", "Unit D"], entity: "machines", averagePhrase: "an average output of", target: "average output per machine" },
  fourTeamsRuns: { labels: ["Team A", "Team B", "Team C", "Team D"], entity: "players", averagePhrase: "a batting average of", target: "combined batting average of all players" },
  fourDepartmentsSalary: { labels: ["Department A", "Department B", "Department C", "Department D"], entity: "employees", averagePhrase: "an average monthly salary of", target: "average monthly salary of all employees" },
  fourParcelLots: { labels: ["Lot A", "Lot B", "Lot C", "Lot D"], entity: "parcels", averagePhrase: "an average weight of", target: "average weight of all parcels" },
  fourAbstractGroups: { labels: ["Group A", "Group B", "Group C", "Group D"], entity: "values", averagePhrase: "an average value of", target: "combined average of all values" },
};

function multiStem(pkg: Avg001QuestionPackage) {
  const context = MULTI_CONTEXTS[key(pkg)] ?? MULTI_CONTEXTS.fourAbstractGroups!;
  const clauses = context.labels.map((label, index) =>
    `${label} contains ${raw(pkg, `count${index + 1}`)} ${context.entity} with ${context.averagePhrase} ${metric(pkg, raw(pkg, `average${index + 1}`))}`,
  );
  return `${clauses.slice(0, -1).join("; ")}; and ${clauses.at(-1)}. What is the ${context.target}?`;
}

function speedSubject(pkg: Avg001QuestionPackage) {
  const id = Number(pkg.questionLanguageId.slice(-3));
  if (id >= 414 && id <= 419) return ["bus", "delivery van", "train", "car", "service vehicle", "inspection vehicle"][id - 414]!;
  if (id >= 420 && id <= 425) return ["bus", "delivery van", "train", "car", "service vehicle", "inspection vehicle"][id - 420]!;
  const scenario = key(pkg).toLowerCase();
  if (scenario.includes("bus")) return "bus";
  if (scenario.includes("train")) return "train";
  if (scenario.includes("delivery")) return "delivery van";
  if (scenario.includes("cyclist")) return "cyclist";
  if (scenario.includes("runner")) return "runner";
  if (scenario.includes("boat")) return "boat";
  if (scenario.includes("bike")) return "motorbike";
  if (scenario.includes("machine")) return "machine";
  if (scenario.includes("worker")) return "worker";
  return "car";
}

function speedStem(pkg: Avg001QuestionPackage) {
  const scenario = key(pkg);
  const subject = speedSubject(pkg);
  if (pkg.solveMode === "findAverageSpeedEqualDistance") {
    return `A ${subject} covers two equal-distance stretches, travelling at ${raw(pkg, "speed1")} km/h on the first stretch and ${raw(pkg, "speed2")} km/h on the second. What is its average speed for the complete journey?`;
  }
  if (pkg.solveMode === "findAverageSpeedEqualTime") {
    if (scenario === "abstractEqualWeights") {
      return `Two rates, ${raw(pkg, "speed1")} and ${raw(pkg, "speed2")}, apply for equal durations. What is their average rate?`;
    }
    if (scenario.includes("machine")) {
      return `A machine operates for equal durations at production rates of ${raw(pkg, "speed1")} units per hour and ${raw(pkg, "speed2")} units per hour. What is its average production rate?`;
    }
    if (scenario.includes("worker")) {
      return `A worker produces at ${raw(pkg, "speed1")} units per hour and ${raw(pkg, "speed2")} units per hour for equal durations. What is the worker's average output rate?`;
    }
    return `A ${subject} travels for equal durations at ${raw(pkg, "speed1")} km/h and ${raw(pkg, "speed2")} km/h. What is its average speed over the entire period?`;
  }
  if (pkg.solveMode === "findAverageSpeedForUnequalDistances") {
    return `A ${subject} travels the first ${raw(pkg, "distance1")} km at ${raw(pkg, "speed1")} km/h and the next ${raw(pkg, "distance2")} km at ${raw(pkg, "speed2")} km/h. What is its average speed for the entire journey?`;
  }
  if (pkg.solveMode === "findAverageSpeedForUnequalTimes") {
    const t1 = raw(pkg, "time1");
    const t2 = raw(pkg, "time2");
    return `A ${subject} travels at ${raw(pkg, "speed1")} km/h for ${t1} ${t1 === "1" ? "hour" : "hours"} and then at ${raw(pkg, "speed2")} km/h for ${t2} ${t2 === "1" ? "hour" : "hours"}. What is its average speed for the entire journey?`;
  }
  return pkg.stem;
}

export function applyAvg001Cp004EditorialV2Candidate(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const candidate = applyAvg001Cp004EditorialV2(pkg);
  if (candidate.canonicalProblemId !== "AVG-CP-004" || candidate.language !== "en") {
    return candidate;
  }
  let stem = candidate.stem;
  if (candidate.solveMode === "findCombinedAverageOfTwoGroups") stem = pairStem(candidate);
  if (candidate.solveMode === "findCombinedAverageOfThreeOrFourGroups") stem = multiStem(candidate);
  if (candidate.solveMode === "findGroupCountFromCombinedAverage") stem = countStem(candidate);
  if (candidate.solveMode === "findMissingGroupAverage") stem = missingStem(candidate);
  if (
    candidate.solveMode === "findAverageSpeedEqualDistance" ||
    candidate.solveMode === "findAverageSpeedEqualTime" ||
    candidate.solveMode === "findAverageSpeedForUnequalDistances" ||
    candidate.solveMode === "findAverageSpeedForUnequalTimes"
  ) {
    stem = speedStem(candidate);
  }
  return {
    ...candidate,
    stem,
    traceability: {
      ...candidate.traceability,
      cp004EditorialV2Polish: AVG_001_CP004_EDITORIAL_V2_POLISH,
    },
  };
}
