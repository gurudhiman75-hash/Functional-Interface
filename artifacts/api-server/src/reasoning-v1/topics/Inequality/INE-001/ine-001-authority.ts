export const INE_001_PACKAGE_ID = "INE-001" as const;
export const INE_001_RUNTIME_MODE = "review-only" as const;
export const INE_001_FREEZE_VERSION = "INE_001_CONTENT_FREEZE_2026_10_03_V1" as const;

export type IneQlId =
  | "INE-QL-001"
  | "INE-QL-002"
  | "INE-QL-003"
  | "INE-QL-004";

export type IneCheckpointId =
  | "INE-CP-001"
  | "INE-CP-002"
  | "INE-CP-003"
  | "INE-CP-004";

export const INE_001_QL_AUTHORITIES = Object.freeze([
  Object.freeze({
    qlId: "INE-QL-001" as const,
    checkpointId: "INE-CP-001" as const,
    title: "Direct mathematical inequality",
    solveContract: "Resolve the exact relation between two named symbols from one connected or intentionally disconnected inequality graph.",
    answerSemantic: "RELATION_CLASS",
    supportedDifficulties: ["Easy", "Medium"] as const,
    sourceEvidenceRefs: [
      "repo:lib/motifs/inequality.ts::direct_inequality_reading",
      "repo:lib/motifs/inequality.ts::single_chain_deduction",
      "external:Testbook-SBI-guide-direct-mathematical-inequalities",
    ] as const,
  }),
  Object.freeze({
    qlId: "INE-QL-002" as const,
    checkpointId: "INE-CP-002" as const,
    title: "Conclusion-set inequality",
    solveContract: "Evaluate two supplied conclusions independently against the same inequality graph and classify Only I, Only II, Both or Neither.",
    answerSemantic: "CONCLUSION_SET",
    supportedDifficulties: ["Medium", "Hard"] as const,
    sourceEvidenceRefs: [
      "repo:lib/motifs/inequality.ts::compound_inequality_linking",
      "repo:lib/motifs/inequality.ts::indirect_conclusion_validation",
      "external:IBPS-SO-inequality-reasoning-analysis",
    ] as const,
  }),
  Object.freeze({
    qlId: "INE-QL-003" as const,
    checkpointId: "INE-CP-003" as const,
    title: "Either-or inequality",
    solveContract: "Recognise a complementary conclusion pair that is exhaustive although neither member is individually definite.",
    answerSemantic: "EITHER_OR_CLASS",
    supportedDifficulties: ["Medium", "Hard"] as const,
    sourceEvidenceRefs: [
      "repo:lib/motifs/inequality.ts::ded-ineq-either",
      "repo:lib/reasoning/inequality.ts::ded-ineq-either",
    ] as const,
  }),
  Object.freeze({
    qlId: "INE-QL-004" as const,
    checkpointId: "INE-CP-004" as const,
    title: "Coded inequality",
    solveContract: "Decode relation symbols first, then solve the resulting inequality graph and evaluate the conclusions.",
    answerSemantic: "CODED_CONCLUSION_SET",
    supportedDifficulties: ["Medium", "Hard"] as const,
    sourceEvidenceRefs: [
      "repo:lib/motifs/inequality.ts::ded-ineq-coded",
      "repo:lib/reasoning/inequality.ts::ded-ineq-coded",
      "external:IBPS-SO-coded-inequality-analysis",
    ] as const,
  }),
] as const);

export const INE_001_PERMANENT_QL_IDS = Object.freeze(
  INE_001_QL_AUTHORITIES.map((entry) => entry.qlId),
);

export const INE_001_CHECKPOINT_IDS = Object.freeze(
  INE_001_QL_AUTHORITIES.map((entry) => entry.checkpointId),
);

export const INE_001_CONTENT_CLOSURE = Object.freeze({
  authorityId: "INE_001_FINAL_CONTENT_DEEP_AUDIT_CLOSURE_20261003_V1" as const,
  status: "CONTENT_DEEP_AUDIT_CLOSED__4_QLS__EN_HI_PA__REVIEW_ONLY" as const,
  packageId: INE_001_PACKAGE_ID,
  permanentQlRange: "INE-QL-001..004" as const,
  permanentQlCount: 4 as const,
  nextAvailablePermanentQl: "INE-QL-005" as const,
  sourcePosture: "BANKING_CORE__SSC_AND_PUNJAB_SECONDARY__NO_FALSE_FREQUENCY_CLAIM" as const,
  sourceSaturationClaim: "CORE_FAMILY_CLOSURE_WITH_FUTURE_SOURCE_REOPEN_ALLOWED" as const,
  reviewGate: "MANUAL_EDITORIAL_OR_PRODUCT_APPROVAL_SEPARATE" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export function ine001AuthorityForQl(qlId: IneQlId) {
  const found = INE_001_QL_AUTHORITIES.find((entry) => entry.qlId === qlId);
  if (!found) throw new Error("Unknown INE-001 QL: " + qlId);
  return found;
}

export function isIne001QlId(value: string): value is IneQlId {
  return (INE_001_PERMANENT_QL_IDS as readonly string[]).includes(value);
}
