export type EcoCp017Fact = {
  id: string;
  label: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};

export const ECO_CP017_FACTS_V1: EcoCp017Fact[] = [
  {
    id: "agri-role",
    label: "Economic role of agriculture",
    explanation: "Agriculture supplies food, raw materials and rural livelihoods and supports demand for many non-farm goods and services.",
    sourceIds: ["NCERT-RURAL-AGRI"],
    sourceFactIds: ["agriculture-food-livelihood-linkages"],
  },
  {
    id: "land-reforms",
    label: "Land reforms",
    explanation: "Major land-reform measures included abolition of intermediaries, tenancy reform, ceilings on landholdings and consolidation of fragmented holdings.",
    sourceIds: ["NCERT-RURAL-AGRI"],
    sourceFactIds: ["abolition-intermediaries", "tenancy-reform", "land-ceiling", "consolidation"],
  },
  {
    id: "green-revolution",
    label: "Green Revolution",
    explanation: "The Green Revolution raised foodgrain productivity through HYV seeds supported by irrigation, fertilisers, research and improved farm practices, especially in wheat and rice.",
    sourceIds: ["ICAR-GREEN-REVOLUTION", "NCERT-RURAL-AGRI"],
    sourceFactIds: ["hyv-irrigation-fertiliser-package", "wheat-rice-productivity"],
  },
  {
    id: "green-revolution-effect",
    label: "Green Revolution effects",
    explanation: "The Green Revolution strengthened foodgrain self-sufficiency, but early gains were concentrated in crops and regions with better irrigation and input access.",
    sourceIds: ["ICAR-GREEN-REVOLUTION", "NCERT-RURAL-AGRI"],
    sourceFactIds: ["food-security-gain", "regional-crop-concentration"],
  },
  {
    id: "crop-seasons",
    label: "Kharif, Rabi and Zaid",
    explanation: "Kharif crops are mainly associated with the monsoon season, Rabi crops with the winter season and Zaid with the short summer season between them.",
    sourceIds: ["NCERT-RURAL-AGRI"],
    sourceFactIds: ["kharif-rabi-zaid-basic"],
  },
  {
    id: "msp",
    label: "Minimum Support Price",
    explanation: "MSP is an announced support price intended to protect farmers from sharp price falls in covered crops; it does not mean every unit produced is automatically procured.",
    sourceIds: ["PIB-MSP-CACP", "DFPD-PROCUREMENT"],
    sourceFactIds: ["government-fixes-msp", "msp-price-support"],
  },
  {
    id: "cacp",
    label: "CACP role",
    explanation: "The Commission for Agricultural Costs and Prices recommends MSPs after considering factors such as production cost, demand-supply conditions and price relationships.",
    sourceIds: ["PIB-MSP-CACP"],
    sourceFactIds: ["cacp-recommends-msp"],
  },
  {
    id: "procurement",
    label: "Foodgrain procurement",
    explanation: "FCI and designated State agencies procure specified foodgrains for the Central Pool under the Government's procurement framework.",
    sourceIds: ["DFPD-PROCUREMENT", "FCI-MANDATE"],
    sourceFactIds: ["central-pool-procurement", "fci-state-agencies"],
  },
  {
    id: "fci",
    label: "Food Corporation of India",
    explanation: "FCI's core functions include procurement, storage, movement and distribution of foodgrains and support for buffer stocks and food security.",
    sourceIds: ["FCI-MANDATE"],
    sourceFactIds: ["procurement-storage-movement-distribution", "buffer-stock-support"],
  },
  {
    id: "pds",
    label: "Public Distribution System",
    explanation: "The PDS distributes foodgrains to eligible households through the public food-distribution network; procurement and distribution are linked but are not the same function.",
    sourceIds: ["DFPD-PROCUREMENT", "FCI-MANDATE"],
    sourceFactIds: ["pds-distribution", "procurement-vs-distribution"],
  },
  {
    id: "nabard-credit",
    label: "NABARD and agricultural credit",
    explanation: "NABARD supports agricultural and rural credit mainly through refinance, development and institutional support to eligible rural financial institutions.",
    sourceIds: ["NABARD-FUNCTIONS"],
    sourceFactIds: ["agri-refinance", "institutional-development"],
  },
  {
    id: "institutional-credit",
    label: "Institutional agricultural credit",
    explanation: "Commercial banks, RRBs and cooperative institutions are important formal channels of agricultural credit, reducing dependence on informal lenders.",
    sourceIds: ["NABARD-FUNCTIONS", "NCERT-RURAL-AGRI"],
    sourceFactIds: ["formal-rural-credit-channels"],
  },
  {
    id: "crop-insurance",
    label: "Crop insurance",
    explanation: "Crop insurance helps protect farmers against financial losses caused by covered crop damage or failure from specified risks.",
    sourceIds: ["PMFBY-FAQ"],
    sourceFactIds: ["crop-insurance-risk-transfer"],
  },
  {
    id: "pmfby",
    label: "PMFBY purpose",
    explanation: "PMFBY aims to provide financial support after covered crop losses, stabilise farm income and support continuity in farming.",
    sourceIds: ["PMFBY-FAQ"],
    sourceFactIds: ["pmfby-financial-support-income-stability"],
  },
  {
    id: "enam",
    label: "e-NAM",
    explanation: "e-NAM is a pan-India electronic trading platform that networks existing APMC mandis to improve market access, transparency and price discovery.",
    sourceIds: ["ENAM-OVERVIEW"],
    sourceFactIds: ["electronic-apmc-network", "transparent-price-discovery"],
  },
  {
    id: "productivity",
    label: "Agricultural productivity",
    explanation: "Productivity can rise through better seeds, irrigation, research, mechanisation, balanced inputs, extension and timely institutional credit.",
    sourceIds: ["ICAR-GREEN-REVOLUTION", "NABARD-FUNCTIONS", "NCERT-RURAL-AGRI"],
    sourceFactIds: ["productivity-inputs-and-institutions"],
  },
  {
    id: "diversification",
    label: "Agricultural diversification",
    explanation: "Diversification into dairy, fisheries, horticulture and other allied activities can spread risk and create additional sources of rural income.",
    sourceIds: ["NABARD-FUNCTIONS", "NCERT-RURAL-AGRI"],
    sourceFactIds: ["allied-activities-income-diversification"],
  },
];

export function ecoCp017Fact(id: string): EcoCp017Fact {
  const fact = ECO_CP017_FACTS_V1.find((row) => row.id === id);
  if (!fact) throw new Error(`Unknown ECO-CP-017 fact: ${id}`);
  return fact;
}
