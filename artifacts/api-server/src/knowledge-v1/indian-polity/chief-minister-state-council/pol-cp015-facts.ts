export const POL_CP015_FACTS = Object.freeze({
  article163: {
    councilWithCmAtHead: true,
    purpose: "aid and advise Governor",
    discretionException: "where the Constitution requires the Governor to act in discretion",
    adviceInquiryBar: "courts cannot inquire whether advice was tendered or what advice was tendered",
  },
  article164: {
    chiefMinisterAppointedBy: "Governor",
    otherMinistersAppointedBy: "Governor on the advice of the Chief Minister",
    ministersHoldOfficeDuringPleasureOf: "Governor",
    collectiveResponsibilityTo: "Legislative Assembly of the State",
    ministryMaximum: "15% of total membership of the Legislative Assembly",
    ministryMinimum: 12,
    nonMemberLimit: "six consecutive months",
    oathsAdministeredBy: "Governor",
    salariesDeterminedBy: "State Legislature by law",
    interimSalaryReference: "Second Schedule",
    tenthScheduleMinisterBar: true,
    tribalWelfareMinisterStates: ["Chhattisgarh", "Jharkhand", "Madhya Pradesh", "Odisha"],
  },
  article166: {
    executiveActionInNameOf: "Governor",
    authenticationRulesMadeBy: "Governor",
    transactionAndAllocationRulesMadeBy: "Governor",
  },
  article167: {
    communicateCouncilDecisions: true,
    communicateLegislativeProposals: true,
    furnishInformationCalledForByGovernor: true,
    submitIndividualMinisterDecisionToCouncilIfGovernorRequires: true,
  },
  article177: {
    ministerMaySpeakInAssembly: true,
    ministerMaySpeakInBothHousesInBicameralState: true,
    ministerMayTakePartInNamedCommittee: true,
    noVoteByVirtueOfArticle177Alone: true,
  },
} as const);
