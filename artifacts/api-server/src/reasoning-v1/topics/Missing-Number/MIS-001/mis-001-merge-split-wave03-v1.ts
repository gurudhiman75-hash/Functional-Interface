export type Mis001ProposedSkillIdV1 =
  | "MIS-SKILL-001"
  | "MIS-SKILL-002"
  | "MIS-SKILL-003"
  | "MIS-SKILL-004"
  | "MIS-SKILL-005"
  | "MIS-SKILL-006"
  | "MIS-SKILL-007"
  | "MIS-SKILL-008"
  | "MIS-SKILL-009";

export interface Mis001ProposedSkillContractV1 {
  readonly skillId: Mis001ProposedSkillIdV1;
  readonly title: string;
  readonly learnerTask: string;
  readonly answerSemantic: "NUMBER";
  readonly parametersNotSeparateSkills: readonly string[];
}

export const MIS_001_PROPOSED_SKILL_CONTRACTS_V1: readonly Mis001ProposedSkillContractV1[] =
  Object.freeze([
    {
      skillId: "MIS-SKILL-001",
      title: "Basic two-input arithmetic relation",
      learnerTask: "Infer a repeated relation using two visible numeric inputs under one primitive arithmetic operation.",
      answerSemantic: "NUMBER",
      parametersNotSeparateSkills: ["SUM_VS_DIFFERENCE_VS_PRODUCT_VS_DIVISION", "MISSING_POSITION"],
    },
    {
      skillId: "MIS-SKILL-002",
      title: "Two-input compound arithmetic relation",
      learnerTask: "Infer a repeated two-input relation requiring an adjustment or second arithmetic step.",
      answerSemantic: "NUMBER",
      parametersNotSeparateSkills: ["CONSTANT_VALUE", "OPERATION_ORDER", "MISSING_POSITION"],
    },
    {
      skillId: "MIS-SKILL-003",
      title: "Three-input arithmetic relation",
      learnerTask: "Infer a repeated relation combining three visible inputs through ordinary arithmetic.",
      answerSemantic: "NUMBER",
      parametersNotSeparateSkills: ["PAIR_SELECTION", "ADD_SUBTRACT_MULTIPLY_DIVIDE", "MISSING_POSITION"],
    },
    {
      skillId: "MIS-SKILL-004",
      title: "Power-derived relation",
      learnerTask: "Infer a repeated relation in which squares, cubes or another power-derived term is essential.",
      answerSemantic: "NUMBER",
      parametersNotSeparateSkills: ["SQUARE_VS_CUBE", "POWER_POSITION", "SECOND_ARITHMETIC_STEP", "MISSING_POSITION"],
    },
    {
      skillId: "MIS-SKILL-005",
      title: "Consecutive or special-number property relation",
      learnerTask: "Infer a repeated relation based on consecutive-number structure or a standard number-property construction.",
      answerSemantic: "NUMBER",
      parametersNotSeparateSkills: ["NEXT_VS_PREVIOUS", "SUM_VS_PRODUCT", "TRIANGULAR_FORM"],
    },
    {
      skillId: "MIS-SKILL-006",
      title: "Triangle positional relation",
      learnerTask: "Infer the arithmetic relation among named triangle positions and recover the missing value.",
      answerSemantic: "NUMBER",
      parametersNotSeparateSkills: ["PAIR_SELECTION", "SUM_PRODUCT_DIFFERENCE", "MISSING_POSITION"],
    },
    {
      skillId: "MIS-SKILL-007",
      title: "Circle or sector positional relation",
      learnerTask: "Infer a repeated centre/surrounding or opposite-pair relation in a circular/sector figure.",
      answerSemantic: "NUMBER",
      parametersNotSeparateSkills: ["SURROUNDING_COUNT", "OPPOSITE_PAIRING", "SUM_PRODUCT_DIFFERENCE"],
    },
    {
      skillId: "MIS-SKILL-008",
      title: "Box or matrix positional pairing relation",
      learnerTask: "Infer a row, column, diagonal or grouped-pair relation in a box/matrix figure.",
      answerSemantic: "NUMBER",
      parametersNotSeparateSkills: ["ROWS_VS_COLUMNS_VS_DIAGONALS", "PAIR_OPERATION", "SHAPE", "EVIDENCE_COUNT"],
    },
    {
      skillId: "MIS-SKILL-009",
      title: "Digit-property relation",
      learnerTask: "Infer a repeated relation that operates on the digits of a visible number rather than treating it only as a whole number.",
      answerSemantic: "NUMBER",
      parametersNotSeparateSkills: ["DIGIT_SUM_PRODUCT_DIFFERENCE", "VISIBLE_ADJUSTMENT", "POWER_OF_DIGIT_AGGREGATE"],
    },
  ]);

const candidateGroups: Readonly<Record<Mis001ProposedSkillIdV1, readonly string[]>> = Object.freeze({
  "MIS-SKILL-001": ["MIS-CAND-001","MIS-CAND-002","MIS-CAND-003","MIS-CAND-004","MIS-CAND-057","MIS-CAND-058","MIS-CAND-079"],
  "MIS-SKILL-002": ["MIS-CAND-005","MIS-CAND-006","MIS-CAND-007","MIS-CAND-008","MIS-CAND-059"],
  "MIS-SKILL-003": ["MIS-CAND-009","MIS-CAND-010","MIS-CAND-011","MIS-CAND-012","MIS-CAND-013","MIS-CAND-014","MIS-CAND-015","MIS-CAND-061"],
  "MIS-SKILL-004": ["MIS-CAND-016","MIS-CAND-017","MIS-CAND-018","MIS-CAND-019","MIS-CAND-020","MIS-CAND-021","MIS-CAND-022","MIS-CAND-023","MIS-CAND-024","MIS-CAND-025","MIS-CAND-060","MIS-CAND-075","MIS-CAND-076","MIS-CAND-077","MIS-CAND-080","MIS-CAND-082"],
  "MIS-SKILL-005": ["MIS-CAND-026","MIS-CAND-027","MIS-CAND-028","MIS-CAND-029","MIS-CAND-030","MIS-CAND-031","MIS-CAND-032","MIS-CAND-033","MIS-CAND-034"],
  "MIS-SKILL-006": ["MIS-CAND-035","MIS-CAND-036","MIS-CAND-037","MIS-CAND-038","MIS-CAND-039","MIS-CAND-040","MIS-CAND-041","MIS-CAND-042","MIS-CAND-062"],
  "MIS-SKILL-007": ["MIS-CAND-043","MIS-CAND-044","MIS-CAND-045","MIS-CAND-046","MIS-CAND-047","MIS-CAND-048","MIS-CAND-049"],
  "MIS-SKILL-008": ["MIS-CAND-050","MIS-CAND-051","MIS-CAND-052","MIS-CAND-053","MIS-CAND-054","MIS-CAND-055","MIS-CAND-056","MIS-CAND-063","MIS-CAND-064","MIS-CAND-065","MIS-CAND-066","MIS-CAND-067","MIS-CAND-068","MIS-CAND-081","MIS-CAND-083"],
  "MIS-SKILL-009": ["MIS-CAND-069","MIS-CAND-070","MIS-CAND-071","MIS-CAND-072","MIS-CAND-073","MIS-CAND-074"],
});

export const MIS_001_EXCLUDED_CANDIDATES_V1 = Object.freeze(["MIS-CAND-078"] as const);
export const MIS_001_SOURCE_THIN_HOLD_CANDIDATES_V1 = Object.freeze(["MIS-CAND-034","MIS-CAND-072"] as const);

export const MIS_001_CANDIDATE_TO_PROPOSED_SKILL_V1: Readonly<Record<string, Mis001ProposedSkillIdV1>> =
  Object.freeze(Object.fromEntries(
    Object.entries(candidateGroups).flatMap(([skillId, candidateIds]) =>
      candidateIds.map((candidateId) => [candidateId, skillId as Mis001ProposedSkillIdV1] as const),
    ),
  ));

export const MIS_001_MERGE_SPLIT_WAVE03_V1 = Object.freeze({
  version: "MIS_001_MERGE_SPLIT_WAVE03_2026_09_27_V1" as const,
  status: "NINE_LEARNER_SKILL_CONTRACTS_PROPOSED__PERMANENT_QL_FREEZE_PENDING" as const,
  discoveredCandidateCount: 83 as const,
  activeRuntimePatternCount: 82 as const,
  excludedInvalidCount: 1 as const,
  proposedSkillContractCount: 9 as const,
  sourceThinHoldCount: 2 as const,
  formulaChangeCreatesNewSkill: false as const,
  rendererChangeCreatesNewSkill: false as const,
  missingPositionCreatesNewSkill: false as const,
  evidenceCountCreatesNewSkill: false as const,
  ruleCompetitionCreatesNewSkill: false as const,
  permanentQlAllocationAllowed: false as const,
  nextWave: "LEARNER_SURFACE_EXAM_REALISM_AND_EXPLANATION_AUDIT" as const,
});

export function mis001ProposedSkillForCandidateV1(candidateId: string): Mis001ProposedSkillIdV1 {
  const skill = MIS_001_CANDIDATE_TO_PROPOSED_SKILL_V1[candidateId];
  if (!skill) throw new Error("No MIS-001 proposed learner-skill mapping for " + candidateId);
  return skill;
}
