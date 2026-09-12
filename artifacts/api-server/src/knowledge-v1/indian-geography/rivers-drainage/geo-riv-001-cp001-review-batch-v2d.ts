import { auditGeoRiv001Cp001ReviewBatchV2B } from "./geo-riv-001-cp001-review-batch-v2b";
import { generateGeoRiv001Cp001ReviewV2D } from "./geo-riv-001-cp001-review-generator-v2d";
import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";

const SEEDS_BY_QL: Record<string, string[]> = {
  "GEO-RIV-001-QL-001": ["x001", "x002", "x003", "x004"],
  "GEO-RIV-001-QL-002": ["x001", "x003", "x005", "x006"],
  "GEO-RIV-001-QL-003": ["x001", "x002", "x003", "x004", "x005", "x006"],
  "GEO-RIV-001-QL-004": ["x001", "x002", "x003", "x004", "x005", "x006"],
  "GEO-RIV-001-QL-005": ["x001", "x002", "x003", "x004", "x016", "x017", "x018", "x019"],
  "GEO-RIV-001-QL-006": ["x001", "x002", "x003", "x004", "x005", "x006", "x007"],
  "GEO-RIV-001-QL-007": ["x001", "x002", "x003", "x004", "x005", "x006", "x007"],
  "GEO-RIV-001-QL-008": ["x001", "x002", "x003", "x004", "x005", "x006"],
  "GEO-RIV-001-QL-009": ["x001", "x002", "x003", "x004", "x005", "x006"],
};

export const GEO_RIV_001_CP001_REVIEW_BATCH_V2D: GeoRiv001Cp001ReviewQuestion[] =
  Object.entries(SEEDS_BY_QL).flatMap(([qlId, suffixes]) =>
    suffixes.map((suffix) =>
      generateGeoRiv001Cp001ReviewV2D(
        qlId,
        `geo-riv-001-cp001-review-v2d-${qlId}-${suffix}`,
      ),
    ),
  );

export function auditGeoRiv001Cp001ReviewBatchV2D() {
  const baseline = auditGeoRiv001Cp001ReviewBatchV2B(
    GEO_RIV_001_CP001_REVIEW_BATCH_V2D,
  );
  const issues = [...baseline.issues];

  const ql001Answers = new Set(
    GEO_RIV_001_CP001_REVIEW_BATCH_V2D
      .filter((question) => question.qlId === "GEO-RIV-001-QL-001")
      .map((question) => question.canonicalAnswer),
  );
  for (const term of ["Drainage", "Drainage basin", "Water divide"]) {
    if (!ql001Answers.has(term)) issues.push(`QL001_MISSING_TERM:${term}`);
  }

  const ql003Answers = new Set(
    GEO_RIV_001_CP001_REVIEW_BATCH_V2D
      .filter((question) => question.qlId === "GEO-RIV-001-QL-003")
      .map((question) => question.canonicalAnswer),
  );
  for (const pattern of [
    "Dendritic drainage pattern",
    "Trellis drainage pattern",
    "Rectangular drainage pattern",
    "Radial drainage pattern",
  ]) {
    if (!ql003Answers.has(pattern)) issues.push(`QL003_MISSING_PATTERN:${pattern}`);
  }

  const ql005Stems = GEO_RIV_001_CP001_REVIEW_BATCH_V2D
    .filter((question) => question.qlId === "GEO-RIV-001-QL-005")
    .map((question) => question.stem)
    .join("\n");
  for (const signature of [
    "Himalayan river",
    "Peninsular river",
    "west-flowing Peninsular river",
    "Arabian Sea",
    "Bay of Bengal",
    "estuary",
  ]) {
    if (!ql005Stems.includes(signature)) issues.push(`QL005_MISSING_CLASS_SURFACE:${signature}`);
  }

  const allText = GEO_RIV_001_CP001_REVIEW_BATCH_V2D
    .flatMap((question) => [question.stem, ...question.options, question.explanation])
    .join("\n");
  for (const defect of ["a east-flowing", "an delta", "drains into Arabian Sea", "drains into Bay of Bengal"]) {
    if (allText.includes(defect)) issues.push(`EDITORIAL_DEFECT:${defect}`);
  }

  return {
    ...baseline,
    valid: issues.length === 0,
    issues,
  };
}
