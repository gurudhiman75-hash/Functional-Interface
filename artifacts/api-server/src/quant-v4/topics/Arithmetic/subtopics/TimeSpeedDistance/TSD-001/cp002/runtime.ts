import { questionLanguageId, reopenedEditorialLifecycle } from "../editorial-contract";
import {
  CP002_KEY_RULE,
  CP002_SHORTCUT,
  CP002_TEACHING_LEADS,
  cp002Case,
} from "./cases";
import { TSD_CP002_LEARNER_AUTHORITIES } from "./discovery-registry";
import { authoritySubmode, requiresAuthorityPurityDecision } from "./editorial-authority-audit";
import {
  cp002CorrectIndex,
  cp002Difficulty,
  cp002Shortcut,
  cp002WorkingLines,
  semanticCp002OptionKey,
} from "./editorial-remodel";
import { formatFraction, formatRatio, stableFraction, type Fraction } from "./fraction";
import { frozenCp002Authority } from "./freeze-registry";
import { assertPositiveInput, solveCp002, solutionEquals } from "./solver";
import type {
  TsdCp002GeneratedQuestion,
  TsdCp002LearnerSolveMode,
  TsdCp002OptionAnalysis,
  TsdCp002OptionAudit,
  TsdCp002Solution,
} from "./types";
import { verifyCp002Solution } from "./verifier";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

export function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function trailingOrdinal(seed: string): number {
  const match = seed.match(/(\d+)$/);
  return match ? Number(match[1]) : hashSeed(seed);
}

function unitFor(value: Fraction, singular: string, plural: string): string {
  return value.n === value.d ? singular : plural;
}

export function formatCp002Solution(solution: TsdCp002Solution): string {
  switch (solution.answerKind) {
    case "SPEED": return `${formatFraction(solution.value)} km/h`;
    case "PACE": return `${formatFraction(solution.value)} ${unitFor(solution.value, "minute/km", "minutes/km")}`;
    case "TIME": return `${formatFraction(solution.value)} ${unitFor(solution.value, "hour", "hours")}`;
    case "DISTANCE": return `${formatFraction(solution.value)} km`;
    case "PERCENT": return `${formatFraction(solution.value)}%`;
    case "RATIO": return formatRatio(solution.value);
    case "CHOICE": return solution.value;
    case "CLASSIFICATION": return {
      UNIQUE: "The information determines one answer",
      INDETERMINATE: "The information is not sufficient",
      IMPOSSIBLE: "The stated journey is impossible",
    }[solution.value];
    case "BOOLEAN": return solution.value ? "Yes" : "No";
  }
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    const candidate = value as Record<string, unknown>;
    if (typeof candidate.n === "number" && typeof candidate.d === "number" && Object.keys(candidate).length === 2) {
      return stableFraction(candidate as unknown as Fraction);
    }
    return Object.fromEntries(Object.keys(candidate).sort().map((key) => [key, stableValue(candidate[key])]));
  }
  return value;
}

export function stableStringify(value: unknown): string {
  return JSON.stringify(stableValue(value));
}

function mathJaxDelimiterCount(value: string, token: "\\(" | "\\)"): number {
  return value.split(token).length - 1;
}

function mathJaxStem(stem: string): string {
  const converted = stem.replace(
    /(\d[\d,]*(?:\.\d+)?(?:\/\d+)?)(\s*)(km\/h|minutes? per km|minutes?\/km|hours?|km|m)\b/g,
    (_match, number: string, _space: string, unit: string) => `\\(${number.replace(/,/g, "")}\\,\\text{${unit.replace(" per ", "/")}}\\)`,
  );
  return converted.includes("\\(") ? converted : `${stem} \\(\\text{Use exact values.}\\)`;
}

function editorialStem(mode: TsdCp002LearnerSolveMode, stem: string): string {
  if (mode === "unknownSegmentSpeedFromAverage") {
    return stem.replace(/What is the second speed\?/i, "At what speed does it travel during the second part?");
  }
  if (mode === "unknownSegmentDistanceFromAverage") {
    return stem.replace(/What is the second distance\?/i, "How far does it travel during the second part of the journey?");
  }
  return stem;
}

function explanationGivens(mode: TsdCp002LearnerSolveMode, givens: readonly string[]): readonly string[] {
  switch (mode) {
    case "unknownSegmentShareFromAverage":
    case "unknownRoundTripLegSpeedFromAverage":
    case "segmentRatioFromAverageAndSpeeds":
    case "compareSegmentedJourneyPlans":
    case "totalDistanceFromAverageAndTime":
      return givens;
    default:
      return Object.freeze([] as string[]);
  }
}

function correctReason(mode: TsdCp002LearnerSolveMode, answerText: string): string {
  const reason: Record<TsdCp002LearnerSolveMode, string> = {
    averageSpeedFromSegments: "the complete distance divided by the complete travelling time gives this value",
    averagePaceFromSegments: "the total minutes divided by the total kilometres gives this pace",
    unknownSegmentSpeedFromAverage: "this speed uses exactly the time left by the stated overall average",
    unknownSegmentTimeFromAverage: "this is the difference between the allowed total time and the known segment time",
    unknownSegmentDistanceFromAverage: "this distance makes total distance ÷ total time equal the stated average",
    unknownSegmentShareFromAverage: "this share reconstructs the stated weighted average",
    unknownRoundTripLegSpeedFromAverage: "this speed satisfies the equal-distance harmonic-average relation",
    oneWayDistanceFromRoundTripData: "this repeated distance makes the two leg times add to the stated total",
    roundTripTimeFromOneWayDistance: "the outward and return times add to this duration",
    totalDistanceFromAverageAndTime: "overall average × total travelling time gives this distance",
    segmentAllocationFromTotalsAndSpeeds: "this allocation satisfies both the distance and time totals",
    segmentRatioFromAverageAndSpeeds: "this ratio reproduces the stated average under the requested weighting",
    requiredRemainingSpeedForTargetAverage: "this speed uses the exact remaining time allowed by the target average",
    compareSegmentedJourneyPlans: "the two complete-plan average calculations support this comparison",
  };
  return `✅ ${answerText}: ${reason[mode]}.`;
}

function rotateOptions(
  answer: TsdCp002Solution,
  wrongSeeds: ReturnType<typeof cp002Case>["wrongOptions"],
  correctIndex: number,
  mode: TsdCp002LearnerSolveMode,
): { options: readonly string[]; audit: readonly TsdCp002OptionAudit[]; analysis: readonly TsdCp002OptionAnalysis[] } {
  const answerText = formatCp002Solution(answer);
  const wrongEntries = wrongSeeds.map((entry) => ({
    text: formatCp002Solution(entry.solution),
    misconceptionId: entry.misconceptionId,
    diagnosis: entry.diagnosis,
  }));
  if (wrongEntries.some((entry) => semanticCp002OptionKey(entry.text) === semanticCp002OptionKey(answerText))) {
    throw new Error(`${mode}: distractor semantically duplicates the correct answer ${answerText}`);
  }
  if (new Set(wrongEntries.map((entry) => semanticCp002OptionKey(entry.text))).size !== 3) {
    throw new Error(`${mode}: semantically duplicate distractors`);
  }

  const entries: Array<{ text: string; misconceptionId: string; isCorrect: boolean; reason: string }> = wrongEntries.map((entry) => ({
    text: entry.text,
    misconceptionId: entry.misconceptionId,
    isCorrect: false,
    reason: `⚠️ ${entry.text}: ${entry.diagnosis}`,
  }));
  entries.splice(correctIndex, 0, {
    text: answerText,
    misconceptionId: "CORRECT",
    isCorrect: true,
    reason: correctReason(mode, answerText),
  });

  return Object.freeze({
    options: Object.freeze(entries.map((entry) => entry.text)),
    audit: Object.freeze(entries.map(({ text, misconceptionId, isCorrect }) => Object.freeze({ text, misconceptionId, isCorrect }))),
    analysis: Object.freeze(entries.map((entry, index) => Object.freeze({
      option: OPTION_LABELS[index],
      text: entry.text,
      misconceptionId: entry.misconceptionId,
      isCorrect: entry.isCorrect,
      reason: entry.reason,
    }))),
  });
}

function validationErrors(question: Omit<TsdCp002GeneratedQuestion, "validation">): string[] {
  const errors: string[] = [];
  const verification = verifyCp002Solution(question.input, question.solution);
  if (!verification.valid) errors.push(...verification.errors.map((error) => `Verifier: ${error}`));
  if (!question.stem.trim().endsWith("?")) errors.push("Stem must end with a question mark");
  if (!question.stemMathJax.includes("\\(")) errors.push("MathJax quantity is missing from stem");
  if (mathJaxDelimiterCount(question.stemMathJax, "\\(") !== mathJaxDelimiterCount(question.stemMathJax, "\\)")) errors.push("MathJax delimiters are unbalanced");
  if (/\\text\{[^}]*\\text\{/.test(question.stemMathJax) || /\\timesimes|\\diviv/.test(question.stemMathJax)) errors.push("Corrupted MathJax token leaked into stem");
  if (question.options.length !== 4 || new Set(question.options).size !== 4) errors.push("Options must contain four unique values");
  if (new Set(question.options.map(semanticCp002OptionKey)).size !== 4) errors.push("Options contain semantically equivalent values");
  if (question.optionAudit.filter((entry) => entry.isCorrect).length !== 1) errors.push("Exactly one option must be correct");
  if (!question.optionAudit[question.correctIndex]?.isCorrect) errors.push("Correct option index is invalid");
  if (question.options[question.correctIndex] !== question.answerText) errors.push("Answer text and keyed option differ");
  if (question.explanation.stepByStepSolution.length < 5) errors.push("Explanation is too brief");
  if (!question.explanation.keyRule.startsWith("📌 Main Rule:")) errors.push("Main-rule tier is missing");
  if (!question.explanation.examSpeedShortcut.startsWith("⚡ Exam Speed Trick:")) errors.push("Shortcut tier is missing");
  if (question.explanation.optionAnalysis.length !== 4) errors.push("Option analysis is incomplete");
  if (question.explanation.optionAnalysis.some((entry, index) => entry.option !== OPTION_LABELS[index] || entry.text !== question.options[index])) errors.push("Option analysis is misaligned");
  if (question.explanation.optionAnalysis.some((entry) => !entry.reason.includes(entry.text))) errors.push("Option reason does not name its displayed option");
  if (question.lifecycle.reviewStatus !== "EDITORIAL_REVIEW_REQUIRED") errors.push("Editorial review status is not reopened");
  if (question.lifecycle.englishDecision !== "NEEDS_REVISION" || question.lifecycle.englishFreezeStatus !== "UNFROZEN") errors.push("CP-002 must remain unfreezed during remodel");
  if (question.lifecycle.questionBankStatus !== "NOT_STORED" || question.lifecycle.testEligibility !== "INELIGIBLE") errors.push("Delivery lock failed");
  if (question.lifecycle.publiclyPublishable || question.publiclyPublishable) errors.push("Publication lock failed");
  if (!question.questionLanguageId.trim()) errors.push("Stable questionLanguageId is missing");
  if (question.difficulty.status !== "EDITORIAL_CALIBRATION_REQUIRED") errors.push("Difficulty is not marked for editorial calibration");
  if (requiresAuthorityPurityDecision(question.solveMode) && question.authoritySubmode === "STANDARD") errors.push("Mixed authority lacks an explicit submode");
  if (!/^TSD-QL-0(2[4-9]|3[0-7])$/.test(question.permanentQlId)) errors.push("Current CP-002 review ID is outside TSD-QL-024..037");
  const learnerText = `${question.stem} ${question.answerText} ${question.options.join(" ")} ${question.explanation.stepByStepSolution.join(" ")} ${question.explanation.optionAnalysis.map((entry) => entry.reason).join(" ")}`;
  if (/TODO|PLACEHOLDER|TSD-CP002-DISC-01[56]/.test(learnerText)) errors.push("Internal or unresolved content leaked into learner text");
  if (/\b1 (hours|minutes|kilometres)\b|km\/h kilometres|minutes\/km minutes/i.test(learnerText)) errors.push("Singular or duplicated-unit language defect");
  if (/\b(required answer|compatible units|continuous timeline|provisional authority)\b/i.test(learnerText)) errors.push("Engine or governance language leaked into learner text");
  if (/\bSolving gives\b/i.test(learnerText)) errors.push("Unsupported algebra jump remains in explanation");
  if (question.solveMode === "segmentRatioFromAverageAndSpeeds") {
    const needsDistanceRule = question.authoritySubmode === "DISTANCE_RATIO";
    if (needsDistanceRule && !/distance ratio/i.test(question.explanation.examSpeedShortcut)) errors.push("Distance-ratio item has the wrong shortcut");
    if (!needsDistanceRule && !/time ratio/i.test(question.explanation.examSpeedShortcut)) errors.push("Time-ratio item has the wrong shortcut");
  }
  if (question.solveMode === "compareSegmentedJourneyPlans") {
    const solutionText = question.explanation.stepByStepSolution.join(" ");
    if (!/Plan A:.*average/i.test(solutionText) || !/Plan B:.*average/i.test(solutionText)) errors.push("Plan comparison does not calculate both averages");
  }
  return errors;
}

export function generateCp002Candidate(
  provisionalAuthorityId: `TSD-CP002-DISC-${string}`,
  seed: string,
): TsdCp002GeneratedQuestion {
  const authority = TSD_CP002_LEARNER_AUTHORITIES.find((entry) => entry.provisionalId === provisionalAuthorityId);
  if (!authority) throw new Error(`Unknown learner-facing CP-002 authority: ${provisionalAuthorityId}`);
  const mode = authority.solveMode as TsdCp002LearnerSolveMode;
  const ordinal = trailingOrdinal(seed);
  const definition = cp002Case(mode, ordinal % 3);
  assertPositiveInput(definition.input);
  const solution = solveCp002(definition.input);
  const verification = verifyCp002Solution(definition.input, solution);
  if (!verification.valid) throw new Error(`${mode}: canonical solution failed independent verification: ${verification.errors.join("; ")}`);
  const correctIndex = cp002CorrectIndex(authority.provisionalId, seed);
  const optionPackage = rotateOptions(solution, definition.wrongOptions, correctIndex, mode);
  const frozenAuthority = frozenCp002Authority(mode);
  if (frozenAuthority.provisionalAuthorityId !== authority.provisionalId) throw new Error(`${mode}: current-review/discovery authority mismatch`);
  const answerText = formatCp002Solution(solution);
  const teachingVariant = ordinal % 3;
  const rawWorking = cp002WorkingLines(definition.input, solution, definition.working(solution));
  const working = mode === "compareSegmentedJourneyPlans"
    ? rawWorking.map((line) => line.replace(/^Therefore,\s*/i, "Comparison result: "))
    : rawWorking;
  const stem = editorialStem(mode, definition.stem);
  const steps = Object.freeze([
    CP002_TEACHING_LEADS[mode][teachingVariant],
    ...explanationGivens(mode, definition.givens),
    ...working,
    `Therefore, the answer is ${answerText}.`,
  ]);
  const submode = authoritySubmode(definition.input);
  const base = {
    chapterId: "TSD-001" as const,
    checkpointId: "TSD-CP-002" as const,
    archetypeId: "TSD-001" as const,
    canonicalProblemId: "TSD-CP-002" as const,
    provisionalAuthorityId: authority.provisionalId,
    permanentQlId: frozenAuthority.permanentQlId,
    questionLanguageId: questionLanguageId("TSD-CP-002", authority.provisionalId, seed),
    solveMode: mode,
    authoritySubmode: submode,
    language: "en" as const,
    seed,
    representation: definition.representation,
    difficulty: cp002Difficulty(mode, definition.input),
    stem,
    stemMathJax: mathJaxStem(stem),
    input: definition.input,
    solution,
    answerText,
    options: optionPackage.options,
    optionAudit: optionPackage.audit,
    correctIndex,
    explanation: Object.freeze({
      keyRule: CP002_KEY_RULE[mode],
      stepByStepSolution: steps,
      examSpeedShortcut: cp002Shortcut(definition.input, CP002_SHORTCUT[mode]),
      optionAnalysis: optionPackage.analysis,
      conclusion: `Answer: ${answerText}.`,
    }),
    mathematicalFingerprint: `${frozenAuthority.permanentQlId}|${mode}|${submode}|${definition.caseId}|${stableStringify(definition.input)}`,
    lifecycle: reopenedEditorialLifecycle(),
    publiclyPublishable: false as const,
  };
  const errors = validationErrors(base);
  return Object.freeze({
    ...base,
    validation: Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), warnings: Object.freeze([] as string[]) }),
  });
}

export function generateCp002ReviewRows(): readonly TsdCp002GeneratedQuestion[] {
  const rows: TsdCp002GeneratedQuestion[] = [];
  for (const authority of TSD_CP002_LEARNER_AUTHORITIES) {
    for (let index = 0; index < 3; index += 1) {
      rows.push(generateCp002Candidate(authority.provisionalId, `review:${authority.provisionalId}:${index}`));
    }
  }
  return Object.freeze(rows);
}

export function cp002SolutionsMatch(a: TsdCp002Solution, b: TsdCp002Solution): boolean {
  return solutionEquals(a, b);
}
