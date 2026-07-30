import {
  NUM_CP004_RETAINED_TEMPLATE_REGISTRY,
  type NumCp004RetainedSolveModeId,
  type NumCp004Representation,
  type NumCp004TaskDirection,
} from "../completion/template-registry";
import type {
  NumCp004AnswerSemantic,
  NumCp004RetainedTemplateId,
} from "../completion/types";

export const NUM_CP004_PERMANENT_QL_IDS = [
  "NUM-QL-018", "NUM-QL-019", "NUM-QL-020", "NUM-QL-021",
  "NUM-QL-022", "NUM-QL-023", "NUM-QL-024", "NUM-QL-025",
  "NUM-QL-026", "NUM-QL-027", "NUM-QL-028", "NUM-QL-029",
  "NUM-QL-030", "NUM-QL-031", "NUM-QL-032", "NUM-QL-033",
  "NUM-QL-034", "NUM-QL-035", "NUM-QL-036", "NUM-QL-037",
  "NUM-QL-038", "NUM-QL-039", "NUM-QL-040", "NUM-QL-041",
  "NUM-QL-042", "NUM-QL-043", "NUM-QL-044", "NUM-QL-045",
] as const;

export type NumCp004PermanentQlId =
  (typeof NUM_CP004_PERMANENT_QL_IDS)[number];

export type NumCp004PermanentQlTemplateId = `NUM-CP004-QLC-${string}`;

export interface NumCp004PermanentAllocationEntry {
  readonly qlId: NumCp004PermanentQlId;
  readonly packageId: "NUM-001";
  readonly cpId: "NUM-CP-004";
  readonly qlTemplateId: NumCp004PermanentQlTemplateId;
  readonly temporaryTemplateId: NumCp004RetainedTemplateId;
  readonly title: string;
  readonly solveModeId: NumCp004RetainedSolveModeId;
  readonly taskDirection: NumCp004TaskDirection;
  readonly answerSemantic: NumCp004AnswerSemantic;
  readonly representation: NumCp004Representation;
  readonly targetProjection: string;
  readonly sourceEvidence: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly difficultyPolicy: "STATE_DERIVED";
  readonly language: "en";
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly active: false;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly publiclyPublishable: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
}

const TEMPLATE_CODE_BY_INDEX = [
  "PRIME-STATUS-CLASSIFICATION",
  "PRIME-INTERVAL-COMPLETE-SET",
  "PRIME-INTERVAL-COUNT",
  "ADJACENT-OR-EXTREME-PRIME",
  "DIGIT-RANGE-PRIME",
  "PRIME-CLAIM-VERIFICATION",
  "COMPLETE-PRIME-FACTORISATION",
  "PRIME-FACTOR-EXTREMUM",
  "DISTINCT-PRIME-FACTOR-COUNT",
  "MULTIPLICITY-PRIME-FACTOR-COUNT",
  "INTEGER-FROM-PRIME-POWERS",
  "PRIME-EXPONENT-STRUCTURE-COMPARISON",
  "MISSING-PRIME",
  "MISSING-EXPONENT",
  "COPRIME-PAIR-SELECTION",
  "COPRIME-COMPLETE-CANDIDATE-SET",
  "COPRIME-CANDIDATE-COUNT",
  "COPRIME-UNKNOWN-RECOVERY",
  "PAIRWISE-COLLECTIVE-COPRIMALITY",
  "COPRIME-CLAIM-VERIFICATION",
  "PRIME-PAIR-RECONSTRUCTION",
  "PRIME-TRIPLE-RECONSTRUCTION",
  "LEAST-PRIME-DIVISOR",
  "CONSTRUCTED-EXPRESSION-PRIME-DIVISOR",
  "PRIME-STRUCTURE-FEASIBILITY",
  "FACTOR-TREE-COMPLETION",
  "PRIME-DATA-SUFFICIENCY",
  "NEAREST-PRIME-MINIMUM-ADJUSTMENT",
] as const;

if (NUM_CP004_RETAINED_TEMPLATE_REGISTRY.length !== NUM_CP004_PERMANENT_QL_IDS.length) {
  throw new Error("NUM-CP-004 retained/allocation count mismatch");
}

export const NUM_CP004_PERMANENT_ALLOCATION =
  NUM_CP004_RETAINED_TEMPLATE_REGISTRY.map((retained, index) => ({
    qlId: NUM_CP004_PERMANENT_QL_IDS[index]!,
    packageId: "NUM-001" as const,
    cpId: "NUM-CP-004" as const,
    qlTemplateId: `NUM-CP004-QLC-${TEMPLATE_CODE_BY_INDEX[index]!}` as NumCp004PermanentQlTemplateId,
    temporaryTemplateId: retained.temporaryTemplateId,
    title: retained.title,
    solveModeId: retained.solveModeId,
    taskDirection: retained.taskDirection,
    answerSemantic: retained.answerSemantic,
    representation: retained.representation,
    targetProjection: retained.targetProjection,
    sourceEvidence: retained.sourceEvidence,
    prototypeAncestry: retained.prototypeAncestry,
    difficultyPolicy: "STATE_DERIVED" as const,
    language: "en" as const,
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION" as const,
    permanentIdentityFrozen: true as const,
    active: false as const,
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN" as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
  })) satisfies readonly NumCp004PermanentAllocationEntry[];

const allocationByQlId = new Map<NumCp004PermanentQlId, NumCp004PermanentAllocationEntry>(
  NUM_CP004_PERMANENT_ALLOCATION.map((entry) => [entry.qlId, entry]),
);

export function getNumCp004PermanentAllocation(
  qlId: NumCp004PermanentQlId,
): NumCp004PermanentAllocationEntry {
  const entry = allocationByQlId.get(qlId);
  if (!entry) throw new Error(`Unknown NUM-CP-004 permanent QL ID: ${qlId}`);
  return entry;
}
