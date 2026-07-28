import { getAvg001QuestionEntry } from "./library";
import { applyAvg001Cp004EditorialV2 } from "./cp004-editorial-v2";
import { formatIndianNumber } from "./presentation-quality-v2";
import type { Avg001QuestionPackage, Rational } from "./types";
import { toNumber } from "./math";

export const AVG_001_CP004_EDITORIAL_V2_POLISH =
  "AVG-CP-004 editorial v2 final stem polish v1";

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

const COUNT_CONTEXTS: Record<string, { setting: string; first: string; second: string; collection: string; measure: string }> = {
  boysGirlsMarks: { setting: "In a school examination", first: "boys", second: "girls", collection: "students", measure: "score" },
  morningEveningOutput: { setting: "In a factory", first: "morning-shift workers", second: "evening-shift workers", collection: "workers", measure: "daily output" },
  permanentContractSalary: { setting: "In a company", first: "permanent employees", second: "contract employees", collection: "employees", measure: "monthly salary" },
  urbanRuralSales: { setting: "A retail company operates", first: "urban outlets", second: "rural outlets", collection: "outlets", measure: "monthly sales" },
  twoBatchesWeight: { setting: "A warehouse contains", first: "parcels in the first lot", second: "parcels in the second lot", collection: "parcels", measure: "weight" },
  dayNightPassengers: { setting: "A transport service records", first: "day trips", second: "night trips", collection: "trips", measure: "passenger count" },
  menWomenAge: { setting: "A community survey includes", first: "men", second: "women", collection: "people", measure: "age" },
  twoSectionsScores: { setting: "A school has", first: "students in Section A", second: "students in Section B", collection: "students", measure: "test score" },
  branchesRevenue: { setting: "A company has", first: "branches in the first region", second: "branches in the second region", collection: "branches", measure: "monthly revenue" },
  machinesOutput: { setting: "A production unit uses", first: "older machines", second: "newer machines", collection: "machines", measure: "hourly output" },
  departmentsSalary: { setting: "An organisation has", first: "employees in Department A", second: "employees in Department B", collection: "employees", measure: "monthly salary" },
};

function countStem(pkg: Avg001QuestionPackage) {
  const context = COUNT_CONTEXTS[key(pkg)]!;
  if (!context) return pkg.stem;
  return `${context.setting} ${raw(pkg, "knownCount")} ${context.first} with an average ${context.measure} of ${metric(pkg, raw(pkg, "knownAverage"))}. The ${context.second} have an average ${context.measure} of ${metric(pkg, raw(pkg, "unknownAverage"))}, while the average for all ${context.collection} is ${metric(pkg, raw(pkg, "combinedAverage"))}. How many ${context.second} are there?`;
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

function multiTarget(pkg: Avg001QuestionPackage) {
  const scenario = key(pkg);
  if (/Marks/.test(scenario)) return "average marks";
  if (/Salary/.test(scenario)) return "average monthly salary";
  if (/Weight|Parcel/.test(scenario)) return "average weight";
  if (/Age/.test(scenario)) return "average age";
  if (/Runs|Teams/.test(scenario)) return "average runs";
  if (/Output|Units/.test(scenario)) return "average output";
  if (/Sales/.test(scenario)) return "average sales";
  return "average value";
}

function multiStem(pkg: Avg001QuestionPackage) {
  const labels = MULTI_LABELS[key(pkg)] ?? ["Group A", "Group B", "Group C"];
  const clauses = labels.map((label, index) =>
    `${label} has ${raw(pkg, `count${index + 1}`)} members with an average of ${metric(pkg, raw(pkg, `average${index + 1}`))}`,
  );
  return `${clauses.slice(0, -1).join(", ")}, and ${clauses.at(-1)}. What is the combined ${multiTarget(pkg)} across all the groups?`;
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
  const subject = speedSubject(pkg);
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

export function applyAvg001Cp004EditorialV2Candidate(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  const candidate = applyAvg001Cp004EditorialV2(pkg);
  if (candidate.canonicalProblemId !== "AVG-CP-004" || candidate.language !== "en") return candidate;
  let stem = candidate.stem;
  if (candidate.solveMode === "findGroupCountFromCombinedAverage") stem = countStem(candidate);
  if (candidate.solveMode === "findCombinedAverageOfThreeOrFourGroups") stem = multiStem(candidate);
  if (candidate.solveMode === "findAverageSpeedForUnequalDistances" || candidate.solveMode === "findAverageSpeedForUnequalTimes") stem = speedStem(candidate);
  return {
    ...candidate,
    stem,
    traceability: {
      ...candidate.traceability,
      cp004EditorialV2Polish: AVG_001_CP004_EDITORIAL_V2_POLISH,
    },
  };
}
