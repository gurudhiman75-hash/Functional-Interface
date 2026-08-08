export type Locale = "en-IN" | "hi-IN" | "pa-IN";
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type GregorianDate = {
  year: number;
  month: Month;
  day: number;
};

export type CountSemantics =
  | "SIGNED_DIFFERENCE"
  | "ABSOLUTE_GAP"
  | "INCLUSIVE_BOTH"
  | "EXCLUSIVE_BOTH";

export type OutputType =
  | "WEEKDAY"
  | "DATE"
  | "YEAR"
  | "COUNT"
  | "CLASSIFICATION"
  | "WEEKDAY_SET";

export type SemanticValue = number | string | GregorianDate | Weekday[];

export type CalendarCheckpointId =
  | "CAL-CP-001"
  | "CAL-CP-002"
  | "CAL-CP-003"
  | "CAL-CP-004"
  | "CAL-CP-005"
  | "CAL-CP-006"
  | "CAL-CP-007"
  | "CAL-CP-008"
  | "CAL-CP-009"
  | "CAL-CP-010";

export type CalendarPrototypeId =
  | "CAL-PQL-001" | "CAL-PQL-002" | "CAL-PQL-003" | "CAL-PQL-004"
  | "CAL-PQL-005" | "CAL-PQL-006" | "CAL-PQL-007" | "CAL-PQL-008" | "CAL-PQL-009"
  | "CAL-PQL-010" | "CAL-PQL-011" | "CAL-PQL-012" | "CAL-PQL-013"
  | "CAL-PQL-014" | "CAL-PQL-015" | "CAL-PQL-016"
  | "CAL-PQL-017" | "CAL-PQL-018" | "CAL-PQL-019" | "CAL-PQL-020"
  | "CAL-PQL-021" | "CAL-PQL-022" | "CAL-PQL-023" | "CAL-PQL-024"
  | "CAL-PQL-025" | "CAL-PQL-026" | "CAL-PQL-027" | "CAL-PQL-028"
  | "CAL-PQL-029" | "CAL-PQL-030" | "CAL-PQL-031" | "CAL-PQL-032" | "CAL-PQL-033" | "CAL-PQL-034"
  | "CAL-PQL-035" | "CAL-PQL-036" | "CAL-PQL-037" | "CAL-PQL-038" | "CAL-PQL-039"
  | "CAL-PQL-040" | "CAL-PQL-041" | "CAL-PQL-042" | "CAL-PQL-043" | "CAL-PQL-044";

export type MisconceptionId =
  | "FORWARD_BACKWARD_REVERSAL"
  | "SHIFT_BY_N_MINUS_ONE"
  | "SHIFT_BY_N_PLUS_ONE"
  | "FAILED_MOD7_REDUCTION"
  | "NEGATIVE_MODULO_ERROR"
  | "COUNTED_ANCHOR_AS_DAY_ONE"
  | "OMITTED_TARGET_DATE"
  | "INCLUDED_BOTH_DATES"
  | "EXCLUDED_BOTH_DATES"
  | "WRONG_MONTH_LENGTH_30_FOR_31"
  | "WRONG_MONTH_LENGTH_31_FOR_30"
  | "FEBRUARY_ALWAYS_28"
  | "FEBRUARY_ALWAYS_29"
  | "FEB29_WRONGLY_INCLUDED"
  | "FEB29_WRONGLY_EXCLUDED"
  | "LEAP_EVERY_FOUR_YEARS_ONLY"
  | "CENTURY_ALWAYS_LEAP"
  | "CENTURY_NEVER_LEAP"
  | "DIVISIBLE_BY_400_RULE_OMITTED"
  | "ORDINARY_YEAR_AS_TWO_ODD_DAYS"
  | "LEAP_YEAR_AS_ONE_ODD_DAY"
  | "CENTURY_BLOCK_OFFSET_ERROR"
  | "START_WEEKDAY_MATCH_ONLY"
  | "YEAR_TYPE_MATCH_ONLY"
  | "FULL_YEAR_RULE_USED_FOR_MONTH_MATCH"
  | "MONTH_MATCH_RULE_USED_FOR_FULL_YEAR"
  | "FIRST_LAST_DAY_OFF_BY_ONE"
  | "FREQUENCY_EXTRA_DAYS_FROM_WRONG_START"
  | "FREQUENCY_USED_365_FOR_LEAP_YEAR"
  | "FREQUENCY_USED_366_FOR_ORDINARY_YEAR";

export type CalendarOption = {
  semanticType: OutputType;
  semanticValue: SemanticValue;
  display: string;
  isCorrect: boolean;
  misconceptionId?: MisconceptionId;
  derivation?: Record<string, unknown>;
  explanation: string;
};

export type StructuredCalendarExplanation = {
  observation: string;
  rule: string;
  working: string[];
  conclusion: string;
  closestTrap?: string;
  verification?: string;
};

export type DifficultyDimensions = {
  D1ArithmeticSegments: number;
  D2ReverseReasoning: boolean;
  D3MonthBoundary: boolean;
  D4LeapDayExposure: boolean;
  D5CenturyExposure: boolean;
  D6CountInterpretation: boolean;
  D7OutputComplexity: number;
  D8InverseReasoning: boolean;
  D9TrapCollisions: number;
  D10InformationFiltering: number;
};

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type CalendarLifecycle = {
  discoveryStatus: "EXECUTABLE_DISCOVERY";
  editorialStatus: "NOT_FROZEN";
  languageStatus: "DRAFT_NOT_HUMAN_APPROVED";
  permanentQlId: null;
  active: false;
  questionStudioDiscoverable: false;
  questionBankStored: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
};

export type CalendarScenarioFacts = {
  anchorDate?: GregorianDate;
  anchorWeekday?: Weekday;
  targetDate?: GregorianDate;
  targetWeekday?: Weekday;
  month?: Month;
  year?: number;
  secondYear?: number;
  yearRange?: { start: number; end: number; inclusive: true };
  signedDayShift?: number;
  namedWeekday?: Weekday;
  nthDay?: number;
  countSemantics?: CountSemantics;
  fullYearMatch?: boolean;
  booleanAnswer?: boolean;
  [key: string]: unknown;
};

export type CalculationTrace = {
  method: "ORDINAL" | "MOD7_SHIFT" | "ODD_DAY" | "LEAP_RULE" | "REPETITION_RULE" | "FREQUENCY_RULE" | "DATE_SPAN";
  segments: Array<Record<string, unknown>>;
  answer: SemanticValue;
};

export type CalendarQuestionPackage = {
  chapter: "CAL-001";
  family: "REAS-CAL";
  checkpoint: CalendarCheckpointId;
  prototypeAuthority: CalendarPrototypeId;
  permanentQlId: null;
  version: "CAL-001-DISCOVERY-V1";
  seed: number;
  locale: Locale;
  queryType: string;
  outputType: OutputType;
  stemTemplateId: string;
  explanationTemplateId: string;
  stem: string;
  facts: CalendarScenarioFacts;
  canonicalAnswer: SemanticValue;
  groundTruth: CalculationTrace;
  teachingTrace: CalculationTrace;
  crossCheck: {
    passed: boolean;
    groundTruthDigest: string;
    teachingTraceDigest: string;
  };
  options: CalendarOption[];
  answerIndex: 0 | 1 | 2 | 3;
  explanation: StructuredCalendarExplanation;
  difficulty: Difficulty;
  difficultyDimensions: DifficultyDimensions;
  mathematicalFingerprint: string;
  coverageFlags: {
    crossesMonth: boolean;
    crossesYear: boolean;
    crossesFeb29: boolean;
    crossesCentury: boolean;
    usesCenturyYear: boolean;
    usesDivisibleBy400Year: boolean;
    usesBackwardMovement: boolean;
    usesInclusiveCounting: boolean;
  };
  lifecycle: CalendarLifecycle;
};

export type PrototypeDefinition = {
  id: CalendarPrototypeId;
  checkpoint: CalendarCheckpointId;
  title: string;
  operation: string;
  outputType: OutputType;
  explanationFamily: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";
  dominantMisconceptions: MisconceptionId[];
};

export type SourceAuditRecord = {
  source: string;
  examOrBook: string;
  year?: number;
  stemPattern: string;
  essentialOperation: string;
  inputType: string;
  outputType: OutputType;
  checkpointCandidate: CalendarCheckpointId;
  prototypeCandidate?: CalendarPrototypeId;
  difficultyDrivers: string[];
  misconceptionOpportunities: MisconceptionId[];
  decision: "COVERED" | "REPRESENTATION_ONLY" | "NEW_AUTHORITY_REQUIRED" | "INVALID_AMBIGUOUS_EXCLUDED" | "OUTSIDE_SCOPE";
  reviewer: string;
  reviewedAt: string;
};
