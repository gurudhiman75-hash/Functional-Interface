import { add, divide, multiply, rational } from "../../TSD-001/foundation/rational";
import { solveTsdCp009 } from "./executable-solver";
import type { TsdCp009ExecutableInput, TsdCp009ExecutableSolution } from "./executable-types";
import { verifyTsdCp009 } from "./executable-verifier";

export interface TsdCp009EnglishReviewCase {
  readonly qlId: `TSD-QL-${string}`;
  readonly familyId: string;
  readonly input: TsdCp009ExecutableInput;
  readonly solution: TsdCp009ExecutableSolution;
}

const K = (kmh: number) => rational(kmh * 5, 18);
const D = (km: number) => rational(km * 1000);
const H = (hours: number) => rational(hours * 3600);
const R = rational;
const letters = ["A", "B", "C", "D", "E", "F"] as const;
const output: TsdCp009EnglishReviewCase[] = [];

function checked(qlId: `TSD-QL-${string}`, familyId: string, input: TsdCp009ExecutableInput): TsdCp009EnglishReviewCase {
  const solution = solveTsdCp009(input);
  const verification = verifyTsdCp009(input, solution);
  if (!verification.valid) throw new Error(`${familyId}: CP009 natural review case failed executable verification`);
  return Object.freeze({ qlId, familyId, input, solution });
}

const q104 = [
  [12, 3, "ASSISTED"], [15, 4, "OPPOSED"], [18, 5, "ASSISTED"],
  [16, 3, "OPPOSED"], [20, 4, "ASSISTED"], [14, 2, "OPPOSED"],
] as const;
q104.forEach(([u, c, direction], i) => output.push(checked("TSD-QL-104", `104-${letters[i]}`, Object.freeze({ authorityKey: "mediumAdjustedGroundSpeed", bodyRelativeSpeed: K(u), mediumSpeed: K(c), direction }))));

const q105 = [
  [12, 3, "BODY_SPEED"], [15, 5, "MEDIUM_SPEED"], [18, 4, "BODY_SPEED"],
  [16, 2, "MEDIUM_SPEED"], [20, 6, "BODY_SPEED"], [14, 3, "MEDIUM_SPEED"],
] as const;
q105.forEach(([u, c, target], i) => output.push(checked("TSD-QL-105", `105-${letters[i]}`, Object.freeze({ authorityKey: "mediumComponentsFromAssistedOpposedSpeeds", assistedGroundSpeed: K(u + c), opposedGroundSpeed: K(u - c), target }))));

const q106: readonly TsdCp009ExecutableInput[] = [
  Object.freeze({ authorityKey: "mediumLegTravelState", bodyRelativeSpeed: K(12), mediumSpeed: K(3), direction: "ASSISTED", target: "TIME", distance: D(45) }),
  Object.freeze({ authorityKey: "mediumLegTravelState", bodyRelativeSpeed: K(15), mediumSpeed: K(3), direction: "OPPOSED", target: "DISTANCE", time: H(2) }),
  Object.freeze({ authorityKey: "mediumLegTravelState", bodyRelativeSpeed: K(18), mediumSpeed: K(6), direction: "OPPOSED", target: "TIME", distance: D(48) }),
  Object.freeze({ authorityKey: "mediumLegTravelState", bodyRelativeSpeed: K(16), mediumSpeed: K(4), direction: "ASSISTED", target: "DISTANCE", time: H(3) }),
  Object.freeze({ authorityKey: "mediumLegTravelState", bodyRelativeSpeed: K(20), mediumSpeed: K(5), direction: "ASSISTED", target: "TIME", distance: D(75) }),
  Object.freeze({ authorityKey: "mediumLegTravelState", bodyRelativeSpeed: K(14), mediumSpeed: K(2), direction: "OPPOSED", target: "DISTANCE", time: H(4) }),
];
q106.forEach((input, i) => output.push(checked("TSD-QL-106", `106-${letters[i]}`, input)));

const q107: readonly TsdCp009ExecutableInput[] = [
  Object.freeze({ authorityKey: "pairedEqualDistanceMediumState", mode: "COMPONENT_FROM_DISTANCE_AND_TIMES", equalDistance: D(45), assistedTime: H(3), opposedTime: H(5), target: "BODY_SPEED" }),
  Object.freeze({ authorityKey: "pairedEqualDistanceMediumState", mode: "COMPONENT_FROM_DISTANCE_AND_TIMES", equalDistance: D(40), assistedTime: H(2), opposedTime: H(4), target: "MEDIUM_SPEED" }),
  Object.freeze({ authorityKey: "pairedEqualDistanceMediumState", mode: "DISTANCE_FROM_TIME_DIFFERENCE", bodyRelativeSpeed: K(18), mediumSpeed: K(3), opposedMinusAssistedTime: H(2), target: "DISTANCE" }),
  Object.freeze({ authorityKey: "pairedEqualDistanceMediumState", mode: "BODY_SPEED_FROM_TIME_RATIO", mediumSpeed: K(3), opposedToAssistedTimeRatio: R(5, 3), target: "BODY_SPEED" }),
  Object.freeze({ authorityKey: "pairedEqualDistanceMediumState", mode: "MEDIUM_SPEED_FROM_TIME_RATIO", bodyRelativeSpeed: K(20), opposedToAssistedTimeRatio: R(3, 2), target: "MEDIUM_SPEED" }),
  Object.freeze({ authorityKey: "pairedEqualDistanceMediumState", mode: "COMPONENT_FROM_DISTANCE_AND_TIMES", equalDistance: D(60), assistedTime: H(3), opposedTime: H(5), target: "MEDIUM_SPEED" }),
];
q107.forEach((input, i) => output.push(checked("TSD-QL-107", `107-${letters[i]}`, input)));

const q108 = [
  [12, 3, 45, "TOTAL_TIME"], [20, 10, 60, "AVERAGE_SPEED"], [18, 6, 48, "TOTAL_TIME"],
  [18, 6, 48, "AVERAGE_SPEED"], [15, 5, 40, "TOTAL_TIME"], [16, 4, 60, "AVERAGE_SPEED"],
] as const;
q108.forEach(([u, c, distance, target], i) => output.push(checked("TSD-QL-108", `108-${letters[i]}`, Object.freeze({ authorityKey: "roundTripMediumState", bodyRelativeSpeed: K(u), mediumSpeed: K(c), oneWayDistance: D(distance), target }))));

const q109: readonly TsdCp009ExecutableInput[] = [
  Object.freeze({ authorityKey: "mixedUnequalLegMediumState", bodyRelativeSpeed: K(12), mediumSpeed: K(3), totalTime: H(7), opposedDistance: D(18), target: "ASSISTED_DISTANCE" }),
  Object.freeze({ authorityKey: "mixedUnequalLegMediumState", bodyRelativeSpeed: K(15), mediumSpeed: K(3), totalTime: H(5), assistedDistance: D(36), target: "OPPOSED_DISTANCE" }),
  Object.freeze({ authorityKey: "mixedUnequalLegMediumState", mediumSpeed: K(3), totalTime: H(5), assistedDistance: D(42), opposedDistance: D(45), target: "BODY_SPEED" }),
  Object.freeze({ authorityKey: "mixedUnequalLegMediumState", bodyRelativeSpeed: K(18), mediumSpeed: K(6), totalTime: H(6), opposedDistance: D(24), target: "ASSISTED_DISTANCE" }),
  Object.freeze({ authorityKey: "mixedUnequalLegMediumState", bodyRelativeSpeed: K(20), mediumSpeed: K(5), totalTime: H(7), assistedDistance: D(50), target: "OPPOSED_DISTANCE" }),
  Object.freeze({ authorityKey: "mixedUnequalLegMediumState", mediumSpeed: K(4), totalTime: H(7), assistedDistance: D(60), opposedDistance: D(48), target: "BODY_SPEED" }),
];
q109.forEach((input, i) => output.push(checked("TSD-QL-109", `109-${letters[i]}`, input)));

const q110 = [[3, 4], [2, 5], [4, 3], [5, 2], [6, 4], [3, 6]] as const;
q110.forEach(([c, hours], i) => output.push(checked("TSD-QL-110", `110-${letters[i]}`, Object.freeze({ authorityKey: "equalTimeMediumDistanceSpread", mediumSpeed: K(c), equalTime: H(hours) }))));

const q111 = [
  [12, 8, 2, 3], [15, 10, 3, 2], [18, 12, 4, 2],
  [16, 14, 2, 3], [20, 15, 5, 2], [14, 10, 2, 4],
] as const;
q111.forEach(([u1, u2, c, hours], i) => output.push(checked("TSD-QL-111", `111-${letters[i]}`, Object.freeze({ authorityKey: "mediumShiftedMeetingPoint", routeDistance: D((u1 + u2) * hours), fromUpstreamBodySpeed: K(u1), fromDownstreamBodySpeed: K(u2), mediumSpeed: K(c) }))));

const q112: readonly TsdCp009ExecutableInput[] = [
  Object.freeze({ authorityKey: "passiveFloatingObjectState", mediumSpeed: K(3), target: "FLOAT_SPEED" }),
  Object.freeze({ authorityKey: "passiveFloatingObjectState", mediumSpeed: K(2), target: "TRAVEL_TIME", distance: D(12) }),
  Object.freeze({ authorityKey: "passiveFloatingObjectState", mediumSpeed: K(4), target: "FLOAT_SPEED" }),
  Object.freeze({ authorityKey: "passiveFloatingObjectState", mediumSpeed: K(5), target: "TRAVEL_TIME", distance: D(20) }),
  Object.freeze({ authorityKey: "passiveFloatingObjectState", mediumSpeed: K(6), target: "FLOAT_SPEED" }),
  Object.freeze({ authorityKey: "passiveFloatingObjectState", mediumSpeed: K(3), target: "TRAVEL_TIME", distance: D(18) }),
];
q112.forEach((input, i) => output.push(checked("TSD-QL-112", `112-${letters[i]}`, input)));

const q113 = [
  [12, 3, 2, "RECOVERY_TIME_AFTER_TURN"], [15, 4, 3, "RECOVERY_DISTANCE_FROM_DROP"], [18, 5, 1, "RECOVERY_TIME_AFTER_TURN"],
  [16, 3, 4, "RECOVERY_DISTANCE_FROM_DROP"], [20, 6, 2, "RECOVERY_TIME_AFTER_TURN"], [14, 2, 5, "RECOVERY_DISTANCE_FROM_DROP"],
] as const;
q113.forEach(([u, c, hours, target], i) => output.push(checked("TSD-QL-113", `113-${letters[i]}`, Object.freeze({ authorityKey: "floatingObjectRecoveryState", bodyRelativeSpeed: K(u), mediumSpeed: K(c), separationTimeBeforeTurn: H(hours), target }))));

function changedCase(qlId: `TSD-QL-${string}`, familyId: string, u: number, c1: number, c2: number, distanceKm: number, direction: "ASSISTED" | "OPPOSED", target: "NEW_MEDIUM_SPEED" | "MEDIUM_SPEED_CHANGE") {
  const body = K(u);
  const firstGround = direction === "ASSISTED" ? K(u + c1) : K(u - c1);
  const secondGround = direction === "ASSISTED" ? K(u + c2) : K(u - c2);
  return checked(qlId, familyId, Object.freeze({
    authorityKey: "changingMediumState",
    bodyRelativeSpeed: body,
    distance: D(distanceKm),
    direction,
    firstTripTime: divide(D(distanceKm), firstGround),
    secondTripTime: divide(D(distanceKm), secondGround),
    target,
  }));
}

output.push(
  changedCase("TSD-QL-114", "114-A", 12, 2, 4, 112, "ASSISTED", "NEW_MEDIUM_SPEED"),
  changedCase("TSD-QL-114", "114-B", 15, 3, 5, 60, "OPPOSED", "MEDIUM_SPEED_CHANGE"),
  changedCase("TSD-QL-114", "114-C", 16, 2, 4, 180, "ASSISTED", "NEW_MEDIUM_SPEED"),
  changedCase("TSD-QL-114", "114-D", 20, 4, 5, 240, "OPPOSED", "MEDIUM_SPEED_CHANGE"),
  changedCase("TSD-QL-114", "114-E", 14, 1, 2, 240, "ASSISTED", "NEW_MEDIUM_SPEED"),
  changedCase("TSD-QL-114", "114-F", 18, 3, 6, 60, "OPPOSED", "MEDIUM_SPEED_CHANGE"),
);

if (output.length !== 66) throw new Error(`Expected 66 CP009 natural English review cases, got ${output.length}`);
export const TSD_CP009_ENGLISH_REVIEW_CASES: readonly TsdCp009EnglishReviewCase[] = Object.freeze(output);
