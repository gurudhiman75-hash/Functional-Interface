import { add, divide, multiply, rational, subtract, toCanonicalString, type Rational } from "../foundation/rational";
import { formatDurationHours, formatExamNumber, hashSeed } from "../cp003/generation-support";
import { TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import { buildCp005Input } from "./generator";
import { cp005QlForAuthority } from "./ql-allocation";
import type { TsdCp005EnglishReviewQuestion, TsdCp005ReviewOptionAudit } from "./english-review-runtime";
import { generateCp005ReviewQuestionV2 } from "./english-review-runtime-v2";
import { solveCp005 } from "./solver";
import type { TsdCp005Input, TsdCp005SolveMode } from "./types";
import { independentlyVerifyCp005 } from "./verifier";

function required(value: Rational | undefined, name: string): Rational {
  if (!value) throw new Error(`CP005 V3 missing ${name}`);
  return value;
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

function representation(authorityKey: string, ordinal: number): string {
  const authority = TSD_CP005_APPROVED_LEARNER_AUTHORITIES.find((entry) => entry.authorityKey === authorityKey);
  if (!authority) throw new Error(`${authorityKey}: approved authority missing in CP005 V3`);
  return authority.examRepresentations[ordinal % authority.examRepresentations.length]!;
}

function routeInverseQuestion(authorityKey: string, seed: string, ordinal: number): TsdCp005EnglishReviewQuestion {
  const mode: TsdCp005SolveMode = "findDistanceBetweenEndpointsFromRepeatedMeetings";
  const input: TsdCp005Input = buildCp005Input(mode, seed);
  const solution = solveCp005(mode, input);
  const verification = independentlyVerifyCp005(input, solution);
  if (!verification.valid || solution.answerKind !== "VALUE" || !solution.value || solution.unit !== "KM") {
    throw new Error(`${mode}: invalid V3 inverse repeated-meeting solution`);
  }

  const u = required(input.speedA, "speedA");
  const v = required(input.speedB, "speedB");
  const t1 = required(input.observedFirstMeetingTime, "observedFirstMeetingTime");
  const t2 = required(input.observedSecondMeetingTime, "observedSecondMeetingTime");
  const sum = add(u, v);
  const gap = subtract(t2, t1);
  const correct = `${formatExamNumber(solution.value)} km`;
  const wrongValues = Object.freeze([
    Object.freeze({ value: multiply(sum, gap), id: "OMIT_TWO_ROUTE_GAP", calculation: "(u+v)(t2-t1)", diagnosis: "The first-to-second meeting interval represents two route lengths of combined travel, so the required division by 2 was omitted." }),
    Object.freeze({ value: multiply(sum, t1), id: "USE_FIRST_MEETING_ONLY", calculation: "(u+v)t1", diagnosis: "Only the first meeting was used even though the question asks you to reconstruct the route from repeated-meeting evidence." }),
    Object.freeze({ value: divide(multiply(sum, gap), rational(3)), id: "APPLY_SECOND_MEETING_ODD_MULTIPLIER_TO_GAP", calculation: "(u+v)(t2-t1)/3", diagnosis: "The absolute second-meeting multiplier 3 was incorrectly applied to the interval between the first and second meetings." }),
  ]);
  const wrongs = wrongValues.map((entry) => Object.freeze({ ...entry, text: `${formatExamNumber(entry.value)} km` }));
  if (new Set([correct, ...wrongs.map((entry) => entry.text)]).size !== 4) throw new Error(`${mode}: V3 inverse distractors are not unique`);

  const permanentQlId = cp005QlForAuthority(authorityKey).permanentQlId;
  const correctIndex = (hashSeed(`${permanentQlId}:${seed}:v3`) + Number(permanentQlId.slice(-3))) % 4;
  const audits: TsdCp005ReviewOptionAudit[] = wrongs.map((entry) => Object.freeze({
    text: entry.text,
    misconceptionId: entry.id,
    isCorrect: false,
    wrongWorking: Object.freeze({ calculation: entry.calculation, diagnosis: entry.diagnosis }),
  }));
  audits.splice(correctIndex, 0, Object.freeze({ text: correct, misconceptionId: "CORRECT", isCorrect: true, wrongWorking: null }));
  const options = Object.freeze(audits.map((entry) => entry.text));

  const lead = [
    "Two travellers move repeatedly between fixed endpoints A and B.",
    "A road trial records repeated meetings of two vehicles between endpoints P and Q.",
    "Two cyclists start from opposite ends of the same bounded route.",
    "A motion log follows two runners who reverse immediately at the endpoints.",
  ][ordinal % 4]!;
  const stem = `${lead} Their speeds are ${formatExamNumber(u)} km/h and ${formatExamNumber(v)} km/h. They start simultaneously from opposite ends, meet first after ${formatDurationHours(t1)} and meet a second time after ${formatDurationHours(t2)}. Find the distance between the endpoints.`;
  const explanation = Object.freeze({
    method: "Between the first and second meetings, the two travellers together cover exactly two complete route lengths.",
    steps: Object.freeze([
      `Combined speed = ${formatExamNumber(u)} + ${formatExamNumber(v)} = ${formatExamNumber(sum)} km/h.`,
      `Time between meetings = ${formatDurationHours(t2)} - ${formatDurationHours(t1)} = ${formatDurationHours(gap)}.`,
      `So 2L = ${formatExamNumber(sum)} x ${formatExamNumber(gap)}, giving L = ${formatExamNumber(solution.value)} km.`,
    ]),
    shortcut: "For the first-to-second meeting gap on a bounded line, L = (u+v)(t2-t1)/2.",
    finalAnswer: `Therefore, the distance between the endpoints is ${correct}.`,
  });

  const draft = {
    chapterId: "TSD-001" as const,
    checkpointId: "TSD-CP-005" as const,
    authorityKey,
    permanentQlId,
    solveMode: mode,
    representation: representation(authorityKey, ordinal),
    language: "en" as const,
    seed,
    difficulty: "HARD" as const,
    stem,
    input,
    solution,
    answerText: correct,
    options,
    correctIndex,
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
  return Object.freeze({ ...draft, validation: Object.freeze({ valid: true, errors: Object.freeze([] as string[]), warnings: Object.freeze([] as string[]) }) });
}

export function generateCp005ReviewQuestionV3(authorityKey: string, seed: string, ordinal = 0): TsdCp005EnglishReviewQuestion {
  const authority = TSD_CP005_APPROVED_LEARNER_AUTHORITIES.find((entry) => entry.authorityKey === authorityKey);
  if (!authority) throw new Error(`${authorityKey}: not an approved CP005 learner authority`);
  const mode = authority.underlyingSolveModes[ordinal % authority.underlyingSolveModes.length] as TsdCp005SolveMode;
  if (mode === "findDistanceBetweenEndpointsFromRepeatedMeetings") return routeInverseQuestion(authorityKey, seed, ordinal);
  return generateCp005ReviewQuestionV2(authorityKey, seed, ordinal);
}

export function generateCp005ReviewSetV3(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V3 perAuthority must be a positive integer");
  return Object.freeze(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestionV3(authority.authorityKey, `cp005-review-v3:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}

export function generateCp005EnglishAuditPoolV3(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V3 audit perAuthority must be a positive integer");
  return Object.freeze(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestionV3(authority.authorityKey, `cp005-audit-v3:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}
