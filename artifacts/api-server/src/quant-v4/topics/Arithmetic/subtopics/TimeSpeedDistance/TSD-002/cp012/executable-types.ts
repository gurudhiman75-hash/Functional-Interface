import type { Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp012AuthorityKey } from "./source-saturation";

export type TsdCp012ScalarUnit = "SECOND" | "METRE" | "METRE_PER_SECOND" | "COUNT" | "INDEX" | "RATIO" | "PARAMETER";
export type TsdCp012Stage = Readonly<{ distance: Rational; speed: Rational }>;
export type TsdCp012TimedStage = Readonly<{ speed: Rational; duration: Rational }>;
export type TsdCp012Route = Readonly<{ segments: readonly TsdCp012Stage[] }>;

export type TsdCp012ExecutableInput =
  | Readonly<{ authorityKey: "discreteSpeedProgramState"; target: "TOTAL_DISTANCE"; stages: readonly TsdCp012TimedStage[] }>
  | Readonly<{ authorityKey: "discreteSpeedProgramState"; target: "TOTAL_TIME"; stages: readonly TsdCp012Stage[] }>
  | Readonly<{ authorityKey: "discreteSpeedProgramState"; target: "UNKNOWN_FINAL_SPEED"; priorStages: readonly TsdCp012TimedStage[]; finalDuration: Rational; totalDistance: Rational }>
  | Readonly<{ authorityKey: "discreteSpeedProgramState"; target: "PERIODIC_DISTANCE"; cycle: readonly TsdCp012TimedStage[]; fullCycles: number; partialStages: readonly TsdCp012TimedStage[] }>

  | Readonly<{ authorityKey: "periodicTravelRestProgramState"; target: "COMPLETION_TIME"; distance: Rational; travelSpeed: Rational; travelDurationPerBlock: Rational; restDuration: Rational }>
  | Readonly<{ authorityKey: "periodicTravelRestProgramState"; target: "REST_COUNT"; distance: Rational; travelSpeed: Rational; travelDurationPerBlock: Rational }>
  | Readonly<{ authorityKey: "periodicTravelRestProgramState"; target: "REST_DURATION"; distance: Rational; travelSpeed: Rational; travelDurationPerBlock: Rational; totalElapsedTime: Rational }>

  | Readonly<{ authorityKey: "terminalConstraintProgramState"; target: "REQUIRED_FINAL_SPEED"; completedDistance: Rational; elapsedTime: Rational; totalDistance: Rational; deadline: Rational }>
  | Readonly<{ authorityKey: "terminalConstraintProgramState"; target: "REQUIRED_FINAL_TIME"; completedDistance: Rational; elapsedTime: Rational; totalDistance: Rational; finalSpeed: Rational }>
  | Readonly<{ authorityKey: "terminalConstraintProgramState"; target: "STAGE_BOUNDARY_DISTANCE"; totalDistance: Rational; totalTime: Rational; firstSpeed: Rational; secondSpeed: Rational }>
  | Readonly<{ authorityKey: "terminalConstraintProgramState"; target: "MAXIMUM_DELAY"; distance: Rational; speed: Rational; arrivalDeadline: Rational }>
  | Readonly<{ authorityKey: "terminalConstraintProgramState"; target: "MINIMUM_SPEED"; distance: Rational; availableTime: Rational }>

  | Readonly<{ authorityKey: "routeProfileProgramState"; target: "TOTAL_TIME"; segments: readonly TsdCp012Stage[] }>
  | Readonly<{ authorityKey: "routeProfileProgramState"; target: "DISTANCE_SPLIT_A"; totalDistance: Rational; totalTime: Rational; speedA: Rational; speedB: Rational }>
  | Readonly<{ authorityKey: "routeProfileProgramState"; target: "FASTEST_ROUTE_INDEX"; routes: readonly TsdCp012Route[] }>
  | Readonly<{ authorityKey: "routeProfileProgramState"; target: "TIME_DIFFERENCE_BETWEEN_ROUTES"; routeA: TsdCp012Route; routeB: TsdCp012Route }>

  | Readonly<{ authorityKey: "motionReconstructionProgramState"; target: "MISSING_DISTANCE"; totalDistance: Rational; knownDistances: readonly Rational[] }>
  | Readonly<{ authorityKey: "motionReconstructionProgramState"; target: "MISSING_TIME"; totalTime: Rational; knownTimes: readonly Rational[] }>
  | Readonly<{ authorityKey: "motionReconstructionProgramState"; target: "MISSING_SPEED"; missingDistance: Rational; missingTime: Rational }>
  | Readonly<{ authorityKey: "motionReconstructionProgramState"; target: "MISSING_STAGE_DISTANCE"; totalDistance: Rational; totalTime: Rational; knownStage: TsdCp012Stage; missingSpeed: Rational }>

  | Readonly<{ authorityKey: "trainScheduleSynthesisState"; target: "MEETING_TIME_FROM_FIRST_DEPARTURE"; stationDistance: Rational; speedA: Rational; speedB: Rational; delayB: Rational }>
  | Readonly<{ authorityKey: "trainScheduleSynthesisState"; target: "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE"; initialGap: Rational; lengthA: Rational; lengthB: Rational; speedA: Rational; speedB: Rational; delayB: Rational }>
  | Readonly<{ authorityKey: "trainScheduleSynthesisState"; target: "DELAY_B"; stationDistance: Rational; speedA: Rational; speedB: Rational; meetingTimeFromFirstDeparture: Rational }>

  | Readonly<{ authorityKey: "mediumPursuitSynthesisState"; target: "RAFT_CATCH_TIME_FROM_RAFT_START"; boatStillWaterSpeed: Rational; currentSpeed: Rational; boatStartDelay: Rational }>
  | Readonly<{ authorityKey: "mediumPursuitSynthesisState"; target: "RAFT_CATCH_DISTANCE_FROM_START"; boatStillWaterSpeed: Rational; currentSpeed: Rational; boatStartDelay: Rational }>
  | Readonly<{ authorityKey: "mediumPursuitSynthesisState"; target: "CURRENT_SPEED"; boatStillWaterSpeed: Rational; boatStartDelay: Rational; catchTimeFromRaftStart: Rational }>
  | Readonly<{ authorityKey: "mediumPursuitSynthesisState"; target: "DROPPED_OBJECT_RECOVERY_DISTANCE"; currentSpeed: Rational; detectionDelay: Rational; boatStillWaterSpeed: Rational }>

  | Readonly<{ authorityKey: "closedTrackRaceSynthesisState"; target: "TRACK_GAP_AT_FASTER_FINISH"; trackLength: Rational; raceLaps: number; fasterSpeed: Rational; slowerSpeed: Rational; slowerHeadStart: Rational }>
  | Readonly<{ authorityKey: "closedTrackRaceSynthesisState"; target: "HEAD_START_FOR_DEAD_HEAT"; trackLength: Rational; raceLaps: number; fasterSpeed: Rational; slowerSpeed: Rational }>
  | Readonly<{ authorityKey: "closedTrackRaceSynthesisState"; target: "FIRST_OVERTAKE_TIME"; trackLength: Rational; fasterSpeed: Rational; slowerSpeed: Rational; slowerHeadStart: Rational }>

  | Readonly<{ authorityKey: "movingSurfaceScheduleSynthesisState"; target: "TIME_WITH_STOP_AFTER"; length: Rational; personRate: Rational; surfaceRate: Rational; surfaceActiveTime: Rational }>
  | Readonly<{ authorityKey: "movingSurfaceScheduleSynthesisState"; target: "TIME_WITH_DELAYED_ACTIVATION"; length: Rational; personRate: Rational; surfaceRate: Rational; activationDelay: Rational }>
  | Readonly<{ authorityKey: "movingSurfaceScheduleSynthesisState"; target: "TIME_WITH_DIRECTION_REVERSAL"; length: Rational; personRate: Rational; surfaceRate: Rational; reversalTime: Rational }>
  | Readonly<{ authorityKey: "movingSurfaceScheduleSynthesisState"; target: "UNKNOWN_ACTIVE_TIME_BEFORE_STOP"; length: Rational; personRate: Rational; surfaceRate: Rational; totalTime: Rational }>

  | Readonly<{ authorityKey: "twoEngineInverseState"; target: "X" | "Y"; a1: Rational; b1: Rational; c1: Rational; a2: Rational; b2: Rational; c2: Rational }>

  | Readonly<{ authorityKey: "feasibleParameterSetState"; target: "VALID_SET" | "COUNT"; minimumCandidate: number; maximumCandidate: number; distance: Rational; deadline: Rational; fixedDelay: Rational }>;

export type TsdCp012ScalarSolution = Readonly<{ kind: "SCALAR"; answer: Rational; unit: TsdCp012ScalarUnit }>;
export type TsdCp012SetSolution = Readonly<{ kind: "SET"; values: readonly Rational[]; unit: "PARAMETER_SET" }>;
export type TsdCp012ExecutableSolution = TsdCp012ScalarSolution | TsdCp012SetSolution;

export type TsdCp012ExecutableCase = Readonly<{
  caseId: string;
  authorityKey: TsdCp012AuthorityKey;
  input: TsdCp012ExecutableInput;
  expected: TsdCp012ExecutableSolution;
}>;
