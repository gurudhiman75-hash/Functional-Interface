import type { StcV2EditorialAuthority } from "./editorial-v2-types.ts";

export const STC_V2_QL004_AUTHORITIES: readonly StcV2EditorialAuthority[] = [
  {
    id: "STC-V2-SC-025", qlId: "STC-QL-004", difficulty: "EASY", surfaceArchetype: "FORECAST_OUTLOOK",
    statement: "The weather department says heavy rain is likely in several parts of the district tomorrow.",
    conclusions: ["Heavy rain is considered a realistic possibility in at least some parts of the district.", "Heavy rain is certain in every part of the district tomorrow."],
    answerClass: "ONLY_I",
    explanation: ["Likely expresses a real possibility.", "Likely in several parts does not mean certain in every part."],
  },
  {
    id: "STC-V2-SC-026", qlId: "STC-QL-004", difficulty: "MEDIUM", surfaceArchetype: "PUBLIC_NOTICE",
    statement: "The board has stated that the examination schedule may be revised if the court hearing affects the notified dates.",
    conclusions: ["The examination schedule has already been revised.", "A revision of the schedule is possible under the stated condition."],
    answerClass: "ONLY_II",
    explanation: ["The statement announces only a possibility, not a completed revision.", "The word may supports a possible revision under the condition."],
  },
  {
    id: "STC-V2-SC-027", qlId: "STC-QL-004", difficulty: "MEDIUM", surfaceArchetype: "QUOTED_CLAIM",
    statement: "An economist said, \"Inflation could ease further this quarter, but the data are not yet strong enough to call that certain.\"",
    conclusions: ["A further easing of inflation is presented as possible.", "The economist does not present that easing as certain."],
    answerClass: "BOTH",
    explanation: ["Could explicitly expresses possibility.", "The quotation expressly withholds certainty."],
  },
  {
    id: "STC-V2-SC-028", qlId: "STC-QL-004", difficulty: "MEDIUM", surfaceArchetype: "SURVEY_REPORT",
    statement: "The bank expects digital transactions to increase during the festival period, but has issued no estimate of the size of the increase.",
    conclusions: ["Digital transactions will certainly rise by at least 20%.", "Every customer will use digital payments during the festival period."],
    answerClass: "NEITHER",
    explanation: ["Neither certainty nor a 20% figure is given.", "The statement concerns an expected aggregate increase, not universal customer behaviour."],
  },
  {
    id: "STC-V2-SC-029", qlId: "STC-QL-004", difficulty: "HARD", surfaceArchetype: "ADVICE_WARNING",
    statement: "Officials have warned that strong winds could disrupt ferry services tonight.",
    conclusions: ["Ferry disruption tonight is possible.", "All ferry services will definitely be cancelled tonight."],
    answerClass: "ONLY_I",
    explanation: ["Could disrupt expresses possibility.", "Possible disruption does not establish certain cancellation of all services."],
  },
  {
    id: "STC-V2-SC-030", qlId: "STC-QL-004", difficulty: "HARD", surfaceArchetype: "CONTRAST_CONCESSION",
    statement: "The department is considering extending the application deadline, but no decision has yet been approved.",
    conclusions: ["The deadline has definitely been extended.", "An extension remains under consideration rather than confirmed."],
    answerClass: "ONLY_II",
    explanation: ["The statement expressly says no decision has been approved.", "Considering an extension supports possibility, not completion."],
  },
  {
    id: "STC-V2-SC-031", qlId: "STC-QL-004", difficulty: "HARD", surfaceArchetype: "EVENT_SEQUENCE",
    statement: "Engineers will inspect the bridge on Monday; if the inspection is satisfactory, the bridge could reopen later in the week. No reopening decision has yet been made.",
    conclusions: ["Reopening later in the week is presented as a conditional possibility.", "The statement does not present reopening as certain."],
    answerClass: "BOTH",
    explanation: ["The word could makes reopening possible if the condition is met.", "The final sentence expressly says no reopening decision has yet been made."],
  },
  {
    id: "STC-V2-SC-032", qlId: "STC-QL-004", difficulty: "MEDIUM", surfaceArchetype: "ONE_LINE_FACT",
    statement: "Hostel fees are unlikely to be revised before the next academic session.",
    conclusions: ["A fee revision before the next academic session is impossible.", "Hostel fees have already been revised for the next session."],
    answerClass: "NEITHER",
    explanation: ["Unlikely is weaker than impossible.", "The statement gives no completed fee revision."],
  },
] as const;
