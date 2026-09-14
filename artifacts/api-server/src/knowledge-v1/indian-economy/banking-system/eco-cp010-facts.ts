export type EcoCp010Fact = {
  id: string;
  label: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};

export const ECO_CP010_FACTS_V1: EcoCp010Fact[] = [
  {
    id: "scheduled-bank",
    label: "Scheduled bank",
    explanation: "A scheduled bank is included in the Second Schedule of the RBI Act, 1934.",
    sourceIds: ["RBI-SCHEDULED-BANK"],
    sourceFactIds: ["scheduled-bank-definition"],
  },
  {
    id: "intermediation",
    label: "Financial intermediation",
    explanation: "Banks collect deposits from savers and extend loans or advances to borrowers, linking surplus and deficit units.",
    sourceIds: ["RBI-SCHEDULED-BANK"],
    sourceFactIds: ["banking-function"],
  },
  {
    id: "savings-deposit",
    label: "Savings deposit",
    explanation: "A savings deposit is designed mainly for household saving with withdrawal access subject to account rules.",
    sourceIds: ["DICGC-FAQ"],
    sourceFactIds: ["insured-deposit-types"],
  },
  {
    id: "current-deposit",
    label: "Current deposit",
    explanation: "A current deposit is transaction-oriented and generally suited to frequent business receipts and payments.",
    sourceIds: ["DICGC-FAQ"],
    sourceFactIds: ["insured-deposit-types"],
  },
  {
    id: "fixed-deposit",
    label: "Fixed deposit",
    explanation: "A fixed deposit places funds for a stated period rather than keeping them fully transaction-ready on demand.",
    sourceIds: ["DICGC-FAQ"],
    sourceFactIds: ["insured-deposit-types"],
  },
  {
    id: "recurring-deposit",
    label: "Recurring deposit",
    explanation: "A recurring deposit builds savings through regular instalments over a stated period.",
    sourceIds: ["DICGC-FAQ"],
    sourceFactIds: ["insured-deposit-types"],
  },
  {
    id: "rrb-origin",
    label: "RRB origin",
    explanation: "Regional Rural Banks were established in 1975, followed by the Regional Rural Banks Act, 1976.",
    sourceIds: ["NABARD-RRB"],
    sourceFactIds: ["rrb-1975", "rrb-act-1976"],
  },
  {
    id: "rrb-purpose",
    label: "RRB purpose",
    explanation: "RRBs were created to expand institutional credit and banking access in rural and agricultural areas.",
    sourceIds: ["NABARD-RRB"],
    sourceFactIds: ["rrb-purpose"],
  },
  {
    id: "coop-structure",
    label: "Short-term rural cooperative credit structure",
    explanation: "The structure has PACS at village level, District Central Cooperative Banks at middle level and State Cooperative Banks at apex level.",
    sourceIds: ["NABARD-COOP-STRUCTURE"],
    sourceFactIds: ["coop-three-tier"],
  },
  {
    id: "pacs-base",
    label: "PACS",
    explanation: "A Primary Agricultural Credit Society sits at the village/base level of the short-term rural cooperative credit structure.",
    sourceIds: ["NABARD-COOP-STRUCTURE"],
    sourceFactIds: ["pacs-level"],
  },
  {
    id: "dccb-middle",
    label: "District Central Cooperative Bank",
    explanation: "A District Central Cooperative Bank occupies the middle or district tier of the short-term rural cooperative credit structure.",
    sourceIds: ["NABARD-COOP-STRUCTURE"],
    sourceFactIds: ["dccb-level"],
  },
  {
    id: "stcb-apex",
    label: "State Cooperative Bank",
    explanation: "A State Cooperative Bank forms the apex State-level tier of the short-term rural cooperative credit structure.",
    sourceIds: ["NABARD-COOP-STRUCTURE"],
    sourceFactIds: ["stcb-level"],
  },
  {
    id: "sfb-purpose",
    label: "Small Finance Bank",
    explanation: "Small Finance Banks promote financial inclusion through savings services and credit to underserved borrowers such as small businesses and small/marginal farmers.",
    sourceIds: ["RBI-SFB-GUIDELINES"],
    sourceFactIds: ["sfb-objective", "sfb-lending"],
  },
  {
    id: "payments-bank",
    label: "Payments Bank",
    explanation: "Payments Banks can accept demand deposits and provide payment/remittance services but cannot undertake lending activities.",
    sourceIds: ["RBI-PB-GUIDELINES"],
    sourceFactIds: ["pb-demand-deposits", "pb-no-lending"],
  },
  {
    id: "secured-loan",
    label: "Secured loan",
    explanation: "A secured loan is backed by collateral that the lender can claim subject to the loan agreement and law if the borrower defaults.",
    sourceIds: ["RBI-NPA-IRAC"],
    sourceFactIds: ["secured-credit-concept"],
  },
  {
    id: "unsecured-loan",
    label: "Unsecured loan",
    explanation: "An unsecured loan is not backed by specific collateral and relies more heavily on borrower creditworthiness and contractual recovery rights.",
    sourceIds: ["RBI-NPA-IRAC"],
    sourceFactIds: ["unsecured-credit-concept"],
  },
  {
    id: "credit-creation",
    label: "Bank credit creation",
    explanation: "When a bank lends part of deposits while retaining required or desired reserves, the loan can return to the banking system as a new deposit and support multiple deposit expansion.",
    sourceIds: ["RBI-SCHEDULED-BANK"],
    sourceFactIds: ["bank-credit-creation"],
  },
  {
    id: "npa-basic",
    label: "Non-performing asset",
    explanation: "A bank asset becomes non-performing when it ceases to generate income; for an ordinary term loan, interest or principal overdue for more than 90 days triggers the standard NPA rule.",
    sourceIds: ["RBI-NPA-IRAC"],
    sourceFactIds: ["npa-income", "npa-90-days"],
  },
  {
    id: "psl",
    label: "Priority Sector Lending",
    explanation: "Priority Sector Lending directs bank credit toward sectors considered important for inclusive development, such as agriculture and MSMEs.",
    sourceIds: ["RBI-PSL"],
    sourceFactIds: ["psl-purpose", "psl-categories"],
  },
  {
    id: "dicgc",
    label: "DICGC deposit insurance",
    explanation: "DICGC insures eligible bank deposits such as savings, current, fixed and recurring deposits; accounts in the same right and same capacity at one bank are aggregated for insurance purposes.",
    sourceIds: ["DICGC-FAQ"],
    sourceFactIds: ["insured-deposit-types", "same-right-capacity"],
  },
];

export function ecoCp010Fact(id: string): EcoCp010Fact {
  const fact = ECO_CP010_FACTS_V1.find((row) => row.id === id);
  if (!fact) throw new Error(`Unknown ECO-CP-010 fact: ${id}`);
  return fact;
}
