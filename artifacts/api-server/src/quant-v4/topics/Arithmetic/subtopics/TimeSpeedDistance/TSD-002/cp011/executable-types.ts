import type { Rational } from "../../TSD-001/foundation/rational";

export type TsdCp011MeasureUnit = "METRE" | "STEP";
export type TsdCp011Direction = "SAME" | "OPPOSITE";
export type TsdCp011SolutionUnit =
  | "SECOND"
  | "MINUTE"
  | "METRE"
  | "STEP"
  | "METRE_PER_SECOND"
  | "STEP_PER_SECOND"
  | "REVOLUTION"
  | "METRE_PER_MINUTE"
  | "REVOLUTION_PER_MINUTE"
  | "RATIO";

export type TsdCp011ExecutableInput =
  | Readonly<{ authorityKey: "movingSurfaceTravelState"; target: "TIME"; measureUnit: TsdCp011MeasureUnit; direction: TsdCp011Direction; length: Rational; personRate: Rational; surfaceRate: Rational }>
  | Readonly<{ authorityKey: "movingSurfaceTravelState"; target: "LENGTH"; measureUnit: TsdCp011MeasureUnit; direction: TsdCp011Direction; time: Rational; personRate: Rational; surfaceRate: Rational }>
  | Readonly<{ authorityKey: "movingSurfaceTravelState"; target: "PERSON_RATE"; measureUnit: TsdCp011MeasureUnit; direction: TsdCp011Direction; length: Rational; time: Rational; surfaceRate: Rational }>
  | Readonly<{ authorityKey: "movingSurfaceTravelState"; target: "SURFACE_RATE"; measureUnit: TsdCp011MeasureUnit; direction: TsdCp011Direction; length: Rational; time: Rational; personRate: Rational }>
  | Readonly<{ authorityKey: "stationaryStepCountState"; target: "TOTAL_STEPS"; direction: TsdCp011Direction; walkedSteps: Rational; personStepRate: Rational; escalatorStepRate: Rational }>
  | Readonly<{ authorityKey: "stationaryStepCountState"; target: "WALKED_STEPS"; direction: TsdCp011Direction; totalSteps: Rational; personStepRate: Rational; escalatorStepRate: Rational }>
  | Readonly<{ authorityKey: "stationaryStepCountState"; target: "PERSON_RATE"; direction: TsdCp011Direction; totalSteps: Rational; walkedSteps: Rational; escalatorStepRate: Rational }>
  | Readonly<{ authorityKey: "stationaryStepCountState"; target: "ESCALATOR_RATE"; direction: TsdCp011Direction; totalSteps: Rational; walkedSteps: Rational; personStepRate: Rational }>
  | Readonly<{ authorityKey: "dualEscalatorObservationState"; target: "STOPPED_TIME"; upTime: Rational; downTime: Rational }>
  | Readonly<{ authorityKey: "dualEscalatorObservationState"; target: "PERSON_TO_ESCALATOR_RATE_RATIO"; upTime: Rational; downTime: Rational }>
  | Readonly<{ authorityKey: "movingSurfaceStateComparison"; target: "COMBINED_TIME"; stoppedWalkingTime: Rational; carriedStandingTime: Rational }>
  | Readonly<{ authorityKey: "movingSurfaceStateComparison"; target: "STOPPED_WALKING_TIME"; combinedTime: Rational; carriedStandingTime: Rational }>
  | Readonly<{ authorityKey: "movingSurfaceStateComparison"; target: "CARRIED_STANDING_TIME"; combinedTime: Rational; stoppedWalkingTime: Rational }>
  | Readonly<{ authorityKey: "movingSurfaceStateComparison"; target: "TIME_SAVED"; stoppedWalkingTime: Rational; carriedStandingTime: Rational }>
  | Readonly<{ authorityKey: "wheelRollState"; target: "DISTANCE"; circumference: Rational; revolutions: Rational }>
  | Readonly<{ authorityKey: "wheelRollState"; target: "REVOLUTIONS"; distance: Rational; circumference: Rational }>
  | Readonly<{ authorityKey: "wheelRollState"; target: "CIRCUMFERENCE"; distance: Rational; revolutions: Rational }>
  | Readonly<{ authorityKey: "wheelRollState"; target: "DIAMETER"; distance: Rational; revolutions: Rational; pi: Rational }>
  | Readonly<{ authorityKey: "wheelRollState"; target: "RADIUS"; distance: Rational; revolutions: Rational; pi: Rational }>
  | Readonly<{ authorityKey: "wheelRateTranslationState"; target: "LINEAR_SPEED"; circumference: Rational; rpm: Rational }>
  | Readonly<{ authorityKey: "wheelRateTranslationState"; target: "RPM"; circumference: Rational; linearSpeedPerMinute: Rational }>
  | Readonly<{ authorityKey: "wheelRateTranslationState"; target: "DISTANCE"; circumference: Rational; rpm: Rational; timeMinutes: Rational }>
  | Readonly<{ authorityKey: "wheelRateTranslationState"; target: "TIME_MINUTES"; circumference: Rational; rpm: Rational; distance: Rational }>
  | Readonly<{ authorityKey: "twoWheelComparisonState"; target: "REVOLUTION_RATIO"; circumferenceA: Rational; circumferenceB: Rational }>
  | Readonly<{ authorityKey: "twoWheelComparisonState"; target: "REVOLUTION_COUNT_DIFFERENCE"; distance: Rational; circumferenceA: Rational; circumferenceB: Rational }>;

export type TsdCp011ExecutableSolution = Readonly<{
  answer: Rational;
  unit: TsdCp011SolutionUnit;
}>;

export type TsdCp011ExecutableCase = Readonly<{
  caseId: string;
  authorityKey: TsdCp011ExecutableInput["authorityKey"];
  input: TsdCp011ExecutableInput;
  expected: TsdCp011ExecutableSolution;
}>;