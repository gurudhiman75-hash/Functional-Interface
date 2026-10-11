export const TSD_CP011_RAW_SOURCE_CANDIDATES = Object.freeze([
  "findStationaryEscalatorStepCount",
  "findEscalatorSpeedInStepsPerTime",
  "findPersonStepRateOnEscalator",
  "findTimeOnMovingEscalator",
  "findStepsWalkedOnMovingEscalator",
  "findTotalStepsFromTwoEscalatorObservations",
  "findEscalatorSpeedFromUpAndDownObservations",
  "findPersonSpeedFromUpAndDownObservations",
  "findStoppedEscalatorTime",
  "findEscalatorDirectionFromObservations",
  "findStateAfterEscalatorDirectionReversal",
  "findTwoPeopleStepRateRelation",
  "findMovingWalkwayTravelTimeSameDirection",
  "findMovingWalkwayTravelTimeOppositeDirection",
  "findWalkingSpeedFromWalkwayTimes",
  "findWalkwaySpeedFromTravelTimes",
  "findWalkwayLength",
  "findTimeSavedByMovingWalkway",
  "findConveyorTransferTime",
  "findObjectSpeedOnConveyor",
  "findWalkingSpeedRelativeToConveyor",
  "findWheelDistanceFromRevolutions",
  "findWheelRevolutionsFromDistance",
  "findWheelCircumferenceFromDistanceAndRevolutions",
  "findWheelRadiusOrDiameterFromMotion",
  "findLinearSpeedFromWheelRpm",
  "findWheelRpmFromLinearSpeed",
  "findTwoWheelRevolutionRatio",
  "findRevolutionCountDifference",
  "findPartialEscalatorOrWalkwayState",
  "findStopStartEscalatorSchedule",
  "detectNetSpeedFeasibilityError",
  "classifyMovingSurfaceStateAsPossibleUniqueOrMultiple",
  "verifyEscalatorWalkwayOrWheelClaim",
  "solveMovingSurfaceDataSufficiency",
] as const);

export type TsdCp011RawCandidate = (typeof TSD_CP011_RAW_SOURCE_CANDIDATES)[number];

export const TSD_CP011_LEARNER_AUTHORITIES = Object.freeze([
  "movingSurfaceTravelState",
  "stationaryStepCountState",
  "dualEscalatorObservationState",
  "movingSurfaceStateComparison",
  "wheelRollState",
  "wheelRateTranslationState",
  "twoWheelComparisonState",
] as const);
export type TsdCp011AuthorityKey = (typeof TSD_CP011_LEARNER_AUTHORITIES)[number];

export const TSD_CP011_CP012_HOLDS = Object.freeze([
  "findStateAfterEscalatorDirectionReversal",
  "findStopStartEscalatorSchedule",
] as const satisfies readonly TsdCp011RawCandidate[]);

export const TSD_CP011_INTERNAL_QA_MODES = Object.freeze([
  "detectNetSpeedFeasibilityError",
  "classifyMovingSurfaceStateAsPossibleUniqueOrMultiple",
  "verifyEscalatorWalkwayOrWheelClaim",
  "solveMovingSurfaceDataSufficiency",
] as const satisfies readonly TsdCp011RawCandidate[]);

export const TSD_CP011_SOURCE_TO_AUTHORITY = Object.freeze({
  movingSurfaceTravelState: Object.freeze([
    "findTimeOnMovingEscalator",
    "findMovingWalkwayTravelTimeSameDirection",
    "findMovingWalkwayTravelTimeOppositeDirection",
    "findWalkwayLength",
    "findConveyorTransferTime",
    "findObjectSpeedOnConveyor",
    "findWalkingSpeedRelativeToConveyor",
  ]),
  stationaryStepCountState: Object.freeze([
    "findStationaryEscalatorStepCount",
    "findEscalatorSpeedInStepsPerTime",
    "findPersonStepRateOnEscalator",
    "findStepsWalkedOnMovingEscalator",
  ]),
  dualEscalatorObservationState: Object.freeze([
    "findTotalStepsFromTwoEscalatorObservations",
    "findEscalatorSpeedFromUpAndDownObservations",
    "findPersonSpeedFromUpAndDownObservations",
    "findEscalatorDirectionFromObservations",
    "findTwoPeopleStepRateRelation",
  ]),
  movingSurfaceStateComparison: Object.freeze([
    "findStoppedEscalatorTime",
    "findWalkingSpeedFromWalkwayTimes",
    "findWalkwaySpeedFromTravelTimes",
    "findTimeSavedByMovingWalkway",
    "findPartialEscalatorOrWalkwayState",
  ]),
  wheelRollState: Object.freeze([
    "findWheelDistanceFromRevolutions",
    "findWheelRevolutionsFromDistance",
    "findWheelCircumferenceFromDistanceAndRevolutions",
    "findWheelRadiusOrDiameterFromMotion",
  ]),
  wheelRateTranslationState: Object.freeze([
    "findLinearSpeedFromWheelRpm",
    "findWheelRpmFromLinearSpeed",
  ]),
  twoWheelComparisonState: Object.freeze([
    "findTwoWheelRevolutionRatio",
    "findRevolutionCountDifference",
  ]),
} as const satisfies Record<TsdCp011AuthorityKey, readonly TsdCp011RawCandidate[]>);

export const TSD_CP011_DISCOVERY_STATUS = Object.freeze({
  checkpointId: "TSD-CP-011",
  title: "Escalators, Moving Walkways, Conveyors and Rotational Translation",
  rawCandidates: 35,
  learnerSourceForms: 29,
  learnerAuthorities: 7,
  cp012Holds: 2,
  internalQaModes: 4,
  permanentAllocationStatus: "FROZEN_APPROVED",
  frozen: true,
  questionStudioRegistered: false,
  bankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const);
