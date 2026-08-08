import { SAP_CP003_PROTOTYPE_AUTHORITIES } from "../catalogue";
import { generateSapCp003Package } from "../editorial-runtime";
import {
  SAP_CP003_PROTOTYPE_IDS,
  type SapCp003Package,
  type SapCp003PrototypeId,
} from "../types";

export const SAP_CP003_PERMANENT_QL_IDS = [
  "SAP-QL-034", "SAP-QL-035", "SAP-QL-036", "SAP-QL-037", "SAP-QL-038",
  "SAP-QL-039", "SAP-QL-040", "SAP-QL-041", "SAP-QL-042", "SAP-QL-043",
  "SAP-QL-044", "SAP-QL-045", "SAP-QL-046", "SAP-QL-047", "SAP-QL-048",
  "SAP-QL-049", "SAP-QL-050", "SAP-QL-051", "SAP-QL-052",
] as const;

export type SapCp003PermanentQlId = (typeof SAP_CP003_PERMANENT_QL_IDS)[number];

export const SAP_CP003_PROTOTYPE_TO_PERMANENT_QL: Readonly<Record<SapCp003PrototypeId, SapCp003PermanentQlId>> = Object.freeze({
  "SAP-CP003-PROT-TERMINATING-DECIMAL-EXPRESSION": "SAP-QL-034",
  "SAP-CP003-PROT-DECIMAL-FRACTION-MIXED-EXPRESSION": "SAP-QL-035",
  "SAP-CP003-PROT-DECIMAL-PRODUCT-PLACE-VALUE": "SAP-QL-036",
  "SAP-CP003-PROT-DECIMAL-DIVISION-POWER-OF-TEN": "SAP-QL-037",
  "SAP-CP003-PROT-DECIMAL-DIVISION-COMPATIBLE-FACTOR": "SAP-QL-038",
  "SAP-CP003-PROT-PERCENTAGE-AS-NUMERIC-FACTOR": "SAP-QL-039",
  "SAP-CP003-PROT-PERCENT-OF-QUANTITY-IN-EXPRESSION": "SAP-QL-040",
  "SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL": "SAP-QL-041",
  "SAP-CP003-PROT-CONVERT-TERMS-TO-FRACTIONS": "SAP-QL-042",
  "SAP-CP003-PROT-CONVERT-TERMS-TO-DECIMALS": "SAP-QL-043",
  "SAP-CP003-PROT-KNOWN-FRACTION-DECIMAL-EQUIVALENCE": "SAP-QL-044",
  "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION": "SAP-QL-045",
  "SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION": "SAP-QL-046",
  "SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS": "SAP-QL-047",
  "SAP-CP003-PROT-MISSING-DECIMAL-OPERAND": "SAP-QL-048",
  "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL": "SAP-QL-049",
  "SAP-CP003-PROT-COMPARE-FRACTION-DECIMAL-PERCENT": "SAP-QL-050",
  "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT": "SAP-QL-051",
  "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP": "SAP-QL-052",
});

export interface SapCp003PermanentPackage extends Omit<SapCp003Package, "lifecycle"> {
  readonly permanentQlId: SapCp003PermanentQlId;
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly approvalStatus: "ENGLISH_MANUAL_FREEZE_APPROVED";
  readonly lifecycle: {
    readonly permanentQlId: SapCp003PermanentQlId;
    readonly identityStatus: "PERMANENT_ID_ALLOCATED";
    readonly contentStatus: "ENGLISH_MANUAL_FREEZE_APPROVED";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export function generateSapCp003PermanentPackage(
  prototypeId: SapCp003PrototypeId,
  seed: number,
): SapCp003PermanentPackage {
  const reviewed = generateSapCp003Package(prototypeId, seed);
  const permanentQlId = SAP_CP003_PROTOTYPE_TO_PERMANENT_QL[prototypeId];
  return Object.freeze({
    ...reviewed,
    permanentQlId,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
    approvalStatus: "ENGLISH_MANUAL_FREEZE_APPROVED" as const,
    lifecycle: Object.freeze({
      permanentQlId,
      identityStatus: "PERMANENT_ID_ALLOCATED" as const,
      contentStatus: "ENGLISH_MANUAL_FREEZE_APPROVED" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    }),
  });
}

export function generateSapCp003PermanentSweep(
  seedsPerPrototype: number,
): readonly SapCp003PermanentPackage[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("SAP-CP-003 permanent sweep size must be a positive integer.");
  }
  const packages: SapCp003PermanentPackage[] = [];
  for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp003PermanentPackage(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}

export const SAP_CP003_PERMANENT_ALLOCATION = Object.freeze(
  SAP_CP003_PROTOTYPE_AUTHORITIES.map((authority) => Object.freeze({
    permanentQlId: SAP_CP003_PROTOTYPE_TO_PERMANENT_QL[authority.prototypeId],
    prototypeId: authority.prototypeId,
    solveMode: authority.solveMode,
    title: authority.title,
    solveAuthority: authority.solveAuthority,
    taskDirection: authority.taskDirection,
    answerSemantic: authority.answerSemantic,
    representations: authority.representations,
  })),
);

export const SAP_CP003_PERMANENT_STATE = Object.freeze({
  checkpointId: "SAP-CP-003" as const,
  permanentQlRange: "SAP-QL-034..SAP-QL-052" as const,
  permanentQlCount: SAP_CP003_PERMANENT_QL_IDS.length,
  nextAvailableQlId: "SAP-QL-053" as const,
  allocationApproval: "PRODUCT_OWNER_APPROVED_CP003_QA_2026_08_07" as const,
  editorialApproval: "PRODUCT_OWNER_APPROVED_CP003_EDITORIAL_V3_2026_08_08" as const,
  freezeApproval: "PRODUCT_OWNER_APPROVED_CP003_ENGLISH_FREEZE_2026_08_08" as const,
  questionAndAnswerReview: "APPROVED_EDITORIAL_REMEDIATION_V3" as const,
  fullEditorialReview: "FULL_300_QUESTION_HUMAN_APPROVED" as const,
  englishExplanationFreeze: "ENGLISH_MANUAL_FREEZE_APPROVED" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});
