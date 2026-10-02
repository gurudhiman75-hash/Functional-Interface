export const DM_001_CHECKPOINT_IDS = [
  "DM-CP-001",
  "DM-CP-002",
  "DM-CP-003",
  "DM-CP-004",
  "DM-CP-005",
] as const;

export const DM_001_QL_IDS = [
  "DM-QL-001", "DM-QL-002", "DM-QL-003",
  "DM-QL-004", "DM-QL-005", "DM-QL-006",
  "DM-QL-007", "DM-QL-008", "DM-QL-009",
  "DM-QL-010", "DM-QL-011", "DM-QL-012",
  "DM-QL-013", "DM-QL-014", "DM-QL-015",
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
  | "INFORMATION_REQUIRED";
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
  | "interviewScore";
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
  | "COMMITTEE_REFERRAL";

export type LocalizedText = Readonly<Record<DmLocale, string>>;

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
