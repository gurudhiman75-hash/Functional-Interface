export const ECO_CP026_SOURCES_V1 = {
  "NDDB-GENESIS": { title: "Genesis", publisher: "National Dairy Development Board", url: "https://www.nddb.coop/about/genesis" },
  "NDDB-OPERATION-FLOOD": { title: "Operation Flood", publisher: "National Dairy Development Board", url: "https://www.nddb.coop/node/10" },
  "NDDB-KURIEN": { title: "Dr. Verghese Kurien", publisher: "National Dairy Development Board", url: "https://www.nddb.coop/node/433" },
} as const;
export type EcoCp026SourceId = keyof typeof ECO_CP026_SOURCES_V1;
export const ECO_CP026_SOURCE_IDS_V1 = Object.keys(ECO_CP026_SOURCES_V1) as EcoCp026SourceId[];
