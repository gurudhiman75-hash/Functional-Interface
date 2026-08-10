import { questionLanguageId, reopenedEditorialLifecycle } from "../editorial-contract";
import { CP002_KEY_RULE, CP002_TEACHING_LEADS } from "./cases";
import { authoritySubmode } from "./editorial-authority-audit";
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
  TsdCp002Input,
  TsdCp002OptionAnalysis,
  TsdCp002OptionAudit,
  TsdCp002Solution,
} from "./types";
import { verifyCp002Solution } from "./verifier";

const LABELS = ["A", "B", "C", "D"] as const;

type AuthorityKey =
  | "averageSpeedFromSegments"
  | "unknownSegmentDistanceFromAverage"
  | "distanceRatioFromAverageAndSpeeds"
  | "segmentAllocationFromTotalsAndSpeeds"
  | "unknownSegmentSpeedFromAverage"
  | "roundTripLegTimeSum";

interface WrongSeed {
  readonly solution: TsdCp002Solution;
  readonly misconceptionId: string;
  readonly reason: string;
}

interface Definition {
  readonly authorityKey: AuthorityKey;
  readonly provisionalAuthorityId: `TSD-CP002-DISC-${string}`;
  readonly legacyQlId: `TSD-QL-${string}`;
  readonly seed: string;
  readonly representation: string;
  readonly stem: string;
  readonly input: TsdCp002Input;
  readonly wrongOptions: readonly [WrongSeed, WrongSeed, WrongSeed];
}

const speed = (n: number, d = 1): TsdCp002Solution =>
  Object.freeze({ answerKind: "SPEED", value: f(n, d) });
const time = (n: number, d = 1): TsdCp002Solution =>
  Object.freeze({ answerKind: "TIME", value: f(n, d) });
const distance = (n: number, d = 1): TsdCp002Solution =>
  Object.freeze({ answerKind: "DISTANCE", value: f(n, d) });
const ratio = (n: number, d = 1): TsdCp002Solution =>
  Object.freeze({ answerKind: "RATIO", value: f(n, d) });
const wrong = (
  solution: TsdCp002Solution,
  misconceptionId: string,
  reason: string,
): WrongSeed => Object.freeze({ solution, misconceptionId, reason });

const DEFINITIONS: readonly Definition[] = Object.freeze([
  Object.freeze({
    authorityKey: "averageSpeedFromSegments",
    provisionalAuthorityId: "TSD-CP002-DISC-001",
    legacyQlId: "TSD-QL-024",
    seed: "p2-b01:segmented-average:61:0",
    representation: "P2_EQUAL_TIME_FREIGHT_SEGMENTS_61",
    stem: "A freight shuttle covers 88 km at 44 km/h and then 156 km at 78 km/h. What is its average speed over the complete route?",
    input: Object.freeze({
      mode: "averageSpeedFromSegments",
      segments: Object.freeze([
        Object.freeze({ distanceKm: f(88), speedKmph: f(44) }),
        Object.freeze({ distanceKm: f(156), speedKmph: f(78) }),
      ]),
    }),
    wrongOptions: Object.freeze([
      wrong(speed(3432, 61), "USE_EQUAL_DISTANCE_HARMONIC_MEAN", "This applies the equal-distance harmonic mean even though both legs take equal time."),
      wrong(speed(44), "COPY_FIRST_SEGMENT_SPEED", "This ignores the second leg and copies only the first speed."),
      wrong(speed(78), "COPY_SECOND_SEGMENT_SPEED", "This ignores the first leg and copies only the second speed."),
    ]),
  }),
  Object.freeze({
    authorityKey: "unknownSegmentDistanceFromAverage",
    provisionalAuthorityId: "TSD-CP002-DISC-005",
    legacyQlId: "TSD-QL-028",
    seed: "p2-b01:unknown-distance:126:1",
    representation: "P2_INVERSE_SECOND_DISTANCE_126",
    stem: "A highway patrol unit covers 70 km at 35 km/h and then continues at 84 km/h. If the overall average speed is 56 km/h, how far is the second part of the journey?",
    input: Object.freeze({
      mode: "unknownSegmentDistanceFromAverage",
      knownDistanceKm: f(70),
      knownSpeedKmph: f(35),
      unknownSpeedKmph: f(84),
      overallAverageKmph: f(56),
    }),
    wrongOptions: Object.freeze([
      wrong(distance(70), "COPY_KNOWN_DISTANCE", "This copies the known first distance instead of solving the complete average-speed equation."),
      wrong(distance(84), "COPY_SECOND_SPEED_AS_DISTANCE", "This treats the second speed as though it were the required distance."),
      wrong(distance(168), "DOUBLE_REQUIRED_DISTANCE", "This doubles the required second distance and no longer produces an overall average of 56 km/h."),
    ]),
  }),
  Object.freeze({
    authorityKey: "distanceRatioFromAverageAndSpeeds",
    provisionalAuthorityId: "TSD-CP002-DISC-012",
    legacyQlId: "TSD-QL-035",
    seed: "p2-b01:distance-ratio:1:2:2",
    representation: "P2_DISTANCE_RATIO_EXPRESS_ROUTE_1_TO_2",
    stem: "An express coach covers two parts of a route at 42 km/h and 105 km/h. If its overall average speed is 70 km/h, what is the ratio of the distances covered at 42 km/h and 105 km/h?",
    input: Object.freeze({
      mode: "segmentRatioFromAverageAndSpeeds",
      firstSpeedKmph: f(42),
      secondSpeedKmph: f(105),
      overallAverageKmph: f(70),
      ratioKind: "DISTANCE",
    }),
    wrongOptions: Object.freeze([
      wrong(ratio(2, 1), "REVERSE_REQUESTED_DISTANCE_RATIO", "This reverses the requested lower-speed to higher-speed distance order."),
      wrong(ratio(2, 5), "COPY_REDUCED_SPEED_RATIO", "This copies the speed ratio 42:105 instead of solving the distance-weighted average."),
      wrong(ratio(1, 1), "ASSUME_EQUAL_DISTANCES", "Equal distances would not produce an average speed of 70 km/h for these two speeds."),
    ]),
  }),
  Object.freeze({
    authorityKey: "segmentAllocationFromTotalsAndSpeeds",
    provisionalAuthorityId: "TSD-CP002-DISC-011",
    legacyQlId: "TSD-QL-034",
    seed: "p2-b01:allocation:second-distance:273:3",
    representation: "P2_SECOND_DISTANCE_TWO_SPEED_SYSTEM_273",
    stem: "A logistics carrier covers 336 km in 5 hours, travelling at 42 km/h for part of the time and at 78 km/h for the rest. How many kilometres are covered at 78 km/h?",
    input: Object.freeze({
      mode: "segmentAllocationFromTotalsAndSpeeds",
      totalDistanceKm: f(336),
      totalTimeHours: f(5),
      firstSpeedKmph: f(42),
      secondSpeedKmph: f(78),
      requested: "SECOND_DISTANCE",
    }),
    wrongOptions: Object.freeze([
      wrong(distance(63), "RETURN_FIRST_DISTANCE", "This gives the distance covered at 42 km/h rather than the requested distance at 78 km/h."),
      wrong(distance(168), "ASSUME_EQUAL_DISTANCE_SPLIT", "This divides the total distance equally and does not satisfy the five-hour journey total."),
      wrong(distance(390), "USE_HIGHER_SPEED_FOR_ALL_TIME", "This assumes all five hours were travelled at 78 km/h."),
    ]),
  }),
  Object.freeze({
    authorityKey: "unknownSegmentSpeedFromAverage",
    provisionalAuthorityId: "TSD-CP002-DISC-003",
    legacyQlId: "TSD-QL-026",
    seed: "p2-b01:unknown-speed:144:4",
    representation: "P2_INVERSE_REMAINING_SPEED_144",
    stem: "A medical supply van covers the first 96 km at 48 km/h and the remaining 144 km at a constant speed. If the complete-route average is 80 km/h, what is the speed on the remaining part?",
    input: Object.freeze({
      mode: "unknownSegmentSpeedFromAverage",
      knownDistanceKm: f(96),
      knownSpeedKmph: f(48),
      unknownDistanceKm: f(144),
      overallAverageKmph: f(80),
    }),
    wrongOptions: Object.freeze([
      wrong(speed(80), "COPY_OVERALL_AVERAGE", "This copies the complete-route average instead of finding the faster remaining-leg speed."),
      wrong(speed(96), "COPY_KNOWN_DISTANCE_AS_SPEED", "This treats the known distance as though it were the unknown speed."),
      wrong(speed(120), "DIVIDE_TOTAL_DISTANCE_BY_KNOWN_TIME", "This divides the full distance by the first-leg time and ignores the remaining-time constraint."),
    ]),
  }),
  Object.freeze({
    authorityKey: "roundTripLegTimeSum",
    provisionalAuthorityId: "TSD-CP002-DISC-009",
    legacyQlId: "TSD-QL-032",
    seed: "p2-b01:roundtrip-time:4.5:5",
    representation: "P2_ROUND_TRIP_INSPECTION_ROUTE_4_5_HOURS",
    stem: "An inspection team travels 126 km to a remote site at 42 km/h and returns over the same route at 84 km/h. What is the total travelling time?",
    input: Object.freeze({
      mode: "roundTripTimeFromOneWayDistance",
      oneWayDistanceKm: f(126),
      outwardSpeedKmph: f(42),
      returnSpeedKmph: f(84),
    }),
    wrongOptions: Object.freeze([
      wrong(time(3), "USE_OUTWARD_TIME_ONLY", "This includes only the outward leg and omits the return journey."),
      wrong(time(6), "DOUBLE_SLOWER_LEG_TIME", "This assumes both legs take the slower outward-leg time."),
      wrong(time(3, 2), "USE_RETURN_TIME_ONLY", "This includes only the faster return leg and omits the outward journey."),
    ]),
  }),
]);

function mathJax(stem: string): string {
  return stem.replace(/(\d+(?:\.\d+)?)\s+(km\/h|km|hours?)/g, "\\($1\\,\\text{$2}\\)");
}

function buildOptions(
  definition: Definition,
  solution: TsdCp002Solution,
): {
  readonly options: readonly string[];
  readonly audit: readonly TsdCp002OptionAudit[];
  readonly analysis: readonly TsdCp002OptionAnalysis[];
  readonly correctIndex: number;
} {
  const correctText = formatCp002Solution(solution);
  const wrongEntries = definition.wrongOptions.map((entry) => ({
    text: formatCp002Solution(entry.solution),
    misconceptionId: entry.misconceptionId,
    reason: entry.reason,
  }));
  const semanticKeys = [correctText, ...wrongEntries.map((entry) => entry.text)]
    .map(semanticCp002OptionKey);
  if (new Set(semanticKeys).size !== 4) {
    throw new Error(`${definition.seed}: semantic option collision`);
  }

  const correctIndex = cp002CorrectIndex(definition.provisionalAuthorityId, definition.seed);
  const entries = wrongEntries.map((entry) => ({ ...entry, isCorrect: false }));
  entries.splice(correctIndex, 0, {
    text: correctText,
    misconceptionId: "CORRECT",
    reason: "This result satisfies the complete distance-time relation stated in the question.",
    isCorrect: true,
  });

  return Object.freeze({
    options: Object.freeze(entries.map((entry) => entry.text)),
    audit: Object.freeze(entries.map((entry) => Object.freeze({
      text: entry.text,
      misconceptionId: entry.misconceptionId,
      isCorrect: entry.isCorrect,
    }))),
    analysis: Object.freeze(entries.map((entry, index) => Object.freeze({
      option: LABELS[index],
      text: entry.text,
      misconceptionId: entry.misconceptionId,
      isCorrect: entry.isCorrect,
      reason: `${entry.text}: ${entry.reason}`,
    }))),
    correctIndex,
  });
}

function build(definition: Definition): TsdCp002GeneratedQuestion {
  const solution = solveCp002(definition.input);
  const verification = verifyCp002Solution(definition.input, solution);
  if (!verification.valid) {
    throw new Error(`${definition.seed}: ${verification.errors.join("; ")}`);
  }

  const options = buildOptions(definition, solution);
  const answerText = formatCp002Solution(solution);
  const working = cp002WorkingLines(definition.input, solution, []);
  const mode = definition.input.mode;
  const base = {
    chapterId: "TSD-001" as const,
    checkpointId: "TSD-CP-002" as const,
    archetypeId: "TSD-001" as const,
    canonicalProblemId: "TSD-CP-002" as const,
    provisionalAuthorityId: definition.provisionalAuthorityId,
    permanentQlId: definition.legacyQlId,
    questionLanguageId: questionLanguageId("TSD-CP-002", definition.authorityKey, definition.seed),
    solveMode: mode,
    authoritySubmode: authoritySubmode(definition.input),
    language: "en" as const,
    seed: definition.seed,
    representation: definition.representation,
    difficulty: cp002Difficulty(mode, definition.input),
    stem: definition.stem,
    stemMathJax: mathJax(definition.stem),
    input: definition.input,
    solution,
    answerText,
    options: options.options,
    optionAudit: options.audit,
    correctIndex: options.correctIndex,
    explanation: Object.freeze({
      keyRule: CP002_KEY_RULE[mode],
      stepByStepSolution: Object.freeze([
        CP002_TEACHING_LEADS[mode][1],
        ...working,
        `Therefore, the answer is ${answerText}.`,
      ]),
      examSpeedShortcut: cp002Shortcut(
        definition.input,
        "⚡ Exam Speed Trick: Translate every journey part into distance and time before choosing an option.",
      ),
      optionAnalysis: options.analysis,
      conclusion: `Answer: ${answerText}.`,
    }),
    mathematicalFingerprint:
      `P2-BATCH-01|${definition.authorityKey}|${definition.representation}|${stableStringify(definition.input)}`,
    lifecycle: reopenedEditorialLifecycle(),
    publiclyPublishable: false as const,
  };

  const errors: string[] = [];
  if (base.options[base.correctIndex] !== base.answerText) errors.push("Answer key mismatch");
  if (new Set(base.options.map(semanticCp002OptionKey)).size !== 4) {
    errors.push("Semantic option uniqueness failed");
  }
  if (base.explanation.stepByStepSolution.length < 5) errors.push("Explanation is incomplete");
  if (!base.stemMathJax.includes("\\(")) errors.push("Stem MathJax is missing");
  if (/\b(?:30|40|60)\b/.test(base.stem)) errors.push("Concentrated 30/40/60 family leaked into P2 supplement");

  return Object.freeze({
    ...base,
    validation: Object.freeze({
      valid: errors.length === 0,
      errors: Object.freeze(errors),
      warnings: Object.freeze([] as string[]),
    }),
  });
}

export function generateP2DiversityBatch01Supplements(): readonly TsdCp002GeneratedQuestion[] {
  return Object.freeze(DEFINITIONS.map(build));
}
