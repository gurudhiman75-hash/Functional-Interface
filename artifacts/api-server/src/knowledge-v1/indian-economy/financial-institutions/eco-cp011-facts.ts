export type EcoCp011Fact = {
  id: string;
  label: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};

export const ECO_CP011_FACTS_V1: EcoCp011Fact[] = [
  {
    id: "dfi",
    label: "Development Financial Institution",
    explanation: "A DFI is created to provide or catalyse longer-term finance for sectors where ordinary short-term commercial finance may be insufficient.",
    sourceIds: ["IFCI-HISTORY", "NABFID-PURPOSE"],
    sourceFactIds: ["dfi-long-term-finance"],
  },
  {
    id: "ifci-1948",
    label: "IFCI",
    explanation: "IFCI was established on 1 July 1948 as India's first Development Financial Institution to meet long-term finance needs of industry.",
    sourceIds: ["IFCI-HISTORY"],
    sourceFactIds: ["ifci-first-dfi", "ifci-1948"],
  },
  {
    id: "nabard-1982",
    label: "NABARD",
    explanation: "NABARD was established on 12 July 1982 and serves agriculture and rural development through refinance, institutional development and related support.",
    sourceIds: ["NABARD-HISTORY", "NABARD-ROLE"],
    sourceFactIds: ["nabard-1982", "nabard-rural-development"],
  },
  {
    id: "nabard-refinance",
    label: "NABARD refinance role",
    explanation: "NABARD provides refinance to eligible lending institutions serving agriculture and rural areas instead of functioning like an ordinary retail bank for every borrower.",
    sourceIds: ["NABARD-ROLE"],
    sourceFactIds: ["nabard-refinance"],
  },
  {
    id: "sidbi-1990",
    label: "SIDBI",
    explanation: "SIDBI was set up on 2 April 1990 as the principal financial institution for promotion, financing and development of the MSME sector.",
    sourceIds: ["SIDBI-ABOUT"],
    sourceFactIds: ["sidbi-1990", "sidbi-msme"],
  },
  {
    id: "sidbi-role",
    label: "SIDBI MSME role",
    explanation: "SIDBI supports MSMEs through direct and indirect finance as well as promotion and development measures.",
    sourceIds: ["SIDBI-ABOUT"],
    sourceFactIds: ["sidbi-finance", "sidbi-development"],
  },
  {
    id: "exim-1982",
    label: "Export-Import Bank of India",
    explanation: "The Export-Import Bank of India Act was enacted in 1981 and the Bank commenced operations in March 1982.",
    sourceIds: ["EXIM-HISTORY"],
    sourceFactIds: ["exim-act-1981", "exim-operations-1982"],
  },
  {
    id: "exim-role",
    label: "EXIM Bank role",
    explanation: "EXIM Bank finances, facilitates and promotes India's international trade and coordinates institutions engaged in export-import finance.",
    sourceIds: ["EXIM-OBJECTIVES"],
    sourceFactIds: ["exim-trade-finance"],
  },
  {
    id: "nhb-1988",
    label: "National Housing Bank",
    explanation: "NHB was set up on 9 July 1988 under the National Housing Bank Act, 1987 as an apex-level institution for housing finance.",
    sourceIds: ["NHB-ABOUT"],
    sourceFactIds: ["nhb-act-1987", "nhb-1988"],
  },
  {
    id: "nhb-role",
    label: "NHB housing-finance role",
    explanation: "NHB promotes and supports the housing-finance system, including refinance and development support to housing-finance institutions and eligible agencies.",
    sourceIds: ["NHB-ABOUT"],
    sourceFactIds: ["nhb-housing-finance"],
  },
  {
    id: "nhb-rbi-regulation",
    label: "HFC regulation transfer",
    explanation: "Regulatory powers over Housing Finance Companies were transferred from NHB to RBI with effect from 9 August 2019.",
    sourceIds: ["NHB-REGULATION-CHANGE"],
    sourceFactIds: ["hfc-regulation-rbi-2019"],
  },
  {
    id: "nabfid-2021",
    label: "NaBFID",
    explanation: "NaBFID was set up in 2021 under the NaBFID Act, 2021 as a specialised Development Finance Institution for infrastructure.",
    sourceIds: ["NABFID-ABOUT"],
    sourceFactIds: ["nabfid-2021"],
  },
  {
    id: "nabfid-role",
    label: "NaBFID infrastructure role",
    explanation: "NaBFID focuses on long-term infrastructure financing and on developing financing instruments and markets that can support infrastructure investment.",
    sourceIds: ["NABFID-PURPOSE"],
    sourceFactIds: ["nabfid-infrastructure", "nabfid-market-development"],
  },
  {
    id: "nbfc-basic",
    label: "Non-Banking Financial Company",
    explanation: "An NBFC is a company whose principal business is specified financial activity such as lending or investment, but it is not a banking company.",
    sourceIds: ["RBI-NBFC-FAQ"],
    sourceFactIds: ["nbfc-definition"],
  },
  {
    id: "nbfc-bank-distinction",
    label: "NBFC versus bank",
    explanation: "NBFCs can perform important lending and investment functions, but they are not banking companies and should not be treated as identical to commercial banks.",
    sourceIds: ["RBI-NBFC-FAQ"],
    sourceFactIds: ["nbfc-not-bank"],
  },
];

export function ecoCp011Fact(id: string): EcoCp011Fact {
  const fact = ECO_CP011_FACTS_V1.find((row) => row.id === id);
  if (!fact) throw new Error(`Unknown ECO-CP-011 fact: ${id}`);
  return fact;
}
