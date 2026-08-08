import type { CalendarPrototypeId, PrototypeDefinition } from "./types.ts";

export const CALENDAR_PROTOTYPES: readonly PrototypeDefinition[] = [
  { id: "CAL-PQL-001", checkpoint: "CAL-CP-001", title: "Forward weekday shift", operation: "Add N days to a known weekday", outputType: "WEEKDAY", explanationFamily: "A", dominantMisconceptions: ["SHIFT_BY_N_MINUS_ONE", "FAILED_MOD7_REDUCTION", "FORWARD_BACKWARD_REVERSAL"] },
  { id: "CAL-PQL-002", checkpoint: "CAL-CP-001", title: "Backward weekday shift", operation: "Subtract N days from a known weekday", outputType: "WEEKDAY", explanationFamily: "A", dominantMisconceptions: ["SHIFT_BY_N_PLUS_ONE", "NEGATIVE_MODULO_ERROR", "FORWARD_BACKWARD_REVERSAL"] },
  { id: "CAL-PQL-003", checkpoint: "CAL-CP-001", title: "Recover starting weekday", operation: "Recover starting weekday from ending weekday and shift", outputType: "WEEKDAY", explanationFamily: "A", dominantMisconceptions: ["FORWARD_BACKWARD_REVERSAL", "SHIFT_BY_N_MINUS_ONE", "FAILED_MOD7_REDUCTION"] },
  { id: "CAL-PQL-004", checkpoint: "CAL-CP-001", title: "Least satisfying day count", operation: "Find least or next day count satisfying weekday relation", outputType: "COUNT", explanationFamily: "A", dominantMisconceptions: ["COUNTED_ANCHOR_AS_DAY_ONE", "SHIFT_BY_N_PLUS_ONE", "FAILED_MOD7_REDUCTION"] },

  { id: "CAL-PQL-005", checkpoint: "CAL-CP-002", title: "Same-month date relation", operation: "Target weekday from same-month anchor", outputType: "WEEKDAY", explanationFamily: "B", dominantMisconceptions: ["COUNTED_ANCHOR_AS_DAY_ONE", "FORWARD_BACKWARD_REVERSAL", "SHIFT_BY_N_MINUS_ONE"] },
  { id: "CAL-PQL-006", checkpoint: "CAL-CP-002", title: "Ordinary cross-month relation", operation: "Target weekday across ordinary month boundaries", outputType: "WEEKDAY", explanationFamily: "B", dominantMisconceptions: ["WRONG_MONTH_LENGTH_30_FOR_31", "WRONG_MONTH_LENGTH_31_FOR_30", "OMITTED_TARGET_DATE"] },
  { id: "CAL-PQL-007", checkpoint: "CAL-CP-002", title: "Earlier date from later anchor", operation: "Earlier-date weekday from later-date anchor", outputType: "WEEKDAY", explanationFamily: "B", dominantMisconceptions: ["FORWARD_BACKWARD_REVERSAL", "NEGATIVE_MODULO_ERROR", "COUNTED_ANCHOR_AS_DAY_ONE"] },
  { id: "CAL-PQL-008", checkpoint: "CAL-CP-002", title: "Exact day difference", operation: "Exact day difference between dates", outputType: "COUNT", explanationFamily: "B", dominantMisconceptions: ["INCLUDED_BOTH_DATES", "EXCLUDED_BOTH_DATES", "OMITTED_TARGET_DATE"] },
  { id: "CAL-PQL-009", checkpoint: "CAL-CP-002", title: "Explicit date addition", operation: "Add or subtract explicit days to obtain date", outputType: "DATE", explanationFamily: "B", dominantMisconceptions: ["COUNTED_ANCHOR_AS_DAY_ONE", "SHIFT_BY_N_MINUS_ONE", "SHIFT_BY_N_PLUS_ONE"] },

  { id: "CAL-PQL-010", checkpoint: "CAL-CP-003", title: "Weekday across leap day", operation: "Weekday movement across 29 February", outputType: "WEEKDAY", explanationFamily: "C", dominantMisconceptions: ["FEB29_WRONGLY_EXCLUDED", "FEBRUARY_ALWAYS_28", "COUNTED_ANCHOR_AS_DAY_ONE"] },
  { id: "CAL-PQL-011", checkpoint: "CAL-CP-003", title: "Day gap across leap day", operation: "Day difference across 29 February", outputType: "COUNT", explanationFamily: "C", dominantMisconceptions: ["FEB29_WRONGLY_EXCLUDED", "INCLUDED_BOTH_DATES", "EXCLUDED_BOTH_DATES"] },
  { id: "CAL-PQL-012", checkpoint: "CAL-CP-003", title: "Explicit inclusive or exclusive count", operation: "Inclusive or exclusive count between dates", outputType: "COUNT", explanationFamily: "C", dominantMisconceptions: ["INCLUDED_BOTH_DATES", "EXCLUDED_BOTH_DATES", "FEB29_WRONGLY_EXCLUDED"] },
  { id: "CAL-PQL-013", checkpoint: "CAL-CP-003", title: "Leap day in span", operation: "Determine whether leap day lies in span", outputType: "CLASSIFICATION", explanationFamily: "C", dominantMisconceptions: ["FEB29_WRONGLY_INCLUDED", "FEB29_WRONGLY_EXCLUDED", "LEAP_EVERY_FOUR_YEARS_ONLY"] },

  { id: "CAL-PQL-014", checkpoint: "CAL-CP-004", title: "Absolute Gregorian weekday", operation: "Weekday of an absolute Gregorian date", outputType: "WEEKDAY", explanationFamily: "D", dominantMisconceptions: ["LEAP_YEAR_AS_ONE_ODD_DAY", "ORDINARY_YEAR_AS_TWO_ODD_DAYS", "CENTURY_BLOCK_OFFSET_ERROR"] },
  { id: "CAL-PQL-015", checkpoint: "CAL-CP-004", title: "Weekday of nth day", operation: "Weekday of nth day of year", outputType: "WEEKDAY", explanationFamily: "D", dominantMisconceptions: ["COUNTED_ANCHOR_AS_DAY_ONE", "FREQUENCY_USED_365_FOR_LEAP_YEAR", "SHIFT_BY_N_PLUS_ONE"] },
  { id: "CAL-PQL-016", checkpoint: "CAL-CP-004", title: "Day-of-year conversion relation", operation: "Convert date to day-of-year and use weekday relation", outputType: "COUNT", explanationFamily: "D", dominantMisconceptions: ["FEBRUARY_ALWAYS_28", "COUNTED_ANCHOR_AS_DAY_ONE", "OMITTED_TARGET_DATE"] },

  { id: "CAL-PQL-017", checkpoint: "CAL-CP-005", title: "Same date adjacent year", operation: "Same date next or previous year", outputType: "WEEKDAY", explanationFamily: "E", dominantMisconceptions: ["ORDINARY_YEAR_AS_TWO_ODD_DAYS", "LEAP_YEAR_AS_ONE_ODD_DAY", "FORWARD_BACKWARD_REVERSAL"] },
  { id: "CAL-PQL-018", checkpoint: "CAL-CP-005", title: "Multiple-year weekday movement", operation: "Target weekday across multiple years", outputType: "WEEKDAY", explanationFamily: "E", dominantMisconceptions: ["LEAP_EVERY_FOUR_YEARS_ONLY", "LEAP_YEAR_AS_ONE_ODD_DAY", "CENTURY_ALWAYS_LEAP"] },
  { id: "CAL-PQL-019", checkpoint: "CAL-CP-005", title: "First-day relation between years", operation: "Relationship between first days of two years", outputType: "COUNT", explanationFamily: "E", dominantMisconceptions: ["ORDINARY_YEAR_AS_TWO_ODD_DAYS", "LEAP_YEAR_AS_ONE_ODD_DAY", "FAILED_MOD7_REDUCTION"] },
  { id: "CAL-PQL-020", checkpoint: "CAL-CP-005", title: "Recover earlier cross-year anchor", operation: "Recover earlier weekday from later cross-year date", outputType: "WEEKDAY", explanationFamily: "E", dominantMisconceptions: ["FORWARD_BACKWARD_REVERSAL", "NEGATIVE_MODULO_ERROR", "LEAP_YEAR_AS_ONE_ODD_DAY"] },

  { id: "CAL-PQL-021", checkpoint: "CAL-CP-006", title: "Classify leap year", operation: "Classify a year as leap or ordinary", outputType: "CLASSIFICATION", explanationFamily: "F", dominantMisconceptions: ["LEAP_EVERY_FOUR_YEARS_ONLY", "CENTURY_ALWAYS_LEAP", "CENTURY_NEVER_LEAP"] },
  { id: "CAL-PQL-022", checkpoint: "CAL-CP-006", title: "Select year by leap status", operation: "Select only leap or ordinary year", outputType: "YEAR", explanationFamily: "F", dominantMisconceptions: ["LEAP_EVERY_FOUR_YEARS_ONLY", "CENTURY_ALWAYS_LEAP", "DIVISIBLE_BY_400_RULE_OMITTED"] },
  { id: "CAL-PQL-023", checkpoint: "CAL-CP-006", title: "Count leap years", operation: "Count leap years in inclusive range", outputType: "COUNT", explanationFamily: "F", dominantMisconceptions: ["LEAP_EVERY_FOUR_YEARS_ONLY", "CENTURY_ALWAYS_LEAP", "DIVISIBLE_BY_400_RULE_OMITTED"] },
  { id: "CAL-PQL-024", checkpoint: "CAL-CP-006", title: "Count ordinary years", operation: "Count ordinary years in inclusive range", outputType: "COUNT", explanationFamily: "F", dominantMisconceptions: ["LEAP_EVERY_FOUR_YEARS_ONLY", "CENTURY_ALWAYS_LEAP", "DIVISIBLE_BY_400_RULE_OMITTED"] },

  { id: "CAL-PQL-025", checkpoint: "CAL-CP-007", title: "Odd days in complete years", operation: "Odd days in N complete years", outputType: "COUNT", explanationFamily: "G", dominantMisconceptions: ["ORDINARY_YEAR_AS_TWO_ODD_DAYS", "LEAP_YEAR_AS_ONE_ODD_DAY", "FAILED_MOD7_REDUCTION"] },
  { id: "CAL-PQL-026", checkpoint: "CAL-CP-007", title: "Century-block odd days", operation: "Odd days in 100/200/300/400-year blocks", outputType: "COUNT", explanationFamily: "G", dominantMisconceptions: ["CENTURY_BLOCK_OFFSET_ERROR", "CENTURY_ALWAYS_LEAP", "DIVISIBLE_BY_400_RULE_OMITTED"] },
  { id: "CAL-PQL-027", checkpoint: "CAL-CP-007", title: "Weekday across century boundary", operation: "Weekday across a century boundary", outputType: "WEEKDAY", explanationFamily: "G", dominantMisconceptions: ["CENTURY_ALWAYS_LEAP", "CENTURY_NEVER_LEAP", "DIVISIBLE_BY_400_RULE_OMITTED"] },
  { id: "CAL-PQL-028", checkpoint: "CAL-CP-007", title: "Century exception in long range", operation: "Apply century exception in long range", outputType: "COUNT", explanationFamily: "G", dominantMisconceptions: ["LEAP_EVERY_FOUR_YEARS_ONLY", "CENTURY_ALWAYS_LEAP", "DIVISIBLE_BY_400_RULE_OMITTED"] },

  { id: "CAL-PQL-029", checkpoint: "CAL-CP-008", title: "Next identical full-year calendar", operation: "Find next identical full-year calendar", outputType: "YEAR", explanationFamily: "H", dominantMisconceptions: ["START_WEEKDAY_MATCH_ONLY", "YEAR_TYPE_MATCH_ONLY", "MONTH_MATCH_RULE_USED_FOR_FULL_YEAR"] },
  { id: "CAL-PQL-030", checkpoint: "CAL-CP-008", title: "Previous identical full-year calendar", operation: "Find previous identical full-year calendar", outputType: "YEAR", explanationFamily: "H", dominantMisconceptions: ["START_WEEKDAY_MATCH_ONLY", "YEAR_TYPE_MATCH_ONLY", "MONTH_MATCH_RULE_USED_FOR_FULL_YEAR"] },
  { id: "CAL-PQL-031", checkpoint: "CAL-CP-008", title: "Select matching full-year calendar", operation: "Select matching full-year calendar from options", outputType: "YEAR", explanationFamily: "H", dominantMisconceptions: ["START_WEEKDAY_MATCH_ONLY", "YEAR_TYPE_MATCH_ONLY", "MONTH_MATCH_RULE_USED_FOR_FULL_YEAR"] },
  { id: "CAL-PQL-032", checkpoint: "CAL-CP-008", title: "Validate full-year calendar match", operation: "Decide whether two full-year calendars match", outputType: "CLASSIFICATION", explanationFamily: "H", dominantMisconceptions: ["START_WEEKDAY_MATCH_ONLY", "YEAR_TYPE_MATCH_ONLY", "MONTH_MATCH_RULE_USED_FOR_FULL_YEAR"] },
  { id: "CAL-PQL-033", checkpoint: "CAL-CP-008", title: "Match specified month calendar", operation: "Match one specified month calendar", outputType: "YEAR", explanationFamily: "H", dominantMisconceptions: ["FULL_YEAR_RULE_USED_FOR_MONTH_MATCH", "START_WEEKDAY_MATCH_ONLY", "YEAR_TYPE_MATCH_ONLY"] },
  { id: "CAL-PQL-034", checkpoint: "CAL-CP-008", title: "Count identical calendars in interval", operation: "Count identical calendars in bounded interval", outputType: "COUNT", explanationFamily: "H", dominantMisconceptions: ["START_WEEKDAY_MATCH_ONLY", "YEAR_TYPE_MATCH_ONLY", "MONTH_MATCH_RULE_USED_FOR_FULL_YEAR"] },

  { id: "CAL-PQL-035", checkpoint: "CAL-CP-009", title: "Last weekday from first weekday of year", operation: "Last weekday of year from first weekday", outputType: "WEEKDAY", explanationFamily: "I", dominantMisconceptions: ["FIRST_LAST_DAY_OFF_BY_ONE", "FREQUENCY_USED_365_FOR_LEAP_YEAR", "FREQUENCY_USED_366_FOR_ORDINARY_YEAR"] },
  { id: "CAL-PQL-036", checkpoint: "CAL-CP-009", title: "First weekday from last weekday of year", operation: "First weekday of year from last weekday", outputType: "WEEKDAY", explanationFamily: "I", dominantMisconceptions: ["FIRST_LAST_DAY_OFF_BY_ONE", "FORWARD_BACKWARD_REVERSAL", "NEGATIVE_MODULO_ERROR"] },
  { id: "CAL-PQL-037", checkpoint: "CAL-CP-009", title: "Last weekday from first weekday of month", operation: "Last weekday of month from first weekday", outputType: "WEEKDAY", explanationFamily: "I", dominantMisconceptions: ["FIRST_LAST_DAY_OFF_BY_ONE", "WRONG_MONTH_LENGTH_30_FOR_31", "FEBRUARY_ALWAYS_28"] },
  { id: "CAL-PQL-038", checkpoint: "CAL-CP-009", title: "First weekday from last weekday of month", operation: "First weekday of month from last weekday", outputType: "WEEKDAY", explanationFamily: "I", dominantMisconceptions: ["FIRST_LAST_DAY_OFF_BY_ONE", "WRONG_MONTH_LENGTH_31_FOR_30", "FEBRUARY_ALWAYS_29"] },
  { id: "CAL-PQL-039", checkpoint: "CAL-CP-009", title: "Specified date from month boundary", operation: "Weekday of date from first or last weekday", outputType: "WEEKDAY", explanationFamily: "I", dominantMisconceptions: ["FIRST_LAST_DAY_OFF_BY_ONE", "COUNTED_ANCHOR_AS_DAY_ONE", "FORWARD_BACKWARD_REVERSAL"] },

  { id: "CAL-PQL-040", checkpoint: "CAL-CP-010", title: "Count named weekday in month", operation: "Count a named weekday in a month", outputType: "COUNT", explanationFamily: "J", dominantMisconceptions: ["FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", "FEBRUARY_ALWAYS_28", "WRONG_MONTH_LENGTH_30_FOR_31"] },
  { id: "CAL-PQL-041", checkpoint: "CAL-CP-010", title: "Weekdays occurring five times", operation: "Identify weekdays occurring five times in month", outputType: "WEEKDAY_SET", explanationFamily: "J", dominantMisconceptions: ["FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", "FIRST_LAST_DAY_OFF_BY_ONE", "WRONG_MONTH_LENGTH_31_FOR_30"] },
  { id: "CAL-PQL-042", checkpoint: "CAL-CP-010", title: "Count named weekday in year", operation: "Count a named weekday in a year", outputType: "COUNT", explanationFamily: "J", dominantMisconceptions: ["FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", "FREQUENCY_USED_365_FOR_LEAP_YEAR", "FREQUENCY_USED_366_FOR_ORDINARY_YEAR"] },
  { id: "CAL-PQL-043", checkpoint: "CAL-CP-010", title: "Weekdays occurring 53 times", operation: "Identify weekdays occurring 53 times in year", outputType: "WEEKDAY_SET", explanationFamily: "J", dominantMisconceptions: ["FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", "FREQUENCY_USED_365_FOR_LEAP_YEAR", "FREQUENCY_USED_366_FOR_ORDINARY_YEAR"] },
  { id: "CAL-PQL-044", checkpoint: "CAL-CP-010", title: "Count weekday in inclusive range", operation: "Count named weekday in explicit inclusive date range", outputType: "COUNT", explanationFamily: "J", dominantMisconceptions: ["FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", "INCLUDED_BOTH_DATES", "EXCLUDED_BOTH_DATES"] },
] as const;

export const CALENDAR_PROTOTYPE_IDS = CALENDAR_PROTOTYPES.map((definition) => definition.id) as CalendarPrototypeId[];

export function getPrototypeDefinition(id: CalendarPrototypeId): PrototypeDefinition {
  const definition = CALENDAR_PROTOTYPES.find((candidate) => candidate.id === id);
  if (!definition) throw new Error(`Unknown Calendar prototype ${id}.`);
  return definition;
}

export const CALENDAR_CHECKPOINTS = [
  { id: "CAL-CP-001", ownership: "Basic weekday shifts from a known weekday" },
  { id: "CAL-CP-002", ownership: "Ordinary date relations within a month or non-leap-sensitive span" },
  { id: "CAL-CP-003", ownership: "Leap-day boundaries and explicit counting semantics" },
  { id: "CAL-CP-004", ownership: "Absolute weekday of a Gregorian date" },
  { id: "CAL-CP-005", ownership: "Cross-year and same-date year-shift reasoning" },
  { id: "CAL-CP-006", ownership: "Leap-year classification and range counting" },
  { id: "CAL-CP-007", ownership: "Century rules and long-range odd-day reasoning" },
  { id: "CAL-CP-008", ownership: "Calendar repetition and matching" },
  { id: "CAL-CP-009", ownership: "Month/year boundary-day relationships" },
  { id: "CAL-CP-010", ownership: "Frequency of weekdays in periods" },
] as const;
