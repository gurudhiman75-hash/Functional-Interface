import { buildPnc002ReviewedStudentPresentation } from "./student-presentation-reviewed";
import type {
  PncStudentExplanationSection,
  PncStudentPresentation,
  PncStudentSourcePackage,
} from "./student-presentation";

type ExtendedSourcePackage = PncStudentSourcePackage & {
  parameters?: { values?: Record<string, unknown> };
};

function sourceValues(source: PncStudentSourcePackage): Record<string, unknown> {
  return (source as ExtendedSourcePackage).parameters?.values ?? {};
}

function numericValue(source: PncStudentSourcePackage, ...keys: string[]): number | undefined {
  const values = sourceValues(source);
  for (const key of keys) {
    const value = values[key];
    if (typeof value === "number" && Number.isInteger(value)) return value;
  }
  return undefined;
}

function parseNumeric(value: string): number {
  const numeric = Number(value.replace(/,/g, "").trim());
  if (!Number.isInteger(numeric) || numeric <= 0) throw new Error(`Invalid PNC option: ${value}`);
  return numeric;
}

function factorial(value: number): number | undefined {
  if (!Number.isInteger(value) || value < 0 || value > 10) return undefined;
  let result = 1;
  for (let factor = 2; factor <= value; factor += 1) result *= factor;
  return result;
}

function combination(total: number, selected: number): number | undefined {
  if (!Number.isInteger(total) || !Number.isInteger(selected) || selected < 0 || selected > total || total > 30) return undefined;
  const k = Math.min(selected, total - selected);
  let result = 1;
  for (let index = 1; index <= k; index += 1) result = (result * (total - k + index)) / index;
  return Number.isInteger(result) ? result : undefined;
}

function derangement(value: number): number | undefined {
  if (!Number.isInteger(value) || value < 0 || value > 10) return undefined;
  if (value === 0) return 1;
  if (value === 1) return 0;
  let previousPrevious = 1;
  let previous = 0;
  for (let n = 2; n <= value; n += 1) {
    const current = (n - 1) * (previous + previousPrevious);
    previousPrevious = previous;
    previous = current;
  }
  return previous;
}

function power(base: number, exponent: number): number | undefined {
  if (!Number.isInteger(base) || !Number.isInteger(exponent) || base < 0 || exponent < 0 || exponent > 12) return undefined;
  const result = base ** exponent;
  return Number.isSafeInteger(result) ? result : undefined;
}

function cleanMathSpacing(value: string): string {
  return value
    .replace(/\b(is|gives|becomes|equals|using|as)\$(?!\$)/gi, "$1 $")
    .replace(/\b(Thus|Hence|Therefore)\$(?!\$)/g, "$1 $")
    .replace(/\bspecified\b/gi, "particular")
    .replace(/\bunnamed\b/gi, "unlabelled")
    .replace(/\bdistinct\b/gi, "different")
    .replace(/(calculation|formula|count):\$\$/gi, (_match, label: string) => `${label}: $$`)
    .replace(/\s+/g, " ")
    .trim();
}

function finalStem(source: PncStudentSourcePackage, reviewedStem: string): string {
  const mode = source.solveMode.toLowerCase();
  const original = source.stem.toLowerCase();
  let stem = reviewedStem;

  if (mode.includes("derangement") || mode.includes("fixedpoint")) {
    stem = stem
      .replace(/different objects/gi, "numbered cards")
      .replace(/\bobjects\b/gi, "cards")
      .replace(/\bobject\b/gi, "card");
  }

  if (/identical marbles?/.test(original)) {
    stem = stem.replace(/^A classroom activity uses boxes to distribute counters or tokens\./, "A teacher is distributing identical marbles among labelled boxes.");
  } else if (/identical balls?/.test(original)) {
    stem = stem.replace(/^A classroom activity uses boxes to distribute counters or tokens\./, "A teacher is distributing identical balls among labelled boxes.");
  } else if (/tokens?/.test(original)) {
    stem = stem.replace(/^A classroom activity uses boxes to distribute counters or tokens\./, "A game organiser is placing numbered tokens into boxes.");
  }

  if (stem.startsWith("A college is forming a committee or team for an official event.")) {
    if (/players?|team of/.test(original)) {
      stem = stem.replace("A college is forming a committee or team for an official event.", "A sports club is selecting a team for a tournament.");
    } else if (/panel|candidates?/.test(original)) {
      stem = stem.replace("A college is forming a committee or team for an official event.", "An organisation is appointing a selection panel.");
    } else {
      stem = stem.replace("A college is forming a committee or team for an official event.", "A college is forming a committee for an official event.");
    }
  }

  if (/trainees?/.test(original)) {
    stem = stem.replace(
      /^A sports club is forming teams for a tournament\./,
      "A training centre is forming project teams.",
    );
  }

  return stem;
}

const directReasons: Array<[string, string]> = [
  ["unrestrictedCount", "uses the unrestricted count and ignores the stated restriction"],
  ["forbiddenTogetherCount", "counts only the forbidden together cases"],
  ["forbiddenCount", "counts the excluded cases instead of the valid cases"],
  ["externalArrangementCount", "arranges the compressed outside units but omits internal orders"],
  ["primaryExternalArrangementCount", "stops after arranging the outside units and omits the remaining factors"],
  ["labelledPrecursorCount", "treats interchangeable groups as labelled"],
  ["selectionCount", "stops after selection and omits the later arrangement or role choices"],
  ["sameGroupCount", "counts the same-group event instead of the required different-group event"],
  ["differentGroupCount", "counts the different-group event instead of the required same-group event"],
];

function flattenedEvidence(source: PncStudentSourcePackage): Record<string, unknown> {
  const evidence = source.solver.evidence as Record<string, unknown>;
  const details = evidence.details;
  return typeof details === "object" && details !== null && !Array.isArray(details)
    ? { ...evidence, ...(details as Record<string, unknown>) }
    : evidence;
}

function evidenceReason(source: PncStudentSourcePackage, option: number): string | undefined {
  const evidence = flattenedEvidence(source);
  for (const [key, reason] of directReasons) {
    const value = evidence[key];
    if (typeof value === "number" && Number.isInteger(value) && value === option) return reason;
  }
  return undefined;
}

function derangementReason(source: PncStudentSourcePackage, option: number): string | undefined {
  const mode = source.solveMode.toLowerCase();
  if (!mode.includes("derangement") && !mode.includes("fixedpoint")) return undefined;
  const objectCount = numericValue(source, "objectCount", "totalObjects");
  if (objectCount === undefined) return undefined;
  const unrestricted = factorial(objectCount);
  if (unrestricted === option) return "uses all permutations and ignores the fixed-position condition";
  if (mode.includes("derangement")) {
    const previous = derangement(objectCount - 1);
    if (previous === option) return "uses the derangement count for one fewer object";
    if (unrestricted !== undefined && unrestricted - source.solver.numericAnswer === option) return "counts permutations with at least one fixed point—the complement of a derangement";
  }
  return undefined;
}

function gridReason(source: PncStudentSourcePackage, option: number): string | undefined {
  const mode = source.solveMode.toLowerCase();
  if (!mode.includes("grid") && !mode.includes("path")) return undefined;
  const right = numericValue(source, "rightSteps");
  const up = numericValue(source, "upSteps");
  if (right === undefined || up === undefined) return undefined;
  if (option === right * up) return "multiplies the numbers of right and upward moves instead of choosing their positions";
  if (factorial(right + up) === option) return "treats all moves as different and uses the full factorial";
  if (combination(right + up, up - 1) === option || combination(right + up, right - 1) === option) return "chooses the wrong number of identical move positions";
  return undefined;
}

function distributionReason(source: PncStudentSourcePackage, option: number): string | undefined {
  const mode = source.solveMode.toLowerCase();
  const stem = source.stem.toLowerCase();
  if (!mode.includes("distribution") && !mode.includes("receiver") && !mode.includes("boxes") && !mode.includes("occupancy") && !/assigned to|placed in|distributed among|filed in|sent to/.test(stem)) return undefined;
  const objects = numericValue(source, "objectCount", "totalObjects", "fileCount", "documentCount");
  const boxes = numericValue(source, "boxCount", "receiverCount", "folderCount", "roomCount");
  if (objects === undefined || boxes === undefined) return undefined;
  if (power(objects, boxes) === option) return "reverses the roles of objects and receivers in the exponent";
  if (power(boxes, objects - 1) === option) return "omits the independent receiver choice for one object";
  if (objects * boxes === option) return "multiplies the two counts instead of applying the multiplication principle repeatedly";
  if (/identical/.test(stem) && power(boxes, objects) === option) return "treats identical objects as different and uses one receiver choice per object";
  const nonEmptyStarsBars = combination(objects - 1, boxes - 1);
  if (/may remain empty|empty.*allowed|may be empty/.test(stem) && nonEmptyStarsBars === option) return "uses the non-empty stars-and-bars formula even though empty receivers are allowed";
  return undefined;
}

function roleReason(source: PncStudentSourcePackage, option: number): string | undefined {
  const stem = source.stem.toLowerCase();
  const mode = source.solveMode.toLowerCase();
  if (!/captain|chairperson|secretary|treasurer/.test(stem) && !/captain|chair|secretary|treasurer/.test(mode)) return undefined;
  const correct = source.solver.numericAnswer;
  const teamSize = numericValue(source, "teamSize");
  const teamCount = numericValue(source, "teamCount") ?? (/two named teams|team a and team b/.test(stem) ? 2 : undefined);
  if (teamSize !== undefined && teamCount !== undefined) {
    const roleChoices = power(teamSize, teamCount);
    if (roleChoices === option) return "counts only the role choices and omits forming the teams";
    if (roleChoices !== undefined && correct / roleChoices === option) return "forms the teams but forgets to choose the captains";
  }
  const committeeSize = numericValue(source, "committeeSize");
  if (committeeSize !== undefined) {
    const twoOrderedRoles = committeeSize * (committeeSize - 1);
    if (twoOrderedRoles === option) return "counts only the ordered offices and omits selecting the committee";
    if (correct / twoOrderedRoles === option) return "selects the committee but omits the ordered office assignments";
  }
  return undefined;
}

function symmetryReason(source: PncStudentSourcePackage, option: number): string | undefined {
  const correct = source.solver.numericAnswer;
  if (option !== correct * 2 && option * 2 !== correct) return undefined;
  const mode = source.solveMode.toLowerCase();
  if (mode.includes("labelled") || mode.includes("named") || mode.includes("unlabelled") || mode.includes("unnamed") || mode.includes("group") || mode.includes("team")) {
    return "applies an incorrect factor of 2 for whole-group labels or symmetry";
  }
  if (mode.includes("circular") || mode.includes("rotation") || mode.includes("dihedral")) return "applies the wrong rotation or reflection symmetry factor";
  if (mode.includes("block") || mode.includes("together")) return "misses or duplicates the two internal orders of a particular pair";
  return undefined;
}

function factorialReason(source: PncStudentSourcePackage, option: number): string | undefined {
  const total = numericValue(source, "totalObjects", "objectCount", "totalCount", "arrangementCount");
  if (total !== undefined && factorial(total) === option) return "uses the unrestricted factorial and ignores the condition";
  return undefined;
}

function finalTrapReason(source: PncStudentSourcePackage, option: number): string {
  if (source.solveMode.toLowerCase().includes("recover")) {
    return "does not reproduce the stated target count when checked within the permitted candidate range";
  }

  const matched = evidenceReason(source, option)
    ?? derangementReason(source, option)
    ?? gridReason(source, option)
    ?? distributionReason(source, option)
    ?? roleReason(source, option)
    ?? symmetryReason(source, option)
    ?? factorialReason(source, option);
  if (matched) return matched;

  const correct = source.solver.numericAnswer;
  const difference = Math.abs(option - correct);
  if (difference <= 2 || difference / Math.max(1, correct) < 0.02) return "is a nearby arithmetic distractor and does not equal the condition-aware result";
  return `does not match the required formula $${source.solver.mathJax}$ and represents an incomplete count or arithmetic distractor`;
}

function finalTrapLines(source: PncStudentSourcePackage, displayOptions: string[]): string[] {
  return source.options
    .map((value, index) => ({ value: parseNumeric(value), index }))
    .filter(({ index }) => index !== source.correctIndex)
    .map(({ value, index }) => `Option ${String.fromCharCode(65 + index)} (${displayOptions[index]}): ${finalTrapReason(source, value)}.`);
}

function finalSections(
  source: PncStudentSourcePackage,
  presentation: PncStudentPresentation,
): PncStudentExplanationSection[] {
  return presentation.explanationSections.map((section) => {
    if (section.kind === "stepByStep") return { ...section, lines: section.lines.map(cleanMathSpacing) };
    if (section.kind === "commonTrapWarning") return { ...section, lines: finalTrapLines(source, presentation.displayOptions) };
    return { ...section, lines: section.lines.map(cleanMathSpacing) };
  });
}

export function buildPnc002FinalStudentPresentation(source: PncStudentSourcePackage): PncStudentPresentation {
  const reviewed = buildPnc002ReviewedStudentPresentation(source);
  return {
    ...reviewed,
    stem: finalStem(source, reviewed.stem),
    explanationSections: finalSections(source, reviewed),
  };
}
