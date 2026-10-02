export const DM_001_CHECKPOINT_IDS = [
  "DM-CP-001",
  "DM-CP-002",
  "DM-CP-003",
  "DM-CP-004",
  "DM-CP-005",
  "DM-CP-006",
  "DM-CP-007",
  "DM-CP-008",
  "DM-CP-009",
  "DM-CP-010",
  "DM-CP-011",
  "DM-CP-012",
  "DM-CP-013",
  "DM-CP-014",
  "DM-CP-015",
  "DM-CP-016",
] as const;

export const DM_001_QL_IDS = [
  "DM-QL-001", "DM-QL-002", "DM-QL-003",
  "DM-QL-004", "DM-QL-005", "DM-QL-006",
  "DM-QL-007", "DM-QL-008", "DM-QL-009",
  "DM-QL-010", "DM-QL-011", "DM-QL-012",
  "DM-QL-013", "DM-QL-014", "DM-QL-015",
  "DM-QL-016", "DM-QL-017", "DM-QL-018",
  "DM-QL-019", "DM-QL-020", "DM-QL-021",
  "DM-QL-022", "DM-QL-023", "DM-QL-024",
  "DM-QL-025", "DM-QL-026", "DM-QL-027",
  "DM-QL-028", "DM-QL-029", "DM-QL-030",
  "DM-QL-031", "DM-QL-032", "DM-QL-033",
  "DM-QL-034", "DM-QL-035", "DM-QL-036",
  "DM-QL-037", "DM-QL-038", "DM-QL-039",
  "DM-QL-040", "DM-QL-041", "DM-QL-042",
  "DM-QL-043", "DM-QL-044", "DM-QL-045",
  "DM-QL-046", "DM-QL-047", "DM-QL-048",
] as const;

export type DmCheckpointId = (typeof DM_001_CHECKPOINT_IDS)[number];
export type DmQlId = (typeof DM_001_QL_IDS)[number];
export type DmLocale = "en" | "hi" | "pa";
export type DmDifficulty = "EASY" | "MEDIUM" | "HARD";
export type DmOutcome =
  | "SELECT"
  | "REJECT"
  | "REFER_TO_MANAGER"
  | "REFER_TO_DIRECTOR"
  | "REFER_TO_COMMITTEE"
  | "INFORMATION_REQUIRED"
  | "TAKE_ACTION";
export type DmField =
  | "age"
  | "ageAtDate"
  | "graduationMarks"
  | "qualificationRank"
  | "experienceYears"
  | "experienceArea"
  | "residenceStatus"
  | "registrationStatus"
  | "certificateStatus"
  | "writtenScore"
  | "sectionalScore"
  | "interviewScore"
  | "overallScore"
  | "annualIncome"
  | "familyIncome"
  | "employmentStatus"
  | "repaymentStatus"
  | "collateralStatus"
  | "category"
  | "applicationOrder";
export type DmRankField = "qualificationRank" | "experienceYears" | "graduationMarks" | "writtenScore" | "sectionalScore" | "interviewScore" | "overallScore" | "age" | "applicationOrder";
export type DmRankCriterion = Readonly<{ field: DmRankField; direction: "HIGHER_FIRST" | "LOWER_FIRST" }>;
export type DmOperator = "LTE" | "GTE" | "EQ" | "IN";
export type DmRuleValue = number | string | readonly (number | string)[];
export type DmCandidateMode =
  | "ALL_PASS"
  | "BOUNDARY_PASS"
  | "SINGLE_FAIL"
  | "MULTIPLE_FAIL"
  | "MISSING_REQUIRED"
  | "AGE_EXCEPTION"
  | "MARKS_EXCEPTION"
  | "DOCUMENT_REFERRAL"
  | "DIRECTOR_REFERRAL"
  | "COMMITTEE_REFERRAL"
  | "BOTH_RELAXATION";

export type LocalizedText = Readonly<Record<DmLocale, string>>;

export type DmSituationalPrinciple =
  | "VERIFY_FACTS"
  | "FOLLOW_PROCEDURE"
  | "ESCALATE_AUTHORIZED"
  | "DOCUMENT_ACTION"
  | "PROTECT_CONFIDENTIALITY"
  | "PRIORITIZE_URGENCY"
  | "PRIORITIZE_DEADLINE"
  | "SERVE_FAIRLY";

export type DmSituationalError =
  | "ACT_WITHOUT_VERIFICATION"
  | "BYPASS_PROCEDURE"
  | "UNNECESSARY_ESCALATION"
  | "UNJUSTIFIED_DELAY"
  | "ASSUME_FACTS"
  | "IRREVERSIBLE_ACTION_TOO_EARLY"
  | "BREACH_CONFIDENTIALITY"
  | "IGNORE_PRIORITY";

export type DmSituationalChoice = Readonly<{
  choiceId: string;
  text: LocalizedText;
  principle: DmSituationalPrinciple;
  stage: number;
  admissible: boolean;
  errors: readonly DmSituationalError[];
}>;

export type DmSituationalSpec = Readonly<{
  situation: LocalizedText;
  focus: "BEST_ACTION" | "FIRST_ACTION" | "RESOURCE_PRIORITY";
  policyOrder: readonly DmSituationalPrinciple[];
  choices: readonly DmSituationalChoice[];
}>;

export type DmRuleCondition = Readonly<{
  id: string;
  field: DmField;
  operator: DmOperator;
  value: DmRuleValue;
}>;

export type DmDecisionRule = Readonly<{
  ruleId: string;
  priority: number;
  conditions: readonly DmRuleCondition[];
  outcome: DmOutcome;
  explanation: LocalizedText;
}>;

export type DmCandidateProfile = Readonly<{
  name: string;
  age?: number;
  birthDate?: string;
  graduationMarks?: number;
  qualificationRank?: number;
  experienceYears?: number;
  experienceArea?: string;
  residenceStatus?: string;
  registrationStatus?: string;
  certificateStatus?: string;
  writtenScore?: number;
  interviewScore?: number;
  sectionalScore?: number;
  overallScore?: number;
  annualIncome?: number;
  familyIncome?: number;
  employmentStatus?: string;
  repaymentStatus?: string;
  collateralStatus?: string;
  category?: string;
  applicationOrder?: number;
}>; 

export type DmRankingSpec = Readonly<{
  seatCount: number;
  priorityOrder: readonly DmRankCriterion[];
}>;

export type DmScenario = Readonly<{
  scenarioId: string;
  checkpointId: DmCheckpointId;
  blueprintCheckpointId: string;
  qlId: DmQlId;
  context: LocalizedText;
  baseConditions: readonly DmRuleCondition[];
  decisionRules: readonly DmDecisionRule[];
  ruleNotes: readonly LocalizedText[];
  referenceDate?: string;
  experienceAreaForBase?: string;
  ranking?: DmRankingSpec;
  situational?: DmSituationalSpec;
}>;

export type DmConditionCheck = Readonly<{
  condition: DmRuleCondition;
  status: "PASS" | "FAIL" | "UNKNOWN";
  actual: number | string | undefined;
}>;

export type DmDecisionResult = Readonly<{
  outcome: DmOutcome;
  matchedRuleId?: string;
  checks: readonly DmConditionCheck[];
  unresolvedRuleIds: readonly string[];
}>;

export type DmGeneratedQuestion = Readonly<{
  chapterId: "DM-001";
  checkpointId: DmCheckpointId;
  blueprintCheckpointId: string;
  qlId: DmQlId;
  scenarioId: string;
  seed: number;
  locale: DmLocale;
  difficulty: DmDifficulty;
  candidate: DmCandidateProfile;
  answerMode: "ELIGIBILITY_OUTCOME" | "RANKED_CANDIDATE_SET" | "SITUATIONAL_ACTION";
  candidateGroup?: readonly DmCandidateProfile[];
  selectedCandidates?: readonly string[];
  stem: string;
  options: readonly string[];
  correctIndex: number;
  outcome: DmOutcome;
  explanation: string;
  explanationRows: readonly Readonly<{
    condition: string;
    candidateValue: string;
    requirement: string;
    result: "PASS" | "FAIL" | "UNKNOWN";
  }>[];
}>;
