import type { KnowledgeFactSource } from "../../types";

export const GEO_RIV_001_CP010_SOURCE_AUTHORITIES_V1 = Object.freeze({
  "BBMB-INDUS-BASIN": Object.freeze({
    sourceId: "BBMB-INDUS-BASIN",
    authority: "Bhakra Beas Management Board, Government of India",
    title: "Indus Basin — Development Projects after Independence",
    url: "https://bbmb.gov.in/indus-basin.htm",
    role: "BHAKRA_PONG_RIVER_PROJECT_AUTHORITY",
  }),
  "BBMB-BHAKRA": Object.freeze({
    sourceId: "BBMB-BHAKRA",
    authority: "Bhakra Beas Management Board, Government of India",
    title: "Bhakra Project / Bhakra Power Houses",
    url: "https://bbmb.gov.in/bhakra-project.htm",
    role: "BHAKRA_PROJECT_AUTHORITY",
  }),
  "THDC-TEHRI-HPP": Object.freeze({
    sourceId: "THDC-TEHRI-HPP",
    authority: "THDC India Limited, Government of India",
    title: "Tehri Hydro Power Project (1000 MW)",
    url: "https://thdc.co.in/en/node/258",
    role: "TEHRI_PROJECT_AUTHORITY",
  }),
  "ODISHA-HIRAKUD": Object.freeze({
    sourceId: "ODISHA-HIRAKUD",
    authority: "Government of Odisha, Sambalpur District Administration",
    title: "Hirakud Dam",
    url: "https://sambalpur.odisha.gov.in/en/tourism/tourist-places/hirakud-dam",
    role: "HIRAKUD_PROJECT_AUTHORITY",
  }),
  "KRMB-NAGARJUNA-SAGAR": Object.freeze({
    sourceId: "KRMB-NAGARJUNA-SAGAR",
    authority: "Krishna River Management Board, Government of India",
    title: "Nagarjuna Sagar Project",
    url: "https://krmb.gov.in/html/project24.html",
    role: "NAGARJUNA_SAGAR_PROJECT_AUTHORITY",
  }),
  "TN-METTUR": Object.freeze({
    sourceId: "TN-METTUR",
    authority: "Government of Tamil Nadu, Mettur Municipality",
    title: "Mettur Dam / Places of Interest",
    url: "https://www.tnurbantree.tn.gov.in/mettur/places-of-interest/",
    role: "METTUR_PROJECT_AUTHORITY",
  }),
  "GUJ-NWR-SARDAR-SAROVAR": Object.freeze({
    sourceId: "GUJ-NWR-SARDAR-SAROVAR",
    authority: "Narmada, Water Resources, Water Supply & Kalpsar Department, Government of Gujarat",
    title: "Annual Administrative Report — Sardar Sarovar (Narmada) Project",
    url: "https://guj-nwrws.gujarat.gov.in/downloads/final_formatted_admin_report_bhasha_niyamak_eng.pdf",
    role: "SARDAR_SAROVAR_PROJECT_AUTHORITY",
  }),
  "CWC-RESERVOIR-COMPENDIUM-2024": Object.freeze({
    sourceId: "CWC-RESERVOIR-COMPENDIUM-2024",
    authority: "Central Water Commission, Government of India",
    title: "Compendium on Sedimentation of Reservoirs in India, 2024 — Volume I",
    url: "https://cwc.gov.in/sites/default/files/vol-i-compendium-2024.pdf",
    role: "RESERVOIR_RIVER_STATE_CROSSCHECK_AUTHORITY",
  }),
  "CWC-FLOOD-SITREP-2023": Object.freeze({
    sourceId: "CWC-FLOOD-SITREP-2023",
    authority: "Central Water Commission, Government of India",
    title: "Daily Flood Situation Report — reservoir/project river table",
    url: "https://cwc.gov.in/sites/default/files/dfsitrepca-01.09.2023.pdf",
    role: "PROJECT_RIVER_STATE_CROSSCHECK_AUTHORITY",
  }),
});

export type GeoRiv001Cp010SourceId = keyof typeof GEO_RIV_001_CP010_SOURCE_AUTHORITIES_V1;

export function toGeoRiv001Cp010FactSource(sourceId: GeoRiv001Cp010SourceId, locator: string): KnowledgeFactSource {
  const source = GEO_RIV_001_CP010_SOURCE_AUTHORITIES_V1[sourceId];
  return {
    sourceId: source.sourceId,
    sourceType: "official",
    title: source.title,
    url: source.url,
    locator,
  };
}

export function auditGeoRiv001Cp010SourceAuthorities() {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const source of Object.values(GEO_RIV_001_CP010_SOURCE_AUTHORITIES_V1)) {
    if (ids.has(source.sourceId)) issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    ids.add(source.sourceId);
    if (!source.title.trim()) issues.push(`MISSING_TITLE:${source.sourceId}`);
    if (!source.url.startsWith("https://")) issues.push(`INVALID_URL:${source.sourceId}`);
  }
  return Object.freeze({ valid: issues.length === 0, sourceCount: ids.size, issues: Object.freeze(issues) });
}
