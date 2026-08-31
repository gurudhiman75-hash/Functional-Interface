export const TSD_CP012_CHECKPOINT_ID = "TSD-CP-012" as const;
export const TSD_CP012_TITLE = "Variable, Periodic, Multi-Stage and Essential Motion Synthesis" as const;

export const TSD_CP012_LEARNER_AUTHORITIES = Object.freeze([
  "discreteSpeedProgramState",
  "periodicTravelRestProgramState",
  "terminalConstraintProgramState",
  "routeProfileProgramState",
  "motionReconstructionProgramState",
  "trainScheduleSynthesisState",
  "mediumPursuitSynthesisState",
  "closedTrackRaceSynthesisState",
  "movingSurfaceScheduleSynthesisState",
  "twoEngineInverseState",
  "feasibleParameterSetState",
] as const);
export type TsdCp012AuthorityKey = typeof TSD_CP012_LEARNER_AUTHORITIES[number];

export type TsdCp012SourceDisposition = "LEARNER_AUTHORITY" | "INTERNAL_QA";

export type TsdCp012SourceCandidate = Readonly<{
  sourceId: string;
  candidate: string;
  disposition: TsdCp012SourceDisposition;
  authorityKey?: TsdCp012AuthorityKey;
  note: string;
}>;

const learner = (sourceId: string, candidate: string, authorityKey: TsdCp012AuthorityKey, note: string): TsdCp012SourceCandidate =>
  Object.freeze({ sourceId, candidate, disposition: "LEARNER_AUTHORITY" as const, authorityKey, note });
const qa = (sourceId: string, candidate: string, note: string): TsdCp012SourceCandidate =>
  Object.freeze({ sourceId, candidate, disposition: "INTERNAL_QA" as const, note });

export const TSD_CP012_SOURCE_CANDIDATES = Object.freeze([
  learner("CP012-INV-001", "findDistanceForArithmeticSpeedSequence", "discreteSpeedProgramState", "Discrete arithmetic speed schedule; target is total distance."),
  learner("CP012-INV-002", "findTimeForArithmeticSpeedSequence", "discreteSpeedProgramState", "Same schedule authority with total-time target."),
  learner("CP012-INV-003", "findUnknownTermInSpeedSequence", "discreteSpeedProgramState", "Inverse term of an explicit discrete speed schedule."),
  learner("CP012-INV-004", "findDistanceForAlternatingSpeeds", "discreteSpeedProgramState", "Alternating finite speed schedule."),
  learner("CP012-INV-005", "findTimeForAlternatingSpeeds", "discreteSpeedProgramState", "Alternating schedule with time target."),
  learner("CP012-INV-006", "findDistanceForPeriodicSpeedCycle", "discreteSpeedProgramState", "Repeated finite speed cycle."),
  learner("CP012-INV-007", "findExactTerminalPartialCycleTime", "discreteSpeedProgramState", "Periodic cycle ending inside a partial terminal stage."),
  learner("CP012-INV-008", "findTravelRestPeriodicCompletionTime", "periodicTravelRestProgramState", "Travel/rest cycle where zero-speed rest stages are essential; a single explicit source is enough to justify provisional discovery because the rest state changes the equation class."),
  learner("CP012-INV-009", "findDistanceRemainingAfterVariableSpeeds", "terminalConstraintProgramState", "Variable schedule evaluated against a terminal distance constraint."),
  learner("CP012-INV-010", "findRequiredFinalSegmentSpeed", "terminalConstraintProgramState", "Solve final segment speed needed to meet a total-time/distance constraint."),
  learner("CP012-INV-011", "findRequiredFinalSegmentTime", "terminalConstraintProgramState", "Solve final segment time needed to meet a total constraint."),
  learner("CP012-INV-012", "findUnknownStageBoundary", "terminalConstraintProgramState", "Unknown changeover point in a declared multi-stage program."),
  learner("CP012-INV-013", "findUnknownScheduleParameter", "terminalConstraintProgramState", "Single unknown parameter in a finite motion schedule."),
  learner("CP012-INV-014", "findRouteTimeWithTerrainDependentSpeeds", "routeProfileProgramState", "Route segments have declared terrain-dependent speeds."),
  learner("CP012-INV-015", "findPolygonTrackTimeWithSideDependentSpeeds", "routeProfileProgramState", "Finite polygon sides with side-specific speeds; geometry only supplies lengths."),
  learner("CP012-INV-016", "findSquareOrRectangleTrackMeetingWithSideSpeeds", "routeProfileProgramState", "Closed rectangular route with side-dependent speeds and meeting state."),
  learner("CP012-INV-017", "findMultiModalWalkCycleRideTime", "routeProfileProgramState", "Walking/cycling/riding stages are essential route modes."),
  learner("CP012-INV-018", "findMultiModalDistanceSplit", "routeProfileProgramState", "Inverse distance split across multiple declared motion modes."),
  learner("CP012-INV-019", "chooseMinimumTimeRoute", "routeProfileProgramState", "Compare a finite set of fully specified routes by exact travel time."),
  learner("CP012-INV-020", "findSpeedPlanForDeadline", "terminalConstraintProgramState", "Required speed plan under a deadline."),
  learner("CP012-INV-021", "findDeparturePlanForDeadline", "terminalConstraintProgramState", "Required departure/delay parameter under an arrival deadline."),
  learner("CP012-INV-022", "findCompleteItineraryFromPartialEvidence", "motionReconstructionProgramState", "Reconstruct missing stages from partial itinerary evidence."),
  learner("CP012-INV-023", "findMissingMotionSegment", "motionReconstructionProgramState", "Recover one missing segment of a motion ledger."),
  learner("CP012-INV-024", "findMotionStateFromDistanceTimeTable", "motionReconstructionProgramState", "Compact distance-time table represents the same reconstruction authority."),
  learner("CP012-INV-025", "findMotionStateFromSpeedTimeTable", "motionReconstructionProgramState", "Compact speed-time table represents the same reconstruction authority."),
  learner("CP012-INV-026", "findMotionStateFromDiagramAndText", "motionReconstructionProgramState", "Diagram is representation evidence, not a new mathematical QL."),
  learner("CP012-INV-027", "findMotionStateFromSharedCaselet", "motionReconstructionProgramState", "Shared caselet is a representation of one underlying reconstructed state."),
  learner("CP012-INV-028", "findTrainPlusScheduleSynthesis", "trainScheduleSynthesisState", "Finite train crossing/meeting authority plus an independently essential departure or schedule constraint; kept separate because finite train length/event semantics remain essential."),
  learner("CP012-INV-029", "findBoatPlusPursuitSynthesis", "mediumPursuitSynthesisState", "Signed medium-motion authority plus independently essential pursuit/closing-speed state; mathematically distinct from train or closed-track synthesis."),
  learner("CP012-INV-030", "findCircularRaceSynthesis", "closedTrackRaceSynthesisState", "Closed-track modular position plus race/finish comparison are both essential; modular event state prevents merger with ordinary route profiles."),
  learner("CP012-INV-031", "findEscalatorPlusScheduleSynthesis", "movingSurfaceScheduleSynthesisState", "Moving-surface relative motion plus an independently essential schedule/state-change constraint."),
  learner("CP012-INV-032", "findTwoEngineInverseState", "twoEngineInverseState", "Generic inverse state in which two earlier TSD engines are independently necessary; retained as a distinct source-backed synthesis contract pending executable proof."),
  learner("CP012-INV-033", "findMinimumFeasibleSpeed", "terminalConstraintProgramState", "Boundary value satisfying explicit motion constraints."),
  learner("CP012-INV-034", "findMaximumFeasibleDelay", "terminalConstraintProgramState", "Latest delay satisfying explicit motion constraints."),
  learner("CP012-INV-035", "findCompleteValidParameterSet", "feasibleParameterSetState", "Return every parameter value satisfying a finite exact constraint system."),
  learner("CP012-INV-036", "findCountOfValidMotionStates", "feasibleParameterSetState", "Count valid states rather than selecting one arbitrary solution."),
  qa("CP012-INV-037", "detectContradictoryMultiStageState", "Internal contradiction/negative-case QA over learner authorities."),
  qa("CP012-INV-038", "classifySynthesisStateAsUniqueMultipleOrImpossible", "Internal identifiability classifier; does not create a new learner mathematical authority."),
  qa("CP012-INV-039", "verifyMultiStageMotionClaim", "Independent verification mode."),
  qa("CP012-INV-040", "solveMultiStageMotionDataSufficiency", "Data-sufficiency wrapper is held as QA/representation until ordinary authorities are proven."),
  learner("CP012-XCP-041", "findStateAfterEscalatorDirectionReversal", "movingSurfaceScheduleSynthesisState", "Transferred from CP011: direction reversal changes the signed surface contribution across stages and therefore belongs to multi-stage moving-surface synthesis."),
  learner("CP012-XCP-042", "findStopStartEscalatorSchedule", "movingSurfaceScheduleSynthesisState", "Transferred from CP011: stop/start schedule changes the surface state across stages and therefore belongs to multi-stage moving-surface synthesis."),
] as const satisfies readonly TsdCp012SourceCandidate[]);

export const TSD_CP012_SINGLE_SOURCE_DISTINCT_AUTHORITIES = Object.freeze([
  "periodicTravelRestProgramState",
  "trainScheduleSynthesisState",
  "mediumPursuitSynthesisState",
  "closedTrackRaceSynthesisState",
  "twoEngineInverseState",
] as const satisfies readonly TsdCp012AuthorityKey[]);

export const TSD_CP012_SOURCE_SUMMARY = Object.freeze({
  inventoryCandidates: 40,
  inheritedCrossCheckpointCandidates: 2,
  rawCandidates: TSD_CP012_SOURCE_CANDIDATES.length,
  learnerSourceForms: TSD_CP012_SOURCE_CANDIDATES.filter((x) => x.disposition === "LEARNER_AUTHORITY").length,
  learnerAuthorities: TSD_CP012_LEARNER_AUTHORITIES.length,
  internalQaModes: TSD_CP012_SOURCE_CANDIDATES.filter((x) => x.disposition === "INTERNAL_QA").length,
  frozen: true as const,
  questionStudioRegistered: false as const,
  bankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});
