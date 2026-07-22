import type { Avg001QuestionLanguageEntry } from "./types";

type UnitKind =
  | "none"
  | "marks"
  | "currency"
  | "kg"
  | "years"
  | "units"
  | "runs"
  | "kmh"
  | "unitsPerHour";

type PairContext = {
  first: string;
  second: string;
  members: string;
  measure: string;
  unitKind: UnitKind;
};

type MultiContext = {
  members: string;
  measure: string;
  unitKind: UnitKind;
  groupCount: 3 | 4;
};

const PAIR_CONTEXTS: Record<string, PairContext> = {
  boysGirlsMarks: { first: "boys", second: "girls", members: "students", measure: "score", unitKind: "marks" },
  morningEveningOutput: { first: "morning-shift workers", second: "evening-shift workers", members: "workers", measure: "output", unitKind: "units" },
  permanentContractSalary: { first: "permanent employees", second: "contract employees", members: "employees", measure: "salary", unitKind: "currency" },
  urbanRuralSales: { first: "urban outlets", second: "rural outlets", members: "outlets", measure: "sales", unitKind: "currency" },
  twoBatchesWeight: { first: "parcels in the first lot", second: "parcels in the second lot", members: "parcels", measure: "weight", unitKind: "kg" },
  dayNightPassengers: { first: "day trips", second: "night trips", members: "trips", measure: "passenger count", unitKind: "none" },
  menWomenAge: { first: "men", second: "women", members: "people", measure: "age", unitKind: "years" },
  twoSectionsScores: { first: "students in Section A", second: "students in Section B", members: "students", measure: "score", unitKind: "marks" },
  branchesRevenue: { first: "branches in the first region", second: "branches in the second region", members: "branches", measure: "revenue", unitKind: "currency" },
  machinesOutput: { first: "older machines", second: "newer machines", members: "machines", measure: "output", unitKind: "units" },
  departmentsSalary: { first: "employees in Department A", second: "employees in Department B", members: "employees", measure: "salary", unitKind: "currency" },
  parcelsWeight: { first: "packages in Batch A", second: "packages in Batch B", members: "packages", measure: "weight", unitKind: "kg" },
  teamsRuns: { first: "players in Team A", second: "players in Team B", members: "players", measure: "batting score", unitKind: "runs" },
  hostelGroupsExpense: { first: "residents in Hostel A", second: "residents in Hostel B", members: "residents", measure: "daily expense", unitKind: "currency" },
  villagesYield: { first: "farms in Village A", second: "farms in Village B", members: "farms", measure: "yield", unitKind: "units" },
  abstractTwoGroups: { first: "values in the first group", second: "values in the second group", members: "values", measure: "value", unitKind: "none" },
};

const MULTI_CONTEXTS: Record<string, MultiContext> = {
  threeClassesMarks: { members: "students", measure: "marks", unitKind: "marks", groupCount: 3 },
  threeShiftsOutput: { members: "workers", measure: "output", unitKind: "units", groupCount: 3 },
  threeDepartmentsSalary: { members: "employees", measure: "salary", unitKind: "currency", groupCount: 3 },
  threeWarehouseWeights: { members: "packages", measure: "weight", unitKind: "kg", groupCount: 3 },
  threeBranchSales: { members: "outlets", measure: "sales", unitKind: "currency", groupCount: 3 },
  threeAgeGroups: { members: "people", measure: "age", unitKind: "years", groupCount: 3 },
  fourBatchesMarks: { members: "candidates", measure: "scores", unitKind: "marks", groupCount: 4 },
  fourUnitsOutput: { members: "machines", measure: "output", unitKind: "units", groupCount: 4 },
  fourTeamsRuns: { members: "players", measure: "runs", unitKind: "runs", groupCount: 4 },
  fourDepartmentsSalary: { members: "employees", measure: "salary", unitKind: "currency", groupCount: 4 },
  fourParcelLots: { members: "parcels", measure: "weight", unitKind: "kg", groupCount: 4 },
  fourAbstractGroups: { members: "values", measure: "value", unitKind: "none", groupCount: 4 },
};

function unitText(kind: UnitKind, value: string) {
  if (kind === "currency") return `₹${value}`;
  if (kind === "kg") return `${value} kg`;
  if (kind === "years") return `${value} years`;
  if (kind === "units") return `${value} units`;
  if (kind === "marks") return `${value} marks`;
  if (kind === "runs") return `${value} runs`;
  if (kind === "kmh") return `${value} km/h`;
  if (kind === "unitsPerHour") return `${value} units per hour`;
  return value;
}

function qlNumber(qlId: string) {
  return Number(qlId.split("-").at(-1));
}

function pairTemplate(context: PairContext, index: number) {
  const average1 = unitText(context.unitKind, "{average1}");
  const average2 = unitText(context.unitKind, "{average2}");
  const patterns = [
    `{count1} ${context.first} average ${average1}, whereas {count2} ${context.second} average ${average2}. Find the average for all ${context.members}.`,
    `Group A has {count1} ${context.first} with average ${average1}. Group B has {count2} ${context.second} with average ${average2}. Find the combined average ${context.measure}.`,
    `The first set contains {count1} ${context.first} at an average ${context.measure} of ${average1}. The second contains {count2} ${context.second} at ${average2}. Find the overall average.`,
    `When {count1} ${context.first} averaging ${average1} are combined with {count2} ${context.second} averaging ${average2}, what is the new average ${context.measure}?`,
    `A combined group is formed from {count1} ${context.first} and {count2} ${context.second}. Their respective averages are ${average1} and ${average2}. Find the combined average ${context.measure}.`,
    `The average ${context.measure} of {count1} ${context.first} is ${average1}. For {count2} ${context.second}, it is ${average2}. Determine the weighted average for all ${context.members}.`,
  ];
  return patterns[index % patterns.length]!;
}

function multiTemplate(context: MultiContext, index: number) {
  const counts = Array.from({ length: context.groupCount }, (_, groupIndex) => `{count${groupIndex + 1}}`);
  const averages = Array.from({ length: context.groupCount }, (_, groupIndex) =>
    unitText(context.unitKind, `{average${groupIndex + 1}}`),
  );
  const groupNames =
    context.groupCount === 3 ? "Groups A, B and C" : "Groups A, B, C and D";
  const ordinalGroups =
    context.groupCount === 3 ? "first, second and third groups" : "first, second, third and fourth groups";
  const patterns = [
    `${groupNames} contain ${counts.join(", ")} ${context.members}, with respective averages ${averages.join(", ")}. Find the combined average ${context.measure}.`,
    `${context.groupCount} groups of ${context.members} have sizes ${counts.join(", ")} and averages ${averages.join(", ")} respectively. Find the overall average ${context.measure}.`,
    `The ${ordinalGroups} contain ${counts.join(", ")} ${context.members} and average ${averages.join(", ")} respectively. Find their weighted average.`,
    `For ${context.groupCount} groups of ${context.members}, the counts are ${counts.join(", ")} and the averages are ${averages.join(", ")}. Find the combined average.`,
  ];
  return patterns[index % patterns.length]!;
}

function countTemplate(context: PairContext, index: number) {
  const knownAverage = unitText(context.unitKind, "{knownAverage}");
  const unknownAverage = unitText(context.unitKind, "{unknownAverage}");
  const combinedAverage = unitText(context.unitKind, "{combinedAverage}");
  const patterns = [
    `{knownCount} ${context.first} average ${knownAverage}. Some ${context.second} average ${unknownAverage}. Together they average ${combinedAverage}. Find the number of ${context.second}.`,
    `{knownCount} ${context.first} at ${knownAverage} are joined by ${context.second} at ${unknownAverage}. The overall average is ${combinedAverage}. How many joined?`,
    `{knownCount} ${context.first} and some ${context.second} have combined average ${combinedAverage}. Their group averages are ${knownAverage} and ${unknownAverage}. Find the second group's size.`,
    `{knownCount} ${context.first} average ${knownAverage}; the ${context.second} average ${unknownAverage}. Their combined average is ${combinedAverage}. Find the second-group count.`,
    `Some ${context.second} at ${unknownAverage} join {knownCount} ${context.first} at ${knownAverage}. The combined average is ${combinedAverage}. How many joined?`,
  ];
  return patterns[index % patterns.length]!;
}

function missingTemplate(context: PairContext, index: number) {
  const average1 = unitText(context.unitKind, "{average1}");
  const combinedAverage = unitText(context.unitKind, "{combinedAverage}");
  const patterns = [
    `{count1} ${context.first} average ${average1}. With {count2} ${context.second}, all ${context.members} average ${combinedAverage}. Find the second group's average ${context.measure}.`,
    `{count1} ${context.first} have average ${average1}. After {count2} ${context.second} are added, the combined average is ${combinedAverage}. Find the second-group average.`,
    `{count1} ${context.first} and {count2} ${context.second} average ${combinedAverage} together. If the first group averages ${average1}, find the average of ${context.second}.`,
    `{count1} ${context.first} at average ${average1} are merged with {count2} ${context.second}. The new average is ${combinedAverage}. Determine the missing group average.`,
    `Two groups contain {count1} ${context.first} and {count2} ${context.second}. The first averages ${average1}; together they average ${combinedAverage}. Find the second average.`,
  ];
  return patterns[index % patterns.length]!;
}

export function applyAvg001Cp004StemVariant<T extends Avg001QuestionLanguageEntry>(
  entry: T,
): T {
  if (entry.cpId !== "AVG-CP-004") return entry;

  const index = qlNumber(entry.qlId);
  let template = entry.template;

  if (entry.solveMode === "findCombinedAverageOfTwoGroups") {
    const context = PAIR_CONTEXTS[entry.scenarioVariant];
    if (context) template = pairTemplate(context, index);
  } else if (entry.solveMode === "findCombinedAverageOfThreeOrFourGroups") {
    const context = MULTI_CONTEXTS[entry.scenarioVariant];
    if (context) template = multiTemplate(context, index);
  } else if (entry.solveMode === "findGroupCountFromCombinedAverage") {
    const key = entry.scenarioVariant.replace(/^findCount_/, "");
    const context = PAIR_CONTEXTS[key];
    if (context) template = countTemplate(context, index);
  } else if (entry.solveMode === "findMissingGroupAverage") {
    const key = entry.scenarioVariant.replace(/^findAverage_/, "");
    const context = PAIR_CONTEXTS[key];
    if (context) template = missingTemplate(context, index);
  }

  return template === entry.template ? entry : { ...entry, template };
}
