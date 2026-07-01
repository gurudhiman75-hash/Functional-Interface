import type {
  ApprovedStemReference,
  Pct001PercentOfKnownQlId,
} from "./types";

function approved(
  qlId: Pct001PercentOfKnownQlId,
): ApprovedStemReference {
  return {
    ownership: "HUMAN_OWNED",
    provenanceStatus: "APPROVED",
    cpId: "PCT-CP-002",
    qlId,
    sourceFile: "question-language.en.json",
    stemFamilyId: `PCT-CP-002:${qlId}`,
  };
}

export const PCT_001_APPROVED_STEM_REFERENCES = {
  "PCT-QL-017": approved("PCT-QL-017"),
  "PCT-QL-117": approved("PCT-QL-117"),
  "PCT-QL-217": approved("PCT-QL-217"),
  "PCT-QL-317": approved("PCT-QL-317"),
  "PCT-QL-417": approved("PCT-QL-417"),
} as const;

