import { GEO_RIV_001_CP005_FACTS } from "./geo-riv-001-cp005-facts";
import { auditGeoRiv001Cp005Facts } from "./geo-riv-001-cp005-validator";

const audit = auditGeoRiv001Cp005Facts();
if (!audit.valid) {
  throw new Error(`GEO-RIV-001 CP005 fact corpus failed editorial qualification: ${audit.issues.join(", ")}`);
}

export const GEO_RIV_001_CP005_REVIEWABLE_FACTS_V1 = Object.freeze(
  GEO_RIV_001_CP005_FACTS.map((fact) => Object.freeze(fact)),
);

export const GEO_RIV_001_CP005_EDITORIAL_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-RIV-001-CP005-EDITORIAL-REVIEW-V1" as const,
  status: "REVIEW_CANDIDATE" as const,
  factCount: audit.factCount,
  sourceCount: audit.sourceCount,
  wordingStandard: "SIMPLE_EXAM_LIKE" as const,
  visualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT" as const,
  runtimeRegistered: false as const,
});
