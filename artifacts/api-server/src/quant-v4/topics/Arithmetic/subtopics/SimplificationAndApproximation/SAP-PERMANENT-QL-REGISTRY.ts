import {
  SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL,
  type SapCp001EnglishTemplateId,
} from "./SAP-001/SAP-CP-001/SAP-CP-001-ENGLISH-TEMPLATE-PROPOSAL";
import {
  SAP_CP002_ENGLISH_TEMPLATE_AUTHORITIES,
  type SapCp002EnglishTemplateId,
} from "./SAP-001/SAP-CP-002/SAP-CP-002-AUTHORITY-AND-TEMPLATE-MAP";
import {
  SAP_CP002_PERMANENT_QL_IDS,
  SAP_CP002_TEMPLATE_TO_PERMANENT_QL,
  type SapCp002PermanentQlId,
} from "./SAP-001/SAP-CP-002/permanent-runtime/runtime";
import {
  SAP_CP003_PROTOTYPE_AUTHORITIES,
} from "./SAP-001/SAP-CP-003/catalogue";
import type { SapCp003PrototypeId } from "./SAP-001/SAP-CP-003/types";
import {
  SAP_CP003_PERMANENT_QL_IDS,
  SAP_CP003_PROTOTYPE_TO_PERMANENT_QL,
  type SapCp003PermanentQlId,
} from "./SAP-001/SAP-CP-003/permanent-runtime/runtime";

export const SAP_CP001_PERMANENT_QL_IDS = [
  "SAP-QL-001", "SAP-QL-002", "SAP-QL-003", "SAP-QL-004", "SAP-QL-005", "SAP-QL-006",
  "SAP-QL-007", "SAP-QL-008", "SAP-QL-009", "SAP-QL-010", "SAP-QL-011", "SAP-QL-012",
  "SAP-QL-013", "SAP-QL-014", "SAP-QL-015", "SAP-QL-016",
] as const;

export type SapCp001PermanentQlId = (typeof SAP_CP001_PERMANENT_QL_IDS)[number];
export type SapPermanentQlId = SapCp001PermanentQlId | SapCp002PermanentQlId | SapCp003PermanentQlId;
export type SapPermanentTemplateId = SapCp001EnglishTemplateId | SapCp002EnglishTemplateId | SapCp003PrototypeId;

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
  readonly checkpointId: "SAP-CP-001" | "SAP-CP-002" | "SAP-CP-003";
  readonly templateId: SapPermanentTemplateId;
  readonly title: string;
  readonly solveAuthority: string;
  readonly answerSemantic: string;
  readonly taskDirections: readonly string[];
  readonly representations: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly englishStatus:
    | "ENGLISH_MANUAL_FREEZE_APPROVED"
    | "QUESTION_AND_ANSWER_REVIEW_APPROVED_EXPLANATION_FREEZE_PENDING";
  readonly allocationApproval:
    | "PRODUCT_OWNER_APPROVED_2026_08_03"
    | "PRODUCT_OWNER_DIRECTED_CP002_COMPLETION_2026_08_04"
    | "PRODUCT_OWNER_APPROVED_CP003_QA_2026_08_07";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

const cp001Entries: readonly SapPermanentQlRegistryEntry[] = SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL.map((template) => Object.freeze({
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
}));

const cp002Entries: readonly SapPermanentQlRegistryEntry[] = SAP_CP002_ENGLISH_TEMPLATE_AUTHORITIES.map((template) => Object.freeze({
  permanentQlId: SAP_CP002_TEMPLATE_TO_PERMANENT_QL[template.templateId],
  packageId: "SAP-001" as const,
  checkpointId: "SAP-CP-002" as const,
  templateId: template.templateId,
  title: template.title,
  solveAuthority: template.solveAuthority,
  answerSemantic: template.answerSemantic,
  taskDirections: template.taskDirections,
  representations: template.representations,
  prototypeAncestry: template.prototypeAncestry,
  allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
  englishStatus: "ENGLISH_MANUAL_FREEZE_APPROVED" as const,
  allocationApproval: "PRODUCT_OWNER_DIRECTED_CP002_COMPLETION_2026_08_04" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
}));

const cp003Entries: readonly SapPermanentQlRegistryEntry[] = SAP_CP003_PROTOTYPE_AUTHORITIES.map((authority) => Object.freeze({
  permanentQlId: SAP_CP003_PROTOTYPE_TO_PERMANENT_QL[authority.prototypeId],
  packageId: "SAP-001" as const,
  checkpointId: "SAP-CP-003" as const,
  templateId: authority.prototypeId,
  title: authority.title,
  solveAuthority: authority.solveAuthority,
  answerSemantic: authority.answerSemantic,
  taskDirections: Object.freeze([authority.taskDirection]),
  representations: authority.representations,
  prototypeAncestry: Object.freeze([authority.prototypeId]),
  allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
  englishStatus: "QUESTION_AND_ANSWER_REVIEW_APPROVED_EXPLANATION_FREEZE_PENDING" as const,
  allocationApproval: "PRODUCT_OWNER_APPROVED_CP003_QA_2026_08_07" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
}));

export const SAP_PERMANENT_QL_REGISTRY: readonly SapPermanentQlRegistryEntry[] = Object.freeze([
  ...cp001Entries,
  ...cp002Entries,
  ...cp003Entries,
]);

export const SAP_PERMANENT_QL_BY_ID: Readonly<Record<SapPermanentQlId, SapPermanentQlRegistryEntry>> = Object.freeze(
  Object.fromEntries(SAP_PERMANENT_QL_REGISTRY.map((entry) => [entry.permanentQlId, entry])) as Record<SapPermanentQlId, SapPermanentQlRegistryEntry>,
);

export const SAP_PERMANENT_QL_REGISTRY_STATE = Object.freeze({
  registryVersion: 3,
  allocatedCheckpointCount: 3,
  allocatedTemplateCount: SAP_PERMANENT_QL_REGISTRY.length,
  firstAllocatedId: "SAP-QL-001" as const,
  lastAllocatedId: "SAP-QL-052" as const,
  nextAvailableId: "SAP-QL-053" as const,
  allocatedRange: "SAP-QL-001..SAP-QL-052" as const,
  cp001Range: "SAP-QL-001..SAP-QL-016" as const,
  cp002Range: "SAP-QL-017..SAP-QL-033" as const,
  cp003Range: "SAP-QL-034..SAP-QL-052" as const,
  activeQlCount: 0,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
});

export {
  SAP_CP002_PERMANENT_QL_IDS,
  SAP_CP002_TEMPLATE_TO_PERMANENT_QL,
  SAP_CP003_PERMANENT_QL_IDS,
  SAP_CP003_PROTOTYPE_TO_PERMANENT_QL,
};
