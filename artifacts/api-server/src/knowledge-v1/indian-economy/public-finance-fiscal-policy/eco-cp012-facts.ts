export type EcoCp012Fact = {
  id: string;
  label: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};

export const ECO_CP012_FACTS_V1: EcoCp012Fact[] = [
  {
    id: "public-finance",
    label: "Public finance",
    explanation: "Public finance studies Government revenue, expenditure, borrowing and their economic effects.",
    sourceIds: ["NCERT-GOVT-BUDGET"],
    sourceFactIds: ["public-finance-scope"],
  },
  {
    id: "fiscal-policy",
    label: "Fiscal policy",
    explanation: "Fiscal policy uses Government taxation, expenditure and borrowing to influence economic activity and public finances.",
    sourceIds: ["NCERT-GOVT-BUDGET"],
    sourceFactIds: ["fiscal-policy-concept"],
  },
  {
    id: "expansionary-fiscal",
    label: "Expansionary fiscal policy",
    explanation: "Expansionary fiscal policy generally raises Government spending or lowers taxes to support aggregate demand and economic activity.",
    sourceIds: ["NCERT-GOVT-BUDGET"],
    sourceFactIds: ["expansionary-direction"],
  },
  {
    id: "contractionary-fiscal",
    label: "Contractionary fiscal policy",
    explanation: "Contractionary fiscal policy generally reduces Government spending or raises taxes to moderate aggregate demand and inflationary pressure.",
    sourceIds: ["NCERT-GOVT-BUDGET"],
    sourceFactIds: ["contractionary-direction"],
  },
  {
    id: "revenue-receipt",
    label: "Revenue receipt",
    explanation: "Revenue receipts do not create a liability for Government and do not reduce its assets; tax and non-tax revenues are the main categories.",
    sourceIds: ["NCERT-GOVT-BUDGET", "GOI-KEY-BUDGET"],
    sourceFactIds: ["revenue-receipts", "tax-nontax"],
  },
  {
    id: "capital-receipt",
    label: "Capital receipt",
    explanation: "Capital receipts either create a liability or reduce Government financial assets, such as borrowings, loan recoveries or disinvestment receipts.",
    sourceIds: ["NCERT-GOVT-BUDGET", "GOI-KEY-BUDGET"],
    sourceFactIds: ["capital-receipts"],
  },
  {
    id: "debt-capital-receipt",
    label: "Debt-creating capital receipt",
    explanation: "Government borrowing is a debt-creating capital receipt because it creates a future repayment liability.",
    sourceIds: ["GOI-KEY-BUDGET"],
    sourceFactIds: ["borrowings-capital-receipt"],
  },
  {
    id: "nondebt-capital-receipt",
    label: "Non-debt capital receipt",
    explanation: "Loan recoveries and disinvestment are non-debt capital receipts because they do not create fresh borrowing liabilities.",
    sourceIds: ["NCERT-GOVT-BUDGET", "GOI-KEY-BUDGET"],
    sourceFactIds: ["nondebt-capital-receipts"],
  },
  {
    id: "revenue-expenditure",
    label: "Revenue expenditure",
    explanation: "Revenue expenditure broadly covers normal Government operations, services, interest payments and subsidies and does not directly create Government assets.",
    sourceIds: ["GOI-KEY-BUDGET", "NCERT-GOVT-BUDGET"],
    sourceFactIds: ["revenue-expenditure"],
  },
  {
    id: "capital-expenditure",
    label: "Capital expenditure",
    explanation: "Capital expenditure creates assets or reduces liabilities, such as spending on infrastructure, machinery or loans and advances.",
    sourceIds: ["GOI-KEY-BUDGET", "NCERT-GOVT-BUDGET"],
    sourceFactIds: ["capital-expenditure"],
  },
  {
    id: "revenue-deficit",
    label: "Revenue deficit",
    explanation: "Revenue deficit equals revenue expenditure minus revenue receipts. It shows that current revenue is insufficient to meet current expenditure.",
    sourceIds: ["GOI-BUDGET-EXPLANATORY", "FRBM-ACT"],
    sourceFactIds: ["revenue-deficit-formula"],
  },
  {
    id: "fiscal-deficit",
    label: "Fiscal deficit",
    explanation: "Fiscal deficit equals total expenditure minus total non-debt receipts and indicates the Government's overall borrowing requirement.",
    sourceIds: ["GOI-BUDGET-EXPLANATORY", "FRBM-ACT"],
    sourceFactIds: ["fiscal-deficit-formula", "borrowing-requirement"],
  },
  {
    id: "primary-deficit",
    label: "Primary deficit",
    explanation: "Primary deficit equals fiscal deficit minus interest payments and isolates the current-period deficit excluding interest on past debt.",
    sourceIds: ["GOI-BUDGET-EXPLANATORY"],
    sourceFactIds: ["primary-deficit-formula"],
  },
  {
    id: "public-debt",
    label: "Public debt",
    explanation: "Public debt is the accumulated borrowing liability of Government; interest payments on that debt affect future budgets.",
    sourceIds: ["NCERT-GOVT-BUDGET", "FRBM-ACT"],
    sourceFactIds: ["public-debt", "interest-burden"],
  },
  {
    id: "frbm",
    label: "FRBM Act, 2003",
    explanation: "The FRBM framework promotes fiscal discipline, debt and deficit sustainability, transparency and medium-term fiscal management.",
    sourceIds: ["FRBM-ACT"],
    sourceFactIds: ["frbm-purpose", "fiscal-transparency"],
  },
  {
    id: "automatic-stabiliser",
    label: "Automatic stabiliser",
    explanation: "Automatic stabilisers work without a new discretionary policy decision, for example tax collections falling and some transfers rising during a slowdown.",
    sourceIds: ["NCERT-GOVT-BUDGET"],
    sourceFactIds: ["automatic-stabiliser"],
  },
];

export function ecoCp012Fact(id: string): EcoCp012Fact {
  const fact = ECO_CP012_FACTS_V1.find((row) => row.id === id);
  if (!fact) throw new Error(`Unknown ECO-CP-012 fact: ${id}`);
  return fact;
}
