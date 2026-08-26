import {
  SEA002_CP008_SOURCE_EVIDENCE_V2,
  type Sea002Cp008Wave02SourceRecord,
} from "./source-saturation-v2.ts";

const WAVE04_SOURCE_EVIDENCE: readonly Sea002Cp008Wave02SourceRecord[] = Object.freeze([
  Object.freeze({
    id: "CP008-SRC-014",
    lineage: "BANKING_PRACTICE",
    sourceLabel: "PW Banking square-table reasoning set: twelve persons around a 60m square perimeter",
    sourceUrl: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/75e17457-758e-4e70-a1ea-9dde6a6a3a2f.pdf",
    schema: "ALT12_CORNER_PLUS_TWO_SIDE",
    facingMode: "ALL_IN",
    evidenceStrength: "ESTABLISHED_PREP_ARCHIVE",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-011"]),
    notes: "Twelve persons; one at each corner and two on each side, equally spaced around a 60m perimeter, all facing centre. The clue graph uses metric perimeter distances, opposite seats and left/right relations, establishing a source-backed extended-square solve family beyond ALT8.",
  }),
  Object.freeze({
    id: "CP008-SRC-015",
    lineage: "BANKING_PRACTICE",
    sourceLabel: "IBPS PO Mains reasoning archive, 17 Oct 2022: twelve-person role-derived square",
    sourceUrl: "https://www.bankersadda.com/reasoning-quizzes-for-ibps-po-mains-2022-17th-october/",
    schema: "ALT12_CORNER_PLUS_TWO_SIDE",
    facingMode: "CORNERS_OUT_SIDES_IN",
    evidenceStrength: "ESTABLISHED_PREP_ARCHIVE",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-005"]),
    notes: "Twelve persons; four occupy the corners and two persons sit along each side. Corner occupants face away from the centre and side occupants face inward. This independently source-proves the 12-seat role-derived facing scale variant represented by SIG-D.",
  }),
]);

export const SEA002_CP008_SOURCE_EVIDENCE_V3: readonly Sea002Cp008Wave02SourceRecord[] = Object.freeze([
  ...SEA002_CP008_SOURCE_EVIDENCE_V2,
  ...WAVE04_SOURCE_EVIDENCE,
]);

export const SEA002_CP008_WAVE04_SOURCE_DECISIONS = Object.freeze([
  Object.freeze({
    family: "ALT12_UNIFORM_INWARD_WITH_METRIC_DISTANCE",
    prototypeId: "SEA-CP008-PROT-011" as const,
    decision: "SOURCE_BACKED_DISTINCT_PRODUCTION_FAMILY" as const,
    rationale: "The 12-seat square introduces two side slots per side and source-natural 5m/10m/15m perimeter-distance constraints. Those operations are absent from ALT8 uniform-facing authority SIG-E.",
  }),
  Object.freeze({
    family: "ALT12_ROLE_DERIVED_FACING",
    prototypeId: "SEA-CP008-PROT-005" as const,
    decision: "SOURCE_BACKED_SCALE_VARIANT_MERGE_INTO_SIG_A" as const,
    rationale: "Established banking evidence now proves the 12-seat role-derived family. Its corner-versus-side facing rule and perimeter-relative deductions are the same solve graph as SIG-A; the extra side slots enlarge the square but do not add same-side or metric reasoning in this source family, so it belongs in SIG-A rather than consuming a new permanent QL.",
  }),
  Object.freeze({
    family: "ALT12_INDEPENDENT_MIXED_FACING",
    prototypeId: "SEA-CP008-PROT-010" as const,
    decision: "RETAIN_DISCOVERY_STRESS_ONLY" as const,
    rationale: "The mixed-facing 12-seat relay remains too weak for a production authority. It is excluded from the permanent solve set rather than inflating the QL registry from discovery-only evidence.",
  }),
] as const);

export const SEA002_CP008_SOURCE_SATURATION_V3 = Object.freeze({
  checkpointId: "SEA-CP-008" as const,
  status: "PRODUCTION_SOURCE_SATURATION_COMPLETE_WAVE04" as const,
  sourceRecordCount: SEA002_CP008_SOURCE_EVIDENCE_V3.length,
  officialPaperRelayCount: SEA002_CP008_SOURCE_EVIDENCE_V3.filter((record) => record.evidenceStrength === "OFFICIAL_PAPER_RELAY").length,
  establishedOrStrongerCount: SEA002_CP008_SOURCE_EVIDENCE_V3.filter((record) => record.evidenceStrength !== "DISCOVERY_ONLY").length,
  representedSchemas: Object.freeze([...new Set(SEA002_CP008_SOURCE_EVIDENCE_V3.map((record) => record.schema))]),
  representedFacingModes: Object.freeze([...new Set(SEA002_CP008_SOURCE_EVIDENCE_V3.map((record) => record.facingMode))]),
  productionSourceSaturationClaimed: true as const,
  sourceBackedScaleVariantsMergedIntoExistingAuthorities: Object.freeze([
    "ALT12_ROLE_DERIVED_FACING -> SEA-CP008-SIG-A",
  ] as const),
  stressOnlyFamiliesExcludedFromPermanentAllocation: Object.freeze([
    "ALT12_INDEPENDENT_MIXED_FACING",
  ] as const),
  permanentQlAllocated: false as const,
  questionStudioRegistered: false as const,
  questionBankWritable: false as const,
  publiclyPublishable: false as const,
  nextFreeQlId: "SEA-QL-029" as const,
});
