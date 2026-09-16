const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const S = "DIGITAL-SANSAD-LEGISLATION-INTRO";
const R = "LOK-SABHA-RULES-2024";
const F = "DIGITAL-SANSAD-LOK-SABHA-FAQ";

const src = (sourceFactId: string, sourceIds: readonly string[] = [C]) => ({ sourceIds, sourceFactIds: [sourceFactId] as const });

export const POL_CP011_ARTICLE_MAP_V1 = Object.freeze([
  { article: "107", subject: "Introduction, passing and lapse of Bills", ...src("pol-cp011-art107") },
  { article: "108", subject: "Joint sitting of both Houses in certain cases", ...src("pol-cp011-art108") },
  { article: "109", subject: "Special procedure for Money Bills", ...src("pol-cp011-art109") },
  { article: "110", subject: "Definition and certification of Money Bills", ...src("pol-cp011-art110") },
  { article: "111", subject: "President's assent to Bills", ...src("pol-cp011-art111") },
  { article: "112", subject: "Annual Financial Statement", ...src("pol-cp011-art112") },
  { article: "113", subject: "Parliamentary procedure on estimates and demands for grants", ...src("pol-cp011-art113") },
  { article: "114", subject: "Appropriation Bills", ...src("pol-cp011-art114") },
  { article: "115", subject: "Supplementary, additional and excess grants", ...src("pol-cp011-art115") },
  { article: "116", subject: "Vote on account, vote of credit and exceptional grant", ...src("pol-cp011-art116") },
  { article: "117", subject: "Special provisions for financial Bills", ...src("pol-cp011-art117") },
]);

export const POL_CP011_ORDINARY_BILL_V1 = Object.freeze({
  ordinaryOrigin: "Subject to Money/financial Bill rules, a Bill may originate in either House.",
  bothHouses: "A Bill normally must be agreed to by both Houses in the same form.",
  prorogation: "A Bill pending in Parliament does not lapse because the Houses are prorogued.",
  rajyaPending: "A Bill pending in Rajya Sabha that has not been passed by Lok Sabha does not lapse when Lok Sabha is dissolved.",
  lokPending: "A Bill pending in Lok Sabha, or passed by Lok Sabha and pending in Rajya Sabha, lapses on dissolution of Lok Sabha, subject to Article 108.",
  ...src("pol-cp011-ordinary-bills"),
});

export const POL_CP011_JOINT_SITTING_V1 = Object.freeze({
  triggers: ["Rejection by the other House", "Final disagreement on amendments", "More than six months without passage by the other House"],
  exclusions: ["Money Bill", "Constitution Amendment Bill"],
  sixMonthCounting: "Periods when the receiving House is prorogued or adjourned for more than four consecutive days are excluded from the six-month count.",
  passage: "At a joint sitting, the Bill is passed by a majority of the total number of members of both Houses present and voting.",
  presiding: "The Speaker of Lok Sabha presides over a joint sitting of the two Houses.",
  sourceIds: [C, S, F] as const,
  sourceFactIds: ["pol-cp011-joint-sitting"] as const,
});

export const POL_CP011_MONEY_BILL_V1 = Object.freeze({
  origin: "A Money Bill cannot be introduced in Rajya Sabha; it originates in Lok Sabha.",
  rajyaRole: "Rajya Sabha may recommend changes but Lok Sabha may accept or reject any recommendation.",
  returnPeriod: "Rajya Sabha has fourteen days from receipt to return a Money Bill.",
  notReturned: "If not returned within fourteen days, the Money Bill is deemed passed in the Lok Sabha form.",
  onlyRule: "A Money Bill must contain only provisions dealing with Article 110(1) matters or matters incidental to them.",
  includedMatters: [
    "Taxation by the Union",
    "Government of India borrowing or guarantees",
    "Custody or withdrawal of money from the Consolidated Fund or Contingency Fund of India",
    "Appropriation from the Consolidated Fund of India",
    "Declaring or increasing charged expenditure",
    "Receipt, custody or issue of money in the Consolidated Fund or Public Account and audit matters",
    "Matters incidental to the listed subjects",
  ],
  exclusions: ["Fines or pecuniary penalties alone", "Licence or service fees alone", "Local authority taxes for local purposes alone"],
  certification: "If a question arises whether a Bill is a Money Bill, the Speaker of Lok Sabha decides; every Money Bill carries the Speaker's certificate when sent to Rajya Sabha and the President.",
  ...src("pol-cp011-money-bill"),
});

export const POL_CP011_ASSENT_V1 = Object.freeze({
  options: "After passage by Parliament, the President may assent or withhold assent.",
  return: "The President may return a Bill for reconsideration if it is not a Money Bill.",
  repassed: "If a returned Bill is passed again and presented, the President cannot withhold assent.",
  moneyBillReturn: "A Money Bill cannot be returned by the President for reconsideration.",
  ...src("pol-cp011-assent"),
});

export const POL_CP011_BILL_STAGES_V1 = Object.freeze({
  governmentBill: "A Bill introduced by a Minister is a Government Bill.",
  privateMemberBill: "A Bill introduced by a member other than a Minister is a Private Member's Bill.",
  readings: "A Bill ordinarily undergoes three readings in each House before presidential assent.",
  firstReading: "First Reading covers introduction or laying of a Bill passed by the other House.",
  secondReading: "Second Reading includes general consideration and detailed clause-by-clause consideration.",
  thirdReading: "Third Reading is the stage at which the motion that the Bill be passed is considered.",
  sourceIds: [S] as const,
  sourceFactIds: ["pol-cp011-bill-stages"] as const,
});

export const POL_CP011_FINANCIAL_STATEMENT_V1 = Object.freeze({
  annualStatement: "The President causes the Annual Financial Statement to be laid before both Houses for every financial year.",
  contents: "It shows estimated receipts and expenditure and separates charged expenditure from other expenditure, while distinguishing revenue from other expenditure.",
  chargedExamples: ["President's emoluments and office expenditure", "Salaries and allowances of parliamentary presiding officers", "Union debt charges", "Supreme Court judges' salaries, allowances and pensions", "Comptroller and Auditor-General's salary, allowances and pension", "Sums required to satisfy court or arbitral awards"],
  ...src("pol-cp011-annual-financial-statement"),
});

export const POL_CP011_DEMANDS_GRANTS_V1 = Object.freeze({
  chargedVote: "Charged expenditure is not submitted to a vote, though it may be discussed in either House.",
  otherExpenditure: "Other expenditure is submitted as demands for grants to Lok Sabha.",
  lokSabhaPower: "Lok Sabha may assent, refuse, or assent subject to a reduction in a demand for grant.",
  recommendation: "No demand for a grant may be made except on the President's recommendation.",
  ...src("pol-cp011-demands-grants"),
});

export const POL_CP011_APPROPRIATION_V1 = Object.freeze({
  purpose: "After grants are made, an Appropriation Bill authorises withdrawal from the Consolidated Fund of India for voted grants and charged expenditure.",
  amendmentLimit: "An amendment cannot vary the amount or destination of a grant or vary charged expenditure; the presiding officer's decision on admissibility is final.",
  withdrawalRule: "Subject to Articles 115 and 116, money cannot be withdrawn from the Consolidated Fund of India without appropriation made by law.",
  ...src("pol-cp011-appropriation"),
});

export const POL_CP011_EXTRA_GRANTS_V1 = Object.freeze({
  supplementary: "Used when the amount authorised for a service is insufficient during the current financial year.",
  additional: "Used when a new service not contemplated in the Annual Financial Statement needs expenditure during the year.",
  excess: "Used when money has already been spent on a service beyond the amount granted for that service and year.",
  ...src("pol-cp011-extra-grants"),
});

export const POL_CP011_SPECIAL_GRANTS_V1 = Object.freeze({
  voteOnAccount: "An advance grant for part of a financial year pending completion of the normal grant and appropriation procedure.",
  voteOfCredit: "A grant for an unexpected demand whose magnitude or indefinite character prevents ordinary detailed presentation.",
  exceptionalGrant: "A grant for a purpose that forms no part of the current service of any financial year.",
  ...src("pol-cp011-special-grants"),
});

export const POL_CP011_CUT_MOTIONS_V1 = Object.freeze({
  policyCut: "Disapproval of Policy Cut reduces a demand to Re. 1 and challenges the policy behind the demand.",
  economyCut: "Economy Cut reduces a demand by a specified amount to show where economy can be effected.",
  tokenCut: "Token Cut reduces a demand by Rs. 100 to raise a specific grievance within Union government responsibility.",
  guillotine: "At the fixed time on the last allotted day, the Speaker puts all outstanding demands for grants to vote for disposal.",
  sourceIds: [R] as const,
  sourceFactIds: ["pol-cp011-cut-motions"] as const,
});

export const POL_CP011_FINANCIAL_BILLS_V1 = Object.freeze({
  article117_1: "A Bill or amendment containing Article 110(1)(a)-(f) matters requires the President's recommendation; a Bill containing such provision cannot be introduced in Rajya Sabha.",
  taxReductionException: "President's recommendation is not required merely to move an amendment reducing or abolishing a tax.",
  article117_3: "A Bill that would involve expenditure from the Consolidated Fund of India cannot be passed by either House unless the President recommended its consideration to that House.",
  ...src("pol-cp011-financial-bills"),
});
