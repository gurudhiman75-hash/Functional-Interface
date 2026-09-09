import type { KnowledgeFactSource } from "../../types";

export type GeoRiv001SourceAuthority = {
  sourceId: string;
  title: string;
  url: string;
  sourceType: KnowledgeFactSource["sourceType"];
  supports: string[];
  verifiedOn: string;
  notes: string[];
};

export const GEO_RIV_001_SOURCE_AUTHORITIES: GeoRiv001SourceAuthority[] = [
  {
    sourceId: "NCERT-CONTEMPORARY-INDIA-I-DRAINAGE",
    title: "NCERT — Contemporary India-I, Chapter 3: Drainage",
    url: "https://ncert.nic.in/textbook.php",
    sourceType: "textbook",
    supports: [
      "drainage-definition",
      "drainage-basin-definition",
      "water-divide-definition",
      "drainage-patterns",
      "himalayan-vs-peninsular-classification",
      "east-west-flowing-classification",
      "delta-estuary-foundations",
      "inland-drainage-foundations",
    ],
    verifiedOn: "2026-09-09",
    notes: [
      "Use the Class IX Contemporary India-I Drainage chapter as the educational convention authority.",
      "Exact page/section locators must be attached at fact-review time before a fact is frozen.",
    ],
  },
  {
    sourceId: "NCERT-SOCIAL-SCIENCE-TEACHER-MANUAL-KAVERI",
    title: "NCERT Social Science Teacher Manual — Sharing Water Resources: River Kaveri",
    url: "https://www.ncert.nic.in/pdf/announcement/otherannouncements/teachersandresearchers/social_science.pdf",
    sourceType: "textbook",
    supports: [
      "major-himalayan-river-examples",
      "major-peninsular-river-examples",
      "himalayan-vs-peninsular-classification",
    ],
    verifiedOn: "2026-09-09",
    notes: [
      "The manual explicitly groups Indus, Ganga and Brahmaputra as major Himalayan rivers and Narmada, Tapi, Godavari, Mahanadi, Krishna and Kaveri as major Peninsular rivers.",
      "Use as a corroborating NCERT authority; the Class IX Drainage chapter remains the primary educational source.",
    ],
  },
  {
    sourceId: "CWC-INDUS-BASIN-ORGANISATION",
    title: "Central Water Commission — Indus Basin Organisation: Basin Details",
    url: "https://cwc.gov.in/en/ibo/about-basins",
    sourceType: "official",
    supports: [
      "indus-system",
      "indus-tributaries",
      "indus-course",
      "indus-source",
      "indus-basin",
    ],
    verifiedOn: "2026-09-09",
    notes: [
      "Use for official hydrological descriptions of the Indus basin and major tributaries.",
    ],
  },
  {
    sourceId: "INDIA-WRIS-NARMADA-BASIN-V2",
    title: "India-WRIS — Narmada Basin Report, Version 2.0",
    url: "https://indiawris.gov.in/downloads/Narmada%20Basin.pdf",
    sourceType: "official",
    supports: [
      "narmada-west-flowing",
      "narmada-arabian-sea",
      "narmada-source",
      "narmada-estuary",
      "narmada-tributaries",
      "narmada-basin",
    ],
    verifiedOn: "2026-09-09",
    notes: [
      "Use for the durable west-flowing classification and Gulf of Khambhat/Arabian Sea outfall relation.",
      "Do not freeze exact length values in CP001 because published official values can vary by measurement convention.",
    ],
  },
  {
    sourceId: "INDIA-WRIS-GODAVARI-BASIN-V2",
    title: "India-WRIS — Godavari Basin Report, Version 2.0",
    url: "https://indiawris.gov.in/downloads/Godavari%20Basin.pdf",
    sourceType: "official",
    supports: [
      "godavari-bay-of-bengal",
      "godavari-source",
      "godavari-delta",
      "godavari-tributaries",
      "godavari-basin",
      "godavari-eastward-drainage",
    ],
    verifiedOn: "2026-09-09",
    notes: [
      "Use for Godavari basin membership, Bay of Bengal drainage, source region, delta and tributary relations.",
    ],
  },
];

export function getGeoRiv001SourceAuthority(sourceId: string) {
  const authority = GEO_RIV_001_SOURCE_AUTHORITIES.find(
    (entry) => entry.sourceId === sourceId,
  );
  if (!authority) {
    throw new Error(`Unknown GEO-RIV-001 source authority ${sourceId}`);
  }
  return authority;
}

export function toGeoRiv001FactSource(
  sourceId: string,
  locator: string,
): KnowledgeFactSource {
  const authority = getGeoRiv001SourceAuthority(sourceId);
  return {
    sourceId: authority.sourceId,
    sourceType: authority.sourceType,
    title: authority.title,
    url: authority.url,
    locator,
  };
}

export function auditGeoRiv001SourceAuthorities() {
  const issues: string[] = [];
  const ids = new Set<string>();

  for (const source of GEO_RIV_001_SOURCE_AUTHORITIES) {
    if (ids.has(source.sourceId)) {
      issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    }
    ids.add(source.sourceId);

    if (!source.title.trim()) issues.push(`MISSING_TITLE:${source.sourceId}`);
    if (!source.url.trim()) issues.push(`MISSING_URL:${source.sourceId}`);
    if (!source.supports.length) issues.push(`NO_SUPPORT_SCOPE:${source.sourceId}`);
    if (!Number.isFinite(Date.parse(source.verifiedOn))) {
      issues.push(`INVALID_VERIFIED_ON:${source.sourceId}`);
    }
  }

  return {
    valid: issues.length === 0,
    sourceCount: GEO_RIV_001_SOURCE_AUTHORITIES.length,
    issues,
  };
}
