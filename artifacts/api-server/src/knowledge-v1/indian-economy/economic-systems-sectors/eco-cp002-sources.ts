export const ECO_CP002_SOURCES_V1 = Object.freeze([
  {
    sourceId: "NCERT-IED-SECTORS",
    title: "NCERT Indian Economic Development / sector classification",
    sourceClass: "NCERT",
  },
  {
    sourceId: "NCERT-ECON-SYSTEMS",
    title: "NCERT introductory economics / organisation of economic activity",
    sourceClass: "NCERT",
  },
] as const);

export const ECO_CP002_SOURCE_IDS_V1 = ECO_CP002_SOURCES_V1.map((source) => source.sourceId);
