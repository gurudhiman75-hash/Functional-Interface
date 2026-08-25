export type TsdCp010Disposition =
  | "LEARNER_AUTHORITY"
  | "MERGED_REPRESENTATION"
  | "CROSS_CHECKPOINT_HOLD"
  | "INTERNAL_QA";

export type TsdCp010Candidate = Readonly<{
  id: number;
  sourceKey: string;
  disposition: TsdCp010Disposition;
  authorityKey?: string;
  note: string;
}>;

export const TSD_CP010_AUTHORITY_KEYS = [
  "finishDistanceLeadState",
  "finishTimeLeadState",
  "raceSpeedRatioState",
  "raceLengthFromLeadEvidence",
  "deadHeatHandicapState",
  "leadConversionState",
  "transitiveRaceComparison",
  "multiOutcomeRaceComparison",
  "changedRaceOutcomeState",
  "runnerStateFromTwoRaceOutcomes",
] as const;

export type TsdCp010AuthorityKey = (typeof TSD_CP010_AUTHORITY_KEYS)[number];

const c = (
  id: number,
  sourceKey: string,
  disposition: TsdCp010Disposition,
  authorityKey: TsdCp010AuthorityKey | undefined,
  note: string,
): TsdCp010Candidate => Object.freeze({ id, sourceKey, disposition, authorityKey, note });

export const TSD_CP010_SOURCE_SATURATION: readonly TsdCp010Candidate[] = Object.freeze([
  c(1, "findDistanceLeadAtFinish", "LEARNER_AUTHORITY", "finishDistanceLeadState", "Canonical finish-distance margin."),
  c(2, "findTimeLeadAtFinish", "LEARNER_AUTHORITY", "finishTimeLeadState", "Canonical finish-time margin."),
  c(3, "findSpeedRatioFromDistanceLead", "LEARNER_AUTHORITY", "raceSpeedRatioState", "Race outcome inverted to speed ratio."),
  c(4, "findSpeedRatioFromTimeLead", "MERGED_REPRESENTATION", "raceSpeedRatioState", "Same speed-ratio authority with time-gap evidence."),
  c(5, "findRaceLengthFromDistanceLead", "LEARNER_AUTHORITY", "raceLengthFromLeadEvidence", "Race length reconstructed from lead evidence."),
  c(6, "findRaceLengthFromTimeLead", "MERGED_REPRESENTATION", "raceLengthFromLeadEvidence", "Same reconstruction authority with time-gap evidence."),
  c(7, "findWinnerTimeFromLead", "MERGED_REPRESENTATION", "finishTimeLeadState", "Finish-time state representation."),
  c(8, "findLoserTimeFromLead", "MERGED_REPRESENTATION", "finishTimeLeadState", "Finish-time state representation."),
  c(9, "findHeadStartForDeadHeat", "LEARNER_AUTHORITY", "deadHeatHandicapState", "Calibrate a fair start for simultaneous finish."),
  c(10, "findStartDelayForDeadHeat", "MERGED_REPRESENTATION", "deadHeatHandicapState", "Time-form dead-heat calibration."),
  c(11, "findDistanceHandicapForDeadHeat", "MERGED_REPRESENTATION", "deadHeatHandicapState", "Distance-form dead-heat calibration."),
  c(12, "findTimeHandicapForDeadHeat", "MERGED_REPRESENTATION", "deadHeatHandicapState", "Time-form dead-heat calibration."),
  c(13, "findSpeedHandicapForDeadHeat", "MERGED_REPRESENTATION", "deadHeatHandicapState", "Equivalent fair-race calibration."),
  c(14, "convertDistanceLeadToTimeLead", "LEARNER_AUTHORITY", "leadConversionState", "Convert one finish-margin representation to another."),
  c(15, "convertTimeLeadToDistanceLead", "MERGED_REPRESENTATION", "leadConversionState", "Reverse conversion under the same finish state."),
  c(16, "findAversusCLeadFromAversusBAndBversusC", "LEARNER_AUTHORITY", "transitiveRaceComparison", "Compose two pairwise race ratios."),
  c(17, "findThreeRunnerFinishOrder", "MERGED_REPRESENTATION", "transitiveRaceComparison", "Ordering representation of transitive comparison."),
  c(18, "findThreeRunnerFinishGaps", "MERGED_REPRESENTATION", "transitiveRaceComparison", "Gap representation of transitive comparison."),
  c(19, "findDeadHeatCalibration", "MERGED_REPRESENTATION", "deadHeatHandicapState", "General dead-heat wording."),
  c(20, "findTwoStageRaceComparison", "LEARNER_AUTHORITY", "multiOutcomeRaceComparison", "A prior race establishes a ratio used in a second handicapped race."),
  c(21, "findRaceOutcomeAfterSpeedChange", "LEARNER_AUTHORITY", "changedRaceOutcomeState", "Recompute finish margin after a declared state change."),
  c(22, "findRaceOutcomeAfterRest", "MERGED_REPRESENTATION", "changedRaceOutcomeState", "Rest is an explicit state-change representation."),
  c(23, "findRaceOutcomeWithStaggeredStarts", "MERGED_REPRESENTATION", "changedRaceOutcomeState", "Staggered start is an explicit state-change representation."),
  c(24, "findTrackLengthFromFinishGap", "MERGED_REPRESENTATION", "raceLengthFromLeadEvidence", "Race length is the declared track length in this representation."),
  c(25, "findRunnerSpeedFromTwoRaceOutcomes", "LEARNER_AUTHORITY", "runnerStateFromTwoRaceOutcomes", "Two independent race outcomes identify an absolute runner speed."),
  c(26, "findChangedLeadAfterRaceLengthChange", "MERGED_REPRESENTATION", "multiOutcomeRaceComparison", "Second-race distance changes while the established speed ratio persists."),
  c(27, "findChangedLeadAfterSpeedChange", "MERGED_REPRESENTATION", "changedRaceOutcomeState", "Changed-speed margin representation."),
  c(28, "findWinnerMarginAsPercent", "MERGED_REPRESENTATION", "finishDistanceLeadState", "Percentage is presentation of the same finish-distance margin, not a new QL."),
  c(29, "findAnimalLeapSpeedRatio", "MERGED_REPRESENTATION", "raceSpeedRatioState", "Leap/animal wording does not change race speed-ratio mathematics."),
  c(30, "findRelayLegTimeOrDistance", "CROSS_CHECKPOINT_HOLD", undefined, "Multi-leg relay synthesis is owned by CP012 unless one earlier race authority alone is essential."),
  c(31, "detectImpossibleRaceLeadState", "INTERNAL_QA", undefined, "Validation mode, not a learner authority."),
  c(32, "classifyRaceStateAsPossibleUniqueOrMultiple", "INTERNAL_QA", undefined, "State-classification QA mode."),
  c(33, "verifyRaceClaim", "INTERNAL_QA", undefined, "Independent verification mode."),
  c(34, "solveRaceDataSufficiency", "INTERNAL_QA", undefined, "Data-sufficiency representation is added only after ordinary authority proof."),
]);

export const TSD_CP010_SOURCE_SATURATION_SUMMARY = Object.freeze({
  sourceCandidates: TSD_CP010_SOURCE_SATURATION.length,
  learnerAuthorities: TSD_CP010_SOURCE_SATURATION.filter((x) => x.disposition === "LEARNER_AUTHORITY").length,
  mergedRepresentations: TSD_CP010_SOURCE_SATURATION.filter((x) => x.disposition === "MERGED_REPRESENTATION").length,
  crossCheckpointHolds: TSD_CP010_SOURCE_SATURATION.filter((x) => x.disposition === "CROSS_CHECKPOINT_HOLD").length,
  internalQaModes: TSD_CP010_SOURCE_SATURATION.filter((x) => x.disposition === "INTERNAL_QA").length,
  nextPermanentQl: "TSD-QL-115",
  ownership: "DECLARED_RACE_DISTANCE_WITH_LEAD_HANDICAP_DEAD_HEAT_OR_COMPARATIVE_FINISH_TARGET",
});