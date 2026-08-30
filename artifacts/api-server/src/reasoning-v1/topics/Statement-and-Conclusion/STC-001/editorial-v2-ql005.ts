import type { StcV2EditorialAuthority } from "./editorial-v2-types.ts";

export const STC_V2_QL005_AUTHORITIES: readonly StcV2EditorialAuthority[] = [
  {
    id: "STC-V2-SC-033", qlId: "STC-QL-005", difficulty: "EASY", surfaceArchetype: "DIRECT_COMPARISON",
    statement: "Product X costs less than Product Y but more than Product Z.",
    conclusions: ["Product Z costs less than Product X.", "Product X is the least expensive of the three."],
    answerClass: "ONLY_I",
    explanation: ["If X costs more than Z, then Z costs less than X.", "Z, not X, is below X in price."],
  },
  {
    id: "STC-V2-SC-034", qlId: "STC-QL-005", difficulty: "MEDIUM", surfaceArchetype: "SURVEY_REPORT",
    statement: "A survey found weekly mobile-banking use among 54% of urban respondents and 37% of rural respondents.",
    conclusions: ["Weekly mobile-banking use was more common among rural respondents.", "Weekly mobile-banking use was more common among urban respondents."],
    answerClass: "ONLY_II",
    explanation: ["Thirty-seven per cent is lower than 54%.", "Fifty-four per cent is greater than 37%."],
  },
  {
    id: "STC-V2-SC-035", qlId: "STC-QL-005", difficulty: "EASY", surfaceArchetype: "NUMERIC_SNAPSHOT",
    statement: "Town C received 700 mm of rain, Town A 620 mm and Town B 580 mm during the monsoon period.",
    conclusions: ["Town C received more rain than Town A.", "Town A received more rain than Town B."],
    answerClass: "BOTH",
    explanation: ["Seven hundred millimetres is greater than 620.", "Six hundred twenty millimetres is greater than 580."],
  },
  {
    id: "STC-V2-SC-036", qlId: "STC-QL-005", difficulty: "HARD", surfaceArchetype: "CONTRAST_CONCESSION",
    statement: "District X had a higher vaccination coverage rate than District Y, although District Y administered more doses because its population was larger.",
    conclusions: ["District X administered more doses than District Y.", "A higher coverage rate always means a higher absolute number of doses."],
    answerClass: "NEITHER",
    explanation: ["The statement explicitly says District Y administered more doses.", "The example itself shows that coverage rate and absolute doses can rank differently."],
  },
  {
    id: "STC-V2-SC-037", qlId: "STC-QL-005", difficulty: "MEDIUM", surfaceArchetype: "EVERYDAY_OBSERVATION",
    statement: "Queue A moved faster than Queue B, but people in Queue B waited for less time on average because it was much shorter.",
    conclusions: ["Queue A had the faster movement rate.", "People in Queue A necessarily had the shorter average wait."],
    answerClass: "ONLY_I",
    explanation: ["The statement explicitly says Queue A moved faster.", "The statement gives Queue B the shorter average wait."],
  },
  {
    id: "STC-V2-SC-038", qlId: "STC-QL-005", difficulty: "HARD", surfaceArchetype: "QUOTED_CLAIM",
    statement: "The manager said, \"Unit R processes files faster than Unit S, but Unit S makes fewer errors.\"",
    conclusions: ["Unit R makes fewer errors than Unit S.", "Unit S performs better on the stated error measure."],
    answerClass: "ONLY_II",
    explanation: ["The manager says Unit S, not R, makes fewer errors.", "Fewer errors gives Unit S the stated accuracy advantage."],
  },
  {
    id: "STC-V2-SC-039", qlId: "STC-QL-005", difficulty: "MEDIUM", surfaceArchetype: "RULE_ELIGIBILITY",
    statement: "For promotion points, Grade A carries more weight than Grade B, and Grade B carries more weight than Grade C.",
    conclusions: ["Grade A carries more weight than Grade C.", "Grade C carries less weight than Grade A."],
    answerClass: "BOTH",
    explanation: ["The stated order A > B > C implies A > C.", "The same order also implies C < A."],
  },
  {
    id: "STC-V2-SC-040", qlId: "STC-QL-005", difficulty: "HARD", surfaceArchetype: "EVENT_SEQUENCE",
    statement: "In the three heats, Karan's time was lower than Mohit's, and Mohit's time was lower than Arjun's. Lower time means faster performance.",
    conclusions: ["Arjun was faster than Karan.", "Karan was slower than Arjun."],
    answerClass: "NEITHER",
    explanation: ["Karan has the lower time and is therefore faster.", "The second conclusion also reverses the established comparison."],
  },
] as const;
