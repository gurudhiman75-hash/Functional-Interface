import { divide, rational } from "../../TSD-001/foundation/rational";
import { TSD_CP009_ENGLISH_REVIEW_CASES, type TsdCp009EnglishReviewCase } from "./english-review-cases";
import { solveTsdCp009 } from "./executable-solver";
import type { TsdCp009ExecutableInput } from "./executable-types";
import { verifyTsdCp009 } from "./executable-verifier";

export type { TsdCp009EnglishReviewCase } from "./english-review-cases";

const K = (kmh: number) => rational(kmh * 5, 18);
const D = (km: number) => rational(km * 1000);
const H = (hours: number) => rational(hours * 3600);
const M = (minutes: number) => rational(minutes * 60);

const sourceByFamily = new Map(TSD_CP009_ENGLISH_REVIEW_CASES.map((entry) => [entry.familyId, entry] as const));

function checked(familyId: string, input: TsdCp009ExecutableInput): TsdCp009EnglishReviewCase {
  const source = sourceByFamily.get(familyId);
  if (!source) throw new Error(`${familyId}: localized review source family missing`);
  const solution = solveTsdCp009(input);
  const verification = verifyTsdCp009(input, solution);
  if (!verification.valid) throw new Error(`${familyId}: localized natural review case failed executable verification`);
  return Object.freeze({ qlId: source.qlId, familyId, input, solution });
}

function changedCase(
  familyId: string,
  u: number,
  c1: number,
  c2: number,
  distanceKm: number,
  direction: "ASSISTED" | "OPPOSED",
  target: "NEW_MEDIUM_SPEED" | "MEDIUM_SPEED_CHANGE",
): TsdCp009EnglishReviewCase {
  const firstGround = direction === "ASSISTED" ? K(u + c1) : K(u - c1);
  const secondGround = direction === "ASSISTED" ? K(u + c2) : K(u - c2);
  return checked(familyId, Object.freeze({
    authorityKey: "changingMediumState",
    bodyRelativeSpeed: K(u),
    distance: D(distanceKm),
    direction,
    firstTripTime: divide(D(distanceKm), firstGround),
    secondTripTime: divide(D(distanceKm), secondGround),
    target,
  }));
}

const overrides = new Map<string, TsdCp009EnglishReviewCase>([
  ["104-C", checked("104-C", Object.freeze({ authorityKey: "mediumAdjustedGroundSpeed", bodyRelativeSpeed: K(6), mediumSpeed: K(2), direction: "ASSISTED" }))],
  ["104-E", checked("104-E", Object.freeze({ authorityKey: "mediumAdjustedGroundSpeed", bodyRelativeSpeed: K(240), mediumSpeed: K(20), direction: "ASSISTED" }))],

  ["105-E", checked("105-E", Object.freeze({ authorityKey: "mediumComponentsFromAssistedOpposedSpeeds", assistedGroundSpeed: K(260), opposedGroundSpeed: K(220), target: "BODY_SPEED" }))],
  ["105-F", checked("105-F", Object.freeze({ authorityKey: "mediumComponentsFromAssistedOpposedSpeeds", assistedGroundSpeed: K(330), opposedGroundSpeed: K(270), target: "MEDIUM_SPEED" }))],

  ["108-F", checked("108-F", Object.freeze({ authorityKey: "roundTripMediumState", bodyRelativeSpeed: K(250), mediumSpeed: K(50), oneWayDistance: D(600), target: "AVERAGE_SPEED" }))],

  ["110-A", checked("110-A", Object.freeze({ authorityKey: "equalTimeMediumDistanceSpread", mediumSpeed: K(3), equalTime: H(1) }))],
  ["110-B", checked("110-B", Object.freeze({ authorityKey: "equalTimeMediumDistanceSpread", mediumSpeed: K(2), equalTime: H(2) }))],
  ["110-C", checked("110-C", Object.freeze({ authorityKey: "equalTimeMediumDistanceSpread", mediumSpeed: K(2), equalTime: H(1) }))],
  ["110-D", checked("110-D", Object.freeze({ authorityKey: "equalTimeMediumDistanceSpread", mediumSpeed: K(4), equalTime: H(1) }))],
  ["110-E", checked("110-E", Object.freeze({ authorityKey: "equalTimeMediumDistanceSpread", mediumSpeed: K(20), equalTime: H(2) }))],
  ["110-F", checked("110-F", Object.freeze({ authorityKey: "equalTimeMediumDistanceSpread", mediumSpeed: K(3), equalTime: M(90) }))],

  ["113-A", checked("113-A", Object.freeze({ authorityKey: "floatingObjectRecoveryState", bodyRelativeSpeed: K(12), mediumSpeed: K(3), separationTimeBeforeTurn: M(30), target: "RECOVERY_TIME_AFTER_TURN" }))],
  ["113-B", checked("113-B", Object.freeze({ authorityKey: "floatingObjectRecoveryState", bodyRelativeSpeed: K(15), mediumSpeed: K(4), separationTimeBeforeTurn: M(15), target: "RECOVERY_DISTANCE_FROM_DROP" }))],
  ["113-C", checked("113-C", Object.freeze({ authorityKey: "floatingObjectRecoveryState", bodyRelativeSpeed: K(18), mediumSpeed: K(5), separationTimeBeforeTurn: M(20), target: "RECOVERY_TIME_AFTER_TURN" }))],
  ["113-D", checked("113-D", Object.freeze({ authorityKey: "floatingObjectRecoveryState", bodyRelativeSpeed: K(16), mediumSpeed: K(3), separationTimeBeforeTurn: M(30), target: "RECOVERY_DISTANCE_FROM_DROP" }))],
  ["113-E", checked("113-E", Object.freeze({ authorityKey: "floatingObjectRecoveryState", bodyRelativeSpeed: K(20), mediumSpeed: K(6), separationTimeBeforeTurn: M(15), target: "RECOVERY_TIME_AFTER_TURN" }))],
  ["113-F", checked("113-F", Object.freeze({ authorityKey: "floatingObjectRecoveryState", bodyRelativeSpeed: K(14), mediumSpeed: K(2), separationTimeBeforeTurn: M(45), target: "RECOVERY_DISTANCE_FROM_DROP" }))],

  ["114-A", changedCase("114-A", 12, 2, 4, 56, "ASSISTED", "NEW_MEDIUM_SPEED")],
  ["114-C", changedCase("114-C", 16, 2, 4, 90, "ASSISTED", "NEW_MEDIUM_SPEED")],
  ["114-D", changedCase("114-D", 20, 4, 5, 120, "OPPOSED", "MEDIUM_SPEED_CHANGE")],
  ["114-E", changedCase("114-E", 14, 1, 2, 120, "ASSISTED", "NEW_MEDIUM_SPEED")],
]);

export const TSD_CP009_LOCALIZED_REVIEW_CASES: readonly TsdCp009EnglishReviewCase[] = Object.freeze(
  TSD_CP009_ENGLISH_REVIEW_CASES.map((entry) => overrides.get(entry.familyId) ?? entry),
);

if (TSD_CP009_LOCALIZED_REVIEW_CASES.length !== 66) throw new Error("CP009 localized review must retain 66 families");
for (const entry of TSD_CP009_LOCALIZED_REVIEW_CASES) {
  if (!verifyTsdCp009(entry.input, entry.solution).valid) throw new Error(`${entry.familyId}: final localized review case verification failed`);
}
