import { add, divide, multiply, rational, subtract, toCanonicalString, type Rational } from "../foundation/rational";
import { formatDurationHours, formatExamNumber, hashSeed } from "../cp003/generation-support";
import { TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import { buildCp005Input } from "./generator";
import { cp005QlForAuthority } from "./ql-allocation";
import { generateCp005ReviewQuestion, type TsdCp005EnglishReviewQuestion, type TsdCp005ReviewOptionAudit } from "./english-review-runtime";
import { solveCp005 } from "./solver";
import type { TsdCp005Input, TsdCp005Solution, TsdCp005SolveMode } from "./types";
import { independentlyVerifyCp005 } from "./verifier";

const CUSTOM_MODES = new Set<TsdCp005SolveMode>([
  "findTimeBetweenFirstAndSecondMeetings",
  "findShuttleDistanceCovered",
  "findEndpointRestTimeFromNextMeeting",
  "findRouteReversalScheduleParameter",
  "findDistanceBetweenEndpointsFromRepeatedMeetings",
]);

function required(value: Rational | undefined, name: string): Rational {
  if (!value) throw new Error(`CP005 V2 missing ${name}`);
  return value;
}

function number(value: Rational): string {
  return formatExamNumber(value);
}

function answerText(solution: TsdCp005Solution): string {
  if (solution.answerKind !== "VALUE" || !solution.value) throw new Error(`${solution.solveMode}: custom V2 mode must return VALUE`);
  if (solution.unit === "HOUR") return formatDurationHours(solution.value);
  if (solution.unit === "KM") return `${number(solution.value)} km`;
  throw new Error(`${solution.solveMode}: unsupported custom V2 unit ${solution.unit}`);
}

function displayed(value: Rational, unit: TsdCp005Solution["unit"]): string {
  if (unit === "HOUR") return formatDurationHours(value);
  if (unit === "KM") return `${number(value)} km`;
  throw new Error(`Unsupported custom V2 distractor unit ${unit}`);
}

function rationals(value: unknown, output: Rational[] = []): Rational[] {
  if (!value || typeof value !== "object") return output;
  const candidate = value as Partial<Rational>;
  if (typeof candidate.numerator === "bigint" && typeof candidate.denominator === "bigint") {
    output.push(candidate as Rational);
    return output;
  }
  for (const child of Object.values(value as Record<string, unknown>)) rationals(child, output);
  return output;
}

function correctPosition(permanentQlId: string, seed: string): number {
  return (hashSeed(`${permanentQlId}:${seed}:v2`) + Number(permanentQlId.slice(-3))) % 4;
}

function authorityDifficulty(authorityKey: string): TsdCp005EnglishReviewQuestion["difficulty"] {
  if (authorityKey === "repeatedLinearMeetingTime") return "EASY";
  return "HARD";
}

function representation(authorityKey: string, ordinal: number): string {
  const authority = TSD_CP005_APPROVED_LEARNER_AUTHORITIES.find((entry) => entry.authorityKey === authorityKey);
  if (!authority) throw new Error(`${authorityKey}: approved authority missing in CP005 V2`);
  return authority.examRepresentations[ordinal % authority.examRepresentations.length]!;
}

function customStem(mode: TsdCp005SolveMode, input: TsdCp005Input, ordinal: number): string {
  const lead = [
    "Two travellers move between fixed endpoints A and B.",
    "A road trial follows two vehicles on the same bounded route.",
    "Two cyclists keep moving along a straight route and turn at its endpoints.",
    "A motion log records repeated travel between two fixed checkpoints.",
  ][ordinal % 4]!;
  const L = required(input.routeDistance, "routeDistance");
  const u = required(input.speedA, "speedA");
  const v = required(input.speedB, "speedB");
  if (mode === "findTimeBetweenFirstAndSecondMeetings") {
    return `${lead} The route is ${number(L)} km long. They start simultaneously from opposite ends at ${number(u)} km/h and ${number(v)} km/h and turn immediately at the endpoints. Find the time interval between their first and second meetings.`;
  }
  if (mode === "findShuttleDistanceCovered") {
    return `${lead} Both leave A together. The faster traveller moves at ${number(u)} km/h, reaches B on the ${number(L)} km route and turns back immediately; the other continues from A at ${number(v)} km/h. Find the total distance covered by the faster traveller before they meet on the return journey.`;
  }
  if (mode === "findEndpointRestTimeFromNextMeeting" || mode === "findRouteReversalScheduleParameter") {
    return `${lead} They start from opposite ends of a ${number(L)} km route at ${number(u)} km/h and ${number(v)} km/h. The faster traveller rests at the far endpoint before turning, while the other turns immediately. Their second meeting is ${formatDurationHours(required(input.observedSecondMeetingTime, "observedSecondMeetingTime"))} after the start. Find the endpoint rest time.`;
  }
  if (mode === "findDistanceBetweenEndpointsFromRepeatedMeetings") {
    return `${lead} Their speeds are ${number(u)} km/h and ${number(v)} km/h. Starting simultaneously from opposite ends and turning immediately at each endpoint, they meet first after ${formatDurationHours(required(input.observedFirstMeetingTime, "observedFirstMeetingTime"))} and again after ${formatDurationHours(required(input.observedSecondMeetingTime, "observedSecondMeetingTime"))}. Find the distance between the endpoints.`;
  }
  throw new Error(`${mode}: custom stem not defined`);
}

function customWrongValues(mode: TsdCp005SolveMode, input: TsdCp005Input): readonly Readonly<{ value: Rational; id: string; calculation: string; diagnosis: string }>[] {
  const L = required(input.routeDistance, "routeDistance");
  const u = required(input.speedA, "speedA");
  const v = required(input.speedB, "speedB");
  const sum = add(u, v);

  if (mode === "findTimeBetweenFirstAndSecondMeetings") {
    return Object.freeze([
      Object.freeze({ value: divide(L, sum), id: "RETURN_FIRST_MEETING_TIME", calculation: "L/(u+v)", diagnosis: "The first-meeting time was returned instead of the interval from the first meeting to the second." }),
      Object.freeze({ value: divide(multiply(rational(3), L), sum), id: "RETURN_ABSOLUTE_SECOND_MEETING_TIME", calculation: "3L/(u+v)", diagnosis: "The absolute time of the second meeting was returned instead of subtracting the first-meeting time." }),
      Object.freeze({ value: divide(L, u), id: "USE_ONE_TRAVELLER_ROUTE_TIME", calculation: "L/u", diagnosis: "Only the faster traveller's one-way endpoint time was used; repeated meetings depend on combined travel." }),
    ]);
  }

  if (mode === "findShuttleDistanceCovered") {
    const t = divide(multiply(rational(2), L), sum);
    return Object.freeze([
      Object.freeze({ value: L, id: "COUNT_OUTWARD_LEG_ONLY", calculation: "L", diagnosis: "Only the outward leg to the endpoint was counted; the return leg before the meeting was omitted." }),
      Object.freeze({ value: multiply(v, t), id: "USE_OTHER_TRAVELLER_DISTANCE", calculation: "v*2L/(u+v)", diagnosis: "The slower traveller's distance was used instead of the shuttle traveller's total path." }),
      Object.freeze({ value: divide(multiply(u, L), sum), id: "STOP_AT_ORDINARY_FIRST_MEETING", calculation: "uL/(u+v)", diagnosis: "Distance to the ordinary first opposite-end meeting was used, ignoring the endpoint turnaround." }),
    ]);
  }

  if (mode === "findEndpointRestTimeFromNextMeeting" || mode === "findRouteReversalScheduleParameter") {
    const observed = required(input.observedSecondMeetingTime, "observedSecondMeetingTime");
    const excess = subtract(multiply(sum, observed), multiply(rational(3), L));
    return Object.freeze([
      Object.freeze({ value: divide(excess, sum), id: "DIVIDE_LOST_DISTANCE_BY_COMBINED_SPEED", calculation: "((u+v)t-3L)/(u+v)", diagnosis: "The lost distance caused by the faster traveller's rest was converted with combined speed instead of that traveller's own speed." }),
      Object.freeze({ value: divide(subtract(multiply(sum, observed), multiply(rational(2), L)), u), id: "USE_TWO_ROUTE_SECOND_MEETING_BASELINE", calculation: "((u+v)t-2L)/u", diagnosis: "The no-rest second-meeting combined path was taken as 2L rather than 3L." }),
      Object.freeze({ value: subtract(observed, divide(L, sum)), id: "TREAT_POST_FIRST_INTERVAL_AS_REST", calculation: "observed second-meeting time - first-meeting time", diagnosis: "All elapsed time after the first meeting was incorrectly treated as endpoint rest." }),
    ]);
  }

  if (mode === "findDistanceBetweenEndpointsFromRepeatedMeetings") {
    const t1 = required(input.observedFirstMeetingTime, "observedFirstMeetingTime");
    const t2 = required(input.observedSecondMeetingTime, "observedSecondMeetingTime");
    const gap = subtract(t2, t1);
    return Object.freeze([
      Object.freeze({ value: multiply(sum, gap), id: "OMIT_TWO_ROUTE_GAP", calculation: "(u+v)(t2-t1)", diagnosis: "The interval between the first and second meetings represents 2L of combined travel, so division by 2 was omitted." }),
      Object.freeze({ value: multiply(sum, t1), id: "USE_FIRST_MEETING_ONLY", calculation: "(u+v)t1", diagnosis: "The first meeting was used alone instead of the repeated-meeting time gap specified in the question." }),
      Object.freeze({ value: divide(multiply(sum, gap), rational(3)), id: "DIVIDE_GAP_BY_SECOND_MEETING_MULTIPLIER", calculation: "(u+v)(t2-t1)/3", diagnosis: "The odd multiplier 3 for absolute second-meeting time was incorrectly applied to the first-to-second time gap." }),
    ]);
  }

  throw new Error(`${mode}: custom wrong values not defined`);
}

function customExplanation(authorityKey: string, mode: TsdCp005SolveMode, input: TsdCp005Input, solution: TsdCp005Solution, final: string) {
  const L = required(input.routeDistance, "routeDistance");
  const u = required(input.speedA, "speedA");
  const v = required(input.speedB, "speedB");
  const sum = add(u, v);
  if (mode === "findTimeBetweenFirstAndSecondMeetings") {
    return Object.freeze({
      method: "Unfold the endpoint reflections. The first meeting occurs after combined travel L, and the second after combined travel 3L.",
      steps: Object.freeze([
        `Combined speed = ${number(u)} + ${number(v)} = ${number(sum)} km/h.`,
        `Time gap = (3L - L)/(u+v) = 2 x ${number(L)} / ${number(sum)} = ${final}.`,
      ]),
      shortcut: "For instantaneous endpoint turns, the gap between the first and second meetings is 2L/(u+v).",
      finalAnswer: `Therefore, the required interval is ${final}.`,
    });
  }
  if (mode === "findShuttleDistanceCovered") {
    const t = divide(multiply(rational(2), L), sum);
    return Object.freeze({
      method: "At the return meeting, the faster traveller's complete path plus the slower traveller's path equals twice the route length.",
      steps: Object.freeze([
        `Meeting time = 2 x ${number(L)} / (${number(u)} + ${number(v)}) = ${formatDurationHours(t)}.`,
        `Faster traveller's total distance = ${number(u)} x ${number(t)} = ${final}.`,
      ]),
      shortcut: "Find the one-turn meeting time first; then multiply that full time by the shuttle traveller's speed.",
      finalAnswer: `Therefore, the faster traveller covers ${final}.`,
    });
  }
  if (mode === "findEndpointRestTimeFromNextMeeting" || mode === "findRouteReversalScheduleParameter") {
    const observed = required(input.observedSecondMeetingTime, "observedSecondMeetingTime");
    const excess = subtract(multiply(sum, observed), multiply(rational(3), L));
    return Object.freeze({
      method: "Without a rest, the second meeting corresponds to combined travel of 3L. Any excess in the observed schedule is distance lost only by the resting traveller.",
      steps: Object.freeze([
        `Observed combined travel = (${number(u)} + ${number(v)}) x ${number(observed)} = ${number(multiply(sum, observed))} km-equivalent.`,
        `Extra distance due to the rest = ${number(multiply(sum, observed))} - 3 x ${number(L)} = ${number(excess)} km.`,
        `Rest time = ${number(excess)} / ${number(u)} = ${final}.`,
      ]),
      shortcut: "Rest = ((u+v)t2 - 3L)/u when traveller A alone rests at its endpoint.",
      finalAnswer: `Therefore, the endpoint rest time is ${final}.`,
    });
  }
  const t1 = required(input.observedFirstMeetingTime, "observedFirstMeetingTime");
  const t2 = required(input.observedSecondMeetingTime, "observedSecondMeetingTime");
  const gap = subtract(t2, t1);
  return Object.freeze({
    method: "Between the first and second meetings the two travellers add exactly two route lengths of combined travel.",
    steps: Object.freeze([
      `Combined speed = ${number(u)} + ${number(v)} = ${number(sum)} km/h.`,
      `Time gap = ${formatDurationHours(t2)} - ${formatDurationHours(t1)} = ${formatDurationHours(gap)}.`,
      `2L = ${number(sum)} x ${number(gap)}, so L = ${final}.`,
    ]),
    shortcut: "Route length = (u+v)(t2-t1)/2 for the first-to-second meeting gap.",
    finalAnswer: `Therefore, the distance between endpoints is ${final}.`,
  });
}

function customQuestion(authorityKey: string, mode: TsdCp005SolveMode, seed: string, ordinal: number): TsdCp005EnglishReviewQuestion {
  const input = buildCp005Input(mode, seed);
  const solution = solveCp005(mode, input);
  const independent = independentlyVerifyCp005(input, solution);
  if (!independent.valid) throw new Error(`${mode}: custom V2 state failed verification: ${independent.errors.join("; ")}`);
  const permanentQlId = cp005QlForAuthority(authorityKey).permanentQlId;
  const correct = answerText(solution);
  const wrongs = customWrongValues(mode, input).map((entry) => Object.freeze({
    text: displayed(entry.value, solution.unit),
    misconceptionId: entry.id,
    calculation: entry.calculation,
    diagnosis: entry.diagnosis,
  }));
  const unique = wrongs.filter((entry, index) => entry.text !== correct && wrongs.findIndex((candidate) => candidate.text === entry.text) === index);
  if (unique.length !== 3) throw new Error(`${mode}: V2 custom distractors are not three distinct displayed answers`);
  const position = correctPosition(permanentQlId, seed);
  const audits: TsdCp005ReviewOptionAudit[] = unique.map((entry) => Object.freeze({
    text: entry.text,
    misconceptionId: entry.misconceptionId,
    isCorrect: false,
    wrongWorking: Object.freeze({ calculation: entry.calculation, diagnosis: entry.diagnosis }),
  }));
  audits.splice(position, 0, Object.freeze({ text: correct, misconceptionId: "CORRECT", isCorrect: true, wrongWorking: null }));
  const options = Object.freeze(audits.map((entry) => entry.text));
  const explanation = customExplanation(authorityKey, mode, input, solution, correct);
  const errors: string[] = [];
  if (new Set(options).size !== 4) errors.push("V2 custom options are not unique");
  if (options[position] !== correct) errors.push("V2 custom keyed answer mismatch");
  if (audits.filter((entry) => !entry.isCorrect && entry.wrongWorking).length !== 3) errors.push("V2 custom wrong-working provenance missing");
  const draft = {
    chapterId: "TSD-001" as const,
    checkpointId: "TSD-CP-005" as const,
    authorityKey,
    permanentQlId,
    solveMode: mode,
    representation: representation(authorityKey, ordinal),
    language: "en" as const,
    seed,
    difficulty: authorityDifficulty(authorityKey),
    stem: customStem(mode, input, ordinal),
    input,
    solution,
    answerText: correct,
    options,
    correctIndex: position,
    internalOptionAudit: Object.freeze(audits),
    explanation,
    mathematicalFingerprint: `${authorityKey}|${mode}|${rationals(input).map(toCanonicalString).join("|")}`,
    lifecycle: Object.freeze({
      reviewStatus: "ENGLISH_REVIEW_CANDIDATE" as const,
      englishFreezeStatus: "UNFROZEN" as const,
      questionStudioEnabled: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
  };
  return Object.freeze({ ...draft, validation: Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), warnings: Object.freeze([] as string[]) }) });
}

export function generateCp005ReviewQuestionV2(authorityKey: string, seed: string, ordinal = 0): TsdCp005EnglishReviewQuestion {
  const authority = TSD_CP005_APPROVED_LEARNER_AUTHORITIES.find((entry) => entry.authorityKey === authorityKey);
  if (!authority) throw new Error(`${authorityKey}: not an approved CP005 learner authority`);
  const mode = authority.underlyingSolveModes[ordinal % authority.underlyingSolveModes.length] as TsdCp005SolveMode;
  if (CUSTOM_MODES.has(mode)) return customQuestion(authorityKey, mode, seed, ordinal);

  const failures: string[] = [];
  for (let attempt = 0; attempt < 16; attempt += 1) {
    const candidateSeed = attempt === 0 ? seed : `${seed}:semantic-retry-${attempt}`;
    try {
      return generateCp005ReviewQuestion(authorityKey, candidateSeed, ordinal);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
  throw new Error(`${authorityKey}/${mode}: could not construct a collision-free CP005 English question; ${failures.slice(-3).join(" | ")}`);
}

export function generateCp005ReviewSetV2(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V2 perAuthority must be a positive integer");
  return Object.freeze(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestionV2(authority.authorityKey, `cp005-review-v2:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}

export function generateCp005EnglishAuditPoolV2(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V2 audit perAuthority must be a positive integer");
  return Object.freeze(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestionV2(authority.authorityKey, `cp005-audit-v2:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}
