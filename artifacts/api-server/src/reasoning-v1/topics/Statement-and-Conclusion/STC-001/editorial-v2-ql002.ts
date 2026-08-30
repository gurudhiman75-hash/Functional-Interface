import type { StcV2EditorialAuthority } from "./editorial-v2-types.ts";

export const STC_V2_QL002_AUTHORITIES: readonly StcV2EditorialAuthority[] = [
  {
    id: "STC-V2-SC-009", qlId: "STC-QL-002", difficulty: "MEDIUM", surfaceArchetype: "SURVEY_REPORT",
    statement: "The annual report shows that complaints received fell by 14%, while the average time taken to resolve a complaint increased.",
    conclusions: ["Fewer complaints were received than in the previous period.", "The average complaint was resolved faster than before."],
    answerClass: "ONLY_I",
    explanation: ["A 14% fall means fewer complaints were received.", "Resolution time increased, so faster resolution does not follow."],
  },
  {
    id: "STC-V2-SC-010", qlId: "STC-QL-002", difficulty: "MEDIUM", surfaceArchetype: "EVERYDAY_OBSERVATION",
    statement: "After the streetlights on Market Road were repaired, complaints about dark spots fell sharply. Complaints of theft remained at about the same level.",
    conclusions: ["Theft complaints also declined sharply after the repairs.", "Complaints about poor lighting declined after the repairs."],
    answerClass: "ONLY_II",
    explanation: ["The statement says theft complaints remained about the same.", "The statement directly reports a sharp fall in dark-spot complaints."],
  },
  {
    id: "STC-V2-SC-011", qlId: "STC-QL-002", difficulty: "EASY", surfaceArchetype: "PUBLIC_NOTICE",
    statement: "The grievance cell accepts complaints through the online portal and at district facilitation centres. Complaints sent through ordinary post are not registered.",
    conclusions: ["A complainant has more than one recognised channel for filing a grievance.", "Ordinary post is not a recognised registration channel."],
    answerClass: "BOTH",
    explanation: ["Two accepted channels are explicitly named.", "The statement expressly excludes ordinary post."],
  },
  {
    id: "STC-V2-SC-012", qlId: "STC-QL-002", difficulty: "MEDIUM", surfaceArchetype: "CONTRAST_CONCESSION",
    statement: "The new model is lighter than the old one, but its battery lasts for fewer hours on a full charge.",
    conclusions: ["The new model improved on both weight and battery life.", "The new model has longer battery life than the old one."],
    answerClass: "NEITHER",
    explanation: ["Only weight improved; battery life became shorter.", "The statement says battery life is shorter, not longer."],
  },
  {
    id: "STC-V2-SC-013", qlId: "STC-QL-002", difficulty: "MEDIUM", surfaceArchetype: "RULE_ELIGIBILITY",
    statement: "For reimbursement, employees must submit the travel ticket and the approved tour order. Bills without either document are returned for correction.",
    conclusions: ["Both listed documents are required for a complete claim.", "A travel ticket alone is sufficient for reimbursement."],
    answerClass: "ONLY_I",
    explanation: ["The rule makes both documents necessary.", "One document alone does not satisfy the stated requirement."],
  },
  {
    id: "STC-V2-SC-014", qlId: "STC-QL-002", difficulty: "HARD", surfaceArchetype: "QUOTED_CLAIM",
    statement: "The coach said, \"We created enough chances to win, but we failed to convert them.\"",
    conclusions: ["The team created no scoring chances.", "According to the coach, conversion of chances was a problem."],
    answerClass: "ONLY_II",
    explanation: ["The coach says enough chances were created.", "The coach explicitly identifies failure to convert them."],
  },
  {
    id: "STC-V2-SC-015", qlId: "STC-QL-002", difficulty: "MEDIUM", surfaceArchetype: "NUMERIC_SNAPSHOT",
    statement: "A help desk received 240 calls on Monday and 300 on Tuesday; abandoned calls fell from 36 to 24.",
    conclusions: ["The help desk received more calls on Tuesday than on Monday.", "The number of abandoned calls fell on Tuesday."],
    answerClass: "BOTH",
    explanation: ["Three hundred is greater than 240.", "Abandoned calls fell from 36 to 24."],
  },
  {
    id: "STC-V2-SC-016", qlId: "STC-QL-002", difficulty: "MEDIUM", surfaceArchetype: "EVENT_SEQUENCE",
    statement: "The answer key was released first, objections were invited for three days, and the result was prepared only after the objections received in time were examined.",
    conclusions: ["The result was prepared before the answer key was released.", "Objections were invited only after the result had been prepared."],
    answerClass: "NEITHER",
    explanation: ["The answer key is stated to have been released first.", "The sequence places objections before result preparation."],
  },
] as const;
