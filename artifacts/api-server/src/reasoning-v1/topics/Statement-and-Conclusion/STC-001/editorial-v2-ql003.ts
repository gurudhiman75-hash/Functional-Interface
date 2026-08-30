import type { StcV2EditorialAuthority } from "./editorial-v2-types.ts";

export const STC_V2_QL003_AUTHORITIES: readonly StcV2EditorialAuthority[] = [
  {
    id: "STC-V2-SC-017", qlId: "STC-QL-003", difficulty: "MEDIUM", surfaceArchetype: "RULE_ELIGIBILITY",
    statement: "A candidate is eligible for interview if the candidate has at least 60% marks and is below 28 years of age. Meera is 25 years old and has 67% marks.",
    conclusions: ["Meera satisfies the stated conditions for interview eligibility.", "Meera has been finally selected for the post."],
    answerClass: "ONLY_I",
    explanation: ["Meera meets both stated eligibility conditions.", "Interview eligibility does not establish final selection."],
  },
  {
    id: "STC-V2-SC-018", qlId: "STC-QL-003", difficulty: "MEDIUM", surfaceArchetype: "ONE_LINE_FACT",
    statement: "A performance bonus is payable only if the annual profit target is met. The company paid the performance bonus this year.",
    conclusions: ["The profit target need not have been met.", "The annual profit target was met."],
    answerClass: "ONLY_II",
    explanation: ["Payment under an only-if rule requires the stated condition.", "The payment therefore establishes the necessary profit-target condition."],
  },
  {
    id: "STC-V2-SC-019", qlId: "STC-QL-003", difficulty: "MEDIUM", surfaceArchetype: "PUBLIC_NOTICE",
    statement: "Notice: If the river level crosses the danger mark, Gate 3 will be closed to traffic. The river level crossed the danger mark at 6 p.m.",
    conclusions: ["The stated trigger for closing Gate 3 occurred.", "Under the notice, Gate 3 is to be closed to traffic."],
    answerClass: "BOTH",
    explanation: ["Crossing the danger mark is exactly the stated trigger.", "The notice maps that trigger to closure of Gate 3."],
  },
  {
    id: "STC-V2-SC-020", qlId: "STC-QL-003", difficulty: "HARD", surfaceArchetype: "ADVICE_WARNING",
    statement: "The safety instruction says: if the machine temperature exceeds 80°C, the alarm sounds. The recorded temperature was 75°C.",
    conclusions: ["The alarm therefore did not sound.", "The machine is therefore completely safe."],
    answerClass: "NEITHER",
    explanation: ["Failure to meet the stated sufficient condition does not prove the alarm stayed silent.", "Nothing in the rule establishes complete machine safety."],
  },
  {
    id: "STC-V2-SC-021", qlId: "STC-QL-003", difficulty: "HARD", surfaceArchetype: "QUOTED_CLAIM",
    statement: "The organiser said, \"We will move the programme indoors if rain begins before 5 p.m.\" Rain began at 4:30 p.m.",
    conclusions: ["The stated condition for moving the programme indoors was met.", "The programme was cancelled."],
    answerClass: "ONLY_I",
    explanation: ["Rain began before the specified time.", "The rule concerns moving indoors, not cancellation."],
  },
  {
    id: "STC-V2-SC-022", qlId: "STC-QL-003", difficulty: "MEDIUM", surfaceArchetype: "CONDITIONAL_TRIGGER",
    statement: "If server load crosses the safety limit, a backup server starts automatically. At noon the load crossed that limit while the automatic rule was active.",
    conclusions: ["The backup server did not start at noon.", "Under the stated rule, the backup server was triggered at noon."],
    answerClass: "ONLY_II",
    explanation: ["The conclusion contradicts the active rule and satisfied trigger.", "The load crossed the limit while the automatic rule was active."],
  },
  {
    id: "STC-V2-SC-023", qlId: "STC-QL-003", difficulty: "HARD", surfaceArchetype: "SURVEY_REPORT",
    statement: "Under the survey protocol, a response is included in the final dataset only if all mandatory fields are complete. Response X appears in the final dataset.",
    conclusions: ["Response X had all mandatory fields complete.", "Response X met the protocol's stated inclusion condition."],
    answerClass: "BOTH",
    explanation: ["Inclusion requires completion of all mandatory fields.", "Appearing in the final dataset establishes the stated necessary inclusion condition."],
  },
  {
    id: "STC-V2-SC-024", qlId: "STC-QL-003", difficulty: "HARD", surfaceArchetype: "CONTRAST_CONCESSION",
    statement: "Late applications are rejected unless the delay was caused by a documented portal outage. Application Z was submitted late; nothing else is stated about it.",
    conclusions: ["Application Z was accepted.", "Application Z was delayed by a documented portal outage."],
    answerClass: "NEITHER",
    explanation: ["Late submission alone does not establish acceptance.", "No cause of the delay is stated."],
  },
] as const;
