export const ECO_CP018_SOURCES_V1 = [
  {
    id: "DPIIT-INDUSTRIAL-POLICY-1991",
    title: "Statement on Industrial Policy, 24 July 1991",
    url: "https://www.dpiit.gov.in/static/uploads/2025/07/51cb252d5e39c9c2afd70515623b8ebb.pdf",
  },
  {
    id: "MOSPI-IIP-METADATA",
    title: "MoSPI National Metadata — Index of Industrial Production",
    url: "https://nmds.mospi.gov.in/",
  },
  {
    id: "OEA-EIGHT-CORE",
    title: "Office of Economic Adviser — Index of Eight Core Industries",
    url: "https://eaindustry.nic.in/eight_core_infra/eight_infra.pdf",
  },
  {
    id: "MSME-MSMED-ACT",
    title: "Ministry of MSME — MSMED Act, 2006 background",
    url: "https://msme.gov.in/sites/default/files/Outcome_Budget-2007-08-SSI.pdf",
  },
  {
    id: "COMMERCE-SEZ-ACT-2005",
    title: "Special Economic Zones Act, 2005",
    url: "https://commerce.gov.in/wp-content/uploads/2021/06/SEZAct2005.pdf",
  },
  {
    id: "PIB-MAKE-IN-INDIA-2014",
    title: "PM launches Make in India global initiative, 25 September 2014",
    url: "https://www.pib.gov.in/newsite/PrintRelease.aspx?relid=110017",
  },
  {
    id: "NICDC-INDUSTRIAL-CORRIDORS",
    title: "National Industrial Corridor Development Programme",
    url: "https://nicdc.in/about/overview",
  },
] as const;

export const ECO_CP018_SOURCE_IDS_V1 = ECO_CP018_SOURCES_V1.map((source) => source.id);

export type EcoCp018SourceId = (typeof ECO_CP018_SOURCE_IDS_V1)[number];
