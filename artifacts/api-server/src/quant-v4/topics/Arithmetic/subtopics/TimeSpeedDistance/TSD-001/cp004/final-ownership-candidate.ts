import { TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT } from "./cross-checkpoint-overlap-audit";

export interface TsdCp004FinalOwnershipCandidate {
  readonly authorityKey: string;
  readonly checkpointId: "TSD-CP-004";
  readonly underlyingSolveModes: readonly string[];
  readonly examRepresentations: readonly string[];
  readonly ownershipStatus: "FINAL_MERGE_SPLIT_CANDIDATE";
  readonly permanentQlId: null;
  readonly englishFreezeStatus: "UNFROZEN";
}

const examRepresentations = Object.freeze(new Map<string, readonly string[]>([
  ["relativeSpeedBetweenTwoBodies", Object.freeze(["two towns moving toward each other", "same-road pursuit", "walkers/runners/cyclists", "vehicles moving on one declared line"])],
  ["individualSpeedFromRelativeState", Object.freeze(["one speed and relative speed given", "faster/slower speed from catch-up evidence", "opposite-direction individual speed recovery"])],
  ["firstMeetingOrCatchUpTimeFromGap", Object.freeze(["first meeting from two endpoints", "same-direction catch-up from head start", "mixed km/h and minute wording", "meeting/catch-up after simultaneous start"])],
  ["relativeDistanceFromRelativeMotion", Object.freeze(["initial distance reconstructed from meeting time", "head-start distance from catch-up time", "relative distance covered in a stated duration", "unknown start-point gap"])],
  ["relativeSpeedFromGapAndMeetingTime", Object.freeze(["combined speed from first meeting", "closing speed from pursuit time", "relative speed inferred before individual-speed recovery"])],
  ["delayedStartPursuitState", Object.freeze(["one traveller starts later", "pursuer starts after a delay", "recover the delay from catch-up evidence", "delay converted to a moving head start"])],
  ["separationEvolutionOnLine", Object.freeze(["moving apart from an existing gap", "recover initial gap from later separation", "time until a stated separation is reached"])],
  ["firstMeetingPointFromSpeedRelation", Object.freeze(["meeting point between two towns", "distance from one endpoint", "speed-ratio form of first meeting", "explicit speed form of first meeting"])],
  ["speedRatioFromFirstMeetingPoint", Object.freeze(["meeting point divides route in known distances", "distance ratio converted to speed ratio", "endpoint-to-meeting-point evidence"])],
  ["requiredSpeedForTargetMeeting", Object.freeze(["speed needed to meet after a target time", "required pursuit speed", "required opposite-direction speed", "cause/avoid threshold stated through a target meeting time"])],
]));

const retained = TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP004_AUTHORITY");

export const TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES: readonly TsdCp004FinalOwnershipCandidate[] = Object.freeze(
  retained.map((entry) => {
    const ownedModes = TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT
      .filter((candidate) => candidate.targetAuthority === entry.targetAuthority && (candidate.decision === "KEEP_AS_NEW_CP004_AUTHORITY" || candidate.decision === "MERGE_INTO_CP004_AUTHORITY"))
      .map((candidate) => candidate.solveMode);
    const representations = examRepresentations.get(entry.targetAuthority);
    if (!representations || representations.length < 3) throw new Error(`${entry.targetAuthority}: insufficient exam representation coverage`);
    return Object.freeze({
      authorityKey: entry.targetAuthority,
      checkpointId: "TSD-CP-004" as const,
      underlyingSolveModes: Object.freeze(ownedModes),
      examRepresentations: representations,
      ownershipStatus: "FINAL_MERGE_SPLIT_CANDIDATE" as const,
      permanentQlId: null,
      englishFreezeStatus: "UNFROZEN" as const,
    });
  }),
);

export const TSD_CP004_CLOCK_REPRESENTATION_EXTENSIONS = Object.freeze(
  TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT
    .filter((entry) => entry.decision === "ABSORB_AS_CP004_REPRESENTATION")
    .map((entry) => Object.freeze({
      solveMode: entry.solveMode,
      targetAuthority: entry.targetAuthority,
      contentCheckpointId: "TSD-CP-004" as const,
      newPermanentQlRequired: false as const,
      priorFrozenContentMutationAllowed: false as const,
    })),
);

export const TSD_CP004_FINAL_OWNERSHIP_CANDIDATE_SUMMARY = Object.freeze({
  newCp004LearnerAuthorities: TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES.length,
  mergedCoreSolveModes: TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES.reduce((count, authority) => count + Math.max(0, authority.underlyingSolveModes.length - 1), 0),
  clockRepresentationExtensions: TSD_CP004_CLOCK_REPRESENTATION_EXTENSIONS.length,
  heldAdvancedDiscoveryModes: 5 as const,
  heldTimelineDiagramRepresentations: 2 as const,
  internalQaModes: 3 as const,
  permanentQlCount: 0 as const,
  nextPermanentQl: "TSD-QL-048" as const,
  englishFreezeStatus: "UNFROZEN" as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});
