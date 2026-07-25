export const PNC_002_PACKAGE_ID = "PNC-002" as const;
export const PNC_002_CP_IDS = ["PNC-CP-007", "PNC-CP-008", "PNC-CP-009", "PNC-CP-010", "PNC-CP-011", "PNC-CP-012"] as const;
export const PNC_002_ACTIVE_CP_IDS = ["PNC-CP-007", "PNC-CP-008", "PNC-CP-009", "PNC-CP-010"] as const;
export type Pnc002CanonicalProblemId = (typeof PNC_002_CP_IDS)[number];
export type Pnc002ActiveCanonicalProblemId = (typeof PNC_002_ACTIVE_CP_IDS)[number];
export type Pnc002Language = "en" | "hi" | "pa";
export type Pnc002Difficulty = "Easy" | "Medium" | "Hard";
export type Pnc002Maturity = "DESIGN_LOCKED" | "RUNTIME_PROOF" | "MVP_QA" | "PRODUCTION_QA" | "MANUAL_REVIEW" | "FROZEN";
export type Pnc002AnswerType = "COUNT";
export type Pnc002TaskKind = "linearBlockRestriction" | "linearPositionGapRestriction" | "conditionalSelection" | "circularArrangement";
export type Pnc002Cp007SolveMode =
  | "countSingleBlockTogether" | "countSingleBlockNotTogether" | "countMultipleBlocksTogether"
  | "countBlockWithExternalPairApart" | "countTwoBlocksTogetherNotAdjacent" | "countBlockWithOutsiderNotAdjacent"
  | "countOneBlockTogetherOtherNotTogether" | "countNotAllSpecifiedBlocksTogether" | "recoverBlockRestrictionParameter";
export type Pnc002Cp008SolveMode =
  | "countObjectAtExactPosition" | "countObjectAtEitherEnd" | "countSpecifiedObjectsAtBothEnds" | "countObjectExcludedFromEnds"
  | "countPrescribedRelativeOrder" | "countIndependentRelativeOrderChains" | "countStrictAlternation"
  | "countNoTwoCategoryMembersAdjacent" | "countExactGapBetweenPair" | "countAtLeastGapBetweenPair"
  | "countSpecifiedObjectsInPositionClass" | "recoverPositionGapParameter"
  | "countObjectsAtPrescribedPositions" | "countSpecifiedSetInPositionSet" | "countAtMostGapBetweenPair"
  | "countDirectionalExactGapBetweenPair" | "countAtLeastSpecifiedObjectsInPositionClass";
export type Pnc002Cp009SolveMode =
  | "countWithCompulsoryMembers"
  | "countWithExcludedMembers"
  | "countWithCompulsoryAndExcludedMembers"
  | "countExactlyFromTwoCategories"
  | "countAtLeastFromTwoCategories"
  | "countAtMostFromTwoCategories"
  | "countAtLeastOneFromCategory"
  | "countAtLeastOneFromEachOfTwoCategories"
  | "countExactThreeCategoryDistribution"
  | "countAtLeastOneFromEachOfThreeCategories"
  | "countExactlyTSpecifiedMembers"
  | "countAtLeastOneSpecifiedMember"
  | "countNotAllSpecifiedMembersTogether"
  | "countAllOrNoneSpecifiedMembers"
  | "countImplicationBetweenSpecifiedMembers"
  | "countAtMostTSpecifiedMembers"
  | "countNamedCompulsoryWithCategoryQuota"
  | "countNamedExcludedWithCategoryQuota"
  | "recoverConditionalSelectionParameter"
  | "countSpecifiedMemberRange"
  | "countTwoCategoryRange";
export type Pnc002Cp010SolveMode =
  | "countRoundTableDistinct"
  | "countCircularSpecifiedBlockTogether"
  | "countCircularSpecifiedBlockApart"
  | "countCircularMultipleBlocksTogether"
  | "countCircularBlockWithExternalPairApart"
  | "countCircularTwoBlocksNotAdjacent"
  | "countCircularAtLeastOnePairTogether"
  | "countCircularNeitherPairTogether"
  | "countPersonBetweenTwoNeighbors"
  | "countOppositePair"
  | "countClockwiseAdjacentPair"
  | "countClockwiseExactGap"
  | "countClockwiseAtLeastGap"
  | "countClockwiseAtMostGap"
  | "countPrescribedClockwiseOrder"
  | "countCircularAlternation"
  | "countCircularNoTwoCategoryAdjacent"
  | "recoverCircularParameter"
  | "countRotationOnlyOrnaments"
  | "countDihedralDistinctOrnaments"
  | "countDihedralPairTogether";
export type Pnc002SolveMode = Pnc002Cp007SolveMode | Pnc002Cp008SolveMode | Pnc002Cp009SolveMode | Pnc002Cp010SolveMode;

export interface Pnc002QuestionLanguageEntry { qlId: string; cpId: Pnc002ActiveCanonicalProblemId; difficulty: Pnc002Difficulty; template: string; }
export interface Pnc002RegistryGroup {
  qlIds: string[]; cpId: Pnc002ActiveCanonicalProblemId; taskKind: Pnc002TaskKind; solveMode: Pnc002SolveMode;
  answerType: Pnc002AnswerType; explanationId: string; requiredVariables: string[]; scenarioFamily: string;
  constraintProfile: string; distractorProfile: string; difficulty: Pnc002Difficulty; active: boolean;
}
export interface Pnc002QuestionEntry extends Pnc002QuestionLanguageEntry {
  taskKind: Pnc002TaskKind; solveMode: Pnc002SolveMode; answerType: Pnc002AnswerType; explanationId: string;
  requiredVariables: string[]; scenarioFamily: string; constraintProfile: string; distractorProfile: string; active: boolean;
}
export interface Pnc002ParameterInput {
  canonicalProblemId?: Pnc002ActiveCanonicalProblemId; cpId?: Pnc002ActiveCanonicalProblemId; difficulty?: Pnc002Difficulty;
  difficultyBand?: Pnc002Difficulty; language?: Pnc002Language; questionLanguageId?: string; seed?: string;
}
export type Pnc002GeneratedValue = number | number[];
export interface Pnc002Parameters<TSolveMode extends Pnc002SolveMode = Pnc002Cp007SolveMode> {
  packageId: typeof PNC_002_PACKAGE_ID; canonicalProblemId: Pnc002ActiveCanonicalProblemId; questionLanguageId: string;
  questionId: string; seed: string; language: "en"; difficulty: Pnc002Difficulty; taskKind: Pnc002TaskKind;
  solveMode: TSolveMode; answerType: Pnc002AnswerType; explanationId: string; requiredVariables: string[];
  scenarioFamily: string; constraintProfile: string; distractorProfile: string; values: Record<string, Pnc002GeneratedValue>;
  renderVariables: Record<string, string | number>;
}
export type Pnc002AnyParameters = Pnc002Parameters<Pnc002SolveMode>;

export interface Pnc002SolverEvidence {
  operation:
    | "SINGLE_BLOCK_TOGETHER" | "SINGLE_BLOCK_COMPLEMENT" | "MULTIPLE_BLOCKS" | "BLOCK_WITH_EXTERNAL_PAIR_APART"
    | "TWO_BLOCKS_TOGETHER_NOT_ADJACENT" | "BLOCK_WITH_OUTSIDER_NOT_ADJACENT" | "ONE_BLOCK_TOGETHER_OTHER_BROKEN"
    | "NOT_ALL_BLOCKS_TOGETHER" | "BLOCK_INVERSE"
    | "OBJECT_AT_EXACT_POSITION" | "OBJECT_AT_EITHER_END" | "SPECIFIED_OBJECTS_AT_BOTH_ENDS" | "OBJECT_EXCLUDED_FROM_ENDS"
    | "PRESCRIBED_RELATIVE_ORDER" | "INDEPENDENT_RELATIVE_ORDER_CHAINS" | "STRICT_ALTERNATION"
    | "NO_TWO_CATEGORY_MEMBERS_ADJACENT" | "EXACT_GAP_BETWEEN_PAIR" | "AT_LEAST_GAP_BETWEEN_PAIR"
    | "SPECIFIED_OBJECTS_IN_POSITION_CLASS" | "POSITION_GAP_INVERSE"
    | "OBJECTS_AT_PRESCRIBED_POSITIONS" | "SPECIFIED_SET_IN_POSITION_SET" | "AT_MOST_GAP_BETWEEN_PAIR"
    | "DIRECTIONAL_EXACT_GAP" | "AT_LEAST_SPECIFIED_IN_POSITION_CLASS"
    | "COMPULSORY_MEMBERS" | "EXCLUDED_MEMBERS" | "COMPULSORY_AND_EXCLUDED"
    | "EXACT_TWO_CATEGORY_QUOTA" | "AT_LEAST_TWO_CATEGORY_QUOTA" | "AT_MOST_TWO_CATEGORY_QUOTA"
    | "AT_LEAST_ONE_CATEGORY" | "AT_LEAST_ONE_EACH_TWO_CATEGORIES"
    | "EXACT_THREE_CATEGORY_DISTRIBUTION" | "AT_LEAST_ONE_EACH_THREE_CATEGORIES"
    | "EXACT_SPECIFIED_MEMBERS" | "AT_LEAST_ONE_SPECIFIED_MEMBER" | "NOT_ALL_SPECIFIED_TOGETHER"
    | "ALL_OR_NONE_SPECIFIED" | "MEMBER_IMPLICATION" | "AT_MOST_SPECIFIED_MEMBERS"
    | "NAMED_COMPULSORY_CATEGORY_QUOTA" | "NAMED_EXCLUDED_CATEGORY_QUOTA" | "CONDITIONAL_SELECTION_INVERSE"
    | "SPECIFIED_MEMBER_RANGE" | "TWO_CATEGORY_RANGE"
    | "ROUND_TABLE_DISTINCT" | "CIRCULAR_BLOCK_TOGETHER" | "CIRCULAR_BLOCK_APART" | "CIRCULAR_MULTIPLE_BLOCKS"
    | "CIRCULAR_BLOCK_WITH_EXTERNAL_PAIR_APART" | "CIRCULAR_TWO_BLOCKS_NOT_ADJACENT"
    | "CIRCULAR_AT_LEAST_ONE_PAIR" | "CIRCULAR_NEITHER_PAIR" | "CIRCULAR_PERSON_BETWEEN_NEIGHBORS"
    | "CIRCULAR_OPPOSITE_PAIR" | "CLOCKWISE_ADJACENT_PAIR" | "CLOCKWISE_EXACT_GAP"
    | "CLOCKWISE_AT_LEAST_GAP" | "CLOCKWISE_AT_MOST_GAP" | "PRESCRIBED_CLOCKWISE_ORDER"
    | "CIRCULAR_ALTERNATION" | "CIRCULAR_NO_TWO_CATEGORY_ADJACENT" | "CIRCULAR_INVERSE"
    | "ROTATION_ONLY_ORNAMENTS" | "DIHEDRAL_DISTINCT_ORNAMENTS" | "DIHEDRAL_PAIR_TOGETHER";
  totalObjects: number; blockSizes: number[]; groupedObjectCount: number; blockCount: number; unitCount: number;
  externalArrangementCount: number; internalArrangementCounts: number[]; internalArrangementMultiplier: number;
  unrestrictedCount?: number; forbiddenTogetherCount?: number; validUnitArrangementCount?: number;
  adjacentExternalPairCount?: number; forbiddenAdjacentUnitCount?: number; primaryUnitCount?: number;
  primaryExternalArrangementCount?: number; primaryInternalArrangementMultiplier?: number; primaryRestrictionCount?: number;
  allSpecifiedBlocksTogetherCount?: number; fixedPosition?: number; allowedPositionCount?: number; remainingObjects?: number;
  endAssignmentCount?: number; chainLengths?: number[]; relativeOrderDivisor?: number; largeCount?: number; smallCount?: number;
  orientationCount?: number; gapSlotCount?: number; chosenGapCount?: number; gapCount?: number; minimumGap?: number;
  maximumGap?: number; orderedPositionPairCount?: number; directionalPositionPairCount?: number;
  specifiedCount?: number; prescribedObjectCount?: number; requiredInClass?: number; minimumInClass?: number;
  eligibleClassPositions?: number; ineligibleClassPositions?: number; selectedSpecifiedCount?: number;
  eligibleAssignmentCount?: number; ineligibleAssignmentCount?: number; ordinaryArrangementCount?: number;
  positionSetAssignmentCount?: number; acceptedClassCounts?: number[]; positionClassCaseCounts?: number[];
  committeeSize?: number; compulsoryCount?: number; excludedCount?: number; remainingEligibleCount?: number;
  remainingSelectionCount?: number; categorySizes?: number[]; requiredCategoryCounts?: number[];
  requiredFromA?: number; requiredFromB?: number; minimumFromA?: number; maximumFromA?: number; minimumFromB?: number;
  acceptedSelectionCounts?: number[]; selectionCaseCounts?: number[]; forbiddenCount?: number;
  requiredSpecified?: number; minimumSpecified?: number; maximumSpecified?: number; remainingCategoryASelection?: number;
  circularUnitCount?: number; rotationalSymmetryDivisor?: number; reflectionSymmetryDivisor?: number;
  clockwisePositionChoices?: number; clockwiseGap?: number; minimumClockwiseGap?: number; maximumClockwiseGap?: number;
  clockwiseOrderLength?: number; clockwiseOrderDivisor?: number; oppositeSeatOffset?: number; adjacentOrientationCount?: number;
  target?: number; recoveredParameter?: "n" | "blockSize" | "gap" | "totalObjects" | "categorySize" | "circularObjects";
  searchMinimum?: number; searchMaximum?: number;
}
export interface Pnc002SolverResult { exactAnswer: string; answer: string; numericAnswer: number; equation: string; mathJax: string; evidence: Pnc002SolverEvidence; }
export interface Pnc002IndependentVerification { supported: boolean; answer: number; method: string; }
export interface Pnc002ReasoningEvidence { conceptId: string; givens: Record<string, string | number>; equations: string[]; intermediateValues: Record<string, string | number>; decisiveCalculation: string; verification: string; }
export interface Pnc002Explanation { explanationId: string; lines: string[]; }
export interface Pnc002ValidationCheck { name: string; passed: boolean; message: string; }
export interface Pnc002ValidationResult { valid: boolean; checks: Pnc002ValidationCheck[]; }
export interface Pnc002QuestionPackage {
  packageId: typeof PNC_002_PACKAGE_ID; archetypeId: typeof PNC_002_PACKAGE_ID; canonicalProblemId: Pnc002ActiveCanonicalProblemId;
  questionLanguageId: string; questionId: string; seed: string; language: "en"; difficultyBand: Pnc002Difficulty;
  taskKind: Pnc002TaskKind; solveMode: Pnc002SolveMode; stem: string; options: string[]; correctIndex: number;
  answer: string; parameters: Pnc002AnyParameters; solver: Pnc002SolverResult; independentVerification: Pnc002IndependentVerification;
  reasoningEvidence: Pnc002ReasoningEvidence; explanation: Pnc002Explanation; validation: Pnc002ValidationResult;
  maturity: Pnc002Maturity; publiclyPublishable: boolean; mathematicalFingerprint: string; traceability: Record<string, unknown>;
}
export interface Pnc002CoverageAudit {
  passed: boolean; activeQlCount: number; expectedQlCount: number; missingQlIds: string[]; duplicateQlIds: string[];
  exactDuplicateTemplateGroups: string[][]; difficultyCounts: Record<string, number>; solveModeCounts: Record<string, number>;
  invalidRuntimeSamples: string[];
}
