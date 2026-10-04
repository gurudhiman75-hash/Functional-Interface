import { add, divide, multiply, rational, subtract, toCanonicalString, type Rational } from "../foundation/rational";
import { formatDurationHours, formatExamNumber, hashSeed } from "../cp003/generation-support";
import { TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import type { TsdCp005EnglishReviewQuestion, TsdCp005ReviewOptionAudit } from "./english-review-runtime";
import { generateCp005ReviewQuestionV5 } from "./english-review-runtime-v5";
import { buildCp005Input } from "./generator";
import { cp005QlForAuthority } from "./ql-allocation";
import { solveCp005 } from "./solver";
import type { TsdCp005Input, TsdCp005SolveMode } from "./types";
import { independentlyVerifyCp005 } from "./verifier";

function required(value: Rational | undefined, name: string): Rational {
  if (!value) throw new Error(`CP005 V6 missing ${name}`);
  return value;
}

function ordinalLabel(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  switch (value % 10) {
    case 1: return `${value}st`;
    case 2: return `${value}nd`;
    case 3: return `${value}rd`;
    default: return `${value}th`;
  }
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

function semanticFingerprint(authorityKey: string, mode: TsdCp005SolveMode, input: TsdCp005Input): string {
  const extras: string[] = [];
  if (input.nthMeeting !== undefined) extras.push(`nth=${input.nthMeeting}`);
  if (input.targetPostBody !== undefined) extras.push(`target=${input.targetPostBody}`);
  return [authorityKey, mode, ...rationals(input).map(toCanonicalString), ...extras].join("|");
}

function representation(authorityKey: string, ordinal: number): string {
  const authority = TSD_CP005_APPROVED_LEARNER_AUTHORITIES.find((entry) => entry.authorityKey === authorityKey);
  if (!authority) throw new Error(`${authorityKey}: approved authority missing in CP005 V6`);
  return authority.examRepresentations[ordinal % authority.examRepresentations.length]!;
}

function nthPointQuestionV6(authorityKey: string, seed: string, ordinal: number): TsdCp005EnglishReviewQuestion {
  const mode: TsdCp005SolveMode = "findNthMeetingPointOnLine";
  const input = buildCp005Input(mode, seed);
  const solution = solveCp005(mode, input);
  const verification = independentlyVerifyCp005(input, solution);
  if (!verification.valid || solution.answerKind !== "VALUE" || !solution.value || solution.unit !== "KM") {
    throw new Error(`${mode}: invalid V6 nth-point solution`);
  }

  const L = required(input.routeDistance, "routeDistance");
  const u = required(input.speedA, "speedA");
  const v = required(input.speedB, "speedB");
  const n = input.nthMeeting;
  if (!n || n < 2) throw new Error(`${mode}: V6 learner nth meeting must be at least 2`);
  const combinedSpeed = add(u, v);
  const combinedPath = multiply(rational(2 * n - 1), L);
  const meetingTime = divide(combinedPath, combinedSpeed);
  const aTotalPath = multiply(u, meetingTime);
  const firstPoint = divide(multiply(L, u), combinedSpeed);
  const correct = `${formatExamNumber(solution.value)} km`;

  const candidates = [
    {
      value: firstPoint,
      id: "REUSE_FIRST_MEETING_POINT",
      calculation: "uL/(u+v)",
      diagnosis: "The first meeting coordinate was reused even though later endpoint reflections change the physical meeting point.",
    },
    {
      value: subtract(L, solution.value),
      id: "MEASURE_FROM_OPPOSITE_ENDPOINT",
      calculation: "L - correct coordinate",
      diagnosis: "The reflected meeting point was measured from the opposite endpoint instead of A's starting end.",
    },
    {
      value: divide(L, rational(2)),
      id: "ASSUME_MIDPOINT",
      calculation: "L/2",
      diagnosis: "The meeting was assumed to occur at the midpoint without using the unequal speeds and repeated reflections.",
    },
    {
      value: aTotalPath,
      id: "USE_TOTAL_PATH_AS_PHYSICAL_COORDINATE",
      calculation: "u × meeting time",
      diagnosis: "A's total path length was reported directly as a position, without reflecting it back inside the bounded route.",
    },
    {
      value: multiply(v, meetingTime),
      id: "USE_OTHER_TRAVELLER_TOTAL_PATH",
      calculation: "v × meeting time",
      diagnosis: "B's total travelled path was mistaken for the requested physical coordinate from A's starting end.",
    },
  ].map((entry) => Object.freeze({ ...entry, text: `${formatExamNumber(entry.value)} km` }));

  const distinct = candidates.filter((entry, index) => entry.text !== correct && candidates.findIndex((candidate) => candidate.text === entry.text) === index);
  if (distinct.length < 3) throw new Error(`${mode}: V6 semantic pool produced fewer than three distinct distractors for ${seed}`);
  const wrongs = distinct.slice(0, 3);
  const permanentQlId = cp005QlForAuthority(authorityKey).permanentQlId;
  const correctIndex = (hashSeed(`${permanentQlId}:${seed}:v6`) + Number(permanentQlId.slice(-3))) % 4;
  const audits: TsdCp005ReviewOptionAudit[] = wrongs.map((entry) => Object.freeze({
    text: entry.text,
    misconceptionId: entry.id,
    isCorrect: false,
    wrongWorking: Object.freeze({ calculation: entry.calculation, diagnosis: entry.diagnosis }),
  }));
  audits.splice(correctIndex, 0, Object.freeze({ text: correct, misconceptionId: "CORRECT", isCorrect: true, wrongWorking: null }));
  const options = Object.freeze(audits.map((entry) => entry.text));
  if (new Set(options).size !== 4) throw new Error(`${mode}: V6 nth-point options are not unique`);

  const lead = [
    "Two travellers move repeatedly between fixed endpoints A and B.",
    "Two vehicles travel back and forth between endpoints P and Q.",
    "Two cyclists start from opposite ends of the same bounded route.",
    "Two runners keep moving on a straight route and reverse instantly at each endpoint.",
  ][ordinal % 4]!;
  const stem = `${lead} The endpoints are ${formatExamNumber(L)} km apart. A and B travel at ${formatExamNumber(u)} km/h and ${formatExamNumber(v)} km/h respectively, starting simultaneously from opposite ends. How far from A's starting end is their ${ordinalLabel(n)} meeting point?`;
  const explanation = Object.freeze({
    method: "Unfold the repeated endpoint motion into straight-line combined travel, find the meeting time, then reflect A's travelled path back into the physical route.",
    steps: Object.freeze([
      `For the ${ordinalLabel(n)} meeting, the combined unfolded path is (2×${n}-1)×${formatExamNumber(L)} = ${formatExamNumber(combinedPath)} km.`,
      `Combined speed = ${formatExamNumber(u)} + ${formatExamNumber(v)} = ${formatExamNumber(combinedSpeed)} km/h, so meeting time = ${formatExamNumber(combinedPath)}/${formatExamNumber(combinedSpeed)} = ${formatDurationHours(meetingTime)}.`,
      `In that time A travels ${formatExamNumber(u)} × ${formatExamNumber(meetingTime)} = ${formatExamNumber(aTotalPath)} km in total.`,
      `Reflecting this travelled path at the two endpoints places the meeting ${formatExamNumber(solution.value)} km from A's starting end.`,
    ]),
    shortcut: "Use the odd-multiple meeting time first; only then reflect the traveller's total path back into the route to obtain the physical coordinate.",
    finalAnswer: `Therefore, the ${ordinalLabel(n)} meeting point is ${correct} from A's starting end.`,
  });

  return Object.freeze({
    chapterId: "TSD-001" as const,
    checkpointId: "TSD-CP-005" as const,
    authorityKey,
    permanentQlId,
    solveMode: mode,
    representation: representation(authorityKey, ordinal),
    language: "en" as const,
    seed,
    difficulty: "MEDIUM" as const,
    stem,
    input,
    solution,
    answerText: correct,
    options,
    correctIndex,
    internalOptionAudit: Object.freeze(audits),
    explanation,
    mathematicalFingerprint: semanticFingerprint(authorityKey, mode, input),
    validation: Object.freeze({ valid: true, errors: Object.freeze([] as string[]), warnings: Object.freeze([] as string[]) }),
    lifecycle: Object.freeze({
      reviewStatus: "ENGLISH_REVIEW_CANDIDATE" as const,
      englishFreezeStatus: "UNFROZEN" as const,
      questionStudioEnabled: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
  });
}

function enrichFingerprint(question: TsdCp005EnglishReviewQuestion): TsdCp005EnglishReviewQuestion {
  const mathematicalFingerprint = semanticFingerprint(question.authorityKey, question.solveMode, question.input);
  return mathematicalFingerprint === question.mathematicalFingerprint
    ? question
    : Object.freeze({ ...question, mathematicalFingerprint });
}

export function generateCp005ReviewQuestionV6(authorityKey: string, seed: string, ordinal = 0): TsdCp005EnglishReviewQuestion {
  const authority = TSD_CP005_APPROVED_LEARNER_AUTHORITIES.find((entry) => entry.authorityKey === authorityKey);
  if (!authority) throw new Error(`${authorityKey}: not an approved CP005 learner authority`);
  const mode = authority.underlyingSolveModes[ordinal % authority.underlyingSolveModes.length] as TsdCp005SolveMode;
  if (mode === "findNthMeetingPointOnLine") return nthPointQuestionV6(authorityKey, seed, ordinal);
  return enrichFingerprint(generateCp005ReviewQuestionV5(authorityKey, seed, ordinal));
}

export function generateCp005ReviewSetV6(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V6 perAuthority must be a positive integer");
  return Object.freeze(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestionV6(authority.authorityKey, `cp005-review-v6:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}

export function generateCp005EnglishAuditPoolV6(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V6 audit perAuthority must be a positive integer");
  return Object.freeze(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestionV6(authority.authorityKey, `cp005-audit-v6:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}
