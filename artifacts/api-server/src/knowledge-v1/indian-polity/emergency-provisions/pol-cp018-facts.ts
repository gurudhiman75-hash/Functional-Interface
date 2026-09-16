export const POL_CP018_FACTS = Object.freeze({
  nationalEmergency: {
    article: "352",
    grounds: ["war", "external aggression", "armed rebellion"],
    cabinetDecisionInWriting: true,
    initialParliamentApproval: "within one month",
    continuationUnit: "six months",
    approvalMajority: "majority of total membership plus at least two-thirds present and voting",
    lokSabhaDisapprovalNotice: "not less than one-tenth of total membership",
    specialSittingDeadline: "within fourteen days",
  },
  effects: {
    article353: "Union directions to States and expanded parliamentary law-making power",
    article354: "temporary modification of revenue-distribution provisions",
    article355: "Union duty to protect States and ensure constitutional government",
  },
  presidentsRule: {
    article: "356",
    initialParliamentApproval: "within two months",
    continuationUnit: "six months",
    maximumOrdinaryDuration: "three years",
    beyondOneYearConditions: ["National Emergency in operation in whole or relevant part", "Election Commission certification of election difficulty"],
    highCourtProtection: true,
  },
  rights: {
    article358: "Article 19 affected only during Emergency based on war or external aggression",
    article359: "President may suspend court enforcement of specified Part III rights except Articles 20 and 21",
  },
  financialEmergency: {
    article: "360",
    trigger: "financial stability or credit of India or any part is threatened",
    initialParliamentApproval: "within two months",
    directionsMayInclude: ["financial propriety", "salary and allowance reductions", "reservation of specified State financial Bills for President"],
  },
} as const);
