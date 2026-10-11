import { TSD_CP005_AUTHORITY_OVERLAP_AUDIT, TSD_CP005_OVERLAP_COUNTS } from "./authority-overlap-audit";

export interface TsdCp005FinalOwnershipCandidate {
  readonly authorityKey: string;
  readonly checkpointId: "TSD-CP-005";
  readonly underlyingSolveModes: readonly string[];
  readonly examRepresentations: readonly string[];
  readonly ownershipStatus: "FINAL_MERGE_SPLIT_CANDIDATE";
  readonly permanentQlId: null;
  readonly englishFreezeStatus: "UNFROZEN";
}

const examRepresentations = Object.freeze(new Map<string, readonly string[]>([
  ["speedRatioFromPostMeetingArrivalTimes", Object.freeze(["two travellers meet and then reach opposite endpoints", "post-meeting arrival times stated in minutes", "arrival-time ratio converted to speed ratio", "endpoint labels replaced by towns/checkpoints"])],
  ["postMeetingArrivalTimeFromSpeedRelation", Object.freeze(["speed ratio plus route distance", "one speed plus speed ratio", "find A's remaining time after first meeting", "find B's remaining time after first meeting"])],
  ["routeDistanceFromPostMeetingEvidence", Object.freeze(["one speed plus both post-meeting times", "town-to-town route reconstruction", "post-meeting endpoint arrival evidence", "mixed hour/minute presentation after normalization"])],
  ["individualSpeedsFromPostMeetingEvidence", Object.freeze(["route length and two post-meeting times", "recover both traveller speeds", "vehicle pair from endpoint-arrival evidence", "runner/cyclist pair on a bounded road"])],
  ["firstMeetingPointFromPostMeetingEvidence", Object.freeze(["distance from A endpoint", "distance from B endpoint through complement", "first meeting inferred only after later arrivals", "route-strip representation with endpoint labels"])],
  ["repeatedLinearMeetingTime", Object.freeze(["second meeting after both turn instantly", "nth meeting on a bounded road", "time between first and second meetings", "repeated endpoint shuttling without rests"])],
  ["repeatedLinearMeetingPoint", Object.freeze(["second meeting coordinate from one endpoint", "nth reflected meeting point", "route-strip reflection", "alternating endpoint-side meeting locations"])],
  ["repeatedLinearMeetingCount", Object.freeze(["number of meetings within a time window", "meeting count before a clock deadline", "bounded shuttle event count", "count excluding the initial start instant"])],
  ["singleTurnaroundMeetingTime", Object.freeze(["faster traveller reaches endpoint and turns", "one-turn shuttle meets slower traveller", "pass-then-return meeting", "same-start bounded-line turnaround"])],
  ["shuttleDistanceBeforeReturnMeeting", Object.freeze(["total path travelled by the turning body", "outward plus return distance", "distance covered before meeting slower traveller", "endpoint-turn path reconstruction"])],
  ["returnJourneyMeetingPoint", Object.freeze(["meeting coordinate after one traveller turns", "distance from the original endpoint", "distance from the turnaround endpoint", "route-strip return meeting"])],
  ["endpointRestFromNextMeeting", Object.freeze(["rest at far endpoint before turning", "dwell time inferred from delayed second meeting", "route-reversal schedule delay", "one traveller rests while the other keeps moving"])],
  ["routeDistanceFromRepeatedMeetingGap", Object.freeze(["route length from first-to-second meeting gap", "endpoint separation from two observed meeting times", "inverse repeated-meeting schedule", "bounded-road length reconstruction"])],
]));

const retained = TSD_CP005_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP005_AUTHORITY");

export const TSD_CP005_FINAL_NEW_AUTHORITY_CANDIDATES: readonly TsdCp005FinalOwnershipCandidate[] = Object.freeze(
  retained.map((entry) => {
    const underlyingSolveModes = TSD_CP005_AUTHORITY_OVERLAP_AUDIT
      .filter((candidate) => candidate.targetAuthority === entry.targetAuthority && (candidate.decision === "KEEP_AS_NEW_CP005_AUTHORITY" || candidate.decision === "MERGE_INTO_CP005_AUTHORITY"))
      .map((candidate) => candidate.solveMode);
    const representations = examRepresentations.get(entry.targetAuthority);
    if (!representations || representations.length < 3) throw new Error(`${entry.targetAuthority}: insufficient CP005 exam representation coverage`);
    return Object.freeze({
      authorityKey: entry.targetAuthority,
      checkpointId: "TSD-CP-005" as const,
      underlyingSolveModes: Object.freeze(underlyingSolveModes),
      examRepresentations: representations,
      ownershipStatus: "FINAL_MERGE_SPLIT_CANDIDATE" as const,
      permanentQlId: null,
      englishFreezeStatus: "UNFROZEN" as const,
    });
  }),
);

export const TSD_CP005_HELD_CROSS_CHECKPOINT_MODES = Object.freeze(
  TSD_CP005_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_CROSS_CHECKPOINT_OVERLAP"),
);

export const TSD_CP005_INTERNAL_QA_MODES = Object.freeze(
  TSD_CP005_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "INTERNAL_QA"),
);

export const TSD_CP005_FINAL_OWNERSHIP_CANDIDATE_SUMMARY = Object.freeze({
  newCp005LearnerAuthorities: TSD_CP005_FINAL_NEW_AUTHORITY_CANDIDATES.length,
  mergedCoreModes: TSD_CP005_OVERLAP_COUNTS.mergedCoreModes,
  heldCrossCheckpointModes: TSD_CP005_HELD_CROSS_CHECKPOINT_MODES.length,
  heldRepresentationCandidates: TSD_CP005_OVERLAP_COUNTS.heldRepresentationCandidates,
  internalQaModes: TSD_CP005_INTERNAL_QA_MODES.length,
  permanentQlCount: 0 as const,
  nextPermanentQl: "TSD-QL-058" as const,
  englishFreezeStatus: "UNFROZEN" as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

if (TSD_CP005_FINAL_NEW_AUTHORITY_CANDIDATES.length !== 13) throw new Error(`Expected 13 CP005 learner-authority candidates, received ${TSD_CP005_FINAL_NEW_AUTHORITY_CANDIDATES.length}`);
if (new Set(TSD_CP005_FINAL_NEW_AUTHORITY_CANDIDATES.map((entry) => entry.authorityKey)).size !== 13) throw new Error("Duplicate CP005 retained authority key");
