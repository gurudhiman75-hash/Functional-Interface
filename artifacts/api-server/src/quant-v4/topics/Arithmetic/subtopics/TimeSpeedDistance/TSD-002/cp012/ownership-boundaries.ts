import type { TsdCp012AuthorityKey } from "./source-saturation";

export type TsdCp012OwnershipBoundary = Readonly<{
  authorityKey: TsdCp012AuthorityKey;
  ownsWhen: string;
  rejectsOrDelegates: readonly string[];
}>;

export const TSD_CP012_OWNERSHIP_BOUNDARIES = Object.freeze([
  Object.freeze({ authorityKey: "discreteSpeedProgramState", ownsWhen: "An explicit finite or periodic sequence of two or more speed stages is essential to the target.", rejectsOrDelegates: Object.freeze(["single constant-speed relation -> CP001", "ordinary two/three journey segments whose central target is average speed -> CP002", "unrestricted continuous acceleration -> Physics"]) }),
  Object.freeze({ authorityKey: "periodicTravelRestProgramState", ownsWhen: "Travel and zero-speed rest states repeat as an explicit cycle and the repeat/terminal-cycle logic is essential.", rejectsOrDelegates: Object.freeze(["one isolated stop or ordinary scheduled halt -> CP003", "generic work/rest productivity cycle -> Time & Work"]) }),
  Object.freeze({ authorityKey: "terminalConstraintProgramState", ownsWhen: "The unknown is a boundary/final-stage/deadline parameter inside an explicitly multi-stage or variable motion program.", rejectsOrDelegates: Object.freeze(["single speed-change early/late arrival with no essential multi-stage program -> CP003", "pure inequality/number-range question with no motion consequence -> Algebra/Number System as appropriate"]) }),
  Object.freeze({ authorityKey: "routeProfileProgramState", ownsWhen: "A finite, explicitly enumerated route has segment- or mode-dependent rates and those rate changes are essential.", rejectsOrDelegates: Object.freeze(["uniform closed-track meeting/overtake -> CP006", "open-ended route optimisation or graph search -> outside TSD", "large chart/table route comparison whose main skill is DI -> Data Interpretation"]) }),
  Object.freeze({ authorityKey: "motionReconstructionProgramState", ownsWhen: "A compact itinerary/table/diagram/caselet encodes a finite motion ledger and the learner reconstructs a missing motion state.", rejectsOrDelegates: Object.freeze(["large chart/table interpretation -> Data Interpretation", "representation-only change with same underlying ordinary authority -> original CP", "direction-turn endpoint reasoning -> Reasoning Direction & Distance"]) }),
  Object.freeze({ authorityKey: "trainScheduleSynthesisState", ownsWhen: "Finite train length/crossing or station-event semantics and an independent departure/schedule constraint are both essential.", rejectsOrDelegates: Object.freeze(["ordinary finite train crossing -> CP007/CP008", "schedule detail that is decorative or removable -> CP007/CP008"]) }),
  Object.freeze({ authorityKey: "mediumPursuitSynthesisState", ownsWhen: "Signed one-dimensional medium motion and pursuit/recovery event state are both essential.", rejectsOrDelegates: Object.freeze(["ordinary upstream/downstream relation -> CP009", "ordinary pursuit with no medium contribution -> CP004/CP005", "two-dimensional river/wind vector problem -> Trigonometry advanced hold"]) }),
  Object.freeze({ authorityKey: "closedTrackRaceSynthesisState", ownsWhen: "Modulo/closed-track event state and race/handicap/finish comparison are both essential.", rejectsOrDelegates: Object.freeze(["ordinary closed-track meeting/overtake -> CP006", "ordinary linear race lead/handicap -> CP010"]) }),
  Object.freeze({ authorityKey: "movingSurfaceScheduleSynthesisState", ownsWhen: "Moving-surface relative motion and an essential stop/start/reversal/activation schedule are both required.", rejectsOrDelegates: Object.freeze(["ordinary escalator/walkway constant state -> CP011", "decorative clock wording with one constant surface state -> CP011"]) }),
  Object.freeze({ authorityKey: "twoEngineInverseState", ownsWhen: "Two earlier, materially different TSD authorities contribute independent equations to one coupled hidden state; neither equation alone identifies the requested state.", rejectsOrDelegates: Object.freeze(["two wordings of the same equation", "one sufficient authority plus decorative second evidence", "abstract simultaneous equations with no essential motion interpretation -> Algebra"]) }),
  Object.freeze({ authorityKey: "feasibleParameterSetState", ownsWhen: "The learner must enumerate or count every valid state in a finite declared parameter domain under exact motion constraints.", rejectsOrDelegates: Object.freeze(["internal unique/multiple/impossible classifier -> QA only", "unbounded optimisation", "pure set/count problem with no essential motion constraint -> other math chapter"]) }),
] as const satisfies readonly TsdCp012OwnershipBoundary[]);

export const TSD_CP012_GLOBAL_OWNERSHIP_GUARDS = Object.freeze({
  requiresEssentialMultiStageOrCrossAuthorityState: true as const,
  decorativeComplexityNeverPromotesToCp012: true as const,
  finiteRouteChoiceOnly: true as const,
  largeDiDelegated: true as const,
  continuousAccelerationRejected: true as const,
  ordinaryAuthorityWinsWhenSecondaryEvidenceCanBeRemoved: true as const,
});
