export const ECO_CP021_SOURCES_V1 = {
  "IMF-ABOUT": { title: "What is the IMF?", publisher: "International Monetary Fund", url: "https://www.imf.org/en/about/factsheets/imf-at-a-glance" },
  "IMF-ARTICLES": { title: "Articles of Agreement", publisher: "International Monetary Fund", url: "https://www.imf.org/en/publications/ft/aa/index" },
  "WORLD-BANK-IBRD": { title: "International Bank for Reconstruction and Development", publisher: "World Bank", url: "https://www.worldbank.org/en/who-we-are/ibrd" },
  "WORLD-BANK-IDA": { title: "What Is IDA", publisher: "World Bank", url: "https://ida.worldbank.org/en/about" },
  "WTO-ABOUT": { title: "What is the WTO?", publisher: "World Trade Organization", url: "https://www.wto.org/english/thewto_e/whatis_e/whatis_e.htm" },
  "ADB-ABOUT": { title: "Who We Are", publisher: "Asian Development Bank", url: "https://www.adb.org/who-we-are" },
  "AIIB-ABOUT": { title: "About AIIB", publisher: "Asian Infrastructure Investment Bank", url: "https://www.aiib.org/en/about-aiib/index.html" },
  "NDB-ABOUT": { title: "What We Do", publisher: "New Development Bank", url: "https://www.ndb.int/what-we-do/" },
} as const;

export type EcoCp021SourceId = keyof typeof ECO_CP021_SOURCES_V1;
export const ECO_CP021_SOURCE_IDS_V1 = Object.keys(ECO_CP021_SOURCES_V1) as EcoCp021SourceId[];