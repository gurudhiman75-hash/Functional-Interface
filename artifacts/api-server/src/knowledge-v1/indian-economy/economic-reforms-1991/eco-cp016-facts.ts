export type EcoCp016Fact = {
  id: string;
  label: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};

export const ECO_CP016_FACTS_V1: EcoCp016Fact[] = [
  {
    id: "bop-crisis-1991",
    label: "1991 balance-of-payments crisis",
    explanation: "A severe balance-of-payments crisis in 1991 was the immediate backdrop to India's major economic reform programme.",
    sourceIds: ["RBI-1991-CRISIS-REFORMS", "NCERT-LPG-REFORMS"],
    sourceFactIds: ["1991-bop-crisis", "reform-background"],
  },
  {
    id: "macroeconomic-imbalances",
    label: "Macroeconomic imbalances before reforms",
    explanation: "Large fiscal and external imbalances, together with adverse external shocks, weakened India's external position before the 1991 crisis.",
    sourceIds: ["RBI-1991-CRISIS-REFORMS"],
    sourceFactIds: ["fiscal-external-imbalances", "external-shocks"],
  },
  {
    id: "lpg-framework",
    label: "LPG reform framework",
    explanation: "The reform process is commonly summarised as Liberalisation, Privatisation and Globalisation.",
    sourceIds: ["NCERT-LPG-REFORMS"],
    sourceFactIds: ["lpg-framework"],
  },
  {
    id: "liberalisation",
    label: "Liberalisation",
    explanation: "Liberalisation means reducing unnecessary government controls and restrictions on economic activity.",
    sourceIds: ["NCERT-LPG-REFORMS", "DPIIT-INDUSTRIAL-POLICY-1991"],
    sourceFactIds: ["liberalisation-controls", "industrial-delicensing"],
  },
  {
    id: "privatisation",
    label: "Privatisation",
    explanation: "Privatisation increases the role of private ownership or management in activities earlier dominated by the public sector.",
    sourceIds: ["NCERT-LPG-REFORMS"],
    sourceFactIds: ["privatisation-concept"],
  },
  {
    id: "globalisation",
    label: "Globalisation",
    explanation: "Globalisation increases the integration of the domestic economy with the world through trade, investment and technology flows.",
    sourceIds: ["NCERT-LPG-REFORMS"],
    sourceFactIds: ["globalisation-integration"],
  },
  {
    id: "new-industrial-policy-1991",
    label: "New Industrial Policy, 1991",
    explanation: "The Statement on Industrial Policy of 24 July 1991 introduced major changes in industrial licensing, public-sector policy and foreign investment.",
    sourceIds: ["DPIIT-INDUSTRIAL-POLICY-1991"],
    sourceFactIds: ["statement-industrial-policy-24-july-1991"],
  },
  {
    id: "industrial-delicensing",
    label: "Industrial delicensing",
    explanation: "The 1991 industrial policy abolished industrial licensing for most industries while retaining compulsory licensing for a limited set of sensitive activities.",
    sourceIds: ["DPIIT-INDUSTRIAL-POLICY-1991"],
    sourceFactIds: ["licensing-abolished-most-industries"],
  },
  {
    id: "public-sector-role",
    label: "Reduced public-sector reservation",
    explanation: "The reforms reduced the number of activities reserved exclusively for the public sector and gave greater space to private enterprise.",
    sourceIds: ["DPIIT-INDUSTRIAL-POLICY-1991", "NCERT-LPG-REFORMS"],
    sourceFactIds: ["public-sector-reservation-reduced", "private-sector-role"],
  },
  {
    id: "disinvestment",
    label: "Disinvestment",
    explanation: "Disinvestment means sale of part of the government's equity in a public-sector enterprise.",
    sourceIds: ["NCERT-LPG-REFORMS"],
    sourceFactIds: ["disinvestment-concept"],
  },
  {
    id: "foreign-investment-liberalisation",
    label: "Foreign-investment liberalisation",
    explanation: "The 1991 industrial policy simplified and liberalised foreign-investment approvals in selected areas to bring capital, technology and management expertise.",
    sourceIds: ["DPIIT-INDUSTRIAL-POLICY-1991"],
    sourceFactIds: ["foreign-investment-liberalisation", "technology-management-benefits"],
  },
  {
    id: "trade-liberalisation",
    label: "Trade liberalisation",
    explanation: "Trade reforms reduced quantitative restrictions and moved toward lower and more rational tariffs to increase competition and external integration.",
    sourceIds: ["NCERT-LPG-REFORMS", "RBI-EXTERNAL-SECTOR-OPENNESS"],
    sourceFactIds: ["trade-restrictions-reduced", "tariff-rationalisation"],
  },
  {
    id: "rupee-adjustment-1991",
    label: "Exchange-rate adjustment in 1991",
    explanation: "The rupee underwent a two-step downward adjustment in July 1991 as part of the response to the external crisis.",
    sourceIds: ["RBI-EXTERNAL-SECTOR-OPENNESS"],
    sourceFactIds: ["two-step-exchange-rate-adjustment-july-1991"],
  },
  {
    id: "lerms-1992",
    label: "LERMS, 1992",
    explanation: "LERMS introduced a dual exchange-rate system in 1992 as a transitional step toward a market-determined exchange rate.",
    sourceIds: ["RBI-EXTERNAL-SECTOR-OPENNESS"],
    sourceFactIds: ["lerms-dual-rate-1992"],
  },
  {
    id: "market-exchange-rate-1993",
    label: "Market-determined exchange rate",
    explanation: "The dual exchange-rate system was unified into a market-determined exchange-rate system in 1993.",
    sourceIds: ["RBI-EXTERNAL-SECTOR-OPENNESS"],
    sourceFactIds: ["unified-market-rate-1993"],
  },
  {
    id: "current-account-convertibility-1994",
    label: "Current-account convertibility",
    explanation: "India moved to current-account convertibility in 1994 as external-sector liberalisation progressed.",
    sourceIds: ["RBI-EXTERNAL-SECTOR-OPENNESS"],
    sourceFactIds: ["current-account-convertibility-1994"],
  },
  {
    id: "narasimham-committee-1991",
    label: "Narasimham Committee",
    explanation: "The Narasimham Committee on the Financial System was set up in 1991 and its recommendations formed an important basis for banking and financial-sector reforms.",
    sourceIds: ["RBI-FINANCIAL-SECTOR-REFORMS"],
    sourceFactIds: ["narasimham-committee-1991", "financial-sector-reform-basis"],
  },
  {
    id: "financial-sector-liberalisation",
    label: "Financial-sector liberalisation",
    explanation: "Financial-sector reforms sought a more competitive and efficient banking and financial system with less direct administrative control.",
    sourceIds: ["RBI-FINANCIAL-SECTOR-REFORMS", "RBI-1991-CRISIS-REFORMS"],
    sourceFactIds: ["banking-liberalisation", "efficiency-competition"],
  },
  {
    id: "fera-fema-direction",
    label: "FERA to FEMA reform direction",
    explanation: "Foreign-exchange regulation gradually shifted from the more control-oriented FERA framework to the management-oriented FEMA framework enacted in 1999.",
    sourceIds: ["RBI-EXTERNAL-SECTOR-OPENNESS"],
    sourceFactIds: ["fera-to-fema", "foreign-exchange-liberalisation"],
  },
  {
    id: "stabilisation-vs-structural",
    label: "Stabilisation versus structural reform",
    explanation: "Stabilisation measures address immediate macroeconomic imbalance, while structural reforms change the rules and institutions shaping long-term economic activity.",
    sourceIds: ["NCERT-LPG-REFORMS", "RBI-1991-CRISIS-REFORMS"],
    sourceFactIds: ["stabilisation-measures", "structural-reforms"],
  },
];

export function ecoCp016Fact(id: string): EcoCp016Fact {
  const fact = ECO_CP016_FACTS_V1.find((row) => row.id === id);
  if (!fact) throw new Error(`Unknown ECO-CP-016 fact: ${id}`);
  return fact;
}
