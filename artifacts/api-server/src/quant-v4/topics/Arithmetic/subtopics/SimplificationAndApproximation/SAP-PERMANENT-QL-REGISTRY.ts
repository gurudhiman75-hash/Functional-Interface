import {
  SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL,
  type SapCp001EnglishTemplateId,
  type SapCp001PrototypeId,
} from "./SAP-001/SAP-CP-001/SAP-CP-001-ENGLISH-TEMPLATE-PROPOSAL";

export const SAP_CP001_PERMANENT_QL_IDS = [
  "SAP-QL-001",
  "SAP-QL-002",
  "SAP-QL-003",
  "SAP-QL-004",
  "SAP-QL-005",
  "SAP-QL-006",
  "SAP-QL-007",
  "SAP-QL-008",
  "SAP-QL-009",
  "SAP-QL-010",
  "SAP-QL-011",
  "SAP-QL-012",
  "SAP-QL-013",
  "SAP-QL-014",
  "SAP-QL-015",
  "SAP-QL-016",
] as const;

export type SapCp001PermanentQlId = (typeof SAP_CP001_PERMANENT_QL_IDS)[number];
export type SapPermanentQlId = SapCp001PermanentQlId;

export const SAP_CP001_TEMPLATE_TO_PERMANENT_QL = Object.freeze({
  "SAP-CP001-TPL-MIXED-ORDER-OF-OPERATIONS": "SAP-QL-001",
  "SAP-CP001-TPL-MULTIPLY-DIVIDE-LEFT-TO-RIGHT": "SAP-QL-002",
  "SAP-CP001-TPL-ADD-SUBTRACT-LEFT-TO-RIGHT": "SAP-QL-003",
  "SAP-CP001-TPL-GROUPING-AND-BRACKET-SCOPE": "SAP-QL-004",
  "SAP-CP001-TPL-UNARY-SIGNED-OPERAND": "SAP-QL-005",
  "SAP-CP001-TPL-NEGATIVE-INTERMEDIATE-PROPAGATION": "SAP-QL-006",
  "SAP-CP001-TPL-SCOPED-OF-MULTIPLICATION": "SAP-QL-007",
  "SAP-CP001-TPL-IMPLICIT-GROUP-MULTIPLICATION": "SAP-QL-008",
  "SAP-CP001-TPL-FRACTION-BAR-SCOPE": "SAP-QL-009",
  "SAP-CP001-TPL-POWER-BEFORE-ARITHMETIC": "SAP-QL-010",
  "SAP-CP001-TPL-FACTORIAL-BEFORE-ARITHMETIC": "SAP-QL-011",
  "SAP-CP001-TPL-COMPARE-DIFFERENT-GROUPINGS": "SAP-QL-012",
  "SAP-CP001-TPL-SELECT-EQUIVALENT-GROUPING": "SAP-QL-013",
  "SAP-CP001-TPL-IDENTIFY-FIRST-VALID-STEP": "SAP-QL-014",
  "SAP-CP001-TPL-IDENTIFY-FIRST-INCORRECT-STEP": "SAP-QL-015",
  "SAP-CP001-TPL-PARTIAL-SUBEXPRESSION-EVALUATION": "SAP-QL-016",
} satisfies Readonly<Record<SapCp001EnglishTemplateId, SapCp001PermanentQlId>>);

export interface SapPermanentQlRegistryEntry {
  readonly permanentQlId: SapPermanentQlId;
  readonly packageId: "SAP-001";
  readonly checkpointId: "SAP-CP-001";
  readonly templateId: SapCp001EnglishTemplateId;
  readonly title: string;
  readonly solveAuthority: string;
  readonly answerSemantic: string;
  readonly taskDirections: readonly string[];
  readonly representations: readonly string[];
  readonly prototypeAncestry: readonly SapCp001PrototypeId[];
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly englishStatus: "ENGLISH_MANUAL_FREEZE_APPROVED";
  readonly allocationApproval: "PRODUCT_OWNER_APPROVED_2026_08_03";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export const SAP_PERMANENT_QL_REGISTRY: readonly SapPermanentQlRegistryEntry[] = Object.freeze(
  SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL.map((template) => Object.freeze({
    permanentQlId: SAP_CP001_TEMPLATE_TO_PERMANENT_QL[template.temporaryTemplateId],
    packageId: "SAP-001" as const,
    checkpointId: "SAP-CP-001" as const,
    templateId: template.temporaryTemplateId,
    title: template.title,
    solveAuthority: template.solveAuthority,
    answerSemantic: template.answerSemantic,
    taskDirections: template.taskDirections,
    representations: template.representations,
    prototypeAncestry: template.prototypeAncestry,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
    englishStatus: "ENGLISH_MANUAL_FREEZE_APPROVED" as const,
    allocationApproval: "PRODUCT_OWNER_APPROVED_2026_08_03" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  })),
);

export const SAP_PERMANENT_QL_BY_ID: Readonly<Record<SapPermanentQlId, SapPermanentQlRegistryEntry>> =
  Object.freeze(Object.fromEntries(
    SAP_PERMANENT_QL_REGISTRY.map((entry) => [entry.permanentQlId, entry]),
  ) as Record<SapPermanentQlId, SapPermanentQlRegistryEntry>);

export const SAP_PERMANENT_QL_REGISTRY_STATE = Object.freeze({
  registryVersion: 1,
  allocationApproval: "PRODUCT_OWNER_APPROVED_2026_08_03" as const,
  allocatedCheckpointCount: 1,
  allocatedTemplateCount: SAP_PERMANENT_QL_REGISTRY.length,
  firstAllocatedId: "SAP-QL-001" as const,
  lastAllocatedId: "SAP-QL-016" as const,
  nextAvailableId: "SAP-QL-017" as const,
  allocatedRange: "SAP-QL-001..SAP-QL-016" as const,
  activeQlCount: 0,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
});
