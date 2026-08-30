import type { StcV2EditorialAuthority } from "./editorial-v2-types.ts";

export const STC_V2_QL001_AUTHORITIES: readonly StcV2EditorialAuthority[] = [
  {
    id: "STC-V2-SC-001", qlId: "STC-QL-001", difficulty: "EASY", surfaceArchetype: "ONE_LINE_FACT",
    statement: "The railway enquiry counter at City Station closes at 8 p.m. every day.",
    conclusions: ["A passenger reaching the enquiry counter after 8 p.m. cannot use that counter for an enquiry.", "City Station itself closes at 8 p.m."],
    answerClass: "ONLY_I",
    explanation: ["The stated closing time applies directly to the enquiry counter.", "The statement gives no closing time for the station as a whole."],
  },
  {
    id: "STC-V2-SC-002", qlId: "STC-QL-001", difficulty: "EASY", surfaceArchetype: "PUBLIC_NOTICE",
    statement: "Notice: The museum will remain closed to visitors on Monday. Online ticket booking will remain available.",
    conclusions: ["Online ticket booking will also remain closed on Monday.", "Visitors cannot enter the museum on Monday."],
    answerClass: "ONLY_II",
    explanation: ["The notice expressly says online booking remains available.", "The museum is explicitly closed to visitors on Monday."],
  },
  {
    id: "STC-V2-SC-003", qlId: "STC-QL-001", difficulty: "MEDIUM", surfaceArchetype: "EVERYDAY_OBSERVATION",
    statement: "The college canteen stopped serving breakfast this month, but lunch and evening snacks continue as before.",
    conclusions: ["Breakfast is no longer being served by the canteen this month.", "Lunch service is continuing this month."],
    answerClass: "BOTH",
    explanation: ["Breakfast service is explicitly stated to have stopped.", "The statement expressly says lunch continues as before."],
  },
  {
    id: "STC-V2-SC-004", qlId: "STC-QL-001", difficulty: "MEDIUM", surfaceArchetype: "SURVEY_REPORT",
    statement: "A survey of 500 commuters found that 62% use the metro at least once a week.",
    conclusions: ["Every commuter surveyed uses the metro every day.", "Less than half of the commuters surveyed use the metro at least once a week."],
    answerClass: "NEITHER",
    explanation: ["Sixty-two per cent does not mean every commuter uses it daily.", "Sixty-two per cent is more than half, not less."],
  },
  {
    id: "STC-V2-SC-005", qlId: "STC-QL-001", difficulty: "MEDIUM", surfaceArchetype: "QUOTED_CLAIM",
    statement: "The principal said, \"The annual function will be held in the school auditorium; the date has not yet been finalised.\"",
    conclusions: ["The venue of the annual function has been decided.", "The annual function has been cancelled."],
    answerClass: "ONLY_I",
    explanation: ["The principal identifies the auditorium as the venue.", "No cancellation is stated."],
  },
  {
    id: "STC-V2-SC-006", qlId: "STC-QL-001", difficulty: "MEDIUM", surfaceArchetype: "RULE_ELIGIBILITY",
    statement: "Entry to the archive room requires a staff identity card. Neeraj entered the archive room in accordance with the rule.",
    conclusions: ["Neeraj is a permanent employee of the organisation.", "Neeraj had the identity document required by the rule."],
    answerClass: "ONLY_II",
    explanation: ["Permanent employment is not stated or required by the rule.", "Compliant entry under the stated rule requires the staff identity card."],
  },
  {
    id: "STC-V2-SC-007", qlId: "STC-QL-001", difficulty: "EASY", surfaceArchetype: "NUMERIC_SNAPSHOT",
    statement: "Of the 60 seats in the training programme, 18 are reserved for departmental candidates.",
    conclusions: ["Forty-two seats are outside the departmental reservation.", "Fewer than half of the programme's seats are reserved for departmental candidates."],
    answerClass: "BOTH",
    explanation: ["Subtracting 18 from 60 leaves 42 seats outside that reservation.", "Eighteen out of 60 is fewer than half."],
  },
  {
    id: "STC-V2-SC-008", qlId: "STC-QL-001", difficulty: "HARD", surfaceArchetype: "CONTRAST_CONCESSION",
    statement: "The branch has shifted its cash counter to the ground floor, while the locker section continues to operate on the first floor.",
    conclusions: ["All customer services of the branch have shifted to the ground floor.", "The cash counter and locker section now operate on the same floor."],
    answerClass: "NEITHER",
    explanation: ["The locker section remains on the first floor, so not all services shifted.", "The two services are explicitly on different floors."],
  },
] as const;
