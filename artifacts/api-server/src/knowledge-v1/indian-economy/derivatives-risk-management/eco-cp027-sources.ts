export const ECO_CP027_SOURCES_V1 = {
  "SEBI-DERIVATIVES": { title: "Understanding Derivatives", publisher: "SEBI Investor", url: "https://investor.sebi.gov.in/understanding_derivatives.html" },
  "SEBI-EDUCATION": { title: "Investor Education Reading Material", publisher: "SEBI Investor", url: "https://investor.sebi.gov.in/iematerial.html" },
} as const;
export type EcoCp027SourceId=keyof typeof ECO_CP027_SOURCES_V1;
export const ECO_CP027_SOURCE_IDS_V1=Object.keys(ECO_CP027_SOURCES_V1) as EcoCp027SourceId[];
