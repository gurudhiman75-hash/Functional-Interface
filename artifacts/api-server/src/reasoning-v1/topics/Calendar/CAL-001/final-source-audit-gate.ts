import type { CalendarSourceGapPrototypeId } from "./source-gap-runtime.ts";

export type FinalCalendarSourceClass =
  | "SSC"
  | "RRB"
  | "BANKING"
  | "PUNJAB_STATE"
  | "ESTABLISHED_BOOK"
  | "RECENT_MEMORY_SET";

export type FinalCalendarSourceAuditEntry = {
  sourceClass: FinalCalendarSourceClass;
  source: string;
  evidenceStrength: "DIRECT_QUESTION" | "CORROBORATING_PATTERN" | "BOUNDARY_REVIEW" | "HUMAN_REVIEW";
  patterns: readonly string[];
  disposition: "COVERED_EXISTING" | "CLOSED_BY_NEW_AUTHORITY" | "REPRESENTATION_ONLY" | "NO_NEW_AUTHORITY";
  gapPrototype?: CalendarSourceGapPrototypeId;
  reviewer: "PROJECT_OWNER_APPROVED_2026_08_08" | "PROJECT_OWNER_DIRECTED_FINAL_CLOSURE_2026_08_08";
};

export const FINAL_CALENDAR_SOURCE_AUDIT: readonly FinalCalendarSourceAuditEntry[] = [
  {
    sourceClass: "ESTABLISHED_BOOK",
    source: "Uploaded Reasoning for Competitions Calendar chapter and uploaded quantitative-aptitude Calendar references",
    evidenceStrength: "DIRECT_QUESTION",
    patterns: [
      "odd-day blocks and absolute weekday",
      "same full-year calendar",
      "same birthday or date returning to the same weekday",
      "month-boundary relations and weekday frequency",
      "all dates of a named weekday in a month",
      "29 February occurrence across long year ranges",
    ],
    disposition: "COVERED_EXISTING",
    reviewer: "PROJECT_OWNER_DIRECTED_FINAL_CLOSURE_2026_08_08",
  },
  {
    sourceClass: "SSC",
    source: "SSC CGL and SSC CPO official-paper-labelled Calendar questions reviewed through established previous-paper repositories",
    evidenceStrength: "DIRECT_QUESTION",
    patterns: ["same full-year calendar", "absolute weekday", "ordinary and leap-year movement"],
    disposition: "COVERED_EXISTING",
    reviewer: "PROJECT_OWNER_APPROVED_2026_08_08",
  },
  {
    sourceClass: "RRB",
    source: "RRB Group D and RRB ALP official-paper-labelled Calendar questions",
    evidenceStrength: "DIRECT_QUESTION",
    patterns: ["same calendar year", "day on a date", "year shift"],
    disposition: "COVERED_EXISTING",
    reviewer: "PROJECT_OWNER_APPROVED_2026_08_08",
  },
  {
    sourceClass: "PUNJAB_STATE",
    source: "PSSSB Senior Assistant and PSSSB Assistant Superintendent Calendar questions and official-paper archive review",
    evidenceStrength: "DIRECT_QUESTION",
    patterns: ["1 January leap-year movement", "conditional month/date weekday relation"],
    disposition: "COVERED_EXISTING",
    reviewer: "PROJECT_OWNER_DIRECTED_FINAL_CLOSURE_2026_08_08",
  },
  {
    sourceClass: "RECENT_MEMORY_SET",
    source: "2026 Punjab-state exam memory/practice sets reviewed for Calendar wording and bilingual exam form",
    evidenceStrength: "CORROBORATING_PATTERN",
    patterns: ["conditional date relation", "leap-year date movement", "bilingual renderer requirements"],
    disposition: "NO_NEW_AUTHORITY",
    reviewer: "PROJECT_OWNER_DIRECTED_FINAL_CLOSURE_2026_08_08",
  },
  {
    sourceClass: "BANKING",
    source: "Current IBPS/SBI reasoning topic and previous-paper repositories reviewed",
    evidenceStrength: "BOUNDARY_REVIEW",
    patterns: ["Calendar remains a general competitive-exam concept but is not a dominant current bank-reasoning family"],
    disposition: "NO_NEW_AUTHORITY",
    reviewer: "PROJECT_OWNER_DIRECTED_FINAL_CLOSURE_2026_08_08",
  },
  {
    sourceClass: "ESTABLISHED_BOOK",
    source: "Source-gap closure: same date next returns to same weekday",
    evidenceStrength: "DIRECT_QUESTION",
    patterns: ["birthday recurrence without requiring identical full-year calendar"],
    disposition: "CLOSED_BY_NEW_AUTHORITY",
    gapPrototype: "CAL-GAP-PROT-001",
    reviewer: "PROJECT_OWNER_DIRECTED_FINAL_CLOSURE_2026_08_08",
  },
  {
    sourceClass: "ESTABLISHED_BOOK",
    source: "Source-gap closure: enumerate every date of a named weekday in a month",
    evidenceStrength: "DIRECT_QUESTION",
    patterns: ["date-set answer derived from first occurrence plus seven-day steps"],
    disposition: "CLOSED_BY_NEW_AUTHORITY",
    gapPrototype: "CAL-GAP-PROT-002",
    reviewer: "PROJECT_OWNER_DIRECTED_FINAL_CLOSURE_2026_08_08",
  },
  {
    sourceClass: "ESTABLISHED_BOOK",
    source: "Source-gap closure: count occurrences of 29 February in an inclusive year range",
    evidenceStrength: "DIRECT_QUESTION",
    patterns: ["date-validity count with divisible-by-100 and divisible-by-400 exceptions"],
    disposition: "CLOSED_BY_NEW_AUTHORITY",
    gapPrototype: "CAL-GAP-PROT-003",
    reviewer: "PROJECT_OWNER_DIRECTED_FINAL_CLOSURE_2026_08_08",
  },
] as const;

export type FinalCalendarSourceAuditGate = {
  passed: boolean;
  coveredSourceClasses: FinalCalendarSourceClass[];
  gapPrototypes: CalendarSourceGapPrototypeId[];
  unresolvedGaps: number;
  reasons: string[];
};

export function evaluateFinalCalendarSourceAudit(entries: readonly FinalCalendarSourceAuditEntry[]): FinalCalendarSourceAuditGate {
  const required: FinalCalendarSourceClass[] = ["SSC", "RRB", "BANKING", "PUNJAB_STATE", "ESTABLISHED_BOOK", "RECENT_MEMORY_SET"];
  const covered = [...new Set(entries.map((entry) => entry.sourceClass))];
  const gaps = [...new Set(entries.flatMap((entry) => entry.gapPrototype ? [entry.gapPrototype] : []))];
  const reasons: string[] = [];
  const missing = required.filter((sourceClass) => !covered.includes(sourceClass));
  if (missing.length) reasons.push(`Missing source-class review: ${missing.join(", ")}.`);
  for (const id of ["CAL-GAP-PROT-001", "CAL-GAP-PROT-002", "CAL-GAP-PROT-003"] as const) {
    if (!gaps.includes(id)) reasons.push(`Source gap ${id} is not closed.`);
  }
  const unresolvedGaps = entries.filter((entry) => entry.disposition === "CLOSED_BY_NEW_AUTHORITY" && !entry.gapPrototype && entry.patterns.length === 0).length;
  if (unresolvedGaps) reasons.push(`${unresolvedGaps} source gap(s) remain unresolved.`);
  return {
    passed: reasons.length === 0,
    coveredSourceClasses: covered,
    gapPrototypes: gaps,
    unresolvedGaps,
    reasons,
  };
}

export const FINAL_CALENDAR_SOURCE_AUDIT_GATE = evaluateFinalCalendarSourceAudit(FINAL_CALENDAR_SOURCE_AUDIT);
