import { getAvg001QuestionEntry } from "./library";
import type { Avg001QuestionPackage } from "./types";

export const AVG_001_PRESENTATION_QUALITY_V2 =
  "AVG-001 semantic units and Indian-format presentation v2";

type SemanticUnit =
  | "none"
  | "currency"
  | "marks"
  | "kg"
  | "years"
  | "units"
  | "runs"
  | "kmh"
  | "unitsPerHour"
  | "passengersPerTrip"
  | "count";

function groupIndianInteger(integer: string) {
  if (integer.length <= 3) return integer;
  const lastThree = integer.slice(-3);
  const leading = integer.slice(0, -3);
  return `${leading.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`;
}

export function formatIndianNumber(value: string | number) {
  const normalized = String(value).replace(/[₹,\s]/g, "");
  const match = normalized.match(/^(-?)(\d+)(\.\d+)?$/);
  if (!match) return String(value).trim();
  const [, sign, integer, decimal = ""] = match;
  return `${sign}${groupIndianInteger(integer!)}${decimal}`;
}

function scenarioKey(pkg: Avg001QuestionPackage) {
  return String(pkg.parameters.scenarioVariant)
    .replace(/^findCount_/, "")
    .replace(/^findAverage_/, "");
}

function countLabel(pkg: Avg001QuestionPackage) {
  const key = scenarioKey(pkg);
  const labels: Record<string, string> = {
    boysGirlsMarks: "girls",
    morningEveningOutput: "evening-shift workers",
    permanentContractSalary: "contract employees",
    urbanRuralSales: "rural outlets",
    twoBatchesWeight: "parcels in the second lot",
    dayNightPassengers: "night trips",
    menWomenAge: "women",
    twoSectionsScores: "students in Section B",
    branchesRevenue: "branches in the second region",
    machinesOutput: "newer machines",
    departmentsSalary: "employees in Department B",
  };
  return labels[key] ?? "members";
}

export function semanticUnitFor(pkg: Avg001QuestionPackage): SemanticUnit {
  if (pkg.parameters.answerType === "RATIO") return "none";
  if (pkg.parameters.answerType === "COUNT") return "count";
  if (
    pkg.solveMode === "findAverageSpeedEqualDistance" ||
    pkg.solveMode === "findAverageSpeedEqualTime" ||
    pkg.solveMode === "findAverageSpeedForUnequalDistances" ||
    pkg.solveMode === "findAverageSpeedForUnequalTimes"
  ) {
    const scenario = scenarioKey(pkg);
    if (scenario === "abstractEqualWeights") return "none";
    return /machine|worker/i.test(scenario) ? "unitsPerHour" : "kmh";
  }

  const entry = getAvg001QuestionEntry(pkg.questionLanguageId);
  if (entry.unitKind === "currency") return "currency";
  if (entry.unitKind === "marks") return "marks";
  if (entry.unitKind === "kg") return "kg";
  if (entry.unitKind === "years") return "years";
  if (entry.unitKind === "units") return "units";
  if (entry.unitKind === "runs") return "runs";
  if (entry.unitKind === "unitsPerHour") return "unitsPerHour";
  if (scenarioKey(pkg) === "dayNightPassengers") return "passengersPerTrip";
  return "none";
}

function bareValue(value: string) {
  return value
    .replace(/^₹\s*/, "")
    .replace(/\s*(?:marks?|kg|years?|units? per hour|units?|runs?|km\/h|passengers? per trip|members?|students?|employees?|workers?|outlets?|parcels?|people|women|girls|trips|machines|branches).*$/i, "")
    .trim();
}

export function qualifyAvg001Value(
  pkg: Avg001QuestionPackage,
  value: string,
) {
  if (/^\d+\s*:\s*\d+$/.test(value.trim())) {
    return value.replace(/\s/g, "");
  }

  const unit = semanticUnitFor(pkg);
  const bare = bareValue(value);
  const grouped = formatIndianNumber(bare);
  switch (unit) {
    case "currency":
      return `₹${grouped}`;
    case "marks":
      return `${grouped} marks`;
    case "kg":
      return `${grouped} kg`;
    case "years":
      return `${grouped} years`;
    case "units":
      return `${grouped} units`;
    case "runs":
      return `${grouped} runs`;
    case "kmh":
      return `${grouped} km/h`;
    case "unitsPerHour":
      return `${grouped} units per hour`;
    case "passengersPerTrip":
      return `${grouped} passengers per trip`;
    case "count":
      return `${grouped} ${countLabel(pkg)}`;
    default:
      return grouped;
  }
}

export function applyAvg001SemanticOptions(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const options = pkg.options.map((option) => qualifyAvg001Value(pkg, option));
  const answer = options[pkg.correctIndex]!;
  return {
    ...pkg,
    options,
    answer,
    traceability: {
      ...pkg.traceability,
      presentationQualityV2: AVG_001_PRESENTATION_QUALITY_V2,
      semanticAnswerUnit: semanticUnitFor(pkg),
    },
  };
}

export function hasConsistentSemanticOptions(pkg: Avg001QuestionPackage) {
  if (pkg.parameters.answerType === "RATIO") {
    return pkg.options.every((option) => /^\d+:\d+$/.test(option));
  }
  const unit = semanticUnitFor(pkg);
  const patterns: Record<Exclude<SemanticUnit, "none" | "count">, RegExp> = {
    currency: /^₹(?:\d{1,3}|\d{1,2}(?:,\d{2})*,\d{3})(?:\.\d+)?$/,
    marks: / marks$/,
    kg: / kg$/,
    years: / years$/,
    units: / units$/,
    runs: / runs$/,
    kmh: / km\/h$/,
    unitsPerHour: / units per hour$/,
    passengersPerTrip: / passengers per trip$/,
  };
  if (unit === "none") {
    return pkg.options.every((option) => /^-?\d+(?:\.\d+)?$/.test(option));
  }
  if (unit === "count") {
    const label = countLabel(pkg);
    return pkg.options.every((option) => option.endsWith(` ${label}`));
  }
  return pkg.options.every((option) => patterns[unit].test(option));
}
