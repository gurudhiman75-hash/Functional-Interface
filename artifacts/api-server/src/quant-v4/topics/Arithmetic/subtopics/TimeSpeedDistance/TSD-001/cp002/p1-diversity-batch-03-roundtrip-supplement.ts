import { questionLanguageId, reopenedEditorialLifecycle } from "../editorial-contract";
import { CP002_KEY_RULE, CP002_TEACHING_LEADS } from "./cases";
import {
  cp002CorrectIndex,
  cp002Difficulty,
  cp002Shortcut,
  cp002WorkingLines,
  semanticCp002OptionKey,
} from "./editorial-remodel";
import { f } from "./fraction";
import { formatCp002Solution, stableStringify } from "./runtime";
import { solveCp002 } from "./solver";
import type {
  TsdCp002GeneratedQuestion,
  TsdCp002OptionAnalysis,
  TsdCp002OptionAudit,
  TsdCp002Solution,
} from "./types";
import { verifyCp002Solution } from "./verifier";

const LABELS = ["A", "B", "C", "D"] as const;
const seed = "p1-b03:roundtrip-time:4";
const input = Object.freeze({
  mode: "roundTripTimeFromOneWayDistance" as const,
  oneWayDistanceKm: f(144),
  outwardSpeedKmph: f(48),
  returnSpeedKmph: f(144),
});

const wrongs = Object.freeze([
  Object.freeze({
    solution: Object.freeze({ answerKind: "TIME" as const, value: f(3) }),
    misconceptionId: "OMIT_RETURN_LEG_TIME",
    reason: "This includes only the 144 ÷ 48 = 3 hour outward journey.",
  }),
  Object.freeze({
    solution: Object.freeze({ answerKind: "TIME" as const, value: f(1) }),
    misconceptionId: "OMIT_OUTWARD_LEG_TIME",
    reason: "This includes only the 144 ÷ 144 = 1 hour return journey.",
  }),
  Object.freeze({
    solution: Object.freeze({ answerKind: "TIME" as const, value: f(2) }),
    misconceptionId: "AVERAGE_LEG_TIMES_INSTEAD_OF_ADD",
    reason: "This averages the two leg times instead of adding them for the complete trip.",
  }),
]);

export function generateP1Batch03RoundTripFourHourSupplement(): TsdCp002GeneratedQuestion {
  const solution = solveCp002(input);
  const verification = verifyCp002Solution(input, solution);
  if (!verification.valid) throw new Error(`${seed}: ${verification.errors.join("; ")}`);

  const answerText = formatCp002Solution(solution);
  const wrongEntries = wrongs.map((entry) => ({
    text: formatCp002Solution(entry.solution),
    misconceptionId: entry.misconceptionId,
    reason: entry.reason,
    isCorrect: false,
  }));
  const semanticKeys = [answerText, ...wrongEntries.map((entry) => entry.text)].map(semanticCp002OptionKey);
  if (new Set(semanticKeys).size !== 4) throw new Error(`${seed}: semantic option collision`);

  const correctIndex = cp002CorrectIndex("TSD-CP002-DISC-009", seed);
  const entries = [...wrongEntries];
  entries.splice(correctIndex, 0, {
    text: answerText,
    misconceptionId: "CORRECT",
    reason: "This adds the 3-hour outward journey and 1-hour return journey.",
    isCorrect: true,
  });

  const options = Object.freeze(entries.map((entry) => entry.text));
  const optionAudit: readonly TsdCp002OptionAudit[] = Object.freeze(entries.map((entry) => Object.freeze({
    text: entry.text,
    misconceptionId: entry.misconceptionId,
    isCorrect: entry.isCorrect,
  })));
  const optionAnalysis: readonly TsdCp002OptionAnalysis[] = Object.freeze(entries.map((entry, index) => Object.freeze({
    option: LABELS[index],
    text: entry.text,
    misconceptionId: entry.misconceptionId,
    isCorrect: entry.isCorrect,
    reason: `${entry.text}: ${entry.reason}`,
  })));
  const working = cp002WorkingLines(input, solution, []);
  const stem = "A field engineer travels 144 km to a project site at 48 km/h and returns over the same route at 144 km/h. What is the total travelling time?";

  const base = {
    chapterId: "TSD-001" as const,
    checkpointId: "TSD-CP-002" as const,
    archetypeId: "TSD-001" as const,
    canonicalProblemId: "TSD-CP-002" as const,
    provisionalAuthorityId: "TSD-CP002-DISC-009" as const,
    permanentQlId: "TSD-QL-032" as const,
    questionLanguageId: questionLanguageId("TSD-CP-002", "roundTripLegTimeSum", seed),
    solveMode: input.mode,
    authoritySubmode: "STANDARD" as const,
    language: "en" as const,
    seed,
    representation: "OUTWARD_RETURN_TIME_LEDGER_144_FOUR_HOURS",
    difficulty: cp002Difficulty(input.mode, input),
    stem,
    stemMathJax: stem.replace(/(\d+)\s+(km\/h|km)/g, "\\($1\\,\\text{$2}\\)"),
    input,
    solution,
    answerText,
    options,
    optionAudit,
    correctIndex,
    explanation: Object.freeze({
      keyRule: CP002_KEY_RULE[input.mode],
      stepByStepSolution: Object.freeze([
        CP002_TEACHING_LEADS[input.mode][0],
        ...working,
        `Therefore, the answer is ${answerText}.`,
      ]),
      examSpeedShortcut: cp002Shortcut(input, "⚡ Exam Speed Trick: Add the two leg times directly."),
      optionAnalysis,
      conclusion: `Answer: ${answerText}.`,
    }),
    mathematicalFingerprint: `P1-BATCH-03|roundTripLegTimeSum|OUTWARD_RETURN_TIME_LEDGER_144_FOUR_HOURS|${stableStringify(input)}`,
    lifecycle: reopenedEditorialLifecycle(),
    publiclyPublishable: false as const,
  };

  const errors: string[] = [];
  if (options[correctIndex] !== answerText) errors.push("Answer key mismatch");
  if (new Set(options.map(semanticCp002OptionKey)).size !== 4) errors.push("Semantic option uniqueness failed");
  if (base.explanation.stepByStepSolution.length < 5) errors.push("Explanation is incomplete");

  return Object.freeze({
    ...base,
    validation: Object.freeze({
      valid: errors.length === 0,
      errors: Object.freeze(errors),
      warnings: Object.freeze([] as string[]),
    }),
  });
}
