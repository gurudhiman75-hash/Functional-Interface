import type {
  Avg001Difficulty,
  Avg001DisplayPolicy,
  Avg001QuestionLanguageEntry,
  Avg001SolveMode,
} from "./types";

type UnitKind = "none" | "marks" | "currency" | "kg" | "years" | "units" | "runs" | "kmh" | "unitsPerHour";

type PairContext = {
  variant: string;
  domain: string;
  first: string;
  second: string;
  members: string;
  measure: string;
  unitKind: UnitKind;
  finalContext: string;
};

type MultiContext = {
  variant: string;
  domain: string;
  members: string;
  measure: string;
  unitKind: UnitKind;
  finalContext: string;
  groupCount: 3 | 4;
};

const unitText = (kind: UnitKind, value: string) => {
  if (kind === "currency") return `₹${value}`;
  if (kind === "kg") return `${value} kg`;
  if (kind === "years") return `${value} years`;
  if (kind === "units") return `${value} units`;
  if (kind === "marks") return `${value} marks`;
  if (kind === "runs") return `${value} runs`;
  if (kind === "kmh") return `${value} km/h`;
  if (kind === "unitsPerHour") return `${value} units per hour`;
  return value;
};

const pairContexts: PairContext[] = [
  { variant: "boysGirlsMarks", domain: "Classroom", first: "boys", second: "girls", members: "students", measure: "score", unitKind: "marks", finalContext: "combined average marks" },
  { variant: "morningEveningOutput", domain: "Factory", first: "morning-shift workers", second: "evening-shift workers", members: "workers", measure: "output", unitKind: "units", finalContext: "combined average output" },
  { variant: "permanentContractSalary", domain: "Workplace", first: "permanent employees", second: "contract employees", members: "employees", measure: "salary", unitKind: "currency", finalContext: "combined average salary" },
  { variant: "urbanRuralSales", domain: "Commerce", first: "urban outlets", second: "rural outlets", members: "outlets", measure: "sales", unitKind: "currency", finalContext: "overall average sales" },
  { variant: "twoBatchesWeight", domain: "Logistics", first: "parcels in the first lot", second: "parcels in the second lot", members: "parcels", measure: "weight", unitKind: "kg", finalContext: "combined average weight" },
  { variant: "dayNightPassengers", domain: "Transport", first: "day trips", second: "night trips", members: "trips", measure: "passenger count", unitKind: "none", finalContext: "average passengers per trip" },
  { variant: "menWomenAge", domain: "Community", first: "men", second: "women", members: "people", measure: "age", unitKind: "years", finalContext: "combined average age" },
  { variant: "twoSectionsScores", domain: "Classroom", first: "students in Section A", second: "students in Section B", members: "students", measure: "score", unitKind: "marks", finalContext: "class average score" },
  { variant: "branchesRevenue", domain: "Commerce", first: "branches in the first region", second: "branches in the second region", members: "branches", measure: "revenue", unitKind: "currency", finalContext: "combined average revenue" },
  { variant: "machinesOutput", domain: "Factory", first: "older machines", second: "newer machines", members: "machines", measure: "output", unitKind: "units", finalContext: "overall average output" },
  { variant: "departmentsSalary", domain: "Workplace", first: "employees in Department A", second: "employees in Department B", members: "employees", measure: "salary", unitKind: "currency", finalContext: "combined average salary" },
  { variant: "parcelsWeight", domain: "Logistics", first: "packages in Batch A", second: "packages in Batch B", members: "packages", measure: "weight", unitKind: "kg", finalContext: "average package weight" },
  { variant: "teamsRuns", domain: "Sports", first: "players in Team A", second: "players in Team B", members: "players", measure: "batting score", unitKind: "runs", finalContext: "combined batting average" },
  { variant: "hostelGroupsExpense", domain: "Household", first: "residents in Hostel A", second: "residents in Hostel B", members: "residents", measure: "daily expense", unitKind: "currency", finalContext: "combined average daily expense" },
  { variant: "villagesYield", domain: "Agriculture", first: "farms in Village A", second: "farms in Village B", members: "farms", measure: "yield", unitKind: "units", finalContext: "combined average yield" },
  { variant: "abstractTwoGroups", domain: "Abstract", first: "values in the first group", second: "values in the second group", members: "values", measure: "value", unitKind: "none", finalContext: "combined average" },
];

const multiContexts: MultiContext[] = [
  { variant: "threeClassesMarks", domain: "Classroom", members: "students", measure: "marks", unitKind: "marks", finalContext: "combined average marks", groupCount: 3 },
  { variant: "threeShiftsOutput", domain: "Factory", members: "workers", measure: "output", unitKind: "units", finalContext: "overall average output", groupCount: 3 },
  { variant: "threeDepartmentsSalary", domain: "Workplace", members: "employees", measure: "salary", unitKind: "currency", finalContext: "combined average salary", groupCount: 3 },
  { variant: "threeWarehouseWeights", domain: "Logistics", members: "packages", measure: "weight", unitKind: "kg", finalContext: "combined average weight", groupCount: 3 },
  { variant: "threeBranchSales", domain: "Commerce", members: "outlets", measure: "sales", unitKind: "currency", finalContext: "overall average sales", groupCount: 3 },
  { variant: "threeAgeGroups", domain: "Community", members: "people", measure: "age", unitKind: "years", finalContext: "combined average age", groupCount: 3 },
  { variant: "fourBatchesMarks", domain: "Classroom", members: "candidates", measure: "scores", unitKind: "marks", finalContext: "combined average score", groupCount: 4 },
  { variant: "fourUnitsOutput", domain: "Factory", members: "machines", measure: "output", unitKind: "units", finalContext: "overall average output", groupCount: 4 },
  { variant: "fourTeamsRuns", domain: "Sports", members: "players", measure: "runs", unitKind: "runs", finalContext: "combined batting average", groupCount: 4 },
  { variant: "fourDepartmentsSalary", domain: "Workplace", members: "employees", measure: "salary", unitKind: "currency", finalContext: "combined average salary", groupCount: 4 },
  { variant: "fourParcelLots", domain: "Logistics", members: "parcels", measure: "weight", unitKind: "kg", finalContext: "combined average weight", groupCount: 4 },
  { variant: "fourAbstractGroups", domain: "Abstract", members: "values", measure: "value", unitKind: "none", finalContext: "overall average", groupCount: 4 },
];

function pairTemplate(context: PairContext, index: number) {
  const a1 = unitText(context.unitKind, "{average1}");
  const a2 = unitText(context.unitKind, "{average2}");
  const patterns = [
    `{count1} ${context.first} have an average ${context.measure} of ${a1}, while {count2} ${context.second} average ${a2}. Find the combined average.`,
    `One group has {count1} ${context.first} averaging ${a1}; another has {count2} ${context.second} averaging ${a2}. Find the overall average ${context.measure}.`,
    `The average ${context.measure} is ${a1} for {count1} ${context.first} and ${a2} for {count2} ${context.second}. Find the average for all ${context.members}.`,
  ];
  return patterns[index % patterns.length]!;
}

function multiTemplate(context: MultiContext) {
  const values = Array.from({ length: context.groupCount }, (_, index) =>
    unitText(context.unitKind, `{average${index + 1}}`),
  );
  const counts = Array.from({ length: context.groupCount }, (_, index) => `{count${index + 1}}`);
  return `${context.groupCount === 3 ? "Three" : "Four"} groups contain ${counts.join(", ")} ${context.members}, with average ${context.measure} ${values.join(", ")} respectively. Find the combined average.`;
}

function makeEntry(input: {
  id: number;
  solveMode: Avg001SolveMode;
  difficulty: Avg001Difficulty;
  answerType: Avg001QuestionLanguageEntry["answerType"];
  contextDomain: string;
  scenarioVariant: string;
  template: string;
  requiredVariables: string[];
  strategy: string;
  distractors: string[];
  displayPolicy: Avg001DisplayPolicy;
  finalContext: string;
  unitKind: UnitKind;
}): Avg001QuestionLanguageEntry {
  return {
    cpId: "AVG-CP-004",
    qlId: `AVG-QL-${String(input.id).padStart(3, "0")}`,
    taskKind: "weightedCombinedAggregationApplication",
    solveMode: input.solveMode,
    difficulty: input.difficulty,
    answerType: input.answerType,
    contextDomain: input.contextDomain,
    scenarioVariant: input.scenarioVariant,
    template: input.template,
    requiredVariables: input.requiredVariables,
    explanationStrategyId: input.strategy,
    distractorStrategyIds: input.distractors,
    displayPolicy: input.displayPolicy,
    active: true,
    finalContext: input.finalContext,
    unitKind: input.unitKind,
  };
}

const twoDifficulty: Avg001Difficulty[] = ["Easy","Easy","Easy","Easy","Easy","Easy","Medium","Medium","Medium","Medium","Medium","Hard","Hard","Hard","Hard","Hard"];
const multiDifficulty: Avg001Difficulty[] = ["Easy","Easy","Easy","Medium","Medium","Medium","Medium","Hard","Hard","Hard","Hard","Hard"];
const countDifficulty: Avg001Difficulty[] = ["Easy","Easy","Easy","Medium","Medium","Medium","Medium","Hard","Hard","Hard","Hard"];
const missingDifficulty: Avg001Difficulty[] = ["Easy","Easy","Easy","Medium","Medium","Medium","Medium","Hard","Hard","Hard","Hard"];
const distanceDifficulty: Avg001Difficulty[] = ["Easy","Easy","Medium","Medium","Medium","Hard","Hard","Hard"];
const timeDifficulty: Avg001Difficulty[] = ["Easy","Easy","Easy","Easy","Medium","Medium","Hard"];

const twoGroupEntries = pairContexts.map((context, index) =>
  makeEntry({
    id: 209 + index,
    solveMode: "findCombinedAverageOfTwoGroups",
    difficulty: twoDifficulty[index]!,
    answerType: "AVERAGE",
    contextDomain: context.domain,
    scenarioVariant: context.variant,
    template: pairTemplate(context, index),
    requiredVariables: ["count1", "average1", "count2", "average2"],
    strategy: ["weighted-two-total", "weighted-two-balance", "weighted-two-deviation"][index % 3]!,
    distractors: ["unweightedMeanTrap", "ignoreLargerGroup", "nearWeightedError"],
    displayPolicy: index % 4 === 3 ? "EXACT_DECIMAL_1" : "EXACT_INTEGER",
    finalContext: context.finalContext,
    unitKind: context.unitKind,
  }),
);

const multiEntries = multiContexts.map((context, index) =>
  makeEntry({
    id: 225 + index,
    solveMode: "findCombinedAverageOfThreeOrFourGroups",
    difficulty: multiDifficulty[index]!,
    answerType: "AVERAGE",
    contextDomain: context.domain,
    scenarioVariant: context.variant,
    template: multiTemplate(context),
    requiredVariables: Array.from({ length: context.groupCount }, (_, groupIndex) => [
      `count${groupIndex + 1}`,
      `average${groupIndex + 1}`,
    ]).flat(),
    strategy: ["weighted-multi-total", "weighted-multi-table", "weighted-multi-balance"][index % 3]!,
    distractors: ["unweightedMeanTrap", "omitOneGroup", "nearWeightedError"],
    displayPolicy: index % 3 === 1 ? "EXACT_DECIMAL_1" : "EXACT_INTEGER",
    finalContext: context.finalContext,
    unitKind: context.unitKind,
  }),
);

const countContexts = pairContexts.slice(0, 11);
const countEntries = countContexts.map((context, index) => {
  const knownAverage = unitText(context.unitKind, "{knownAverage}");
  const unknownAverage = unitText(context.unitKind, "{unknownAverage}");
  const combinedAverage = unitText(context.unitKind, "{combinedAverage}");
  const template = `{knownCount} ${context.first} average ${knownAverage}. ${context.second} average ${unknownAverage}, and all ${context.members} average ${combinedAverage}. Find the number of ${context.second}.`;
  return makeEntry({
    id: 237 + index,
    solveMode: "findGroupCountFromCombinedAverage",
    difficulty: countDifficulty[index]!,
    answerType: "COUNT",
    contextDomain: context.domain,
    scenarioVariant: `findCount_${context.variant}`,
    template,
    requiredVariables: ["knownCount", "knownAverage", "unknownAverage", "combinedAverage"],
    strategy: ["weighted-count-total-gap", "weighted-count-equation", "weighted-count-deviation"][index % 3]!,
    distractors: ["knownCountTrap", "countOffByOne", "reverseRatioTrap"],
    displayPolicy: "EXACT_INTEGER",
    finalContext: `number of ${context.second}`,
    unitKind: "none",
  });
});

const missingContexts = pairContexts.slice(0, 11);
const missingEntries = missingContexts.map((context, index) => {
  const average1 = unitText(context.unitKind, "{average1}");
  const combinedAverage = unitText(context.unitKind, "{combinedAverage}");
  const template = `{count1} ${context.first} average ${average1}. With {count2} ${context.second}, all ${context.members} average ${combinedAverage}. Find the average ${context.measure} of ${context.second}.`;
  return makeEntry({
    id: 248 + index,
    solveMode: "findMissingGroupAverage",
    difficulty: missingDifficulty[index]!,
    answerType: "AVERAGE",
    contextDomain: context.domain,
    scenarioVariant: `findAverage_${context.variant}`,
    template,
    requiredVariables: ["count1", "average1", "count2", "combinedAverage"],
    strategy: ["weighted-missing-total-gap", "weighted-missing-equation", "weighted-missing-balance"][index % 3]!,
    distractors: ["combinedAverageTrap", "knownAverageTrap", "nearWeightedError"],
    displayPolicy: index % 4 === 2 ? "EXACT_DECIMAL_1" : "EXACT_INTEGER",
    finalContext: `average ${context.measure} of ${context.second}`,
    unitKind: context.unitKind,
  });
});

const speedContexts = [
  ["roundTripCar", "Transport", "A car travels the same distance at {speed1} km/h and {speed2} km/h. Find its average speed for the whole journey.", "average speed"],
  ["outAndBackBus", "Transport", "A bus covers equal distances at {speed1} km/h and {speed2} km/h. Find the average speed.", "average bus speed"],
  ["twoEqualRoadSections", "Transport", "A vehicle covers two equal road sections at {speed1} km/h and {speed2} km/h. Find the journey's average speed.", "average journey speed"],
  ["trainEqualDistances", "Transport", "A train runs equal distances at {speed1} km/h and {speed2} km/h. Find its average speed.", "average train speed"],
  ["cyclistReturnTrip", "Transport", "A cyclist goes and returns over the same distance at {speed1} km/h and {speed2} km/h. Find the average speed.", "average cycling speed"],
  ["deliveryEqualLegs", "Transport", "A delivery van covers two equal-distance legs at {speed1} km/h and {speed2} km/h. Find its average speed.", "average delivery speed"],
  ["boatEqualRiverLegs", "Transport", "A boat covers two equal-distance legs at {speed1} km/h and {speed2} km/h. Find the average speed for both legs.", "average boat speed"],
  ["runnerEqualLaps", "Sports", "A runner covers two equal-distance laps at {speed1} km/h and {speed2} km/h. Find the average speed.", "average running speed"],
] as const;

const distanceEntries = speedContexts.map(([variant, domain, template, finalContext], index) =>
  makeEntry({
    id: 259 + index,
    solveMode: "findAverageSpeedEqualDistance",
    difficulty: distanceDifficulty[index]!,
    answerType: "AVERAGE",
    contextDomain: domain,
    scenarioVariant: variant,
    template,
    requiredVariables: ["speed1", "speed2"],
    strategy: ["speed-harmonic-time", "speed-harmonic-formula", "speed-equal-distance"][index % 3]!,
    distractors: ["arithmeticMeanTrap", "lowerSpeedTrap", "nearSpeedError"],
    displayPolicy: [0, 1, 3].includes(index) ? "EXACT_INTEGER" : "EXACT_DECIMAL_1",
    finalContext,
    unitKind: "kmh",
  }),
);

const equalTimeContexts = [
  ["carEqualHours", "Transport", "A car travels for equal time at {speed1} km/h and {speed2} km/h. Find its average speed.", "average speed", "kmh"],
  ["busEqualTime", "Transport", "A bus runs for the same amount of time at {speed1} km/h and {speed2} km/h. Find the average speed.", "average bus speed", "kmh"],
  ["trainEqualTime", "Transport", "A train travels for equal durations at {speed1} km/h and {speed2} km/h. Find its average speed.", "average train speed", "kmh"],
  ["bikeEqualTime", "Transport", "A motorbike is ridden for equal time at {speed1} km/h and {speed2} km/h. Find the average speed.", "average riding speed", "kmh"],
  ["machineEqualTimeRates", "Factory", "A machine operates for equal time at {speed1} units per hour and {speed2} units per hour. Find its average production rate.", "average production rate", "unitsPerHour"],
  ["workerEqualTimeRates", "Factory", "A worker produces for equal time at {speed1} units per hour and {speed2} units per hour. Find the average output rate.", "average output rate", "unitsPerHour"],
  ["abstractEqualWeights", "Abstract", "Two rates, {speed1} and {speed2}, apply for equal time. Find their average rate.", "average rate", "none"],
] as const;

const timeEntries = equalTimeContexts.map(([variant, domain, template, finalContext, unitKind], index) =>
  makeEntry({
    id: 267 + index,
    solveMode: "findAverageSpeedEqualTime",
    difficulty: timeDifficulty[index]!,
    answerType: "AVERAGE",
    contextDomain: domain,
    scenarioVariant: variant,
    template,
    requiredVariables: ["speed1", "speed2"],
    strategy: ["speed-equal-time-mean", "speed-equal-time-total", "speed-equal-time-balance"][index % 3]!,
    distractors: ["harmonicMeanTrap", "lowerSpeedTrap", "nearSpeedError"],
    displayPolicy: index % 3 === 2 ? "EXACT_DECIMAL_1" : "EXACT_INTEGER",
    finalContext,
    unitKind: unitKind as UnitKind,
  }),
);

export const cp004Entries: Avg001QuestionLanguageEntry[] = [
  ...twoGroupEntries,
  ...multiEntries,
  ...countEntries,
  ...missingEntries,
  ...distanceEntries,
  ...timeEntries,
];
