import type { CalendarCheckpointId, CalendarPrototypeId, OutputType } from "./types.ts";
import type { CalendarSourceGapPrototypeId } from "./source-gap-runtime.ts";

export const CALENDAR_PERMANENT_QL_IDS = [
  "CAL-QL-001", "CAL-QL-002", "CAL-QL-003", "CAL-QL-004", "CAL-QL-005",
  "CAL-QL-006", "CAL-QL-007", "CAL-QL-008", "CAL-QL-009", "CAL-QL-010",
  "CAL-QL-011", "CAL-QL-012", "CAL-QL-013", "CAL-QL-014", "CAL-QL-015",
  "CAL-QL-016", "CAL-QL-017", "CAL-QL-018", "CAL-QL-019", "CAL-QL-020",
  "CAL-QL-021", "CAL-QL-022", "CAL-QL-023", "CAL-QL-024", "CAL-QL-025",
  "CAL-QL-026", "CAL-QL-027", "CAL-QL-028", "CAL-QL-029", "CAL-QL-030",
  "CAL-QL-031", "CAL-QL-032", "CAL-QL-033", "CAL-QL-034", "CAL-QL-035",
  "CAL-QL-036",
] as const;

export type CalendarPermanentQlId = typeof CALENDAR_PERMANENT_QL_IDS[number];
export type CalendarFrozenSourcePrototypeId = CalendarPrototypeId | CalendarSourceGapPrototypeId;
export type CalendarPermanentAnswerType = OutputType | "DATE_SET";

export type CalendarPermanentContract = {
  qlId: CalendarPermanentQlId;
  checkpointIds: readonly CalendarCheckpointId[];
  solveAuthority: string;
  studentTask: string;
  sourcePrototypeIds: readonly CalendarFrozenSourcePrototypeId[];
  answerType: CalendarPermanentAnswerType;
  status: "ENGLISH_IDENTITY_FROZEN_REVIEW_ONLY";
  reviewOnly: true;
  questionStudioVisible: false;
  questionBankWritable: false;
  mockTestEligible: false;
  publiclyPublishable: false;
};

const contract = (
  qlId: CalendarPermanentQlId,
  checkpointIds: readonly CalendarCheckpointId[],
  solveAuthority: string,
  studentTask: string,
  sourcePrototypeIds: readonly CalendarFrozenSourcePrototypeId[],
  answerType: CalendarPermanentAnswerType,
): CalendarPermanentContract => ({
  qlId,
  checkpointIds,
  solveAuthority,
  studentTask,
  sourcePrototypeIds,
  answerType,
  status: "ENGLISH_IDENTITY_FROZEN_REVIEW_ONLY",
  reviewOnly: true,
  questionStudioVisible: false,
  questionBankWritable: false,
  mockTestEligible: false,
  publiclyPublishable: false,
});

export const CALENDAR_PERMANENT_CONTRACTS: readonly CalendarPermanentContract[] = [
  contract("CAL-QL-001", ["CAL-CP-001"], "RESOLVE_SIGNED_WEEKDAY_SHIFT", "Move forward or backward from a known weekday, or recover the starting weekday.", ["CAL-PQL-001", "CAL-PQL-002", "CAL-PQL-003"], "WEEKDAY"),
  contract("CAL-QL-002", ["CAL-CP-001"], "FIND_LEAST_WEEKDAY_CONGRUENCE_COUNT", "Find the least positive day count satisfying a weekday relation.", ["CAL-PQL-004"], "COUNT"),
  contract("CAL-QL-003", ["CAL-CP-002"], "RESOLVE_EXPLICIT_DATE_WEEKDAY_RELATION", "Find a target or earlier weekday from a dated anchor across ordinary month boundaries.", ["CAL-PQL-005", "CAL-PQL-006", "CAL-PQL-007"], "WEEKDAY"),
  contract("CAL-QL-004", ["CAL-CP-002"], "FIND_EXACT_DAY_GAP", "Find the exact day difference between two dates.", ["CAL-PQL-008"], "COUNT"),
  contract("CAL-QL-005", ["CAL-CP-002"], "ADD_OR_SUBTRACT_DAYS_FROM_DATE", "Add or subtract a stated number of days to obtain a date.", ["CAL-PQL-009"], "DATE"),
  contract("CAL-QL-006", ["CAL-CP-003"], "RESOLVE_WEEKDAY_ACROSS_LEAP_DAY", "Find a weekday across 29 February.", ["CAL-PQL-010"], "WEEKDAY"),
  contract("CAL-QL-007", ["CAL-CP-003"], "FIND_DAY_GAP_ACROSS_LEAP_DAY", "Find the day difference across 29 February.", ["CAL-PQL-011"], "COUNT"),
  contract("CAL-QL-008", ["CAL-CP-003"], "COUNT_DATES_WITH_EXPLICIT_BOUNDARY_SEMANTICS", "Count dates using explicitly inclusive or exclusive endpoints.", ["CAL-PQL-012"], "COUNT"),
  contract("CAL-QL-009", ["CAL-CP-003"], "CLASSIFY_LEAP_DAY_IN_SPAN", "Determine whether 29 February lies inside a stated span.", ["CAL-PQL-013"], "CLASSIFICATION"),
  contract("CAL-QL-010", ["CAL-CP-004"], "FIND_ABSOLUTE_GREGORIAN_WEEKDAY", "Find the weekday of an absolute Gregorian date.", ["CAL-PQL-014"], "WEEKDAY"),
  contract("CAL-QL-011", ["CAL-CP-004"], "FIND_WEEKDAY_OF_NTH_DAY", "Find the weekday of the nth day of a year.", ["CAL-PQL-015"], "WEEKDAY"),
  contract("CAL-QL-012", ["CAL-CP-004"], "CONVERT_DATE_AND_DAY_OF_YEAR", "Convert between a date and its numbered day of the year.", ["CAL-PQL-016"], "COUNT"),
  contract("CAL-QL-013", ["CAL-CP-005"], "RESOLVE_SAME_DATE_ADJACENT_YEAR", "Find the weekday of the same date in the next or previous year.", ["CAL-PQL-017"], "WEEKDAY"),
  contract("CAL-QL-014", ["CAL-CP-005"], "RESOLVE_MULTI_YEAR_DATE_WEEKDAY", "Move between the same dated anchor across multiple years in either direction.", ["CAL-PQL-018", "CAL-PQL-020"], "WEEKDAY"),
  contract("CAL-QL-015", ["CAL-CP-005"], "FIND_FIRST_DAY_OFFSET_BETWEEN_YEARS", "Find the weekday offset between the first days of two years.", ["CAL-PQL-019"], "COUNT"),
  contract("CAL-QL-016", ["CAL-CP-005"], "FIND_NEXT_SAME_DATE_SAME_WEEKDAY_YEAR", "Find the next year in which a specified date returns to the same weekday.", ["CAL-GAP-PROT-001"], "YEAR"),
  contract("CAL-QL-017", ["CAL-CP-006"], "CLASSIFY_GREGORIAN_YEAR", "Classify a Gregorian year using mutually exclusive ordinary/leap and century categories.", ["CAL-PQL-021"], "CLASSIFICATION"),
  contract("CAL-QL-018", ["CAL-CP-006"], "SELECT_YEAR_BY_GREGORIAN_STATUS", "Select the unique option-year having the requested Gregorian status.", ["CAL-PQL-022"], "YEAR"),
  contract("CAL-QL-019", ["CAL-CP-006", "CAL-CP-007"], "COUNT_REQUESTED_YEAR_CLASS_IN_RANGE", "Count leap or ordinary years in an inclusive range, including century exceptions.", ["CAL-PQL-023", "CAL-PQL-024", "CAL-PQL-028"], "COUNT"),
  contract("CAL-QL-020", ["CAL-CP-006"], "COUNT_NUMBERED_DATE_VALIDITY_IN_YEAR_RANGE", "Count how often 29 February exists in an inclusive year range.", ["CAL-GAP-PROT-003"], "COUNT"),
  contract("CAL-QL-021", ["CAL-CP-007"], "FIND_ODD_DAYS_IN_ANCHORED_COMPLETE_YEARS", "Find odd days in an explicitly anchored block of complete Gregorian years.", ["CAL-PQL-025"], "COUNT"),
  contract("CAL-QL-022", ["CAL-CP-007"], "FIND_CENTURY_BLOCK_ODD_DAYS", "Find odd days in standard or composite century blocks.", ["CAL-PQL-026"], "COUNT"),
  contract("CAL-QL-023", ["CAL-CP-007"], "RESOLVE_WEEKDAY_ACROSS_CENTURY_BOUNDARY", "Resolve weekday movement across an ordinary or divisible-by-400 century boundary.", ["CAL-PQL-027"], "WEEKDAY"),
  contract("CAL-QL-024", ["CAL-CP-008"], "FIND_OR_SELECT_IDENTICAL_FULL_YEAR_CALENDAR", "Find the next/previous identical calendar or select the matching year from options.", ["CAL-PQL-029", "CAL-PQL-030", "CAL-PQL-031"], "YEAR"),
  contract("CAL-QL-025", ["CAL-CP-008"], "VALIDATE_FULL_YEAR_CALENDAR_MATCH", "Decide whether two full-year calendars are identical and identify the failing condition.", ["CAL-PQL-032"], "CLASSIFICATION"),
  contract("CAL-QL-026", ["CAL-CP-008"], "MATCH_SPECIFIED_MONTH_CALENDAR", "Find a year whose specified month has the same calendar grid.", ["CAL-PQL-033"], "YEAR"),
  contract("CAL-QL-027", ["CAL-CP-008"], "COUNT_IDENTICAL_FULL_YEAR_CALENDARS_IN_RANGE", "Count years with an identical full-year calendar inside a bounded interval.", ["CAL-PQL-034"], "COUNT"),
  contract("CAL-QL-028", ["CAL-CP-009"], "RESOLVE_YEAR_BOUNDARY_WEEKDAY", "Find the first or last weekday of a year from the opposite boundary weekday.", ["CAL-PQL-035", "CAL-PQL-036"], "WEEKDAY"),
  contract("CAL-QL-029", ["CAL-CP-009"], "RESOLVE_MONTH_BOUNDARY_WEEKDAY", "Find the first or last weekday of a month from the opposite boundary weekday.", ["CAL-PQL-037", "CAL-PQL-038"], "WEEKDAY"),
  contract("CAL-QL-030", ["CAL-CP-009"], "RESOLVE_SPECIFIED_DATE_FROM_MONTH_BOUNDARY", "Find a specified date's weekday from the first or last weekday of its month.", ["CAL-PQL-039"], "WEEKDAY"),
  contract("CAL-QL-031", ["CAL-CP-010"], "COUNT_NAMED_WEEKDAY_IN_MONTH", "Count a named weekday in a specified month.", ["CAL-PQL-040"], "COUNT"),
  contract("CAL-QL-032", ["CAL-CP-010"], "IDENTIFY_FIVE_OCCURRENCE_WEEKDAYS_IN_MONTH", "Identify every weekday that occurs five times in a specified month.", ["CAL-PQL-041"], "WEEKDAY_SET"),
  contract("CAL-QL-033", ["CAL-CP-010"], "COUNT_NAMED_WEEKDAY_IN_YEAR", "Count a named weekday in a specified year.", ["CAL-PQL-042"], "COUNT"),
  contract("CAL-QL-034", ["CAL-CP-010"], "IDENTIFY_FIFTY_THREE_OCCURRENCE_WEEKDAYS_IN_YEAR", "Identify every weekday that occurs 53 times in a specified year.", ["CAL-PQL-043"], "WEEKDAY_SET"),
  contract("CAL-QL-035", ["CAL-CP-010"], "COUNT_NAMED_WEEKDAY_IN_DATE_RANGE", "Count a named weekday in an explicit inclusive date range.", ["CAL-PQL-044"], "COUNT"),
  contract("CAL-QL-036", ["CAL-CP-010"], "ENUMERATE_NAMED_WEEKDAY_DATES_IN_MONTH", "List every date on which a named weekday occurs in a specified month.", ["CAL-GAP-PROT-002"], "DATE_SET"),
] as const;

export function getCalendarPermanentContract(qlId: CalendarPermanentQlId): CalendarPermanentContract {
  const found = CALENDAR_PERMANENT_CONTRACTS.find((entry) => entry.qlId === qlId);
  if (!found) throw new Error(`Unknown permanent Calendar QL '${qlId}'.`);
  return found;
}
