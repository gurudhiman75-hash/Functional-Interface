import { auditGeoRiv001Cp001ReviewBatchV2B } from "./geo-riv-001-cp001-review-batch-v2b";
import { generateGeoRiv001Cp001ReviewV2C } from "./geo-riv-001-cp001-review-generator-v2c";
import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";

export const GEO_RIV_001_CP001_REVIEW_COUNTS_V2C: Record<string, number> = {
  "GEO-RIV-001-QL-001": 4,
  "GEO-RIV-001-QL-002": 4,
  "GEO-RIV-001-QL-003": 6,
  "GEO-RIV-001-QL-004": 6,
  "GEO-RIV-001-QL-005": 8,
  "GEO-RIV-001-QL-006": 7,
  "GEO-RIV-001-QL-007": 7,
  "GEO-RIV-001-QL-008": 6,
  "GEO-RIV-001-QL-009": 6,
};

export const GEO_RIV_001_CP001_REVIEW_BATCH_V2C: GeoRiv001Cp001ReviewQuestion[] =
  Object.entries(GEO_RIV_001_CP001_REVIEW_COUNTS_V2C).flatMap(([qlId, count]) =>
    Array.from({ length: count }, (_, index) =>
      generateGeoRiv001Cp001ReviewV2C(
        qlId,
        `geo-riv-001-cp001-review-v2c-${qlId}-${String(index + 1).padStart(2, "0")}`,
      ),
    ),
  );

export function auditGeoRiv001Cp001ReviewBatchV2C() {
  return auditGeoRiv001Cp001ReviewBatchV2B(GEO_RIV_001_CP001_REVIEW_BATCH_V2C);
}
