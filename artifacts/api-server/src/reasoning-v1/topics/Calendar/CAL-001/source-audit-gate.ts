import type { SourceAuditRecord } from "./types.ts";

export type RequiredCalendarSourceClass =
  | "SSC"
  | "RRB"
  | "BANKING"
  | "PUNJAB_STATE"
  | "ESTABLISHED_BOOK"
  | "RECENT_MEMORY_SET";

export type CalendarSourceAuditEntry = SourceAuditRecord & {
  sourceClass: RequiredCalendarSourceClass;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  copyrightPolicy: "PATTERN_ONLY_NO_VERBATIM_COPY";
  note?: string;
};

/**
 * Initial pattern audit from the user's uploaded reference books.
 * It is deliberately not represented as the final exam-source audit:
 * SSC/RRB/Bank/Punjab year-tagged papers and recent memory sets still require review.
 */
export const INITIAL_CALENDAR_SOURCE_AUDIT: readonly CalendarSourceAuditEntry[] = [
  {
    source: "Uploaded R.S. Aggarwal Quantitative Aptitude reference",
    examOrBook: "Calendar chapter — odd days and absolute date weekday",
    stemPattern: "Find the weekday of a stated Gregorian date",
    essentialOperation: "Absolute date to weekday via century, year, month and day contributions",
    inputType: "DATE",
    outputType: "WEEKDAY",
    checkpointCandidate: "CAL-CP-004",
    prototypeCandidate: "CAL-PQL-014",
    difficultyDrivers: ["century decomposition", "month accumulation"],
    misconceptionOpportunities: ["CENTURY_BLOCK_OFFSET_ERROR", "LEAP_YEAR_AS_ONE_ODD_DAY"],
    decision: "COVERED",
    reviewer: "IMPLEMENTATION_AUDIT_PENDING_HUMAN_SIGNOFF",
    reviewedAt: "2026-08-08",
    sourceClass: "ESTABLISHED_BOOK",
    confidence: "HIGH",
    copyrightPolicy: "PATTERN_ONLY_NO_VERBATIM_COPY",
  },
  {
    source: "Uploaded R.S. Aggarwal Quantitative Aptitude reference",
    examOrBook: "Calendar chapter — identical full-year calendar",
    stemPattern: "Find the next year having the same full-year calendar",
    essentialOperation: "Match 1 January weekday and leap status, selecting the nearest year",
    inputType: "YEAR",
    outputType: "YEAR",
    checkpointCandidate: "CAL-CP-008",
    prototypeCandidate: "CAL-PQL-029",
    difficultyDrivers: ["ordinary/leap sequence", "nearest valid year"],
    misconceptionOpportunities: ["START_WEEKDAY_MATCH_ONLY", "YEAR_TYPE_MATCH_ONLY"],
    decision: "COVERED",
    reviewer: "IMPLEMENTATION_AUDIT_PENDING_HUMAN_SIGNOFF",
    reviewedAt: "2026-08-08",
    sourceClass: "ESTABLISHED_BOOK",
    confidence: "HIGH",
    copyrightPolicy: "PATTERN_ONLY_NO_VERBATIM_COPY",
  },
  {
    source: "Uploaded Reasoning for Competitions reference",
    examOrBook: "Calendar chapter — year classification and range counting",
    stemPattern: "Identify a leap/ordinary year or count leap years in a range",
    essentialOperation: "Apply divisible-by-4, divisible-by-100 and divisible-by-400 rules",
    inputType: "YEAR_OR_RANGE",
    outputType: "COUNT",
    checkpointCandidate: "CAL-CP-006",
    prototypeCandidate: "CAL-PQL-023",
    difficultyDrivers: ["inclusive endpoints", "century exception"],
    misconceptionOpportunities: ["LEAP_EVERY_FOUR_YEARS_ONLY", "DIVISIBLE_BY_400_RULE_OMITTED"],
    decision: "COVERED",
    reviewer: "IMPLEMENTATION_AUDIT_PENDING_HUMAN_SIGNOFF",
    reviewedAt: "2026-08-08",
    sourceClass: "ESTABLISHED_BOOK",
    confidence: "HIGH",
    copyrightPolicy: "PATTERN_ONLY_NO_VERBATIM_COPY",
  },
  {
    source: "Uploaded Reasoning for Competitions reference",
    examOrBook: "KVS-labelled month-calendar matching example",
    year: 2013,
    stemPattern: "Select two months whose month grids are identical",
    essentialOperation: "Compare first weekday and number of days for two named months",
    inputType: "MONTH_PAIR",
    outputType: "YEAR",
    checkpointCandidate: "CAL-CP-008",
    prototypeCandidate: "CAL-PQL-033",
    difficultyDrivers: ["month length", "first weekday"],
    misconceptionOpportunities: ["FULL_YEAR_RULE_USED_FOR_MONTH_MATCH", "START_WEEKDAY_MATCH_ONLY"],
    decision: "REPRESENTATION_ONLY",
    reviewer: "IMPLEMENTATION_AUDIT_PENDING_HUMAN_SIGNOFF",
    reviewedAt: "2026-08-08",
    sourceClass: "ESTABLISHED_BOOK",
    confidence: "MEDIUM",
    copyrightPolicy: "PATTERN_ONLY_NO_VERBATIM_COPY",
    note: "The mathematical authority is PQL-033; a month-pair output representation needs merge/split review before permanent allocation.",
  },
  {
    source: "Uploaded reasoning reference",
    examOrBook: "Calendar practice — weekdays occurring five times in a month",
    stemPattern: "Infer the month start or weekday-frequency set from five occurrences",
    essentialOperation: "Split the month into complete weeks and extra weekdays",
    inputType: "MONTH_AND_FREQUENCY_CONSTRAINT",
    outputType: "WEEKDAY_SET",
    checkpointCandidate: "CAL-CP-010",
    prototypeCandidate: "CAL-PQL-041",
    difficultyDrivers: ["month length", "inverse frequency reasoning"],
    misconceptionOpportunities: ["FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", "WRONG_MONTH_LENGTH_31_FOR_30"],
    decision: "COVERED",
    reviewer: "IMPLEMENTATION_AUDIT_PENDING_HUMAN_SIGNOFF",
    reviewedAt: "2026-08-08",
    sourceClass: "ESTABLISHED_BOOK",
    confidence: "HIGH",
    copyrightPolicy: "PATTERN_ONLY_NO_VERBATIM_COPY",
  },
  {
    source: "Uploaded calendar references",
    examOrBook: "Calendar solved examples — list all dates on which a named weekday occurs",
    stemPattern: "Find every date in a month on which a named weekday falls",
    essentialOperation: "Find first occurrence and enumerate by seven-day steps",
    inputType: "MONTH_AND_WEEKDAY",
    outputType: "DATE",
    checkpointCandidate: "CAL-CP-010",
    difficultyDrivers: ["first occurrence", "date-set output"],
    misconceptionOpportunities: ["COUNTED_ANCHOR_AS_DAY_ONE", "FREQUENCY_EXTRA_DAYS_FROM_WRONG_START"],
    decision: "NEW_AUTHORITY_REQUIRED",
    reviewer: "IMPLEMENTATION_AUDIT_PENDING_HUMAN_SIGNOFF",
    reviewedAt: "2026-08-08",
    sourceClass: "ESTABLISHED_BOOK",
    confidence: "HIGH",
    copyrightPolicy: "PATTERN_ONLY_NO_VERBATIM_COPY",
    note: "The V2 authority inventory covers counts and weekday sets, not a date-set answer. This remains an explicit discovery gap rather than being silently forced into PQL-041.",
  },
  {
    source: "Uploaded Disha SSC Mathematics reference",
    examOrBook: "Calendar illustration — count the occurrence of a numbered day across 400 years",
    stemPattern: "Count how often a particular date number exists across a long year range",
    essentialOperation: "Count ordinary/leap years under a date-validity condition",
    inputType: "DAY_OF_MONTH_AND_YEAR_RANGE",
    outputType: "COUNT",
    checkpointCandidate: "CAL-CP-006",
    difficultyDrivers: ["400-year cycle", "February validity"],
    misconceptionOpportunities: ["LEAP_EVERY_FOUR_YEARS_ONLY", "DIVISIBLE_BY_400_RULE_OMITTED"],
    decision: "NEW_AUTHORITY_REQUIRED",
    reviewer: "IMPLEMENTATION_AUDIT_PENDING_HUMAN_SIGNOFF",
    reviewedAt: "2026-08-08",
    sourceClass: "ESTABLISHED_BOOK",
    confidence: "HIGH",
    copyrightPolicy: "PATTERN_ONLY_NO_VERBATIM_COPY",
    note: "This is not equivalent to weekday frequency; a merge/split decision is required.",
  },
];

export type SourceAuditGateResult = {
  passed: boolean;
  coveredSourceClasses: RequiredCalendarSourceClass[];
  missingSourceClasses: RequiredCalendarSourceClass[];
  unresolvedNewAuthorities: number;
  unresolvedHumanReviews: number;
  reasons: string[];
};

export function evaluateCalendarSourceAudit(records: readonly CalendarSourceAuditEntry[]): SourceAuditGateResult {
  const required: RequiredCalendarSourceClass[] = ["SSC", "RRB", "BANKING", "PUNJAB_STATE", "ESTABLISHED_BOOK", "RECENT_MEMORY_SET"];
  const covered = [...new Set(records.map((record) => record.sourceClass))];
  const missing = required.filter((sourceClass) => !covered.includes(sourceClass));
  const unresolvedNewAuthorities = records.filter((record) => record.decision === "NEW_AUTHORITY_REQUIRED").length;
  const unresolvedHumanReviews = records.filter((record) => record.reviewer === "IMPLEMENTATION_AUDIT_PENDING_HUMAN_SIGNOFF").length;
  const reasons: string[] = [];
  if (missing.length) reasons.push(`Missing required source classes: ${missing.join(", ")}.`);
  if (unresolvedNewAuthorities) reasons.push(`${unresolvedNewAuthorities} source pattern(s) require a merge/split or new-authority decision.`);
  if (unresolvedHumanReviews) reasons.push(`${unresolvedHumanReviews} record(s) still require human source-review sign-off.`);
  return {
    passed: reasons.length === 0,
    coveredSourceClasses: covered,
    missingSourceClasses: missing,
    unresolvedNewAuthorities,
    unresolvedHumanReviews,
    reasons,
  };
}

export const INITIAL_CALENDAR_SOURCE_AUDIT_GATE = evaluateCalendarSourceAudit(INITIAL_CALENDAR_SOURCE_AUDIT);
