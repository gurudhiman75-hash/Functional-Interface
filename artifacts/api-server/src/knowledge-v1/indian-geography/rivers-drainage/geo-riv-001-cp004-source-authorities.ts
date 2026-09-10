export const GEO_RIV_001_CP004_SOURCE_AUTHORITIES_V1 = Object.freeze({
  "CWC-BRAHMAPUTRA-WRA-2024": Object.freeze({
    sourceId: "CWC-BRAHMAPUTRA-WRA-2024",
    authority: "Central Water Commission, Government of India",
    title: "Water Resources Assessment of India 2024 — Brahmaputra Basin",
    url: "https://cwc.gov.in/sites/default/files/reportwaterresourcesassessmentofindia2024_1.pdf",
    role: "PRIMARY_TRUTH_AUTHORITY",
  }),
  "CWC-BRAHMAPUTRA-PMP-ATLAS": Object.freeze({
    sourceId: "CWC-BRAHMAPUTRA-PMP-ATLAS",
    authority: "Central Water Commission / India Meteorological Department",
    title: "PMP Atlas for Brahmaputra River Basin — Main Report",
    url: "https://www.cwc.gov.in/sites/default/files/brahmaputra-basin-volume-i.pdf",
    role: "PRIMARY_TRUTH_AUTHORITY",
  }),
  "CWC-BRAHMAPUTRA-MORPHOLOGY": Object.freeze({
    sourceId: "CWC-BRAHMAPUTRA-MORPHOLOGY",
    authority: "Central Water Commission, Government of India",
    title: "Brahmaputra Morphology Report",
    url: "https://www.cwc.gov.in/sites/default/files/brahmaputramorphologyreports.pdf",
    role: "TRIBUTARY_TOPOLOGY_AUTHORITY",
  }),
  "CWC-SIANG-CUMULATIVE-IMPACT": Object.freeze({
    sourceId: "CWC-SIANG-CUMULATIVE-IMPACT",
    authority: "Central Water Commission, Government of India",
    title: "Cumulative Impact and Carrying Capacity — Siang/Brahmaputra",
    url: "https://cwc.gov.in/sites/default/files/volume-i.pdf",
    role: "COURSE_AND_CONFLUENCE_AUTHORITY",
  }),
  "CWC-BANGLADESH-JAMUNA": Object.freeze({
    sourceId: "CWC-BANGLADESH-JAMUNA",
    authority: "Central Water Commission, Government of India",
    title: "Ganga Basin Report — lower Ganga/Brahmaputra relations",
    url: "https://www.cwc.gov.in/sites/default/files/gangacompressed.pdf",
    role: "LOWER_COURSE_NAMING_AUTHORITY",
  }),
  "ASSAM-WR-BRAHMAPUTRA-SYSTEM": Object.freeze({
    sourceId: "ASSAM-WR-BRAHMAPUTRA-SYSTEM",
    authority: "Water Resources Department, Government of Assam",
    title: "Brahmaputra River System",
    url: "https://waterresources.assam.gov.in/portlet-innerpage/brahmaputra-river-system",
    role: "ASSAM_BANK_TRIBUTARY_AUTHORITY",
  }),
  "NCERT-NORTH-EAST-INDIA": Object.freeze({
    sourceId: "NCERT-NORTH-EAST-INDIA",
    authority: "NCERT",
    title: "North East India: People, History and Culture",
    url: "https://www.ncert.nic.in/pdf/publication/otherpublications/tinei101.pdf",
    role: "EDUCATIONAL_FRAMING_AUTHORITY",
  }),
});

export type GeoRiv001Cp004SourceId = keyof typeof GEO_RIV_001_CP004_SOURCE_AUTHORITIES_V1;

export function toGeoRiv001Cp004FactSource(sourceId: string, locator: string) {
  const source = GEO_RIV_001_CP004_SOURCE_AUTHORITIES_V1[sourceId as GeoRiv001Cp004SourceId];
  if (!source) throw new Error(`Unknown GEO-RIV-001 CP004 source authority: ${sourceId}`);
  return {
    sourceId: source.sourceId,
    authority: source.authority,
    title: source.title,
    url: source.url,
    locator,
  };
}
