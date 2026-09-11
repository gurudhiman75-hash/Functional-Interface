export const GEO_RIV_001_CP006_SOURCE_AUTHORITIES_V1 = Object.freeze({
  "CWC-NARMADA-WYB-2020-21": Object.freeze({
    sourceId: "CWC-NARMADA-WYB-2020-21",
    authority: "Central Water Commission, Government of India",
    title: "Water Year Book 2020-21 — Narmada Basin",
    url: "https://cwc.gov.in/en/water-year-book-2020-21-narmada-basin",
    role: "PRIMARY_NARMADA_AUTHORITY",
  }),
  "CWC-NARMADA-WQ-2021": Object.freeze({
    sourceId: "CWC-NARMADA-WQ-2021",
    authority: "Central Water Commission, Government of India",
    title: "Water Quality Assessment — Narmada Basin",
    url: "https://cwc.gov.in/sites/default/files/volume-3.pdf",
    role: "NARMADA_COURSE_OUTFALL_AUTHORITY",
  }),
  "CWC-TAPI-WYB-2016-17": Object.freeze({
    sourceId: "CWC-TAPI-WYB-2016-17",
    authority: "Central Water Commission, Government of India",
    title: "Water Year Book — Tapi Basin",
    url: "https://cwc.gov.in/sites/default/files/admin/9A_N%26TBO_Gandhinagar_Tapi_WYB_2016-17.pdf",
    role: "PRIMARY_TAPI_AUTHORITY",
  }),
  "CWC-TAPI-APPRAISAL-2012": Object.freeze({
    sourceId: "CWC-TAPI-APPRAISAL-2012",
    authority: "Central Water Commission, Government of India",
    title: "Appraisal Report — Tapi Basin",
    url: "https://cwc.gov.in/sites/default/files/ntbouser/apprisal-report-tapi-2012-january-2013.pdf",
    role: "TAPI_TRIBUTARY_BANK_AUTHORITY",
  }),
  "CWC-MAHI-WYB-2017-18": Object.freeze({
    sourceId: "CWC-MAHI-WYB-2017-18",
    authority: "Central Water Commission, Government of India",
    title: "Water Year Book — Mahi Basin",
    url: "https://www.cwc.gov.in/sites/default/files/admin/9BMBWYB17-18.pdf",
    role: "PRIMARY_MAHI_AUTHORITY",
  }),
  "CWC-SABARMATI-TRACE-METALS-2018": Object.freeze({
    sourceId: "CWC-SABARMATI-TRACE-METALS-2018",
    authority: "Central Water Commission, Government of India",
    title: "Status of Trace and Toxic Metals in Indian Rivers — Sabarmati Basin",
    url: "https://cwc.gov.in/sites/default/files/status_trace_toxic_materials_indian_rivers.pdf",
    role: "PRIMARY_SABARMATI_AUTHORITY",
  }),
  "CWC-HYDRO-DATA-2021-WEST": Object.freeze({
    sourceId: "CWC-HYDRO-DATA-2021-WEST",
    authority: "Central Water Commission, Government of India",
    title: "Hydrological Data (Unclassified) Book 2021 — West-flowing basins",
    url: "https://cwc.gov.in/sites/default/files/hydrological-data-unclassified-book-2021.pdf",
    role: "LUNI_AND_WEST_COAST_AUTHORITY",
  }),
});

export type GeoRiv001Cp006SourceId = keyof typeof GEO_RIV_001_CP006_SOURCE_AUTHORITIES_V1;

export function toGeoRiv001Cp006FactSource(sourceId: string, locator: string) {
  const source = GEO_RIV_001_CP006_SOURCE_AUTHORITIES_V1[sourceId as GeoRiv001Cp006SourceId];
  if (!source) throw new Error(`Unknown GEO-RIV-001 CP006 source authority: ${sourceId}`);
  return { sourceId: source.sourceId, authority: source.authority, title: source.title, url: source.url, locator };
}
