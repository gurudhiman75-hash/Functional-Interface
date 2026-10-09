import { TSD_CP008_SOURCE_SATURATION_FINAL } from "./source-saturation-final";

export interface TsdCp008FinalOwnershipCandidate {
  readonly authorityKey: string;
  readonly checkpointId: "TSD-CP-008";
  readonly underlyingSolveModes: readonly string[];
  readonly examRepresentations: readonly string[];
  readonly executableInvariant: string;
  readonly ownershipStatus: "SOURCE_SATURATED_EXECUTABLE_FEASIBILITY_CANDIDATE";
  readonly permanentQlId: null;
}

const representations = Object.freeze(new Map<string, readonly string[]>([
  ["oppositeDirectionTrainCrossingTime", Object.freeze(["two trains crossing in opposite directions", "two train lengths stated in metres", "speeds stated in km/h or m/s", "find complete crossing time after first contact"])],
  ["sameDirectionTrainCrossingTime", Object.freeze(["faster train overtakes slower train", "same-direction complete pass", "rear-to-front clearance wording", "clock-free and clock-wrapped overtaking representations"])],
  ["relativeSpeedFromTrainCrossing", Object.freeze(["combined train length and crossing time", "opposite-direction relative speed", "same-direction closing speed", "recover relative speed before individual speeds"])],
  ["trainLengthFromTrainCrossingEvidence", Object.freeze(["one train length unknown", "sum of train lengths as intermediate", "known direction and speeds", "length ratio as a representation over repeated crossing evidence"])],
  ["trainSpeedFromTrainCrossingEvidence", Object.freeze(["unknown faster-train speed", "unknown opposite-direction train speed", "speed ratio from crossing evidence", "mixed km/h and m/s inputs after normalization"])],
  ["movingObserverTrainCrossingTime", Object.freeze(["train crosses a walking person in same direction", "train crosses cyclist in opposite direction", "moving guard/runner as point observer", "relative-speed direction explicitly stated"])],
  ["trainObserverStateFromCrossingTimes", Object.freeze(["same train crosses observer in both directions", "recover train speed", "recover observer speed", "paired crossing-time equations"])],
  ["sharedFixedObjectTwoTrainEvidence", Object.freeze(["two trains cross one common platform", "two trains cross one common bridge", "common object plus train-length ratio", "jointly recover object length or one train length"])],
  ["fullContainmentOverlapDuration", Object.freeze(["shorter train fully within longer train span", "same-direction containment interval", "opposite-direction containment interval", "explicit unequal-length feasibility condition"])],
]));

const kept = TSD_CP008_SOURCE_SATURATION_FINAL.filter((entry) => entry.decision === "KEEP_CP008_AUTHORITY");

export const TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES: readonly TsdCp008FinalOwnershipCandidate[] = Object.freeze(
  kept.map((entry) => {
    const owned = TSD_CP008_SOURCE_SATURATION_FINAL
      .filter((candidate) => candidate.targetAuthority === entry.targetAuthority && (candidate.decision === "KEEP_CP008_AUTHORITY" || candidate.decision === "MERGE_CP008_AUTHORITY"))
      .map((candidate) => candidate.solveMode);
    const examRepresentations = representations.get(entry.targetAuthority);
    if (!examRepresentations || examRepresentations.length < 4) throw new Error(`${entry.targetAuthority}: CP008 representation coverage too thin`);
    return Object.freeze({
      authorityKey: entry.targetAuthority,
      checkpointId: "TSD-CP-008" as const,
      underlyingSolveModes: Object.freeze(owned),
      examRepresentations,
      executableInvariant: entry.executableInvariant,
      ownershipStatus: "SOURCE_SATURATED_EXECUTABLE_FEASIBILITY_CANDIDATE" as const,
      permanentQlId: null,
    });
  }),
);

if (TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES.length !== 9) throw new Error(`Expected 9 CP008 final authority candidates, got ${TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES.length}`);
if (new Set(TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES.map((entry) => entry.authorityKey)).size !== 9) throw new Error("CP008 final authority keys are not unique");
