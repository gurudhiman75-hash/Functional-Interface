import type { KnowledgeFactSource } from "../../types";

export const GEO_RIV_001_CP009_SOURCE_AUTHORITIES_V1 = Object.freeze({
  "CWC-UGBO-WQ-FEB-2025": Object.freeze({
    sourceId: "CWC-UGBO-WQ-FEB-2025",
    authority: "Upper Ganga Basin Organisation, Central Water Commission",
    title: "Water Quality Bulletin — February 2025",
    url: "https://cwc.gov.in/sites/default/files/ugbo-wq-bulletin-feb-2025.pdf",
    role: "GANGA_MAIN_COURSE_STATE_AUTHORITY",
  }),
  "ASSAM-WR-BRAHMAPUTRA-SYSTEM": Object.freeze({
    sourceId: "ASSAM-WR-BRAHMAPUTRA-SYSTEM",
    authority: "Water Resources Department, Government of Assam",
    title: "Brahmaputra River System",
    url: "https://waterresources.assam.gov.in/portlet-innerpage/brahmaputra-river-system",
    role: "BRAHMAPUTRA_INDIA_COURSE_AUTHORITY",
  }),
  "CWC-KGBO-BOOKLET": Object.freeze({
    sourceId: "CWC-KGBO-BOOKLET",
    authority: "Krishna Godavari Basin Organisation, Central Water Commission",
    title: "Krishna Godavari Basin Organisation Booklet",
    url: "https://cwc.gov.in/sites/default/files/final-kgbo-booklet-printing.pdf",
    role: "KRISHNA_MAIN_COURSE_AUTHORITY",
  }),
  "CGWB-TELANGANA-RIVERS-2020": Object.freeze({
    sourceId: "CGWB-TELANGANA-RIVERS-2020",
    authority: "Central Ground Water Board / Ground Water Department, Telangana",
    title: "Dynamic Groundwater Resources of Telangana — Rivers of the State",
    url: "https://www.cgwb.gov.in/old_website/GW-Assessment/GWR-2020-Reports%20State/Telangana_State_Resource_Report_2020.pdf",
    role: "GODAVARI_KRISHNA_TELANGANA_COURSE_AUTHORITY",
  }),
  "MAHARASHTRA-STATE-DMP-RIVERS": Object.freeze({
    sourceId: "MAHARASHTRA-STATE-DMP-RIVERS",
    authority: "Government of Maharashtra",
    title: "State river and flood profile",
    url: "https://maharashtra.gov.in/Upload/PDF/eehpd_pune_1.pdf",
    role: "GODAVARI_KRISHNA_MAHARASHTRA_COURSE_AUTHORITY",
  }),
  "ODISHA-TOPOGRAPHY-RIVERS": Object.freeze({
    sourceId: "ODISHA-TOPOGRAPHY-RIVERS",
    authority: "Government of Odisha",
    title: "Odisha Profile — Topography and Rivers",
    url: "https://www.odisha.gov.in/en/odisha-profile/topography",
    role: "MAHANADI_ODISHA_COURSE_AUTHORITY",
  }),
  "CWC-HYDROLOGICAL-NETWORK-2025": Object.freeze({
    sourceId: "CWC-HYDROLOGICAL-NETWORK-2025",
    authority: "Central Water Commission",
    title: "Hydrological Network Details of CWC",
    url: "https://www.cwc.gov.in/sites/default/files/hydrological-network-details-of-cwc.pdf",
    role: "MAHANADI_SUBARNAREKHA_STATE_COURSE_CORROBORATION",
  }),
  "TNPCB-CAUVERY-ACTION-PLAN": Object.freeze({
    sourceId: "TNPCB-CAUVERY-ACTION-PLAN",
    authority: "Tamil Nadu Pollution Control Board",
    title: "River Cauvery Action Plan / River Stretch Description",
    url: "https://tnpcb.gov.in/PDF/About_Us/projects/PR-Stretches/Water-QA-MN-report/actionplan/PrsCauvery24919.pdf",
    role: "CAUVERY_KARNATAKA_TAMIL_NADU_COURSE_AUTHORITY",
  }),
  "CWC-IHD-PENNAR-2018": Object.freeze({
    sourceId: "CWC-IHD-PENNAR-2018",
    authority: "Central Water Commission",
    title: "Hydrological Data (Unclassified) Book, 2018 — Pennar Basin",
    url: "https://cwc.gov.in/sites/default/files/ihd2018.pdf",
    role: "PENNAR_KARNATAKA_ANDHRA_PRADESH_COURSE_AUTHORITY",
  }),
  "WII-TEESTA-INTRODUCTION": Object.freeze({
    sourceId: "WII-TEESTA-INTRODUCTION",
    authority: "Wildlife Institute of India, Ministry of Environment, Forest and Climate Change",
    title: "Teesta River — Introduction",
    url: "https://v1.wii.gov.in/eia/casestudies/river_valley_projects5_introduction",
    role: "TEESTA_SIKKIM_WEST_BENGAL_COURSE_AUTHORITY",
  }),
  "ISTI-SUBARNAREKHA-HYDROLOGY": Object.freeze({
    sourceId: "ISTI-SUBARNAREKHA-HYDROLOGY",
    authority: "India Science, Technology & Innovation Portal, Government of India",
    title: "Remote Sensing based hydrologic budget of the Subarnarekha river basin",
    url: "https://www.indiascienceandtechnology.gov.in/research/remote-sensing-based-hydrologic-budget-subarnarekha-river-basin",
    role: "SUBARNAREKHA_MAIN_COURSE_STATE_AUTHORITY",
  }),
});

export type GeoRiv001Cp009SourceId = keyof typeof GEO_RIV_001_CP009_SOURCE_AUTHORITIES_V1;

export function toGeoRiv001Cp009FactSource(sourceId: GeoRiv001Cp009SourceId, locator: string): KnowledgeFactSource {
  const source = GEO_RIV_001_CP009_SOURCE_AUTHORITIES_V1[sourceId];
  return {
    sourceId: source.sourceId,
    sourceType: "official",
    title: source.title,
    url: source.url,
    locator,
  };
}

export function auditGeoRiv001Cp009SourceAuthorities() {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const source of Object.values(GEO_RIV_001_CP009_SOURCE_AUTHORITIES_V1)) {
    if (ids.has(source.sourceId)) issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    ids.add(source.sourceId);
    if (!source.title.trim()) issues.push(`MISSING_TITLE:${source.sourceId}`);
    if (!source.url.startsWith("https://")) issues.push(`INVALID_URL:${source.sourceId}`);
  }
  return { valid: issues.length === 0, sourceCount: ids.size, issues };
}
