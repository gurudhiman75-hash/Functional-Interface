export const ECO_CP028_SOURCES_V1 = {
  "FINCOM-CONSTITUTION": { title: "Constitutional Provisions – Articles 280 to 282", publisher: "Finance Commission, Government of India", url: "https://fincomindia.nic.in/constitutional-provisions" },
  "FINCOM-ACT": { title: "Finance Commission (Miscellaneous Provisions) Act, 1951", publisher: "Finance Commission, Government of India", url: "https://fincomindia.nic.in/finance-commission-act" },
} as const;
export type EcoCp028SourceId=keyof typeof ECO_CP028_SOURCES_V1;
export const ECO_CP028_SOURCE_IDS_V1=Object.keys(ECO_CP028_SOURCES_V1) as EcoCp028SourceId[];
