import type { TsdCp012AuthorityKey } from "./source-saturation";

export type TsdCp012ConcreteEngineAuthority = Exclude<
  TsdCp012AuthorityKey,
  "twoEngineInverseState" | "feasibleParameterSetState"
>;

export type TsdCp012TwoEngineProvenance = Readonly<{
  caseId: string;
  engineA: TsdCp012ConcreteEngineAuthority;
  engineB: TsdCp012ConcreteEngineAuthority;
  variableMeaning: "TWO_SPEEDS_METRES_PER_SECOND";
  note: string;
}>;

const p = (
  caseId: string,
  engineA: TsdCp012ConcreteEngineAuthority,
  engineB: TsdCp012ConcreteEngineAuthority,
  note: string,
): TsdCp012TwoEngineProvenance => Object.freeze({
  caseId,
  engineA,
  engineB,
  variableMeaning: "TWO_SPEEDS_METRES_PER_SECOND" as const,
  note,
});

export const TSD_CP012_TWO_ENGINE_PROVENANCE = Object.freeze([
  p("TSD-CP012-twoEngineInverseState-01", "trainScheduleSynthesisState", "routeProfileProgramState", "Two unknown speeds are constrained independently by a train-schedule event and a segmented-route event."),
  p("TSD-CP012-twoEngineInverseState-02", "mediumPursuitSynthesisState", "terminalConstraintProgramState", "Two unknown speeds are constrained independently by a signed-medium pursuit state and a deadline state."),
  p("TSD-CP012-twoEngineInverseState-03", "closedTrackRaceSynthesisState", "movingSurfaceScheduleSynthesisState", "Two unknown speeds are constrained independently by a closed-track race outcome and a moving-surface schedule state."),
  p("TSD-CP012-twoEngineInverseState-04", "routeProfileProgramState", "terminalConstraintProgramState", "Two unknown speeds are constrained independently by a route-profile total and a terminal constraint."),
  p("TSD-CP012-twoEngineInverseState-05", "trainScheduleSynthesisState", "mediumPursuitSynthesisState", "Two unknown speeds are constrained independently by train-schedule and signed-medium pursuit observations."),
  p("TSD-CP012-twoEngineInverseState-06", "closedTrackRaceSynthesisState", "routeProfileProgramState", "Two unknown speeds are constrained independently by a modular race state and a segmented-route state."),
  p("TSD-CP012-twoEngineInverseState-07", "movingSurfaceScheduleSynthesisState", "terminalConstraintProgramState", "Two unknown speeds are constrained independently by a surface-switch schedule and a deadline state."),
  p("TSD-CP012-twoEngineInverseState-08", "trainScheduleSynthesisState", "closedTrackRaceSynthesisState", "Two unknown speeds are constrained independently by a finite-train schedule event and a closed-track race outcome."),
] as const satisfies readonly TsdCp012TwoEngineProvenance[]);
