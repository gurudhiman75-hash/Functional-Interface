import type { StaticGkGeometryIngestReceipt } from "./ingest-contract";

export const VALIDATED_SOI_ADMIN_RECEIPT: StaticGkGeometryIngestReceipt = {
  geometryId: "geo.india.admin-boundaries.v1",
  sourcePublisher: "Survey of India",
  sourceProductCode: "OVSF/1M/7",
  sourcePortalUrl: "https://onlinemaps.surveyofindia.gov.in/Digital_Products.aspx",
  acquiredAt: "2026-08-30",
  sourceArchiveFilename: "File_608117_7801054a2dcc4afcb41263d8e030b55c.zip",
  sourceArchiveSha256: "f44d665e6fa5e2102497799050e66f57369c11d9486ecfaec23ffcb7004ef38d",
  canonicalGeoJsonSha256: "ab3ef2d51a6c326f7e75a7d6e4fea1386476cb8c1f02599564af76f340f12001",
  canonicalCrs: "EPSG:4326",
  featureCount: 37,
  stateCount: 36,
  conversionTool: "GeoPandas 1.1.2 + pyproj 3.7.2 + Shapely 2.1.2 + Node.js 22 JSON.stringify",
  conversionCommandOrNotes:
    "Derived from official DISTRICT_BOUNDARY: EPSG:4326; 36 state/UT outlines dissolved by STATE_UT + STATE_LGD; original Mirzapur district DIST_LGD 199 retained; canonical object serialized with Node JSON.stringify.",
  reviewer: "Examtree Static GK Visual Atlas assisted ingest",
};
