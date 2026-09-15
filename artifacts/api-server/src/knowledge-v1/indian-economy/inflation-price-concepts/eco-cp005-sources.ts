export const ECO_CP005_SOURCES_V1 = Object.freeze([
  {
    id: "MOSPI-CPI-FAQ",
    authority: "Ministry of Statistics and Programme Implementation",
    title: "FAQs on Consumer Price Indices (CPI)",
    url: "https://mospi.gov.in/faq",
    notes: "CPI measures changes over time in the general level of prices of a basket of goods and services acquired by households for consumption.",
  },
  {
    id: "OEA-WPI-MANUAL",
    authority: "Office of the Economic Adviser, Ministry of Commerce and Industry",
    title: "Wholesale Price Index Manual",
    url: "https://eaindustry.nic.in/uploaded_files/WPI_Manual.pdf",
    notes: "WPI tracks price movement at the wholesale level and is compiled by the Office of the Economic Adviser.",
  },
  {
    id: "RBI-INFLATION-MEASUREMENT",
    authority: "Reserve Bank of India",
    title: "Inflation Measurement in India: An Overview",
    url: "https://www.rbi.org.in/Scripts/PublicationReportDetails.aspx?ID=594",
    notes: "Background on CPI, WPI, GDP deflator, core inflation and inflation measurement.",
  },
  {
    id: "RBI-CORE-INFLATION",
    authority: "Reserve Bank of India",
    title: "Core Inflation Measures in India",
    url: "https://www.rbi.org.in/scripts/PublicationsView.aspx?Id=18941",
    notes: "Core inflation commonly uses exclusion measures such as CPI excluding food and fuel; headline inflation includes the full basket.",
  },
] as const);

export const ECO_CP005_SOURCE_IDS_V1 = ECO_CP005_SOURCES_V1.map((source) => source.id);
