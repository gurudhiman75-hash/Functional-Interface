import type { StcV2EditorialAuthority } from "./editorial-v2-types.ts";

export const STC_V2_QL006_AUTHORITIES: readonly StcV2EditorialAuthority[] = [
  {
    id: "STC-V2-SC-041", qlId: "STC-QL-006", difficulty: "MEDIUM", surfaceArchetype: "NUMERIC_SNAPSHOT",
    statement: "Applications received in four successive quarters were 1,200, 1,360, 1,490 and 1,430.",
    conclusions: ["The third quarter recorded the highest figure among the four.", "Applications increased in every successive quarter."],
    answerClass: "ONLY_I",
    explanation: ["1,490 is the largest of the four values.", "The fourth-quarter figure fell from 1,490 to 1,430."],
  },
  {
    id: "STC-V2-SC-042", qlId: "STC-QL-006", difficulty: "EASY", surfaceArchetype: "EVENT_SEQUENCE",
    statement: "Candidates were shortlisted first, then called for document verification, and only after verification were they called for interview. Riya has reached the interview stage.",
    conclusions: ["Riya's interview came before her document verification.", "Riya's document verification came before her interview."],
    answerClass: "ONLY_II",
    explanation: ["The stated sequence puts document verification before interview.", "Reaching interview under the sequence places verification earlier."],
  },
  {
    id: "STC-V2-SC-043", qlId: "STC-QL-006", difficulty: "MEDIUM", surfaceArchetype: "SURVEY_REPORT",
    statement: "The share of customers using paper statements fell from 44% in January to 36% in April and 29% in July.",
    conclusions: ["Paper-statement use declined over the period described.", "The July share was lower than the April share."],
    answerClass: "BOTH",
    explanation: ["The sequence 44%, 36%, 29% shows decline.", "Twenty-nine per cent is lower than 36%."],
  },
  {
    id: "STC-V2-SC-044", qlId: "STC-QL-006", difficulty: "MEDIUM", surfaceArchetype: "PUBLIC_NOTICE",
    statement: "The answer key will be released on Monday, objections will be accepted until Thursday, and the revised key will be issued the following week.",
    conclusions: ["The revised key is scheduled before objections can be submitted.", "The answer key is scheduled after the revised key."],
    answerClass: "NEITHER",
    explanation: ["The revised key comes after the objection window, not before it.", "The answer key is scheduled first."],
  },
  {
    id: "STC-V2-SC-045", qlId: "STC-QL-006", difficulty: "MEDIUM", surfaceArchetype: "EVERYDAY_OBSERVATION",
    statement: "Attendance rose from the first training session to the second, stayed unchanged in the third, and fell in the fourth.",
    conclusions: ["Attendance in the third session matched the second session.", "Attendance rose in every session compared with the one before it."],
    answerClass: "ONLY_I",
    explanation: ["The statement explicitly says the third session was unchanged from the second.", "The fourth session fell, so attendance did not rise every time."],
  },
  {
    id: "STC-V2-SC-046", qlId: "STC-QL-006", difficulty: "HARD", surfaceArchetype: "QUOTED_CLAIM",
    statement: "The editor said, \"Subscriptions climbed for three months, levelled off in July, and slipped slightly in August.\"",
    conclusions: ["Subscriptions continued rising without interruption through August.", "Subscriptions were lower in August than in July."],
    answerClass: "ONLY_II",
    explanation: ["The July plateau and August decline break continuous growth.", "Slipped slightly in August means a fall from the July level."],
  },
  {
    id: "STC-V2-SC-047", qlId: "STC-QL-006", difficulty: "HARD", surfaceArchetype: "CONTRAST_CONCESSION",
    statement: "Average disposal time fell in each of the last three quarters, including the latest quarter, while the number of new cases rose sharply in the latest quarter.",
    conclusions: ["The latest quarter combined a lower disposal time with a higher inflow of new cases.", "The two measures moved in opposite directions in the latest quarter."],
    answerClass: "BOTH",
    explanation: ["In the latest quarter, disposal time fell while the number of new cases rose.", "The two measures therefore moved in opposite directions in that quarter."],
  },
  {
    id: "STC-V2-SC-048", qlId: "STC-QL-006", difficulty: "HARD", surfaceArchetype: "FORECAST_OUTLOOK",
    statement: "The report says pending cases are expected to keep falling if the present disposal rate is maintained.",
    conclusions: ["Pending cases are guaranteed to fall even if the disposal rate changes.", "The statement proves that pending cases have already fallen this month."],
    answerClass: "NEITHER",
    explanation: ["The forecast is conditional, not unconditional.", "The statement is a forecast and gives no completed monthly result."],
  },
] as const;
