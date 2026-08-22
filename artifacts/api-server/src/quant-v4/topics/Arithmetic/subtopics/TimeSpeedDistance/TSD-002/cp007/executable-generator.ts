import { add, divide, multiply, rational, subtract, type Rational } from "../../TSD-001/foundation/rational";
import { cp007QlForAuthority } from "./ql-allocation";
import { solveCp007Authority } from "./executable-solver";
import {
  TSD_CP007_EXECUTABLE_AUTHORITIES,
  type TsdCp007AuthorityKey,
  type TsdCp007ExecutableGeneratedCase,
  type TsdCp007ExecutableInput,
  type TsdCp007ObjectKind,
} from "./executable-types";
import { independentlyVerifyCp007Authority } from "./executable-verifier";

const TRAIN_LENGTHS = [120, 132, 144, 150, 165, 180, 192, 210, 225, 240, 252, 270] as const;
const SPEED_NUMERATORS = [10, 11, 12, 15, 18, 20, 22, 24, 25, 27, 30, 32] as const;
const OBJECT_LENGTHS = [300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630] as const;
const OBJECT_DELTAS = [60, -75, 90, -105, 120, -135, 150, -165, 180, -195, 210, -225] as const;
const SPACINGS = [18, 20, 22, 24, 25, 27, 30, 32, 35, 36, 40, 45] as const;
const OBJECT_KINDS: readonly TsdCp007ObjectKind[] = Object.freeze(["PLATFORM", "BRIDGE", "TUNNEL"]);

function seedIndex(seed: string): number {
  const match = seed.match(/(\d+)$/);
  if (!match) throw new Error(`TSD-CP-007 executable seed must end in a numeric case index: ${seed}`);
  return (Number(match[1]) - 1) % 12;
}

function latent(index: number) {
  const trainLength = rational(TRAIN_LENGTHS[index]!);
  const speed = rational(SPEED_NUMERATORS[index]!);
  const fixedObjectLength = rational(OBJECT_LENGTHS[index]!);
  const secondObjectLength = add(fixedObjectLength, rational(OBJECT_DELTAS[index]!));
  const pointCrossingTime = divide(trainLength, speed);
  const fixedObjectCrossingTime = divide(add(trainLength, fixedObjectLength), speed);
  const secondFixedObjectCrossingTime = divide(add(trainLength, secondObjectLength), speed);
  const occupancyDuration = divide(subtract(fixedObjectLength, trainLength), speed);
  const objectKind = OBJECT_KINDS[index % OBJECT_KINDS.length]!;
  const spacing = rational(SPACINGS[index]!);
  const gapCount = BigInt(4 + (index % 7));
  const distanceWindow = multiply(spacing, rational(gapCount));
  const timeWindow = divide(distanceWindow, speed);
  const includeStartingPoint = index % 2 === 0;
  const observedPointCount = includeStartingPoint ? gapCount + 1n : gapCount;
  return Object.freeze({
    trainLength,
    speed,
    fixedObjectLength,
    secondObjectLength,
    pointCrossingTime,
    fixedObjectCrossingTime,
    secondFixedObjectCrossingTime,
    occupancyDuration,
    objectKind,
    spacing,
    gapCount,
    distanceWindow,
    timeWindow,
    includeStartingPoint,
    observedPointCount,
  });
}

export function buildCp007ExecutableInput(authorityKey: TsdCp007AuthorityKey, seed: string): TsdCp007ExecutableInput {
  const index = seedIndex(seed);
  const data = latent(index);
  switch (authorityKey) {
    case "fixedPointCrossingTime":
      return Object.freeze({ trainLength: data.trainLength, speed: data.speed });

    case "finiteFixedObjectCrossingTime":
      return Object.freeze({ trainLength: data.trainLength, speed: data.speed, fixedObjectLength: data.fixedObjectLength, objectKind: data.objectKind });

    case "trainLengthFromPointCrossing":
      return Object.freeze({ speed: data.speed, pointCrossingTime: data.pointCrossingTime });

    case "trainSpeedFromPointCrossing":
      return Object.freeze({ trainLength: data.trainLength, pointCrossingTime: data.pointCrossingTime });

    case "fixedObjectLengthFromCrossingEvidence":
      return index % 2 === 0
        ? Object.freeze({
            trainLength: data.trainLength,
            speed: data.speed,
            fixedObjectCrossingTime: data.fixedObjectCrossingTime,
            objectKind: data.objectKind,
            objectLengthEvidenceMode: "DIRECT_SPEED" as const,
          })
        : Object.freeze({
            trainLength: data.trainLength,
            pointCrossingTime: data.pointCrossingTime,
            fixedObjectCrossingTime: data.fixedObjectCrossingTime,
            objectKind: data.objectKind,
            objectLengthEvidenceMode: "PAIRED_POINT_TIME" as const,
          });

    case "trainLengthFromPointAndObjectTimes":
    case "trainSpeedFromPointAndObjectTimes":
      return Object.freeze({
        fixedObjectLength: data.fixedObjectLength,
        pointCrossingTime: data.pointCrossingTime,
        fixedObjectCrossingTime: data.fixedObjectCrossingTime,
        objectKind: data.objectKind,
      });

    case "fixedObjectLengthDifferenceFromCrossingTimes":
      return Object.freeze({
        speed: data.speed,
        fixedObjectCrossingTime: data.fixedObjectCrossingTime,
        secondFixedObjectCrossingTime: data.secondFixedObjectCrossingTime,
      });

    case "fullOccupancyDuration":
      return index % 2 === 0
        ? Object.freeze({
            trainLength: data.trainLength,
            speed: data.speed,
            fixedObjectLength: data.fixedObjectLength,
            objectKind: data.objectKind,
            occupancyTarget: "DURATION" as const,
          })
        : Object.freeze({
            trainLength: data.trainLength,
            speed: data.speed,
            occupancyDuration: data.occupancyDuration,
            objectKind: data.objectKind,
            occupancyTarget: "OBJECT_LENGTH" as const,
          });

    case "trainCrossingEventTimeline": {
      const intervalKind = index % 3 === 0 ? "POINT_CROSSING" as const : index % 3 === 1 ? "FULL_CROSSING" as const : "FULL_OCCUPANCY" as const;
      const timelineTarget = index % 2 === 0 ? "FORWARD_CLOCK" as const : "BACKWARD_CLOCK" as const;
      const interval: Rational = intervalKind === "POINT_CROSSING"
        ? data.pointCrossingTime
        : intervalKind === "FULL_CROSSING"
          ? data.fixedObjectCrossingTime
          : data.occupancyDuration;
      const earlierClock = rational(28_800 + index * 173);
      const knownClockSecond = timelineTarget === "FORWARD_CLOCK" ? earlierClock : add(earlierClock, interval);
      return Object.freeze({
        trainLength: data.trainLength,
        speed: data.speed,
        fixedObjectLength: data.fixedObjectLength,
        knownClockSecond,
        timelineIntervalKind: intervalKind,
        timelineTarget,
        objectKind: data.objectKind,
      });
    }

    case "fixedSpacingPointCount": {
      const spacingTarget = index % 3 === 0 ? "POINT_COUNT" as const : index % 3 === 1 ? "SPACING" as const : "SPEED" as const;
      if (spacingTarget === "POINT_COUNT") {
        return Object.freeze({
          distanceWindow: data.distanceWindow,
          spacing: data.spacing,
          includeStartingPoint: data.includeStartingPoint,
          spacingTarget,
        });
      }
      if (spacingTarget === "SPACING") {
        return Object.freeze({
          distanceWindow: data.distanceWindow,
          observedPointCount: data.observedPointCount,
          includeStartingPoint: data.includeStartingPoint,
          spacingTarget,
        });
      }
      return Object.freeze({
        spacing: data.spacing,
        timeWindow: data.timeWindow,
        observedPointCount: data.observedPointCount,
        includeStartingPoint: data.includeStartingPoint,
        spacingTarget,
      });
    }
  }
}

export function generateCp007ExecutableCase(authorityKey: TsdCp007AuthorityKey, seed: string): TsdCp007ExecutableGeneratedCase {
  const input = buildCp007ExecutableInput(authorityKey, seed);
  const solution = solveCp007Authority(authorityKey, input);
  const verification = independentlyVerifyCp007Authority(authorityKey, input, solution);
  if (!verification.valid) throw new Error(`${authorityKey}/${seed}: independent verification failed: ${verification.errors.join("; ")}`);
  const allocation = cp007QlForAuthority(authorityKey);
  return Object.freeze({
    checkpointId: "TSD-CP-007",
    authorityKey,
    permanentQlId: allocation.permanentQlId,
    seed,
    input,
    solution,
    verification,
    lifecycle: Object.freeze({
      permanentQlAllocated: true,
      englishFreezeStatus: "UNFROZEN",
      questionStudioEnabled: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    }),
  });
}

export function generateCp007ExecutableAuditCases(casesPerAuthority = 12): readonly TsdCp007ExecutableGeneratedCase[] {
  if (!Number.isInteger(casesPerAuthority) || casesPerAuthority <= 0) throw new Error("TSD-CP-007 casesPerAuthority must be a positive integer");
  return Object.freeze(TSD_CP007_EXECUTABLE_AUTHORITIES.flatMap((authorityKey) =>
    Array.from({ length: casesPerAuthority }, (_, index) => generateCp007ExecutableCase(authorityKey, `cp007:${authorityKey}:${index + 1}`)),
  ));
}
