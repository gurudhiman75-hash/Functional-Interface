export type StaticGkGeometryKind =
  | "country-outline"
  | "admin-boundary"
  | "latitude"
  | "longitude"
  | "river"
  | "point"
  | "region"
  | "terrain";

export type StaticGkGeometryStatus = "source-selected" | "ingested" | "validated" | "approved" | "retired";

export interface StaticGkGeometryAsset {
  id: string;
  kind: StaticGkGeometryKind;
  name: string;
  version: string;
  sourcePublisher: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceProductCode?: string;
  sourceEdition?: string;
  licenseOrUsageNotes: string;
  status: StaticGkGeometryStatus;
  sourceFormat: "shapefile" | "geojson" | "vector-pdf" | "derived-coordinate" | "other";
  canonicalCrs: "EPSG:4326";
  storageUri?: string;
  checksumSha256?: string;
  derivedFromIds?: string[];
  validationNotes: string[];
  approvedAt?: string;
}

export const STATIC_GK_GEOMETRY_REGISTRY: StaticGkGeometryAsset[] = [
  {
    id: "geo.india.admin-boundaries.v1",
    kind: "admin-boundary",
    name: "India administrative boundaries up to district level",
    version: "1",
    sourcePublisher: "Survey of India",
    sourceTitle: "Administrative Boundary Database For entire country Upto Distt. level with HQ",
    sourceUrl: "https://onlinemaps.surveyofindia.gov.in/Digital_Products.aspx",
    sourceProductCode: "OVSF/1M/7",
    licenseOrUsageNotes: "Free Survey of India digital product. Preserve source metadata and comply with Survey of India usage conditions before public redistribution of derivative files.",
    status: "validated",
    sourceFormat: "shapefile",
    canonicalCrs: "EPSG:4326",
    checksumSha256: "ab3ef2d51a6c326f7e75a7d6e4fea1386476cb8c1f02599564af76f340f12001",
    validationNotes: [
      "Official OVSF/1M/7 archive acquired on 2026-08-30; source archive SHA-256 f44d665e6fa5e2102497799050e66f57369c11d9486ecfaec23ffcb7004ef38d.",
      "Canonical render bundle is derived only from the official DISTRICT_BOUNDARY layer: 36 state/UT outlines dissolved by official STATE_UT + STATE_LGD plus the original Mirzapur district polygon (DIST_LGD 199).",
      "Canonical bundle has 37 features across exactly 36 normalized state/UTs, zero invalid geometries, and EPSG:4326 bounds validation passed.",
      "Latitude 23.5 intersects Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram in the fact-locked west-to-east order.",
      "Longitude 82.5 intersects the retained official Mirzapur district polygon in Uttar Pradesh.",
      "Canonical geometry is intentionally not committed to Git pending redistribution/storage review; the ingest receipt is versioned under geometry/receipts.",
    ],
  },
  {
    id: "geo.india.outline.reference.v1",
    kind: "country-outline",
    name: "Official India outline reference",
    version: "1",
    sourcePublisher: "Survey of India",
    sourceTitle: "Outline Maps of India",
    sourceUrl: "https://surveyofindia.gov.in/pages/outline-maps-of-india",
    licenseOrUsageNotes: "Official Survey of India outline-map reference. Use to visually validate international outline depiction and follow applicable educational/website usage conditions.",
    status: "source-selected",
    sourceFormat: "vector-pdf",
    canonicalCrs: "EPSG:4326",
    validationNotes: [
      "Use as an independent visual QA reference for the derived country outline.",
      "Do not raster-trace this map when the approved administrative-boundary shapefile can supply vector geometry.",
    ],
  },
  {
    id: "geo.latitude.tropic-cancer.india.v1",
    kind: "latitude",
    name: "Tropic of Cancer across India",
    version: "1",
    sourcePublisher: "Examtree deterministic geometry compiler",
    sourceTitle: "Derived latitude line clipped to approved India geometry",
    sourceUrl: "internal://static-gk-visual-atlas/geometry-compiler",
    licenseOrUsageNotes: "Derived mathematical geometry. Underlying India clipping geometry must resolve to geo.india.admin-boundaries.v1 or its approved successor.",
    status: "source-selected",
    sourceFormat: "derived-coordinate",
    canonicalCrs: "EPSG:4326",
    derivedFromIds: ["geo.india.admin-boundaries.v1"],
    validationNotes: [
      "Generate from an explicit latitude parameter in the scene compiler; never hand-position against a screen image.",
      "Editorial label convention and mathematical render latitude are separate fields so textbook rounding cannot silently alter geometry.",
    ],
  },
  {
    id: "geo.longitude.82-30E.india.v1",
    kind: "longitude",
    name: "India Standard Meridian — 82°30′E",
    version: "1",
    sourcePublisher: "Examtree deterministic geometry compiler",
    sourceTitle: "82°30′E meridian clipped to approved India geometry",
    sourceUrl: "internal://static-gk-visual-atlas/geometry-compiler",
    licenseOrUsageNotes: "Derived mathematical geometry. Underlying India clipping geometry must resolve to geo.india.admin-boundaries.v1 or its approved successor.",
    status: "source-selected",
    sourceFormat: "derived-coordinate",
    canonicalCrs: "EPSG:4326",
    derivedFromIds: ["geo.india.admin-boundaries.v1"],
    validationNotes: [
      "Generate at longitude 82.5 degrees east and clip to the approved India geometry.",
      "Validate Mirzapur placement independently before render approval.",
    ],
  },
  {
    id: "geo.india.rivers.reference.v1",
    kind: "river",
    name: "India major rivers official reference",
    version: "1",
    sourcePublisher: "Survey of India",
    sourceTitle: "Outline Map of India with Major Rivers",
    sourceUrl: "https://surveyofindia.gov.in/UserFiles/files/21m_india_Rivers_N.pdf",
    licenseOrUsageNotes: "Official Survey of India reference map; use as visual QA/reference, not as the sole high-resolution production river geometry.",
    status: "source-selected",
    sourceFormat: "vector-pdf",
    canonicalCrs: "EPSG:4326",
    validationNotes: [
      "Use to cross-check major river topology against the production vector source selected for CP-003.",
      "Production Ganga/Bhagirathi/Alaknanda/Yamuna/Hooghly/Padma paths still require ingestible vector geometry and topology validation.",
    ],
  },
];
