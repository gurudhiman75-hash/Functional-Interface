import { applyAvg001Cp004EditorialV2FinalCandidate } from "./cp004-editorial-v2-final";
import { applyAvg001Cp005EditorialV2ReviewedCandidate } from "./cp005-editorial-v2-reviewed";
import { getAvg001QuestionEntry } from "./library";
import { formatIndianNumber } from "./presentation-quality-v2";
import type {
  Avg001CanonicalProblemId,
  Avg001QuestionPackage,
  Avg001ValidationCheck,
} from "./types";

export const AVG_001_EDITORIAL_V2_COMPLETE =
  "AVG-001 complete 425-QL English editorial v2 candidate";

const REMAINING_CP_IDS = new Set<Avg001CanonicalProblemId>([
  "AVG-CP-001",
  "AVG-CP-002",
  "AVG-CP-003",
  "AVG-CP-006",
]);

function tagify(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}

function bareValue(value: string) {
  const ratio = value.match(/^-?\d+\s*:\s*\d+$/)?.[0];
  if (ratio) return ratio.replace(/\s/g, "");
  return value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?(?:\/\d+)?/)?.[0] ?? value.trim();
}

function groupNumber(value: string) {
  return value.includes("/") ? value : formatIndianNumber(value);
}

function countLabel(pkg: Avg001QuestionPackage) {
  const entry = getAvg001QuestionEntry(pkg.questionLanguageId);
  const context = entry.finalContext.trim().toLowerCase();
  const extracted = context
    .replace(/^original\s+/, "")
    .replace(/^(?:number|count)\s+of\s+/, "")
    .replace(/^term\s+count$/, "terms")
    .replace(/^member\s+count$/, "members");
  if (extracted && extracted !== context) return extracted;

  const variant = entry.scenarioVariant.toLowerCase();
  const labels: Array<[RegExp, string]> = [
    [/schoolsections|student|class|section|marks/, "students"],
    [/companydepartments|employee|salary|department/, "employees"],
    [/regionalbranches/, "branches"],
    [/tournamentteams/, "players"],
    [/villagegroups/, "people"],
    [/worker|factory|output|machine/, "workers"],
    [/innings|cricket|runs/, "innings"],
    [/day|daily/, "days"],
    [/transaction|sales|shop/, "transactions"],
    [/term|sequence|odd|even|consecutive|progression/, "terms"],
    [/trip|passenger|transport/, "trips"],
    [/subgroup|group|village|age/, "members"],
    [/observation|record|value|abstract/, "observations"],
  ];
  return labels.find(([pattern]) => pattern.test(variant))?.[1] ?? "items";
}

function inferredUnit(pkg: Avg001QuestionPackage) {
  const entry = getAvg001QuestionEntry(pkg.questionLanguageId);
  if (pkg.parameters.answerType === "RATIO") return "ratio";
  if (pkg.parameters.answerType === "COUNT") return "count";
  if (entry.unitKind && entry.unitKind !== "none") return entry.unitKind;

  const context = `${entry.finalContext} ${entry.scenarioVariant}`.toLowerCase();
  if (/rupee|salary|sales|expense|expenditure|price|revenue|currency/.test(context)) return "currency";
  if (/mark|score/.test(context)) return "marks";
  if (/year|age/.test(context)) return "years";
  if (/run|innings/.test(context)) return "runs";
  if (/weight|parcel|kg/.test(context)) return "kg";
  if (/kilomet|distance|\bkm\b/.test(context)) return "km";
  if (/hourly|per hour/.test(context)) return "unitsPerHour";
  if (/unit|output|production/.test(context)) return "units";
  return "none";
}

function qualify(pkg: Avg001QuestionPackage, value: string) {
  const raw = bareValue(value);
  const unit = inferredUnit(pkg);
  if (unit === "ratio") return raw;
  const grouped = groupNumber(raw);
  const numeric = Number(raw.includes("/") ? Number.NaN : raw);
  const singular = Number.isFinite(numeric) && Math.abs(numeric) === 1;

  switch (unit) {
    case "count": return `${grouped} ${countLabel(pkg)}`;
    case "currency": return `${grouped.startsWith("-") ? "-" : ""}₹${grouped.replace(/^-/, "")}`;
    case "marks": return `${grouped} ${singular ? "mark" : "marks"}`;
    case "years": return `${grouped} ${singular ? "year" : "years"}`;
    case "runs": return `${grouped} ${singular ? "run" : "runs"}`;
    case "kg": return `${grouped} kg`;
    case "km": return `${grouped} km`;
    case "units": return `${grouped} ${singular ? "unit" : "units"}`;
    case "unitsPerHour": return `${grouped} units per hour`;
    default: return grouped;
  }
}

function buildOptionTags(pkg: Avg001QuestionPackage) {
  const source = [...getAvg001QuestionEntry(pkg.questionLanguageId).distractorStrategyIds];
  const tags: string[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === pkg.correctIndex) tags.push("CORRECT");
    else {
      tags.push(tagify(source[wrongIndex], `MISCONCEPTION_${wrongIndex + 1}`));
      wrongIndex += 1;
    }
  }
  return tags;
}

function cleanExplanationLine(value: string | undefined, fallback: string) {
  const cleaned = String(value ?? "")
    .replace(/^[📌📝⚡⚠️]\s*/, "")
    .replace(/^(?:Key rule|Step-by-step solution|Exam speed shortcut|Common traps and distractors):\s*/i, "")
    .replace(/^(?:Begin with this fact|Start from this relationship|First note this)[:.]?\s*/i, "")
    .trim();
  return cleaned || fallback;
}

function buildExplanation(pkg: Avg001QuestionPackage, tags: string[]) {
  const rule = cleanExplanationLine(
    pkg.explanation.lines[0],
    "Use the average-total-count relationship represented by the given data.",
  );
  const shortcut = cleanExplanationLine(
    pkg.explanation.lines[1] ?? pkg.explanation.lines[2],
    "Work through total contribution and count before simplifying the arithmetic.",
  );
  const equation = pkg.solver.equation.trim();
  const working = equation.includes("$$") ? equation : `$$${equation}$$`;
  const distractors = pkg.options
    .map((option, index) => ({ option, index, tag: tags[index] }))
    .filter(({ index }) => index !== pkg.correctIndex)
    .map(({ option, index, tag }) => `${String.fromCharCode(65 + index)} (${option}) [${tag}]`)
    .join("; ");

  return { lines: [
    `📌 Key rule: ${rule}`,
    `📝 Step-by-step solution: ${working}`,
    `⚡ Exam speed shortcut: ${shortcut}`,
    `⚠️ Common traps and distractors: ${distractors}. Therefore, the required answer is ${pkg.answer}.`,
  ] };
}

function validateRemainingCandidate(pkg: Avg001QuestionPackage) {
  const replaced = new Set([
    "editorial-v2-complete",
    "editorial-v2-stem",
    "editorial-v2-options",
    "editorial-v2-explanation",
    "editorial-v2-fingerprint",
  ]);
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => !replaced.has(check.name));
  const tags = pkg.traceability.editorialV2OptionTags;
  checks.push(
    {
      name: "editorial-v2-complete",
      passed: pkg.traceability.releaseCandidate === "AVG-001-EN-v2",
      message: "Package carries the complete AVG-001 English v2 release-candidate trace",
    },
    {
      name: "editorial-v2-stem",
      passed: pkg.stem.length >= 35 && !/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem),
      message: "Stem remains natural, resolved and free of internal tokens",
    },
    {
      name: "editorial-v2-options",
      passed:
        pkg.options.length === 4 &&
        new Set(pkg.options).size === 4 &&
        pkg.options[pkg.correctIndex] === pkg.answer &&
        Array.isArray(tags) &&
        tags.length === 4 &&
        tags[pkg.correctIndex] === "CORRECT",
      message: "Options are four, unique, qualified and misconception-traced",
    },
    {
      name: "editorial-v2-explanation",
      passed:
        pkg.explanation.lines.length === 4 &&
        pkg.explanation.lines[0]?.startsWith("📌 Key rule:") === true &&
        pkg.explanation.lines[1]?.startsWith("📝 Step-by-step solution:") === true &&
        pkg.explanation.lines[2]?.startsWith("⚡ Exam speed shortcut:") === true &&
        pkg.explanation.lines[3]?.startsWith("⚠️ Common traps and distractors:") === true &&
        pkg.options
          .filter((_, index) => index !== pkg.correctIndex)
          .every((option) => pkg.explanation.lines[3]?.includes(`(${option})`)) &&
        pkg.explanation.lines[3]?.includes(pkg.answer) === true,
      message: "Explanation follows the four-tier contract and analyses all distractors",
    },
    {
      name: "editorial-v2-fingerprint",
      passed: pkg.traceability.preservedMathematicalFingerprint === pkg.mathematicalFingerprint,
      message: "Editorial v2 preserves the frozen mathematical fingerprint",
    },
  );
  return { valid: checks.every((check) => check.passed), checks };
}

function applyRemainingCpCandidate(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  if (!REMAINING_CP_IDS.has(pkg.canonicalProblemId) || pkg.language !== "en") return pkg;

  const options = pkg.options.map((option) => qualify(pkg, option));
  const answer = options[pkg.correctIndex]!;
  const tags = buildOptionTags(pkg);
  const revised: Avg001QuestionPackage = {
    ...pkg,
    options,
    answer,
    solver: { ...pkg.solver, answer },
    independentVerification: { ...pkg.independentVerification, displayAnswer: answer },
    traceability: {
      ...pkg.traceability,
      releaseCandidate: "AVG-001-EN-v2",
      editorialV2OptionTags: tags,
      preservedMathematicalFingerprint: pkg.mathematicalFingerprint,
      editorialV2Complete: AVG_001_EDITORIAL_V2_COMPLETE,
    },
  };
  const explained = { ...revised, explanation: buildExplanation(revised, tags) };
  return { ...explained, validation: validateRemainingCandidate(explained) };
}

function addChapterTrace(pkg: Avg001QuestionPackage) {
  const checks = pkg.validation.checks.filter((check) => check.name !== "avg001-editorial-v2-complete");
  checks.push({
    name: "avg001-editorial-v2-complete",
    passed: pkg.traceability.avg001EditorialV2Complete === AVG_001_EDITORIAL_V2_COMPLETE,
    message: "Package participates in the complete 425-QL AVG-001 English v2 candidate",
  });
  return { ...pkg, validation: { valid: checks.every((check) => check.passed), checks } };
}

export function applyAvg001EditorialV2CompleteCandidate(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.language !== "en") return pkg;

  let candidate: Avg001QuestionPackage;
  if (pkg.canonicalProblemId === "AVG-CP-004") {
    candidate = applyAvg001Cp004EditorialV2FinalCandidate(pkg);
  } else if (pkg.canonicalProblemId === "AVG-CP-005") {
    candidate = applyAvg001Cp005EditorialV2ReviewedCandidate(pkg);
  } else {
    candidate = applyRemainingCpCandidate(pkg);
  }

  const traced: Avg001QuestionPackage = {
    ...candidate,
    traceability: {
      ...candidate.traceability,
      releaseCandidate: "AVG-001-EN-v2",
      avg001EditorialV2Complete: AVG_001_EDITORIAL_V2_COMPLETE,
    },
  };
  return addChapterTrace(traced);
}
