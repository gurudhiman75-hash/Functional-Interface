import type { KnowledgeFactSource } from "../../types";
import { toGeoRiv001FactSource } from "./geo-riv-001-source-authorities";

export type GeoRiv001Cp003SourceAuthority = {
  sourceId: string;
  title: string;
  url: string;
  sourceType: KnowledgeFactSource["sourceType"];
  supports: string[];
  verifiedOn: string;
  notes: string[];
};

export const GEO_RIV_001_CP003_SOURCE_AUTHORITIES: GeoRiv001Cp003SourceAuthority[] = [
  {
    sourceId: "NMCG-COURSE-OF-GANGA",
    title: "National Mission for Clean Ganga — Course of Ganga",
    url: "https://nmcg.nic.in/courseofganga.aspx",
    sourceType: "official",
    supports: [
      "bhagirathi-source-stream",
      "gangotri-gaumukh",
      "devprayag-ganga-formation",
      "haridwar-plains-entry",
      "ganga-bay-of-bengal",
    ],
    verifiedOn: "2026-09-10",
    notes: [
      "Use for the current official description of the Ganga source stream and upper-course anchors.",
      "Avoid freezing exact elevations/lengths when they are not needed for the tested relation.",
    ],
  },
  {
    sourceId: "NMCG-HYDROLOGY-GANGA-BASIN",
    title: "National Mission for Clean Ganga — Hydrology of Ganga Basin",
    url: "https://www.nmcg.nic.in/hydrology.aspx",
    sourceType: "official",
    supports: [
      "ganga-major-tributaries",
      "yamuna-sone-ghaghara-kosi",
      "ganga-basin-hydrology",
    ],
    verifiedOn: "2026-09-10",
    notes: [
      "Use only durable hydrological relations in Static GK generation.",
      "Do not generate current water-flow or annual-yield questions from this source without a freshness gate.",
    ],
  },
  {
    sourceId: "INDIA-WRIS-GANGA-BASIN-V2",
    title: "India-WRIS — Ganga Basin Report, Version 2.0",
    url: "https://indiawris.gov.in/downloads/Ganga%20Basin.pdf",
    sourceType: "official",
    supports: [
      "panch-prayag",
      "ganga-principal-tributaries",
      "left-right-bank-tributaries",
      "yamuna-source-and-tributaries",
      "ramganga",
      "gomti",
      "ghaghara",
      "gandak",
      "kosi",
      "sone",
      "farakka-padma-bhagirathi-hooghly",
    ],
    verifiedOn: "2026-09-10",
    notes: [
      "Primary CP003 hydrological relation authority for tributaries, confluences and Panch Prayag.",
      "Legacy place names in the report may be normalized only when a current official place authority is separately available.",
    ],
  },
  {
    sourceId: "PRAYAGRAJ-DISTRICT-SANGAM",
    title: "District Prayagraj, Government of Uttar Pradesh — Sangam / Geography",
    url: "https://prayagraj.nic.in/geography/",
    sourceType: "official",
    supports: [
      "prayagraj-current-place-name",
      "ganga-yamuna-confluence-prayagraj",
    ],
    verifiedOn: "2026-09-10",
    notes: [
      "Use to normalize older Allahabad references to current learner-facing Prayagraj wording.",
      "Use only the geographic Ganga-Yamuna confluence claim; do not encode religious or mythological claims as geography facts.",
    ],
  },
];

export function getGeoRiv001Cp003SourceAuthority(sourceId: string) {
  const authority = GEO_RIV_001_CP003_SOURCE_AUTHORITIES.find((entry) => entry.sourceId === sourceId);
  if (!authority) throw new Error(`Unknown GEO-RIV-001 CP003 source authority ${sourceId}`);
  return authority;
}

export function toGeoRiv001Cp003FactSource(sourceId: string, locator: string): KnowledgeFactSource {
  if (sourceId === "NCERT-CONTEMPORARY-INDIA-I-DRAINAGE") {
    return toGeoRiv001FactSource(sourceId, locator);
  }
  const authority = getGeoRiv001Cp003SourceAuthority(sourceId);
  return {
    sourceId: authority.sourceId,
    sourceType: authority.sourceType,
    title: authority.title,
    url: authority.url,
    locator,
  };
}

export function auditGeoRiv001Cp003SourceAuthorities() {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const source of GEO_RIV_001_CP003_SOURCE_AUTHORITIES) {
    if (ids.has(source.sourceId)) issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    ids.add(source.sourceId);
    if (!source.title.trim()) issues.push(`MISSING_TITLE:${source.sourceId}`);
    if (!source.url.trim()) issues.push(`MISSING_URL:${source.sourceId}`);
    if (!source.supports.length) issues.push(`NO_SUPPORT_SCOPE:${source.sourceId}`);
    if (!Number.isFinite(Date.parse(source.verifiedOn))) issues.push(`INVALID_VERIFIED_ON:${source.sourceId}`);
  }
  return {
    valid: issues.length === 0,
    sourceCount: GEO_RIV_001_CP003_SOURCE_AUTHORITIES.length,
    issues,
  };
}
