import { TSD_CP007_AUTHORITY_OVERLAP_AUDIT, TSD_CP007_OVERLAP_COUNTS } from "./authority-overlap-audit";

export interface TsdCp007FinalOwnershipCandidate {
  readonly authorityKey: string;
  readonly checkpointId: "TSD-CP-007";
  readonly underlyingSolveModes: readonly string[];
  readonly examRepresentations: readonly string[];
  readonly sourceSaturationRequirements: readonly string[];
  readonly ownershipStatus: "FINAL_MERGE_SPLIT_CANDIDATE";
  readonly permanentQlId: null;
  readonly englishFreezeStatus: "UNFROZEN";
}

const examRepresentations = Object.freeze(new Map<string, readonly string[]>([
  ["fixedPointCrossingTime", Object.freeze(["train crosses a pole/signal/tree", "train crosses a stationary person", "time between engine and rear passing one fixed observer", "point crossing with km/h to m/s conversion"])],
  ["finiteFixedObjectCrossingTime", Object.freeze(["train crosses a platform", "train crosses a bridge", "train crosses a tunnel", "contiguous fixed geometry such as bridge followed by platform treated as one effective length"])],
  ["trainLengthFromPointCrossing", Object.freeze(["train length from speed and pole time", "train length from stationary-person crossing", "ratio representation when the same-speed point-crossing condition is explicit"])],
  ["trainSpeedFromPointCrossing", Object.freeze(["train speed from known train length and pole time", "m/s answer", "km/h answer after exact conversion"])],
  ["fixedObjectLengthFromCrossingEvidence", Object.freeze(["platform length from train length speed and crossing time", "bridge/tunnel length from direct crossing evidence", "object length from paired point/object times when speed is inferred first"])],
  ["trainLengthFromPointAndObjectTimes", Object.freeze(["train crosses pole then known platform", "train crosses pole then known bridge", "extra-time method used to recover speed before train length", "equation-pair method yielding the same exact result"])],
  ["trainSpeedFromPointAndObjectTimes", Object.freeze(["speed from pole time and known platform crossing time", "speed from pole time and known bridge/tunnel length", "extra distance divided by extra time shortcut", "exact unit-conversion variants"])],
  ["fixedObjectLengthDifferenceFromCrossingTimes", Object.freeze(["same train crosses two platforms in different times", "difference of bridge/platform lengths from time difference", "one fixed-object length known and the other recovered through the difference relation"])],
  ["fullOccupancyDuration", Object.freeze(["train remains completely inside a tunnel", "train remains completely on a sufficiently long platform/bridge", "object length from duration of complete occupancy", "feasibility guard when object length is not greater than train length"])],
  ["trainCrossingEventTimeline", Object.freeze(["clock time of front entry and rear exit", "unknown entry/exit event time from another event time", "distinguish front-reaches-end from rear-clears-end", "timeline wording where event semantics determine whether distance is object length train length or their sum/difference"])],
  ["fixedSpacingPointCount", Object.freeze(["count telephone/telegraph poles passed in a stated time", "speed from number of equally spaced posts observed", "spacing from pass count speed and duration", "include-both-endpoints wording using n points versus n-1 gaps"])],
]));

const saturationRequirements = Object.freeze(new Map<string, readonly string[]>([
  ["fixedPointCrossingTime", Object.freeze(["pole plus stationary-person wording", "at least one direct time target and one observer-event representation", "integer and rational unit-conversion cases"])],
  ["finiteFixedObjectCrossingTime", Object.freeze(["platform bridge and tunnel skins", "known train/object lengths with direct time target", "at least one combined fixed-geometry representation without creating a new authority"])],
  ["trainLengthFromPointCrossing", Object.freeze(["speed in km/h and m/s source forms", "integer and rational lengths", "point-object wording beyond only pole"])],
  ["trainSpeedFromPointCrossing", Object.freeze(["speed answer in m/s and km/h", "mixed train-length/time magnitudes", "exact conversion without premature decimal rounding"])],
  ["fixedObjectLengthFromCrossingEvidence", Object.freeze(["platform bridge and tunnel targets", "direct speed evidence and paired-time evidence", "positive-length feasibility checks"])],
  ["trainLengthFromPointAndObjectTimes", Object.freeze(["pole plus platform/bridge source forms", "extra-time shortcut and equation-pair representations", "cases where both train length and speed are initially unknown"])],
  ["trainSpeedFromPointAndObjectTimes", Object.freeze(["platform bridge and tunnel known-length forms", "exact extra-distance/extra-time inference", "m/s and km/h answer projections"])],
  ["fixedObjectLengthDifferenceFromCrossingTimes", Object.freeze(["two unequal fixed objects", "both ordering directions so the signed time difference cannot be hard-coded", "at least one source form asking one absolute length after giving the other"])],
  ["fullOccupancyDuration", Object.freeze(["tunnel and platform/bridge skins", "forward duration and inverse object-length targets", "object-longer-than-train feasibility boundary in QA"])],
  ["trainCrossingEventTimeline", Object.freeze(["front-entry rear-entry front-exit and rear-exit vocabulary", "forward and inverse clock-time targets", "cases that expose the difference between full crossing and complete occupancy"])],
  ["fixedSpacingPointCount", Object.freeze(["count-from-speed and speed-from-count directions", "explicit endpoint-inclusion wording", "n versus n-1 gap convention and inverse spacing target"])],
]));

const retained = TSD_CP007_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP007_AUTHORITY");

export const TSD_CP007_FINAL_NEW_AUTHORITY_CANDIDATES: readonly TsdCp007FinalOwnershipCandidate[] = Object.freeze(
  retained.map((entry) => {
    const ownedModes = TSD_CP007_AUTHORITY_OVERLAP_AUDIT
      .filter((candidate) => candidate.targetAuthority === entry.targetAuthority && (candidate.decision === "KEEP_AS_NEW_CP007_AUTHORITY" || candidate.decision === "MERGE_INTO_CP007_AUTHORITY"))
      .map((candidate) => candidate.solveMode);
    const representations = examRepresentations.get(entry.targetAuthority);
    const requirements = saturationRequirements.get(entry.targetAuthority);
    if (!representations || representations.length < 3) throw new Error(`${entry.targetAuthority}: insufficient CP007 exam representation coverage`);
    if (!requirements || requirements.length < 3) throw new Error(`${entry.targetAuthority}: insufficient CP007 source-saturation requirements`);
    return Object.freeze({
      authorityKey: entry.targetAuthority,
      checkpointId: "TSD-CP-007" as const,
      underlyingSolveModes: Object.freeze(ownedModes),
      examRepresentations: representations,
      sourceSaturationRequirements: requirements,
      ownershipStatus: "FINAL_MERGE_SPLIT_CANDIDATE" as const,
      permanentQlId: null,
      englishFreezeStatus: "UNFROZEN" as const,
    });
  }),
);

export const TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY = Object.freeze({
  newCp007LearnerAuthorities: TSD_CP007_FINAL_NEW_AUTHORITY_CANDIDATES.length,
  mergedCoreSolveModes: TSD_CP007_OVERLAP_COUNTS.mergedCoreModes,
  heldCrossCheckpointModes: TSD_CP007_OVERLAP_COUNTS.heldCrossCheckpointModes,
  heldRepresentationCandidates: TSD_CP007_OVERLAP_COUNTS.heldRepresentationCandidates,
  internalQaModes: TSD_CP007_OVERLAP_COUNTS.internalQaModes,
  permanentQlCount: 0 as const,
  nextPermanentQl: "TSD-QL-084" as const,
  englishFreezeStatus: "UNFROZEN" as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  nextGate: "PRODUCT_OWNER_REVIEW_OF_CP007_11_AUTHORITY_MERGE_SPLIT_BEFORE_QL_ALLOCATION" as const,
});

if (TSD_CP007_FINAL_NEW_AUTHORITY_CANDIDATES.length !== 11) {
  throw new Error(`CP007 final ownership candidate expected 11 learner authorities, found ${TSD_CP007_FINAL_NEW_AUTHORITY_CANDIDATES.length}`);
}
