import type { TsdCp012AuthorityKey } from "./source-saturation";

export const TSD_CP012_QL_ALLOCATION_STATUS = "PERMANENT_FROZEN" as const;

export const TSD_CP012_QL_ALLOCATION = Object.freeze([
  Object.freeze({ qlId: "TSD-QL-132", authorityKey: "discreteSpeedProgramState", learnerContract: "Solve finite, alternating or repeating speed-stage programs, including inverse final-rate and exact partial-terminal-cycle states." }),
  Object.freeze({ qlId: "TSD-QL-133", authorityKey: "periodicTravelRestProgramState", learnerContract: "Solve repeated travel-rest cycles with exact terminal arrival logic, rest counts and inverse rest duration." }),
  Object.freeze({ qlId: "TSD-QL-134", authorityKey: "terminalConstraintProgramState", learnerContract: "Recover remaining distance, final-stage speed/time, changeover boundary, minimum speed or maximum delay under an essential multi-stage terminal constraint." }),
  Object.freeze({ qlId: "TSD-QL-135", authorityKey: "routeProfileProgramState", learnerContract: "Solve finite routes whose segment or mode speeds are essential, including route totals, distance splits, finite route choice and side-speed closed-route meeting." }),
  Object.freeze({ qlId: "TSD-QL-136", authorityKey: "motionReconstructionProgramState", learnerContract: "Reconstruct a missing distance, time, speed or stage from a compact itinerary, table, diagram or shared motion caselet." }),
  Object.freeze({ qlId: "TSD-QL-137", authorityKey: "trainScheduleSynthesisState", learnerContract: "Combine finite-train or station-event geometry with an independently essential departure schedule to solve meeting, complete crossing or inverse delay states." }),
  Object.freeze({ qlId: "TSD-QL-138", authorityKey: "mediumPursuitSynthesisState", learnerContract: "Combine signed one-dimensional medium motion with pursuit or recovery evidence to solve catch time/distance, current or floating-object recovery state." }),
  Object.freeze({ qlId: "TSD-QL-139", authorityKey: "closedTrackRaceSynthesisState", learnerContract: "Combine modular closed-track position with race, finish, handicap or overtake evidence to solve finish gaps, dead-heat head starts or first overtake time." }),
  Object.freeze({ qlId: "TSD-QL-140", authorityKey: "movingSurfaceScheduleSynthesisState", learnerContract: "Solve moving-surface motion with an essential stop, delayed activation, direction reversal or inverse active-interval schedule." }),
  Object.freeze({ qlId: "TSD-QL-141", authorityKey: "twoEngineInverseState", learnerContract: "Recover a unique hidden speed from two independently essential earlier TSD authority equations where neither motion engine alone identifies the requested state." }),
  Object.freeze({ qlId: "TSD-QL-142", authorityKey: "feasibleParameterSetState", learnerContract: "Enumerate or count every valid value in a finite declared motion-parameter domain under exact feasibility constraints." }),
] as const satisfies readonly Readonly<{ qlId: string; authorityKey: TsdCp012AuthorityKey; learnerContract: string }>[]);

export type TsdCp012QlId = (typeof TSD_CP012_QL_ALLOCATION)[number]["qlId"];
export const TSD_CP012_PERMANENT_QL_IDS = Object.freeze(TSD_CP012_QL_ALLOCATION.map((x) => x.qlId));
export const TSD_CP012_NEXT_PERMANENT_QL = "TSD-QL-143" as const;

// Compatibility aliases retained for stacked consumers until Studio promotion cleanup.
export const TSD_CP012_PROVISIONAL_QL_IDS = TSD_CP012_PERMANENT_QL_IDS;
export const TSD_CP012_NEXT_QL_ID = TSD_CP012_NEXT_PERMANENT_QL;

export const TSD_CP012_QL_LIFECYCLE = Object.freeze({
  allocationStatus: TSD_CP012_QL_ALLOCATION_STATUS,
  productOwnerApproved: true,
  frozen: true,
  productionRegistered: false,
  questionStudioRegistered: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const);
