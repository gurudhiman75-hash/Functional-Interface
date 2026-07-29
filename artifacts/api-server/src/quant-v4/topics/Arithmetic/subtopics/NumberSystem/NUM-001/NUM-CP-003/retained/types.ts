export type NumCp003RetainedAuthorityId =
  | "APPLY_DIVISIBILITY_RULE"
  | "RESOLVE_SINGLE_DIGIT_CANDIDATE_SET"
  | "RESOLVE_ORDERED_DIGIT_PAIR_SET"
  | "FIND_DIGIT_BOUND_MULTIPLE"
  | "COUNT_ONE_DIVISOR_IN_RANGE"
  | "TEST_IMPLICIT_REPEATED_NUMERAL"
  | "RESOLVE_LINKED_ARITHMETIC_DIVISIBILITY";

export type NumCp003RetainedAnswerSemantic =
  | "DIVISOR"
  | "DIGIT"
  | "COUNT"
  | "DIGIT_SUM"
  | "DIGIT_SET"
  | "NUMBER"
  | "ORDERED_DIGIT_PAIR"
  | "ORDERED_PAIR_SET"
  | "SOLUTION_CLASS"
  | "SUFFICIENCY_CLASS"
  | "TRUTH_CLAIM";

export type NumCp003RetainedRepresentation = "STANDARD" | "DATA_SUFFICIENCY" | "CLAIM";

export interface NumCp003RetainedTemplateEntry {
  temporaryTemplateLabel: `NUM-CP003-QLT2-${string}`;
  authorityId: NumCp003RetainedAuthorityId;
  taskDirection:
    | "FORWARD_SELECTION"
    | "INVERSE_RECONSTRUCTION"
    | "CANDIDATE_SET_PROJECTION"
    | "BOUNDARY_OPTIMISATION"
    | "RANGE_COUNT"
    | "REPRESENTATION_CONSTRUCTION"
    | "LINKED_CONSTRAINT_RECONSTRUCTION"
    | "EVIDENCE_SUFFICIENCY"
    | "CLAIM_VALIDATION";
  answerSemantic: NumCp003RetainedAnswerSemantic;
  targetProjection: string;
  extremumDirectionParameter: boolean;
  representation: NumCp003RetainedRepresentation;
  sourceEvidence: readonly string[];
  prototypeAncestry: readonly string[];
  permanentQlId: null;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

export type NumCp003ExploratoryDisposition = "REJECT" | "REASSIGN" | "OWNERSHIP_HOLD" | "STUDY_ONLY";

export interface NumCp003NonRetainedPrototypeDisposition {
  prototypeId: string;
  disposition: NumCp003ExploratoryDisposition;
  destination?: "NUM-CP-006" | "NUM-CP-008" | "ALGEBRA_OR_NUM_CP008" | "SHARED_SET_COUNTING";
  reason: string;
}
