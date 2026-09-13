export const ECO_CP003_SOURCES_V1 = Object.freeze([
  {
    sourceId: "NCERT-MACRO-NIA",
    title: "NCERT Introductory Macroeconomics — National Income Accounting",
    sourceClass: "NCERT",
  },
  {
    sourceId: "MOSPI-NAS-CONCEPTS",
    title: "MoSPI National Accounts — concepts and aggregates",
    sourceClass: "OFFICIAL",
  },
] as const);

export const ECO_CP003_SOURCE_IDS_V1 = ECO_CP003_SOURCES_V1.map((source) => source.sourceId);
