export const ECO_CP024_SOURCES_V1 = {
  "IRDAI-EVOLUTION": { title: "Evolution of Insurance", publisher: "Insurance Regulatory and Development Authority of India", url: "https://irdai.gov.in/evolution-of-insurance" },
  "IRDAI-DUTIES": { title: "Duties and Responsibilities", publisher: "Insurance Regulatory and Development Authority of India", url: "https://irdai.gov.in/duties-and-responsibilities" },
  "PFRDA-HISTORY": { title: "History and Evolution", publisher: "Pension Fund Regulatory and Development Authority", url: "https://pfrda.org.in/en/about-us/history" },
  "PFRDA-AUTHORITY": { title: "About Authority", publisher: "Pension Fund Regulatory and Development Authority", url: "https://www.pfrda.org.in/en/about-us/authority/about-authority" },
} as const;

export type EcoCp024SourceId = keyof typeof ECO_CP024_SOURCES_V1;
export const ECO_CP024_SOURCE_IDS_V1 = Object.keys(ECO_CP024_SOURCES_V1) as EcoCp024SourceId[];
