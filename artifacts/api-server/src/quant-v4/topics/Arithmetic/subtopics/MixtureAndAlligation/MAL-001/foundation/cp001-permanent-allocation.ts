import type { MalCp001DiscoveryPrototypeId } from "./cp001-gap-registry";
import type {
  MalCp001ProvisionalQlTemplateId,
  MalCp001ProvisionalSolveModeId,
} from "./cp001-ql-expansion-ledger";
import type {
  MalAnswerSemantic,
  MalDifficulty,
  MalTaskDirection,
} from "./types";

export const MAL_CP001_PERMANENT_QL_IDS = [
  "MAL-QL-001",
  "MAL-QL-002",
  "MAL-QL-003",
  "MAL-QL-004",
  "MAL-QL-005",
  "MAL-QL-006",
  "MAL-QL-007",
  "MAL-QL-008",
  "MAL-QL-009",
  "MAL-QL-010",
  "MAL-QL-011",
] as const;

export type MalCp001PermanentQlId =
  (typeof MAL_CP001_PERMANENT_QL_IDS)[number];

export interface MalCp001PermanentAllocationEntry {
  qlId: MalCp001PermanentQlId;
  cpId: "MAL-CP-001";
  qlTemplateId: MalCp001ProvisionalQlTemplateId;
  solveModeId: MalCp001ProvisionalSolveModeId;
  prototypeIds: readonly MalCp001DiscoveryPrototypeId[];
  taskDirection: MalTaskDirection;
  answerSemantic: MalAnswerSemantic;
  difficulty: MalDifficulty;
  language: "en";
  allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF";
  permanentIdentityFrozen: true;
  active: false;
  maturity: "IMPLEMENTATION_PROOF";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

/**
 * Permanent identities for the frozen English CP-001 foundation.
 *
 * Allocation does not imply release approval. Every row remains inactive and
 * unavailable to Question Studio, Question Bank and student/test routing until
 * a later release-specific gate changes those fields deliberately.
 */
export const MAL_CP001_PERMANENT_ALLOCATION:
  readonly MalCp001PermanentAllocationEntry[] = [
    {
      qlId: "MAL-QL-001",
      cpId: "MAL-CP-001",
      qlTemplateId: "MAL-CP001-QLC-TARGET-RATIO",
      solveModeId: "MAL-CP001-SM-TARGET-RATIO",
      prototypeIds: ["MAL-CP001-PROT-RATIO-FROM-TARGET"],
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_RATIO",
      difficulty: "Easy",
      language: "en",
      allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
      permanentIdentityFrozen: true,
      active: false,
      maturity: "IMPLEMENTATION_PROOF",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      qlId: "MAL-QL-002",
      cpId: "MAL-CP-001",
      qlTemplateId: "MAL-CP001-QLC-FINAL-MEAN-EXPLICIT-TWO",
      solveModeId: "MAL-CP001-SM-FINAL-MEAN",
      prototypeIds: ["MAL-CP001-PROT-MEAN-FROM-QUANTITIES"],
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MEAN_VALUE",
      difficulty: "Easy",
      language: "en",
      allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
      permanentIdentityFrozen: true,
      active: false,
      maturity: "IMPLEMENTATION_PROOF",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      qlId: "MAL-QL-003",
      cpId: "MAL-CP-001",
      qlTemplateId: "MAL-CP001-QLC-FINAL-MEAN-RATIO",
      solveModeId: "MAL-CP001-SM-FINAL-MEAN",
      prototypeIds: ["MAL-CP001-PROT-MEAN-FROM-RATIO"],
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MEAN_VALUE",
      difficulty: "Easy",
      language: "en",
      allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
      permanentIdentityFrozen: true,
      active: false,
      maturity: "IMPLEMENTATION_PROOF",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      qlId: "MAL-QL-004",
      cpId: "MAL-CP-001",
      qlTemplateId: "MAL-CP001-QLC-FINAL-MEAN-MULTI-COMPONENT",
      solveModeId: "MAL-CP001-SM-FINAL-MEAN",
      prototypeIds: ["MAL-CP001-PROT-THREE-COMPONENT-MEAN"],
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MEAN_VALUE",
      difficulty: "Medium",
      language: "en",
      allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
      permanentIdentityFrozen: true,
      active: false,
      maturity: "IMPLEMENTATION_PROOF",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      qlId: "MAL-QL-005",
      cpId: "MAL-CP-001",
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-SOURCE-QUANTITY-EVIDENCE",
      solveModeId: "MAL-CP001-SM-UNKNOWN-SOURCE-WEIGHTED-BALANCE",
      prototypeIds: ["MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE"],
      taskDirection: "INVERSE",
      answerSemantic: "SOURCE_VALUE",
      difficulty: "Medium",
      language: "en",
      allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
      permanentIdentityFrozen: true,
      active: false,
      maturity: "IMPLEMENTATION_PROOF",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      qlId: "MAL-QL-006",
      cpId: "MAL-CP-001",
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-SOURCE-RATIO-EVIDENCE",
      solveModeId: "MAL-CP001-SM-UNKNOWN-SOURCE-RATIO-EVIDENCE",
      prototypeIds: ["MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO"],
      taskDirection: "INVERSE",
      answerSemantic: "SOURCE_VALUE",
      difficulty: "Medium",
      language: "en",
      allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
      permanentIdentityFrozen: true,
      active: false,
      maturity: "IMPLEMENTATION_PROOF",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      qlId: "MAL-QL-007",
      cpId: "MAL-CP-001",
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-QUANTITY-ONE-KNOWN",
      solveModeId: "MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY",
      prototypeIds: [
        "MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY",
        "MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET",
      ],
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_QUANTITY",
      difficulty: "Medium",
      language: "en",
      allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
      permanentIdentityFrozen: true,
      active: false,
      maturity: "IMPLEMENTATION_PROOF",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      qlId: "MAL-QL-008",
      cpId: "MAL-CP-001",
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-QUANTITY-MULTI-KNOWN",
      solveModeId: "MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY",
      prototypeIds: ["MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY"],
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_QUANTITY",
      difficulty: "Hard",
      language: "en",
      allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
      permanentIdentityFrozen: true,
      active: false,
      maturity: "IMPLEMENTATION_PROOF",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      qlId: "MAL-QL-009",
      cpId: "MAL-CP-001",
      qlTemplateId: "MAL-CP001-QLC-RATIO-SCALE-BOTH-QUANTITIES",
      solveModeId: "MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL",
      prototypeIds: ["MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL"],
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_QUANTITY_PAIR",
      difficulty: "Medium",
      language: "en",
      allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
      permanentIdentityFrozen: true,
      active: false,
      maturity: "IMPLEMENTATION_PROOF",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      qlId: "MAL-QL-010",
      cpId: "MAL-CP-001",
      qlTemplateId: "MAL-CP001-QLC-RATIO-SCALE-REQUESTED-SHARE",
      solveModeId: "MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL",
      prototypeIds: ["MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET"],
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_QUANTITY",
      difficulty: "Medium",
      language: "en",
      allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
      permanentIdentityFrozen: true,
      active: false,
      maturity: "IMPLEMENTATION_PROOF",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
    {
      qlId: "MAL-QL-011",
      cpId: "MAL-CP-001",
      qlTemplateId: "MAL-CP001-QLC-TWO-STAGE-FINAL-MEAN",
      solveModeId: "MAL-CP001-SM-TWO-STAGE-FINAL-MEAN",
      prototypeIds: ["MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN"],
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MEAN_VALUE",
      difficulty: "Medium",
      language: "en",
      allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
      permanentIdentityFrozen: true,
      active: false,
      maturity: "IMPLEMENTATION_PROOF",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    },
  ] as const;

const allocationByQlId = new Map<MalCp001PermanentQlId, MalCp001PermanentAllocationEntry>(
  MAL_CP001_PERMANENT_ALLOCATION.map((entry) => [entry.qlId, entry]),
);

export function getMalCp001PermanentAllocation(
  qlId: MalCp001PermanentQlId,
): MalCp001PermanentAllocationEntry {
  const entry = allocationByQlId.get(qlId);
  if (!entry) throw new Error(`Unknown MAL-CP-001 permanent QL ID: ${qlId}.`);
  return entry;
}
