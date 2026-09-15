export type EcoCp013Fact = {
  id: string;
  label: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};

export const ECO_CP013_FACTS_V1: EcoCp013Fact[] = [
  {
    id: "afs-article-112",
    label: "Annual Financial Statement",
    explanation: "Article 112 requires the President to cause a statement of the estimated receipts and expenditure of the Government of India for each financial year to be laid before both Houses of Parliament.",
    sourceIds: ["CONST-ART-112-117", "MOF-KEY-BUDGET-DOCS-2026"],
    sourceFactIds: ["article-112-afs", "afs-estimated-receipts-expenditure"],
  },
  {
    id: "cfi",
    label: "Consolidated Fund of India",
    explanation: "Under Article 266, Government revenues, loans raised and recoveries of loans form the Consolidated Fund of India; money cannot be withdrawn from it without parliamentary authorisation as required by law.",
    sourceIds: ["CONST-ART-266-267", "MOF-KEY-BUDGET-DOCS-2026"],
    sourceFactIds: ["article-266-cfi", "cfi-parliament-authorisation"],
  },
  {
    id: "contingency-fund",
    label: "Contingency Fund of India",
    explanation: "Article 267 provides for the Contingency Fund, an imprest placed at the disposal of the President for urgent unforeseen expenditure pending parliamentary authorisation.",
    sourceIds: ["CONST-ART-266-267", "MOF-KEY-BUDGET-DOCS-2026"],
    sourceFactIds: ["article-267-contingency", "urgent-unforeseen-expenditure"],
  },
  {
    id: "public-account",
    label: "Public Account of India",
    explanation: "Under Article 266(2), moneys held by Government in trust, such as provident funds and small savings, are kept in the Public Account; these funds do not belong to Government in the same sense as Consolidated Fund receipts.",
    sourceIds: ["CONST-ART-266-267", "MOF-KEY-BUDGET-DOCS-2026"],
    sourceFactIds: ["article-266-public-account", "public-account-trust-money"],
  },
  {
    id: "charged-expenditure",
    label: "Charged expenditure",
    explanation: "Expenditure charged on the Consolidated Fund is not submitted to the vote of Parliament, though it may be discussed.",
    sourceIds: ["CONST-ART-112-117", "MOF-KEY-BUDGET-DOCS-2026"],
    sourceFactIds: ["article-113-charged-not-voted"],
  },
  {
    id: "voted-expenditure",
    label: "Voted expenditure",
    explanation: "Expenditure other than charged expenditure is submitted to the Lok Sabha in the form of Demands for Grants for voting.",
    sourceIds: ["CONST-ART-112-117", "MOF-KEY-BUDGET-DOCS-2026"],
    sourceFactIds: ["article-113-demands-for-grants"],
  },
  {
    id: "demands-for-grants",
    label: "Demands for Grants",
    explanation: "Article 113 requires expenditure that must be voted to be submitted as Demands for Grants to the House of the People; a demand can be made only on the recommendation of the President.",
    sourceIds: ["CONST-ART-112-117", "MOF-KEY-BUDGET-DOCS-2026"],
    sourceFactIds: ["article-113-lok-sabha", "president-recommendation-demand"],
  },
  {
    id: "appropriation-bill",
    label: "Appropriation Bill",
    explanation: "Article 114 provides for an Appropriation Bill after grants are made, authorising withdrawal from the Consolidated Fund for voted grants and charged expenditure.",
    sourceIds: ["CONST-ART-112-117"],
    sourceFactIds: ["article-114-appropriation"],
  },
  {
    id: "finance-bill",
    label: "Finance Bill",
    explanation: "The Finance Bill presented with the Budget contains proposals for the imposition, abolition, remission, alteration or regulation of taxes and is a Money Bill under Article 110.",
    sourceIds: ["CONST-ART-112-117", "MOF-KEY-BUDGET-DOCS-2026"],
    sourceFactIds: ["article-110-finance-bill", "finance-bill-tax-proposals"],
  },
  {
    id: "supplementary-grant",
    label: "Supplementary or additional grant",
    explanation: "Article 115 covers supplementary or additional expenditure when the amount authorised for a service is insufficient or a new service needs expenditure during the year.",
    sourceIds: ["CONST-ART-112-117"],
    sourceFactIds: ["article-115-supplementary-additional"],
  },
  {
    id: "excess-grant",
    label: "Excess grant",
    explanation: "An excess grant is required when money has already been spent on a service beyond the amount granted for that service and financial year.",
    sourceIds: ["CONST-ART-112-117"],
    sourceFactIds: ["article-115-excess"],
  },
  {
    id: "vote-on-account",
    label: "Vote on Account",
    explanation: "Article 116 allows a grant in advance for estimated expenditure for part of a financial year while the normal voting and appropriation procedure is still being completed.",
    sourceIds: ["CONST-ART-112-117"],
    sourceFactIds: ["article-116-vote-on-account"],
  },
  {
    id: "vote-of-credit",
    label: "Vote of Credit",
    explanation: "A Vote of Credit is for an unexpected demand on India's resources when the magnitude or indefinite character of the service prevents normal detailed estimation.",
    sourceIds: ["CONST-ART-112-117"],
    sourceFactIds: ["article-116-vote-of-credit"],
  },
  {
    id: "exceptional-grant",
    label: "Exceptional Grant",
    explanation: "An Exceptional Grant is for a purpose that forms no part of the current service of any financial year.",
    sourceIds: ["CONST-ART-112-117"],
    sourceFactIds: ["article-116-exceptional-grant"],
  },
  {
    id: "expenditure-budget",
    label: "Expenditure Budget",
    explanation: "The Expenditure Budget brings together scheme and programme expenditure estimates and presents them under revenue and capital heads with explanatory notes.",
    sourceIds: ["MOF-KEY-BUDGET-DOCS-2026"],
    sourceFactIds: ["expenditure-budget-document"],
  },
  {
    id: "receipt-budget",
    label: "Receipt Budget",
    explanation: "The Receipt Budget gives details of tax, non-tax and capital receipts included in the Annual Financial Statement, along with related liabilities and receipt statements.",
    sourceIds: ["MOF-KEY-BUDGET-DOCS-2026"],
    sourceFactIds: ["receipt-budget-document"],
  },
  {
    id: "expenditure-profile",
    label: "Expenditure Profile",
    explanation: "The Expenditure Profile aggregates and analyses different types of expenditure across Demands for Grants and contains cross-cutting expenditure statements.",
    sourceIds: ["MOF-KEY-BUDGET-DOCS-2026"],
    sourceFactIds: ["expenditure-profile-document"],
  },
  {
    id: "budget-at-glance",
    label: "Budget at a Glance",
    explanation: "Budget at a Glance gives a concise overview of receipts, disbursements, transfers and major deficit indicators.",
    sourceIds: ["MOF-KEY-BUDGET-DOCS-2026"],
    sourceFactIds: ["budget-at-glance-document"],
  },
];

export function ecoCp013Fact(id: string): EcoCp013Fact {
  const fact = ECO_CP013_FACTS_V1.find((row) => row.id === id);
  if (!fact) throw new Error(`Unknown ECO-CP-013 fact: ${id}`);
  return fact;
}
