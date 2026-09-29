import { SYL_PUNJAB_SOURCE_LEDGER_SUMMARY_V1 } from "./source-question-ledger-v1";

export const SYL_SSC_PROFILE_BOUNDARY_V1 = Object.freeze({
  authorityId: "SYL_001_SSC_PROFILE_BOUNDARY_V1",
  profile: "SSC" as const,
  activeMockFamilies: Object.freeze([
    "SSC_TWO_CONCLUSION_FOUR_OPTION",
    "SSC_SINGLE_DEFINITE_SELECTION",
    "SSC_COMPLEMENTARY_PAIR",
  ] as const),
  adaptedPracticeFamilies: Object.freeze([
    "SSC_THREE_CONCLUSION_ADVANCED",
  ] as const),
  adaptedPracticeMockWeight: 0 as const,
  directSscThreeConclusionSourceFrozen: false as const,
  rule:
    "Three-conclusion material may remain available as labelled cross-exam adapted practice, but it must not receive SSC mock weight until direct recurring SSC evidence is frozen.",
});

export const SYL_PUNJAB_PROFILE_BOUNDARY_V1 = Object.freeze({
  authorityId: "SYL_001_PUNJAB_PROFILE_BOUNDARY_V1",
  supportedExamFamily: "PUNJAB_POLICE_CONSTABLE" as const,
  sourceLedgerAuthority: SYL_PUNJAB_SOURCE_LEDGER_SUMMARY_V1.authorityId,
  sourceQuestionCount: SYL_PUNJAB_SOURCE_LEDGER_SUMMARY_V1.questionCount,
  sourceYears: SYL_PUNJAB_SOURCE_LEDGER_SUMMARY_V1.examYears,
  provenanceStatus: SYL_PUNJAB_SOURCE_LEDGER_SUMMARY_V1.status,
  supportedTaskFamilies: Object.freeze([
    "PUNJAB_POLICE_TWO_CONCLUSION_FOUR_OPTION",
    "PUNJAB_POLICE_THREE_CONCLUSION_FOUR_OPTION",
  ] as const),
  statewidePunjabGeneralizationPermitted: false as const,
  psssbGeneralizationPermitted: false as const,
  patwariGeneralizationPermitted: false as const,
  policeSiGeneralizationPermitted: false as const,
  exactHistoricalFrequencyClaimPermitted: false as const,
  rule:
    "The current 12-question secondary official-paper-tagged ledger supports a provisional Punjab Police Constable task-shape profile only. It must not be presented as a statewide Punjab syllogism frequency model.",
});

export const SYL_PROFILE_BOUNDARY_V1 = Object.freeze({
  authorityId: "SYL_001_PROFILE_BOUNDARY_V1",
  ssc: SYL_SSC_PROFILE_BOUNDARY_V1,
  punjab: SYL_PUNJAB_PROFILE_BOUNDARY_V1,
  changesProductionPlanner: false as const,
  changesQuestionStudio: false as const,
  changesMockEligibility: false as const,
  activationPermitted: false as const,
});
