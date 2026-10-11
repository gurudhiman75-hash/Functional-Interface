import type { TsdCp012AuthorityKey } from "./source-saturation";

export type TsdCp012Representation = Readonly<{
  representationId: string;
  authorityKey: TsdCp012AuthorityKey;
  label: string;
  learnerTarget: string;
  essentialEvidence: readonly string[];
}>;

const r = (representationId: string, authorityKey: TsdCp012AuthorityKey, label: string, learnerTarget: string, essentialEvidence: readonly string[]): TsdCp012Representation =>
  Object.freeze({ representationId, authorityKey, label, learnerTarget, essentialEvidence: Object.freeze([...essentialEvidence]) });

export const TSD_CP012_REPRESENTATIONS = Object.freeze([
  r("CP012-R-001", "discreteSpeedProgramState", "finite equal-time speed sequence", "total distance or time", ["ordered speed stages", "stage durations"]),
  r("CP012-R-002", "discreteSpeedProgramState", "alternating speed program", "total distance/time after finite alternations", ["alternating speeds", "repeat count or terminal stage"]),
  r("CP012-R-003", "discreteSpeedProgramState", "periodic speed cycle with complete cycles", "distance/time after repeated cycle", ["cycle stages", "number of cycles"]),
  r("CP012-R-004", "discreteSpeedProgramState", "periodic cycle ending inside a terminal stage", "exact time to a distance inside the next cycle", ["cycle stages", "full cycles", "partial terminal stage"]),

  r("CP012-R-005", "periodicTravelRestProgramState", "travel-rest repeated cycle", "completion time", ["travel speed", "travel duration", "rest duration", "route distance"]),
  r("CP012-R-006", "periodicTravelRestProgramState", "fixed distance then rest cycle", "number of rests and arrival time", ["distance per movement stage", "movement time", "rest time", "terminal distance"]),
  r("CP012-R-007", "periodicTravelRestProgramState", "rest schedule ending during movement", "exact final-cycle completion time", ["movement/rest cycle", "partial final movement"]),
  r("CP012-R-008", "periodicTravelRestProgramState", "inverse rest-period state", "unknown rest duration", ["total distance", "total elapsed time", "cycle motion rate"]),

  r("CP012-R-009", "terminalConstraintProgramState", "required final segment speed", "last-stage speed", ["completed stages", "remaining distance", "deadline"]),
  r("CP012-R-010", "terminalConstraintProgramState", "required final segment duration", "last-stage time", ["completed stages", "final-stage speed", "total constraint"]),
  r("CP012-R-011", "terminalConstraintProgramState", "unknown stage boundary", "distance/time at changeover", ["two stage rates", "total distance/time"]),
  r("CP012-R-012", "terminalConstraintProgramState", "distance remaining or feasibility boundary", "remaining distance, minimum speed or maximum delay", ["completed variable-speed stages", "route/deadline constraint"]),

  r("CP012-R-013", "routeProfileProgramState", "terrain-dependent route segments", "total route time", ["segment lengths", "segment-specific speeds"]),
  r("CP012-R-014", "routeProfileProgramState", "polygon or rectangle side-speed route", "lap/route time or first opposite-direction meeting", ["side lengths", "side-specific speeds", "declared traversal directions"]),
  r("CP012-R-015", "routeProfileProgramState", "multi-modal walk-cycle-ride route", "total time or distance split", ["mode-specific rates", "mode segments"]),
  r("CP012-R-016", "routeProfileProgramState", "finite route-choice comparison", "minimum travel time route", ["complete candidate routes", "exact time per route"]),

  r("CP012-R-017", "motionReconstructionProgramState", "missing stage in itinerary ledger", "missing distance/time/speed", ["known stage ledger", "journey totals"]),
  r("CP012-R-018", "motionReconstructionProgramState", "compact distance-time table", "missing motion state", ["table rows", "total/continuity constraints"]),
  r("CP012-R-019", "motionReconstructionProgramState", "compact speed-time table", "missing motion state", ["speed-time stages", "aggregate distance/time"]),
  r("CP012-R-020", "motionReconstructionProgramState", "diagram or shared caselet reconstruction", "missing stage/state", ["diagram/caselet evidence", "motion continuity"]),

  r("CP012-R-021", "trainScheduleSynthesisState", "delayed train plus fixed crossing event", "meeting/crossing time", ["finite train length or crossing distance", "train speeds", "departure delay"]),
  r("CP012-R-022", "trainScheduleSynthesisState", "train departure delay plus station meeting", "unknown delay or meeting time", ["station geometry", "train rates", "departure offsets"]),
  r("CP012-R-023", "trainScheduleSynthesisState", "delayed-departure finite-train crossing", "complete crossing time", ["finite train event semantics", "initial gap", "departure delay"]),
  r("CP012-R-024", "trainScheduleSynthesisState", "inverse train schedule", "unknown departure delay from meeting evidence", ["meeting evidence", "clock schedule", "train speeds"]),

  r("CP012-R-025", "mediumPursuitSynthesisState", "current-driven raft pursuit after delayed boat start", "catch time or catch distance", ["still-water speed", "current", "boat start delay"]),
  r("CP012-R-026", "mediumPursuitSynthesisState", "dropped floating object recovered after boat turns", "recovery displacement", ["current-driven object", "detection delay", "turnaround feasibility"]),
  r("CP012-R-027", "mediumPursuitSynthesisState", "floating-object pursuit synthesis", "recovery/catch time or distance", ["current-driven object", "boat relative speed", "delay/turn state"]),
  r("CP012-R-028", "mediumPursuitSynthesisState", "inverse medium-pursuit state", "unknown current from catch evidence", ["catch time", "start delay", "still-water speed"]),

  r("CP012-R-029", "closedTrackRaceSynthesisState", "closed-track race with finish lead", "modular gap at faster finish", ["track circumference", "modular position", "race distance"]),
  r("CP012-R-030", "closedTrackRaceSynthesisState", "lap/overtake plus handicap", "first overtake time or dead-heat handicap", ["track length", "start handicap", "runner speeds"]),
  r("CP012-R-031", "closedTrackRaceSynthesisState", "faster-finish comparison from a declared head start", "finish gap", ["head start", "modular track", "finish time"]),
  r("CP012-R-032", "closedTrackRaceSynthesisState", "inverse circular-race handicap", "head start required for a dead heat", ["track/race distance", "runner speeds", "dead-heat outcome"]),

  r("CP012-R-033", "movingSurfaceScheduleSynthesisState", "moving surface active then stopped", "travel time", ["person rate", "surface rate", "active interval"]),
  r("CP012-R-034", "movingSurfaceScheduleSynthesisState", "escalator direction reversal", "travel time after reversal", ["signed surface rate", "reversal time", "person motion"]),
  r("CP012-R-035", "movingSurfaceScheduleSynthesisState", "moving walkway with delayed activation", "arrival time", ["walking rate", "surface activation schedule", "surface length"]),
  r("CP012-R-036", "movingSurfaceScheduleSynthesisState", "inverse moving-surface schedule", "unknown active interval before stop", ["person/surface rates", "surface length", "total arrival time"]),

  r("CP012-R-037", "twoEngineInverseState", "two earlier motion engines with one shared unknown", "shared unknown parameter", ["engine A equation", "engine B equation", "shared parameter"]),
  r("CP012-R-038", "twoEngineInverseState", "two-context equal-state calibration", "rate/distance parameter", ["first motion context", "second motion context", "common state"]),
  r("CP012-R-039", "twoEngineInverseState", "cross-family inverse evidence", "unique hidden state", ["two independently essential TSD authorities", "one coupled unknown"]),
  r("CP012-R-040", "twoEngineInverseState", "paired outcome reconstruction", "hidden rate/time/distance", ["outcome from engine A", "outcome from engine B", "coupling constraint"]),

  r("CP012-R-041", "feasibleParameterSetState", "enumerate valid integer speed values", "complete valid speed set", ["finite candidate speed domain", "exact distance/deadline constraint"]),
  r("CP012-R-042", "feasibleParameterSetState", "count valid integer speed states", "number of valid speeds", ["finite candidate speed domain", "exact constraints"]),
  r("CP012-R-043", "feasibleParameterSetState", "bounded speed set with fixed non-travel delay", "all satisfying speeds", ["integer speed domain", "fixed delay", "deadline"]),
  r("CP012-R-044", "feasibleParameterSetState", "finite speed-domain feasibility under alternate route values", "valid speed set or count", ["bounded speed choices", "distance", "time threshold"]),
] as const satisfies readonly TsdCp012Representation[]);

export const TSD_CP012_REPRESENTATION_SUMMARY = Object.freeze({
  totalRepresentations: TSD_CP012_REPRESENTATIONS.length,
  minimumPerAuthority: 4,
  representationCreatesNewQl: false as const,
  tableDiagramCaseletCreatesNewQl: false as const,
});
