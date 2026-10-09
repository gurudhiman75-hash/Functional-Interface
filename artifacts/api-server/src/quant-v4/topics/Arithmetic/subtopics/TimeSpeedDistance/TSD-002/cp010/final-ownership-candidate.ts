import type { TsdCp010AuthorityKey } from "./source-saturation";

export type TsdCp010OwnershipCandidate = Readonly<{
  authorityKey: TsdCp010AuthorityKey;
  learnerContract: string;
  representations: readonly string[];
}>;

export const TSD_CP010_FINAL_OWNERSHIP_CANDIDATE: readonly TsdCp010OwnershipCandidate[] = Object.freeze([
  {
    authorityKey: "finishDistanceLeadState",
    learnerContract: "Find the losing competitor's unfinished distance when the winner reaches the declared finish.",
    representations: [
      "standard runner race with both starting together",
      "horse/cycle/swimmer race with a stated distance lead",
      "lead scaled to a different race length with unchanged speeds",
      "finish margin requested as a fraction or percent of race distance",
      "table or compact comparison giving race distance and speeds",
    ],
  },
  {
    authorityKey: "finishTimeLeadState",
    learnerContract: "Find the time gap between competitors reaching the same declared finish.",
    representations: [
      "direct race distance and two speeds",
      "winner time plus loser speed/distance state",
      "loser time plus winner speed/distance state",
      "finish clock-time comparison with simultaneous start",
    ],
  },
  {
    authorityKey: "raceSpeedRatioState",
    learnerContract: "Infer the competitors' speed ratio from a race finish outcome.",
    representations: [
      "A beats B by a stated distance in an equal-distance race",
      "A beats B by a stated time with one finish time supplied",
      "animal/leap race wording with equivalent constant speeds",
      "ratio asked in simplified p:q form",
      "reverse check of a proposed speed ratio against a finish lead",
    ],
  },
  {
    authorityKey: "raceLengthFromLeadEvidence",
    learnerContract: "Reconstruct the declared race length from speeds and finish-gap evidence.",
    representations: [
      "distance lead plus two speeds",
      "time lead plus two speeds",
      "track length hidden behind a finish-gap statement",
      "race length inferred from winner time and lead evidence",
    ],
  },
  {
    authorityKey: "deadHeatHandicapState",
    learnerContract: "Calibrate a head start, distance handicap or time delay so unequal competitors finish together.",
    representations: [
      "slower competitor receives a head start",
      "faster competitor starts after a delay",
      "distance handicap stated as metres from the finish",
      "time handicap stated as seconds",
      "dead-heat calibration checked against original race lead",
      "fair-start comparison among two racers",
    ],
  },
  {
    authorityKey: "leadConversionState",
    learnerContract: "Convert between distance lead and time lead for the same finish state.",
    representations: [
      "distance lead converted to time using losing speed",
      "time lead converted to distance using losing speed",
      "finish-gap conversion embedded in a race report",
      "two equivalent margin statements compared for consistency",
    ],
  },
  {
    authorityKey: "transitiveRaceComparison",
    learnerContract: "Compose pairwise race outcomes to infer a third competitor comparison.",
    representations: [
      "A beats B and B beats C over the same race distance",
      "find A-versus-C distance lead",
      "rank three runners from pairwise finish statements",
      "find all three finish positions when A finishes",
      "compare two proposed transitive race conclusions",
    ],
  },
  {
    authorityKey: "multiOutcomeRaceComparison",
    learnerContract: "Use one race outcome to establish a speed ratio, then apply it to a second race or handicap.",
    representations: [
      "first race gives a lead; second race has a different length",
      "first race gives a lead; slower racer receives a second-race head start",
      "two-stage race report with unchanged competitor speeds",
      "changed race distance plus declared handicap",
      "second-race dead-heat threshold compared with an actual handicap",
    ],
  },
  {
    authorityKey: "changedRaceOutcomeState",
    learnerContract: "Recompute the finish margin after an explicit speed, rest or start-time change.",
    representations: [
      "winner changes speed for the entire new race",
      "slower racer rests for a stated interval",
      "faster racer starts after a stated delay but still wins",
      "changed lead after one competitor's speed changes",
      "compare original and changed finish margins",
    ],
  },
  {
    authorityKey: "runnerStateFromTwoRaceOutcomes",
    learnerContract: "Use two independent race outcomes to recover an absolute competitor speed.",
    representations: [
      "one race gives distance lead and another gives time lead",
      "two race lengths with unchanged competitor speeds",
      "recover faster speed from ratio evidence plus absolute time evidence",
      "recover slower speed then infer faster speed",
      "cross-check reconstructed speeds against both race reports",
    ],
  },
]);

export const TSD_CP010_REPRESENTATION_SUMMARY = Object.freeze({
  authorities: TSD_CP010_FINAL_OWNERSHIP_CANDIDATE.length,
  minimumRepresentationsPerAuthority: Math.min(...TSD_CP010_FINAL_OWNERSHIP_CANDIDATE.map((x) => x.representations.length)),
  totalRepresentationDescriptions: TSD_CP010_FINAL_OWNERSHIP_CANDIDATE.reduce((sum, x) => sum + x.representations.length, 0),
  permanentQlAllocation: "PENDING_EXECUTABLE_PROOF",
});