import type { Rational } from "../foundation/rational";

export type TsdCp004ExecutableSolveMode =
  | "relativeSpeedByDirection"
  | "meetingTimeFromInitialGap"
  | "initialGapFromMeetingState"
  | "relativeSpeedFromMeetingState"
  | "individualSpeedFromRelativeState"
  | "catchUpTimeFromHeadStart"
  | "headStartFromCatchUpState"
  | "speedFromCatchUpState"
  | "separationAfterElapsedTime"
  | "initialGapFromLaterSeparation"
  | "timeToSpecifiedSeparation"
  | "meetingPointDistanceSplit"
  | "speedRatioFromMeetingPoint"
  | "meetingClockState"
  | "piecewiseCatchUpTime"
  | "speedThresholdForFirstMeeting"
  | "multiPursuerFirstEventOrder";

export interface TsdCp004RelativeSpeedInput {
  readonly solveMode: "relativeSpeedByDirection";
  readonly speedA: Rational;
  readonly speedB: Rational;
  readonly directionRelation: "OPPOSITE_CLOSING" | "SAME_DIRECTION";
}

export interface TsdCp004MeetingTimeInput {
  readonly solveMode: "meetingTimeFromInitialGap";
  readonly initialGap: Rational;
  readonly speedA: Rational;
  readonly speedB: Rational;
  readonly directionRelation: "OPPOSITE_CLOSING" | "SAME_DIRECTION_CATCH";
}

export interface TsdCp004InitialGapInput {
  readonly solveMode: "initialGapFromMeetingState";
  readonly relativeSpeed: Rational;
  readonly meetingTime: Rational;
}

export interface TsdCp004RelativeSpeedFromMeetingInput {
  readonly solveMode: "relativeSpeedFromMeetingState";
  readonly initialGap: Rational;
  readonly meetingTime: Rational;
}

export interface TsdCp004IndividualSpeedInput {
  readonly solveMode: "individualSpeedFromRelativeState";
  readonly relativeSpeed: Rational;
  readonly knownSpeed: Rational;
  readonly relation:
    | "OPPOSITE_TARGET"
    | "SAME_TARGET_FASTER"
    | "SAME_TARGET_SLOWER";
}

export type TsdCp004CatchUpTimeInput =
  | {
      readonly solveMode: "catchUpTimeFromHeadStart";
      readonly representation: "HEAD_START_DISTANCE";
      readonly headStartDistance: Rational;
      readonly fasterSpeed: Rational;
      readonly slowerSpeed: Rational;
    }
  | {
      readonly solveMode: "catchUpTimeFromHeadStart";
      readonly representation: "START_DELAY";
      readonly startDelay: Rational;
      readonly fasterSpeed: Rational;
      readonly slowerSpeed: Rational;
    };

export type TsdCp004HeadStartFromCatchUpInput =
  | {
      readonly solveMode: "headStartFromCatchUpState";
      readonly target: "HEAD_START_DISTANCE";
      readonly catchUpTime: Rational;
      readonly fasterSpeed: Rational;
      readonly slowerSpeed: Rational;
    }
  | {
      readonly solveMode: "headStartFromCatchUpState";
      readonly target: "START_DELAY";
      readonly catchUpTime: Rational;
      readonly fasterSpeed: Rational;
      readonly slowerSpeed: Rational;
    };

export interface TsdCp004SpeedFromCatchUpInput {
  readonly solveMode: "speedFromCatchUpState";
  readonly headStartDistance: Rational;
  readonly catchUpTime: Rational;
  readonly knownSpeed: Rational;
  readonly target: "FASTER" | "SLOWER";
}

export interface TsdCp004SeparationAfterElapsedInput {
  readonly solveMode: "separationAfterElapsedTime";
  readonly initialSeparation: Rational;
  readonly speedA: Rational;
  readonly speedB: Rational;
  readonly motionRelation: "OPPOSITE_MOVING_APART" | "SAME_DIRECTION_DIVERGING";
  readonly elapsedTime: Rational;
}

export interface TsdCp004InitialGapFromLaterSeparationInput {
  readonly solveMode: "initialGapFromLaterSeparation";
  readonly laterSeparation: Rational;
  readonly relativeSpeed: Rational;
  readonly elapsedTime: Rational;
}

export interface TsdCp004TimeToSpecifiedSeparationInput {
  readonly solveMode: "timeToSpecifiedSeparation";
  readonly initialSeparation: Rational;
  readonly targetSeparation: Rational;
  readonly relativeSpeed: Rational;
  readonly trend: "INCREASING" | "DECREASING";
}

export type TsdCp004MeetingPointDistanceSplitInput =
  | {
      readonly solveMode: "meetingPointDistanceSplit";
      readonly representation: "SPEEDS";
      readonly totalSeparation: Rational;
      readonly speedA: Rational;
      readonly speedB: Rational;
      readonly target: "FROM_A" | "FROM_B";
    }
  | {
      readonly solveMode: "meetingPointDistanceSplit";
      readonly representation: "SPEED_RATIO";
      readonly totalSeparation: Rational;
      readonly speedRatioA: Rational;
      readonly speedRatioB: Rational;
      readonly target: "FROM_A" | "FROM_B";
    };

export interface TsdCp004SpeedRatioFromMeetingPointInput {
  readonly solveMode: "speedRatioFromMeetingPoint";
  readonly distanceCoveredByA: Rational;
  readonly distanceCoveredByB: Rational;
  readonly target: "A_TO_B" | "B_TO_A";
}

export type TsdCp004MeetingClockStateInput =
  | {
      readonly solveMode: "meetingClockState";
      readonly target: "MEETING_CLOCK";
      readonly departureMinuteFromDayZero: Rational;
      readonly initialGap: Rational;
      readonly speedA: Rational;
      readonly speedB: Rational;
      readonly directionRelation: "OPPOSITE_CLOSING" | "SAME_DIRECTION_CATCH";
    }
  | {
      readonly solveMode: "meetingClockState";
      readonly target: "DEPARTURE_CLOCK";
      readonly meetingMinuteFromDayZero: Rational;
      readonly initialGap: Rational;
      readonly speedA: Rational;
      readonly speedB: Rational;
      readonly directionRelation: "OPPOSITE_CLOSING" | "SAME_DIRECTION_CATCH";
    };

export interface TsdCp004PiecewiseCatchUpInput {
  readonly solveMode: "piecewiseCatchUpTime";
  readonly leadDistanceAtPursuerStart: Rational;
  readonly fasterSpeed: Rational;
  readonly slowerSpeed: Rational;
  readonly pursuerNonMovingTime: Rational;
}

export interface TsdCp004SpeedThresholdInput {
  readonly solveMode: "speedThresholdForFirstMeeting";
  readonly initialGap: Rational;
  readonly slowerSpeed: Rational;
  readonly deadline: Rational;
}

export interface TsdCp004MultiPursuerOrderInput {
  readonly solveMode: "multiPursuerFirstEventOrder";
  readonly targetSpeed: Rational;
  readonly leadFromPursuerA: Rational;
  readonly pursuerASpeed: Rational;
  readonly leadFromPursuerB: Rational;
  readonly pursuerBSpeed: Rational;
}

export type TsdCp004SolveInput =
  | TsdCp004RelativeSpeedInput
  | TsdCp004MeetingTimeInput
  | TsdCp004InitialGapInput
  | TsdCp004RelativeSpeedFromMeetingInput
  | TsdCp004IndividualSpeedInput
  | TsdCp004CatchUpTimeInput
  | TsdCp004HeadStartFromCatchUpInput
  | TsdCp004SpeedFromCatchUpInput
  | TsdCp004SeparationAfterElapsedInput
  | TsdCp004InitialGapFromLaterSeparationInput
  | TsdCp004TimeToSpecifiedSeparationInput
  | TsdCp004MeetingPointDistanceSplitInput
  | TsdCp004SpeedRatioFromMeetingPointInput
  | TsdCp004MeetingClockStateInput
  | TsdCp004PiecewiseCatchUpInput
  | TsdCp004SpeedThresholdInput
  | TsdCp004MultiPursuerOrderInput;

export type TsdCp004SolvedUnit =
  | "KMPH"
  | "HOUR"
  | "KM"
  | "RATIO"
  | "CLOCK_MINUTE"
  | "ORDER";

export interface TsdCp004SolveCertificate {
  readonly solveMode: TsdCp004ExecutableSolveMode;
  readonly answer: Rational;
  readonly unit: TsdCp004SolvedUnit;
  readonly governingEquation: string;
  readonly intermediate: Readonly<Record<string, Rational>>;
}
