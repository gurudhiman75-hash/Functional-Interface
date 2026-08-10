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
  | "unknownDistanceShareFromAverageSpeed"
  | "unknownRoundTripLegSpeedFromAverage"
  | "oneWayDistanceFromRoundTripData"
  | "unknownTimeShareFromAverageSpeed"
  | "timeRatioFromAverageAndSpeeds"
  | "unknownSegmentTimeFromAverage";

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
const percent = (n: number, d = 1): TsdCp002Solution =>
  Object.freeze({ answerKind: "PERCENT", value: f(n, d) });
const ratio = (n: number, d = 1): TsdCp002Solution =>
  Object.freeze({ answerKind: "RATIO", value: f(n, d) });
const wrong = (
  solution: TsdCp002Solution,
  misconceptionId: string,
  reason: string,
): WrongSeed => Object.freeze({ solution, misconceptionId, reason });

const DEFINITIONS: readonly Definition[] = Object.freeze([
  Object.freeze({
    authorityKey: "unknownDistanceShareFromAverageSpeed",
    provisionalAuthorityId: "TSD-CP002-DISC-006",
    legacyQlId: "TSD-QL-029",
    seed: "p2-b03:distance-share:20:2",
    representation: "P2_DISTANCE_SHARE_REFRIGERATED_20_PERCENT",
    stem: "During a refrigerated delivery, a carrier covers one portion at 45 km/h and the remaining route at 90 km/h. If the complete-route average is 75 km/h, what percentage of the distance is covered at 45 km/h?",
    input: Object.freeze({
      mode: "unknownSegmentShareFromAverage",
      firstSpeedKmph: f(45),
      secondSpeedKmph: f(90),
      overallAverageKmph: f(75),
      shareKind: "DISTANCE",
    }),
    wrongOptions: Object.freeze([
      wrong(percent(80), "RETURN_COMPLEMENTARY_DISTANCE_SHARE", "This gives the distance share at 90 km/h rather than the requested share at 45 km/h."),
      wrong(percent(50), "ASSUME_EQUAL_DISTANCE_SPLIT", "Equal distances would produce a different harmonic average for 45 km/h and 90 km/h."),
      wrong(percent(100, 3), "USE_TIME_SHARE_FORMULA", "This uses direct speed deviations, which find a time share rather than the requested distance share."),
    ]),
  }),
  Object.freeze({
    authorityKey: "unknownDistanceShareFromAverageSpeed",
    provisionalAuthorityId: "TSD-CP002-DISC-006",
    legacyQlId: "TSD-QL-029",
    seed: "p2-b03:distance-share:80:12",
    representation: "P2_DISTANCE_SHARE_ENDURANCE_80_PERCENT",
    stem: "An endurance support vehicle travels part of a course at 45 km/h and the remaining distance at 90 km/h. If the complete-course average speed is 50 km/h, what percentage of the distance is travelled at 45 km/h?",
    input: Object.freeze({
      mode: "unknownSegmentShareFromAverage",
      firstSpeedKmph: f(45),
      secondSpeedKmph: f(90),
      overallAverageKmph: f(50),
      shareKind: "DISTANCE",
    }),
    wrongOptions: Object.freeze([
      wrong(percent(20), "RETURN_COMPLEMENTARY_DISTANCE_SHARE", "This gives the distance share at 90 km/h rather than the requested share at 45 km/h."),
      wrong(percent(50), "ASSUME_EQUAL_DISTANCE_SPLIT", "An equal split would not reduce the complete-course average to 50 km/h."),
      wrong(percent(800, 9), "USE_TIME_SHARE_FORMULA", "This uses direct speed deviations, which find a time share rather than the requested distance share."),
    ]),
  }),
  Object.freeze({
    authorityKey: "unknownRoundTripLegSpeedFromAverage",
    provisionalAuthorityId: "TSD-CP002-DISC-007",
    legacyQlId: "TSD-QL-030",
    seed: "p2-b03:return-speed:108:6",
    representation: "P2_RETURN_SPEED_FIELD_ENGINEER_108",
    stem: "A field engineer travels to an installation at 54 km/h and returns over the same route at an unknown speed. If the complete round-trip average is 72 km/h, what is the return speed?",
    input: Object.freeze({
      mode: "unknownRoundTripLegSpeedFromAverage",
      knownLegSpeedKmph: f(54),
      overallAverageKmph: f(72),
      unknownLeg: "RETURN",
    }),
    wrongOptions: Object.freeze([
      wrong(speed(72), "COPY_ROUND_TRIP_AVERAGE", "This copies the overall average instead of solving the equal-distance harmonic relation."),
      wrong(speed(54), "COPY_KNOWN_LEG_SPEED", "This assumes both legs use the known outward speed and cannot produce a 72 km/h average."),
      wrong(speed(90), "USE_ARITHMETIC_MEAN", "This treats the two equal-distance speeds as if their arithmetic mean were the round-trip average."),
    ]),
  }),
  Object.freeze({
    authorityKey: "unknownRoundTripLegSpeedFromAverage",
    provisionalAuthorityId: "TSD-CP002-DISC-007",
    legacyQlId: "TSD-QL-030",
    seed: "p2-b03:return-speed:126:11",
    representation: "P2_RETURN_SPEED_SURVEY_CREW_126",
    stem: "A survey crew reaches a field station at 63 km/h and returns along the same road at an unknown speed. If the average speed for both equal-distance legs is 84 km/h, what is the return speed?",
    input: Object.freeze({
      mode: "unknownRoundTripLegSpeedFromAverage",
      knownLegSpeedKmph: f(63),
      overallAverageKmph: f(84),
      unknownLeg: "RETURN",
    }),
    wrongOptions: Object.freeze([
      wrong(speed(84), "COPY_ROUND_TRIP_AVERAGE", "This copies the overall average and ignores the slower outward leg."),
      wrong(speed(63), "COPY_KNOWN_LEG_SPEED", "This makes both leg speeds equal and would give an average of only 63 km/h."),
      wrong(speed(105), "USE_ARITHMETIC_MEAN", "This uses 2 × average − known speed, which is an arithmetic-mean shortcut and not valid for equal distances."),
    ]),
  }),
  Object.freeze({
    authorityKey: "oneWayDistanceFromRoundTripData",
    provisionalAuthorityId: "TSD-CP002-DISC-008",
    legacyQlId: "TSD-QL-031",
    seed: "p2-b03:one-way-distance:135:3",
    representation: "P2_ONE_WAY_DISTANCE_MAINTENANCE_ROUTE_135",
    stem: "A maintenance unit travels to a pumping station at 54 km/h and returns over the same road at 90 km/h. If the two-way journey takes 4 hours, what is the one-way distance?",
    input: Object.freeze({
      mode: "oneWayDistanceFromRoundTripData",
      outwardSpeedKmph: f(54),
      returnSpeedKmph: f(90),
      totalTimeHours: f(4),
    }),
    wrongOptions: Object.freeze([
      wrong(distance(144), "USE_ARITHMETIC_MEAN_SPEED", "This uses the arithmetic mean of the two speeds before halving the total distance."),
      wrong(distance(216), "USE_OUTWARD_SPEED_FOR_TOTAL_TIME", "This assigns all four hours to the outward speed instead of splitting time across both legs."),
      wrong(distance(360), "USE_RETURN_SPEED_FOR_TOTAL_TIME", "This assigns all four hours to the return speed and ignores the slower outward leg."),
    ]),
  }),
  Object.freeze({
    authorityKey: "unknownTimeShareFromAverageSpeed",
    provisionalAuthorityId: "TSD-CP002-DISC-006",
    legacyQlId: "TSD-QL-029",
    seed: "p2-b03:time-share:75:7",
    representation: "P2_TIME_SHARE_TEST_FLEET_75_PERCENT",
    stem: "During a controlled road trial, a test fleet spends some time at 45 km/h and the remaining time at 85 km/h. If the time-weighted average is 55 km/h, what percentage of the operating time is at 45 km/h?",
    input: Object.freeze({
      mode: "unknownSegmentShareFromAverage",
      firstSpeedKmph: f(45),
      secondSpeedKmph: f(85),
      overallAverageKmph: f(55),
      shareKind: "TIME",
    }),
    wrongOptions: Object.freeze([
      wrong(percent(25), "RETURN_COMPLEMENTARY_TIME_SHARE", "This gives the time share at 85 km/h rather than the requested share at 45 km/h."),
      wrong(percent(50), "ASSUME_EQUAL_TIME_SPLIT", "Equal times would produce an average of 65 km/h, not 55 km/h."),
      wrong(percent(40), "COPY_SPEED_GAP_AS_PERCENT", "This copies the 40 km/h speed gap into a percentage without dividing by the full weighting interval."),
    ]),
  }),
  Object.freeze({
    authorityKey: "timeRatioFromAverageAndSpeeds",
    provisionalAuthorityId: "TSD-CP002-DISC-012",
    legacyQlId: "TSD-QL-035",
    seed: "p2-b03:time-ratio:2:3:3",
    representation: "P2_TIME_RATIO_DISTRIBUTION_RUN_2_TO_3",
    stem: "During a distribution run, a vehicle uses 45 km/h and 95 km/h operating periods. Its time-weighted average speed is 75 km/h. In what ratio is time spent at 45 km/h and 95 km/h?",
    input: Object.freeze({
      mode: "segmentRatioFromAverageAndSpeeds",
      firstSpeedKmph: f(45),
      secondSpeedKmph: f(95),
      overallAverageKmph: f(75),
      ratioKind: "TIME",
    }),
    wrongOptions: Object.freeze([
      wrong(ratio(3, 2), "REVERSE_REQUESTED_TIME_RATIO", "This reverses the requested lower-speed to higher-speed time order."),
      wrong(ratio(1, 1), "ASSUME_EQUAL_TIMES", "Equal times would give an average speed of 70 km/h rather than 75 km/h."),
      wrong(ratio(9, 19), "COPY_REDUCED_SPEED_RATIO", "This copies the raw speed ratio 45:95 instead of using deviations from the average."),
    ]),
  }),
  Object.freeze({
    authorityKey: "unknownSegmentTimeFromAverage",
    provisionalAuthorityId: "TSD-CP002-DISC-004",
    legacyQlId: "TSD-QL-027",
    seed: "p2-b03:unknown-time:2.5:7",
    representation: "P2_INVERSE_TIME_RESEARCH_ROUTE_2_5_HOURS",
    stem: "A research vehicle covers 84 km in 1.5 hours and then travels another 126 km. If its average speed over the full route is 52.5 km/h, how much time is spent on the second part?",
    input: Object.freeze({
      mode: "unknownSegmentTimeFromAverage",
      knownDistanceKm: f(84),
      knownTimeHours: f(3, 2),
      unknownDistanceKm: f(126),
      overallAverageKmph: f(105, 2),
    }),
    wrongOptions: Object.freeze([
      wrong(time(3, 2), "COPY_KNOWN_TIME", "This repeats the first-part time instead of finding the remaining time."),
      wrong(time(4), "RETURN_TOTAL_JOURNEY_TIME", "This gives the complete journey time rather than the time spent on the second part."),
      wrong(time(11, 2), "ADD_INSTEAD_OF_SUBTRACT_TIME", "This adds the known 1.5 hours to the four-hour total instead of subtracting it."),
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
      `P2-BATCH-03|${definition.authorityKey}|${definition.representation}|${stableStringify(definition.input)}`,
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
  if (/\b(?:30|40|60)\b/.test(base.stem) || /\b(?:30|40|60)\b/.test(base.answerText)) {
    errors.push("Concentrated 30/40/60 family leaked into P2 Batch 03");
  }
  if (/^(?:A|An|The)\s+(?:car|bus)\b/i.test(base.stem)) {
    errors.push("Dominant car/bus opening leaked into P2 Batch 03");
  }

  return Object.freeze({
    ...base,
    validation: Object.freeze({
      valid: errors.length === 0,
      errors: Object.freeze(errors),
      warnings: Object.freeze([] as string[]),
    }),
  });
}

export function generateP2DiversityBatch03Supplements(): readonly TsdCp002GeneratedQuestion[] {
  return Object.freeze(DEFINITIONS.map(build));
}